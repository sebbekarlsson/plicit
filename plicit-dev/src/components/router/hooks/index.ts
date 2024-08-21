import { computedSignal, lnode, signal } from "plicit";
import {
  IRoute,
  IRouteConfig,
  IRouter,
  IRouterConfig,
  RouterNavigationAction,
} from "../types";

const cacheKey = "__router__path__";

const CACHE_ENABLED: boolean = false as boolean;

const getCachedPath = () => {
  if (!CACHE_ENABLED) {
    return window.location.pathname;
  }
  const path = sessionStorage.getItem(cacheKey);
  if (path) return path;
  sessionStorage.setItem(cacheKey, window.location.pathname);
  return window.location.pathname;
};

const router = signal<IRouter>({
  routes: [],
  current: {
    nav: signal<RouterNavigationAction>({
      path: getCachedPath(),
      props: {},
    }),
  },
  history: [],
});

const createRoute = (props: IRouteConfig): IRoute => {
  return {
    ...props,
    path: props.path,
    children: (props.children || []).map((child) => createRoute(child)),
  };
};

export const createRouter = (props: IRouterConfig) => {
  router.set((old) => ({
    ...old,
    routes: props.routes.map((route) => signal<IRoute>(createRoute(route))),
  }));
  return router;
};

export const useRouter = () => {
  const push = (navig: RouterNavigationAction | string) => {
    const nav: RouterNavigationAction =
      typeof navig === "string" ? { path: navig, props: {} } : navig;
    if (router.get().current.nav.get().path === nav.path) return;

    try {
      window.history.replaceState({}, window.document.title, nav.path);
    } catch (e) {
      console.warn(e);
    }

    const nextNav = signal<RouterNavigationAction>(nav);
    router.set((old) => {
      return {
        ...old,
        history: [...old.history, nav],
        current: { nav: nextNav },
      };
    });
    sessionStorage.setItem(cacheKey, nav.path);
  };

  const back = () => {
    if (router.get().history.length <= 0) return;
    const last = router.get().history[router.get().history.length - 1];
    router.get().current.nav.set(last);

    router.set((old) => ({ ...old, history: old.history.slice(0, -1) }));
  };

  return { router, push, back };
};

type RouteMap = Record<
  string,
  { route: IRoute; parent: IRoute | null; next: RouteMap }
>;

export type RouterMatch = { route: IRoute | null; parent: IRoute | null };
const findMatchingRoute = (path: string): RouterMatch | null => {
  const routes = router.get().routes;
  const stack = path.split("/").map((it) => (it === "" ? "/" : it));
  const buildPath = (route: IRoute, parent: IRoute | null = null): RouteMap => {
    return {
      [route.path]: {
        route: route,
        parent: parent,
        next: Object.assign(
          {},
          ...(route.children || []).map((child) => buildPath(child, route)),
        ),
      },
    };
  };

  const buildPaths = (): RouteMap => {
    return Object.assign({}, ...routes.map((it) => buildPath(it.get())));
  };

  const routemap = buildPaths();

  const traverse = (routemap: RouteMap, stack: string[]) => {
    const key = stack[0];
    stack = stack.slice(1);
    const item = routemap[key] || routemap[key + "/"] || routemap["/" + key];
    if (!item) return null;
    if (stack.length > 0 && item.next && stack[0] in item.next) {
      return traverse(item.next, stack);
    }
    if (stack.length > 0) return null;
    return { route: item.route, parent: item.parent };
  };

  return traverse(routemap, stack) || traverse(routemap, stack.slice(1));
};

export const useRoute = () => {
  const route = computedSignal<RouterMatch>(() => {
    const matched = findMatchingRoute(router.get().current.nav.get().path);
    if (matched) return matched;

    return {
      parent: null,
      route: {
        path: "/404",
        component: () => lnode("div", { innerHTML: "404" }),
      },
    };
  });

  const current = computedSignal<IRoute>((): IRoute => {
    const matched = router
      .get()
      .routes.find(
        (it) => it.get().path === router.get().current.nav.get().path,
      );

    if (matched && matched.peek()) return matched.get();

    return {
      path: "/404",
      component: () => lnode("div", { innerHTML: "404" }),
    };
  });

  return { current, match: route };
};
