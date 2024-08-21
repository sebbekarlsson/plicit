import {
  Component,
  computedSignal,
  Dict,
  isSignal,
  signal,
  Signal,
  watchSignal,
} from "plicit";

type FormPrimitive = string | number | undefined | null;

const isPrimitive = (x: any): x is FormPrimitive => {
  return (
    typeof x === "string" ||
    typeof x === "number" ||
    typeof x === "undefined" ||
    x === null
  );
};

export type FormFieldComponent<T extends Dict = Dict> = Component<
  Omit<T, "value"> & { value: Signal<FormPrimitive> }
>;

export type FormComponentMap = Record<string, FormFieldComponent>;

export type IFormFieldDefinition<T extends FormPrimitive> = {
  $type?: string;
  $value?: T;
  $component?: FormFieldComponent;
};

const isFormFieldDefinition = <T extends FormPrimitive = FormPrimitive>(
  x: any,
): x is IFormFieldDefinition<T> => {
  if (typeof x === "undefined" || x === null) return false;
  if (typeof x !== "object") return false;
  return !!(`$value` in x);
};

export type IForm<T extends Dict = Dict> = {
  [key in keyof T]: T[key] extends FormPrimitive
    ? IFormFieldDefinition<T[key]>
    : IForm<T[key]>;
};

export type UseFormProps<T extends Dict = Dict> = {
  schema: IForm<T>;
  components?: FormComponentMap;
};

type WithSignals<T extends Dict> = {
  [Prop in keyof T]: T[Prop] extends Component
    ? T[Prop]
    : T[Prop] extends FormPrimitive
      ? Signal<T[Prop]>
      : T[Prop] extends Dict
        ? WithSignals<T[Prop]>
        : T[Prop];
};

type FieldWatchCallback = <T extends FormPrimitive = FormPrimitive>(
  schema: IForm,
  value: T,
  path: string[],
) => any;

const createState = <T extends Dict>(schema: WithSignals<IForm<T>>): T => {
  return Object.assign(
    {},
    ...Object.entries(schema).map(([key, value]) => {
      if (key.startsWith("$")) return {};

      return {
        [key]: isFormFieldDefinition(value)
          ? isSignal(value.$value)
            ? value.$value.get()
            : value.$value
          : typeof value === "object"
            ? createState(value)
            : value,
      };
    }),
  );
};

const createFields = <T extends Dict>(
  schema: IForm<T>,
  props: {
    watchFun?: FieldWatchCallback;
    components: FormComponentMap;
  },
): WithSignals<IForm<T>> => {
  const create = (
    schema: IForm<T>,
    path: string[] = [],
  ): WithSignals<IForm<T>> => {
    return Object.assign(
      {} as WithSignals<IForm<T>>,
      ...Object.entries(schema).map(([key, value]) => {
        const next = isPrimitive(value)
          ? signal(value)
          : create(
              value,
              [...path, key],
            );
        if (isSignal(next) && props.watchFun) {
          watchSignal(
            next,
            (val) => {
              props.watchFun(schema, val, path);
            },
            { immediate: true },
          );
        }
        return {
          [key]: isFormFieldDefinition(next) ? {
            ...next,
            $component: props.components[(isSignal(next.$type) ? next.$type.get() : null) || 'string']
          } :  next,
        };
      }),
    );
  };
  return create(schema);
};

export const useForm = <T extends Dict = Dict>(props: UseFormProps<T>) => {
  const fields = createFields<T>(props.schema, {
    watchFun: (_schema, _value, _path) => {
      // field changed
    },
    components: props.components || {},
  });

  const state = computedSignal<T>(() => createState(fields));

  return { fields, state };
};
