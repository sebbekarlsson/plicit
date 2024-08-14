"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unref = exports.isRef = exports.ref = exports.proxy = void 0;
const types_1 = require("./types");
const proxy = (initial, subscribers = []) => {
    return new Proxy(initial, {
        get: (target, p, _receiver) => {
            const key = p;
            subscribers.forEach((sub) => sub.get(target, key, _receiver));
            return target[key];
        },
        set: (target, p, next, receiver) => {
            const key = p;
            const prev = Reflect.get(target, key, receiver);
            if (prev === next)
                return true;
            target[p] = next;
            //const result = Reflect.set(target,p, next, receiver);
            subscribers.forEach((sub) => sub.set(target, key, next, receiver));
            return true;
        },
    });
};
exports.proxy = proxy;
const ref = (initial) => {
    const state = (0, exports.proxy)({
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
            const onGetters = state.subscribers.map(it => it.onGet).filter(types_1.notNullish);
            onGetters.forEach((sub) => sub(obj, key, {}));
        }
    };
    return (0, exports.proxy)(obj, [
        {
            get: (target, key, receiver) => {
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
//# sourceMappingURL=proxy.js.map