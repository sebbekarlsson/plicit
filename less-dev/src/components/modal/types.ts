import { Component, LNode } from "../../../../less/src";
import { UseInterpolation } from "../../hooks/useInterpolation";




export type IModalConfig = {
  title: string;
  body: LNode | Component;
}

export type IModal = {
  title: string;
  body: LNode | Component;
  animation: UseInterpolation;
}
