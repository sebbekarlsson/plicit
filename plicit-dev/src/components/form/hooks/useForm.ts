import {
  Component,
  computedSignal,
  CSSProperties,
  Dict,
  isSignal,
  MaybeSignal,
  omit,
  pget,
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
  $label?: string;
  $class?: string;
  $placeholder?: string;
  $style?: CSSProperties;
  $value?: T;
  $component?: FormFieldComponent;
};

export const isFormFieldDefinition = <T extends FormPrimitive = FormPrimitive>(
  x: any,
): x is IFormFieldDefinition<T> => {
  if (typeof x === "undefined" || x === null) return false;
  if (typeof x !== "object") return false;
  return !!(`$value` in x);
};

export type IFormField<T extends FormPrimitive = FormPrimitive> = WithSignals<IFormFieldDefinition<T>>;

export const isFormField = <T extends FormPrimitive = FormPrimitive>(x: any): x is IFormField<T> => {
  if (typeof x === "undefined" || x === null) return false;
  if (typeof x !== "object") return false;
  if (isPrimitive(x)) return false;
  return !!(`$value` in x);
}

export type IFormFieldsSubGroup<T extends FormPrimitive = FormPrimitive> = Omit<IFormFieldDefinition<T>, '$value'> & {
  $fields: string[];
}

export type IFormFieldsGroup<T extends FormPrimitive = FormPrimitive> = Omit<IFormFieldDefinition<T>, '$value'> & {
  $groups?: Array<IFormFieldsSubGroup<T>>
}

export const isFormFieldsSubGroup = <T extends FormPrimitive = FormPrimitive>(x: any): x is IFormFieldsSubGroup<T> => {
  if (typeof x === "undefined" || x === null) return false;
  if (typeof x !== "object") return false;
  if (isPrimitive(x)) return false;
  if (isFormField(x)) return false;
  return Array.isArray(x.$fields);
}

export const isFormFieldsGroup = <T extends FormPrimitive = FormPrimitive>(x: any): x is IFormFieldsGroup<T> => {
  if (typeof x === "undefined" || x === null) return false;
  if (typeof x !== "object") return false;
  if (isPrimitive(x)) return false;
  if (isFormField(x)) return false;
  return !!(`$label` in x || (`$groups` in x && Array.isArray(x.$groups)));
}

export type IForm<T extends Dict = Dict> = IFormFieldsGroup & {
  [key in keyof T]: T[key] extends FormPrimitive
    ? IFormFieldDefinition<T[key]>
    : IForm<T[key]>;
};

export type UseFormProps<T extends Dict = Dict> = {
  schema: IForm<T>;
  components?: FormComponentMap;
};

type WithSignals<T extends Dict> = {
  [Prop in keyof T]: Prop extends '$groups' ? T[Prop] : T[Prop] extends Component
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

export type IFormFieldMap<T extends Dict = Dict> = WithSignals<Omit<IForm<Omit<T, '$groups'>>, '$groups'> & {
  $groups?: MaybeSignal<IFormField[]>
}>;

export const isFormFieldMap = <T extends Dict = Dict>(x: any): x is IFormFieldMap<T> => {
  if (typeof x === 'undefined' || x === null) return false;
  return typeof x === "object" && !isSignal(x) && !isFormFieldsSubGroup(x) && !Array.isArray(x) && typeof x !== 'function';
}


const cast = <T = any>(value: T, fieldType?: string | null | undefined) => {
  switch (fieldType) {
    case 'text':
    case 'string': return (value + '');
    case 'number': return Number(value ?? 0);
    default: return value;
  }
}

const createState = <T extends Dict>(schema: IFormFieldMap<T>): T => {
  const groups = pget(schema.$groups) || [];

  
  return Object.assign(
    {},
    ...Object.entries(schema).map(([key, value]) => {
      const group = groups.find((g) => !!(key in g));
      const groupField = group ? group[key] : null;

      const ftype = (isFormFieldDefinition(value) ? value.$type : undefined) || 'string';
      if  (groupField) {
        return createState({[key]: groupField});
      }
      
      if (key.startsWith("$")) return {};

      
      return {
        [key]: isFormFieldDefinition(value)
          ? isSignal(value.$value)
            ? cast(value.$value.get(), pget(value.$type) || ftype)
            : cast(value.$value, pget(value.$type) || ftype)
          : typeof value === "object"
            ? createState(value)
            : value,
      };
    }),
  );
};


const createFields = <T extends Dict>(
  schema: IForm<T> | IFormFieldDefinition<FormPrimitive> | IFormFieldsGroup<FormPrimitive>,
  props: {
    watchFun?: FieldWatchCallback;
    components: FormComponentMap;
  },
): IFormFieldMap<T> => {
  const create = (
    schema: IForm<T> | IFormFieldDefinition<FormPrimitive> | IFormFieldsGroup<FormPrimitive>,
    path: string[] = [],
  ): IFormFieldMap<T> => {

    
    const groupDefs = (isFormFieldsGroup(schema) && !!schema.$groups) ? (schema.$groups || []) : [];

    const groups = groupDefs.map((def) => {
      return createFields(Object.assign(omit(def, ['$fields']), ...def.$fields.map((key) => {
        return {[key]: schema[key]}
      })), props); 
    });

    
    return Object.assign(
      { $groups: groups } as IFormFieldMap<T>,
      ...Object.entries(schema).map(([key, value]) => {
        if (key === '$groups') return {};
        
        const next = (isPrimitive(value) || key.startsWith('$'))
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
            $component: props.components[(isSignal(next.$type) ? (next.$type.get() + '') : null) || 'string']
          } : next,
        };
      }),
    );
  };
  return create(schema);
};

export type UseForm<T extends Dict = Dict> = {
  fields: IFormFieldMap<T>;
  state: Signal<T>;
}

export const useForm = <T extends Dict = Dict>(props: UseFormProps<T>): UseForm<T> => {
  const fields = createFields<T>(props.schema, {
    watchFun: (_schema, _value, _path) => {
      // field changed
    },
    components: props.components || {},
  });

  const state = computedSignal<T>(() => createState(fields));

  return { fields, state };
};
