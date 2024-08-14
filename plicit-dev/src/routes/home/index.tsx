import { Component, computed, ljsx, ref } from "plicit";
import { Card } from "../../components/card";
import { Counter } from "../../components/counter";
import { ItemList } from "../../components/item-list";
import { RangeSlider } from "../../components/range-slider";
import { FileTree } from "../../components/file-tree";
import { TextReverser } from "../../components/text-reverser";

export const HomeRoute: Component = () => {
  return (
    <div class="w-full h-full">
      <div
        class="h-full w-full"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(30%, 1fr))",
          gap: "1rem",
        }}
      >
        <Card title="Counter" subtitle="Classic Counter">
          <Counter />
        </Card>
        <Card title="Item List" subtitle="Reactive Item List">
          <ItemList />
        </Card>
        <Card title="Range Slider" subtitle="Reactive Range Slider">
          {() => {
            const state = ref<number>(0);

            return (
              <div class="space-y-2">
                <div class="text-gray-700 font-semibold text-sm select-none">
                  {computed(
                    () => (
                      <span>{state.value}</span>
                    ),
                    [state],
                  )}
                </div>
                <RangeSlider
                  onChange={(value) => (state.value = value)}
                  value={state}
                />
              </div>
            );
          }}
        </Card>
        <Card title="File Tree" subtitle="A virtual filesystem">
          <FileTree />
        </Card>
        <Card title="Text Reverser" subtitle="Reactive text reverser">
          <TextReverser/>
        </Card>
      </div>
    </div>
  );
};
