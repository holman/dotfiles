"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const return_1 = require("../../tags/return");
// Parse a constant definition into documentation entities
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
    // Is this parser ready to process the text
    isApplicable() {
        return this.parsedName !== "";
    }
    // Parse documentation tree
    parse() {
        return [new return_1.ReturnTag()];
    }
}
exports.default = Constant;
//# sourceMappingURL=constant.js.map