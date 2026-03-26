var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/.pnpm/@cloudflare+unenv-preset@2.16.0_unenv@2.0.0-rc.24_workerd@1.20260317.1/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/.pnpm/@cloudflare+unenv-preset@2.16.0_unenv@2.0.0-rc.24_workerd@1.20260317.1/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/.pnpm/wrangler@4.77.0_@cloudflare+workers-types@4.20260317.1/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// node_modules/.pnpm/unenv@2.0.0-rc.24/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// node_modules/.pnpm/@cloudflare+unenv-preset@2.16.0_unenv@2.0.0-rc.24_workerd@1.20260317.1/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/.pnpm/wrangler@4.77.0_@cloudflare+workers-types@4.20260317.1/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/router.ts
var Router = class {
  static {
    __name(this, "Router");
  }
  routes = [];
  on(method, pathname, handler) {
    this.routes.push({
      method: method.toUpperCase(),
      pattern: new URLPattern({ pathname }),
      handler
    });
    return this;
  }
  get(pathname, handler) {
    return this.on("GET", pathname, handler);
  }
  post(pathname, handler) {
    return this.on("POST", pathname, handler);
  }
  delete(pathname, handler) {
    return this.on("DELETE", pathname, handler);
  }
  async handle(request, env2) {
    const url = new URL(request.url);
    for (const route of this.routes) {
      if (route.method !== request.method && route.method !== "ALL") continue;
      const match = route.pattern.exec(url);
      if (match) {
        const params = match.pathname.groups;
        return route.handler(request, env2, params);
      }
    }
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// src/oauth.ts
var GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
var GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
async function resolveSecret(secret) {
  return await secret;
}
__name(resolveSecret, "resolveSecret");
async function buildAuthUrl(env2, redirectUri, state) {
  const clientId = await resolveSecret(env2.GOOGLE_CLIENT_ID);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: env2.OAUTH_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}
__name(buildAuthUrl, "buildAuthUrl");
async function exchangeCode(env2, code, redirectUri) {
  const [clientId, clientSecret] = await Promise.all([
    resolveSecret(env2.GOOGLE_CLIENT_ID),
    resolveSecret(env2.GOOGLE_CLIENT_SECRET)
  ]);
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri
    })
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Token exchange failed (${response.status}): ${err}`);
  }
  const data = await response.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1e3,
    scope: data.scope
  };
}
__name(exchangeCode, "exchangeCode");
async function refreshAccessToken(env2, refreshToken) {
  const [clientId, clientSecret] = await Promise.all([
    resolveSecret(env2.GOOGLE_CLIENT_ID),
    resolveSecret(env2.GOOGLE_CLIENT_SECRET)
  ]);
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Token refresh failed (${response.status}): ${err}`);
  }
  const data = await response.json();
  return {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1e3
  };
}
__name(refreshAccessToken, "refreshAccessToken");
function tokenKey(userId) {
  return `tokens:${userId}`;
}
__name(tokenKey, "tokenKey");
async function storeTokens(kv, userId, tokens) {
  await kv.put(tokenKey(userId), JSON.stringify(tokens));
}
__name(storeTokens, "storeTokens");
async function getValidToken(env2, userId) {
  const raw = await env2.TOKEN_STORE.get(tokenKey(userId));
  if (!raw) return null;
  const tokens = JSON.parse(raw);
  if (Date.now() > tokens.expires_at - 6e4) {
    const refreshed = await refreshAccessToken(env2, tokens.refresh_token);
    tokens.access_token = refreshed.access_token;
    tokens.expires_at = refreshed.expires_at;
    await storeTokens(env2.TOKEN_STORE, userId, tokens);
  }
  return tokens.access_token;
}
__name(getValidToken, "getValidToken");

