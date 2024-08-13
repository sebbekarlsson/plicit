import { ReactiveDep } from "./types";
type EffectFun<T = any> = () => T;
export declare const effect: <T = any>(fun: EffectFun<T>, deps?: ReactiveDep[]) => void;
export {};
