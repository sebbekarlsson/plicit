"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effectSignal = exports.computedSignal = exports.signal = exports.isSignal = void 0;
const event_1 = require("../event");
const is_1 = require("../is");
const proxy_1 = require("../proxy");
const utils_1 = require("../utils");
const constants_1 = require("./constants");
const event_2 = require("./event");
let stack = [];
const uidGen = (0, utils_1.stringGenerator)();
const isSignal = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return x.sym === "Signal";
};
exports.isSignal = isSignal;
let trackedIds = [];
const signal = (initial, options = {}) => {
    const init = (0, is_1.isFunction)(initial) ? initial : () => initial;
    const node = (0, proxy_1.proxy)({
        index: -1,
        dependants: [],
        children: [],
        tracked: [],
        _value: null,
        fun: init,
        state: constants_1.ESignalState.UNINITIALIZED,
        parent: undefined,
    });
    const emit = (event) => {
        sig.emitter.emit({ ...event, target: sig });
    };
    const trigger = () => {
        //    if (![ESignalState.DIRTY, ESignalState.UNINITIALIZED].includes(node.state)) return;
        emit({ type: event_2.ESignalEvent.TRIGGER, payload: {} });
        if (options.isEffect || options.isComputed) {
            trackedIds = [];
            emit({ type: event_2.ESignalEvent.BEFORE_UPDATE, payload: {} });
            const next = init();
            if (options.isComputed) {
                node._value = next;
            }
            emit({ type: event_2.ESignalEvent.AFTER_UPDATE, payload: {} });
            const trackedItems = stack.filter((it) => trackedIds.includes(it.uid));
            for (const tracked of trackedItems) {
                if (!node.tracked.includes(tracked)) {
                    node.tracked.push(tracked);
                    if (!tracked.node.dependants.includes(sig)) {
                        tracked.node.dependants.push(sig);
                    }
                }
            }
            trackedIds = [];
            return;
        }
        else {
            trackedIds = [];
            emit({ type: event_2.ESignalEvent.BEFORE_UPDATE, payload: {} });
            const next = init();
            if (options.isComputed) {
                node._value = next;
            }
            emit({ type: event_2.ESignalEvent.AFTER_UPDATE, payload: {} });
            const trackedItems = stack.filter((it) => trackedIds.includes(it.uid));
            for (const tracked of trackedItems) {
                if (!node.tracked.includes(tracked)) {
                    node.tracked.push(tracked);
                    if (!tracked.node.dependants.includes(sig)) {
                        tracked.node.dependants.push(sig);
                    }
                }
            }
        }
        node.dependants.forEach((dep) => {
            dep.trigger();
            dep.node.state = constants_1.ESignalState.DIRTY;
        });
        node.state = constants_1.ESignalState.CLEAN;
    };
    const track = () => {
        trackedIds.push(sig.uid);
        emit({ type: event_2.ESignalEvent.TRACK, payload: {} });
    };
    const sig = {
        emitter: new event_1.EventEmitter(),
        sym: "Signal",
        uid: uidGen.next(24),
        node,
        trigger,
        peek: () => node._value || init(),
        set: (fun) => {
            node._value = fun(node._value);
            node.state = constants_1.ESignalState.DIRTY;
            trigger();
        },
        get: () => {
            if (node.state === constants_1.ESignalState.UNINITIALIZED) {
                node._value = init();
                node.state = constants_1.ESignalState.INITIALIZED;
            }
            track();
            return node._value;
        },
    };
    if (options.isEffect || options.isComputed) {
        trigger();
    }
    stack.push(sig);
    return sig;
};
exports.signal = signal;
const computedSignal = (init, options = { isComputed: true }) => (0, exports.signal)(init, options);
exports.computedSignal = computedSignal;
const effectSignal = (init, options = { isEffect: true }) => (0, exports.signal)(init, options);
exports.effectSignal = effectSignal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BsaWNpdC9zaWduYWwvc2lnbmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9DQUFxRDtBQUNyRCw4QkFBbUM7QUFDbkMsb0NBQWlDO0FBQ2pDLG9DQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsbUNBQXVDO0FBRXZDLElBQUksS0FBSyxHQUFhLEVBQUUsQ0FBQztBQUN6QixNQUFNLE1BQU0sR0FBRyxJQUFBLHVCQUFlLEdBQUUsQ0FBQztBQWlDMUIsTUFBTSxRQUFRLEdBQUcsQ0FBVSxDQUFNLEVBQWtCLEVBQUU7SUFDMUQsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUNyQixJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUN4QyxPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUssUUFBUSxDQUFDO0FBQzVCLENBQUMsQ0FBQztBQUpXLFFBQUEsUUFBUSxZQUluQjtBQUVGLElBQUksVUFBVSxHQUFhLEVBQUUsQ0FBQztBQUl2QixNQUFNLE1BQU0sR0FBRyxDQUNwQixPQUFtQixFQUNuQixVQUF5QixFQUFFLEVBQ2hCLEVBQUU7SUFFYixNQUFNLElBQUksR0FBRyxJQUFBLGVBQVUsRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFFM0QsTUFBTSxJQUFJLEdBQWtCLElBQUEsYUFBSyxFQUFnQjtRQUMvQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ1QsVUFBVSxFQUFFLEVBQUU7UUFDZCxRQUFRLEVBQUUsRUFBRTtRQUNaLE9BQU8sRUFBRSxFQUFFO1FBQ1gsTUFBTSxFQUFFLElBQUk7UUFDWixHQUFHLEVBQUUsSUFBSTtRQUNULEtBQUssRUFBRSx3QkFBWSxDQUFDLGFBQWE7UUFDakMsTUFBTSxFQUFFLFNBQVM7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