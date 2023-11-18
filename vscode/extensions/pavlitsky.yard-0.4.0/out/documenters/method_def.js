"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const snippet_builder_1 = require("../snippet_builder");
// Document instance and class methods
class Method {
    constructor(text) {
        // Regexp to extract method's name, its scope and params
        this.regExp = /(def)\s+(self)?\.?(\w+)?(\(.*\))?/;
        // Method name
        this.parsedName = "";
        // Method params string with parenthesis
        this.parsedParams = "";
        const match = this.regExp.exec(text);
        if (match) {
            const [, , scope, name, params] = match;
            this.parsedName = name;
            this.parsedParams = params;
        }
    }
    // Is this documenter active for supplied text
    isApplicable() {
        return this.parsedName !== "";
    }
    // Build documentation snippet
    buildSnippet(eol) {
        this.sb = new snippet_builder_1.SnippetBuilder(eol);
        this.buildDescription();
        this.buildParams();
        this.buildReturn();
        return this.sb.build();
    }
    // Build description section
    buildDescription() {
        this.sb.spacer();
        this.sb.description();
        this.sb.spacer();
    }
    // Build params section
    buildParams() {
        const params = this.params(this.parsedParams);
        if (params.length === 0) {
            return;
        }
        params.forEach((param) => {
            this.sb.param(param.name, param.defaultValue);
            if (param.defaultValue === "{}") {
                this.buildOptionsHash(param.name);
            }
        });
        this.sb.spacer();
    }
    // Build return section
    buildReturn() {
        if (this.parsedName === "initializer") {
            return;
        }
        this.sb.return();
        this.sb.spacer();
    }
    // Build options hash section
    buildOptionsHash(name, count = 3) {
        Array.from(Array(count), (_, i) => this.sb.option(name));
    }
    // Fetch parameters array from parsed string
    params(paramsString) {
        if (!paramsString) {
            return [];
        }
        const clearedParams = paramsString.replace(/\(|\)|\s/g, "");
        if (clearedParams === "") {
            return [];
        }
        return clearedParams.split(",").map((param) => {
            const [, name, defaultValue] = /^([^=:]*)[:=]?(.*)$/.exec(param);
            return { name, defaultValue };
        });
    }
}
exports.default = Method;
//# sourceMappingURL=method_def.js.map