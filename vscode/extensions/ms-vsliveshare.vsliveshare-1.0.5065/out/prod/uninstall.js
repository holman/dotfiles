"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const vscode_command_framework_1 = require("@vs/vscode-command-framework");
const path = require("path");
const os = require("os");
const mkdirp_1 = require("mkdirp");
const dateformat = require("dateformat");
// Can't use the logger code since this is run as a straight node script where things like
// the vscode are not avaialbe. Approximate it directly.
let logFd = null;
async function initLog() {
    const logPath = path.join(os.tmpdir(), 'VSFeedbackVSRTCLogs');
    if (!await vscode_command_framework_1.fileAccess.existsAsync(logPath)) {
        mkdirp_1.sync(logPath);
    }
    const datePrefix = dateformat(Date.now(), 'yyyymmdd_HHMMss', /*utc*/ true);
    const logFilename = path.join(logPath, `${datePrefix}_Launcher_Uninstall.log`);
    try {
        logFd = await vscode_command_framework_1.fileAccess.openAsync(logFilename, 'a');
    }
    catch (e) {
        console.error(`Could not open log file ${logFilename}: ${e}`);
    }
}
function log(message, level) {
    const dateString = dateformat(Date.now(), 'yyyy-mm-dd HH:MM:ss.l', /*utc*/ true);
    const logEntry = `[${dateString} Launcher.Uninstall ${level}] ${message}`;
    console.log(logEntry);
    if (logFd) {
        try {
            vscode_command_framework_1.fileAccess.appendFileSync(logFd, logEntry + '\n', 'utf8');
        }
        catch (e) {
            console.error(`Could not write to log file: ${e}`);
        }
    }
}
function logInfo(message) {
    log(message, 'I');
}
function logError(message) {
    log(message, 'E');
}
/*
 * Actual uninstall script starts here
 */
const extensionRootPath = path.join(__dirname, '..', '..');
const nodeModulesPath = path.join(extensionRootPath, 'node_modules');
const launcherOSXPath = path.join(nodeModulesPath, '@vsliveshare', 'vscode-launcher-osx');
const launcherWinPath = path.join(nodeModulesPath, '@vsliveshare', 'vscode-launcher-win');
const launcherLinuxPath = path.join(nodeModulesPath, '@vsliveshare', 'vscode-launcher-linux');
// Note Linux uses "sh" instead of bash since bash features are not needed
// and unlike bash, sh is available on all Linux distros and docker containers
const uninstallScripts = {
    win32: {
        command: path.join(launcherWinPath, 'Live Share for VS Code.exe'),
        args: ['uninstall']
    },
    linux: {
        command: 'sh',
        args: [path.join(launcherLinuxPath, 'uninstall.sh'), 'false']
    }
};
function uninstall() {
    const uninstallScript = uninstallScripts[os.platform()];
    if (!uninstallScript) {
        logInfo(`Skipping - No launcher uninstall script found for ${os.platform()}`);
        return true;
    }
    logInfo(`Running "${uninstallScript.command}" ${uninstallScript.args.length > 0 ? '"' + uninstallScript.args.join('" "') + '"' : ''}`);
    try {
        const result = child_process_1.spawnSync(uninstallScript.command, uninstallScript.args);
        if (result.output) {
            logInfo(`Command output:\n${result.output.join('\n')}`);
        }
        if (result.status !== 0) {
            logError(`Launcher uninstall terminated with error code: ${result.status}` +
                (result.error ? ` error: ${result.error.toString()}` : ''));
            return false;
        }
    }
    catch (e) {
        logError(`Launcher uninstall failed to execute. Error: ${e}`);
        return false;
    }
    logInfo('Launcher succesfully uninstalled');
}
initLog().then(() => {
    logInfo('Starting to uninstall launcher.');
    logInfo('Detected OS is ' + os.platform());
    const uninstallResult = uninstall();
    try {
        vscode_command_framework_1.fileAccess
            .closeAsync(logFd)
            .then(() => {
            process.exit(uninstallResult ? 0 : 1);
        });
    }
    catch (e) {
        console.error(`Could not close log file: ${e}`);
    }
});

//# sourceMappingURL=uninstall.js.map
