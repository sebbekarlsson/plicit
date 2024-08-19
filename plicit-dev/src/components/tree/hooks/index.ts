import { computedSignal, isSignal, MaybeSignal, pget, signal, Signal } from "plicit";
import { ITree } from "../types";

export type UseTreeProps<T = any> = {
  root: MaybeSignal<ITree<T>>;
};

export type UseTree<T = any> = {
  root: Signal<ITree<T>>;
  selectedId: Signal<number>;
  select: (id: number) => void;
};

export const useTree = <T = any>(props: UseTreeProps<T>): UseTree => {
  const root = computedSignal(() => pget(props.root));
  const nodes = computedSignal(() => {
    const items: MaybeSignal<ITree<T>>[] = [];
    const traverse = (node: MaybeSignal<ITree<T>>) => {
      items.push(node);
      const n = pget(node);
      n.children.forEach((child) => traverse(child));
    };
    traverse(root.get());
    return items;
  });
  const selectedId = signal<number>(-1);

  const select = (id: number) => {
    selectedId.set(id);

    nodes.get().forEach((node) => {
      if (isSignal(node)) {
        node.set(x => ({...x, selected: false}));
      }
    });

    const node = nodes.get().find((it) => pget(it).id === id);
    if (node && isSignal(node)) {
      node.set((n) => ({...n, selected: true}))
    }
  };

  return { root, select, selectedId };
};
