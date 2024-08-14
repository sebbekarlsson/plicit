"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const lnode_1 = require("./lnode");
const setup = (component, el) => {
    const main = (0, lnode_1.lnode)('div', {
        nodeType: lnode_1.ELNodeType.FRAGMENT,
        children: [
            component
        ]
    });
    main.mountTo(el);
};
exports.setup = setup;
//# sourceMappingURL=setup.js.map