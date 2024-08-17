import { Vector } from "tsmathutil";
export declare const useMousePositionSignal: () => {
    pos: import("plicit").Signal<Vector>;
    destroy: () => void;
};
