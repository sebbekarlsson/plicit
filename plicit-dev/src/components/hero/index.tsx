import { Component } from "plicit";

export const Hero: Component<{ title: string }> = (props) => {
  return <div class="w-full h-[480px] flex items-center justify-center content-center bg-amaranth-100 select-none">
    <span class="text-amaranth-900" style={{
      fontSize: 'clamp(4rem, 3vw, 30rem)'
    }}>{props.title}</span>
  </div>;
}
