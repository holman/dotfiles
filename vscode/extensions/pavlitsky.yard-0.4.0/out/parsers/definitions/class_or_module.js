"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const author_1 = require("../../tags/author");
const description_1 = require("../../tags/description");
// Parse class or module definition into documentation entities
class ClassOrModule {
    constructor(text) {
        // Regexp to extract class/module type and its name
        this.regExp = /(class|module)\s+([\w:])?/;
        // Class/module name and type
        this.parsedType = "";
        this.parsedName = "";
        const match = this.regExp.exec(text);
        if (match) {
            const [, type, name] = match;
            this.parsedType = type;
            this.parsedName = name;
        }
    }
    // Is this parser ready to process the text
    isApplicable() {
        return this.parsedType !== "" && this.parsedName !== "";
    }
    // Parse documentation tree
    parse() {
        return [
            new description_1.DescriptionTag(),
            new author_1.AuthorTag(),
        ];
    }
}
exports.default = ClassOrModule;
//# sourceMappingURL=class_or_module.js.map