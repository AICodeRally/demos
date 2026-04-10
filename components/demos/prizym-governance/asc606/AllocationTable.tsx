'use client';

import React from 'react';
import { Info as InfoCircledIcon } from 'lucide-react';

export interface AllocationRow {
  label: string;
  ssp: number;
  allocated: number;
  percentage: number;
}

interface AllocationTableProps {
  rows: AllocationRow[];
  totalFixed: number;
  totalSSP: number;
  marketplaceFee: number;
}

function formatUSD(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function AllocationTable({ rows, totalFixed, totalSSP, marketplaceFee }: AllocationTableProps) {
  const totalAllocated = rows.reduce((sum, r) => sum + r.allocated, 0);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-lg border border-[color:var(--color-border)] overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[color:var(--color-surface-alt)]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider">
                Performance Obligation
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider">
                SSP
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider">
                % of Total
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider">
                Allocated Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]">
            {rows.map((row, index) => (
              <tr
                key={row.label}
                className={`${
                  index % 2 === 0
                    ? 'bg-[color:var(--color-surface)]'
                    : 'bg-[color:var(--color-surface-alt)]'
                } hover:bg-[color:var(--color-info-bg)] transition-colors`}
              >
                <td className="px-4 py-3 text-sm font-medium text-[color:var(--color-foreground)]">
                  {row.label}
                </td>
                <td className="px-4 py-3 text-sm text-right text-[color:var(--color-foreground)]">
                  {formatUSD(row.ssp)}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className="inline-flex items-center justify-end gap-1">
                    <span className="text-[color:var(--color-foreground)]">
                      {formatPercent(row.percentage)}
                    </span>
                    {/* Percentage bar */}
                    <span
                      className="inline-block h-1.5 rounded-full bg-[color:var(--color-primary)] opacity-60 ml-1"
                      style={{ width: `${Math.max(4, row.percentage)}px` }}
                    />
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-[color:var(--color-primary)]">
                  {formatUSD(row.allocated)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[color:var(--color-surface-alt)] border-t-2 border-[color:var(--color-border)]">
              <td className="px-4 py-3 text-sm font-bold text-[color:var(--color-foreground)]">
                Total Fixed Bundle
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold text-[color:var(--color-foreground)]">
                {formatUSD(totalSSP)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold text-[color:var(--color-foreground)]">
                100.0%
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold text-[color:var(--color-primary)]">
                {formatUSD(totalAllocated)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Discount / Premium callout */}
      {(() => {
        const diff = totalFixed - totalSSP;
        const isDiscount = diff < 0;
        const label = isDiscount ? 'Bundle Discount' : 'Bundle Premium';
        const colorClass = isDiscount
          ? 'bg-[color:var(--color-warning-bg)] border-[color:var(--color-warning-border)] text-[color:var(--color-warning)]'
          : 'bg-[color:var(--color-info-bg)] border-[color:var(--color-info-border)] text-[color:var(--color-info)]';

        return (
          <div className={`flex items-start gap-2 px-3 py-2 rounded-md border text-xs ${colorClass}`}>
            <InfoCircledIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <span className="font-semibold">{label}: </span>
              Transaction price ({formatUSD(totalFixed)}) is{' '}
              {formatUSD(Math.abs(diff))}{' '}
              {isDiscount ? 'below' : 'above'} sum of SSPs ({formatUSD(totalSSP)}).
              Discount allocated proportionally to each PO under ASC 606-10-32-28.
            </span>
          </div>
        );
      })()}

      {/* Marketplace note */}
      {marketplaceFee > 0 && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] text-xs text-[color:var(--color-muted)]">
          <InfoCircledIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[color:var(--color-muted)]" />
          <span>
            <span className="font-semibold text-[color:var(--color-foreground)]">Variable Consideration — Marketplace Fee: </span>
            {formatUSD(marketplaceFee)}/yr estimated. Recognized as earned each period under the
            variable consideration constraint (ASC 606-10-32-11). Not included in fixed bundle allocation.
          </span>
        </div>
      )}
    </div>
  );
}
