import { Component, MaybeSignal } from "plicit";
import { UseTree } from "./hooks";
export type ITree<T = any> = {
    id: number;
    name: string;
    data: T;
    children: MaybeSignal<ITree<T>>[];
    render?: Component<{
        node: MaybeSignal<ITree<T>>;
    }>;
    selected?: boolean;
};
export type ITreeProps = {
    root: MaybeSignal<ITree<any>>;
    hook?: UseTree<any>;
};
