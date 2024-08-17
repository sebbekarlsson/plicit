import { Component, MaybeRef } from "plicit";
type RangeSliderProps = {
    value: MaybeRef<number>;
    onChange?: (value: number) => any;
};
export declare const RangeSlider: Component<RangeSliderProps>;
export {};
