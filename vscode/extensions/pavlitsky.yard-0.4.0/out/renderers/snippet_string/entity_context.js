"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("../../entities/tag");
class EntityContext {
    constructor() {
        this.lastTag = undefined;
        this.isFirstTag = false;
        this.isFirstTagInGroup = false;
        this.isTag = false;
        this.isText = false;
        this.tagsCount = 0;
    }
    update(entity) {
        this.isTag = entity instanceof tag_1.Tag;
        if (this.isTag) {
            const tag = entity;
            if (this.lastTag) {
                this.isFirstTagInGroup = tag.tagName !== this.lastTag.tagName;
            }
            else {
                this.isFirstTagInGroup = true;
            }
            this.tagsCount += 1;
            this.isFirstTag = !this.lastTag;
            this.lastTag = entity;
        }
        else {
            this.isFirstTag = false;
            this.isFirstTagInGroup = false;
            this.lastTag = undefined;
        }
        this.isText = entity.type === "Text";
    }
}
exports.EntityContext = EntityContext;
//# sourceMappingURL=entity_context.js.map