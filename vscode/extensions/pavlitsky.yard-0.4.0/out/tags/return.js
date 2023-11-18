"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_with_types_1 = require("../entities/tag_with_types");
// @return documentation tag
class ReturnTag extends tag_with_types_1.TagWithTypes {
    constructor(params = {}) {
        super(params);
        const { tagName = "return", } = params;
        this.tagName = tagName;
    }
}
exports.ReturnTag = ReturnTag;
//# sourceMappingURL=return.js.map