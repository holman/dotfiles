var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve2, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/fs.realpath/old.js
var require_old = __commonJS({
  "node_modules/fs.realpath/old.js"(exports) {
    var pathModule = require("path");
    var isWindows = process.platform === "win32";
    var fs4 = require("fs");
    var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
    function rethrow() {
      var callback;
      if (DEBUG) {
        var backtrace = new Error();
        callback = debugCallback;
      } else
        callback = missingCallback;
      return callback;
      function debugCallback(err) {
        if (err) {
          backtrace.message = err.message;
          err = backtrace;
          missingCallback(err);
        }
      }
      function missingCallback(err) {
        if (err) {
          if (process.throwDeprecation)
            throw err;
          else if (!process.noDeprecation) {
            var msg = "fs: missing callback " + (err.stack || err.message);
            if (process.traceDeprecation)
              console.trace(msg);
            else
              console.error(msg);
          }
        }
      }
    }
    function maybeCallback(cb) {
      return typeof cb === "function" ? cb : rethrow();
    }
    var normalize2 = pathModule.normalize;
    if (isWindows) {
      nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
    } else {
      nextPartRe = /(.*?)(?:[\/]+|$)/g;
    }
    var nextPartRe;
    if (isWindows) {
      splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
    } else {
      splitRootRe = /^[\/]*/;
    }
    var splitRootRe;
    exports.realpathSync = function realpathSync(p, cache) {
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return cache[p];
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs4.lstatSync(base);
          knownHard[base] = true;
        }
      }
      while (pos < p.length) {
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          continue;
        }
        var resolvedLink;
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          resolvedLink = cache[base];
        } else {
          var stat = fs4.lstatSync(base);
          if (!stat.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache)
              cache[base] = base;
            continue;
          }
          var linkTarget = null;
          if (!isWindows) {
            var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              linkTarget = seenLinks[id];
            }
          }
          if (linkTarget === null) {
            fs4.statSync(base);
            linkTarget = fs4.readlinkSync(base);
          }
          resolvedLink = pathModule.resolve(previous, linkTarget);
          if (cache)
            cache[base] = resolvedLink;
          if (!isWindows)
            seenLinks[id] = linkTarget;
        }
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
      if (cache)
        cache[original] = p;
      return p;
    };
    exports.realpath = function realpath(p, cache, cb) {
      if (typeof cb !== "function") {
        cb = maybeCallback(cache);
        cache = null;
      }
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return process.nextTick(cb.bind(null, null, cache[p]));
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs4.lstat(base, function(err) {
            if (err)
              return cb(err);
            knownHard[base] = true;
            LOOP();
          });
        } else {
          process.nextTick(LOOP);
        }
      }
      function LOOP() {
        if (pos >= p.length) {
          if (cache)
            cache[original] = p;
          return cb(null, p);
        }
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          return process.nextTick(LOOP);
        }
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          return gotResolvedLink(cache[base]);
        }
        return fs4.lstat(base, gotStat);
      }
      function gotStat(err, stat) {
        if (err)
          return cb(err);
        if (!stat.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache)
            cache[base] = base;
          return process.nextTick(LOOP);
        }
        if (!isWindows) {
          var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            return gotTarget(null, seenLinks[id], base);
          }
        }
        fs4.stat(base, function(err2) {
          if (err2)
            return cb(err2);
          fs4.readlink(base, function(err3, target) {
            if (!isWindows)
              seenLinks[id] = target;
            gotTarget(err3, target);
          });
        });
      }
      function gotTarget(err, target, base2) {
        if (err)
          return cb(err);
        var resolvedLink = pathModule.resolve(previous, target);
        if (cache)
          cache[base2] = resolvedLink;
        gotResolvedLink(resolvedLink);
      }
      function gotResolvedLink(resolvedLink) {
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
    };
  }
});

// node_modules/fs.realpath/index.js
var require_fs = __commonJS({
  "node_modules/fs.realpath/index.js"(exports, module2) {
    module2.exports = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;
    var fs4 = require("fs");
    var origRealpath = fs4.realpath;
    var origRealpathSync = fs4.realpathSync;
    var version = process.version;
    var ok = /^v[0-5]\./.test(version);
    var old = require_old();
    function newError(er) {
      return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
    }
    function realpath(p, cache, cb) {
      if (ok) {
        return origRealpath(p, cache, cb);
      }
      if (typeof cache === "function") {
        cb = cache;
        cache = null;
      }
      origRealpath(p, cache, function(er, result) {
        if (newError(er)) {
          old.realpath(p, cache, cb);
        } else {
          cb(er, result);
        }
      });
    }
    function realpathSync(p, cache) {
      if (ok) {
        return origRealpathSync(p, cache);
      }
      try {
        return origRealpathSync(p, cache);
      } catch (er) {
        if (newError(er)) {
          return old.realpathSync(p, cache);
        } else {
          throw er;
        }
      }
    }
    function monkeypatch() {
      fs4.realpath = realpath;
      fs4.realpathSync = realpathSync;
    }
    function unmonkeypatch() {
      fs4.realpath = origRealpath;
      fs4.realpathSync = origRealpathSync;
    }
  }
});

// node_modules/concat-map/index.js
var require_concat_map = __commonJS({
  "node_modules/concat-map/index.js"(exports, module2) {
    module2.exports = function(xs, fn) {
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x))
          res.push.apply(res, x);
        else
          res.push(x);
      }
      return res;
    };
    var isArray = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
  }
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/balanced-match/index.js"(exports, module2) {
    "use strict";
    module2.exports = balanced;
    function balanced(a, b, str) {
      if (a instanceof RegExp)
        a = maybeMatch(a, str);
      if (b instanceof RegExp)
        b = maybeMatch(b, str);
      var r = range(a, b, str);
      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }
    balanced.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str.indexOf(b, i + 1);
          }
          i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
  }
});

// node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "node_modules/brace-expansion/index.js"(exports, module2) {
    var concatMap = require_concat_map();
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str) {
      if (!str)
        return [];
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand(escapeBraces(str), true).map(unescapeBraces);
    }
    function embrace(str) {
      return "{" + str + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand(str, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str);
      if (!m || /\$$/.test(m.pre))
        return [str];
      var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
      var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
      var isSequence = isNumericSequence || isAlphaSequence;
      var isOptions = m.body.indexOf(",") >= 0;
      if (!isSequence && !isOptions) {
        if (m.post.match(/,.*\}/)) {
          str = m.pre + "{" + m.body + escClose + m.post;
          return expand(str);
        }
        return [str];
      }
      var n;
      if (isSequence) {
        n = m.body.split(/\.\./);
      } else {
        n = parseCommaParts(m.body);
        if (n.length === 1) {
          n = expand(n[0], false).map(embrace);
          if (n.length === 1) {
            var post = m.post.length ? expand(m.post, false) : [""];
            return post.map(function(p) {
              return m.pre + n[0] + p;
            });
          }
        }
      }
      var pre = m.pre;
      var post = m.post.length ? expand(m.post, false) : [""];
      var N;
      if (isSequence) {
        var x = numeric(n[0]);
        var y = numeric(n[1]);
        var width = Math.max(n[0].length, n[1].length);
        var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
        var test = lte;
        var reverse = y < x;
        if (reverse) {
          incr *= -1;
          test = gte;
        }
        var pad = n.some(isPadded);
        N = [];
        for (var i = x; test(i, y); i += incr) {
          var c;
          if (isAlphaSequence) {
            c = String.fromCharCode(i);
            if (c === "\\")
              c = "";
          } else {
            c = String(i);
            if (pad) {
              var need = width - c.length;
              if (need > 0) {
                var z = new Array(need + 1).join("0");
                if (i < 0)
                  c = "-" + z + c.slice(1);
                else
                  c = z + c;
              }
            }
          }
          N.push(c);
        }
      } else {
        N = concatMap(n, function(el) {
          return expand(el, false);
        });
      }
      for (var j = 0; j < N.length; j++) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + N[j] + post[k];
          if (!isTop || isSequence || expansion)
            expansions.push(expansion);
        }
      }
      return expansions;
    }
  }
});

// node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS({
  "node_modules/minimatch/minimatch.js"(exports, module2) {
    module2.exports = minimatch;
    minimatch.Minimatch = Minimatch;
    var path3 = { sep: "/" };
    try {
      path3 = require("path");
    } catch (er) {
    }
    var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
    var expand = require_brace_expansion();
    var plTypes = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" }
    };
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var reSpecials = charSet("().*{}+?[]^$\\!");
    function charSet(s) {
      return s.split("").reduce(function(set, c) {
        set[c] = true;
        return set;
      }, {});
    }
    var slashSplit = /\/+/;
    minimatch.filter = filter;
    function filter(pattern, options) {
      options = options || {};
      return function(p, i, list) {
        return minimatch(p, pattern, options);
      };
    }
    function ext(a, b) {
      a = a || {};
      b = b || {};
      var t = {};
      Object.keys(b).forEach(function(k) {
        t[k] = b[k];
      });
      Object.keys(a).forEach(function(k) {
        t[k] = a[k];
      });
      return t;
    }
    minimatch.defaults = function(def) {
      if (!def || !Object.keys(def).length)
        return minimatch;
      var orig = minimatch;
      var m = function minimatch2(p, pattern, options) {
        return orig.minimatch(p, pattern, ext(def, options));
      };
      m.Minimatch = function Minimatch2(pattern, options) {
        return new orig.Minimatch(pattern, ext(def, options));
      };
      return m;
    };
    Minimatch.defaults = function(def) {
      if (!def || !Object.keys(def).length)
        return Minimatch;
      return minimatch.defaults(def).Minimatch;
    };
    function minimatch(p, pattern, options) {
      if (typeof pattern !== "string") {
        throw new TypeError("glob pattern string required");
      }
      if (!options)
        options = {};
      if (!options.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      if (pattern.trim() === "")
        return p === "";
      return new Minimatch(pattern, options).match(p);
    }
    function Minimatch(pattern, options) {
      if (!(this instanceof Minimatch)) {
        return new Minimatch(pattern, options);
      }
      if (typeof pattern !== "string") {
        throw new TypeError("glob pattern string required");
      }
      if (!options)
        options = {};
      pattern = pattern.trim();
      if (path3.sep !== "/") {
        pattern = pattern.split(path3.sep).join("/");
      }
      this.options = options;
      this.set = [];
      this.pattern = pattern;
      this.regexp = null;
      this.negate = false;
      this.comment = false;
      this.empty = false;
      this.make();
    }
    Minimatch.prototype.debug = function() {
    };
    Minimatch.prototype.make = make;
    function make() {
      if (this._made)
        return;
      var pattern = this.pattern;
      var options = this.options;
      if (!options.nocomment && pattern.charAt(0) === "#") {
        this.comment = true;
        return;
      }
      if (!pattern) {
        this.empty = true;
        return;
      }
      this.parseNegate();
      var set = this.globSet = this.braceExpand();
      if (options.debug)
        this.debug = console.error;
      this.debug(this.pattern, set);
      set = this.globParts = set.map(function(s) {
        return s.split(slashSplit);
      });
      this.debug(this.pattern, set);
      set = set.map(function(s, si, set2) {
        return s.map(this.parse, this);
      }, this);
      this.debug(this.pattern, set);
      set = set.filter(function(s) {
        return s.indexOf(false) === -1;
      });
      this.debug(this.pattern, set);
      this.set = set;
    }
    Minimatch.prototype.parseNegate = parseNegate;
    function parseNegate() {
      var pattern = this.pattern;
      var negate = false;
      var options = this.options;
      var negateOffset = 0;
      if (options.nonegate)
        return;
      for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === "!"; i++) {
        negate = !negate;
        negateOffset++;
      }
      if (negateOffset)
        this.pattern = pattern.substr(negateOffset);
      this.negate = negate;
    }
    minimatch.braceExpand = function(pattern, options) {
      return braceExpand(pattern, options);
    };
    Minimatch.prototype.braceExpand = braceExpand;
    function braceExpand(pattern, options) {
      if (!options) {
        if (this instanceof Minimatch) {
          options = this.options;
        } else {
          options = {};
        }
      }
      pattern = typeof pattern === "undefined" ? this.pattern : pattern;
      if (typeof pattern === "undefined") {
        throw new TypeError("undefined pattern");
      }
      if (options.nobrace || !pattern.match(/\{.*\}/)) {
        return [pattern];
      }
      return expand(pattern);
    }
    Minimatch.prototype.parse = parse;
    var SUBPARSE = {};
    function parse(pattern, isSub) {
      if (pattern.length > 1024 * 64) {
        throw new TypeError("pattern is too long");
      }
      var options = this.options;
      if (!options.noglobstar && pattern === "**")
        return GLOBSTAR;
      if (pattern === "")
        return "";
      var re = "";
      var hasMagic = !!options.nocase;
      var escaping = false;
      var patternListStack = [];
      var negativeLists = [];
      var stateChar;
      var inClass = false;
      var reClassStart = -1;
      var classStart = -1;
      var patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
      var self2 = this;
      function clearStateChar() {
        if (stateChar) {
          switch (stateChar) {
            case "*":
              re += star;
              hasMagic = true;
              break;
            case "?":
              re += qmark;
              hasMagic = true;
              break;
            default:
              re += "\\" + stateChar;
              break;
          }
          self2.debug("clearStateChar %j %j", stateChar, re);
          stateChar = false;
        }
      }
      for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
        this.debug("%s	%s %s %j", pattern, i, re, c);
        if (escaping && reSpecials[c]) {
          re += "\\" + c;
          escaping = false;
          continue;
        }
        switch (c) {
          case "/":
            return false;
          case "\\":
            clearStateChar();
            escaping = true;
            continue;
          case "?":
          case "*":
          case "+":
          case "@":
          case "!":
            this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
            if (inClass) {
              this.debug("  in class");
              if (c === "!" && i === classStart + 1)
                c = "^";
              re += c;
              continue;
            }
            self2.debug("call clearStateChar %j", stateChar);
            clearStateChar();
            stateChar = c;
            if (options.noext)
              clearStateChar();
            continue;
          case "(":
            if (inClass) {
              re += "(";
              continue;
            }
            if (!stateChar) {
              re += "\\(";
              continue;
            }
            patternListStack.push({
              type: stateChar,
              start: i - 1,
              reStart: re.length,
              open: plTypes[stateChar].open,
              close: plTypes[stateChar].close
            });
            re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
            this.debug("plType %j %j", stateChar, re);
            stateChar = false;
            continue;
          case ")":
            if (inClass || !patternListStack.length) {
              re += "\\)";
              continue;
            }
            clearStateChar();
            hasMagic = true;
            var pl = patternListStack.pop();
            re += pl.close;
            if (pl.type === "!") {
              negativeLists.push(pl);
            }
            pl.reEnd = re.length;
            continue;
          case "|":
            if (inClass || !patternListStack.length || escaping) {
              re += "\\|";
              escaping = false;
              continue;
            }
            clearStateChar();
            re += "|";
            continue;
          case "[":
            clearStateChar();
            if (inClass) {
              re += "\\" + c;
              continue;
            }
            inClass = true;
            classStart = i;
            reClassStart = re.length;
            re += c;
            continue;
          case "]":
            if (i === classStart + 1 || !inClass) {
              re += "\\" + c;
              escaping = false;
              continue;
            }
            if (inClass) {
              var cs = pattern.substring(classStart + 1, i);
              try {
                RegExp("[" + cs + "]");
              } catch (er) {
                var sp = this.parse(cs, SUBPARSE);
                re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
                hasMagic = hasMagic || sp[1];
                inClass = false;
                continue;
              }
            }
            hasMagic = true;
            inClass = false;
            re += c;
            continue;
          default:
            clearStateChar();
            if (escaping) {
              escaping = false;
            } else if (reSpecials[c] && !(c === "^" && inClass)) {
              re += "\\";
            }
            re += c;
        }
      }
      if (inClass) {
        cs = pattern.substr(classStart + 1);
        sp = this.parse(cs, SUBPARSE);
        re = re.substr(0, reClassStart) + "\\[" + sp[0];
        hasMagic = hasMagic || sp[1];
      }
      for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
        var tail = re.slice(pl.reStart + pl.open.length);
        this.debug("setting tail", re, pl);
        tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
          if (!$2) {
            $2 = "\\";
          }
          return $1 + $1 + $2 + "|";
        });
        this.debug("tail=%j\n   %s", tail, tail, pl, re);
        var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
        hasMagic = true;
        re = re.slice(0, pl.reStart) + t + "\\(" + tail;
      }
      clearStateChar();
      if (escaping) {
        re += "\\\\";
      }
      var addPatternStart = false;
      switch (re.charAt(0)) {
        case ".":
        case "[":
        case "(":
          addPatternStart = true;
      }
      for (var n = negativeLists.length - 1; n > -1; n--) {
        var nl = negativeLists[n];
        var nlBefore = re.slice(0, nl.reStart);
        var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
        var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
        var nlAfter = re.slice(nl.reEnd);
        nlLast += nlAfter;
        var openParensBefore = nlBefore.split("(").length - 1;
        var cleanAfter = nlAfter;
        for (i = 0; i < openParensBefore; i++) {
          cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
        }
        nlAfter = cleanAfter;
        var dollar = "";
        if (nlAfter === "" && isSub !== SUBPARSE) {
          dollar = "$";
        }
        var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        re = newRe;
      }
      if (re !== "" && hasMagic) {
        re = "(?=.)" + re;
      }
      if (addPatternStart) {
        re = patternStart + re;
      }
      if (isSub === SUBPARSE) {
        return [re, hasMagic];
      }
      if (!hasMagic) {
        return globUnescape(pattern);
      }
      var flags = options.nocase ? "i" : "";
      try {
        var regExp = new RegExp("^" + re + "$", flags);
      } catch (er) {
        return new RegExp("$.");
      }
      regExp._glob = pattern;
      regExp._src = re;
      return regExp;
    }
    minimatch.makeRe = function(pattern, options) {
      return new Minimatch(pattern, options || {}).makeRe();
    };
    Minimatch.prototype.makeRe = makeRe;
    function makeRe() {
      if (this.regexp || this.regexp === false)
        return this.regexp;
      var set = this.set;
      if (!set.length) {
        this.regexp = false;
        return this.regexp;
      }
      var options = this.options;
      var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
      var flags = options.nocase ? "i" : "";
      var re = set.map(function(pattern) {
        return pattern.map(function(p) {
          return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
        }).join("\\/");
      }).join("|");
      re = "^(?:" + re + ")$";
      if (this.negate)
        re = "^(?!" + re + ").*$";
      try {
        this.regexp = new RegExp(re, flags);
      } catch (ex) {
        this.regexp = false;
      }
      return this.regexp;
    }
    minimatch.match = function(list, pattern, options) {
      options = options || {};
      var mm = new Minimatch(pattern, options);
      list = list.filter(function(f) {
        return mm.match(f);
      });
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    Minimatch.prototype.match = match;
    function match(f, partial) {
      this.debug("match", f, this.pattern);
      if (this.comment)
        return false;
      if (this.empty)
        return f === "";
      if (f === "/" && partial)
        return true;
      var options = this.options;
      if (path3.sep !== "/") {
        f = f.split(path3.sep).join("/");
      }
      f = f.split(slashSplit);
      this.debug(this.pattern, "split", f);
      var set = this.set;
      this.debug(this.pattern, "set", set);
      var filename;
      var i;
      for (i = f.length - 1; i >= 0; i--) {
        filename = f[i];
        if (filename)
          break;
      }
      for (i = 0; i < set.length; i++) {
        var pattern = set[i];
        var file = f;
        if (options.matchBase && pattern.length === 1) {
          file = [filename];
        }
        var hit = this.matchOne(file, pattern, partial);
        if (hit) {
          if (options.flipNegate)
            return true;
          return !this.negate;
        }
      }
      if (options.flipNegate)
        return false;
      return this.negate;
    }
    Minimatch.prototype.matchOne = function(file, pattern, partial) {
      var options = this.options;
      this.debug("matchOne", { "this": this, file, pattern });
      this.debug("matchOne", file.length, pattern.length);
      for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
        this.debug("matchOne loop");
        var p = pattern[pi];
        var f = file[fi];
        this.debug(pattern, p, f);
        if (p === false)
          return false;
        if (p === GLOBSTAR) {
          this.debug("GLOBSTAR", [pattern, p, f]);
          var fr = fi;
          var pr = pi + 1;
          if (pr === pl) {
            this.debug("** at the end");
            for (; fi < fl; fi++) {
              if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
                return false;
            }
            return true;
          }
          while (fr < fl) {
            var swallowee = file[fr];
            this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
              this.debug("globstar found match!", fr, fl, swallowee);
              return true;
            } else {
              if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
                this.debug("dot detected!", file, fr, pattern, pr);
                break;
              }
              this.debug("globstar swallow a segment, and continue");
              fr++;
            }
          }
          if (partial) {
            this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
            if (fr === fl)
              return true;
          }
          return false;
        }
        var hit;
        if (typeof p === "string") {
          if (options.nocase) {
            hit = f.toLowerCase() === p.toLowerCase();
          } else {
            hit = f === p;
          }
          this.debug("string match", p, f, hit);
        } else {
          hit = f.match(p);
          this.debug("pattern match", p, f, hit);
        }
        if (!hit)
          return false;
      }
      if (fi === fl && pi === pl) {
        return true;
      } else if (fi === fl) {
        return partial;
      } else if (pi === pl) {
        var emptyFileEnd = fi === fl - 1 && file[fi] === "";
        return emptyFileEnd;
      }
      throw new Error("wtf?");
    };
    function globUnescape(s) {
      return s.replace(/\\(.)/g, "$1");
    }
    function regExpEscape(s) {
      return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports, module2) {
    try {
      util2 = require("util");
      if (typeof util2.inherits !== "function")
        throw "";
      module2.exports = util2.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util2;
  }
});

// node_modules/path-is-absolute/index.js
var require_path_is_absolute = __commonJS({
  "node_modules/path-is-absolute/index.js"(exports, module2) {
    "use strict";
    function posix(path3) {
      return path3.charAt(0) === "/";
    }
    function win322(path3) {
      var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
      var result = splitDeviceRe.exec(path3);
      var device = result[1] || "";
      var isUnc = Boolean(device && device.charAt(1) !== ":");
      return Boolean(result[2] || isUnc);
    }
    module2.exports = process.platform === "win32" ? win322 : posix;
    module2.exports.posix = posix;
    module2.exports.win32 = win322;
  }
});

// node_modules/glob/common.js
var require_common = __commonJS({
  "node_modules/glob/common.js"(exports) {
    exports.setopts = setopts;
    exports.ownProp = ownProp;
    exports.makeAbs = makeAbs;
    exports.finish = finish;
    exports.mark = mark;
    exports.isIgnored = isIgnored;
    exports.childrenIgnored = childrenIgnored;
    function ownProp(obj, field) {
      return Object.prototype.hasOwnProperty.call(obj, field);
    }
    var path3 = require("path");
    var minimatch = require_minimatch();
    var isAbsolute2 = require_path_is_absolute();
    var Minimatch = minimatch.Minimatch;
    function alphasort(a, b) {
      return a.localeCompare(b, "en");
    }
    function setupIgnores(self2, options) {
      self2.ignore = options.ignore || [];
      if (!Array.isArray(self2.ignore))
        self2.ignore = [self2.ignore];
      if (self2.ignore.length) {
        self2.ignore = self2.ignore.map(ignoreMap);
      }
    }
    function ignoreMap(pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === "/**") {
        var gpattern = pattern.replace(/(\/\*\*)+$/, "");
        gmatcher = new Minimatch(gpattern, { dot: true });
      }
      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher
      };
    }
    function setopts(self2, pattern, options) {
      if (!options)
        options = {};
      if (options.matchBase && pattern.indexOf("/") === -1) {
        if (options.noglobstar) {
          throw new Error("base matching requires globstar");
        }
        pattern = "**/" + pattern;
      }
      self2.silent = !!options.silent;
      self2.pattern = pattern;
      self2.strict = options.strict !== false;
      self2.realpath = !!options.realpath;
      self2.realpathCache = options.realpathCache || Object.create(null);
      self2.follow = !!options.follow;
      self2.dot = !!options.dot;
      self2.mark = !!options.mark;
      self2.nodir = !!options.nodir;
      if (self2.nodir)
        self2.mark = true;
      self2.sync = !!options.sync;
      self2.nounique = !!options.nounique;
      self2.nonull = !!options.nonull;
      self2.nosort = !!options.nosort;
      self2.nocase = !!options.nocase;
      self2.stat = !!options.stat;
      self2.noprocess = !!options.noprocess;
      self2.absolute = !!options.absolute;
      self2.maxLength = options.maxLength || Infinity;
      self2.cache = options.cache || Object.create(null);
      self2.statCache = options.statCache || Object.create(null);
      self2.symlinks = options.symlinks || Object.create(null);
      setupIgnores(self2, options);
      self2.changedCwd = false;
      var cwd = process.cwd();
      if (!ownProp(options, "cwd"))
        self2.cwd = cwd;
      else {
        self2.cwd = path3.resolve(options.cwd);
        self2.changedCwd = self2.cwd !== cwd;
      }
      self2.root = options.root || path3.resolve(self2.cwd, "/");
      self2.root = path3.resolve(self2.root);
      if (process.platform === "win32")
        self2.root = self2.root.replace(/\\/g, "/");
      self2.cwdAbs = isAbsolute2(self2.cwd) ? self2.cwd : makeAbs(self2, self2.cwd);
      if (process.platform === "win32")
        self2.cwdAbs = self2.cwdAbs.replace(/\\/g, "/");
      self2.nomount = !!options.nomount;
      options.nonegate = true;
      options.nocomment = true;
      self2.minimatch = new Minimatch(pattern, options);
      self2.options = self2.minimatch.options;
    }
    function finish(self2) {
      var nou = self2.nounique;
      var all = nou ? [] : Object.create(null);
      for (var i = 0, l = self2.matches.length; i < l; i++) {
        var matches = self2.matches[i];
        if (!matches || Object.keys(matches).length === 0) {
          if (self2.nonull) {
            var literal = self2.minimatch.globSet[i];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function(m2) {
              all[m2] = true;
            });
        }
      }
      if (!nou)
        all = Object.keys(all);
      if (!self2.nosort)
        all = all.sort(alphasort);
      if (self2.mark) {
        for (var i = 0; i < all.length; i++) {
          all[i] = self2._mark(all[i]);
        }
        if (self2.nodir) {
          all = all.filter(function(e) {
            var notDir = !/\/$/.test(e);
            var c = self2.cache[e] || self2.cache[makeAbs(self2, e)];
            if (notDir && c)
              notDir = c !== "DIR" && !Array.isArray(c);
            return notDir;
          });
        }
      }
      if (self2.ignore.length)
        all = all.filter(function(m2) {
          return !isIgnored(self2, m2);
        });
      self2.found = all;
    }
    function mark(self2, p) {
      var abs = makeAbs(self2, p);
      var c = self2.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === "DIR" || Array.isArray(c);
        var slash = p.slice(-1) === "/";
        if (isDir && !slash)
          m += "/";
        else if (!isDir && slash)
          m = m.slice(0, -1);
        if (m !== p) {
          var mabs = makeAbs(self2, m);
          self2.statCache[mabs] = self2.statCache[abs];
          self2.cache[mabs] = self2.cache[abs];
        }
      }
      return m;
    }
    function makeAbs(self2, f) {
      var abs = f;
      if (f.charAt(0) === "/") {
        abs = path3.join(self2.root, f);
      } else if (isAbsolute2(f) || f === "") {
        abs = f;
      } else if (self2.changedCwd) {
        abs = path3.resolve(self2.cwd, f);
      } else {
        abs = path3.resolve(f);
      }
      if (process.platform === "win32")
        abs = abs.replace(/\\/g, "/");
      return abs;
    }
    function isIgnored(self2, path4) {
      if (!self2.ignore.length)
        return false;
      return self2.ignore.some(function(item) {
        return item.matcher.match(path4) || !!(item.gmatcher && item.gmatcher.match(path4));
      });
    }
    function childrenIgnored(self2, path4) {
      if (!self2.ignore.length)
        return false;
      return self2.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path4));
      });
    }
  }
});

// node_modules/glob/sync.js
var require_sync = __commonJS({
  "node_modules/glob/sync.js"(exports, module2) {
    module2.exports = globSync;
    globSync.GlobSync = GlobSync;
    var fs4 = require("fs");
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var Glob = require_glob().Glob;
    var util2 = require("util");
    var path3 = require("path");
    var assert = require("assert");
    var isAbsolute2 = require_path_is_absolute();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    function globSync(pattern, options) {
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      return new GlobSync(pattern, options).found;
    }
    function GlobSync(pattern, options) {
      if (!pattern)
        throw new Error("must provide pattern");
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      if (!(this instanceof GlobSync))
        return new GlobSync(pattern, options);
      setopts(this, pattern, options);
      if (this.noprocess)
        return this;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false);
      }
      this._finish();
    }
    GlobSync.prototype._finish = function() {
      assert(this instanceof GlobSync);
      if (this.realpath) {
        var self2 = this;
        this.matches.forEach(function(matchset, index) {
          var set = self2.matches[index] = Object.create(null);
          for (var p in matchset) {
            try {
              p = self2._makeAbs(p);
              var real = rp.realpathSync(p, self2.realpathCache);
              set[real] = true;
            } catch (er) {
              if (er.syscall === "stat")
                set[self2._makeAbs(p)] = true;
              else
                throw er;
            }
          }
        });
      }
      common.finish(this);
    };
    GlobSync.prototype._process = function(pattern, index, inGlobStar) {
      assert(this instanceof GlobSync);
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute2(prefix) || isAbsolute2(pattern.join("/"))) {
        if (!prefix || !isAbsolute2(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return;
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    };
    GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return;
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix.slice(-1) !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path3.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return;
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix)
          newPattern = [prefix, e];
        else
          newPattern = [e];
        this._process(newPattern.concat(remain), index, inGlobStar);
      }
    };
    GlobSync.prototype._emitMatch = function(index, e) {
      if (isIgnored(this, e))
        return;
      var abs = this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute) {
        e = abs;
      }
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      if (this.stat)
        this._stat(e);
    };
    GlobSync.prototype._readdirInGlobStar = function(abs) {
      if (this.follow)
        return this._readdir(abs, false);
      var entries;
      var lstat;
      var stat;
      try {
        lstat = fs4.lstatSync(abs);
      } catch (er) {
        if (er.code === "ENOENT") {
          return null;
        }
      }
      var isSym = lstat && lstat.isSymbolicLink();
      this.symlinks[abs] = isSym;
      if (!isSym && lstat && !lstat.isDirectory())
        this.cache[abs] = "FILE";
      else
        entries = this._readdir(abs, false);
      return entries;
    };
    GlobSync.prototype._readdir = function(abs, inGlobStar) {
      var entries;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return null;
        if (Array.isArray(c))
          return c;
      }
      try {
        return this._readdirEntries(abs, fs4.readdirSync(abs));
      } catch (er) {
        this._readdirError(abs, er);
        return null;
      }
    };
    GlobSync.prototype._readdirEntries = function(abs, entries) {
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return entries;
    };
    GlobSync.prototype._readdirError = function(f, er) {
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            throw error;
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict)
            throw er;
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
    };
    GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false);
      var len = entries.length;
      var isSym = this.symlinks[abs];
      if (isSym && inGlobStar)
        return;
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true);
      }
    };
    GlobSync.prototype._processSimple = function(prefix, index) {
      var exists = this._stat(prefix);
      if (!this.matches[index])
        this.matches[index] = Object.create(null);
      if (!exists)
        return;
      if (prefix && isAbsolute2(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path3.join(this.root, prefix);
        } else {
          prefix = path3.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
    };
    GlobSync.prototype._stat = function(f) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return false;
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return c;
        if (needDir && c === "FILE")
          return false;
      }
      var exists;
      var stat = this.statCache[abs];
      if (!stat) {
        var lstat;
        try {
          lstat = fs4.lstatSync(abs);
        } catch (er) {
          if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
            this.statCache[abs] = false;
            return false;
          }
        }
        if (lstat && lstat.isSymbolicLink()) {
          try {
            stat = fs4.statSync(abs);
          } catch (er) {
            stat = lstat;
          }
        } else {
          stat = lstat;
        }
      }
      this.statCache[abs] = stat;
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return false;
      return c;
    };
    GlobSync.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    GlobSync.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/inflight/inflight.js
var require_inflight = __commonJS({
  "node_modules/inflight/inflight.js"(exports, module2) {
    var wrappy = require_wrappy();
    var reqs = Object.create(null);
    var once = require_once();
    module2.exports = wrappy(inflight);
    function inflight(key, cb) {
      if (reqs[key]) {
        reqs[key].push(cb);
        return null;
      } else {
        reqs[key] = [cb];
        return makeres(key);
      }
    }
    function makeres(key) {
      return once(function RES() {
        var cbs = reqs[key];
        var len = cbs.length;
        var args = slice(arguments);
        try {
          for (var i = 0; i < len; i++) {
            cbs[i].apply(null, args);
          }
        } finally {
          if (cbs.length > len) {
            cbs.splice(0, len);
            process.nextTick(function() {
              RES.apply(null, args);
            });
          } else {
            delete reqs[key];
          }
        }
      });
    }
    function slice(args) {
      var length = args.length;
      var array = [];
      for (var i = 0; i < length; i++)
        array[i] = args[i];
      return array;
    }
  }
});

// node_modules/glob/glob.js
var require_glob = __commonJS({
  "node_modules/glob/glob.js"(exports, module2) {
    module2.exports = glob2;
    var fs4 = require("fs");
    var rp = require_fs();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var inherits = require_inherits();
    var EE = require("events").EventEmitter;
    var path3 = require("path");
    var assert = require("assert");
    var isAbsolute2 = require_path_is_absolute();
    var globSync = require_sync();
    var common = require_common();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = require_inflight();
    var util2 = require("util");
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    var once = require_once();
    function glob2(pattern, options, cb) {
      if (typeof options === "function")
        cb = options, options = {};
      if (!options)
        options = {};
      if (options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return globSync(pattern, options);
      }
      return new Glob(pattern, options, cb);
    }
    glob2.sync = globSync;
    var GlobSync = glob2.GlobSync = globSync.GlobSync;
    glob2.glob = glob2;
    function extend(origin, add) {
      if (add === null || typeof add !== "object") {
        return origin;
      }
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    }
    glob2.hasMagic = function(pattern, options_) {
      var options = extend({}, options_);
      options.noprocess = true;
      var g = new Glob(pattern, options);
      var set = g.minimatch.set;
      if (!pattern)
        return false;
      if (set.length > 1)
        return true;
      for (var j = 0; j < set[0].length; j++) {
        if (typeof set[0][j] !== "string")
          return true;
      }
      return false;
    };
    glob2.Glob = Glob;
    inherits(Glob, EE);
    function Glob(pattern, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      if (options && options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return new GlobSync(pattern, options);
      }
      if (!(this instanceof Glob))
        return new Glob(pattern, options, cb);
      setopts(this, pattern, options);
      this._didRealPath = false;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      if (typeof cb === "function") {
        cb = once(cb);
        this.on("error", cb);
        this.on("end", function(matches) {
          cb(null, matches);
        });
      }
      var self2 = this;
      this._processing = 0;
      this._emitQueue = [];
      this._processQueue = [];
      this.paused = false;
      if (this.noprocess)
        return this;
      if (n === 0)
        return done();
      var sync2 = true;
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false, done);
      }
      sync2 = false;
      function done() {
        --self2._processing;
        if (self2._processing <= 0) {
          if (sync2) {
            process.nextTick(function() {
              self2._finish();
            });
          } else {
            self2._finish();
          }
        }
      }
    }
    Glob.prototype._finish = function() {
      assert(this instanceof Glob);
      if (this.aborted)
        return;
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      common.finish(this);
      this.emit("end", this.found);
    };
    Glob.prototype._realpath = function() {
      if (this._didRealpath)
        return;
      this._didRealpath = true;
      var n = this.matches.length;
      if (n === 0)
        return this._finish();
      var self2 = this;
      for (var i = 0; i < this.matches.length; i++)
        this._realpathSet(i, next);
      function next() {
        if (--n === 0)
          self2._finish();
      }
    };
    Glob.prototype._realpathSet = function(index, cb) {
      var matchset = this.matches[index];
      if (!matchset)
        return cb();
      var found = Object.keys(matchset);
      var self2 = this;
      var n = found.length;
      if (n === 0)
        return cb();
      var set = this.matches[index] = Object.create(null);
      found.forEach(function(p, i) {
        p = self2._makeAbs(p);
        rp.realpath(p, self2.realpathCache, function(er, real) {
          if (!er)
            set[real] = true;
          else if (er.syscall === "stat")
            set[p] = true;
          else
            self2.emit("error", er);
          if (--n === 0) {
            self2.matches[index] = set;
            cb();
          }
        });
      });
    };
    Glob.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    Glob.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
    Glob.prototype.abort = function() {
      this.aborted = true;
      this.emit("abort");
    };
    Glob.prototype.pause = function() {
      if (!this.paused) {
        this.paused = true;
        this.emit("pause");
      }
    };
    Glob.prototype.resume = function() {
      if (this.paused) {
        this.emit("resume");
        this.paused = false;
        if (this._emitQueue.length) {
          var eq = this._emitQueue.slice(0);
          this._emitQueue.length = 0;
          for (var i = 0; i < eq.length; i++) {
            var e = eq[i];
            this._emitMatch(e[0], e[1]);
          }
        }
        if (this._processQueue.length) {
          var pq = this._processQueue.slice(0);
          this._processQueue.length = 0;
          for (var i = 0; i < pq.length; i++) {
            var p = pq[i];
            this._processing--;
            this._process(p[0], p[1], p[2], p[3]);
          }
        }
      }
    };
    Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
      assert(this instanceof Glob);
      assert(typeof cb === "function");
      if (this.aborted)
        return;
      this._processing++;
      if (this.paused) {
        this._processQueue.push([pattern, index, inGlobStar, cb]);
        return;
      }
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index, cb);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute2(prefix) || isAbsolute2(pattern.join("/"))) {
        if (!prefix || !isAbsolute2(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return cb();
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    };
    Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self2 = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        return self2._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return cb();
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path3.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return cb();
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix) {
          if (prefix !== "/")
            e = prefix + "/" + e;
          else
            e = prefix + e;
        }
        this._process([e].concat(remain), index, inGlobStar, cb);
      }
      cb();
    };
    Glob.prototype._emitMatch = function(index, e) {
      if (this.aborted)
        return;
      if (isIgnored(this, e))
        return;
      if (this.paused) {
        this._emitQueue.push([index, e]);
        return;
      }
      var abs = isAbsolute2(e) ? e : this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute)
        e = abs;
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      var st = this.statCache[abs];
      if (st)
        this.emit("stat", e, st);
      this.emit("match", e);
    };
    Glob.prototype._readdirInGlobStar = function(abs, cb) {
      if (this.aborted)
        return;
      if (this.follow)
        return this._readdir(abs, false, cb);
      var lstatkey = "lstat\0" + abs;
      var self2 = this;
      var lstatcb = inflight(lstatkey, lstatcb_);
      if (lstatcb)
        fs4.lstat(abs, lstatcb);
      function lstatcb_(er, lstat) {
        if (er && er.code === "ENOENT")
          return cb();
        var isSym = lstat && lstat.isSymbolicLink();
        self2.symlinks[abs] = isSym;
        if (!isSym && lstat && !lstat.isDirectory()) {
          self2.cache[abs] = "FILE";
          cb();
        } else
          self2._readdir(abs, false, cb);
      }
    };
    Glob.prototype._readdir = function(abs, inGlobStar, cb) {
      if (this.aborted)
        return;
      cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
      if (!cb)
        return;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs, cb);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return cb();
        if (Array.isArray(c))
          return cb(null, c);
      }
      var self2 = this;
      fs4.readdir(abs, readdirCb(this, abs, cb));
    };
    function readdirCb(self2, abs, cb) {
      return function(er, entries) {
        if (er)
          self2._readdirError(abs, er, cb);
        else
          self2._readdirEntries(abs, entries, cb);
      };
    }
    Glob.prototype._readdirEntries = function(abs, entries, cb) {
      if (this.aborted)
        return;
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return cb(null, entries);
    };
    Glob.prototype._readdirError = function(f, er, cb) {
      if (this.aborted)
        return;
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            this.emit("error", error);
            this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict) {
            this.emit("error", er);
            this.abort();
          }
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
      return cb();
    };
    Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self2 = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        self2._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false, cb);
      var isSym = this.symlinks[abs];
      var len = entries.length;
      if (isSym && inGlobStar)
        return cb();
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true, cb);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true, cb);
      }
      cb();
    };
    Glob.prototype._processSimple = function(prefix, index, cb) {
      var self2 = this;
      this._stat(prefix, function(er, exists) {
        self2._processSimple2(prefix, index, er, exists, cb);
      });
    };
    Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
      if (!this.matches[index])
        this.matches[index] = Object.create(null);
      if (!exists)
        return cb();
      if (prefix && isAbsolute2(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path3.join(this.root, prefix);
        } else {
          prefix = path3.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
      cb();
    };
    Glob.prototype._stat = function(f, cb) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return cb();
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return cb(null, c);
        if (needDir && c === "FILE")
          return cb();
      }
      var exists;
      var stat = this.statCache[abs];
      if (stat !== void 0) {
        if (stat === false)
          return cb(null, stat);
        else {
          var type = stat.isDirectory() ? "DIR" : "FILE";
          if (needDir && type === "FILE")
            return cb();
          else
            return cb(null, type, stat);
        }
      }
      var self2 = this;
      var statcb = inflight("stat\0" + abs, lstatcb_);
      if (statcb)
        fs4.lstat(abs, statcb);
      function lstatcb_(er, lstat) {
        if (lstat && lstat.isSymbolicLink()) {
          return fs4.stat(abs, function(er2, stat2) {
            if (er2)
              self2._stat2(f, abs, null, lstat, cb);
            else
              self2._stat2(f, abs, er2, stat2, cb);
          });
        } else {
          self2._stat2(f, abs, er, lstat, cb);
        }
      }
    };
    Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
      if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
        this.statCache[abs] = false;
        return cb();
      }
      var needDir = f.slice(-1) === "/";
      this.statCache[abs] = stat;
      if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
        return cb(null, false, stat);
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return cb();
      return cb(null, c, stat);
    };
  }
});

// node_modules/lodash/lodash.js
var require_lodash = __commonJS({
  "node_modules/lodash/lodash.js"(exports, module2) {
    (function() {
      var undefined2;
      var VERSION = "4.17.21";
      var LARGE_ARRAY_SIZE = 200;
      var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var MAX_MEMOIZE_SIZE = 500;
      var PLACEHOLDER = "__lodash_placeholder__";
      var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
      var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
      var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
      var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
      var HOT_COUNT = 800, HOT_SPAN = 16;
      var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
      var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
      var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
      var wrapFlags = [
        ["ary", WRAP_ARY_FLAG],
        ["bind", WRAP_BIND_FLAG],
        ["bindKey", WRAP_BIND_KEY_FLAG],
        ["curry", WRAP_CURRY_FLAG],
        ["curryRight", WRAP_CURRY_RIGHT_FLAG],
        ["flip", WRAP_FLIP_FLAG],
        ["partial", WRAP_PARTIAL_FLAG],
        ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
        ["rearg", WRAP_REARG_FLAG]
      ];
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
      var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
      var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
      var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
      var reTrimStart = /^\s+/;
      var reWhitespace = /\s/;
      var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
      var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
      var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
      var reEscapeChar = /\\(\\)?/g;
      var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
      var reFlags = /\w*$/;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var reIsOctal = /^0o[0-7]+$/i;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
      var reNoMatch = /($^)/;
      var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
      var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
      var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
      var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
      var reApos = RegExp(rsApos, "g");
      var reComboMark = RegExp(rsCombo, "g");
      var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
      var reUnicodeWord = RegExp([
        rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
        rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
        rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
        rsUpper + "+" + rsOptContrUpper,
        rsOrdUpper,
        rsOrdLower,
        rsDigits,
        rsEmoji
      ].join("|"), "g");
      var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
      var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
      var contextProps = [
        "Array",
        "Buffer",
        "DataView",
        "Date",
        "Error",
        "Float32Array",
        "Float64Array",
        "Function",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Map",
        "Math",
        "Object",
        "Promise",
        "RegExp",
        "Set",
        "String",
        "Symbol",
        "TypeError",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "WeakMap",
        "_",
        "clearTimeout",
        "isFinite",
        "parseInt",
        "setTimeout"
      ];
      var templateCounter = -1;
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
      var cloneableTags = {};
      cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      var deburredLetters = {
        "\xC0": "A",
        "\xC1": "A",
        "\xC2": "A",
        "\xC3": "A",
        "\xC4": "A",
        "\xC5": "A",
        "\xE0": "a",
        "\xE1": "a",
        "\xE2": "a",
        "\xE3": "a",
        "\xE4": "a",
        "\xE5": "a",
        "\xC7": "C",
        "\xE7": "c",
        "\xD0": "D",
        "\xF0": "d",
        "\xC8": "E",
        "\xC9": "E",
        "\xCA": "E",
        "\xCB": "E",
        "\xE8": "e",
        "\xE9": "e",
        "\xEA": "e",
        "\xEB": "e",
        "\xCC": "I",
        "\xCD": "I",
        "\xCE": "I",
        "\xCF": "I",
        "\xEC": "i",
        "\xED": "i",
        "\xEE": "i",
        "\xEF": "i",
        "\xD1": "N",
        "\xF1": "n",
        "\xD2": "O",
        "\xD3": "O",
        "\xD4": "O",
        "\xD5": "O",
        "\xD6": "O",
        "\xD8": "O",
        "\xF2": "o",
        "\xF3": "o",
        "\xF4": "o",
        "\xF5": "o",
        "\xF6": "o",
        "\xF8": "o",
        "\xD9": "U",
        "\xDA": "U",
        "\xDB": "U",
        "\xDC": "U",
        "\xF9": "u",
        "\xFA": "u",
        "\xFB": "u",
        "\xFC": "u",
        "\xDD": "Y",
        "\xFD": "y",
        "\xFF": "y",
        "\xC6": "Ae",
        "\xE6": "ae",
        "\xDE": "Th",
        "\xFE": "th",
        "\xDF": "ss",
        "\u0100": "A",
        "\u0102": "A",
        "\u0104": "A",
        "\u0101": "a",
        "\u0103": "a",
        "\u0105": "a",
        "\u0106": "C",
        "\u0108": "C",
        "\u010A": "C",
        "\u010C": "C",
        "\u0107": "c",
        "\u0109": "c",
        "\u010B": "c",
        "\u010D": "c",
        "\u010E": "D",
        "\u0110": "D",
        "\u010F": "d",
        "\u0111": "d",
        "\u0112": "E",
        "\u0114": "E",
        "\u0116": "E",
        "\u0118": "E",
        "\u011A": "E",
        "\u0113": "e",
        "\u0115": "e",
        "\u0117": "e",
        "\u0119": "e",
        "\u011B": "e",
        "\u011C": "G",
        "\u011E": "G",
        "\u0120": "G",
        "\u0122": "G",
        "\u011D": "g",
        "\u011F": "g",
        "\u0121": "g",
        "\u0123": "g",
        "\u0124": "H",
        "\u0126": "H",
        "\u0125": "h",
        "\u0127": "h",
        "\u0128": "I",
        "\u012A": "I",
        "\u012C": "I",
        "\u012E": "I",
        "\u0130": "I",
        "\u0129": "i",
        "\u012B": "i",
        "\u012D": "i",
        "\u012F": "i",
        "\u0131": "i",
        "\u0134": "J",
        "\u0135": "j",
        "\u0136": "K",
        "\u0137": "k",
        "\u0138": "k",
        "\u0139": "L",
        "\u013B": "L",
        "\u013D": "L",
        "\u013F": "L",
        "\u0141": "L",
        "\u013A": "l",
        "\u013C": "l",
        "\u013E": "l",
        "\u0140": "l",
        "\u0142": "l",
        "\u0143": "N",
        "\u0145": "N",
        "\u0147": "N",
        "\u014A": "N",
        "\u0144": "n",
        "\u0146": "n",
        "\u0148": "n",
        "\u014B": "n",
        "\u014C": "O",
        "\u014E": "O",
        "\u0150": "O",
        "\u014D": "o",
        "\u014F": "o",
        "\u0151": "o",
        "\u0154": "R",
        "\u0156": "R",
        "\u0158": "R",
        "\u0155": "r",
        "\u0157": "r",
        "\u0159": "r",
        "\u015A": "S",
        "\u015C": "S",
        "\u015E": "S",
        "\u0160": "S",
        "\u015B": "s",
        "\u015D": "s",
        "\u015F": "s",
        "\u0161": "s",
        "\u0162": "T",
        "\u0164": "T",
        "\u0166": "T",
        "\u0163": "t",
        "\u0165": "t",
        "\u0167": "t",
        "\u0168": "U",
        "\u016A": "U",
        "\u016C": "U",
        "\u016E": "U",
        "\u0170": "U",
        "\u0172": "U",
        "\u0169": "u",
        "\u016B": "u",
        "\u016D": "u",
        "\u016F": "u",
        "\u0171": "u",
        "\u0173": "u",
        "\u0174": "W",
        "\u0175": "w",
        "\u0176": "Y",
        "\u0177": "y",
        "\u0178": "Y",
        "\u0179": "Z",
        "\u017B": "Z",
        "\u017D": "Z",
        "\u017A": "z",
        "\u017C": "z",
        "\u017E": "z",
        "\u0132": "IJ",
        "\u0133": "ij",
        "\u0152": "Oe",
        "\u0153": "oe",
        "\u0149": "'n",
        "\u017F": "s"
      };
      var htmlEscapes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      var htmlUnescapes = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      };
      var stringEscapes = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
      };
      var freeParseFloat = parseFloat, freeParseInt = parseInt;
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var freeProcess = moduleExports && freeGlobal.process;
      var nodeUtil = function() {
        try {
          var types = freeModule && freeModule.require && freeModule.require("util").types;
          if (types) {
            return types;
          }
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e) {
        }
      }();
      var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      function apply(func, thisArg, args) {
        switch (args.length) {
          case 0:
            return func.call(thisArg);
          case 1:
            return func.call(thisArg, args[0]);
          case 2:
            return func.call(thisArg, args[0], args[1]);
          case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
      }
      function arrayAggregator(array, setter, iteratee, accumulator) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          var value = array[index];
          setter(accumulator, value, iteratee(value), array);
        }
        return accumulator;
      }
      function arrayEach(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }
      function arrayEachRight(array, iteratee) {
        var length = array == null ? 0 : array.length;
        while (length--) {
          if (iteratee(array[length], length, array) === false) {
            break;
          }
        }
        return array;
      }
      function arrayEvery(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (!predicate(array[index], index, array)) {
            return false;
          }
        }
        return true;
      }
      function arrayFilter(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result[resIndex++] = value;
          }
        }
        return result;
      }
      function arrayIncludes(array, value) {
        var length = array == null ? 0 : array.length;
        return !!length && baseIndexOf(array, value, 0) > -1;
      }
      function arrayIncludesWith(array, value, comparator) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (comparator(value, array[index])) {
            return true;
          }
        }
        return false;
      }
      function arrayMap(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      function arrayPush(array, values) {
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) {
          array[offset + index] = values[index];
        }
        return array;
      }
      function arrayReduce(array, iteratee, accumulator, initAccum) {
        var index = -1, length = array == null ? 0 : array.length;
        if (initAccum && length) {
          accumulator = array[++index];
        }
        while (++index < length) {
          accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
      }
      function arrayReduceRight(array, iteratee, accumulator, initAccum) {
        var length = array == null ? 0 : array.length;
        if (initAccum && length) {
          accumulator = array[--length];
        }
        while (length--) {
          accumulator = iteratee(accumulator, array[length], length, array);
        }
        return accumulator;
      }
      function arraySome(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (predicate(array[index], index, array)) {
            return true;
          }
        }
        return false;
      }
      var asciiSize = baseProperty("length");
      function asciiToArray(string) {
        return string.split("");
      }
      function asciiWords(string) {
        return string.match(reAsciiWord) || [];
      }
      function baseFindKey(collection, predicate, eachFunc) {
        var result;
        eachFunc(collection, function(value, key, collection2) {
          if (predicate(value, key, collection2)) {
            result = key;
            return false;
          }
        });
        return result;
      }
      function baseFindIndex(array, predicate, fromIndex, fromRight) {
        var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
        while (fromRight ? index-- : ++index < length) {
          if (predicate(array[index], index, array)) {
            return index;
          }
        }
        return -1;
      }
      function baseIndexOf(array, value, fromIndex) {
        return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
      }
      function baseIndexOfWith(array, value, fromIndex, comparator) {
        var index = fromIndex - 1, length = array.length;
        while (++index < length) {
          if (comparator(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function baseIsNaN(value) {
        return value !== value;
      }
      function baseMean(array, iteratee) {
        var length = array == null ? 0 : array.length;
        return length ? baseSum(array, iteratee) / length : NAN;
      }
      function baseProperty(key) {
        return function(object) {
          return object == null ? undefined2 : object[key];
        };
      }
      function basePropertyOf(object) {
        return function(key) {
          return object == null ? undefined2 : object[key];
        };
      }
      function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
        eachFunc(collection, function(value, index, collection2) {
          accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
        });
        return accumulator;
      }
      function baseSortBy(array, comparer) {
        var length = array.length;
        array.sort(comparer);
        while (length--) {
          array[length] = array[length].value;
        }
        return array;
      }
      function baseSum(array, iteratee) {
        var result, index = -1, length = array.length;
        while (++index < length) {
          var current = iteratee(array[index]);
          if (current !== undefined2) {
            result = result === undefined2 ? current : result + current;
          }
        }
        return result;
      }
      function baseTimes(n, iteratee) {
        var index = -1, result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      function baseToPairs(object, props) {
        return arrayMap(props, function(key) {
          return [key, object[key]];
        });
      }
      function baseTrim(string) {
        return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
      }
      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
      function baseValues(object, props) {
        return arrayMap(props, function(key) {
          return object[key];
        });
      }
      function cacheHas(cache, key) {
        return cache.has(key);
      }
      function charsStartIndex(strSymbols, chrSymbols) {
        var index = -1, length = strSymbols.length;
        while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
        }
        return index;
      }
      function charsEndIndex(strSymbols, chrSymbols) {
        var index = strSymbols.length;
        while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
        }
        return index;
      }
      function countHolders(array, placeholder) {
        var length = array.length, result = 0;
        while (length--) {
          if (array[length] === placeholder) {
            ++result;
          }
        }
        return result;
      }
      var deburrLetter = basePropertyOf(deburredLetters);
      var escapeHtmlChar = basePropertyOf(htmlEscapes);
      function escapeStringChar(chr) {
        return "\\" + stringEscapes[chr];
      }
      function getValue(object, key) {
        return object == null ? undefined2 : object[key];
      }
      function hasUnicode(string) {
        return reHasUnicode.test(string);
      }
      function hasUnicodeWord(string) {
        return reHasUnicodeWord.test(string);
      }
      function iteratorToArray(iterator) {
        var data, result = [];
        while (!(data = iterator.next()).done) {
          result.push(data.value);
        }
        return result;
      }
      function mapToArray(map) {
        var index = -1, result = Array(map.size);
        map.forEach(function(value, key) {
          result[++index] = [key, value];
        });
        return result;
      }
      function overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }
      function replaceHolders(array, placeholder) {
        var index = -1, length = array.length, resIndex = 0, result = [];
        while (++index < length) {
          var value = array[index];
          if (value === placeholder || value === PLACEHOLDER) {
            array[index] = PLACEHOLDER;
            result[resIndex++] = index;
          }
        }
        return result;
      }
      function setToArray(set) {
        var index = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      }
      function setToPairs(set) {
        var index = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = [value, value];
        });
        return result;
      }
      function strictIndexOf(array, value, fromIndex) {
        var index = fromIndex - 1, length = array.length;
        while (++index < length) {
          if (array[index] === value) {
            return index;
          }
        }
        return -1;
      }
      function strictLastIndexOf(array, value, fromIndex) {
        var index = fromIndex + 1;
        while (index--) {
          if (array[index] === value) {
            return index;
          }
        }
        return index;
      }
      function stringSize(string) {
        return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
      }
      function stringToArray(string) {
        return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
      }
      function trimmedEndIndex(string) {
        var index = string.length;
        while (index-- && reWhitespace.test(string.charAt(index))) {
        }
        return index;
      }
      var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
      function unicodeSize(string) {
        var result = reUnicode.lastIndex = 0;
        while (reUnicode.test(string)) {
          ++result;
        }
        return result;
      }
      function unicodeToArray(string) {
        return string.match(reUnicode) || [];
      }
      function unicodeWords(string) {
        return string.match(reUnicodeWord) || [];
      }
      var runInContext = function runInContext2(context) {
        context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
        var Array2 = context.Array, Date2 = context.Date, Error2 = context.Error, Function2 = context.Function, Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String2 = context.String, TypeError2 = context.TypeError;
        var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto = Object2.prototype;
        var coreJsData = context["__core-js_shared__"];
        var funcToString = funcProto.toString;
        var hasOwnProperty = objectProto.hasOwnProperty;
        var idCounter = 0;
        var maskSrcKey = function() {
          var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
          return uid ? "Symbol(src)_1." + uid : "";
        }();
        var nativeObjectToString = objectProto.toString;
        var objectCtorString = funcToString.call(Object2);
        var oldDash = root._;
        var reIsNative = RegExp2("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
        var Buffer2 = moduleExports ? context.Buffer : undefined2, Symbol = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined2, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined2, symIterator = Symbol ? Symbol.iterator : undefined2, symToStringTag = Symbol ? Symbol.toStringTag : undefined2;
        var defineProperty = function() {
          try {
            var func = getNative(Object2, "defineProperty");
            func({}, "", {});
            return func;
          } catch (e) {
          }
        }();
        var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout, ctxNow = Date2 && Date2.now !== root.Date.now && Date2.now, ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
        var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined2, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date2.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
        var DataView = getNative(context, "DataView"), Map2 = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set = getNative(context, "Set"), WeakMap = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
        var metaMap = WeakMap && new WeakMap();
        var realNames = {};
        var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map2), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
        var symbolProto = Symbol ? Symbol.prototype : undefined2, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined2, symbolToString = symbolProto ? symbolProto.toString : undefined2;
        function lodash(value) {
          if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
            if (value instanceof LodashWrapper) {
              return value;
            }
            if (hasOwnProperty.call(value, "__wrapped__")) {
              return wrapperClone(value);
            }
          }
          return new LodashWrapper(value);
        }
        var baseCreate = function() {
          function object() {
          }
          return function(proto) {
            if (!isObject(proto)) {
              return {};
            }
            if (objectCreate) {
              return objectCreate(proto);
            }
            object.prototype = proto;
            var result2 = new object();
            object.prototype = undefined2;
            return result2;
          };
        }();
        function baseLodash() {
        }
        function LodashWrapper(value, chainAll) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__chain__ = !!chainAll;
          this.__index__ = 0;
          this.__values__ = undefined2;
        }
        lodash.templateSettings = {
          "escape": reEscape,
          "evaluate": reEvaluate,
          "interpolate": reInterpolate,
          "variable": "",
          "imports": {
            "_": lodash
          }
        };
        lodash.prototype = baseLodash.prototype;
        lodash.prototype.constructor = lodash;
        LodashWrapper.prototype = baseCreate(baseLodash.prototype);
        LodashWrapper.prototype.constructor = LodashWrapper;
        function LazyWrapper(value) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__dir__ = 1;
          this.__filtered__ = false;
          this.__iteratees__ = [];
          this.__takeCount__ = MAX_ARRAY_LENGTH;
          this.__views__ = [];
        }
        function lazyClone() {
          var result2 = new LazyWrapper(this.__wrapped__);
          result2.__actions__ = copyArray(this.__actions__);
          result2.__dir__ = this.__dir__;
          result2.__filtered__ = this.__filtered__;
          result2.__iteratees__ = copyArray(this.__iteratees__);
          result2.__takeCount__ = this.__takeCount__;
          result2.__views__ = copyArray(this.__views__);
          return result2;
        }
        function lazyReverse() {
          if (this.__filtered__) {
            var result2 = new LazyWrapper(this);
            result2.__dir__ = -1;
            result2.__filtered__ = true;
          } else {
            result2 = this.clone();
            result2.__dir__ *= -1;
          }
          return result2;
        }
        function lazyValue() {
          var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
          if (!isArr || !isRight && arrLength == length && takeCount == length) {
            return baseWrapperValue(array, this.__actions__);
          }
          var result2 = [];
          outer:
            while (length-- && resIndex < takeCount) {
              index += dir;
              var iterIndex = -1, value = array[index];
              while (++iterIndex < iterLength) {
                var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
                if (type == LAZY_MAP_FLAG) {
                  value = computed;
                } else if (!computed) {
                  if (type == LAZY_FILTER_FLAG) {
                    continue outer;
                  } else {
                    break outer;
                  }
                }
              }
              result2[resIndex++] = value;
            }
          return result2;
        }
        LazyWrapper.prototype = baseCreate(baseLodash.prototype);
        LazyWrapper.prototype.constructor = LazyWrapper;
        function Hash(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function hashClear() {
          this.__data__ = nativeCreate ? nativeCreate(null) : {};
          this.size = 0;
        }
        function hashDelete(key) {
          var result2 = this.has(key) && delete this.__data__[key];
          this.size -= result2 ? 1 : 0;
          return result2;
        }
        function hashGet(key) {
          var data = this.__data__;
          if (nativeCreate) {
            var result2 = data[key];
            return result2 === HASH_UNDEFINED ? undefined2 : result2;
          }
          return hasOwnProperty.call(data, key) ? data[key] : undefined2;
        }
        function hashHas(key) {
          var data = this.__data__;
          return nativeCreate ? data[key] !== undefined2 : hasOwnProperty.call(data, key);
        }
        function hashSet(key, value) {
          var data = this.__data__;
          this.size += this.has(key) ? 0 : 1;
          data[key] = nativeCreate && value === undefined2 ? HASH_UNDEFINED : value;
          return this;
        }
        Hash.prototype.clear = hashClear;
        Hash.prototype["delete"] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;
        function ListCache(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function listCacheClear() {
          this.__data__ = [];
          this.size = 0;
        }
        function listCacheDelete(key) {
          var data = this.__data__, index = assocIndexOf(data, key);
          if (index < 0) {
            return false;
          }
          var lastIndex = data.length - 1;
          if (index == lastIndex) {
            data.pop();
          } else {
            splice.call(data, index, 1);
          }
          --this.size;
          return true;
        }
        function listCacheGet(key) {
          var data = this.__data__, index = assocIndexOf(data, key);
          return index < 0 ? undefined2 : data[index][1];
        }
        function listCacheHas(key) {
          return assocIndexOf(this.__data__, key) > -1;
        }
        function listCacheSet(key, value) {
          var data = this.__data__, index = assocIndexOf(data, key);
          if (index < 0) {
            ++this.size;
            data.push([key, value]);
          } else {
            data[index][1] = value;
          }
          return this;
        }
        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype["delete"] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;
        function MapCache(entries) {
          var index = -1, length = entries == null ? 0 : entries.length;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function mapCacheClear() {
          this.size = 0;
          this.__data__ = {
            "hash": new Hash(),
            "map": new (Map2 || ListCache)(),
            "string": new Hash()
          };
        }
        function mapCacheDelete(key) {
          var result2 = getMapData(this, key)["delete"](key);
          this.size -= result2 ? 1 : 0;
          return result2;
        }
        function mapCacheGet(key) {
          return getMapData(this, key).get(key);
        }
        function mapCacheHas(key) {
          return getMapData(this, key).has(key);
        }
        function mapCacheSet(key, value) {
          var data = getMapData(this, key), size2 = data.size;
          data.set(key, value);
          this.size += data.size == size2 ? 0 : 1;
          return this;
        }
        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype["delete"] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;
        function SetCache(values2) {
          var index = -1, length = values2 == null ? 0 : values2.length;
          this.__data__ = new MapCache();
          while (++index < length) {
            this.add(values2[index]);
          }
        }
        function setCacheAdd(value) {
          this.__data__.set(value, HASH_UNDEFINED);
          return this;
        }
        function setCacheHas(value) {
          return this.__data__.has(value);
        }
        SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
        SetCache.prototype.has = setCacheHas;
        function Stack(entries) {
          var data = this.__data__ = new ListCache(entries);
          this.size = data.size;
        }
        function stackClear() {
          this.__data__ = new ListCache();
          this.size = 0;
        }
        function stackDelete(key) {
          var data = this.__data__, result2 = data["delete"](key);
          this.size = data.size;
          return result2;
        }
        function stackGet(key) {
          return this.__data__.get(key);
        }
        function stackHas(key) {
          return this.__data__.has(key);
        }
        function stackSet(key, value) {
          var data = this.__data__;
          if (data instanceof ListCache) {
            var pairs = data.__data__;
            if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
              pairs.push([key, value]);
              this.size = ++data.size;
              return this;
            }
            data = this.__data__ = new MapCache(pairs);
          }
          data.set(key, value);
          this.size = data.size;
          return this;
        }
        Stack.prototype.clear = stackClear;
        Stack.prototype["delete"] = stackDelete;
        Stack.prototype.get = stackGet;
        Stack.prototype.has = stackHas;
        Stack.prototype.set = stackSet;
        function arrayLikeKeys(value, inherited) {
          var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String2) : [], length = result2.length;
          for (var key in value) {
            if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
              result2.push(key);
            }
          }
          return result2;
        }
        function arraySample(array) {
          var length = array.length;
          return length ? array[baseRandom(0, length - 1)] : undefined2;
        }
        function arraySampleSize(array, n) {
          return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
        }
        function arrayShuffle(array) {
          return shuffleSelf(copyArray(array));
        }
        function assignMergeValue(object, key, value) {
          if (value !== undefined2 && !eq(object[key], value) || value === undefined2 && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        function assignValue(object, key, value) {
          var objValue = object[key];
          if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined2 && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        function assocIndexOf(array, key) {
          var length = array.length;
          while (length--) {
            if (eq(array[length][0], key)) {
              return length;
            }
          }
          return -1;
        }
        function baseAggregator(collection, setter, iteratee2, accumulator) {
          baseEach(collection, function(value, key, collection2) {
            setter(accumulator, value, iteratee2(value), collection2);
          });
          return accumulator;
        }
        function baseAssign(object, source) {
          return object && copyObject(source, keys(source), object);
        }
        function baseAssignIn(object, source) {
          return object && copyObject(source, keysIn(source), object);
        }
        function baseAssignValue(object, key, value) {
          if (key == "__proto__" && defineProperty) {
            defineProperty(object, key, {
              "configurable": true,
              "enumerable": true,
              "value": value,
              "writable": true
            });
          } else {
            object[key] = value;
          }
        }
        function baseAt(object, paths) {
          var index = -1, length = paths.length, result2 = Array2(length), skip = object == null;
          while (++index < length) {
            result2[index] = skip ? undefined2 : get(object, paths[index]);
          }
          return result2;
        }
        function baseClamp(number, lower, upper) {
          if (number === number) {
            if (upper !== undefined2) {
              number = number <= upper ? number : upper;
            }
            if (lower !== undefined2) {
              number = number >= lower ? number : lower;
            }
          }
          return number;
        }
        function baseClone(value, bitmask, customizer, key, object, stack) {
          var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
          if (customizer) {
            result2 = object ? customizer(value, key, object, stack) : customizer(value);
          }
          if (result2 !== undefined2) {
            return result2;
          }
          if (!isObject(value)) {
            return value;
          }
          var isArr = isArray(value);
          if (isArr) {
            result2 = initCloneArray(value);
            if (!isDeep) {
              return copyArray(value, result2);
            }
          } else {
            var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
            if (isBuffer(value)) {
              return cloneBuffer(value, isDeep);
            }
            if (tag == objectTag || tag == argsTag || isFunc && !object) {
              result2 = isFlat || isFunc ? {} : initCloneObject(value);
              if (!isDeep) {
                return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
              }
            } else {
              if (!cloneableTags[tag]) {
                return object ? value : {};
              }
              result2 = initCloneByTag(value, tag, isDeep);
            }
          }
          stack || (stack = new Stack());
          var stacked = stack.get(value);
          if (stacked) {
            return stacked;
          }
          stack.set(value, result2);
          if (isSet(value)) {
            value.forEach(function(subValue) {
              result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
            });
          } else if (isMap(value)) {
            value.forEach(function(subValue, key2) {
              result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
            });
          }
          var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
          var props = isArr ? undefined2 : keysFunc(value);
          arrayEach(props || value, function(subValue, key2) {
            if (props) {
              key2 = subValue;
              subValue = value[key2];
            }
            assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
          });
          return result2;
        }
        function baseConforms(source) {
          var props = keys(source);
          return function(object) {
            return baseConformsTo(object, source, props);
          };
        }
        function baseConformsTo(object, source, props) {
          var length = props.length;
          if (object == null) {
            return !length;
          }
          object = Object2(object);
          while (length--) {
            var key = props[length], predicate = source[key], value = object[key];
            if (value === undefined2 && !(key in object) || !predicate(value)) {
              return false;
            }
          }
          return true;
        }
        function baseDelay(func, wait, args) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return setTimeout2(function() {
            func.apply(undefined2, args);
          }, wait);
        }
        function baseDifference(array, values2, iteratee2, comparator) {
          var index = -1, includes2 = arrayIncludes, isCommon = true, length = array.length, result2 = [], valuesLength = values2.length;
          if (!length) {
            return result2;
          }
          if (iteratee2) {
            values2 = arrayMap(values2, baseUnary(iteratee2));
          }
          if (comparator) {
            includes2 = arrayIncludesWith;
            isCommon = false;
          } else if (values2.length >= LARGE_ARRAY_SIZE) {
            includes2 = cacheHas;
            isCommon = false;
            values2 = new SetCache(values2);
          }
          outer:
            while (++index < length) {
              var value = array[index], computed = iteratee2 == null ? value : iteratee2(value);
              value = comparator || value !== 0 ? value : 0;
              if (isCommon && computed === computed) {
                var valuesIndex = valuesLength;
                while (valuesIndex--) {
                  if (values2[valuesIndex] === computed) {
                    continue outer;
                  }
                }
                result2.push(value);
              } else if (!includes2(values2, computed, comparator)) {
                result2.push(value);
              }
            }
          return result2;
        }
        var baseEach = createBaseEach(baseForOwn);
        var baseEachRight = createBaseEach(baseForOwnRight, true);
        function baseEvery(collection, predicate) {
          var result2 = true;
          baseEach(collection, function(value, index, collection2) {
            result2 = !!predicate(value, index, collection2);
            return result2;
          });
          return result2;
        }
        function baseExtremum(array, iteratee2, comparator) {
          var index = -1, length = array.length;
          while (++index < length) {
            var value = array[index], current = iteratee2(value);
            if (current != null && (computed === undefined2 ? current === current && !isSymbol(current) : comparator(current, computed))) {
              var computed = current, result2 = value;
            }
          }
          return result2;
        }
        function baseFill(array, value, start, end) {
          var length = array.length;
          start = toInteger(start);
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end === undefined2 || end > length ? length : toInteger(end);
          if (end < 0) {
            end += length;
          }
          end = start > end ? 0 : toLength(end);
          while (start < end) {
            array[start++] = value;
          }
          return array;
        }
        function baseFilter(collection, predicate) {
          var result2 = [];
          baseEach(collection, function(value, index, collection2) {
            if (predicate(value, index, collection2)) {
              result2.push(value);
            }
          });
          return result2;
        }
        function baseFlatten(array, depth, predicate, isStrict, result2) {
          var index = -1, length = array.length;
          predicate || (predicate = isFlattenable);
          result2 || (result2 = []);
          while (++index < length) {
            var value = array[index];
            if (depth > 0 && predicate(value)) {
              if (depth > 1) {
                baseFlatten(value, depth - 1, predicate, isStrict, result2);
              } else {
                arrayPush(result2, value);
              }
            } else if (!isStrict) {
              result2[result2.length] = value;
            }
          }
          return result2;
        }
        var baseFor = createBaseFor();
        var baseForRight = createBaseFor(true);
        function baseForOwn(object, iteratee2) {
          return object && baseFor(object, iteratee2, keys);
        }
        function baseForOwnRight(object, iteratee2) {
          return object && baseForRight(object, iteratee2, keys);
        }
        function baseFunctions(object, props) {
          return arrayFilter(props, function(key) {
            return isFunction(object[key]);
          });
        }
        function baseGet(object, path3) {
          path3 = castPath(path3, object);
          var index = 0, length = path3.length;
          while (object != null && index < length) {
            object = object[toKey(path3[index++])];
          }
          return index && index == length ? object : undefined2;
        }
        function baseGetAllKeys(object, keysFunc, symbolsFunc) {
          var result2 = keysFunc(object);
          return isArray(object) ? result2 : arrayPush(result2, symbolsFunc(object));
        }
        function baseGetTag(value) {
          if (value == null) {
            return value === undefined2 ? undefinedTag : nullTag;
          }
          return symToStringTag && symToStringTag in Object2(value) ? getRawTag(value) : objectToString(value);
        }
        function baseGt(value, other) {
          return value > other;
        }
        function baseHas(object, key) {
          return object != null && hasOwnProperty.call(object, key);
        }
        function baseHasIn(object, key) {
          return object != null && key in Object2(object);
        }
        function baseInRange(number, start, end) {
          return number >= nativeMin(start, end) && number < nativeMax(start, end);
        }
        function baseIntersection(arrays, iteratee2, comparator) {
          var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
          while (othIndex--) {
            var array = arrays[othIndex];
            if (othIndex && iteratee2) {
              array = arrayMap(array, baseUnary(iteratee2));
            }
            maxLength = nativeMin(array.length, maxLength);
            caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined2;
          }
          array = arrays[0];
          var index = -1, seen = caches[0];
          outer:
            while (++index < length && result2.length < maxLength) {
              var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
              value = comparator || value !== 0 ? value : 0;
              if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
                othIndex = othLength;
                while (--othIndex) {
                  var cache = caches[othIndex];
                  if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                    continue outer;
                  }
                }
                if (seen) {
                  seen.push(computed);
                }
                result2.push(value);
              }
            }
          return result2;
        }
        function baseInverter(object, setter, iteratee2, accumulator) {
          baseForOwn(object, function(value, key, object2) {
            setter(accumulator, iteratee2(value), key, object2);
          });
          return accumulator;
        }
        function baseInvoke(object, path3, args) {
          path3 = castPath(path3, object);
          object = parent(object, path3);
          var func = object == null ? object : object[toKey(last(path3))];
          return func == null ? undefined2 : apply(func, object, args);
        }
        function baseIsArguments(value) {
          return isObjectLike(value) && baseGetTag(value) == argsTag;
        }
        function baseIsArrayBuffer(value) {
          return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
        }
        function baseIsDate(value) {
          return isObjectLike(value) && baseGetTag(value) == dateTag;
        }
        function baseIsEqual(value, other, bitmask, customizer, stack) {
          if (value === other) {
            return true;
          }
          if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
            return value !== value && other !== other;
          }
          return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
        }
        function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
          var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
          objTag = objTag == argsTag ? objectTag : objTag;
          othTag = othTag == argsTag ? objectTag : othTag;
          var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
          if (isSameTag && isBuffer(object)) {
            if (!isBuffer(other)) {
              return false;
            }
            objIsArr = true;
            objIsObj = false;
          }
          if (isSameTag && !objIsObj) {
            stack || (stack = new Stack());
            return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
          }
          if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
            var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
            if (objIsWrapped || othIsWrapped) {
              var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
              stack || (stack = new Stack());
              return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
            }
          }
          if (!isSameTag) {
            return false;
          }
          stack || (stack = new Stack());
          return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
        }
        function baseIsMap(value) {
          return isObjectLike(value) && getTag(value) == mapTag;
        }
        function baseIsMatch(object, source, matchData, customizer) {
          var index = matchData.length, length = index, noCustomizer = !customizer;
          if (object == null) {
            return !length;
          }
          object = Object2(object);
          while (index--) {
            var data = matchData[index];
            if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
              return false;
            }
          }
          while (++index < length) {
            data = matchData[index];
            var key = data[0], objValue = object[key], srcValue = data[1];
            if (noCustomizer && data[2]) {
              if (objValue === undefined2 && !(key in object)) {
                return false;
              }
            } else {
              var stack = new Stack();
              if (customizer) {
                var result2 = customizer(objValue, srcValue, key, object, source, stack);
              }
              if (!(result2 === undefined2 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
                return false;
              }
            }
          }
          return true;
        }
        function baseIsNative(value) {
          if (!isObject(value) || isMasked(value)) {
            return false;
          }
          var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
          return pattern.test(toSource(value));
        }
        function baseIsRegExp(value) {
          return isObjectLike(value) && baseGetTag(value) == regexpTag;
        }
        function baseIsSet(value) {
          return isObjectLike(value) && getTag(value) == setTag;
        }
        function baseIsTypedArray(value) {
          return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
        }
        function baseIteratee(value) {
          if (typeof value == "function") {
            return value;
          }
          if (value == null) {
            return identity;
          }
          if (typeof value == "object") {
            return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
          }
          return property(value);
        }
        function baseKeys(object) {
          if (!isPrototype(object)) {
            return nativeKeys(object);
          }
          var result2 = [];
          for (var key in Object2(object)) {
            if (hasOwnProperty.call(object, key) && key != "constructor") {
              result2.push(key);
            }
          }
          return result2;
        }
        function baseKeysIn(object) {
          if (!isObject(object)) {
            return nativeKeysIn(object);
          }
          var isProto = isPrototype(object), result2 = [];
          for (var key in object) {
            if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
              result2.push(key);
            }
          }
          return result2;
        }
        function baseLt(value, other) {
          return value < other;
        }
        function baseMap(collection, iteratee2) {
          var index = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value, key, collection2) {
            result2[++index] = iteratee2(value, key, collection2);
          });
          return result2;
        }
        function baseMatches(source) {
          var matchData = getMatchData(source);
          if (matchData.length == 1 && matchData[0][2]) {
            return matchesStrictComparable(matchData[0][0], matchData[0][1]);
          }
          return function(object) {
            return object === source || baseIsMatch(object, source, matchData);
          };
        }
        function baseMatchesProperty(path3, srcValue) {
          if (isKey(path3) && isStrictComparable(srcValue)) {
            return matchesStrictComparable(toKey(path3), srcValue);
          }
          return function(object) {
            var objValue = get(object, path3);
            return objValue === undefined2 && objValue === srcValue ? hasIn(object, path3) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
          };
        }
        function baseMerge(object, source, srcIndex, customizer, stack) {
          if (object === source) {
            return;
          }
          baseFor(source, function(srcValue, key) {
            stack || (stack = new Stack());
            if (isObject(srcValue)) {
              baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
            } else {
              var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined2;
              if (newValue === undefined2) {
                newValue = srcValue;
              }
              assignMergeValue(object, key, newValue);
            }
          }, keysIn);
        }
        function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
          var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
          if (stacked) {
            assignMergeValue(object, key, stacked);
            return;
          }
          var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined2;
          var isCommon = newValue === undefined2;
          if (isCommon) {
            var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
            newValue = srcValue;
            if (isArr || isBuff || isTyped) {
              if (isArray(objValue)) {
                newValue = objValue;
              } else if (isArrayLikeObject(objValue)) {
                newValue = copyArray(objValue);
              } else if (isBuff) {
                isCommon = false;
                newValue = cloneBuffer(srcValue, true);
              } else if (isTyped) {
                isCommon = false;
                newValue = cloneTypedArray(srcValue, true);
              } else {
                newValue = [];
              }
            } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
              newValue = objValue;
              if (isArguments(objValue)) {
                newValue = toPlainObject(objValue);
              } else if (!isObject(objValue) || isFunction(objValue)) {
                newValue = initCloneObject(srcValue);
              }
            } else {
              isCommon = false;
            }
          }
          if (isCommon) {
            stack.set(srcValue, newValue);
            mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
            stack["delete"](srcValue);
          }
          assignMergeValue(object, key, newValue);
        }
        function baseNth(array, n) {
          var length = array.length;
          if (!length) {
            return;
          }
          n += n < 0 ? length : 0;
          return isIndex(n, length) ? array[n] : undefined2;
        }
        function baseOrderBy(collection, iteratees, orders) {
          if (iteratees.length) {
            iteratees = arrayMap(iteratees, function(iteratee2) {
              if (isArray(iteratee2)) {
                return function(value) {
                  return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
                };
              }
              return iteratee2;
            });
          } else {
            iteratees = [identity];
          }
          var index = -1;
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          var result2 = baseMap(collection, function(value, key, collection2) {
            var criteria = arrayMap(iteratees, function(iteratee2) {
              return iteratee2(value);
            });
            return { "criteria": criteria, "index": ++index, "value": value };
          });
          return baseSortBy(result2, function(object, other) {
            return compareMultiple(object, other, orders);
          });
        }
        function basePick(object, paths) {
          return basePickBy(object, paths, function(value, path3) {
            return hasIn(object, path3);
          });
        }
        function basePickBy(object, paths, predicate) {
          var index = -1, length = paths.length, result2 = {};
          while (++index < length) {
            var path3 = paths[index], value = baseGet(object, path3);
            if (predicate(value, path3)) {
              baseSet(result2, castPath(path3, object), value);
            }
          }
          return result2;
        }
        function basePropertyDeep(path3) {
          return function(object) {
            return baseGet(object, path3);
          };
        }
        function basePullAll(array, values2, iteratee2, comparator) {
          var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values2.length, seen = array;
          if (array === values2) {
            values2 = copyArray(values2);
          }
          if (iteratee2) {
            seen = arrayMap(array, baseUnary(iteratee2));
          }
          while (++index < length) {
            var fromIndex = 0, value = values2[index], computed = iteratee2 ? iteratee2(value) : value;
            while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
              if (seen !== array) {
                splice.call(seen, fromIndex, 1);
              }
              splice.call(array, fromIndex, 1);
            }
          }
          return array;
        }
        function basePullAt(array, indexes) {
          var length = array ? indexes.length : 0, lastIndex = length - 1;
          while (length--) {
            var index = indexes[length];
            if (length == lastIndex || index !== previous) {
              var previous = index;
              if (isIndex(index)) {
                splice.call(array, index, 1);
              } else {
                baseUnset(array, index);
              }
            }
          }
          return array;
        }
        function baseRandom(lower, upper) {
          return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
        }
        function baseRange(start, end, step, fromRight) {
          var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result2 = Array2(length);
          while (length--) {
            result2[fromRight ? length : ++index] = start;
            start += step;
          }
          return result2;
        }
        function baseRepeat(string, n) {
          var result2 = "";
          if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
            return result2;
          }
          do {
            if (n % 2) {
              result2 += string;
            }
            n = nativeFloor(n / 2);
            if (n) {
              string += string;
            }
          } while (n);
          return result2;
        }
        function baseRest(func, start) {
          return setToString(overRest(func, start, identity), func + "");
        }
        function baseSample(collection) {
          return arraySample(values(collection));
        }
        function baseSampleSize(collection, n) {
          var array = values(collection);
          return shuffleSelf(array, baseClamp(n, 0, array.length));
        }
        function baseSet(object, path3, value, customizer) {
          if (!isObject(object)) {
            return object;
          }
          path3 = castPath(path3, object);
          var index = -1, length = path3.length, lastIndex = length - 1, nested = object;
          while (nested != null && ++index < length) {
            var key = toKey(path3[index]), newValue = value;
            if (key === "__proto__" || key === "constructor" || key === "prototype") {
              return object;
            }
            if (index != lastIndex) {
              var objValue = nested[key];
              newValue = customizer ? customizer(objValue, key, nested) : undefined2;
              if (newValue === undefined2) {
                newValue = isObject(objValue) ? objValue : isIndex(path3[index + 1]) ? [] : {};
              }
            }
            assignValue(nested, key, newValue);
            nested = nested[key];
          }
          return object;
        }
        var baseSetData = !metaMap ? identity : function(func, data) {
          metaMap.set(func, data);
          return func;
        };
        var baseSetToString = !defineProperty ? identity : function(func, string) {
          return defineProperty(func, "toString", {
            "configurable": true,
            "enumerable": false,
            "value": constant(string),
            "writable": true
          });
        };
        function baseShuffle(collection) {
          return shuffleSelf(values(collection));
        }
        function baseSlice(array, start, end) {
          var index = -1, length = array.length;
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end > length ? length : end;
          if (end < 0) {
            end += length;
          }
          length = start > end ? 0 : end - start >>> 0;
          start >>>= 0;
          var result2 = Array2(length);
          while (++index < length) {
            result2[index] = array[index + start];
          }
          return result2;
        }
        function baseSome(collection, predicate) {
          var result2;
          baseEach(collection, function(value, index, collection2) {
            result2 = predicate(value, index, collection2);
            return !result2;
          });
          return !!result2;
        }
        function baseSortedIndex(array, value, retHighest) {
          var low = 0, high = array == null ? low : array.length;
          if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
            while (low < high) {
              var mid = low + high >>> 1, computed = array[mid];
              if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }
            return high;
          }
          return baseSortedIndexBy(array, value, identity, retHighest);
        }
        function baseSortedIndexBy(array, value, iteratee2, retHighest) {
          var low = 0, high = array == null ? 0 : array.length;
          if (high === 0) {
            return 0;
          }
          value = iteratee2(value);
          var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === undefined2;
          while (low < high) {
            var mid = nativeFloor((low + high) / 2), computed = iteratee2(array[mid]), othIsDefined = computed !== undefined2, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
            if (valIsNaN) {
              var setLow = retHighest || othIsReflexive;
            } else if (valIsUndefined) {
              setLow = othIsReflexive && (retHighest || othIsDefined);
            } else if (valIsNull) {
              setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
            } else if (valIsSymbol) {
              setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
            } else if (othIsNull || othIsSymbol) {
              setLow = false;
            } else {
              setLow = retHighest ? computed <= value : computed < value;
            }
            if (setLow) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return nativeMin(high, MAX_ARRAY_INDEX);
        }
        function baseSortedUniq(array, iteratee2) {
          var index = -1, length = array.length, resIndex = 0, result2 = [];
          while (++index < length) {
            var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
            if (!index || !eq(computed, seen)) {
              var seen = computed;
              result2[resIndex++] = value === 0 ? 0 : value;
            }
          }
          return result2;
        }
        function baseToNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          return +value;
        }
        function baseToString(value) {
          if (typeof value == "string") {
            return value;
          }
          if (isArray(value)) {
            return arrayMap(value, baseToString) + "";
          }
          if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : "";
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }
        function baseUniq(array, iteratee2, comparator) {
          var index = -1, includes2 = arrayIncludes, length = array.length, isCommon = true, result2 = [], seen = result2;
          if (comparator) {
            isCommon = false;
            includes2 = arrayIncludesWith;
          } else if (length >= LARGE_ARRAY_SIZE) {
            var set2 = iteratee2 ? null : createSet(array);
            if (set2) {
              return setToArray(set2);
            }
            isCommon = false;
            includes2 = cacheHas;
            seen = new SetCache();
          } else {
            seen = iteratee2 ? [] : result2;
          }
          outer:
            while (++index < length) {
              var value = array[index], computed = iteratee2 ? iteratee2(value) : value;
              value = comparator || value !== 0 ? value : 0;
              if (isCommon && computed === computed) {
                var seenIndex = seen.length;
                while (seenIndex--) {
                  if (seen[seenIndex] === computed) {
                    continue outer;
                  }
                }
                if (iteratee2) {
                  seen.push(computed);
                }
                result2.push(value);
              } else if (!includes2(seen, computed, comparator)) {
                if (seen !== result2) {
                  seen.push(computed);
                }
                result2.push(value);
              }
            }
          return result2;
        }
        function baseUnset(object, path3) {
          path3 = castPath(path3, object);
          object = parent(object, path3);
          return object == null || delete object[toKey(last(path3))];
        }
        function baseUpdate(object, path3, updater, customizer) {
          return baseSet(object, path3, updater(baseGet(object, path3)), customizer);
        }
        function baseWhile(array, predicate, isDrop, fromRight) {
          var length = array.length, index = fromRight ? length : -1;
          while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {
          }
          return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
        }
        function baseWrapperValue(value, actions) {
          var result2 = value;
          if (result2 instanceof LazyWrapper) {
            result2 = result2.value();
          }
          return arrayReduce(actions, function(result3, action) {
            return action.func.apply(action.thisArg, arrayPush([result3], action.args));
          }, result2);
        }
        function baseXor(arrays, iteratee2, comparator) {
          var length = arrays.length;
          if (length < 2) {
            return length ? baseUniq(arrays[0]) : [];
          }
          var index = -1, result2 = Array2(length);
          while (++index < length) {
            var array = arrays[index], othIndex = -1;
            while (++othIndex < length) {
              if (othIndex != index) {
                result2[index] = baseDifference(result2[index] || array, arrays[othIndex], iteratee2, comparator);
              }
            }
          }
          return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
        }
        function baseZipObject(props, values2, assignFunc) {
          var index = -1, length = props.length, valsLength = values2.length, result2 = {};
          while (++index < length) {
            var value = index < valsLength ? values2[index] : undefined2;
            assignFunc(result2, props[index], value);
          }
          return result2;
        }
        function castArrayLikeObject(value) {
          return isArrayLikeObject(value) ? value : [];
        }
        function castFunction(value) {
          return typeof value == "function" ? value : identity;
        }
        function castPath(value, object) {
          if (isArray(value)) {
            return value;
          }
          return isKey(value, object) ? [value] : stringToPath(toString(value));
        }
        var castRest = baseRest;
        function castSlice(array, start, end) {
          var length = array.length;
          end = end === undefined2 ? length : end;
          return !start && end >= length ? array : baseSlice(array, start, end);
        }
        var clearTimeout2 = ctxClearTimeout || function(id) {
          return root.clearTimeout(id);
        };
        function cloneBuffer(buffer, isDeep) {
          if (isDeep) {
            return buffer.slice();
          }
          var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
          buffer.copy(result2);
          return result2;
        }
        function cloneArrayBuffer(arrayBuffer) {
          var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
          new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
          return result2;
        }
        function cloneDataView(dataView, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
          return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
        }
        function cloneRegExp(regexp) {
          var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
          result2.lastIndex = regexp.lastIndex;
          return result2;
        }
        function cloneSymbol(symbol) {
          return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
        }
        function cloneTypedArray(typedArray, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
          return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
        }
        function compareAscending(value, other) {
          if (value !== other) {
            var valIsDefined = value !== undefined2, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
            var othIsDefined = other !== undefined2, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
            if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
              return 1;
            }
            if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
              return -1;
            }
          }
          return 0;
        }
        function compareMultiple(object, other, orders) {
          var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
          while (++index < length) {
            var result2 = compareAscending(objCriteria[index], othCriteria[index]);
            if (result2) {
              if (index >= ordersLength) {
                return result2;
              }
              var order = orders[index];
              return result2 * (order == "desc" ? -1 : 1);
            }
          }
          return object.index - other.index;
        }
        function composeArgs(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
          while (++leftIndex < leftLength) {
            result2[leftIndex] = partials[leftIndex];
          }
          while (++argsIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[holders[argsIndex]] = args[argsIndex];
            }
          }
          while (rangeLength--) {
            result2[leftIndex++] = args[argsIndex++];
          }
          return result2;
        }
        function composeArgsRight(args, partials, holders, isCurried) {
          var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
          while (++argsIndex < rangeLength) {
            result2[argsIndex] = args[argsIndex];
          }
          var offset = argsIndex;
          while (++rightIndex < rightLength) {
            result2[offset + rightIndex] = partials[rightIndex];
          }
          while (++holdersIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result2[offset + holders[holdersIndex]] = args[argsIndex++];
            }
          }
          return result2;
        }
        function copyArray(source, array) {
          var index = -1, length = source.length;
          array || (array = Array2(length));
          while (++index < length) {
            array[index] = source[index];
          }
          return array;
        }
        function copyObject(source, props, object, customizer) {
          var isNew = !object;
          object || (object = {});
          var index = -1, length = props.length;
          while (++index < length) {
            var key = props[index];
            var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined2;
            if (newValue === undefined2) {
              newValue = source[key];
            }
            if (isNew) {
              baseAssignValue(object, key, newValue);
            } else {
              assignValue(object, key, newValue);
            }
          }
          return object;
        }
        function copySymbols(source, object) {
          return copyObject(source, getSymbols(source), object);
        }
        function copySymbolsIn(source, object) {
          return copyObject(source, getSymbolsIn(source), object);
        }
        function createAggregator(setter, initializer) {
          return function(collection, iteratee2) {
            var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
            return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
          };
        }
        function createAssigner(assigner) {
          return baseRest(function(object, sources) {
            var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined2, guard = length > 2 ? sources[2] : undefined2;
            customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined2;
            if (guard && isIterateeCall(sources[0], sources[1], guard)) {
              customizer = length < 3 ? undefined2 : customizer;
              length = 1;
            }
            object = Object2(object);
            while (++index < length) {
              var source = sources[index];
              if (source) {
                assigner(object, source, index, customizer);
              }
            }
            return object;
          });
        }
        function createBaseEach(eachFunc, fromRight) {
          return function(collection, iteratee2) {
            if (collection == null) {
              return collection;
            }
            if (!isArrayLike(collection)) {
              return eachFunc(collection, iteratee2);
            }
            var length = collection.length, index = fromRight ? length : -1, iterable = Object2(collection);
            while (fromRight ? index-- : ++index < length) {
              if (iteratee2(iterable[index], index, iterable) === false) {
                break;
              }
            }
            return collection;
          };
        }
        function createBaseFor(fromRight) {
          return function(object, iteratee2, keysFunc) {
            var index = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
            while (length--) {
              var key = props[fromRight ? length : ++index];
              if (iteratee2(iterable[key], key, iterable) === false) {
                break;
              }
            }
            return object;
          };
        }
        function createBind(func, bitmask, thisArg) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
          function wrapper() {
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return fn.apply(isBind ? thisArg : this, arguments);
          }
          return wrapper;
        }
        function createCaseFirst(methodName) {
          return function(string) {
            string = toString(string);
            var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined2;
            var chr = strSymbols ? strSymbols[0] : string.charAt(0);
            var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
            return chr[methodName]() + trailing;
          };
        }
        function createCompounder(callback) {
          return function(string) {
            return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
          };
        }
        function createCtor(Ctor) {
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return new Ctor();
              case 1:
                return new Ctor(args[0]);
              case 2:
                return new Ctor(args[0], args[1]);
              case 3:
                return new Ctor(args[0], args[1], args[2]);
              case 4:
                return new Ctor(args[0], args[1], args[2], args[3]);
              case 5:
                return new Ctor(args[0], args[1], args[2], args[3], args[4]);
              case 6:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
              case 7:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            }
            var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
            return isObject(result2) ? result2 : thisBinding;
          };
        }
        function createCurry(func, bitmask, arity) {
          var Ctor = createCtor(func);
          function wrapper() {
            var length = arguments.length, args = Array2(length), index = length, placeholder = getHolder(wrapper);
            while (index--) {
              args[index] = arguments[index];
            }
            var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
            length -= holders.length;
            if (length < arity) {
              return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined2, args, holders, undefined2, undefined2, arity - length);
            }
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return apply(fn, this, args);
          }
          return wrapper;
        }
        function createFind(findIndexFunc) {
          return function(collection, predicate, fromIndex) {
            var iterable = Object2(collection);
            if (!isArrayLike(collection)) {
              var iteratee2 = getIteratee(predicate, 3);
              collection = keys(collection);
              predicate = function(key) {
                return iteratee2(iterable[key], key, iterable);
              };
            }
            var index = findIndexFunc(collection, predicate, fromIndex);
            return index > -1 ? iterable[iteratee2 ? collection[index] : index] : undefined2;
          };
        }
        function createFlow(fromRight) {
          return flatRest(function(funcs) {
            var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
            if (fromRight) {
              funcs.reverse();
            }
            while (index--) {
              var func = funcs[index];
              if (typeof func != "function") {
                throw new TypeError2(FUNC_ERROR_TEXT);
              }
              if (prereq && !wrapper && getFuncName(func) == "wrapper") {
                var wrapper = new LodashWrapper([], true);
              }
            }
            index = wrapper ? index : length;
            while (++index < length) {
              func = funcs[index];
              var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined2;
              if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
                wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
              } else {
                wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
              }
            }
            return function() {
              var args = arguments, value = args[0];
              if (wrapper && args.length == 1 && isArray(value)) {
                return wrapper.plant(value).value();
              }
              var index2 = 0, result2 = length ? funcs[index2].apply(this, args) : value;
              while (++index2 < length) {
                result2 = funcs[index2].call(this, result2);
              }
              return result2;
            };
          });
        }
        function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
          var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined2 : createCtor(func);
          function wrapper() {
            var length = arguments.length, args = Array2(length), index = length;
            while (index--) {
              args[index] = arguments[index];
            }
            if (isCurried) {
              var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
            }
            if (partials) {
              args = composeArgs(args, partials, holders, isCurried);
            }
            if (partialsRight) {
              args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
            }
            length -= holdersCount;
            if (isCurried && length < arity) {
              var newHolders = replaceHolders(args, placeholder);
              return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary2, arity - length);
            }
            var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
            length = args.length;
            if (argPos) {
              args = reorder(args, argPos);
            } else if (isFlip && length > 1) {
              args.reverse();
            }
            if (isAry && ary2 < length) {
              args.length = ary2;
            }
            if (this && this !== root && this instanceof wrapper) {
              fn = Ctor || createCtor(fn);
            }
            return fn.apply(thisBinding, args);
          }
          return wrapper;
        }
        function createInverter(setter, toIteratee) {
          return function(object, iteratee2) {
            return baseInverter(object, setter, toIteratee(iteratee2), {});
          };
        }
        function createMathOperation(operator, defaultValue) {
          return function(value, other) {
            var result2;
            if (value === undefined2 && other === undefined2) {
              return defaultValue;
            }
            if (value !== undefined2) {
              result2 = value;
            }
            if (other !== undefined2) {
              if (result2 === undefined2) {
                return other;
              }
              if (typeof value == "string" || typeof other == "string") {
                value = baseToString(value);
                other = baseToString(other);
              } else {
                value = baseToNumber(value);
                other = baseToNumber(other);
              }
              result2 = operator(value, other);
            }
            return result2;
          };
        }
        function createOver(arrayFunc) {
          return flatRest(function(iteratees) {
            iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
            return baseRest(function(args) {
              var thisArg = this;
              return arrayFunc(iteratees, function(iteratee2) {
                return apply(iteratee2, thisArg, args);
              });
            });
          });
        }
        function createPadding(length, chars) {
          chars = chars === undefined2 ? " " : baseToString(chars);
          var charsLength = chars.length;
          if (charsLength < 2) {
            return charsLength ? baseRepeat(chars, length) : chars;
          }
          var result2 = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
          return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
        }
        function createPartial(func, bitmask, thisArg, partials) {
          var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
          function wrapper() {
            var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            while (++leftIndex < leftLength) {
              args[leftIndex] = partials[leftIndex];
            }
            while (argsLength--) {
              args[leftIndex++] = arguments[++argsIndex];
            }
            return apply(fn, isBind ? thisArg : this, args);
          }
          return wrapper;
        }
        function createRange(fromRight) {
          return function(start, end, step) {
            if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
              end = step = undefined2;
            }
            start = toFinite(start);
            if (end === undefined2) {
              end = start;
              start = 0;
            } else {
              end = toFinite(end);
            }
            step = step === undefined2 ? start < end ? 1 : -1 : toFinite(step);
            return baseRange(start, end, step, fromRight);
          };
        }
        function createRelationalOperation(operator) {
          return function(value, other) {
            if (!(typeof value == "string" && typeof other == "string")) {
              value = toNumber(value);
              other = toNumber(other);
            }
            return operator(value, other);
          };
        }
        function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
          var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined2, newHoldersRight = isCurry ? undefined2 : holders, newPartials = isCurry ? partials : undefined2, newPartialsRight = isCurry ? undefined2 : partials;
          bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
          bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
          if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
            bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
          }
          var newData = [
            func,
            bitmask,
            thisArg,
            newPartials,
            newHolders,
            newPartialsRight,
            newHoldersRight,
            argPos,
            ary2,
            arity
          ];
          var result2 = wrapFunc.apply(undefined2, newData);
          if (isLaziable(func)) {
            setData(result2, newData);
          }
          result2.placeholder = placeholder;
          return setWrapToString(result2, func, bitmask);
        }
        function createRound(methodName) {
          var func = Math2[methodName];
          return function(number, precision) {
            number = toNumber(number);
            precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
            if (precision && nativeIsFinite(number)) {
              var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
              pair = (toString(value) + "e").split("e");
              return +(pair[0] + "e" + (+pair[1] - precision));
            }
            return func(number);
          };
        }
        var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY) ? noop : function(values2) {
          return new Set(values2);
        };
        function createToPairs(keysFunc) {
          return function(object) {
            var tag = getTag(object);
            if (tag == mapTag) {
              return mapToArray(object);
            }
            if (tag == setTag) {
              return setToPairs(object);
            }
            return baseToPairs(object, keysFunc(object));
          };
        }
        function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
          var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
          if (!isBindKey && typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var length = partials ? partials.length : 0;
          if (!length) {
            bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
            partials = holders = undefined2;
          }
          ary2 = ary2 === undefined2 ? ary2 : nativeMax(toInteger(ary2), 0);
          arity = arity === undefined2 ? arity : toInteger(arity);
          length -= holders ? holders.length : 0;
          if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
            var partialsRight = partials, holdersRight = holders;
            partials = holders = undefined2;
          }
          var data = isBindKey ? undefined2 : getData(func);
          var newData = [
            func,
            bitmask,
            thisArg,
            partials,
            holders,
            partialsRight,
            holdersRight,
            argPos,
            ary2,
            arity
          ];
          if (data) {
            mergeData(newData, data);
          }
          func = newData[0];
          bitmask = newData[1];
          thisArg = newData[2];
          partials = newData[3];
          holders = newData[4];
          arity = newData[9] = newData[9] === undefined2 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
          if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
            bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
          }
          if (!bitmask || bitmask == WRAP_BIND_FLAG) {
            var result2 = createBind(func, bitmask, thisArg);
          } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
            result2 = createCurry(func, bitmask, arity);
          } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
            result2 = createPartial(func, bitmask, thisArg, partials);
          } else {
            result2 = createHybrid.apply(undefined2, newData);
          }
          var setter = data ? baseSetData : setData;
          return setWrapToString(setter(result2, newData), func, bitmask);
        }
        function customDefaultsAssignIn(objValue, srcValue, key, object) {
          if (objValue === undefined2 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
            return srcValue;
          }
          return objValue;
        }
        function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
          if (isObject(objValue) && isObject(srcValue)) {
            stack.set(srcValue, objValue);
            baseMerge(objValue, srcValue, undefined2, customDefaultsMerge, stack);
            stack["delete"](srcValue);
          }
          return objValue;
        }
        function customOmitClone(value) {
          return isPlainObject(value) ? undefined2 : value;
        }
        function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
          if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
            return false;
          }
          var arrStacked = stack.get(array);
          var othStacked = stack.get(other);
          if (arrStacked && othStacked) {
            return arrStacked == other && othStacked == array;
          }
          var index = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined2;
          stack.set(array, other);
          stack.set(other, array);
          while (++index < arrLength) {
            var arrValue = array[index], othValue = other[index];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
            }
            if (compared !== undefined2) {
              if (compared) {
                continue;
              }
              result2 = false;
              break;
            }
            if (seen) {
              if (!arraySome(other, function(othValue2, othIndex) {
                if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
                result2 = false;
                break;
              }
            } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              result2 = false;
              break;
            }
          }
          stack["delete"](array);
          stack["delete"](other);
          return result2;
        }
        function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
          switch (tag) {
            case dataViewTag:
              if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                return false;
              }
              object = object.buffer;
              other = other.buffer;
            case arrayBufferTag:
              if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
                return false;
              }
              return true;
            case boolTag:
            case dateTag:
            case numberTag:
              return eq(+object, +other);
            case errorTag:
              return object.name == other.name && object.message == other.message;
            case regexpTag:
            case stringTag:
              return object == other + "";
            case mapTag:
              var convert = mapToArray;
            case setTag:
              var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
              convert || (convert = setToArray);
              if (object.size != other.size && !isPartial) {
                return false;
              }
              var stacked = stack.get(object);
              if (stacked) {
                return stacked == other;
              }
              bitmask |= COMPARE_UNORDERED_FLAG;
              stack.set(object, other);
              var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
              stack["delete"](object);
              return result2;
            case symbolTag:
              if (symbolValueOf) {
                return symbolValueOf.call(object) == symbolValueOf.call(other);
              }
          }
          return false;
        }
        function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
          if (objLength != othLength && !isPartial) {
            return false;
          }
          var index = objLength;
          while (index--) {
            var key = objProps[index];
            if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
              return false;
            }
          }
          var objStacked = stack.get(object);
          var othStacked = stack.get(other);
          if (objStacked && othStacked) {
            return objStacked == other && othStacked == object;
          }
          var result2 = true;
          stack.set(object, other);
          stack.set(other, object);
          var skipCtor = isPartial;
          while (++index < objLength) {
            key = objProps[index];
            var objValue = object[key], othValue = other[key];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
            }
            if (!(compared === undefined2 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
              result2 = false;
              break;
            }
            skipCtor || (skipCtor = key == "constructor");
          }
          if (result2 && !skipCtor) {
            var objCtor = object.constructor, othCtor = other.constructor;
            if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
              result2 = false;
            }
          }
          stack["delete"](object);
          stack["delete"](other);
          return result2;
        }
        function flatRest(func) {
          return setToString(overRest(func, undefined2, flatten), func + "");
        }
        function getAllKeys(object) {
          return baseGetAllKeys(object, keys, getSymbols);
        }
        function getAllKeysIn(object) {
          return baseGetAllKeys(object, keysIn, getSymbolsIn);
        }
        var getData = !metaMap ? noop : function(func) {
          return metaMap.get(func);
        };
        function getFuncName(func) {
          var result2 = func.name + "", array = realNames[result2], length = hasOwnProperty.call(realNames, result2) ? array.length : 0;
          while (length--) {
            var data = array[length], otherFunc = data.func;
            if (otherFunc == null || otherFunc == func) {
              return data.name;
            }
          }
          return result2;
        }
        function getHolder(func) {
          var object = hasOwnProperty.call(lodash, "placeholder") ? lodash : func;
          return object.placeholder;
        }
        function getIteratee() {
          var result2 = lodash.iteratee || iteratee;
          result2 = result2 === iteratee ? baseIteratee : result2;
          return arguments.length ? result2(arguments[0], arguments[1]) : result2;
        }
        function getMapData(map2, key) {
          var data = map2.__data__;
          return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
        }
        function getMatchData(object) {
          var result2 = keys(object), length = result2.length;
          while (length--) {
            var key = result2[length], value = object[key];
            result2[length] = [key, value, isStrictComparable(value)];
          }
          return result2;
        }
        function getNative(object, key) {
          var value = getValue(object, key);
          return baseIsNative(value) ? value : undefined2;
        }
        function getRawTag(value) {
          var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
          try {
            value[symToStringTag] = undefined2;
            var unmasked = true;
          } catch (e) {
          }
          var result2 = nativeObjectToString.call(value);
          if (unmasked) {
            if (isOwn) {
              value[symToStringTag] = tag;
            } else {
              delete value[symToStringTag];
            }
          }
          return result2;
        }
        var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
          if (object == null) {
            return [];
          }
          object = Object2(object);
          return arrayFilter(nativeGetSymbols(object), function(symbol) {
            return propertyIsEnumerable.call(object, symbol);
          });
        };
        var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
          var result2 = [];
          while (object) {
            arrayPush(result2, getSymbols(object));
            object = getPrototype(object);
          }
          return result2;
        };
        var getTag = baseGetTag;
        if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
          getTag = function(value) {
            var result2 = baseGetTag(value), Ctor = result2 == objectTag ? value.constructor : undefined2, ctorString = Ctor ? toSource(Ctor) : "";
            if (ctorString) {
              switch (ctorString) {
                case dataViewCtorString:
                  return dataViewTag;
                case mapCtorString:
                  return mapTag;
                case promiseCtorString:
                  return promiseTag;
                case setCtorString:
                  return setTag;
                case weakMapCtorString:
                  return weakMapTag;
              }
            }
            return result2;
          };
        }
        function getView(start, end, transforms) {
          var index = -1, length = transforms.length;
          while (++index < length) {
            var data = transforms[index], size2 = data.size;
            switch (data.type) {
              case "drop":
                start += size2;
                break;
              case "dropRight":
                end -= size2;
                break;
              case "take":
                end = nativeMin(end, start + size2);
                break;
              case "takeRight":
                start = nativeMax(start, end - size2);
                break;
            }
          }
          return { "start": start, "end": end };
        }
        function getWrapDetails(source) {
          var match = source.match(reWrapDetails);
          return match ? match[1].split(reSplitDetails) : [];
        }
        function hasPath(object, path3, hasFunc) {
          path3 = castPath(path3, object);
          var index = -1, length = path3.length, result2 = false;
          while (++index < length) {
            var key = toKey(path3[index]);
            if (!(result2 = object != null && hasFunc(object, key))) {
              break;
            }
            object = object[key];
          }
          if (result2 || ++index != length) {
            return result2;
          }
          length = object == null ? 0 : object.length;
          return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
        }
        function initCloneArray(array) {
          var length = array.length, result2 = new array.constructor(length);
          if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
            result2.index = array.index;
            result2.input = array.input;
          }
          return result2;
        }
        function initCloneObject(object) {
          return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
        }
        function initCloneByTag(object, tag, isDeep) {
          var Ctor = object.constructor;
          switch (tag) {
            case arrayBufferTag:
              return cloneArrayBuffer(object);
            case boolTag:
            case dateTag:
              return new Ctor(+object);
            case dataViewTag:
              return cloneDataView(object, isDeep);
            case float32Tag:
            case float64Tag:
            case int8Tag:
            case int16Tag:
            case int32Tag:
            case uint8Tag:
            case uint8ClampedTag:
            case uint16Tag:
            case uint32Tag:
              return cloneTypedArray(object, isDeep);
            case mapTag:
              return new Ctor();
            case numberTag:
            case stringTag:
              return new Ctor(object);
            case regexpTag:
              return cloneRegExp(object);
            case setTag:
              return new Ctor();
            case symbolTag:
              return cloneSymbol(object);
          }
        }
        function insertWrapDetails(source, details) {
          var length = details.length;
          if (!length) {
            return source;
          }
          var lastIndex = length - 1;
          details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
          details = details.join(length > 2 ? ", " : " ");
          return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
        }
        function isFlattenable(value) {
          return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
        }
        function isIndex(value, length) {
          var type = typeof value;
          length = length == null ? MAX_SAFE_INTEGER : length;
          return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
        }
        function isIterateeCall(value, index, object) {
          if (!isObject(object)) {
            return false;
          }
          var type = typeof index;
          if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
            return eq(object[index], value);
          }
          return false;
        }
        function isKey(value, object) {
          if (isArray(value)) {
            return false;
          }
          var type = typeof value;
          if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
            return true;
          }
          return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object2(object);
        }
        function isKeyable(value) {
          var type = typeof value;
          return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
        }
        function isLaziable(func) {
          var funcName = getFuncName(func), other = lodash[funcName];
          if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
            return false;
          }
          if (func === other) {
            return true;
          }
          var data = getData(other);
          return !!data && func === data[0];
        }
        function isMasked(func) {
          return !!maskSrcKey && maskSrcKey in func;
        }
        var isMaskable = coreJsData ? isFunction : stubFalse;
        function isPrototype(value) {
          var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
          return value === proto;
        }
        function isStrictComparable(value) {
          return value === value && !isObject(value);
        }
        function matchesStrictComparable(key, srcValue) {
          return function(object) {
            if (object == null) {
              return false;
            }
            return object[key] === srcValue && (srcValue !== undefined2 || key in Object2(object));
          };
        }
        function memoizeCapped(func) {
          var result2 = memoize(func, function(key) {
            if (cache.size === MAX_MEMOIZE_SIZE) {
              cache.clear();
            }
            return key;
          });
          var cache = result2.cache;
          return result2;
        }
        function mergeData(data, source) {
          var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
          var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
          if (!(isCommon || isCombo)) {
            return data;
          }
          if (srcBitmask & WRAP_BIND_FLAG) {
            data[2] = source[2];
            newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
          }
          var value = source[3];
          if (value) {
            var partials = data[3];
            data[3] = partials ? composeArgs(partials, value, source[4]) : value;
            data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
          }
          value = source[5];
          if (value) {
            partials = data[5];
            data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
            data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
          }
          value = source[7];
          if (value) {
            data[7] = value;
          }
          if (srcBitmask & WRAP_ARY_FLAG) {
            data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
          }
          if (data[9] == null) {
            data[9] = source[9];
          }
          data[0] = source[0];
          data[1] = newBitmask;
          return data;
        }
        function nativeKeysIn(object) {
          var result2 = [];
          if (object != null) {
            for (var key in Object2(object)) {
              result2.push(key);
            }
          }
          return result2;
        }
        function objectToString(value) {
          return nativeObjectToString.call(value);
        }
        function overRest(func, start, transform2) {
          start = nativeMax(start === undefined2 ? func.length - 1 : start, 0);
          return function() {
            var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array2(length);
            while (++index < length) {
              array[index] = args[start + index];
            }
            index = -1;
            var otherArgs = Array2(start + 1);
            while (++index < start) {
              otherArgs[index] = args[index];
            }
            otherArgs[start] = transform2(array);
            return apply(func, this, otherArgs);
          };
        }
        function parent(object, path3) {
          return path3.length < 2 ? object : baseGet(object, baseSlice(path3, 0, -1));
        }
        function reorder(array, indexes) {
          var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
          while (length--) {
            var index = indexes[length];
            array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined2;
          }
          return array;
        }
        function safeGet(object, key) {
          if (key === "constructor" && typeof object[key] === "function") {
            return;
          }
          if (key == "__proto__") {
            return;
          }
          return object[key];
        }
        var setData = shortOut(baseSetData);
        var setTimeout2 = ctxSetTimeout || function(func, wait) {
          return root.setTimeout(func, wait);
        };
        var setToString = shortOut(baseSetToString);
        function setWrapToString(wrapper, reference, bitmask) {
          var source = reference + "";
          return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
        }
        function shortOut(func) {
          var count = 0, lastCalled = 0;
          return function() {
            var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
            lastCalled = stamp;
            if (remaining > 0) {
              if (++count >= HOT_COUNT) {
                return arguments[0];
              }
            } else {
              count = 0;
            }
            return func.apply(undefined2, arguments);
          };
        }
        function shuffleSelf(array, size2) {
          var index = -1, length = array.length, lastIndex = length - 1;
          size2 = size2 === undefined2 ? length : size2;
          while (++index < size2) {
            var rand = baseRandom(index, lastIndex), value = array[rand];
            array[rand] = array[index];
            array[index] = value;
          }
          array.length = size2;
          return array;
        }
        var stringToPath = memoizeCapped(function(string) {
          var result2 = [];
          if (string.charCodeAt(0) === 46) {
            result2.push("");
          }
          string.replace(rePropName, function(match, number, quote, subString) {
            result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
          });
          return result2;
        });
        function toKey(value) {
          if (typeof value == "string" || isSymbol(value)) {
            return value;
          }
          var result2 = value + "";
          return result2 == "0" && 1 / value == -INFINITY ? "-0" : result2;
        }
        function toSource(func) {
          if (func != null) {
            try {
              return funcToString.call(func);
            } catch (e) {
            }
            try {
              return func + "";
            } catch (e) {
            }
          }
          return "";
        }
        function updateWrapDetails(details, bitmask) {
          arrayEach(wrapFlags, function(pair) {
            var value = "_." + pair[0];
            if (bitmask & pair[1] && !arrayIncludes(details, value)) {
              details.push(value);
            }
          });
          return details.sort();
        }
        function wrapperClone(wrapper) {
          if (wrapper instanceof LazyWrapper) {
            return wrapper.clone();
          }
          var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
          result2.__actions__ = copyArray(wrapper.__actions__);
          result2.__index__ = wrapper.__index__;
          result2.__values__ = wrapper.__values__;
          return result2;
        }
        function chunk(array, size2, guard) {
          if (guard ? isIterateeCall(array, size2, guard) : size2 === undefined2) {
            size2 = 1;
          } else {
            size2 = nativeMax(toInteger(size2), 0);
          }
          var length = array == null ? 0 : array.length;
          if (!length || size2 < 1) {
            return [];
          }
          var index = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size2));
          while (index < length) {
            result2[resIndex++] = baseSlice(array, index, index += size2);
          }
          return result2;
        }
        function compact(array) {
          var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result2 = [];
          while (++index < length) {
            var value = array[index];
            if (value) {
              result2[resIndex++] = value;
            }
          }
          return result2;
        }
        function concat() {
          var length = arguments.length;
          if (!length) {
            return [];
          }
          var args = Array2(length - 1), array = arguments[0], index = length;
          while (index--) {
            args[index - 1] = arguments[index];
          }
          return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
        }
        var difference = baseRest(function(array, values2) {
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
        });
        var differenceBy = baseRest(function(array, values2) {
          var iteratee2 = last(values2);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
        });
        var differenceWith = baseRest(function(array, values2) {
          var comparator = last(values2);
          if (isArrayLikeObject(comparator)) {
            comparator = undefined2;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), undefined2, comparator) : [];
        });
        function drop(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          return baseSlice(array, n < 0 ? 0 : n, length);
        }
        function dropRight(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        function dropRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
        }
        function dropWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
        }
        function fill(array, value, start, end) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
            start = 0;
            end = length;
          }
          return baseFill(array, value, start, end);
        }
        function findIndex(array, predicate, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index < 0) {
            index = nativeMax(length + index, 0);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index);
        }
        function findLastIndex(array, predicate, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = length - 1;
          if (fromIndex !== undefined2) {
            index = toInteger(fromIndex);
            index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index, true);
        }
        function flatten(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseFlatten(array, 1) : [];
        }
        function flattenDeep(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseFlatten(array, INFINITY) : [];
        }
        function flattenDepth(array, depth) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          depth = depth === undefined2 ? 1 : toInteger(depth);
          return baseFlatten(array, depth);
        }
        function fromPairs(pairs) {
          var index = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
          while (++index < length) {
            var pair = pairs[index];
            result2[pair[0]] = pair[1];
          }
          return result2;
        }
        function head(array) {
          return array && array.length ? array[0] : undefined2;
        }
        function indexOf(array, value, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index < 0) {
            index = nativeMax(length + index, 0);
          }
          return baseIndexOf(array, value, index);
        }
        function initial(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseSlice(array, 0, -1) : [];
        }
        var intersection = baseRest(function(arrays) {
          var mapped = arrayMap(arrays, castArrayLikeObject);
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
        });
        var intersectionBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          if (iteratee2 === last(mapped)) {
            iteratee2 = undefined2;
          } else {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
        });
        var intersectionWith = baseRest(function(arrays) {
          var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          if (comparator) {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined2, comparator) : [];
        });
        function join2(array, separator) {
          return array == null ? "" : nativeJoin.call(array, separator);
        }
        function last(array) {
          var length = array == null ? 0 : array.length;
          return length ? array[length - 1] : undefined2;
        }
        function lastIndexOf(array, value, fromIndex) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return -1;
          }
          var index = length;
          if (fromIndex !== undefined2) {
            index = toInteger(fromIndex);
            index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
          }
          return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
        }
        function nth(array, n) {
          return array && array.length ? baseNth(array, toInteger(n)) : undefined2;
        }
        var pull = baseRest(pullAll);
        function pullAll(array, values2) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2) : array;
        }
        function pullAllBy(array, values2, iteratee2) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2, getIteratee(iteratee2, 2)) : array;
        }
        function pullAllWith(array, values2, comparator) {
          return array && array.length && values2 && values2.length ? basePullAll(array, values2, undefined2, comparator) : array;
        }
        var pullAt = flatRest(function(array, indexes) {
          var length = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
          basePullAt(array, arrayMap(indexes, function(index) {
            return isIndex(index, length) ? +index : index;
          }).sort(compareAscending));
          return result2;
        });
        function remove(array, predicate) {
          var result2 = [];
          if (!(array && array.length)) {
            return result2;
          }
          var index = -1, indexes = [], length = array.length;
          predicate = getIteratee(predicate, 3);
          while (++index < length) {
            var value = array[index];
            if (predicate(value, index, array)) {
              result2.push(value);
              indexes.push(index);
            }
          }
          basePullAt(array, indexes);
          return result2;
        }
        function reverse(array) {
          return array == null ? array : nativeReverse.call(array);
        }
        function slice(array, start, end) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
            start = 0;
            end = length;
          } else {
            start = start == null ? 0 : toInteger(start);
            end = end === undefined2 ? length : toInteger(end);
          }
          return baseSlice(array, start, end);
        }
        function sortedIndex(array, value) {
          return baseSortedIndex(array, value);
        }
        function sortedIndexBy(array, value, iteratee2) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2));
        }
        function sortedIndexOf(array, value) {
          var length = array == null ? 0 : array.length;
          if (length) {
            var index = baseSortedIndex(array, value);
            if (index < length && eq(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        function sortedLastIndex(array, value) {
          return baseSortedIndex(array, value, true);
        }
        function sortedLastIndexBy(array, value, iteratee2) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2), true);
        }
        function sortedLastIndexOf(array, value) {
          var length = array == null ? 0 : array.length;
          if (length) {
            var index = baseSortedIndex(array, value, true) - 1;
            if (eq(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        function sortedUniq(array) {
          return array && array.length ? baseSortedUniq(array) : [];
        }
        function sortedUniqBy(array, iteratee2) {
          return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
        }
        function tail(array) {
          var length = array == null ? 0 : array.length;
          return length ? baseSlice(array, 1, length) : [];
        }
        function take(array, n, guard) {
          if (!(array && array.length)) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        function takeRight(array, n, guard) {
          var length = array == null ? 0 : array.length;
          if (!length) {
            return [];
          }
          n = guard || n === undefined2 ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array, n < 0 ? 0 : n, length);
        }
        function takeRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
        }
        function takeWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
        }
        var union = baseRest(function(arrays) {
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
        });
        var unionBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
        });
        var unionWith = baseRest(function(arrays) {
          var comparator = last(arrays);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined2, comparator);
        });
        function uniq(array) {
          return array && array.length ? baseUniq(array) : [];
        }
        function uniqBy(array, iteratee2) {
          return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
        }
        function uniqWith(array, comparator) {
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return array && array.length ? baseUniq(array, undefined2, comparator) : [];
        }
        function unzip(array) {
          if (!(array && array.length)) {
            return [];
          }
          var length = 0;
          array = arrayFilter(array, function(group) {
            if (isArrayLikeObject(group)) {
              length = nativeMax(group.length, length);
              return true;
            }
          });
          return baseTimes(length, function(index) {
            return arrayMap(array, baseProperty(index));
          });
        }
        function unzipWith(array, iteratee2) {
          if (!(array && array.length)) {
            return [];
          }
          var result2 = unzip(array);
          if (iteratee2 == null) {
            return result2;
          }
          return arrayMap(result2, function(group) {
            return apply(iteratee2, undefined2, group);
          });
        }
        var without = baseRest(function(array, values2) {
          return isArrayLikeObject(array) ? baseDifference(array, values2) : [];
        });
        var xor = baseRest(function(arrays) {
          return baseXor(arrayFilter(arrays, isArrayLikeObject));
        });
        var xorBy = baseRest(function(arrays) {
          var iteratee2 = last(arrays);
          if (isArrayLikeObject(iteratee2)) {
            iteratee2 = undefined2;
          }
          return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
        });
        var xorWith = baseRest(function(arrays) {
          var comparator = last(arrays);
          comparator = typeof comparator == "function" ? comparator : undefined2;
          return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined2, comparator);
        });
        var zip = baseRest(unzip);
        function zipObject(props, values2) {
          return baseZipObject(props || [], values2 || [], assignValue);
        }
        function zipObjectDeep(props, values2) {
          return baseZipObject(props || [], values2 || [], baseSet);
        }
        var zipWith = baseRest(function(arrays) {
          var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined2;
          iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined2;
          return unzipWith(arrays, iteratee2);
        });
        function chain(value) {
          var result2 = lodash(value);
          result2.__chain__ = true;
          return result2;
        }
        function tap(value, interceptor) {
          interceptor(value);
          return value;
        }
        function thru(value, interceptor) {
          return interceptor(value);
        }
        var wrapperAt = flatRest(function(paths) {
          var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
            return baseAt(object, paths);
          };
          if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
            return this.thru(interceptor);
          }
          value = value.slice(start, +start + (length ? 1 : 0));
          value.__actions__.push({
            "func": thru,
            "args": [interceptor],
            "thisArg": undefined2
          });
          return new LodashWrapper(value, this.__chain__).thru(function(array) {
            if (length && !array.length) {
              array.push(undefined2);
            }
            return array;
          });
        });
        function wrapperChain() {
          return chain(this);
        }
        function wrapperCommit() {
          return new LodashWrapper(this.value(), this.__chain__);
        }
        function wrapperNext() {
          if (this.__values__ === undefined2) {
            this.__values__ = toArray(this.value());
          }
          var done = this.__index__ >= this.__values__.length, value = done ? undefined2 : this.__values__[this.__index__++];
          return { "done": done, "value": value };
        }
        function wrapperToIterator() {
          return this;
        }
        function wrapperPlant(value) {
          var result2, parent2 = this;
          while (parent2 instanceof baseLodash) {
            var clone2 = wrapperClone(parent2);
            clone2.__index__ = 0;
            clone2.__values__ = undefined2;
            if (result2) {
              previous.__wrapped__ = clone2;
            } else {
              result2 = clone2;
            }
            var previous = clone2;
            parent2 = parent2.__wrapped__;
          }
          previous.__wrapped__ = value;
          return result2;
        }
        function wrapperReverse() {
          var value = this.__wrapped__;
          if (value instanceof LazyWrapper) {
            var wrapped = value;
            if (this.__actions__.length) {
              wrapped = new LazyWrapper(this);
            }
            wrapped = wrapped.reverse();
            wrapped.__actions__.push({
              "func": thru,
              "args": [reverse],
              "thisArg": undefined2
            });
            return new LodashWrapper(wrapped, this.__chain__);
          }
          return this.thru(reverse);
        }
        function wrapperValue() {
          return baseWrapperValue(this.__wrapped__, this.__actions__);
        }
        var countBy = createAggregator(function(result2, value, key) {
          if (hasOwnProperty.call(result2, key)) {
            ++result2[key];
          } else {
            baseAssignValue(result2, key, 1);
          }
        });
        function every(collection, predicate, guard) {
          var func = isArray(collection) ? arrayEvery : baseEvery;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined2;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        function filter(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, getIteratee(predicate, 3));
        }
        var find = createFind(findIndex);
        var findLast = createFind(findLastIndex);
        function flatMap(collection, iteratee2) {
          return baseFlatten(map(collection, iteratee2), 1);
        }
        function flatMapDeep(collection, iteratee2) {
          return baseFlatten(map(collection, iteratee2), INFINITY);
        }
        function flatMapDepth(collection, iteratee2, depth) {
          depth = depth === undefined2 ? 1 : toInteger(depth);
          return baseFlatten(map(collection, iteratee2), depth);
        }
        function forEach(collection, iteratee2) {
          var func = isArray(collection) ? arrayEach : baseEach;
          return func(collection, getIteratee(iteratee2, 3));
        }
        function forEachRight(collection, iteratee2) {
          var func = isArray(collection) ? arrayEachRight : baseEachRight;
          return func(collection, getIteratee(iteratee2, 3));
        }
        var groupBy = createAggregator(function(result2, value, key) {
          if (hasOwnProperty.call(result2, key)) {
            result2[key].push(value);
          } else {
            baseAssignValue(result2, key, [value]);
          }
        });
        function includes(collection, value, fromIndex, guard) {
          collection = isArrayLike(collection) ? collection : values(collection);
          fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
          var length = collection.length;
          if (fromIndex < 0) {
            fromIndex = nativeMax(length + fromIndex, 0);
          }
          return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
        }
        var invokeMap = baseRest(function(collection, path3, args) {
          var index = -1, isFunc = typeof path3 == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
          baseEach(collection, function(value) {
            result2[++index] = isFunc ? apply(path3, value, args) : baseInvoke(value, path3, args);
          });
          return result2;
        });
        var keyBy = createAggregator(function(result2, value, key) {
          baseAssignValue(result2, key, value);
        });
        function map(collection, iteratee2) {
          var func = isArray(collection) ? arrayMap : baseMap;
          return func(collection, getIteratee(iteratee2, 3));
        }
        function orderBy(collection, iteratees, orders, guard) {
          if (collection == null) {
            return [];
          }
          if (!isArray(iteratees)) {
            iteratees = iteratees == null ? [] : [iteratees];
          }
          orders = guard ? undefined2 : orders;
          if (!isArray(orders)) {
            orders = orders == null ? [] : [orders];
          }
          return baseOrderBy(collection, iteratees, orders);
        }
        var partition = createAggregator(function(result2, value, key) {
          result2[key ? 0 : 1].push(value);
        }, function() {
          return [[], []];
        });
        function reduce(collection, iteratee2, accumulator) {
          var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
        }
        function reduceRight(collection, iteratee2, accumulator) {
          var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
        }
        function reject(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, negate(getIteratee(predicate, 3)));
        }
        function sample(collection) {
          var func = isArray(collection) ? arraySample : baseSample;
          return func(collection);
        }
        function sampleSize(collection, n, guard) {
          if (guard ? isIterateeCall(collection, n, guard) : n === undefined2) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          var func = isArray(collection) ? arraySampleSize : baseSampleSize;
          return func(collection, n);
        }
        function shuffle(collection) {
          var func = isArray(collection) ? arrayShuffle : baseShuffle;
          return func(collection);
        }
        function size(collection) {
          if (collection == null) {
            return 0;
          }
          if (isArrayLike(collection)) {
            return isString(collection) ? stringSize(collection) : collection.length;
          }
          var tag = getTag(collection);
          if (tag == mapTag || tag == setTag) {
            return collection.size;
          }
          return baseKeys(collection).length;
        }
        function some(collection, predicate, guard) {
          var func = isArray(collection) ? arraySome : baseSome;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined2;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        var sortBy = baseRest(function(collection, iteratees) {
          if (collection == null) {
            return [];
          }
          var length = iteratees.length;
          if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
            iteratees = [];
          } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
            iteratees = [iteratees[0]];
          }
          return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
        });
        var now = ctxNow || function() {
          return root.Date.now();
        };
        function after(n, func) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function() {
            if (--n < 1) {
              return func.apply(this, arguments);
            }
          };
        }
        function ary(func, n, guard) {
          n = guard ? undefined2 : n;
          n = func && n == null ? func.length : n;
          return createWrap(func, WRAP_ARY_FLAG, undefined2, undefined2, undefined2, undefined2, n);
        }
        function before(n, func) {
          var result2;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function() {
            if (--n > 0) {
              result2 = func.apply(this, arguments);
            }
            if (n <= 1) {
              func = undefined2;
            }
            return result2;
          };
        }
        var bind = baseRest(function(func, thisArg, partials) {
          var bitmask = WRAP_BIND_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bind));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(func, bitmask, thisArg, partials, holders);
        });
        var bindKey = baseRest(function(object, key, partials) {
          var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bindKey));
            bitmask |= WRAP_PARTIAL_FLAG;
          }
          return createWrap(key, bitmask, object, partials, holders);
        });
        function curry(func, arity, guard) {
          arity = guard ? undefined2 : arity;
          var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
          result2.placeholder = curry.placeholder;
          return result2;
        }
        function curryRight(func, arity, guard) {
          arity = guard ? undefined2 : arity;
          var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined2, undefined2, undefined2, undefined2, undefined2, arity);
          result2.placeholder = curryRight.placeholder;
          return result2;
        }
        function debounce(func, wait, options) {
          var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          wait = toNumber(wait) || 0;
          if (isObject(options)) {
            leading = !!options.leading;
            maxing = "maxWait" in options;
            maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }
          function invokeFunc(time) {
            var args = lastArgs, thisArg = lastThis;
            lastArgs = lastThis = undefined2;
            lastInvokeTime = time;
            result2 = func.apply(thisArg, args);
            return result2;
          }
          function leadingEdge(time) {
            lastInvokeTime = time;
            timerId = setTimeout2(timerExpired, wait);
            return leading ? invokeFunc(time) : result2;
          }
          function remainingWait(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
            return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
          }
          function shouldInvoke(time) {
            var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
            return lastCallTime === undefined2 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
          }
          function timerExpired() {
            var time = now();
            if (shouldInvoke(time)) {
              return trailingEdge(time);
            }
            timerId = setTimeout2(timerExpired, remainingWait(time));
          }
          function trailingEdge(time) {
            timerId = undefined2;
            if (trailing && lastArgs) {
              return invokeFunc(time);
            }
            lastArgs = lastThis = undefined2;
            return result2;
          }
          function cancel() {
            if (timerId !== undefined2) {
              clearTimeout2(timerId);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timerId = undefined2;
          }
          function flush() {
            return timerId === undefined2 ? result2 : trailingEdge(now());
          }
          function debounced() {
            var time = now(), isInvoking = shouldInvoke(time);
            lastArgs = arguments;
            lastThis = this;
            lastCallTime = time;
            if (isInvoking) {
              if (timerId === undefined2) {
                return leadingEdge(lastCallTime);
              }
              if (maxing) {
                clearTimeout2(timerId);
                timerId = setTimeout2(timerExpired, wait);
                return invokeFunc(lastCallTime);
              }
            }
            if (timerId === undefined2) {
              timerId = setTimeout2(timerExpired, wait);
            }
            return result2;
          }
          debounced.cancel = cancel;
          debounced.flush = flush;
          return debounced;
        }
        var defer = baseRest(function(func, args) {
          return baseDelay(func, 1, args);
        });
        var delay = baseRest(function(func, wait, args) {
          return baseDelay(func, toNumber(wait) || 0, args);
        });
        function flip(func) {
          return createWrap(func, WRAP_FLIP_FLAG);
        }
        function memoize(func, resolver) {
          if (typeof func != "function" || resolver != null && typeof resolver != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          var memoized = function() {
            var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
            if (cache.has(key)) {
              return cache.get(key);
            }
            var result2 = func.apply(this, args);
            memoized.cache = cache.set(key, result2) || cache;
            return result2;
          };
          memoized.cache = new (memoize.Cache || MapCache)();
          return memoized;
        }
        memoize.Cache = MapCache;
        function negate(predicate) {
          if (typeof predicate != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return function() {
            var args = arguments;
            switch (args.length) {
              case 0:
                return !predicate.call(this);
              case 1:
                return !predicate.call(this, args[0]);
              case 2:
                return !predicate.call(this, args[0], args[1]);
              case 3:
                return !predicate.call(this, args[0], args[1], args[2]);
            }
            return !predicate.apply(this, args);
          };
        }
        function once(func) {
          return before(2, func);
        }
        var overArgs = castRest(function(func, transforms) {
          transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
          var funcsLength = transforms.length;
          return baseRest(function(args) {
            var index = -1, length = nativeMin(args.length, funcsLength);
            while (++index < length) {
              args[index] = transforms[index].call(this, args[index]);
            }
            return apply(func, this, args);
          });
        });
        var partial = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partial));
          return createWrap(func, WRAP_PARTIAL_FLAG, undefined2, partials, holders);
        });
        var partialRight = baseRest(function(func, partials) {
          var holders = replaceHolders(partials, getHolder(partialRight));
          return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined2, partials, holders);
        });
        var rearg = flatRest(function(func, indexes) {
          return createWrap(func, WRAP_REARG_FLAG, undefined2, undefined2, undefined2, indexes);
        });
        function rest(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start === undefined2 ? start : toInteger(start);
          return baseRest(func, start);
        }
        function spread(func, start) {
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          start = start == null ? 0 : nativeMax(toInteger(start), 0);
          return baseRest(function(args) {
            var array = args[start], otherArgs = castSlice(args, 0, start);
            if (array) {
              arrayPush(otherArgs, array);
            }
            return apply(func, this, otherArgs);
          });
        }
        function throttle(func, wait, options) {
          var leading = true, trailing = true;
          if (typeof func != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          if (isObject(options)) {
            leading = "leading" in options ? !!options.leading : leading;
            trailing = "trailing" in options ? !!options.trailing : trailing;
          }
          return debounce(func, wait, {
            "leading": leading,
            "maxWait": wait,
            "trailing": trailing
          });
        }
        function unary(func) {
          return ary(func, 1);
        }
        function wrap(value, wrapper) {
          return partial(castFunction(wrapper), value);
        }
        function castArray() {
          if (!arguments.length) {
            return [];
          }
          var value = arguments[0];
          return isArray(value) ? value : [value];
        }
        function clone(value) {
          return baseClone(value, CLONE_SYMBOLS_FLAG);
        }
        function cloneWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
        }
        function cloneDeep(value) {
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
        }
        function cloneDeepWith(value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
        }
        function conformsTo(object, source) {
          return source == null || baseConformsTo(object, source, keys(source));
        }
        function eq(value, other) {
          return value === other || value !== value && other !== other;
        }
        var gt = createRelationalOperation(baseGt);
        var gte = createRelationalOperation(function(value, other) {
          return value >= other;
        });
        var isArguments = baseIsArguments(function() {
          return arguments;
        }()) ? baseIsArguments : function(value) {
          return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
        };
        var isArray = Array2.isArray;
        var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
        function isArrayLike(value) {
          return value != null && isLength(value.length) && !isFunction(value);
        }
        function isArrayLikeObject(value) {
          return isObjectLike(value) && isArrayLike(value);
        }
        function isBoolean(value) {
          return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
        }
        var isBuffer = nativeIsBuffer || stubFalse;
        var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
        function isElement(value) {
          return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
        }
        function isEmpty(value) {
          if (value == null) {
            return true;
          }
          if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
            return !value.length;
          }
          var tag = getTag(value);
          if (tag == mapTag || tag == setTag) {
            return !value.size;
          }
          if (isPrototype(value)) {
            return !baseKeys(value).length;
          }
          for (var key in value) {
            if (hasOwnProperty.call(value, key)) {
              return false;
            }
          }
          return true;
        }
        function isEqual(value, other) {
          return baseIsEqual(value, other);
        }
        function isEqualWith(value, other, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          var result2 = customizer ? customizer(value, other) : undefined2;
          return result2 === undefined2 ? baseIsEqual(value, other, undefined2, customizer) : !!result2;
        }
        function isError(value) {
          if (!isObjectLike(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
        }
        function isFinite2(value) {
          return typeof value == "number" && nativeIsFinite(value);
        }
        function isFunction(value) {
          if (!isObject(value)) {
            return false;
          }
          var tag = baseGetTag(value);
          return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
        }
        function isInteger(value) {
          return typeof value == "number" && value == toInteger(value);
        }
        function isLength(value) {
          return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }
        function isObject(value) {
          var type = typeof value;
          return value != null && (type == "object" || type == "function");
        }
        function isObjectLike(value) {
          return value != null && typeof value == "object";
        }
        var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
        function isMatch(object, source) {
          return object === source || baseIsMatch(object, source, getMatchData(source));
        }
        function isMatchWith(object, source, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return baseIsMatch(object, source, getMatchData(source), customizer);
        }
        function isNaN2(value) {
          return isNumber(value) && value != +value;
        }
        function isNative(value) {
          if (isMaskable(value)) {
            throw new Error2(CORE_ERROR_TEXT);
          }
          return baseIsNative(value);
        }
        function isNull(value) {
          return value === null;
        }
        function isNil(value) {
          return value == null;
        }
        function isNumber(value) {
          return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
        }
        function isPlainObject(value) {
          if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
            return false;
          }
          var proto = getPrototype(value);
          if (proto === null) {
            return true;
          }
          var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
          return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
        }
        var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
        function isSafeInteger(value) {
          return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
        }
        var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
        function isString(value) {
          return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
        }
        function isSymbol(value) {
          return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
        }
        var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
        function isUndefined(value) {
          return value === undefined2;
        }
        function isWeakMap(value) {
          return isObjectLike(value) && getTag(value) == weakMapTag;
        }
        function isWeakSet(value) {
          return isObjectLike(value) && baseGetTag(value) == weakSetTag;
        }
        var lt = createRelationalOperation(baseLt);
        var lte = createRelationalOperation(function(value, other) {
          return value <= other;
        });
        function toArray(value) {
          if (!value) {
            return [];
          }
          if (isArrayLike(value)) {
            return isString(value) ? stringToArray(value) : copyArray(value);
          }
          if (symIterator && value[symIterator]) {
            return iteratorToArray(value[symIterator]());
          }
          var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
          return func(value);
        }
        function toFinite(value) {
          if (!value) {
            return value === 0 ? value : 0;
          }
          value = toNumber(value);
          if (value === INFINITY || value === -INFINITY) {
            var sign = value < 0 ? -1 : 1;
            return sign * MAX_INTEGER;
          }
          return value === value ? value : 0;
        }
        function toInteger(value) {
          var result2 = toFinite(value), remainder = result2 % 1;
          return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
        }
        function toLength(value) {
          return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
        }
        function toNumber(value) {
          if (typeof value == "number") {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          if (isObject(value)) {
            var other = typeof value.valueOf == "function" ? value.valueOf() : value;
            value = isObject(other) ? other + "" : other;
          }
          if (typeof value != "string") {
            return value === 0 ? value : +value;
          }
          value = baseTrim(value);
          var isBinary = reIsBinary.test(value);
          return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
        }
        function toPlainObject(value) {
          return copyObject(value, keysIn(value));
        }
        function toSafeInteger(value) {
          return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
        }
        function toString(value) {
          return value == null ? "" : baseToString(value);
        }
        var assign = createAssigner(function(object, source) {
          if (isPrototype(source) || isArrayLike(source)) {
            copyObject(source, keys(source), object);
            return;
          }
          for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
              assignValue(object, key, source[key]);
            }
          }
        });
        var assignIn = createAssigner(function(object, source) {
          copyObject(source, keysIn(source), object);
        });
        var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keysIn(source), object, customizer);
        });
        var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
          copyObject(source, keys(source), object, customizer);
        });
        var at = flatRest(baseAt);
        function create(prototype, properties) {
          var result2 = baseCreate(prototype);
          return properties == null ? result2 : baseAssign(result2, properties);
        }
        var defaults = baseRest(function(object, sources) {
          object = Object2(object);
          var index = -1;
          var length = sources.length;
          var guard = length > 2 ? sources[2] : undefined2;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            length = 1;
          }
          while (++index < length) {
            var source = sources[index];
            var props = keysIn(source);
            var propsIndex = -1;
            var propsLength = props.length;
            while (++propsIndex < propsLength) {
              var key = props[propsIndex];
              var value = object[key];
              if (value === undefined2 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
                object[key] = source[key];
              }
            }
          }
          return object;
        });
        var defaultsDeep = baseRest(function(args) {
          args.push(undefined2, customDefaultsMerge);
          return apply(mergeWith, undefined2, args);
        });
        function findKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
        }
        function findLastKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
        }
        function forIn(object, iteratee2) {
          return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
        }
        function forInRight(object, iteratee2) {
          return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
        }
        function forOwn(object, iteratee2) {
          return object && baseForOwn(object, getIteratee(iteratee2, 3));
        }
        function forOwnRight(object, iteratee2) {
          return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
        }
        function functions(object) {
          return object == null ? [] : baseFunctions(object, keys(object));
        }
        function functionsIn(object) {
          return object == null ? [] : baseFunctions(object, keysIn(object));
        }
        function get(object, path3, defaultValue) {
          var result2 = object == null ? undefined2 : baseGet(object, path3);
          return result2 === undefined2 ? defaultValue : result2;
        }
        function has(object, path3) {
          return object != null && hasPath(object, path3, baseHas);
        }
        function hasIn(object, path3) {
          return object != null && hasPath(object, path3, baseHasIn);
        }
        var invert = createInverter(function(result2, value, key) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          result2[value] = key;
        }, constant(identity));
        var invertBy = createInverter(function(result2, value, key) {
          if (value != null && typeof value.toString != "function") {
            value = nativeObjectToString.call(value);
          }
          if (hasOwnProperty.call(result2, value)) {
            result2[value].push(key);
          } else {
            result2[value] = [key];
          }
        }, getIteratee);
        var invoke = baseRest(baseInvoke);
        function keys(object) {
          return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
        }
        function keysIn(object) {
          return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
        }
        function mapKeys(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key, object2) {
            baseAssignValue(result2, iteratee2(value, key, object2), value);
          });
          return result2;
        }
        function mapValues(object, iteratee2) {
          var result2 = {};
          iteratee2 = getIteratee(iteratee2, 3);
          baseForOwn(object, function(value, key, object2) {
            baseAssignValue(result2, key, iteratee2(value, key, object2));
          });
          return result2;
        }
        var merge = createAssigner(function(object, source, srcIndex) {
          baseMerge(object, source, srcIndex);
        });
        var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
          baseMerge(object, source, srcIndex, customizer);
        });
        var omit = flatRest(function(object, paths) {
          var result2 = {};
          if (object == null) {
            return result2;
          }
          var isDeep = false;
          paths = arrayMap(paths, function(path3) {
            path3 = castPath(path3, object);
            isDeep || (isDeep = path3.length > 1);
            return path3;
          });
          copyObject(object, getAllKeysIn(object), result2);
          if (isDeep) {
            result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
          }
          var length = paths.length;
          while (length--) {
            baseUnset(result2, paths[length]);
          }
          return result2;
        });
        function omitBy(object, predicate) {
          return pickBy(object, negate(getIteratee(predicate)));
        }
        var pick = flatRest(function(object, paths) {
          return object == null ? {} : basePick(object, paths);
        });
        function pickBy(object, predicate) {
          if (object == null) {
            return {};
          }
          var props = arrayMap(getAllKeysIn(object), function(prop) {
            return [prop];
          });
          predicate = getIteratee(predicate);
          return basePickBy(object, props, function(value, path3) {
            return predicate(value, path3[0]);
          });
        }
        function result(object, path3, defaultValue) {
          path3 = castPath(path3, object);
          var index = -1, length = path3.length;
          if (!length) {
            length = 1;
            object = undefined2;
          }
          while (++index < length) {
            var value = object == null ? undefined2 : object[toKey(path3[index])];
            if (value === undefined2) {
              index = length;
              value = defaultValue;
            }
            object = isFunction(value) ? value.call(object) : value;
          }
          return object;
        }
        function set(object, path3, value) {
          return object == null ? object : baseSet(object, path3, value);
        }
        function setWith(object, path3, value, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return object == null ? object : baseSet(object, path3, value, customizer);
        }
        var toPairs = createToPairs(keys);
        var toPairsIn = createToPairs(keysIn);
        function transform(object, iteratee2, accumulator) {
          var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
          iteratee2 = getIteratee(iteratee2, 4);
          if (accumulator == null) {
            var Ctor = object && object.constructor;
            if (isArrLike) {
              accumulator = isArr ? new Ctor() : [];
            } else if (isObject(object)) {
              accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
            } else {
              accumulator = {};
            }
          }
          (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object2) {
            return iteratee2(accumulator, value, index, object2);
          });
          return accumulator;
        }
        function unset(object, path3) {
          return object == null ? true : baseUnset(object, path3);
        }
        function update(object, path3, updater) {
          return object == null ? object : baseUpdate(object, path3, castFunction(updater));
        }
        function updateWith(object, path3, updater, customizer) {
          customizer = typeof customizer == "function" ? customizer : undefined2;
          return object == null ? object : baseUpdate(object, path3, castFunction(updater), customizer);
        }
        function values(object) {
          return object == null ? [] : baseValues(object, keys(object));
        }
        function valuesIn(object) {
          return object == null ? [] : baseValues(object, keysIn(object));
        }
        function clamp(number, lower, upper) {
          if (upper === undefined2) {
            upper = lower;
            lower = undefined2;
          }
          if (upper !== undefined2) {
            upper = toNumber(upper);
            upper = upper === upper ? upper : 0;
          }
          if (lower !== undefined2) {
            lower = toNumber(lower);
            lower = lower === lower ? lower : 0;
          }
          return baseClamp(toNumber(number), lower, upper);
        }
        function inRange(number, start, end) {
          start = toFinite(start);
          if (end === undefined2) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          number = toNumber(number);
          return baseInRange(number, start, end);
        }
        function random2(lower, upper, floating) {
          if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
            upper = floating = undefined2;
          }
          if (floating === undefined2) {
            if (typeof upper == "boolean") {
              floating = upper;
              upper = undefined2;
            } else if (typeof lower == "boolean") {
              floating = lower;
              lower = undefined2;
            }
          }
          if (lower === undefined2 && upper === undefined2) {
            lower = 0;
            upper = 1;
          } else {
            lower = toFinite(lower);
            if (upper === undefined2) {
              upper = lower;
              lower = 0;
            } else {
              upper = toFinite(upper);
            }
          }
          if (lower > upper) {
            var temp = lower;
            lower = upper;
            upper = temp;
          }
          if (floating || lower % 1 || upper % 1) {
            var rand = nativeRandom();
            return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
          }
          return baseRandom(lower, upper);
        }
        var camelCase = createCompounder(function(result2, word, index) {
          word = word.toLowerCase();
          return result2 + (index ? capitalize(word) : word);
        });
        function capitalize(string) {
          return upperFirst(toString(string).toLowerCase());
        }
        function deburr(string) {
          string = toString(string);
          return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
        }
        function endsWith(string, target, position) {
          string = toString(string);
          target = baseToString(target);
          var length = string.length;
          position = position === undefined2 ? length : baseClamp(toInteger(position), 0, length);
          var end = position;
          position -= target.length;
          return position >= 0 && string.slice(position, end) == target;
        }
        function escape(string) {
          string = toString(string);
          return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
        }
        function escapeRegExp(string) {
          string = toString(string);
          return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
        }
        var kebabCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? "-" : "") + word.toLowerCase();
        });
        var lowerCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + word.toLowerCase();
        });
        var lowerFirst = createCaseFirst("toLowerCase");
        function pad(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          if (!length || strLength >= length) {
            return string;
          }
          var mid = (length - strLength) / 2;
          return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
        }
        function padEnd(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
        }
        function padStart(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
        }
        function parseInt2(string, radix, guard) {
          if (guard || radix == null) {
            radix = 0;
          } else if (radix) {
            radix = +radix;
          }
          return nativeParseInt(toString(string).replace(reTrimStart, ""), radix || 0);
        }
        function repeat(string, n, guard) {
          if (guard ? isIterateeCall(string, n, guard) : n === undefined2) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          return baseRepeat(toString(string), n);
        }
        function replace() {
          var args = arguments, string = toString(args[0]);
          return args.length < 3 ? string : string.replace(args[1], args[2]);
        }
        var snakeCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? "_" : "") + word.toLowerCase();
        });
        function split(string, separator, limit) {
          if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
            separator = limit = undefined2;
          }
          limit = limit === undefined2 ? MAX_ARRAY_LENGTH : limit >>> 0;
          if (!limit) {
            return [];
          }
          string = toString(string);
          if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
            separator = baseToString(separator);
            if (!separator && hasUnicode(string)) {
              return castSlice(stringToArray(string), 0, limit);
            }
          }
          return string.split(separator, limit);
        }
        var startCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + upperFirst(word);
        });
        function startsWith(string, target, position) {
          string = toString(string);
          position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
          target = baseToString(target);
          return string.slice(position, position + target.length) == target;
        }
        function template(string, options, guard) {
          var settings = lodash.templateSettings;
          if (guard && isIterateeCall(string, options, guard)) {
            options = undefined2;
          }
          string = toString(string);
          options = assignInWith({}, options, settings, customDefaultsAssignIn);
          var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
          var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
          var reDelimiters = RegExp2((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
          var sourceURL = "//# sourceURL=" + (hasOwnProperty.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
          string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
            interpolateValue || (interpolateValue = esTemplateValue);
            source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
            if (escapeValue) {
              isEscaping = true;
              source += "' +\n__e(" + escapeValue + ") +\n'";
            }
            if (evaluateValue) {
              isEvaluating = true;
              source += "';\n" + evaluateValue + ";\n__p += '";
            }
            if (interpolateValue) {
              source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
            }
            index = offset + match.length;
            return match;
          });
          source += "';\n";
          var variable = hasOwnProperty.call(options, "variable") && options.variable;
          if (!variable) {
            source = "with (obj) {\n" + source + "\n}\n";
          } else if (reForbiddenIdentifierChars.test(variable)) {
            throw new Error2(INVALID_TEMPL_VAR_ERROR_TEXT);
          }
          source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
          source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
          var result2 = attempt(function() {
            return Function2(importsKeys, sourceURL + "return " + source).apply(undefined2, importsValues);
          });
          result2.source = source;
          if (isError(result2)) {
            throw result2;
          }
          return result2;
        }
        function toLower(value) {
          return toString(value).toLowerCase();
        }
        function toUpper(value) {
          return toString(value).toUpperCase();
        }
        function trim(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined2)) {
            return baseTrim(string);
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
          return castSlice(strSymbols, start, end).join("");
        }
        function trimEnd(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined2)) {
            return string.slice(0, trimmedEndIndex(string) + 1);
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
          return castSlice(strSymbols, 0, end).join("");
        }
        function trimStart(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined2)) {
            return string.replace(reTrimStart, "");
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
          return castSlice(strSymbols, start).join("");
        }
        function truncate(string, options) {
          var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
          if (isObject(options)) {
            var separator = "separator" in options ? options.separator : separator;
            length = "length" in options ? toInteger(options.length) : length;
            omission = "omission" in options ? baseToString(options.omission) : omission;
          }
          string = toString(string);
          var strLength = string.length;
          if (hasUnicode(string)) {
            var strSymbols = stringToArray(string);
            strLength = strSymbols.length;
          }
          if (length >= strLength) {
            return string;
          }
          var end = length - stringSize(omission);
          if (end < 1) {
            return omission;
          }
          var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
          if (separator === undefined2) {
            return result2 + omission;
          }
          if (strSymbols) {
            end += result2.length - end;
          }
          if (isRegExp(separator)) {
            if (string.slice(end).search(separator)) {
              var match, substring = result2;
              if (!separator.global) {
                separator = RegExp2(separator.source, toString(reFlags.exec(separator)) + "g");
              }
              separator.lastIndex = 0;
              while (match = separator.exec(substring)) {
                var newEnd = match.index;
              }
              result2 = result2.slice(0, newEnd === undefined2 ? end : newEnd);
            }
          } else if (string.indexOf(baseToString(separator), end) != end) {
            var index = result2.lastIndexOf(separator);
            if (index > -1) {
              result2 = result2.slice(0, index);
            }
          }
          return result2 + omission;
        }
        function unescape(string) {
          string = toString(string);
          return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
        }
        var upperCase = createCompounder(function(result2, word, index) {
          return result2 + (index ? " " : "") + word.toUpperCase();
        });
        var upperFirst = createCaseFirst("toUpperCase");
        function words(string, pattern, guard) {
          string = toString(string);
          pattern = guard ? undefined2 : pattern;
          if (pattern === undefined2) {
            return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
          }
          return string.match(pattern) || [];
        }
        var attempt = baseRest(function(func, args) {
          try {
            return apply(func, undefined2, args);
          } catch (e) {
            return isError(e) ? e : new Error2(e);
          }
        });
        var bindAll = flatRest(function(object, methodNames) {
          arrayEach(methodNames, function(key) {
            key = toKey(key);
            baseAssignValue(object, key, bind(object[key], object));
          });
          return object;
        });
        function cond(pairs) {
          var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
          pairs = !length ? [] : arrayMap(pairs, function(pair) {
            if (typeof pair[1] != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            return [toIteratee(pair[0]), pair[1]];
          });
          return baseRest(function(args) {
            var index = -1;
            while (++index < length) {
              var pair = pairs[index];
              if (apply(pair[0], this, args)) {
                return apply(pair[1], this, args);
              }
            }
          });
        }
        function conforms(source) {
          return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
        }
        function constant(value) {
          return function() {
            return value;
          };
        }
        function defaultTo(value, defaultValue) {
          return value == null || value !== value ? defaultValue : value;
        }
        var flow = createFlow();
        var flowRight = createFlow(true);
        function identity(value) {
          return value;
        }
        function iteratee(func) {
          return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
        }
        function matches(source) {
          return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
        }
        function matchesProperty(path3, srcValue) {
          return baseMatchesProperty(path3, baseClone(srcValue, CLONE_DEEP_FLAG));
        }
        var method = baseRest(function(path3, args) {
          return function(object) {
            return baseInvoke(object, path3, args);
          };
        });
        var methodOf = baseRest(function(object, args) {
          return function(path3) {
            return baseInvoke(object, path3, args);
          };
        });
        function mixin(object, source, options) {
          var props = keys(source), methodNames = baseFunctions(source, props);
          if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
            options = source;
            source = object;
            object = this;
            methodNames = baseFunctions(source, keys(source));
          }
          var chain2 = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
          arrayEach(methodNames, function(methodName) {
            var func = source[methodName];
            object[methodName] = func;
            if (isFunc) {
              object.prototype[methodName] = function() {
                var chainAll = this.__chain__;
                if (chain2 || chainAll) {
                  var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                  actions.push({ "func": func, "args": arguments, "thisArg": object });
                  result2.__chain__ = chainAll;
                  return result2;
                }
                return func.apply(object, arrayPush([this.value()], arguments));
              };
            }
          });
          return object;
        }
        function noConflict() {
          if (root._ === this) {
            root._ = oldDash;
          }
          return this;
        }
        function noop() {
        }
        function nthArg(n) {
          n = toInteger(n);
          return baseRest(function(args) {
            return baseNth(args, n);
          });
        }
        var over = createOver(arrayMap);
        var overEvery = createOver(arrayEvery);
        var overSome = createOver(arraySome);
        function property(path3) {
          return isKey(path3) ? baseProperty(toKey(path3)) : basePropertyDeep(path3);
        }
        function propertyOf(object) {
          return function(path3) {
            return object == null ? undefined2 : baseGet(object, path3);
          };
        }
        var range = createRange();
        var rangeRight = createRange(true);
        function stubArray() {
          return [];
        }
        function stubFalse() {
          return false;
        }
        function stubObject() {
          return {};
        }
        function stubString() {
          return "";
        }
        function stubTrue() {
          return true;
        }
        function times(n, iteratee2) {
          n = toInteger(n);
          if (n < 1 || n > MAX_SAFE_INTEGER) {
            return [];
          }
          var index = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
          iteratee2 = getIteratee(iteratee2);
          n -= MAX_ARRAY_LENGTH;
          var result2 = baseTimes(length, iteratee2);
          while (++index < n) {
            iteratee2(index);
          }
          return result2;
        }
        function toPath(value) {
          if (isArray(value)) {
            return arrayMap(value, toKey);
          }
          return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
        }
        function uniqueId(prefix) {
          var id = ++idCounter;
          return toString(prefix) + id;
        }
        var add = createMathOperation(function(augend, addend) {
          return augend + addend;
        }, 0);
        var ceil = createRound("ceil");
        var divide = createMathOperation(function(dividend, divisor) {
          return dividend / divisor;
        }, 1);
        var floor = createRound("floor");
        function max(array) {
          return array && array.length ? baseExtremum(array, identity, baseGt) : undefined2;
        }
        function maxBy(array, iteratee2) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined2;
        }
        function mean(array) {
          return baseMean(array, identity);
        }
        function meanBy(array, iteratee2) {
          return baseMean(array, getIteratee(iteratee2, 2));
        }
        function min(array) {
          return array && array.length ? baseExtremum(array, identity, baseLt) : undefined2;
        }
        function minBy(array, iteratee2) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined2;
        }
        var multiply = createMathOperation(function(multiplier, multiplicand) {
          return multiplier * multiplicand;
        }, 1);
        var round = createRound("round");
        var subtract = createMathOperation(function(minuend, subtrahend) {
          return minuend - subtrahend;
        }, 0);
        function sum(array) {
          return array && array.length ? baseSum(array, identity) : 0;
        }
        function sumBy(array, iteratee2) {
          return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
        }
        lodash.after = after;
        lodash.ary = ary;
        lodash.assign = assign;
        lodash.assignIn = assignIn;
        lodash.assignInWith = assignInWith;
        lodash.assignWith = assignWith;
        lodash.at = at;
        lodash.before = before;
        lodash.bind = bind;
        lodash.bindAll = bindAll;
        lodash.bindKey = bindKey;
        lodash.castArray = castArray;
        lodash.chain = chain;
        lodash.chunk = chunk;
        lodash.compact = compact;
        lodash.concat = concat;
        lodash.cond = cond;
        lodash.conforms = conforms;
        lodash.constant = constant;
        lodash.countBy = countBy;
        lodash.create = create;
        lodash.curry = curry;
        lodash.curryRight = curryRight;
        lodash.debounce = debounce;
        lodash.defaults = defaults;
        lodash.defaultsDeep = defaultsDeep;
        lodash.defer = defer;
        lodash.delay = delay;
        lodash.difference = difference;
        lodash.differenceBy = differenceBy;
        lodash.differenceWith = differenceWith;
        lodash.drop = drop;
        lodash.dropRight = dropRight;
        lodash.dropRightWhile = dropRightWhile;
        lodash.dropWhile = dropWhile;
        lodash.fill = fill;
        lodash.filter = filter;
        lodash.flatMap = flatMap;
        lodash.flatMapDeep = flatMapDeep;
        lodash.flatMapDepth = flatMapDepth;
        lodash.flatten = flatten;
        lodash.flattenDeep = flattenDeep;
        lodash.flattenDepth = flattenDepth;
        lodash.flip = flip;
        lodash.flow = flow;
        lodash.flowRight = flowRight;
        lodash.fromPairs = fromPairs;
        lodash.functions = functions;
        lodash.functionsIn = functionsIn;
        lodash.groupBy = groupBy;
        lodash.initial = initial;
        lodash.intersection = intersection;
        lodash.intersectionBy = intersectionBy;
        lodash.intersectionWith = intersectionWith;
        lodash.invert = invert;
        lodash.invertBy = invertBy;
        lodash.invokeMap = invokeMap;
        lodash.iteratee = iteratee;
        lodash.keyBy = keyBy;
        lodash.keys = keys;
        lodash.keysIn = keysIn;
        lodash.map = map;
        lodash.mapKeys = mapKeys;
        lodash.mapValues = mapValues;
        lodash.matches = matches;
        lodash.matchesProperty = matchesProperty;
        lodash.memoize = memoize;
        lodash.merge = merge;
        lodash.mergeWith = mergeWith;
        lodash.method = method;
        lodash.methodOf = methodOf;
        lodash.mixin = mixin;
        lodash.negate = negate;
        lodash.nthArg = nthArg;
        lodash.omit = omit;
        lodash.omitBy = omitBy;
        lodash.once = once;
        lodash.orderBy = orderBy;
        lodash.over = over;
        lodash.overArgs = overArgs;
        lodash.overEvery = overEvery;
        lodash.overSome = overSome;
        lodash.partial = partial;
        lodash.partialRight = partialRight;
        lodash.partition = partition;
        lodash.pick = pick;
        lodash.pickBy = pickBy;
        lodash.property = property;
        lodash.propertyOf = propertyOf;
        lodash.pull = pull;
        lodash.pullAll = pullAll;
        lodash.pullAllBy = pullAllBy;
        lodash.pullAllWith = pullAllWith;
        lodash.pullAt = pullAt;
        lodash.range = range;
        lodash.rangeRight = rangeRight;
        lodash.rearg = rearg;
        lodash.reject = reject;
        lodash.remove = remove;
        lodash.rest = rest;
        lodash.reverse = reverse;
        lodash.sampleSize = sampleSize;
        lodash.set = set;
        lodash.setWith = setWith;
        lodash.shuffle = shuffle;
        lodash.slice = slice;
        lodash.sortBy = sortBy;
        lodash.sortedUniq = sortedUniq;
        lodash.sortedUniqBy = sortedUniqBy;
        lodash.split = split;
        lodash.spread = spread;
        lodash.tail = tail;
        lodash.take = take;
        lodash.takeRight = takeRight;
        lodash.takeRightWhile = takeRightWhile;
        lodash.takeWhile = takeWhile;
        lodash.tap = tap;
        lodash.throttle = throttle;
        lodash.thru = thru;
        lodash.toArray = toArray;
        lodash.toPairs = toPairs;
        lodash.toPairsIn = toPairsIn;
        lodash.toPath = toPath;
        lodash.toPlainObject = toPlainObject;
        lodash.transform = transform;
        lodash.unary = unary;
        lodash.union = union;
        lodash.unionBy = unionBy;
        lodash.unionWith = unionWith;
        lodash.uniq = uniq;
        lodash.uniqBy = uniqBy;
        lodash.uniqWith = uniqWith;
        lodash.unset = unset;
        lodash.unzip = unzip;
        lodash.unzipWith = unzipWith;
        lodash.update = update;
        lodash.updateWith = updateWith;
        lodash.values = values;
        lodash.valuesIn = valuesIn;
        lodash.without = without;
        lodash.words = words;
        lodash.wrap = wrap;
        lodash.xor = xor;
        lodash.xorBy = xorBy;
        lodash.xorWith = xorWith;
        lodash.zip = zip;
        lodash.zipObject = zipObject;
        lodash.zipObjectDeep = zipObjectDeep;
        lodash.zipWith = zipWith;
        lodash.entries = toPairs;
        lodash.entriesIn = toPairsIn;
        lodash.extend = assignIn;
        lodash.extendWith = assignInWith;
        mixin(lodash, lodash);
        lodash.add = add;
        lodash.attempt = attempt;
        lodash.camelCase = camelCase;
        lodash.capitalize = capitalize;
        lodash.ceil = ceil;
        lodash.clamp = clamp;
        lodash.clone = clone;
        lodash.cloneDeep = cloneDeep;
        lodash.cloneDeepWith = cloneDeepWith;
        lodash.cloneWith = cloneWith;
        lodash.conformsTo = conformsTo;
        lodash.deburr = deburr;
        lodash.defaultTo = defaultTo;
        lodash.divide = divide;
        lodash.endsWith = endsWith;
        lodash.eq = eq;
        lodash.escape = escape;
        lodash.escapeRegExp = escapeRegExp;
        lodash.every = every;
        lodash.find = find;
        lodash.findIndex = findIndex;
        lodash.findKey = findKey;
        lodash.findLast = findLast;
        lodash.findLastIndex = findLastIndex;
        lodash.findLastKey = findLastKey;
        lodash.floor = floor;
        lodash.forEach = forEach;
        lodash.forEachRight = forEachRight;
        lodash.forIn = forIn;
        lodash.forInRight = forInRight;
        lodash.forOwn = forOwn;
        lodash.forOwnRight = forOwnRight;
        lodash.get = get;
        lodash.gt = gt;
        lodash.gte = gte;
        lodash.has = has;
        lodash.hasIn = hasIn;
        lodash.head = head;
        lodash.identity = identity;
        lodash.includes = includes;
        lodash.indexOf = indexOf;
        lodash.inRange = inRange;
        lodash.invoke = invoke;
        lodash.isArguments = isArguments;
        lodash.isArray = isArray;
        lodash.isArrayBuffer = isArrayBuffer;
        lodash.isArrayLike = isArrayLike;
        lodash.isArrayLikeObject = isArrayLikeObject;
        lodash.isBoolean = isBoolean;
        lodash.isBuffer = isBuffer;
        lodash.isDate = isDate;
        lodash.isElement = isElement;
        lodash.isEmpty = isEmpty;
        lodash.isEqual = isEqual;
        lodash.isEqualWith = isEqualWith;
        lodash.isError = isError;
        lodash.isFinite = isFinite2;
        lodash.isFunction = isFunction;
        lodash.isInteger = isInteger;
        lodash.isLength = isLength;
        lodash.isMap = isMap;
        lodash.isMatch = isMatch;
        lodash.isMatchWith = isMatchWith;
        lodash.isNaN = isNaN2;
        lodash.isNative = isNative;
        lodash.isNil = isNil;
        lodash.isNull = isNull;
        lodash.isNumber = isNumber;
        lodash.isObject = isObject;
        lodash.isObjectLike = isObjectLike;
        lodash.isPlainObject = isPlainObject;
        lodash.isRegExp = isRegExp;
        lodash.isSafeInteger = isSafeInteger;
        lodash.isSet = isSet;
        lodash.isString = isString;
        lodash.isSymbol = isSymbol;
        lodash.isTypedArray = isTypedArray;
        lodash.isUndefined = isUndefined;
        lodash.isWeakMap = isWeakMap;
        lodash.isWeakSet = isWeakSet;
        lodash.join = join2;
        lodash.kebabCase = kebabCase;
        lodash.last = last;
        lodash.lastIndexOf = lastIndexOf;
        lodash.lowerCase = lowerCase;
        lodash.lowerFirst = lowerFirst;
        lodash.lt = lt;
        lodash.lte = lte;
        lodash.max = max;
        lodash.maxBy = maxBy;
        lodash.mean = mean;
        lodash.meanBy = meanBy;
        lodash.min = min;
        lodash.minBy = minBy;
        lodash.stubArray = stubArray;
        lodash.stubFalse = stubFalse;
        lodash.stubObject = stubObject;
        lodash.stubString = stubString;
        lodash.stubTrue = stubTrue;
        lodash.multiply = multiply;
        lodash.nth = nth;
        lodash.noConflict = noConflict;
        lodash.noop = noop;
        lodash.now = now;
        lodash.pad = pad;
        lodash.padEnd = padEnd;
        lodash.padStart = padStart;
        lodash.parseInt = parseInt2;
        lodash.random = random2;
        lodash.reduce = reduce;
        lodash.reduceRight = reduceRight;
        lodash.repeat = repeat;
        lodash.replace = replace;
        lodash.result = result;
        lodash.round = round;
        lodash.runInContext = runInContext2;
        lodash.sample = sample;
        lodash.size = size;
        lodash.snakeCase = snakeCase;
        lodash.some = some;
        lodash.sortedIndex = sortedIndex;
        lodash.sortedIndexBy = sortedIndexBy;
        lodash.sortedIndexOf = sortedIndexOf;
        lodash.sortedLastIndex = sortedLastIndex;
        lodash.sortedLastIndexBy = sortedLastIndexBy;
        lodash.sortedLastIndexOf = sortedLastIndexOf;
        lodash.startCase = startCase;
        lodash.startsWith = startsWith;
        lodash.subtract = subtract;
        lodash.sum = sum;
        lodash.sumBy = sumBy;
        lodash.template = template;
        lodash.times = times;
        lodash.toFinite = toFinite;
        lodash.toInteger = toInteger;
        lodash.toLength = toLength;
        lodash.toLower = toLower;
        lodash.toNumber = toNumber;
        lodash.toSafeInteger = toSafeInteger;
        lodash.toString = toString;
        lodash.toUpper = toUpper;
        lodash.trim = trim;
        lodash.trimEnd = trimEnd;
        lodash.trimStart = trimStart;
        lodash.truncate = truncate;
        lodash.unescape = unescape;
        lodash.uniqueId = uniqueId;
        lodash.upperCase = upperCase;
        lodash.upperFirst = upperFirst;
        lodash.each = forEach;
        lodash.eachRight = forEachRight;
        lodash.first = head;
        mixin(lodash, function() {
          var source = {};
          baseForOwn(lodash, function(func, methodName) {
            if (!hasOwnProperty.call(lodash.prototype, methodName)) {
              source[methodName] = func;
            }
          });
          return source;
        }(), { "chain": false });
        lodash.VERSION = VERSION;
        arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
          lodash[methodName].placeholder = lodash;
        });
        arrayEach(["drop", "take"], function(methodName, index) {
          LazyWrapper.prototype[methodName] = function(n) {
            n = n === undefined2 ? 1 : nativeMax(toInteger(n), 0);
            var result2 = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
            if (result2.__filtered__) {
              result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
            } else {
              result2.__views__.push({
                "size": nativeMin(n, MAX_ARRAY_LENGTH),
                "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
              });
            }
            return result2;
          };
          LazyWrapper.prototype[methodName + "Right"] = function(n) {
            return this.reverse()[methodName](n).reverse();
          };
        });
        arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
          var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
          LazyWrapper.prototype[methodName] = function(iteratee2) {
            var result2 = this.clone();
            result2.__iteratees__.push({
              "iteratee": getIteratee(iteratee2, 3),
              "type": type
            });
            result2.__filtered__ = result2.__filtered__ || isFilter;
            return result2;
          };
        });
        arrayEach(["head", "last"], function(methodName, index) {
          var takeName = "take" + (index ? "Right" : "");
          LazyWrapper.prototype[methodName] = function() {
            return this[takeName](1).value()[0];
          };
        });
        arrayEach(["initial", "tail"], function(methodName, index) {
          var dropName = "drop" + (index ? "" : "Right");
          LazyWrapper.prototype[methodName] = function() {
            return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
          };
        });
        LazyWrapper.prototype.compact = function() {
          return this.filter(identity);
        };
        LazyWrapper.prototype.find = function(predicate) {
          return this.filter(predicate).head();
        };
        LazyWrapper.prototype.findLast = function(predicate) {
          return this.reverse().find(predicate);
        };
        LazyWrapper.prototype.invokeMap = baseRest(function(path3, args) {
          if (typeof path3 == "function") {
            return new LazyWrapper(this);
          }
          return this.map(function(value) {
            return baseInvoke(value, path3, args);
          });
        });
        LazyWrapper.prototype.reject = function(predicate) {
          return this.filter(negate(getIteratee(predicate)));
        };
        LazyWrapper.prototype.slice = function(start, end) {
          start = toInteger(start);
          var result2 = this;
          if (result2.__filtered__ && (start > 0 || end < 0)) {
            return new LazyWrapper(result2);
          }
          if (start < 0) {
            result2 = result2.takeRight(-start);
          } else if (start) {
            result2 = result2.drop(start);
          }
          if (end !== undefined2) {
            end = toInteger(end);
            result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
          }
          return result2;
        };
        LazyWrapper.prototype.takeRightWhile = function(predicate) {
          return this.reverse().takeWhile(predicate).reverse();
        };
        LazyWrapper.prototype.toArray = function() {
          return this.take(MAX_ARRAY_LENGTH);
        };
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
          if (!lodashFunc) {
            return;
          }
          lodash.prototype[methodName] = function() {
            var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray(value);
            var interceptor = function(value2) {
              var result3 = lodashFunc.apply(lodash, arrayPush([value2], args));
              return isTaker && chainAll ? result3[0] : result3;
            };
            if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
              isLazy = useLazy = false;
            }
            var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
            if (!retUnwrapped && useLazy) {
              value = onlyLazy ? value : new LazyWrapper(this);
              var result2 = func.apply(value, args);
              result2.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": undefined2 });
              return new LodashWrapper(result2, chainAll);
            }
            if (isUnwrapped && onlyLazy) {
              return func.apply(this, args);
            }
            result2 = this.thru(interceptor);
            return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
          };
        });
        arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
          var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
          lodash.prototype[methodName] = function() {
            var args = arguments;
            if (retUnwrapped && !this.__chain__) {
              var value = this.value();
              return func.apply(isArray(value) ? value : [], args);
            }
            return this[chainName](function(value2) {
              return func.apply(isArray(value2) ? value2 : [], args);
            });
          };
        });
        baseForOwn(LazyWrapper.prototype, function(func, methodName) {
          var lodashFunc = lodash[methodName];
          if (lodashFunc) {
            var key = lodashFunc.name + "";
            if (!hasOwnProperty.call(realNames, key)) {
              realNames[key] = [];
            }
            realNames[key].push({ "name": methodName, "func": lodashFunc });
          }
        });
        realNames[createHybrid(undefined2, WRAP_BIND_KEY_FLAG).name] = [{
          "name": "wrapper",
          "func": undefined2
        }];
        LazyWrapper.prototype.clone = lazyClone;
        LazyWrapper.prototype.reverse = lazyReverse;
        LazyWrapper.prototype.value = lazyValue;
        lodash.prototype.at = wrapperAt;
        lodash.prototype.chain = wrapperChain;
        lodash.prototype.commit = wrapperCommit;
        lodash.prototype.next = wrapperNext;
        lodash.prototype.plant = wrapperPlant;
        lodash.prototype.reverse = wrapperReverse;
        lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
        lodash.prototype.first = lodash.prototype.head;
        if (symIterator) {
          lodash.prototype[symIterator] = wrapperToIterator;
        }
        return lodash;
      };
      var _ = runInContext();
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        root._ = _;
        define(function() {
          return _;
        });
      } else if (freeModule) {
        (freeModule.exports = _)._ = _;
        freeExports._ = _;
      } else {
        root._ = _;
      }
    }).call(exports);
  }
});

// node_modules/better-curry/index.js
var require_better_curry = __commonJS({
  "node_modules/better-curry/index.js"(exports, module2) {
    (function(root, factory) {
      "use strict";
      if (typeof module2 === "object" && typeof module2.exports === "object") {
        module2.exports = factory();
      } else if (typeof define === "function" && define.amd) {
        define("better-curry", [], factory);
      } else {
        root.BetterCurry = factory();
      }
    })(exports, function() {
      "use strict";
      function slice() {
        var out = [], args, x, i, l = arguments.length, m, t = 0;
        for (x = 0; x < l; ++x) {
          args = arguments[x];
          m = args.length;
          for (i = 0; i < m; ++i) {
            out[t++] = args[i];
          }
        }
        return out;
      }
      function template(fn, len, context, args) {
        var noContext = context === null, themArgs = [], outFn, instead = false;
        if (typeof args !== "undefined" && args.length && (len > 0 || len === -1)) {
          themArgs = slice(args);
          var i = 0, rlen = themArgs.length;
          instead = function(xarg, index) {
            themArgs[rlen + i++] = xarg;
            return themArgs[index];
          };
        }
        switch (len) {
          case 0:
            outFn = function zeroArgs() {
              return noContext ? fn() : fn.call(context);
            };
            break;
          case 1:
            outFn = function oneArg(arg1) {
              return noContext ? fn(instead === false ? arg1 : instead(arg1, 0)) : fn.call(context, instead === false ? arg1 : instead(arg1, 0));
            };
            break;
          case 2:
            outFn = function twoArgs(arg1, arg2) {
              return noContext ? fn(instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1)) : fn.call(context, instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1));
            };
            break;
          case 3:
            outFn = function threeArgs(arg1, arg2, arg3) {
              return noContext ? fn(instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2)) : fn.call(context, instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2));
            };
            break;
          case 4:
            outFn = function fourArgs(arg1, arg2, arg3, arg4) {
              return noContext ? fn(instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3)) : fn.call(context, instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3));
            };
            break;
          case 5:
            outFn = function fiveArgs(arg1, arg2, arg3, arg4, arg5) {
              return noContext ? fn(instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4)) : fn.call(context, instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4));
            };
            break;
          case 6:
            outFn = function sixArgs(arg1, arg2, arg3, arg4, arg5, arg6) {
              return noContext ? fn(instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4), instead === false ? arg6 : instead(arg6, 5)) : fn.call(context, instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4), instead === false ? arg6 : instead(arg6, 5));
            };
            break;
          case 7:
            outFn = function sevenArgs(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
              return noContext ? fn(instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4), instead === false ? arg6 : instead(arg6, 5), instead === false ? arg7 : instead(arg7, 6)) : fn.call(context, instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4), instead === false ? arg6 : instead(arg6, 5), instead === false ? arg7 : instead(arg7, 6));
            };
            break;
          case 8:
            outFn = function eightArgs(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
              return noContext ? fn(instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4), instead === false ? arg6 : instead(arg6, 5), instead === false ? arg7 : instead(arg7, 6), instead === false ? arg8 : instead(arg8, 7)) : fn.call(context, instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4), instead === false ? arg6 : instead(arg6, 5), instead === false ? arg7 : instead(arg7, 6), instead === false ? arg8 : instead(arg8, 7));
            };
            break;
          case 9:
            outFn = function nineArgs(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
              return noContext ? fn(instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4), instead === false ? arg6 : instead(arg6, 5), instead === false ? arg7 : instead(arg7, 6), instead === false ? arg8 : instead(arg8, 7), instead === false ? arg9 : instead(arg9, 8)) : fn.call(context, instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4), instead === false ? arg6 : instead(arg6, 5), instead === false ? arg7 : instead(arg7, 6), instead === false ? arg8 : instead(arg8, 7), instead === false ? arg9 : instead(arg9, 8));
            };
            break;
          case 10:
            outFn = function tenArgs(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
              return noContext ? fn(instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4), instead === false ? arg6 : instead(arg6, 5), instead === false ? arg7 : instead(arg7, 6), instead === false ? arg8 : instead(arg8, 7), instead === false ? arg9 : instead(arg9, 8), instead === false ? arg10 : instead(arg10, 9)) : fn.call(context, instead === false ? arg1 : instead(arg1, 0), instead === false ? arg2 : instead(arg2, 1), instead === false ? arg3 : instead(arg3, 2), instead === false ? arg4 : instead(arg4, 3), instead === false ? arg5 : instead(arg5, 4), instead === false ? arg6 : instead(arg6, 5), instead === false ? arg7 : instead(arg7, 6), instead === false ? arg8 : instead(arg8, 7), instead === false ? arg9 : instead(arg9, 8), instead === false ? arg10 : instead(arg10, 9));
            };
            break;
          default:
            if (themArgs.length) {
              outFn = function variadic() {
                return fn.apply(context, slice(themArgs, arguments));
              };
            } else {
              outFn = function variadic() {
                return fn.apply(context, slice(arguments));
              };
            }
        }
        outFn.__length = fn.length;
        return outFn;
      }
      var argumentsRegexp = /\barguments\b/;
      function Wrap(fn, context, len, checkArguments) {
        var _len = len || fn.length;
        checkArguments = checkArguments || false;
        if (checkArguments) {
          if (len !== fn.length && argumentsRegexp.test(fn)) {
            _len = -1;
          } else if (fn.__length) {
            _len = fn.__length;
          }
        }
        context = context || null;
        return template(fn, _len, context);
      }
      function Predefine(fn, args, context, len, checkArguments) {
        var _len = len || fn.length;
        context = context || null;
        if (checkArguments) {
          if (len !== fn.length && argumentsRegexp.test(fn)) {
            _len = -1;
          } else if (fn.__length) {
            _len = fn.__length;
          }
        }
        args = slice(args);
        if (args.length === 0) {
          return Wrap(fn, context, len, checkArguments);
        }
        return template(fn, _len, context, args);
      }
      function Delegate(proto, target) {
        if (!(this instanceof Delegate)) {
          return new Delegate(proto, target);
        }
        this.proto = proto;
        this.target = target;
        this.methods = [];
        this.getters = [];
        this.setters = [];
      }
      function extract(name) {
        var obj = typeof name === "object", _name = obj ? typeof name.as === "string" ? name.as : name.name : name, _len = obj ? typeof name.len === "number" ? name.len : void 0 : void 0, _args = obj ? typeof name.args !== "undefined" ? name.args : false : false;
        return {
          target: obj ? name.name : name,
          name: _name,
          len: _len,
          args: _args
        };
      }
      Delegate.prototype.method = function(name) {
        var opts = extract(name), proto = this.proto, target = this.target;
        this.methods.push(opts.name);
        proto[opts.name] = opts.args ? Predefine(proto[target][opts.target], opts.args, proto[target], opts.len) : Wrap(proto[target][opts.target], proto[target], opts.len);
        return this;
      };
      Delegate.prototype.all = function(skip) {
        var base = this.proto[this.target], k;
        if (skip && skip.length) {
          for (k in base) {
            if (skip.indexOf(k) === -1) {
              if (typeof base[k] === "function") {
                this.method(k);
              } else {
                this.access(k);
              }
            }
          }
        } else {
          for (k in base) {
            if (typeof base[k] === "function") {
              this.method(k);
            } else {
              this.access(k);
            }
          }
        }
      };
      Delegate.prototype.getter = function(name) {
        var opts = extract(name), proto = this.proto, target = this.target;
        this.getters.push(opts.name);
        Object.defineProperty(proto, opts.name, {
          get: function() {
            return this[target][opts.target];
          },
          enumerable: true,
          configurable: true
        });
        return this;
      };
      Delegate.prototype.setter = function(name) {
        var opts = extract(name), proto = this.proto, target = this.target;
        this.setters.push(opts.name);
        Object.defineProperty(proto, opts.name, {
          set: function(val) {
            this[target][opts.target] = val;
          },
          enumerable: true,
          configurable: true
        });
        return this;
      };
      Delegate.prototype.access = function(name) {
        return this.getter(name).setter(name);
      };
      Delegate.prototype.revoke = function(name, type) {
        if (typeof this.proto[name] !== "undefined") {
          var pos;
          switch (type) {
            case "access":
              this.revoke(name, "getter");
              this.revoke(name, "setter");
              break;
            case "setter":
            case "method":
            case "getter":
              pos = this[type + "s"].indexOf(name);
              if (pos > -1) {
                this[type + "s"].splice(pos, 1);
                delete this.proto[name];
              }
              break;
          }
        }
        return this;
      };
      return {
        wrap: Wrap,
        predefine: Predefine,
        delegate: Delegate,
        flatten: slice,
        MAX_OPTIMIZED: 10
      };
    });
  }
});

// node_modules/es5class/index.js
var require_es5class = __commonJS({
  "node_modules/es5class/index.js"(exports, module2) {
    (function(root, factory) {
      if (typeof module2 === "object" && typeof module2.exports === "object") {
        module2.exports = factory(require_better_curry());
      } else if (typeof define === "function" && define.amd) {
        define("ES5Class", ["better-curry"], factory);
      } else {
        root.ES5Class = factory(root.BetterCurry);
      }
    })(exports, function(BetterCurry) {
      "use strict";
      if (!BetterCurry) {
        throw new Error("better-curry dependency is missing");
      }
      var hwp = Object.prototype.hasOwnProperty, gpd = Object.getOwnPropertyDescriptor, spo = Object.setPrototypeOf || function(obj, proto) {
        obj.__proto__ = proto;
        return obj;
      }, configurables = {
        "$destroy": true
      }, filtered = {
        "$arguments": true,
        "$super": true,
        "prototype": true,
        "$original": true,
        "__length": true,
        "$currentContext": true
      }, hasSuperRegex = /\([^\$]*\$super[^\)]*\)(?=\s*\{)/m;
      function functionWrapper(key, obj, superFn, context) {
        if (!hasSuperRegex.test(obj[key])) {
          return obj[key];
        }
        var fn = BetterCurry.wrap(superFn, context, superFn.__length || obj[key].length, true);
        fn.$currentContext = context;
        var wrapped = function wrapped2() {
          var self2 = this;
          if (fn.$currentContext !== self2) {
            fn = BetterCurry.wrap(superFn, self2, fn.__length || obj[key].length, true);
            fn.$currentContext = self2;
          }
          if (arguments.length) {
            return obj[key].apply(self2, BetterCurry.flatten([fn], arguments));
          } else {
            return obj[key].call(self2, fn);
          }
        };
        wrapped.__length = fn.__length;
        return wrapped;
      }
      function count(obj) {
        var out = 0, i = null;
        for (i in obj) {
          out++;
        }
        return out;
      }
      function isArray(obj) {
        return obj !== void 0 && obj !== null && obj.constructor !== void 0 && obj.constructor === Array;
      }
      function isObject(obj) {
        return obj !== void 0 && obj !== null && obj.constructor !== void 0 && (obj.constructor === Object || Object.prototype.toString.call(obj) === "[object Object]");
      }
      function isFunction(obj) {
        return obj !== void 0 && obj !== null && (obj.constructor === Function || typeof obj === "function");
      }
      function isPlainFunction(object) {
        return isFunction(object) && (object["prototype"] === void 0 || count(object) === 0 && count(object.prototype) === 0) && !isES5Class(object);
      }
      function superApply(instance, object, args) {
        if (object.$apply.length) {
          object.$apply.forEach(function eachApply(f) {
            spo(instance, f.obj.prototype);
            f.obj.apply(instance, f.args || args);
          });
          return true;
        }
        return false;
      }
      function isES5Class(object) {
        return (isFunction(object) || isObject(object)) && object["$className"] !== void 0 && object["$class"] !== void 0 && object.$class === object.constructor;
      }
      function applyArray(self2, obj, args, check) {
        var found = false;
        self2.$apply.every(function(s) {
          if (s.obj && s.obj === obj) {
            found = true;
            return false;
          }
          return true;
        });
        if (found === false && check !== true) {
          if (isArray(args)) {
            self2.$apply.push({
              obj,
              args
            });
          } else {
            self2.$apply.push({
              obj
            });
          }
        }
        return found;
      }
      function copyArgs(obj, args) {
        for (var i = 0, len = args.length; i < len; i++) {
          obj.$arguments[i] = args[i];
        }
      }
      function splat(obj, key, args) {
        if (args && args.length > 0) {
          switch (args.length) {
            case 1:
              return obj[key](args[0]);
            case 2:
              return obj[key](args[0], args[1]);
            case 3:
              return obj[key](args[0], args[1], args[2]);
            case 4:
              return obj[key](args[0], args[1], args[2], args[3]);
            case 5:
              return obj[key](args[0], args[1], args[2], args[3], args[4]);
            case 6:
              return obj[key](args[0], args[1], args[2], args[3], args[4], args[5]);
            default:
              return obj[key].apply(obj, args);
          }
        } else {
          return obj[key]();
        }
      }
      function noop() {
      }
      function ES5Class() {
      }
      ES5Class.prototype.construct = noop;
      Object.defineProperty(ES5Class, "$define", {
        value: function $define(className, include, implement) {
          var self2 = this, isClass, getClass;
          if (!className) {
            throw new Error("Class name must be specified");
          }
          function Constructor() {
            var args = BetterCurry.flatten(arguments);
            if (!(this instanceof Constructor)) {
              return splat(Constructor, "$create", args);
            }
            if (superApply(this, Constructor, args)) {
              spo(this, Constructor.prototype);
            }
            if (this.construct && this.construct !== noop) {
              splat(this, "construct", args);
              copyArgs(this, args);
            }
            return this;
          }
          spo(Constructor, self2);
          getClass = function(Class) {
            return function getClass2() {
              return Class;
            };
          }(Constructor);
          isClass = function(object) {
            return function isClass2(cls) {
              return cls && isES5Class(cls) && cls.constructor === object.constructor;
            };
          }(Constructor);
          Object.defineProperties(Constructor, {
            "$className": {
              get: function(className2) {
                return function $className() {
                  return className2;
                };
              }(className)
            },
            "constructor": {
              get: getClass
            },
            "$parent": {
              value: function(object) {
                return object;
              }(self2)
            },
            "$apply": {
              value: [],
              writable: true
            },
            "$implements": {
              value: [],
              writable: true
            },
            "$isClass": {
              value: isClass
            },
            "$class": {
              get: getClass
            },
            "prototype": {
              value: function(prototype) {
                return prototype;
              }(Object.create(self2.prototype, {
                constructor: {
                  get: getClass
                },
                "$implements": {
                  "get": function(object) {
                    return function $implements() {
                      return object.$implements;
                    };
                  }(Constructor)
                },
                "$className": {
                  "get": function(object) {
                    return function $className() {
                      return object.$className;
                    };
                  }(Constructor)
                },
                "$arguments": {
                  value: [],
                  writable: true
                },
                "$parent": {
                  value: function(object) {
                    return object;
                  }(self2.prototype)
                },
                "$class": {
                  "get": getClass
                },
                "$isClass": {
                  value: isClass
                }
              }))
            }
          });
          if (implement) {
            Constructor.$implement(implement);
          }
          if (include) {
            Constructor.$include(include);
          }
          return Constructor;
        }
      });
      Object.defineProperty(ES5Class, "$create", {
        value: function $create() {
          var self2 = this, instance = self2.$apply.length ? Object.create(null) : Object.create(self2.prototype), args = BetterCurry.flatten(arguments);
          if (superApply(instance, self2, args)) {
            spo(instance, self2.prototype);
          }
          if (instance.construct && instance.construct !== noop) {
            splat(instance, "construct", args);
            copyArgs(instance, args);
          }
          return instance;
        }
      });
      Object.defineProperty(ES5Class, "$include", {
        value: function $include(obj) {
          var self2 = this, wrap, newfunc, descriptor;
          if (obj !== void 0 && obj !== null && self2.prototype !== void 0) {
            if (isArray(obj)) {
              for (var i = 0, len = obj.length; i < len; i++) {
                self2.$include(obj[i]);
              }
            } else if (isPlainFunction(obj)) {
              if ((newfunc = obj.call(self2, self2.$parent.prototype)) && (isObject(newfunc) || isArray(newfunc))) {
                self2.$include(newfunc);
              }
            } else {
              for (var key in obj) {
                if (hwp.call(obj, key)) {
                  descriptor = gpd(obj, key);
                  if (descriptor !== void 0 && (configurables[key] !== void 0 || descriptor.set !== void 0 || descriptor.get !== void 0 || descriptor.writable === false || descriptor.configurable === false || descriptor.enumerable === false)) {
                    Object.defineProperty(self2.prototype, key, descriptor);
                  } else if (key !== "prototype") {
                    if (isFunction(obj[key])) {
                      wrap = functionWrapper(key, obj, isFunction(self2.prototype[key]) ? self2.prototype[key] : noop, self2.prototype);
                      self2.prototype[key] = wrap;
                    } else {
                      self2.prototype[key] = obj[key];
                    }
                  }
                }
              }
            }
          }
          return self2;
        }
      });
      Object.defineProperty(ES5Class, "$implement", {
        value: function $implement(obj, apply, importing) {
          var self2 = this, func, newfunc, descriptor;
          if (obj !== void 0 && obj !== null) {
            if (isArray(obj)) {
              for (var i = 0, len = obj.length; i < len; i++) {
                if (importing) {
                  ES5Class.$implement.call(self2, obj[i], apply, importing);
                } else {
                  self2.$implement(obj[i], apply, importing);
                }
              }
            } else if (isPlainFunction(obj)) {
              if ((newfunc = obj.call(self2, self2.$parent)) && (isObject(newfunc) || isArray(newfunc))) {
                if (importing) {
                  ES5Class.$implement.call(self2, newfunc, apply, importing);
                } else {
                  self2.$implement(newfunc, apply, importing);
                }
              }
            } else {
              if (isES5Class(obj) && self2.$implements.indexOf(obj) === -1) {
                self2.$implements.push(obj);
              }
              for (var key in obj) {
                if (key !== "prototype") {
                  descriptor = gpd(obj, key);
                  if (descriptor !== void 0 && (descriptor.set !== void 0 || descriptor.get !== void 0 || descriptor.writable === false || descriptor.configurable === false || descriptor.enumerable === false)) {
                    Object.defineProperty(self2, key, descriptor);
                  } else {
                    if (isFunction(obj[key])) {
                      func = functionWrapper(key, obj, isFunction(self2[key]) ? self2[key] : noop, self2);
                      self2[key] = func;
                    } else {
                      self2[key] = obj[key];
                    }
                  }
                }
              }
              if (obj.prototype !== void 0 && !importing) {
                if (apply) {
                  applyArray(self2, obj);
                }
                self2.$include(obj.prototype);
              } else if (importing) {
                ES5Class.$include.call(self2, obj.prototype || obj);
              }
            }
          }
          return self2;
        }
      });
      Object.defineProperty(ES5Class, "$const", {
        value: function $const(values, toPrototype) {
          var target = this;
          if (toPrototype === true) {
            target = this.prototype;
          }
          if (isPlainFunction(values)) {
            values = values.call(this);
            if (isObject(values)) {
              this.$const(values, toPrototype);
            }
          } else if (isObject(values)) {
            for (var i in values) {
              Object.defineProperty(target, i, {
                value: values[i],
                enumerable: true
              });
            }
          }
          return this;
        }
      });
      Object.defineProperty(ES5Class, "$wrap", {
        value: function $wrap(obj, name) {
          return isES5Class(obj) ? obj : ES5Class.$define(name || "Wrapped", obj);
        }
      });
      Object.defineProperty(ES5Class, "$inherit", {
        value: function $inherit(from, args) {
          applyArray(this, from, args && args.length ? BetterCurry.flatten(args) : void 0);
          this.$implement(from);
          return this;
        }
      });
      Object.defineProperty(ES5Class, "$isES5Class", {
        value: isES5Class
      });
      Object.defineProperty(ES5Class, "$version", {
        value: "2.3.1"
      });
      Object.defineProperty(ES5Class, "$className", {
        get: function $className() {
          return "ES5Class";
        }
      });
      Object.defineProperty(ES5Class.prototype, "$class", {
        get: function $class() {
          return ES5Class;
        }
      });
      Object.defineProperty(ES5Class.prototype, "$destroy", {
        value: function $destroy() {
          var self2 = this, k;
          if (self2.$arguments && self2.$arguments.length > 0) {
            while (self2.$arguments.length > 0) {
              self2.$arguments.pop();
            }
          }
          for (k in self2) {
            delete self2[k];
          }
          return this;
        },
        configurable: true
      });
      Object.defineProperty(ES5Class.prototype, "$exchange", {
        value: function $exchange(obj, args) {
          if ((isFunction(obj) || isObject(obj)) && obj.prototype !== void 0) {
            var _args = this.$arguments;
            spo(this, obj.prototype);
            obj.apply(this, args || _args);
          }
          return this;
        }
      });
      Object.defineProperty(ES5Class.prototype, "$names", {
        get: function $names() {
          var names = Object.getOwnPropertyNames(this);
          return names.filter(function(i) {
            return filtered[i] === void 0;
          });
        }
      });
      Object.defineProperty(ES5Class.prototype, "$import", {
        value: function $import(obj) {
          ES5Class.$implement.call(this, obj, null, true);
          return this;
        }
      });
      Object.defineProperty(ES5Class.prototype, "$delegate", {
        value: function $delegate(where) {
          return new BetterCurry.delegate(this, where || "$class");
        }
      });
      Object.defineProperty(ES5Class.prototype, "$instanceOf", {
        value: function $instanceOf(object) {
          var self2 = this;
          return object && (object.prototype && object.prototype.isPrototypeOf(self2) || self2.isPrototypeOf(object) || applyArray(self2.$class, object, null, true));
        }
      });
      return ES5Class;
    });
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/websocket-driver/lib/websocket/streams.js
var require_streams = __commonJS({
  "node_modules/websocket-driver/lib/websocket/streams.js"(exports) {
    "use strict";
    var Stream = require("stream").Stream;
    var util2 = require("util");
    var IO = function(driver) {
      this.readable = this.writable = true;
      this._paused = false;
      this._driver = driver;
    };
    util2.inherits(IO, Stream);
    IO.prototype.pause = function() {
      this._paused = true;
      this._driver.messages._paused = true;
    };
    IO.prototype.resume = function() {
      this._paused = false;
      this.emit("drain");
      var messages = this._driver.messages;
      messages._paused = false;
      messages.emit("drain");
    };
    IO.prototype.write = function(chunk) {
      if (!this.writable)
        return false;
      this._driver.parse(chunk);
      return !this._paused;
    };
    IO.prototype.end = function(chunk) {
      if (!this.writable)
        return;
      if (chunk !== void 0)
        this.write(chunk);
      this.writable = false;
      var messages = this._driver.messages;
      if (messages.readable) {
        messages.readable = messages.writable = false;
        messages.emit("end");
      }
    };
    IO.prototype.destroy = function() {
      this.end();
    };
    var Messages = function(driver) {
      this.readable = this.writable = true;
      this._paused = false;
      this._driver = driver;
    };
    util2.inherits(Messages, Stream);
    Messages.prototype.pause = function() {
      this._driver.io._paused = true;
    };
    Messages.prototype.resume = function() {
      this._driver.io._paused = false;
      this._driver.io.emit("drain");
    };
    Messages.prototype.write = function(message) {
      if (!this.writable)
        return false;
      if (typeof message === "string")
        this._driver.text(message);
      else
        this._driver.binary(message);
      return !this._paused;
    };
    Messages.prototype.end = function(message) {
      if (message !== void 0)
        this.write(message);
    };
    Messages.prototype.destroy = function() {
    };
    exports.IO = IO;
    exports.Messages = Messages;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/headers.js
var require_headers = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/headers.js"(exports, module2) {
    "use strict";
    var Headers = function() {
      this.clear();
    };
    Headers.prototype.ALLOWED_DUPLICATES = ["set-cookie", "set-cookie2", "warning", "www-authenticate"];
    Headers.prototype.clear = function() {
      this._sent = {};
      this._lines = [];
    };
    Headers.prototype.set = function(name, value) {
      if (value === void 0)
        return;
      name = this._strip(name);
      value = this._strip(value);
      var key = name.toLowerCase();
      if (!this._sent.hasOwnProperty(key) || this.ALLOWED_DUPLICATES.indexOf(key) >= 0) {
        this._sent[key] = true;
        this._lines.push(name + ": " + value + "\r\n");
      }
    };
    Headers.prototype.toString = function() {
      return this._lines.join("");
    };
    Headers.prototype._strip = function(string) {
      return string.toString().replace(/^ */, "").replace(/ *$/, "");
    };
    module2.exports = Headers;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/stream_reader.js
var require_stream_reader = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/stream_reader.js"(exports, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var StreamReader = function() {
      this._queue = [];
      this._queueSize = 0;
      this._offset = 0;
    };
    StreamReader.prototype.put = function(buffer) {
      if (!buffer || buffer.length === 0)
        return;
      if (!Buffer2.isBuffer(buffer))
        buffer = Buffer2.from(buffer);
      this._queue.push(buffer);
      this._queueSize += buffer.length;
    };
    StreamReader.prototype.read = function(length) {
      if (length > this._queueSize)
        return null;
      if (length === 0)
        return Buffer2.alloc(0);
      this._queueSize -= length;
      var queue = this._queue, remain = length, first = queue[0], buffers, buffer;
      if (first.length >= length) {
        if (first.length === length) {
          return queue.shift();
        } else {
          buffer = first.slice(0, length);
          queue[0] = first.slice(length);
          return buffer;
        }
      }
      for (var i = 0, n = queue.length; i < n; i++) {
        if (remain < queue[i].length)
          break;
        remain -= queue[i].length;
      }
      buffers = queue.splice(0, i);
      if (remain > 0 && queue.length > 0) {
        buffers.push(queue[0].slice(0, remain));
        queue[0] = queue[0].slice(remain);
      }
      return Buffer2.concat(buffers, length);
    };
    StreamReader.prototype.eachByte = function(callback, context) {
      var buffer, n, index;
      while (this._queue.length > 0) {
        buffer = this._queue[0];
        n = buffer.length;
        while (this._offset < n) {
          index = this._offset;
          this._offset += 1;
          callback.call(context, buffer[index]);
        }
        this._offset = 0;
        this._queue.shift();
      }
    };
    module2.exports = StreamReader;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/base.js
var require_base = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/base.js"(exports, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var Emitter = require("events").EventEmitter;
    var util2 = require("util");
    var streams = require_streams();
    var Headers = require_headers();
    var Reader = require_stream_reader();
    var Base = function(request, url, options) {
      Emitter.call(this);
      Base.validateOptions(options || {}, ["maxLength", "masking", "requireMasking", "protocols"]);
      this._request = request;
      this._reader = new Reader();
      this._options = options || {};
      this._maxLength = this._options.maxLength || this.MAX_LENGTH;
      this._headers = new Headers();
      this.__queue = [];
      this.readyState = 0;
      this.url = url;
      this.io = new streams.IO(this);
      this.messages = new streams.Messages(this);
      this._bindEventListeners();
    };
    util2.inherits(Base, Emitter);
    Base.isWebSocket = function(request) {
      var connection = request.headers.connection || "", upgrade = request.headers.upgrade || "";
      return request.method === "GET" && connection.toLowerCase().split(/ *, */).indexOf("upgrade") >= 0 && upgrade.toLowerCase() === "websocket";
    };
    Base.validateOptions = function(options, validKeys) {
      for (var key2 in options) {
        if (validKeys.indexOf(key2) < 0)
          throw new Error("Unrecognized option: " + key2);
      }
    };
    var instance = {
      MAX_LENGTH: 67108863,
      STATES: ["connecting", "open", "closing", "closed"],
      _bindEventListeners: function() {
        var self2 = this;
        this.messages.on("error", function() {
        });
        this.on("message", function(event) {
          var messages = self2.messages;
          if (messages.readable)
            messages.emit("data", event.data);
        });
        this.on("error", function(error) {
          var messages = self2.messages;
          if (messages.readable)
            messages.emit("error", error);
        });
        this.on("close", function() {
          var messages = self2.messages;
          if (!messages.readable)
            return;
          messages.readable = messages.writable = false;
          messages.emit("end");
        });
      },
      getState: function() {
        return this.STATES[this.readyState] || null;
      },
      addExtension: function(extension) {
        return false;
      },
      setHeader: function(name, value) {
        if (this.readyState > 0)
          return false;
        this._headers.set(name, value);
        return true;
      },
      start: function() {
        if (this.readyState !== 0)
          return false;
        if (!Base.isWebSocket(this._request))
          return this._failHandshake(new Error("Not a WebSocket request"));
        var response;
        try {
          response = this._handshakeResponse();
        } catch (error) {
          return this._failHandshake(error);
        }
        this._write(response);
        if (this._stage !== -1)
          this._open();
        return true;
      },
      _failHandshake: function(error) {
        var headers = new Headers();
        headers.set("Content-Type", "text/plain");
        headers.set("Content-Length", Buffer2.byteLength(error.message, "utf8"));
        headers = ["HTTP/1.1 400 Bad Request", headers.toString(), error.message];
        this._write(Buffer2.from(headers.join("\r\n"), "utf8"));
        this._fail("protocol_error", error.message);
        return false;
      },
      text: function(message) {
        return this.frame(message);
      },
      binary: function(message) {
        return false;
      },
      ping: function() {
        return false;
      },
      pong: function() {
        return false;
      },
      close: function(reason, code) {
        if (this.readyState !== 1)
          return false;
        this.readyState = 3;
        this.emit("close", new Base.CloseEvent(null, null));
        return true;
      },
      _open: function() {
        this.readyState = 1;
        this.__queue.forEach(function(args) {
          this.frame.apply(this, args);
        }, this);
        this.__queue = [];
        this.emit("open", new Base.OpenEvent());
      },
      _queue: function(message) {
        this.__queue.push(message);
        return true;
      },
      _write: function(chunk) {
        var io = this.io;
        if (io.readable)
          io.emit("data", chunk);
      },
      _fail: function(type, message) {
        this.readyState = 2;
        this.emit("error", new Error(message));
        this.close();
      }
    };
    for (key in instance)
      Base.prototype[key] = instance[key];
    var key;
    Base.ConnectEvent = function() {
    };
    Base.OpenEvent = function() {
    };
    Base.CloseEvent = function(code, reason) {
      this.code = code;
      this.reason = reason;
    };
    Base.MessageEvent = function(data) {
      this.data = data;
    };
    Base.PingEvent = function(data) {
      this.data = data;
    };
    Base.PongEvent = function(data) {
      this.data = data;
    };
    module2.exports = Base;
  }
});

// node_modules/http-parser-js/http-parser.js
var require_http_parser = __commonJS({
  "node_modules/http-parser-js/http-parser.js"(exports) {
    var assert = require("assert");
    exports.HTTPParser = HTTPParser;
    function HTTPParser(type) {
      assert.ok(type === HTTPParser.REQUEST || type === HTTPParser.RESPONSE || type === void 0);
      if (type === void 0) {
      } else {
        this.initialize(type);
      }
    }
    HTTPParser.prototype.initialize = function(type, async_resource) {
      assert.ok(type === HTTPParser.REQUEST || type === HTTPParser.RESPONSE);
      this.type = type;
      this.state = type + "_LINE";
      this.info = {
        headers: [],
        upgrade: false
      };
      this.trailers = [];
      this.line = "";
      this.isChunked = false;
      this.connection = "";
      this.headerSize = 0;
      this.body_bytes = null;
      this.isUserCall = false;
      this.hadError = false;
    };
    HTTPParser.encoding = "ascii";
    HTTPParser.maxHeaderSize = 80 * 1024;
    HTTPParser.REQUEST = "REQUEST";
    HTTPParser.RESPONSE = "RESPONSE";
    var kOnHeaders = HTTPParser.kOnHeaders = 1;
    var kOnHeadersComplete = HTTPParser.kOnHeadersComplete = 2;
    var kOnBody = HTTPParser.kOnBody = 3;
    var kOnMessageComplete = HTTPParser.kOnMessageComplete = 4;
    HTTPParser.prototype[kOnHeaders] = HTTPParser.prototype[kOnHeadersComplete] = HTTPParser.prototype[kOnBody] = HTTPParser.prototype[kOnMessageComplete] = function() {
    };
    var compatMode0_12 = true;
    Object.defineProperty(HTTPParser, "kOnExecute", {
      get: function() {
        compatMode0_12 = false;
        return 99;
      }
    });
    var methods = exports.methods = HTTPParser.methods = [
      "DELETE",
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "CONNECT",
      "OPTIONS",
      "TRACE",
      "COPY",
      "LOCK",
      "MKCOL",
      "MOVE",
      "PROPFIND",
      "PROPPATCH",
      "SEARCH",
      "UNLOCK",
      "BIND",
      "REBIND",
      "UNBIND",
      "ACL",
      "REPORT",
      "MKACTIVITY",
      "CHECKOUT",
      "MERGE",
      "M-SEARCH",
      "NOTIFY",
      "SUBSCRIBE",
      "UNSUBSCRIBE",
      "PATCH",
      "PURGE",
      "MKCALENDAR",
      "LINK",
      "UNLINK"
    ];
    var method_connect = methods.indexOf("CONNECT");
    HTTPParser.prototype.reinitialize = HTTPParser;
    HTTPParser.prototype.close = HTTPParser.prototype.pause = HTTPParser.prototype.resume = HTTPParser.prototype.free = function() {
    };
    HTTPParser.prototype._compatMode0_11 = false;
    HTTPParser.prototype.getAsyncId = function() {
      return 0;
    };
    var headerState = {
      REQUEST_LINE: true,
      RESPONSE_LINE: true,
      HEADER: true
    };
    HTTPParser.prototype.execute = function(chunk, start, length) {
      if (!(this instanceof HTTPParser)) {
        throw new TypeError("not a HTTPParser");
      }
      start = start || 0;
      length = typeof length === "number" ? length : chunk.length;
      this.chunk = chunk;
      this.offset = start;
      var end = this.end = start + length;
      try {
        while (this.offset < end) {
          if (this[this.state]()) {
            break;
          }
        }
      } catch (err) {
        if (this.isUserCall) {
          throw err;
        }
        this.hadError = true;
        return err;
      }
      this.chunk = null;
      length = this.offset - start;
      if (headerState[this.state]) {
        this.headerSize += length;
        if (this.headerSize > HTTPParser.maxHeaderSize) {
          return new Error("max header size exceeded");
        }
      }
      return length;
    };
    var stateFinishAllowed = {
      REQUEST_LINE: true,
      RESPONSE_LINE: true,
      BODY_RAW: true
    };
    HTTPParser.prototype.finish = function() {
      if (this.hadError) {
        return;
      }
      if (!stateFinishAllowed[this.state]) {
        return new Error("invalid state for EOF");
      }
      if (this.state === "BODY_RAW") {
        this.userCall()(this[kOnMessageComplete]());
      }
    };
    HTTPParser.prototype.consume = HTTPParser.prototype.unconsume = HTTPParser.prototype.getCurrentBuffer = function() {
    };
    HTTPParser.prototype.userCall = function() {
      this.isUserCall = true;
      var self2 = this;
      return function(ret) {
        self2.isUserCall = false;
        return ret;
      };
    };
    HTTPParser.prototype.nextRequest = function() {
      this.userCall()(this[kOnMessageComplete]());
      this.reinitialize(this.type);
    };
    HTTPParser.prototype.consumeLine = function() {
      var end = this.end, chunk = this.chunk;
      for (var i = this.offset; i < end; i++) {
        if (chunk[i] === 10) {
          var line = this.line + chunk.toString(HTTPParser.encoding, this.offset, i);
          if (line.charAt(line.length - 1) === "\r") {
            line = line.substr(0, line.length - 1);
          }
          this.line = "";
          this.offset = i + 1;
          return line;
        }
      }
      this.line += chunk.toString(HTTPParser.encoding, this.offset, this.end);
      this.offset = this.end;
    };
    var headerExp = /^([^: \t]+):[ \t]*((?:.*[^ \t])|)/;
    var headerContinueExp = /^[ \t]+(.*[^ \t])/;
    HTTPParser.prototype.parseHeader = function(line, headers) {
      if (line.indexOf("\r") !== -1) {
        throw parseErrorCode("HPE_LF_EXPECTED");
      }
      var match = headerExp.exec(line);
      var k = match && match[1];
      if (k) {
        headers.push(k);
        headers.push(match[2]);
      } else {
        var matchContinue = headerContinueExp.exec(line);
        if (matchContinue && headers.length) {
          if (headers[headers.length - 1]) {
            headers[headers.length - 1] += " ";
          }
          headers[headers.length - 1] += matchContinue[1];
        }
      }
    };
    var requestExp = /^([A-Z-]+) ([^ ]+) HTTP\/(\d)\.(\d)$/;
    HTTPParser.prototype.REQUEST_LINE = function() {
      var line = this.consumeLine();
      if (!line) {
        return;
      }
      var match = requestExp.exec(line);
      if (match === null) {
        throw parseErrorCode("HPE_INVALID_CONSTANT");
      }
      this.info.method = this._compatMode0_11 ? match[1] : methods.indexOf(match[1]);
      if (this.info.method === -1) {
        throw new Error("invalid request method");
      }
      this.info.url = match[2];
      this.info.versionMajor = +match[3];
      this.info.versionMinor = +match[4];
      this.body_bytes = 0;
      this.state = "HEADER";
    };
    var responseExp = /^HTTP\/(\d)\.(\d) (\d{3}) ?(.*)$/;
    HTTPParser.prototype.RESPONSE_LINE = function() {
      var line = this.consumeLine();
      if (!line) {
        return;
      }
      var match = responseExp.exec(line);
      if (match === null) {
        throw parseErrorCode("HPE_INVALID_CONSTANT");
      }
      this.info.versionMajor = +match[1];
      this.info.versionMinor = +match[2];
      var statusCode = this.info.statusCode = +match[3];
      this.info.statusMessage = match[4];
      if ((statusCode / 100 | 0) === 1 || statusCode === 204 || statusCode === 304) {
        this.body_bytes = 0;
      }
      this.state = "HEADER";
    };
    HTTPParser.prototype.shouldKeepAlive = function() {
      if (this.info.versionMajor > 0 && this.info.versionMinor > 0) {
        if (this.connection.indexOf("close") !== -1) {
          return false;
        }
      } else if (this.connection.indexOf("keep-alive") === -1) {
        return false;
      }
      if (this.body_bytes !== null || this.isChunked) {
        return true;
      }
      return false;
    };
    HTTPParser.prototype.HEADER = function() {
      var line = this.consumeLine();
      if (line === void 0) {
        return;
      }
      var info = this.info;
      if (line) {
        this.parseHeader(line, info.headers);
      } else {
        var headers = info.headers;
        var hasContentLength = false;
        var currentContentLengthValue;
        var hasUpgradeHeader = false;
        for (var i = 0; i < headers.length; i += 2) {
          switch (headers[i].toLowerCase()) {
            case "transfer-encoding":
              this.isChunked = headers[i + 1].toLowerCase() === "chunked";
              break;
            case "content-length":
              currentContentLengthValue = +headers[i + 1];
              if (hasContentLength) {
                if (currentContentLengthValue !== this.body_bytes) {
                  throw parseErrorCode("HPE_UNEXPECTED_CONTENT_LENGTH");
                }
              } else {
                hasContentLength = true;
                this.body_bytes = currentContentLengthValue;
              }
              break;
            case "connection":
              this.connection += headers[i + 1].toLowerCase();
              break;
            case "upgrade":
              hasUpgradeHeader = true;
              break;
          }
        }
        if (this.isChunked && hasContentLength) {
          hasContentLength = false;
          this.body_bytes = null;
        }
        if (hasUpgradeHeader && this.connection.indexOf("upgrade") != -1) {
          info.upgrade = this.type === HTTPParser.REQUEST || info.statusCode === 101;
        } else {
          info.upgrade = info.method === method_connect;
        }
        if (this.isChunked && info.upgrade) {
          this.isChunked = false;
        }
        info.shouldKeepAlive = this.shouldKeepAlive();
        var skipBody;
        if (compatMode0_12) {
          skipBody = this.userCall()(this[kOnHeadersComplete](info));
        } else {
          skipBody = this.userCall()(this[kOnHeadersComplete](info.versionMajor, info.versionMinor, info.headers, info.method, info.url, info.statusCode, info.statusMessage, info.upgrade, info.shouldKeepAlive));
        }
        if (skipBody === 2) {
          this.nextRequest();
          return true;
        } else if (this.isChunked && !skipBody) {
          this.state = "BODY_CHUNKHEAD";
        } else if (skipBody || this.body_bytes === 0) {
          this.nextRequest();
          return info.upgrade;
        } else if (this.body_bytes === null) {
          this.state = "BODY_RAW";
        } else {
          this.state = "BODY_SIZED";
        }
      }
    };
    HTTPParser.prototype.BODY_CHUNKHEAD = function() {
      var line = this.consumeLine();
      if (line === void 0) {
        return;
      }
      this.body_bytes = parseInt(line, 16);
      if (!this.body_bytes) {
        this.state = "BODY_CHUNKTRAILERS";
      } else {
        this.state = "BODY_CHUNK";
      }
    };
    HTTPParser.prototype.BODY_CHUNK = function() {
      var length = Math.min(this.end - this.offset, this.body_bytes);
      this.userCall()(this[kOnBody](this.chunk, this.offset, length));
      this.offset += length;
      this.body_bytes -= length;
      if (!this.body_bytes) {
        this.state = "BODY_CHUNKEMPTYLINE";
      }
    };
    HTTPParser.prototype.BODY_CHUNKEMPTYLINE = function() {
      var line = this.consumeLine();
      if (line === void 0) {
        return;
      }
      assert.equal(line, "");
      this.state = "BODY_CHUNKHEAD";
    };
    HTTPParser.prototype.BODY_CHUNKTRAILERS = function() {
      var line = this.consumeLine();
      if (line === void 0) {
        return;
      }
      if (line) {
        this.parseHeader(line, this.trailers);
      } else {
        if (this.trailers.length) {
          this.userCall()(this[kOnHeaders](this.trailers, ""));
        }
        this.nextRequest();
      }
    };
    HTTPParser.prototype.BODY_RAW = function() {
      var length = this.end - this.offset;
      this.userCall()(this[kOnBody](this.chunk, this.offset, length));
      this.offset = this.end;
    };
    HTTPParser.prototype.BODY_SIZED = function() {
      var length = Math.min(this.end - this.offset, this.body_bytes);
      this.userCall()(this[kOnBody](this.chunk, this.offset, length));
      this.offset += length;
      this.body_bytes -= length;
      if (!this.body_bytes) {
        this.nextRequest();
      }
    };
    ["Headers", "HeadersComplete", "Body", "MessageComplete"].forEach(function(name) {
      var k = HTTPParser["kOn" + name];
      Object.defineProperty(HTTPParser.prototype, "on" + name, {
        get: function() {
          return this[k];
        },
        set: function(to) {
          this._compatMode0_11 = true;
          method_connect = "CONNECT";
          return this[k] = to;
        }
      });
    });
    function parseErrorCode(code) {
      var err = new Error("Parse Error");
      err.code = code;
      return err;
    }
  }
});

// node_modules/websocket-driver/lib/websocket/http_parser.js
var require_http_parser2 = __commonJS({
  "node_modules/websocket-driver/lib/websocket/http_parser.js"(exports, module2) {
    "use strict";
    var NodeHTTPParser = require_http_parser().HTTPParser;
    var Buffer2 = require_safe_buffer().Buffer;
    var TYPES = {
      request: NodeHTTPParser.REQUEST || "request",
      response: NodeHTTPParser.RESPONSE || "response"
    };
    var HttpParser = function(type) {
      this._type = type;
      this._parser = new NodeHTTPParser(TYPES[type]);
      this._complete = false;
      this.headers = {};
      var current = null, self2 = this;
      this._parser.onHeaderField = function(b, start, length) {
        current = b.toString("utf8", start, start + length).toLowerCase();
      };
      this._parser.onHeaderValue = function(b, start, length) {
        var value = b.toString("utf8", start, start + length);
        if (self2.headers.hasOwnProperty(current))
          self2.headers[current] += ", " + value;
        else
          self2.headers[current] = value;
      };
      this._parser.onHeadersComplete = this._parser[NodeHTTPParser.kOnHeadersComplete] = function(majorVersion, minorVersion, headers, method, pathname, statusCode) {
        var info = arguments[0];
        if (typeof info === "object") {
          method = info.method;
          pathname = info.url;
          statusCode = info.statusCode;
          headers = info.headers;
        }
        self2.method = typeof method === "number" ? HttpParser.METHODS[method] : method;
        self2.statusCode = statusCode;
        self2.url = pathname;
        if (!headers)
          return;
        for (var i = 0, n = headers.length, key, value; i < n; i += 2) {
          key = headers[i].toLowerCase();
          value = headers[i + 1];
          if (self2.headers.hasOwnProperty(key))
            self2.headers[key] += ", " + value;
          else
            self2.headers[key] = value;
        }
        self2._complete = true;
      };
    };
    HttpParser.METHODS = {
      0: "DELETE",
      1: "GET",
      2: "HEAD",
      3: "POST",
      4: "PUT",
      5: "CONNECT",
      6: "OPTIONS",
      7: "TRACE",
      8: "COPY",
      9: "LOCK",
      10: "MKCOL",
      11: "MOVE",
      12: "PROPFIND",
      13: "PROPPATCH",
      14: "SEARCH",
      15: "UNLOCK",
      16: "BIND",
      17: "REBIND",
      18: "UNBIND",
      19: "ACL",
      20: "REPORT",
      21: "MKACTIVITY",
      22: "CHECKOUT",
      23: "MERGE",
      24: "M-SEARCH",
      25: "NOTIFY",
      26: "SUBSCRIBE",
      27: "UNSUBSCRIBE",
      28: "PATCH",
      29: "PURGE",
      30: "MKCALENDAR",
      31: "LINK",
      32: "UNLINK"
    };
    var VERSION = process.version ? process.version.match(/[0-9]+/g).map(function(n) {
      return parseInt(n, 10);
    }) : [];
    if (VERSION[0] === 0 && VERSION[1] === 12) {
      HttpParser.METHODS[16] = "REPORT";
      HttpParser.METHODS[17] = "MKACTIVITY";
      HttpParser.METHODS[18] = "CHECKOUT";
      HttpParser.METHODS[19] = "MERGE";
      HttpParser.METHODS[20] = "M-SEARCH";
      HttpParser.METHODS[21] = "NOTIFY";
      HttpParser.METHODS[22] = "SUBSCRIBE";
      HttpParser.METHODS[23] = "UNSUBSCRIBE";
      HttpParser.METHODS[24] = "PATCH";
      HttpParser.METHODS[25] = "PURGE";
    }
    HttpParser.prototype.isComplete = function() {
      return this._complete;
    };
    HttpParser.prototype.parse = function(chunk) {
      var consumed = this._parser.execute(chunk, 0, chunk.length);
      if (typeof consumed !== "number") {
        this.error = consumed;
        this._complete = true;
        return;
      }
      if (this._complete)
        this.body = consumed < chunk.length ? chunk.slice(consumed) : Buffer2.alloc(0);
    };
    module2.exports = HttpParser;
  }
});

// node_modules/websocket-extensions/lib/parser.js
var require_parser = __commonJS({
  "node_modules/websocket-extensions/lib/parser.js"(exports, module2) {
    "use strict";
    var TOKEN = /([!#\$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+)/;
    var NOTOKEN = /([^!#\$%&'\*\+\-\.\^_`\|~0-9A-Za-z])/g;
    var QUOTED = /"((?:\\[\x00-\x7f]|[^\x00-\x08\x0a-\x1f\x7f"\\])*)"/;
    var PARAM = new RegExp(TOKEN.source + "(?:=(?:" + TOKEN.source + "|" + QUOTED.source + "))?");
    var EXT = new RegExp(TOKEN.source + "(?: *; *" + PARAM.source + ")*", "g");
    var EXT_LIST = new RegExp("^" + EXT.source + "(?: *, *" + EXT.source + ")*$");
    var NUMBER = /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var Parser = {
      parseHeader: function(header) {
        var offers = new Offers();
        if (header === "" || header === void 0)
          return offers;
        if (!EXT_LIST.test(header))
          throw new SyntaxError("Invalid Sec-WebSocket-Extensions header: " + header);
        var values = header.match(EXT);
        values.forEach(function(value) {
          var params = value.match(new RegExp(PARAM.source, "g")), name = params.shift(), offer = {};
          params.forEach(function(param) {
            var args = param.match(PARAM), key = args[1], data;
            if (args[2] !== void 0) {
              data = args[2];
            } else if (args[3] !== void 0) {
              data = args[3].replace(/\\/g, "");
            } else {
              data = true;
            }
            if (NUMBER.test(data))
              data = parseFloat(data);
            if (hasOwnProperty.call(offer, key)) {
              offer[key] = [].concat(offer[key]);
              offer[key].push(data);
            } else {
              offer[key] = data;
            }
          }, this);
          offers.push(name, offer);
        }, this);
        return offers;
      },
      serializeParams: function(name, params) {
        var values = [];
        var print = function(key2, value) {
          if (value instanceof Array) {
            value.forEach(function(v) {
              print(key2, v);
            });
          } else if (value === true) {
            values.push(key2);
          } else if (typeof value === "number") {
            values.push(key2 + "=" + value);
          } else if (NOTOKEN.test(value)) {
            values.push(key2 + '="' + value.replace(/"/g, '\\"') + '"');
          } else {
            values.push(key2 + "=" + value);
          }
        };
        for (var key in params)
          print(key, params[key]);
        return [name].concat(values).join("; ");
      }
    };
    var Offers = function() {
      this._byName = {};
      this._inOrder = [];
    };
    Offers.prototype.push = function(name, params) {
      if (!hasOwnProperty.call(this._byName, name))
        this._byName[name] = [];
      this._byName[name].push(params);
      this._inOrder.push({ name, params });
    };
    Offers.prototype.eachOffer = function(callback, context) {
      var list = this._inOrder;
      for (var i = 0, n = list.length; i < n; i++)
        callback.call(context, list[i].name, list[i].params);
    };
    Offers.prototype.byName = function(name) {
      return this._byName[name] || [];
    };
    Offers.prototype.toArray = function() {
      return this._inOrder.slice();
    };
    module2.exports = Parser;
  }
});

// node_modules/websocket-extensions/lib/pipeline/ring_buffer.js
var require_ring_buffer = __commonJS({
  "node_modules/websocket-extensions/lib/pipeline/ring_buffer.js"(exports, module2) {
    "use strict";
    var RingBuffer = function(bufferSize) {
      this._bufferSize = bufferSize;
      this.clear();
    };
    RingBuffer.prototype.clear = function() {
      this._buffer = new Array(this._bufferSize);
      this._ringOffset = 0;
      this._ringSize = this._bufferSize;
      this._head = 0;
      this._tail = 0;
      this.length = 0;
    };
    RingBuffer.prototype.push = function(value) {
      var expandBuffer = false, expandRing = false;
      if (this._ringSize < this._bufferSize) {
        expandBuffer = this._tail === 0;
      } else if (this._ringOffset === this._ringSize) {
        expandBuffer = true;
        expandRing = this._tail === 0;
      }
      if (expandBuffer) {
        this._tail = this._bufferSize;
        this._buffer = this._buffer.concat(new Array(this._bufferSize));
        this._bufferSize = this._buffer.length;
        if (expandRing)
          this._ringSize = this._bufferSize;
      }
      this._buffer[this._tail] = value;
      this.length += 1;
      if (this._tail < this._ringSize)
        this._ringOffset += 1;
      this._tail = (this._tail + 1) % this._bufferSize;
    };
    RingBuffer.prototype.peek = function() {
      if (this.length === 0)
        return void 0;
      return this._buffer[this._head];
    };
    RingBuffer.prototype.shift = function() {
      if (this.length === 0)
        return void 0;
      var value = this._buffer[this._head];
      this._buffer[this._head] = void 0;
      this.length -= 1;
      this._ringOffset -= 1;
      if (this._ringOffset === 0 && this.length > 0) {
        this._head = this._ringSize;
        this._ringOffset = this.length;
        this._ringSize = this._bufferSize;
      } else {
        this._head = (this._head + 1) % this._ringSize;
      }
      return value;
    };
    module2.exports = RingBuffer;
  }
});

// node_modules/websocket-extensions/lib/pipeline/functor.js
var require_functor = __commonJS({
  "node_modules/websocket-extensions/lib/pipeline/functor.js"(exports, module2) {
    "use strict";
    var RingBuffer = require_ring_buffer();
    var Functor = function(session, method) {
      this._session = session;
      this._method = method;
      this._queue = new RingBuffer(Functor.QUEUE_SIZE);
      this._stopped = false;
      this.pending = 0;
    };
    Functor.QUEUE_SIZE = 8;
    Functor.prototype.call = function(error, message, callback, context) {
      if (this._stopped)
        return;
      var record = { error, message, callback, context, done: false }, called = false, self2 = this;
      this._queue.push(record);
      if (record.error) {
        record.done = true;
        this._stop();
        return this._flushQueue();
      }
      var handler = function(err, msg) {
        if (!(called ^ (called = true)))
          return;
        if (err) {
          self2._stop();
          record.error = err;
          record.message = null;
        } else {
          record.message = msg;
        }
        record.done = true;
        self2._flushQueue();
      };
      try {
        this._session[this._method](message, handler);
      } catch (err) {
        handler(err);
      }
    };
    Functor.prototype._stop = function() {
      this.pending = this._queue.length;
      this._stopped = true;
    };
    Functor.prototype._flushQueue = function() {
      var queue = this._queue, record;
      while (queue.length > 0 && queue.peek().done) {
        record = queue.shift();
        if (record.error) {
          this.pending = 0;
          queue.clear();
        } else {
          this.pending -= 1;
        }
        record.callback.call(record.context, record.error, record.message);
      }
    };
    module2.exports = Functor;
  }
});

// node_modules/websocket-extensions/lib/pipeline/pledge.js
var require_pledge = __commonJS({
  "node_modules/websocket-extensions/lib/pipeline/pledge.js"(exports, module2) {
    "use strict";
    var RingBuffer = require_ring_buffer();
    var Pledge = function() {
      this._complete = false;
      this._callbacks = new RingBuffer(Pledge.QUEUE_SIZE);
    };
    Pledge.QUEUE_SIZE = 4;
    Pledge.all = function(list) {
      var pledge = new Pledge(), pending = list.length, n = pending;
      if (pending === 0)
        pledge.done();
      while (n--)
        list[n].then(function() {
          pending -= 1;
          if (pending === 0)
            pledge.done();
        });
      return pledge;
    };
    Pledge.prototype.then = function(callback) {
      if (this._complete)
        callback();
      else
        this._callbacks.push(callback);
    };
    Pledge.prototype.done = function() {
      this._complete = true;
      var callbacks = this._callbacks, callback;
      while (callback = callbacks.shift())
        callback();
    };
    module2.exports = Pledge;
  }
});

// node_modules/websocket-extensions/lib/pipeline/cell.js
var require_cell = __commonJS({
  "node_modules/websocket-extensions/lib/pipeline/cell.js"(exports, module2) {
    "use strict";
    var Functor = require_functor();
    var Pledge = require_pledge();
    var Cell = function(tuple) {
      this._ext = tuple[0];
      this._session = tuple[1];
      this._functors = {
        incoming: new Functor(this._session, "processIncomingMessage"),
        outgoing: new Functor(this._session, "processOutgoingMessage")
      };
    };
    Cell.prototype.pending = function(direction) {
      var functor = this._functors[direction];
      if (!functor._stopped)
        functor.pending += 1;
    };
    Cell.prototype.incoming = function(error, message, callback, context) {
      this._exec("incoming", error, message, callback, context);
    };
    Cell.prototype.outgoing = function(error, message, callback, context) {
      this._exec("outgoing", error, message, callback, context);
    };
    Cell.prototype.close = function() {
      this._closed = this._closed || new Pledge();
      this._doClose();
      return this._closed;
    };
    Cell.prototype._exec = function(direction, error, message, callback, context) {
      this._functors[direction].call(error, message, function(err, msg) {
        if (err)
          err.message = this._ext.name + ": " + err.message;
        callback.call(context, err, msg);
        this._doClose();
      }, this);
    };
    Cell.prototype._doClose = function() {
      var fin = this._functors.incoming, fout = this._functors.outgoing;
      if (!this._closed || fin.pending + fout.pending !== 0)
        return;
      if (this._session)
        this._session.close();
      this._session = null;
      this._closed.done();
    };
    module2.exports = Cell;
  }
});

// node_modules/websocket-extensions/lib/pipeline/index.js
var require_pipeline = __commonJS({
  "node_modules/websocket-extensions/lib/pipeline/index.js"(exports, module2) {
    "use strict";
    var Cell = require_cell();
    var Pledge = require_pledge();
    var Pipeline = function(sessions) {
      this._cells = sessions.map(function(session) {
        return new Cell(session);
      });
      this._stopped = { incoming: false, outgoing: false };
    };
    Pipeline.prototype.processIncomingMessage = function(message, callback, context) {
      if (this._stopped.incoming)
        return;
      this._loop("incoming", this._cells.length - 1, -1, -1, message, callback, context);
    };
    Pipeline.prototype.processOutgoingMessage = function(message, callback, context) {
      if (this._stopped.outgoing)
        return;
      this._loop("outgoing", 0, this._cells.length, 1, message, callback, context);
    };
    Pipeline.prototype.close = function(callback, context) {
      this._stopped = { incoming: true, outgoing: true };
      var closed = this._cells.map(function(a) {
        return a.close();
      });
      if (callback)
        Pledge.all(closed).then(function() {
          callback.call(context);
        });
    };
    Pipeline.prototype._loop = function(direction, start, end, step, message, callback, context) {
      var cells = this._cells, n = cells.length, self2 = this;
      while (n--)
        cells[n].pending(direction);
      var pipe = function(index, error, msg) {
        if (index === end)
          return callback.call(context, error, msg);
        cells[index][direction](error, msg, function(err, m) {
          if (err)
            self2._stopped[direction] = true;
          pipe(index + step, err, m);
        });
      };
      pipe(start, null, message);
    };
    module2.exports = Pipeline;
  }
});

// node_modules/websocket-extensions/lib/websocket_extensions.js
var require_websocket_extensions = __commonJS({
  "node_modules/websocket-extensions/lib/websocket_extensions.js"(exports, module2) {
    "use strict";
    var Parser = require_parser();
    var Pipeline = require_pipeline();
    var Extensions = function() {
      this._rsv1 = this._rsv2 = this._rsv3 = null;
      this._byName = {};
      this._inOrder = [];
      this._sessions = [];
      this._index = {};
    };
    Extensions.MESSAGE_OPCODES = [1, 2];
    var instance = {
      add: function(ext) {
        if (typeof ext.name !== "string")
          throw new TypeError("extension.name must be a string");
        if (ext.type !== "permessage")
          throw new TypeError('extension.type must be "permessage"');
        if (typeof ext.rsv1 !== "boolean")
          throw new TypeError("extension.rsv1 must be true or false");
        if (typeof ext.rsv2 !== "boolean")
          throw new TypeError("extension.rsv2 must be true or false");
        if (typeof ext.rsv3 !== "boolean")
          throw new TypeError("extension.rsv3 must be true or false");
        if (this._byName.hasOwnProperty(ext.name))
          throw new TypeError('An extension with name "' + ext.name + '" is already registered');
        this._byName[ext.name] = ext;
        this._inOrder.push(ext);
      },
      generateOffer: function() {
        var sessions = [], offer = [], index = {};
        this._inOrder.forEach(function(ext) {
          var session = ext.createClientSession();
          if (!session)
            return;
          var record = [ext, session];
          sessions.push(record);
          index[ext.name] = record;
          var offers = session.generateOffer();
          offers = offers ? [].concat(offers) : [];
          offers.forEach(function(off) {
            offer.push(Parser.serializeParams(ext.name, off));
          }, this);
        }, this);
        this._sessions = sessions;
        this._index = index;
        return offer.length > 0 ? offer.join(", ") : null;
      },
      activate: function(header) {
        var responses = Parser.parseHeader(header), sessions = [];
        responses.eachOffer(function(name, params) {
          var record = this._index[name];
          if (!record)
            throw new Error('Server sent an extension response for unknown extension "' + name + '"');
          var ext = record[0], session = record[1], reserved = this._reserved(ext);
          if (reserved)
            throw new Error("Server sent two extension responses that use the RSV" + reserved[0] + ' bit: "' + reserved[1] + '" and "' + ext.name + '"');
          if (session.activate(params) !== true)
            throw new Error("Server sent unacceptable extension parameters: " + Parser.serializeParams(name, params));
          this._reserve(ext);
          sessions.push(record);
        }, this);
        this._sessions = sessions;
        this._pipeline = new Pipeline(sessions);
      },
      generateResponse: function(header) {
        var sessions = [], response = [], offers = Parser.parseHeader(header);
        this._inOrder.forEach(function(ext) {
          var offer = offers.byName(ext.name);
          if (offer.length === 0 || this._reserved(ext))
            return;
          var session = ext.createServerSession(offer);
          if (!session)
            return;
          this._reserve(ext);
          sessions.push([ext, session]);
          response.push(Parser.serializeParams(ext.name, session.generateResponse()));
        }, this);
        this._sessions = sessions;
        this._pipeline = new Pipeline(sessions);
        return response.length > 0 ? response.join(", ") : null;
      },
      validFrameRsv: function(frame) {
        var allowed = { rsv1: false, rsv2: false, rsv3: false }, ext;
        if (Extensions.MESSAGE_OPCODES.indexOf(frame.opcode) >= 0) {
          for (var i = 0, n = this._sessions.length; i < n; i++) {
            ext = this._sessions[i][0];
            allowed.rsv1 = allowed.rsv1 || ext.rsv1;
            allowed.rsv2 = allowed.rsv2 || ext.rsv2;
            allowed.rsv3 = allowed.rsv3 || ext.rsv3;
          }
        }
        return (allowed.rsv1 || !frame.rsv1) && (allowed.rsv2 || !frame.rsv2) && (allowed.rsv3 || !frame.rsv3);
      },
      processIncomingMessage: function(message, callback, context) {
        this._pipeline.processIncomingMessage(message, callback, context);
      },
      processOutgoingMessage: function(message, callback, context) {
        this._pipeline.processOutgoingMessage(message, callback, context);
      },
      close: function(callback, context) {
        if (!this._pipeline)
          return callback.call(context);
        this._pipeline.close(callback, context);
      },
      _reserve: function(ext) {
        this._rsv1 = this._rsv1 || ext.rsv1 && ext.name;
        this._rsv2 = this._rsv2 || ext.rsv2 && ext.name;
        this._rsv3 = this._rsv3 || ext.rsv3 && ext.name;
      },
      _reserved: function(ext) {
        if (this._rsv1 && ext.rsv1)
          return [1, this._rsv1];
        if (this._rsv2 && ext.rsv2)
          return [2, this._rsv2];
        if (this._rsv3 && ext.rsv3)
          return [3, this._rsv3];
        return false;
      }
    };
    for (key in instance)
      Extensions.prototype[key] = instance[key];
    var key;
    module2.exports = Extensions;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/hybi/frame.js
var require_frame = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/hybi/frame.js"(exports, module2) {
    "use strict";
    var Frame = function() {
    };
    var instance = {
      final: false,
      rsv1: false,
      rsv2: false,
      rsv3: false,
      opcode: null,
      masked: false,
      maskingKey: null,
      lengthBytes: 1,
      length: 0,
      payload: null
    };
    for (key in instance)
      Frame.prototype[key] = instance[key];
    var key;
    module2.exports = Frame;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/hybi/message.js
var require_message = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/hybi/message.js"(exports, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var Message = function() {
      this.rsv1 = false;
      this.rsv2 = false;
      this.rsv3 = false;
      this.opcode = null;
      this.length = 0;
      this._chunks = [];
    };
    var instance = {
      read: function() {
        return this.data = this.data || Buffer2.concat(this._chunks, this.length);
      },
      pushFrame: function(frame) {
        this.rsv1 = this.rsv1 || frame.rsv1;
        this.rsv2 = this.rsv2 || frame.rsv2;
        this.rsv3 = this.rsv3 || frame.rsv3;
        if (this.opcode === null)
          this.opcode = frame.opcode;
        this._chunks.push(frame.payload);
        this.length += frame.length;
      }
    };
    for (key in instance)
      Message.prototype[key] = instance[key];
    var key;
    module2.exports = Message;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/hybi.js
var require_hybi = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/hybi.js"(exports, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var crypto = require("crypto");
    var util2 = require("util");
    var Extensions = require_websocket_extensions();
    var Base = require_base();
    var Frame = require_frame();
    var Message = require_message();
    var Hybi = function(request, url, options) {
      Base.apply(this, arguments);
      this._extensions = new Extensions();
      this._stage = 0;
      this._masking = this._options.masking;
      this._protocols = this._options.protocols || [];
      this._requireMasking = this._options.requireMasking;
      this._pingCallbacks = {};
      if (typeof this._protocols === "string")
        this._protocols = this._protocols.split(/ *, */);
      if (!this._request)
        return;
      var protos = this._request.headers["sec-websocket-protocol"], supported = this._protocols;
      if (protos !== void 0) {
        if (typeof protos === "string")
          protos = protos.split(/ *, */);
        this.protocol = protos.filter(function(p) {
          return supported.indexOf(p) >= 0;
        })[0];
      }
      this.version = "hybi-" + Hybi.VERSION;
    };
    util2.inherits(Hybi, Base);
    Hybi.VERSION = "13";
    Hybi.mask = function(payload, mask, offset) {
      if (!mask || mask.length === 0)
        return payload;
      offset = offset || 0;
      for (var i = 0, n = payload.length - offset; i < n; i++) {
        payload[offset + i] = payload[offset + i] ^ mask[i % 4];
      }
      return payload;
    };
    Hybi.generateAccept = function(key2) {
      var sha1 = crypto.createHash("sha1");
      sha1.update(key2 + Hybi.GUID);
      return sha1.digest("base64");
    };
    Hybi.GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    var instance = {
      FIN: 128,
      MASK: 128,
      RSV1: 64,
      RSV2: 32,
      RSV3: 16,
      OPCODE: 15,
      LENGTH: 127,
      OPCODES: {
        continuation: 0,
        text: 1,
        binary: 2,
        close: 8,
        ping: 9,
        pong: 10
      },
      OPCODE_CODES: [0, 1, 2, 8, 9, 10],
      MESSAGE_OPCODES: [0, 1, 2],
      OPENING_OPCODES: [1, 2],
      ERRORS: {
        normal_closure: 1e3,
        going_away: 1001,
        protocol_error: 1002,
        unacceptable: 1003,
        encoding_error: 1007,
        policy_violation: 1008,
        too_large: 1009,
        extension_error: 1010,
        unexpected_condition: 1011
      },
      ERROR_CODES: [1e3, 1001, 1002, 1003, 1007, 1008, 1009, 1010, 1011],
      DEFAULT_ERROR_CODE: 1e3,
      MIN_RESERVED_ERROR: 3e3,
      MAX_RESERVED_ERROR: 4999,
      UTF8_MATCH: /^([\x00-\x7F]|[\xC2-\xDF][\x80-\xBF]|\xE0[\xA0-\xBF][\x80-\xBF]|[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}|\xED[\x80-\x9F][\x80-\xBF]|\xF0[\x90-\xBF][\x80-\xBF]{2}|[\xF1-\xF3][\x80-\xBF]{3}|\xF4[\x80-\x8F][\x80-\xBF]{2})*$/,
      addExtension: function(extension) {
        this._extensions.add(extension);
        return true;
      },
      parse: function(chunk) {
        this._reader.put(chunk);
        var buffer = true;
        while (buffer) {
          switch (this._stage) {
            case 0:
              buffer = this._reader.read(1);
              if (buffer)
                this._parseOpcode(buffer[0]);
              break;
            case 1:
              buffer = this._reader.read(1);
              if (buffer)
                this._parseLength(buffer[0]);
              break;
            case 2:
              buffer = this._reader.read(this._frame.lengthBytes);
              if (buffer)
                this._parseExtendedLength(buffer);
              break;
            case 3:
              buffer = this._reader.read(4);
              if (buffer) {
                this._stage = 4;
                this._frame.maskingKey = buffer;
              }
              break;
            case 4:
              buffer = this._reader.read(this._frame.length);
              if (buffer) {
                this._stage = 0;
                this._emitFrame(buffer);
              }
              break;
            default:
              buffer = null;
          }
        }
      },
      text: function(message) {
        if (this.readyState > 1)
          return false;
        return this.frame(message, "text");
      },
      binary: function(message) {
        if (this.readyState > 1)
          return false;
        return this.frame(message, "binary");
      },
      ping: function(message, callback) {
        if (this.readyState > 1)
          return false;
        message = message || "";
        if (callback)
          this._pingCallbacks[message] = callback;
        return this.frame(message, "ping");
      },
      pong: function(message) {
        if (this.readyState > 1)
          return false;
        message = message || "";
        return this.frame(message, "pong");
      },
      close: function(reason, code) {
        reason = reason || "";
        code = code || this.ERRORS.normal_closure;
        if (this.readyState <= 0) {
          this.readyState = 3;
          this.emit("close", new Base.CloseEvent(code, reason));
          return true;
        } else if (this.readyState === 1) {
          this.readyState = 2;
          this._extensions.close(function() {
            this.frame(reason, "close", code);
          }, this);
          return true;
        } else {
          return false;
        }
      },
      frame: function(buffer, type, code) {
        if (this.readyState <= 0)
          return this._queue([buffer, type, code]);
        if (this.readyState > 2)
          return false;
        if (buffer instanceof Array)
          buffer = Buffer2.from(buffer);
        if (typeof buffer === "number")
          buffer = buffer.toString();
        var message = new Message(), isText = typeof buffer === "string", payload, copy;
        message.rsv1 = message.rsv2 = message.rsv3 = false;
        message.opcode = this.OPCODES[type || (isText ? "text" : "binary")];
        payload = isText ? Buffer2.from(buffer, "utf8") : buffer;
        if (code) {
          copy = payload;
          payload = Buffer2.allocUnsafe(2 + copy.length);
          payload.writeUInt16BE(code, 0);
          copy.copy(payload, 2);
        }
        message.data = payload;
        var onMessageReady = function(message2) {
          var frame = new Frame();
          frame.final = true;
          frame.rsv1 = message2.rsv1;
          frame.rsv2 = message2.rsv2;
          frame.rsv3 = message2.rsv3;
          frame.opcode = message2.opcode;
          frame.masked = !!this._masking;
          frame.length = message2.data.length;
          frame.payload = message2.data;
          if (frame.masked)
            frame.maskingKey = crypto.randomBytes(4);
          this._sendFrame(frame);
        };
        if (this.MESSAGE_OPCODES.indexOf(message.opcode) >= 0)
          this._extensions.processOutgoingMessage(message, function(error, message2) {
            if (error)
              return this._fail("extension_error", error.message);
            onMessageReady.call(this, message2);
          }, this);
        else
          onMessageReady.call(this, message);
        return true;
      },
      _sendFrame: function(frame) {
        var length = frame.length, header = length <= 125 ? 2 : length <= 65535 ? 4 : 10, offset = header + (frame.masked ? 4 : 0), buffer = Buffer2.allocUnsafe(offset + length), masked = frame.masked ? this.MASK : 0;
        buffer[0] = (frame.final ? this.FIN : 0) | (frame.rsv1 ? this.RSV1 : 0) | (frame.rsv2 ? this.RSV2 : 0) | (frame.rsv3 ? this.RSV3 : 0) | frame.opcode;
        if (length <= 125) {
          buffer[1] = masked | length;
        } else if (length <= 65535) {
          buffer[1] = masked | 126;
          buffer.writeUInt16BE(length, 2);
        } else {
          buffer[1] = masked | 127;
          buffer.writeUInt32BE(Math.floor(length / 4294967296), 2);
          buffer.writeUInt32BE(length % 4294967296, 6);
        }
        frame.payload.copy(buffer, offset);
        if (frame.masked) {
          frame.maskingKey.copy(buffer, header);
          Hybi.mask(buffer, frame.maskingKey, offset);
        }
        this._write(buffer);
      },
      _handshakeResponse: function() {
        var secKey = this._request.headers["sec-websocket-key"], version = this._request.headers["sec-websocket-version"];
        if (version !== Hybi.VERSION)
          throw new Error("Unsupported WebSocket version: " + version);
        if (typeof secKey !== "string")
          throw new Error("Missing handshake request header: Sec-WebSocket-Key");
        this._headers.set("Upgrade", "websocket");
        this._headers.set("Connection", "Upgrade");
        this._headers.set("Sec-WebSocket-Accept", Hybi.generateAccept(secKey));
        if (this.protocol)
          this._headers.set("Sec-WebSocket-Protocol", this.protocol);
        var extensions = this._extensions.generateResponse(this._request.headers["sec-websocket-extensions"]);
        if (extensions)
          this._headers.set("Sec-WebSocket-Extensions", extensions);
        var start = "HTTP/1.1 101 Switching Protocols", headers = [start, this._headers.toString(), ""];
        return Buffer2.from(headers.join("\r\n"), "utf8");
      },
      _shutdown: function(code, reason, error) {
        delete this._frame;
        delete this._message;
        this._stage = 5;
        var sendCloseFrame = this.readyState === 1;
        this.readyState = 2;
        this._extensions.close(function() {
          if (sendCloseFrame)
            this.frame(reason, "close", code);
          this.readyState = 3;
          if (error)
            this.emit("error", new Error(reason));
          this.emit("close", new Base.CloseEvent(code, reason));
        }, this);
      },
      _fail: function(type, message) {
        if (this.readyState > 1)
          return;
        this._shutdown(this.ERRORS[type], message, true);
      },
      _parseOpcode: function(octet) {
        var rsvs = [this.RSV1, this.RSV2, this.RSV3].map(function(rsv) {
          return (octet & rsv) === rsv;
        });
        var frame = this._frame = new Frame();
        frame.final = (octet & this.FIN) === this.FIN;
        frame.rsv1 = rsvs[0];
        frame.rsv2 = rsvs[1];
        frame.rsv3 = rsvs[2];
        frame.opcode = octet & this.OPCODE;
        this._stage = 1;
        if (!this._extensions.validFrameRsv(frame))
          return this._fail("protocol_error", "One or more reserved bits are on: reserved1 = " + (frame.rsv1 ? 1 : 0) + ", reserved2 = " + (frame.rsv2 ? 1 : 0) + ", reserved3 = " + (frame.rsv3 ? 1 : 0));
        if (this.OPCODE_CODES.indexOf(frame.opcode) < 0)
          return this._fail("protocol_error", "Unrecognized frame opcode: " + frame.opcode);
        if (this.MESSAGE_OPCODES.indexOf(frame.opcode) < 0 && !frame.final)
          return this._fail("protocol_error", "Received fragmented control frame: opcode = " + frame.opcode);
        if (this._message && this.OPENING_OPCODES.indexOf(frame.opcode) >= 0)
          return this._fail("protocol_error", "Received new data frame but previous continuous frame is unfinished");
      },
      _parseLength: function(octet) {
        var frame = this._frame;
        frame.masked = (octet & this.MASK) === this.MASK;
        frame.length = octet & this.LENGTH;
        if (frame.length >= 0 && frame.length <= 125) {
          this._stage = frame.masked ? 3 : 4;
          if (!this._checkFrameLength())
            return;
        } else {
          this._stage = 2;
          frame.lengthBytes = frame.length === 126 ? 2 : 8;
        }
        if (this._requireMasking && !frame.masked)
          return this._fail("unacceptable", "Received unmasked frame but masking is required");
      },
      _parseExtendedLength: function(buffer) {
        var frame = this._frame;
        frame.length = this._readUInt(buffer);
        this._stage = frame.masked ? 3 : 4;
        if (this.MESSAGE_OPCODES.indexOf(frame.opcode) < 0 && frame.length > 125)
          return this._fail("protocol_error", "Received control frame having too long payload: " + frame.length);
        if (!this._checkFrameLength())
          return;
      },
      _checkFrameLength: function() {
        var length = this._message ? this._message.length : 0;
        if (length + this._frame.length > this._maxLength) {
          this._fail("too_large", "WebSocket frame length too large");
          return false;
        } else {
          return true;
        }
      },
      _emitFrame: function(buffer) {
        var frame = this._frame, payload = frame.payload = Hybi.mask(buffer, frame.maskingKey), opcode = frame.opcode, message, code, reason, callbacks, callback;
        delete this._frame;
        if (opcode === this.OPCODES.continuation) {
          if (!this._message)
            return this._fail("protocol_error", "Received unexpected continuation frame");
          this._message.pushFrame(frame);
        }
        if (opcode === this.OPCODES.text || opcode === this.OPCODES.binary) {
          this._message = new Message();
          this._message.pushFrame(frame);
        }
        if (frame.final && this.MESSAGE_OPCODES.indexOf(opcode) >= 0)
          return this._emitMessage(this._message);
        if (opcode === this.OPCODES.close) {
          code = payload.length >= 2 ? payload.readUInt16BE(0) : null;
          reason = payload.length > 2 ? this._encode(payload.slice(2)) : null;
          if (!(payload.length === 0) && !(code !== null && code >= this.MIN_RESERVED_ERROR && code <= this.MAX_RESERVED_ERROR) && this.ERROR_CODES.indexOf(code) < 0)
            code = this.ERRORS.protocol_error;
          if (payload.length > 125 || payload.length > 2 && !reason)
            code = this.ERRORS.protocol_error;
          this._shutdown(code || this.DEFAULT_ERROR_CODE, reason || "");
        }
        if (opcode === this.OPCODES.ping) {
          this.frame(payload, "pong");
          this.emit("ping", new Base.PingEvent(payload.toString()));
        }
        if (opcode === this.OPCODES.pong) {
          callbacks = this._pingCallbacks;
          message = this._encode(payload);
          callback = callbacks[message];
          delete callbacks[message];
          if (callback)
            callback();
          this.emit("pong", new Base.PongEvent(payload.toString()));
        }
      },
      _emitMessage: function(message) {
        var message = this._message;
        message.read();
        delete this._message;
        this._extensions.processIncomingMessage(message, function(error, message2) {
          if (error)
            return this._fail("extension_error", error.message);
          var payload = message2.data;
          if (message2.opcode === this.OPCODES.text)
            payload = this._encode(payload);
          if (payload === null)
            return this._fail("encoding_error", "Could not decode a text frame as UTF-8");
          else
            this.emit("message", new Base.MessageEvent(payload));
        }, this);
      },
      _encode: function(buffer) {
        try {
          var string = buffer.toString("binary", 0, buffer.length);
          if (!this.UTF8_MATCH.test(string))
            return null;
        } catch (e) {
        }
        return buffer.toString("utf8", 0, buffer.length);
      },
      _readUInt: function(buffer) {
        if (buffer.length === 2)
          return buffer.readUInt16BE(0);
        return buffer.readUInt32BE(0) * 4294967296 + buffer.readUInt32BE(4);
      }
    };
    for (key in instance)
      Hybi.prototype[key] = instance[key];
    var key;
    module2.exports = Hybi;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/proxy.js
var require_proxy = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/proxy.js"(exports, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var Stream = require("stream").Stream;
    var url = require("url");
    var util2 = require("util");
    var Base = require_base();
    var Headers = require_headers();
    var HttpParser = require_http_parser2();
    var PORTS = { "ws:": 80, "wss:": 443 };
    var Proxy = function(client, origin, options) {
      this._client = client;
      this._http = new HttpParser("response");
      this._origin = typeof client.url === "object" ? client.url : url.parse(client.url);
      this._url = typeof origin === "object" ? origin : url.parse(origin);
      this._options = options || {};
      this._state = 0;
      this.readable = this.writable = true;
      this._paused = false;
      this._headers = new Headers();
      this._headers.set("Host", this._origin.host);
      this._headers.set("Connection", "keep-alive");
      this._headers.set("Proxy-Connection", "keep-alive");
      var auth = this._url.auth && Buffer2.from(this._url.auth, "utf8").toString("base64");
      if (auth)
        this._headers.set("Proxy-Authorization", "Basic " + auth);
    };
    util2.inherits(Proxy, Stream);
    var instance = {
      setHeader: function(name, value) {
        if (this._state !== 0)
          return false;
        this._headers.set(name, value);
        return true;
      },
      start: function() {
        if (this._state !== 0)
          return false;
        this._state = 1;
        var origin = this._origin, port = origin.port || PORTS[origin.protocol], start = "CONNECT " + origin.hostname + ":" + port + " HTTP/1.1";
        var headers = [start, this._headers.toString(), ""];
        this.emit("data", Buffer2.from(headers.join("\r\n"), "utf8"));
        return true;
      },
      pause: function() {
        this._paused = true;
      },
      resume: function() {
        this._paused = false;
        this.emit("drain");
      },
      write: function(chunk) {
        if (!this.writable)
          return false;
        this._http.parse(chunk);
        if (!this._http.isComplete())
          return !this._paused;
        this.statusCode = this._http.statusCode;
        this.headers = this._http.headers;
        if (this.statusCode === 200) {
          this.emit("connect", new Base.ConnectEvent());
        } else {
          var message = "Can't establish a connection to the server at " + this._origin.href;
          this.emit("error", new Error(message));
        }
        this.end();
        return !this._paused;
      },
      end: function(chunk) {
        if (!this.writable)
          return;
        if (chunk !== void 0)
          this.write(chunk);
        this.readable = this.writable = false;
        this.emit("close");
        this.emit("end");
      },
      destroy: function() {
        this.end();
      }
    };
    for (key in instance)
      Proxy.prototype[key] = instance[key];
    var key;
    module2.exports = Proxy;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/client.js
var require_client = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/client.js"(exports, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var crypto = require("crypto");
    var url = require("url");
    var util2 = require("util");
    var HttpParser = require_http_parser2();
    var Base = require_base();
    var Hybi = require_hybi();
    var Proxy = require_proxy();
    var Client2 = function(_url, options) {
      this.version = "hybi-" + Hybi.VERSION;
      Hybi.call(this, null, _url, options);
      this.readyState = -1;
      this._key = Client2.generateKey();
      this._accept = Hybi.generateAccept(this._key);
      this._http = new HttpParser("response");
      var uri = url.parse(this.url), auth = uri.auth && Buffer2.from(uri.auth, "utf8").toString("base64");
      if (this.VALID_PROTOCOLS.indexOf(uri.protocol) < 0)
        throw new Error(this.url + " is not a valid WebSocket URL");
      this._pathname = (uri.pathname || "/") + (uri.search || "");
      this._headers.set("Host", uri.host);
      this._headers.set("Upgrade", "websocket");
      this._headers.set("Connection", "Upgrade");
      this._headers.set("Sec-WebSocket-Key", this._key);
      this._headers.set("Sec-WebSocket-Version", Hybi.VERSION);
      if (this._protocols.length > 0)
        this._headers.set("Sec-WebSocket-Protocol", this._protocols.join(", "));
      if (auth)
        this._headers.set("Authorization", "Basic " + auth);
    };
    util2.inherits(Client2, Hybi);
    Client2.generateKey = function() {
      return crypto.randomBytes(16).toString("base64");
    };
    var instance = {
      VALID_PROTOCOLS: ["ws:", "wss:"],
      proxy: function(origin, options) {
        return new Proxy(this, origin, options);
      },
      start: function() {
        if (this.readyState !== -1)
          return false;
        this._write(this._handshakeRequest());
        this.readyState = 0;
        return true;
      },
      parse: function(chunk) {
        if (this.readyState === 3)
          return;
        if (this.readyState > 0)
          return Hybi.prototype.parse.call(this, chunk);
        this._http.parse(chunk);
        if (!this._http.isComplete())
          return;
        this._validateHandshake();
        if (this.readyState === 3)
          return;
        this._open();
        this.parse(this._http.body);
      },
      _handshakeRequest: function() {
        var extensions = this._extensions.generateOffer();
        if (extensions)
          this._headers.set("Sec-WebSocket-Extensions", extensions);
        var start = "GET " + this._pathname + " HTTP/1.1", headers = [start, this._headers.toString(), ""];
        return Buffer2.from(headers.join("\r\n"), "utf8");
      },
      _failHandshake: function(message) {
        message = "Error during WebSocket handshake: " + message;
        this.readyState = 3;
        this.emit("error", new Error(message));
        this.emit("close", new Base.CloseEvent(this.ERRORS.protocol_error, message));
      },
      _validateHandshake: function() {
        this.statusCode = this._http.statusCode;
        this.headers = this._http.headers;
        if (this._http.error)
          return this._failHandshake(this._http.error.message);
        if (this._http.statusCode !== 101)
          return this._failHandshake("Unexpected response code: " + this._http.statusCode);
        var headers = this._http.headers, upgrade = headers["upgrade"] || "", connection = headers["connection"] || "", accept = headers["sec-websocket-accept"] || "", protocol = headers["sec-websocket-protocol"] || "";
        if (upgrade === "")
          return this._failHandshake("'Upgrade' header is missing");
        if (upgrade.toLowerCase() !== "websocket")
          return this._failHandshake("'Upgrade' header value is not 'WebSocket'");
        if (connection === "")
          return this._failHandshake("'Connection' header is missing");
        if (connection.toLowerCase() !== "upgrade")
          return this._failHandshake("'Connection' header value is not 'Upgrade'");
        if (accept !== this._accept)
          return this._failHandshake("Sec-WebSocket-Accept mismatch");
        this.protocol = null;
        if (protocol !== "") {
          if (this._protocols.indexOf(protocol) < 0)
            return this._failHandshake("Sec-WebSocket-Protocol mismatch");
          else
            this.protocol = protocol;
        }
        try {
          this._extensions.activate(this.headers["sec-websocket-extensions"]);
        } catch (e) {
          return this._failHandshake(e.message);
        }
      }
    };
    for (key in instance)
      Client2.prototype[key] = instance[key];
    var key;
    module2.exports = Client2;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/draft75.js
var require_draft75 = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/draft75.js"(exports, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var Base = require_base();
    var util2 = require("util");
    var Draft75 = function(request, url, options) {
      Base.apply(this, arguments);
      this._stage = 0;
      this.version = "hixie-75";
      this._headers.set("Upgrade", "WebSocket");
      this._headers.set("Connection", "Upgrade");
      this._headers.set("WebSocket-Origin", this._request.headers.origin);
      this._headers.set("WebSocket-Location", this.url);
    };
    util2.inherits(Draft75, Base);
    var instance = {
      close: function() {
        if (this.readyState === 3)
          return false;
        this.readyState = 3;
        this.emit("close", new Base.CloseEvent(null, null));
        return true;
      },
      parse: function(chunk) {
        if (this.readyState > 1)
          return;
        this._reader.put(chunk);
        this._reader.eachByte(function(octet) {
          var message;
          switch (this._stage) {
            case -1:
              this._body.push(octet);
              this._sendHandshakeBody();
              break;
            case 0:
              this._parseLeadingByte(octet);
              break;
            case 1:
              this._length = (octet & 127) + 128 * this._length;
              if (this._closing && this._length === 0) {
                return this.close();
              } else if ((octet & 128) !== 128) {
                if (this._length === 0) {
                  this._stage = 0;
                } else {
                  this._skipped = 0;
                  this._stage = 2;
                }
              }
              break;
            case 2:
              if (octet === 255) {
                this._stage = 0;
                message = Buffer2.from(this._buffer).toString("utf8", 0, this._buffer.length);
                this.emit("message", new Base.MessageEvent(message));
              } else {
                if (this._length) {
                  this._skipped += 1;
                  if (this._skipped === this._length)
                    this._stage = 0;
                } else {
                  this._buffer.push(octet);
                  if (this._buffer.length > this._maxLength)
                    return this.close();
                }
              }
              break;
          }
        }, this);
      },
      frame: function(buffer) {
        if (this.readyState === 0)
          return this._queue([buffer]);
        if (this.readyState > 1)
          return false;
        if (typeof buffer !== "string")
          buffer = buffer.toString();
        var length = Buffer2.byteLength(buffer), frame = Buffer2.allocUnsafe(length + 2);
        frame[0] = 0;
        frame.write(buffer, 1);
        frame[frame.length - 1] = 255;
        this._write(frame);
        return true;
      },
      _handshakeResponse: function() {
        var start = "HTTP/1.1 101 Web Socket Protocol Handshake", headers = [start, this._headers.toString(), ""];
        return Buffer2.from(headers.join("\r\n"), "utf8");
      },
      _parseLeadingByte: function(octet) {
        if ((octet & 128) === 128) {
          this._length = 0;
          this._stage = 1;
        } else {
          delete this._length;
          delete this._skipped;
          this._buffer = [];
          this._stage = 2;
        }
      }
    };
    for (key in instance)
      Draft75.prototype[key] = instance[key];
    var key;
    module2.exports = Draft75;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/draft76.js
var require_draft76 = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/draft76.js"(exports, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var Base = require_base();
    var Draft75 = require_draft75();
    var crypto = require("crypto");
    var util2 = require("util");
    var numberFromKey = function(key2) {
      return parseInt((key2.match(/[0-9]/g) || []).join(""), 10);
    };
    var spacesInKey = function(key2) {
      return (key2.match(/ /g) || []).length;
    };
    var Draft76 = function(request, url, options) {
      Draft75.apply(this, arguments);
      this._stage = -1;
      this._body = [];
      this.version = "hixie-76";
      this._headers.clear();
      this._headers.set("Upgrade", "WebSocket");
      this._headers.set("Connection", "Upgrade");
      this._headers.set("Sec-WebSocket-Origin", this._request.headers.origin);
      this._headers.set("Sec-WebSocket-Location", this.url);
    };
    util2.inherits(Draft76, Draft75);
    var instance = {
      BODY_SIZE: 8,
      start: function() {
        if (!Draft75.prototype.start.call(this))
          return false;
        this._started = true;
        this._sendHandshakeBody();
        return true;
      },
      close: function() {
        if (this.readyState === 3)
          return false;
        if (this.readyState === 1)
          this._write(Buffer2.from([255, 0]));
        this.readyState = 3;
        this.emit("close", new Base.CloseEvent(null, null));
        return true;
      },
      _handshakeResponse: function() {
        var headers = this._request.headers, key1 = headers["sec-websocket-key1"], key2 = headers["sec-websocket-key2"];
        if (!key1)
          throw new Error("Missing required header: Sec-WebSocket-Key1");
        if (!key2)
          throw new Error("Missing required header: Sec-WebSocket-Key2");
        var number1 = numberFromKey(key1), spaces1 = spacesInKey(key1), number2 = numberFromKey(key2), spaces2 = spacesInKey(key2);
        if (number1 % spaces1 !== 0 || number2 % spaces2 !== 0)
          throw new Error("Client sent invalid Sec-WebSocket-Key headers");
        this._keyValues = [number1 / spaces1, number2 / spaces2];
        var start = "HTTP/1.1 101 WebSocket Protocol Handshake", headers = [start, this._headers.toString(), ""];
        return Buffer2.from(headers.join("\r\n"), "binary");
      },
      _handshakeSignature: function() {
        if (this._body.length < this.BODY_SIZE)
          return null;
        var md5 = crypto.createHash("md5"), buffer = Buffer2.allocUnsafe(8 + this.BODY_SIZE);
        buffer.writeUInt32BE(this._keyValues[0], 0);
        buffer.writeUInt32BE(this._keyValues[1], 4);
        Buffer2.from(this._body).copy(buffer, 8, 0, this.BODY_SIZE);
        md5.update(buffer);
        return Buffer2.from(md5.digest("binary"), "binary");
      },
      _sendHandshakeBody: function() {
        if (!this._started)
          return;
        var signature = this._handshakeSignature();
        if (!signature)
          return;
        this._write(signature);
        this._stage = 0;
        this._open();
        if (this._body.length > this.BODY_SIZE)
          this.parse(this._body.slice(this.BODY_SIZE));
      },
      _parseLeadingByte: function(octet) {
        if (octet !== 255)
          return Draft75.prototype._parseLeadingByte.call(this, octet);
        this._closing = true;
        this._length = 0;
        this._stage = 1;
      }
    };
    for (key in instance)
      Draft76.prototype[key] = instance[key];
    var key;
    module2.exports = Draft76;
  }
});

// node_modules/websocket-driver/lib/websocket/driver/server.js
var require_server = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver/server.js"(exports, module2) {
    "use strict";
    var util2 = require("util");
    var HttpParser = require_http_parser2();
    var Base = require_base();
    var Draft75 = require_draft75();
    var Draft76 = require_draft76();
    var Hybi = require_hybi();
    var Server = function(options) {
      Base.call(this, null, null, options);
      this._http = new HttpParser("request");
    };
    util2.inherits(Server, Base);
    var instance = {
      EVENTS: ["open", "message", "error", "close", "ping", "pong"],
      _bindEventListeners: function() {
        this.messages.on("error", function() {
        });
        this.on("error", function() {
        });
      },
      parse: function(chunk) {
        if (this._delegate)
          return this._delegate.parse(chunk);
        this._http.parse(chunk);
        if (!this._http.isComplete())
          return;
        this.method = this._http.method;
        this.url = this._http.url;
        this.headers = this._http.headers;
        this.body = this._http.body;
        var self2 = this;
        this._delegate = Server.http(this, this._options);
        this._delegate.messages = this.messages;
        this._delegate.io = this.io;
        this._open();
        this.EVENTS.forEach(function(event) {
          this._delegate.on(event, function(e) {
            self2.emit(event, e);
          });
        }, this);
        this.protocol = this._delegate.protocol;
        this.version = this._delegate.version;
        this.parse(this._http.body);
        this.emit("connect", new Base.ConnectEvent());
      },
      _open: function() {
        this.__queue.forEach(function(msg) {
          this._delegate[msg[0]].apply(this._delegate, msg[1]);
        }, this);
        this.__queue = [];
      }
    };
    ["addExtension", "setHeader", "start", "frame", "text", "binary", "ping", "close"].forEach(function(method) {
      instance[method] = function() {
        if (this._delegate) {
          return this._delegate[method].apply(this._delegate, arguments);
        } else {
          this.__queue.push([method, arguments]);
          return true;
        }
      };
    });
    for (key in instance)
      Server.prototype[key] = instance[key];
    var key;
    Server.isSecureRequest = function(request) {
      if (request.connection && request.connection.authorized !== void 0)
        return true;
      if (request.socket && request.socket.secure)
        return true;
      var headers = request.headers;
      if (!headers)
        return false;
      if (headers["https"] === "on")
        return true;
      if (headers["x-forwarded-ssl"] === "on")
        return true;
      if (headers["x-forwarded-scheme"] === "https")
        return true;
      if (headers["x-forwarded-proto"] === "https")
        return true;
      return false;
    };
    Server.determineUrl = function(request) {
      var scheme = this.isSecureRequest(request) ? "wss:" : "ws:";
      return scheme + "//" + request.headers.host + request.url;
    };
    Server.http = function(request, options) {
      options = options || {};
      if (options.requireMasking === void 0)
        options.requireMasking = true;
      var headers = request.headers, version = headers["sec-websocket-version"], key2 = headers["sec-websocket-key"], key1 = headers["sec-websocket-key1"], key22 = headers["sec-websocket-key2"], url = this.determineUrl(request);
      if (version || key2)
        return new Hybi(request, url, options);
      else if (key1 || key22)
        return new Draft76(request, url, options);
      else
        return new Draft75(request, url, options);
    };
    module2.exports = Server;
  }
});

// node_modules/websocket-driver/lib/websocket/driver.js
var require_driver = __commonJS({
  "node_modules/websocket-driver/lib/websocket/driver.js"(exports, module2) {
    "use strict";
    var Base = require_base();
    var Client2 = require_client();
    var Server = require_server();
    var Driver = {
      client: function(url, options) {
        options = options || {};
        if (options.masking === void 0)
          options.masking = true;
        return new Client2(url, options);
      },
      server: function(options) {
        options = options || {};
        if (options.requireMasking === void 0)
          options.requireMasking = true;
        return new Server(options);
      },
      http: function() {
        return Server.http.apply(Server, arguments);
      },
      isSecureRequest: function(request) {
        return Server.isSecureRequest(request);
      },
      isWebSocket: function(request) {
        return Base.isWebSocket(request);
      },
      validateOptions: function(options, validKeys) {
        Base.validateOptions(options, validKeys);
      }
    };
    module2.exports = Driver;
  }
});

// node_modules/faye-websocket/lib/faye/websocket/api/event.js
var require_event = __commonJS({
  "node_modules/faye-websocket/lib/faye/websocket/api/event.js"(exports, module2) {
    "use strict";
    var Event = function(eventType, options) {
      this.type = eventType;
      for (var key in options)
        this[key] = options[key];
    };
    Event.prototype.initEvent = function(eventType, canBubble, cancelable) {
      this.type = eventType;
      this.bubbles = canBubble;
      this.cancelable = cancelable;
    };
    Event.prototype.stopPropagation = function() {
    };
    Event.prototype.preventDefault = function() {
    };
    Event.CAPTURING_PHASE = 1;
    Event.AT_TARGET = 2;
    Event.BUBBLING_PHASE = 3;
    module2.exports = Event;
  }
});

// node_modules/faye-websocket/lib/faye/websocket/api/event_target.js
var require_event_target = __commonJS({
  "node_modules/faye-websocket/lib/faye/websocket/api/event_target.js"(exports, module2) {
    "use strict";
    var Event = require_event();
    var EventTarget = {
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
      addEventListener: function(eventType, listener, useCapture) {
        this.on(eventType, listener);
      },
      removeEventListener: function(eventType, listener, useCapture) {
        this.removeListener(eventType, listener);
      },
      dispatchEvent: function(event) {
        event.target = event.currentTarget = this;
        event.eventPhase = Event.AT_TARGET;
        if (this["on" + event.type])
          this["on" + event.type](event);
        this.emit(event.type, event);
      }
    };
    module2.exports = EventTarget;
  }
});

// node_modules/faye-websocket/lib/faye/websocket/api.js
var require_api = __commonJS({
  "node_modules/faye-websocket/lib/faye/websocket/api.js"(exports, module2) {
    "use strict";
    var Stream = require("stream").Stream;
    var util2 = require("util");
    var driver = require_driver();
    var EventTarget = require_event_target();
    var Event = require_event();
    var API = function(options) {
      options = options || {};
      driver.validateOptions(options, ["headers", "extensions", "maxLength", "ping", "proxy", "tls", "ca"]);
      this.readable = this.writable = true;
      var headers = options.headers;
      if (headers) {
        for (var name in headers)
          this._driver.setHeader(name, headers[name]);
      }
      var extensions = options.extensions;
      if (extensions) {
        [].concat(extensions).forEach(this._driver.addExtension, this._driver);
      }
      this._ping = options.ping;
      this._pingId = 0;
      this.readyState = API.CONNECTING;
      this.bufferedAmount = 0;
      this.protocol = "";
      this.url = this._driver.url;
      this.version = this._driver.version;
      var self2 = this;
      this._driver.on("open", function(e) {
        self2._open();
      });
      this._driver.on("message", function(e) {
        self2._receiveMessage(e.data);
      });
      this._driver.on("close", function(e) {
        self2._beginClose(e.reason, e.code);
      });
      this._driver.on("error", function(error) {
        self2._emitError(error.message);
      });
      this.on("error", function() {
      });
      this._driver.messages.on("drain", function() {
        self2.emit("drain");
      });
      if (this._ping)
        this._pingTimer = setInterval(function() {
          self2._pingId += 1;
          self2.ping(self2._pingId.toString());
        }, this._ping * 1e3);
      this._configureStream();
      if (!this._proxy) {
        this._stream.pipe(this._driver.io);
        this._driver.io.pipe(this._stream);
      }
    };
    util2.inherits(API, Stream);
    API.CONNECTING = 0;
    API.OPEN = 1;
    API.CLOSING = 2;
    API.CLOSED = 3;
    API.CLOSE_TIMEOUT = 3e4;
    var instance = {
      write: function(data) {
        return this.send(data);
      },
      end: function(data) {
        if (data !== void 0)
          this.send(data);
        this.close();
      },
      pause: function() {
        return this._driver.messages.pause();
      },
      resume: function() {
        return this._driver.messages.resume();
      },
      send: function(data) {
        if (this.readyState > API.OPEN)
          return false;
        if (!(data instanceof Buffer))
          data = String(data);
        return this._driver.messages.write(data);
      },
      ping: function(message, callback) {
        if (this.readyState > API.OPEN)
          return false;
        return this._driver.ping(message, callback);
      },
      close: function(code, reason) {
        if (code === void 0)
          code = 1e3;
        if (reason === void 0)
          reason = "";
        if (code !== 1e3 && (code < 3e3 || code > 4999))
          throw new Error("Failed to execute 'close' on WebSocket: The code must be either 1000, or between 3000 and 4999. " + code + " is neither.");
        if (this.readyState !== API.CLOSED)
          this.readyState = API.CLOSING;
        var self2 = this;
        this._closeTimer = setTimeout(function() {
          self2._beginClose("", 1006);
        }, API.CLOSE_TIMEOUT);
        this._driver.close(reason, code);
      },
      _configureStream: function() {
        var self2 = this;
        this._stream.setTimeout(0);
        this._stream.setNoDelay(true);
        ["close", "end"].forEach(function(event) {
          this._stream.on(event, function() {
            self2._finalizeClose();
          });
        }, this);
        this._stream.on("error", function(error) {
          self2._emitError("Network error: " + self2.url + ": " + error.message);
          self2._finalizeClose();
        });
      },
      _open: function() {
        if (this.readyState !== API.CONNECTING)
          return;
        this.readyState = API.OPEN;
        this.protocol = this._driver.protocol || "";
        var event = new Event("open");
        event.initEvent("open", false, false);
        this.dispatchEvent(event);
      },
      _receiveMessage: function(data) {
        if (this.readyState > API.OPEN)
          return false;
        if (this.readable)
          this.emit("data", data);
        var event = new Event("message", { data });
        event.initEvent("message", false, false);
        this.dispatchEvent(event);
      },
      _emitError: function(message) {
        if (this.readyState >= API.CLOSING)
          return;
        var event = new Event("error", { message });
        event.initEvent("error", false, false);
        this.dispatchEvent(event);
      },
      _beginClose: function(reason, code) {
        if (this.readyState === API.CLOSED)
          return;
        this.readyState = API.CLOSING;
        this._closeParams = [reason, code];
        if (this._stream) {
          this._stream.destroy();
          if (!this._stream.readable)
            this._finalizeClose();
        }
      },
      _finalizeClose: function() {
        if (this.readyState === API.CLOSED)
          return;
        this.readyState = API.CLOSED;
        if (this._closeTimer)
          clearTimeout(this._closeTimer);
        if (this._pingTimer)
          clearInterval(this._pingTimer);
        if (this._stream)
          this._stream.end();
        if (this.readable)
          this.emit("end");
        this.readable = this.writable = false;
        var reason = this._closeParams ? this._closeParams[0] : "", code = this._closeParams ? this._closeParams[1] : 1006;
        var event = new Event("close", { code, reason });
        event.initEvent("close", false, false);
        this.dispatchEvent(event);
      }
    };
    for (method in instance)
      API.prototype[method] = instance[method];
    var method;
    for (key in EventTarget)
      API.prototype[key] = EventTarget[key];
    var key;
    module2.exports = API;
  }
});

// node_modules/faye-websocket/lib/faye/websocket/client.js
var require_client2 = __commonJS({
  "node_modules/faye-websocket/lib/faye/websocket/client.js"(exports, module2) {
    "use strict";
    var util2 = require("util");
    var net = require("net");
    var tls = require("tls");
    var url = require("url");
    var driver = require_driver();
    var API = require_api();
    var Event = require_event();
    var DEFAULT_PORTS = { "http:": 80, "https:": 443, "ws:": 80, "wss:": 443 };
    var SECURE_PROTOCOLS = ["https:", "wss:"];
    var Client2 = function(_url, protocols, options) {
      options = options || {};
      this.url = _url;
      this._driver = driver.client(this.url, { maxLength: options.maxLength, protocols });
      ["open", "error"].forEach(function(event) {
        this._driver.on(event, function() {
          self2.headers = self2._driver.headers;
          self2.statusCode = self2._driver.statusCode;
        });
      }, this);
      var proxy = options.proxy || {}, endpoint = url.parse(proxy.origin || this.url), port = endpoint.port || DEFAULT_PORTS[endpoint.protocol], secure = SECURE_PROTOCOLS.indexOf(endpoint.protocol) >= 0, onConnect = function() {
        self2._onConnect();
      }, netOptions = options.net || {}, originTLS = options.tls || {}, socketTLS = proxy.origin ? proxy.tls || {} : originTLS, self2 = this;
      netOptions.host = socketTLS.host = endpoint.hostname;
      netOptions.port = socketTLS.port = port;
      originTLS.ca = originTLS.ca || options.ca;
      socketTLS.servername = socketTLS.servername || endpoint.hostname;
      this._stream = secure ? tls.connect(socketTLS, onConnect) : net.connect(netOptions, onConnect);
      if (proxy.origin)
        this._configureProxy(proxy, originTLS);
      API.call(this, options);
    };
    util2.inherits(Client2, API);
    Client2.prototype._onConnect = function() {
      var worker = this._proxy || this._driver;
      worker.start();
    };
    Client2.prototype._configureProxy = function(proxy, originTLS) {
      var uri = url.parse(this.url), secure = SECURE_PROTOCOLS.indexOf(uri.protocol) >= 0, self2 = this, name;
      this._proxy = this._driver.proxy(proxy.origin);
      if (proxy.headers) {
        for (name in proxy.headers)
          this._proxy.setHeader(name, proxy.headers[name]);
      }
      this._proxy.pipe(this._stream, { end: false });
      this._stream.pipe(this._proxy);
      this._proxy.on("connect", function() {
        if (secure) {
          var options = { socket: self2._stream, servername: uri.hostname };
          for (name in originTLS)
            options[name] = originTLS[name];
          self2._stream = tls.connect(options);
          self2._configureStream();
        }
        self2._driver.io.pipe(self2._stream);
        self2._stream.pipe(self2._driver.io);
        self2._driver.start();
      });
      this._proxy.on("error", function(error) {
        self2._driver.emit("error", error);
      });
    };
    module2.exports = Client2;
  }
});

// node_modules/faye-websocket/lib/faye/eventsource.js
var require_eventsource = __commonJS({
  "node_modules/faye-websocket/lib/faye/eventsource.js"(exports, module2) {
    "use strict";
    var Stream = require("stream").Stream;
    var util2 = require("util");
    var driver = require_driver();
    var Headers = require_headers();
    var API = require_api();
    var EventTarget = require_event_target();
    var Event = require_event();
    var EventSource = function(request, response, options) {
      this.writable = true;
      options = options || {};
      this._stream = response.socket;
      this._ping = options.ping || this.DEFAULT_PING;
      this._retry = options.retry || this.DEFAULT_RETRY;
      var scheme = driver.isSecureRequest(request) ? "https:" : "http:";
      this.url = scheme + "//" + request.headers.host + request.url;
      this.lastEventId = request.headers["last-event-id"] || "";
      this.readyState = API.CONNECTING;
      var headers = new Headers(), self2 = this;
      if (options.headers) {
        for (var key2 in options.headers)
          headers.set(key2, options.headers[key2]);
      }
      if (!this._stream || !this._stream.writable)
        return;
      process.nextTick(function() {
        self2._open();
      });
      this._stream.setTimeout(0);
      this._stream.setNoDelay(true);
      var handshake = "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nCache-Control: no-cache, no-store\r\nConnection: close\r\n" + headers.toString() + "\r\nretry: " + Math.floor(this._retry * 1e3) + "\r\n\r\n";
      this._write(handshake);
      this._stream.on("drain", function() {
        self2.emit("drain");
      });
      if (this._ping)
        this._pingTimer = setInterval(function() {
          self2.ping();
        }, this._ping * 1e3);
      ["error", "end"].forEach(function(event) {
        self2._stream.on(event, function() {
          self2.close();
        });
      });
    };
    util2.inherits(EventSource, Stream);
    EventSource.isEventSource = function(request) {
      if (request.method !== "GET")
        return false;
      var accept = (request.headers.accept || "").split(/\s*,\s*/);
      return accept.indexOf("text/event-stream") >= 0;
    };
    var instance = {
      DEFAULT_PING: 10,
      DEFAULT_RETRY: 5,
      _write: function(chunk) {
        if (!this.writable)
          return false;
        try {
          return this._stream.write(chunk, "utf8");
        } catch (e) {
          return false;
        }
      },
      _open: function() {
        if (this.readyState !== API.CONNECTING)
          return;
        this.readyState = API.OPEN;
        var event = new Event("open");
        event.initEvent("open", false, false);
        this.dispatchEvent(event);
      },
      write: function(message) {
        return this.send(message);
      },
      end: function(message) {
        if (message !== void 0)
          this.write(message);
        this.close();
      },
      send: function(message, options) {
        if (this.readyState > API.OPEN)
          return false;
        message = String(message).replace(/(\r\n|\r|\n)/g, "$1data: ");
        options = options || {};
        var frame = "";
        if (options.event)
          frame += "event: " + options.event + "\r\n";
        if (options.id)
          frame += "id: " + options.id + "\r\n";
        frame += "data: " + message + "\r\n\r\n";
        return this._write(frame);
      },
      ping: function() {
        return this._write(":\r\n\r\n");
      },
      close: function() {
        if (this.readyState > API.OPEN)
          return false;
        this.readyState = API.CLOSED;
        this.writable = false;
        if (this._pingTimer)
          clearInterval(this._pingTimer);
        if (this._stream)
          this._stream.end();
        var event = new Event("close");
        event.initEvent("close", false, false);
        this.dispatchEvent(event);
        return true;
      }
    };
    for (method in instance)
      EventSource.prototype[method] = instance[method];
    var method;
    for (key in EventTarget)
      EventSource.prototype[key] = EventTarget[key];
    var key;
    module2.exports = EventSource;
  }
});

// node_modules/faye-websocket/lib/faye/websocket.js
var require_websocket = __commonJS({
  "node_modules/faye-websocket/lib/faye/websocket.js"(exports, module2) {
    "use strict";
    var util2 = require("util");
    var driver = require_driver();
    var API = require_api();
    var WebSocket = function(request, socket, body, protocols, options) {
      options = options || {};
      this._stream = socket;
      this._driver = driver.http(request, { maxLength: options.maxLength, protocols });
      var self2 = this;
      if (!this._stream || !this._stream.writable)
        return;
      if (!this._stream.readable)
        return this._stream.end();
      var catchup = function() {
        self2._stream.removeListener("data", catchup);
      };
      this._stream.on("data", catchup);
      API.call(this, options);
      process.nextTick(function() {
        self2._driver.start();
        self2._driver.io.write(body);
      });
    };
    util2.inherits(WebSocket, API);
    WebSocket.isWebSocket = function(request) {
      return driver.isWebSocket(request);
    };
    WebSocket.validateOptions = function(options, validKeys) {
      driver.validateOptions(options, validKeys);
    };
    WebSocket.WebSocket = WebSocket;
    WebSocket.Client = require_client2();
    WebSocket.EventSource = require_eventsource();
    module2.exports = WebSocket;
  }
});

// node_modules/json-rpc2/src/error.js
var require_error = __commonJS({
  "node_modules/json-rpc2/src/error.js"(exports, module2) {
    module2.exports = function(classes) {
      "use strict";
      var Errors = {};
      Errors.AbstractError = classes.ES5Class.$define("AbstractError", {
        construct: function(message, extra) {
          this.name = this.$className;
          this.extra = extra || {};
          this.message = message || this.$className;
          Error.captureStackTrace(this, this.$class);
        },
        toString: function() {
          return this.message;
        }
      }).$inherit(Error, []);
      Errors.ParseError = Errors.AbstractError.$define("ParseError", {
        code: -32700
      });
      Errors.InvalidRequest = Errors.AbstractError.$define("InvalidRequest", {
        code: -32600
      });
      Errors.MethodNotFound = Errors.AbstractError.$define("MethodNotFound", {
        code: -32601
      });
      Errors.InvalidParams = Errors.AbstractError.$define("InvalidParams", {
        code: -32602
      });
      Errors.InternalError = Errors.AbstractError.$define("InternalError", {
        code: -32603
      });
      Errors.ServerError = Errors.AbstractError.$define("ServerError", {
        code: -32e3
      });
      return Errors;
    };
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common2 = __commonJS({
  "node_modules/debug/src/common.js"(exports, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self2 = debug;
          const curr = Number(new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter2) {
        const newDebug = createDebug(this.namespace + (typeof delimiter2 === "undefined" ? ":" : delimiter2) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module2) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common2()(exports);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports, module2) {
    "use strict";
    var os3 = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os3.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports, module2) {
    var tty = require("tty");
    var util2 = require("util");
    exports.init = init;
    exports.log = log2;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util2.deprecate(() => {
    }, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} [0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return new Date().toISOString() + " ";
    }
    function log2(...args) {
      return process.stderr.write(util2.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common2()(exports);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/json-rpc2/src/event-emitter.js
var require_event_emitter = __commonJS({
  "node_modules/json-rpc2/src/event-emitter.js"(exports, module2) {
    module2.exports = function(classes) {
      "use strict";
      var debug = require_src()("jsonrpc");
      var EventEmitter2 = classes.ES5Class.$define("EventEmitter", {}, {
        trace: function(direction, message) {
          var msg = "   " + direction + "   " + message;
          debug(msg);
          return msg;
        },
        hasId: function(request) {
          return request && typeof request["id"] !== "undefined" && (typeof request["id"] === "number" && /^\-?\d+$/.test(request["id"]) || typeof request["id"] === "string" || request["id"] === null);
        }
      }).$inherit(require("events").EventEmitter, []);
      return EventEmitter2;
    };
  }
});

// node_modules/json-rpc2/src/endpoint.js
var require_endpoint = __commonJS({
  "node_modules/json-rpc2/src/endpoint.js"(exports, module2) {
    module2.exports = function(classes) {
      "use strict";
      var _ = classes._, EventEmitter2 = classes.EventEmitter, Error2 = classes.Error, Endpoint = EventEmitter2.$define("Endpoint", {
        construct: function($super) {
          $super();
          this.functions = {};
          this.scopes = {};
          this.defaultScope = this;
          this.exposeModule = this.expose;
          this.on("error", () => {
          });
        },
        expose: function(name, func, scope) {
          if (_.isFunction(func)) {
            EventEmitter2.trace("***", "exposing: " + name);
            this.functions[name] = func;
            if (scope) {
              this.scopes[name] = scope;
            }
          } else {
            var funcs = [];
            for (var funcName in func) {
              if (Object.prototype.hasOwnProperty.call(func, funcName)) {
                var funcObj = func[funcName];
                if (_.isFunction(funcObj)) {
                  this.functions[name + "." + funcName] = funcObj;
                  funcs.push(funcName);
                  if (scope) {
                    this.scopes[name + "." + funcName] = scope;
                  }
                }
              }
            }
            EventEmitter2.trace("***", "exposing module: " + name + " [funs: " + funcs.join(", ") + "]");
          }
          return func;
        },
        handleCall: function(decoded, conn, callback) {
          EventEmitter2.trace("<--", "Request (id " + decoded.id + "): " + decoded.method + "(" + JSON.stringify(decoded.params) + ")");
          if (!this.functions.hasOwnProperty(decoded.method)) {
            callback(new Error2.MethodNotFound('Unknown RPC call "' + decoded.method + '"'));
            return;
          }
          var method = this.functions[decoded.method];
          var scope = this.scopes[decoded.method] || this.defaultScope;
          try {
            method.call(scope, decoded.params, conn, callback);
          } catch (err) {
            callback(err);
          }
        }
      });
      return Endpoint;
    };
  }
});

// node_modules/json-rpc2/src/connection.js
var require_connection = __commonJS({
  "node_modules/json-rpc2/src/connection.js"(exports, module2) {
    module2.exports = function(classes) {
      "use strict";
      var _ = classes._, EventEmitter2 = classes.EventEmitter, Connection = EventEmitter2.$define("Connection", {
        construct: function($super, ep) {
          $super();
          this.endpoint = ep;
          this.callbacks = {};
          this.latestId = 0;
          this.on("error", () => {
          });
        },
        call: function(method, params, callback) {
          if (!_.isArray(params)) {
            params = [params];
          }
          var id = null;
          if (_.isFunction(callback)) {
            id = ++this.latestId;
            this.callbacks[id] = callback;
          }
          EventEmitter2.trace("-->", "Connection call (method " + method + "): " + JSON.stringify(params));
          var data = JSON.stringify({
            jsonrpc: "2.0",
            method,
            params,
            id
          });
          this.write(data);
        },
        write: function() {
          throw new Error("Tried to write data on unsupported connection type.");
        },
        stream: function(onend) {
          if (_.isFunction(onend)) {
            this.on("end", function() {
              onend();
            });
          }
        },
        handleMessage: function(msg) {
          var self2 = this;
          if (msg) {
            if ((msg.hasOwnProperty("result") || msg.hasOwnProperty("error")) && msg.hasOwnProperty("id")) {
              try {
                this.callbacks[msg.id](msg.error, msg.result);
                delete this.callbacks[msg.id];
              } catch (err) {
                EventEmitter2.trace("<---", "Callback not found " + msg.id + ": " + (err.stack ? err.stack : err.toString()));
              }
            } else if (msg.hasOwnProperty("method")) {
              this.endpoint.handleCall(msg, this, function handleCall(err, result) {
                if (err) {
                  self2.emit("error", err);
                  EventEmitter2.trace("-->", "Failure " + (EventEmitter2.hasId(msg) ? "(id " + msg.id + ")" : "") + ": " + (err.stack ? err.stack : err.toString()));
                }
                if (!EventEmitter2.hasId(msg)) {
                  return;
                }
                if (err) {
                  err = err.toString();
                  result = null;
                } else {
                  EventEmitter2.trace("-->", "Response (id " + msg.id + "): " + JSON.stringify(result));
                  err = null;
                }
                self2.sendReply(err, result, msg.id);
              });
            }
          }
        },
        sendReply: function(err, result, id) {
          var data = JSON.stringify({
            jsonrpc: "2.0",
            result,
            error: err,
            id
          });
          this.write(data);
        }
      });
      return Connection;
    };
  }
});

// node_modules/json-rpc2/src/http-server-connection.js
var require_http_server_connection = __commonJS({
  "node_modules/json-rpc2/src/http-server-connection.js"(exports, module2) {
    module2.exports = function(classes) {
      "use strict";
      var Connection = classes.Connection, HttpServerConnection = Connection.$define("HttpServerConnection", {
        construct: function($super, server, req, res) {
          var self2 = this;
          $super(server);
          this.req = req;
          this.res = res;
          this.isStreaming = false;
          this.res.on("finish", function responseEnd() {
            self2.emit("end");
          });
          this.res.on("close", function responseEnd() {
            self2.emit("end");
          });
        },
        stream: function($super, onend) {
          $super(onend);
          this.isStreaming = true;
        },
        write: function(data) {
          if (!this.isStreaming) {
            throw new Error("Cannot send extra messages via non - streaming HTTP");
          }
          if (!this.res.connection.writable) {
            return;
          }
          this.res.write(data);
        }
      });
      return HttpServerConnection;
    };
  }
});

// node_modules/json-rpc2/src/socket-connection.js
var require_socket_connection = __commonJS({
  "node_modules/json-rpc2/src/socket-connection.js"(exports, module2) {
    module2.exports = function(classes) {
      "use strict";
      var Connection = classes.Connection, SocketConnection = Connection.$define("SocketConnection", {
        construct: function($super, endpoint, conn) {
          var self2 = this;
          $super(endpoint);
          self2.conn = conn;
          self2.autoReconnect = true;
          self2.ended = true;
          self2.conn.on("connect", function socketConnect() {
            self2.emit("connect");
          });
          self2.conn.on("end", function socketEnd() {
            self2.emit("end");
          });
          self2.conn.on("error", function socketError(event) {
            self2.emit("error", event);
          });
          self2.conn.on("close", function socketClose(hadError) {
            self2.emit("close", hadError);
            if (self2.endpoint.$className === "Client" && self2.autoReconnect && !self2.ended) {
              if (hadError) {
                setTimeout(function reconnectTimeout() {
                  self2.reconnect();
                }, 200);
              } else {
                self2.reconnect();
              }
            }
          });
        },
        write: function(data) {
          if (!this.conn.writable) {
            return;
          }
          this.conn.write(data);
        },
        end: function() {
          this.ended = true;
          this.conn.end();
        },
        reconnect: function() {
          this.ended = false;
          if (this.endpoint.$className === "Client") {
            this.conn.connect(this.endpoint.port, this.endpoint.host);
          } else {
            throw new Error("Cannot reconnect a connection from the server-side.");
          }
        }
      });
      return SocketConnection;
    };
  }
});

// node_modules/json-rpc2/src/websocket-connection.js
var require_websocket_connection = __commonJS({
  "node_modules/json-rpc2/src/websocket-connection.js"(exports, module2) {
    module2.exports = function(classes) {
      "use strict";
      var Connection = classes.Connection, WebSocketConnection = Connection.$define("WebSocketConnection", {
        construct: function($super, endpoint, conn) {
          var self2 = this;
          $super(endpoint);
          self2.conn = conn;
          self2.ended = false;
          self2.conn.on("close", function websocketClose(hadError) {
            self2.emit("close", hadError);
          });
        },
        write: function(data) {
          if (!this.conn.writable) {
            return;
          }
          this.conn.write(data);
        },
        end: function() {
          this.conn.close();
          this.ended = true;
        }
      });
      return WebSocketConnection;
    };
  }
});

// node_modules/object-assign/index.js
var require_object_assign = __commonJS({
  "node_modules/object-assign/index.js"(exports, module2) {
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError("Object.assign cannot be called with null or undefined");
      }
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2["_" + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
          return test2[n];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    module2.exports = shouldUseNative() ? Object.assign : function(target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }
      return to;
    };
  }
});

// node_modules/jsonparse/jsonparse.js
var require_jsonparse = __commonJS({
  "node_modules/jsonparse/jsonparse.js"(exports, module2) {
    var C = {};
    var LEFT_BRACE = C.LEFT_BRACE = 1;
    var RIGHT_BRACE = C.RIGHT_BRACE = 2;
    var LEFT_BRACKET = C.LEFT_BRACKET = 3;
    var RIGHT_BRACKET = C.RIGHT_BRACKET = 4;
    var COLON = C.COLON = 5;
    var COMMA = C.COMMA = 6;
    var TRUE = C.TRUE = 7;
    var FALSE = C.FALSE = 8;
    var NULL = C.NULL = 9;
    var STRING = C.STRING = 10;
    var NUMBER = C.NUMBER = 11;
    var START = C.START = 17;
    var STOP = C.STOP = 18;
    var TRUE1 = C.TRUE1 = 33;
    var TRUE2 = C.TRUE2 = 34;
    var TRUE3 = C.TRUE3 = 35;
    var FALSE1 = C.FALSE1 = 49;
    var FALSE2 = C.FALSE2 = 50;
    var FALSE3 = C.FALSE3 = 51;
    var FALSE4 = C.FALSE4 = 52;
    var NULL1 = C.NULL1 = 65;
    var NULL2 = C.NULL2 = 66;
    var NULL3 = C.NULL3 = 67;
    var NUMBER1 = C.NUMBER1 = 81;
    var NUMBER3 = C.NUMBER3 = 83;
    var STRING1 = C.STRING1 = 97;
    var STRING2 = C.STRING2 = 98;
    var STRING3 = C.STRING3 = 99;
    var STRING4 = C.STRING4 = 100;
    var STRING5 = C.STRING5 = 101;
    var STRING6 = C.STRING6 = 102;
    var VALUE = C.VALUE = 113;
    var KEY = C.KEY = 114;
    var OBJECT = C.OBJECT = 129;
    var ARRAY = C.ARRAY = 130;
    var BACK_SLASH = "\\".charCodeAt(0);
    var FORWARD_SLASH = "/".charCodeAt(0);
    var BACKSPACE = "\b".charCodeAt(0);
    var FORM_FEED = "\f".charCodeAt(0);
    var NEWLINE = "\n".charCodeAt(0);
    var CARRIAGE_RETURN = "\r".charCodeAt(0);
    var TAB = "	".charCodeAt(0);
    var STRING_BUFFER_SIZE = 64 * 1024;
    function Parser() {
      this.tState = START;
      this.value = void 0;
      this.string = void 0;
      this.stringBuffer = Buffer.alloc ? Buffer.alloc(STRING_BUFFER_SIZE) : new Buffer(STRING_BUFFER_SIZE);
      this.stringBufferOffset = 0;
      this.unicode = void 0;
      this.highSurrogate = void 0;
      this.key = void 0;
      this.mode = void 0;
      this.stack = [];
      this.state = VALUE;
      this.bytes_remaining = 0;
      this.bytes_in_sequence = 0;
      this.temp_buffs = { "2": new Buffer(2), "3": new Buffer(3), "4": new Buffer(4) };
      this.offset = -1;
    }
    Parser.toknam = function(code) {
      var keys = Object.keys(C);
      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        if (C[key] === code) {
          return key;
        }
      }
      return code && "0x" + code.toString(16);
    };
    var proto = Parser.prototype;
    proto.onError = function(err) {
      throw err;
    };
    proto.charError = function(buffer, i) {
      this.tState = STOP;
      this.onError(new Error("Unexpected " + JSON.stringify(String.fromCharCode(buffer[i])) + " at position " + i + " in state " + Parser.toknam(this.tState)));
    };
    proto.appendStringChar = function(char) {
      if (this.stringBufferOffset >= STRING_BUFFER_SIZE) {
        this.string += this.stringBuffer.toString("utf8");
        this.stringBufferOffset = 0;
      }
      this.stringBuffer[this.stringBufferOffset++] = char;
    };
    proto.appendStringBuf = function(buf, start, end) {
      var size = buf.length;
      if (typeof start === "number") {
        if (typeof end === "number") {
          if (end < 0) {
            size = buf.length - start + end;
          } else {
            size = end - start;
          }
        } else {
          size = buf.length - start;
        }
      }
      if (size < 0) {
        size = 0;
      }
      if (this.stringBufferOffset + size > STRING_BUFFER_SIZE) {
        this.string += this.stringBuffer.toString("utf8", 0, this.stringBufferOffset);
        this.stringBufferOffset = 0;
      }
      buf.copy(this.stringBuffer, this.stringBufferOffset, start, end);
      this.stringBufferOffset += size;
    };
    proto.write = function(buffer) {
      if (typeof buffer === "string")
        buffer = new Buffer(buffer);
      var n;
      for (var i = 0, l = buffer.length; i < l; i++) {
        if (this.tState === START) {
          n = buffer[i];
          this.offset++;
          if (n === 123) {
            this.onToken(LEFT_BRACE, "{");
          } else if (n === 125) {
            this.onToken(RIGHT_BRACE, "}");
          } else if (n === 91) {
            this.onToken(LEFT_BRACKET, "[");
          } else if (n === 93) {
            this.onToken(RIGHT_BRACKET, "]");
          } else if (n === 58) {
            this.onToken(COLON, ":");
          } else if (n === 44) {
            this.onToken(COMMA, ",");
          } else if (n === 116) {
            this.tState = TRUE1;
          } else if (n === 102) {
            this.tState = FALSE1;
          } else if (n === 110) {
            this.tState = NULL1;
          } else if (n === 34) {
            this.string = "";
            this.stringBufferOffset = 0;
            this.tState = STRING1;
          } else if (n === 45) {
            this.string = "-";
            this.tState = NUMBER1;
          } else {
            if (n >= 48 && n < 64) {
              this.string = String.fromCharCode(n);
              this.tState = NUMBER3;
            } else if (n === 32 || n === 9 || n === 10 || n === 13) {
            } else {
              return this.charError(buffer, i);
            }
          }
        } else if (this.tState === STRING1) {
          n = buffer[i];
          if (this.bytes_remaining > 0) {
            for (var j = 0; j < this.bytes_remaining; j++) {
              this.temp_buffs[this.bytes_in_sequence][this.bytes_in_sequence - this.bytes_remaining + j] = buffer[j];
            }
            this.appendStringBuf(this.temp_buffs[this.bytes_in_sequence]);
            this.bytes_in_sequence = this.bytes_remaining = 0;
            i = i + j - 1;
          } else if (this.bytes_remaining === 0 && n >= 128) {
            if (n <= 193 || n > 244) {
              return this.onError(new Error("Invalid UTF-8 character at position " + i + " in state " + Parser.toknam(this.tState)));
            }
            if (n >= 194 && n <= 223)
              this.bytes_in_sequence = 2;
            if (n >= 224 && n <= 239)
              this.bytes_in_sequence = 3;
            if (n >= 240 && n <= 244)
              this.bytes_in_sequence = 4;
            if (this.bytes_in_sequence + i > buffer.length) {
              for (var k = 0; k <= buffer.length - 1 - i; k++) {
                this.temp_buffs[this.bytes_in_sequence][k] = buffer[i + k];
              }
              this.bytes_remaining = i + this.bytes_in_sequence - buffer.length;
              i = buffer.length - 1;
            } else {
              this.appendStringBuf(buffer, i, i + this.bytes_in_sequence);
              i = i + this.bytes_in_sequence - 1;
            }
          } else if (n === 34) {
            this.tState = START;
            this.string += this.stringBuffer.toString("utf8", 0, this.stringBufferOffset);
            this.stringBufferOffset = 0;
            this.onToken(STRING, this.string);
            this.offset += Buffer.byteLength(this.string, "utf8") + 1;
            this.string = void 0;
          } else if (n === 92) {
            this.tState = STRING2;
          } else if (n >= 32) {
            this.appendStringChar(n);
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === STRING2) {
          n = buffer[i];
          if (n === 34) {
            this.appendStringChar(n);
            this.tState = STRING1;
          } else if (n === 92) {
            this.appendStringChar(BACK_SLASH);
            this.tState = STRING1;
          } else if (n === 47) {
            this.appendStringChar(FORWARD_SLASH);
            this.tState = STRING1;
          } else if (n === 98) {
            this.appendStringChar(BACKSPACE);
            this.tState = STRING1;
          } else if (n === 102) {
            this.appendStringChar(FORM_FEED);
            this.tState = STRING1;
          } else if (n === 110) {
            this.appendStringChar(NEWLINE);
            this.tState = STRING1;
          } else if (n === 114) {
            this.appendStringChar(CARRIAGE_RETURN);
            this.tState = STRING1;
          } else if (n === 116) {
            this.appendStringChar(TAB);
            this.tState = STRING1;
          } else if (n === 117) {
            this.unicode = "";
            this.tState = STRING3;
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === STRING3 || this.tState === STRING4 || this.tState === STRING5 || this.tState === STRING6) {
          n = buffer[i];
          if (n >= 48 && n < 64 || n > 64 && n <= 70 || n > 96 && n <= 102) {
            this.unicode += String.fromCharCode(n);
            if (this.tState++ === STRING6) {
              var intVal = parseInt(this.unicode, 16);
              this.unicode = void 0;
              if (this.highSurrogate !== void 0 && intVal >= 56320 && intVal < 57343 + 1) {
                this.appendStringBuf(new Buffer(String.fromCharCode(this.highSurrogate, intVal)));
                this.highSurrogate = void 0;
              } else if (this.highSurrogate === void 0 && intVal >= 55296 && intVal < 56319 + 1) {
                this.highSurrogate = intVal;
              } else {
                if (this.highSurrogate !== void 0) {
                  this.appendStringBuf(new Buffer(String.fromCharCode(this.highSurrogate)));
                  this.highSurrogate = void 0;
                }
                this.appendStringBuf(new Buffer(String.fromCharCode(intVal)));
              }
              this.tState = STRING1;
            }
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === NUMBER1 || this.tState === NUMBER3) {
          n = buffer[i];
          switch (n) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 46:
            case 101:
            case 69:
            case 43:
            case 45:
              this.string += String.fromCharCode(n);
              this.tState = NUMBER3;
              break;
            default:
              this.tState = START;
              var result = Number(this.string);
              if (isNaN(result)) {
                return this.charError(buffer, i);
              }
              if (this.string.match(/[0-9]+/) == this.string && result.toString() != this.string) {
                this.onToken(STRING, this.string);
              } else {
                this.onToken(NUMBER, result);
              }
              this.offset += this.string.length - 1;
              this.string = void 0;
              i--;
              break;
          }
        } else if (this.tState === TRUE1) {
          if (buffer[i] === 114) {
            this.tState = TRUE2;
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === TRUE2) {
          if (buffer[i] === 117) {
            this.tState = TRUE3;
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === TRUE3) {
          if (buffer[i] === 101) {
            this.tState = START;
            this.onToken(TRUE, true);
            this.offset += 3;
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === FALSE1) {
          if (buffer[i] === 97) {
            this.tState = FALSE2;
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === FALSE2) {
          if (buffer[i] === 108) {
            this.tState = FALSE3;
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === FALSE3) {
          if (buffer[i] === 115) {
            this.tState = FALSE4;
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === FALSE4) {
          if (buffer[i] === 101) {
            this.tState = START;
            this.onToken(FALSE, false);
            this.offset += 4;
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === NULL1) {
          if (buffer[i] === 117) {
            this.tState = NULL2;
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === NULL2) {
          if (buffer[i] === 108) {
            this.tState = NULL3;
          } else {
            return this.charError(buffer, i);
          }
        } else if (this.tState === NULL3) {
          if (buffer[i] === 108) {
            this.tState = START;
            this.onToken(NULL, null);
            this.offset += 3;
          } else {
            return this.charError(buffer, i);
          }
        }
      }
    };
    proto.onToken = function(token, value) {
    };
    proto.parseError = function(token, value) {
      this.tState = STOP;
      this.onError(new Error("Unexpected " + Parser.toknam(token) + (value ? "(" + JSON.stringify(value) + ")" : "") + " in state " + Parser.toknam(this.state)));
    };
    proto.push = function() {
      this.stack.push({ value: this.value, key: this.key, mode: this.mode });
    };
    proto.pop = function() {
      var value = this.value;
      var parent = this.stack.pop();
      this.value = parent.value;
      this.key = parent.key;
      this.mode = parent.mode;
      this.emit(value);
      if (!this.mode) {
        this.state = VALUE;
      }
    };
    proto.emit = function(value) {
      if (this.mode) {
        this.state = COMMA;
      }
      this.onValue(value);
    };
    proto.onValue = function(value) {
    };
    proto.onToken = function(token, value) {
      if (this.state === VALUE) {
        if (token === STRING || token === NUMBER || token === TRUE || token === FALSE || token === NULL) {
          if (this.value) {
            this.value[this.key] = value;
          }
          this.emit(value);
        } else if (token === LEFT_BRACE) {
          this.push();
          if (this.value) {
            this.value = this.value[this.key] = {};
          } else {
            this.value = {};
          }
          this.key = void 0;
          this.state = KEY;
          this.mode = OBJECT;
        } else if (token === LEFT_BRACKET) {
          this.push();
          if (this.value) {
            this.value = this.value[this.key] = [];
          } else {
            this.value = [];
          }
          this.key = 0;
          this.mode = ARRAY;
          this.state = VALUE;
        } else if (token === RIGHT_BRACE) {
          if (this.mode === OBJECT) {
            this.pop();
          } else {
            return this.parseError(token, value);
          }
        } else if (token === RIGHT_BRACKET) {
          if (this.mode === ARRAY) {
            this.pop();
          } else {
            return this.parseError(token, value);
          }
        } else {
          return this.parseError(token, value);
        }
      } else if (this.state === KEY) {
        if (token === STRING) {
          this.key = value;
          this.state = COLON;
        } else if (token === RIGHT_BRACE) {
          this.pop();
        } else {
          return this.parseError(token, value);
        }
      } else if (this.state === COLON) {
        if (token === COLON) {
          this.state = VALUE;
        } else {
          return this.parseError(token, value);
        }
      } else if (this.state === COMMA) {
        if (token === COMMA) {
          if (this.mode === ARRAY) {
            this.key++;
            this.state = VALUE;
          } else if (this.mode === OBJECT) {
            this.state = KEY;
          }
        } else if (token === RIGHT_BRACKET && this.mode === ARRAY || token === RIGHT_BRACE && this.mode === OBJECT) {
          this.pop();
        } else {
          return this.parseError(token, value);
        }
      } else {
        return this.parseError(token, value);
      }
    };
    Parser.C = C;
    module2.exports = Parser;
  }
});

// node_modules/json-rpc2/src/server.js
var require_server2 = __commonJS({
  "node_modules/json-rpc2/src/server.js"(exports, module2) {
    module2.exports = function(classes) {
      "use strict";
      var net = require("net"), http = require("http"), extend = require_object_assign(), JsonParser = require_jsonparse(), UNAUTHORIZED = "Unauthorized", METHOD_NOT_ALLOWED = "Invalid Request", INVALID_REQUEST = "Invalid Request", _ = classes._, Endpoint = classes.Endpoint, WebSocket = classes.Websocket, Error2 = classes.Error, Server = Endpoint.$define("Server", {
        construct: function($super, opts) {
          $super();
          this.opts = opts || {};
          this.opts.type = typeof this.opts.type !== "undefined" ? this.opts.type : "http";
          this.opts.headers = this.opts.headers || {};
          this.opts.websocket = typeof this.opts.websocket !== "undefined" ? this.opts.websocket : true;
          this.on("error", () => {
          });
        },
        _checkAuth: function(req, res) {
          var self2 = this;
          if (self2.authHandler) {
            var authHeader = req.headers["authorization"] || "", authToken = authHeader.split(/\s+/).pop() || "", auth = Buffer.from(authToken, "base64").toString(), parts = auth.split(/:/), username = parts[0], password = parts[1];
            if (!this.authHandler(username, password)) {
              if (res) {
                classes.EventEmitter.trace("<--", "Unauthorized request");
                Server.handleHttpError(req, res, new Error2.InvalidParams(UNAUTHORIZED), self2.opts.headers);
              }
              return false;
            }
          }
          return true;
        },
        listen: function(port, host) {
          var self2 = this, server = http.createServer();
          server.on("request", function onRequest(req, res) {
            self2.handleHttp(req, res);
          });
          if (port) {
            server.listen(port, host);
            Endpoint.trace("***", "Server listening on http://" + (host || "127.0.0.1") + ":" + port + "/");
          }
          if (this.opts.websocket === true) {
            server.on("upgrade", function onUpgrade(req, socket, body) {
              if (WebSocket.isWebSocket(req)) {
                if (self2._checkAuth(req, socket)) {
                  self2.handleWebsocket(req, socket, body);
                }
              }
            });
          }
          return server;
        },
        listenRaw: function(port, host) {
          var self2 = this, server = net.createServer(function createServer(socket) {
            self2.handleRaw(socket);
          });
          server.listen(port, host);
          Endpoint.trace("***", "Server listening on tcp://" + (host || "127.0.0.1") + ":" + port + "/");
          return server;
        },
        listenHybrid: function(port, host) {
          var self2 = this, httpServer = self2.listen(), server = net.createServer(function createServer(socket) {
            self2.handleHybrid(httpServer, socket);
          });
          server.listen(port, host);
          Endpoint.trace("***", "Server (hybrid) listening on http+tcp://" + (host || "127.0.0.1") + ":" + port + "/");
          return server;
        },
        handleHttp: function(req, res) {
          var buffer = "", self2 = this;
          var headers;
          if (req.method === "OPTIONS") {
            headers = {
              "Content-Length": 0,
              "Access-Control-Allow-Headers": "Accept, Authorization, Content-Type"
            };
            headers = extend({}, headers, self2.opts.headers);
            res.writeHead(200, headers);
            res.end();
            return;
          }
          if (!self2._checkAuth(req, res)) {
            return;
          }
          Endpoint.trace("<--", "Accepted http request");
          if (req.method !== "POST") {
            Server.handleHttpError(req, res, new Error2.InvalidRequest(METHOD_NOT_ALLOWED), self2.opts.headers);
            return;
          }
          var handle = function handle2(buf) {
            var decoded;
            try {
              decoded = JSON.parse(buf);
            } catch (error) {
              Server.handleHttpError(req, res, new Error2.ParseError(INVALID_REQUEST), self2.opts.headers);
              return;
            }
            if (!decoded.method || !decoded.params) {
              Endpoint.trace("-->", "Response (invalid request)");
              Server.handleHttpError(req, res, new Error2.InvalidRequest(INVALID_REQUEST), self2.opts.headers);
              return;
            }
            var reply = function reply2(json) {
              var encoded;
              headers = {
                "Content-Type": "application/json"
              };
              if (json) {
                encoded = JSON.stringify(json);
                headers["Content-Length"] = Buffer.byteLength(encoded, "utf-8");
              } else {
                encoded = "";
                headers["Content-Length"] = 0;
              }
              headers = extend({}, headers, self2.opts.headers);
              if (!conn.isStreaming) {
                res.writeHead(200, headers);
                res.write(encoded);
                res.end();
              } else {
                res.writeHead(200, headers);
                res.write(encoded);
              }
            };
            var callback = function callback2(err, result) {
              var response;
              if (err) {
                self2.emit("error", err);
                Endpoint.trace("-->", "Failure (id " + decoded.id + "): " + (err.stack ? err.stack : err.toString()));
                result = null;
                if (!(err instanceof Error2.AbstractError)) {
                  err = new Error2.InternalError(err.toString());
                }
                response = {
                  "jsonrpc": "2.0",
                  "error": { code: err.code, message: err.message }
                };
              } else {
                Endpoint.trace("-->", "Response (id " + decoded.id + "): " + JSON.stringify(result));
                response = {
                  "jsonrpc": "2.0",
                  "result": typeof result === "undefined" ? null : result
                };
              }
              if (Endpoint.hasId(decoded)) {
                response.id = decoded.id;
                reply(response);
              } else {
                reply();
              }
            };
            var conn = new classes.HttpServerConnection(self2, req, res);
            self2.handleCall(decoded, conn, callback);
          };
          req.on("data", function requestData(chunk) {
            buffer = buffer + chunk;
          });
          req.on("end", function requestEnd() {
            handle(buffer);
          });
        },
        handleRaw: function(socket) {
          var self2 = this, conn, parser, requireAuth;
          Endpoint.trace("<--", "Accepted socket connection");
          conn = new classes.SocketConnection(self2, socket);
          parser = new JsonParser();
          requireAuth = !!this.authHandler;
          parser.onValue = function(decoded) {
            if (this.stack.length) {
              return;
            }
            if (requireAuth) {
              if (decoded.method !== "auth") {
                if (Endpoint.hasId(decoded)) {
                  conn.sendReply("Error: Unauthorized", null, decoded.id);
                }
              } else {
                if (_.isArray(decoded.params) && decoded.params.length === 2 && self2.authHandler(decoded.params[0], decoded.params[1])) {
                  requireAuth = false;
                  if (Endpoint.hasId(decoded)) {
                    conn.sendReply(null, true, decoded.id);
                  }
                } else {
                  if (Endpoint.hasId(decoded)) {
                    conn.sendReply("Error: Invalid credentials", null, decoded.id);
                  }
                }
              }
              return;
            } else {
              conn.handleMessage(decoded);
            }
          };
          socket.on("data", function(chunk) {
            try {
              parser.write(chunk);
            } catch (err) {
            }
          });
        },
        handleWebsocket: function(request, socket, body) {
          var self2 = this, conn, parser;
          socket = new WebSocket(request, socket, body);
          Endpoint.trace("<--", "Accepted Websocket connection");
          conn = new classes.WebSocketConnection(self2, socket);
          parser = new JsonParser();
          parser.onValue = function(decoded) {
            if (this.stack.length) {
              return;
            }
            conn.handleMessage(decoded);
          };
          socket.on("message", function(event) {
            try {
              parser.write(event.data);
            } catch (err) {
            }
          });
        },
        handleHybrid: function(httpServer, socket) {
          var self2 = this;
          socket.once("data", function(chunk) {
            if (chunk[0] >= 65 && chunk[0] <= 90) {
              http._connectionListener.call(httpServer, socket);
              socket.ondata(chunk, 0, chunk.length);
            } else {
              self2.handleRaw(socket);
              socket.emit("data", chunk);
            }
          });
        },
        enableAuth: function(handler, password) {
          if (!_.isFunction(handler)) {
            var user = "" + handler;
            password = "" + password;
            handler = function checkAuth(suppliedUser, suppliedPassword) {
              return user === suppliedUser && password === suppliedPassword;
            };
          }
          this.authHandler = handler;
        }
      }, {
        handleHttpError: function(req, res, error, custom_headers) {
          var message = JSON.stringify({
            "jsonrpc": "2.0",
            "error": { code: error.code, message: error.message },
            "id": null
          });
          custom_headers = custom_headers || {};
          var headers = extend({
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(message),
            "Access-Control-Allow-Headers": "Content-Type",
            "Allow": "POST"
          }, custom_headers);
          if (res.writeHead) {
            res.writeHead(200, headers);
            res.write(message);
          } else {
            headers["Content-Length"] += 3;
            res.write(headers + "\n\n" + message + "\n");
          }
          res.end();
        }
      });
      return Server;
    };
  }
});

// node_modules/json-rpc2/src/client.js
var require_client3 = __commonJS({
  "node_modules/json-rpc2/src/client.js"(exports, module2) {
    module2.exports = function(classes) {
      "use strict";
      var net = require("net"), http = require("http"), https = require("https"), WebSocket = classes.Websocket, JsonParser = require_jsonparse(), EventEmitter2 = classes.EventEmitter, Endpoint = classes.Endpoint, _ = classes._, SocketConnection = classes.SocketConnection, WebSocketConnection = classes.WebSocketConnection, Client2 = Endpoint.$define("Client", {
        construct: function($super, port, host, user, password) {
          $super();
          this.port = port;
          this.host = host;
          this.user = user;
          this.password = password;
          this.on("error", () => {
          });
        },
        _authHeader: function(headers) {
          if (this.user && this.password) {
            var buff = Buffer.from(this.user + ":" + this.password).toString("base64");
            headers["Authorization"] = "Basic " + buff;
          }
        },
        connectHttp: function(method, params, opts, callback) {
          if (_.isFunction(opts)) {
            callback = opts;
            opts = {};
          }
          opts = opts || {};
          var id = 1, self2 = this;
          var requestJSON = JSON.stringify({
            "id": id,
            "method": method,
            "params": params,
            "jsonrpc": "2.0"
          });
          var headers = {};
          this._authHeader(headers);
          headers["Host"] = this.host;
          headers["Content-Length"] = Buffer.byteLength(requestJSON, "utf8");
          var options = {
            hostname: this.host,
            port: this.port,
            path: opts.path || "/",
            method: "POST",
            headers
          };
          var request;
          if (opts.https === true) {
            if (opts.rejectUnauthorized !== void 0) {
              options.rejectUnauthorized = opts.rejectUnauthorized;
            }
            request = https.request(options);
          } else {
            request = http.request(options);
          }
          request.on("error", function requestError(err) {
            callback(err);
          });
          request.write(requestJSON);
          request.on("response", function requestResponse(response) {
            callback.call(self2, id, request, response);
          });
        },
        connectWebsocket: function(callback) {
          var self2 = this, conn, socket, parser, headers = {};
          if (!/^wss?:\/\//i.test(self2.host)) {
            self2.host = "ws://" + self2.host + ":" + self2.port + "/";
          }
          this._authHeader(headers);
          socket = new WebSocket.Client(self2.host, null, { headers });
          conn = new WebSocketConnection(self2, socket);
          parser = new JsonParser();
          parser.onValue = function parseOnValue(decoded) {
            if (this.stack.length) {
              return;
            }
            conn.handleMessage(decoded);
          };
          socket.on("error", function socketError(event) {
            callback(event.reason);
          });
          socket.on("open", function socketOpen() {
            callback(null, conn);
          });
          socket.on("message", function socketMessage(event) {
            try {
              parser.write(event.data);
            } catch (err) {
              EventEmitter2.trace("<--", err.toString());
            }
          });
          return conn;
        },
        connectSocket: function(callback) {
          var self2 = this, socket, conn, parser;
          socket = net.connect(this.port, this.host, function netConnect() {
            if (!_.isEmpty(self2.user) && !_.isEmpty(self2.password)) {
              conn.call("auth", [self2.user, self2.password], function connectionAuth(err) {
                if (err) {
                  callback(err);
                } else {
                  callback(null, conn);
                }
              });
              return;
            }
            if (_.isFunction(callback)) {
              callback(null, conn);
            }
          });
          conn = new SocketConnection(self2, socket);
          parser = new JsonParser();
          parser.onValue = function parseOnValue(decoded) {
            if (this.stack.length) {
              return;
            }
            conn.handleMessage(decoded);
          };
          socket.on("data", function socketData(chunk) {
            try {
              parser.write(chunk);
            } catch (err) {
              EventEmitter2.trace("<--", err.toString());
            }
          });
          return conn;
        },
        stream: function(method, params, opts, callback) {
          if (_.isFunction(opts)) {
            callback = opts;
            opts = {};
          }
          opts = opts || {};
          this.connectHttp(method, params, opts, function connectHttp(id, request, response) {
            if (_.isFunction(callback)) {
              var connection = new EventEmitter2();
              connection.id = id;
              connection.req = request;
              connection.res = response;
              connection.expose = function connectionExpose(method2, callback2) {
                connection.on("call:" + method2, function connectionCall(data) {
                  callback2.call(null, data.params || []);
                });
              };
              connection.end = function connectionEnd() {
                this.req.connection.end();
              };
              var parser = new JsonParser();
              parser.onValue = function(decoded) {
                if (this.stack.length) {
                  return;
                }
                connection.emit("data", decoded);
                if (decoded.hasOwnProperty("result") || decoded.hasOwnProperty("error") && decoded.id === id && _.isFunction(callback)) {
                  connection.emit("result", decoded);
                } else if (decoded.hasOwnProperty("method")) {
                  connection.emit("call:" + decoded.method, decoded);
                }
              };
              if (response) {
                connection.res.once("data", function connectionOnce(data) {
                  if (connection.res.statusCode === 200) {
                    callback(null, connection);
                  } else {
                    callback(new Error('"' + connection.res.statusCode + '"' + data));
                  }
                });
                connection.res.on("data", function connectionData(chunk) {
                  try {
                    parser.write(chunk);
                  } catch (err) {
                  }
                });
                connection.res.on("end", function connectionEnd() {
                });
              }
            }
          });
        },
        call: function(method, params, opts, callback) {
          if (_.isFunction(opts)) {
            callback = opts;
            opts = {};
          }
          opts = opts || {};
          EventEmitter2.trace("-->", "Http call (method " + method + "): " + JSON.stringify(params));
          this.connectHttp(method, params, opts, function connectHttp(id, request, response) {
            if (!response) {
              callback(new Error("Have no response object"));
              return;
            }
            var data = "";
            response.on("data", function responseData(chunk) {
              data += chunk;
            });
            response.on("end", function responseEnd() {
              if (response.statusCode !== 200) {
                callback(new Error('"' + response.statusCode + '"' + data));
                return;
              }
              var decoded = JSON.parse(data);
              if (_.isFunction(callback)) {
                if (!decoded.error) {
                  decoded.error = null;
                }
                callback(decoded.error, decoded.result);
              }
            });
          });
        }
      });
      return Client2;
    };
  }
});

// node_modules/json-rpc2/src/jsonrpc.js
var require_jsonrpc = __commonJS({
  "node_modules/json-rpc2/src/jsonrpc.js"(exports) {
    "use strict";
    exports._ = require_lodash();
    exports.ES5Class = require_es5class();
    exports.Websocket = require_websocket();
    exports.Error = require_error()(exports);
    exports.EventEmitter = require_event_emitter()(exports);
    exports.Endpoint = require_endpoint()(exports);
    exports.Connection = require_connection()(exports);
    exports.HttpServerConnection = require_http_server_connection()(exports);
    exports.SocketConnection = require_socket_connection()(exports);
    exports.WebSocketConnection = require_websocket_connection()(exports);
    exports.Server = require_server2()(exports);
    exports.Client = require_client3()(exports);
  }
});

// node_modules/vscode-debugadapter/lib/messages.js
var require_messages = __commonJS({
  "node_modules/vscode-debugadapter/lib/messages.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Event = exports.Response = exports.Message = void 0;
    var Message = class {
      constructor(type) {
        this.seq = 0;
        this.type = type;
      }
    };
    exports.Message = Message;
    var Response = class extends Message {
      constructor(request, message) {
        super("response");
        this.request_seq = request.seq;
        this.command = request.command;
        if (message) {
          this.success = false;
          this.message = message;
        } else {
          this.success = true;
        }
      }
    };
    exports.Response = Response;
    var Event = class extends Message {
      constructor(event, body) {
        super("event");
        this.event = event;
        if (body) {
          this.body = body;
        }
      }
    };
    exports.Event = Event;
  }
});

// node_modules/vscode-debugadapter/lib/protocol.js
var require_protocol = __commonJS({
  "node_modules/vscode-debugadapter/lib/protocol.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProtocolServer = void 0;
    var ee = require("events");
    var messages_1 = require_messages();
    var Emitter = class {
      get event() {
        if (!this._event) {
          this._event = (listener, thisArg) => {
            this._listener = listener;
            this._this = thisArg;
            let result;
            result = {
              dispose: () => {
                this._listener = void 0;
                this._this = void 0;
              }
            };
            return result;
          };
        }
        return this._event;
      }
      fire(event) {
        if (this._listener) {
          try {
            this._listener.call(this._this, event);
          } catch (e) {
          }
        }
      }
      hasListener() {
        return !!this._listener;
      }
      dispose() {
        this._listener = void 0;
        this._this = void 0;
      }
    };
    var ProtocolServer = class extends ee.EventEmitter {
      constructor() {
        super();
        this._sendMessage = new Emitter();
        this._pendingRequests = new Map();
        this.onDidSendMessage = this._sendMessage.event;
      }
      dispose() {
      }
      handleMessage(msg) {
        if (msg.type === "request") {
          this.dispatchRequest(msg);
        } else if (msg.type === "response") {
          const response = msg;
          const clb = this._pendingRequests.get(response.request_seq);
          if (clb) {
            this._pendingRequests.delete(response.request_seq);
            clb(response);
          }
        }
      }
      _isRunningInline() {
        return this._sendMessage && this._sendMessage.hasListener();
      }
      start(inStream, outStream) {
        this._sequence = 1;
        this._writableStream = outStream;
        this._rawData = new Buffer(0);
        inStream.on("data", (data) => this._handleData(data));
        inStream.on("close", () => {
          this._emitEvent(new messages_1.Event("close"));
        });
        inStream.on("error", (error) => {
          this._emitEvent(new messages_1.Event("error", "inStream error: " + (error && error.message)));
        });
        outStream.on("error", (error) => {
          this._emitEvent(new messages_1.Event("error", "outStream error: " + (error && error.message)));
        });
        inStream.resume();
      }
      stop() {
        if (this._writableStream) {
          this._writableStream.end();
        }
      }
      sendEvent(event) {
        this._send("event", event);
      }
      sendResponse(response) {
        if (response.seq > 0) {
          console.error(`attempt to send more than one response for command ${response.command}`);
        } else {
          this._send("response", response);
        }
      }
      sendRequest(command, args, timeout, cb) {
        const request = {
          command
        };
        if (args && Object.keys(args).length > 0) {
          request.arguments = args;
        }
        this._send("request", request);
        if (cb) {
          this._pendingRequests.set(request.seq, cb);
          const timer = setTimeout(() => {
            clearTimeout(timer);
            const clb = this._pendingRequests.get(request.seq);
            if (clb) {
              this._pendingRequests.delete(request.seq);
              clb(new messages_1.Response(request, "timeout"));
            }
          }, timeout);
        }
      }
      dispatchRequest(request) {
      }
      _emitEvent(event) {
        this.emit(event.event, event);
      }
      _send(typ, message) {
        message.type = typ;
        message.seq = this._sequence++;
        if (this._writableStream) {
          const json = JSON.stringify(message);
          this._writableStream.write(`Content-Length: ${Buffer.byteLength(json, "utf8")}\r
\r
${json}`, "utf8");
        }
        this._sendMessage.fire(message);
      }
      _handleData(data) {
        this._rawData = Buffer.concat([this._rawData, data]);
        while (true) {
          if (this._contentLength >= 0) {
            if (this._rawData.length >= this._contentLength) {
              const message = this._rawData.toString("utf8", 0, this._contentLength);
              this._rawData = this._rawData.slice(this._contentLength);
              this._contentLength = -1;
              if (message.length > 0) {
                try {
                  let msg = JSON.parse(message);
                  this.handleMessage(msg);
                } catch (e) {
                  this._emitEvent(new messages_1.Event("error", "Error handling data: " + (e && e.message)));
                }
              }
              continue;
            }
          } else {
            const idx = this._rawData.indexOf(ProtocolServer.TWO_CRLF);
            if (idx !== -1) {
              const header = this._rawData.toString("utf8", 0, idx);
              const lines = header.split("\r\n");
              for (let i = 0; i < lines.length; i++) {
                const pair = lines[i].split(/: +/);
                if (pair[0] == "Content-Length") {
                  this._contentLength = +pair[1];
                }
              }
              this._rawData = this._rawData.slice(idx + ProtocolServer.TWO_CRLF.length);
              continue;
            }
          }
          break;
        }
      }
    };
    exports.ProtocolServer = ProtocolServer;
    ProtocolServer.TWO_CRLF = "\r\n\r\n";
  }
});

// node_modules/vscode-debugadapter/lib/runDebugAdapter.js
var require_runDebugAdapter = __commonJS({
  "node_modules/vscode-debugadapter/lib/runDebugAdapter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runDebugAdapter = void 0;
    var Net = require("net");
    function runDebugAdapter(debugSession) {
      let port = 0;
      const args = process.argv.slice(2);
      args.forEach(function(val, index, array) {
        const portMatch = /^--server=(\d{4,5})$/.exec(val);
        if (portMatch) {
          port = parseInt(portMatch[1], 10);
        }
      });
      if (port > 0) {
        console.error(`waiting for debug protocol on port ${port}`);
        Net.createServer((socket) => {
          console.error(">> accepted connection from client");
          socket.on("end", () => {
            console.error(">> client connection closed\n");
          });
          const session = new debugSession(false, true);
          session.setRunAsServer(true);
          session.start(socket, socket);
        }).listen(port);
      } else {
        const session = new debugSession(false);
        process.on("SIGTERM", () => {
          session.shutdown();
        });
        session.start(process.stdin, process.stdout);
      }
    }
    exports.runDebugAdapter = runDebugAdapter;
  }
});

// node_modules/vscode-debugadapter/lib/debugSession.js
var require_debugSession = __commonJS({
  "node_modules/vscode-debugadapter/lib/debugSession.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DebugSession = exports.ErrorDestination = exports.InvalidatedEvent = exports.ProgressEndEvent = exports.ProgressUpdateEvent = exports.ProgressStartEvent = exports.CapabilitiesEvent = exports.LoadedSourceEvent = exports.ModuleEvent = exports.BreakpointEvent = exports.ThreadEvent = exports.OutputEvent = exports.TerminatedEvent = exports.InitializedEvent = exports.ContinuedEvent = exports.StoppedEvent = exports.CompletionItem = exports.Module = exports.Breakpoint = exports.Variable = exports.Thread = exports.StackFrame = exports.Scope = exports.Source = void 0;
    var protocol_1 = require_protocol();
    var messages_1 = require_messages();
    var runDebugAdapter_1 = require_runDebugAdapter();
    var url_1 = require("url");
    var Source2 = class {
      constructor(name, path3, id = 0, origin, data) {
        this.name = name;
        this.path = path3;
        this.sourceReference = id;
        if (origin) {
          this.origin = origin;
        }
        if (data) {
          this.adapterData = data;
        }
      }
    };
    exports.Source = Source2;
    var Scope2 = class {
      constructor(name, reference, expensive = false) {
        this.name = name;
        this.variablesReference = reference;
        this.expensive = expensive;
      }
    };
    exports.Scope = Scope2;
    var StackFrame2 = class {
      constructor(i, nm, src, ln = 0, col = 0) {
        this.id = i;
        this.source = src;
        this.line = ln;
        this.column = col;
        this.name = nm;
      }
    };
    exports.StackFrame = StackFrame2;
    var Thread2 = class {
      constructor(id, name) {
        this.id = id;
        if (name) {
          this.name = name;
        } else {
          this.name = "Thread #" + id;
        }
      }
    };
    exports.Thread = Thread2;
    var Variable = class {
      constructor(name, value, ref = 0, indexedVariables, namedVariables) {
        this.name = name;
        this.value = value;
        this.variablesReference = ref;
        if (typeof namedVariables === "number") {
          this.namedVariables = namedVariables;
        }
        if (typeof indexedVariables === "number") {
          this.indexedVariables = indexedVariables;
        }
      }
    };
    exports.Variable = Variable;
    var Breakpoint = class {
      constructor(verified, line, column, source) {
        this.verified = verified;
        const e = this;
        if (typeof line === "number") {
          e.line = line;
        }
        if (typeof column === "number") {
          e.column = column;
        }
        if (source) {
          e.source = source;
        }
      }
    };
    exports.Breakpoint = Breakpoint;
    var Module = class {
      constructor(id, name) {
        this.id = id;
        this.name = name;
      }
    };
    exports.Module = Module;
    var CompletionItem = class {
      constructor(label, start, length = 0) {
        this.label = label;
        this.start = start;
        this.length = length;
      }
    };
    exports.CompletionItem = CompletionItem;
    var StoppedEvent2 = class extends messages_1.Event {
      constructor(reason, threadId, exceptionText) {
        super("stopped");
        this.body = {
          reason
        };
        if (typeof threadId === "number") {
          this.body.threadId = threadId;
        }
        if (typeof exceptionText === "string") {
          this.body.text = exceptionText;
        }
      }
    };
    exports.StoppedEvent = StoppedEvent2;
    var ContinuedEvent2 = class extends messages_1.Event {
      constructor(threadId, allThreadsContinued) {
        super("continued");
        this.body = {
          threadId
        };
        if (typeof allThreadsContinued === "boolean") {
          this.body.allThreadsContinued = allThreadsContinued;
        }
      }
    };
    exports.ContinuedEvent = ContinuedEvent2;
    var InitializedEvent2 = class extends messages_1.Event {
      constructor() {
        super("initialized");
      }
    };
    exports.InitializedEvent = InitializedEvent2;
    var TerminatedEvent2 = class extends messages_1.Event {
      constructor(restart) {
        super("terminated");
        if (typeof restart === "boolean" || restart) {
          const e = this;
          e.body = {
            restart
          };
        }
      }
    };
    exports.TerminatedEvent = TerminatedEvent2;
    var OutputEvent2 = class extends messages_1.Event {
      constructor(output, category = "console", data) {
        super("output");
        this.body = {
          category,
          output
        };
        if (data !== void 0) {
          this.body.data = data;
        }
      }
    };
    exports.OutputEvent = OutputEvent2;
    var ThreadEvent = class extends messages_1.Event {
      constructor(reason, threadId) {
        super("thread");
        this.body = {
          reason,
          threadId
        };
      }
    };
    exports.ThreadEvent = ThreadEvent;
    var BreakpointEvent = class extends messages_1.Event {
      constructor(reason, breakpoint) {
        super("breakpoint");
        this.body = {
          reason,
          breakpoint
        };
      }
    };
    exports.BreakpointEvent = BreakpointEvent;
    var ModuleEvent = class extends messages_1.Event {
      constructor(reason, module3) {
        super("module");
        this.body = {
          reason,
          module: module3
        };
      }
    };
    exports.ModuleEvent = ModuleEvent;
    var LoadedSourceEvent = class extends messages_1.Event {
      constructor(reason, source) {
        super("loadedSource");
        this.body = {
          reason,
          source
        };
      }
    };
    exports.LoadedSourceEvent = LoadedSourceEvent;
    var CapabilitiesEvent = class extends messages_1.Event {
      constructor(capabilities) {
        super("capabilities");
        this.body = {
          capabilities
        };
      }
    };
    exports.CapabilitiesEvent = CapabilitiesEvent;
    var ProgressStartEvent = class extends messages_1.Event {
      constructor(progressId, title, message) {
        super("progressStart");
        this.body = {
          progressId,
          title
        };
        if (typeof message === "string") {
          this.body.message = message;
        }
      }
    };
    exports.ProgressStartEvent = ProgressStartEvent;
    var ProgressUpdateEvent = class extends messages_1.Event {
      constructor(progressId, message) {
        super("progressUpdate");
        this.body = {
          progressId
        };
        if (typeof message === "string") {
          this.body.message = message;
        }
      }
    };
    exports.ProgressUpdateEvent = ProgressUpdateEvent;
    var ProgressEndEvent = class extends messages_1.Event {
      constructor(progressId, message) {
        super("progressEnd");
        this.body = {
          progressId
        };
        if (typeof message === "string") {
          this.body.message = message;
        }
      }
    };
    exports.ProgressEndEvent = ProgressEndEvent;
    var InvalidatedEvent = class extends messages_1.Event {
      constructor(areas, threadId, stackFrameId) {
        super("invalidated");
        this.body = {};
        if (areas) {
          this.body.areas = areas;
        }
        if (threadId) {
          this.body.threadId = threadId;
        }
        if (stackFrameId) {
          this.body.stackFrameId = stackFrameId;
        }
      }
    };
    exports.InvalidatedEvent = InvalidatedEvent;
    var ErrorDestination2;
    (function(ErrorDestination3) {
      ErrorDestination3[ErrorDestination3["User"] = 1] = "User";
      ErrorDestination3[ErrorDestination3["Telemetry"] = 2] = "Telemetry";
    })(ErrorDestination2 = exports.ErrorDestination || (exports.ErrorDestination = {}));
    var DebugSession2 = class extends protocol_1.ProtocolServer {
      constructor(obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer) {
        super();
        const linesAndColumnsStartAt1 = typeof obsolete_debuggerLinesAndColumnsStartAt1 === "boolean" ? obsolete_debuggerLinesAndColumnsStartAt1 : false;
        this._debuggerLinesStartAt1 = linesAndColumnsStartAt1;
        this._debuggerColumnsStartAt1 = linesAndColumnsStartAt1;
        this._debuggerPathsAreURIs = false;
        this._clientLinesStartAt1 = true;
        this._clientColumnsStartAt1 = true;
        this._clientPathsAreURIs = false;
        this._isServer = typeof obsolete_isServer === "boolean" ? obsolete_isServer : false;
        this.on("close", () => {
          this.shutdown();
        });
        this.on("error", (error) => {
          this.shutdown();
        });
      }
      setDebuggerPathFormat(format) {
        this._debuggerPathsAreURIs = format !== "path";
      }
      setDebuggerLinesStartAt1(enable) {
        this._debuggerLinesStartAt1 = enable;
      }
      setDebuggerColumnsStartAt1(enable) {
        this._debuggerColumnsStartAt1 = enable;
      }
      setRunAsServer(enable) {
        this._isServer = enable;
      }
      static run(debugSession) {
        runDebugAdapter_1.runDebugAdapter(debugSession);
      }
      shutdown() {
        if (this._isServer || this._isRunningInline()) {
        } else {
          setTimeout(() => {
            process.exit(0);
          }, 100);
        }
      }
      sendErrorResponse(response, codeOrMessage, format, variables, dest = ErrorDestination2.User) {
        let msg;
        if (typeof codeOrMessage === "number") {
          msg = {
            id: codeOrMessage,
            format
          };
          if (variables) {
            msg.variables = variables;
          }
          if (dest & ErrorDestination2.User) {
            msg.showUser = true;
          }
          if (dest & ErrorDestination2.Telemetry) {
            msg.sendTelemetry = true;
          }
        } else {
          msg = codeOrMessage;
        }
        response.success = false;
        response.message = DebugSession2.formatPII(msg.format, true, msg.variables);
        if (!response.body) {
          response.body = {};
        }
        response.body.error = msg;
        this.sendResponse(response);
      }
      runInTerminalRequest(args, timeout, cb) {
        this.sendRequest("runInTerminal", args, timeout, cb);
      }
      dispatchRequest(request) {
        const response = new messages_1.Response(request);
        try {
          if (request.command === "initialize") {
            var args = request.arguments;
            if (typeof args.linesStartAt1 === "boolean") {
              this._clientLinesStartAt1 = args.linesStartAt1;
            }
            if (typeof args.columnsStartAt1 === "boolean") {
              this._clientColumnsStartAt1 = args.columnsStartAt1;
            }
            if (args.pathFormat !== "path") {
              this.sendErrorResponse(response, 2018, "debug adapter only supports native paths", null, ErrorDestination2.Telemetry);
            } else {
              const initializeResponse = response;
              initializeResponse.body = {};
              this.initializeRequest(initializeResponse, args);
            }
          } else if (request.command === "launch") {
            this.launchRequest(response, request.arguments, request);
          } else if (request.command === "attach") {
            this.attachRequest(response, request.arguments, request);
          } else if (request.command === "disconnect") {
            this.disconnectRequest(response, request.arguments, request);
          } else if (request.command === "terminate") {
            this.terminateRequest(response, request.arguments, request);
          } else if (request.command === "restart") {
            this.restartRequest(response, request.arguments, request);
          } else if (request.command === "setBreakpoints") {
            this.setBreakPointsRequest(response, request.arguments, request);
          } else if (request.command === "setFunctionBreakpoints") {
            this.setFunctionBreakPointsRequest(response, request.arguments, request);
          } else if (request.command === "setExceptionBreakpoints") {
            this.setExceptionBreakPointsRequest(response, request.arguments, request);
          } else if (request.command === "configurationDone") {
            this.configurationDoneRequest(response, request.arguments, request);
          } else if (request.command === "continue") {
            this.continueRequest(response, request.arguments, request);
          } else if (request.command === "next") {
            this.nextRequest(response, request.arguments, request);
          } else if (request.command === "stepIn") {
            this.stepInRequest(response, request.arguments, request);
          } else if (request.command === "stepOut") {
            this.stepOutRequest(response, request.arguments, request);
          } else if (request.command === "stepBack") {
            this.stepBackRequest(response, request.arguments, request);
          } else if (request.command === "reverseContinue") {
            this.reverseContinueRequest(response, request.arguments, request);
          } else if (request.command === "restartFrame") {
            this.restartFrameRequest(response, request.arguments, request);
          } else if (request.command === "goto") {
            this.gotoRequest(response, request.arguments, request);
          } else if (request.command === "pause") {
            this.pauseRequest(response, request.arguments, request);
          } else if (request.command === "stackTrace") {
            this.stackTraceRequest(response, request.arguments, request);
          } else if (request.command === "scopes") {
            this.scopesRequest(response, request.arguments, request);
          } else if (request.command === "variables") {
            this.variablesRequest(response, request.arguments, request);
          } else if (request.command === "setVariable") {
            this.setVariableRequest(response, request.arguments, request);
          } else if (request.command === "setExpression") {
            this.setExpressionRequest(response, request.arguments, request);
          } else if (request.command === "source") {
            this.sourceRequest(response, request.arguments, request);
          } else if (request.command === "threads") {
            this.threadsRequest(response, request);
          } else if (request.command === "terminateThreads") {
            this.terminateThreadsRequest(response, request.arguments, request);
          } else if (request.command === "evaluate") {
            this.evaluateRequest(response, request.arguments, request);
          } else if (request.command === "stepInTargets") {
            this.stepInTargetsRequest(response, request.arguments, request);
          } else if (request.command === "gotoTargets") {
            this.gotoTargetsRequest(response, request.arguments, request);
          } else if (request.command === "completions") {
            this.completionsRequest(response, request.arguments, request);
          } else if (request.command === "exceptionInfo") {
            this.exceptionInfoRequest(response, request.arguments, request);
          } else if (request.command === "loadedSources") {
            this.loadedSourcesRequest(response, request.arguments, request);
          } else if (request.command === "dataBreakpointInfo") {
            this.dataBreakpointInfoRequest(response, request.arguments, request);
          } else if (request.command === "setDataBreakpoints") {
            this.setDataBreakpointsRequest(response, request.arguments, request);
          } else if (request.command === "readMemory") {
            this.readMemoryRequest(response, request.arguments, request);
          } else if (request.command === "disassemble") {
            this.disassembleRequest(response, request.arguments, request);
          } else if (request.command === "cancel") {
            this.cancelRequest(response, request.arguments, request);
          } else if (request.command === "breakpointLocations") {
            this.breakpointLocationsRequest(response, request.arguments, request);
          } else if (request.command === "setInstructionBreakpoints") {
            this.setInstructionBreakpointsRequest(response, request.arguments, request);
          } else {
            this.customRequest(request.command, response, request.arguments, request);
          }
        } catch (e) {
          this.sendErrorResponse(response, 1104, "{_stack}", { _exception: e.message, _stack: e.stack }, ErrorDestination2.Telemetry);
        }
      }
      initializeRequest(response, args) {
        response.body.supportsConditionalBreakpoints = false;
        response.body.supportsHitConditionalBreakpoints = false;
        response.body.supportsFunctionBreakpoints = false;
        response.body.supportsConfigurationDoneRequest = true;
        response.body.supportsEvaluateForHovers = false;
        response.body.supportsStepBack = false;
        response.body.supportsSetVariable = false;
        response.body.supportsRestartFrame = false;
        response.body.supportsStepInTargetsRequest = false;
        response.body.supportsGotoTargetsRequest = false;
        response.body.supportsCompletionsRequest = false;
        response.body.supportsRestartRequest = false;
        response.body.supportsExceptionOptions = false;
        response.body.supportsValueFormattingOptions = false;
        response.body.supportsExceptionInfoRequest = false;
        response.body.supportTerminateDebuggee = false;
        response.body.supportsDelayedStackTraceLoading = false;
        response.body.supportsLoadedSourcesRequest = false;
        response.body.supportsLogPoints = false;
        response.body.supportsTerminateThreadsRequest = false;
        response.body.supportsSetExpression = false;
        response.body.supportsTerminateRequest = false;
        response.body.supportsDataBreakpoints = false;
        response.body.supportsReadMemoryRequest = false;
        response.body.supportsDisassembleRequest = false;
        response.body.supportsCancelRequest = false;
        response.body.supportsBreakpointLocationsRequest = false;
        response.body.supportsClipboardContext = false;
        response.body.supportsSteppingGranularity = false;
        response.body.supportsInstructionBreakpoints = false;
        response.body.supportsExceptionFilterOptions = false;
        this.sendResponse(response);
      }
      disconnectRequest(response, args, request) {
        this.sendResponse(response);
        this.shutdown();
      }
      launchRequest(response, args, request) {
        this.sendResponse(response);
      }
      attachRequest(response, args, request) {
        this.sendResponse(response);
      }
      terminateRequest(response, args, request) {
        this.sendResponse(response);
      }
      restartRequest(response, args, request) {
        this.sendResponse(response);
      }
      setBreakPointsRequest(response, args, request) {
        this.sendResponse(response);
      }
      setFunctionBreakPointsRequest(response, args, request) {
        this.sendResponse(response);
      }
      setExceptionBreakPointsRequest(response, args, request) {
        this.sendResponse(response);
      }
      configurationDoneRequest(response, args, request) {
        this.sendResponse(response);
      }
      continueRequest(response, args, request) {
        this.sendResponse(response);
      }
      nextRequest(response, args, request) {
        this.sendResponse(response);
      }
      stepInRequest(response, args, request) {
        this.sendResponse(response);
      }
      stepOutRequest(response, args, request) {
        this.sendResponse(response);
      }
      stepBackRequest(response, args, request) {
        this.sendResponse(response);
      }
      reverseContinueRequest(response, args, request) {
        this.sendResponse(response);
      }
      restartFrameRequest(response, args, request) {
        this.sendResponse(response);
      }
      gotoRequest(response, args, request) {
        this.sendResponse(response);
      }
      pauseRequest(response, args, request) {
        this.sendResponse(response);
      }
      sourceRequest(response, args, request) {
        this.sendResponse(response);
      }
      threadsRequest(response, request) {
        this.sendResponse(response);
      }
      terminateThreadsRequest(response, args, request) {
        this.sendResponse(response);
      }
      stackTraceRequest(response, args, request) {
        this.sendResponse(response);
      }
      scopesRequest(response, args, request) {
        this.sendResponse(response);
      }
      variablesRequest(response, args, request) {
        this.sendResponse(response);
      }
      setVariableRequest(response, args, request) {
        this.sendResponse(response);
      }
      setExpressionRequest(response, args, request) {
        this.sendResponse(response);
      }
      evaluateRequest(response, args, request) {
        this.sendResponse(response);
      }
      stepInTargetsRequest(response, args, request) {
        this.sendResponse(response);
      }
      gotoTargetsRequest(response, args, request) {
        this.sendResponse(response);
      }
      completionsRequest(response, args, request) {
        this.sendResponse(response);
      }
      exceptionInfoRequest(response, args, request) {
        this.sendResponse(response);
      }
      loadedSourcesRequest(response, args, request) {
        this.sendResponse(response);
      }
      dataBreakpointInfoRequest(response, args, request) {
        this.sendResponse(response);
      }
      setDataBreakpointsRequest(response, args, request) {
        this.sendResponse(response);
      }
      readMemoryRequest(response, args, request) {
        this.sendResponse(response);
      }
      disassembleRequest(response, args, request) {
        this.sendResponse(response);
      }
      cancelRequest(response, args, request) {
        this.sendResponse(response);
      }
      breakpointLocationsRequest(response, args, request) {
        this.sendResponse(response);
      }
      setInstructionBreakpointsRequest(response, args, request) {
        this.sendResponse(response);
      }
      customRequest(command, response, args, request) {
        this.sendErrorResponse(response, 1014, "unrecognized request", null, ErrorDestination2.Telemetry);
      }
      convertClientLineToDebugger(line) {
        if (this._debuggerLinesStartAt1) {
          return this._clientLinesStartAt1 ? line : line + 1;
        }
        return this._clientLinesStartAt1 ? line - 1 : line;
      }
      convertDebuggerLineToClient(line) {
        if (this._debuggerLinesStartAt1) {
          return this._clientLinesStartAt1 ? line : line - 1;
        }
        return this._clientLinesStartAt1 ? line + 1 : line;
      }
      convertClientColumnToDebugger(column) {
        if (this._debuggerColumnsStartAt1) {
          return this._clientColumnsStartAt1 ? column : column + 1;
        }
        return this._clientColumnsStartAt1 ? column - 1 : column;
      }
      convertDebuggerColumnToClient(column) {
        if (this._debuggerColumnsStartAt1) {
          return this._clientColumnsStartAt1 ? column : column - 1;
        }
        return this._clientColumnsStartAt1 ? column + 1 : column;
      }
      convertClientPathToDebugger(clientPath) {
        if (this._clientPathsAreURIs !== this._debuggerPathsAreURIs) {
          if (this._clientPathsAreURIs) {
            return DebugSession2.uri2path(clientPath);
          } else {
            return DebugSession2.path2uri(clientPath);
          }
        }
        return clientPath;
      }
      convertDebuggerPathToClient(debuggerPath) {
        if (this._debuggerPathsAreURIs !== this._clientPathsAreURIs) {
          if (this._debuggerPathsAreURIs) {
            return DebugSession2.uri2path(debuggerPath);
          } else {
            return DebugSession2.path2uri(debuggerPath);
          }
        }
        return debuggerPath;
      }
      static path2uri(path3) {
        if (process.platform === "win32") {
          if (/^[A-Z]:/.test(path3)) {
            path3 = path3[0].toLowerCase() + path3.substr(1);
          }
          path3 = path3.replace(/\\/g, "/");
        }
        path3 = encodeURI(path3);
        let uri = new url_1.URL(`file:`);
        uri.pathname = path3;
        return uri.toString();
      }
      static uri2path(sourceUri) {
        let uri = new url_1.URL(sourceUri);
        let s = decodeURIComponent(uri.pathname);
        if (process.platform === "win32") {
          if (/^\/[a-zA-Z]:/.test(s)) {
            s = s[1].toLowerCase() + s.substr(2);
          }
          s = s.replace(/\//g, "\\");
        }
        return s;
      }
      static formatPII(format, excludePII, args) {
        return format.replace(DebugSession2._formatPIIRegexp, function(match, paramName) {
          if (excludePII && paramName.length > 0 && paramName[0] !== "_") {
            return match;
          }
          return args[paramName] && args.hasOwnProperty(paramName) ? args[paramName] : match;
        });
      }
    };
    exports.DebugSession = DebugSession2;
    DebugSession2._formatPIIRegexp = /{([^}]+)}/g;
  }
});

// node_modules/mkdirp/index.js
var require_mkdirp = __commonJS({
  "node_modules/mkdirp/index.js"(exports, module2) {
    var path3 = require("path");
    var fs4 = require("fs");
    var _0777 = parseInt("0777", 8);
    module2.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;
    function mkdirP(p, opts, f, made) {
      if (typeof opts === "function") {
        f = opts;
        opts = {};
      } else if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs4;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made)
        made = null;
      var cb = f || function() {
      };
      p = path3.resolve(p);
      xfs.mkdir(p, mode, function(er) {
        if (!er) {
          made = made || p;
          return cb(null, made);
        }
        switch (er.code) {
          case "ENOENT":
            if (path3.dirname(p) === p)
              return cb(er);
            mkdirP(path3.dirname(p), opts, function(er2, made2) {
              if (er2)
                cb(er2, made2);
              else
                mkdirP(p, opts, cb, made2);
            });
            break;
          default:
            xfs.stat(p, function(er2, stat) {
              if (er2 || !stat.isDirectory())
                cb(er, made);
              else
                cb(null, made);
            });
            break;
        }
      });
    }
    mkdirP.sync = function sync2(p, opts, made) {
      if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs4;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made)
        made = null;
      p = path3.resolve(p);
      try {
        xfs.mkdirSync(p, mode);
        made = made || p;
      } catch (err0) {
        switch (err0.code) {
          case "ENOENT":
            made = sync2(path3.dirname(p), opts, made);
            sync2(p, opts, made);
            break;
          default:
            var stat;
            try {
              stat = xfs.statSync(p);
            } catch (err1) {
              throw err0;
            }
            if (!stat.isDirectory())
              throw err0;
            break;
        }
      }
      return made;
    };
  }
});

// node_modules/vscode-debugadapter/lib/internalLogger.js
var require_internalLogger = __commonJS({
  "node_modules/vscode-debugadapter/lib/internalLogger.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P || (P = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InternalLogger = void 0;
    var fs4 = require("fs");
    var path3 = require("path");
    var mkdirp = require_mkdirp();
    function mkdirpPromise(folder) {
      return new Promise((resolve2, reject) => {
        mkdirp(folder, (err, made) => {
          if (err) {
            reject(err);
          } else {
            resolve2(made);
          }
        });
      });
    }
    var logger_1 = require_logger();
    var InternalLogger = class {
      constructor(logCallback, isServer) {
        this.beforeExitCallback = () => this.dispose();
        this._logCallback = logCallback;
        this._logToConsole = isServer;
        this._minLogLevel = logger_1.LogLevel.Warn;
        this.disposeCallback = (signal, code) => {
          this.dispose();
          code = code || 2;
          code += 128;
          process.exit(code);
        };
      }
      setup(options) {
        return __awaiter(this, void 0, void 0, function* () {
          this._minLogLevel = options.consoleMinLogLevel;
          this._prependTimestamp = options.prependTimestamp;
          if (options.logFilePath) {
            if (!path3.isAbsolute(options.logFilePath)) {
              this.log(`logFilePath must be an absolute path: ${options.logFilePath}`, logger_1.LogLevel.Error);
            } else {
              const handleError = (err) => this.sendLog(`Error creating log file at path: ${options.logFilePath}. Error: ${err.toString()}
`, logger_1.LogLevel.Error);
              try {
                yield mkdirpPromise(path3.dirname(options.logFilePath));
                this.log(`Verbose logs are written to:
`, logger_1.LogLevel.Warn);
                this.log(options.logFilePath + "\n", logger_1.LogLevel.Warn);
                this._logFileStream = fs4.createWriteStream(options.logFilePath);
                this.logDateTime();
                this.setupShutdownListeners();
                this._logFileStream.on("error", (err) => {
                  handleError(err);
                });
              } catch (err) {
                handleError(err);
              }
            }
          }
        });
      }
      logDateTime() {
        let d = new Date();
        let dateString = d.getUTCFullYear() + `-${d.getUTCMonth() + 1}-` + d.getUTCDate();
        const timeAndDateStamp = dateString + ", " + getFormattedTimeString();
        this.log(timeAndDateStamp + "\n", logger_1.LogLevel.Verbose, false);
      }
      setupShutdownListeners() {
        process.addListener("beforeExit", this.beforeExitCallback);
        process.addListener("SIGTERM", this.disposeCallback);
        process.addListener("SIGINT", this.disposeCallback);
      }
      removeShutdownListeners() {
        process.removeListener("beforeExit", this.beforeExitCallback);
        process.removeListener("SIGTERM", this.disposeCallback);
        process.removeListener("SIGINT", this.disposeCallback);
      }
      dispose() {
        return new Promise((resolve2) => {
          this.removeShutdownListeners();
          if (this._logFileStream) {
            this._logFileStream.end(resolve2);
            this._logFileStream = null;
          } else {
            resolve2();
          }
        });
      }
      log(msg, level, prependTimestamp = true) {
        if (this._minLogLevel === logger_1.LogLevel.Stop) {
          return;
        }
        if (level >= this._minLogLevel) {
          this.sendLog(msg, level);
        }
        if (this._logToConsole) {
          const logFn = level === logger_1.LogLevel.Error ? console.error : level === logger_1.LogLevel.Warn ? console.warn : null;
          if (logFn) {
            logFn(logger_1.trimLastNewline(msg));
          }
        }
        if (level === logger_1.LogLevel.Error) {
          msg = `[${logger_1.LogLevel[level]}] ${msg}`;
        }
        if (this._prependTimestamp && prependTimestamp) {
          msg = "[" + getFormattedTimeString() + "] " + msg;
        }
        if (this._logFileStream) {
          this._logFileStream.write(msg);
        }
      }
      sendLog(msg, level) {
        if (msg.length > 1500) {
          const endsInNewline = !!msg.match(/(\n|\r\n)$/);
          msg = msg.substr(0, 1500) + "[...]";
          if (endsInNewline) {
            msg = msg + "\n";
          }
        }
        if (this._logCallback) {
          const event = new logger_1.LogOutputEvent(msg, level);
          this._logCallback(event);
        }
      }
    };
    exports.InternalLogger = InternalLogger;
    function getFormattedTimeString() {
      let d = new Date();
      let hourString = _padZeroes(2, String(d.getUTCHours()));
      let minuteString = _padZeroes(2, String(d.getUTCMinutes()));
      let secondString = _padZeroes(2, String(d.getUTCSeconds()));
      let millisecondString = _padZeroes(3, String(d.getUTCMilliseconds()));
      return hourString + ":" + minuteString + ":" + secondString + "." + millisecondString + " UTC";
    }
    function _padZeroes(minDesiredLength, numberToPad) {
      if (numberToPad.length >= minDesiredLength) {
        return numberToPad;
      } else {
        return String("0".repeat(minDesiredLength) + numberToPad).slice(-minDesiredLength);
      }
    }
  }
});

// node_modules/vscode-debugadapter/lib/logger.js
var require_logger = __commonJS({
  "node_modules/vscode-debugadapter/lib/logger.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trimLastNewline = exports.LogOutputEvent = exports.logger = exports.Logger = exports.LogLevel = void 0;
    var internalLogger_1 = require_internalLogger();
    var debugSession_1 = require_debugSession();
    var LogLevel;
    (function(LogLevel2) {
      LogLevel2[LogLevel2["Verbose"] = 0] = "Verbose";
      LogLevel2[LogLevel2["Log"] = 1] = "Log";
      LogLevel2[LogLevel2["Warn"] = 2] = "Warn";
      LogLevel2[LogLevel2["Error"] = 3] = "Error";
      LogLevel2[LogLevel2["Stop"] = 4] = "Stop";
    })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    var Logger2 = class {
      constructor() {
        this._pendingLogQ = [];
      }
      log(msg, level = LogLevel.Log) {
        msg = msg + "\n";
        this._write(msg, level);
      }
      verbose(msg) {
        this.log(msg, LogLevel.Verbose);
      }
      warn(msg) {
        this.log(msg, LogLevel.Warn);
      }
      error(msg) {
        this.log(msg, LogLevel.Error);
      }
      dispose() {
        if (this._currentLogger) {
          const disposeP = this._currentLogger.dispose();
          this._currentLogger = null;
          return disposeP;
        } else {
          return Promise.resolve();
        }
      }
      _write(msg, level = LogLevel.Log) {
        msg = msg + "";
        if (this._pendingLogQ) {
          this._pendingLogQ.push({ msg, level });
        } else if (this._currentLogger) {
          this._currentLogger.log(msg, level);
        }
      }
      setup(consoleMinLogLevel, _logFilePath, prependTimestamp = true) {
        const logFilePath = typeof _logFilePath === "string" ? _logFilePath : _logFilePath && this._logFilePathFromInit;
        if (this._currentLogger) {
          const options = {
            consoleMinLogLevel,
            logFilePath,
            prependTimestamp
          };
          this._currentLogger.setup(options).then(() => {
            if (this._pendingLogQ) {
              const logQ = this._pendingLogQ;
              this._pendingLogQ = null;
              logQ.forEach((item) => this._write(item.msg, item.level));
            }
          });
        }
      }
      init(logCallback, logFilePath, logToConsole) {
        this._pendingLogQ = this._pendingLogQ || [];
        this._currentLogger = new internalLogger_1.InternalLogger(logCallback, logToConsole);
        this._logFilePathFromInit = logFilePath;
      }
    };
    exports.Logger = Logger2;
    exports.logger = new Logger2();
    var LogOutputEvent = class extends debugSession_1.OutputEvent {
      constructor(msg, level) {
        const category = level === LogLevel.Error ? "stderr" : level === LogLevel.Warn ? "console" : "stdout";
        super(msg, category);
      }
    };
    exports.LogOutputEvent = LogOutputEvent;
    function trimLastNewline(str) {
      return str.replace(/(\n|\r\n)$/, "");
    }
    exports.trimLastNewline = trimLastNewline;
  }
});

// node_modules/vscode-debugadapter/lib/loggingDebugSession.js
var require_loggingDebugSession = __commonJS({
  "node_modules/vscode-debugadapter/lib/loggingDebugSession.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoggingDebugSession = void 0;
    var Logger2 = require_logger();
    var logger2 = Logger2.logger;
    var debugSession_1 = require_debugSession();
    var LoggingDebugSession2 = class extends debugSession_1.DebugSession {
      constructor(obsolete_logFilePath, obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer) {
        super(obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer);
        this.obsolete_logFilePath = obsolete_logFilePath;
        this.on("error", (event) => {
          logger2.error(event.body);
        });
      }
      start(inStream, outStream) {
        super.start(inStream, outStream);
        logger2.init((e) => this.sendEvent(e), this.obsolete_logFilePath, this._isServer);
      }
      sendEvent(event) {
        if (!(event instanceof Logger2.LogOutputEvent)) {
          let objectToLog = event;
          if (event instanceof debugSession_1.OutputEvent && event.body && event.body.data && event.body.data.doNotLogOutput) {
            delete event.body.data.doNotLogOutput;
            objectToLog = Object.assign({}, event);
            objectToLog.body = Object.assign(Object.assign({}, event.body), { output: "<output not logged>" });
          }
          logger2.verbose(`To client: ${JSON.stringify(objectToLog)}`);
        }
        super.sendEvent(event);
      }
      sendRequest(command, args, timeout, cb) {
        logger2.verbose(`To client: ${JSON.stringify(command)}(${JSON.stringify(args)}), timeout: ${timeout}`);
        super.sendRequest(command, args, timeout, cb);
      }
      sendResponse(response) {
        logger2.verbose(`To client: ${JSON.stringify(response)}`);
        super.sendResponse(response);
      }
      dispatchRequest(request) {
        logger2.verbose(`From client: ${request.command}(${JSON.stringify(request.arguments)})`);
        super.dispatchRequest(request);
      }
    };
    exports.LoggingDebugSession = LoggingDebugSession2;
  }
});

// node_modules/vscode-debugadapter/lib/handles.js
var require_handles = __commonJS({
  "node_modules/vscode-debugadapter/lib/handles.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Handles = void 0;
    var Handles2 = class {
      constructor(startHandle) {
        this.START_HANDLE = 1e3;
        this._handleMap = new Map();
        this._nextHandle = typeof startHandle === "number" ? startHandle : this.START_HANDLE;
      }
      reset() {
        this._nextHandle = this.START_HANDLE;
        this._handleMap = new Map();
      }
      create(value) {
        var handle = this._nextHandle++;
        this._handleMap.set(handle, value);
        return handle;
      }
      get(handle, dflt) {
        return this._handleMap.get(handle) || dflt;
      }
    };
    exports.Handles = Handles2;
  }
});

// node_modules/vscode-debugadapter/lib/main.js
var require_main = __commonJS({
  "node_modules/vscode-debugadapter/lib/main.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Handles = exports.Response = exports.Event = exports.ErrorDestination = exports.CompletionItem = exports.Module = exports.Source = exports.Breakpoint = exports.Variable = exports.Scope = exports.StackFrame = exports.Thread = exports.InvalidatedEvent = exports.ProgressEndEvent = exports.ProgressUpdateEvent = exports.ProgressStartEvent = exports.CapabilitiesEvent = exports.LoadedSourceEvent = exports.ModuleEvent = exports.BreakpointEvent = exports.ThreadEvent = exports.OutputEvent = exports.ContinuedEvent = exports.StoppedEvent = exports.TerminatedEvent = exports.InitializedEvent = exports.logger = exports.Logger = exports.LoggingDebugSession = exports.DebugSession = void 0;
    var debugSession_1 = require_debugSession();
    Object.defineProperty(exports, "DebugSession", { enumerable: true, get: function() {
      return debugSession_1.DebugSession;
    } });
    Object.defineProperty(exports, "InitializedEvent", { enumerable: true, get: function() {
      return debugSession_1.InitializedEvent;
    } });
    Object.defineProperty(exports, "TerminatedEvent", { enumerable: true, get: function() {
      return debugSession_1.TerminatedEvent;
    } });
    Object.defineProperty(exports, "StoppedEvent", { enumerable: true, get: function() {
      return debugSession_1.StoppedEvent;
    } });
    Object.defineProperty(exports, "ContinuedEvent", { enumerable: true, get: function() {
      return debugSession_1.ContinuedEvent;
    } });
    Object.defineProperty(exports, "OutputEvent", { enumerable: true, get: function() {
      return debugSession_1.OutputEvent;
    } });
    Object.defineProperty(exports, "ThreadEvent", { enumerable: true, get: function() {
      return debugSession_1.ThreadEvent;
    } });
    Object.defineProperty(exports, "BreakpointEvent", { enumerable: true, get: function() {
      return debugSession_1.BreakpointEvent;
    } });
    Object.defineProperty(exports, "ModuleEvent", { enumerable: true, get: function() {
      return debugSession_1.ModuleEvent;
    } });
    Object.defineProperty(exports, "LoadedSourceEvent", { enumerable: true, get: function() {
      return debugSession_1.LoadedSourceEvent;
    } });
    Object.defineProperty(exports, "CapabilitiesEvent", { enumerable: true, get: function() {
      return debugSession_1.CapabilitiesEvent;
    } });
    Object.defineProperty(exports, "ProgressStartEvent", { enumerable: true, get: function() {
      return debugSession_1.ProgressStartEvent;
    } });
    Object.defineProperty(exports, "ProgressUpdateEvent", { enumerable: true, get: function() {
      return debugSession_1.ProgressUpdateEvent;
    } });
    Object.defineProperty(exports, "ProgressEndEvent", { enumerable: true, get: function() {
      return debugSession_1.ProgressEndEvent;
    } });
    Object.defineProperty(exports, "InvalidatedEvent", { enumerable: true, get: function() {
      return debugSession_1.InvalidatedEvent;
    } });
    Object.defineProperty(exports, "Thread", { enumerable: true, get: function() {
      return debugSession_1.Thread;
    } });
    Object.defineProperty(exports, "StackFrame", { enumerable: true, get: function() {
      return debugSession_1.StackFrame;
    } });
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return debugSession_1.Scope;
    } });
    Object.defineProperty(exports, "Variable", { enumerable: true, get: function() {
      return debugSession_1.Variable;
    } });
    Object.defineProperty(exports, "Breakpoint", { enumerable: true, get: function() {
      return debugSession_1.Breakpoint;
    } });
    Object.defineProperty(exports, "Source", { enumerable: true, get: function() {
      return debugSession_1.Source;
    } });
    Object.defineProperty(exports, "Module", { enumerable: true, get: function() {
      return debugSession_1.Module;
    } });
    Object.defineProperty(exports, "CompletionItem", { enumerable: true, get: function() {
      return debugSession_1.CompletionItem;
    } });
    Object.defineProperty(exports, "ErrorDestination", { enumerable: true, get: function() {
      return debugSession_1.ErrorDestination;
    } });
    var loggingDebugSession_1 = require_loggingDebugSession();
    Object.defineProperty(exports, "LoggingDebugSession", { enumerable: true, get: function() {
      return loggingDebugSession_1.LoggingDebugSession;
    } });
    var Logger2 = require_logger();
    exports.Logger = Logger2;
    var messages_1 = require_messages();
    Object.defineProperty(exports, "Event", { enumerable: true, get: function() {
      return messages_1.Event;
    } });
    Object.defineProperty(exports, "Response", { enumerable: true, get: function() {
      return messages_1.Response;
    } });
    var handles_1 = require_handles();
    Object.defineProperty(exports, "Handles", { enumerable: true, get: function() {
      return handles_1.Handles;
    } });
    var logger2 = Logger2.logger;
    exports.logger = logger2;
  }
});

// third_party/tree-kill/index.js
var require_tree_kill = __commonJS({
  "third_party/tree-kill/index.js"(exports, module2) {
    "use strict";
    var childProcess = require("child_process");
    var { existsSync: existsSync2 } = require("fs");
    var spawn2 = childProcess.spawn;
    var exec = childProcess.exec;
    module2.exports = function(pid, signal, callback) {
      if (typeof signal === "function" && callback === void 0) {
        callback = signal;
        signal = void 0;
      }
      pid = parseInt(pid);
      if (Number.isNaN(pid)) {
        if (callback) {
          return callback(new Error("pid must be a number"));
        } else {
          throw new Error("pid must be a number");
        }
      }
      var tree = {};
      var pidsToProcess = {};
      tree[pid] = [];
      pidsToProcess[pid] = 1;
      switch (process.platform) {
        case "win32":
          exec("taskkill /pid " + pid + " /T /F", callback);
          break;
        case "darwin":
          buildProcessTree(pid, tree, pidsToProcess, function(parentPid) {
            return spawn2(pathToPgrep(), ["-P", parentPid]);
          }, function() {
            killAll(tree, signal, callback);
          });
          break;
        default:
          buildProcessTree(pid, tree, pidsToProcess, function(parentPid) {
            return spawn2("ps", ["-o", "pid", "--no-headers", "--ppid", parentPid]);
          }, function() {
            killAll(tree, signal, callback);
          });
          break;
      }
    };
    function killAll(tree, signal, callback) {
      var killed = {};
      try {
        Object.keys(tree).forEach(function(pid) {
          tree[pid].forEach(function(pidpid) {
            if (!killed[pidpid]) {
              killPid(pidpid, signal);
              killed[pidpid] = 1;
            }
          });
          if (!killed[pid]) {
            killPid(pid, signal);
            killed[pid] = 1;
          }
        });
      } catch (err) {
        if (callback) {
          return callback(err);
        } else {
          throw err;
        }
      }
      if (callback) {
        return callback();
      }
    }
    function killPid(pid, signal) {
      try {
        process.kill(parseInt(pid, 10), signal);
      } catch (err) {
        if (err.code !== "ESRCH")
          throw err;
      }
    }
    function buildProcessTree(parentPid, tree, pidsToProcess, spawnChildProcessesList, cb) {
      var ps = spawnChildProcessesList(parentPid);
      var allData = "";
      ps.stdout.on("data", function(data) {
        var data = data.toString("ascii");
        allData += data;
      });
      var onClose = function(code) {
        delete pidsToProcess[parentPid];
        if (code != 0) {
          if (Object.keys(pidsToProcess).length == 0) {
            cb();
          }
          return;
        }
        allData.match(/\d+/g).forEach(function(pid) {
          pid = parseInt(pid, 10);
          tree[parentPid].push(pid);
          tree[pid] = [];
          pidsToProcess[pid] = 1;
          buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
        });
      };
      ps.on("close", onClose);
    }
    var pgrep = "";
    function pathToPgrep() {
      if (pgrep) {
        return pgrep;
      }
      try {
        pgrep = existsSync2("/usr/bin/pgrep") ? "/usr/bin/pgrep" : "pgrep";
      } catch (e) {
        pgrep = "pgrep";
      }
      return pgrep;
    }
  }
});

// src/debugAdapter/goDebug.ts
__export(exports, {
  Delve: () => Delve,
  GoDebugSession: () => GoDebugSession,
  RemoteSourcesAndPackages: () => RemoteSourcesAndPackages,
  escapeGoModPath: () => escapeGoModPath,
  findPathSeparator: () => findPathSeparator,
  normalizeSeparators: () => normalizeSeparators
});
var import_child_process = __toModule(require("child_process"));
var import_events = __toModule(require("events"));
var fs3 = __toModule(require("fs"));
var import_fs = __toModule(require("fs"));
var glob = __toModule(require_glob());
var import_json_rpc2 = __toModule(require_jsonrpc());
var os2 = __toModule(require("os"));
var path2 = __toModule(require("path"));
var util = __toModule(require("util"));
var import_vscode_debugadapter = __toModule(require_main());

// src/utils/envUtils.ts
"use strict";
var fs = require("fs");
function stripBOM(s) {
  if (s && s[0] === "\uFEFF") {
    s = s.substr(1);
  }
  return s;
}
function parseEnvFile(envFilePath) {
  const env = {};
  if (!envFilePath) {
    return env;
  }
  try {
    const buffer = stripBOM(fs.readFileSync(envFilePath, "utf8"));
    buffer.split("\n").forEach((line) => {
      const r = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
      if (r !== null) {
        let value = r[2] || "";
        if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          value = value.replace(/\\n/gm, "\n");
        }
        env[r[1]] = value.replace(/(^['"]|['"]$)/g, "");
      }
    });
    return env;
  } catch (e) {
    throw new Error(`Cannot load environment variables from file ${envFilePath}`);
  }
}
function parseEnvFiles(envFiles) {
  const fileEnvs = [];
  if (typeof envFiles === "string") {
    fileEnvs.push(parseEnvFile(envFiles));
  }
  if (Array.isArray(envFiles)) {
    envFiles.forEach((envFile) => {
      fileEnvs.push(parseEnvFile(envFile));
    });
  }
  return Object.assign({}, ...fileEnvs);
}

// src/utils/pathUtils.ts
var import_util = __toModule(require("util"));

// src/goLogging.ts
"use strict";

// src/utils/pathUtils.ts
"use strict";
var fs2 = require("fs");
var os = require("os");
var path = require("path");
var binPathCache = {};
var envPath = process.env["PATH"] || (process.platform === "win32" ? process.env["Path"] : null);
function getBinPathFromEnvVar(toolName, envVarValue, appendBinToPath) {
  toolName = correctBinname(toolName);
  if (envVarValue) {
    const paths = envVarValue.split(path.delimiter);
    for (const p of paths) {
      const binpath = path.join(p, appendBinToPath ? "bin" : "", toolName);
      if (executableFileExists(binpath)) {
        return binpath;
      }
    }
  }
  return null;
}
function getBinPathWithPreferredGopathGoroot(toolName, preferredGopaths, preferredGoroot, alternateTool, useCache = true) {
  const r = getBinPathWithPreferredGopathGorootWithExplanation(toolName, preferredGopaths, preferredGoroot, alternateTool, useCache);
  return r.binPath;
}
function getBinPathWithPreferredGopathGorootWithExplanation(toolName, preferredGopaths, preferredGoroot, alternateTool, useCache = true) {
  if (alternateTool && path.isAbsolute(alternateTool) && executableFileExists(alternateTool)) {
    binPathCache[toolName] = alternateTool;
    return { binPath: alternateTool, why: "alternateTool" };
  }
  if (useCache && binPathCache[toolName]) {
    return { binPath: binPathCache[toolName], why: "cached" };
  }
  const binname = alternateTool && !path.isAbsolute(alternateTool) ? alternateTool : toolName;
  const found = (why) => binname === toolName ? why : "alternateTool";
  const pathFromGoBin = getBinPathFromEnvVar(binname, process.env["GOBIN"], false);
  if (pathFromGoBin) {
    binPathCache[toolName] = pathFromGoBin;
    return { binPath: pathFromGoBin, why: binname === toolName ? "gobin" : "alternateTool" };
  }
  for (const preferred of preferredGopaths) {
    if (typeof preferred === "string") {
      const pathFrompreferredGoPath = getBinPathFromEnvVar(binname, preferred, true);
      if (pathFrompreferredGoPath) {
        binPathCache[toolName] = pathFrompreferredGoPath;
        return { binPath: pathFrompreferredGoPath, why: found("gopath") };
      }
    }
  }
  const pathFromGoRoot = getBinPathFromEnvVar(binname, preferredGoroot || getCurrentGoRoot(), true);
  if (pathFromGoRoot) {
    binPathCache[toolName] = pathFromGoRoot;
    return { binPath: pathFromGoRoot, why: found("goroot") };
  }
  const pathFromPath = getBinPathFromEnvVar(binname, envPath, false);
  if (pathFromPath) {
    binPathCache[toolName] = pathFromPath;
    return { binPath: pathFromPath, why: found("path") };
  }
  if (toolName === "go") {
    const defaultPathsForGo = process.platform === "win32" ? ["C:\\Program Files\\Go\\bin\\go.exe", "C:\\Program Files (x86)\\Go\\bin\\go.exe"] : ["/usr/local/go/bin/go", "/usr/local/bin/go"];
    for (const p of defaultPathsForGo) {
      if (executableFileExists(p)) {
        binPathCache[toolName] = p;
        return { binPath: p, why: "default" };
      }
    }
    return { binPath: "" };
  }
  return { binPath: toolName };
}
var currentGoRoot = "";
function getCurrentGoRoot() {
  return currentGoRoot || process.env["GOROOT"] || "";
}
function correctBinname(toolName) {
  if (process.platform === "win32") {
    return toolName + ".exe";
  }
  return toolName;
}
function executableFileExists(filePath) {
  let exists = true;
  try {
    exists = fs2.statSync(filePath).isFile();
    if (exists) {
      fs2.accessSync(filePath, fs2.constants.F_OK | fs2.constants.X_OK);
    }
  } catch (e) {
    exists = false;
  }
  return exists;
}
function getInferredGopath(folderPath) {
  if (!folderPath) {
    return;
  }
  const dirs = folderPath.toLowerCase().split(path.sep);
  const srcIdx = dirs.lastIndexOf("src");
  if (srcIdx > 0) {
    return folderPath.substr(0, dirs.slice(0, srcIdx).join(path.sep).length);
  }
}
function getCurrentGoWorkspaceFromGOPATH(gopath, currentFileDirPath) {
  if (!gopath) {
    return;
  }
  const workspaces = gopath.split(path.delimiter);
  let currentWorkspace = "";
  currentFileDirPath = fixDriveCasingInWindows(currentFileDirPath);
  for (const workspace of workspaces) {
    const possibleCurrentWorkspace = path.join(workspace, "src");
    if (currentFileDirPath.startsWith(possibleCurrentWorkspace) || process.platform === "win32" && currentFileDirPath.toLowerCase().startsWith(possibleCurrentWorkspace.toLowerCase())) {
      if (possibleCurrentWorkspace.length > currentWorkspace.length) {
        currentWorkspace = currentFileDirPath.substr(0, possibleCurrentWorkspace.length);
      }
    }
  }
  return currentWorkspace;
}
function fixDriveCasingInWindows(pathToFix) {
  return process.platform === "win32" && pathToFix ? pathToFix.substr(0, 1).toUpperCase() + pathToFix.substr(1) : pathToFix;
}
function expandFilePathInOutput(output, cwd) {
  const lines = output.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const matches = lines[i].match(/\s*(\S+\.go):(\d+):/);
    if (matches && matches[1] && !path.isAbsolute(matches[1])) {
      lines[i] = lines[i].replace(matches[1], path.join(cwd, matches[1]));
    }
  }
  return lines.join("\n");
}

// src/utils/processUtils.ts
var kill = require_tree_kill();
function killProcessTree(p, logger2) {
  if (!logger2) {
    logger2 = console.log;
  }
  if (!p || !p.pid || p.exitCode !== null) {
    return Promise.resolve();
  }
  return new Promise((resolve2) => {
    kill(p.pid, (err) => {
      if (err) {
        logger2(`Error killing process ${p.pid}: ${err}`);
      }
      resolve2();
    });
  });
}

// src/debugAdapter/goDebug.ts
var fsAccess = util.promisify(fs3.access);
var fsUnlink = util.promisify(fs3.unlink);
var GoReflectKind;
(function(GoReflectKind2) {
  GoReflectKind2[GoReflectKind2["Invalid"] = 0] = "Invalid";
  GoReflectKind2[GoReflectKind2["Bool"] = 1] = "Bool";
  GoReflectKind2[GoReflectKind2["Int"] = 2] = "Int";
  GoReflectKind2[GoReflectKind2["Int8"] = 3] = "Int8";
  GoReflectKind2[GoReflectKind2["Int16"] = 4] = "Int16";
  GoReflectKind2[GoReflectKind2["Int32"] = 5] = "Int32";
  GoReflectKind2[GoReflectKind2["Int64"] = 6] = "Int64";
  GoReflectKind2[GoReflectKind2["Uint"] = 7] = "Uint";
  GoReflectKind2[GoReflectKind2["Uint8"] = 8] = "Uint8";
  GoReflectKind2[GoReflectKind2["Uint16"] = 9] = "Uint16";
  GoReflectKind2[GoReflectKind2["Uint32"] = 10] = "Uint32";
  GoReflectKind2[GoReflectKind2["Uint64"] = 11] = "Uint64";
  GoReflectKind2[GoReflectKind2["Uintptr"] = 12] = "Uintptr";
  GoReflectKind2[GoReflectKind2["Float32"] = 13] = "Float32";
  GoReflectKind2[GoReflectKind2["Float64"] = 14] = "Float64";
  GoReflectKind2[GoReflectKind2["Complex64"] = 15] = "Complex64";
  GoReflectKind2[GoReflectKind2["Complex128"] = 16] = "Complex128";
  GoReflectKind2[GoReflectKind2["Array"] = 17] = "Array";
  GoReflectKind2[GoReflectKind2["Chan"] = 18] = "Chan";
  GoReflectKind2[GoReflectKind2["Func"] = 19] = "Func";
  GoReflectKind2[GoReflectKind2["Interface"] = 20] = "Interface";
  GoReflectKind2[GoReflectKind2["Map"] = 21] = "Map";
  GoReflectKind2[GoReflectKind2["Ptr"] = 22] = "Ptr";
  GoReflectKind2[GoReflectKind2["Slice"] = 23] = "Slice";
  GoReflectKind2[GoReflectKind2["String"] = 24] = "String";
  GoReflectKind2[GoReflectKind2["Struct"] = 25] = "Struct";
  GoReflectKind2[GoReflectKind2["UnsafePointer"] = 26] = "UnsafePointer";
})(GoReflectKind || (GoReflectKind = {}));
var GoVariableFlags;
(function(GoVariableFlags2) {
  GoVariableFlags2[GoVariableFlags2["VariableEscaped"] = 1] = "VariableEscaped";
  GoVariableFlags2[GoVariableFlags2["VariableShadowed"] = 2] = "VariableShadowed";
  GoVariableFlags2[GoVariableFlags2["VariableConstant"] = 4] = "VariableConstant";
  GoVariableFlags2[GoVariableFlags2["VariableArgument"] = 8] = "VariableArgument";
  GoVariableFlags2[GoVariableFlags2["VariableReturnArgument"] = 16] = "VariableReturnArgument";
  GoVariableFlags2[GoVariableFlags2["VariableFakeAddress"] = 32] = "VariableFakeAddress";
})(GoVariableFlags || (GoVariableFlags = {}));
var unrecoveredPanicID = -1;
var fatalThrowID = -2;
process.on("uncaughtException", (err) => {
  const errMessage = err && (err.stack || err.message);
  import_vscode_debugadapter.logger.error(`Unhandled error in debug adapter: ${errMessage}`);
  throw err;
});
function logArgsToString(args) {
  return args.map((arg) => {
    return typeof arg === "string" ? arg : JSON.stringify(arg);
  }).join(" ");
}
function log(...args) {
  import_vscode_debugadapter.logger.warn(logArgsToString(args));
}
function logError(...args) {
  import_vscode_debugadapter.logger.error(logArgsToString(args));
}
function findPathSeparator(filePath) {
  return filePath && filePath.includes("\\") ? "\\" : "/";
}
function compareFilePathIgnoreSeparator(firstFilePath, secondFilePath) {
  const firstSeparator = findPathSeparator(firstFilePath);
  const secondSeparator = findPathSeparator(secondFilePath);
  if (firstSeparator === secondSeparator) {
    return firstFilePath === secondFilePath;
  }
  return firstFilePath === secondFilePath.split(secondSeparator).join(firstSeparator);
}
function escapeGoModPath(filePath) {
  return filePath.replace(/[A-Z]/g, (match) => `!${match.toLocaleLowerCase()}`);
}
function normalizePath(filePath) {
  if (process.platform === "win32") {
    const pathSeparator = findPathSeparator(filePath);
    filePath = path2.normalize(filePath);
    filePath = filePath.replace(/\\/g, pathSeparator);
    return fixDriveCasingInWindows(filePath);
  }
  return filePath;
}
function normalizeSeparators(filePath) {
  if (filePath.indexOf(":") === 1) {
    filePath = filePath.substr(0, 1).toUpperCase() + filePath.substr(1);
  }
  return filePath.replace(/\/|\\/g, "/");
}
function getBaseName(filePath) {
  return filePath.includes("/") ? path2.basename(filePath) : path2.win32.basename(filePath);
}
var Delve = class {
  constructor(launchArgs, program) {
    this.delveConnectionClosed = false;
    this.request = launchArgs.request;
    this.program = normalizePath(program);
    this.remotePath = launchArgs.remotePath;
    this.isApiV1 = false;
    if (typeof launchArgs.apiVersion === "number") {
      this.isApiV1 = launchArgs.apiVersion === 1;
    }
    this.stackTraceDepth = typeof launchArgs.stackTraceDepth === "number" ? launchArgs.stackTraceDepth : 50;
    this.connection = new Promise((resolve2, reject) => __async(this, null, function* () {
      const mode = launchArgs.mode;
      let dlvCwd = path2.dirname(program);
      let serverRunning = false;
      const dlvArgs = new Array();
      this.loadConfig = launchArgs.dlvLoadConfig || {
        followPointers: true,
        maxVariableRecurse: 1,
        maxStringLen: 64,
        maxArrayValues: 64,
        maxStructFields: -1
      };
      if (mode === "remote") {
        log(`Start remote debugging: connecting ${launchArgs.host}:${launchArgs.port}`);
        this.debugProcess = null;
        this.isRemoteDebugging = true;
        this.goroot = yield queryGOROOT(dlvCwd, process.env);
        serverRunning = true;
        connectClient(launchArgs.port, launchArgs.host);
        return;
      }
      this.isRemoteDebugging = false;
      let env;
      if (launchArgs.request === "launch") {
        let isProgramDirectory = false;
        if (!program) {
          return reject("The program attribute is missing in the debug configuration in launch.json");
        }
        try {
          const pstats = (0, import_fs.lstatSync)(program);
          if (pstats.isDirectory()) {
            if (mode === "exec") {
              logError(`The program "${program}" must not be a directory in exec mode`);
              return reject("The program attribute must be an executable in exec mode");
            }
            dlvCwd = program;
            isProgramDirectory = true;
          } else if (mode !== "exec" && path2.extname(program) !== ".go") {
            logError(`The program "${program}" must be a valid go file in debug mode`);
            return reject("The program attribute must be a directory or .go file in debug mode");
          }
        } catch (e) {
          logError(`The program "${program}" does not exist: ${e}`);
          return reject("The program attribute must point to valid directory, .go file or executable.");
        }
        try {
          const fileEnvs = parseEnvFiles(launchArgs.envFile);
          const launchArgsEnv = launchArgs.env || {};
          env = Object.assign({}, process.env, fileEnvs, launchArgsEnv);
        } catch (e) {
          return reject(`failed to process 'envFile' and 'env' settings: ${e}`);
        }
        const dirname2 = isProgramDirectory ? program : path2.dirname(program);
        if (!env["GOPATH"] && (mode === "debug" || mode === "test")) {
          env["GOPATH"] = getInferredGopath(dirname2) || env["GOPATH"];
        }
        this.dlvEnv = env;
        this.goroot = yield queryGOROOT(dlvCwd, env);
        log(`Using GOPATH: ${env["GOPATH"]}`);
        log(`Using GOROOT: ${this.goroot}`);
        log(`Using PATH: ${env["PATH"]}`);
        if (launchArgs.noDebug) {
          if (mode === "debug") {
            this.noDebug = true;
            const build = ["build"];
            const output = path2.join(os2.tmpdir(), correctBinname("out"));
            build.push(`-o=${output}`);
            const buildOptions = { cwd: dirname2, env };
            if (launchArgs.buildFlags) {
              build.push(launchArgs.buildFlags);
            }
            if (isProgramDirectory) {
              build.push(".");
            } else {
              build.push(program);
            }
            const goExe = getBinPathWithPreferredGopathGoroot("go", []);
            log(`Current working directory: ${dirname2}`);
            log(`Building: ${goExe} ${build.join(" ")}`);
            const buffer = (0, import_child_process.spawnSync)(goExe, build, buildOptions);
            if (buffer.stderr && buffer.stderr.length > 0) {
              const str = buffer.stderr.toString();
              if (this.onstderr) {
                this.onstderr(str);
              }
            }
            if (buffer.stdout && buffer.stdout.length > 0) {
              const str = buffer.stdout.toString();
              if (this.onstdout) {
                this.onstdout(str);
              }
            }
            if (buffer.status) {
              logError(`Build process exiting with code: ${buffer.status} signal: ${buffer.signal}`);
              if (this.onclose) {
                this.onclose(buffer.status);
              }
            } else {
              log(`Build process exiting normally ${buffer.signal}`);
            }
            if (buffer.error) {
              reject(buffer.error);
            }
            let wd = dirname2;
            if (launchArgs.cwd) {
              wd = launchArgs.cwd;
            }
            const runOptions = { cwd: wd, env };
            const run = [];
            if (launchArgs.args) {
              run.push(...launchArgs.args);
            }
            log(`Current working directory: ${wd}`);
            log(`Running: ${output} ${run.join(" ")}`);
            this.debugProcess = (0, import_child_process.spawn)(output, run, runOptions);
            this.debugProcess.stderr.on("data", (chunk) => {
              const str = chunk.toString();
              if (this.onstderr) {
                this.onstderr(str);
              }
            });
            this.debugProcess.stdout.on("data", (chunk) => {
              const str = chunk.toString();
              if (this.onstdout) {
                this.onstdout(str);
              }
            });
            this.debugProcess.on("close", (code) => {
              if (code) {
                logError(`Process exiting with code: ${code} signal: ${this.debugProcess.killed}`);
              } else {
                log(`Process exiting normally ${this.debugProcess.killed}`);
              }
              if (this.onclose) {
                this.onclose(code);
              }
            });
            this.debugProcess.on("error", (err) => {
              reject(err);
            });
            resolve2(null);
            return;
          }
        }
        this.noDebug = false;
        if (!(0, import_fs.existsSync)(launchArgs.dlvToolPath)) {
          log(`Couldn't find dlv at the Go tools path, ${process.env["GOPATH"]}${env["GOPATH"] ? ", " + env["GOPATH"] : ""} or ${envPath}`);
          return reject('Cannot find Delve debugger. Install from https://github.com/go-delve/delve & ensure it is in your Go tools path, "GOPATH/bin" or "PATH".');
        }
        const currentGOWorkspace = getCurrentGoWorkspaceFromGOPATH(env["GOPATH"], dirname2);
        if (!launchArgs.packagePathToGoModPathMap) {
          launchArgs.packagePathToGoModPathMap = {};
        }
        dlvArgs.push(mode || "debug");
        if (mode === "exec" || mode === "debug" && !isProgramDirectory) {
          dlvArgs.push(program);
        } else if (currentGOWorkspace && !launchArgs.packagePathToGoModPathMap[dirname2]) {
          dlvArgs.push(dirname2.substr(currentGOWorkspace.length + 1));
        }
        if (launchArgs.dlvFlags && launchArgs.dlvFlags.length > 0) {
          dlvArgs.push(...launchArgs.dlvFlags);
        }
        dlvArgs.push("--headless=true", `--listen=${launchArgs.host}:${launchArgs.port}`);
        if (!this.isApiV1) {
          dlvArgs.push("--api-version=2");
        }
        if (launchArgs.showLog) {
          dlvArgs.push("--log=" + launchArgs.showLog.toString());
          if (launchArgs.logOutput) {
            dlvArgs.push("--log-output=" + launchArgs.logOutput);
          }
        }
        if (launchArgs.cwd) {
          dlvArgs.push("--wd=" + launchArgs.cwd);
        }
        if (launchArgs.buildFlags) {
          dlvArgs.push("--build-flags=" + launchArgs.buildFlags);
        }
        if (launchArgs.backend) {
          dlvArgs.push("--backend=" + launchArgs.backend);
        }
        if (launchArgs.output && (mode === "debug" || mode === "test")) {
          dlvArgs.push("--output=" + launchArgs.output);
        }
        if (launchArgs.args && launchArgs.args.length > 0) {
          dlvArgs.push("--", ...launchArgs.args);
        }
        this.localDebugeePath = this.getLocalDebugeePath(launchArgs.output);
      } else if (launchArgs.request === "attach") {
        if (!launchArgs.processId) {
          return reject("Missing process ID");
        }
        if (!(0, import_fs.existsSync)(launchArgs.dlvToolPath)) {
          return reject('Cannot find Delve debugger. Install from https://github.com/go-delve/delve & ensure it is in your Go tools path, "GOPATH/bin" or "PATH".');
        }
        dlvArgs.push("attach", `${launchArgs.processId}`);
        if (launchArgs.dlvFlags && launchArgs.dlvFlags.length > 0) {
          dlvArgs.push(...launchArgs.dlvFlags);
        }
        dlvArgs.push("--headless=true", "--listen=" + launchArgs.host + ":" + launchArgs.port.toString());
        if (!this.isApiV1) {
          dlvArgs.push("--api-version=2");
        }
        if (launchArgs.showLog) {
          dlvArgs.push("--log=" + launchArgs.showLog.toString());
        }
        if (launchArgs.logOutput) {
          dlvArgs.push("--log-output=" + launchArgs.logOutput);
        }
        if (launchArgs.cwd) {
          dlvArgs.push("--wd=" + launchArgs.cwd);
        }
        if (launchArgs.backend) {
          dlvArgs.push("--backend=" + launchArgs.backend);
        }
      }
      log(`Current working directory: ${dlvCwd}`);
      log(`Running: ${launchArgs.dlvToolPath} ${dlvArgs.join(" ")}`);
      this.debugProcess = (0, import_child_process.spawn)(launchArgs.dlvToolPath, dlvArgs, {
        cwd: dlvCwd,
        env
      });
      function connectClient(port, host) {
        setTimeout(() => {
          const client = import_json_rpc2.Client.$create(port, host);
          client.connectSocket((err, conn) => {
            if (err) {
              return reject(err);
            }
            return resolve2(conn);
          });
          client.on("error", reject);
        }, 200);
      }
      this.debugProcess.stderr.on("data", (chunk) => {
        const str = chunk.toString();
        if (this.onstderr) {
          this.onstderr(str);
        }
      });
      this.debugProcess.stdout.on("data", (chunk) => {
        const str = chunk.toString();
        if (this.onstdout) {
          this.onstdout(str);
        }
        if (!serverRunning) {
          serverRunning = true;
          connectClient(launchArgs.port, launchArgs.host);
        }
      });
      this.debugProcess.on("close", (code) => {
        logError("Process exiting with code: " + code);
        if (this.onclose) {
          this.onclose(code);
        }
      });
      this.debugProcess.on("error", (err) => {
        reject(err);
      });
    }));
  }
  call(command, args, callback) {
    this.connection.then((conn) => {
      conn.call("RPCServer." + command, args, callback);
    }, (err) => {
      callback(err, null);
    });
  }
  callPromise(command, args) {
    return new Promise((resolve2, reject) => {
      this.connection.then((conn) => {
        conn.call(`RPCServer.${command}`, args, (err, res) => {
          return err ? reject(err) : resolve2(res);
        });
      }, (err) => {
        reject(err);
      });
    });
  }
  getDebugState() {
    return __async(this, null, function* () {
      const callResult = yield this.callPromise("State", [{ NonBlocking: true }]);
      return this.isApiV1 ? callResult : callResult.State;
    });
  }
  close() {
    return __async(this, null, function* () {
      const forceCleanup = () => __async(this, null, function* () {
        log(`killing debugee (pid: ${this.debugProcess.pid})...`);
        yield killProcessTree(this.debugProcess, log);
        yield removeFile(this.localDebugeePath);
      });
      if (this.noDebug) {
        yield forceCleanup();
        return Promise.resolve();
      }
      const isLocalDebugging = this.request === "launch" && !!this.debugProcess;
      return new Promise((resolve2) => __async(this, null, function* () {
        this.delveConnectionClosed = true;
        if (this.isRemoteDebugging) {
          log("Remote Debugging: close dlv connection.");
          const rpcConnection = yield this.connection;
          rpcConnection["conn"]["end"]();
          return resolve2();
        }
        const timeoutToken = isLocalDebugging && setTimeout(() => __async(this, null, function* () {
          log("Killing debug process manually as we could not halt delve in time");
          yield forceCleanup();
          resolve2();
        }), 1e3);
        let haltErrMsg;
        try {
          log("HaltRequest");
          yield this.callPromise("Command", [{ name: "halt" }]);
        } catch (err) {
          log("HaltResponse");
          haltErrMsg = err ? err.toString() : "";
          log(`Failed to halt - ${haltErrMsg}`);
        }
        clearTimeout(timeoutToken);
        const targetHasExited = haltErrMsg && haltErrMsg.endsWith("has exited with status 0");
        const shouldDetach = !haltErrMsg || targetHasExited;
        let shouldForceClean = !shouldDetach && isLocalDebugging;
        if (shouldDetach) {
          log("DetachRequest");
          try {
            yield this.callPromise("Detach", [this.isApiV1 ? true : { Kill: isLocalDebugging }]);
          } catch (err) {
            log("DetachResponse");
            logError(`Failed to detach - ${err.toString() || ""}`);
            shouldForceClean = isLocalDebugging;
          }
        }
        if (shouldForceClean) {
          yield forceCleanup();
        }
        return resolve2();
      }));
    });
  }
  getLocalDebugeePath(output) {
    const configOutput = output || "debug";
    return path2.isAbsolute(configOutput) ? configOutput : path2.resolve(this.program, configOutput);
  }
};
var GoDebugSession = class extends import_vscode_debugadapter.LoggingDebugSession {
  constructor(debuggerLinesStartAt1, isServer = false, fileSystem = fs3) {
    super("", debuggerLinesStartAt1, isServer);
    this.fileSystem = fileSystem;
    this.packageInfo = new Map();
    this.logLevel = import_vscode_debugadapter.Logger.LogLevel.Error;
    this.initdone = "initdone\xB7";
    this.remoteSourcesAndPackages = new RemoteSourcesAndPackages();
    this.localToRemotePathMapping = new Map();
    this.remoteToLocalPathMapping = new Map();
    this.showGlobalVariables = false;
    this.continueEpoch = 0;
    this.continueRequestRunning = false;
    this.nextEpoch = 0;
    this.nextRequestRunning = false;
    this.variableHandles = new import_vscode_debugadapter.Handles();
    this.skipStopEventOnce = false;
    this.overrideStopReason = "";
    this.stopOnEntry = false;
    this.debugState = null;
    this.delve = null;
    this.breakpoints = new Map();
    this.stackFrameHandles = new import_vscode_debugadapter.Handles();
  }
  initializeRequest(response, args) {
    log("InitializeRequest");
    response.body.supportsConditionalBreakpoints = true;
    response.body.supportsConfigurationDoneRequest = true;
    response.body.supportsSetVariable = true;
    this.sendResponse(response);
    log("InitializeResponse");
  }
  launchRequest(response, args) {
    log("LaunchRequest");
    if (!args.program) {
      this.sendErrorResponse(response, 3e3, "Failed to continue: The program attribute is missing in the debug configuration in launch.json");
      return;
    }
    this.initLaunchAttachRequest(response, args);
  }
  attachRequest(response, args) {
    log("AttachRequest");
    if (args.mode === "local" && !args.processId) {
      this.sendErrorResponse(response, 3e3, "Failed to continue: the processId attribute is missing in the debug configuration in launch.json");
    } else if (args.mode === "remote" && !args.port) {
      this.sendErrorResponse(response, 3e3, "Failed to continue: the port attribute is missing in the debug configuration in launch.json");
    }
    this.initLaunchAttachRequest(response, args);
  }
  disconnectRequest(response, args) {
    return __async(this, null, function* () {
      log("DisconnectRequest");
      if (this.delve) {
        yield Promise.race([
          this.disconnectRequestHelper(response, args),
          new Promise((resolve2) => setTimeout(() => {
            log("DisconnectRequestHelper timed out after 5s.");
            resolve2();
          }, 5e3))
        ]);
      }
      this.shutdownProtocolServer(response, args);
      log("DisconnectResponse");
    });
  }
  disconnectRequestHelper(response, args) {
    return __async(this, null, function* () {
      if (this.delve.delveConnectionClosed) {
        log("Skip disconnectRequestHelper as Delve's connection is already closed.");
        return;
      }
      if (this.delve.isRemoteDebugging) {
        if (!(yield this.isDebuggeeRunning())) {
          log("Issuing a continue command before closing Delve's connection as the debuggee is not running.");
          this.continue();
        }
      }
      log("Closing Delve.");
      yield this.delve.close();
    });
  }
  configurationDoneRequest(response, args) {
    return __async(this, null, function* () {
      log("ConfigurationDoneRequest");
      if (this.stopOnEntry) {
        this.sendEvent(new import_vscode_debugadapter.StoppedEvent("entry", 1));
        log('StoppedEvent("entry")');
      } else if (!(yield this.isDebuggeeRunning())) {
        log("Changing DebugState from Halted to Running");
        this.continue();
      }
      this.sendResponse(response);
      log("ConfigurationDoneResponse", response);
    });
  }
  findPathWithBestMatchingSuffix(filePath, potentialPaths) {
    if (!(potentialPaths == null ? void 0 : potentialPaths.length)) {
      return;
    }
    if (potentialPaths.length === 1) {
      return potentialPaths[0];
    }
    const filePathSegments = filePath.split(/\/|\\/).reverse();
    let bestPathSoFar = potentialPaths[0];
    let bestSegmentsCount = 0;
    for (const potentialPath of potentialPaths) {
      const potentialPathSegments = potentialPath.split(/\/|\\/).reverse();
      let i = 0;
      for (; i < filePathSegments.length && i < potentialPathSegments.length && filePathSegments[i] === potentialPathSegments[i]; i++) {
        if (i > bestSegmentsCount) {
          bestSegmentsCount = i;
          bestPathSoFar = potentialPath;
        }
      }
    }
    return bestPathSoFar;
  }
  inferRemotePathFromLocalPath(localPath) {
    if (this.localToRemotePathMapping.has(localPath)) {
      return this.localToRemotePathMapping.get(localPath);
    }
    const fileName = getBaseName(localPath);
    const potentialMatchingRemoteFiles = this.remoteSourcesAndPackages.remoteSourceFilesNameGrouping.get(fileName);
    const bestMatchingRemoteFile = this.findPathWithBestMatchingSuffix(localPath, potentialMatchingRemoteFiles);
    if (!bestMatchingRemoteFile) {
      return;
    }
    this.localToRemotePathMapping.set(localPath, bestMatchingRemoteFile);
    return bestMatchingRemoteFile;
  }
  toDebuggerPath(filePath) {
    return __async(this, null, function* () {
      if (this.substitutePath.length === 0) {
        if (this.delve.isRemoteDebugging) {
          yield this.initializeRemotePackagesAndSources();
          const matchedRemoteFile = this.inferRemotePathFromLocalPath(filePath);
          if (matchedRemoteFile) {
            return matchedRemoteFile;
          }
        }
        return this.convertClientPathToDebugger(filePath);
      }
      filePath = normalizeSeparators(filePath);
      let substitutedPath = filePath;
      let substituteRule;
      this.substitutePath.forEach((value) => {
        if (filePath.startsWith(value.from)) {
          if (substituteRule) {
            log(`Substitutition rule ${value.from}:${value.to} applies to local path ${filePath} but it was already mapped to debugger path using rule ${substituteRule.from}:${substituteRule.to}`);
            return;
          }
          substitutedPath = filePath.replace(value.from, value.to);
          substituteRule = { from: value.from, to: value.to };
        }
      });
      filePath = substitutedPath;
      return filePath = filePath.replace(/\/|\\/g, this.remotePathSeparator);
    });
  }
  inferLocalPathFromRemotePath(remotePath) {
    if (remotePath === "") {
      return remotePath;
    }
    if (this.remoteToLocalPathMapping.has(remotePath)) {
      return this.remoteToLocalPathMapping.get(remotePath);
    }
    const convertedLocalPackageFile = this.inferLocalPathFromRemoteGoPackage(remotePath);
    if (convertedLocalPackageFile) {
      this.remoteToLocalPathMapping.set(remotePath, convertedLocalPackageFile);
      return convertedLocalPackageFile;
    }
    const fileName = getBaseName(remotePath);
    const globSync = glob.sync(fileName, {
      matchBase: true,
      cwd: this.delve.program
    });
    const bestMatchingLocalPath = this.findPathWithBestMatchingSuffix(remotePath, globSync);
    if (bestMatchingLocalPath) {
      const fullLocalPath = path2.join(this.delve.program, bestMatchingLocalPath);
      this.remoteToLocalPathMapping.set(remotePath, fullLocalPath);
      return fullLocalPath;
    }
  }
  inferLocalPathFromRemoteGoPackage(remotePath) {
    const remotePackage = this.remoteSourcesAndPackages.remotePackagesBuildInfo.find((buildInfo) => remotePath.startsWith(buildInfo.DirectoryPath));
    if (!remotePackage) {
      return;
    }
    if (!this.remotePathSeparator) {
      this.remotePathSeparator = findPathSeparator(remotePackage.DirectoryPath);
    }
    remotePath = escapeGoModPath(remotePath);
    const escapedImportPath = escapeGoModPath(remotePackage.ImportPath);
    const importPathIndex = remotePath.replace(/@v\d+\.\d+\.\d+[^\/]*/, "").indexOf(escapedImportPath);
    if (importPathIndex < 0) {
      return;
    }
    const relativeRemotePath = remotePath.substr(importPathIndex).split(this.remotePathSeparator).join(this.localPathSeparator);
    const pathToConvertWithLocalSeparator = remotePath.split(this.remotePathSeparator).join(this.localPathSeparator);
    const localWorkspacePath = path2.join(this.delve.program, relativeRemotePath);
    if (this.fileSystem.existsSync(localWorkspacePath)) {
      return localWorkspacePath;
    }
    const localGoPathImportPath = this.inferLocalPathInGoPathFromRemoteGoPackage(pathToConvertWithLocalSeparator, relativeRemotePath);
    if (localGoPathImportPath) {
      return localGoPathImportPath;
    }
    return this.inferLocalPathInGoRootFromRemoteGoPackage(pathToConvertWithLocalSeparator, relativeRemotePath);
  }
  inferLocalPathInGoRootFromRemoteGoPackage(remotePathWithLocalSeparator, relativeRemotePath) {
    const srcIndex = remotePathWithLocalSeparator.indexOf(`${this.localPathSeparator}src${this.localPathSeparator}`);
    const goroot = this.getGOROOT();
    const localGoRootImportPath = path2.join(goroot, srcIndex >= 0 ? remotePathWithLocalSeparator.substr(srcIndex) : path2.join("src", relativeRemotePath));
    if (this.fileSystem.existsSync(localGoRootImportPath)) {
      return localGoRootImportPath;
    }
  }
  inferLocalPathInGoPathFromRemoteGoPackage(remotePathWithLocalSeparator, relativeRemotePath) {
    const gopath = (process.env["GOPATH"] || "").split(path2.delimiter)[0];
    const indexGoModCache = remotePathWithLocalSeparator.indexOf(`${this.localPathSeparator}pkg${this.localPathSeparator}mod${this.localPathSeparator}`);
    const localGoPathImportPath = path2.join(gopath, indexGoModCache >= 0 ? remotePathWithLocalSeparator.substr(indexGoModCache) : path2.join("pkg", "mod", relativeRemotePath));
    if (this.fileSystem.existsSync(localGoPathImportPath)) {
      return localGoPathImportPath;
    }
    const localGoPathSrcPath = path2.join(gopath, "src", relativeRemotePath.split(this.remotePathSeparator).join(this.localPathSeparator));
    if (this.fileSystem.existsSync(localGoPathSrcPath)) {
      return localGoPathSrcPath;
    }
  }
  toLocalPath(pathToConvert) {
    if (this.substitutePath.length === 0) {
      if (this.delve.isRemoteDebugging) {
        const inferredPath = this.inferLocalPathFromRemotePath(pathToConvert);
        if (inferredPath) {
          return inferredPath;
        }
      }
      return this.convertDebuggerPathToClient(pathToConvert);
    }
    pathToConvert = normalizeSeparators(pathToConvert);
    let substitutedPath = pathToConvert;
    let substituteRule;
    this.substitutePath.forEach((value) => {
      if (pathToConvert.startsWith(value.to)) {
        if (substituteRule) {
          log(`Substitutition rule ${value.from}:${value.to} applies to debugger path ${pathToConvert} but it was already mapped to local path using rule ${substituteRule.from}:${substituteRule.to}`);
          return;
        }
        substitutedPath = pathToConvert.replace(value.to, value.from);
        substituteRule = { from: value.from, to: value.to };
      }
    });
    pathToConvert = substitutedPath;
    if (!substituteRule) {
      const index = pathToConvert.indexOf(`${this.remotePathSeparator}src${this.remotePathSeparator}`);
      const goroot = this.getGOROOT();
      if (goroot && index > 0) {
        return path2.join(goroot, pathToConvert.substr(index));
      }
      const indexGoModCache = pathToConvert.indexOf(`${this.remotePathSeparator}pkg${this.remotePathSeparator}mod${this.remotePathSeparator}`);
      const gopath = (process.env["GOPATH"] || "").split(path2.delimiter)[0];
      if (gopath && indexGoModCache > 0) {
        return path2.join(gopath, pathToConvert.substr(indexGoModCache).split(this.remotePathSeparator).join(this.localPathSeparator));
      }
    }
    return pathToConvert.split(this.remotePathSeparator).join(this.localPathSeparator);
  }
  setBreakPointsRequest(response, args) {
    return __async(this, null, function* () {
      log("SetBreakPointsRequest");
      if (!(yield this.isDebuggeeRunning())) {
        log("Debuggee is not running. Setting breakpoints without halting.");
        yield this.setBreakPoints(response, args);
      } else {
        this.skipStopEventOnce = this.continueRequestRunning;
        const haltedDuringNext = this.nextRequestRunning;
        if (haltedDuringNext) {
          this.overrideStopReason = "next cancelled";
        }
        log(`Halting before setting breakpoints. SkipStopEventOnce is ${this.skipStopEventOnce}.`);
        this.delve.callPromise("Command", [{ name: "halt" }]).then(() => {
          return this.setBreakPoints(response, args).then(() => {
            if (haltedDuringNext) {
              const warning = "Setting breakpoints during 'next', 'step in' or 'step out' halted delve and cancelled the next request";
              this.sendEvent(new import_vscode_debugadapter.OutputEvent(warning, "stderr"));
              return;
            }
            return this.continue(true).then(null, (err) => {
              this.logDelveError(err, "Failed to continue delve after halting it to set breakpoints");
            });
          });
        }, (err) => {
          this.skipStopEventOnce = false;
          this.logDelveError(err, "Failed to halt delve before attempting to set breakpoint");
          return this.sendErrorResponse(response, 2008, 'Failed to halt delve before attempting to set breakpoint: "{e}"', { e: err.toString() });
        });
      }
    });
  }
  threadsRequest(response) {
    return __async(this, null, function* () {
      if (yield this.isDebuggeeRunning()) {
        response.body = { threads: [new import_vscode_debugadapter.Thread(1, "Dummy")] };
        return this.sendResponse(response);
      } else if (this.debugState && this.debugState.exited) {
        response.body = { threads: [] };
        return this.sendResponse(response);
      }
      log("ThreadsRequest");
      this.delve.call("ListGoroutines", [], (err, out) => {
        if (this.debugState && this.debugState.exited) {
          response.body = { threads: [] };
          return this.sendResponse(response);
        }
        if (err) {
          this.logDelveError(err, "Failed to get threads");
          return this.sendErrorResponse(response, 2003, 'Unable to display threads: "{e}"', {
            e: err.toString()
          });
        }
        const goroutines = this.delve.isApiV1 ? out : out.Goroutines;
        log("goroutines", goroutines);
        const threads = goroutines.map((goroutine) => new import_vscode_debugadapter.Thread(goroutine.id, goroutine.userCurrentLoc.function ? goroutine.userCurrentLoc.function.name : goroutine.userCurrentLoc.file + "@" + goroutine.userCurrentLoc.line));
        if (threads.length === 0) {
          threads.push(new import_vscode_debugadapter.Thread(1, "Dummy"));
        }
        response.body = { threads };
        this.sendResponse(response);
        log("ThreadsResponse", threads);
      });
    });
  }
  stackTraceRequest(response, args) {
    return __async(this, null, function* () {
      log("StackTraceRequest");
      if (yield this.isDebuggeeRunning()) {
        this.sendErrorResponse(response, 2004, "Unable to produce stack trace as the debugger is running");
        return;
      }
      const goroutineId = args.threadId;
      const stackTraceIn = { id: goroutineId, depth: this.delve.stackTraceDepth };
      if (!this.delve.isApiV1) {
        Object.assign(stackTraceIn, { full: false, cfg: this.delve.loadConfig });
      }
      this.delve.call(this.delve.isApiV1 ? "StacktraceGoroutine" : "Stacktrace", [stackTraceIn], (err, out) => __async(this, null, function* () {
        if (err) {
          this.logDelveError(err, "Failed to produce stacktrace");
          return this.sendErrorResponse(response, 2004, 'Unable to produce stack trace: "{e}"', { e: err.toString() }, null);
        }
        const locations = this.delve.isApiV1 ? out : out.Locations;
        log("locations", locations);
        if (this.delve.isRemoteDebugging) {
          yield this.initializeRemotePackagesAndSources();
        }
        let stackFrames = locations.map((location, frameId) => {
          const uniqueStackFrameId = this.stackFrameHandles.create([goroutineId, frameId]);
          return new import_vscode_debugadapter.StackFrame(uniqueStackFrameId, location.function ? location.function.name : "<unknown>", location.file === "<autogenerated>" ? null : new import_vscode_debugadapter.Source(path2.basename(location.file), this.toLocalPath(location.file)), location.line, 0);
        });
        if (args.startFrame > 0) {
          stackFrames = stackFrames.slice(args.startFrame);
        }
        if (args.levels > 0) {
          stackFrames = stackFrames.slice(0, args.levels);
        }
        response.body = { stackFrames, totalFrames: locations.length };
        this.sendResponse(response);
        log("StackTraceResponse");
      }));
    });
  }
  scopesRequest(response, args) {
    log("ScopesRequest");
    const [goroutineId, frameId] = this.stackFrameHandles.get(args.frameId);
    const listLocalVarsIn = { goroutineID: goroutineId, frame: frameId };
    this.delve.call("ListLocalVars", this.delve.isApiV1 ? [listLocalVarsIn] : [{ scope: listLocalVarsIn, cfg: this.delve.loadConfig }], (err, out) => {
      if (err) {
        this.logDelveError(err, "Failed to get list local variables");
        return this.sendErrorResponse(response, 2005, 'Unable to list locals: "{e}"', {
          e: err.toString()
        });
      }
      const locals = this.delve.isApiV1 ? out : out.Variables;
      log("locals", locals);
      this.addFullyQualifiedName(locals);
      const listLocalFunctionArgsIn = { goroutineID: goroutineId, frame: frameId };
      this.delve.call("ListFunctionArgs", this.delve.isApiV1 ? [listLocalFunctionArgsIn] : [{ scope: listLocalFunctionArgsIn, cfg: this.delve.loadConfig }], (listFunctionErr, outArgs) => {
        if (listFunctionErr) {
          this.logDelveError(listFunctionErr, "Failed to list function args");
          return this.sendErrorResponse(response, 2006, 'Unable to list args: "{e}"', {
            e: listFunctionErr.toString()
          });
        }
        const vars = this.delve.isApiV1 ? outArgs : outArgs.Args;
        log("functionArgs", vars);
        this.addFullyQualifiedName(vars);
        vars.push(...locals);
        const shadowedVars = new Map();
        for (let i = 0; i < vars.length; ++i) {
          if ((vars[i].flags & 2) === 0) {
            continue;
          }
          const varName = vars[i].name;
          if (!shadowedVars.has(varName)) {
            const indices = new Array();
            indices.push(i);
            shadowedVars.set(varName, indices);
          } else {
            shadowedVars.get(varName).push(i);
          }
        }
        for (const svIndices of shadowedVars.values()) {
          svIndices.sort((lhs, rhs) => {
            return vars[rhs].DeclLine - vars[lhs].DeclLine;
          });
          for (let scope = 0; scope < svIndices.length; ++scope) {
            const svIndex = svIndices[scope];
            for (let count = -1; count < scope; ++count) {
              vars[svIndex].name = `(${vars[svIndex].name})`;
            }
          }
        }
        const scopes = new Array();
        const localVariables = {
          name: "Local",
          addr: 0,
          type: "",
          realType: "",
          kind: 0,
          flags: 0,
          onlyAddr: false,
          DeclLine: 0,
          value: "",
          len: 0,
          cap: 0,
          children: vars,
          unreadable: "",
          fullyQualifiedName: "",
          base: 0
        };
        scopes.push(new import_vscode_debugadapter.Scope("Local", this.variableHandles.create(localVariables), false));
        response.body = { scopes };
        if (!this.showGlobalVariables) {
          this.sendResponse(response);
          log("ScopesResponse");
          return;
        }
        this.getPackageInfo(this.debugState).then((packageName) => {
          if (!packageName) {
            this.sendResponse(response);
            log("ScopesResponse");
            return;
          }
          const filter = `^${packageName}\\.`;
          this.delve.call("ListPackageVars", this.delve.isApiV1 ? [filter] : [{ filter, cfg: this.delve.loadConfig }], (listPkgVarsErr, listPkgVarsOut) => {
            if (listPkgVarsErr) {
              this.logDelveError(listPkgVarsErr, "Failed to list global vars");
              return this.sendErrorResponse(response, 2007, 'Unable to list global vars: "{e}"', { e: listPkgVarsErr.toString() });
            }
            const globals = this.delve.isApiV1 ? listPkgVarsOut : listPkgVarsOut.Variables;
            let initdoneIndex = -1;
            for (let i = 0; i < globals.length; i++) {
              globals[i].name = globals[i].name.substr(packageName.length + 1);
              if (initdoneIndex === -1 && globals[i].name === this.initdone) {
                initdoneIndex = i;
              }
            }
            if (initdoneIndex > -1) {
              globals.splice(initdoneIndex, 1);
            }
            log("global vars", globals);
            const globalVariables = {
              name: "Global",
              addr: 0,
              type: "",
              realType: "",
              kind: 0,
              flags: 0,
              onlyAddr: false,
              DeclLine: 0,
              value: "",
              len: 0,
              cap: 0,
              children: globals,
              unreadable: "",
              fullyQualifiedName: "",
              base: 0
            };
            scopes.push(new import_vscode_debugadapter.Scope("Global", this.variableHandles.create(globalVariables), false));
            this.sendResponse(response);
            log("ScopesResponse");
          });
        });
      });
    });
  }
  variablesRequest(response, args) {
    log("VariablesRequest");
    const vari = this.variableHandles.get(args.variablesReference);
    let variablesPromise;
    const loadChildren = (exp, v) => __async(this, null, function* () {
      if (v.kind === 25 && v.len > v.children.length || v.kind === 20 && v.children.length > 0 && v.children[0].onlyAddr === true) {
        yield this.evaluateRequestImpl({ expression: exp }).then((result) => {
          const variable = this.delve.isApiV1 ? result : result.Variable;
          v.children = variable.children;
        }, (err) => this.logDelveError(err, "Failed to evaluate expression"));
      }
    });
    if (vari.kind === 17 || vari.kind === 23) {
      variablesPromise = Promise.all(vari.children.map((v, i) => {
        return loadChildren(`*(*"${v.type}")(${v.addr})`, v).then(() => {
          const { result, variablesReference } = this.convertDebugVariableToProtocolVariable(v);
          return {
            name: "[" + i + "]",
            value: result,
            evaluateName: vari.fullyQualifiedName + "[" + i + "]",
            variablesReference
          };
        });
      }));
    } else if (vari.kind === 21) {
      variablesPromise = Promise.all(vari.children.map((_, i) => {
        if (i % 2 === 0 && i + 1 < vari.children.length) {
          const mapKey = this.convertDebugVariableToProtocolVariable(vari.children[i]);
          return loadChildren(`${vari.fullyQualifiedName}.${vari.name}[${mapKey.result}]`, vari.children[i + 1]).then(() => {
            const mapValue = this.convertDebugVariableToProtocolVariable(vari.children[i + 1]);
            return {
              name: mapKey.result,
              value: mapValue.result,
              evaluateName: vari.fullyQualifiedName + "[" + mapKey.result + "]",
              variablesReference: mapValue.variablesReference
            };
          });
        }
      }).filter((v) => v != null));
    } else {
      variablesPromise = Promise.all(vari.children.map((v) => {
        return loadChildren(`*(*"${v.type}")(${v.addr})`, v).then(() => {
          const { result, variablesReference } = this.convertDebugVariableToProtocolVariable(v);
          return {
            name: v.name,
            value: result,
            evaluateName: v.fullyQualifiedName,
            variablesReference
          };
        });
      }));
    }
    variablesPromise.then((variables) => {
      response.body = { variables };
      this.sendResponse(response);
      log("VariablesResponse", JSON.stringify(variables, null, " "));
    });
  }
  continueRequest(response) {
    log("ContinueRequest");
    this.continue();
    this.sendResponse(response);
    log("ContinueResponse");
  }
  nextRequest(response) {
    this.nextEpoch++;
    const closureEpoch = this.nextEpoch;
    this.nextRequestRunning = true;
    log("NextRequest");
    this.delve.call("Command", [{ name: "next" }], (err, out) => {
      if (closureEpoch === this.continueEpoch) {
        this.nextRequestRunning = false;
      }
      if (err) {
        this.logDelveError(err, "Failed to next");
      }
      const state = this.delve.isApiV1 ? out : out.State;
      log("next state", state);
      this.debugState = state;
      this.handleReenterDebug("step");
    });
    this.sendEvent(new import_vscode_debugadapter.ContinuedEvent(1, true));
    this.sendResponse(response);
    log("NextResponse");
  }
  stepInRequest(response) {
    this.nextEpoch++;
    const closureEpoch = this.nextEpoch;
    this.nextRequestRunning = true;
    log("StepInRequest");
    this.delve.call("Command", [{ name: "step" }], (err, out) => {
      if (closureEpoch === this.continueEpoch) {
        this.nextRequestRunning = false;
      }
      if (err) {
        this.logDelveError(err, "Failed to step in");
      }
      const state = this.delve.isApiV1 ? out : out.State;
      log("stop state", state);
      this.debugState = state;
      this.handleReenterDebug("step");
    });
    this.sendEvent(new import_vscode_debugadapter.ContinuedEvent(1, true));
    this.sendResponse(response);
    log("StepInResponse");
  }
  stepOutRequest(response) {
    this.nextEpoch++;
    const closureEpoch = this.nextEpoch;
    this.nextRequestRunning = true;
    log("StepOutRequest");
    this.delve.call("Command", [{ name: "stepOut" }], (err, out) => {
      if (closureEpoch === this.continueEpoch) {
        this.nextRequestRunning = false;
      }
      if (err) {
        this.logDelveError(err, "Failed to step out");
      }
      const state = this.delve.isApiV1 ? out : out.State;
      log("stepout state", state);
      this.debugState = state;
      this.handleReenterDebug("step");
    });
    this.sendEvent(new import_vscode_debugadapter.ContinuedEvent(1, true));
    this.sendResponse(response);
    log("StepOutResponse");
  }
  pauseRequest(response) {
    log("PauseRequest");
    this.delve.call("Command", [{ name: "halt" }], (err, out) => {
      if (err) {
        this.logDelveError(err, "Failed to halt");
        return this.sendErrorResponse(response, 2010, 'Unable to halt execution: "{e}"', {
          e: err.toString()
        });
      }
      const state = this.delve.isApiV1 ? out : out.State;
      log("pause state", state);
      this.debugState = state;
      this.handleReenterDebug("pause");
    });
    this.sendResponse(response);
    log("PauseResponse");
  }
  evaluateRequest(response, args) {
    log("EvaluateRequest");
    const isCallCommand = args.expression.match(/^\s*call\s+\S+/);
    if (!this.delve.isApiV1 && isCallCommand) {
      this.evaluateCallImpl(args).then((out) => {
        var _a, _b;
        const state = out.State;
        const returnValues = (_b = (_a = state == null ? void 0 : state.currentThread) == null ? void 0 : _a.ReturnValues) != null ? _b : [];
        switch (returnValues.length) {
          case 0:
            response.body = { result: "", variablesReference: 0 };
            break;
          case 1:
            response.body = this.convertDebugVariableToProtocolVariable(returnValues[0]);
            break;
          default:
            const returnResults = this.wrapReturnVars(returnValues);
            response.body = this.convertDebugVariableToProtocolVariable(returnResults);
            break;
        }
        this.sendResponse(response);
        log("EvaluateCallResponse");
      }, (err) => {
        this.sendErrorResponse(response, 2009, 'Unable to complete call: "{e}"', {
          e: err.toString()
        }, args.context === "watch" ? null : import_vscode_debugadapter.ErrorDestination.User);
      });
      return;
    }
    this.evaluateRequestImpl(args).then((out) => {
      const variable = this.delve.isApiV1 ? out : out.Variable;
      variable.fullyQualifiedName = variable.name;
      response.body = this.convertDebugVariableToProtocolVariable(variable);
      this.sendResponse(response);
      log("EvaluateResponse");
    }, (err) => {
      this.sendErrorResponse(response, 2009, 'Unable to eval expression: "{e}"', {
        e: err.toString()
      }, args.context === "watch" ? null : import_vscode_debugadapter.ErrorDestination.User);
    });
  }
  setVariableRequest(response, args) {
    log("SetVariableRequest");
    const scope = {
      goroutineID: this.debugState.currentGoroutine.id
    };
    const setSymbolArgs = {
      Scope: scope,
      Symbol: args.name,
      Value: args.value
    };
    this.delve.call(this.delve.isApiV1 ? "SetSymbol" : "Set", [setSymbolArgs], (err) => {
      if (err) {
        const errMessage = `Failed to set variable: ${err.toString()}`;
        this.logDelveError(err, "Failed to set variable");
        return this.sendErrorResponse(response, 2010, errMessage);
      }
      response.body = { value: args.value };
      this.sendResponse(response);
      log("SetVariableResponse");
    });
  }
  getGOROOT() {
    if (this.delve && this.delve.goroot) {
      return this.delve.goroot;
    }
    return process.env["GOROOT"] || "";
  }
  initLaunchAttachRequest(response, args) {
    this.logLevel = args.trace === "verbose" || args.trace === "trace" ? import_vscode_debugadapter.Logger.LogLevel.Verbose : args.trace === "log" || args.trace === "info" || args.trace === "warn" ? import_vscode_debugadapter.Logger.LogLevel.Log : import_vscode_debugadapter.Logger.LogLevel.Error;
    const logPath = this.logLevel !== import_vscode_debugadapter.Logger.LogLevel.Error ? path2.join(os2.tmpdir(), "vscode-go-debug.txt") : void 0;
    import_vscode_debugadapter.logger.setup(this.logLevel, logPath);
    if (typeof args.showGlobalVariables === "boolean") {
      this.showGlobalVariables = args.showGlobalVariables;
    }
    if (args.stopOnEntry) {
      this.stopOnEntry = args.stopOnEntry;
    }
    if (!args.port) {
      args.port = random(2e3, 5e4);
    }
    if (!args.host) {
      args.host = "127.0.0.1";
    }
    let localPath;
    if (args.request === "attach") {
      localPath = args.cwd;
    } else if (args.request === "launch") {
      localPath = args.program;
    }
    if (!args.remotePath) {
      args.remotePath = "";
    }
    this.localPathSeparator = findPathSeparator(localPath);
    this.substitutePath = [];
    if (args.remotePath.length > 0) {
      this.remotePathSeparator = findPathSeparator(args.remotePath);
      const llist = localPath.split(/\/|\\/).reverse();
      const rlist = args.remotePath.split(/\/|\\/).reverse();
      let i = 0;
      for (; i < llist.length; i++) {
        if (llist[i] !== rlist[i] || llist[i] === "src") {
          break;
        }
      }
      if (i) {
        localPath = llist.reverse().slice(0, -i).join(this.localPathSeparator) + this.localPathSeparator;
        args.remotePath = rlist.reverse().slice(0, -i).join(this.remotePathSeparator) + this.remotePathSeparator;
      } else if (args.remotePath.length > 1 && (args.remotePath.endsWith("\\") || args.remotePath.endsWith("/"))) {
        args.remotePath = args.remotePath.substring(0, args.remotePath.length - 1);
      }
      this.substitutePath.push({
        from: normalizeSeparators(localPath),
        to: normalizeSeparators(args.remotePath)
      });
    }
    if (args.substitutePath) {
      args.substitutePath.forEach((value) => {
        if (!this.remotePathSeparator) {
          this.remotePathSeparator = findPathSeparator(value.to);
        }
        this.substitutePath.push({
          from: normalizeSeparators(value.from),
          to: normalizeSeparators(value.to)
        });
      });
    }
    this.delve = new Delve(args, localPath);
    this.delve.onstdout = (str) => {
      this.sendEvent(new import_vscode_debugadapter.OutputEvent(str, "stdout"));
    };
    this.delve.onstderr = (str) => {
      if (localPath.length > 0) {
        str = expandFilePathInOutput(str, localPath);
      }
      this.sendEvent(new import_vscode_debugadapter.OutputEvent(str, "stderr"));
    };
    this.delve.onclose = (code) => {
      if (code !== 0) {
        this.sendErrorResponse(response, 3e3, "Failed to continue: Check the debug console for details.");
      }
      log("Sending TerminatedEvent as delve is closed");
      this.sendEvent(new import_vscode_debugadapter.TerminatedEvent());
    };
    this.delve.connection.then(() => {
      if (!this.delve.noDebug) {
        this.delve.call("GetVersion", [], (err, out) => {
          if (err) {
            logError(err);
            return this.sendErrorResponse(response, 2001, 'Failed to get remote server version: "{e}"', { e: err.toString() });
          }
          const clientVersion = this.delve.isApiV1 ? 1 : 2;
          if (out.APIVersion !== clientVersion) {
            const errorMessage = `The remote server is running on delve v${out.APIVersion} API and the client is running v${clientVersion} API. Change the version used on the client by using the property "apiVersion" in your launch.json file.`;
            logError(errorMessage);
            return this.sendErrorResponse(response, 3e3, errorMessage);
          }
        });
        this.sendEvent(new import_vscode_debugadapter.InitializedEvent());
        log("InitializeEvent");
      }
      this.sendResponse(response);
    }, (err) => {
      this.sendErrorResponse(response, 3e3, 'Failed to continue: "{e}"', {
        e: err.toString()
      });
      log("ContinueResponse");
    });
  }
  initializeRemotePackagesAndSources() {
    return __async(this, null, function* () {
      if (this.remoteSourcesAndPackages.initializedRemoteSourceFiles) {
        return;
      }
      if (!this.remoteSourcesAndPackages.initializingRemoteSourceFiles) {
        try {
          yield this.remoteSourcesAndPackages.initializeRemotePackagesAndSources(this.delve);
        } catch (error) {
          log(`Failing to initialize remote sources: ${error}`);
        }
        return;
      }
      if (this.remoteSourcesAndPackages.initializingRemoteSourceFiles) {
        try {
          yield new Promise((resolve2) => {
            this.remoteSourcesAndPackages.on(RemoteSourcesAndPackages.INITIALIZED, () => {
              resolve2();
            });
          });
        } catch (error) {
          log(`Failing to initialize remote sources: ${error}`);
        }
      }
    });
  }
  setBreakPoints(response, args) {
    return __async(this, null, function* () {
      const file = normalizePath(args.source.path);
      if (!this.breakpoints.get(file)) {
        this.breakpoints.set(file, []);
      }
      const remoteFile = yield this.toDebuggerPath(file);
      return Promise.all(this.breakpoints.get(file).map((existingBP) => {
        log("Clearing: " + existingBP.id);
        return this.delve.callPromise("ClearBreakpoint", [
          this.delve.isApiV1 ? existingBP.id : { Id: existingBP.id }
        ]);
      })).then(() => {
        log("All cleared");
        let existingBreakpoints;
        return Promise.all(args.breakpoints.map((breakpoint) => {
          if (this.delve.remotePath.length === 0) {
            log("Creating on: " + file + ":" + breakpoint.line);
          } else {
            log("Creating on: " + file + " (" + remoteFile + ") :" + breakpoint.line);
          }
          const breakpointIn = {};
          breakpointIn.file = remoteFile;
          breakpointIn.line = breakpoint.line;
          breakpointIn.loadArgs = this.delve.loadConfig;
          breakpointIn.loadLocals = this.delve.loadConfig;
          breakpointIn.cond = breakpoint.condition;
          return this.delve.callPromise("CreateBreakpoint", [
            this.delve.isApiV1 ? breakpointIn : { Breakpoint: breakpointIn }
          ]).then(null, (err) => __async(this, null, function* () {
            if (err.toString().startsWith("Breakpoint exists at")) {
              log("Encounter existing breakpoint: " + breakpointIn);
              if (!existingBreakpoints) {
                try {
                  const listBreakpointsResponse = yield this.delve.callPromise("ListBreakpoints", this.delve.isApiV1 ? [] : [{}]);
                  existingBreakpoints = this.delve.isApiV1 ? listBreakpointsResponse : listBreakpointsResponse.Breakpoints;
                } catch (error) {
                  log("Error listing breakpoints: " + error.toString());
                  return null;
                }
              }
              const matchedBreakpoint = existingBreakpoints.find((existingBreakpoint) => existingBreakpoint.line === breakpointIn.line && compareFilePathIgnoreSeparator(existingBreakpoint.file, breakpointIn.file));
              if (!matchedBreakpoint) {
                log(`Cannot match breakpoint ${breakpointIn} with existing breakpoints.`);
                return null;
              }
              return this.delve.isApiV1 ? matchedBreakpoint : { Breakpoint: matchedBreakpoint };
            }
            log("Error on CreateBreakpoint: " + err.toString());
            return null;
          }));
        }));
      }).then((newBreakpoints) => {
        let convertedBreakpoints;
        if (!this.delve.isApiV1) {
          convertedBreakpoints = newBreakpoints.map((bp, i) => {
            return bp ? bp.Breakpoint : null;
          });
        } else {
          convertedBreakpoints = newBreakpoints;
        }
        log("All set:" + JSON.stringify(newBreakpoints));
        const breakpoints = convertedBreakpoints.map((bp, i) => {
          if (bp) {
            return { verified: true, line: bp.line };
          } else {
            return { verified: false, line: args.lines[i] };
          }
        });
        this.breakpoints.set(file, convertedBreakpoints.filter((x) => !!x));
        return breakpoints;
      }).then((breakpoints) => {
        response.body = { breakpoints };
        this.sendResponse(response);
        log("SetBreakPointsResponse");
      }, (err) => {
        this.sendErrorResponse(response, 2002, 'Failed to set breakpoint: "{e}"', {
          e: err.toString()
        });
        logError(err);
      });
    });
  }
  getPackageInfo(debugState) {
    return __async(this, null, function* () {
      if (!debugState.currentThread || !debugState.currentThread.file) {
        return Promise.resolve(null);
      }
      if (this.delve.isRemoteDebugging) {
        yield this.initializeRemotePackagesAndSources();
      }
      const dir = path2.dirname(this.delve.remotePath.length || this.delve.isRemoteDebugging ? this.toLocalPath(debugState.currentThread.file) : debugState.currentThread.file);
      if (this.packageInfo.has(dir)) {
        return Promise.resolve(this.packageInfo.get(dir));
      }
      return new Promise((resolve2) => {
        (0, import_child_process.execFile)(getBinPathWithPreferredGopathGoroot("go", []), ["list", "-f", "{{.Name}} {{.ImportPath}}"], { cwd: dir, env: this.delve.dlvEnv }, (err, stdout, stderr) => {
          if (err || stderr || !stdout) {
            logError(`go list failed on ${dir}: ${stderr || err}`);
            return resolve2();
          }
          if (stdout.split("\n").length !== 2) {
            logError(`Cannot determine package for ${dir}`);
            return resolve2();
          }
          const spaceIndex = stdout.indexOf(" ");
          const result = stdout.substr(0, spaceIndex) === "main" ? "main" : stdout.substr(spaceIndex).trim();
          this.packageInfo.set(dir, result);
          resolve2(result);
        });
      });
    });
  }
  wrapReturnVars(vars) {
    const values = vars.map((v) => this.convertDebugVariableToProtocolVariable(v).result) || [];
    return {
      value: values.join(", "),
      kind: 0,
      flags: 32 | 16,
      children: vars,
      name: "",
      addr: 0,
      type: "",
      realType: "",
      onlyAddr: false,
      DeclLine: 0,
      len: 0,
      cap: 0,
      unreadable: "",
      base: 0,
      fullyQualifiedName: ""
    };
  }
  convertDebugVariableToProtocolVariable(v) {
    var _a;
    if (v.kind === 26) {
      return {
        result: `unsafe.Pointer(0x${v.children[0].addr.toString(16)})`,
        variablesReference: 0
      };
    } else if (v.kind === 22) {
      if (v.children[0].addr === 0) {
        return {
          result: "nil <" + v.type + ">",
          variablesReference: 0
        };
      } else if (v.children[0].type === "void") {
        return {
          result: "void",
          variablesReference: 0
        };
      } else {
        if (v.children[0].children.length > 0) {
          v.children[0].fullyQualifiedName = v.fullyQualifiedName;
          v.children[0].children.forEach((child) => {
            child.fullyQualifiedName = v.fullyQualifiedName + "." + child.name;
          });
        }
        return {
          result: `<${v.type}>(0x${v.children[0].addr.toString(16)})`,
          variablesReference: v.children.length > 0 ? this.variableHandles.create(v) : 0
        };
      }
    } else if (v.kind === 23) {
      if (v.base === 0) {
        return {
          result: "nil <" + v.type + ">",
          variablesReference: 0
        };
      }
      return {
        result: "<" + v.type + "> (length: " + v.len + ", cap: " + v.cap + ")",
        variablesReference: this.variableHandles.create(v)
      };
    } else if (v.kind === 21) {
      if (v.base === 0) {
        return {
          result: "nil <" + v.type + ">",
          variablesReference: 0
        };
      }
      return {
        result: "<" + v.type + "> (length: " + v.len + ")",
        variablesReference: this.variableHandles.create(v)
      };
    } else if (v.kind === 17) {
      return {
        result: "<" + v.type + ">",
        variablesReference: this.variableHandles.create(v)
      };
    } else if (v.kind === 24) {
      let val = v.value;
      const byteLength = Buffer.byteLength(val || "");
      if (v.value && byteLength < v.len) {
        val += `...+${v.len - byteLength} more`;
      }
      return {
        result: v.unreadable ? "<" + v.unreadable + ">" : '"' + val + '"',
        variablesReference: 0
      };
    } else if (v.kind === 20) {
      if (v.addr === 0) {
        return {
          result: "nil",
          variablesReference: 0
        };
      }
      if (v.children.length === 0) {
        return {
          result: "nil",
          variablesReference: 0
        };
      }
      const child = v.children[0];
      if (child.kind === 0 && child.addr === 0) {
        return {
          result: `nil <${v.type}>`,
          variablesReference: 0
        };
      }
      return {
        result: v.value || `<${v.type}(${child.type})>)`,
        variablesReference: ((_a = v.children) == null ? void 0 : _a.length) > 0 ? this.variableHandles.create(v) : 0
      };
    } else {
      if (v.children.length > 0) {
        v.children.forEach((child) => {
          child.fullyQualifiedName = v.fullyQualifiedName + "." + child.name;
        });
      }
      return {
        result: v.value || "<" + v.type + ">",
        variablesReference: v.children.length > 0 ? this.variableHandles.create(v) : 0
      };
    }
  }
  cleanupHandles() {
    this.variableHandles.reset();
    this.stackFrameHandles.reset();
  }
  handleReenterDebug(reason) {
    log(`handleReenterDebug(${reason}).`);
    this.cleanupHandles();
    if (this.debugState.exited) {
      this.sendEvent(new import_vscode_debugadapter.TerminatedEvent());
      log("TerminatedEvent");
    } else {
      this.delve.call("ListGoroutines", [{ count: 1 }], (err, out) => {
        var _a, _b;
        if (err) {
          this.logDelveError(err, "Failed to get threads");
        }
        const goroutines = this.delve.isApiV1 ? out : out.Goroutines;
        if (!this.debugState.currentGoroutine && goroutines.length > 0) {
          this.debugState.currentGoroutine = goroutines[0];
        }
        if (this.skipStopEventOnce) {
          log(`Skipping stop event for ${reason}. The current Go routines is ${(_a = this.debugState) == null ? void 0 : _a.currentGoroutine}.`);
          this.skipStopEventOnce = false;
          return;
        }
        if (((_b = this.overrideStopReason) == null ? void 0 : _b.length) > 0) {
          reason = this.overrideStopReason;
          this.overrideStopReason = "";
        }
        const stoppedEvent = new import_vscode_debugadapter.StoppedEvent(reason, this.debugState.currentGoroutine.id);
        stoppedEvent.body.allThreadsStopped = true;
        this.sendEvent(stoppedEvent);
        log('StoppedEvent("' + reason + '")');
      });
    }
  }
  isDebuggeeRunning() {
    return __async(this, null, function* () {
      if (this.debugState && this.debugState.exited) {
        return false;
      }
      try {
        this.debugState = yield this.delve.getDebugState();
        return this.debugState.Running;
      } catch (error) {
        this.logDelveError(error, "Failed to get state");
        return this.continueRequestRunning || this.nextRequestRunning;
      }
    });
  }
  shutdownProtocolServer(response, args) {
    log("DisconnectRequest to parent to shut down protocol server.");
    super.disconnectRequest(response, args);
  }
  continue(calledWhenSettingBreakpoint) {
    this.continueEpoch++;
    const closureEpoch = this.continueEpoch;
    this.continueRequestRunning = true;
    const callback = (out) => {
      if (closureEpoch === this.continueEpoch) {
        this.continueRequestRunning = false;
      }
      const state = this.delve.isApiV1 ? out : out.State;
      log("continue state", state);
      this.debugState = state;
      let reason = "breakpoint";
      if (!!state.currentThread && !!state.currentThread.breakPoint) {
        const bp = state.currentThread.breakPoint;
        if (bp.id === unrecoveredPanicID) {
          reason = "panic";
        } else if (bp.id === fatalThrowID) {
          reason = "fatal error";
        }
      }
      this.handleReenterDebug(reason);
    };
    let errorCallback = null;
    if (!calledWhenSettingBreakpoint) {
      errorCallback = (err) => {
        if (err) {
          this.logDelveError(err, "Failed to continue");
        }
        this.handleReenterDebug("breakpoint");
        throw err;
      };
    }
    return this.delve.callPromise("Command", [{ name: "continue" }]).then(callback, errorCallback);
  }
  evaluateCallImpl(args) {
    const callExpr = args.expression.trimLeft().slice("call ".length);
    let goroutineId = -1;
    let frameId = 0;
    if (args.frameId) {
      [goroutineId, frameId] = this.stackFrameHandles.get(args.frameId, [goroutineId, frameId]);
    }
    const returnValue = this.delve.callPromise("Command", [
      {
        name: "call",
        goroutineID: goroutineId,
        returnInfoLoadConfig: this.delve.loadConfig,
        expr: callExpr,
        unsafe: false
      }
    ]).then((val) => val, (err) => {
      logError("Failed to call function: ", JSON.stringify(callExpr, null, " "), "\n\rCall error:", err.toString());
      return Promise.reject(err);
    });
    return returnValue;
  }
  evaluateRequestImpl(args) {
    let goroutineId = -1;
    let frameId = 0;
    if (args.frameId) {
      [goroutineId, frameId] = this.stackFrameHandles.get(args.frameId, [goroutineId, frameId]);
    }
    const scope = {
      goroutineID: goroutineId,
      frame: frameId
    };
    const apiV1Args = {
      symbol: args.expression,
      scope
    };
    const apiV2Args = {
      Expr: args.expression,
      Scope: scope,
      Cfg: this.delve.loadConfig
    };
    const evalSymbolArgs = this.delve.isApiV1 ? apiV1Args : apiV2Args;
    const returnValue = this.delve.callPromise(this.delve.isApiV1 ? "EvalSymbol" : "Eval", [evalSymbolArgs]).then((val) => val, (err) => {
      log("Failed to eval expression: ", JSON.stringify(evalSymbolArgs, null, " "), "\n\rEval error:", err.toString());
      return Promise.reject(err);
    });
    return returnValue;
  }
  addFullyQualifiedName(variables) {
    variables.forEach((local) => {
      local.fullyQualifiedName = local.name;
      local.children.forEach((child) => {
        child.fullyQualifiedName = local.name;
      });
    });
  }
  logDelveError(err, message) {
    if (err === void 0) {
      return;
    }
    let errorMessage = err.toString();
    if (errorMessage === "bad access") {
      errorMessage = "runtime error: invalid memory address or nil pointer dereference [signal SIGSEGV: segmentation violation]\nUnable to propogate EXC_BAD_ACCESS signal to target process and panic (see https://github.com/go-delve/delve/issues/852)";
    }
    logError(message + " - " + errorMessage);
    this.dumpStacktrace();
  }
  dumpStacktrace() {
    return __async(this, null, function* () {
      let goroutineId = 0;
      try {
        this.debugState = yield this.delve.getDebugState();
        if (!this.debugState.currentGoroutine) {
          goroutineId = this.debugState.currentThread.goroutineID;
        } else {
          goroutineId = this.debugState.currentGoroutine.id;
        }
      } catch (error) {
        logError("dumpStacktrace - Failed to get debugger state " + error);
      }
      const stackTraceIn = { id: goroutineId, depth: this.delve.stackTraceDepth };
      if (!this.delve.isApiV1) {
        Object.assign(stackTraceIn, { full: false, cfg: this.delve.loadConfig });
      }
      this.delve.call(this.delve.isApiV1 ? "StacktraceGoroutine" : "Stacktrace", [stackTraceIn], (err, out) => {
        if (err) {
          logError("dumpStacktrace: Failed to produce stack trace" + err);
          return;
        }
        const locations = this.delve.isApiV1 ? out : out.Locations;
        log("locations", locations);
        const stackFrames = locations.map((location, frameId) => {
          const uniqueStackFrameId = this.stackFrameHandles.create([goroutineId, frameId]);
          return new import_vscode_debugadapter.StackFrame(uniqueStackFrameId, location.function ? location.function.name : "<unknown>", location.file === "<autogenerated>" ? null : new import_vscode_debugadapter.Source(path2.basename(location.file), this.toLocalPath(location.file)), location.line, 0);
        });
        logError(`Last known immediate stacktrace (goroutine id ${goroutineId}):`);
        let output = "";
        stackFrames.forEach((stackFrame) => {
          output = output.concat(`	${stackFrame.source.path}:${stackFrame.line}
`);
          if (stackFrame.name) {
            output = output.concat(`		${stackFrame.name}
`);
          }
        });
        logError(output);
      });
    });
  }
};
var _RemoteSourcesAndPackages = class extends import_events.EventEmitter {
  constructor() {
    super(...arguments);
    this.initializingRemoteSourceFiles = false;
    this.initializedRemoteSourceFiles = false;
    this.remotePackagesBuildInfo = [];
    this.remoteSourceFiles = [];
    this.remoteSourceFilesNameGrouping = new Map();
  }
  initializeRemotePackagesAndSources(delve) {
    return __async(this, null, function* () {
      this.initializingRemoteSourceFiles = true;
      try {
        if (!delve.isApiV1 && this.remotePackagesBuildInfo.length === 0) {
          const packagesBuildInfoResponse = yield delve.callPromise("ListPackagesBuildInfo", [{ IncludeFiles: true }]);
          if (packagesBuildInfoResponse && packagesBuildInfoResponse.List) {
            this.remotePackagesBuildInfo = packagesBuildInfoResponse.List;
          }
        }
        if (delve.isApiV1) {
          this.remoteSourceFiles = yield delve.callPromise("ListSources", []);
        } else {
          const listSourcesResponse = yield delve.callPromise("ListSources", [{}]);
          if (listSourcesResponse && listSourcesResponse.Sources) {
            this.remoteSourceFiles = listSourcesResponse.Sources;
          }
        }
        this.remoteSourceFiles = this.remoteSourceFiles.filter((sourceFile) => !sourceFile.startsWith("<"));
        this.remoteSourceFiles.forEach((sourceFile) => {
          const fileName = getBaseName(sourceFile);
          if (!this.remoteSourceFilesNameGrouping.has(fileName)) {
            this.remoteSourceFilesNameGrouping.set(fileName, []);
          }
          this.remoteSourceFilesNameGrouping.get(fileName).push(sourceFile);
        });
      } catch (error) {
        logError(`Failed to initialize remote sources and packages: ${error && error.message}`);
      } finally {
        this.emit(_RemoteSourcesAndPackages.INITIALIZED);
        this.initializedRemoteSourceFiles = true;
      }
    });
  }
};
var RemoteSourcesAndPackages = _RemoteSourcesAndPackages;
RemoteSourcesAndPackages.INITIALIZED = "INITIALIZED";
function random(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
function removeFile(filePath) {
  return __async(this, null, function* () {
    try {
      const fileExists = yield fsAccess(filePath).then(() => true).catch(() => false);
      if (filePath && fileExists) {
        yield fsUnlink(filePath);
      }
    } catch (e) {
      logError(`Potentially failed remove file: ${filePath} - ${e.toString() || ""}`);
    }
  });
}
function queryGOROOT(cwd, env) {
  return new Promise((resolve2) => {
    (0, import_child_process.execFile)(getBinPathWithPreferredGopathGoroot("go", []), ["env", "GOROOT"], { cwd, env }, (err, stdout, stderr) => {
      if (err) {
        return resolve2("");
      }
      return resolve2(stdout.trim());
    });
  });
}
import_vscode_debugadapter.DebugSession.run(GoDebugSession);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Delve,
  GoDebugSession,
  RemoteSourcesAndPackages,
  escapeGoModPath,
  findPathSeparator,
  normalizeSeparators
});
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
