'use client';

import React, { useState } from 'react';
import { FileText as FileTextIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon } from 'lucide-react';

export interface JournalEntryLine {
  account: string;
  debit?: number;
  credit?: number;
  note?: string;
}

export interface JournalEntry {
  title: string;
  description?: string;
  entries: JournalEntryLine[];
}

interface JournalEntriesProps {
  entries: JournalEntry[];
}

function formatUSD(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function JournalEntryCard({ entry, index }: { entry: JournalEntry; index: number }) {
  const [open, setOpen] = useState(true);
  const totalDebits = entry.entries.reduce((sum, l) => sum + (l.debit ?? 0), 0);
  const totalCredits = entry.entries.reduce((sum, l) => sum + (l.credit ?? 0), 0);
  const balanced = Math.abs(totalDebits - totalCredits) < 0.01;

  return (
    <div className="rounded-lg border border-[color:var(--color-border)] overflow-hidden">
      {/* Card header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[color:var(--color-surface-alt)] hover:bg-[color:var(--color-border)] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[color:var(--color-info-bg)] border border-[color:var(--color-info-border)]">
            <FileTextIcon className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-foreground)]">
              JE-{String(index + 1).padStart(2, '0')}: {entry.title}
            </p>
            {entry.description && (
              <p className="text-sm text-[color:var(--color-muted)] mt-0.5">{entry.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className={`text-sm px-2 py-0.5 rounded-full font-medium ${
              balanced
                ? 'bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]'
                : 'bg-[color:var(--color-error-bg)] text-[color:var(--color-error)]'
            }`}
          >
            {balanced ? 'Balanced' : 'Unbalanced'}
          </span>
          {open ? (
            <ChevronUpIcon className="w-4 h-4 text-[color:var(--color-muted)]" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-[color:var(--color-muted)]" />
          )}
        </div>
      </button>

      {/* Entry table */}
      {open && (
        <div className="bg-[color:var(--color-surface)]">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                <th className="px-4 py-2 text-left text-sm font-semibold text-[color:var(--color-muted)] uppercase tracking-wider">
                  Account
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-[color:var(--color-muted)] uppercase tracking-wider w-32">
                  Debit
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-[color:var(--color-muted)] uppercase tracking-wider w-32">
                  Credit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-border)]">
              {entry.entries.map((line, lineIdx) => (
                <tr
                  key={lineIdx}
                  className="hover:bg-[color:var(--color-surface-alt)] transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <div className={`flex items-start gap-2 ${line.credit !== undefined && line.debit === undefined ? 'pl-4' : ''}`}>
                      <span className="text-sm text-[color:var(--color-foreground)]">{line.account}</span>
                      {line.note && (
                        <span className="text-sm text-[color:var(--color-muted)] italic mt-0.5">
                          ({line.note})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {line.debit !== undefined ? (
                      <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                        {formatUSD(line.debit)}
                      </span>
                    ) : (
                      <span className="text-sm text-[color:var(--color-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {line.credit !== undefined ? (
                      <span className="text-sm font-medium text-[color:var(--color-foreground)]">
                        {formatUSD(line.credit)}
                      </span>
                    ) : (
                      <span className="text-sm text-[color:var(--color-muted)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)]">
                <td className="px-4 py-2.5 text-sm font-bold text-[color:var(--color-muted)] uppercase">
                  Totals
                </td>
                <td className="px-4 py-2.5 text-right text-sm font-bold text-[color:var(--color-foreground)]">
                  {formatUSD(totalDebits)}
                </td>
                <td className="px-4 py-2.5 text-right text-sm font-bold text-[color:var(--color-foreground)]">
                  {formatUSD(totalCredits)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

export function JournalEntries({ entries }: JournalEntriesProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-[color:var(--color-muted)] text-sm">
        No journal entries to display.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <JournalEntryCard key={index} entry={entry} index={index} />
      ))}
    </div>
  );
}
