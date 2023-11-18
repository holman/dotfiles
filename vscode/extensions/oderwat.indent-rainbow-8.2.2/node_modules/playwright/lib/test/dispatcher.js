"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dispatcher = void 0;

var _child_process = _interopRequireDefault(require("child_process"));

var _path = _interopRequireDefault(require("path"));

var _events = require("events");

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
class Dispatcher {
  constructor(loader, testGroups, reporter) {
    this._workers = new Set();
    this._freeWorkers = [];
    this._workerClaimers = [];
    this._testById = new Map();
    this._queue = [];

    this._stopCallback = () => {};

    this._loader = void 0;
    this._reporter = void 0;
    this._hasWorkerErrors = false;
    this._isStopped = false;
    this._failureCount = 0;
    this._loader = loader;
    this._reporter = reporter;
    this._queue = testGroups;

    for (const group of testGroups) {
      for (const test of group.tests) {
        const result = test._appendTestResult(); // When changing this line, change the one in retry too.


        this._testById.set(test._id, {
          test,
          result,
          steps: new Map(),
          stepStack: new Set()
        });
      }
    }
  }

  async run() {
    // Loop in case job schedules more jobs
    while (this._queue.length && !this._isStopped) await this._dispatchQueue();
  }

  async _dispatchQueue() {
    const jobs = [];

    while (this._queue.length) {
      if (this._isStopped) break;

      const testGroup = this._queue.shift();

      const requiredHash = testGroup.workerHash;
      let worker = await this._obtainWorker(testGroup);

      while (worker && worker.hash && worker.hash !== requiredHash) {
        worker.stop();
        worker = await this._obtainWorker(testGroup);
      }

      if (this._isStopped || !worker) break;
      jobs.push(this._runJob(worker, testGroup));
    }

    await Promise.all(jobs);
  }

  async _runJob(worker, testGroup) {
    worker.run(testGroup);

    let doneCallback = () => {};

    const result = new Promise(f => doneCallback = f);

    const doneWithJob = () => {
      worker.removeListener('testBegin', onTestBegin);
      worker.removeListener('testEnd', onTestEnd);
      worker.removeListener('done', onDone);
      worker.removeListener('exit', onExit);
      doneCallback();
    };

    const remainingByTestId = new Map(testGroup.tests.map(e => [e._id, e]));
    let lastStartedTestId;

    const onTestBegin = params => {
      lastStartedTestId = params.testId;
    };

    worker.addListener('testBegin', onTestBegin);

    const onTestEnd = params => {
      remainingByTestId.delete(params.testId);
    };

    worker.addListener('testEnd', onTestEnd);

    const onDone = params => {
      let remaining = [...remainingByTestId.values()]; // We won't file remaining if:
      // - there are no remaining
      // - we are here not because something failed
      // - no unrecoverable worker error

      if (!remaining.length && !params.failedTestId && !params.fatalError) {
        this._freeWorkers.push(worker);

        this._notifyWorkerClaimer();

        doneWithJob();
        return;
      } // When worker encounters error, we will stop it and create a new one.


      worker.stop();
      worker.didFail = true;
      const retryCandidates = new Set(); // In case of fatal error, report first remaining test as failing with this error,
      // and all others as skipped.

      if (params.fatalError) {
        let first = true;

        for (const test of remaining) {
          var _this$_reporter$onTes, _this$_reporter;

          const {
            result
          } = this._testById.get(test._id);

          if (this._hasReachedMaxFailures()) break; // There might be a single test that has started but has not finished yet.

          if (test._id !== lastStartedTestId) (_this$_reporter$onTes = (_this$_reporter = this._reporter).onTestBegin) === null || _this$_reporter$onTes === void 0 ? void 0 : _this$_reporter$onTes.call(_this$_reporter, test, result);
          result.error = params.fatalError;
          result.status = first ? 'failed' : 'skipped';

          this._reportTestEnd(test, result);

          retryCandidates.add(test._id);
          first = false;
        }

        if (first) {
          var _this$_reporter$onErr, _this$_reporter2;

          // We had a fatal error after all tests have passed - most likely in the afterAll hook.
          // Let's just fail the test run.
          this._hasWorkerErrors = true;
          (_this$_reporter$onErr = (_this$_reporter2 = this._reporter).onError) === null || _this$_reporter$onErr === void 0 ? void 0 : _this$_reporter$onErr.call(_this$_reporter2, params.fatalError);
        } // Since we pretend that all remaining tests failed, there is nothing else to run,
        // except for possible retries.


        remaining = [];
      }

      if (params.failedTestId) {
        retryCandidates.add(params.failedTestId);
        let outermostSerialSuite;

        for (let parent = this._testById.get(params.failedTestId).test.parent; parent; parent = parent.parent) {
          if (parent._parallelMode === 'serial') outermostSerialSuite = parent;
        }

        if (outermostSerialSuite) {
          // Failed test belongs to a serial suite. We should skip all future tests
          // from the same serial suite.
          remaining = remaining.filter(test => {
            var _this$_reporter$onTes2, _this$_reporter3;

            let parent = test.parent;

            while (parent && parent !== outermostSerialSuite) parent = parent.parent; // Does not belong to the same serial suite, keep it.


            if (!parent) return true; // Emulate a "skipped" run, and drop this test from remaining.

            const {
              result
            } = this._testById.get(test._id);

            (_this$_reporter$onTes2 = (_this$_reporter3 = this._reporter).onTestBegin) === null || _this$_reporter$onTes2 === void 0 ? void 0 : _this$_reporter$onTes2.call(_this$_reporter3, test, result);
            result.status = 'skipped';

            this._reportTestEnd(test, result);

            return false;
          }); // Add all tests from the same serial suite for possible retry.
          // These will only be retried together, because they have the same
          // "retries" setting and the same number of previous runs.

          outermostSerialSuite.allTests().forEach(test => retryCandidates.add(test._id));
        }
      }

      for (const testId of retryCandidates) {
        const pair = this._testById.get(testId);

        if (!this._isStopped && pair.test.results.length < pair.test.retries + 1) {
          pair.result = pair.test._appendTestResult();
          pair.steps = new Map();
          pair.stepStack = new Set();
          remaining.push(pair.test);
        }
      }

      if (remaining.length) this._queue.unshift({ ...testGroup,
        tests: remaining
      }); // This job is over, we just scheduled another one.

      doneWithJob();
    };

    worker.on('done', onDone);

    const onExit = () => {
      if (worker.didSendStop) onDone({});else onDone({
        fatalError: {
          value: 'Worker process exited unexpectedly'
        }
      });
    };

    worker.on('exit', onExit);
    return result;
  }

