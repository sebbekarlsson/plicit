import { Component } from "./component";
import { LNodeAttributes } from "./lnode";
export declare function ljsx(tag: string | Component, attribs_: LNodeAttributes, ...childs: any[]): Component<import("./types").Dict> | import("./lnode").LNode | import("./reactivity").RawRef<import("./lnode").LNode> | import("./reactivity").Signal<import("./lnode").LNode>;
