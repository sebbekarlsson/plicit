import { MaybeSignal } from "./reactivity";
import { VNode, VNodeProps } from "./rendering";
import { VComponent } from "./rendering/component/types";
export declare function ljsx(tag: string | VNode | VComponent, attribs_: VNodeProps, ...childs: any[]): MaybeSignal<VNode>;
declare global {
    export function ljsx(tag: string | VNode | VComponent, attribs_: VNodeProps, ...childs: any[]): MaybeSignal<VNode>;
    export function React(tag: string | VNode | VComponent, attribs_: VNodeProps, ...childs: any[]): MaybeSignal<VNode>;
}
