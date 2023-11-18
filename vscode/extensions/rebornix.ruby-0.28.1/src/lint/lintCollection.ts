'use strict';

import { Config } from './lintConfig';
import Linter from './lib/linter';
import LintResults from './lib/lintResults';

export class LintCollection {
	private _results: any;
	private _docLinters: any;
	private _cfg: { [key: string]: Config };
	private _rootPath: string;
	private _globalConfig: Config;

	constructor(globalConfig : Config, lintConfig : { [key: string]: Config }, rootPath) {
		this._results = {};
		this._docLinters = {};
		this._globalConfig = globalConfig;
		this._cfg = {};
		this.cfg(lintConfig, globalConfig);
		this._rootPath = rootPath;
	}

	public run(doc) {
		if (!doc) return;
		if (doc.languageId !== 'ruby') return;
		if (!this._docLinters[doc.fileName] || this._docLinters[doc.fileName].doc != doc)
			this._docLinters[doc.fileName] = new Linter(
				doc,
				this._rootPath,
				this._update.bind(this, doc)
			);
		this._docLinters[doc.fileName].run(this._cfg);
	}

	public _update(doc, result) {
		const linter = result.linter;
		if (!this._results[linter]) this._results[linter] = new LintResults(linter);
		this._results[linter].updateForFile(doc.uri, result);
		return Promise.resolve();
	}

	public cfg(newConfig, globalConfig) {
		let activeLinters = Object.keys(this._cfg);
		let toRemove = activeLinters.filter(l => !(l in newConfig) || !newConfig[l]);
		toRemove.forEach(l => {
			if (this._results[l]) {
				this._results[l].dispose();
				delete this._results[l];
			}
			delete this._cfg[l];
		});
		// we change the config internally, so that the config of any (awaiting) linters will be updated by reference
		for (let l in newConfig) {
			if (newConfig[l]) this._cfg[l] = Object.assign({}, newConfig[l], globalConfig);
		}
	}

	public dispose() {
		for (let l in this._results) this._results[l].dispose();
	}
}
