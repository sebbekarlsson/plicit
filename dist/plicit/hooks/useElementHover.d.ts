import { LNodeRef } from "../lnode";
export type UseElementHoverOptions = {
    svg?: boolean;
};
export declare const useElementHover: (elRef: LNodeRef, options?: UseElementHoverOptions) => import("../reactivity").Signal<boolean>;
