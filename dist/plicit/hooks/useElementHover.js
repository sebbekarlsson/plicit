"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useElementHover = void 0;
const tsmathutil_1 = require("tsmathutil");
const reactivity_1 = require("../reactivity");
const useMousePosition_1 = require("./useMousePosition");
const useSVGPointCheck_1 = require("./useSVGPointCheck");
const useElementHover = (elRef, options = {}) => {
    const hover = (0, reactivity_1.signal)(false);
    if (options.svg) {
        const mouse = (0, useMousePosition_1.useMousePosition)();
        const svgHover = (0, useSVGPointCheck_1.useSVGPointCheck)(elRef, mouse.pos);
        (0, reactivity_1.watchSignal)(svgHover, (val) => {
            hover.set(val);
        }, { immediate: true });
    }
    else {
        const onMouseEnter = () => {
            hover.set(true);
        };
        const onMouseLeave = () => {
            hover.set(false);
        };
        (0, reactivity_1.watchSignal)(elRef, (node) => {
            const el = node.el;
            if (!el)
                return;
            if (!(0, tsmathutil_1.isHTMLElement)(el))
                return;
            el.addEventListener("mouseenter", onMouseEnter);
            el.addEventListener("mouseleave", onMouseLeave);
        });
    }
    return hover;
};
exports.useElementHover = useElementHover;
//# sourceMappingURL=useElementHover.js.map