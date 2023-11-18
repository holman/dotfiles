'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class Base {
    constructor(text) {
        this.regExp = /base/;
        // this.match = this.regExp.exec(text)
    }
    // public isApplicable(): boolean {
    //   return this.match != null
    // }
    placeholder(name) {
        return `\${${this.placeholderIndex += 1}:${'<' + name + '>'}}`;
    }
}
exports.default = Base;
//# sourceMappingURL=base.js.map