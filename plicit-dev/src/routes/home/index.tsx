import { Component, ljsx, CS, S } from "plicit";
import { Card } from "../../components/card";
import { Counter } from "../../components/counter";
import { ItemList } from "../../components/item-list";
import { RangeSlider } from "../../components/range-slider";
import { FileTree } from "../../components/file-tree";
import { TextReverser } from "../../components/text-reverser";
import { Hero } from "../../components/hero";
import { PageContent } from "../../layouts/page-content";

const RangeItem: Component<{ label: string; value: number }> = (props) => {
  const state = S<number>(props.value);

  return (
    <div class="space-y-2">
      <div class="text-gray-700 font-semibold text-sm select-none grid grid-cols-[minmax(3rem,1fr),auto]">
        <span>{props.label}</span>
        {CS(() => (
          <span>{state.get()}</span>
        ))}
      </div>
      <RangeSlider
        onChange={(value) => state.set(() => value)}
        value={state.get()}
      />
    </div>
  );
};

export const HomeRoute: Component = () => {
  return (
    <div class="w-full h-full">
      <Hero title="Plicit Demo" />
      <PageContent>
        <div
          class="h-full w-full"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(33%, auto))",
            gap: "1rem",
          }}
        >
          <Card class="min-w-[300px]" title="Counter" subtitle="Classic Counter">
            <Counter />
          </Card>
          <Card title="Range Slider" subtitle="Reactive Range Slider">
            <div class="space-y-4">
              <RangeItem value={25} label="A" />
              <RangeItem value={50} label="B" />
              <RangeItem value={75} label="C" />
            </div>
          </Card>
          <Card title="Item List" subtitle="Reactive Item List">
            <ItemList />
          </Card>
          
          <Card title="File Tree" subtitle="A virtual filesystem">
            <FileTree />
          </Card>
          <Card title="Text Reverser" subtitle="Reactive text reverser">
            <TextReverser />
          </Card>
        </div>
      </PageContent>
    </div>
  );
};
