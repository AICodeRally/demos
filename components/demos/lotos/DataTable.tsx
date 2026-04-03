'use client';

import { useState, useMemo } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortFn?: (a: T, b: T) => number;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  sortable?: boolean;
  keyFn: (row: T) => string;
}

export function DataTable<T>({ columns, data, onRowClick, sortable = true, keyFn }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find(c => c.key === sortKey);
    if (!col?.sortFn) return data;
    const sorted = [...data].sort(col.sortFn);
    return sortDir === 'desc' ? sorted.reverse() : sorted;
  }, [data, sortKey, sortDir, columns]);

  function handleHeaderClick(col: Column<T>) {
    if (!sortable || !col.sortFn) return;
    if (sortKey === col.key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  }

  return (
    <div className="overflow-x-auto lot-animate-in">
      <table className="lot-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={sortable && col.sortFn ? 'sortable' : ''}
                style={{ width: col.width, textAlign: col.align ?? 'left' }}
                onClick={() => handleHeaderClick(col)}
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(row => (
            <tr
              key={keyFn(row)}
              className={onRowClick ? 'cursor-pointer' : ''}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  style={{ textAlign: col.align ?? 'left' }}
                >
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center" style={{ color: 'var(--lot-text-faint)' }}>
                No data to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
