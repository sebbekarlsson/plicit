type LoopFun = (time: number, delta: number) => any;
export type UseAnimationLoop = {
    start: () => void;
    pause: () => void;
    kill: () => void;
};
export declare const useAnimationLoop: (fun: LoopFun) => UseAnimationLoop;
export {};
