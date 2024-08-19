import { IRoute, IRouter, IRouterConfig, RouterNavigationAction } from "../types";
export declare const createRouter: (props: IRouterConfig) => import("plicit").Signal<IRouter>;
export declare const useRouter: () => {
    router: import("plicit").Signal<IRouter>;
    push: (navig: RouterNavigationAction | string) => void;
    back: () => void;
};
export type RouterMatch = {
    route: IRoute | null;
    parent: IRoute | null;
};
export declare const useRoute: () => {
    current: import("plicit").Signal<IRoute>;
    match: import("plicit").Signal<RouterMatch>;
};
