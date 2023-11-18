"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerRunner = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _rimraf = _interopRequireDefault(require("rimraf"));

var _util = _interopRequireDefault(require("util"));

var _safe = _interopRequireDefault(require("colors/safe"));

var _events = require("events");

var _util2 = require("./util");

var _globals = require("./globals");

var _loader = require("./loader");

var _test = require("./test");

var _fixtures = require("./fixtures");

var _async = require("../utils/async");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
const removeFolderAsync = _util.default.promisify(_rimraf.default);

class WorkerRunner extends _events.EventEmitter {
  constructor(params) {
    super();
    this._params = void 0;
    this._loader = void 0;
    this._project = void 0;
    this._workerInfo = void 0;
    this._projectNamePathSegment = '';
    this._uniqueProjectNamePathSegment = '';
    this._fixtureRunner = void 0;
    this._failedTestId = void 0;
    this._fatalError = void 0;
    this._entries = new Map();
    this._isStopped = false;
    this._runFinished = Promise.resolve();
    this._currentDeadlineRunner = void 0;
    this._currentTest = null;
    this._params = params;
    this._fixtureRunner = new _fixtures.FixtureRunner();
  }

  stop() {
    if (!this._isStopped) {
      var _this$_currentDeadlin;

      this._isStopped = true; // Interrupt current action.

      (_this$_currentDeadlin = this._currentDeadlineRunner) === null || _this$_currentDeadlin === void 0 ? void 0 : _this$_currentDeadlin.interrupt(); // TODO: mark test as 'interrupted' instead.

      if (this._currentTest && this._currentTest.testInfo.status === 'passed') this._currentTest.testInfo.status = 'skipped';
    }

    return this._runFinished;
  }

  async cleanup() {
    // We have to load the project to get the right deadline below.
    await this._loadIfNeeded(); // TODO: separate timeout for teardown?

    const result = await (0, _async.raceAgainstDeadline)((async () => {
      await this._fixtureRunner.teardownScope('test');
      await this._fixtureRunner.teardownScope('worker');
    })(), this._deadline());
    if (result.timedOut && !this._fatalError) this._fatalError = {
      message: _safe.default.red(`Timeout of ${this._project.config.timeout}ms exceeded while shutting down environment`)
    };
    if (this._fatalError) this.emit('teardownError', {
      error: this._fatalError
    });
  }

  unhandledError(error) {
    if (this._currentTest && this._currentTest.type === 'test') {
      if (!this._currentTest.testInfo.error) {
        this._currentTest.testInfo.status = 'failed';
        this._currentTest.testInfo.error = (0, _util2.serializeError)(error);
      }
    } else {
      // No current test - fatal error.
      if (!this._fatalError) this._fatalError = (0, _util2.serializeError)(error);
    }

    this.stop();
  }

  _deadline() {
    return this._project.config.timeout ? (0, _util2.monotonicTime)() + this._project.config.timeout : 0;
  }

  async _loadIfNeeded() {
    if (this._loader) return;
    this._loader = await _loader.Loader.deserialize(this._params.loader);
    this._project = this._loader.projects()[this._params.projectIndex];
    this._projectNamePathSegment = (0, _util2.sanitizeForFilePath)(this._project.config.name);

    const sameName = this._loader.projects().filter(project => project.config.name === this._project.config.name);

    if (sameName.length > 1) this._uniqueProjectNamePathSegment = this._project.config.name + (sameName.indexOf(this._project) + 1);else this._uniqueProjectNamePathSegment = this._project.config.name;
    this._uniqueProjectNamePathSegment = (0, _util2.sanitizeForFilePath)(this._uniqueProjectNamePathSegment);
    this._workerInfo = {
      workerIndex: this._params.workerIndex,
      project: this._project.config,
      config: this._loader.fullConfig()
    };
  }

