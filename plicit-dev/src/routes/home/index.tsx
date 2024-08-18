import { Component, ljsx, CS, S, computedSignal, signal } from "plicit";
import { Card } from "../../components/card";
import { Counter } from "../../components/counter";
import { ItemList } from "../../components/item-list";
import { RangeSlider } from "../../components/range-slider";
import { TextReverser } from "../../components/text-reverser";
import { Hero } from "../../components/hero";
import { PageContent } from "../../layouts/page-content";
import { LineGraph } from "../../components/line-graph";
import { Table } from "../../components/table";
import { ITableRow, ITable } from "../../components/table/types";
import { useFakeDatabase } from "../../hooks/useFakeDatabase";
import { InputField } from "../../components/input-field";
import { twColor } from "../../utils/style";

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


const TableDemo: Component = () => {

  const query = signal<string>('', { debounce: 60 });
  const db = useFakeDatabase({
    query,
    count: 10,
    seed: 5013.3812
  });

  const rows = computedSignal((): ITableRow[] => {
    return db.users.get().map((user) => {
      return {
        columns: [
          {
            label: 'firstname',
            body: () => <span>{user.firstname}</span>
          },
          {
            label: 'lastname',
            body: () => <span>{user.lastname}</span>
          },
          {
            label: 'age',
            body: () => <span>{user.age}</span>
          }  
        ]
      }
    })
  });

  const table: ITable = {
    rows
  }

  return () => <div class="flex flex-col h-[400px] w-full">
    <div class="h-[4rem] flex-none flex items-start">
      <InputField value="" type="text" onChange={(val) => query.set(val)} placeholder="Search..."/>
    </div>
    <Table table={table}/> 
  </div>
}

export const HomeRoute: Component = () => {
  return (
    <div class="w-full h-full">
      <Hero title="Plicit" subtitle="Explicitly Reactive" />
      <PageContent>
        <div
          class="h-full w-full"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(33%, auto))",
            gap: "1rem",
          }}
        >
          <Card title="Graph" subtitle="Line Graph">
            <div class="h-[256px]">
              <LineGraph
                xAxis={{ tickCount: 8 }}
                yAxis={{ tickCount: 6, format: (x) => x.toFixed(2) }}
                color={twColor('primary-500')}
              />
            </div>
          </Card>
          <Card title="Range Slider" subtitle="Reactive Range Slider">
            <div class="space-y-4">
              <RangeItem value={25} label="A" />
              <RangeItem value={50} label="B" />
              <RangeItem value={75} label="C" />
            </div>
          </Card>
          <Card title="Table" subtitle="Data Table">
            <TableDemo/>
          </Card>
          <Card title="Counter" subtitle="Classic Counter">
            <Counter />
          </Card>
          <Card title="Item List" subtitle="Reactive Item List">
            <ItemList />
          </Card>
          <Card title="Text Reverser" subtitle="Reactive text reverser">
            <TextReverser />
          </Card>
        </div>
      </PageContent>
    </div>
  );
};
