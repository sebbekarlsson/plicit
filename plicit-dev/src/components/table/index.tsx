import { Component, computedSignal, unique } from "plicit";
import { ITableProps, ITableRow } from "./types";

const TableRow: Component<{ row: ITableRow; head?: boolean }> = (props) => {
  return (
    <tr
      class={
        "transition-colors" +
        (!props.head ? " hover:bg-primary-50" : " bg-gray-100")
      }
    >
      {props.row.columns.map((col) => {
        return (
          <td
            tag={props.head ? "th" : "td"}
            class="border-b border-gray-300 px-2"
            style={{
              borderCollapse: "separate",
              zIndex: "2",
              height: "4rem",
              minHeight: "4rem",
            }}
          >
            {col.body}
          </td>
        );
      })}
    </tr>
  );
};

export const Table: Component<ITableProps> = (props) => {
  const labels = computedSignal(() =>
    unique(
      props.table.rows
        .get()
        .slice(0, 4)
        .map((row) => row.columns.map((col) => col.label))
        .flat(),
    ),
  );

  const headRows = computedSignal((): ITableRow[] => {
    return [
      {
        columns: labels.get().map((label) => ({
          label: label,
          body: () => <span>{label}</span>,
        })),
      },
    ];
  });

  return (
    <div
      class="select-none"
      style={{
        maxHeight: "100%",
        height: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        flex: "1",
      }}
    >
      <table
        class="w-full"
        style={{
          textAlign: "left",
          borderCollapse: "separate",
          borderSpacing: "0",
        }}
      >
        {computedSignal(() => (
          <thead class="sticky top-0 left-0 bg-white">
            {headRows.get().map((row) => {
              return <TableRow head row={row} />;
            })}
          </thead>
        ))}
        {computedSignal(() => (
          <tbody>
            {props.table.rows.get().map((row) => {
              return <TableRow row={row} />;
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
};
