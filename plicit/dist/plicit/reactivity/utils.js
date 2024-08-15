"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pget = void 0;
const ref_1 = require("./ref");
const signal_1 = require("./signal");
const pget = (x) => {
    if ((0, ref_1.isRef)(x))
        return x.value;
    if ((0, signal_1.isSignal)(x))
        return x.get();
    return x;
};
exports.pget = pget;
//# sourceMappingURL=utils.js.map