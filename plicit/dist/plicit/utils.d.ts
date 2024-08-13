export declare const range: (n: number) => number[];
export declare const unique: <T>(arr: T[]) => T[];
export declare const lerp: (vFrom: number, vTo: number, scale: number) => number;
export declare const clamp: (value: number, min: number, max: number) => number;
export declare const fract: (x: number) => number;
export declare const smoothstep: (edge0: number, edge1: number, value: number) => number;
export declare const toUint32: (f: number | bigint) => number;
export declare const hashu32: (i: number) => number;
export type NumberGenerator = {
    next: () => number;
    nextFloat: (min?: number, max?: number) => number;
    nextInt: (min?: number, max?: number) => number;
    nextBool: () => boolean;
};
export declare const numberGenerator: (initSeed?: number) => NumberGenerator;
export type StringGenerator = {
    next: (length: number) => string;
    nextChar: () => string;
    nextVowel: () => string;
    nextConsonant: () => string;
    nextWord: (min: number, max: number) => string;
};
export declare const stringGenerator: (seed?: number, numGen?: NumberGenerator) => StringGenerator;
