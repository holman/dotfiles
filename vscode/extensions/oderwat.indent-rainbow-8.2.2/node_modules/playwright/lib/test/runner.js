"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builtInReporters = exports.Runner = void 0;

var _rimraf = _interopRequireDefault(require("rimraf"));

var fs = _interopRequireWildcard(require("fs"));

var path = _interopRequireWildcard(require("path"));

var _util = require("util");

var _dispatcher = require("./dispatcher");

var _util2 = require("./util");

var _test = require("./test");

var _multiplexer = require("./reporters/multiplexer");

var _dot = _interopRequireDefault(require("./reporters/dot"));

var _line = _interopRequireDefault(require("./reporters/line"));

var _list = _interopRequireDefault(require("./reporters/list"));

var _json = _interopRequireDefault(require("./reporters/json"));

var _junit = _interopRequireDefault(require("./reporters/junit"));

var _empty = _interopRequireDefault(require("./reporters/empty"));

var _minimatch = require("minimatch");

var _webServer = require("./webServer");

var _async = require("../utils/async");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright 2019 Google Inc. All rights reserved.
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
const removeFolderAsync = (0, _util.promisify)(_rimraf.default);
const readDirAsync = (0, _util.promisify)(fs.readdir);
const readFileAsync = (0, _util.promisify)(fs.readFile);

class Runner {
  constructor(loader) {
    this._loader = void 0;
    this._reporter = void 0;
    this._didBegin = false;
    this._loader = loader;
  }

  async _createReporter(list) {
    const defaultReporters = {
      dot: list ? ListModeReporter : _dot.default,
      line: list ? ListModeReporter : _line.default,
      list: list ? ListModeReporter : _list.default,
      json: _json.default,
      junit: _junit.default,
      null: _empty.default
    };
    const reporters = [];

    for (const r of this._loader.fullConfig().reporter) {
      const [name, arg] = r;

      if (name in defaultReporters) {
        reporters.push(new defaultReporters[name](arg));
      } else {
        const reporterConstructor = await this._loader.loadReporter(name);
        reporters.push(new reporterConstructor(arg));
      }
    }

    return new _multiplexer.Multiplexer(reporters);
  }

  async run(list, filePatternFilters, projectNames) {
    this._reporter = await this._createReporter(list);

    const config = this._loader.fullConfig();

    const globalDeadline = config.globalTimeout ? config.globalTimeout + (0, _util2.monotonicTime)() : 0;
    const {
      result,
      timedOut
    } = await (0, _async.raceAgainstDeadline)(this._run(list, filePatternFilters, projectNames), globalDeadline);

    if (timedOut) {
      var _this$_reporter$onBeg, _this$_reporter, _this$_reporter$onEnd, _this$_reporter2;

      if (!this._didBegin) (_this$_reporter$onBeg = (_this$_reporter = this._reporter).onBegin) === null || _this$_reporter$onBeg === void 0 ? void 0 : _this$_reporter$onBeg.call(_this$_reporter, config, new _test.Suite(''));
      await ((_this$_reporter$onEnd = (_this$_reporter2 = this._reporter).onEnd) === null || _this$_reporter$onEnd === void 0 ? void 0 : _this$_reporter$onEnd.call(_this$_reporter2, {
        status: 'timedout'
      }));
      await this._flushOutput();
      return 'failed';
    }

    if ((result === null || result === void 0 ? void 0 : result.status) === 'forbid-only') {
      console.error('=====================================');
      console.error(' --forbid-only found a focused test.');

      for (const location of result === null || result === void 0 ? void 0 : result.locations) console.error(` - ${location}`);

      console.error('=====================================');
    } else if (result.status === 'no-tests') {
      console.error('=================');
      console.error(' no tests found.');
      console.error('=================');
    } else if ((result === null || result === void 0 ? void 0 : result.status) === 'clashing-test-titles') {
      console.error('=================');
      console.error(' duplicate test titles are not allowed.');

      for (const [title, tests] of result === null || result === void 0 ? void 0 : result.clashingTests.entries()) {
        console.error(` - title: ${title}`);

        for (const test of tests) console.error(`   - ${buildItemLocation(config.rootDir, test)}`);

        console.error('=================');
      }
    }

    await this._flushOutput();
    return result.status;
  }

