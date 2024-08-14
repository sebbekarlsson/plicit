export type ISideMenuItem = {
  label: string;
  path?: string;
  action?: () => any;
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
}
