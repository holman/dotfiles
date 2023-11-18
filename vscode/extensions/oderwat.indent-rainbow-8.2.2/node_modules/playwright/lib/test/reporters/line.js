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
class LineReporter extends _base.BaseReporter {
  constructor(...args) {
    super(...args);
    this._total = 0;
    this._current = 0;
    this._failures = 0;
    this._lastTest = void 0;
  }

  onBegin(config, suite) {
    super.onBegin(config, suite);
    this._total = suite.allTests().length;
    console.log();
  }

  onStdOut(chunk, test, result) {
    super.onStdOut(chunk, test, result);

    this._dumpToStdio(test, chunk, process.stdout);
  }

  onStdErr(chunk, test, result) {
    super.onStdErr(chunk, test, result);

    this._dumpToStdio(test, chunk, process.stderr);
  }

  _dumpToStdio(test, chunk, stream) {
    if (this.config.quiet) return;
    stream.write(`\u001B[1A\u001B[2K`);

    if (test && this._lastTest !== test) {
      // Write new header for the output.
      stream.write(_safe.default.gray((0, _base.formatTestTitle)(this.config, test) + `\n`));
      this._lastTest = test;
    }

    stream.write(chunk);
    console.log();
  }

  onTestEnd(test, result) {
    super.onTestEnd(test, result);
    const width = process.stdout.columns - 1;
    const title = `[${++this._current}/${this._total}] ${(0, _base.formatTestTitle)(this.config, test)}`.substring(0, width);
    process.stdout.write(`\u001B[1A\u001B[2K${title}\n`);

    if (!this.willRetry(test) && (test.outcome() === 'flaky' || test.outcome() === 'unexpected')) {
      process.stdout.write(`\u001B[1A\u001B[2K`);
      console.log((0, _base.formatFailure)(this.config, test, ++this._failures));
      console.log();
    }
  }

  async onEnd(result) {
    process.stdout.write(`\u001B[1A\u001B[2K`);
    await super.onEnd(result);
    this.epilogue(false);
  }

}

var _default = LineReporter;
exports.default = _default;