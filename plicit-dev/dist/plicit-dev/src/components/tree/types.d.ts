import { Component, MaybeRef } from "plicit";
import { UseTree } from "./hooks";
export type ITree<T = any> = {
    id: number;
    name: string;
    data: T;
    children: MaybeRef<ITree<T>>[];
    render?: Component<{
        node: MaybeRef<ITree<T>>;
    }>;
    selected?: boolean;
};
export type ITreeProps = {
    root: MaybeRef<ITree<any>>;
    hook?: UseTree<any>;
};
