"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSVGPointCheck = void 0;
const reactivity_1 = require("../reactivity");
const types_1 = require("../types");
const findSVGParent = (el) => {
    if ((0, types_1.isSVGSVGElement)(el))
        return el;
    if (!el.parentElement)
        return null;
    return findSVGParent(el.parentElement);
};
const getPositionInSVG = (svg, pos) => {
    let point = svg.createSVGPoint();
    point.x = pos.x;
    point.y = pos.y;
    const ctm = svg.getScreenCTM();
    if (!ctm)
        return point;
    point = point.matrixTransform(ctm.inverse());
    return point;
};
const useSVGPointCheck = (elRef, pointToCheck, callback) => {
    const update = (value) => {
        if (callback) {
            callback(value);
        }
        return value;
    };
    return (0, reactivity_1.computedSignal)(() => {
        const node = elRef.get();
        const p = pointToCheck.get();
        if (!node)
            return update(false);
        const el = node.el;
        if (!el)
            return update(false);
        if ((0, types_1.isText)(el) || (0, types_1.isComment)(el))
            return update(false);
        const svg = findSVGParent(el);
        if (!svg)
            return update(false);
        const point = getPositionInSVG(svg, p);
        if (typeof el.isPointInFill !== "function")
            return update(false);
        return update(el.isPointInFill(point));
    });
};
exports.useSVGPointCheck = useSVGPointCheck;
//# sourceMappingURL=useSVGPointCheck.js.map