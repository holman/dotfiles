"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const spacer_helper_1 = require("./snippet_string/spacer_helper");
// Render documentation tree into a snippet
class Renderer {
    constructor(entities, eol) {
        this.entities = entities;
        this.eol = eol;
        this.config = vscode_1.workspace.getConfiguration("yard.tags");
    }
    // Render entities and return documentation snippet
    render() {
        this.snippet = new vscode_1.SnippetString();
        this.spacer = new spacer_helper_1.SpacerHelper(this.snippet, this.eol);
        this.entities.forEach((entity, index, entities) => {
            if (!this.shouldRenderEntity(entity)) {
                return;
            }
            this.spacer.beforeEntity(entity, entities, index);
            this.renderEntity(entity);
            this.spacer.afterEntity();
        });
        return this.decorateSnippet();
    }
    // Is entity should be rendered
    shouldRenderEntity(entity) {
        if (entity.type === "Author" && !this.config.get("author")) {
            return false;
        }
        return true;
    }
    // Render a single entity depending of its type
    renderEntity(entity) {
        switch (entity.type) {
            case ("Directive"):
                this.directiveEntity(entity);
                break;
            case ("Author"):
                this.authorEntity(entity);
                break;
            case ("TagOption"):
                this.tagOptionEntity(entity);
                break;
            case ("TagWithOptions"):
                this.tagWithOptionsEntity(entity);
                break;
            case ("TagWithTypes"):
                this.tagWithTypesEntity(entity);
                break;
            case ("Text"):
                this.textEntity(entity);
                break;
        }
    }
    // Render a directive
    // @!attribute [r] foo_bar
    //   @return [<Type>] <description>
    directiveEntity(entity) {
        this.snippet.appendText("@!" + entity.tagName);
        if (entity.tagTypes) {
            this.typesList(entity.tagTypes);
        }
        this.spacer.spacedText(entity.name);
        this.spacer.endOfLine();
        entity.entities.forEach((e) => {
            this.snippet.appendText("  "); // nested entities get two spaces identation
            this.renderEntity(e);
        });
    }
    // Render an @author tag line
    // @author Name <<email>>
    authorEntity(entity) {
        this.snippet.appendText("@author ");
        this.textOrPlaceholder(entity.authorName, "<Name>");
        this.snippet.appendText(" <");
        this.textOrPlaceholder(entity.authorEmail, "<email>");
        this.snippet.appendText(">");
        this.spacer.endOfLine();
    }
    // Render an @option tag line
    // @option paramName [types] :<key> <description>
    tagOptionEntity(entity) {
        this.snippet.appendText("@option " + entity.paramName);
        this.typesList(entity.types);
        this.snippet.appendText(" :");
        this.textOrPlaceholder(entity.key, "<key>");
        this.snippet.appendText(" ");
        this.textOrPlaceholder(entity.text, "<description>");
        this.spacer.endOfLine();
    }
    // Render a tag with a types and options line
    // @tagName [types] name <description>
    // @option paramName [types] :<key> <description>
    tagWithOptionsEntity(entity) {
        this.tagWithTypesEntity(entity);
        entity.options.forEach((option) => { this.tagOptionEntity(option); });
    }
    // Render a tag with a types line
    // @tagName [types] name <description>
    tagWithTypesEntity(entity) {
        this.snippet.appendText("@" + entity.tagName);
        if (this.config.get("paramNameBeforeType")) {
            this.spacer.spacedText(entity.name);
            this.typesList(entity.types);
        }
        else {
            this.typesList(entity.types);
            this.spacer.spacedText(entity.name);
        }
        this.snippet.appendText(" ");
        this.textOrPlaceholder(entity.text, "<description>");
        this.spacer.endOfLine();
    }
    // Render a descriptive text line
    // <Description>
    textEntity(entity) {
        this.textOrPlaceholder(entity.text, "<Description>");
        this.spacer.endOfLine();
    }
    // Render a text or a placeholder if text is empty
    textOrPlaceholder(text, placeholder) {
        if (text) {
            this.snippet.appendText(text);
        }
        else {
            this.snippet.appendPlaceholder(placeholder);
        }
    }
    // Render entity types list
    // [types]
    typesList(types) {
        this.snippet.appendText(" [");
        this.textOrPlaceholder(types, "<Type>");
        this.snippet.appendText("]");
    }
    // Decorate the snippet and return a rebuilt one.
    // Snippet is prepended with a comment symbol, also consecutive empty lines are stripped.
    decorateSnippet() {
        let lines = this.snippet.value.split(this.eol);
        lines = lines.filter((element, position, array) => {
            return (position === 0 || element !== array[position - 1]) && position < array.length - 1;
        });
        const decoratedLines = lines
            .map((line) => "#" + (line ? " " + line : ""))
            .join(this.eol) + this.eol;
        return new vscode_1.SnippetString(decoratedLines);
    }
}
exports.Renderer = Renderer;
//# sourceMappingURL=snippet_string.js.map