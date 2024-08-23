import { computedSignal, signal } from "plicit";
import { useFakeDatabase, User } from "../../hooks/useFakeDatabase";
import { ITable, ITableRow } from "../table/types";
import { InputField } from "../input-field";
import { Table } from "../table";
import { Button } from "../button";
import { useModals } from "../modal/hook";
import { useForm } from "../form/hooks/useForm";
import { Form } from "../form";


const pushAddNewPersonModal = () => {
  const modals = useModals();

  const form = useForm<User>({
    schema: {
      firstname: {
        $type: 'string',
        $label: 'First Name',
        $value: ''
      },
      lastname: {
        $type: 'string',
        $label: 'Last Name',
        $value: ''
      },
      age: {
        $type: 'number',
        $label: 'Age',
        $value: undefined
      }
    },
    components: {
      string: (props) => <InputField {...props} type="text"/>,
      number: (props) => <InputField {...props} type="number"/>
    }
  })
  
  modals.push({
    title: 'Create New User',
    body: () => {
      return <div class="w-full h-full p-4">
        <Form hook={form}/>
      </div> 
    }
  })
}

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

  const handleAddNew = async () => {
    pushAddNewPersonModal();
  }

  const table: ITable = {
    rows,
    banner: {
      title: 'People',
      subtitle: computedSignal(() => `There are ${db.totalCount.get()} people in total`),
      actions: () => {
        return <Button on={{ click: handleAddNew }} icon={{
          src: async () => import('../../assets/icons/plus.svg'),
          fill: 'currentColor',
          size: '1rem'
        }}>New</Button>;
      },
      body: () => {
        return <div>HELLO</div>
      }
    }
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
