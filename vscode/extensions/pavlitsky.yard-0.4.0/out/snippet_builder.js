"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
// Build documentation snippet
class SnippetBuilder {
    constructor(eol) {
        this.eol = eol;
        this.snippet = new vscode_1.SnippetString();
    }
    // Decorate each snippet line with a comment and return rebuilt snippet string
    build() {
        const lines = this.snippet.value.split(this.eol);
        lines.pop(); // Remove the newline of the snippet string itself
        const decoratedLines = lines
            .map((line) => "#" + (line ? " " + line : ""))
            .join(this.eol) + this.eol;
        return new vscode_1.SnippetString(decoratedLines);
    }
    // Append empty line
    spacer() {
        this.snippet.appendText(this.eol);
    }
    // Append description line
    // <Description>
    description() {
        this.snippet.appendPlaceholder("<Description>");
        this.snippet.appendText(this.eol);
    }
    // Tags builders
    // Append @param tag line
    // @param [<Type>] name <description>
    param(name, defaultValue) {
        this.snippet.appendText("@param [");
        this.snippet.appendPlaceholder("<Type>] ");
        this.snippet.appendText(name + " ");
        this.snippet.appendPlaceholder("<description>");
        this.snippet.appendText(this.eol);
    }
    // Append @return tag line
    // @return [<Type>] <description>
    return() {
        this.snippet.appendText("@return [");
        this.snippet.appendPlaceholder("<Type>");
        this.snippet.appendText("] ");
        this.snippet.appendPlaceholder("<description>");
        this.snippet.appendText(this.eol);
    }
    // Append @option tag line
    // @option name [<Type>] :<key> <description>
    option(name) {
        this.snippet.appendText("@option " + name + " [");
        this.snippet.appendPlaceholder("<Type>");
        this.snippet.appendText("] :");
        this.snippet.appendPlaceholder("<key>");
        this.snippet.appendText(" ");
        this.snippet.appendPlaceholder("<description>");
        this.snippet.appendText(this.eol);
    }
    // Append @author tag line
    // @author Name <<email>>
    author() {
        this.snippet.appendText("@author ");
        this.snippet.appendPlaceholder("<Name>");
        this.snippet.appendText(" <");
        this.snippet.appendPlaceholder("<email>");
        this.snippet.appendText(">");
        this.snippet.appendText(this.eol);
    }
}
exports.SnippetBuilder = SnippetBuilder;
//# sourceMappingURL=snippet_builder.js.map