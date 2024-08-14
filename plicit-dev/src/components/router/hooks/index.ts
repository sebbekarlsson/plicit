import { computed, ref } from "plicit";
import {
  IRoute,
  IRouteConfig,
  IRouter,
  IRouterConfig,
  RouterNavigationAction,
} from "../types";

const cacheKey = '__router__path__';

const getCachedPath = () => {
  const path = sessionStorage.getItem(cacheKey);
  if (path) return path;
  sessionStorage.setItem(cacheKey, window.location.pathname);
  return window.location.pathname
}
console.log(123)
const router = ref<IRouter>({
  routes: [],
  current: {
    nav: ref<RouterNavigationAction>({
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
  router.value = {
    ...router.value,
    routes: props.routes.map((route) => ref<IRoute>(createRoute(route))),
  };
  return router;
};

export const useRouter = () => {
  const push = (navig: RouterNavigationAction | string) => {
    const nav = typeof navig === 'string' ? { path: navig, props: {} } : navig;
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

export const useRoute = () => {
  const route = computed(
    () => {
      const matched = router.value.routes.find(
        (it) => it.value.path === router.value.current.nav.value.path,
      );

      if (matched && matched.value) return matched.value;

      return {
        path: '/404',
        component: () => '404'
      }
    },
    [router, router.value.current.nav],
  );

  return route;
};
