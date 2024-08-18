import { LNodeRef } from "plicit";
import { AABB } from "tsmathutil";
export type UseElementBoundsOptions = {
    debounce?: number;
    interval?: number;
};
export declare const useElementBounds: (elRef: LNodeRef, options?: UseElementBoundsOptions) => {
    bounds: import("plicit").Signal<AABB>;
    update: () => void;
    destroy: () => void;
};
