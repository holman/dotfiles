"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rootTestType = exports.TestTypeImpl = exports.DeclaredFixtures = void 0;

var _expect = require("./expect");

var _globals = require("./globals");

var _test = require("./test");

var _transform = require("./transform");

var _util = require("./util");

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
const countByFile = new Map();

class DeclaredFixtures {
  constructor() {
    this.testType = void 0;
    this.location = void 0;
  }

}

exports.DeclaredFixtures = DeclaredFixtures;

class TestTypeImpl {
  constructor(fixtures) {
    this.fixtures = void 0;
    this.test = void 0;
    this.fixtures = fixtures;
    const test = (0, _transform.wrapFunctionWithLocation)(this._createTest.bind(this, 'default'));
    test.expect = _expect.expect;
    test.only = (0, _transform.wrapFunctionWithLocation)(this._createTest.bind(this, 'only'));
    test.describe = (0, _transform.wrapFunctionWithLocation)(this._describe.bind(this, 'default'));
    test.describe.only = (0, _transform.wrapFunctionWithLocation)(this._describe.bind(this, 'only'));
    test.describe.parallel = (0, _transform.wrapFunctionWithLocation)(this._describe.bind(this, 'parallel'));
    test.describe.parallel.only = (0, _transform.wrapFunctionWithLocation)(this._describe.bind(this, 'parallel.only'));
    test.describe.serial = (0, _transform.wrapFunctionWithLocation)(this._describe.bind(this, 'serial'));
    test.describe.serial.only = (0, _transform.wrapFunctionWithLocation)(this._describe.bind(this, 'serial.only'));
    test.beforeEach = (0, _transform.wrapFunctionWithLocation)(this._hook.bind(this, 'beforeEach'));
    test.afterEach = (0, _transform.wrapFunctionWithLocation)(this._hook.bind(this, 'afterEach'));
    test.beforeAll = (0, _transform.wrapFunctionWithLocation)(this._hook.bind(this, 'beforeAll'));
    test.afterAll = (0, _transform.wrapFunctionWithLocation)(this._hook.bind(this, 'afterAll'));
    test.skip = (0, _transform.wrapFunctionWithLocation)(this._modifier.bind(this, 'skip'));
    test.fixme = (0, _transform.wrapFunctionWithLocation)(this._modifier.bind(this, 'fixme'));
    test.fail = (0, _transform.wrapFunctionWithLocation)(this._modifier.bind(this, 'fail'));
    test.slow = (0, _transform.wrapFunctionWithLocation)(this._modifier.bind(this, 'slow'));
    test.setTimeout = (0, _transform.wrapFunctionWithLocation)(this._setTimeout.bind(this));
    test.step = (0, _transform.wrapFunctionWithLocation)(this._step.bind(this));
    test.use = (0, _transform.wrapFunctionWithLocation)(this._use.bind(this));
    test.extend = (0, _transform.wrapFunctionWithLocation)(this._extend.bind(this));
    test.declare = (0, _transform.wrapFunctionWithLocation)(this._declare.bind(this));
    this.test = test;
  }

  _createTest(type, location, title, fn) {
    throwIfRunningInsideJest();
    const suite = (0, _globals.currentlyLoadingFileSuite)();
    if (!suite) throw (0, _util.errorWithLocation)(location, `test() can only be called in a test file`);
    const ordinalInFile = countByFile.get(suite._requireFile) || 0;
    countByFile.set(suite._requireFile, ordinalInFile + 1);
    const test = new _test.TestCase('test', title, fn, ordinalInFile, this, location);
    test._requireFile = suite._requireFile;

    suite._addTest(test);

    if (type === 'only') test._only = true;
    if (type === 'skip') test.expectedStatus = 'skipped';
  }

  _describe(type, location, title, fn) {
    throwIfRunningInsideJest();
    const suite = (0, _globals.currentlyLoadingFileSuite)();
    if (!suite) throw (0, _util.errorWithLocation)(location, `describe() can only be called in a test file`);

    if (typeof title === 'function') {
      throw (0, _util.errorWithLocation)(location, ['It looks like you are calling describe() without the title. Pass the title as a first argument:', `test.describe('my test group', () => {`, `  // Declare tests here`, `});`].join('\n'));
    }

    const child = new _test.Suite(title);
    child._requireFile = suite._requireFile;
    child._isDescribe = true;
    child.location = location;

    suite._addSuite(child);

    if (type === 'only' || type === 'serial.only' || type === 'parallel.only') child._only = true;
    if (type === 'serial' || type === 'serial.only') child._parallelMode = 'serial';
    if (type === 'parallel' || type === 'parallel.only') child._parallelMode = 'parallel';

    for (let parent = suite; parent; parent = parent.parent) {
      if (parent._parallelMode === 'serial' && child._parallelMode === 'parallel') throw (0, _util.errorWithLocation)(location, 'describe.parallel cannot be nested inside describe.serial');
      if (parent._parallelMode === 'parallel' && child._parallelMode === 'serial') throw (0, _util.errorWithLocation)(location, 'describe.serial cannot be nested inside describe.parallel');
    }

    (0, _globals.setCurrentlyLoadingFileSuite)(child);
    fn();
    (0, _globals.setCurrentlyLoadingFileSuite)(suite);
  }

