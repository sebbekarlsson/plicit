"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effect = void 0;
const _1 = require(".");
const effect = (fun, deps = []) => {
    deps.forEach((dep) => {
        (0, _1.deepSubscribe)(dep, {
            onSet: () => {
                fun();
            }
        });
    });
};
exports.effect = effect;
//# sourceMappingURL=effect.js.map