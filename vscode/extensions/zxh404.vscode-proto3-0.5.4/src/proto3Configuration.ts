'use strict';

import vscode = require('vscode');
import path = require('path');
import fs = require('fs');
import os = require('os');

export class Proto3Configuration {

    private readonly _configSection: string = 'protoc';
    private _config: vscode.WorkspaceConfiguration;
    private _configResolver: ConfigurationResolver;

    public static Instance(workspaceFolder?: vscode.WorkspaceFolder): Proto3Configuration {
        return new Proto3Configuration(workspaceFolder);
    }

    private constructor(workspaceFolder?: vscode.WorkspaceFolder) {
        this._config = vscode.workspace.getConfiguration(this._configSection, workspaceFolder);
        this._configResolver = new ConfigurationResolver(workspaceFolder);
    }

    public getProtocPath(protocInPath: boolean): string {
        let protoc = protocInPath ? 'protoc' : '?';
        return this._configResolver.resolve(
            this._config.get<string>('path', protoc));
    }

    public getProtoSourcePath(): string {
        let activeEditor = vscode.window.activeTextEditor;
        let activeEditorUri = activeEditor.document.uri;
        let activeWorkspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditorUri);
        return this._configResolver.resolve(
            this._config.get<string>('compile_all_path', activeWorkspaceFolder.uri.path));
    }

    public getProtocArgs(): string[] {
        return this._configResolver.resolve(
            this._config.get<string[]>('options', []));
    }

    public getProtocArgFiles(): string[] {
        return this.getProtocArgs().filter(arg => !arg.startsWith('-'));
    }

    public getProtocOptions(): string[] {
        return this.getProtocArgs().filter(arg => arg.startsWith('-'));
    }

    public getProtoPathOptions(): string[] {
        return this.getProtocOptions()
            .filter(opt => opt.startsWith('--proto_path') || opt.startsWith('-I'));
    }

    public getAllProtoPaths(): string[] {
        return this.getProtocArgFiles().concat(ProtoFinder.fromDir(this.getProtoSourcePath()));
    }

    public getTmpJavaOutOption(): string {
        return '--java_out=' + os.tmpdir();
    }

    public compileOnSave(): boolean {
        return this._config.get<boolean>('compile_on_save', false);
    }

}

class ProtoFinder {
    static fromDir(root: string): string[] {
        let search = function(dir: string): string[] {
            let files = fs.readdirSync(dir);

            let protos = files.filter(file => file.endsWith('.proto'))
                          .map(file => path.join(path.relative(root, dir), file));

            files.map(file => path.join(dir, file))
                .filter(file => fs.statSync(file).isDirectory())
                .forEach(subDir => {
                    protos = protos.concat(search(subDir))
                });

            return protos;
        }
        return search(root);
    }
}

// Workaround to substitute variable keywords in the configuration value until
// workbench/services/configurationResolver is available on Extention API.
//
//
// Some codes are copied from:
// src/vs/workbench/services/configurationResolver/node/configurationResolverService.ts
class ConfigurationResolver {

    constructor(private readonly workspaceFolder?: vscode.WorkspaceFolder) {
        Object.keys(process.env).forEach(key => {
			this[`env.${key}`] = process.env[key];
		});
    }

	public resolve(value: string): string;
	public resolve(value: string[]): string[];
    public resolve(value: any): any {
        if (typeof value === 'string') {
            return this.resolveString(value);
        } else if (this.isArray(value)) {
            return this.resolveArray(value);
        }
        return value;
    }

    private isArray(array: any): array is any[] {
        if (Array.isArray) {
            return Array.isArray(array);
        }

        if (array && typeof (array.length) === 'number' && array.constructor === Array) {
            return true;
        }

        return false;
    }

    private resolveArray(value: string[]): string[] {
		return value.map(s => this.resolveString(s));
	}

    private resolveString(value: string): string {
		let regexp = /\$\{(.*?)\}/g;
		const originalValue = value;
		const resolvedString = value.replace(regexp, (match: string, name: string) => {
			let newValue = (<any>this)[name];
			if (typeof newValue === 'string') {
				return newValue;
			} else {
				return match && match.indexOf('env.') > 0 ? '' : match;
			}
		});

		return this.resolveConfigVariable(resolvedString, originalValue);
	}

    private resolveConfigVariable(value: string, originalValue: string): string {
		let regexp = /\$\{config\.(.+?)\}/g;
		return value.replace(regexp, (match: string, name: string) => {
			let config = vscode.workspace.getConfiguration(undefined, this.workspaceFolder);
			let newValue: any;
			try {
				const keys: string[] = name.split('.');
				if (!keys || keys.length <= 0) {
					return '';
				}
				while (keys.length > 1) {
					const key = keys.shift();
					if (!config || !config.hasOwnProperty(key)) {
						return '';
					}
					config = config[key];
				}
				newValue = config && config.hasOwnProperty(keys[0]) ? config[keys[0]] : '';
			} catch (e) {
				return '';
			}
			if (typeof newValue === 'string') {
				// Prevent infinite recursion and also support nested references (or tokens)
				return newValue === originalValue ? '' : this.resolveString(newValue);
			} else {
				return this.resolve(newValue) + '';
			}
		});
	}

    private get workspaceRoot(): string {
		return vscode.workspace.rootPath;
    }
}