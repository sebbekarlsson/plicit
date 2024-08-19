import { Component, MaybeSignal } from "plicit";
type RangeSliderProps = {
    value: MaybeSignal<number>;
    onChange?: (value: number) => any;
};
export declare const RangeSlider: Component<RangeSliderProps>;
export {};
