"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_with_types_1 = require("./tag_with_types");
// Tag extended with options hash.
class TagWithOptions extends tag_with_types_1.TagWithTypes {
    constructor(params = {}) {
        super(params);
        const { options = [], type = "TagWithOptions", } = params;
        this.options = options;
        this.type = type;
    }
}
exports.TagWithOptions = TagWithOptions;
//# sourceMappingURL=tag_with_options.js.map