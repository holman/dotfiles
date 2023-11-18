"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Common Tag entity. Other tags may extend it with their details.
class Tag {
    constructor(params = {}) {
        const { tagName = "", name = "", text = "", type = "Tag", } = params;
        this.tagName = tagName;
        this.name = name;
        this.text = text;
        this.type = type;
    }
}
exports.Tag = Tag;
//# sourceMappingURL=tag.js.map