"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchElements = exports.getElementsDiff = exports.getElementsAttributesDiff = exports.getElementAttributes = exports.setElementAttribute = void 0;
const setElementAttribute = (el, key, value) => {
    try {
        el.setAttribute(key, value);
    }
    catch (e) {
        // @ts-ignore
    }
    try {
        el[key] = value;
    }
    catch (e) {
        // @ts-ignore
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
const patchElements = (old, nextEl, attributeCallback) => {
    if (old.innerHTML !== nextEl.innerHTML) {
        old.replaceWith(nextEl);
        return nextEl;
    }
    else {
        const diff = (0, exports.getElementsAttributesDiff)(old, nextEl);
        diff.forEach(([key, value]) => {
            if (attributeCallback) {
                attributeCallback([key, value]);
            }
            (0, exports.setElementAttribute)(old, key, value);
        });
        return old;
    }
};
exports.patchElements = patchElements;
//# sourceMappingURL=element.js.map