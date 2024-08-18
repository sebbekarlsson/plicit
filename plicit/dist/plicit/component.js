"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapComponentTree = exports.isComponent = void 0;
const lnode_1 = require("./lnode");
const reactivity_1 = require("./reactivity");
const isComponent = (x) => !!x && typeof x === "function";
exports.isComponent = isComponent;
const unwrapComponentTree = (component, propagatedAttribs = {}) => {
    const unwrap = (component, attribs = {}, depth = 0) => {
        if ((0, reactivity_1.isSignal)(component)) {
            return component;
        }
        if ((0, reactivity_1.isRef)(component))
            return component; //unwrapComponentTree(component.value);
        if ((0, exports.isComponent)(component)) {
            const next = component(attribs);
            if ((0, lnode_1.isLNode)(next)) {
                next.component.value = component;
            }
            return unwrap(next, attribs, depth + 1);
        }
        return component;
    };
    const next = unwrap(component, propagatedAttribs);
    return next;
};
exports.unwrapComponentTree = unwrapComponentTree;
//# sourceMappingURL=component.js.map