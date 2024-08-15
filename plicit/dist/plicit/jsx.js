"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ljsx = ljsx;
const component_1 = require("./component");
const lnode_1 = require("./lnode");
const reactivity_1 = require("./reactivity");
function ljsx(tag, attribs, ...childs) {
    const children = childs
        .map((child) => (typeof child === "string" || typeof child === 'number')
        ? (0, lnode_1.lnode)("span", { text: child + '', nodeType: lnode_1.ELNodeType.TEXT_ELEMENT })
        : child)
        .flat()
        .filter((it) => (0, lnode_1.isLNode)(it) || (0, component_1.isComponent)(it) || (0, reactivity_1.isRef)(it) || (0, reactivity_1.isSignal)(it));
    if ((0, component_1.isComponent)(tag)) {
        return tag({ ...attribs, children: children });
    }
    return (0, lnode_1.lnode)(tag, { ...attribs, children: children });
}
//# sourceMappingURL=jsx.js.map