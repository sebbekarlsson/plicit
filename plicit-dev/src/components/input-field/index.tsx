import { Component, LNodeAttributes, ljsx } from "plicit";

type InputFieldProps = LNodeAttributes & {
  value: string;
  onChange?: (x: string) => void;
};

export const InputField: Component<InputFieldProps> = (props) => {
  return (
      <input
        class="bg-gray-100 shadow-inner py-3 px-4 block w-full border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none focus:ring-transparent focus:border-transparent outline-none"
        type={props.type}
        value={props.value || ""}
        on={{
          input: (ev: InputEvent) => {
            queueMicrotask(() => {
              const target = ev.target as HTMLInputElement;
              if (props.onChange) {
                props.onChange(target.value);
              }
            })
            
          },
        }}
        {...props}
      />
  );
};
