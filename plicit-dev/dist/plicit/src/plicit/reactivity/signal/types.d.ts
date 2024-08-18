export type Trackable = {
    uid: string;
    trigger: () => any;
    dispose?: () => any;
    onDispose?: () => any;
    tracked: Trackable[];
    trackedEffects: Array<() => any>;
    watchers: Array<(x: any) => any>;
    isEffect?: boolean;
    isComputed?: boolean;
    isTrash?: boolean;
};
