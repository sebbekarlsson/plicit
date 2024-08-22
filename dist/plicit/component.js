"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapComponentTree = exports.isComponent = exports.isAsyncComponent = void 0;
const pending_signal_1 = require("./components/pending-signal");
const is_1 = require("./is");
const lnode_1 = require("./lnode");
const nodeEvents_1 = require("./nodeEvents");
const reactivity_1 = require("./reactivity");
const asyncSignal_1 = require("./reactivity/signal/asyncSignal");
const scope_1 = require("./scope");
const isAsyncComponent = (x) => !!x && (0, is_1.isAsyncFunction)(x);
exports.isAsyncComponent = isAsyncComponent;
const isComponent = (x) => !!x && typeof x === "function" && !(0, exports.isAsyncComponent)(x);
exports.isComponent = isComponent;
const unwrapComponentTree = (component, propagatedAttribs = {}) => {
    const unwrap = (component, attribs = {}, depth = 0) => {
        if ((0, exports.isAsyncComponent)(component)) {
            return unwrap((0, asyncSignal_1.asyncSignal)(async () => await component(attribs), { isComputed: true, fallback: unwrap((0, reactivity_1.pget)(attribs.asyncFallback || pending_signal_1.PendingSignal)) }), attribs, 0);
        }
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
                    ret.component = component;
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
        if ((0, asyncSignal_1.isAsyncSignal)(component))
            return (0, lnode_1.lnodeX)(lnode_1.ELNodeType.ASYNC_SIGNAL, { ...attribs, asyncSignal: component });
        if (typeof component === 'string' || typeof component === 'number') {
            return (0, lnode_1.lnode)('span', { text: component + '', nodeType: lnode_1.ELNodeType.TEXT_ELEMENT });
        }
        return component;
    };
    return unwrap(component, propagatedAttribs);
};
exports.unwrapComponentTree = unwrapComponentTree;
//# sourceMappingURL=component.js.map