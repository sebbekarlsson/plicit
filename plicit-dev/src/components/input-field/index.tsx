import { Component, isSignal } from "plicit";
import { IFormFieldProps } from "../form/types";

type InputFieldProps = IFormFieldProps & {
  onChange?: (x: string | number | null | undefined) => void;
};

export const InputField: Component<InputFieldProps> = (props) => {
  return (
    <input
      class="bg-gray-100 shadow-inner py-3 px-4 block w-full border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none focus:ring-transparent focus:border-transparent outline-none"
      type={props.type}
      value={props.value || ""}
      on={{
        input: (ev: InputEvent) => {
          if (isSignal(props.value)) {
            const target = ev.target as HTMLInputElement;
            props.value.set(target.value);
          }
          queueMicrotask(() => {
            const target = ev.target as HTMLInputElement;
            if (props.onChange) {
              props.onChange(target.value);
            }
          });
        },
      }}
      {...props}
    />
  );
};
