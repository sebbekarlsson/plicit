import { Component, computedSignal, MaybeSignal, pget, pgetDeep } from "plicit";
import { IFormProps } from "./types";
import {
  IFormField,
  IFormFieldMap,
  isFormField,
  isFormFieldMap,
} from "./hooks/useForm";

const getFieldProps = (field: IFormField) => {
  return {
    type: field.$type,
    value: field.$value,
    placeholder: field.$placeholder,
  };
};

export const Form: Component<IFormProps> = (props) => {
  const renderFields = (fields: IFormFieldMap) => {
    const label = fields.$label;
    const clazz = fields.$class;
    const style = fields.$style;
    const groups = pget(fields.$groups) || [];
    const groupedKeys = groups.map((g) => Object.keys(g)).flat();

    return (
      <div
        class={[clazz, "space-y-4 select-none"]}
        style={computedSignal(() => {
          const x = pget(fields.$hidden);
          return {
            ...(x
              ? {
                  display: "none",
                }
              : {}),
          };
        })}
      >
        {label && <div class="text-gray-600 font-medium">{label}</div>}
        <div class={style ? "" : "space-y-4"} style={style}>
          {groups.map((g) => renderFields(g))}
          {Object.entries(fields)
            .filter(
              ([key]) =>
                key.startsWith("$") === false && !groupedKeys.includes(key),
            )
            .map(([key, field]) => {
              if (isFormField(field)) {
                const Comp = field.$component;
                if (!Comp) return <div>Error: missing component for {key}</div>;
                return (
                  <div class="flex gap-2 justify-center flex-col">
                    {field.$label && (
                      <div class="text-gray-600 font-medium">
                        {field.$label}
                      </div>
                    )}
                    <Comp {...getFieldProps(field)} />
                  </div>
                );
              } else if (isFormFieldMap(field)) {
                return renderFields(field);
              } else {
                return (
                  <div class="bg-red-100 text-red-500 p-4">
                    Invalid field of type '{typeof field}'
                  </div>
                );
              }
            })}
        </div>
      </div>
    );
  };

  return <div class="space-y-4">{renderFields(props.hook.fields)}</div>;
};
