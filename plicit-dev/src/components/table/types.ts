import { Component, LNode, MaybeRef, MaybeSignal, Signal } from "plicit";

export type ITableColumn = {
  label: string;
  body: Component | LNode;
}

export type ITableRow = {
  columns: ITableColumn[];
}

export type ITable = {
  rows: Signal<ITableRow[]>; 
}

export type ITableProps = {
  table: ITable;
}
