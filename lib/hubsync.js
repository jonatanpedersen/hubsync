const glob = require('glob');
const octokit = require('@octokit/rest')()
const { exec } = require('child_process');
const { promisify } = require('util');
const async = require('async');

const execAsync = promisify(exec);

module.exports = hubsync;

async function hubsync ({token, dir}) {
	octokit.authenticate({ type: 'token', token });

	const repos = await octokit.repos.getAll({per_page: 100}).then(getRemainingPages);

	const directories = glob.sync('*/*', {cwd: dir});
	const repoNames = repos.map(repo => repo.full_name);

	const addeddRepos = repoNames.filter(repo => !directories.includes(repo));
	const existingRepos = repoNames.filter(repo => directories.includes(repo));
	const removedRepos = directories.filter(repo => !repoNames.includes(repo));

	const tasks = [
		...addeddRepos.map(repo => async () => clone(repo, dir)),
		...existingRepos.map(repo => async () => pull(repo, dir)),
		...removedRepos.map(repo => async () => remove(repo, dir))
	];

	async.mapLimit(tasks, 5, async (task) => {
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

async function clone (repo, cwd) {
	console.log('clone', repo);
	return execAsync(`git clone git@github.com:${repo}.git ${repo}`, {cwd});
}

async function pull (repo, cwd) {
	console.log('pull', repo);
	return execAsync(`git --git-dir ${repo}/.git pull`, {cwd});
}

async function remove (repo, cwd) {
	console.log('remove', repo);
	return execAsync(`rm -rf ${repo}`, {cwd});
}