"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pset = exports.pgetDeep = exports.pget = void 0;
const signal_1 = require("./signal");
const asyncSignal_1 = require("./signal/asyncSignal");
const pget = (x) => {
    if ((0, signal_1.isSignal)(x))
        return x.get();
    if ((0, asyncSignal_1.isAsyncSignal)(x))
        return x.get();
    return x;
};
exports.pget = pget;
const pgetDeep = (x) => {
    if ((0, signal_1.isSignal)(x))
        return (0, exports.pgetDeep)(x.get());
    if ((0, asyncSignal_1.isAsyncSignal)(x))
        return (0, exports.pgetDeep)(x.get());
    return x;
};
exports.pgetDeep = pgetDeep;
const pset = (x, set) => {
    if ((0, signal_1.isSignal)(x)) {
        x.set(set);
    }
};
exports.pset = pset;
//# sourceMappingURL=utils.js.map