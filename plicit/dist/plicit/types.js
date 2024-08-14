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
//# sourceMappingURL=types.js.map