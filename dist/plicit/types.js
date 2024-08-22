"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComment = exports.isAnySVGElement = exports.isSVGPolylineElement = exports.isSVGPathElement = exports.isSVGElement = exports.isSVGSVGElement = exports.SVG_NAMESPACE = exports.SVG_NAMES = exports.isInputElement = exports.isHTMLElement = exports.isText = exports.isReplaceableElement = exports.isElementWithAttributes = exports.isElementWithChildren = exports.notNullish = void 0;
const notNullish = (val) => val != null;
exports.notNullish = notNullish;
const isElementWithChildren = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return typeof x.children === "object";
};
exports.isElementWithChildren = isElementWithChildren;
const isElementWithAttributes = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return (typeof x.setAttribute === "function" &&
        typeof x.attributes === "object" &&
        typeof x.getAttribute === "function");
};
exports.isElementWithAttributes = isElementWithAttributes;
const isReplaceableElement = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return typeof x.replaceWith === "function";
};
exports.isReplaceableElement = isReplaceableElement;
const isText = (x) => {
    if (typeof x !== "object")
        return false;
    return typeof x.appendChild === "undefined"; // && typeof x.data === 'string';
};
exports.isText = isText;
const isHTMLElement = (x) => {
    if (typeof x !== "object")
        return false;
    if ((0, exports.isText)(x))
        return false;
    return typeof x.setAttribute === "function";
};
exports.isHTMLElement = isHTMLElement;
const isInputElement = (x) => {
    if (typeof x !== "object")
        return false;
    return (0, exports.isHTMLElement)(x) && (x.tagName || "").toLowerCase() === "input";
};
exports.isInputElement = isInputElement;
exports.SVG_NAMES = [
    "svg",
    "path",
    "polyline",
    "circle",
    "line",
    "g",
    "rect",
    "text",
    "defs",
    "linearGradient",
    "stop",
    "mask",
    "symbol",
    "use",
];
exports.SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const isSVGSVGElement = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return (0, exports.isHTMLElement)(x) && (x.tagName || "").toLowerCase() === "svg";
};
exports.isSVGSVGElement = isSVGSVGElement;
const isSVGElement = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return (0, exports.isHTMLElement)(x) && (x.tagName || "").toLowerCase() === "svg";
};
exports.isSVGElement = isSVGElement;
const isSVGPathElement = (x) => {
    if (typeof x !== "object")
        return false;
    return (0, exports.isHTMLElement)(x) && (x.tagName || "").toLowerCase() === "path";
};
exports.isSVGPathElement = isSVGPathElement;
const isSVGPolylineElement = (x) => {
    if (typeof x !== "object")
        return false;
    return (0, exports.isHTMLElement)(x) && (x.tagName || "").toLowerCase() === "polyline";
};
exports.isSVGPolylineElement = isSVGPolylineElement;
const isAnySVGElement = (x) => {
    if (typeof x !== "object")
        return false;
    return ((0, exports.isHTMLElement)(x) && exports.SVG_NAMES.map(it => it.toLowerCase()).includes((x.tagName || "").toLowerCase()));
};
exports.isAnySVGElement = isAnySVGElement;
const isComment = (x) => {
    if (!x)
        return false;
    if (typeof x !== "object")
        return false;
    return typeof x.appendData === "function";
};
exports.isComment = isComment;
//# sourceMappingURL=types.js.map