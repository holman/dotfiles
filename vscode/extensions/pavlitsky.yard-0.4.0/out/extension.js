"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const yard_documenter_1 = require("./yard_documenter");
// This method is called when extension is activated
function activate(context) {
    const yard = new yard_documenter_1.default();
    const command = vscode_1.commands.registerCommand("extension.generateYard", () => {
        return yard.generate();
    });
    context.subscriptions.push(command);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map