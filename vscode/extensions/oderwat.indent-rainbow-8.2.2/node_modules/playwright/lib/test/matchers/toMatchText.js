"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toMatchText = toMatchText;
exports.normalizeWhiteSpace = normalizeWhiteSpace;

var _print = require("expect/build/print");

var _utils = require("../../utils/utils");

var _globals = require("../globals");

var _util = require("../util");

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
async function toMatchText(matcherName, receiver, receiverType, query, expected, options = {}) {
  const testInfo = (0, _globals.currentTestInfo)();
  if (!testInfo) throw new Error(`${matcherName} must be called during the test`);
  (0, _util.expectType)(receiver, receiverType, matcherName);
  const matcherOptions = {
    isNot: this.isNot,
    promise: this.promise
  };

  if (!(typeof expected === 'string') && !(expected && typeof expected.test === 'function')) {
    throw new Error(this.utils.matcherErrorMessage(this.utils.matcherHint(matcherName, undefined, undefined, matcherOptions), `${this.utils.EXPECTED_COLOR('expected')} value must be a string or regular expression`, this.utils.printWithType('Expected', expected, this.utils.printExpected)));
  }

  let received;
  let pass = false;
  if (options.normalizeWhiteSpace && (0, _utils.isString)(expected)) expected = normalizeWhiteSpace(expected);
  await (0, _util.pollUntilDeadline)(testInfo, async remainingTime => {
    received = await query(remainingTime);
    if (options.normalizeWhiteSpace && (0, _utils.isString)(expected)) received = normalizeWhiteSpace(received);
    if (options.matchSubstring) pass = received.includes(expected);else if (typeof expected === 'string') pass = received === expected;else pass = expected.test(received);
    return pass === !matcherOptions.isNot;
  }, options.timeout, testInfo._testFinished);
  const stringSubstring = options.matchSubstring ? 'substring' : 'string';
  const message = pass ? () => typeof expected === 'string' ? this.utils.matcherHint(matcherName, undefined, undefined, matcherOptions) + '\n\n' + `Expected ${stringSubstring}: not ${this.utils.printExpected(expected)}\n` + `Received string:        ${(0, _print.printReceivedStringContainExpectedSubstring)(received, received.indexOf(expected), expected.length)}` : this.utils.matcherHint(matcherName, undefined, undefined, matcherOptions) + '\n\n' + `Expected pattern: not ${this.utils.printExpected(expected)}\n` + `Received string:      ${(0, _print.printReceivedStringContainExpectedResult)(received, typeof expected.exec === 'function' ? expected.exec(received) : null)}` : () => {
    const labelExpected = `Expected ${typeof expected === 'string' ? stringSubstring : 'pattern'}`;
    const labelReceived = 'Received string';
    return this.utils.matcherHint(matcherName, undefined, undefined, matcherOptions) + '\n\n' + this.utils.printDiffOrStringify(expected, received, labelExpected, labelReceived, this.expand !== false);
  };
  return {
    message,
    pass
  };
}

function normalizeWhiteSpace(s) {
  return s.trim().replace(/\s+/g, ' ');
}