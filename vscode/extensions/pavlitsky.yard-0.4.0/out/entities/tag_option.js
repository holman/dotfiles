"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// A single option. Used for a options hash parameters.
class TagOption {
    constructor(params = {}) {
        const { paramName = "", key = "", types = "", defaultValue = "", text = "", type = "TagOption", } = params;
        this.paramName = paramName;
        this.key = key;
        this.types = types;
        this.defaultValue = defaultValue;
        this.text = text;
    }
}
exports.TagOption = TagOption;
//# sourceMappingURL=tag_option.js.map