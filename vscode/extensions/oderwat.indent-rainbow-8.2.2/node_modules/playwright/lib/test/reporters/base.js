"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatFailure = formatFailure;
exports.formatResultFailure = formatResultFailure;
exports.formatTestTitle = formatTestTitle;
exports.formatError = formatError;
exports.stripAnsiEscapes = stripAnsiEscapes;
exports.BaseReporter = void 0;

var _codeFrame = require("@babel/code-frame");

var _safe = _interopRequireDefault(require("colors/safe"));

var _fs = _interopRequireDefault(require("fs"));

var _ms = _interopRequireDefault(require("ms"));

var _path = _interopRequireDefault(require("path"));

var _stackUtils = _interopRequireDefault(require("stack-utils"));

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
// @ts-ignore
const stackUtils = new _stackUtils.default();
const kOutputSymbol = Symbol('output');

class BaseReporter {
  constructor() {
    this.duration = 0;
    this.config = void 0;
    this.suite = void 0;
    this.result = void 0;
    this.fileDurations = new Map();
    this.monotonicStartTime = 0;
    this.printTestOutput = !process.env.PWTEST_SKIP_TEST_OUTPUT;
  }

  onBegin(config, suite) {
    this.monotonicStartTime = monotonicTime();
    this.config = config;
    this.suite = suite;
  }

  onStdOut(chunk, test, result) {
    this._appendOutput({
      chunk,
      type: 'stdout'
    }, result);
  }

  onStdErr(chunk, test, result) {
    this._appendOutput({
      chunk,
      type: 'stderr'
    }, result);
  }

  _appendOutput(output, result) {
    if (!result) return;
    result[kOutputSymbol] = result[kOutputSymbol] || [];
    result[kOutputSymbol].push(output);
  }

  onTestEnd(test, result) {
    const projectName = test.titlePath()[1];
    const relativePath = relativeTestPath(this.config, test);
    const fileAndProject = (projectName ? `[${projectName}] › ` : '') + relativePath;
    const duration = this.fileDurations.get(fileAndProject) || 0;
    this.fileDurations.set(fileAndProject, duration + result.duration);
  }

  onError(error) {
    console.log(formatError(error));
  }

  async onEnd(result) {
    this.duration = monotonicTime() - this.monotonicStartTime;
    this.result = result;
  }

  _printSlowTests() {
    if (!this.config.reportSlowTests) return;
    const fileDurations = [...this.fileDurations.entries()];
    fileDurations.sort((a, b) => b[1] - a[1]);
    const count = Math.min(fileDurations.length, this.config.reportSlowTests.max || Number.POSITIVE_INFINITY);

    for (let i = 0; i < count; ++i) {
      const duration = fileDurations[i][1];
      if (duration <= this.config.reportSlowTests.threshold) break;
      console.log(_safe.default.yellow('  Slow test: ') + fileDurations[i][0] + _safe.default.yellow(` (${(0, _ms.default)(duration)})`));
    }
  }

  epilogue(full) {
    let skipped = 0;
    let expected = 0;
    const skippedWithError = [];
    const unexpected = [];
    const flaky = [];
    this.suite.allTests().forEach(test => {
      switch (test.outcome()) {
        case 'skipped':
          {
            ++skipped;
            if (test.results.some(result => !!result.error)) skippedWithError.push(test);
            break;
          }

        case 'expected':
          ++expected;
          break;

        case 'unexpected':
          unexpected.push(test);
          break;

        case 'flaky':
          flaky.push(test);
          break;
      }
    });
    const failuresToPrint = [...unexpected, ...flaky, ...skippedWithError];

    if (full && failuresToPrint.length) {
      console.log('');

      this._printFailures(failuresToPrint);
    }

    this._printSlowTests();

    console.log('');

    if (unexpected.length) {
      console.log(_safe.default.red(`  ${unexpected.length} failed`));

      for (const test of unexpected) console.log(_safe.default.red(formatTestHeader(this.config, test, '    ')));
    }

    if (flaky.length) {
      console.log(_safe.default.yellow(`  ${flaky.length} flaky`));

      for (const test of flaky) console.log(_safe.default.yellow(formatTestHeader(this.config, test, '    ')));
    }

    if (skipped) console.log(_safe.default.yellow(`  ${skipped} skipped`));
    if (expected) console.log(_safe.default.green(`  ${expected} passed`) + _safe.default.dim(` (${(0, _ms.default)(this.duration)})`));
    if (this.result.status === 'timedout') console.log(_safe.default.red(`  Timed out waiting ${this.config.globalTimeout / 1000}s for the entire test run`));
  }

  _printFailures(failures) {
    failures.forEach((test, index) => {
      console.log(formatFailure(this.config, test, index + 1, this.printTestOutput));
    });
  }

  willRetry(test) {
    return test.outcome() === 'unexpected' && test.results.length <= test.retries;
  }

}

exports.BaseReporter = BaseReporter;

