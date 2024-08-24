import { Component, LNode, LNodeChild, MaybeSignal, Signal } from "plicit";
export type ITableColumn = {
    label: string;
    body: Component | LNode;
};
export type ITableRow = {
    columns: ITableColumn[];
    key?: string;
};
export type ITableBanner = {
    title?: MaybeSignal<string>;
    subtitle?: MaybeSignal<string>;
    body?: LNodeChild;
    actions?: LNodeChild;
};
export type ITable = {
    rows: Signal<ITableRow[]>;
    banner?: ITableBanner;
};
export type ITableProps = {
    table: ITable;
};
