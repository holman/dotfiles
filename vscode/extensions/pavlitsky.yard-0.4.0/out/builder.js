"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolver_1 = require("./parsers/resolver");
const snippet_string_1 = require("./renderers/snippet_string");
// Build documentation snippet
class Builder {
    constructor(text, eol) {
        this.text = text;
        this.eol = eol;
    }
    // Build and return documentation snippet
    build() {
        const parser = (new resolver_1.ParserResolver(this.text)).resolve();
        if (!parser) {
            return;
        }
        const renderer = new snippet_string_1.Renderer(parser.parse(), this.eol);
        return renderer.render();
    }
}
exports.Builder = Builder;
//# sourceMappingURL=builder.js.map