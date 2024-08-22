import { Signal } from "../reactivity";
export type InterpolationRunArgs = {
    duration?: number;
    from?: number;
    to: number;
    callback?: (value: number) => any;
    eachFrame?: (time: number, deltaTime: number) => any;
};
export type UseInterpolationProps = {
    initial?: number;
    duration: number;
    infinite?: boolean;
    immediate?: boolean;
    eachFrame?: (time: number, deltaTime: number) => any;
};
export type UseInterpolation = {
    value: Signal<number>;
    run: (args: InterpolationRunArgs) => Promise<void>;
    stop: () => void;
};
export declare const useInterpolation: (props: UseInterpolationProps) => UseInterpolation;
