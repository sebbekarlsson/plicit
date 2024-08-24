import { VNode } from ".";
import { CSSProperties } from "../../css";
import { AsyncSignal, MaybeSignal, Signal } from "../../reactivity";
import { NativeElementListeners } from "../../types";
import { VComponent } from "../component/types";
import { EVNodeType } from "./types";


type WithSignals<T> = {
  [k in keyof T]: k extends '_type' ? T[k] : T[k] extends (Signal | AsyncSignal) ? T[k] : MaybeSignal<T[k]>
};

export type VNodeProps = WithSignals<{
  name?: string;
  on?: Partial<NativeElementListeners>;
  text?: string;
  class?: string;
  children?: VNode[];
  style?: CSSProperties;
  ref?: Signal<VNode | undefined>;
  _signal?: Signal<VNode> | AsyncSignal<VNode>
  _type?: EVNodeType;
  _component?: VComponent;
  [key: string]: any;
}>
