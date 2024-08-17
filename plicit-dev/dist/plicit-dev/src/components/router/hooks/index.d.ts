import { IRoute, IRouter, IRouterConfig, RouterNavigationAction } from "../types";
export declare const createRouter: (props: IRouterConfig) => import("plicit").RawRef<IRouter>;
export declare const useRouter: () => {
    router: import("plicit").RawRef<IRouter>;
    push: (navig: RouterNavigationAction | string) => void;
    back: () => void;
};
export type RouterMatch = {
    route: IRoute | null;
    parent: IRoute | null;
};
export declare const useRoute: () => {
    current: import("plicit").Ref<IRoute>;
    match: import("plicit").Ref<RouterMatch>;
};
