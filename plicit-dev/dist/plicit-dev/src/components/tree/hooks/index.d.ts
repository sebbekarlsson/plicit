import { MaybeRef, Ref } from "plicit";
import { ITree } from "../types";
export type UseTreeProps<T = any> = {
    root: MaybeRef<ITree<T>>;
};
export type UseTree<T = any> = {
    root: Ref<ITree<T>>;
    selectedId: Ref<number>;
    select: (id: number) => void;
};
export declare const useTree: <T = any>(props: UseTreeProps<T>) => UseTree;
