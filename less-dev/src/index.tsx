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
        <Card title="Table">
          <PeopleTable/>
        </Card>
      </div>
    </div>
    <ModalContainer />
  </div>
);

App.mountTo(document.getElementById("app"));
