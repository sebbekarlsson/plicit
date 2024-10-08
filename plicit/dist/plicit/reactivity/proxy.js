"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxy = void 0;
const proxy = (initial, subscribers = []) => {
    return new Proxy(initial, {
        get: (target, p, _receiver) => {
            const key = p;
            try {
                subscribers.forEach((sub) => sub.get(target, key, _receiver));
            }
            catch (e) {
                console.error(e);
            }
            return target[key];
        },
        set: (target, p, next, receiver) => {
            const key = p;
            const prev = Reflect.get(target, key, receiver);
            if (prev === next)
                return true;
            target[p] = next;
            //const result = Reflect.set(target,p, next, receiver);
            try {
                subscribers.forEach((sub) => sub.set(target, key, next, receiver));
            }
            catch (e) {
                console.error(e);
            }
            return true;
        },
    });
};
exports.proxy = proxy;
//# sourceMappingURL=proxy.js.map