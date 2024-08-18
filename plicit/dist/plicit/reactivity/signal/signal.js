"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchSignal = exports.effectSignal = exports.computedSignal = exports.signal = exports.isSignal = exports.GSignal = void 0;
const is_1 = require("../../is");
const utils_1 = require("../../utils");
const constants_1 = require("./constants");
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
    const triggerFun = () => {
        if (options.isComputed) {
            sig.node._value = init();
        }
        else {
            init();
        }
        exports.GSignal.current = undefined;
        sig.watchers.forEach((watcher) => watcher(sig.node._value));
        if (options.isEffect) {
            return;
        }
        sig.trackedEffects.forEach((fx) => fx());
    };
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
    };
    let trigger = triggerFun;
    if (typeof options.debounce === "number") {
        trigger = (0, utils_1.debounce)(trigger, options.debounce);
    }
    if (typeof options.throttle === "number") {
        const [fn] = (0, utils_1.throttle)(trigger, options.throttle);
        trigger = fn;
    }
    const canBeAutoDiffed = (a, b) => {
        return (typeof a !== 'object' && typeof b !== 'object');
    };
    const sig = {
        isComputed: options.isComputed,
        isEffect: options.isEffect,
        sym: "Signal",
        uid: uid,
        node: {
            _value: (0, is_1.isFunction)(initial) ? null : initial,
            fun: init,
            state: constants_1.ESignalState.UNINITIALIZED,
        },
        trigger,
        peek: () => sig.node._value || init(),
        tracked: [],
        trackedEffects: [],
        watchers: [],
        get: () => {
            if (sig.node.state === constants_1.ESignalState.UNINITIALIZED ||
                sig.node._value === null) {
                sig.node._value = init();
                sig.node.state = constants_1.ESignalState.INITIALIZED;
            }
            track();
            return sig.node._value;
        },
        set: (fun) => {
            const nextValue = (0, is_1.isFunction)(fun) ? fun(sig.node._value) : fun;
            if ((options.autoDiffCheck !== false) && canBeAutoDiffed(sig.node._value, nextValue) && (nextValue === sig.node._value)) {
                return;
            }
            sig.node._value = nextValue;
            sig.node.state = constants_1.ESignalState.DIRTY;
            trigger();
        },
    };
    exports.GSignal.current = sig;
    exports.GSignal.currentEffect = trigger;
    trigger();
    exports.GSignal.currentEffect = undefined;
    exports.GSignal.current = undefined;
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