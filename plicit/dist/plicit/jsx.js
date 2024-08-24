"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ljsx = ljsx;
const is_1 = require("./is");
const reactivity_1 = require("./reactivity");
const rendering_1 = require("./rendering");
const types_1 = require("./rendering/component/types");
const remapChild = (child) => {
    if (typeof child === "string" || typeof child === "number")
        return (0, rendering_1.vnode)("span", {
            text: child + "",
            _type: rendering_1.EVNodeType.TEXT
        });
    //if (child === null) return lnode('span', { nodeType: ELNodeType.COMMENT });
    return child;
};
const remapItem = (node) => {
    if ((0, types_1.isVComponent)(node)) {
        return (0, rendering_1.vnode)('div', { _component: node, _type: rendering_1.EVNodeType.FUNCTION });
    }
    if ((0, rendering_1.isVNode)(node))
        return node;
    if ((0, reactivity_1.isSignal)(node) || (0, reactivity_1.isAsyncSignal)(node)) {
        if ((0, reactivity_1.isSignal)(node)) {
            const v = node.peek();
            if ((0, is_1.isPrimitive)(v)) {
                return (0, rendering_1.vnode)('div', { text: node, _type: rendering_1.EVNodeType.TEXT });
            }
        }
        return (0, rendering_1.vnode)('div', { _signal: node });
    }
    if ((0, reactivity_1.isSignal)(node) || (0, reactivity_1.isAsyncSignal)(node)) {
        return (0, rendering_1.vnode)('div', { _signal: node });
    }
    if (typeof node === 'string') {
        return (0, rendering_1.vnode)(node, {});
    }
    return (0, rendering_1.vnode)('div', { text: 'INVALID' });
};
function ljsx(tag, attribs_, ...childs) {
    const attribs = attribs_ || {};
    let children = childs
        .map((child) => remapChild(child))
        .flat()
        .filter((it) => (0, rendering_1.isVNode)(it) || (0, reactivity_1.isSignal)(it) || (0, reactivity_1.isAsyncSignal)(it)).map((it => remapItem(it)));
    //  if (typeof tag === "string") {
    //    return lnode(tag, { ...attribs, __depth: depth + 1, children: children });
    //  }
    //
    //  const next = unwrapComponentTree(tag, {
    //    ...attribs,
    //    __depth: depth + 1,
    //    children: children,
    //  });
    if ((0, rendering_1.isVNode)(tag))
        return tag;
    if ((0, reactivity_1.isSignal)(tag) || (0, reactivity_1.isAsyncSignal)(tag)) {
        if ((0, reactivity_1.isSignal)(tag)) {
            const v = tag.peek();
            if ((0, is_1.isPrimitive)(v)) {
                return (0, rendering_1.vnode)('div', { ...attribs, text: tag, _type: rendering_1.EVNodeType.TEXT, children });
            }
        }
        return (0, rendering_1.vnode)('div', { ...attribs, _signal: tag, children });
    }
    if (typeof tag === 'string') {
        return (0, rendering_1.vnode)(tag, { ...attribs, children });
    }
    if ((0, types_1.isVComponent)(tag)) {
        return (0, rendering_1.vnode)('div', { _component: () => tag({ ...attribs, children }), _type: rendering_1.EVNodeType.FUNCTION });
    }
    return (0, rendering_1.vnode)('div', { text: 'INVALID' });
}
globalThis.React = ljsx;
globalThis.ljsx = ljsx;
//# sourceMappingURL=jsx.js.map