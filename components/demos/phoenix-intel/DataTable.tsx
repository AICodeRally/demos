'use client';

import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  hideSm?: boolean;
  render: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyFn: (row: T, index: number) => string;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, keyFn, emptyMessage = 'No data available' }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="pi-empty-state" style={{ padding: '32px 16px' }}>
        <p className="pi-body-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="pi-table-wrap">
      <table className="pi-table" role="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className={col.hideSm ? 'pi-hide-sm' : ''} scope="col">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={keyFn(row, i)}>
              {columns.map(col => (
                <td key={col.key} className={col.hideSm ? 'pi-hide-sm' : ''}>
                  {col.render(row, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
