"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _safe = _interopRequireDefault(require("colors/safe"));

var _fs = _interopRequireDefault(require("fs"));

var _open = _interopRequireDefault(require("open"));

var _path = _interopRequireDefault(require("path"));

var _httpServer = require("../../utils/httpServer");

var _utils = require("../../utils/utils");

var _json = require("../reporters/json");

var _raw = _interopRequireDefault(require("./raw"));

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
class HtmlReporter {
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
    const reports = projectSuites.map(suite => {
      const rawReporter = new _raw.default();
      const report = rawReporter.generateProjectReport(this.config, suite);
      return report;
    });

    const reportFolder = _path.default.resolve(process.cwd(), process.env[`PLAYWRIGHT_HTML_REPORT`] || 'playwright-report');

    await (0, _utils.removeFolders)([reportFolder]);
    new HtmlBuilder(reports, reportFolder, this.config.rootDir);

    if (!process.env.CI && !process.env.PWTEST_SKIP_TEST_OUTPUT) {
      const server = new _httpServer.HttpServer();
      server.routePrefix('/', (request, response) => {
        let relativePath = request.url;
        if (relativePath === '/') relativePath = '/index.html';

        const absolutePath = _path.default.join(reportFolder, ...relativePath.split('/'));

        return server.serveFile(response, absolutePath);
      });
      const url = await server.start();
      console.log('');
      console.log(_safe.default.cyan(`  Serving HTML report at ${url}. Press Ctrl+C to quit.`));
      console.log('');
      (0, _open.default)(url);
      process.on('SIGINT', () => process.exit(0));
      await new Promise(() => {});
    }
  }

}

class HtmlBuilder {
  constructor(rawReports, outputDir, rootDir) {
    this._reportFolder = void 0;
    this._tests = new Map();
    this._rootDir = void 0;
    this._dataFolder = void 0;
    this._rootDir = rootDir;
    this._reportFolder = _path.default.resolve(process.cwd(), outputDir);
    this._dataFolder = _path.default.join(this._reportFolder, 'data');

    _fs.default.mkdirSync(this._dataFolder, {
      recursive: true
    });

    const appFolder = _path.default.join(__dirname, '..', '..', 'web', 'htmlReport');

    for (const file of _fs.default.readdirSync(appFolder)) _fs.default.copyFileSync(_path.default.join(appFolder, file), _path.default.join(this._reportFolder, file));

    const projects = [];

    for (const projectJson of rawReports) {
      const suites = [];

      for (const file of projectJson.suites) {
        const relativeFileName = this._relativeLocation(file.location).file;

        const fileId = (0, _utils.calculateSha1)(projectJson.project.name + ':' + relativeFileName);
        const tests = [];
        suites.push(this._createSuiteTreeItem(file, fileId, tests));
        const testFile = {
          fileId,
          path: relativeFileName,
          tests: tests.map(t => this._createTestCase(t))
        };

        _fs.default.writeFileSync(_path.default.join(this._dataFolder, fileId + '.json'), JSON.stringify(testFile, undefined, 2));
      }

      projects.push({
        name: projectJson.project.name,
        suites,
        stats: suites.reduce((a, s) => addStats(a, s.stats), emptyStats())
      });
    }

    _fs.default.writeFileSync(_path.default.join(this._dataFolder, 'projects.json'), JSON.stringify(projects, undefined, 2));
  }

  _createTestCase(test) {
    return {
      testId: test.testId,
      title: test.title,
      location: this._relativeLocation(test.location),
      results: test.results.map(r => this._createTestResult(test, r))
    };
  }

  _createSuiteTreeItem(suite, fileId, testCollector) {
    const suites = suite.suites.map(s => this._createSuiteTreeItem(s, fileId, testCollector));
    const tests = suite.tests.map(t => this._createTestTreeItem(t, fileId));
    testCollector.push(...suite.tests);
    const stats = suites.reduce((a, s) => addStats(a, s.stats), emptyStats());

    for (const test of tests) {
      if (test.outcome === 'expected') ++stats.expected;
      if (test.outcome === 'skipped') ++stats.skipped;
      if (test.outcome === 'unexpected') ++stats.unexpected;
      if (test.outcome === 'flaky') ++stats.flaky;
      ++stats.total;
    }

    stats.ok = stats.unexpected + stats.flaky === 0;
    return {
      title: suite.title,
      location: this._relativeLocation(suite.location),
      duration: suites.reduce((a, s) => a + s.duration, 0) + tests.reduce((a, t) => a + t.duration, 0),
      stats,
      suites,
      tests
    };
  }

  _createTestTreeItem(test, fileId) {
    const duration = test.results.reduce((a, r) => a + r.duration, 0);

    this._tests.set(test.testId, test);

    return {
      testId: test.testId,
      fileId: fileId,
      location: this._relativeLocation(test.location),
      title: test.title,
      duration,
      outcome: test.outcome,
      ok: test.ok
    };
  }

  _createTestResult(test, result) {
    return {
      duration: result.duration,
      startTime: result.startTime,
      retry: result.retry,
      steps: result.steps.map(s => this._createTestStep(s)),
      error: result.error,
      status: result.status,
      attachments: result.attachments.map(a => {
        if (a.path) {
          const fileName = 'data/' + test.testId + _path.default.extname(a.path);

          try {
            _fs.default.copyFileSync(a.path, _path.default.join(this._reportFolder, fileName));
          } catch (e) {}

          return {
            name: a.name,
            contentType: a.contentType,
            path: fileName,
            body: a.body
          };
        }

        return a;
      })
    };
  }

  _createTestStep(step) {
    return {
      title: step.title,
      startTime: step.startTime,
      duration: step.duration,
      steps: step.steps.map(s => this._createTestStep(s)),
      log: step.log,
      error: step.error
    };
  }

  _relativeLocation(location) {
    if (!location) return {
      file: '',
      line: 0,
      column: 0
    };
    return {
      file: (0, _json.toPosixPath)(_path.default.relative(this._rootDir, location.file)),
      line: location.line,
      column: location.column
    };
  }

}

const emptyStats = () => {
  return {
    total: 0,
    expected: 0,
    unexpected: 0,
    flaky: 0,
    skipped: 0,
    ok: true
  };
};

const addStats = (stats, delta) => {
  stats.total += delta.total;
  stats.skipped += delta.skipped;
  stats.expected += delta.expected;
  stats.unexpected += delta.unexpected;
  stats.flaky += delta.flaky;
  stats.ok = stats.ok && delta.ok;
  return stats;
};

var _default = HtmlReporter;
exports.default = _default;