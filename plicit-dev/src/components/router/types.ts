import { AsyncFun, Component, Dict, Ref } from "plicit";

export type RouterNavigationAction = {
  path: string;
  name?: string;
  props?: Dict;
}

export type IRoute = {
  name?: string;
  path: string;
  component: Component | AsyncFun<Component>;
  children?: IRoute[];
}

export type IRouteConfig = Omit<IRoute, 'children'> & {
  children?: IRouteConfig[];
}; 

export type IRouter = {
  current: {
    nav: Ref<RouterNavigationAction>;
  };
  routes: Ref<IRoute>[];
  history: RouterNavigationAction[];
}

export type IRouterConfig = Omit<Partial<IRouter>, 'routes'> & {
  routes: IRouteConfig[];
}; 