  async run(runPayload) {
    let runFinishedCallback = () => {};

    this._runFinished = new Promise(f => runFinishedCallback = f);

    try {
      this._entries = new Map(runPayload.entries.map(e => [e.testId, e]));
      await this._loadIfNeeded();
      const fileSuite = await this._loader.loadTestFile(runPayload.file);
      let anyPool;

      const suite = this._project.cloneFileSuite(fileSuite, this._params.repeatEachIndex, test => {
        if (!this._entries.has(test._id)) return false;
        anyPool = test._pool;
        return true;
      });

      if (suite && anyPool) {
        this._fixtureRunner.setPool(anyPool);

        await this._runSuite(suite, []);
      }
    } catch (e) {
      // In theory, we should run above code without any errors.
      // However, in the case we screwed up, or loadTestFile failed in the worker
      // but not in the runner, let's do a fatal error.
      this.unhandledError(e);
    } finally {
      this._reportDone();

      runFinishedCallback();
    }
  }

  async _runSuite(suite, annotations) {
    // When stopped, do not run a suite. But if we have started running the suite with hooks,
    // always finish the hooks.
    if (this._isStopped) return;
    annotations = annotations.concat(suite._annotations);

    for (const beforeAllModifier of suite._modifiers) {
      if (!this._fixtureRunner.dependsOnWorkerFixturesOnly(beforeAllModifier.fn, beforeAllModifier.location)) continue; // TODO: separate timeout for beforeAll modifiers?

      const result = await (0, _async.raceAgainstDeadline)(this._fixtureRunner.resolveParametersAndRunHookOrTest(beforeAllModifier.fn, this._workerInfo, undefined), this._deadline());

      if (result.timedOut) {
        if (!this._fatalError) this._fatalError = (0, _util2.serializeError)(new Error(`Timeout of ${this._project.config.timeout}ms exceeded while running ${beforeAllModifier.type} modifier`));
        this.stop();
      }

      if (!!result.result) annotations.push({
        type: beforeAllModifier.type,
        description: beforeAllModifier.description
      });
    }

    for (const hook of suite._allHooks) {
      var _this$_entries$get;

      if (hook._type !== 'beforeAll') continue;
      const firstTest = suite.allTests()[0];
      await this._runTestOrAllHook(hook, annotations, ((_this$_entries$get = this._entries.get(firstTest._id)) === null || _this$_entries$get === void 0 ? void 0 : _this$_entries$get.retry) || 0);
    }

    for (const entry of suite._entries) {
      if (entry instanceof _test.Suite) {
        await this._runSuite(entry, annotations);
      } else {
        const runEntry = this._entries.get(entry._id);

        if (runEntry && !this._isStopped) await this._runTestOrAllHook(entry, annotations, runEntry.retry);
      }
    }

    for (const hook of suite._allHooks) {
      if (hook._type !== 'afterAll') continue;
      await this._runTestOrAllHook(hook, annotations, 0);
    }
  }

