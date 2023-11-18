"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
// Render YARD tags, directives to a snippet
class TagsRenderer {
    constructor(eol) {
        this.eol = eol;
        this.snippet = new vscode_1.SnippetString();
    }
    renderSnippet() {
        return this.snippet;
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
    // Append @param tag line
    // @param [<Type>] name <description>
    param(tag) {
        this.snippet.appendText("@param [");
        this.snippet.appendPlaceholder("<Type>] ");
        this.snippet.appendText(tag.name + " ");
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
    option(tag) {
        this.snippet.appendText("@option " + tag.name + " [");
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
exports.TagsRenderer = TagsRenderer;
//# sourceMappingURL=tags_renderer.js.map