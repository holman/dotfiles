"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadBrowserWithProgressBar = downloadBrowserWithProgressBar;
exports.logPolitely = logPolitely;

var _extractZip = _interopRequireDefault(require("extract-zip"));

var _fs = _interopRequireDefault(require("fs"));

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _progress = _interopRequireDefault(require("progress"));

var _utils = require("./utils");

var _debugLogger = require("./debugLogger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright 2017 Google Inc. All rights reserved.
 * Modifications copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function downloadBrowserWithProgressBar(title, browserDirectory, executablePath, downloadURL, downloadFileName) {
  const progressBarName = `Playwright build of ${title}`;

  if (await (0, _utils.existsAsync)(browserDirectory)) {
    // Already downloaded.
    _debugLogger.debugLogger.log('install', `browser ${title} is already downloaded.`);

    return false;
  }

  let progressBar;
  let lastDownloadedBytes = 0;

  function progress(downloadedBytes, totalBytes) {
    if (!process.stderr.isTTY) return;

    if (!progressBar) {
      progressBar = new _progress.default(`Downloading ${progressBarName} - ${toMegabytes(totalBytes)} [:bar] :percent :etas `, {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: totalBytes
      });
    }

    const delta = downloadedBytes - lastDownloadedBytes;
    lastDownloadedBytes = downloadedBytes;
    progressBar.tick(delta);
  }

  const url = downloadURL;

  const zipPath = _path.default.join(_os.default.tmpdir(), downloadFileName);

  try {
    for (let attempt = 1, N = 3; attempt <= N; ++attempt) {
      _debugLogger.debugLogger.log('install', `downloading ${progressBarName} - attempt #${attempt}`);

      const {
        error
      } = await (0, _utils.downloadFile)(url, zipPath, {
        progressCallback: progress,
        log: _debugLogger.debugLogger.log.bind(_debugLogger.debugLogger, 'install')
      });

      if (!error) {
        _debugLogger.debugLogger.log('install', `SUCCESS downloading ${progressBarName}`);

        break;
      }

      const errorMessage = typeof error === 'object' && typeof error.message === 'string' ? error.message : '';

      _debugLogger.debugLogger.log('install', `attempt #${attempt} - ERROR: ${errorMessage}`);

      if (attempt < N && (errorMessage.includes('ECONNRESET') || errorMessage.includes('ETIMEDOUT'))) {
        // Maximum delay is 3rd retry: 1337.5ms
        const millis = Math.random() * 200 + 250 * Math.pow(1.5, attempt);

        _debugLogger.debugLogger.log('install', `sleeping ${millis}ms before retry...`);

        await new Promise(c => setTimeout(c, millis));
      } else {
        throw error;
      }
    }

    _debugLogger.debugLogger.log('install', `extracting archive`);

    _debugLogger.debugLogger.log('install', `-- zip: ${zipPath}`);

    _debugLogger.debugLogger.log('install', `-- location: ${browserDirectory}`);

    await (0, _extractZip.default)(zipPath, {
      dir: browserDirectory
    });

    _debugLogger.debugLogger.log('install', `fixing permissions at ${executablePath}`);

    await _fs.default.promises.chmod(executablePath, 0o755);
  } catch (e) {
    _debugLogger.debugLogger.log('install', `FAILED installation ${progressBarName} with error: ${e}`);

    process.exitCode = 1;
    throw e;
  } finally {
    if (await (0, _utils.existsAsync)(zipPath)) await _fs.default.promises.unlink(zipPath);
  }

  logPolitely(`${progressBarName} downloaded to ${browserDirectory}`);
  return true;
}

function toMegabytes(bytes) {
  const mb = bytes / 1024 / 1024;
  return `${Math.round(mb * 10) / 10} Mb`;
}

function logPolitely(toBeLogged) {
  const logLevel = process.env.npm_config_loglevel;
  const logLevelDisplay = ['silent', 'error', 'warn'].indexOf(logLevel || '') > -1;
  if (!logLevelDisplay) console.log(toBeLogged); // eslint-disable-line no-console
}