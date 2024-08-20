"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useElementSize = void 0;
const lnode_1 = require("../lnode");
const reactivity_1 = require("../reactivity");
const scope_1 = require("../scope");
const useResizeObserver_1 = require("./useResizeObserver");
const useElementSize = (target) => {
    const isSVG = (0, reactivity_1.computedSignal)(() => (0, lnode_1.unwrapElement)(target)?.namespaceURI?.includes('svg'));
    const width = (0, reactivity_1.signal)(0);
    const height = (0, reactivity_1.signal)(0);
    const { stop: stopObserver } = (0, useResizeObserver_1.useResizeObserver)(target, ([entry]) => {
        const boxSize = entry.contentBoxSize;
        if (window && isSVG.get()) {
            const el = (0, lnode_1.unwrapElement)(target);
            if (el) {
                const rect = el.getBoundingClientRect();
                width.set(rect.width);
                height.set(rect.height);
            }
        }
        else {
            if (boxSize) {
                const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize];
                width.set(formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0));
                height.set(formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0));
            }
            else {
                width.set(entry.contentRect.width);
                height.set(entry.contentRect.height);
            }
        }
    });
    const stopWatch = (0, reactivity_1.watchSignal)(target, (node) => {
        const el = (0, lnode_1.unwrapElement)(node);
        if (!el)
            return;
        const rect = el.getBoundingClientRect();
        width.set(rect.width);
        height.set(rect.height);
    });
    const stop = () => {
        stopWatch();
        stopObserver();
    };
    (0, scope_1.onUnmounted)(() => {
        stop();
    });
    return { width, height, stop };
};
exports.useElementSize = useElementSize;
//# sourceMappingURL=useElementSize.js.map