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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGxpY2l0L3Byb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUE2RDtBQVN0RCxNQUFNLEtBQUssR0FBRyxDQUNuQixPQUFVLEVBQ1YsY0FBb0MsRUFBRSxFQUMzQixFQUFFO0lBQ2IsT0FBTyxJQUFJLEtBQUssQ0FBSSxPQUFPLEVBQUU7UUFDM0IsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRTtZQUM1QixNQUFNLEdBQUcsR0FBRyxDQUFZLENBQUM7WUFDekIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDOUQsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUNELEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ2pDLE1BQU0sR0FBRyxHQUFHLENBQVksQ0FBQztZQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEQsSUFBSSxJQUFJLEtBQUssSUFBSTtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUMvQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLHVEQUF1RDtZQUN2RCxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbkUsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQ0YsQ0FBQyxD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