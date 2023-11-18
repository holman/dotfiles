/**
 * vscode-ruby main
 */
import { ExtensionContext, languages, workspace } from 'vscode';
import * as utils from './utils';

import languageConfiguration from './languageConfiguration';
import { registerCompletionProvider } from './providers/completion';
import { registerConfigurationProvider } from './providers/configuration';
import { registerFormatter } from './providers/formatter';
import { registerHighlightProvider } from './providers/highlight';
import { registerIntellisenseProvider } from './providers/intellisense';
import { registerLinters } from './providers/linters';
import { registerTaskProvider } from './task/rake';
import * as client from './client';

const DOCUMENT_SELECTOR: { language: string; scheme: string }[] = [
	{ language: 'ruby', scheme: 'file' },
	{ language: 'ruby', scheme: 'untitled' },
];

export async function activate(context: ExtensionContext): Promise<void> {
	// register language config
	languages.setLanguageConfiguration('ruby', languageConfiguration);
	utils.getOutputChannel();

	if (workspace.getConfiguration('ruby').useLanguageServer) {
		client.activate(context);
	} else {
		// Register legacy providers
		registerHighlightProvider(context, DOCUMENT_SELECTOR);
		registerFormatter(context, DOCUMENT_SELECTOR);

		if (workspace.rootPath) {
			registerLinters(context);
		}
	}

	// Register providers
	registerIntellisenseProvider(context);
	registerCompletionProvider(context, DOCUMENT_SELECTOR);
	registerConfigurationProvider();

	if (workspace.rootPath) {
		registerTaskProvider(context);
	}

	utils.loadEnv();
}

export function deactivate(): void {
	if (workspace.getConfiguration('ruby').useLanguageServer) {
		client.deactivate();
	}

	return undefined;
}
