import { Component, LNode } from "../../../../plicit/src";
import { UseInterpolationSignal } from "../../hooks/useInterpolationSignal";
export type IModalConfig = {
    title: string;
    body: LNode | Component;
};
export type IModal = {
    title: string;
    body: LNode | Component;
    animation: UseInterpolationSignal;
};
