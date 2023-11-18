import * as vscode from 'vscode';

export function registerConfigurationProvider(): void {
	vscode.debug.registerDebugConfigurationProvider('Ruby', new RubyConfigurationProvider());
}

class RubyConfigurationProvider implements vscode.DebugConfigurationProvider {
	public provideDebugConfigurations(
		folder: vscode.WorkspaceFolder,
		token: vscode.CancellationToken
	): Thenable<vscode.DebugConfiguration[]> {
		const names: string[] = rubyConfigurations.map(
			(config: vscode.DebugConfiguration) => config.name
		);

		return vscode.window.showQuickPick(names).then((selected: string) => {
			return [
				rubyConfigurations.find((config: vscode.DebugConfiguration) => config.name === selected),
			];
		});
	}

	public resolveDebugConfiguration?(
		folder: vscode.WorkspaceFolder | undefined,
		debugConfiguration: vscode.DebugConfiguration
	): vscode.ProviderResult<vscode.DebugConfiguration> {
		const cwd: string = debugConfiguration.cwd || '${workspaceRoot}';

		return { ...debugConfiguration, cwd };
	}
}

const rubyConfigurations: vscode.DebugConfiguration[] = [
	{
		name: 'Debug Local File',
		type: 'Ruby',
		request: 'launch',
		program: '${workspaceRoot}/main.rb',
	},
	{
		name: 'Listen for rdebug-ide',
		type: 'Ruby',
		request: 'attach',
		remoteHost: '127.0.0.1',
		remotePort: '1234',
		remoteWorkspaceRoot: '${workspaceRoot}',
	},
	{
		name: 'Rails server',
		type: 'Ruby',
		request: 'launch',
		program: '${workspaceRoot}/bin/rails',
		args: ['server'],
	},
	{
		name: 'Minitest - current line',
		type: 'Ruby',
		cwd: '${workspaceRoot}',
		request: 'launch',
		program: '${workspaceRoot}/bin/rails',
		args: [
			'test',
			'${file}:${lineNumber}'
		]
	},
	{
		name: 'RSpec - all',
		type: 'Ruby',
		request: 'launch',
		program: '${workspaceRoot}/bin/rspec',
		args: ['-I', '${workspaceRoot}'],
	},
	{
		name: 'RSpec - active spec file only',
		type: 'Ruby',
		request: 'launch',
		program: '${workspaceRoot}/bin/rspec',
		args: ['-I', '${workspaceRoot}', '${file}'],
	},
	{
		name: 'Cucumber',
		type: 'Ruby',
		request: 'launch',
		program: '${workspaceRoot}/bin/cucumber',
	},
];
