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
            const result = Reflect.set(target, p, next, receiver);
            subscribers.forEach((sub) => sub.set(target, key, next, receiver));
            return result;
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
            state.subscribers.push(sub);
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
    //if (isSignal<T>(x)) return x.get();
    return x;
};
exports.unref = unref;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGxpY2l0L3Byb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUE2RDtBQVN0RCxNQUFNLEtBQUssR0FBRyxDQUNuQixPQUFVLEVBQ1YsY0FBb0MsRUFBRSxFQUMzQixFQUFFO0lBQ2IsT0FBTyxJQUFJLEtBQUssQ0FBSSxPQUFPLEVBQUU7UUFDM0IsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRTtZQUM1QixNQUFNLEdBQUcsR0FBRyxDQUFZLENBQUM7WUFDekIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDOUQsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUNELEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ2pDLE1BQU0sR0FBRyxHQUFHLENBQVksQ0FBQztZQUN6QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEQsSUFBSSxJQUFJLEtBQUssSUFBSTtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUMvQixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3JELFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNuRSxPQUFP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