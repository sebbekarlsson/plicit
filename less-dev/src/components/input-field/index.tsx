import { LNodeAttributes, ljsx } from "less";

export const InputField = (props: LNodeAttributes & { value: string, onChange: (x: string) => void }) => (
  <input
    type={props.type}
    value={props.value || ''}
    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    on={{
      input: (ev: InputEvent) => {
        const target = ev.target as HTMLInputElement;
        props.onChange(target.value);
      }
    }}
    {...props}
  />
);
