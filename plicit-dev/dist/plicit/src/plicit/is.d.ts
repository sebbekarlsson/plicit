export declare const isFloat: (x: any) => x is number;
export declare const isVowel: (char: string) => boolean;
export declare const isConsonant: (char: string) => boolean;
export declare const isFunction: (x: any) => x is Function;
export type AsyncFun<T = any> = () => Promise<T>;
export declare const isAsyncFunction: <T = any>(x: any) => x is AsyncFun<T>;
