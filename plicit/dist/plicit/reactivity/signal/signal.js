"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchSignal = exports.effectSignal = exports.computedSignal = exports.signal = exports.isSignal = exports.GSignal = void 0;
const event_1 = require("../../event");
const is_1 = require("../../is");
const proxy_1 = require("../proxy");
const utils_1 = require("../../utils");
const constants_1 = require("./constants");
const event_2 = require("./event");
// @ts-ignore
const oldG = window.GSignal;
exports.GSignal = oldG || {
    current: undefined,
    currentEffect: undefined,
    idCounter: 0,
};
// @ts-ignore
window.GSignal = exports.GSignal;
const nextId = () => {
    const n = exports.GSignal.idCounter;
    exports.GSignal.idCounter = exports.GSignal.idCounter + 1;
    return `${n}`;
};
const isSignal = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return x.sym === "Signal";
};
exports.isSignal = isSignal;
const signal = (initial, options = {}) => {
    const uid = options.uid || nextId();
    const init = (0, is_1.isFunction)(initial) ? initial : () => initial;
    const node = (0, proxy_1.proxy)({
        index: -1,
        _value: (0, is_1.isFunction)(initial) ? null : initial,
        fun: init,
        state: constants_1.ESignalState.UNINITIALIZED,
    });
    const emit = (event) => {
        sig.emitter.emit({ ...event, target: sig });
    };
    const withUpdateEvents = (fn) => {
        emit({ type: event_2.ESignalEvent.BEFORE_UPDATE, payload: {} });
        fn();
        emit({ type: event_2.ESignalEvent.AFTER_UPDATE, payload: {} });
    };
    const triggerFun = () => {
        emit({ type: event_2.ESignalEvent.TRIGGER, payload: {} });
        if (options.isComputed) {
            withUpdateEvents(() => {
                node._value = init();
            });
        }
        else {
            withUpdateEvents(() => init());
        }
        exports.GSignal.current = undefined;
        sig.watchers.forEach((watcher) => watcher(sig.node._value));
        if (options.isEffect) {
            return;
        }
        sig.trackedEffects.forEach((fx) => fx());
    };
    let unsubs = [];
    const track = () => {
        const current = exports.GSignal.current;
        if (current && current !== sig && !sig.tracked.includes(current)) {
            sig.tracked.push(current);
        }
        if (exports.GSignal.currentEffect &&
            !sig.trackedEffects.includes(exports.GSignal.currentEffect) &&
            exports.GSignal.currentEffect !== trigger) {
            sig.trackedEffects.push(exports.GSignal.currentEffect);
        }
        emit({ type: event_2.ESignalEvent.TRACK, payload: {} });
    };
    let trigger = triggerFun;
    if (typeof options.debounce === "number") {
        trigger = (0, utils_1.debounce)(trigger, options.debounce);
    }
    if (typeof options.throttle === "number") {
        const [fn] = (0, utils_1.throttle)(trigger, options.throttle);
        trigger = fn;
    }
    const now = performance.now();
    const sig = {
        createdAt: now,
        isComputed: options.isComputed,
        isEffect: options.isEffect,
        emitter: new event_1.EventEmitter(),
        sym: "Signal",
        uid: uid,
        node,
        trigger,
        peek: () => node._value || init(),
        tracked: [],
        trackedEffects: [],
        watchers: [],
        get: () => {
            if (node.state === constants_1.ESignalState.UNINITIALIZED || node._value === null) {
                //        trigger();
                node._value = init();
                node.state = constants_1.ESignalState.INITIALIZED;
            }
            track();
            queueMicrotask(() => {
                sig.lastGet = performance.now();
            });
            return node._value;
        },
        set: (fun) => {
            //const oldValue = node._value;
            const nextValue = (0, is_1.isFunction)(fun) ? fun(node._value) : fun;
            //if (nextValue === oldValue) {
            //  return;
            //}
            //
            node._value = nextValue;
            node.state = constants_1.ESignalState.DIRTY;
            trigger();
            queueMicrotask(() => {
                sig.lastSet = performance.now();
            });
        },
        dispose: () => {
            queueMicrotask(() => {
                sig.isTrash = true;
                unsubs.forEach((unsub) => unsub());
                unsubs = [];
                sig.emitter.clear();
            });
        },
        lastSet: -1,
        lastGet: -1,
    };
    exports.GSignal.current = sig;
    exports.GSignal.currentEffect = trigger;
    trigger();
    exports.GSignal.currentEffect = undefined;
    exports.GSignal.current = undefined;
    // if (!options.isEffect) {
    //   pushToStack(sig);
    //   GSignal.current = sig;
    // }
    return sig;
};
exports.signal = signal;
const computedSignal = (init, options = { isComputed: true }) => (0, exports.signal)(init, { ...options, isComputed: true });
exports.computedSignal = computedSignal;
const effectSignal = (init, options = { isEffect: true }) => (0, exports.signal)(init, { ...options, isEffect: true });
exports.effectSignal = effectSignal;
const watchSignal = (sig, fun, options = {}) => {
    if (!sig.watchers.includes(fun)) {
        sig.watchers.push(fun);
    }
    if (options.immediate) {
        fun(sig.node._value);
    }
    const unsubscribeFuns = [];
    if (options.deep) {
        for (const tracked of sig.tracked) {
            if ((0, exports.isSignal)(tracked)) {
                unsubscribeFuns.push((0, exports.watchSignal)(tracked, fun, options));
            }
        }
    }
    return () => {
        sig.watchers = sig.watchers.filter((it) => it !== fun);
        unsubscribeFuns.forEach((unsub) => unsub());
    };
};
exports.watchSignal = watchSignal;
//# sourceMappingURL=signal.js.map