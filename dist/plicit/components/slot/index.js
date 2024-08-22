"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slot = void 0;
const lnode_1 = require("../../lnode");
const Slot = (props) => {
    return ljsx("div", { nodeType: lnode_1.ELNodeType.SLOT, name: props.name }, props.children);
};
exports.Slot = Slot;
//# sourceMappingURL=index.js.map