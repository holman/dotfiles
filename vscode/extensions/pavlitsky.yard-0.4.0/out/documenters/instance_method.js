'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const snippet_builder_1 = require("../snippet_builder");
// Document instance and class methods
class InstanceMethod {
    constructor(text) {
        // Regexp to extract method name, its scope and params
        this.regExp = /(def)\s+(self)?\.?(\w+)?(\(.*\))?/;
        // Method name
        this.parsedName = '';
        // Method params string with parenthesis
        this.parsedParams = '';
        let match = this.regExp.exec(text);
        if (match) {
            let [, , scope, name, params] = match;
            this.parsedName = name;
            this.parsedParams = params;
        }
    }
    // Is this documenter active for supplied line
    isApplicable() {
        return this.parsedName != '';
    }
    // Build method documentation
    buildSnippet(eol) {
        this.sb = new snippet_builder_1.SnippetBuilder(eol);
        this.buildDescription();
        this.buildParams();
        this.buildReturn();
        return this.sb.build();
    }
    buildDescription() {
        this.sb.spacer();
        this.sb.description();
        this.sb.spacer();
    }
    buildParams() {
        let params = this.params(this.parsedParams);
        if (params.length == 0) {
            return;
        }
        params.forEach((param) => {
            this.sb.param(param.name, param.defaultValue);
            // TODO: Support non-empty options hash
            if (param.defaultValue == '{}') {
                this.buildOptionsHash(param.name);
            }
        });
        this.sb.spacer();
    }
    buildReturn() {
        if (this.parsedName != 'initializer') {
            this.sb.return();
            this.sb.spacer();
        }
    }
    buildOptionsHash(name, count = 3) {
        Array.from(Array(count), (_, i) => this.sb.option(name));
    }
    // Build method parameters.
    // TODO: Make a better support for array splat and keyword args splat
    // @see https://github.com/lsegal/yard/issues/439#issuecomment-3292412
    params(paramsString) {
        if (!paramsString)
            return [];
        let clearedParams = paramsString.replace(/\(|\)|\s/g, '');
        if (clearedParams == '')
            return [];
        return clearedParams.split(',').map((param) => {
            let paramParts = /^([^=:]*)[:=]?(.*)$/.exec(param);
            let paramName = paramParts[1];
            let paramDefault = paramParts[2];
            return { name: paramName, defaultValue: paramDefault };
        });
    }
}
exports.default = InstanceMethod;
//# sourceMappingURL=instance_method.js.map