//export type CSSProperties = {};

export type CSSProperties = Partial<CSSStyleDeclaration>;

const kebab = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export const cssPropsToString = (props: CSSProperties): string => {
  return Object.entries(props).map(([key, value]) => {
    return `${kebab(key)}: ${value}`;
  }).join(';')
}
