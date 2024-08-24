import { computedSignal, signal } from "plicit";
import { useForm} from "@/components/form/hooks/useForm";
import { Form } from '@/components/form';
import { useModals } from "plicit-dev/src/components/modal/hook";
import { useFakeDatabase, User } from "plicit-dev/src/hooks/useFakeDatabase";
import { Grid } from "plicit-dev/src/routes/components/grid";
import { InputField } from "@/components/input-field";
import { useToasts } from "@/components/toast/hook";
import { ITableRow, ITable } from "@/components/table/types";
import { Button } from "@/components/button";
import { Table } from "@/components/table";


type UserWithoutId = Omit<User, 'id'>

const pushAddNewPersonModal = () => {
  const modals = useModals();

  const form = useForm<UserWithoutId>({
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
  });

  return new Promise<Omit<User, 'id'>>((resolve) => {
    modals.push({
      title: 'Create New User',
      body: () => {
        return <div class="w-full h-full p-4">
          <Form hook={form}/>
        </div> 
      },
      onClose: () => {
        resolve(form.state.get());
      } 
    })
  })
}

export default () => {
  const toasts = useToasts();
  const query = signal<string>("", { debounce: 60 });
  const db = useFakeDatabase({
    query,
    count: 256,
  });

  const rows = computedSignal((): ITableRow[] => {
    return db.users.get().map((user) => {
      return {
        key: user.id,
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
    const nextUser = await pushAddNewPersonModal();
    db.insertUser(nextUser);
    toasts.push({
      message: 'Success, a new user was created.'
    })
  }

  const table: ITable = {
    rows,
    banner: {
      title: 'People',
      subtitle: computedSignal(() => `There are ${db.totalCount.get()} people in total`),
      actions: () => {
        return <Grid columns="max-content max-content" gap="1rem">
          <Button on={{ click: handleAddNew }} icon={{
          src: async () => import('@/assets/icons/plus.svg'),
          fill: 'currentColor',
          size: '1rem'
          }}>New</Button>
          <InputField
          value={""}
          type="text"
          onChange={(val) => query.set(val + "")}
          placeholder="Search..."
        />
        </Grid>;
      }
    }
  };

  return () => (
      <Table table={table} />
  );
};