  async _flushOutput() {
    // Calling process.exit() might truncate large stdout/stderr output.
    // See https://github.com/nodejs/node/issues/6456.
    // See https://github.com/nodejs/node/issues/12921
    await new Promise(resolve => process.stdout.write('', () => resolve()));
    await new Promise(resolve => process.stderr.write('', () => resolve()));
  }

  async _run(list, testFileReFilters, projectNames) {
    const testFileFilter = testFileReFilters.length ? (0, _util2.createFileMatcher)(testFileReFilters.map(e => e.re)) : () => true;

    const config = this._loader.fullConfig();

    let projectsToFind;
    let unknownProjects;

    if (projectNames) {
      projectsToFind = new Set();
      unknownProjects = new Map();
      projectNames.forEach(n => {
        const name = n.toLocaleLowerCase();
        projectsToFind.add(name);
        unknownProjects.set(name, n);
      });
    }

    const projects = this._loader.projects().filter(project => {
      if (!projectsToFind) return true;
      const name = project.config.name.toLocaleLowerCase();
      unknownProjects.delete(name);
      return projectsToFind.has(name);
    });

    if (unknownProjects && unknownProjects.size) {
      const names = this._loader.projects().map(p => p.config.name).filter(name => !!name);

      if (!names.length) throw new Error(`No named projects are specified in the configuration file`);
      const unknownProjectNames = Array.from(unknownProjects.values()).map(n => `"${n}"`).join(', ');
      throw new Error(`Project(s) ${unknownProjectNames} not found. Available named projects: ${names.map(name => `"${name}"`).join(', ')}`);
    }

    const files = new Map();
    const allTestFiles = new Set();

    for (const project of projects) {
      const testDir = project.config.testDir;
      if (!fs.existsSync(testDir)) throw new Error(`${testDir} does not exist`);
      if (!fs.statSync(testDir).isDirectory()) throw new Error(`${testDir} is not a directory`);
      const allFiles = await collectFiles(project.config.testDir);
      const testMatch = (0, _util2.createFileMatcher)(project.config.testMatch);
      const testIgnore = (0, _util2.createFileMatcher)(project.config.testIgnore);

      const testFileExtension = file => ['.js', '.ts', '.mjs'].includes(path.extname(file));

      const testFiles = allFiles.filter(file => !testIgnore(file) && testMatch(file) && testFileFilter(file) && testFileExtension(file));
      files.set(project, testFiles);
      testFiles.forEach(file => allTestFiles.add(file));
    }

    const webServer = !list && config.webServer ? await _webServer.WebServer.create(config.webServer) : undefined;
    let globalSetupResult;
    if (config.globalSetup) globalSetupResult = await (await this._loader.loadGlobalHook(config.globalSetup, 'globalSetup'))(this._loader.fullConfig());

    try {
      var _this$_reporter$onBeg2, _this$_reporter3, _this$_reporter$onEnd3, _this$_reporter5;

      for (const file of allTestFiles) await this._loader.loadTestFile(file);

      const preprocessRoot = new _test.Suite('');

      for (const fileSuite of this._loader.fileSuites().values()) preprocessRoot._addSuite(fileSuite);

      if (config.forbidOnly) {
        const onlyTestsAndSuites = preprocessRoot._getOnlyItems();

        if (onlyTestsAndSuites.length > 0) {
          const locations = onlyTestsAndSuites.map(testOrSuite => {
            // Skip root and file.
            const title = testOrSuite.titlePath().slice(2).join(' ');
            return `${buildItemLocation(config.rootDir, testOrSuite)} > ${title}`;
          });
          return {
            status: 'forbid-only',
            locations
          };
        }
      }

      const clashingTests = getClashingTestsPerSuite(preprocessRoot);
      if (clashingTests.size > 0) return {
        status: 'clashing-test-titles',
        clashingTests: clashingTests
      };
      filterOnly(preprocessRoot);
      filterByFocusedLine(preprocessRoot, testFileReFilters);
      const fileSuites = new Map();

      for (const fileSuite of preprocessRoot.suites) fileSuites.set(fileSuite._requireFile, fileSuite);

      const outputDirs = new Set();
      const grepMatcher = (0, _util2.createTitleMatcher)(config.grep);
      const grepInvertMatcher = config.grepInvert ? (0, _util2.createTitleMatcher)(config.grepInvert) : null;
      const rootSuite = new _test.Suite('');

      for (const project of projects) {
        const projectSuite = new _test.Suite(project.config.name);
        projectSuite._projectConfig = project.config;

        rootSuite._addSuite(projectSuite);

        for (const file of files.get(project)) {
          const fileSuite = fileSuites.get(file);
          if (!fileSuite) continue;

          for (let repeatEachIndex = 0; repeatEachIndex < project.config.repeatEach; repeatEachIndex++) {
            const cloned = project.cloneFileSuite(fileSuite, repeatEachIndex, test => {
              const grepTitle = test.titlePath().join(' ');
              if (grepInvertMatcher !== null && grepInvertMatcher !== void 0 && grepInvertMatcher(grepTitle)) return false;
              return grepMatcher(grepTitle);
            });
            if (cloned) projectSuite._addSuite(cloned);
          }
        }

        outputDirs.add(project.config.outputDir);
      }

      let total = rootSuite.allTests().length;
      if (!total) return {
        status: 'no-tests'
      };
      await Promise.all(Array.from(outputDirs).map(outputDir => removeFolderAsync(outputDir).catch(e => {})));
      let testGroups = createTestGroups(rootSuite);
      const shard = config.shard;

      if (shard) {
        const shardGroups = [];
        const shardTests = new Set(); // Each shard gets some tests.

        const shardSize = Math.floor(total / shard.total); // First few shards get one more test each.

        const extraOne = total - shardSize * shard.total;
        const currentShard = shard.current - 1; // Make it zero-based for calculations.

        const from = shardSize * currentShard + Math.min(extraOne, currentShard);
        const to = from + shardSize + (currentShard < extraOne ? 1 : 0);
        let current = 0;

        for (const group of testGroups) {
          // Any test group goes to the shard that contains the first test of this group.
          // So, this shard gets any group that starts at [from; to)
          if (current >= from && current < to) {
            shardGroups.push(group);

            for (const test of group.tests) shardTests.add(test);
          }

          current += group.tests.length;
        }

        testGroups = shardGroups;
        filterSuite(rootSuite, () => false, test => shardTests.has(test));
        total = rootSuite.allTests().length;
      }

      if (process.stdout.isTTY) {
        console.log();
        const jobs = Math.min(config.workers, testGroups.length);
        const shardDetails = shard ? `, shard ${shard.current} of ${shard.total}` : '';
        console.log(`Running ${total} test${total > 1 ? 's' : ''} using ${jobs} worker${jobs > 1 ? 's' : ''}${shardDetails}`);
      }

      let sigint = false;
      let sigintCallback;
      const sigIntPromise = new Promise(f => sigintCallback = f);

      const sigintHandler = () => {
        // We remove the handler so that second Ctrl+C immediately kills the runner
        // via the default sigint handler. This is handy in the case where our shutdown
        // takes a lot of time or is buggy.
        //
        // When running through NPM we might get multiple SIGINT signals
        // for a single Ctrl+C - this is an NPM bug present since at least NPM v6.
        // https://github.com/npm/cli/issues/1591
        // https://github.com/npm/cli/issues/2124
        //
        // Therefore, removing the handler too soon will just kill the process
        // with default handler without printing the results.
        // We work around this by giving NPM 1000ms to send us duplicate signals.
        // The side effect is that slow shutdown or bug in our runner will force
        // the user to hit Ctrl+C again after at least a second.
        setTimeout(() => process.off('SIGINT', sigintHandler), 1000);
        sigint = true;
        sigintCallback();
      };

      process.on('SIGINT', sigintHandler);
      (_this$_reporter$onBeg2 = (_this$_reporter3 = this._reporter).onBegin) === null || _this$_reporter$onBeg2 === void 0 ? void 0 : _this$_reporter$onBeg2.call(_this$_reporter3, config, rootSuite);
      this._didBegin = true;
      let hasWorkerErrors = false;

      if (!list) {
        const dispatcher = new _dispatcher.Dispatcher(this._loader, testGroups, this._reporter);
        await Promise.race([dispatcher.run(), sigIntPromise]);
        await dispatcher.stop();
        hasWorkerErrors = dispatcher.hasWorkerErrors();
      }

      if (sigint) {
        var _this$_reporter$onEnd2, _this$_reporter4;

        await ((_this$_reporter$onEnd2 = (_this$_reporter4 = this._reporter).onEnd) === null || _this$_reporter$onEnd2 === void 0 ? void 0 : _this$_reporter$onEnd2.call(_this$_reporter4, {
          status: 'interrupted'
        }));
        return {
          status: 'sigint'
        };
      }

      const failed = hasWorkerErrors || rootSuite.allTests().some(test => !test.ok());
      await ((_this$_reporter$onEnd3 = (_this$_reporter5 = this._reporter).onEnd) === null || _this$_reporter$onEnd3 === void 0 ? void 0 : _this$_reporter$onEnd3.call(_this$_reporter5, {
        status: failed ? 'failed' : 'passed'
      }));
      return {
        status: failed ? 'failed' : 'passed'
      };
    } finally {
      if (globalSetupResult && typeof globalSetupResult === 'function') await globalSetupResult(this._loader.fullConfig());
      if (config.globalTeardown) await (await this._loader.loadGlobalHook(config.globalTeardown, 'globalTeardown'))(this._loader.fullConfig());
      await (webServer === null || webServer === void 0 ? void 0 : webServer.kill());
    }
  }

}

