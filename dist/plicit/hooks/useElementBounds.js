"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useElementBounds = void 0;
const tsmathutil_1 = require("tsmathutil");
const types_1 = require("../types");
const reactivity_1 = require("../reactivity");
const utils_1 = require("../utils");
const scope_1 = require("../scope");
const useElementBounds = (elRef, options = {}) => {
    const calcAABB = (el) => {
        const box = el.getBoundingClientRect();
        const pos = (0, tsmathutil_1.VEC2)(box.x, box.y);
        const size = (0, tsmathutil_1.VEC2)(box.width, box.height);
        return {
            min: pos,
            max: pos.add(size),
        };
    };
    const getElement = () => {
        const node = elRef.get();
        if (!node)
            return null;
        const el = node.el;
        if (!el || !(0, types_1.isHTMLElement)(el))
            return null;
        return el;
    };
    const empty = { min: (0, tsmathutil_1.VEC2)(0, 0), max: (0, tsmathutil_1.VEC2)(1, 1) };
    const bounds = (0, reactivity_1.signal)(empty);
    const refresh = () => {
        requestAnimationFrame(() => {
            const el = getElement();
            if (!el)
                return;
            const nextBounds = calcAABB(el);
            bounds.set(nextBounds);
        });
    };
    const update = options.debounce
        ? (0, utils_1.debounce)(refresh, options.debounce)
        : refresh;
    let lastEl = null;
    const obs = new ResizeObserver(() => {
        refresh();
    });
    (0, reactivity_1.watchSignal)(elRef, (node) => {
        if (!node)
            return;
        const el = node.el;
        if (!el || !(0, types_1.isHTMLElement)(el))
            return;
        if (el !== lastEl) {
            obs.disconnect();
            obs.observe(el);
            if (lastEl) {
                lastEl.removeEventListener("mousedown", update);
                lastEl.removeEventListener("mouseenter", update);
            }
            el.addEventListener("mousedown", update);
            el.addEventListener("mouseenter", update);
            lastEl = el;
            update();
        }
    });
    window.addEventListener("resize", update);
    if (options.updateOnScroll !== false) {
        //window.addEventListener("wheel", update);
        window.addEventListener("scrollend", update, true);
    }
    let interval = null;
    if (options.interval) {
        (0, scope_1.onMounted)(() => {
            interval = options.interval
                ? setInterval(() => {
                    update();
                }, options.interval)
                : null;
        });
    }
    const destroy = () => {
        clearInterval(interval);
        interval = null;
        window.removeEventListener("resize", update);
        if (options.updateOnScroll !== false) {
            //window.removeEventListener("wheel", update);
            window.removeEventListener("scrollend", update, true);
        }
    };
    (0, scope_1.onUnmounted)(() => {
        destroy();
    });
    return { bounds, update, destroy };
};
exports.useElementBounds = useElementBounds;
//# sourceMappingURL=useElementBounds.js.map