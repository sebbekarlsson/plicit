"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncSignal = exports.isAsyncSignal = void 0;
const is_1 = require("../../is");
const utils_1 = require("../../utils");
const constants_1 = require("./constants");
const effect_1 = require("./effect");
const scope_1 = require("./scope");
const signal_1 = require("./signal");
const utils_2 = require("./utils");
const isAsyncSignal = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return x.sym === "AsyncSignal";
};
exports.isAsyncSignal = isAsyncSignal;
const asyncSignal = (initial, options = {}) => {
    if (options.isComputed !== false) {
        options.isComputed = true;
    }
    const init = (0, is_1.isFunction)(initial) ? initial : async () => initial;
    const callInit_ = async () => {
        sig.state = constants_1.ESignalState.LOADING;
        try {
            const ret = await init(sig);
            sig.state = constants_1.ESignalState.RESOLVED;
            return ret;
        }
        catch (e) {
            console.error(e);
            sig.state = constants_1.ESignalState.ERROR;
        }
        return null;
    };
    const callInit = options.defer ? () => {
        return new Promise((resolve) => {
            queueMicrotask(async () => {
                (0, scope_1.withSignal)(sig, async () => {
                    const ret = await callInit_();
                    resolve(ret);
                });
            });
        });
    } : callInit_;
    const triggerFun = async () => {
        scope_1.GSignal.current = sig;
        if (options.isComputed) {
            sig._value = await callInit();
        }
        else {
            await callInit();
        }
        scope_1.GSignal.current = undefined;
        sig.watchers.forEach((watcher) => {
            watcher(sig._value);
        });
        if (options.isEffect) {
            return;
        }
        sig.trackedEffects.forEach(async (fx) => {
            await fx();
        });
        sig.tracked.forEach((it) => {
            if ((0, signal_1.isSignal)(it)) {
                it.trigger();
            }
        });
    };
    const track = () => {
        const current = scope_1.GSignal.current;
        if (current && current !== sig && !sig.tracked.includes(current)) {
            sig.tracked.push(current);
        }
        if (scope_1.GSignal.currentEffect &&
            !sig.trackedEffects.includes(scope_1.GSignal.currentEffect) &&
            scope_1.GSignal.currentEffect !== trigger &&
            !sig.tracked.map((it) => it.trigger).includes(scope_1.GSignal.currentEffect)) {
            sig.trackedEffects.push(scope_1.GSignal.currentEffect);
        }
    };
    let trigger = triggerFun;
    if (typeof options.throttle === "number") {
        const [fn] = (0, utils_1.throttle)(trigger, options.throttle);
        trigger = fn;
    }
    const sig = {
        isComputed: options.isComputed,
        isEffect: options.isEffect,
        fallback: options.fallback,
        sym: "AsyncSignal",
        _value: (0, is_1.isFunction)(initial) ? null : initial,
        fun: callInit,
        state: constants_1.ESignalState.UNINITIALIZED,
        trigger,
        tracked: [],
        trackedEffects: [],
        watchers: [],
        get: () => {
            track();
            return sig._value || sig.fallback;
        },
        set: async (fun) => {
            const nextValue = (0, is_1.isFunction)(fun) ? await fun(sig._value) : fun;
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
    (0, scope_1.withAsyncSignal)(sig, async () => {
        await (0, effect_1.callTrackableAsyncFunction)(trigger);
    }).catch((e) => console.error(e));
    return sig;
};
exports.asyncSignal = asyncSignal;
//# sourceMappingURL=asyncSignal.js.map