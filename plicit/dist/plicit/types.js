"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSVGPathElement = exports.isSVGElement = exports.isInputElement = exports.isHTMLElement = exports.isText = exports.unwrapReactiveDep = exports.notNullish = void 0;
const is_1 = require("./is");
const proxy_1 = require("./proxy");
const notNullish = (val) => val != null;
exports.notNullish = notNullish;
const unwrapReactiveDep = (dep) => {
    if ((0, proxy_1.isRef)(dep))
        return dep;
    if ((0, is_1.isFunction)(dep)) {
        return (0, exports.unwrapReactiveDep)(dep());
    }
    ;
    return dep;
};
exports.unwrapReactiveDep = unwrapReactiveDep;
const isText = (x) => {
    if (typeof x !== 'object')
        return false;
    return typeof x.appendChild === 'undefined'; // && typeof x.data === 'string';
};
exports.isText = isText;
const isHTMLElement = (x) => {
    if (typeof x !== 'object')
        return false;
    if ((0, exports.isText)(x))
        return false;
    return typeof x.setAttribute === 'function';
};
exports.isHTMLElement = isHTMLElement;
const isInputElement = (x) => {
    if (typeof x !== 'object')
        return false;
    return (0, exports.isHTMLElement)(x) && x.tagName === 'INPUT';
};
exports.isInputElement = isInputElement;
const isSVGElement = (x) => {
    if (!x)
        return false;
    if (typeof x !== 'object')
        return false;
    return (0, exports.isHTMLElement)(x) && (x.tagName || '').toLowerCase() === 'svg';
};
exports.isSVGElement = isSVGElement;
const isSVGPathElement = (x) => {
    if (typeof x !== 'object')
        return false;
    return (0, exports.isHTMLElement)(x) && (x.tagName || '').toLowerCase() === 'path';
};
exports.isSVGPathElement = isSVGPathElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGxpY2l0L3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUFrQztBQUNsQyxtQ0FBK0M7QUFZeEMsTUFBTSxVQUFVLEdBQUcsQ0FBVSxHQUEwQixFQUFZLEVBQUUsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFBO0FBQTNFLFFBQUEsVUFBVSxjQUFpRTtBQUVqRixNQUFNLGlCQUFpQixHQUFHLENBQVUsR0FBbUIsRUFBZSxFQUFFO0lBQzdFLElBQUksSUFBQSxhQUFLLEVBQUksR0FBRyxDQUFDO1FBQUUsT0FBTyxHQUFHLENBQUM7SUFDOUIsSUFBSSxJQUFBLGVBQVUsRUFBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3BCLE9BQU8sSUFBQSx5QkFBaUIsRUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFBQSxDQUFDO0lBQ0YsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUE7QUFOWSxRQUFBLGlCQUFpQixxQkFNN0I7QUFHTSxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQU0sRUFBYSxFQUFFO0lBQzFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ3hDLE9BQU8sT0FBTyxDQUFDLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxDQUFBLGlDQUFpQztBQUMvRSxDQUFDLENBQUE7QUFIWSxRQUFBLE1BQU0sVUFHbEI7QUFFTSxNQUFNLGFBQWEsR0FBRyxDQUFDLENBQU0sRUFBb0IsRUFBRTtJQUN4RCxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUN4QyxJQUFJLElBQUEsY0FBTSxFQUFDLENBQUMsQ0FBQztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQzVCLE9BQU8sT0FBTyxDQUFDLENBQUMsWUFBWSxLQUFLLFVBQVUsQ0FBQztBQUM5QyxDQUFDLENBQUE7QUFKWSxRQUFBLGFBQWEsaUJBSXpCO0FBRU0sTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFNLEVBQXlCLEVBQUU7SUFDOUQsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDeEMsT0FBTyxJQUFBLHFCQUFhLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUM7QUFDbkQsQ0FBQyxDQUFBO0FBSFksUUFBQSxjQUFjLGtCQUcxQjtBQUVNLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBTSxFQUFzQixFQUFFO0lBQ3pELElBQUksQ0FBQyxDQUFDO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDckIsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDeEMsT0FBTyxJQUFBLHFCQUFhLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssQ0FBQztBQUN2RSxDQUFDLENBQUE7QUFKWSxRQUFBLFlBQVksZ0JBSXhCO0FBRU0sTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQU0sRUFBdUIsRUFBRTtJQUM5RCxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUN4QyxPQUFPLElBQUEscUJBQWEsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxDQUFDO0FBQ3hFLENBQUMsQ0FBQTtBQUhZLFFBQUEsZ0JBQWdCLG9CQUc1QiJ9