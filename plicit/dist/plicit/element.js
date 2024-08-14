"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchElements = exports.getElementsDiff = exports.getElementsAttributesDiff = exports.getElementAttributes = void 0;
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
            old.setAttribute(key, value);
            old[key] = value;
        });
        return old;
    }
};
exports.patchElements = patchElements;
//# sourceMappingURL=element.js.map