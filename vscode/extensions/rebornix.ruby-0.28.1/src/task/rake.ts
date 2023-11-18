'use strict';

import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { getOutputChannel, exec } from '../utils';

let rakeFiles: Set<vscode.Uri> = new Set<vscode.Uri>();

export async function registerTaskProvider(ctx: vscode.ExtensionContext) {
	let rakePromise: Thenable<vscode.Task[]> | undefined = undefined;
	let files = await vscode.workspace.findFiles("**/[rR]akefile{*,.rb}");
	for (let i = 0; i < files.length; i++) {
		rakeFiles.add(files[i]);
	}

	let fileWatcher = vscode.workspace.createFileSystemWatcher("**/[rR]akefile{*,.rb}");
	fileWatcher.onDidChange(() => rakePromise = undefined);
	fileWatcher.onDidCreate((uri) => {
		rakeFiles.add(uri);
		rakePromise = undefined
	});
	fileWatcher.onDidDelete((uri) => {
		rakeFiles.delete(uri);
		rakePromise = undefined
	});

	let taskProvider = vscode.workspace.registerTaskProvider('rake', {
		provideTasks: () => {
			if (!rakePromise) {
				rakePromise = getRakeTasks();
			}
			return rakePromise;
		},
		resolveTask(_task: vscode.Task): vscode.Task | undefined {
			return undefined;
		}
	});
}

function exists(file: string): Promise<boolean> {
	return new Promise<boolean>((resolve, _reject) => {
		fs.exists(file, (value) => {
			resolve(value);
		});
	});
}

interface RakeTaskDefinition extends vscode.TaskDefinition {
	task: string;
	file?: string;
}

const buildNames: string[] = ['build', 'compile', 'watch'];
function isBuildTask(name: string): boolean {
	for (let buildName of buildNames) {
		if (name.indexOf(buildName) !== -1) {
			return true;
		}
	}
	return false;
}

const testNames: string[] = ['test'];
function isTestTask(name: string): boolean {
	for (let testName of testNames) {
		if (name.indexOf(testName) !== -1) {
			return true;
		}
	}
	return false;
}

async function getRakeTasks(): Promise<vscode.Task[]> {
	let workspaceRoot = vscode.workspace.rootPath;
	let emptyTasks: vscode.Task[] = [];
	if (!workspaceRoot) {
		return emptyTasks;
	}

	if (rakeFiles.size < 1) {
		return emptyTasks;
	}

	for (let key in rakeFiles.keys) {
		if (!await exists(rakeFiles[key])) {
			return emptyTasks;
		}
	}

	let commandLine = 'rake -AT';
	try {
		let { stdout, stderr } = await exec(commandLine, { cwd: workspaceRoot });
		if (stderr && stderr.length > 0) {
			getOutputChannel().appendLine(stderr);
		}
		let result: vscode.Task[] = [];
		if (stdout) {
			let lines = stdout.split(/\r{0,1}\n/);
			for (let line of lines) {
				if (line.length === 0) {
					continue;
				}
				let regExp = /rake\s(.*)#/;
				let matches = regExp.exec(line);
				if (matches && matches.length === 2) {
					let taskName = matches[1].trim();
					let kind: RakeTaskDefinition = {
						type: 'rake',
						task: taskName
					};
					let task = new vscode.Task(kind, taskName, 'rake', new vscode.ShellExecution(`rake ${taskName}`));
					result.push(task);
					let lowerCaseLine = line.toLowerCase();
					if (isBuildTask(lowerCaseLine)) {
						task.group = vscode.TaskGroup.Build;
					} else if (isTestTask(lowerCaseLine)) {
						task.group = vscode.TaskGroup.Test;
					}
				}
			}
		}
		return result;
	} catch (err) {
		let channel = getOutputChannel();
		if (err.stderr) {
			channel.appendLine(err.stderr);
		}
		if (err.stdout) {
			channel.appendLine(err.stdout);
		}
		channel.appendLine('Auto detecting rake tasks failed.');
		channel.show(true);
		return emptyTasks;
	}
}