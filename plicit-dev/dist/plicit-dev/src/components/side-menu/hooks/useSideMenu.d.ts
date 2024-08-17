import { CSSProperties, Signal } from "plicit";
import { UseInterpolationSignal } from "../../../hooks/useInterpolationSignal";
export type UseSideMenu = {
    isOpen: Signal<boolean>;
    setOpen: (open: boolean) => void;
    toggleOpen: () => void;
    animation: UseInterpolationSignal;
    style: Signal<CSSProperties>;
};
export declare const useSideMenu: () => UseSideMenu;