  async _obtainWorker(testGroup) {
    const claimWorker = () => {
      if (this._isStopped) return null; // Use available worker.

      if (this._freeWorkers.length) return Promise.resolve(this._freeWorkers.pop()); // Create a new worker.

      if (this._workers.size < this._loader.fullConfig().workers) return this._createWorker(testGroup);
      return null;
    }; // Note: it is important to claim the worker synchronously,
    // so that we won't miss a _notifyWorkerClaimer call while awaiting.


    let worker = claimWorker();

    if (!worker) {
      // Wait for available or stopped worker.
      await new Promise(f => this._workerClaimers.push(f));
      worker = claimWorker();
    }

    return worker;
  }

  async _notifyWorkerClaimer() {
    if (this._isStopped || !this._workerClaimers.length) return;

    const callback = this._workerClaimers.shift();

    callback();
  }

  _createWorker(testGroup) {
    const worker = new Worker(this);
    worker.on('testBegin', params => {
      var _this$_reporter$onTes3, _this$_reporter4;

      if (worker.didFail) {
        // Ignore test-related messages from failed workers, because timed out tests/fixtures
        // may be triggering unexpected messages.
        return;
      }

      if (this._hasReachedMaxFailures()) return;

      const {
        test,
        result: testRun
      } = this._testById.get(params.testId);

      testRun.workerIndex = params.workerIndex;
      testRun.startTime = new Date(params.startWallTime);
      (_this$_reporter$onTes3 = (_this$_reporter4 = this._reporter).onTestBegin) === null || _this$_reporter$onTes3 === void 0 ? void 0 : _this$_reporter$onTes3.call(_this$_reporter4, test, testRun);
    });
    worker.on('testEnd', params => {
      if (worker.didFail) {
        // Ignore test-related messages from failed workers, because timed out tests/fixtures
        // may be triggering unexpected messages.
        return;
      }

      if (this._hasReachedMaxFailures()) return;

      const {
        test,
        result
      } = this._testById.get(params.testId);

      result.duration = params.duration;
      result.error = params.error;
      result.attachments = params.attachments.map(a => ({
        name: a.name,
        path: a.path,
        contentType: a.contentType,
        body: a.body ? Buffer.from(a.body, 'base64') : undefined
      }));
      result.status = params.status;
      test.expectedStatus = params.expectedStatus;
      test.annotations = params.annotations;
      test.timeout = params.timeout;

      this._reportTestEnd(test, result);
    });
    worker.on('stepBegin', params => {
      var _this$_reporter$onSte, _this$_reporter5;

      if (worker.didFail) {
        // Ignore test-related messages from failed workers, because timed out tests/fixtures
        // may be triggering unexpected messages.
        return;
      }

      const {
        test,
        result,
        steps,
        stepStack
      } = this._testById.get(params.testId);

      const parentStep = [...stepStack].pop();
      const step = {
        title: params.title,
        titlePath: () => {
          const parentPath = (parentStep === null || parentStep === void 0 ? void 0 : parentStep.titlePath()) || [];
          return [...parentPath, params.title];
        },
        parent: parentStep,
        category: params.category,
        startTime: new Date(params.wallTime),
        duration: 0,
        steps: [],
        data: {}
      };
      steps.set(params.stepId, step);
      (parentStep || result).steps.push(step);
      if (params.canHaveChildren) stepStack.add(step);
      (_this$_reporter$onSte = (_this$_reporter5 = this._reporter).onStepBegin) === null || _this$_reporter$onSte === void 0 ? void 0 : _this$_reporter$onSte.call(_this$_reporter5, test, result, step);
    });
    worker.on('stepEnd', params => {
      var _this$_reporter$onSte2, _this$_reporter7;

      if (worker.didFail) {
        // Ignore test-related messages from failed workers, because timed out tests/fixtures
        // may be triggering unexpected messages.
        return;
      }

      const {
        test,
        result,
        steps,
        stepStack
      } = this._testById.get(params.testId);

      const step = steps.get(params.stepId);

      if (!step) {
        var _this$_reporter$onStd, _this$_reporter6;

        (_this$_reporter$onStd = (_this$_reporter6 = this._reporter).onStdErr) === null || _this$_reporter$onStd === void 0 ? void 0 : _this$_reporter$onStd.call(_this$_reporter6, 'Internal error: step end without step begin: ' + params.stepId, test, result);
        return;
      }

      step.duration = params.wallTime - step.startTime.getTime();
      if (params.error) step.error = params.error;
      stepStack.delete(step);
      steps.delete(params.stepId);
      (_this$_reporter$onSte2 = (_this$_reporter7 = this._reporter).onStepEnd) === null || _this$_reporter$onSte2 === void 0 ? void 0 : _this$_reporter$onSte2.call(_this$_reporter7, test, result, step);
    });
    worker.on('stdOut', params => {
      var _this$_reporter$onStd3, _this$_reporter9;

      const chunk = chunkFromParams(params);

      if (worker.didFail) {
        var _this$_reporter$onStd2, _this$_reporter8;

        // Note: we keep reading stdout from workers that are currently stopping after failure,
        // to debug teardown issues. However, we avoid spoiling the test result from
        // the next retry.
        (_this$_reporter$onStd2 = (_this$_reporter8 = this._reporter).onStdOut) === null || _this$_reporter$onStd2 === void 0 ? void 0 : _this$_reporter$onStd2.call(_this$_reporter8, chunk);
        return;
      }

      const pair = params.testId ? this._testById.get(params.testId) : undefined;
      if (pair) pair.result.stdout.push(chunk);
      (_this$_reporter$onStd3 = (_this$_reporter9 = this._reporter).onStdOut) === null || _this$_reporter$onStd3 === void 0 ? void 0 : _this$_reporter$onStd3.call(_this$_reporter9, chunk, pair === null || pair === void 0 ? void 0 : pair.test, pair === null || pair === void 0 ? void 0 : pair.result);
    });
    worker.on('stdErr', params => {
      var _this$_reporter$onStd5, _this$_reporter11;

      const chunk = chunkFromParams(params);

      if (worker.didFail) {
        var _this$_reporter$onStd4, _this$_reporter10;

        // Note: we keep reading stderr from workers that are currently stopping after failure,
        // to debug teardown issues. However, we avoid spoiling the test result from
        // the next retry.
        (_this$_reporter$onStd4 = (_this$_reporter10 = this._reporter).onStdErr) === null || _this$_reporter$onStd4 === void 0 ? void 0 : _this$_reporter$onStd4.call(_this$_reporter10, chunk);
        return;
      }

      const pair = params.testId ? this._testById.get(params.testId) : undefined;
      if (pair) pair.result.stderr.push(chunk);
      (_this$_reporter$onStd5 = (_this$_reporter11 = this._reporter).onStdErr) === null || _this$_reporter$onStd5 === void 0 ? void 0 : _this$_reporter$onStd5.call(_this$_reporter11, chunk, pair === null || pair === void 0 ? void 0 : pair.test, pair === null || pair === void 0 ? void 0 : pair.result);
    });
    worker.on('teardownError', ({
      error
    }) => {
      var _this$_reporter$onErr2, _this$_reporter12;

      this._hasWorkerErrors = true;
      (_this$_reporter$onErr2 = (_this$_reporter12 = this._reporter).onError) === null || _this$_reporter$onErr2 === void 0 ? void 0 : _this$_reporter$onErr2.call(_this$_reporter12, error);
    });
    worker.on('exit', () => {
      this._workers.delete(worker);

      this._notifyWorkerClaimer();

      if (this._stopCallback && !this._workers.size) this._stopCallback();
    });

    this._workers.add(worker);

    return worker.init(testGroup).then(() => worker);
  }

