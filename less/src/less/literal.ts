import { isRef } from "./proxy";

export function literal(strings: TemplateStringsArray, ...args: any[]) {

  return String.raw({ raw: strings }, ...args.map(arg => {
    if (isRef(arg)) {
      return arg.value;
    }
    return arg;
  }));
}
