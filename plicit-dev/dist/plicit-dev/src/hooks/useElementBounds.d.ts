import { LNodeRef } from "plicit";
import { AABB } from "tsmathutil";
export declare const useElementBounds: (elRef: LNodeRef) => {
    bounds: import("plicit").Signal<AABB>;
    update: () => void;
    destroy: () => void;
};
