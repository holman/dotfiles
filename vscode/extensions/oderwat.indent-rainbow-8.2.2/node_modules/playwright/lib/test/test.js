"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestCase = exports.Suite = void 0;

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
class Base {
  constructor(title) {
    this.title = void 0;
    this.parent = void 0;
    this._only = false;
    this._requireFile = '';
    this.title = title;
  }

  titlePath() {
    const titlePath = this.parent ? this.parent.titlePath() : [];
    titlePath.push(this.title);
    return titlePath;
  }

}

class Suite extends Base {
  constructor(...args) {
    super(...args);
    this.suites = [];
    this.tests = [];
    this.location = void 0;
    this._use = [];
    this._isDescribe = false;
    this._entries = [];
    this._allHooks = [];
    this._eachHooks = [];
    this._timeout = void 0;
    this._annotations = [];
    this._modifiers = [];
    this._parallelMode = 'default';
    this._projectConfig = void 0;
  }

  _addTest(test) {
    test.parent = this;
    this.tests.push(test);

    this._entries.push(test);
  }

  _addSuite(suite) {
    suite.parent = this;
    this.suites.push(suite);

    this._entries.push(suite);
  }

  _addAllHook(hook) {
    hook.parent = this;

    this._allHooks.push(hook);
  }

  allTests() {
    const result = [];

    const visit = suite => {
      for (const entry of suite._entries) {
        if (entry instanceof Suite) visit(entry);else result.push(entry);
      }
    };

    visit(this);
    return result;
  }

  _getOnlyItems() {
    const items = [];
    if (this._only) items.push(this);

    for (const suite of this.suites) items.push(...suite._getOnlyItems());

    items.push(...this.tests.filter(test => test._only));
    return items;
  }

  _clone() {
    const suite = new Suite(this.title);
    suite._only = this._only;
    suite.location = this.location;
    suite._requireFile = this._requireFile;
    suite._use = this._use.slice();
    suite._eachHooks = this._eachHooks.slice();
    suite._timeout = this._timeout;
    suite._annotations = this._annotations.slice();
    suite._modifiers = this._modifiers.slice();
    suite._isDescribe = this._isDescribe;
    suite._parallelMode = this._parallelMode;
    return suite;
  }

}

exports.Suite = Suite;

class TestCase extends Base {
  constructor(type, title, fn, ordinalInFile, testType, location) {
    super(title);
    this.fn = void 0;
    this.results = [];
    this.location = void 0;
    this.expectedStatus = 'passed';
    this.timeout = 0;
    this.annotations = [];
    this.projectName = '';
    this.retries = 0;
    this._type = void 0;
    this._ordinalInFile = void 0;
    this._testType = void 0;
    this._id = '';
    this._workerHash = '';
    this._pool = void 0;
    this._repeatEachIndex = 0;
    this._projectIndex = 0;
    this._type = type;
    this.fn = fn;
    this._ordinalInFile = ordinalInFile;
    this._testType = testType;
    this.location = location;
  }

  outcome() {
    const nonSkipped = this.results.filter(result => result.status !== 'skipped');
    if (!nonSkipped.length) return 'skipped';
    if (nonSkipped.every(result => result.status === this.expectedStatus)) return 'expected';
    if (nonSkipped.some(result => result.status === this.expectedStatus)) return 'flaky';
    return 'unexpected';
  }

  ok() {
    const status = this.outcome();
    return status === 'expected' || status === 'flaky' || status === 'skipped';
  }

  _clone() {
    const test = new TestCase(this._type, this.title, this.fn, this._ordinalInFile, this._testType, this.location);
    test._only = this._only;
    test._requireFile = this._requireFile;
    test.expectedStatus = this.expectedStatus;
    return test;
  }

  _appendTestResult() {
    const result = {
      retry: this.results.length,
      workerIndex: 0,
      duration: 0,
      startTime: new Date(),
      stdout: [],
      stderr: [],
      attachments: [],
      status: 'skipped',
      steps: []
    };
    this.results.push(result);
    return result;
  }

}

exports.TestCase = TestCase;