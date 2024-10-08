export type PlicitEvent<T = any, K extends string = string, Target = any> = {
  type: K;
  payload: T;
  target?: Target;
};

export type EventSubscriber<
  T = any,
  K extends string = string,
  Target = any,
> = (event: PlicitEvent<T, K, Target>) => any;

export class EventEmitter<T = any, K extends string = string, Target = any> {
  slots: Record<string, Array<EventSubscriber<T, K, Target>>> = {};

  emit(event: PlicitEvent<T, K, Target>) {
    if (!this.slots[event.type] || this.slots[event.type].length <= 0) return;

    this.slots[event.type].forEach((sub) => {
      sub(event);
    });
  }

  addEventListener(evtype: K, sub: EventSubscriber<T, K, Target>): () => void {
    this.slots[evtype] ??= [];
    if (!this.slots[evtype].includes(sub)) {
      this.slots[evtype].push(sub);
    }

    return () => {
      this.slots[evtype] = this.slots[evtype].filter((it) => it !== sub);
    };
  }

  clear() {
    this.slots = {};
  }
}
