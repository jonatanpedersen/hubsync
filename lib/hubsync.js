const glob = require('glob');
const octokit = require('@octokit/rest')()
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const async = require('async');
const moment = require('moment');
const debug = require('debug')('hubsync');
const execAsync = promisify(exec);
const path = require('path');

module.exports = hubsync;

async function hubsync ({token, cwd, concurrency}) {
	octokit.authenticate({ type: 'token', token });

	const repos = await octokit.repos.getAll({per_page: 100}).then(getRemainingPages);

	repos.sort(compareRepoPushedAt);

	const dirs = glob.sync('*/*', {cwd});
	const repoNames = repos.map(repo => repo.full_name);

	const tasks = [
		...dirs
			.filter(dir => !repos.some(repo => repo.full_name === dir))
			.map(dir => async () => removeDir(dir, cwd)),
		...repos
			.filter(repo => {
				const fetchHeadTimeMs = getFetchHeadCTimeMs(repo, cwd);
				const pushedAt = Date.parse(repo.pushed_at);

				return fetchHeadTimeMs < pushedAt;
			})
			.map(repo => {
				if (dirs.includes(repo.full_name)) {
					return async () => pull(repo, cwd);
				} else {
					return async () => clone(repo, cwd);
				}
			})
	];

	async.mapLimit(tasks, concurrency, async (task) => {
		return await task();
	}, (err, results) => {
		if (err) {
			throw err;
		}
	});
}

async function getRemainingPages (response) {
	let result = response.data;

	while (octokit.hasNextPage(response)) {
		response = await octokit.getNextPage(response);
		result = [...result, ...response.data];
	}

	return result;
}

function getFetchHeadCTimeMs (repo, cwd) {
	try {
		return fs.statSync(path.join(cwd, repo.full_name, '.git', 'FETCH_HEAD')).ctimeMs;
	} catch (err) {
		return 0;
	}
}

async function clone (repo, cwd) {
	debug('Clone %s (pushed %s)', repo.full_name, moment(repo.pushed_at).fromNow());
	const command = `git clone git@github.com:${repo.full_name}.git ${repo.full_name}`;
	return execAsync(command, {cwd})
		.catch(err => {
			console.error('Error cloning %s: %s', repo.full_name, err.message);
		});
}

async function pull (repo, cwd) {
	debug('Pull %s (pushed %s)', repo.full_name, moment(repo.pushed_at).fromNow());

	const command = `git pull`;
	return execAsync(command, {cwd: path.join(cwd, repo.full_name)})
		.catch(err => {
			console.error('Error pulling %s: %s', repo.full_name, err.message);
		});
}

async function removeDir (dir, cwd) {
	debug('Removing dir %s', dir);
	const command = `rm -rf ${dir}`;
	return execAsync(command, {cwd});
}

function compareRepoPushedAt (repoA, repoB) {
	return Date.parse(repoB.pushed_at) - Date.parse(repoA.pushed_at);
}
