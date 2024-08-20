import { CSSProperties, Signal, UseInterpolation } from "plicit";
export type UseSideMenu = {
    isOpen: Signal<boolean>;
    setOpen: (open: boolean) => void;
    toggleOpen: () => void;
    animation: UseInterpolation;
    style: Signal<CSSProperties>;
};
export declare const useSideMenu: () => UseSideMenu;