  _hook(name, location, fn) {
    const suite = (0, _globals.currentlyLoadingFileSuite)();
    if (!suite) throw (0, _util.errorWithLocation)(location, `${name} hook can only be called in a test file`);

    if (name === 'beforeAll' || name === 'afterAll') {
      const sameTypeCount = suite._allHooks.filter(hook => hook._type === name).length;

      const suffix = sameTypeCount ? String(sameTypeCount) : '';
      const hook = new _test.TestCase(name, name + suffix, fn, 0, this, location);
      hook._requireFile = suite._requireFile;

      suite._addAllHook(hook);
    } else {
      suite._eachHooks.push({
        type: name,
        fn,
        location
      });
    }
  }

  _modifier(type, location, ...modifierArgs) {
    const suite = (0, _globals.currentlyLoadingFileSuite)();

    if (suite) {
      if (typeof modifierArgs[0] === 'string' && typeof modifierArgs[1] === 'function') {
        // Support for test.skip('title', () => {})
        this._createTest('skip', location, modifierArgs[0], modifierArgs[1]);

        return;
      }

      if (typeof modifierArgs[0] === 'function') {
        suite._modifiers.push({
          type,
          fn: modifierArgs[0],
          location,
          description: modifierArgs[1]
        });
      } else {
        if (modifierArgs.length >= 1 && !modifierArgs[0]) return;
        const description = modifierArgs[1];

        suite._annotations.push({
          type,
          description
        });
      }

      return;
    }

    const testInfo = (0, _globals.currentTestInfo)();
    if (!testInfo) throw (0, _util.errorWithLocation)(location, `test.${type}() can only be called inside test, describe block or fixture`);
    if (typeof modifierArgs[0] === 'function') throw (0, _util.errorWithLocation)(location, `test.${type}() with a function can only be called inside describe block`);
    testInfo[type](...modifierArgs);
  }

  _setTimeout(location, timeout) {
    const suite = (0, _globals.currentlyLoadingFileSuite)();

    if (suite) {
      suite._timeout = timeout;
      return;
    }

    const testInfo = (0, _globals.currentTestInfo)();
    if (!testInfo) throw (0, _util.errorWithLocation)(location, `test.setTimeout() can only be called from a test`);
    testInfo.setTimeout(timeout);
  }

  _use(location, fixtures) {
    const suite = (0, _globals.currentlyLoadingFileSuite)();
    if (!suite) throw (0, _util.errorWithLocation)(location, `test.use() can only be called in a test file`);

    suite._use.push({
      fixtures,
      location
    });
  }

  async _step(location, title, body) {
    const testInfo = (0, _globals.currentTestInfo)();
    if (!testInfo) throw (0, _util.errorWithLocation)(location, `test.step() can only be called from a test`);

    const step = testInfo._addStep('test.step', title, true);

    try {
      await body();
      step.complete();
    } catch (e) {
      step.complete((0, _util.serializeError)(e));
      throw e;
    }
  }

  _extend(location, fixtures) {
    const fixturesWithLocation = {
      fixtures,
      location
    };
    return new TestTypeImpl([...this.fixtures, fixturesWithLocation]).test;
  }

  _declare(location) {
    const declared = new DeclaredFixtures();
    declared.location = location;
    const child = new TestTypeImpl([...this.fixtures, declared]);
    declared.testType = child;
    return child.test;
  }

}

exports.TestTypeImpl = TestTypeImpl;

function throwIfRunningInsideJest() {
  if (process.env.JEST_WORKER_ID) {
    throw new Error(`Playwright Test needs to be invoked via 'npx playwright test' and excluded from Jest test runs.\n` + `Creating one directory for Playwright tests and one for Jest is the recommended way of doing it.\n` + `See https://playwright.dev/docs/intro/ for more information about Playwright Test.`);
  }
}

const rootTestType = new TestTypeImpl([]);
exports.rootTestType = rootTestType;