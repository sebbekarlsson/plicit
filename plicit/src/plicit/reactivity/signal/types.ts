export type Trackable = {
  uid: string;
  trigger: () => any;
  dispose?: () => any;
  onDispose?: () => any;
  dependants: Trackable[];
  tracked: Trackable[];
  watchers: Array<() => any>;
  lastSet: number;
  lastGet: number;
  isEffect?: boolean;
  isComputed?: boolean;
}
