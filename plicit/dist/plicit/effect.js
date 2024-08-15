"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effect = void 0;
const reactivity_1 = require("./reactivity");
const effect = (fun, deps = []) => {
    deps.forEach((dep) => {
        (0, reactivity_1.deepSubscribe)(dep, {
            onSet: () => {
                fun();
            }
        });
    });
};
exports.effect = effect;
//# sourceMappingURL=effect.js.map