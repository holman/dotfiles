"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiMap = void 0;

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
class MultiMap {
  constructor() {
    this._map = void 0;
    this._map = new Map();
  }

  set(key, value) {
    let set = this._map.get(key);

    if (!set) {
      set = new Set();

      this._map.set(key, set);
    }

    set.add(value);
  }

  get(key) {
    return this._map.get(key) || new Set();
  }

  has(key) {
    return this._map.has(key);
  }

  hasValue(key, value) {
    const set = this._map.get(key);

    if (!set) return false;
    return set.has(value);
  }

  get size() {
    return this._map.size;
  }

  delete(key, value) {
    const values = this.get(key);
    const result = values.delete(value);
    if (!values.size) this._map.delete(key);
    return result;
  }

  deleteAll(key) {
    this._map.delete(key);
  }

  keys() {
    return this._map.keys();
  }

  values() {
    const result = [];

    for (const key of this.keys()) result.push(...Array.from(this.get(key)));

    return result;
  }

  clear() {
    this._map.clear();
  }

}

exports.MultiMap = MultiMap;