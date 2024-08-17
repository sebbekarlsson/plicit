import { Ref } from "plicit";
export type InterpolationRunArgs = {
    duration?: number;
    from?: number;
    to: number;
};
export type UseInterpolationProps = {
    initial?: number;
    duration: number;
};
export type UseInterpolation = {
    value: Ref<number>;
    run: (args: InterpolationRunArgs) => Promise<void>;
    stop: () => void;
};
export declare const useInterpolation: (props: UseInterpolationProps) => UseInterpolation;
