"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _util = require("../util");

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
class JUnitReporter {
  constructor(options = {}) {
    this.config = void 0;
    this.suite = void 0;
    this.timestamp = void 0;
    this.startTime = void 0;
    this.totalTests = 0;
    this.totalFailures = 0;
    this.totalSkipped = 0;
    this.outputFile = void 0;
    this.stripANSIControlSequences = false;
    this.outputFile = options.outputFile;
    this.stripANSIControlSequences = options.stripANSIControlSequences || false;
  }

  onBegin(config, suite) {
    this.config = config;
    this.suite = suite;
    this.timestamp = Date.now();
    this.startTime = (0, _util.monotonicTime)();
  }

  async onEnd(result) {
    const duration = (0, _util.monotonicTime)() - this.startTime;
    const children = [];

    for (const projectSuite of this.suite.suites) {
      for (const fileSuite of projectSuite.suites) children.push(this._buildTestSuite(fileSuite));
    }

    const tokens = [];
    const self = this;
    const root = {
      name: 'testsuites',
      attributes: {
        id: process.env[`PLAYWRIGHT_JUNIT_SUITE_ID`] || '',
        name: process.env[`PLAYWRIGHT_JUNIT_SUITE_NAME`] || '',
        tests: self.totalTests,
        failures: self.totalFailures,
        skipped: self.totalSkipped,
        errors: 0,
        time: duration / 1000
      },
      children
    };
    serializeXML(root, tokens, this.stripANSIControlSequences);
    const reportString = tokens.join('\n');
    const outputFile = this.outputFile || process.env[`PLAYWRIGHT_JUNIT_OUTPUT_NAME`];

    if (outputFile) {
      _fs.default.mkdirSync(_path.default.dirname(outputFile), {
        recursive: true
      });

      _fs.default.writeFileSync(outputFile, reportString);
    } else {
      console.log(reportString);
    }
  }

  _buildTestSuite(suite) {
    let tests = 0;
    let skipped = 0;
    let failures = 0;
    let duration = 0;
    const children = [];
    suite.allTests().forEach(test => {
      ++tests;
      if (test.outcome() === 'skipped') ++skipped;
      if (!test.ok()) ++failures;

      for (const result of test.results) duration += result.duration;

      this._addTestCase(test, children);
    });
    this.totalTests += tests;
    this.totalSkipped += skipped;
    this.totalFailures += failures;
    const entry = {
      name: 'testsuite',
      attributes: {
        name: suite.location ? _path.default.relative(this.config.rootDir, suite.location.file) : '',
        timestamp: this.timestamp,
        hostname: '',
        tests,
        failures,
        skipped,
        time: duration / 1000,
        errors: 0
      },
      children
    };
    return entry;
  }

  _addTestCase(test, entries) {
    const entry = {
      name: 'testcase',
      attributes: {
        // Skip root, project, file
        name: test.titlePath().slice(3).join(' '),
        classname: (0, _base.formatTestTitle)(this.config, test),
        time: test.results.reduce((acc, value) => acc + value.duration, 0) / 1000
      },
      children: []
    };
    entries.push(entry);

    if (test.outcome() === 'skipped') {
      entry.children.push({
        name: 'skipped'
      });
      return;
    }

    if (!test.ok()) {
      entry.children.push({
        name: 'failure',
        attributes: {
          message: `${_path.default.basename(test.location.file)}:${test.location.line}:${test.location.column} ${test.title}`,
          type: 'FAILURE'
        },
        text: (0, _base.stripAnsiEscapes)((0, _base.formatFailure)(this.config, test))
      });
    }

    for (const result of test.results) {
      for (const stdout of result.stdout) {
        entry.children.push({
          name: 'system-out',
          text: stdout.toString()
        });
      }

      for (const attachment of result.attachments) {
        if (attachment.path) {
          entry.children.push({
            name: 'system-out',
            text: `[[ATTACHMENT|${_path.default.relative(this.config.rootDir, attachment.path)}]]`
          });
        }
      }

      for (const stderr of result.stderr) {
        entry.children.push({
          name: 'system-err',
          text: stderr.toString()
        });
      }
    }
  }

}

function serializeXML(entry, tokens, stripANSIControlSequences) {
  const attrs = [];

  for (const [name, value] of Object.entries(entry.attributes || {})) attrs.push(`${name}="${escape(String(value), stripANSIControlSequences, false)}"`);

  tokens.push(`<${entry.name}${attrs.length ? ' ' : ''}${attrs.join(' ')}>`);

  for (const child of entry.children || []) serializeXML(child, tokens, stripANSIControlSequences);

  if (entry.text) tokens.push(escape(entry.text, stripANSIControlSequences, true));
  tokens.push(`</${entry.name}>`);
} // See https://en.wikipedia.org/wiki/Valid_characters_in_XML


const discouragedXMLCharacters = /[\u0001-\u0008\u000b-\u000c\u000e-\u001f\u007f-\u0084\u0086-\u009f]/g;
const ansiControlSequence = new RegExp('[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))', 'g');

function escape(text, stripANSIControlSequences, isCharacterData) {
  if (stripANSIControlSequences) text = text.replace(ansiControlSequence, '');
  const escapeRe = isCharacterData ? /[&<]/g : /[&"<>]/g;
  text = text.replace(escapeRe, c => ({
    '&': '&amp;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;'
  })[c]);
  if (isCharacterData) text = text.replace(/]]>/g, ']]&gt;');
  text = text.replace(discouragedXMLCharacters, '');
  return text;
}

var _default = JUnitReporter;
exports.default = _default;