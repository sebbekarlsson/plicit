import { InputField } from "../input-field";
import { Button } from "../button";
import { useToasts } from "../toast/hook";
import { computedSignal, signal } from "plicit";

export const ItemList = () => {
  const toasts = useToasts();

  const items = signal<{ label: string; id: number }[]>([]);
  const nextItem = signal<string>("");
  let idCounter: number = 0;

  const addItem = (label: string) => {
    items.set((items) => [...items, { label, id: idCounter++ }]);

    toasts.push({ message: `You added ${label}!` });
  };

  const removeItem = (id: number) => {
    items.set((items) => items.filter((it) => it.id !== id));
    toasts.push({ message: `You deleted an item!` });
  };

  return (
    <div class="space-y-2">
      <div class="grid grid-cols-[1fr,max-content] gap-[1rem]">
        {() => (
          <InputField
            onChange={(next) => {
              nextItem.set(next + "");
            }}
            type="text"
            placeholder="Name your item..."
            value={nextItem}
          />
        )}
        <Button
          on={{
            click: () => {
              const next = nextItem.get();
              if (next.length <= 0) return;
              addItem(next);
              nextItem.set("");
            },
          }}
        >
          Add Item
        </Button>
      </div>
      {computedSignal(() => (
        <div deps={[items]} class="h-[300px] overflow-auto">
          {items.get().map((it) => {
            return (
              <div
                class="w-full h-[2rem] flex items-center text-gray-700 hover:bg-blue-100 cursor-pointer"
                on={{
                  click: () => {
                    removeItem(it.id);
                  },
                }}
              >
                {it.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
