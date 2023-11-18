/*
 Copyright (c) 2021 Kai Wood <kwood@kwd.io>

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
*/
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
/**
 * Activate plugin commands
 */
function activate(context) {
    const enter = vscode.commands.registerCommand("endwise.enter", () => __awaiter(this, void 0, void 0, function* () {
        yield endwiseEnter();
    }));
    const cmdEnter = vscode.commands.registerCommand("endwise.cmdEnter", () => __awaiter(this, void 0, void 0, function* () {
        yield vscode.commands.executeCommand("cursorEnd");
        yield endwiseEnter(true);
    }));
    // We have to check "acceptSuggestionOnEnter" is set to a value !== "off" if the suggest widget is currently visible,
    // otherwise the suggestion won't be triggered because of the overloaded enter key.
    const checkForAcceptSelectedSuggestion = vscode.commands.registerCommand("endwise.checkForAcceptSelectedSuggestion", () => __awaiter(this, void 0, void 0, function* () {
        const config = vscode.workspace.getConfiguration();
        const suggestionOnEnter = config.get("editor.acceptSuggestionOnEnter");
        if (suggestionOnEnter !== "off") {
            yield vscode.commands.executeCommand("acceptSelectedSuggestion");
        }
        else {
            yield vscode.commands.executeCommand("endwise.enter");
        }
    }));
    context.subscriptions.push(enter);
    context.subscriptions.push(cmdEnter);
    context.subscriptions.push(checkForAcceptSelectedSuggestion);
}
exports.activate = activate;
/**
 * The plugin itself
 */
const OPENINGS_RUBY = [
    /^\s*?if(\s|\()/,
    /^\s*?unless(\s|\()/,
    /^\s*?while(\s|\()/,
    /^\s*?for(\s|\()/,
    /\s?do(\s?$|\s\|.*\|\s?$)/,
    /^\s*?def\s/,
    /^\s*?class\s/,
    /^\s*?module\s/,
    /^\s*?case(\s|\()/,
    /^\s*?begin\s/,
    /^\s*?until(\s|\()/,
];
const OPENINGS_CRYSTAL = [
    /^\s*?if(\s|\()/,
    /^\s*?unless(\s|\()/,
    /^\s*?while(\s|\()/,
    /^\s*?for(\s|\()/,
    /\s?do(\s?$|\s\|.*\|\s?$)/,
    /^\s*?enum\s/,
    /^\s*?struct\s/,
    /^\s*?macro\s/,
    /^\s*?union\s/,
    /^\s*?lib\s/,
    /^\s*?annotation\s/,
    /^\s*?def\s/,
    /^\s*?class\s/,
    /^\s*?module\s/,
    /^\s*?case(\s|\()/,
    /^\s*?begin\s/,
    /^\s*?until(\s|\()/,
];
const SINGLE_LINE_DEFINITION = /;\s*end[\s;]*$/;
const LINE_PARSE_LIMIT = 100000;
function endwiseEnter(calledWithModifier = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const editor = vscode.window.activeTextEditor;
        const lineNumber = editor.selection.active.line;
        const columnNumber = editor.selection.active.character;
        const lineText = editor.document.lineAt(lineNumber).text;
        const lineLength = lineText.length;
        let openings;
        switch (editor.document.languageId) {
            case "ruby":
                openings = OPENINGS_RUBY;
                break;
            case "crystal":
                openings = OPENINGS_CRYSTAL;
                break;
            default:
                openings = [];
                break;
        }
        if (shouldAddEnd(openings)) {
            yield linebreakWithClosing();
        }
        else {
            yield linebreak();
        }
        /**
         * Insert a line break, add the correct closing and correct cursor position
         */
        function linebreakWithClosing() {
            return __awaiter(this, void 0, void 0, function* () {
                yield editor.edit((textEditor) => {
                    textEditor.insert(new vscode.Position(lineNumber, lineLength), `\n${indentationFor(lineText)}end`);
                });
                yield vscode.commands.executeCommand("cursorUp");
                vscode.commands.executeCommand("editor.action.insertLineAfter");
            });
        }
        /**
         * Insert a linebreak, no closing, correct cursor position
         */
        function linebreak() {
            return __awaiter(this, void 0, void 0, function* () {
                // Insert \n
                yield vscode.commands.executeCommand("lineBreakInsert");
                // Move to the right to set the cursor to the next line
                yield vscode.commands.executeCommand("cursorRight");
                // Get current line
                let newLine = yield editor.document.lineAt(editor.selection.active.line)
                    .text;
                // If it's blank, don't do anything
                if (newLine.length === 0)
                    return;
                // On lines containing only whitespace, we need to move to the right
                // to have the cursor at the correct indentation level.
                // Otherwise, we set the cursor to the beginning of the first word.
                if (newLine.match(/^\s+$/)) {
                    yield vscode.commands.executeCommand("cursorEnd");
                }
                else {
                    yield vscode.commands.executeCommand("cursorWordEndRight");
                    yield vscode.commands.executeCommand("cursorHome");
                }
            });
        }
        /**
         * Check if a closing "end" should be set. Pretty much the meat of this plugin.
         */
        function shouldAddEnd(openings) {
            const currentIndentation = indentationFor(lineText);
            // Do not close if enter key is pressed in the middle of a line, *except* when a modifier key is used
            if (!calledWithModifier && lineText.length > columnNumber)
                return false;
            // Also, do not close on single line definitions
            if (lineText.match(SINGLE_LINE_DEFINITION))
                return false;
            for (let condition of openings) {
                if (!lineText.match(condition))
                    continue;
                let stackCount = 0;
                let documentLineCount = editor.document.lineCount;
                // Do not add "end" if code structure is already balanced
                for (let ln = lineNumber; ln <= lineNumber + LINE_PARSE_LIMIT; ln++) {
                    // Close if we are at the end of the document
                    if (documentLineCount <= ln + 1)
                        return true;
                    let line = editor.document.lineAt(ln + 1).text;
                    let lineStartsWithEnd = line.trim().startsWith("end");
                    // Always close the statement if there is another closing found on a smaller indentation level
                    if (currentIndentation > indentationFor(line) && lineStartsWithEnd) {
                        return true;
                    }
                    if (currentIndentation === indentationFor(line)) {
                        // If another opening is found, increment the stack counter
                        for (let innerCondition of openings) {
                            if (line.match(innerCondition)) {
                                stackCount += 1;
                                break;
                            }
                        }
                        if (lineStartsWithEnd && stackCount > 0) {
                            stackCount -= 1;
                            continue;
                        }
                        else if (lineStartsWithEnd) {
                            return false;
                        }
                    }
                }
            }
            return false;
        }
        /**
         * Helper to get indentation level of the previous line
         */
        function indentationFor(lineText) {
            const trimmedLine = lineText.trim();
            if (trimmedLine.length === 0)
                return lineText;
            const whitespaceEndsAt = lineText.indexOf(trimmedLine);
            const indentation = lineText.substr(0, whitespaceEndsAt);
            return indentation;
        }
    });
}
//# sourceMappingURL=extension.js.map