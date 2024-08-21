"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedAsyncSignal = exports.computedSignal = void 0;
const scope_1 = require("./scope");
const signal_1 = require("./signal");
const computedSignal = (init, options = { isComputed: true }) => (0, signal_1.signal)(init, { ...options, isComputed: true });
exports.computedSignal = computedSignal;
const computedAsyncSignal = (init, options = { isComputed: true }) => {
    const sig = (0, signal_1.signal)(undefined);
    const status = (0, signal_1.signal)("idle");
    const update = async () => {
        status.set("pending");
        try {
            const resp = await init();
            sig.set(resp);
            status.set("resolved");
        }
        catch (e) {
            console.error(e);
            status.set("error");
        }
    };
    const refresh = async () => {
        if (scope_1.GSignal.current && !scope_1.GSignal.current.trackedEffects.includes(update)) {
            scope_1.GSignal.current.trackedEffects.push(update);
        }
        scope_1.GSignal.currentEffect = update;
        update();
        scope_1.GSignal.currentEffect = undefined;
    };
    if (options.immediate !== false) {
        refresh().catch((e) => console.error(e));
    }
    return { data: sig, status, update: refresh };
};
exports.computedAsyncSignal = computedAsyncSignal;
//# sourceMappingURL=computed.js.map