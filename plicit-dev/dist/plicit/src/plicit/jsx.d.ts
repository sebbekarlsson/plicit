import { Component } from "./component";
import { LNodeAttributes, LNode } from "./lnode";
import { MaybeSignal } from "./reactivity";
export declare function ljsx(tag: string | Component, attribs_: LNodeAttributes, ...childs: any[]): MaybeSignal<LNode>;
declare global {
    export function ljsx(tag: string | Component, attribs_: LNodeAttributes, ...childs: any[]): MaybeSignal<LNode>;
    export function React(tag: string | Component, attribs_: LNodeAttributes, ...childs: any[]): MaybeSignal<LNode>;
}
