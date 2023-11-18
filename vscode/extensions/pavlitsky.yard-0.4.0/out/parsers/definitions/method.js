"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const description_1 = require("../../tags/description");
const option_1 = require("../../tags/option");
const param_1 = require("../../tags/param");
const return_1 = require("../../tags/return");
// Parse a class or an instance method definition into documentation entities
class MethodDef {
    constructor(text) {
        // Regexp to extract method's name, its scope and params
        // See https://docs.ruby-lang.org/en/trunk/syntax/methods_rdoc.html#label-Method+Names
        // tslint:disable:max-line-length
        this.regExp = new RegExp([
            /(?:def)\s+/,
            /(?:self)?\.?/,
            /([a-zA-Z_\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf][a-zA-Z_0-9\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]+[!?=]?|\+|-|\*|\*\*|\/|%|&|\^|>>|<<|==|!=|===|=~|!~|<=>|<|<=|>|>=|\[\]=|\[\]|\+@|-@|!@|~@)?/,
            /(\(.*\)|[^;].*)?/,
        ].map((r) => r.source).join(""));
        // tslint:enable:max-line-length
        // Method name
        this.parsedName = "";
        // Method params string with parenthesis
        this.parsedParams = "";
        const match = this.regExp.exec(text);
        if (match) {
            const [, name, params] = match;
            this.parsedName = name;
            this.parsedParams = params;
        }
    }
    // Is this parser ready to process the text
    isApplicable() {
        return this.parsedName !== "";
    }
    // Parse documentation tree
    parse() {
        return []
            .concat(this.buildDescription())
            .concat(this.buildParams())
            .concat(this.buildReturn())
            .filter((element) => element !== undefined);
    }
    // Build description section
    buildDescription() {
        return new description_1.DescriptionTag();
    }
    // Build params section
    buildParams() {
        if (!this.parsedParams) {
            return [];
        }
        const clearedParams = this.parsedParams.replace(/\(|\)|\s/g, "");
        if (clearedParams === "") {
            return [];
        }
        return clearedParams.split(",").map((param) => {
            const [, name, defaultValue] = /^([^=:]*)[:=]?(.*)$/.exec(param);
            let options = [];
            if (defaultValue === "{}") {
                options = this.seedOptions(name);
            }
            return new param_1.ParamTag({ name, defaultValue, options });
        });
    }
    // Build return section
    buildReturn() {
        if (this.parsedName === "initialize") {
            return;
        }
        return new return_1.ReturnTag();
    }
    // Build options hash section
    seedOptions(paramName, count = 3) {
        const options = [];
        Array.from(Array(count), (_, i) => options.push(new option_1.OptionTag({ paramName, defaultValue: undefined })));
        return options;
    }
}
exports.default = MethodDef;
//# sourceMappingURL=method.js.map