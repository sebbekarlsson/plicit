import { IconPrimitive } from "../icon/types";
import { UseSideMenu } from "./hooks/useSideMenu";

export type ISideMenuItem = {
  label: string;
  path?: string;
  action?: () => any;
  icon?: IconPrimitive;
  items?: ISideMenuItem[];
};

export type ISideMenu = {
  items: ISideMenuItem[];
};

export type ISideMenuConfig = ISideMenu;

export type ISideMenuProps = {
  menu: ISideMenuConfig;
  hook: UseSideMenu;
};
