import { Component, computed, unique, unref } from "plicit";
import { ITableProps, ITableRow } from "./types";

const TableRow: Component<{ row: ITableRow, head?: boolean }> = (props) => {
  return <tr class={"h-[3rem]" + ((!props.head) ? " hover:bg-amaranth-200" : "")} style={{
    height: '3rem',
    maxHeight: '3rem',
    minHeight: '3rem'
  }}>
    {
      props.row.columns.map((col) => {
        return <td tag={props.head ? 'th' : 'td'} class="h-[3rem] border-b border-gray-300" style={{ borderCollapse: 'separate', zIndex: '2', height: '3rem', maxHeight: '3rem', minHeight: '3rem' }}>{col.body}</td>
      })
    }
  </tr>
}

export const Table: Component<ITableProps> = (props) => {
  const rows = computed(() => unref(props.table.rows), [() => props.table.rows], { deep: false });
  const labels = computed(() => unique(rows.value.slice(0, 4).map(row => row.columns.map(col => col.label)).flat()), [rows], { deep: false })

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
  
  return <div class="select-none" style={{
    maxHeight: '100%',
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  }}>
    <table class="w-full" style={{
      textAlign: 'left',
      borderCollapse: 'separate',
      borderSpacing: '0'
    }}>
      {() => <thead class="sticky top-0 left-0 bg-white">
        {headRows.value.map((row) => {
          return <TableRow head row={row}/>
        })}
      </thead>}
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
