import * as vscode from 'vscode';
import * as cp from 'child_process';

export function exec(
	command: string,
	options: cp.ExecOptions
): Promise<{ stdout: string; stderr: string }> {
	return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
		cp.exec(command, options, (error, stdout, stderr) => {
			if (error) {
				reject({ error, stdout, stderr });
			}
			resolve({ stdout, stderr });
		});
	});
}

let _channel: vscode.OutputChannel;
export function getOutputChannel(): vscode.OutputChannel {
	if (!_channel) {
		_channel = vscode.window.createOutputChannel('Ruby');
		vscode.commands.registerCommand('ruby.showOutputChannel', () => {
			_channel.show();
		});
	}
	return _channel;
}

export async function loadEnv() {
	let { stdout, stderr } = await exec(process.env.SHELL + ' -lc export', {
		cwd: vscode.workspace.rootPath,
	});
	let envs = stdout.trim().split('\n');
	for (let i = 0; i < envs.length; i++) {
		let definition = envs[i];
		let result = definition.split('=', 2);
		let envKey = result[0];
		let envValue = result[1];
		if (['PATH', 'GEM_HOME', 'GEM_PATH', 'RUBY_VERSION'].indexOf(envKey) > -1) {
			if (!process.env[envKey]) {
				process.env[envKey] = envValue;
			}
		}
	}

	getOutputChannel().appendLine(stderr);
}
export async function checkVersion() {
	getOutputChannel().appendLine(process.env.SHELL);
	let { stdout, stderr } = await exec('ruby -v', { cwd: vscode.workspace.rootPath });

	getOutputChannel().appendLine(stdout);
	getOutputChannel().appendLine(stderr);
}
