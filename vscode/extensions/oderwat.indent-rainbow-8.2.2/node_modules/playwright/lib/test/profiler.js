"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startProfiling = startProfiling;
exports.stopProfiling = stopProfiling;

var fs = _interopRequireWildcard(require("fs"));

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
const profileDir = process.env.PWTEST_PROFILE_DIR || '';
let session;

async function startProfiling() {
  if (!profileDir) return;
  session = new (require('inspector').Session)();
  session.connect();
  await new Promise(f => {
    session.post('Profiler.enable', () => {
      session.post('Profiler.start', f);
    });
  });
}

async function stopProfiling(workerIndex) {
  if (!profileDir) return;
  await new Promise(f => session.post('Profiler.stop', (err, {
    profile
  }) => {
    if (!err) {
      fs.mkdirSync(profileDir, {
        recursive: true
      });
      fs.writeFileSync(path.join(profileDir, workerIndex === undefined ? 'runner.json' : 'worker' + workerIndex + '.json'), JSON.stringify(profile));
    }

    f();
  }));
}