import { LNodeRef } from "../lnode";
export declare const useElementSize: (target: LNodeRef) => {
    width: import("../reactivity").Signal<number>;
    height: import("../reactivity").Signal<number>;
    stop: () => void;
};
