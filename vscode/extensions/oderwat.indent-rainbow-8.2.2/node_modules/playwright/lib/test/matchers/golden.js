"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compare = compare;

var _safe = _interopRequireDefault(require("colors/safe"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _jpegJs = _interopRequireDefault(require("jpeg-js"));

var _pixelmatch = _interopRequireDefault(require("pixelmatch"));

var _diff_match_patch = require("../../third_party/diff_match_patch");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright 2017 Google Inc. All rights reserved.
 * Modifications copyright (c) Microsoft Corporation.
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

/* eslint-disable no-console */
// Note: we require the pngjs version of pixelmatch to avoid version mismatches.
const {
  PNG
} = require(require.resolve('pngjs', {
  paths: [require.resolve('pixelmatch')]
}));

const extensionToMimeType = {
  'dat': 'application/octet-string',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'png': 'image/png',
  'txt': 'text/plain'
};
const GoldenComparators = {
  'application/octet-string': compareBuffers,
  'image/png': compareImages,
  'image/jpeg': compareImages,
  'text/plain': compareText
};

function compareBuffers(actualBuffer, expectedBuffer, mimeType) {
  if (!actualBuffer || !(actualBuffer instanceof Buffer)) return {
    errorMessage: 'Actual result should be Buffer.'
  };
  if (Buffer.compare(actualBuffer, expectedBuffer)) return {
    errorMessage: 'Buffers differ'
  };
  return null;
}

function compareImages(actualBuffer, expectedBuffer, mimeType, options = {}) {
  if (!actualBuffer || !(actualBuffer instanceof Buffer)) return {
    errorMessage: 'Actual result should be Buffer.'
  };
  const actual = mimeType === 'image/png' ? PNG.sync.read(actualBuffer) : _jpegJs.default.decode(actualBuffer);
  const expected = mimeType === 'image/png' ? PNG.sync.read(expectedBuffer) : _jpegJs.default.decode(expectedBuffer);

  if (expected.width !== actual.width || expected.height !== actual.height) {
    return {
      errorMessage: `Sizes differ; expected image ${expected.width}px X ${expected.height}px, but got ${actual.width}px X ${actual.height}px. `
    };
  }

  const diff = new PNG({
    width: expected.width,
    height: expected.height
  });
  const count = (0, _pixelmatch.default)(expected.data, actual.data, diff.data, expected.width, expected.height, {
    threshold: 0.2,
    ...options
  });
  return count > 0 ? {
    diff: PNG.sync.write(diff)
  } : null;
}

function compareText(actual, expectedBuffer) {
  if (typeof actual !== 'string') return {
    errorMessage: 'Actual result should be string'
  };
  const expected = expectedBuffer.toString('utf-8');
  if (expected === actual) return null;
  const dmp = new _diff_match_patch.diff_match_patch();
  const d = dmp.diff_main(expected, actual);
  dmp.diff_cleanupSemantic(d);
  return {
    errorMessage: diff_prettyTerminal(d)
  };
}

function compare(actual, name, snapshotPath, outputPath, updateSnapshots, withNegateComparison, options) {
  const snapshotFile = snapshotPath(name);
  const outputFile = outputPath(name);
  const expectedPath = addSuffix(outputFile, '-expected');
  const actualPath = addSuffix(outputFile, '-actual');
  const diffPath = addSuffix(outputFile, '-diff');

  if (!_fs.default.existsSync(snapshotFile)) {
    const isWriteMissingMode = updateSnapshots === 'all' || updateSnapshots === 'missing';
    const commonMissingSnapshotMessage = `${snapshotFile} is missing in snapshots`;

    if (withNegateComparison) {
      const message = `${commonMissingSnapshotMessage}${isWriteMissingMode ? ', matchers using ".not" won\'t write them automatically.' : '.'}`;
      return {
        pass: true,
        message
      };
    }

    if (isWriteMissingMode) {
      _fs.default.mkdirSync(_path.default.dirname(snapshotFile), {
        recursive: true
      });

      _fs.default.writeFileSync(snapshotFile, actual);

      _fs.default.writeFileSync(actualPath, actual);
    }

    const message = `${commonMissingSnapshotMessage}${isWriteMissingMode ? ', writing actual.' : '.'}`;

    if (updateSnapshots === 'all') {
      console.log(message);
      return {
        pass: true,
        message
      };
    }

    return {
      pass: false,
      message
    };
  }

  const expected = _fs.default.readFileSync(snapshotFile);

  const extension = _path.default.extname(snapshotFile).substring(1);

  const mimeType = extensionToMimeType[extension] || 'application/octet-string';
  const comparator = GoldenComparators[mimeType];

  if (!comparator) {
    return {
      pass: false,
      message: 'Failed to find comparator with type ' + mimeType + ': ' + snapshotFile
    };
  }

  const result = comparator(actual, expected, mimeType, options);

  if (!result) {
    if (withNegateComparison) {
      const message = [_safe.default.red('Snapshot comparison failed:'), '', indent('Expected result should be different from the actual one.', '  ')].join('\n');
      return {
        pass: true,
        message
      };
    }

    return {
      pass: true
    };
  }

  if (withNegateComparison) {
    return {
      pass: false
    };
  }

  if (updateSnapshots === 'all') {
    _fs.default.mkdirSync(_path.default.dirname(snapshotFile), {
      recursive: true
    });

    _fs.default.writeFileSync(snapshotFile, actual);

    console.log(snapshotFile + ' does not match, writing actual.');
    return {
      pass: true,
      message: snapshotFile + ' running with --update-snapshots, writing actual.'
    };
  }

  _fs.default.writeFileSync(expectedPath, expected);

  _fs.default.writeFileSync(actualPath, actual);

  if (result.diff) _fs.default.writeFileSync(diffPath, result.diff);
  const output = [_safe.default.red(`Snapshot comparison failed:`)];

  if (result.errorMessage) {
    output.push('');
    output.push(indent(result.errorMessage, '  '));
  }

  output.push('');
  output.push(`Expected: ${_safe.default.yellow(expectedPath)}`);
  output.push(`Received: ${_safe.default.yellow(actualPath)}`);
  if (result.diff) output.push(`    Diff: ${_safe.default.yellow(diffPath)}`);
  return {
    pass: false,
    message: output.join('\n'),
    expectedPath,
    actualPath,
    diffPath: result.diff ? diffPath : undefined,
    mimeType
  };
}

function indent(lines, tab) {
  return lines.replace(/^(?=.+$)/gm, tab);
}

function addSuffix(filePath, suffix, customExtension) {
  const dirname = _path.default.dirname(filePath);

  const ext = _path.default.extname(filePath);

  const name = _path.default.basename(filePath, ext);

  return _path.default.join(dirname, name + suffix + (customExtension || ext));
}

function diff_prettyTerminal(diffs) {
  const html = [];

  for (let x = 0; x < diffs.length; x++) {
    const op = diffs[x][0]; // Operation (insert, delete, equal)

    const data = diffs[x][1]; // Text of change.

    const text = data;

    switch (op) {
      case _diff_match_patch.DIFF_INSERT:
        html[x] = _safe.default.green(text);
        break;

      case _diff_match_patch.DIFF_DELETE:
        html[x] = _safe.default.strikethrough(_safe.default.red(text));
        break;

      case _diff_match_patch.DIFF_EQUAL:
        html[x] = text;
        break;
    }
  }

  return html.join('');
}