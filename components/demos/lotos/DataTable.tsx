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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={`text-xs uppercase tracking-wider font-semibold px-4 py-3${sortable && col.sortFn ? ' cursor-pointer hover:bg-gray-50 select-none' : ''}`}
                style={{ color: '#78716C', borderBottom: '2px solid #E7E5E4', width: col.width, textAlign: col.align ?? 'left' }}
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
              className={`border-b${onRowClick ? ' cursor-pointer hover:bg-slate-50 transition-colors' : ''}`}
              style={{ borderColor: '#F5F5F4' }}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm"
                  style={{ color: '#57534E', fontSize: '14px', textAlign: col.align ?? 'left' }}
                >
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm" style={{ color: '#A8A29E' }}>
                No data to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
