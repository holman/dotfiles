"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showTraceViewer = showTraceViewer;
exports.TraceViewer = void 0;

var _extractZip = _interopRequireDefault(require("extract-zip"));

var _fs = _interopRequireDefault(require("fs"));

var _readline = _interopRequireDefault(require("readline"));

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _rimraf = _interopRequireDefault(require("rimraf"));

var _playwright = require("../../playwright");

var _traceModel = require("./traceModel");

var _httpServer = require("../../../utils/httpServer");

var _snapshotServer = require("../../snapshot/snapshotServer");

var consoleApiSource = _interopRequireWildcard(require("../../../generated/consoleApiSource"));

var _utils = require("../../../utils/utils");

var _instrumentation = require("../../instrumentation");

var _progress = require("../../progress");

var _registry = require("../../../utils/registry");

var _crApp = require("../../chromium/crApp");

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
class TraceViewer {
  constructor(tracesDir, browserName) {
    this._server = void 0;
    this._browserName = void 0;
    this._browserName = browserName;

    const resourcesDir = _path.default.join(tracesDir, 'resources'); // Served by TraceServer
    // - "/tracemodel" - json with trace model.
    //
    // Served by TraceViewer
    // - "/traceviewer/..." - our frontend.
    // - "/file?filePath" - local files, used by sources tab.
    // - "/sha1/<sha1>" - trace resource bodies, used by network previews.
    //
    // Served by SnapshotServer
    // - "/resources/" - network resources from the trace.
    // - "/snapshot/" - root for snapshot frame.
    // - "/snapshot/pageId/..." - actual snapshot html.
    // - "/snapshot/service-worker.js" - service worker that intercepts snapshot resources
    //   and translates them into network requests.


    const actionTraces = _fs.default.readdirSync(tracesDir).filter(name => name.endsWith('.trace'));

    const debugNames = actionTraces.map(name => {
      const tracePrefix = _path.default.join(tracesDir, name.substring(0, name.indexOf('.trace')));

      return _path.default.basename(tracePrefix);
    });
    this._server = new _httpServer.HttpServer();

    const traceListHandler = (request, response) => {
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(debugNames));
      return true;
    };

    this._server.routePath('/contexts', traceListHandler);

    const snapshotStorage = new _traceModel.PersistentSnapshotStorage(resourcesDir);
    new _snapshotServer.SnapshotServer(this._server, snapshotStorage);

    const traceModelHandler = (request, response) => {
      const debugName = request.url.substring('/context/'.length);
      snapshotStorage.clear();
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      (async () => {
        const traceFile = _path.default.join(tracesDir, debugName + '.trace');

        const match = debugName.match(/^(.*)-\d+$/);

        const networkFile = _path.default.join(tracesDir, (match ? match[1] : debugName) + '.network');

        const model = new _traceModel.TraceModel(snapshotStorage);
        await appendTraceEvents(model, traceFile);
        if (_fs.default.existsSync(networkFile)) await appendTraceEvents(model, networkFile);
        model.build();
        response.end(JSON.stringify(model.contextEntry));
      })().catch(e => console.error(e));
      return true;
    };

    this._server.routePrefix('/context/', traceModelHandler);

    const traceViewerHandler = (request, response) => {
      const relativePath = request.url.substring('/traceviewer/'.length);

      const absolutePath = _path.default.join(__dirname, '..', '..', '..', 'web', ...relativePath.split('/'));

      return this._server.serveFile(response, absolutePath);
    };

    this._server.routePrefix('/traceviewer/', traceViewerHandler);

    const fileHandler = (request, response) => {
      try {
        const url = new URL('http://localhost' + request.url);
        const search = url.search;
        if (search[0] !== '?') return false;
        return this._server.serveFile(response, search.substring(1));
      } catch (e) {
        return false;
      }
    };

    this._server.routePath('/file', fileHandler);

    const sha1Handler = (request, response) => {
      const sha1 = request.url.substring('/sha1/'.length);
      if (sha1.includes('/')) return false;
      return this._server.serveFile(response, _path.default.join(resourcesDir, sha1));
    };

    this._server.routePrefix('/sha1/', sha1Handler);
  }

  async show(headless) {
    const urlPrefix = await this._server.start();
    const traceViewerPlaywright = (0, _playwright.createPlaywright)('javascript', true);
    const traceViewerBrowser = (0, _utils.isUnderTest)() ? 'chromium' : this._browserName;
    const args = traceViewerBrowser === 'chromium' ? ['--app=data:text/html,', '--window-size=1280,800'] : [];
    if ((0, _utils.isUnderTest)()) args.push(`--remote-debugging-port=0`); // For Chromium, fall back to the stable channels of popular vendors for work out of the box.
    // Null means no installation and no channels found.

    let channel = null;

    if (traceViewerBrowser === 'chromium') {
      for (const name of ['chromium', 'chrome', 'msedge']) {
        try {
          _registry.registry.findExecutable(name).executablePathOrDie(traceViewerPlaywright.options.sdkLanguage);

          channel = name === 'chromium' ? undefined : name;
          break;
        } catch (e) {}
      }

      if (channel === null) {
        // TODO: language-specific error message, or fallback to default error.
        throw new Error(`
==================================================================
Please run 'npx playwright install' to install Playwright browsers
==================================================================
`);
      }
    }

    const context = await traceViewerPlaywright[traceViewerBrowser].launchPersistentContext((0, _instrumentation.internalCallMetadata)(), '', {
      // TODO: store language in the trace.
      channel: channel,
      args,
      noDefaultViewport: true,
      headless,
      useWebSocket: (0, _utils.isUnderTest)()
    });
    const controller = new _progress.ProgressController((0, _instrumentation.internalCallMetadata)(), context._browser);
    await controller.run(async progress => {
      await context._browser._defaultContext._loadDefaultContextAsIs(progress);
    });
    await context.extendInjectedScript(consoleApiSource.source);
    const [page] = context.pages();
    if (traceViewerBrowser === 'chromium') await (0, _crApp.installAppIcon)(page);
    if ((0, _utils.isUnderTest)()) page.on('close', () => context.close((0, _instrumentation.internalCallMetadata)()).catch(() => {}));else page.on('close', () => process.exit());
    await page.mainFrame().goto((0, _instrumentation.internalCallMetadata)(), urlPrefix + '/traceviewer/traceViewer/index.html');
    return context;
  }

}

exports.TraceViewer = TraceViewer;

async function appendTraceEvents(model, file) {
  const fileStream = _fs.default.createReadStream(file, 'utf8');

  const rl = _readline.default.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) model.appendEvent(line);
}

async function showTraceViewer(tracePath, browserName, headless = false) {
  let stat;

  try {
    stat = _fs.default.statSync(tracePath);
  } catch (e) {
    console.log(`No such file or directory: ${tracePath}`); // eslint-disable-line no-console

    return;
  }

  if (stat.isDirectory()) {
    const traceViewer = new TraceViewer(tracePath, browserName);
    return await traceViewer.show(headless);
  }

  const zipFile = tracePath;

  const dir = _fs.default.mkdtempSync(_path.default.join(_os.default.tmpdir(), `playwright-trace`));

  process.on('exit', () => _rimraf.default.sync(dir));

  try {
    await (0, _extractZip.default)(zipFile, {
      dir
    });
  } catch (e) {
    console.log(`Invalid trace file: ${zipFile}`); // eslint-disable-line no-console

    return;
  }

  const traceViewer = new TraceViewer(dir, browserName);
  return await traceViewer.show(headless);
}