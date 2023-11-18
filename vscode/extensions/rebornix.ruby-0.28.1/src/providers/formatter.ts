import { DocumentSelector, ExtensionContext } from 'vscode';
import { RubyDocumentFormattingEditProvider } from '../format/rubyFormat';

export function registerFormatter(ctx: ExtensionContext, documentSelector: DocumentSelector) {
	new RubyDocumentFormattingEditProvider().register(ctx, documentSelector);
}
