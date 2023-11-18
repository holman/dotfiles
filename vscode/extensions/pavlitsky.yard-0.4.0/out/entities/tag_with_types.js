"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("./tag");
// Tag extended with its types list
class TagWithTypes extends tag_1.Tag {
    constructor(params = {}) {
        super(params);
        const { types = "", defaultValue = "", type = "TagWithTypes", } = params;
        this.types = types;
        this.defaultValue = defaultValue;
        this.type = type;
    }
}
exports.TagWithTypes = TagWithTypes;
//# sourceMappingURL=tag_with_types.js.map