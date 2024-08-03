import { isConsonant, isFloat, isVowel } from "./is";

export const range = (n: number): number[] =>
  n <= 0 || typeof n !== "number" || isNaN(n) || !isFinite(n)
    ? []
    : Array.from(Array(Math.floor(n)).keys());

export const unique = <T>(arr: T[]): T[] =>
  [...Array.from(new Set(arr))] as T[];

export const lerp = (vFrom: number, vTo: number, scale: number) => {
  return vFrom + (vTo - vFrom) * scale;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const fract = (x: number) => x - Math.floor(x);

export const smoothstep = (
  edge0: number,
  edge1: number,
  value: number,
): number => {
  const x = clamp((value - edge0) / (edge1 - edge0), 0.0, 1.0);
  return x * x * (3.0 - 2.0 * x);
};

export const toUint32 = (f: number | bigint): number => {
  return Number(f) >>> 0;
};

export const hashu32 = (i: number) => {
  const U = toUint32;
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

export type NumberGenerator = {
  next: () => number;
  nextFloat: (min?: number, max?: number) => number;
  nextInt: (min?: number, max?: number) => number;
  nextBool: () => boolean;
};

export const numberGenerator = (initSeed: number = 4193): NumberGenerator => {
  let seed: number = initSeed;
  const next = () => {
    const num = hashu32(toUint32(seed));
    seed = hashu32(num + seed);
    return num;
  };

  const nextFloat = (min: number = 0, max: number = 1) => {
    const scale = next() / 0xffffffff;
    return clamp(min + (scale * max - min), min, max);
  };

  const nextInt = (min: number = 0, max: number = 0xffffffff) => {
    return clamp(Math.round(nextFloat(min, max)), min, max);
  };

  const nextBool = (): boolean => {
    return nextFloat() > 0.5;
  };

  return {
    next,
    nextFloat,
    nextInt,
    nextBool,
  };
};

export type StringGenerator = {
  next: (length: number) => string;
  nextChar: () => string;
  nextVowel: () => string;
  nextConsonant: () => string;
  nextWord: (min: number, max: number) => string;
};

export const stringGenerator = (
  seed: number = 4193,
  numGen: NumberGenerator = numberGenerator(seed),
): StringGenerator => {
  const alpha = "abcdefghijklmnopqrstuvwxyz";
  const vowels = Array.from(alpha).filter(it => isVowel(it));
  const consonants = Array.from(alpha).filter(it => isConsonant(it));

  const nextChar = (): string => {
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
  }

  const nextConsonant = () => {
    const index = numGen.nextInt(0, consonants.length - 1) % consonants.length;
    return consonants[index];
  }

  const nextWord = (min: number, max: number):string => {
    const length = numGen.nextInt(min, max);
    return range(length).map((i) => i % 2 === 0 ? nextConsonant() : nextVowel()).join('');
  }
  
  const next = (length: number): string => {
    return range(length)
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
