"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toBeChecked = toBeChecked;
exports.toBeDisabled = toBeDisabled;
exports.toBeEditable = toBeEditable;
exports.toBeEmpty = toBeEmpty;
exports.toBeEnabled = toBeEnabled;
exports.toBeFocused = toBeFocused;
exports.toBeHidden = toBeHidden;
exports.toBeVisible = toBeVisible;
exports.toContainText = toContainText;
exports.toHaveAttribute = toHaveAttribute;
exports.toHaveClass = toHaveClass;
exports.toHaveCount = toHaveCount;
exports.toHaveCSS = toHaveCSS;
exports.toHaveId = toHaveId;
exports.toHaveJSProperty = toHaveJSProperty;
exports.toHaveText = toHaveText;
exports.toHaveTitle = toHaveTitle;
exports.toHaveURL = toHaveURL;
exports.toHaveValue = toHaveValue;

var _utils = require("../../utils/utils");

var _globals = require("../globals");

var _toBeTruthy = require("./toBeTruthy");

var _toEqual = require("./toEqual");

var _toMatchText = require("./toMatchText");

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
function toBeChecked(locator, options) {
  return _toBeTruthy.toBeTruthy.call(this, 'toBeChecked', locator, 'Locator', async timeout => {
    return await locator.isChecked({
      timeout
    });
  }, options);
}

function toBeDisabled(locator, options) {
  return _toBeTruthy.toBeTruthy.call(this, 'toBeDisabled', locator, 'Locator', async timeout => {
    return await locator.isDisabled({
      timeout
    });
  }, options);
}

function toBeEditable(locator, options) {
  return _toBeTruthy.toBeTruthy.call(this, 'toBeEditable', locator, 'Locator', async timeout => {
    return await locator.isEditable({
      timeout
    });
  }, options);
}

function toBeEmpty(locator, options) {
  return _toBeTruthy.toBeTruthy.call(this, 'toBeEmpty', locator, 'Locator', async timeout => {
    return await locator.evaluate(element => {
      var _element$textContent;

      if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') return !element.value;
      return !((_element$textContent = element.textContent) !== null && _element$textContent !== void 0 && _element$textContent.trim());
    }, {
      timeout
    });
  }, options);
}

function toBeEnabled(locator, options) {
  return _toBeTruthy.toBeTruthy.call(this, 'toBeEnabled', locator, 'Locator', async timeout => {
    return await locator.isEnabled({
      timeout
    });
  }, options);
}

function toBeFocused(locator, options) {
  return _toBeTruthy.toBeTruthy.call(this, 'toBeFocused', locator, 'Locator', async timeout => {
    return await locator.evaluate(element => {
      return document.activeElement === element;
    }, {
      timeout
    });
  }, options);
}

function toBeHidden(locator, options) {
  return _toBeTruthy.toBeTruthy.call(this, 'toBeHidden', locator, 'Locator', async timeout => {
    return await locator.isHidden({
      timeout
    });
  }, options);
}

function toBeVisible(locator, options) {
  return _toBeTruthy.toBeTruthy.call(this, 'toBeVisible', locator, 'Locator', async timeout => {
    return await locator.isVisible({
      timeout
    });
  }, options);
}

function toContainText(locator, expected, options) {
  return _toMatchText.toMatchText.call(this, 'toContainText', locator, 'Locator', async timeout => {
    if (options !== null && options !== void 0 && options.useInnerText) return await locator.innerText({
      timeout
    });
    return (await locator.textContent()) || '';
  }, expected, { ...options,
    matchSubstring: true,
    normalizeWhiteSpace: true
  });
}

function toHaveAttribute(locator, name, expected, options) {
  return _toMatchText.toMatchText.call(this, 'toHaveAttribute', locator, 'Locator', async timeout => {
    return (await locator.getAttribute(name, {
      timeout
    })) || '';
  }, expected, options);
}

function toHaveClass(locator, expected, options) {
  if (Array.isArray(expected)) {
    return _toEqual.toEqual.call(this, 'toHaveClass', locator, 'Locator', async () => {
      return await locator.evaluateAll(ee => ee.map(e => e.className));
    }, expected, options);
  } else {
    return _toMatchText.toMatchText.call(this, 'toHaveClass', locator, 'Locator', async timeout => {
      return await locator.evaluate(element => element.className, {
        timeout
      });
    }, expected, options);
  }
}

function toHaveCount(locator, expected, options) {
  return _toEqual.toEqual.call(this, 'toHaveCount', locator, 'Locator', async timeout => {
    return await locator.count();
  }, expected, options);
}

function toHaveCSS(locator, name, expected, options) {
  return _toMatchText.toMatchText.call(this, 'toHaveCSS', locator, 'Locator', async timeout => {
    return await locator.evaluate(async (element, name) => {
      return window.getComputedStyle(element)[name];
    }, name, {
      timeout
    });
  }, expected, options);
}

function toHaveId(locator, expected, options) {
  return _toMatchText.toMatchText.call(this, 'toHaveId', locator, 'Locator', async timeout => {
    return (await locator.getAttribute('id', {
      timeout
    })) || '';
  }, expected, options);
}

function toHaveJSProperty(locator, name, expected, options) {
  return _toEqual.toEqual.call(this, 'toHaveJSProperty', locator, 'Locator', async timeout => {
    return await locator.evaluate((element, name) => element[name], name, {
      timeout
    });
  }, expected, options);
}

function toHaveText(locator, expected, options = {}) {
  if (Array.isArray(expected)) {
    const expectedArray = expected.map(e => (0, _utils.isString)(e) ? (0, _toMatchText.normalizeWhiteSpace)(e) : e);
    return _toEqual.toEqual.call(this, 'toHaveText', locator, 'Locator', async () => {
      const texts = await locator.evaluateAll((ee, useInnerText) => {
        return ee.map(e => useInnerText ? e.innerText : e.textContent || '');
      }, options === null || options === void 0 ? void 0 : options.useInnerText); // Normalize those values that have string expectations.

      return texts.map((s, index) => (0, _utils.isString)(expectedArray[index]) ? (0, _toMatchText.normalizeWhiteSpace)(s) : s);
    }, expectedArray, options);
  } else {
    return _toMatchText.toMatchText.call(this, 'toHaveText', locator, 'Locator', async timeout => {
      if (options !== null && options !== void 0 && options.useInnerText) return await locator.innerText({
        timeout
      });
      return (await locator.textContent()) || '';
    }, expected, { ...options,
      normalizeWhiteSpace: true
    });
  }
}

function toHaveTitle(page, expected, options = {}) {
  return _toMatchText.toMatchText.call(this, 'toHaveTitle', page, 'Page', async () => {
    return await page.title();
  }, expected, { ...options,
    normalizeWhiteSpace: true
  });
}

function toHaveURL(page, expected, options) {
  const testInfo = (0, _globals.currentTestInfo)();
  if (!testInfo) throw new Error(`toHaveURL must be called during the test`);
  const baseURL = testInfo.project.use.baseURL;
  return _toMatchText.toMatchText.call(this, 'toHaveURL', page, 'Page', async () => {
    return page.url();
  }, typeof expected === 'string' ? (0, _utils.constructURLBasedOnBaseURL)(baseURL, expected) : expected, options);
}

function toHaveValue(locator, expected, options) {
  return _toMatchText.toMatchText.call(this, 'toHaveValue', locator, 'Locator', async timeout => {
    return await locator.inputValue({
      timeout
    });
  }, expected, options);
}