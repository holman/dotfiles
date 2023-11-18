"use strict";

var _console = require("console");

var util = _interopRequireWildcard(require("util"));

var _profiler = require("./profiler");

var _util2 = require("./util");

var _workerRunner3 = require("./workerRunner");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Copyright Microsoft Corporation. All rights reserved.
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
let closed = false;
sendMessageToParent('ready');
global.console = new _console.Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: process.env.FORCE_COLOR === '1'
});

process.stdout.write = chunk => {
  var _workerRunner, _workerRunner$_curren;

  const outPayload = {
    testId: (_workerRunner = workerRunner) === null || _workerRunner === void 0 ? void 0 : (_workerRunner$_curren = _workerRunner._currentTest) === null || _workerRunner$_curren === void 0 ? void 0 : _workerRunner$_curren.testId,
    ...chunkToParams(chunk)
  };
  sendMessageToParent('stdOut', outPayload);
  return true;
};

if (!process.env.PW_RUNNER_DEBUG) {
  process.stderr.write = chunk => {
    var _workerRunner2, _workerRunner2$_curre;

    const outPayload = {
      testId: (_workerRunner2 = workerRunner) === null || _workerRunner2 === void 0 ? void 0 : (_workerRunner2$_curre = _workerRunner2._currentTest) === null || _workerRunner2$_curre === void 0 ? void 0 : _workerRunner2$_curre.testId,
      ...chunkToParams(chunk)
    };
    sendMessageToParent('stdErr', outPayload);
    return true;
  };
}

process.on('disconnect', gracefullyCloseAndExit);
process.on('SIGINT', () => {});
process.on('SIGTERM', () => {});
let workerRunner;
let workerIndex;
process.on('unhandledRejection', (reason, promise) => {
  if (workerRunner) workerRunner.unhandledError(reason);
});
process.on('uncaughtException', error => {
  if (workerRunner) workerRunner.unhandledError(error);
});
process.on('message', async message => {
  if (message.method === 'init') {
    const initParams = message.params;
    workerIndex = initParams.workerIndex;
    (0, _profiler.startProfiling)();
    workerRunner = new _workerRunner3.WorkerRunner(initParams);

    for (const event of ['testBegin', 'testEnd', 'stepBegin', 'stepEnd', 'done', 'teardownError']) workerRunner.on(event, sendMessageToParent.bind(null, event));

    return;
  }

  if (message.method === 'stop') {
    await gracefullyCloseAndExit();
    return;
  }

  if (message.method === 'run') {
    const runPayload = message.params;
    await workerRunner.run(runPayload);
  }
});

async function gracefullyCloseAndExit() {
  if (closed) return;
  closed = true; // Force exit after 30 seconds.

  setTimeout(() => process.exit(0), 30000); // Meanwhile, try to gracefully shutdown.

  try {
    if (workerRunner) {
      await workerRunner.stop();
      await workerRunner.cleanup();
    }

    if (workerIndex !== undefined) await (0, _profiler.stopProfiling)(workerIndex);
  } catch (e) {
    process.send({
      method: 'teardownError',
      params: {
        error: (0, _util2.serializeError)(e)
      }
    });
  }

  process.exit(0);
}

function sendMessageToParent(method, params = {}) {
  try {
    process.send({
      method,
      params
    });
  } catch (e) {// Can throw when closing.
  }
}

function chunkToParams(chunk) {
  if (chunk instanceof Buffer) return {
    buffer: chunk.toString('base64')
  };
  if (typeof chunk !== 'string') return {
    text: util.inspect(chunk)
  };
  return {
    text: chunk
  };
}