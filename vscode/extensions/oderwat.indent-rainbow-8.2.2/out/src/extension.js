"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when vs code is activated
function activate(context) {
    // Create a decorator types that we use to decorate indent levels
    let decorationTypes = [];
    let doIt = false;
    let clearMe = false;
    let currentLanguageId = null;
    let skipAllErrors = false;
    let activeEditor = vscode.window.activeTextEditor;
    // Error color gets shown when tabs aren't right,
    //  e.g. when you have your tabs set to 2 spaces but the indent is 3 spaces
    const error_color = vscode.workspace.getConfiguration('indentRainbow')['errorColor'] || "rgba(128,32,32,0.3)";
    const error_decoration_type = vscode.window.createTextEditorDecorationType({
        backgroundColor: error_color
    });
    const tabmix_color = vscode.workspace.getConfiguration('indentRainbow')['tabmixColor'] || "";
    const tabmix_decoration_type = "" !== tabmix_color ? vscode.window.createTextEditorDecorationType({
        backgroundColor: tabmix_color
    }) : null;
    const ignoreLinePatterns = vscode.workspace.getConfiguration('indentRainbow')['ignoreLinePatterns'] || [];
    const colorOnWhiteSpaceOnly = vscode.workspace.getConfiguration('indentRainbow')['colorOnWhiteSpaceOnly'] || false;
    // Colors will cycle through, and can be any size that you want
    const colors = vscode.workspace.getConfiguration('indentRainbow')['colors'] || [
        "rgba(255,255,64,0.07)",
        "rgba(127,255,127,0.07)",
        "rgba(255,127,255,0.07)",
        "rgba(79,236,236,0.07)"
    ];
    // Loops through colors and creates decoration types for each one
    colors.forEach((color, index) => {
        decorationTypes[index] = vscode.window.createTextEditorDecorationType({
            backgroundColor: color
        });
    });
    // loop through ignore regex strings and convert to valid RegEx's.
    ignoreLinePatterns.forEach((ignorePattern, index) => {
        if (typeof ignorePattern === 'string') {
            //parse the string for a regex
            var regParts = ignorePattern.match(/^\/(.*?)\/([gim]*)$/);
            if (regParts) {
                // the parsed pattern had delimiters and modifiers. handle them.
                ignoreLinePatterns[index] = new RegExp(regParts[1], regParts[2]);
            }
            else {
                // we got pattern string without delimiters
                ignoreLinePatterns[index] = new RegExp(ignorePattern);
            }
        }
    });
    if (activeEditor) {
        indentConfig();
    }
    if (activeEditor && checkLanguage()) {
        triggerUpdateDecorations();
    }
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            indentConfig();
        }
        if (editor && checkLanguage()) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor) {
            indentConfig();
        }
        if (activeEditor && event.document === activeEditor.document && checkLanguage()) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    function isEmptyObject(obj) {
        return Object.getOwnPropertyNames(obj).length === 0;
    }
    function indentConfig() {
        var skiplang = vscode.workspace.getConfiguration('indentRainbow')['ignoreErrorLanguages'] || [];
        skipAllErrors = false;
        if (skiplang.length !== 0) {
            if (skiplang.indexOf('*') !== -1 || skiplang.indexOf(currentLanguageId) !== -1) {
                skipAllErrors = true;
            }
        }
    }
    function checkLanguage() {
        if (activeEditor) {
            if (currentLanguageId !== activeEditor.document.languageId) {
                var inclang = vscode.workspace.getConfiguration('indentRainbow')['includedLanguages'] || [];
                var exclang = vscode.workspace.getConfiguration('indentRainbow')['excludedLanguages'] || [];
                currentLanguageId = activeEditor.document.languageId;
                doIt = true;
                if (inclang.length !== 0) {
                    if (inclang.indexOf(currentLanguageId) === -1) {
                        doIt = false;
                    }
                }
                if (doIt && exclang.length !== 0) {
                    if (exclang.indexOf(currentLanguageId) !== -1) {
                        doIt = false;
                    }
                }
            }
        }
        if (clearMe && !doIt) {
            // Clear decorations when language switches away
            var decor = [];
            for (let decorationType of decorationTypes) {
                activeEditor.setDecorations(decorationType, decor);
            }
            clearMe = false;
        }
        indentConfig();
        return doIt;
    }
    var timeout = null;
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
        }
        var updateDelay = vscode.workspace.getConfiguration('indentRainbow')['updateDelay'] || 100;
        timeout = setTimeout(updateDecorations, updateDelay);
    }
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        var regEx = /^[\t ]+/gm;
        var text = activeEditor.document.getText();
        var tabSizeRaw = activeEditor.options.tabSize;
        var tabSize = 4;
        if (tabSizeRaw !== 'auto') {
            tabSize = +tabSizeRaw;
        }
        var tabs = " ".repeat(tabSize);
        const ignoreLines = [];
        let error_decorator = [];
        let tabmix_decorator = tabmix_decoration_type ? [] : null;
        let decorators = [];
        decorationTypes.forEach(() => {
            let decorator = [];
            decorators.push(decorator);
        });
        var match;
        var ignore;
        if (!skipAllErrors) {
            /**
             * Checks text against ignore regex patterns from config(or default).
             * stores the line positions of those lines in the ignoreLines array.
             */
            ignoreLinePatterns.forEach(ignorePattern => {
                while (ignore = ignorePattern.exec(text)) {
                    const pos = activeEditor.document.positionAt(ignore.index);
                    const line = activeEditor.document.lineAt(pos).lineNumber;
                    ignoreLines.push(line);
                }
            });
        }
        var re = new RegExp("\t", "g");
        let defaultIndentCharRegExp = null;
        while (match = regEx.exec(text)) {
            const pos = activeEditor.document.positionAt(match.index);
            const line = activeEditor.document.lineAt(pos).lineNumber;
            let skip = skipAllErrors || ignoreLines.indexOf(line) !== -1; // true if the lineNumber is in ignoreLines.
            var thematch = match[0];
            var ma = (match[0].replace(re, tabs)).length;
            /**
             * Error handling.
             * When the indent spacing (as spaces) is not divisible by the tabsize,
             * consider the indent incorrect and mark it with the error decorator.
             * Checks for lines being ignored in ignoreLines array ( `skip` Boolran)
             * before considering the line an error.
             */
            if (!skip && ma % tabSize !== 0) {
                var startPos = activeEditor.document.positionAt(match.index);
                var endPos = activeEditor.document.positionAt(match.index + match[0].length);
                var decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: null };
                error_decorator.push(decoration);
            }
            else {
                var m = match[0];
                var l = m.length;
                var o = 0;
                var n = 0;
                while (n < l) {
                    const s = n;
                    var startPos = activeEditor.document.positionAt(match.index + n);
                    if (m[n] === "\t") {
                        n++;
                    }
                    else {
                        n += tabSize;
                    }
                    if (colorOnWhiteSpaceOnly && n > l) {
                        n = l;
                    }
                    var endPos = activeEditor.document.positionAt(match.index + n);
                    var decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: null };
                    var sc = 0;
                    var tc = 0;
                    if (!skip && tabmix_decorator) {
                        // counting (split is said to be faster than match()
                        // only do it if we don't already skip all errors
                        var tc = (thematch.split("\t").length - 1);
                        if (tc) {
                            // only do this if we already have some tabs
                            var sc = (thematch.split(" ").length - 1);
                        }
                        // if we have (only) "spaces" in a "tab" indent file we
                        // just ignore that, because we don't know if there
                        // should really be tabs or spaces for indentation
                        // If you (yes you!) know how to find this out without
                        // infering this from the file, speak up :)
                    }
                    if (sc > 0 && tc > 0) {
                        tabmix_decorator.push(decoration);
                    }
                    else {
                        let decorator_index = o % decorators.length;
                        decorators[decorator_index].push(decoration);
                    }
                    o++;
                }
            }
        }
        decorationTypes.forEach((decorationType, index) => {
            activeEditor.setDecorations(decorationType, decorators[index]);
        });
        activeEditor.setDecorations(error_decoration_type, error_decorator);
        tabmix_decoration_type && activeEditor.setDecorations(tabmix_decoration_type, tabmix_decorator);
        clearMe = true;
    }
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map