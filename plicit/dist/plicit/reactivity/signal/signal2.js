"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEffect = exports.signal2 = void 0;
const event_1 = require("../../event");
const is_1 = require("../../is");
let currentEffect = null;
let counter = 0;
const nextId = () => {
    const id = `${counter}`;
    counter++;
    return id;
};
const signal2 = (init) => {
    const now = performance.now();
    const uid = nextId();
    const initialValue = (0, is_1.isFunction)(init) ? init() : init;
    const subscribers = [];
    const sig = {
        uid,
        _value: initialValue,
        trigger: () => { },
        sym: 'Signal',
        dispose: () => { },
        watchers: [],
        tracked: [],
        dependants: [],
        createdAt: now,
        lastGet: -1,
        lastSet: -1,
        refCounter: 0,
        emitter: new event_1.EventEmitter(),
        peek: () => {
            return sig._value;
        },
        get: () => {
            if (currentEffect) {
                subscribers.push(currentEffect);
            }
            return sig._value;
        },
        set: (fn) => {
            const old = sig._value;
            const nextValue = (0, is_1.isFunction)(fn) ? fn(old) : fn;
            sig._value = nextValue;
            subscribers.forEach((sub) => sub());
        }
    };
    return sig;
};
exports.signal2 = signal2;
const createEffect = (fun) => {
    currentEffect = fun;
    fun();
    currentEffect = null;
};
exports.createEffect = createEffect;
//# sourceMappingURL=signal2.js.map