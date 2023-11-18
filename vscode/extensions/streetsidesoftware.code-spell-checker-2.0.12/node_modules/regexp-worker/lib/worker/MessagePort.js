"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullPort = void 0;
exports.nullPort = Object.freeze({
    postMessage() { },
    on() {
        return exports.nullPort;
    },
    off() {
        return exports.nullPort;
    },
});
//# sourceMappingURL=MessagePort.js.map