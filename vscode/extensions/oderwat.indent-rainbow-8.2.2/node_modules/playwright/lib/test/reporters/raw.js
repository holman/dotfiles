"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _utils = require("../../utils/utils");

var _util = require("../util");

var _base = require("./base");

var _json = require("./json");

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
class RawReporter {
  constructor() {
    this.config = void 0;
    this.suite = void 0;
  }

  onBegin(config, suite) {
    this.config = config;
    this.suite = suite;
  }

  async onEnd() {
    const projectSuites = this.suite.suites;

    for (const suite of projectSuites) {
      const project = suite._projectConfig;
      (0, _utils.assert)(project, 'Internal Error: Invalid project structure');

      const reportFolder = _path.default.join(project.outputDir, 'report');

      _fs.default.mkdirSync(reportFolder, {
        recursive: true
      });

      let reportFile;

      for (let i = 0; i < 10; ++i) {
        reportFile = _path.default.join(reportFolder, (0, _util.sanitizeForFilePath)(project.name || 'project') + (i ? '-' + i : '') + '.report');

        try {
          if (_fs.default.existsSync(reportFile)) continue;
        } catch (e) {}

        break;
      }

      if (!reportFile) throw new Error('Internal error, could not create report file');
      const report = this.generateProjectReport(this.config, suite);

      _fs.default.writeFileSync(reportFile, JSON.stringify(report, undefined, 2));
    }
  }

  generateProjectReport(config, suite) {
    const project = suite._projectConfig;
    (0, _utils.assert)(project, 'Internal Error: Invalid project structure');
    const report = {
      config,
      project: {
        metadata: project.metadata,
        name: project.name,
        outputDir: project.outputDir,
        repeatEach: project.repeatEach,
        retries: project.retries,
        testDir: project.testDir,
        testIgnore: (0, _json.serializePatterns)(project.testIgnore),
        testMatch: (0, _json.serializePatterns)(project.testMatch),
        timeout: project.timeout
      },
      suites: suite.suites.map(s => this._serializeSuite(s))
    };
    return report;
  }

  _serializeSuite(suite) {
    return {
      title: suite.title,
      location: suite.location,
      suites: suite.suites.map(s => this._serializeSuite(s)),
      tests: suite.tests.map(t => this._serializeTest(t))
    };
  }

  _serializeTest(test) {
    const testId = (0, _utils.calculateSha1)(test.titlePath().join('|'));
    return {
      testId,
      title: test.title,
      location: test.location,
      expectedStatus: test.expectedStatus,
      timeout: test.timeout,
      annotations: test.annotations,
      retries: test.retries,
      ok: test.ok(),
      outcome: test.outcome(),
      results: test.results.map(r => this._serializeResult(test, r))
    };
  }

  _serializeResult(test, result) {
    return {
      retry: result.retry,
      workerIndex: result.workerIndex,
      startTime: result.startTime.toISOString(),
      duration: result.duration,
      status: result.status,
      error: (0, _base.formatResultFailure)(test, result, '').join('').trim(),
      attachments: this._createAttachments(result),
      steps: this._serializeSteps(test, result.steps)
    };
  }

  _serializeSteps(test, steps) {
    return steps.map(step => {
      var _step$error;

      return {
        title: step.title,
        category: step.category,
        startTime: step.startTime.toISOString(),
        duration: step.duration,
        error: (_step$error = step.error) === null || _step$error === void 0 ? void 0 : _step$error.message,
        steps: this._serializeSteps(test, step.steps),
        log: step.data.log || undefined
      };
    });
  }

  _createAttachments(result) {
    const attachments = [];

    for (const attachment of result.attachments) {
      if (attachment.body) {
        attachments.push({
          name: attachment.name,
          contentType: attachment.contentType,
          body: attachment.body.toString('base64')
        });
      } else if (attachment.path) {
        attachments.push({
          name: attachment.name,
          contentType: attachment.contentType,
          path: attachment.path
        });
      }
    }

    for (const chunk of result.stdout) attachments.push(this._stdioAttachment(chunk, 'stdout'));

    for (const chunk of result.stderr) attachments.push(this._stdioAttachment(chunk, 'stderr'));

    return attachments;
  }

  _stdioAttachment(chunk, type) {
    if (typeof chunk === 'string') {
      return {
        name: type,
        contentType: 'text/plain',
        body: chunk
      };
    }

    return {
      name: type,
      contentType: 'application/octet-stream',
      body: chunk.toString('base64')
    };
  }

}

var _default = RawReporter;
exports.default = _default;