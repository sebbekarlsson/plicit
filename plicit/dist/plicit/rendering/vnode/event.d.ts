import { VNode } from ".";
import { EventEmitter, PlicitEvent } from "../../event";
export declare enum EVNodeEvent {
    CREATED = "CREATED",
    CHILD_INSERT = "CHILD_INSERT",
    CHILD_REMOVE = "CHILD_REMOVE",
    CHILD_PATCH = "CHILD_PATCH",
    PROP_UPDATE = "PROP_UPDATE"
}
export type VNodeEventCreatedPayload = {};
export type VNodeEventChildInsertPayload = {
    child: VNode;
};
export type VNodeEventChildPatchPayload = {
    child: VNode;
};
export type VNodeEventChildRemovePayload = {
    child: VNode;
};
export type VNodeEventPropUpdatePayload = {
    key: string;
    value: any;
};
export type VNodeEventCreated = PlicitEvent<{}, EVNodeEvent.CREATED, VNode>;
export type VNodeEventChildInsert = PlicitEvent<VNodeEventChildInsertPayload, EVNodeEvent.CHILD_INSERT, VNode>;
export type VNodeEventChildPatch = PlicitEvent<VNodeEventChildPatchPayload, EVNodeEvent.CHILD_PATCH, VNode>;
export type VNodeEventChildRemove = PlicitEvent<VNodeEventChildRemovePayload, EVNodeEvent.CHILD_REMOVE, VNode>;
export type VNodeEventPropUpdate = PlicitEvent<VNodeEventPropUpdatePayload, EVNodeEvent.PROP_UPDATE, VNode>;
export type VNodeEvent = VNodeEventCreated | VNodeEventChildInsert | VNodeEventChildPatch | VNodeEventChildRemove | VNodeEventPropUpdate;
export type VNodeEventMap = {
    [EVNodeEvent.CREATED]: VNodeEventCreated;
    [EVNodeEvent.CHILD_INSERT]: VNodeEventChildInsert;
    [EVNodeEvent.CHILD_PATCH]: VNodeEventChildPatch;
    [EVNodeEvent.CHILD_REMOVE]: VNodeEventChildRemove;
    [EVNodeEvent.PROP_UPDATE]: VNodeEventPropUpdate;
};
export type VNodeEventEmitter = EventEmitter<VNodeEvent['payload'], EVNodeEvent, VNode>;
