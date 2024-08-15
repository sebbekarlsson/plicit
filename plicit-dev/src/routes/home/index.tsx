import { Component, ljsx, CS, S, GSignal, ref } from "plicit";
import { Card } from "../../components/card";
import { Counter } from "../../components/counter";
import { ItemList } from "../../components/item-list";
import { RangeSlider } from "../../components/range-slider";
import { FileTree } from "../../components/file-tree";
import { TextReverser } from "../../components/text-reverser";
import { Hero } from "../../components/hero";
import { PageContent } from "../../layouts/page-content";
import { Button } from "../../components/button";
import { useMousePositionSignal } from "../../hooks/useMousePositionSignal";
import { CodeBlock } from "../../components/code-block";

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

 

const MouseData: Component = () => {
  const mouse = useMousePositionSignal();
  const mouseText = CS(() => {
    const p = mouse.pos.get();
    return JSON.stringify({
      x: p.x,
      y: p.y
    })
  });
  return <div>
    <CodeBlock title="mouse.json" value={mouseText}/> 
  </div>;
}

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
          <Card title="Mouse" subtitle="Reactive Mouse Position">
            <MouseData/>
          </Card>
          <Card class="min-w-[300px]" title="Counter" subtitle="Classic Counter">
            <Counter />
          </Card>
          <Card title="Item List" subtitle="Reactive Item List">
            <ItemList />
          </Card>
          <Card title="Range Slider" subtitle="Reactive Range Slider">
            <div class="space-y-4">
              <RangeItem value={25} label="A" />
              <RangeItem value={50} label="B" />
              <RangeItem value={75} label="C" />
            </div>
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
