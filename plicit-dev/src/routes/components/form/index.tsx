import {
  asyncSignal,
  computedSignal,
  GSignal,
  isSignal,
  pget,
  pset,
  signal,
  sleep,
  watchSignal,
  withSignal,
} from "plicit";
import { useForm } from "../../../components/form/hooks/useForm";
import { InputField } from "../../../components/input-field";
import { CodeBlock } from "../../../components/code-block";
import { Form } from "../../../components/form";
import { Checkbox } from "plicit-dev/src/components/checkbox";

type PersonForm = {
  person: {
    firstname: string;
    lastname: string;
    age: number;
    isAdmin: boolean;
    hasPet: boolean;
  };
  dog: {
    name: string;
    age: number;
  };
};

export default () => {
  const form = useForm<PersonForm>({
    schema: () => {
      return {
        person: {
          $groups: [
            {
              $style: {
                width: "100%",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                gap: "1rem",
              },
              $fields: ["firstname", "lastname"],
            },
            {
              $style: {
                width: "100%",
                display: "grid",
                gridTemplateColumns: "1fr max-content max-content",
                alignItems: "center",
                gap: "1rem",
              },
              $fields: ["age", "isAdmin", "hasPet"],
            },
          ],
          firstname: {
            $label: "First Name",
            $type: "text",
            $value: "",
            $placeholder: "John",
          },
          lastname: {
            $label: "Last Name",
            $type: "text",
            $value: "",
            $placeholder: "Doe",
          },
          age: {
            $label: "Age",
            $type: "number",
            $value: undefined,
          },
          isAdmin: {
            $label: "Admin",
            $type: "boolean",
            $value: false,
          },
          hasPet: {
            $label: "Has Pet",
            $type: "boolean",
            $value: false,
          },
        },
        dog: {
          $label: "Dog",
          $hidden: asyncSignal<boolean>(
            async (sig) => {
              await sleep(1);
              const hasPet = withSignal(sig, () => {
                return pget(form.fields.person.hasPet.$value);
              });

              return hasPet === false;
            },
            { isComputed: true },
          ),
          name: {
            $label: "Name",
            $type: "text",
            $value: "",
            $placeholder: "Boo",
          },
          age: {
            $label: "Age",
            $type: "number",
            $value: undefined,
          },
        },
      };
    },
    components: {
      text: (props) => {
        return <InputField {...props} />;
      },
      number: (props) => <InputField {...props} />,
      boolean: (props) => <Checkbox {...props} />,
    },
  });

  const stateString = computedSignal(() =>
    JSON.stringify(form.state.get(), undefined, 2),
  );

  // if (isSignal(form.fields.person.hasPet.$value)) {
  //   watchSignal(form.fields.person.hasPet.$value, (x) => {
  //     pset(form.fields.dog.$hidden, x === false);
  //   }, { immediate: true })
  // } else {
  //   console.log('no bad!')
  // }

  return (
    <div class="space-y-4 w-full h-full">
      <Form hook={form} />
      <CodeBlock title="State" value={stateString} />
    </div>
  );
};
