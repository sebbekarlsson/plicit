import { Component, LNodeAttributes } from "plicit";
import { IButtonProps } from "./types";
import { Icon } from "../icon";

export const Button: Component<IButtonProps> = (props) => (
  <button
    class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none"
    {...props}
  >
    { props.icon && <Icon icon={props.icon}/> }
    {props.children}
  </button>
);
