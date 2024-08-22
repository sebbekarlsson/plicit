"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callTrackableFunction = exports.effectSignal = void 0;
const scope_1 = require("./scope");
const signal_1 = require("./signal");
const effectSignal = (init, options = { isEffect: true }) => (0, signal_1.signal)(init, { ...options, isEffect: true });
exports.effectSignal = effectSignal;
const callTrackableFunction = (fun) => {
    scope_1.GSignal.currentEffect = fun;
    fun();
    scope_1.GSignal.currentEffect = undefined;
};
exports.callTrackableFunction = callTrackableFunction;
//# sourceMappingURL=effect.js.map