  async stop() {
    this._isStopped = true;

    if (this._workers.size) {
      const result = new Promise(f => this._stopCallback = f);

      for (const worker of this._workers) worker.stop();

      await result;
    }

    while (this._workerClaimers.length) this._workerClaimers.shift()();
  }

  _hasReachedMaxFailures() {
    const maxFailures = this._loader.fullConfig().maxFailures;

    return maxFailures > 0 && this._failureCount >= maxFailures;
  }

  _reportTestEnd(test, result) {
    var _this$_reporter$onTes4, _this$_reporter13;

    if (result.status !== 'skipped' && result.status !== test.expectedStatus) ++this._failureCount;
    (_this$_reporter$onTes4 = (_this$_reporter13 = this._reporter).onTestEnd) === null || _this$_reporter$onTes4 === void 0 ? void 0 : _this$_reporter$onTes4.call(_this$_reporter13, test, result);

    const maxFailures = this._loader.fullConfig().maxFailures;

    if (maxFailures && this._failureCount === maxFailures) this.stop().catch(e => {});
  }

  hasWorkerErrors() {
    return this._hasWorkerErrors;
  }

}

exports.Dispatcher = Dispatcher;
let lastWorkerIndex = 0;

class Worker extends _events.EventEmitter {
  constructor(runner) {
    super();
    this.process = void 0;
    this.runner = void 0;
    this.hash = '';
    this.index = void 0;
    this.didSendStop = false;
    this.didFail = false;
    this.runner = runner;
    this.index = lastWorkerIndex++;
    this.process = _child_process.default.fork(_path.default.join(__dirname, 'worker.js'), {
      detached: false,
      env: {
        FORCE_COLOR: process.stdout.isTTY ? '1' : '0',
        DEBUG_COLORS: process.stdout.isTTY ? '1' : '0',
        TEST_WORKER_INDEX: String(this.index),
        ...process.env
      },
      // Can't pipe since piping slows down termination for some reason.
      stdio: ['ignore', 'ignore', process.env.PW_RUNNER_DEBUG ? 'inherit' : 'ignore', 'ipc']
    });
    this.process.on('exit', () => this.emit('exit'));
    this.process.on('error', e => {}); // do not yell at a send to dead process.

    this.process.on('message', message => {
      const {
        method,
        params
      } = message;
      this.emit(method, params);
    });
  }

  async init(testGroup) {
    this.hash = testGroup.workerHash;
    const params = {
      workerIndex: this.index,
      repeatEachIndex: testGroup.repeatEachIndex,
      projectIndex: testGroup.projectIndex,
      loader: this.runner._loader.serialize()
    };
    this.process.send({
      method: 'init',
      params
    });
    await new Promise(f => this.process.once('message', f)); // Ready ack
  }

  run(testGroup) {
    const runPayload = {
      file: testGroup.requireFile,
      entries: testGroup.tests.map(test => {
        return {
          testId: test._id,
          retry: test.results.length - 1
        };
      })
    };
    this.process.send({
      method: 'run',
      params: runPayload
    });
  }

  stop() {
    if (!this.didSendStop) this.process.send({
      method: 'stop'
    });
    this.didSendStop = true;
  }

}

function chunkFromParams(params) {
  if (typeof params.text === 'string') return params.text;
  return Buffer.from(params.buffer, 'base64');
}