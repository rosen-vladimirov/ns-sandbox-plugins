"use strict";

const path = require("path");
const fs = require("fs");
const childProcess = require("child_process");
const http = require("http");
const os = require("os")

module.exports = function ($platformsData, hookArgs) {

	let platformData = $platformsData.getPlatformData(hookArgs.platform);
	const appDestinationPath = path.join(platformData.appDestinationDirectoryPath, "app");

	const hooksFileName = "hooks.txt";
	const hooksFilePath = path.join(appDestinationPath, hooksFileName);

	const commandFilePath = path.join(__dirname, "commands.txt");
	const commands = fs.readFileSync(commandFilePath).toString().split('\n').map(line => line.trim().replace("${appDir}", appDestinationPath));

	commands.forEach(command => {
		fs.appendFileSync(hooksFilePath, `### Executing command ${command}${os.EOL}`);

		const listCommandOutput = childProcess.execSync(command).toString();
		fs.appendFileSync(hooksFilePath, listCommandOutput + os.EOL);

		fs.appendFileSync(hooksFilePath, `### Finished executing command ${command}${os.EOL}`);
	});

}
