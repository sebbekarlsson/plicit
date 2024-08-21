import { ElementClass } from "./types";
export type CSSProperties = Partial<CSSStyleDeclaration>;
export declare const cssPropsToString: (props: CSSProperties) => string;
export declare const mergeClasses: (clazz: ElementClass) => string;
