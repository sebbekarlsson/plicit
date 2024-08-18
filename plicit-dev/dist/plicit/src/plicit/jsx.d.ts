import { Component } from "./component";
import { LNodeAttributes } from "./lnode";
export declare function ljsx(tag: string | Component, attribs_: LNodeAttributes, ...childs: any[]): import("./lnode").LNode | import("./reactivity").RawRef<import("./lnode").LNode> | Component<import("./types").Dict> | import("./reactivity").Signal<import("./lnode").LNode>;
