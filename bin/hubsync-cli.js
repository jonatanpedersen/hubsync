#! /usr/bin/env node
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const hubsync = require('../');

const optionDefinitions = [
	{ name: 'token', alias: 't', type: String, defaultValue: process.env.HUBSYNC_TOKEN, description: 'A personal access token for GitHub.' },
	{ name: 'dir', alias: 'd', type: String, defaultValue: process.cwd(), description: 'Working directory' },
	{ name: 'help', alias: 'h', type: Boolean, description: 'Print this usage guide.' }
];

const sections = [
	{
		header: 'hubsync',
		content: 'Syncronize with GitHub.'
	},
	{
		header: 'Options',
		optionList: optionDefinitions
	},
	{
		content: 'GitHub: [underline]{https://github.com/jonatanpedersen/hubsync}'
	}
];

let options;
let error;

try {
	options = commandLineArgs(optionDefinitions);
} catch (err) {
	console.error(err.message);
	error = true;
	options = {
		help: true
	};
}

if (options.help) {
	const usage = commandLineUsage(sections);
	console.info(usage);
	process.exit(error ? 1 : 0);
}

process.once('SIGINT', () => process.exit(0));

hubsync(options)
	.catch(error => {
		console.error(error.message);
		process.exit(error ? 1 : 0);
	});
