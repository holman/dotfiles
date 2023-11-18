"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const documenter_resolver_1 = require("./documenter_resolver");
// Generate YARD comment
class YardDocumenter {
    // Build and insert documentation snippet
    generate() {
        // Update current editor, line, cursor position
        this.updateContext();
        // Check if documenter should run
        if (!this.shouldRun()) {
            return;
        }
        // Resolve documenter by current line's content
        const documenter = (new documenter_resolver_1.default(this.lineText)).resolve();
        if (!documenter) {
            return;
        }
        // Insert documentation snippet
        return this.editor.insertSnippet(documenter.buildSnippet(this.eol), this.snippetPosition());
    }
    updateContext(textEditor) {
        this.editor = textEditor || vscode_1.window.activeTextEditor;
        if (this.editor) {
            this.position = this.editor.selection.active;
            this.line = this.editor.document.lineAt(this.position);
            this.lineText = this.line.text;
            this.eol = this.editor.document.eol === vscode_1.EndOfLine.LF ? "\n" : "\r\n";
        }
    }
    // Get position for a snippet
    snippetPosition() {
        return this.position.with({ character: this.line.firstNonWhitespaceCharacterIndex });
    }
    // Check if previous line already has some comment
    commentExists() {
        if (this.line.lineNumber === 0) {
            return false;
        }
        const prevLinePosition = this.position.with({ line: this.line.lineNumber - 1 });
        const prevLine = this.editor.document.lineAt(prevLinePosition);
        return prevLine.text.trim().startsWith("#");
    }
    // Is documenter should run
    shouldRun() {
        return this.editor &&
            this.editor.document.languageId === "ruby" &&
            !this.commentExists();
    }
}
exports.default = YardDocumenter;
//# sourceMappingURL=yard_generator.js.map