import { Component } from "plicit";

type IGridProps = {
  columns?: string;
  rows?: string;
  justifyContent?: string;
  justifyItems?: string;
  alignItems?: string;
  alignContent?: string;
  gap?: string;
}

export const Grid: Component<IGridProps> = (props) => {
  return <div class={props.class} style={{
    display: 'grid',
    gridTemplateColumns: props.columns,
    gridTemplateRows: props.rows,
    justifyContent: props.justifyContent,
    alignItems: props.alignItems,
    alignContent: props.alignContent,
    gap: props.gap
  }}>{props.children}</div>;
}
