import { computedSignal, signal } from "plicit";
import { useFakeDatabase } from "../../hooks/useFakeDatabase";
import { ITable, ITableRow } from "../table/types";
import { InputField } from "../input-field";
import { Table } from "../table";

export const PeopleTable = () => {
  const query = signal<string>("", { debounce: 60 });
  const db = useFakeDatabase({
    query,
    count: 256,
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
    <div class="flex flex-col h-full w-full">
      <div class="h-[4rem] flex-none flex items-start">
        <InputField
          value=""
          type="text"
          onChange={(val) => query.set(val + "")}
          placeholder="Search..."
        />
      </div>
      <Table table={table} />
    </div>
  );
};
