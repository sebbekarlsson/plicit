import { IconPrimitive } from "../icon/types";
import { Vector } from "tsmathutil";
import { UseContextMenu } from "./hooks/useContextMenu";
export type IContextMenuItem = {
    label: string;
    icon?: IconPrimitive;
    action?: () => void | Promise<void>;
};
export type IContextMenuSection = {
    label?: string;
    items: IContextMenuItem[];
};
export type IContextMenu = {
    pos: Vector;
    open: boolean;
    sections: IContextMenuSection[];
};
export type IContextMenuConfig = Omit<IContextMenu, "pos" | "open">;
export type IContextMenuProps = {
    hook: UseContextMenu;
};