// src/api.ts
function encodePathSegment(value) {
  return encodeURIComponent(value);
}
__name(encodePathSegment, "encodePathSegment");
var GOOGLE_APIS = {
  gmail: "https://gmail.googleapis.com/gmail/v1",
  drive: "https://www.googleapis.com/drive/v3",
  calendar: "https://www.googleapis.com/calendar/v3",
  sheets: "https://sheets.googleapis.com/v4/spreadsheets",
  docs: "https://docs.googleapis.com/v1/documents",
  chat: "https://chat.googleapis.com/v1",
  admin: "https://admin.googleapis.com/admin/directory/v1"
};
function getUserId(request) {
  return request.headers.get("X-GWS-User") || "default";
}
__name(getUserId, "getUserId");
async function proxyToGoogle(env2, request, googleUrl, method = "GET", body) {
  const userId = getUserId(request);
  const token = await getValidToken(env2, userId);
  if (!token) {
    return Response.json(
      {
        error: "Not authenticated",
        message: "Visit /auth/login to authenticate with Google"
      },
      { status: 401 }
    );
  }
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
  const googleResponse = await fetch(googleUrl, {
    method,
    headers,
    body: method !== "GET" ? body : void 0
  });
  const data = await googleResponse.json();
  return Response.json(data, { status: googleResponse.status });
}
__name(proxyToGoogle, "proxyToGoogle");
function forwardQuery(request) {
  const url = new URL(request.url);
  const params = new URLSearchParams();
  for (const [key, value] of url.searchParams) {
    if (!key.startsWith("_")) {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
__name(forwardQuery, "forwardQuery");
function registerApiRoutes(router2) {
  router2.get("/api/gmail/threads", async (req, env2) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.gmail}/users/me/threads${qs}`);
  });
  router2.get("/api/gmail/messages", async (req, env2) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.gmail}/users/me/messages${qs}`);
  });
  router2.get("/api/gmail/messages/:id", async (req, env2, params) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.gmail}/users/me/messages/${encodePathSegment(params.id)}${qs}`);
  });
  router2.post("/api/gmail/messages/send", async (req, env2) => {
    const body = await req.text();
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.gmail}/users/me/messages/send`, "POST", body);
  });
  router2.get("/api/gmail/labels", async (req, env2) => {
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.gmail}/users/me/labels`);
  });
  router2.get("/api/drive/files", async (req, env2) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.drive}/files${qs}`);
  });
  router2.get("/api/drive/files/:id", async (req, env2, params) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.drive}/files/${encodePathSegment(params.id)}${qs}`);
  });
  router2.post("/api/drive/files", async (req, env2) => {
    const body = await req.text();
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.drive}/files`, "POST", body);
  });
  router2.delete("/api/drive/files/:id", async (req, env2, params) => {
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.drive}/files/${encodePathSegment(params.id)}`, "DELETE");
  });
  router2.get("/api/calendar/events", async (req, env2) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(
      env2,
      req,
      `${GOOGLE_APIS.calendar}/calendars/primary/events${qs}`
    );
  });
  router2.get("/api/calendar/events/:id", async (req, env2, params) => {
    return proxyToGoogle(
      env2,
      req,
      `${GOOGLE_APIS.calendar}/calendars/primary/events/${encodePathSegment(params.id)}`
    );
  });
  router2.post("/api/calendar/events", async (req, env2) => {
    const body = await req.text();
    return proxyToGoogle(
      env2,
      req,
      `${GOOGLE_APIS.calendar}/calendars/primary/events`,
      "POST",
      body
    );
  });
  router2.get("/api/sheets/:id", async (req, env2, params) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.sheets}/${encodePathSegment(params.id)}${qs}`);
  });
  router2.get("/api/sheets/:id/values/:range", async (req, env2, params) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(
      env2,
      req,
      `${GOOGLE_APIS.sheets}/${encodePathSegment(params.id)}/values/${encodePathSegment(params.range)}${qs}`
    );
  });
  router2.post("/api/sheets/:id/values/:range", async (req, env2, params) => {
    const qs = forwardQuery(req);
    const body = await req.text();
    return proxyToGoogle(
      env2,
      req,
      `${GOOGLE_APIS.sheets}/${encodePathSegment(params.id)}/values/${encodePathSegment(params.range)}:append${qs}`,
      "POST",
      body
    );
  });
  router2.get("/api/docs/:id", async (req, env2, params) => {
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.docs}/${encodePathSegment(params.id)}`);
  });
  router2.post("/api/docs/:id/batchUpdate", async (req, env2, params) => {
    const body = await req.text();
    return proxyToGoogle(
      env2,
      req,
      `${GOOGLE_APIS.docs}/${encodePathSegment(params.id)}:batchUpdate`,
      "POST",
      body
    );
  });
  router2.get("/api/chat/spaces", async (req, env2) => {
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.chat}/spaces`);
  });
  router2.post("/api/chat/spaces/:space/messages", async (req, env2, params) => {
    const body = await req.text();
    return proxyToGoogle(
      env2,
      req,
      `${GOOGLE_APIS.chat}/spaces/${encodePathSegment(params.space)}/messages`,
      "POST",
      body
    );
  });
  router2.get("/api/admin/users", async (req, env2) => {
    const qs = forwardQuery(req);
    return proxyToGoogle(env2, req, `${GOOGLE_APIS.admin}/users${qs}`);
  });
  const ALLOWED_HOSTS = [".googleapis.com", ".google.com"];
  function isAllowedGoogleUrl(target) {
    try {
      const parsed = new URL(target);
      return parsed.protocol === "https:" && ALLOWED_HOSTS.some((suffix) => parsed.hostname.endsWith(suffix));
    } catch {
      return false;
    }
  }
  __name(isAllowedGoogleUrl, "isAllowedGoogleUrl");
  router2.get("/api/proxy", async (req, env2) => {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    if (!target || !isAllowedGoogleUrl(target)) {
      return Response.json(
        { error: "Missing or invalid ?url= parameter. Only *.googleapis.com URLs are allowed." },
        { status: 400 }
      );
    }
    return proxyToGoogle(env2, req, target);
  });
  router2.post("/api/proxy", async (req, env2) => {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    if (!target || !isAllowedGoogleUrl(target)) {
      return Response.json(
        { error: "Missing or invalid ?url= parameter. Only *.googleapis.com URLs are allowed." },
        { status: 400 }
      );
    }
    const body = await req.text();
    return proxyToGoogle(env2, req, target, "POST", body);
  });
}
__name(registerApiRoutes, "registerApiRoutes");