function formatFailure(config, test, index, stdio) {
  const lines = [];
  lines.push(_safe.default.red(formatTestHeader(config, test, '  ', index)));

  for (const result of test.results) {
    const resultTokens = formatResultFailure(test, result, '    ');
    if (!resultTokens.length) continue;

    if (result.retry) {
      lines.push('');
      lines.push(_safe.default.gray(pad(`    Retry #${result.retry}`, '-')));
    }

    lines.push(...resultTokens);

    for (let i = 0; i < result.attachments.length; ++i) {
      const attachment = result.attachments[i];
      lines.push('');
      lines.push(_safe.default.cyan(pad(`    attachment #${i + 1}: ${attachment.name} (${attachment.contentType})`, '-')));

      if (attachment.path) {
        const relativePath = _path.default.relative(process.cwd(), attachment.path);

        lines.push(_safe.default.cyan(`    ${relativePath}`)); // Make this extensible

        if (attachment.name === 'trace') {
          lines.push(_safe.default.cyan(`    Usage:`));
          lines.push('');
          lines.push(_safe.default.cyan(`        npx playwright show-trace ${relativePath}`));
          lines.push('');
        }
      } else {
        if (attachment.contentType.startsWith('text/')) {
          let text = attachment.body.toString();
          if (text.length > 300) text = text.slice(0, 300) + '...';
          lines.push(_safe.default.cyan(`    ${text}`));
        }
      }

      lines.push(_safe.default.cyan(pad('   ', '-')));
    }

    const output = result[kOutputSymbol] || [];

    if (stdio && output.length) {
      const outputText = output.map(({
        chunk,
        type
      }) => {
        const text = chunk.toString('utf8');
        if (type === 'stderr') return _safe.default.red(stripAnsiEscapes(text));
        return text;
      }).join('');
      lines.push('');
      lines.push(_safe.default.gray(pad('--- Test output', '-')) + '\n\n' + outputText + '\n' + pad('', '-'));
    }
  }

  lines.push('');
  return lines.join('\n');
}

function formatResultFailure(test, result, initialIndent) {
  const resultTokens = [];

  if (result.status === 'timedOut') {
    resultTokens.push('');
    resultTokens.push(indent(_safe.default.red(`Timeout of ${test.timeout}ms exceeded.`), initialIndent));
  }

  if (result.status === 'passed' && test.expectedStatus === 'failed') {
    resultTokens.push('');
    resultTokens.push(indent(_safe.default.red(`Expected to fail, but passed.`), initialIndent));
  }

  if (result.error !== undefined) resultTokens.push(indent(formatError(result.error, test.location.file), initialIndent));
  return resultTokens;
}

function relativeTestPath(config, test) {
  return _path.default.relative(config.rootDir, test.location.file) || _path.default.basename(test.location.file);
}

function stepSuffix(step) {
  const stepTitles = step ? step.titlePath() : [];
  return stepTitles.map(t => ' › ' + t).join('');
}

function formatTestTitle(config, test, step) {
  // root, project, file, ...describes, test
  const [, projectName,, ...titles] = test.titlePath();
  const location = `${relativeTestPath(config, test)}:${test.location.line}:${test.location.column}`;
  const projectTitle = projectName ? `[${projectName}] › ` : '';
  return `${projectTitle}${location} › ${titles.join(' ')}${stepSuffix(step)}`;
}

function formatTestHeader(config, test, indent, index) {
  const title = formatTestTitle(config, test);
  const header = `${indent}${index ? index + ') ' : ''}${title}`;
  return pad(header, '=');
}

function formatError(error, file) {
  const stack = error.stack;
  const tokens = [];

  if (stack) {
    tokens.push('');
    const lines = stack.split('\n');
    let firstStackLine = lines.findIndex(line => line.startsWith('    at '));
    if (firstStackLine === -1) firstStackLine = lines.length;
    tokens.push(lines.slice(0, firstStackLine).join('\n'));
    const stackLines = lines.slice(firstStackLine);
    const position = file ? positionInFile(stackLines, file) : null;

    if (position) {
      const source = _fs.default.readFileSync(file, 'utf8');

      tokens.push('');
      tokens.push((0, _codeFrame.codeFrameColumns)(source, {
        start: position
      }, {
        highlightCode: _safe.default.enabled
      }));
    }

    tokens.push('');
    tokens.push(_safe.default.dim(stackLines.join('\n')));
  } else if (error.message) {
    tokens.push('');
    tokens.push(error.message);
  } else {
    tokens.push('');
    tokens.push(error.value);
  }

  return tokens.join('\n');
}

function pad(line, char) {
  if (line) line += ' ';
  return line + _safe.default.gray(char.repeat(Math.max(0, 100 - line.length)));
}

function indent(lines, tab) {
  return lines.replace(/^(?=.+$)/gm, tab);
}

function positionInFile(stackLines, file) {
  // Stack will have /private/var/folders instead of /var/folders on Mac.
  file = _fs.default.realpathSync(file);

  for (const line of stackLines) {
    const parsed = stackUtils.parseLine(line);
    if (!parsed || !parsed.file) continue;
    if (_path.default.resolve(process.cwd(), parsed.file) === file) return {
      column: parsed.column || 0,
      line: parsed.line || 0
    };
  }
}

function monotonicTime() {
  const [seconds, nanoseconds] = process.hrtime();
  return seconds * 1000 + (nanoseconds / 1000000 | 0);
}

const asciiRegex = new RegExp('[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))', 'g');

function stripAnsiEscapes(str) {
  return str.replace(asciiRegex, '');
}