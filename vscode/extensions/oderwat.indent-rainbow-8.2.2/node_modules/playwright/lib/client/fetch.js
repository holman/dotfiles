"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FetchResponse = exports.FetchRequest = void 0;

var _errors = require("../utils/errors");

var _utils = require("../utils/utils");

var _channelOwner = require("./channelOwner");

var network = _interopRequireWildcard(require("./network"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
class FetchRequest extends _channelOwner.ChannelOwner {
  static from(channel) {
    return channel._object;
  }

  constructor(parent, type, guid, initializer) {
    super(parent, type, guid, initializer);
  }

  dispose() {
    return this._wrapApiCall(async channel => {
      await channel.dispose();
    });
  }

  async get(urlOrRequest, options) {
    return this.fetch(urlOrRequest, { ...options,
      method: 'GET'
    });
  }

  async post(urlOrRequest, options) {
    return this.fetch(urlOrRequest, { ...options,
      method: 'POST'
    });
  }

  async fetch(urlOrRequest, options = {}) {
    return this._wrapApiCall(async channel => {
      const request = urlOrRequest instanceof network.Request ? urlOrRequest : undefined;
      (0, _utils.assert)(request || typeof urlOrRequest === 'string', 'First argument must be either URL string or Request');
      const url = request ? request.url() : urlOrRequest;
      const params = (0, _utils.objectToArray)(options.params);
      const method = options.method || (request === null || request === void 0 ? void 0 : request.method()); // Cannot call allHeaders() here as the request may be paused inside route handler.

      const headersObj = options.headers || (request === null || request === void 0 ? void 0 : request.headers());
      const headers = headersObj ? (0, _utils.headersObjectToArray)(headersObj) : undefined;
      let postDataBuffer = (0, _utils.isString)(options.data) ? Buffer.from(options.data, 'utf8') : options.data;
      if (postDataBuffer === undefined) postDataBuffer = (request === null || request === void 0 ? void 0 : request.postDataBuffer()) || undefined;
      const postData = postDataBuffer ? postDataBuffer.toString('base64') : undefined;
      const result = await channel.fetch({
        url,
        params,
        method,
        headers,
        postData,
        timeout: options.timeout,
        failOnStatusCode: options.failOnStatusCode
      });
      if (result.error) throw new Error(`Request failed: ${result.error}`);
      return new FetchResponse(this, result.response);
    });
  }

}

exports.FetchRequest = FetchRequest;

class FetchResponse {
  constructor(context, initializer) {
    this._initializer = void 0;
    this._headers = void 0;
    this._request = void 0;
    this._request = context;
    this._initializer = initializer;
    this._headers = new network.RawHeaders(this._initializer.headers);
  }

  ok() {
    return this._initializer.status === 0 || this._initializer.status >= 200 && this._initializer.status <= 299;
  }

  url() {
    return this._initializer.url;
  }

  status() {
    return this._initializer.status;
  }

  statusText() {
    return this._initializer.statusText;
  }

  headers() {
    return this._headers.headers();
  }

  headersArray() {
    return this._headers.headersArray();
  }

  async body() {
    return this._request._wrapApiCall(async channel => {
      try {
        const result = await channel.fetchResponseBody({
          fetchUid: this._fetchUid()
        });
        if (!result.binary) throw new Error('Response has been disposed');
        return Buffer.from(result.binary, 'base64');
      } catch (e) {
        if (e.message === _errors.kBrowserOrContextClosedError) throw new Error('Response has been disposed');
        throw e;
      }
    });
  }

  async text() {
    const content = await this.body();
    return content.toString('utf8');
  }

  async json() {
    const content = await this.text();
    return JSON.parse(content);
  }

  async dispose() {
    return this._request._wrapApiCall(async channel => {
      await channel.disposeFetchResponse({
        fetchUid: this._fetchUid()
      });
    });
  }

  _fetchUid() {
    return this._initializer.fetchUid;
  }

}

exports.FetchResponse = FetchResponse;