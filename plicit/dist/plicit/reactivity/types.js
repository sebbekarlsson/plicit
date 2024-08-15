"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapReactiveDep = void 0;
const is_1 = require("../is");
const ref_1 = require("./ref");
const unwrapReactiveDep = (dep) => {
    if ((0, ref_1.isRef)(dep))
        return dep;
    if ((0, is_1.isFunction)(dep)) {
        return (0, exports.unwrapReactiveDep)(dep());
    }
    ;
    return dep;
};
exports.unwrapReactiveDep = unwrapReactiveDep;
//# sourceMappingURL=types.js.map