"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("./tag");
// Author entity. Extends Tag with name and email.
class Author extends tag_1.Tag {
    constructor(params = {}) {
        super(params);
        const { tagName = "author", authorName = "", authorEmail = "", type = "Author", } = params;
        this.tagName = tagName;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.type = type;
    }
}
exports.Author = Author;
//# sourceMappingURL=author.js.map