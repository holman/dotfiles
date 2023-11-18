"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expect = void 0;

var _expect = _interopRequireDefault(require("expect"));

var _matchers = require("./matchers/matchers");

var _toMatchSnapshot = require("./matchers/toMatchSnapshot");

var _matchers2 = _interopRequireDefault(require("expect/build/matchers"));

var _globals = require("./globals");

var _util = require("./util");

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
const expect = _expect.default;
exports.expect = expect;

_expect.default.setState({
  expand: false
});

const customMatchers = {
  toBeChecked: _matchers.toBeChecked,
  toBeDisabled: _matchers.toBeDisabled,
  toBeEditable: _matchers.toBeEditable,
  toBeEmpty: _matchers.toBeEmpty,
  toBeEnabled: _matchers.toBeEnabled,
  toBeFocused: _matchers.toBeFocused,
  toBeHidden: _matchers.toBeHidden,
  toBeVisible: _matchers.toBeVisible,
  toContainText: _matchers.toContainText,
  toHaveAttribute: _matchers.toHaveAttribute,
  toHaveClass: _matchers.toHaveClass,
  toHaveCount: _matchers.toHaveCount,
  toHaveCSS: _matchers.toHaveCSS,
  toHaveId: _matchers.toHaveId,
  toHaveJSProperty: _matchers.toHaveJSProperty,
  toHaveText: _matchers.toHaveText,
  toHaveTitle: _matchers.toHaveTitle,
  toHaveURL: _matchers.toHaveURL,
  toHaveValue: _matchers.toHaveValue,
  toMatchSnapshot: _toMatchSnapshot.toMatchSnapshot
};

function wrap(matcherName, matcher) {
  return function (...args) {
    const testInfo = (0, _globals.currentTestInfo)();
    if (!testInfo) return matcher.call(this, ...args);
    const INTERNAL_STACK_LENGTH = 3;
    const stackLines = new Error().stack.split('\n').slice(INTERNAL_STACK_LENGTH + 1);

    const step = testInfo._addStep('expect', `expect${this.isNot ? '.not' : ''}.${matcherName}`, true);

    const reportStepEnd = result => {
      const success = result.pass !== this.isNot;
      let error;

      if (!success) {
        const message = result.message();
        error = {
          message,
          stack: message + '\n' + stackLines.join('\n')
        };
      }

      step.complete(error);
      return result;
    };

    const reportStepError = error => {
      step.complete((0, _util.serializeError)(error));
      throw error;
    };

    try {
      const result = matcher.call(this, ...args);
      if (result instanceof Promise) return result.then(reportStepEnd).catch(reportStepError);
      return reportStepEnd(result);
    } catch (e) {
      reportStepError(e);
    }
  };
}

const wrappedMatchers = {};

for (const matcherName in _matchers2.default) wrappedMatchers[matcherName] = wrap(matcherName, _matchers2.default[matcherName]);

for (const matcherName in customMatchers) wrappedMatchers[matcherName] = wrap(matcherName, customMatchers[matcherName]);

_expect.default.extend(wrappedMatchers);