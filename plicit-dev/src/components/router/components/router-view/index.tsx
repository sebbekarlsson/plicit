import { Component, ELNodeType } from "plicit";
import { useRoute, useRouter } from "../../hooks";

export const RouterView: Component = (props) => {
  const route = useRoute();
  const router = useRouter();

  return (
    <div class="w-full h-full" nodeType={ELNodeType.FRAGMENT}>
      {() => (
        <div class="w-full h-auto" style={{ display: 'contents' }} deps={[router.router.value.current.nav]}>
          <route.value.component
            {...(router.router.value.current.nav.value.props || {})}
          />
        </div>
      )}
    </div>
  );
};
