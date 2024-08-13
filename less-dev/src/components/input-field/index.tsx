import { Component, LNodeAttributes, ljsx } from "less";

type InputFieldProps = LNodeAttributes & {
  value: string;
  onChange?: (x: string) => void;
};

export const InputField: Component<InputFieldProps> = (props) => {
  return (
      <input
        class="bg-gray-100 shadow-inner py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        type={props.type}
        value={props.value || ""}
        on={{
          input: (ev: InputEvent) => {
            const target = ev.target as HTMLInputElement;
            if (props.onChange) {
              props.onChange(target.value);
            }
          },
        }}
        {...props}
      />
  );
};
