"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effect = exports.injectTrackableFunction = exports.callTrackableAsyncFunction = exports.callTrackableFunction = exports.effectSignal = void 0;
const scope_1 = require("./scope");
const signal_1 = require("./signal");
const effectSignal = (init, options = { isEffect: true }) => (0, signal_1.signal)(init, { ...options, isEffect: true });
exports.effectSignal = effectSignal;
const callTrackableFunction = (fun) => {
    scope_1.GSignal.currentEffect = fun;
    const ret = fun();
    scope_1.GSignal.currentEffect = undefined;
    return ret;
};
exports.callTrackableFunction = callTrackableFunction;
const callTrackableAsyncFunction = async (fun) => {
    scope_1.GSignal.currentEffect = fun;
    const ret = await fun();
    scope_1.GSignal.currentEffect = undefined;
    return ret;
};
exports.callTrackableAsyncFunction = callTrackableAsyncFunction;
const injectTrackableFunction = (fun) => {
    if (scope_1.GSignal.current) {
        scope_1.GSignal.current.trackedEffects.push(fun);
    }
};
exports.injectTrackableFunction = injectTrackableFunction;
const effect = (fun) => {
    (0, exports.callTrackableFunction)(fun);
};
exports.effect = effect;
//# sourceMappingURL=effect.js.map