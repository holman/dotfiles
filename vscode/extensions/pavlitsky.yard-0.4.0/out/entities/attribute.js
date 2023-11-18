"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("./tag");
// Attribute directive. Extends Tag with accessor and return tag.
class Attribute extends tag_1.Tag {
    constructor(params = {}) {
        super(params);
        const { tagType = "", entities = [], } = params;
        this.tagType = tagType;
        this.entities = entities;
    }
}
exports.Attribute = Attribute;
//# sourceMappingURL=attribute.js.map