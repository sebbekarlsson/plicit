"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAsyncSignal = exports.withSignal = exports.GSignal = void 0;
// @ts-ignore
const oldG = window.GSignal;
exports.GSignal = oldG || {
    current: undefined,
    currentEffect: undefined,
    idCounter: 0,
};
// @ts-ignore
window.GSignal = exports.GSignal;
const withSignal = (sig, fun) => {
    exports.GSignal.current = sig;
    const ret = fun();
    exports.GSignal.current = undefined;
    return ret;
};
exports.withSignal = withSignal;
const withAsyncSignal = async (sig, fun) => {
    exports.GSignal.current = sig;
    const ret = await fun();
    exports.GSignal.current = undefined;
    return ret;
};
exports.withAsyncSignal = withAsyncSignal;
//# sourceMappingURL=scope.js.map