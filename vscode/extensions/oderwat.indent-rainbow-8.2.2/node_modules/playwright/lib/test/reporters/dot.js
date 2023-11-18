"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _safe = _interopRequireDefault(require("colors/safe"));

var _base = require("./base");

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
class DotReporter extends _base.BaseReporter {
  constructor(...args) {
    super(...args);
    this._counter = 0;
  }

  onStdOut(chunk, test, result) {
    super.onStdOut(chunk, test, result);
    if (!this.config.quiet) process.stdout.write(chunk);
  }

  onStdErr(chunk, test, result) {
    super.onStdErr(chunk, test, result);
    if (!this.config.quiet) process.stderr.write(chunk);
  }

  onTestEnd(test, result) {
    super.onTestEnd(test, result);

    if (this._counter === 80) {
      process.stdout.write('\n');
      this._counter = 0;
    }

    ++this._counter;

    if (result.status === 'skipped') {
      process.stdout.write(_safe.default.yellow('°'));
      return;
    }

    if (this.willRetry(test)) {
      process.stdout.write(_safe.default.gray('×'));
      return;
    }

    switch (test.outcome()) {
      case 'expected':
        process.stdout.write(_safe.default.green('·'));
        break;

      case 'unexpected':
        process.stdout.write(_safe.default.red(result.status === 'timedOut' ? 'T' : 'F'));
        break;

      case 'flaky':
        process.stdout.write(_safe.default.yellow('±'));
        break;
    }
  }

  async onEnd(result) {
    await super.onEnd(result);
    process.stdout.write('\n');
    this.epilogue(true);
  }

}

var _default = DotReporter;
exports.default = _default;