exports.Runner = Runner;

function filterOnly(suite) {
  const suiteFilter = suite => suite._only;

  const testFilter = test => test._only;

  return filterSuite(suite, suiteFilter, testFilter);
}

function filterByFocusedLine(suite, focusedTestFileLines) {
  const testFileLineMatches = (testFileName, testLine) => focusedTestFileLines.some(({
    re,
    line
  }) => {
    re.lastIndex = 0;
    return re.test(testFileName) && (line === testLine || line === null);
  });

  const suiteFilter = suite => !!suite.location && testFileLineMatches(suite.location.file, suite.location.line);

  const testFilter = test => testFileLineMatches(test.location.file, test.location.line);

  return filterSuite(suite, suiteFilter, testFilter);
}

function filterSuite(suite, suiteFilter, testFilter) {
  const onlySuites = suite.suites.filter(child => filterSuite(child, suiteFilter, testFilter) || suiteFilter(child));
  const onlyTests = suite.tests.filter(testFilter);
  const onlyEntries = new Set([...onlySuites, ...onlyTests]);

  if (onlyEntries.size) {
    suite.suites = onlySuites;
    suite.tests = onlyTests;
    suite._entries = suite._entries.filter(e => onlyEntries.has(e)); // Preserve the order.

    return true;
  }

  return false;
}

