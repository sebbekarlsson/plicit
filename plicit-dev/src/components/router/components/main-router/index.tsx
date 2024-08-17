import { Component, ELNodeType } from "plicit";
import { useRoute, useRouter } from "../../hooks";

export const MainRouter: Component = () => {
  const router = useRouter();
  const route = useRoute();

  return (
    <div class="w-full h-full" nodeType={ELNodeType.FRAGMENT}>
      {() => (
        <div class="w-full h-full" deps={[router.router.value.current.nav]}>
          {() => {
            const r = route.match.value;

            if (r.parent === r.route && r.route) {
              return <r.route.component />;
            }

            if (r.parent && r.route) {
              return (
                <r.parent.component>
                  <r.route.component />
                </r.parent.component>
              );
            } else if (r.route) {
              return <r.route.component />;
            } else if (r.parent) {
              return <r.parent.component />;
            } else {
              return <div />;
            }
          }}
        </div>
      )}
    </div>
  );
};
