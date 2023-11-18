import * as vscode from 'vscode';
import * as path from 'path';
import { AutoCorrect } from './RuboCop';


export class RubyDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
	private autoCorrect: AutoCorrect;

	public register(ctx: vscode.ExtensionContext, documentSelector: vscode.DocumentSelector) {
		// only attempt to format if ruby.format is set to rubocop
		if (vscode.workspace.getConfiguration("ruby").get("format") !== "rubocop") {
			return;
		}

		this.autoCorrect = new AutoCorrect();
		this.autoCorrect.test().then(
			() => ctx.subscriptions.push(
				vscode.languages.registerDocumentFormattingEditProvider(documentSelector, this)
			)
					// silent failure - AutoCorrect will handle error messages
		);
	}

	public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Thenable<vscode.TextEdit[]> {
		const root = document.fileName ? path.dirname(document.fileName) : vscode.workspace.rootPath;
		const input = document.getText();
		return this.autoCorrect.correct(input, root)
			.then(
				result => {
					return [new vscode.TextEdit(document.validateRange(new vscode.Range(0, 0, Infinity, Infinity)), result)];
				},
				err => {
					// silent failure - AutoCorrect will handle error messages
					return [];
				}
			);
	}
}
