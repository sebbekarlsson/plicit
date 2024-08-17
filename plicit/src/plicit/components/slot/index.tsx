import { Component } from "../../component";
import { ljsx } from "../../jsx";
import { ELNodeType } from "../../lnode";

export const Slot: Component<{ name: string }> = (props) => {
  return <div nodeType={ELNodeType.SLOT} name={props.name}>{props.children}</div>;
};
