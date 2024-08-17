import { Component, LNode } from "../../../../plicit/src";
import { UseInterpolation } from "../../hooks/useInterpolation";
export type IModalConfig = {
    title: string;
    body: LNode | Component;
};
export type IModal = {
    title: string;
    body: LNode | Component;
    animation: UseInterpolation;
};
