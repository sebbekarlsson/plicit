import { ljsx, LNodeAttributes } from "plicit";

export const Button = (attributes: LNodeAttributes) => (
  <button
    class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none"
    {...attributes}
  >
    {attributes.children}
  </button>
);
