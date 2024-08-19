import { computedSignal, lnode, signal } from "plicit";
import {
  IRoute,
  IRouteConfig,
  IRouter,
  IRouterConfig,
  RouterNavigationAction,
} from "../types";

const cacheKey = '__router__path__';

const CACHE_ENABLED: boolean = false as boolean;

const getCachedPath = () => {
  if (!CACHE_ENABLED) {
    return window.location.pathname
  }
  const path = sessionStorage.getItem(cacheKey);
  if (path) return path;
  sessionStorage.setItem(cacheKey, window.location.pathname);
  return window.location.pathname
}

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
    routes: props.routes.map((route) => signal<IRoute>(createRoute(route)))
  }))
  return router;
};

export const useRouter = () => {
  const push = (navig: RouterNavigationAction | string) => {
    const nav: RouterNavigationAction = typeof navig === 'string' ? { path: navig, props: {} } : navig;
    if (router.get().current.nav.get().path === nav.path) return;

    window.history.replaceState({}, window.document.title,nav.path);

    const nextNav = signal<RouterNavigationAction>(nav);
    router.set((old) => {
      return {...old, history: [...old.history, nav], current: { nav: nextNav }};
    })
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


export type RouterMatch = {route: IRoute | null, parent: IRoute | null };
const findMatchingRoute = (path: string): RouterMatch | null => {
  const routes = router.get().routes;
  if (!path.includes('/') || path === '/') return  { route: routes.find(
    (it) => it.get().path === router.get().current.nav.get().path,
  )?.get() || null, parent: null };
  const stack = path.split('/').filter(it => it.length > 0 && it !== '');


  const matchPaths = (a: string, b: string) => {
    return a.replace('/', '') === b.replace('/', '');
  }

  const traverse = (route: IRoute, stackIndex: number = 0): IRoute | null => {
    const path = stack[stackIndex];
    if (!path) return route;
    if (!matchPaths(path, route.path)) return null;

    for (const child of (route.children || [])) {
      const next = traverse(child, stackIndex+1);
      if (next && next.path === stack[stackIndex+1]) return next;
    }

    return route;
  }


  for (const route of routes) {
    const found = traverse(route.get(), 0);
    if (found) return {route: found, parent: route.get() };
  }

  return null;
}

export const useRoute = () => {
  const route = computedSignal<RouterMatch>(
    () => {

      
      const matched = findMatchingRoute(router.get().current.nav.get().path);
      //const matched = router.value.routes.find(
      //  (it) => it.value.path === router.value.current.nav.value.path,
      //);

      if (matched) return matched;
    //  if (matched && matched.value) return matched.value;

      return {
        parent: null,
        route: {
          path: '/404',
          component: () => lnode('div', { innerHTML: '404' })
        }
      }
    },
  );

  const current = computedSignal<IRoute>((): IRoute => {
      const matched = router.get().routes.find(
        (it) => it.get().path === router.get().current.nav.get().path,
      );

      if (matched && matched.peek()) return matched.get();

      return {
        path: '/404',
        component: () => lnode('div', { innerHTML: '404' })
      }
  })

  return { current, match: route };
};
