import { Component, computedSignal, pget, signal } from "plicit";
import { ITreeProps } from "./types";

export const Tree: Component<ITreeProps> = (props) => {
  const root = computedSignal(() => pget(props.root));
  const expanded = signal<boolean>(false);

  const handleClick = () => {

    const rootNode = root.get();
    if (props.hook) {
      props.hook.select(rootNode.id);
    }
    
    if (rootNode.children.length <= 0) return;
    expanded.set(x => !x);
  }

  
  return () => (
    <div class="relative space-y-3" deps={[root]}>
      <div on={{
        click: handleClick
      }}>
        {() => {
          const rootNode = root.get();
          if (rootNode.render) return <rootNode.render node={root} />;
          return <div>{rootNode.name}</div>
        }}
      </div>
      {() => {
        const rootNode = root.get();
        return <div class="pl-4 border-l border-gray-200" deps={[expanded]}>
          {expanded.get() ? (
            <div class="space-y-3">
              {rootNode.children.map((child) => {
                return (
                  <Tree deps={[child]} hook={props.hook} root={child} key={`tree-node-${pget(child).id}`} />
                );
              })}
            </div>
          ) : null}
        </div>
      }}
    </div>
  );
};
