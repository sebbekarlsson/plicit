"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effectSignal = exports.computedSignal = exports.signal = exports.isSignal = void 0;
const event_1 = require("../event");
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
const signal = (init, options = {}) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BsaWNpdC9zaWduYWwvc2lnbmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9DQUFxRDtBQUNyRCxvQ0FBaUM7QUFDakMsb0NBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyxtQ0FBdUM7QUFFdkMsSUFBSSxLQUFLLEdBQWEsRUFBRSxDQUFDO0FBQ3pCLE1BQU0sTUFBTSxHQUFHLElBQUEsdUJBQWUsR0FBRSxDQUFDO0FBaUMxQixNQUFNLFFBQVEsR0FBRyxDQUFVLENBQU0sRUFBa0IsRUFBRTtJQUMxRCxJQUFJLENBQUMsQ0FBQztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ3JCLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ3hDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxRQUFRLENBQUM7QUFDNUIsQ0FBQyxDQUFDO0FBSlcsUUFBQSxRQUFRLFlBSW5CO0FBRUYsSUFBSSxVQUFVLEdBQWEsRUFBRSxDQUFDO0FBSXZCLE1BQU0sTUFBTSxHQUFHLENBQ3BCLElBQVksRUFDWixVQUF5QixFQUFFLEVBQ2hCLEVBQUU7SUFFYixNQUFNLElBQUksR0FBa0IsSUFBQSxhQUFLLEVBQWdCO1FBQy9DLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDVCxVQUFVLEVBQUUsRUFBRTtRQUNkLFFBQVEsRUFBRSxFQUFFO1FBQ1osT0FBTyxFQUFFLEVBQUU7UUFDWCxNQUFNLEVBQUUsSUFBSTtRQUNaLEdBQUcsRUFBRSxJQUFJO1FBQ1QsS0FBSyxFQUFFLHdCQUFZLENBQUMsYUFBYTtRQUNqQyxNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFDLENBQUM7SUFFSCxNQUFNLElBQUksR0FBRyxDQUFDLEtBQTRFLEVBQUUsRUFBRTtRQUM1RixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUcsS0FBSyxFQUFFLE1BQU0sRUFB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