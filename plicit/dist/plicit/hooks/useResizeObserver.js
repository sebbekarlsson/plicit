"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResizeObserver = void 0;
const types_1 = require("../types");
const reactivity_1 = require("../reactivity");
const scope_1 = require("../scope");
const useResizeObserver = (target, callback) => {
    let lastEl = null;
    let obs = new ResizeObserver((entries, observer) => {
        if (callback) {
            callback(entries, observer);
        }
    });
    const stopWatch = (0, reactivity_1.watchSignal)(target, (node) => {
        if (!obs)
            return;
        if (!node)
            return;
        const el = node.el;
        if (!el || !(0, types_1.isHTMLElement)(el))
            return;
        if (el !== lastEl) {
            if (lastEl) {
                obs.unobserve(lastEl);
            }
            obs.observe(el);
        }
    });
    const cleanup = () => {
        if (obs) {
            obs.disconnect();
            obs = null;
        }
    };
    const stop = () => {
        cleanup();
        stopWatch();
    };
    (0, scope_1.onUnmounted)(() => {
        stop();
    });
    return { stop };
};
exports.useResizeObserver = useResizeObserver;
//# sourceMappingURL=useResizeObserver.js.map