  async _runTestOrAllHook(test, annotations, retry) {
    const reportEvents = test._type === 'test';
    const startTime = (0, _util2.monotonicTime)();
    const startWallTime = Date.now();
    let deadlineRunner;
    const testId = test._id;

    const baseOutputDir = (() => {
      const relativeTestFilePath = _path.default.relative(this._project.config.testDir, test._requireFile.replace(/\.(spec|test)\.(js|ts|mjs)$/, ''));

      const sanitizedRelativePath = relativeTestFilePath.replace(process.platform === 'win32' ? new RegExp('\\\\', 'g') : new RegExp('/', 'g'), '-');
      const fullTitleWithoutSpec = test.titlePath().slice(1).join(' ') + (test._type === 'test' ? '' : '-worker' + this._params.workerIndex);
      let testOutputDir = sanitizedRelativePath + '-' + (0, _util2.sanitizeForFilePath)(fullTitleWithoutSpec);
      if (this._uniqueProjectNamePathSegment) testOutputDir += '-' + this._uniqueProjectNamePathSegment;
      if (retry) testOutputDir += '-retry' + retry;
      if (this._params.repeatEachIndex) testOutputDir += '-repeat' + this._params.repeatEachIndex;
      return _path.default.join(this._project.config.outputDir, testOutputDir);
    })();

    let testFinishedCallback = () => {};

    let lastStepId = 0;
    const testInfo = {
      workerIndex: this._params.workerIndex,
      project: this._project.config,
      config: this._loader.fullConfig(),
      title: test.title,
      file: test.location.file,
      line: test.location.line,
      column: test.location.column,
      fn: test.fn,
      repeatEachIndex: this._params.repeatEachIndex,
      retry,
      expectedStatus: test.expectedStatus,
      annotations: [],
      attachments: [],
      duration: 0,
      status: 'passed',
      stdout: [],
      stderr: [],
      timeout: this._project.config.timeout,
      snapshotSuffix: '',
      outputDir: baseOutputDir,
      outputPath: (...pathSegments) => {
        _fs.default.mkdirSync(baseOutputDir, {
          recursive: true
        });

        return _path.default.join(baseOutputDir, ...pathSegments);
      },
      snapshotPath: snapshotName => {
        let suffix = '';
        if (this._projectNamePathSegment) suffix += '-' + this._projectNamePathSegment;
        if (testInfo.snapshotSuffix) suffix += '-' + testInfo.snapshotSuffix;

        const ext = _path.default.extname(snapshotName);

        if (ext) snapshotName = (0, _util2.sanitizeForFilePath)(snapshotName.substring(0, snapshotName.length - ext.length)) + suffix + ext;else snapshotName = (0, _util2.sanitizeForFilePath)(snapshotName) + suffix;
        return _path.default.join(test._requireFile + '-snapshots', snapshotName);
      },
      skip: (...args) => modifier(testInfo, 'skip', args),
      fixme: (...args) => modifier(testInfo, 'fixme', args),
      fail: (...args) => modifier(testInfo, 'fail', args),
      slow: (...args) => modifier(testInfo, 'slow', args),
      setTimeout: timeout => {
        testInfo.timeout = timeout;
        if (deadlineRunner) deadlineRunner.updateDeadline(deadline());
      },
      _testFinished: new Promise(f => testFinishedCallback = f),
      _addStep: (category, title, canHaveChildren) => {
        const stepId = `${category}@${title}@${++lastStepId}`;
        let callbackHandled = false;
        const step = {
          category,
          canHaveChildren,
          complete: error => {
            if (callbackHandled) return;
            callbackHandled = true;
            if (error instanceof Error) error = (0, _util2.serializeError)(error);
            const payload = {
              testId,
              stepId,
              wallTime: Date.now(),
              error
            };
            if (reportEvents) this.emit('stepEnd', payload);
          }
        };
        const payload = {
          testId,
          stepId,
          category,
          canHaveChildren,
          title,
          wallTime: Date.now()
        };
        if (reportEvents) this.emit('stepBegin', payload);
        return step;
      }
    }; // Inherit test.setTimeout() from parent suites.

    for (let suite = test.parent; suite; suite = suite.parent) {
      if (suite._timeout !== undefined) {
        testInfo.setTimeout(suite._timeout);
        break;
      }
    } // Process annotations defined on parent suites.


    for (const annotation of annotations) {
      testInfo.annotations.push(annotation);

      switch (annotation.type) {
        case 'fixme':
        case 'skip':
          testInfo.expectedStatus = 'skipped';
          break;

        case 'fail':
          if (testInfo.expectedStatus !== 'skipped') testInfo.expectedStatus = 'failed';
          break;

        case 'slow':
          testInfo.setTimeout(testInfo.timeout * 3);
          break;
      }
    }

    this._currentTest = {
      testInfo,
      testId,
      type: test._type
    };
    (0, _globals.setCurrentTestInfo)(testInfo);

    const deadline = () => {
      return testInfo.timeout ? startTime + testInfo.timeout : 0;
    };

    if (reportEvents) this.emit('testBegin', buildTestBeginPayload(testId, testInfo, startWallTime));

    if (testInfo.expectedStatus === 'skipped') {
      testInfo.status = 'skipped';
      if (reportEvents) this.emit('testEnd', buildTestEndPayload(testId, testInfo));
      return;
    } // Update the fixture pool - it may differ between tests, but only in test-scoped fixtures.


    this._fixtureRunner.setPool(test._pool);

    this._currentDeadlineRunner = deadlineRunner = new _async.DeadlineRunner(this._runTestWithBeforeHooks(test, testInfo), deadline());
    const result = await deadlineRunner.result; // Do not overwrite test failure upon hook timeout.

    if (result.timedOut && testInfo.status === 'passed') testInfo.status = 'timedOut';
    testFinishedCallback();

    if (!result.timedOut) {
      this._currentDeadlineRunner = deadlineRunner = new _async.DeadlineRunner(this._runAfterHooks(test, testInfo), deadline());
      deadlineRunner.updateDeadline(deadline());
      const hooksResult = await deadlineRunner.result; // Do not overwrite test failure upon hook timeout.

      if (hooksResult.timedOut && testInfo.status === 'passed') testInfo.status = 'timedOut';
    } else {
      // A timed-out test gets a full additional timeout to run after hooks.
      const newDeadline = this._deadline();

      this._currentDeadlineRunner = deadlineRunner = new _async.DeadlineRunner(this._runAfterHooks(test, testInfo), newDeadline);
      await deadlineRunner.result;
    }

    this._currentDeadlineRunner = undefined;
    testInfo.duration = (0, _util2.monotonicTime)() - startTime;
    if (reportEvents) this.emit('testEnd', buildTestEndPayload(testId, testInfo));
    const isFailure = testInfo.status !== 'skipped' && testInfo.status !== testInfo.expectedStatus;
    const preserveOutput = this._loader.fullConfig().preserveOutput === 'always' || this._loader.fullConfig().preserveOutput === 'failures-only' && isFailure;
    if (!preserveOutput) await removeFolderAsync(testInfo.outputDir).catch(e => {});
    this._currentTest = null;
    (0, _globals.setCurrentTestInfo)(null);

    if (isFailure) {
      if (test._type === 'test') {
        this._failedTestId = testId;
      } else if (!this._fatalError) {
        if (testInfo.status === 'timedOut') this._fatalError = {
          message: _safe.default.red(`Timeout of ${testInfo.timeout}ms exceeded in ${test._type} hook.`)
        };else this._fatalError = testInfo.error;
      }

      this.stop();
    }
  }

