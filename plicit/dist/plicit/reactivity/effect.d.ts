import { ReactiveDep } from ".";
type EffectFun<T = any> = () => T;
export declare const effect: <T = any>(fun: EffectFun<T>, deps?: ReactiveDep[]) => void;
export {};
