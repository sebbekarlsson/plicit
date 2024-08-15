import { Component } from "plicit";

export const PageContent: Component = (props) => {
  return <div class="px-4 pt-4 w-full h-auto">
    {props.children}
  </div>
}
