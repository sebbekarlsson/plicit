"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrimitive = exports.isPromise = exports.isAsyncFunction = exports.isFunction = exports.isConsonant = exports.isVowel = exports.isFloat = void 0;
const isFloat = (x) => typeof x === "number" && x.toString().includes(".");
exports.isFloat = isFloat;
const isVowel = (char) => {
    char = char.toLowerCase();
    const vowels = ["a", "e", "i", "o", "u"];
    return vowels.includes(char);
};
exports.isVowel = isVowel;
const isConsonant = (char) => {
    return !(0, exports.isVowel)(char);
};
exports.isConsonant = isConsonant;
const isFunction = (x) => typeof x === "function";
exports.isFunction = isFunction;
const isAsyncFunction = (x) => {
    if (!x)
        return false;
    if (typeof x !== "function")
        return false;
    if (typeof x.constructor !== "function")
        return false;
    return x.constructor.name == "AsyncFunction";
};
exports.isAsyncFunction = isAsyncFunction;
const isPromise = (x) => {
    if (typeof x === 'undefined' || x === null)
        return false;
    return typeof x.then === 'function';
};
exports.isPromise = isPromise;
const isPrimitive = (x) => {
    if (x === null)
        return true;
    return ['string', 'boolean', 'number', 'undefined'].includes(typeof x);
};
exports.isPrimitive = isPrimitive;
//# sourceMappingURL=is.js.map