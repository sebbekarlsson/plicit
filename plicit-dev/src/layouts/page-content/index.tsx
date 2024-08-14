import { Component } from "plicit";

export const PageContent: Component = (props) => {
  return <div class="p-4 w-full h-full">{props.children}</div>
}
