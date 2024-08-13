import { computed, ref } from "plicit";
import { useFakeDatabase } from "../../hooks/useFakeDatabase";
import { ITable, ITableRow } from "../table/types";
import { InputField } from "../input-field";
import { Table } from "../table";

export const PeopleTable = () => {
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
