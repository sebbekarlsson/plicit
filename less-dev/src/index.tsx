import "./assets/css/index.css";
import { computed, ljsx, ref } from "less";
import { ModalContainer } from "./components/modal/container";
import { NavBar } from "./components/navbar";
import { Card } from "./components/card";
import { Counter } from "./components/counter";
import { ItemList } from "./components/item-list";
import { useFakeDatabase } from "./hooks/useFakeDatabase";
import { ITable, ITableRow } from "./components/table/types";
import { Table } from "./components/table";
import { InputField } from "./components/input-field";
import { RangeSlider } from "./components/range-slider";
import { ToastContainer } from "./components/toast/container";

globalThis.ljsx = ljsx;

const PeopleTable = () => {
  const query = ref<string>('');
  const db = useFakeDatabase({
    query,
    count: 256
  });

  const rows = computed((): ITableRow[] => {
    return db.users.value.map((user) => {
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
  }, [db.users, query]);

  const table: ITable = {
    rows
  }

  return () => <div class="h-[300px] flex flex-col">
    <div class="h-[4rem] flex-none flex items-start">
      <InputField value={query.value} type="text" onChange={(val) => query.value = val} deps={[query]} placeholder="Search..."/>
    </div>
    <Table table={table}/> 
  </div> 
}


const App = (
  <div class="w-full h-full flex flex-col">
    <NavBar />
    <div class="p-4 overflow-auto">
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
          <PeopleTable/>
        </Card>
        <Card title="Range Slider" subtitle="Reactive Range Slider">
          {
            () => {
              const state = ref<number>(50);
              
              return <div>
                <div class="text-gray-700 font-semibold text-sm">{ computed(() => <span>{state.value}</span>, [state]) }</div>
                <RangeSlider onChange={(value) => state.value = value} value={state}/>
              </div> 
            }
          }
        </Card>
      </div>
    </div>
    <ModalContainer />
    <ToastContainer/>
  </div>
);

App.mountTo(document.getElementById("app"));
