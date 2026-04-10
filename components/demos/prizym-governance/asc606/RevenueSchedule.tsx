'use client';

import React, { useState } from 'react';
import { ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon } from 'lucide-react';

export interface MonthlyRevenue {
  month: number;
  subscription: number;
  aiCredits: number;
  onboarding: number;
  hardware: number;
  marketplace: number;
  total: number;
}

interface RevenueScheduleProps {
  schedule: MonthlyRevenue[];
  termMonths: number;
}

function formatUSD(value: number): string {
  if (value === 0) return '—';
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function RevenueSchedule({ schedule, termMonths }: RevenueScheduleProps) {
  const [collapsed, setCollapsed] = useState(termMonths > 6);
  const displayRows = collapsed ? schedule.slice(0, 3) : schedule;

  const totals = schedule.reduce(
    (acc, row) => ({
      subscription: acc.subscription + row.subscription,
      aiCredits: acc.aiCredits + row.aiCredits,
      onboarding: acc.onboarding + row.onboarding,
      hardware: acc.hardware + row.hardware,
      marketplace: acc.marketplace + row.marketplace,
      total: acc.total + row.total,
    }),
    { subscription: 0, aiCredits: 0, onboarding: 0, hardware: 0, marketplace: 0, total: 0 }
  );

  return (
    <div className="rounded-lg border border-[color:var(--color-border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[color:var(--color-surface-alt)]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider sticky left-0 bg-[color:var(--color-surface-alt)]">
                Month
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider">
                AI Credits
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider">
                Onboarding
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider">
                Hardware
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider">
                Marketplace
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[color:var(--color-foreground)] uppercase tracking-wider bg-[color:var(--color-info-bg)]">
                Monthly Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]">
            {displayRows.map((row, index) => (
              <tr
                key={row.month}
                className={`${
                  index % 2 === 0
                    ? 'bg-[color:var(--color-surface)]'
                    : 'bg-[color:var(--color-surface-alt)]'
                } hover:bg-[color:var(--color-info-bg)] transition-colors`}
              >
                <td className="px-4 py-2.5 text-sm font-medium text-[color:var(--color-foreground)] sticky left-0 bg-inherit">
                  Month {row.month}
                </td>
                <td className="px-4 py-2.5 text-sm text-right text-[color:var(--color-foreground)]">
                  {formatUSD(row.subscription)}
                </td>
                <td className="px-4 py-2.5 text-sm text-right text-[color:var(--color-foreground)]">
                  {formatUSD(row.aiCredits)}
                </td>
                <td className={`px-4 py-2.5 text-sm text-right ${row.onboarding > 0 ? 'text-[color:var(--color-info)] font-medium' : 'text-[color:var(--color-foreground)]'}`}>
                  {formatUSD(row.onboarding)}
                </td>
                <td className={`px-4 py-2.5 text-sm text-right ${row.hardware > 0 ? 'text-[color:var(--color-info)] font-medium' : 'text-[color:var(--color-foreground)]'}`}>
                  {formatUSD(row.hardware)}
                </td>
                <td className="px-4 py-2.5 text-sm text-right text-[color:var(--color-foreground)]">
                  {formatUSD(row.marketplace)}
                </td>
                <td className="px-4 py-2.5 text-sm text-right font-bold text-[color:var(--color-primary)] bg-[color:var(--color-info-bg)]">
                  {formatUSD(row.total)}
                </td>
              </tr>
            ))}

            {/* Collapsed indicator rows */}
            {collapsed && schedule.length > 3 && (
              <tr className="bg-[color:var(--color-surface)]">
                <td colSpan={7} className="px-4 py-2 text-center text-xs text-[color:var(--color-muted)]">
                  ... {schedule.length - 3} more months (months 4–{schedule.length}) follow same pattern ...
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-[color:var(--color-surface-alt)] border-t-2 border-[color:var(--color-border)]">
              <td className="px-4 py-3 text-sm font-bold text-[color:var(--color-foreground)] sticky left-0 bg-[color:var(--color-surface-alt)]">
                Total ({termMonths} mo)
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold text-[color:var(--color-foreground)]">
                {formatUSD(totals.subscription)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold text-[color:var(--color-foreground)]">
                {formatUSD(totals.aiCredits)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold text-[color:var(--color-foreground)]">
                {formatUSD(totals.onboarding)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold text-[color:var(--color-foreground)]">
                {formatUSD(totals.hardware)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold text-[color:var(--color-foreground)]">
                {formatUSD(totals.marketplace)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold text-[color:var(--color-primary)] bg-[color:var(--color-info-bg)]">
                {formatUSD(totals.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Expand/collapse toggle */}
      {termMonths > 3 && (
        <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)] transition-colors"
          >
            {collapsed ? (
              <>
                <ChevronDownIcon className="w-4 h-4" />
                Show all {termMonths} months
              </>
            ) : (
              <>
                <ChevronUpIcon className="w-4 h-4" />
                Collapse schedule
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
