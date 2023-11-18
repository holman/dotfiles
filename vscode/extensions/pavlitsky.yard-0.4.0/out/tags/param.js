"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_with_options_1 = require("../entities/tag_with_options");
// @param documentation tag
class ParamTag extends tag_with_options_1.TagWithOptions {
    constructor(params = {}) {
        super(params);
        const { tagName = "param", } = params;
        this.tagName = tagName;
    }
}
exports.ParamTag = ParamTag;
//# sourceMappingURL=param.js.map