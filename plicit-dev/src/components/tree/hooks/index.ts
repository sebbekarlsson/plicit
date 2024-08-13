import { computed, isRef, MaybeRef, Ref, ref, unref } from "plicit";
import { ITree } from "../types";

export type UseTreeProps<T = any> = {
  root: MaybeRef<ITree<T>>;
};

export type UseTree<T = any> = {
  root: Ref<ITree<T>>;
  selectedId: Ref<number>;
  select: (id: number) => void;
};

export const useTree = <T = any>(props: UseTreeProps<T>): UseTree => {
  const root = computed(() => unref(props.root), [props.root]);
  const nodes = computed(() => {
    const items: MaybeRef<ITree<T>>[] = [];
    const traverse = (node: MaybeRef<ITree<T>>) => {
      items.push(node);
      const n = unref(node);
      n.children.forEach((child) => traverse(child));
    };
    traverse(root);
    return items;
  }, [root]);
  const selectedId = ref<number>(-1);

  const select = (id: number) => {
    selectedId.value = id;

    nodes.value.forEach((node) => {
      if (isRef(node)) {
        node.value.selected = false;
      }
    });

    const node = nodes.value.find((it) => unref(it).id === id);
    if (node && isRef(node)) {
      node.value.selected = true;
    }
  };

  return { root, select, selectedId };
};
