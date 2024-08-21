import {
  Component,
  ljsx,
  CS,
  S,
  computedSignal,
  signal,
  range,
  stringGenerator,
  MaybeSignal,
  pget,
  AsyncComponent,
  sleep,
} from "plicit";
import { Card } from "../../components/card";
import { Counter } from "../../components/counter";
import { ItemList } from "../../components/item-list";
import { RangeSlider } from "../../components/range-slider";
import { TextReverser } from "../../components/text-reverser";
import { Hero } from "../../components/hero";
import { LineGraph } from "../../components/line-graph";
import { Table } from "../../components/table";
import { ITableRow, ITable } from "../../components/table/types";
import { useFakeDatabase } from "../../hooks/useFakeDatabase";
import { InputField } from "../../components/input-field";
import { twColor } from "../../utils/style";
import { DonutSlice } from "../../components/donut-chart/types";
import { DonutChart } from "../../components/donut-chart";
import { hashu32_v1, noise2D, toUint32 } from "tsmathutil";
import { Button } from "../../components/button";

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
  const query = signal<string>("", { debounce: 60 });
  const db = useFakeDatabase({
    query,
    count: 10,
    seed: 5013.3812,
  });

  const rows = computedSignal((): ITableRow[] => {
    return db.users.get().map((user) => {
      return {
        columns: [
          {
            label: "firstname",
            body: () => <span>{user.firstname}</span>,
          },
          {
            label: "lastname",
            body: () => <span>{user.lastname}</span>,
          },
          {
            label: "age",
            body: () => <span>{user.age}</span>,
          },
        ],
      };
    });
  });

  const table: ITable = {
    rows,
  };

  return () => (
    <div class="flex flex-col h-[400px] w-full">
      <div class="h-[4rem] flex-none flex items-start">
        <InputField
          value=""
          type="text"
          onChange={(val) => query.set(val + '')}
          placeholder="Search..."
        />
      </div>
      <Table table={table} />
    </div>
  );
};

const MyDonut: Component<{ seed: MaybeSignal<number> }> = (props) => {
  const N = 4;
  const seed = computedSignal(
    () => Math.random() * 10.381782 * (1.0 + Math.random()) + pget(props.seed),
  );
  const strGen = computedSignal(() => stringGenerator(seed.get()));
  const colors = [
    twColor("primary-500"),
    twColor("primary-900"),
    twColor("cyan-500"),
    twColor("purple-500"),
  ];
  const slices = computedSignal((): DonutSlice[] => {
    const gen = strGen.get();
    const s = seed.get();
    return range(N).map((i): DonutSlice => {
      const ni = i / N;
      const value = noise2D(ni, ni, s, 4, 300.0123) * 1000;
      const color = colors[i % colors.length];

      return {
        value: value,
        label: gen.nextWord(3, 9),
        color: color,
      };
    });
  });

  return (
        computedSignal(() => (
          <DonutChart data={slices.get()} size={199} padding={0.3} />
        ))
  );
};


const AsyncTest: AsyncComponent = async (props) => {
  await sleep(1000);
  return <div {...props}>Hello!</div>;
}

const HelloWorld = async () => {
  await sleep(1000);
  return <div>Hello world!</div>;
}

export const HomeRoute: Component = () => {
  return (
    <div class="w-full h-full">
      <Hero title="Plicit" subtitle="Explicitly Reactive" />
      <div class="p-4">
        <div
          class="h-full w-full"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(33%, auto))",
            gap: "1rem",
          }}
        >
          <Card title="Async" subtitle="Async Component">
            <HelloWorld asyncFallback={() => <div>HAHAH</div>}/>
          </Card>
          <Card title="Donut" subtitle="Donut Chart">
            {() => {
              const seed1 = signal<number>(5013.5823);

              const randomize = () => {
                seed1.set((old) => toUint32(old + hashu32_v1(old)));
              };

              return (
                <div class="w-full h-full flex flex-col">
                  <div>
                    <MyDonut seed={seed1} />
                  </div>
                  <div
                    class="flex-none h-[4rem]"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "max-content",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  >
                    <Button on={{ click: randomize }}>Randomize</Button>
                  </div>
                </div>
              );
            }}
          </Card>
          <Card title="Graph" subtitle="Line Graph">
            <div class="h-[256px]">
              <LineGraph
                xAxis={{ tickCount: 8 }}
                yAxis={{ tickCount: 6, format: (x) => x.toFixed(2) }}
                color={twColor("primary-500")}
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
            <TableDemo />
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
      </div>
    </div>
  );
};
