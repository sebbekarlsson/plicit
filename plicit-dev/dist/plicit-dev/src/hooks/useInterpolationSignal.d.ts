import { Signal } from "plicit";
export type InterpolationSignalRunArgs = {
    duration?: number;
    from?: number;
    to: number;
    callback?: (value: number) => any;
    eachFrame?: (time: number, deltaTime: number) => any;
};
export type UseInterpolationSignalProps = {
    initial?: number;
    duration: number;
    infinite?: boolean;
    immediate?: boolean;
    eachFrame?: (time: number, deltaTime: number) => any;
};
export type UseInterpolationSignal = {
    value: Signal<number>;
    run: (args: InterpolationSignalRunArgs) => Promise<void>;
    stop: () => void;
};
export declare const useInterpolationSignal: (props: UseInterpolationSignalProps) => UseInterpolationSignal;
