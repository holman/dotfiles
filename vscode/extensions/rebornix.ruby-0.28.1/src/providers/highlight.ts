import * as vscode from 'vscode';
import { DocumentSelector, ExtensionContext } from 'vscode';

export function registerHighlightProvider(ctx: ExtensionContext, documentSelector: DocumentSelector) {
	// highlight provider
	let pairedEnds = [];

	const getEnd = function (line) {
		//end must be on a line by itself, or followed directly by a dot
		let match = line.text.match(/^(\s*)end\b[\.\s#]?\s*$/);
		if (match) {
			return new vscode.Range(line.lineNumber, match[1].length, line.lineNumber, match[1].length + 3);
		}
	}

	const getEntry = function(line) {
		let match = line.text.match(/^(.*\b)(begin|class|def|for|if|module|unless|until|case|while)\b[^;]*$/);
		if (match) {
			return new vscode.Range(line.lineNumber, match[1].length, line.lineNumber, match[1].length + match[2].length);
		} else {
			//check for do
			match = line.text.match(/\b(do)\b\s*(\|.*\|[^;]*)?$/);
			if (match) {
				return new vscode.Range(line.lineNumber, match.index, line.lineNumber, match.index + 2);
			}
		}
	}

	const balancePairs = function (doc) {
		pairedEnds = [];
		if (doc.languageId !== 'ruby') return;

		let waitingEntries = [];
		let entry, end;
		for (let i = 0; i < doc.lineCount; i++) {
			if ((entry = getEntry(doc.lineAt(i)))) {
				waitingEntries.push(entry);
			} else if (waitingEntries.length && (end = getEnd(doc.lineAt(i)))) {
				pairedEnds.push({
					entry: waitingEntries.pop(),
					end: end
				});
			}
		}
	}

	const balanceEvent = function (event) {
		if (event && event.document) balancePairs(event.document);
	}

	ctx.subscriptions.push(vscode.languages.registerDocumentHighlightProvider(documentSelector, {
		provideDocumentHighlights: (doc, pos) => {
			let result = pairedEnds.find(pair => (
				pair.entry.start.line === pos.line ||
				pair.end.start.line === pos.line));
			if (result) {
				return [new vscode.DocumentHighlight(result.entry, 2), new vscode.DocumentHighlight(result.end, 2)];
			}
		}
	}));

	ctx.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(balanceEvent));
	ctx.subscriptions.push(vscode.workspace.onDidChangeTextDocument(balanceEvent));
	ctx.subscriptions.push(vscode.workspace.onDidOpenTextDocument(balancePairs));
	if (vscode.window && vscode.window.activeTextEditor) {
		balancePairs(vscode.window.activeTextEditor.document);
	}
}
