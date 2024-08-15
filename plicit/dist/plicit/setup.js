"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.GSetupState = void 0;
const lnode_1 = require("./lnode");
exports.GSetupState = {};
const setup = (component, el) => {
    const fun = () => {
        el.innerHTML = '';
        const main = (0, lnode_1.lnode)('div', {
            nodeType: lnode_1.ELNodeType.FRAGMENT,
            children: [
                component
            ]
        });
        main.mountTo(el);
    };
    fun();
    exports.GSetupState.setup = fun;
};
exports.setup = setup;
//# sourceMappingURL=setup.js.map