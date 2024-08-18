import { Component } from "plicit";

export const PageContent: Component = (props) => {
  return <div class="px-4 pt-4 w-full h-full max-w-[1600px] mx-auto">
    {props.children}
  </div>
}
