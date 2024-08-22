import { Vector } from "tsmathutil";
import { LNodeRef } from "../lnode";
import { Signal } from "../reactivity";
export declare const useSVGPointCheck: (elRef: LNodeRef, pointToCheck: Signal<Vector>, callback?: (value: boolean) => void) => Signal<boolean>;
