"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPosixPath = toPosixPath;
exports.serializePatterns = serializePatterns;
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

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
function toPosixPath(aPath) {
  return aPath.split(_path.default.sep).join(_path.default.posix.sep);
}

class JSONReporter {
  constructor(options = {}) {
    this.config = void 0;
    this.suite = void 0;
    this._errors = [];
    this._outputFile = void 0;
    this._outputFile = options.outputFile;
  }

  onBegin(config, suite) {
    this.config = config;
    this.suite = suite;
  }

  onError(error) {
    this._errors.push(error);
  }

  async onEnd(result) {
    outputReport(this._serializeReport(), this._outputFile);
  }

  _serializeReport() {
    return {
      config: { ...this.config,
        rootDir: toPosixPath(this.config.rootDir),
        projects: this.config.projects.map(project => {
          return {
            outputDir: toPosixPath(project.outputDir),
            repeatEach: project.repeatEach,
            retries: project.retries,
            metadata: project.metadata,
            name: project.name,
            testDir: toPosixPath(project.testDir),
            testIgnore: serializePatterns(project.testIgnore),
            testMatch: serializePatterns(project.testMatch),
            timeout: project.timeout
          };
        })
      },
      suites: this._mergeSuites(this.suite.suites),
      errors: this._errors
    };
  }

  _mergeSuites(suites) {
    const fileSuites = new Map();
    const result = [];

    for (const projectSuite of suites) {
      for (const fileSuite of projectSuite.suites) {
        const file = fileSuite.location.file;

        if (!fileSuites.has(file)) {
          const serialized = this._serializeSuite(fileSuite);

          if (serialized) {
            fileSuites.set(file, serialized);
            result.push(serialized);
          }
        } else {
          this._mergeTestsFromSuite(fileSuites.get(file), fileSuite);
        }
      }
    }

    return result;
  }

  _relativeLocation(location) {
    if (!location) return {
      file: '',
      line: 0,
      column: 0
    };
    return {
      file: toPosixPath(_path.default.relative(this.config.rootDir, location.file)),
      line: location.line,
      column: location.column
    };
  }

  _locationMatches(s, location) {
    const relative = this._relativeLocation(location);

    return s.file === relative.file && s.line === relative.line && s.column === relative.column;
  }

  _mergeTestsFromSuite(to, from) {
    for (const fromSuite of from.suites) {
      const toSuite = (to.suites || []).find(s => s.title === fromSuite.title && this._locationMatches(s, from.location));

      if (toSuite) {
        this._mergeTestsFromSuite(toSuite, fromSuite);
      } else {
        const serialized = this._serializeSuite(fromSuite);

        if (serialized) {
          if (!to.suites) to.suites = [];
          to.suites.push(serialized);
        }
      }
    }

    for (const test of from.tests) {
      const toSpec = to.specs.find(s => s.title === test.title && s.file === toPosixPath(_path.default.relative(this.config.rootDir, test.location.file)) && s.line === test.location.line && s.column === test.location.column);
      if (toSpec) toSpec.tests.push(this._serializeTest(test));else to.specs.push(this._serializeTestSpec(test));
    }
  }

  _serializeSuite(suite) {
    if (!suite.allTests().length) return null;
    const suites = suite.suites.map(suite => this._serializeSuite(suite)).filter(s => s);
    return {
      title: suite.title,
      ...this._relativeLocation(suite.location),
      specs: suite.tests.map(test => this._serializeTestSpec(test)),
      suites: suites.length ? suites : undefined
    };
  }

  _serializeTestSpec(test) {
    return {
      title: test.title,
      ok: test.ok(),
      tags: (test.title.match(/@[\S]+/g) || []).map(t => t.substring(1)),
      tests: [this._serializeTest(test)],
      ...this._relativeLocation(test.location)
    };
  }

  _serializeTest(test) {
    return {
      timeout: test.timeout,
      annotations: test.annotations,
      expectedStatus: test.expectedStatus,
      projectName: test.titlePath()[1],
      results: test.results.map(r => this._serializeTestResult(r)),
      status: test.outcome()
    };
  }

  _serializeTestResult(result) {
    const steps = result.steps.filter(s => s.category === 'test.step');
    return {
      workerIndex: result.workerIndex,
      status: result.status,
      duration: result.duration,
      error: result.error,
      stdout: result.stdout.map(s => stdioEntry(s)),
      stderr: result.stderr.map(s => stdioEntry(s)),
      retry: result.retry,
      steps: steps.length ? steps.map(s => this._serializeTestStep(s)) : undefined,
      attachments: result.attachments.map(a => {
        var _a$body;

        return {
          name: a.name,
          contentType: a.contentType,
          path: a.path,
          body: (_a$body = a.body) === null || _a$body === void 0 ? void 0 : _a$body.toString('base64')
        };
      })
    };
  }

  _serializeTestStep(step) {
    const steps = step.steps.filter(s => s.category === 'test.step');
    return {
      title: step.title,
      duration: step.duration,
      error: step.error,
      steps: steps.length ? steps.map(s => this._serializeTestStep(s)) : undefined
    };
  }

}

function outputReport(report, outputFile) {
  const reportString = JSON.stringify(report, undefined, 2);
  outputFile = outputFile || process.env[`PLAYWRIGHT_JSON_OUTPUT_NAME`];

  if (outputFile) {
    _fs.default.mkdirSync(_path.default.dirname(outputFile), {
      recursive: true
    });

    _fs.default.writeFileSync(outputFile, reportString);
  } else {
    console.log(reportString);
  }
}

function stdioEntry(s) {
  if (typeof s === 'string') return {
    text: s
  };
  return {
    buffer: s.toString('base64')
  };
}

function serializePatterns(patterns) {
  if (!Array.isArray(patterns)) patterns = [patterns];
  return patterns.map(s => s.toString());
}

var _default = JSONReporter;
exports.default = _default;