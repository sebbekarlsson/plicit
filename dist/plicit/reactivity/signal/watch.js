"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchAsyncSignal = exports.watchSignal = void 0;
const signal_1 = require("./signal");
const watchSignal = (sig, fun, options = {}) => {
    if (!sig.watchers.includes(fun)) {
        sig.watchers.push(fun);
    }
    if (options.immediate) {
        fun(sig._value);
    }
    const unsubscribeFuns = [];
    if (options.deep) {
        for (const tracked of sig.tracked) {
            if ((0, signal_1.isSignal)(tracked)) {
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
const watchAsyncSignal = (sig, fun, options = {}) => {
    if (!sig.watchers.includes(fun)) {
        sig.watchers.push(fun);
    }
    if (options.immediate) {
        fun(sig._value);
    }
    const unsubscribeFuns = [];
    if (options.deep) {
        for (const tracked of sig.tracked) {
            if ((0, signal_1.isSignal)(tracked)) {
                unsubscribeFuns.push((0, exports.watchSignal)(tracked, fun, options));
            }
        }
    }
    return () => {
        sig.watchers = sig.watchers.filter((it) => it !== fun);
        unsubscribeFuns.forEach((unsub) => unsub());
    };
};
exports.watchAsyncSignal = watchAsyncSignal;
//# sourceMappingURL=watch.js.map