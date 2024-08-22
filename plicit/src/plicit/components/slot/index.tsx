import { Component } from "../../component";
import { ELNodeType } from "../../lnode";

export const Slot: Component<{ name: string }> = (props) => {
  return <div nodeType={ELNodeType.SLOT} name={props.name}>{props.children}</div>;
};