// src/index.ts
var router = new Router();
router.get("/", async () => {
  return Response.json({
    name: "gws-worker",
    version: "0.1.0",
    description: "Google Workspace API proxy on Cloudflare Workers",
    endpoints: {
      auth: {
        login: "GET /auth/login",
        callback: "GET /auth/callback",
        status: "GET /auth/status"
      },
      apis: {
        gmail: [
          "GET /api/gmail/threads",
          "GET /api/gmail/messages",
          "GET /api/gmail/messages/:id",
          "POST /api/gmail/messages/send",
          "GET /api/gmail/labels"
        ],
        drive: [
          "GET /api/drive/files",
          "GET /api/drive/files/:id",
          "POST /api/drive/files",
          "DELETE /api/drive/files/:id"
        ],
        calendar: [
          "GET /api/calendar/events",
          "GET /api/calendar/events/:id",
          "POST /api/calendar/events"
        ],
        sheets: [
          "GET /api/sheets/:id",
          "GET /api/sheets/:id/values/:range",
          "POST /api/sheets/:id/values/:range"
        ],
        docs: [
          "GET /api/docs/:id",
          "POST /api/docs/:id/batchUpdate"
        ],
        chat: [
          "GET /api/chat/spaces",
          "POST /api/chat/spaces/:space/messages"
        ],
        admin: ["GET /api/admin/users"],
        proxy: [
          "GET /api/proxy?url=<google-api-url>",
          "POST /api/proxy?url=<google-api-url>"
        ]
      }
    }
  });
});
router.get("/auth/login", async (request, env2) => {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/auth/callback`;
  const userId = request.headers.get("X-GWS-User") || "default";
  const state = btoa(JSON.stringify({ userId, ts: Date.now() }));
  const authUrl = await buildAuthUrl(env2, redirectUri, state);
  return Response.redirect(authUrl, 302);
});
router.get("/auth/callback", async (request, env2) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  const error3 = url.searchParams.get("error");
  if (error3) {
    return Response.json({ error: `OAuth error: ${error3}` }, { status: 400 });
  }
  if (!code || !stateParam) {
    return Response.json(
      { error: "Missing code or state parameter" },
      { status: 400 }
    );
  }
  let userId = "default";
  try {
    const state = JSON.parse(atob(stateParam));
    userId = state.userId || "default";
  } catch {
  }
  const redirectUri = `${url.origin}/auth/callback`;
  const tokens = await exchangeCode(env2, code, redirectUri);
  await storeTokens(env2.TOKEN_STORE, userId, tokens);
  return Response.json({
    message: "Authentication successful",
    userId,
    scopes: tokens.scope
  });
});
router.get("/auth/status", async (request, env2) => {
  const userId = request.headers.get("X-GWS-User") || "default";
  const token = await getValidToken(env2, userId);
  return Response.json({
    authenticated: token !== null,
    userId
  });
});
registerApiRoutes(router);
var index_default = {
  async fetch(request, env2) {
    try {
      return await router.handle(request, env2);
    } catch (err) {
      console.error("Worker error:", err);
      return Response.json(
        { error: "Internal Server Error", message: err.message },
        { status: 500 }
      );
    }
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
