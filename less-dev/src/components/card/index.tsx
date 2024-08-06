import { Component } from "less";

type CardProps = {
  title: string;
  subtitle?: string;
};

export const Card: Component<CardProps> = (props) => {
  return (
    <div class="flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
      <h3 class="text-lg font-bold text-gray-800 dark:text-white">
        {props.title}
      </h3>
      {props.subtitle && (
        <p class="mt-1 text-xs font-medium text-gray-500 dark:text-neutral-500">
          {props.subtitle}
        </p>
      )}
      <div class="mt-4 text-gray-500 dark:text-neutral-400">
        {props.children}
      </div>
    </div>
  );
};
