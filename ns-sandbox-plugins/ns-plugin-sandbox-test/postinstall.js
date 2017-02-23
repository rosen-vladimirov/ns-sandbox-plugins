"use strict";
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");

const findProjectDir = () => {
	let candidateDir = __dirname;

	while (true) {
		const oldCandidateDir = candidateDir;
		candidateDir = path.dirname(candidateDir);

		if (path.basename(candidateDir) === 'node_modules') {
			continue;
		}

		const packageJsonFile = path.join(candidateDir, 'package.json');

		if (fs.existsSync(packageJsonFile)) {
			return candidateDir;
		}

		if (oldCandidateDir === candidateDir) {
			return;
		}
	}
};

const ensureDirExists = (dir) => {
	if (!fs.existsSync(dir)) {
		mkdirp.sync(dir)
	}
};

const projectPath = findProjectDir();
const hooksDir = path.join(projectPath, "hooks");
const afterPrepareHooksDir = path.join(hooksDir, "after-prepare");

ensureDirExists(afterPrepareHooksDir);

const nsPluginWithHooksAfterPrepareFilePath = path.join(afterPrepareHooksDir, "ns-plugin-sandbox-test.js");
if (!fs.existsSync(nsPluginWithHooksAfterPrepareFilePath)) {
	fs.writeFileSync(nsPluginWithHooksAfterPrepareFilePath, 'module.exports = require("ns-plugin-sandbox-test")');
}
