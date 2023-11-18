"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebServer = void 0;

var _net = _interopRequireDefault(require("net"));

var _os = _interopRequireDefault(require("os"));

var _stream = _interopRequireDefault(require("stream"));

var _util = require("./util");

var _async = require("../utils/async");

var _processLauncher = require("../utils/processLauncher");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DEFAULT_ENVIRONMENT_VARIABLES = {
  'BROWSER': 'none' // Disable that create-react-app will open the page in the browser

};

const newProcessLogPrefixer = () => new _stream.default.Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().split(_os.default.EOL).map(line => line ? `[Launch] ${line}` : line).join(_os.default.EOL));
    callback();
  }

});

class WebServer {
  constructor(config) {
    this._killProcess = void 0;
    this._processExitedPromise = void 0;
    this.config = config;
  }

  static async create(config) {
    const webServer = new WebServer(config);

    try {
      await webServer._startProcess();
      await webServer._waitForProcess();
      return webServer;
    } catch (error) {
      await webServer.kill();
      throw error;
    }
  }

  async _startProcess() {
    let processExitedReject = error => {};

    this._processExitedPromise = new Promise((_, reject) => processExitedReject = reject);
    const portIsUsed = await isPortUsed(this.config.port);

    if (portIsUsed) {
      if (this.config.reuseExistingServer) return;
      throw new Error(`Port ${this.config.port} is used, make sure that nothing is running on the port or set strict:false in config.launch.`);
    }

    const {
      launchedProcess,
      kill
    } = await (0, _processLauncher.launchProcess)({
      command: this.config.command,
      env: { ...DEFAULT_ENVIRONMENT_VARIABLES,
        ...process.env,
        ...this.config.env
      },
      cwd: this.config.cwd,
      stdio: 'stdin',
      shell: true,
      attemptToGracefullyClose: async () => {},
      log: () => {},
      onExit: code => processExitedReject(new Error(`Process from config.launch was not able to start. Exit code: ${code}`)),
      tempDirectories: []
    });
    this._killProcess = kill;
    launchedProcess.stderr.pipe(newProcessLogPrefixer()).pipe(process.stderr);
    launchedProcess.stdout.on('data', () => {});
  }

  async _waitForProcess() {
    await this._waitForAvailability();
    const baseURL = `http://localhost:${this.config.port}`;
    process.env.PLAYWRIGHT_TEST_BASE_URL = baseURL;
  }

  async _waitForAvailability() {
    const launchTimeout = this.config.timeout || 60 * 1000;
    const cancellationToken = {
      canceled: false
    };
    const {
      timedOut
    } = await Promise.race([(0, _async.raceAgainstDeadline)(waitForSocket(this.config.port, 100, cancellationToken), launchTimeout + (0, _util.monotonicTime)()), this._processExitedPromise]);
    cancellationToken.canceled = true;
    if (timedOut) throw new Error(`Timed out waiting ${launchTimeout}ms from config.launch.`);
  }

  async kill() {
    var _this$_killProcess;

    await ((_this$_killProcess = this._killProcess) === null || _this$_killProcess === void 0 ? void 0 : _this$_killProcess.call(this));
  }

}

exports.WebServer = WebServer;

async function isPortUsed(port) {
  return new Promise(resolve => {
    const conn = _net.default.connect(port).on('error', () => {
      resolve(false);
    }).on('connect', () => {
      conn.end();
      resolve(true);
    });
  });
}

async function waitForSocket(port, delay, cancellationToken) {
  while (!cancellationToken.canceled) {
    const connected = await isPortUsed(port);
    if (connected) return;
    await new Promise(x => setTimeout(x, delay));
  }
}