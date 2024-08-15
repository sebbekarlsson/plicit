"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapComponentTree = exports.isComponent = void 0;
const reactivity_1 = require("./reactivity");
const isComponent = (x) => !!x && typeof x === 'function';
exports.isComponent = isComponent;
const unwrapComponentTree = (component, attribs) => {
    if ((0, reactivity_1.isSignal)(component))
        return component;
    if ((0, reactivity_1.isRef)(component))
        return component; //unwrapComponentTree(component.value);
    if ((0, exports.isComponent)(component)) {
        const next = component(attribs);
        return (0, exports.unwrapComponentTree)(next, attribs);
    }
    return component;
};
exports.unwrapComponentTree = unwrapComponentTree;
//# sourceMappingURL=component.js.map