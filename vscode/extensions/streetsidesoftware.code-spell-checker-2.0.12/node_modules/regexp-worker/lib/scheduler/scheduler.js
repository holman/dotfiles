"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBadRequest = exports.ErrorFailedRequest = exports.ErrorCanceledRequest = exports.Scheduler = void 0;
const worker_1 = require("../worker");
const procedure_1 = require("../Procedures/procedure");
const timer_1 = require("../timer");
const defaultTimeLimitMs = 1000;
const defaultSleepAfter = 200;
class Scheduler {
    constructor(executionTimeLimitMs = defaultTimeLimitMs) {
        this.executionTimeLimitMs = executionTimeLimitMs;
        this.stopped = false;
        this.dispose = () => this._dispose();
        this.pending = new Map();
        this.requestQueue = new Map();
        this.currentRequest = undefined;
    }
    scheduleRequest(request, timeLimitMs = this.executionTimeLimitMs) {
        if (this.stopped) {
            return Promise.reject(new ErrorCanceledRequest('Scheduler has been stopped', request.requestType, request.data));
        }
        if (!(0, procedure_1.isRequest)(request)) {
            return Promise.reject(new ErrorBadRequest('Bad Request', request));
        }
        if (this.requestQueue.has(request.id)) {
            return this.requestQueue.get(request.id).promise;
        }
        const promise = new Promise((resolve, reject) => {
            this.pending.set(request.id, { resolve: (v) => resolve(v), reject });
            this.trigger();
        }).then((r) => checkResponse(r, request.data));
        this.requestQueue.set(request.id, { request, promise, timeLimitMs, startTime: undefined });
        this.trigger();
        return promise;
    }
    _dispose() {
        if (this.stopped)
            return Promise.resolve();
        this.stopped = true;
        const ret = this.stopWorker();
        for (const requestId of this.requestQueue.keys()) {
            this.terminateRequest(requestId, 'Scheduler has been stopped');
        }
        this.pending.clear();
        this.requestQueue.clear();
        this.currentRequest = undefined;
        return ret;
    }
    terminateRequest(requestId, message = 'Request Terminated') {
        if (requestId === this.currentRequest)
            this.stopWorker();
        const contract = this.pending.get(requestId);
        if (!contract) {
            this.cleanupRequest(requestId);
            return Promise.reject(new ErrorBadRequest('Unknown Request'));
        }
        const request = this.requestQueue.get(requestId);
        // istanbul ignore else
        const elapsedTime = (request === null || request === void 0 ? void 0 : request.startTime) ? (0, timer_1.elapsedTimeMsFrom)(request.startTime) : 0;
        // istanbul ignore else
        contract.reject(new ErrorCanceledRequest(message, (request === null || request === void 0 ? void 0 : request.request.requestType) || 'Unknown', elapsedTime));
        this.cleanupRequest(requestId);
        return Promise.resolve();
    }
    stopWorker() {
        if (!this._worker)
            return Promise.resolve();
        this._worker.removeAllListeners();
        const p = this._worker.terminate().then(() => { });
        this._worker = undefined;
        return p;
    }
    listener(m) {
        // istanbul ignore else
        if ((0, procedure_1.isResponse)(m)) {
            const contract = this.pending.get(m.id);
            this.cleanupRequest(m.id);
            // istanbul ignore else
            if (contract) {
                contract.resolve(m);
                return;
            }
        }
        console.warn(`Unhandled Response ${JSON.stringify(m)}`);
    }
    trigger() {
        if (this.stopped || this.currentRequest)
            return;
        setImmediate(() => {
            if (this.stopped || this.currentRequest)
                return;
            const req = this.getNextRequest();
            if (!req) {
                // Nothing to do, stop the worker
                // This helps prevent shutdown issues if the app forgets to call dispose()
                this.scheduleTimeout(() => this.stopWorker(), defaultSleepAfter);
                return;
            }
            req.startTime = process.hrtime();
            const requestId = req.request.id;
            this.currentRequest = requestId;
            this.scheduleTimeout(() => this.terminateRequest(requestId, 'Request Timeout'), req.timeLimitMs);
            this.worker.postMessage(req.request);
        });
    }
    cleanupRequest(id) {
        this.pending.delete(id);
        this.requestQueue.delete(id);
        // istanbul ignore else
        if (this.currentRequest === id) {
            this.currentRequest = undefined;
            // istanbul ignore else
            if (this.timeoutID)
                clearTimeout(this.timeoutID);
            this.timeoutID = undefined;
        }
        this.trigger();
    }
    scheduleTimeout(fn, delayMs) {
        if (this.timeoutID)
            clearTimeout(this.timeoutID);
        this.timeoutID = setTimeout(fn, delayMs);
    }
    getNextRequest() {
        const next = this.requestQueue.entries().next();
        if (next.done) {
            return undefined;
        }
        return next.value[1];
    }
    static createRequest(requestType, data) {
        return (0, procedure_1.createRequest)(requestType, data);
    }
    get worker() {
        if (!this._worker) {
            this._worker = (0, worker_1.createWorker)();
            this._worker.on('message', (v) => this.listener(v));
        }
        return this._worker;
    }
}
exports.Scheduler = Scheduler;
class ErrorCanceledRequest {
    constructor(message, requestType, elapsedTimeMs, data) {
        this.message = message;
        this.requestType = requestType;
        this.elapsedTimeMs = elapsedTimeMs;
        this.data = data;
        this.timestamp = Date.now();
    }
}
exports.ErrorCanceledRequest = ErrorCanceledRequest;
class ErrorFailedRequest {
    constructor(message, requestType, data) {
        this.message = message;
        this.requestType = requestType;
        this.data = data;
        this.timestamp = Date.now();
    }
}
exports.ErrorFailedRequest = ErrorFailedRequest;
class ErrorBadRequest {
    constructor(message, data) {
        this.message = message;
        this.data = data;
        this.timestamp = Date.now();
    }
}
exports.ErrorBadRequest = ErrorBadRequest;
/**
 * Checks the type of a response or throws the response
 */
function checkResponse(response, data) {
    if ((0, procedure_1.isErrorResponse)(response)) {
        throw new ErrorFailedRequest(response.data.message, response.data.requestType, data);
    }
    return response;
}
//# sourceMappingURL=scheduler.js.map