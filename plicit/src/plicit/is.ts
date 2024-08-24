export const isFloat = (x: any): x is number =>
  typeof x === "number" && x.toString().includes(".");

export const isVowel = (char: string): boolean => {
  char = char.toLowerCase();
  const vowels = ["a", "e", "i", "o", "u"];
  return vowels.includes(char);
};

export const isConsonant = (char: string): boolean => {
  return !isVowel(char);
};

export const isFunction = (x: any): x is Function => typeof x === "function";

export type AsyncFun<T = any> = () => Promise<T>;
export const isAsyncFunction = <T = any>(x: any): x is AsyncFun<T> => {
  if (!x) return false;
  if (typeof x !== "function") return false;
  if (typeof x.constructor !== "function") return false;
  return x.constructor.name == "AsyncFunction";
};

export const isPromise = <T = any>(x: any): x is Promise<T> => {
  if (typeof x === 'undefined' || x === null) return false;
  return typeof x.then === 'function';
}

export const isPrimitive = (x: any): x is (number | string | boolean | undefined | null) => {
  if (x === null) return true;
  return ['string', 'boolean', 'number', 'undefined'].includes(typeof x);
}
