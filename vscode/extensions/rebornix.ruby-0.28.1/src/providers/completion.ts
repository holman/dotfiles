import * as vscode from 'vscode';
import { DocumentSelector, ExtensionContext } from 'vscode';
import * as cp from 'child_process';

export function registerCompletionProvider(ctx: ExtensionContext, documentSelector: DocumentSelector) {
	if (vscode.workspace.getConfiguration('ruby').codeCompletion == 'rcodetools') {
		const completeCommand = function (args) {
			let rctCompletePath = vscode.workspace.getConfiguration('ruby.rctComplete').get('commandPath', 'rct-complete');
			args.push('--interpreter');
			args.push(vscode.workspace.getConfiguration('ruby.interpreter').get('commandPath', 'ruby'));
			if (process.platform === 'win32')
				return cp.spawn('cmd', ['/c', rctCompletePath].concat(args));
			return cp.spawn(rctCompletePath, args);
		}

		const completeTest = completeCommand(['--help']);
		completeTest.on('exit', () => {
			ctx.subscriptions.push(
				vscode.languages.registerCompletionItemProvider(
					/** selector */documentSelector,
					/** provider */{
						provideCompletionItems: (document, position, token, context): Thenable<vscode.CompletionItem[] | vscode.CompletionList> => {
							return new Promise((resolve, reject) => {
								const line = position.line + 1;
								const column = position.character;
								let child = completeCommand([
									'--completion-class-info',
									'--dev',
									'--fork',
									'--line=' + line,
									'--column=' + column
								]);
								let outbuf = [],
									errbuf = [];
								child.stderr.on('data', (data) => errbuf.push(data));
								child.stdout.on('data', (data) => outbuf.push(data));
								child.stdout.on('end', () => {
									if (errbuf.length > 0) return reject(Buffer.concat(errbuf).toString());
									let completionItems = [];
									Buffer.concat(outbuf).toString().split('\n').forEach(function (elem) {
										let items = elem.split('\t');
										if (/^[^\w]/.test(items[0])) return;
										if (items[0].trim().length === 0) return;
										let completionItem = new vscode.CompletionItem(items[0]);
										completionItem.detail = items[1];
										completionItem.documentation = items[1];
										completionItem.filterText = items[0];
										completionItem.insertText = items[0];
										completionItem.label = items[0];
										completionItem.kind = vscode.CompletionItemKind.Method;
										completionItems.push(completionItem);
									}, this);
									if (completionItems.length === 0)
										return reject({items: []});
									return resolve({items: completionItems});
								});
								child.stdin.end(document.getText());
							});
						}
					},
					/** triggerCharacters */ ...['.']
				)
			)
		});
		completeTest.on('error', () => 0);
	}
}