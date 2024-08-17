import { Component, ELNodeType } from "plicit";
import { useRoute, useRouter } from "../../hooks";

export const RouterView: Component = (props) => {
  const route = useRoute();
  const router = useRouter();
  return (
    <div class="w-full h-full" nodeType={ELNodeType.FRAGMENT}>
      {() => (
        <div class="w-full h-full" deps={[router.router.value.current.nav]}>
          
          {route.current.value && <route.current.value.component
            {...(router.router.value.current.nav.value.props || {})}
          /> }
        </div>
      )}
    </div>
  );
};
