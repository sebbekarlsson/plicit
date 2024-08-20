import {
  Component,
} from "./component";
import { LNode } from "./lnode";

export type ComponentHook = (node?: LNode) => any;

export type ComponentScope = {
  onMounted: Array<ComponentHook>;
  onUnmounted: Array<ComponentHook>;
  onBeforeUnmount: Array<ComponentHook>;
  onLoaded: Array<ComponentHook>;
  children: ComponentScope[];
  stack: ComponentScope[];
  stackIndex: number;
  current: ComponentScope | null;
  node?: any;
  component?: Component;
  didMount?: boolean;
  didUnmount?: boolean;
};

export const createComponentScope = (): ComponentScope => {
  return ({
    onMounted: [],
    onUnmounted: [],
    onBeforeUnmount: [],
    onLoaded: [],
    children: [],
    stack: [],
    stackIndex: 0,
    current: null,
  });
};

// @ts-ignore
const oldScope = window.GScope as ComponentScope | undefined;
export const GScope: ComponentScope = oldScope || createComponentScope();
// @ts-ignore
window.GScope = GScope;

export const pushScope = () => {
  if (GScope.current) {
    GScope.stack.push(GScope.current);
  }
  const scope = createComponentScope();
  GScope.current = scope;
  return scope;
};

export const popScope = (scope?: ComponentScope) => {
  GScope.current = GScope.stack.pop() || null;
  return scope;
};

export const withCurrentScope = (fun: (scope: ComponentScope) => any) => {
  const scope = GScope.current || GScope.stack[GScope.stack.length - 1];
  if (!scope) return;

  fun(scope);
};

export const trackCurrentScope = (
) => {
};

export const onMounted = (fun: ComponentHook) => {
  withCurrentScope((scope) => {
    if (!scope.onMounted.includes(fun)) {
      scope.onMounted.push(fun);
    }
  });
};

export const onBeforeUnmount = (fun: ComponentHook) => {
  withCurrentScope((scope) => {
    if (!scope.onBeforeUnmount.includes(fun)) {
      scope.onBeforeUnmount.push(fun);
    }
  });
};

export const onUnmounted = (fun: ComponentHook) => {
  withCurrentScope((scope) => {
    if (!scope.onUnmounted.includes(fun)) {
      scope.onUnmounted.push(fun);
    }
  });
};
