import { CSSProperties, LNodeRef, Signal } from "plicit";
import { IContextMenu, IContextMenuConfig } from "../types";
export type UseContextMenuProps = {
    menu: IContextMenuConfig;
    triggerRef: LNodeRef;
};
export type UseContextMenu = {
    setOpen: (open: boolean) => void;
    toggleOpen: () => void;
    menu: Signal<IContextMenu>;
    style: Signal<CSSProperties>;
    menuRef: LNodeRef;
};
export declare const useContextMenu: (props: UseContextMenuProps) => UseContextMenu;
