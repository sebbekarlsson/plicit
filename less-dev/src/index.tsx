import "./assets/css/index.css";
import { ljsx, ref } from "less";
import { ModalContainer } from "./components/modal/container";
import { NavBar } from "./components/navbar";
import { Card } from "./components/card";
import { Button } from "./components/button";
import { InputField } from "./components/input-field";

const Counter = () => {
  const counter = ref<number>(0);
  return () => {
    return (
      <div class="space-y-2">
        <div class="text-gray-700 text-sm">
          The counter is{" "}
          {() => (
            <span class="text-gray-900 font-semibold" deps={[counter]}>
              {counter.value}
            </span>
          )}
        </div>
        <Button
          on={{
            click: () => (counter.value = counter.value + 1),
          }}
        >
          Click
        </Button>
      </div>
    );
  };
};

const ItemList = () => {
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

const App = (
  <div class="w-full h-full">
    <NavBar />
    <div class="p-4">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(1rem, 1fr))",
          gap: "1rem",
        }}
      >
        <Card title="Counter">
          <Counter />
        </Card>
        <Card title="Item List">
          <ItemList />
        </Card>
      </div>
    </div>
    <ModalContainer />
  </div>
);

App.mountTo(document.getElementById("app"));
