import { computedSignal } from "plicit";
import {
  useForm,
} from "../../../components/form/hooks/useForm";
import { InputField } from "../../../components/input-field";
import { CodeBlock } from "../../../components/code-block";
import { Form } from "../../../components/form";

type PersonForm = {
  person: {
    firstname: string;
    lastname: string;
    age: number;
  };

  dog: {
    name: string;
    age: number;
  };
};

export default () => {
  const form = useForm<PersonForm>({
    schema: {
      person: { 
        $groups: [
          {
            $style: {
              width: '100%',
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
              gap: '1rem'
            },
            $fields: ['firstname', 'lastname']
          },
          {
            $fields: ['age']
          }
        ],
        firstname: {
          $label: "First Name",
          $type: "text",
          $value: "",
          $placeholder: 'John'
        },
        lastname: {
          $label: "Last Name",
          $type: "text",
          $value: "",
          $placeholder: 'Doe'
        },
        age: {
          $label: "Age",
          $type: "number",
          $value: undefined,
        },
      },
      dog: {
        $label: "Dog",
        name: {
          $label: "Name",
          $type: "text",
          $value: "",
          $placeholder: 'Boo'
        },
        age: {
          $label: "Age",
          $type: "number",
          $value: undefined,
        },
      },
    },
    components: {
      text: (props) => {
        console.log({props})
        return <InputField {...props} />;
      },
      number: (props) => <InputField {...props} />,
    },
  });

  const stateString = computedSignal(() =>
    JSON.stringify(form.state.get(), undefined, 2),
  );

  return (
    <div class="space-y-4 w-full h-full">
      <Form hook={form}/>
      <CodeBlock title="State" value={stateString} />
    </div>
  );
};
