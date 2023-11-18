import * as vscode from 'vscode';
import { ExtensionContext } from 'vscode';
import debounce from 'lodash/debounce';

import { LintCollection } from '../lint/lintCollection';
import { Config as LintConfig } from '../lint/lintConfig';

function getGlobalLintConfig() : LintConfig {
	let globalConfig = new LintConfig();

	let pathToRuby = vscode.workspace.getConfiguration("ruby.interpreter").commandPath;
	if (pathToRuby) {
		globalConfig.pathToRuby = pathToRuby;
	}

	let useBundler = vscode.workspace.getConfiguration("ruby").get<boolean | null>("useBundler");
	if (useBundler !== null) {
		globalConfig.useBundler = useBundler;
	}

	let pathToBundler = vscode.workspace.getConfiguration("ruby").pathToBundler;
	if (pathToBundler) {
		globalConfig.pathToBundler = pathToBundler;
	}
	return globalConfig;
}

export function registerLinters(ctx: ExtensionContext) {
	const globalConfig = getGlobalLintConfig();
	const linters = new LintCollection(globalConfig, vscode.workspace.getConfiguration("ruby").lint, vscode.workspace.rootPath);
	ctx.subscriptions.push(linters);

	function executeLinting(e: vscode.TextEditor | vscode.TextDocumentChangeEvent) {
		if (!e) return;
		linters.run(e.document);
	}

	// Debounce linting to prevent running on every keypress, only run when typing has stopped
	const lintDebounceTime = vscode.workspace.getConfiguration('ruby').lintDebounceTime;
	const executeDebouncedLinting = debounce(executeLinting, lintDebounceTime);

	ctx.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(executeLinting));
	ctx.subscriptions.push(vscode.workspace.onDidChangeTextDocument(executeDebouncedLinting));
	ctx.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
		const docs = vscode.window.visibleTextEditors.map(editor => editor.document);
		console.log("Config changed. Should lint:", docs.length);
		const globalConfig = getGlobalLintConfig();
		linters.cfg(vscode.workspace.getConfiguration("ruby").lint, globalConfig);
		docs.forEach(doc => linters.run(doc));
	}));

	// run against all of the current open files
	vscode.window.visibleTextEditors.forEach(executeLinting);
}