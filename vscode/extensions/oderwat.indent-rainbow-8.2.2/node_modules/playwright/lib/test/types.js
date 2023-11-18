"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Location: true
};
Object.defineProperty(exports, "Location", {
  enumerable: true,
  get: function () {
    return _testReporter.Location;
  }
});

var _test = require("../../types/test");

Object.keys(_test).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _test[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _test[key];
    }
  });
});

var _testReporter = require("../../types/testReporter");