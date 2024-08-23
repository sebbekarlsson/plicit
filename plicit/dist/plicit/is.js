"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAsyncFunction = exports.isFunction = exports.isConsonant = exports.isVowel = exports.isFloat = void 0;
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
//# sourceMappingURL=is.js.map