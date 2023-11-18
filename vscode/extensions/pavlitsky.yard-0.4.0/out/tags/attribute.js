"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const directive_1 = require("../entities/directive");
// @attribute documentation directive
class AttributeTag extends directive_1.Directive {
    constructor(params = {}) {
        super(params);
        const { tagName = "attribute", } = params;
        this.tagName = tagName;
    }
}
exports.AttributeTag = AttributeTag;
//# sourceMappingURL=attribute.js.map