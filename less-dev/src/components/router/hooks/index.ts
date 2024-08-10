import { computed, ref } from "less";
import {
  IRoute,
  IRouteConfig,
  IRouter,
  IRouterConfig,
  RouterNavigationAction,
} from "../types";

const router = ref<IRouter>({
  routes: [],
  current: {
    nav: ref<RouterNavigationAction>({
      path: window.location.pathname,
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
  const push = (nav: RouterNavigationAction) => {
    router.value.history.push(nav);
    router.value.current.nav.value = nav;
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
