import { Component, computed, ljsx, ref } from "less";
import { Card } from "../../components/card";
import { Counter } from "../../components/counter";
import { ItemList } from "../../components/item-list";
import { RangeSlider } from "../../components/range-slider";
import { PeopleTable } from "../../components/people-table";
import { FileTree } from "../../components/file-tree";

export const HomeRoute: Component = () => {
  return (
    <div class="w-full h-full flex flex-col">
      <div
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
        <Card title="Table" subtitle="Reactive Table">
          <PeopleTable />
        </Card>
        <Card title="Range Slider" subtitle="Reactive Range Slider">
          {() => {
            const state = ref<number>(50);

            return (
              <div>
                <div class="text-gray-700 font-semibold text-sm">
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
      </div>
    </div>
  );
};
