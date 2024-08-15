"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchSignal = exports.effectSignal = exports.computedSignal = exports.signal = exports.isSignal = exports.flushSignals = exports.notifyTrack = exports.publishTrackable = exports.GSignal = void 0;
const event_1 = require("../../event");
const is_1 = require("../../is");
const proxy_1 = require("../proxy");
const utils_1 = require("../../utils");
const constants_1 = require("./constants");
const event_2 = require("./event");
const FLUSHING_ENABLED = true;
exports.GSignal = {
    stack: [],
    lookup: new Map(),
    tracked: [],
    trackedExternal: [],
    uidGen: (0, utils_1.stringGenerator)(),
    current: undefined,
    idCounter: 0,
    lastFlush: -1
};
const nextId = () => {
    const n = exports.GSignal.idCounter;
    exports.GSignal.idCounter = exports.GSignal.idCounter + 1;
    return `${n}`;
};
const pushToStack = (item) => {
    exports.GSignal.lookup.set(item.uid, item);
    exports.GSignal.stack.push(item);
};
const getTrackables = () => {
    const trackables = [];
    const keys = [...exports.GSignal.tracked, ...exports.GSignal.trackedExternal];
    for (const key of keys) {
        const trackable = exports.GSignal.lookup.get(key);
        if (!trackable)
            continue;
        trackables.push(trackable);
    }
    return trackables;
};
const publishTrackable = (item) => {
    const current = exports.GSignal.current;
    const next = { ...item, uid: nextId() };
    exports.GSignal.stack.push(next);
    if (!current)
        return next;
    if (!current.tracked.includes(next) && !next.dependants.includes(current)) {
        current.tracked.push(next);
        current.lastGet = performance.now();
        next.dependants.push(current);
    }
    return next;
};
exports.publishTrackable = publishTrackable;
const notifyTrack = (uid) => {
    if (exports.GSignal.trackedExternal.includes(uid))
        return;
    exports.GSignal.trackedExternal.push(uid);
};
exports.notifyTrack = notifyTrack;
const destroyTrackable = (track) => {
    exports.GSignal.lookup.delete(track.uid);
    track.tracked.forEach((it) => {
        if (it.dispose || it.onDispose) {
            destroyTrackable(it);
        }
    });
    track.tracked = [];
    track.dependants.forEach((dep) => {
        dep.tracked = dep.tracked.filter(it => it !== track);
        dep.dependants = dep.dependants.filter(it => it !== track);
    });
    track.dependants = [];
    if (track.onDispose) {
        track.onDispose();
    }
};
const flushSignals = () => {
    if (!FLUSHING_ENABLED)
        return;
    if (exports.GSignal.stack.length <= 0)
        return;
    const now = performance.now();
    const timeSinceLast = now - exports.GSignal.lastFlush;
    if (timeSinceLast < 60 && exports.GSignal.lastFlush >= 0)
        return;
    exports.GSignal.lastFlush = now;
    const signalIsTrash = (trackable) => {
        if (trackable.lastSet < 0 || trackable.lastGet < 0)
            return;
        const diffSet = now - trackable.lastSet;
        const diffGet = now - trackable.lastGet;
        return diffSet > 60 && diffGet > 60;
    };
    const trash = exports.GSignal.stack.filter((it) => signalIsTrash(it) === true);
    for (const tr of trash) {
        destroyTrackable(tr);
    }
    exports.GSignal.stack = exports.GSignal.stack.filter((it) => signalIsTrash(it) === false);
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
            if (!sig.tracked.includes(tracked) && !tracked.dependants.includes(sig)) {
                sig.tracked.push(tracked);
                tracked.dependants.push(sig);
            }
        }
    };
    const triggerMutation = () => {
        withUpdateEvents(() => {
            node._value = init();
        });
        registerTracked();
    };
    const triggerEffect = () => {
        withUpdateEvents(() => init());
        registerTracked();
    };
    const triggerFun = () => {
        emit({ type: event_2.ESignalEvent.TRIGGER, payload: {} });
        exports.GSignal.tracked = [];
        if (options.isComputed) {
            triggerMutation();
        }
        else {
            triggerEffect();
        }
        exports.GSignal.tracked = [];
        exports.GSignal.trackedExternal = [];
        exports.GSignal.current = undefined;
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
    let trigger = triggerFun;
    if (typeof options.debounce === 'number') {
        trigger = (0, utils_1.debounce)(trigger, options.debounce);
    }
    if (typeof options.throttle === 'number') {
        const [fn] = (0, utils_1.throttle)(trigger, options.throttle);
        trigger = fn;
    }
    const uid = nextId();
    const sig = {
        isComputed: options.isComputed,
        isEffect: options.isEffect,
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
            //const oldValue = node._value;
            const nextValue = (0, is_1.isFunction)(fun) ? fun(node._value) : fun;
            //if (nextValue === oldValue) {
            //  return;
            //}
            //
            node._value = nextValue;
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
            if (FLUSHING_ENABLED) {
                queueMicrotask(() => {
                    (0, exports.flushSignals)();
                    exports.GSignal.stack = exports.GSignal.stack.filter((it) => it.uid !== uid);
                });
            }
        },
        lastSet: -1,
        lastGet: -1,
    };
    if (options.isEffect || options.isComputed) {
        trigger();
    }
    if (!options.isEffect) {
        pushToStack(sig);
    }
    exports.GSignal.current = sig;
    return sig;
};
exports.signal = signal;
const computedSignal = (init, options = { isComputed: true }) => (0, exports.signal)(init, { ...options, isComputed: true });
exports.computedSignal = computedSignal;
const effectSignal = (init, options = { isEffect: true }) => (0, exports.signal)(init, { ...options, isEffect: true });
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