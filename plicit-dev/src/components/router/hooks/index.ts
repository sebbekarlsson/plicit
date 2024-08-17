import { computed, lnode, ref } from "plicit";
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

const router = ref<IRouter>({
  routes: [],
  current: {
    nav: ref<RouterNavigationAction>({
      path: getCachedPath(),
      props: {},
    }, { deep: false }),
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
  router.value = {
    ...router.value,
    routes: props.routes.map((route) => ref<IRoute>(createRoute(route), { deep: false })),
  };
  return router;
};

export const useRouter = () => {
  const push = (navig: RouterNavigationAction | string) => {
    const nav = typeof navig === 'string' ? { path: navig, props: {} } : navig;
    if (router.value.current.nav.value.path === nav.path) return;

    window.history.replaceState({}, window.document.title,nav.path);
    
    router.value.history.push(nav);
    router.value.current.nav.value = nav;
    sessionStorage.setItem(cacheKey, nav.path);
  };

  const back = () => {
    if (router.value.history.length <= 0) return;
    const last = router.value.history[router.value.history.length - 1];
    router.value.current.nav.value = last;
    router.value.history = router.value.history.slice(0, -1);
  };

  return { router, push, back };
};


export type RouterMatch = {route: IRoute | null, parent: IRoute | null };
const findMatchingRoute = (path: string): RouterMatch | null => {
  const routes = router.value.routes;
  if (!path.includes('/') || path === '/') return  { route: routes.find(
    (it) => it.value.path === router.value.current.nav.value.path,
  )?.value || null, parent: null };
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
    const found = traverse(route.value, 0);
    if (found) return {route: found, parent: route.value };
  }

  return null;
}

export const useRoute = () => {
  const route = computed<RouterMatch>(
    () => {

      
      const matched = findMatchingRoute(router.value.current.nav.value.path);
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
    [router, router.value.current.nav],
  );

  const current = computed<IRoute>((): IRoute => {
      const matched = router.value.routes.find(
        (it) => it.value.path === router.value.current.nav.value.path,
      );

      if (matched && matched.value) return matched.value;

      return {
        path: '/404',
        component: () => lnode('div', { innerHTML: '404' })
      }
  }, [router, router.value.current.nav])

  return { current, match: route };
};
