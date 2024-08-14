"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchSignal = exports.effectSignal = exports.computedSignal = exports.signal = exports.isSignal = exports.flushSignals = exports.notifyTrack = exports.publishTrackable = exports.GSignal = void 0;
const event_1 = require("../event");
const is_1 = require("../is");
const proxy_1 = require("../proxy");
const utils_1 = require("../utils");
const constants_1 = require("./constants");
const event_2 = require("./event");
exports.GSignal = {
    stack: [],
    lookup: new Map(),
    tracked: [],
    uidGen: (0, utils_1.stringGenerator)(),
};
const pushToStack = (item) => {
    exports.GSignal.lookup.set(item.uid, item);
    exports.GSignal.stack.push(item);
};
const getTrackables = () => {
    const trackables = [];
    for (const key of exports.GSignal.tracked) {
        const trackable = exports.GSignal.lookup.get(key);
        if (!trackable)
            continue;
        trackables.push(trackable);
    }
    return trackables;
};
const publishTrackable = (item) => {
    const next = { ...item, uid: exports.GSignal.uidGen.next(24) };
    pushToStack(next);
    return next;
};
exports.publishTrackable = publishTrackable;
const notifyTrack = (uid) => {
    if (exports.GSignal.tracked.includes(uid))
        return;
    exports.GSignal.tracked.push(uid);
};
exports.notifyTrack = notifyTrack;
const flushSignals = () => {
    const now = performance.now();
    const signalIsTrash = (trackable) => {
        if (trackable.lastSet < 0 || trackable.lastGet < 0)
            return;
        const diffSet = now - trackable.lastSet;
        const diffGet = now - trackable.lastGet;
        return (diffSet > 60 && diffGet > 60);
    };
    const trash = exports.GSignal.stack.filter(it => signalIsTrash(it) === true);
    for (const tr of trash) {
        exports.GSignal.lookup.delete(tr.uid);
    }
    exports.GSignal.stack = exports.GSignal.stack.filter(it => signalIsTrash(it) === false);
};
exports.flushSignals = flushSignals;
const isSignal = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return x.sym === "Signal";
};
exports.isSignal = isSignal;
const signal = (initial, options = {}) => {
    const init = (0, is_1.isFunction)(initial) ? initial : () => initial;
    const node = (0, proxy_1.proxy)({
        index: -1,
        _value: null,
        fun: init,
        state: constants_1.ESignalState.UNINITIALIZED,
    });
    const emit = (event) => {
        sig.emitter.emit({ ...event, target: sig });
    };
    const withUpdateEvents = (fn) => {
        emit({ type: event_2.ESignalEvent.BEFORE_UPDATE, payload: {} });
        fn();
        emit({ type: event_2.ESignalEvent.AFTER_UPDATE, payload: {} });
    };
    const registerTracked = () => {
        const trackedItems = getTrackables();
        for (const tracked of trackedItems) {
            if (!sig.tracked.includes(tracked)) {
                sig.tracked.push(tracked);
                if (!tracked.dependants.includes(sig)) {
                    tracked.dependants.push(sig);
                }
            }
        }
        exports.GSignal.tracked = [];
    };
    const triggerMutation = () => {
        exports.GSignal.tracked = [];
        withUpdateEvents(() => {
            node._value = init();
        });
        registerTracked();
    };
    const triggerEffect = () => {
        exports.GSignal.tracked = [];
        withUpdateEvents(() => init());
        registerTracked();
    };
    const trigger = () => {
        emit({ type: event_2.ESignalEvent.TRIGGER, payload: {} });
        if (options.isComputed) {
            triggerMutation();
        }
        else {
            triggerEffect();
        }
        sig.watchers.forEach((watcher) => watcher());
        if (options.isEffect || options.isComputed) {
            return;
        }
        sig.dependants.forEach((dep) => {
            dep.trigger();
        });
        node.state = constants_1.ESignalState.CLEAN;
    };
    const track = () => {
        exports.GSignal.tracked.push(sig.uid);
        emit({ type: event_2.ESignalEvent.TRACK, payload: {} });
    };
    const uid = exports.GSignal.uidGen.next(24);
    const sig = {
        emitter: new event_1.EventEmitter(),
        sym: "Signal",
        uid: uid,
        node,
        trigger,
        peek: () => node._value || init(),
        dependants: [],
        tracked: [],
        watchers: [],
        set: (fun) => {
            node._value = (0, is_1.isFunction)(fun) ? fun(node._value) : fun;
            node.state = constants_1.ESignalState.DIRTY;
            trigger();
            queueMicrotask(() => {
                sig.lastSet = performance.now();
            });
        },
        get: () => {
            if (node.state === constants_1.ESignalState.UNINITIALIZED || node._value === null) {
                node._value = init();
                node.state = constants_1.ESignalState.INITIALIZED;
            }
            track();
            queueMicrotask(() => {
                sig.lastGet = performance.now();
            });
            return node._value;
        },
        dispose: () => {
            queueMicrotask(() => {
                (0, exports.flushSignals)();
                exports.GSignal.stack = exports.GSignal.stack.filter((it) => it.uid !== uid);
            });
        },
        lastSet: -1,
        lastGet: -1
    };
    if (options.isEffect || options.isComputed) {
        trigger();
    }
    if (!options.isEffect) {
        pushToStack(sig);
    }
    return sig;
};
exports.signal = signal;
const computedSignal = (init, options = { isComputed: true }) => (0, exports.signal)(init, options);
exports.computedSignal = computedSignal;
const effectSignal = (init, options = { isEffect: true }) => (0, exports.signal)(init, options);
exports.effectSignal = effectSignal;
const watchSignal = (sig, fun) => {
    if (!sig.watchers.includes(fun)) {
        sig.watchers.push(fun);
    }
    return () => {
        sig.watchers = sig.watchers.filter((it) => it !== fun);
    };
};
exports.watchSignal = watchSignal;
//# sourceMappingURL=signal.js.map