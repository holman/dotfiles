"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trace = exports.PersistentSnapshotStorage = exports.TraceModel = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _snapshotStorage = require("../../snapshot/snapshotStorage");

var _tracing = require("../recorder/tracing");

var _trace = _interopRequireWildcard(require("../common/traceEvents"));

exports.trace = _trace;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Microsoft Corporation.
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
class TraceModel {
  constructor(snapshotStorage) {
    this.contextEntry = void 0;
    this.pageEntries = new Map();
    this._snapshotStorage = void 0;
    this._version = void 0;
    this._snapshotStorage = snapshotStorage;
    this.contextEntry = {
      startTime: Number.MAX_VALUE,
      endTime: Number.MIN_VALUE,
      browserName: '',
      options: {},
      pages: [],
      resources: []
    };
  }

  build() {
    for (const page of this.contextEntry.pages) page.actions.sort((a1, a2) => a1.metadata.startTime - a2.metadata.startTime);

    this.contextEntry.resources = this._snapshotStorage.resources();
  }

  _pageEntry(pageId) {
    let pageEntry = this.pageEntries.get(pageId);

    if (!pageEntry) {
      pageEntry = {
        actions: [],
        events: [],
        objects: {},
        screencastFrames: []
      };
      this.pageEntries.set(pageId, pageEntry);
      this.contextEntry.pages.push(pageEntry);
    }

    return pageEntry;
  }

  appendEvent(line) {
    const event = this._modernize(JSON.parse(line));

    switch (event.type) {
      case 'context-options':
        {
          this._version = event.version || 0;
          this.contextEntry.browserName = event.browserName;
          this.contextEntry.options = event.options;
          break;
        }

      case 'screencast-frame':
        {
          this._pageEntry(event.pageId).screencastFrames.push(event);

          break;
        }

      case 'action':
        {
          const metadata = event.metadata;
          const include = event.hasSnapshot;
          if (include && metadata.pageId) this._pageEntry(metadata.pageId).actions.push(event);
          break;
        }

      case 'event':
        {
          const metadata = event.metadata;

          if (metadata.pageId) {
            if (metadata.method === '__create__') this._pageEntry(metadata.pageId).objects[metadata.params.guid] = metadata.params.initializer;else this._pageEntry(metadata.pageId).events.push(event);
          }

          break;
        }

      case 'resource-snapshot':
        this._snapshotStorage.addResource(event.snapshot);

        break;

      case 'frame-snapshot':
        this._snapshotStorage.addFrameSnapshot(event.snapshot);

        break;
    }

    if (event.type === 'action' || event.type === 'event') {
      this.contextEntry.startTime = Math.min(this.contextEntry.startTime, event.metadata.startTime);
      this.contextEntry.endTime = Math.max(this.contextEntry.endTime, event.metadata.endTime);
    }
  }

  _modernize(event) {
    if (this._version === undefined) return event;

    for (let version = this._version; version < _tracing.VERSION; ++version) event = this[`_modernize_${version}_to_${version + 1}`].call(this, event);

    return event;
  }

  _modernize_0_to_1(event) {
    if (event.type === 'action') {
      if (typeof event.metadata.error === 'string') event.metadata.error = {
        error: {
          name: 'Error',
          message: event.metadata.error
        }
      };
      if (event.metadata && typeof event.hasSnapshot !== 'boolean') event.hasSnapshot = (0, _tracing.shouldCaptureSnapshot)(event.metadata);
    }

    return event;
  }

  _modernize_1_to_2(event) {
    if (event.type === 'frame-snapshot' && event.snapshot.isMainFrame) {
      // Old versions had completely wrong viewport.
      event.snapshot.viewport = this.contextEntry.options.viewport || {
        width: 1280,
        height: 720
      };
    }

    return event;
  }

  _modernize_2_to_3(event) {
    if (event.type === 'resource-snapshot' && !event.snapshot.request) {
      // Migrate from old ResourceSnapshot to new har entry format.
      const resource = event.snapshot;
      event.snapshot = {
        _frameref: resource.frameId,
        request: {
          url: resource.url,
          method: resource.method,
          headers: resource.requestHeaders,
          postData: resource.requestSha1 ? {
            _sha1: resource.requestSha1
          } : undefined
        },
        response: {
          status: resource.status,
          headers: resource.responseHeaders,
          content: {
            mimeType: resource.contentType,
            _sha1: resource.responseSha1
          }
        },
        _monotonicTime: resource.timestamp
      };
    }

    return event;
  }

}

exports.TraceModel = TraceModel;

class PersistentSnapshotStorage extends _snapshotStorage.BaseSnapshotStorage {
  constructor(resourcesDir) {
    super();
    this._resourcesDir = void 0;
    this._resourcesDir = resourcesDir;
  }

  resourceContent(sha1) {
    return _fs.default.readFileSync(_path.default.join(this._resourcesDir, sha1));
  }

}

exports.PersistentSnapshotStorage = PersistentSnapshotStorage;