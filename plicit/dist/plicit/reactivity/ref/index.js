"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchRef = exports.unref = exports.isRef = exports.ref = void 0;
const proxy_1 = require("../proxy");
const types_1 = require("../../types");
const subscribe_1 = require("../subscribe");
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
    let tracked = null;
    return (0, proxy_1.proxy)(obj, [
        {
            get: (target, key, receiver) => {
                if (options.deep !== false) {
                    // integration with signals
                    tracked = (0, signal_1.publishTrackable)({
                        trigger: () => { },
                        onDispose: () => { },
                        dispose: () => { },
                        dependants: [],
                        tracked: [],
                        watchers: [],
                        lastGet: -1,
                        lastSet: -1,
                    });
                }
                const next = target[key];
                state.subscribers.forEach((sub) => {
                    const last = sub.lastValue;
                    if (last !== next && sub.onGet) {
                        sub.onGet(target, key, receiver);
                        sub.lastValue = last;
                    }
                });
            },
            set: (target, key, next, receiver) => {
                state.subscribers.forEach((sub) => {
                    if (sub.onSet) {
                        sub.onSet(target, key, next, receiver);
                    }
                });
                // integration with signals
                if (options.deep !== false && tracked) {
                    tracked.dependants.forEach((it) => it.trigger());
                    tracked.isTrash = true;
                }
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
const watchRef = (fun, deps = []) => {
    deps.forEach((dep) => {
        (0, subscribe_1.deepSubscribe)(dep, {
            onSet: () => {
                fun();
            },
        });
    });
};
exports.watchRef = watchRef;
//# sourceMappingURL=index.js.map