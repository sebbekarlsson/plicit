import { Component } from "plicit";

type CardProps = {
  title: string;
  subtitle?: string;
};

export const Card: Component<CardProps> = (props) => {
  return (
    <div class={"flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5" + (props.class ? ` ${props.class}` : '')}>
      <h3 class="text-lg font-bold text-gray-800">
        {props.title}
      </h3>
      {props.subtitle && (
        <p class="mt-1 text-xs font-medium text-gray-500">
          {props.subtitle}
        </p>
      )}
      <div class="mt-4 text-gray-500">
        {props.children}
      </div>
    </div>
  );
};
