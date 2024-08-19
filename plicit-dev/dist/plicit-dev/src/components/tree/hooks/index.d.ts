import { MaybeSignal, Signal } from "plicit";
import { ITree } from "../types";
export type UseTreeProps<T = any> = {
    root: MaybeSignal<ITree<T>>;
};
export type UseTree<T = any> = {
    root: Signal<ITree<T>>;
    selectedId: Signal<number>;
    select: (id: number) => void;
};
export declare const useTree: <T = any>(props: UseTreeProps<T>) => UseTree;
