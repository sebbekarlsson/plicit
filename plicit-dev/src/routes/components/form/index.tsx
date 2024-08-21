import { watchSignal } from "plicit";
import { useForm } from "../../../components/form/hooks/useForm";
import { InputField } from "../../../components/input-field";
import { PageContent } from "../../../layouts/page-content";

type Person = {
  firstname: string;
  lastname: string;
  age: number;
};

export default () => {
  const form = useForm<Person>({
    schema: {
      firstname: {
        $type: "string",
        $value: "",
      },
      lastname: {
        $type: "string",
        $value: "",
      },
      age: {
        $type: "number",
        $value: 0,
      },
    },
    components: {
      string: (props) => <InputField type="text" value={props.value}/>,
      number: (props) => <InputField type="number" value={props.value}/>
    }
  });


  watchSignal(form.state, (it) => {
    console.log(it);
  })

  return (
    <PageContent>
      <div class="space-y-4">
        {Object.entries(form.fields).map(([key, field]) => {
          const Comp = field.$component;
          if (!Comp) return <div>Error: missing component for {key}</div>;
          return <Comp value={field.$value}/>
        })}
      </div>
    </PageContent>
  );
};