  async _runBeforeHooks(test, testInfo) {
    try {
      const beforeEachModifiers = [];

      for (let s = test.parent; s; s = s.parent) {
        const modifiers = s._modifiers.filter(modifier => !this._fixtureRunner.dependsOnWorkerFixturesOnly(modifier.fn, modifier.location));

        beforeEachModifiers.push(...modifiers.reverse());
      }

      beforeEachModifiers.reverse();

      for (const modifier of beforeEachModifiers) {
        const result = await this._fixtureRunner.resolveParametersAndRunHookOrTest(modifier.fn, this._workerInfo, testInfo);
        testInfo[modifier.type](!!result, modifier.description);
      }

      await this._runHooks(test.parent, 'beforeEach', testInfo);
    } catch (error) {
      if (error instanceof SkipError) {
        if (testInfo.status === 'passed') testInfo.status = 'skipped';
      } else {
        testInfo.status = 'failed';
        testInfo.error = (0, _util2.serializeError)(error);
      } // Continue running afterEach hooks even after the failure.

    }
  }

  async _runTestWithBeforeHooks(test, testInfo) {
    const step = testInfo._addStep('hook', 'Before Hooks', true);

    if (test._type === 'test') await this._runBeforeHooks(test, testInfo); // Do not run the test when beforeEach hook fails.

    if (testInfo.status === 'failed' || testInfo.status === 'skipped') {
      step.complete(testInfo.error);
      return;
    }

    try {
      await this._fixtureRunner.resolveParametersAndRunHookOrTest(test.fn, this._workerInfo, testInfo, step);
    } catch (error) {
      if (error instanceof SkipError) {
        if (testInfo.status === 'passed') testInfo.status = 'skipped';
      } else {
        // We might fail after the timeout, e.g. due to fixture teardown.
        // Do not overwrite the timeout status.
        if (testInfo.status === 'passed') testInfo.status = 'failed'; // Keep the error even in the case of timeout, if there was no error before.

        if (!('error' in testInfo)) testInfo.error = (0, _util2.serializeError)(error);
      }
    } finally {
      step.complete(testInfo.error);
    }
  }

