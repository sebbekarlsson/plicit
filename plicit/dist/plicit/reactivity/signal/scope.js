"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSignal = exports.GSignal = void 0;
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
    fun();
    exports.GSignal.current = undefined;
};
exports.withSignal = withSignal;
//# sourceMappingURL=scope.js.map