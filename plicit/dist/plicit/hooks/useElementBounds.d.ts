import { AABB } from "tsmathutil";
import { LNodeRef } from "../lnode";
export type UseElementBoundsOptions = {
    debounce?: number;
    interval?: number;
    updateOnScroll?: boolean;
};
export declare const useElementBounds: (elRef: LNodeRef, options?: UseElementBoundsOptions) => {
    bounds: import("../reactivity").Signal<AABB>;
    update: () => void;
    destroy: () => void;
};
