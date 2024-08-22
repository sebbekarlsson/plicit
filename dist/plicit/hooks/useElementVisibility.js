"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useElementVisibility = void 0;
const reactivity_1 = require("../reactivity");
const types_1 = require("../types");
const useElementVisibility = (elRef) => {
    const visible = (0, reactivity_1.signal)(false);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                visible.set(true);
            }
            else {
                visible.set(false);
            }
        });
    });
    let lastElement = null;
    (0, reactivity_1.watchSignal)(elRef, (node) => {
        if (!node)
            return;
        if (!node.el)
            return;
        if ((0, types_1.isText)(node.el) || (0, types_1.isComment)(node.el))
            return;
        if (lastElement === node.el)
            return;
        if (lastElement) {
            observer.disconnect();
        }
        observer.observe(node.el);
        lastElement = node.el;
    });
    return visible;
};
exports.useElementVisibility = useElementVisibility;
//# sourceMappingURL=useElementVisibility.js.map