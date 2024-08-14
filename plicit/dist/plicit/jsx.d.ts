import { Component } from "./component";
import { LNodeAttributes } from "./lnode";
export declare function ljsx(tag: string | Component, attribs: LNodeAttributes, ...childs: any[]): import("./lnode").LNode | (() => import("./lnode").LNode | import("./proxy").RawRef<import("./lnode").LNode> | Component<import("./types").Dict> | import("./signal").Signal<import("./lnode").LNode>);