async function collectFiles(testDir) {
  const checkIgnores = (entryPath, rules, isDirectory, parentStatus) => {
    let status = parentStatus;

    for (const rule of rules) {
      const ruleIncludes = rule.negate;
      if (status === 'included' === ruleIncludes) continue;
      const relative = path.relative(rule.dir, entryPath);

      if (rule.match('/' + relative) || rule.match(relative)) {
        // Matches "/dir/file" or "dir/file"
        status = ruleIncludes ? 'included' : 'ignored';
      } else if (isDirectory && (rule.match('/' + relative + '/') || rule.match(relative + '/'))) {
        // Matches "/dir/subdir/" or "dir/subdir/" for directories.
        status = ruleIncludes ? 'included' : 'ignored';
      } else if (isDirectory && ruleIncludes && (rule.match('/' + relative, true) || rule.match(relative, true))) {
        // Matches "/dir/donotskip/" when "/dir" is excluded, but "!/dir/donotskip/file" is included.
        status = 'ignored-but-recurse';
      }
    }

    return status;
  };

  const files = [];

  const visit = async (dir, rules, status) => {
    const entries = await readDirAsync(dir, {
      withFileTypes: true
    });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    const gitignore = entries.find(e => e.isFile() && e.name === '.gitignore');

    if (gitignore) {
      const content = await readFileAsync(path.join(dir, gitignore.name), 'utf8');
      const newRules = content.split(/\r?\n/).map(s => {
        s = s.trim();
        if (!s) return; // Use flipNegate, because we handle negation ourselves.

        const rule = new _minimatch.Minimatch(s, {
          matchBase: true,
          dot: true,
          flipNegate: true
        });
        if (rule.comment) return;
        rule.dir = dir;
        return rule;
      }).filter(rule => !!rule);
      rules = [...rules, ...newRules];
    }

    for (const entry of entries) {
      if (entry === gitignore || entry.name === '.' || entry.name === '..') continue;
      if (entry.isDirectory() && entry.name === 'node_modules') continue;
      const entryPath = path.join(dir, entry.name);
      const entryStatus = checkIgnores(entryPath, rules, entry.isDirectory(), status);
      if (entry.isDirectory() && entryStatus !== 'ignored') await visit(entryPath, rules, entryStatus);else if (entry.isFile() && entryStatus === 'included') files.push(entryPath);
    }
  };

  await visit(testDir, [], 'included');
  return files;
}

