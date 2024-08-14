import { EffectSubscriber } from "./proxy";
import { ReactiveDep } from "./types";
export declare const deepSubscribe: (dep: ReactiveDep, sub: EffectSubscriber, maxDepth?: number) => (() => void)[];
