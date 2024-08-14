"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effect = void 0;
const subscribe_1 = require("./subscribe");
const effect = (fun, deps = []) => {
    deps.forEach((dep) => {
        (0, subscribe_1.deepSubscribe)(dep, {
            onSet: () => {
                fun();
            }
        });
    });
};
exports.effect = effect;
//# sourceMappingURL=effect.js.map