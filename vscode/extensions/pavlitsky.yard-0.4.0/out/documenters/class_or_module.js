"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const snippet_builder_1 = require("../snippet_builder");
// Document class or module definition
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
    // Is this documenter active for supplied text
    isApplicable() {
        return this.parsedType !== "" && this.parsedName !== "";
    }
    // Build documentation snippet
    buildSnippet(eol) {
        this.sb = new snippet_builder_1.SnippetBuilder(eol);
        this.buildDescription();
        this.buildAuthor();
        return this.sb.build();
    }
    // Build description section
    buildDescription() {
        this.sb.spacer();
        this.sb.description();
        this.sb.spacer();
    }
    // Build @author tag
    buildAuthor() {
        this.sb.author();
        this.sb.spacer();
    }
}
exports.default = ClassOrModule;
//# sourceMappingURL=class_or_module.js.map