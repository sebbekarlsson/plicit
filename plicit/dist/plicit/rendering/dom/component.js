"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountComponent = void 0;
const _1 = require(".");
const types_1 = require("../component/types");
const mountComponent = (component, target, props = {}) => {
    const next = component(props);
    if ((0, types_1.isVComponent)(next))
        return (0, exports.mountComponent)(next, target, props);
    return (0, _1.mountVNode)(next, target);
};
exports.mountComponent = mountComponent;
//# sourceMappingURL=component.js.map