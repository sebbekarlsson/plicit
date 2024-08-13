import { Component, LNode, MaybeRef } from "plicit";

export type ITableColumn = {
  label: string;
  body: Component | LNode;
}

export type ITableRow = {
  columns: ITableColumn[];
}

export type ITable = {
  rows: MaybeRef<ITableRow[]>; 
}

export type ITableProps = {
  table: ITable;
}
