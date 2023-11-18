"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const all_1 = require("./documenters/all");
// Get first suitable documenter for supplied text string
class DocumenterResolver {
    constructor(text) {
        this.text = text;
    }
    // Instantiate each documenter and check if it's ready to document the text
    resolve() {
        for (const documenter of all_1.default) {
            const d = new documenter(this.text);
            if (d.isApplicable()) {
                return d;
            }
        }
        return undefined;
    }
}
exports.default = DocumenterResolver;
//# sourceMappingURL=documenter_resolver.js.map