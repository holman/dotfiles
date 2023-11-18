"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toBeTruthy = toBeTruthy;

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
async function toBeTruthy(matcherName, receiver, receiverType, query, options = {}) {
  const testInfo = (0, _globals.currentTestInfo)();
  if (!testInfo) throw new Error(`${matcherName} must be called during the test`);
  (0, _util.expectType)(receiver, receiverType, matcherName);
  const matcherOptions = {
    isNot: this.isNot,
    promise: this.promise
  };
  let received;
  let pass = false;
  await (0, _util.pollUntilDeadline)(testInfo, async remainingTime => {
    received = await query(remainingTime);
    pass = !!received;
    return pass === !matcherOptions.isNot;
  }, options.timeout, testInfo._testFinished);

  const message = () => {
    return this.utils.matcherHint(matcherName, undefined, '', matcherOptions);
  };

  return {
    message,
    pass
  };
}