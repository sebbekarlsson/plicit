export type PlicitEvent<T = any, K extends string = string, Target = any> = {
    type: K;
    payload: T;
    target?: Target;
};
export type EventSubscriber<T = any, K extends string = string, Target = any> = (event: PlicitEvent<T, K, Target>) => any;
export declare class EventEmitter<T = any, K extends string = string, Target = any> {
    slots: Record<string, Array<EventSubscriber<T, K, Target>>>;
    emit(event: PlicitEvent<T, K, Target>): void;
    addEventListener(evtype: K, sub: EventSubscriber<T, K, Target>): () => void;
    clear(): void;
}
