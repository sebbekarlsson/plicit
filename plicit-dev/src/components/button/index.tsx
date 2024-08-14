import { ljsx, LNodeAttributes } from "plicit";

export const Button = (attributes: LNodeAttributes) => (
  <button
    class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-amaranth-600 text-white hover:bg-amaranth-700 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
    {...attributes}
  >
    {attributes.children}
  </button>
);