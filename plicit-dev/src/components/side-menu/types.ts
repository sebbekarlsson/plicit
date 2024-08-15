import { IconPrimitive } from "../icon/types";
import { UseSideMenu } from "./hooks/useSideMenu";

export type ISideMenuItem = {
  label: string;
  path?: string;
  action?: () => any;
  icon?: IconPrimitive;
}

export type ISideMenuSection = {
  label?: string;
  items: ISideMenuItem[];
}

export type ISideMenu = {
  sections: ISideMenuSection[];
}

export type ISideMenuConfig = ISideMenu;

export type ISideMenuProps = {
  menu: ISideMenuConfig;
  hook: UseSideMenu; 
}
