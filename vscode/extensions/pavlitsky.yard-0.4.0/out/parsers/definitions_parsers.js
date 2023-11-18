"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attribute_1 = require("./definitions/attribute");
const class_or_module_1 = require("./definitions/class_or_module");
const constant_1 = require("./definitions/constant");
const method_1 = require("./definitions/method");
// All available definitions parsers.
// Definitions include class or module definition (class ...), method definition (def ...)
//   or constant definition (FOO=...).
exports.default = [
    attribute_1.default,
    method_1.default,
    class_or_module_1.default,
    constant_1.default,
];
//# sourceMappingURL=definitions_parsers.js.map