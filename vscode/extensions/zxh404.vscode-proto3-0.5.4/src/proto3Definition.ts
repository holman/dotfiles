'use strict';

import fs = require('fs');
import path = require('path');
import vscode = require('vscode');
import fg = require('fast-glob');
import { guessScope, Proto3ScopeKind } from './proto3ScopeGuesser';
import { Proto3Import } from './proto3Import';
import { Proto3Primitive } from './proto3Primitive';


export class Proto3DefinitionProvider implements vscode.DefinitionProvider {

    public async provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Definition> {

        const scope = guessScope(document, position.line);
        if (scope.kind === Proto3ScopeKind.Comment) {
            return;
        }

        const targetRange = document.getWordRangeAtPosition(position) as vscode.Range;
        const targetDefinition = document.getText(targetRange);

        if (Proto3Primitive.isTypePrimitive(targetDefinition)) {
            return;
        }

        const lineText = document.lineAt(position).text;

        const importRegExp = new RegExp(`^\\s*import\\s+(\'|")((\\w+\/)*${targetDefinition})(\'|")\\s*;.*$`, 'i');
        const matchedGroups = importRegExp.exec(lineText)
        if (matchedGroups && matchedGroups.length == 5) {
            const importFilePath = matchedGroups[2]
            const location = this.findImportDefinition(importFilePath);
            if (location) {
                return location;
            }
            vscode.window.showErrorMessage(`Could not find ${targetDefinition} definition.`)
        }
        const messageOrEnumPattern = `\\s*(\\w+\\.)*\\w+\\s*`
        const messageFieldPattern = `\\s+\\w+\\s*=\\s*\\d+;.*`
        const rpcReqOrRspPattern = `\\s*\\(\\s*(stream\\s+)?${messageOrEnumPattern}\\s*\\)\\s*`

        const messageRegExp = new RegExp(`^\\s*(repeated){0,1}(${messageOrEnumPattern})${messageFieldPattern}$`, 'i')
        const messageInMap = new RegExp(`^\\s*map\\s*<${messageOrEnumPattern},${messageOrEnumPattern}>${messageFieldPattern}$`, 'i');
        const messageInRpcRegExp = new RegExp(`^\\s*rpc\\s*\\w+${rpcReqOrRspPattern}returns${rpcReqOrRspPattern}[;{].*$`, 'i');

        if (messageRegExp.test(lineText) || messageInRpcRegExp.test(lineText) || messageInMap.test(lineText)) {
            const location = this.findEnumOrMessageDefinition(document, targetDefinition);
            if (location) {
                return location;
            }
            vscode.window.showErrorMessage(`Could not find ${targetDefinition} definition.`)
        }

        return undefined;
    }

    private async findEnumOrMessageDefinition(document: vscode.TextDocument, target: string): Promise<vscode.Location> {

        const searchPaths = Proto3Import.getImportedFilePathsOnDocument(document);

        const files = [
            document.uri.fsPath,
            ...(await fg.async(searchPaths))
        ];

        for (const file of files) {
            const data = fs.readFileSync(file.toString());
            const lines = data.toString().split('\n');
            for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                const line = lines[lineIndex];
                const messageDefinitionRegexMatch = new RegExp(`\\s*(message|enum)\\s*${target}\\s*{`).exec(line);
                if (messageDefinitionRegexMatch && messageDefinitionRegexMatch.length) {
                    const uri = vscode.Uri.file(file.toString());
                    const range = this.getTargetLocationInline(lineIndex, line, target, messageDefinitionRegexMatch)
                    return new vscode.Location(uri, range);
                }
            }
        }
    }

    private async findImportDefinition(importFileName: string): Promise<vscode.Location> {
        const files = await fg.async(path.join(vscode.workspace.rootPath, '**', importFileName));
        const importPath = files[0].toString();
        // const data = fs.readFileSync(importPath);
        // const lines = data.toString().split('\n');
        // const lastLine = lines[lines.length  - 1];
        const uri = vscode.Uri.file(importPath);
        const definitionStartPosition = new vscode.Position(0, 0);
        const definitionEndPosition = new vscode.Position(0, 0);
        const range = new vscode.Range(definitionStartPosition, definitionEndPosition);
        return new vscode.Location(uri, range);
    }

    private getTargetLocationInline(lineIndex: number, line: string, target: string, definitionRegexMatch: RegExpExecArray): vscode.Range {
        const matchedStr = definitionRegexMatch[0];
        const index = line.indexOf(matchedStr) + matchedStr.indexOf(target);
        const definitionStartPosition = new vscode.Position(lineIndex, index);
        const definitionEndPosition = new vscode.Position(lineIndex, index + target.length);
        return new vscode.Range(definitionStartPosition, definitionEndPosition);
    }
}

