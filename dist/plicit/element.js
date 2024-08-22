"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setElementChild = exports.patchElements = exports.getElementsDiff = exports.getElementsAttributesDiff = exports.getElementAttributes = exports.setElementAttribute = void 0;
const types_1 = require("./types");
const setElementAttribute = (el, key, value) => {
    try {
        el.setAttribute(key, value);
    }
    catch (e) {
        console.warn(e);
        // @ts-ignore
    }
    if (!(0, types_1.isAnySVGElement)(el)) {
        try {
            el[key] = value;
        }
        catch (e) {
            console.warn(e);
        }
    }
};
exports.setElementAttribute = setElementAttribute;
const getElementAttributes = (a) => {
    return Array.from(a.attributes);
};
exports.getElementAttributes = getElementAttributes;
const getElementsAttributesDiff = (a, b) => {
    const attributesB = (0, exports.getElementAttributes)(b).map((attr) => [attr.name, attr.value]);
    return attributesB.filter(([key, value]) => a.getAttribute(key) !== value);
};
exports.getElementsAttributesDiff = getElementsAttributesDiff;
const getElementsDiff = (a, b) => {
    return (0, exports.getElementsAttributesDiff)(a, b);
};
exports.getElementsDiff = getElementsDiff;
const patchElements = (old, nextEl, options = {}) => {
    if (old.innerHTML !== nextEl.innerHTML) {
        if (options.onBeforeReplace) {
            options.onBeforeReplace(old, nextEl);
        }
        old.replaceWith(nextEl);
        if (options.onAfterReplace) {
            options.onAfterReplace(old, nextEl);
        }
        return nextEl;
    }
    else {
        const diff = (0, exports.getElementsAttributesDiff)(old, nextEl);
        diff.forEach(([key, value]) => {
            if (options.attributeCallback) {
                options.attributeCallback([key, value]);
            }
            (0, exports.setElementAttribute)(old, key, value);
        });
        return old;
    }
};
exports.patchElements = patchElements;
const setElementChild = (parent, child, index) => {
    if (index < 0)
        return;
    if (parent.contains(child))
        return;
    if (parent.childNodes.length <= 0) {
        parent.appendChild(child);
        return;
    }
    const childNodes = Array.from(parent.childNodes);
    if (index < childNodes.length - 1) {
        const after = childNodes[index + 1];
        parent.insertBefore(child, after);
        return;
    }
    const before = childNodes[index - 1];
    parent.insertBefore(child, before);
};
exports.setElementChild = setElementChild;
//# sourceMappingURL=element.js.map