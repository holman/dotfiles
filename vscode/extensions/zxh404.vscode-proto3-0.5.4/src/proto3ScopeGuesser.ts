'use strict';

import vscode = require('vscode');


const MSG_BEGIN = /\s*message\s+(\w*)\s*\{.*/;
const ENUM_BEGIN = /\s*enum\s+(\w*)\s*\{.*/;
const SERVICE_BEGIN = /\s*service\s+(\w*)\s*\{.*/;
const SCOPE_END = /\s*\}.*/;


export function guessScope(doc: vscode.TextDocument,
                           cursorLineNum: number): Proto3Scope {
    return new ScopeGuesser(cursorLineNum).guess(doc);
}


export enum Proto3ScopeKind {
    Comment,
    Proto,
    Message,
    Enum,
    Service,
}


export class Proto3Scope {

    syntax: number; // 2 or 3
    kind: Proto3ScopeKind;
    parent: Proto3Scope;
    children: Proto3Scope[];
    lineFrom: number;
    lineTo: number;

    constructor(kind: Proto3ScopeKind, lineFrom: number) {
        this.kind = kind;
        this.children = [];
        this.lineFrom = lineFrom;
    }

    addChild(child: Proto3Scope) {
        this.children.push(child);
        child.parent = this;
    }

}


class ScopeGuesser {

    private currentScope: Proto3Scope;
    private scopeAtCursor: Proto3Scope;
    private cursorLineNum: number;
    private syntax: number = 2;

    constructor(cursorLineNum: number) {
        this.cursorLineNum = cursorLineNum;
    }

    guess(doc: vscode.TextDocument): Proto3Scope {
        this.enterScope(Proto3ScopeKind.Proto, 0);
        for (var i = 0; i < doc.lineCount; i++) {
            var line = doc.lineAt(i);
            if (!line.isEmptyOrWhitespace) {
                let lineText = line.text;
                if (this.currentScope.kind == Proto3ScopeKind.Comment) {
                    if (lineText.match(/.*\*\/\s*$/)) {
                        this.exitScope(i); // exit block comment
                    }
                } else if (lineText.match(/^\s*\/\*.*/)) {
                    this.enterScope(Proto3ScopeKind.Comment, i); // enter block comment
                } else if (lineText.match(/^\s*\/\//)) {
                    continue; // skip line comments
                } else if (lineText.match(/^\s*syntax\s*=\s*"proto3"\s*;/)) {
                    this.syntax = 3;
                } else if (lineText.match(MSG_BEGIN)) {
                    this.enterScope(Proto3ScopeKind.Message, i);
                } else if (lineText.match(ENUM_BEGIN)) {
                    this.enterScope(Proto3ScopeKind.Enum, i);
                } else if (lineText.match(SERVICE_BEGIN)) {
                    this.enterScope(Proto3ScopeKind.Service, i);
                } else if (lineText.match(SCOPE_END)) {
                    this.exitScope(i);
                }
            }
        }
        this.exitScope(doc.lineCount);
        this.scopeAtCursor.syntax = this.syntax;
        return this.scopeAtCursor;
    }

    private enterScope(kind: Proto3ScopeKind, lineNum: number) {
        let newScope = new Proto3Scope(kind, lineNum);
        if (this.currentScope) {
            this.currentScope.addChild(newScope);
        }
        this.currentScope = newScope;
    }

    private exitScope(lineNum: number) {
        this.currentScope.lineTo = lineNum;
        if (!this.scopeAtCursor) {
            if (this.currentScope.lineFrom <= this.cursorLineNum
                    && this.currentScope.lineTo >= this.cursorLineNum) {
                this.scopeAtCursor = this.currentScope;
            }
        }
        if (this.currentScope.parent) {
            this.currentScope = this.currentScope.parent;
        }
    }
    
}
