"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComment = exports.isSVGPathElement = exports.isSVGElement = exports.isInputElement = exports.isHTMLElement = exports.isText = exports.isReplaceableElement = exports.isElementWithAttributes = exports.isElementWithChildren = exports.notNullish = void 0;
const notNullish = (val) => val != null;
exports.notNullish = notNullish;
const isElementWithChildren = (x) => {
    if (!x)
        return false;
    if (typeof x !== 'object')
        return false;
    return typeof x.children === 'object';
};
exports.isElementWithChildren = isElementWithChildren;
const isElementWithAttributes = (x) => {
    if (!x)
        return false;
    if (typeof x !== 'object')
        return false;
    return typeof x.setAttribute === 'function' && typeof x.attributes === 'object' && typeof x.getAttribute === 'function';
};
exports.isElementWithAttributes = isElementWithAttributes;
const isReplaceableElement = (x) => {
    if (!x)
        return false;
    if (typeof x !== 'object')
        return false;
    return typeof x.replaceWith === 'function';
};
exports.isReplaceableElement = isReplaceableElement;
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
const isComment = (x) => {
    if (!x)
        return false;
    if (typeof x !== 'object')
        return false;
    return typeof x.appendData === 'function';
};
exports.isComment = isComment;
//# sourceMappingURL=types.js.map