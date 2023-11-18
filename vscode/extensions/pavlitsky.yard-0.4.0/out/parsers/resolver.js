"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_parsers_1 = require("./definitions_parsers");
// Get first suitable parser for a supplied definition line
class ParserResolver {
    constructor(line) {
        this.line = line;
    }
    // Instantiate each parser and check if it's ready to parse the definition line
    resolve() {
        for (const parser of definitions_parsers_1.default) {
            const p = new parser(this.line);
            if (p.isApplicable()) {
                return p;
            }
        }
        return undefined;
    }
}
exports.ParserResolver = ParserResolver;
//# sourceMappingURL=resolver.js.map