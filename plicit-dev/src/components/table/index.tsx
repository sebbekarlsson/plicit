import { Component, computed, unique, unref } from "plicit";
import { ITableProps, ITableRow } from "./types";

const TableRow: Component<{ row: ITableRow, head?: boolean }> = (props) => {
  return <tr>
    {
      props.row.columns.map((col) => {
        return <td tag={props.head ? 'th' : 'td'} class="h-[3rem] border-b border-gray-300" style={{ borderCollapse: 'separate', zIndex: '2' }}>{col.body}</td>
      })
    }
  </tr>
}

export const Table: Component<ITableProps> = (props) => {
  const rows = computed(() => unref(props.table.rows), [() => props.table.rows]);
  const labels = computed(() => unique(rows.value.map(row => row.columns.map(col => col.label)).flat()), [rows])

  const headRows = computed((): ITableRow[] => {
    return [
      {
        columns: labels.value.map((label) => ({
          label: label,
          body: () => <span>{label}</span>
        }))
      }
    ]
  } , [labels])
  
  return <div style={{
    maxHeight: '100%',
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <table class="w-full" style={{
      textAlign: 'left',
      borderCollapse: 'separate',
      borderSpacing: '0'
    }}>
      <thead class="sticky top-0 left-0 bg-white">
        {headRows.value.map((row) => {
          return <TableRow head row={row}/>
        })}
      </thead>
      { () => <tbody deps={[rows]}>
        {
          rows.value.map((row) => {
            return <TableRow row={row}/>
          })
        }
      </tbody>}
    </table>
  </div>;
}
