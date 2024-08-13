import { ref } from "plicit";
import { InputField } from "../input-field";
import { Button } from "../button";
import { useToasts } from "../toast/hook";

export const ItemList = () => {

  const toasts = useToasts();
  
  const items = ref<{ label: string, id: number }[]>([]);
  const nextItem = ref<string>("");
  let idCounter: number = 0;

  const addItem = (label: string) => {
    items.value = [...items.value, { label, id: idCounter++ }];

    toasts.push({ message: `You added ${label}!` })
  }

  const removeItem = (id: number) => {
    items.value = items.value.filter(item => item.id !== id)
    toasts.push({ message: `You deleted an item!` })
  }

  return (
    <div class="space-y-2">
      <div class="grid grid-cols-[1fr,max-content] gap-[1rem]">
        {() => (
          <InputField
            onChange={(next) => {
              nextItem.value = next;
            }}
            type="text"
            placeholder="Name your item..."
            value={nextItem.value}
            deps={[nextItem]}
          />
        )}
        <Button
          on={{
            click: () => {
              if (nextItem.value.length <= 0) return;
              addItem(nextItem.value);
              nextItem.value = "";
            },
          }}
        >
          Add Item
        </Button>
      </div>
      {() => (
        <div deps={[items]} class="h-[300px] overflow-auto">
          {items.value.map((it) => {
            return (
              <div class="w-full h-[2rem] flex items-center text-gray-700 hover:bg-blue-100 cursor-pointer" on={{
                click: () => {
                  removeItem(it.id);
                }
              }}>
                {it.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
