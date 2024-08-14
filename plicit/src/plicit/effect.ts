import { deepSubscribe } from "./subscribe";
import { ReactiveDep } from "./types";

type EffectFun<T = any> = () => T;


export const effect = <T = any>(
  fun: EffectFun<T>,
  deps: ReactiveDep[] = [],
) => {
  deps.forEach((dep) => {
    deepSubscribe(dep, {
      onSet: () => {
        fun();
      } 
    })
  });
};
