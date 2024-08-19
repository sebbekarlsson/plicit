import {
  Component,
  computedAsyncSignal,
  computedSignal,
  ELNodeType,
  isAsyncFunction,
} from "plicit";
import { useRoute } from "../../hooks";

export const MainRouter: Component = () => {
  const route = useRoute();

  const parentComponent = computedAsyncSignal<Component>(async () => {
    const r = route.match.get();
    if (!r || !r.parent) return null;
    if (isAsyncFunction(r.parent.component)) return await r.parent.component();
    return r.parent.component;
  });

  const childComponent = computedAsyncSignal<Component>(async () => {
    const r = route.match.get();
    if (!r || !r.route) return null;
    if (isAsyncFunction(r.route.component)) return await r.route.component()
    return r.route.component;
  });

  return (
    <div class="w-full h-full" nodeType={ELNodeType.FRAGMENT}>
      {() => (
        <div class="w-full h-full">
          {computedSignal(() => {
            const statusParent = parentComponent.status.get();
            const statusChild = childComponent.status.get();

            if (statusParent === 'pending' || statusChild === 'pending') {
              return <div>LOADING</div>
            }
            
            const parent = parentComponent.data;
            const ParentComp = { component: parent.get() };
            const child = childComponent.data;
            const ChildComp = { component: child.get() };

            if (ParentComp.component === ChildComp.component && ChildComp.component) {
              return <ChildComp.component />
            }

            if (ParentComp.component && ChildComp.component) {
              return (
                <ParentComp.component>
                  <ChildComp.component />
                </ParentComp.component>
              );
            } else if (ChildComp.component) {
              return <ChildComp.component />;
            } else if (ParentComp.component) {
              return <ParentComp.component />;
            } else {
              return <div>ERROR</div>;
            }
          })}
        </div>
      )}
    </div>
  );
};
