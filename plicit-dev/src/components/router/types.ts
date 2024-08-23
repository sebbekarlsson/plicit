import { AsyncFun, Component, Dict, Signal } from "plicit";
import { IconPrimitive } from "../icon/types";

export type RouterNavigationAction = {
  path: string;
  name?: string;
  props?: Dict;
};

export type IRoute = {
  name?: string;
  path: string;
  component: Component | AsyncFun<Component>;
  children?: IRoute[];
  icon?: IconPrimitive;
};

export type IRouteConfig = Omit<IRoute, "children"> & {
  children?: IRouteConfig[];
};

export type IRouter = {
  current: {
    nav: Signal<RouterNavigationAction>;
  };
  routes: Signal<IRoute>[];
  history: RouterNavigationAction[];
};

export type IRouterConfig = Omit<Partial<IRouter>, "routes"> & {
  routes: IRouteConfig[];
};
