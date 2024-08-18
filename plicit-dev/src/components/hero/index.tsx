import { Component } from "plicit";

export const Hero: Component<{ title: string; subtitle?: string }> = (
  props,
) => {
  return (
    <div class="w-full h-[300px] flex items-center justify-center content-center bg-gradient-to-t from-primary-100 to-primary-300 select-none">
      <div class="flex items-center justify-center flex-col flex-wrap text-center">
        <div
          class="text-primary-900 font-semibold text-center"
          style={{
            fontSize: "clamp(6rem, 3vw, 8rem)",
          }}
        >
          {props.title}
        </div>
        {props.subtitle && (
          <div class="text-primary-900 font-semibold text-center text-lg">{props.subtitle}</div>
        )}
      </div>
    </div>
  );
};
