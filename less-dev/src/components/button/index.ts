import { lnode, LNodeAttributes } from "../../../../less";

export const Button = (attributes: LNodeAttributes) =>
  lnode("button", {
    ...attributes,
    class:
      "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
  });
