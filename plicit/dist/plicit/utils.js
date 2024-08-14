"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringGenerator = exports.numberGenerator = exports.hashu32 = exports.toUint32 = exports.smoothstep = exports.fract = exports.clamp = exports.lerp = exports.unique = exports.range = void 0;
const is_1 = require("./is");
const range = (n) => n <= 0 || typeof n !== "number" || isNaN(n) || !isFinite(n)
    ? []
    : Array.from(Array(Math.floor(n)).keys());
exports.range = range;
const unique = (arr) => [...Array.from(new Set(arr))];
exports.unique = unique;
const lerp = (vFrom, vTo, scale) => {
    return vFrom + (vTo - vFrom) * scale;
};
exports.lerp = lerp;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
exports.clamp = clamp;
const fract = (x) => x - Math.floor(x);
exports.fract = fract;
const smoothstep = (edge0, edge1, value) => {
    const x = (0, exports.clamp)((value - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * (3.0 - 2.0 * x);
};
exports.smoothstep = smoothstep;
const toUint32 = (f) => {
    return Number(f) >>> 0;
};
exports.toUint32 = toUint32;
const hashu32 = (i) => {
    const U = exports.toUint32;
    i = U(i);
    const s = U(i >> 3) * 12;
    const k = U(~i + ~s);
    i ^= U(i << 17);
    i ^= U(i >> 13);
    i ^= U(i << 5);
    i += U((i ^ k) + i * k);
    i *= U(1013);
    i ^= U(i >> 4);
    return U(i * k + i + i * k + k);
};
exports.hashu32 = hashu32;
const numberGenerator = (initSeed = 4193) => {
    let seed = initSeed;
    const next = () => {
        const num = (0, exports.hashu32)((0, exports.toUint32)(seed));
        seed = (0, exports.hashu32)(num + seed);
        return num;
    };
    const nextFloat = (min = 0, max = 1) => {
        const scale = next() / 0xffffffff;
        return (0, exports.clamp)(min + (scale * max - min), min, max);
    };
    const nextInt = (min = 0, max = 0xffffffff) => {
        return (0, exports.clamp)(Math.round(nextFloat(min, max)), min, max);
    };
    const nextBool = () => {
        return nextFloat() > 0.5;
    };
    return {
        next,
        nextFloat,
        nextInt,
        nextBool,
    };
};
exports.numberGenerator = numberGenerator;
const stringGenerator = (seed = 4193, numGen = (0, exports.numberGenerator)(seed)) => {
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    const vowels = Array.from(alpha).filter(it => (0, is_1.isVowel)(it));
    const consonants = Array.from(alpha).filter(it => (0, is_1.isConsonant)(it));
    const nextChar = () => {
        const digit = numGen.nextBool();
        if (digit) {
            return (numGen.nextInt(0, 9) % 9) + "";
        }
        const upper = numGen.nextBool();
        const index = numGen.nextInt(0, alpha.length - 1) % alpha.length;
        const c = alpha[index];
        return upper ? c.toUpperCase() : c;
    };
    const nextVowel = () => {
        const index = numGen.nextInt(0, vowels.length - 1) % vowels.length;
        return vowels[index];
    };
    const nextConsonant = () => {
        const index = numGen.nextInt(0, consonants.length - 1) % consonants.length;
        return consonants[index];
    };
    const nextWord = (min, max) => {
        const length = numGen.nextInt(min, max);
        return (0, exports.range)(length).map((i) => i % 2 === 0 ? nextConsonant() : nextVowel()).join('');
    };
    const next = (length) => {
        return (0, exports.range)(length)
            .map(() => nextChar())
            .join("");
    };
    return {
        next,
        nextChar,
        nextVowel,
        nextConsonant,
        nextWord
    };
};
exports.stringGenerator = stringGenerator;
//# sourceMappingURL=utils.js.map