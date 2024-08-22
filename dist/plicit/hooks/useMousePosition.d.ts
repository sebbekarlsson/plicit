import { Vector } from "tsmathutil";
export declare const useMousePosition: () => {
    pos: import("../reactivity").Signal<Vector>;
    destroy: () => void;
};
