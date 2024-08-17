import { Signal } from "plicit";
export type InterpolationSignalRunArgs = {
    duration?: number;
    from?: number;
    to: number;
};
export type UseInterpolationSignalProps = {
    initial?: number;
    duration: number;
};
export type UseInterpolationSignal = {
    value: Signal<number>;
    run: (args: InterpolationSignalRunArgs) => Promise<void>;
    stop: () => void;
};
export declare const useInterpolationSignal: (props: UseInterpolationSignalProps) => UseInterpolationSignal;