function getClashingTestsPerSuite(rootSuite) {
  function visit(suite, clashingTests) {
    for (const childSuite of suite.suites) visit(childSuite, clashingTests);

    for (const test of suite.tests) {
      const fullTitle = test.titlePath().slice(2).join(' ');
      if (!clashingTests.has(fullTitle)) clashingTests.set(fullTitle, []);
      clashingTests.set(fullTitle, clashingTests.get(fullTitle).concat(test));
    }
  }

  const out = new Map();

  for (const fileSuite of rootSuite.suites) {
    const clashingTests = new Map();
    visit(fileSuite, clashingTests);

    for (const [title, tests] of clashingTests.entries()) {
      if (tests.length > 1) out.set(title, tests);
    }
  }

  return out;
}

function buildItemLocation(rootDir, testOrSuite) {
  if (!testOrSuite.location) return '';
  return `${path.relative(rootDir, testOrSuite.location.file)}:${testOrSuite.location.line}`;
}

function createTestGroups(rootSuite) {
  // This function groups tests that can be run together.
  // Tests cannot be run together when:
  // - They belong to different projects - requires different workers.
  // - They have a different repeatEachIndex - requires different workers.
  // - They have a different set of worker fixtures in the pool - requires different workers.
  // - They have a different requireFile - reuses the worker, but runs each requireFile separately.
  // - They belong to a parallel suite.
  // Using the map "workerHash -> requireFile -> group" makes us preserve the natural order
  // of worker hashes and require files for the simple cases.
  const groups = new Map();

  const createGroup = test => {
    return {
      workerHash: test._workerHash,
      requireFile: test._requireFile,
      repeatEachIndex: test._repeatEachIndex,
      projectIndex: test._projectIndex,
      tests: []
    };
  };

  for (const projectSuite of rootSuite.suites) {
    for (const test of projectSuite.allTests()) {
      let withWorkerHash = groups.get(test._workerHash);

      if (!withWorkerHash) {
        withWorkerHash = new Map();
        groups.set(test._workerHash, withWorkerHash);
      }

      let withRequireFile = withWorkerHash.get(test._requireFile);

      if (!withRequireFile) {
        withRequireFile = {
          general: createGroup(test),
          parallel: []
        };
        withWorkerHash.set(test._requireFile, withRequireFile);
      }

      let insideParallel = false;

      for (let parent = test.parent; parent; parent = parent.parent) insideParallel = insideParallel || parent._parallelMode === 'parallel';

      if (insideParallel) {
        const group = createGroup(test);
        group.tests.push(test);
        withRequireFile.parallel.push(group);
      } else {
        withRequireFile.general.tests.push(test);
      }
    }
  }

  const result = [];

  for (const withWorkerHash of groups.values()) {
    for (const withRequireFile of withWorkerHash.values()) {
      if (withRequireFile.general.tests.length) result.push(withRequireFile.general);
      result.push(...withRequireFile.parallel);
    }
  }

  return result;
}

class ListModeReporter {
  onBegin(config, suite) {
    console.log(`Listing tests:`);
    const tests = suite.allTests();
    const files = new Set();

    for (const test of tests) {
      // root, project, file, ...describes, test
      const [, projectName,, ...titles] = test.titlePath();
      const location = `${path.relative(config.rootDir, test.location.file)}:${test.location.line}:${test.location.column}`;
      const projectTitle = projectName ? `[${projectName}] › ` : '';
      console.log(`  ${projectTitle}${location} › ${titles.join(' ')}`);
      files.add(test.location.file);
    }

    console.log(`Total: ${tests.length} ${tests.length === 1 ? 'test' : 'tests'} in ${files.size} ${files.size === 1 ? 'file' : 'files'}`);
  }

}

const builtInReporters = ['list', 'line', 'dot', 'json', 'junit', 'null'];
exports.builtInReporters = builtInReporters;