'use strict';
const vscode = require('vscode');

const severities = {
	refactor: vscode.DiagnosticSeverity.Hint,
	convention: vscode.DiagnosticSeverity.Information,
	info: vscode.DiagnosticSeverity.Information,
	warning: vscode.DiagnosticSeverity.Warning,
	error: vscode.DiagnosticSeverity.Error,
	fatal: vscode.DiagnosticSeverity.Error
};

export default class LintResults {
	constructor(linter) {
		this._fileDiagnostics = vscode.languages.createDiagnosticCollection(linter);
	}
	updateForFile(uri, lint) {
		this._fileDiagnostics.delete(uri);
		if (lint.error) {
			console.log("Linter error:", lint.source, lint.error);
			return;
		}
		if ((!lint.result || !lint.result.length) && (!lint.lintError || !lint.lintError.length)) return;

		let allOf = lint.result.concat(lint.lintError).map(offense => {
			let tail = offense.location.column + offense.location.length;
			let d = new vscode.Diagnostic(new vscode.Range(
					offense.location.line - 1, offense.location.column - 1,
					offense.location.line - 1, tail - 1),
				offense.message, severities[offense.severity] || vscode.DiagnosticSeverity.Error);
			d.source = offense.cop_name || lint.linter;
			return d;
		});
		this._fileDiagnostics.set(uri, allOf);
	}
	dispose() {
		this._fileDiagnostics.dispose();
	}
}