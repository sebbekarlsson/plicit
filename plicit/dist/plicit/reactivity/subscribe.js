"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepSubscribe = void 0;
const _1 = require(".");
const types_1 = require("./types");
const deepSubscribe = (dep, sub, maxDepth = -1) => {
    const unsubs = [];
    const subscribe = (dep, sub, depth = 0) => {
        const d = (0, types_1.unwrapReactiveDep)(dep);
        if ((0, _1.isRef)(d)) {
            unsubs.push(d.subscribe({
                onSet: (...args) => {
                    if (sub.onSet) {
                        sub.onSet(...args);
                    }
                },
                onGet: (...args) => {
                    if (sub.onGet) {
                        sub.onGet(...args);
                    }
                },
            }));
            if (depth < maxDepth) {
                d._deps.forEach((child) => subscribe(child, sub, depth + 1));
            }
        }
        else if ((0, _1.isSignal)(d)) {
            unsubs.push((0, _1.watchSignal)(d, () => {
                if (sub.onTrigger) {
                    sub.onTrigger();
                }
            }));
        }
    };
    subscribe(dep, sub, 0);
    return unsubs;
};
exports.deepSubscribe = deepSubscribe;
//# sourceMappingURL=subscribe.js.map