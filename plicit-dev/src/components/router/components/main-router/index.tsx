import {
  Component,
  computedAsync,
  computedSignal,
  ELNodeType,
  isAsyncFunction,
} from "plicit";
import { useRoute, useRouter } from "../../hooks";

export const MainRouter: Component = () => {
  const router = useRouter();
  const route = useRoute();

  const parentComponent = computedAsync(async () => {
    const r = route.match.value;
    if (!r || !r.parent) return null;
    if (isAsyncFunction(r.parent.component)) return await r.parent.component();
    return r.parent.component;
  }, [router.router.value.current.nav, route.match]);

  const childComponent = computedAsync(async () => {
    const r = route.match.value;
    if (!r || !r.route) return null;
    if (isAsyncFunction(r.route.component)) return await r.route.component();
    return r.route.component;
  }, [router.router.value.current.nav, route.match]);

  return (
    <div class="w-full h-full" nodeType={ELNodeType.FRAGMENT}>
      {() => (
        <div class="w-full h-full">
          {computedSignal(() => {
            const parent = parentComponent.data;
            const child = childComponent.data;

            if (parent.value === child.value && child.value) {
              return <child.value />;
            }

            if (parent.value && child.value) {
              return (
                <parent.value>
                  <child.value />
                </parent.value>
              );
            } else if (child.value) {
              return <child.value />;
            } else if (parent.value) {
              return <parent.value />;
            } else {
              return <div />;
            }
          })}
        </div>
      )}
    </div>
  );
};
