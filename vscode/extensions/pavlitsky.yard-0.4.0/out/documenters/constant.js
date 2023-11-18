"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const snippet_builder_1 = require("../snippet_builder");
// Document a constant
class Constant {
    constructor(text) {
        // Regexp to extract constant name
        this.regExp = /([A-Z_]+)\s*=(.*)/;
        // Constant name
        this.parsedName = "";
        const match = this.regExp.exec(text);
        if (match) {
            const [, name] = match;
            this.parsedName = name;
        }
    }
    // Is this documenter active for supplied text
    isApplicable() {
        return this.parsedName !== "";
    }
    // Build documentation snippet
    buildSnippet(eol) {
        this.sb = new snippet_builder_1.SnippetBuilder(eol);
        this.sb.return();
        return this.sb.build();
    }
}
exports.default = Constant;
//# sourceMappingURL=constant.js.map