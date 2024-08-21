"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingSignal = void 0;
const hooks_1 = require("../../hooks");
const jsx_1 = require("../../jsx");
const reactivity_1 = require("../../reactivity");
const scope_1 = require("../../scope");
const PendingSignal = () => {
    const interp = (0, hooks_1.useInterpolation)({
        duration: 1.0,
        infinite: true,
        initial: 0,
        immediate: true
    });
    (0, scope_1.onUnmounted)(() => {
        interp.stop();
    });
    const style = (0, reactivity_1.computedSignal)(() => {
        const rot = (interp.value.get() % (Math.PI * 2)) * 360;
        return {
            transform: `rotate(${rot}deg)`,
            transformOrigin: 'center'
        };
    });
    return ((0, jsx_1.ljsx)("svg", { width: "24", height: "24", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" },
        (0, jsx_1.ljsx)("path", { d: "M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z", opacity: ".25" }),
        (0, jsx_1.ljsx)("path", { d: "M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z", style: style, class: "spinner_ajPY" })));
};
exports.PendingSignal = PendingSignal;
//# sourceMappingURL=index.js.map