export type Trackable = {
    uid: string;
    trigger: () => any;
    dispose?: () => any;
    onDispose?: () => any;
    tracked: Trackable[];
    trackedEffects: Array<() => any>;
    watchers: Array<() => any>;
    lastSet: number;
    lastGet: number;
    createdAt: number;
    isEffect?: boolean;
    isComputed?: boolean;
    isTrash?: boolean;
};
