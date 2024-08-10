import { Component } from "less";
import { useRoute, useRouter } from "../../hooks";

export const RouterView: Component = (props) => {
  const route = useRoute();
  const router = useRouter();

  return (
    <div class="w-full h-full">
      {() => (
        <div deps={[route, router.router, router.router.value.current.nav]}>
          <route.value.component
            {...(router.router.value.current.nav.value.props || {})}
          />
        </div>
      )}
    </div>
  );
};
