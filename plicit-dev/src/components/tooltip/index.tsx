import { Component } from "plicit";
import { ITooltipProps } from "./types";

export const Tooltip: Component<ITooltipProps> = (props) => {
  return <div style={props.hook.style} ref={props.hook.toolRef} class="bg-white min-w-[4rem] min-h[1rem] shadow-md rounded overflow-hidden select-none">
    { props.hook.body || props.hook.text || '' }
  </div>;
}
