import { LNodeAttributes, ljsx } from "less";

export const InputField = (props: LNodeAttributes & { value: string }) => (
  <input
    type={props.type}
    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    {...props}
  />
);
