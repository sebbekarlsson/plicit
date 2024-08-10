import { Component, computed, ref, unref } from "less";
import { ITreeProps } from "./types";

export const Tree: Component<ITreeProps> = (props) => {
  const root = computed(() => unref(props.root), [props.root]);
  const expanded = ref<boolean>(false);
  //const isSelected = computed(() => props.hook ? props.hook.selectedId.value === root.value.id : false, [root, props.hook?.selectedId]);

  const handleClick = () => {
    if (props.hook) {
      props.hook.select(root.value.id);
    }
    
    if (root.value.children.length <= 0) return;
    expanded.value = !expanded.value;
  }

  
  return () => (
    <div class="relative space-y-3" deps={[root]}>
      <div on={{
        click: handleClick
      }}>
        {root.value.render ? (
          () => <root.value.render node={root} />
        ) : (
          <div>{root.value.name}</div>
        )}
      </div>
      {() => (
        <div class="pl-4 border-l border-gray-200" deps={[expanded]}>
          {expanded.value ? (
            <div class="space-y-3">
              {root.value.children.map((child) => {
                return (
                  <Tree deps={[child]} hook={props.hook} root={child} key={`tree-node-${unref(child).id}`} />
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
