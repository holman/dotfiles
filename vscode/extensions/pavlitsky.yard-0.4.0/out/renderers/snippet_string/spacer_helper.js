"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const tag_1 = require("../../entities/tag");
// Helper class to manage empty lines of a snippet
class SpacerHelper {
    constructor(snippet, eol) {
        this.snippet = snippet;
        this.eol = eol;
        this.lastTag = undefined;
        this.isFirstTag = false;
        this.isFirstTagInGroup = false;
        this.isTag = false;
        this.isText = false;
        this.tagsCount = 0;
        this.isSingleEntity = false;
        this.isLastEntity = false;
        this.isSingleTag = false;
        this.config = vscode_1.workspace.getConfiguration("yard.spacers");
    }
    // Prepend empty line to an entity if needed
    beforeEntity(entity, entities, index) {
        this.updateContext(entity, entities, index);
        const beforeDescription = this.isText;
        const beforeTags = this.isFirstTag && !this.isSingleTag;
        const separateTags = !this.isFirstTag && this.isFirstTagInGroup && !this.isSingleEntity;
        const beforeSingleTag = this.isSingleTag;
        if ((beforeDescription && this.config.get("beforeDescription")) ||
            (beforeTags && this.config.get("beforeTags")) ||
            (separateTags && this.config.get("separateTags")) ||
            (beforeSingleTag && this.config.get("beforeSingleTag"))) {
            this.endOfLine();
        }
    }
    // Append empty line to an entity if needed
    afterEntity() {
        const afterDescription = this.isText;
        const afterTags = this.isTag && (!this.isSingleEntity && this.isLastEntity);
        const afterSingleTag = this.isSingleTag;
        if ((afterDescription && this.config.get("afterDescription")) ||
            (afterTags && this.config.get("afterTags")) ||
            (afterSingleTag && this.config.get("afterSingleTag"))) {
            this.endOfLine();
        }
    }
    // Append spaced string
    spacedText(text) {
        if (text) {
            this.snippet.appendText(" " + text);
        }
    }
    // Append empty line to a snippet
    endOfLine() {
        this.snippet.appendText(this.eol);
    }
    // Update context parameters for a current entity
    updateContext(entity, entities, index) {
        this.isTag = entity instanceof tag_1.Tag;
        this.isText = entity.type === "Text";
        this.isLastEntity = entities.length - 1 === index;
        this.isSingleEntity = entities.length === 1;
        if (this.isTag) {
            const tag = entity;
            if (this.lastTag) {
                this.isFirstTagInGroup = tag.tagName !== this.lastTag.tagName;
            }
            else {
                this.isFirstTagInGroup = true;
            }
            this.isFirstTag = this.tagsCount === 0;
            this.isSingleTag = this.isSingleEntity;
            this.tagsCount += 1;
            this.lastTag = entity;
        }
        else {
            this.isFirstTag = false;
            this.isFirstTagInGroup = false;
            this.isSingleTag = false;
            this.lastTag = undefined;
        }
    }
}
exports.SpacerHelper = SpacerHelper;
//# sourceMappingURL=spacer_helper.js.map