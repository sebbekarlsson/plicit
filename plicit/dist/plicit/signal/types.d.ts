export type Trackable = {
    uid: string;
    trigger: () => any;
    dependants: Trackable[];
    tracked: Trackable[];
    watchers: Array<() => any>;
    lastSet: number;
    lastGet: number;
    isEffect?: boolean;
    isComputed?: boolean;
};
