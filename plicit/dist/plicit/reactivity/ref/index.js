"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unref = exports.isRef = exports.ref = void 0;
const proxy_1 = require("../proxy");
const types_1 = require("../../types");
const signal_1 = require("../signal");
const ref = (initial, options = {}) => {
    const state = (0, proxy_1.proxy)({
        subscribers: [],
    });
    const obj = {
        value: initial,
        _ref: "ref",
        _state: state,
        _deps: [],
        subscribe: (sub) => {
            if (!state.subscribers.includes(sub)) {
                state.subscribers.push(sub);
            }
            return () => {
                state.subscribers = state.subscribers.filter((it) => it !== sub);
            };
        },
        trigger: (key) => {
            const onGetters = state.subscribers
                .map((it) => it.onGet)
                .filter(types_1.notNullish);
            onGetters.forEach((sub) => sub(obj, key, {}));
        },
    };
    let fx = null;
    return (0, proxy_1.proxy)(obj, [
        {
            get: (target, key, receiver) => {
                const report = () => {
                    const next = target[key];
                    state.subscribers.forEach((sub) => {
                        const last = sub.lastValue;
                        if (last !== next && sub.onGet) {
                            sub.onGet(target, key, receiver);
                            sub.lastValue = last;
                        }
                    });
                };
                if (signal_1.GSignal.current && !signal_1.GSignal.current.trackedEffects.includes(report)) {
                    signal_1.GSignal.current.trackedEffects.push(report);
                    fx = signal_1.GSignal.current;
                }
                signal_1.GSignal.currentEffect = report;
                report();
                signal_1.GSignal.currentEffect = undefined;
            },
            set: (target, key, next, receiver) => {
                if (fx) {
                    fx.trigger();
                }
                state.subscribers.forEach((sub) => {
                    if (sub.onSet) {
                        sub.onSet(target, key, next, receiver);
                    }
                });
            },
        },
    ]);
};
exports.ref = ref;
const isRef = (x) => x !== null && !!x && typeof x === "object" && x._ref === "ref";
exports.isRef = isRef;
const unref = (x) => {
    if ((0, exports.isRef)(x))
        return x.value;
    return x;
};
exports.unref = unref;
//# sourceMappingURL=index.js.map