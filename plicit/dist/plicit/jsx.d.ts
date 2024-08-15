import { Component } from "./component";
import { LNodeAttributes } from "./lnode";
export declare function ljsx(tag: string | Component, attribs: LNodeAttributes, ...childs: any[]): Component<import("./types").Dict> | import("./lnode").LNode | import("./proxy").RawRef<import("./lnode").LNode> | import("./signal").Signal<import("./lnode").LNode>;
