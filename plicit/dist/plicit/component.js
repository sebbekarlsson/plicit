"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapChild = exports.unwrapComponentTree = exports.isComponent = void 0;
const lnode_1 = require("./lnode");
const nodeEvents_1 = require("./nodeEvents");
const reactivity_1 = require("./reactivity");
const scope_1 = require("./scope");
const isComponent = (x) => !!x && typeof x === "function";
exports.isComponent = isComponent;
const unwrapComponentTree = (component, propagatedAttribs = {}) => {
    const unwrap = (component, attribs = {}, depth = 0) => {
        if ((0, exports.isComponent)(component)) {
            (0, scope_1.pushScope)();
            const next = component({ ...attribs, component });
            if ((0, lnode_1.isLNode)(next)) {
                next.component = component;
            }
            const ret = unwrap(next, { ...attribs, component }, depth + 1);
            (0, scope_1.withCurrentScope)((scope) => {
                if ((0, lnode_1.isLNode)(ret)) {
                    scope.onMounted.forEach(fun => ret.addEventListener(nodeEvents_1.ENodeEvent.MOUNTED, () => fun(ret)));
                    scope.onBeforeUnmount.forEach(fun => ret.addEventListener(nodeEvents_1.ENodeEvent.BEFORE_UNMOUNT, () => fun(ret)));
                    scope.onUnmounted.forEach(fun => ret.addEventListener(nodeEvents_1.ENodeEvent.UNMOUNTED, () => fun(ret)));
                }
            });
            (0, scope_1.popScope)();
            return ret;
        }
        if ((0, lnode_1.isLNode)(component)) {
            return component;
        }
        if ((0, reactivity_1.isSignal)(component))
            return (0, lnode_1.lnodeX)(lnode_1.ELNodeType.SIGNAL, { ...attribs, signal: component });
        if (typeof component === 'string' || typeof component === 'number') {
            return (0, lnode_1.lnode)('span', { text: component + '', nodeType: lnode_1.ELNodeType.TEXT_ELEMENT });
        }
        return component;
    };
    return unwrap(component, propagatedAttribs);
};
exports.unwrapComponentTree = unwrapComponentTree;
const unwrapChild = (child) => {
    if ((0, reactivity_1.isSignal)(child)) {
        return (0, exports.unwrapChild)(child.get());
    }
    if ((0, exports.isComponent)(child)) {
        return (0, exports.unwrapChild)(child({}));
    }
    if (typeof child === 'string' || typeof child === 'number') {
        return (0, lnode_1.lnode)('span', { text: child + '', nodeType: lnode_1.ELNodeType.TEXT_ELEMENT });
    }
    if ((0, lnode_1.isLNode)(child)) {
        if (child.attributes.signal)
            return (0, exports.unwrapChild)(child.attributes.signal);
        return child;
    }
    return child;
};
exports.unwrapChild = unwrapChild;
//# sourceMappingURL=component.js.map