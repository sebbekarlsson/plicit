"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVComponent = void 0;
const is_1 = require("../../is");
const isVComponent = (x) => {
    if (x === null || typeof x === 'undefined')
        return false;
    return typeof x === 'function' && !(0, is_1.isAsyncFunction)(x);
};
exports.isVComponent = isVComponent;
//# sourceMappingURL=types.js.map