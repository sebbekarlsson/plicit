import { Component, MaybeRef } from "less";

export type ITree<T = any> = {
  id: number;
  name: string;
  data: T;
  children: MaybeRef<ITree<T>>[];
  render?: Component<{ node: ITree<T> }>;
}
export type ITreeProps = {
  root: MaybeRef<ITree<any>>;
}
