import { Component, LNode, UseInterpolation } from "plicit";
export type IModalConfig = {
    title: string;
    body: LNode | Component;
};
export type IModal = {
    title: string;
    body: LNode | Component;
    animation: UseInterpolation;
};
