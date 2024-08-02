import { Component, ljsx } from "less";

type CardProps = {
  title: string;
};

export const Card: Component<CardProps> = (props) => {
  return () => (
    <div class="border border-gray-300 rounded overflow-hidden min-w-[100px] min-h-[100px] flex flex-col">
      <div class="w-full h-[2.7rem] flex-none flex items-center px-3">
        <div class="text-gray-700 text-base">{props.title}</div>
      </div>
      <div class="px-3 py-3 text-gray-900">{props.children}</div>
    </div>
  );
};
