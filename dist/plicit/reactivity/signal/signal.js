"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signal = exports.isSignal = void 0;
const is_1 = require("../../is");
const utils_1 = require("../../utils");
const constants_1 = require("./constants");
const effect_1 = require("./effect");
const scope_1 = require("./scope");
const utils_2 = require("./utils");
const isSignal = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return x.sym === "Signal";
};
exports.isSignal = isSignal;
const signal = (initial, options = {}) => {
    const init = (0, is_1.isFunction)(initial) ? initial : () => initial;
    const triggerFun = () => {
        if (options.isComputed) {
            sig._value = init(sig);
        }
        else {
            init(sig);
        }
        scope_1.GSignal.current = undefined;
        sig.watchers.forEach((watcher) => {
            watcher(sig._value);
        });
        if (options.isEffect) {
            return;
        }
        sig.trackedEffects.forEach((fx) => {
            fx();
        });
        sig.tracked.forEach((it) => {
            // console.log({it})
        });
    };
    const track = () => {
        const current = scope_1.GSignal.current;
        if (current && current !== sig && !sig.tracked.includes(current)) {
            sig.tracked.push(current);
            console.log(sig.tracked.length);
        }
        if (scope_1.GSignal.currentEffect &&
            !sig.trackedEffects.includes(scope_1.GSignal.currentEffect) &&
            scope_1.GSignal.currentEffect !== trigger) {
            sig.trackedEffects.push(scope_1.GSignal.currentEffect);
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
    const sig = {
        isComputed: options.isComputed,
        isEffect: options.isEffect,
        sym: "Signal",
        _value: (0, is_1.isFunction)(initial) ? null : initial,
        fun: () => init(sig),
        state: constants_1.ESignalState.UNINITIALIZED,
        trigger,
        peek: () => sig._value || init(sig),
        tracked: [],
        trackedEffects: [],
        watchers: [],
        get: () => {
            if (sig.state === constants_1.ESignalState.UNINITIALIZED || sig._value === null) {
                sig._value = init(sig);
                sig.state = constants_1.ESignalState.INITIALIZED;
            }
            track();
            return sig._value;
        },
        set: (fun) => {
            const nextValue = (0, is_1.isFunction)(fun) ? fun(sig._value) : fun;
            if (options.autoDiffCheck !== false &&
                (0, utils_2.canBeAutoDiffed)(sig._value, nextValue) &&
                nextValue === sig._value) {
                return;
            }
            sig._value = nextValue;
            sig.state = constants_1.ESignalState.DIRTY;
            trigger();
        },
    };
    (0, scope_1.withSignal)(sig, () => {
        (0, effect_1.callTrackableFunction)(trigger);
    });
    return sig;
};
exports.signal = signal;
//# sourceMappingURL=signal.js.map