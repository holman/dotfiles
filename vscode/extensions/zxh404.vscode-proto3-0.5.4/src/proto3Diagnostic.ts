'use strict';

import vscode = require('vscode');
import path = require('path');
import { Proto3Compiler } from './proto3Compiler';

export class Proto3LanguageDiagnosticProvider {

    private errors = vscode.languages.createDiagnosticCollection("languageErrors");

    public createDiagnostics(doc: vscode.TextDocument, compiler: Proto3Compiler) {
        compiler.compileProtoToTmp(doc.fileName, stderr => {
            if (stderr) {
                this.analyzeErrors(stderr, doc);
            } else {
                this.errors.delete(doc.uri);
            }
        })
    }
    
    private analyzeErrors(stderr: string, doc: vscode.TextDocument) {
        let shortFileName = path.parse(doc.fileName).name;
        let diagnostics = stderr.split('\n')
            .filter(line => line.includes(shortFileName))
            .map(line => this.parseErrorLine(line, doc))
            .filter(diagnostic => diagnostic != null);

        this.errors.set(doc.uri, diagnostics);
    }

    private parseErrorLine(errline: string, doc: vscode.TextDocument): vscode.Diagnostic {
        let errorInfo = errline.match(/\w+\.proto:(\d+):(\d+):\s*(.*)/);
        if (!errorInfo) {
            return null;
        }
        let startLine = parseInt(errorInfo[1]) - 1;
        let startCol = parseInt(errorInfo[2]) - 1;
        
        // protoc calculates tab width (eight spaces) and returns colunm number.
        let line = doc.lineAt(startLine);
        let startChar = 0;
        let col = 0;
        for(var c of line.text) {
            col += ( c === "\t" ? (8 - col % 8): 1 );
            startChar += 1;
            if( col >= startCol ) {
                break;
            }
        }
        let endChar = line.text.length;
        let tokenEnd = line.text.substr(startChar).match(/[\s;{}\[\],<>()=]/);
        if (tokenEnd) {
            endChar = startChar + tokenEnd.index;
        }
        let range = new vscode.Range(startLine, startChar, startLine, endChar);
        let msg = errorInfo[3];
        return new vscode.Diagnostic(range, msg, vscode.DiagnosticSeverity.Error);
    }

}
