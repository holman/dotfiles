"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pollUntilDeadline = pollUntilDeadline;
exports.serializeError = serializeError;
exports.monotonicTime = monotonicTime;
exports.isRegExp = isRegExp;
exports.createFileMatcher = createFileMatcher;
exports.createTitleMatcher = createTitleMatcher;
exports.mergeObjects = mergeObjects;
exports.wrapInPromise = wrapInPromise;
exports.forceRegExp = forceRegExp;
exports.relativeFilePath = relativeFilePath;
exports.formatLocation = formatLocation;
exports.errorWithFile = errorWithFile;
exports.errorWithLocation = errorWithLocation;
exports.expectType = expectType;
exports.sanitizeForFilePath = sanitizeForFilePath;

var _util = _interopRequireDefault(require("util"));

var _path = _interopRequireDefault(require("path"));

var _url = _interopRequireDefault(require("url"));

var _minimatch = _interopRequireDefault(require("minimatch"));

var _ = require("../..");

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
async function pollUntilDeadline(testInfo, func, pollTime, deadlinePromise) {
  var _testInfo$project$exp;

  let defaultExpectTimeout = (_testInfo$project$exp = testInfo.project.expect) === null || _testInfo$project$exp === void 0 ? void 0 : _testInfo$project$exp.timeout;
  if (typeof defaultExpectTimeout === 'undefined') defaultExpectTimeout = 5000;
  pollTime = pollTime === 0 ? 0 : pollTime || defaultExpectTimeout;
  const deadline = pollTime ? monotonicTime() + pollTime : 0;
  let aborted = false;
  const abortedPromise = deadlinePromise.then(() => {
    aborted = true;
    return true;
  });
  const pollIntervals = [100, 250, 500];
  let attempts = 0;

  while (!aborted) {
    const remainingTime = deadline ? deadline - monotonicTime() : 1000 * 3600 * 24;
    if (remainingTime <= 0) break;

    try {
      // Either aborted, or func() returned truthy.
      const result = await Promise.race([func(remainingTime), abortedPromise]);
      if (result) return;
    } catch (e) {
      if (e instanceof _.errors.TimeoutError) return;
      throw e;
    }

    let timer;
    const timeoutPromise = new Promise(f => timer = setTimeout(f, pollIntervals[attempts++] || 1000));
    await Promise.race([abortedPromise, timeoutPromise]);
    clearTimeout(timer);
  }
}

function serializeError(error) {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack
    };
  }

  return {
    value: _util.default.inspect(error)
  };
}

function monotonicTime() {
  const [seconds, nanoseconds] = process.hrtime();
  return seconds * 1000 + (nanoseconds / 1000000 | 0);
}

function isRegExp(e) {
  return e && typeof e === 'object' && (e instanceof RegExp || Object.prototype.toString.call(e) === '[object RegExp]');
}

function createFileMatcher(patterns) {
  const reList = [];
  const filePatterns = [];

  for (const pattern of Array.isArray(patterns) ? patterns : [patterns]) {
    if (isRegExp(pattern)) {
      reList.push(pattern);
    } else {
      if (!pattern.startsWith('**/') && !pattern.startsWith('**/')) filePatterns.push('**/' + pattern);else filePatterns.push(pattern);
    }
  }

  return filePath => {
    for (const re of reList) {
      re.lastIndex = 0;
      if (re.test(filePath)) return true;
    } // Windows might still recieve unix style paths from Cygwin or Git Bash.
    // Check against the file url as well.


    if (_path.default.sep === '\\') {
      const fileURL = _url.default.pathToFileURL(filePath).href;

      for (const re of reList) {
        re.lastIndex = 0;
        if (re.test(fileURL)) return true;
      }
    }

    for (const pattern of filePatterns) {
      if ((0, _minimatch.default)(filePath, pattern, {
        nocase: true,
        dot: true
      })) return true;
    }

    return false;
  };
}

function createTitleMatcher(patterns) {
  const reList = Array.isArray(patterns) ? patterns : [patterns];
  return value => {
    for (const re of reList) {
      re.lastIndex = 0;
      if (re.test(value)) return true;
    }

    return false;
  };
}

function mergeObjects(a, b) {
  const result = { ...a
  };

  if (!Object.is(b, undefined)) {
    for (const [name, value] of Object.entries(b)) {
      if (!Object.is(value, undefined)) result[name] = value;
    }
  }

  return result;
}

async function wrapInPromise(value) {
  return value;
}

function forceRegExp(pattern) {
  const match = pattern.match(/^\/(.*)\/([gi]*)$/);
  if (match) return new RegExp(match[1], match[2]);
  return new RegExp(pattern, 'g');
}

function relativeFilePath(file) {
  if (!_path.default.isAbsolute(file)) return file;
  return _path.default.relative(process.cwd(), file);
}

function formatLocation(location) {
  return relativeFilePath(location.file) + ':' + location.line + ':' + location.column;
}

function errorWithFile(file, message) {
  return new Error(`${relativeFilePath(file)}: ${message}`);
}

function errorWithLocation(location, message) {
  return new Error(`${formatLocation(location)}: ${message}`);
}

function expectType(receiver, type, matcherName) {
  if (typeof receiver !== 'object' || receiver.constructor.name !== type) throw new Error(`${matcherName} can be only used with ${type} object`);
}

function sanitizeForFilePath(s) {
  return s.replace(/[\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]+/g, '-');
}