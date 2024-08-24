import { Component, LNode, UseInterpolation } from "plicit";

export type IModalCallbacks = {
  onClose?: () => any;
}

export type IModalConfig = IModalCallbacks & {
  title: string;
  body: LNode | Component;
};

export type IModal = IModalCallbacks & {
  title: string;
  body: LNode | Component;
  animation: UseInterpolation;
};
