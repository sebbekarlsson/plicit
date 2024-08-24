import { Component, computedSignal, CSSProperties, onMounted, pget, unique, useInterpolation } from "plicit";
import { ITableBanner, ITableProps, ITableRow } from "./types";
import { Grid } from "plicit-dev/src/routes/components/grid";

const TableRow: Component<{ row: ITableRow; head?: boolean }> = (props) => {

  const interp = useInterpolation({
    initial: 0,
    duration: 1.0
  });

  onMounted(() => {
    console.log('mounted!');
    interp.run({
      from: 0.0,
      to: 1.0
    });
  })
  
  return (
    <tr
      key={props.key}
      class={
        "transition-colors" +
        (!props.head ? " hover:bg-primary-50" : " bg-gray-100")
      }
      style={computedSignal(():CSSProperties => {
        return {
          opacity: (interp.value.get() * 100) + '%' 
        }
      })}
    >
      {props.row.columns.map((col) => {
        return (
          <td
            tag={props.head ? "th" : "td"}
            class={["border-b border-gray-300 px-4", props.head ? "font-normal text-gray-900" : "font-normal text-sm text-gray-700"]}
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

  const Banner: Component<{ banner: ITableBanner }> = (props) => {
    return (
      <Grid
        class="flex-none p-4 w-full"
        columns={props.banner.actions ? "1fr max-content" : undefined}
        alignItems="center"
        justifyContent="space-between"
      >
        {props.banner.title && props.banner.subtitle && (
          <div>
            <div class="text-600 text-lg font-semibold">
              {computedSignal(() => pget(props.banner.title))}
            </div>
            <div class="text-gray-400 font-medium">
              {computedSignal(() => pget(props.banner.subtitle))}
            </div>
          </div>
        )}
        {props.banner.actions && <div>{props.banner.actions}</div>}
        {props.banner.body && <div class="mt-4">{props.banner.body}</div>}
      </Grid>
    );
  };

  return (
    <div class="w-full h-full flex-col overflow-hidden rounded-lg border border-gray-200 flex flex-col">
      {props.table.banner && <Banner banner={props.table.banner} />}
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
              {props.table.rows.get().map((row, i) => {
                return <TableRow row={row} key={row.key || `${i}`} />;
              })}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};
