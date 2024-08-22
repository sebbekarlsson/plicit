"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMousePosition = void 0;
const tsmathutil_1 = require("tsmathutil");
const reactivity_1 = require("../reactivity");
const pos = (0, reactivity_1.signal)((0, tsmathutil_1.VEC2)(0, 0));
const onMouseMove = (event) => {
    const x = event.x;
    const y = event.y;
    pos.set(() => (0, tsmathutil_1.VEC2)(x, y));
};
let didAddEventListener = false;
const useMousePosition = () => {
    if (!didAddEventListener) {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("drag", onMouseMove);
        didAddEventListener = true;
    }
    const destroy = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("drag", onMouseMove);
    };
    return {
        pos,
        destroy,
    };
};
exports.useMousePosition = useMousePosition;
//# sourceMappingURL=useMousePosition.js.map