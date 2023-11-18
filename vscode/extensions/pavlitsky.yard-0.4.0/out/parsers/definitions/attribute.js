"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const return_1 = require("../../tags/return");
// Parse a constant definition into documentation entities
class Attribute {
    constructor(text) {
        // Regexp to extract attribute accessor and name
        // See https://docs.ruby-lang.org/en/trunk/syntax/assignment_rdoc.html#label-Local+Variable+Names
        // tslint:disable:max-line-length
        this.regExp = new RegExp([
            /^\s*/,
            /(?:(?:(?:attr|mattr|cattr)_(reader|writer|accessor))|(?:class_attribute))/,
            /\s+/,
            /:([a-z][a-zA-Z0-9_]*).*/,
        ].map((r) => r.source).join(""));
        // tslint:enable:max-line-length
        // Attribute name
        this.parsedName = "";
        // Attribute accessor
        this.parsedAccessor = "";
        const match = this.regExp.exec(text);
        if (match) {
            const [, accessor, name] = match;
            this.parsedName = name;
            this.parsedAccessor = accessor;
        }
    }
    // Is this parser ready to process the text
    isApplicable() {
        return this.parsedName !== "" && this.parsedAccessor !== "";
    }
    // Parse documentation tree
    parse() {
        return [new return_1.ReturnTag()];
    }
}
exports.default = Attribute;
//# sourceMappingURL=attribute.js.map