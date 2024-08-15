"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchSignal = exports.effectSignal = exports.computedSignal = exports.signal = exports.isSignal = exports.disposeAllSignals = exports.flushSignals = exports.notifyTrack = exports.publishTrackable = exports.GSignal = void 0;
const event_1 = require("../../event");
const is_1 = require("../../is");
const proxy_1 = require("../proxy");
const utils_1 = require("../../utils");
const constants_1 = require("./constants");
const event_2 = require("./event");
const FLUSHING_ENABLED = true;
const STACK_CAPACITY = 512;
// @ts-ignore
const oldG = window.GSignal;
exports.GSignal = oldG || {
    stack: [],
    lookup: new Map(),
    tracked: [],
    trackedExternal: [],
    uidGen: (0, utils_1.stringGenerator)(),
    current: undefined,
    idCounter: 0,
    lastFlush: -1,
};
// @ts-ignore
window.GSignal = exports.GSignal;
const nextId = () => {
    const n = exports.GSignal.idCounter;
    exports.GSignal.idCounter = exports.GSignal.idCounter + 1;
    return `${n}`;
};
const maybeResetStack = () => {
    if (exports.GSignal.stack.length >= STACK_CAPACITY) {
        exports.GSignal.stack = [];
    }
};
const pushToStack = (item) => {
    if (exports.GSignal.lookup.has(item.uid) || exports.GSignal.stack.includes(item))
        return;
    maybeResetStack();
    exports.GSignal.stack.push(item);
    exports.GSignal.lookup.set(item.uid, item);
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
    const uid = item.uid || nextId();
    const now = performance.now();
    const next = { ...item, uid, createdAt: now, refCounter: 0 };
    if (!current)
        return next;
    if (!current.tracked.includes(next) && !next.dependants.includes(current)) {
        current.tracked.push(next);
        current.lastGet = performance.now();
        next.dependants.push(current);
    }
    pushToStack(next);
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
        dep.tracked = dep.tracked.filter((it) => it !== track);
        dep.dependants = dep.dependants.filter((it) => it !== track);
        //dep.tracked.forEach((it) => {
        //  if (it.isTrash) {
        //    destroyTrackable(it);
        //  }
        //});
        //dep.dependants.forEach((it) => {
        //  if (it.isTrash) {
        //    destroyTrackable(it);
        //  }
        //})
    });
    track.dependants = [];
    if (track.onDispose) {
        track.onDispose();
    }
};
const flushSignals = () => {
    if (!FLUSHING_ENABLED)
        return;
    const all = Array.from(exports.GSignal.lookup.values());
    if (all.length <= 0)
        return;
    const now = performance.now();
    const timeSinceLast = now - exports.GSignal.lastFlush;
    if (timeSinceLast < 1000 && exports.GSignal.lastFlush >= 0)
        return;
    exports.GSignal.lastFlush = now;
    const signalIsTrash = (trackable) => {
        //const diffCreated = now - trackable.createdAt;
        //const diffSet = now - trackable.lastSet;
        //const diffGet = now - trackable.lastGet;
        if (trackable.lastGet > 0 && trackable.lastSet > 0) {
            const d = Math.abs(trackable.lastGet - trackable.lastSet);
            if (d > 8)
                return true;
        }
        if (trackable.dependants.length === 0 &&
            trackable.tracked.length === 0 &&
            trackable.watchers.length === 0)
            return true;
        if (trackable.isTrash == true)
            return true;
        if (trackable.refCounter > 0)
            return false;
        //if (diffCreated > 1000 && trackable.lastGet < 0) return true;
        //if (trackable.isTrash) return true;
        //if (trackable.lastSet < 0 || trackable.lastGet < 0) return false;
        //return diffSet > 60 && diffGet > 60;
    };
    const trash = all.filter((it) => signalIsTrash(it) === true);
    for (const tr of trash) {
        destroyTrackable(tr);
    }
    exports.GSignal.stack = exports.GSignal.stack.filter((it) => signalIsTrash(it) === false);
    maybeResetStack();
};
exports.flushSignals = flushSignals;
const disposeAllSignals = () => {
    exports.GSignal.stack.forEach((it) => (it.isTrash = true));
    (0, exports.flushSignals)();
};
exports.disposeAllSignals = disposeAllSignals;
const isSignal = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return x.sym === "Signal";
};
exports.isSignal = isSignal;
const signal = (initial, options = {}) => {
    const uid = options.uid || nextId();
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
    const triggerFun = () => {
        sig.refCounter += 1;
        emit({ type: event_2.ESignalEvent.TRIGGER, payload: {} });
        exports.GSignal.tracked = [];
        if (options.isComputed) {
            withUpdateEvents(() => {
                node._value = init();
            });
        }
        else {
            withUpdateEvents(() => init());
        }
        registerTracked();
        exports.GSignal.tracked = [];
        exports.GSignal.trackedExternal = [];
        exports.GSignal.current = undefined;
        sig.watchers.forEach((watcher) => watcher());
        if (options.isEffect) {
            return;
        }
        sig.dependants.forEach((dep) => {
            dep.trigger();
        });
        // node.state = ESignalState.CLEAN;
    };
    let unsubs = [];
    let watching = [];
    const track = () => {
        sig.refCounter -= 1;
        const current = exports.GSignal.current;
        if (current && current !== sig && current.uid !== uid) {
            if (!current.tracked.includes(sig)) {
                current.tracked.push(sig);
            }
            if ((0, exports.isSignal)(current) && !watching.includes(current.uid)) {
                watching.push(current.uid);
                for (const tracked of current.tracked) {
                    if ((0, exports.isSignal)(tracked)) {
                        unsubs.push((0, exports.watchSignal)(tracked, () => {
                            current.trigger();
                        }));
                    }
                }
            }
        }
        exports.GSignal.tracked.push(sig.uid);
        emit({ type: event_2.ESignalEvent.TRACK, payload: {} });
    };
    let trigger = triggerFun;
    if (typeof options.debounce === "number") {
        trigger = (0, utils_1.debounce)(trigger, options.debounce);
    }
    if (typeof options.throttle === "number") {
        const [fn] = (0, utils_1.throttle)(trigger, options.throttle);
        trigger = fn;
    }
    const now = performance.now();
    const sig = {
        refCounter: 0,
        createdAt: now,
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
                //        trigger();
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
                    sig.isTrash = true;
                    (0, exports.flushSignals)();
                    unsubs.forEach((unsub) => unsub());
                    unsubs = [];
                    watching = [];
                    sig.emitter.clear();
                });
            } //
        },
        lastSet: -1,
        lastGet: -1,
    };
    if (options.isEffect || options.isComputed) {
        trigger();
    }
    if (!options.isEffect) {
        pushToStack(sig);
        exports.GSignal.current = sig;
    }
    return sig;
};
exports.signal = signal;
const computedSignal = (init, options = { isComputed: true }) => (0, exports.signal)(init, { ...options, isComputed: true });
exports.computedSignal = computedSignal;
const effectSignal = (init, options = { isEffect: true }) => (0, exports.signal)(init, { ...options, isEffect: true });
exports.effectSignal = effectSignal;
const watchSignal = (sig, fun, options = {}) => {
    if (!sig.watchers.includes(fun)) {
        sig.watchers.push(fun);
    }
    if (options.immediate) {
        fun();
    }
    const unsubscribeFuns = [];
    if (options.deep) {
        for (const tracked of sig.tracked) {
            if ((0, exports.isSignal)(tracked)) {
                unsubscribeFuns.push((0, exports.watchSignal)(tracked, fun, options));
            }
        }
    }
    return () => {
        sig.watchers = sig.watchers.filter((it) => it !== fun);
        unsubscribeFuns.forEach((unsub) => unsub());
    };
};
exports.watchSignal = watchSignal;
//setInterval(() => {
//  console.log(GSignal);
//}, 1000);
//# sourceMappingURL=signal.js.map