  async _runAfterHooks(test, testInfo) {
    var _step;

    let step;
    let teardownError;

    try {
      step = testInfo._addStep('hook', 'After Hooks', true);
      if (test._type === 'test') await this._runHooks(test.parent, 'afterEach', testInfo);
    } catch (error) {
      if (!(error instanceof SkipError)) {
        if (testInfo.status === 'passed') testInfo.status = 'failed'; // Do not overwrite test failure error.

        if (!('error' in testInfo)) testInfo.error = (0, _util2.serializeError)(error); // Continue running even after the failure.
      }
    }

    try {
      await this._fixtureRunner.teardownScope('test');
    } catch (error) {
      if (testInfo.status === 'passed') testInfo.status = 'failed'; // Do not overwrite test failure error.

      if (!('error' in testInfo)) {
        testInfo.error = (0, _util2.serializeError)(error);
        teardownError = testInfo.error;
      }
    }

    (_step = step) === null || _step === void 0 ? void 0 : _step.complete(teardownError);
  }

  async _runHooks(suite, type, testInfo) {
    const all = [];

    for (let s = suite; s; s = s.parent) {
      const funcs = s._eachHooks.filter(e => e.type === type).map(e => e.fn);

      all.push(...funcs.reverse());
    }

    if (type === 'beforeEach') all.reverse();
    let error;

    for (const hook of all) {
      try {
        await this._fixtureRunner.resolveParametersAndRunHookOrTest(hook, this._workerInfo, testInfo);
      } catch (e) {
        // Always run all the hooks, and capture the first error.
        error = error || e;
      }
    }

    if (error) throw error;
  }

  _reportDone() {
    const donePayload = {
      failedTestId: this._failedTestId,
      fatalError: this._fatalError
    };
    this.emit('done', donePayload);
    this._fatalError = undefined;
  }

}

exports.WorkerRunner = WorkerRunner;

function buildTestBeginPayload(testId, testInfo, startWallTime) {
  return {
    testId,
    workerIndex: testInfo.workerIndex,
    startWallTime
  };
}

function buildTestEndPayload(testId, testInfo) {
  return {
    testId,
    duration: testInfo.duration,
    status: testInfo.status,
    error: testInfo.error,
    expectedStatus: testInfo.expectedStatus,
    annotations: testInfo.annotations,
    timeout: testInfo.timeout,
    attachments: testInfo.attachments.map(a => {
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

function modifier(testInfo, type, modifierArgs) {
  if (typeof modifierArgs[1] === 'function') {
    throw new Error(['It looks like you are calling test.skip() inside the test and pass a callback.', 'Pass a condition instead and optional description instead:', `test('my test', async ({ page, isMobile }) => {`, `  test.skip(isMobile, 'This test is not applicable on mobile');`, `});`].join('\n'));
  }

  if (modifierArgs.length >= 1 && !modifierArgs[0]) return;
  const description = modifierArgs[1];
  testInfo.annotations.push({
    type,
    description
  });

  if (type === 'slow') {
    testInfo.setTimeout(testInfo.timeout * 3);
  } else if (type === 'skip' || type === 'fixme') {
    testInfo.expectedStatus = 'skipped';
    throw new SkipError('Test is skipped: ' + (description || ''));
  } else if (type === 'fail') {
    if (testInfo.expectedStatus !== 'skipped') testInfo.expectedStatus = 'failed';
  }
}

class SkipError extends Error {}