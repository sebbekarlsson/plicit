import { ref } from "less";
import { InputField } from "../input-field";
import { Button } from "../button";

export const ItemList = () => {
  const items = ref<{ label: string, id: number }[]>([]);
  const nextItem = ref<string>("");
  let idCounter: number = 0;

  const addItem = (label: string) => {
    items.value = [...items.value, { label, id: idCounter++ }]
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
                  items.value = items.value.filter(item => item.id !== it.id); 
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
