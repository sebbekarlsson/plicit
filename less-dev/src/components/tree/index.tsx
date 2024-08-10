import { Component, computed, ref, unref } from "less";
import { ITreeProps } from "./types";

export const Tree: Component<ITreeProps> = (props) => {
  const root = computed(() => unref(props.root), [props.root]);
  const expanded = ref<boolean>(false);

  const handleClick = () => {
    if (root.value.children.length <= 0) return;
    expanded.value = !expanded.value;
  }

  
  return (
    <div class="relative space-y-3">
      <div on={{
        click: handleClick
      }}>
        {root.value.render ? (
          <root.value.render node={unref(root)} />
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
                  <Tree root={child} key={`tree-node-${unref(child).id}`} />
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
