'use client';

import { useState, useMemo } from 'react';

import { RESERVATIONS, CUSTOMERS, type ReservationStatus } from '@/data/equipr';
import { fmtDollar } from '@/lib/utils';

/* ── Status colors & labels ──────────────────────────── */
const STATUS_COLORS: Record<ReservationStatus, string> = {
  quote: '#8B5CF6',
  booked: '#2563EB',
  checked_out: '#0891B2',
  returning: '#F59E0B',
  overdue: '#EF4444',
  closed: '#6B7280',
};

const STATUS_LABELS: Record<ReservationStatus, string> = {
  quote: 'Quote',
  booked: 'Booked',
  checked_out: 'Checked Out',
  returning: 'Returning',
  overdue: 'Overdue',
  closed: 'Closed',
};

const DEPOSIT_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'rgba(245,158,11,0.10)', text: '#D97706' },
  held: { bg: 'rgba(37,99,235,0.10)', text: '#2563EB' },
  applied: { bg: 'rgba(16,185,129,0.10)', text: '#059669' },
  refunded: { bg: 'rgba(107,114,128,0.10)', text: '#6B7280' },
};

const LOCATION_MAP: Record<string, string> = {
  orl: 'Orlando Central',
  tpa: 'Tampa Bay Yard',
  jax: 'Jacksonville Depot',
};

const ALL_STATUSES: (ReservationStatus | 'all')[] = [
  'all',
  'quote',
  'booked',
  'checked_out',
  'returning',
  'overdue',
];

function SourceBadge({ source, synced }: { source: string; synced: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span>{source}</span>
      <span style={{ opacity: 0.5 }}>&bull;</span>
      <span>Synced {synced}</span>
    </div>
  );
}

export default function ReservationsPage() {
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus | 'all'>('all');
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: RESERVATIONS.length };
    for (const s of Object.keys(STATUS_COLORS) as ReservationStatus[]) {
      counts[s] = RESERVATIONS.filter((r) => r.status === s).length;
    }
    return counts;
  }, []);

  const filtered = useMemo(() => {
    if (selectedStatus === 'all') return RESERVATIONS;
    return RESERVATIONS.filter((r) => r.status === selectedStatus);
  }, [selectedStatus]);

  const selectedRes = useMemo(() => {
    if (!selectedReservation) return null;
    return RESERVATIONS.find((r) => r.id === selectedReservation) ?? null;
  }, [selectedReservation]);

  const selectedCustomer = useMemo(() => {
    if (!selectedRes) return null;
    return CUSTOMERS.find((c) => c.id === selectedRes.customerId) ?? null;
  }, [selectedRes]);

  function formatDateRange(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${s.toLocaleDateString('en-US', opts)} - ${e.toLocaleDateString('en-US', opts)}`;
  }

  return (
    <>
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <h1
          className="text-2xl font-bold"
          style={{
            color: 'var(--prizym-text-primary)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Reservations
        </h1>
        <span
          className="text-[12px] font-mono font-semibold px-2.5 py-1 rounded-lg"
          style={{
            background: 'rgba(8,145,178,0.12)',
            color: '#0891B2',
            border: '1px solid rgba(8,145,178,0.25)',
          }}
        >
          {filtered.length}
        </span>
      </div>
      <SourceBadge source="Point of Rental" synced="5 min ago" />

      {/* ── Status Tabs ─────────────────────────────────── */}
      <div
        className="flex items-center gap-1 mb-5 overflow-x-auto pb-1"
        style={{ borderBottom: '1px solid var(--prizym-border-default)' }}
      >
        {ALL_STATUSES.map((status) => {
          const isActive = selectedStatus === status;
          const color = status === 'all' ? '#0891B2' : STATUS_COLORS[status];
          const label = status === 'all' ? 'All' : STATUS_LABELS[status];
          const count = statusCounts[status] ?? 0;

          return (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setSelectedReservation(null);
              }}
              className="relative text-[12px] font-medium px-4 py-2.5 transition-all whitespace-nowrap"
              style={{
                color: isActive ? color : 'var(--prizym-text-muted)',
              }}
            >
              {label}{' '}
              <span className="font-mono text-[10px]" style={{ opacity: 0.7 }}>
                ({count})
              </span>
              {isActive && (
                <div
                  className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t"
                  style={{ background: color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Card List + Detail Panel ────────────────────── */}
      <div className="flex gap-5">
        {/* Left: card list */}
        <div className={selectedRes ? 'w-1/2 shrink-0' : 'w-full'}>
          <div className="flex flex-col gap-3">
            {filtered.map((res) => {
              const statusColor = STATUS_COLORS[res.status];
              const isSelected = selectedReservation === res.id;
              const deposit = DEPOSIT_COLORS[res.depositStatus];

              return (
                <button
                  key={res.id}
                  onClick={() =>
                    setSelectedReservation(isSelected ? null : res.id)
                  }
                  className="w-full text-left rounded-xl p-4 transition-all"
                  style={{
                    background: isSelected
                      ? '#F3F4F6'
                      : 'var(--prizym-card-bg)',
                    border: isSelected
                      ? `1px solid ${statusColor}50`
                      : '1px solid var(--prizym-border-default)',
                    boxShadow: isSelected
                      ? `0 0 0 1px ${statusColor}30`
                      : 'var(--prizym-shadow-card)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Status + ID */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.5px] px-2 py-1 rounded-md"
                        style={{
                          background: `${statusColor}18`,
                          color: statusColor,
                        }}
                      >
                        {STATUS_LABELS[res.status]}
                      </span>
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: 'var(--prizym-text-muted)' }}
                      >
                        {res.id}
                      </span>
                    </div>

                    {/* Right: Badges */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded"
                        style={{
                          background: deposit.bg,
                          color: deposit.text,
                        }}
                      >
                        {res.depositStatus}
                      </span>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded"
                        style={{
                          background: '#F3F4F6',
                          color: 'var(--prizym-text-secondary)',
                        }}
                      >
                        {LOCATION_MAP[res.locationId] ?? res.locationId}
                      </span>
                    </div>
                  </div>

                  {/* Center info */}
                  <div className="mt-2.5">
                    <div
                      className="text-[14px] font-semibold"
                      style={{ color: 'var(--prizym-text-primary)' }}
                    >
                      {res.customerName}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-[12px]"
                        style={{ color: 'var(--prizym-text-secondary)' }}
                      >
                        {formatDateRange(res.startDate, res.endDate)}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: 'var(--prizym-text-muted)' }}
                      >
                        {res.lines.length} item{res.lines.length !== 1 ? 's' : ''}
                      </span>
                      <span
                        className="text-[12px] font-mono font-semibold"
                        style={{ color: 'var(--prizym-text-primary)' }}
                      >
                        {fmtDollar(res.total)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}

            {filtered.length === 0 && (
              <div
                className="text-center py-12 text-[13px]"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                No reservations match this filter.
              </div>
            )}
          </div>
        </div>

        {/* Right: detail panel */}
        {selectedRes && (
          <div className="w-1/2 shrink-0">
            <div
              className="rounded-xl overflow-hidden sticky top-4"
              style={{
                background: 'var(--prizym-card-bg)',
                border: `1px solid ${STATUS_COLORS[selectedRes.status]}30`,
                boxShadow: 'var(--prizym-shadow-elevated)',
              }}
            >
              {/* Header */}
              <div
                className="px-5 py-4"
                style={{
                  borderBottom: '1px solid var(--prizym-border-default)',
                  background: `${STATUS_COLORS[selectedRes.status]}08`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.5px] px-2.5 py-1 rounded-md"
                    style={{
                      background: `${STATUS_COLORS[selectedRes.status]}18`,
                      color: STATUS_COLORS[selectedRes.status],
                    }}
                  >
                    {STATUS_LABELS[selectedRes.status]}
                  </span>
                  <span
                    className="font-mono text-[12px] font-semibold"
                    style={{ color: 'var(--prizym-text-secondary)' }}
                  >
                    {selectedRes.id}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold"
                  style={{
                    color: 'var(--prizym-text-primary)',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {selectedRes.customerName}
                </h3>
                <div
                  className="text-[12px] mt-1"
                  style={{ color: 'var(--prizym-text-secondary)' }}
                >
                  {formatDateRange(selectedRes.startDate, selectedRes.endDate)}{' '}
                  &middot; {LOCATION_MAP[selectedRes.locationId]}
                </div>
              </div>

              {/* Customer info */}
              {selectedCustomer && (
                <div
                  className="px-5 py-3"
                  style={{
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-[1px] font-mono font-semibold mb-2"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    Customer Info
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px]">
                    <div>
                      <span style={{ color: 'var(--prizym-text-muted)' }}>
                        Type
                      </span>
                      <span
                        className="float-right capitalize font-medium"
                        style={{ color: 'var(--prizym-text-primary)' }}
                      >
                        {selectedCustomer.type}
                      </span>
                    </div>
                    {selectedCustomer.company && (
                      <div>
                        <span style={{ color: 'var(--prizym-text-muted)' }}>
                          Company
                        </span>
                        <span
                          className="float-right font-medium"
                          style={{ color: 'var(--prizym-text-primary)' }}
                        >
                          {selectedCustomer.company}
                        </span>
                      </div>
                    )}
                    <div>
                      <span style={{ color: 'var(--prizym-text-muted)' }}>
                        Phone
                      </span>
                      <span
                        className="float-right font-mono"
                        style={{ color: 'var(--prizym-text-secondary)' }}
                      >
                        {selectedCustomer.phone}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--prizym-text-muted)' }}>
                        Lifetime
                      </span>
                      <span
                        className="float-right font-mono font-medium"
                        style={{ color: 'var(--prizym-text-primary)' }}
                      >
                        {fmtDollar(selectedCustomer.lifetimeValue)}
                      </span>
                    </div>
                    {selectedCustomer.creditTerms && (
                      <div>
                        <span style={{ color: 'var(--prizym-text-muted)' }}>
                          Terms
                        </span>
                        <span
                          className="float-right font-medium"
                          style={{ color: 'var(--prizym-text-primary)' }}
                        >
                          {selectedCustomer.creditTerms}
                        </span>
                      </div>
                    )}
                    {selectedCustomer.riskFlag && (
                      <div className="col-span-2">
                        <span
                          className="text-[11px] font-medium px-2 py-0.5 rounded"
                          style={{
                            background: 'rgba(239,68,68,0.12)',
                            color: '#EF4444',
                          }}
                        >
                          {selectedCustomer.riskFlag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Line items table */}
              <div
                className="px-5 py-3"
                style={{
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <div
                  className="text-[10px] uppercase tracking-[1px] font-mono font-semibold mb-2"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Line Items
                </div>
                <table className="w-full text-[12px]">
                  <thead>
                    <tr>
                      <th
                        className="text-left pb-2 text-[10px] uppercase tracking-[0.5px] font-mono"
                        style={{ color: 'var(--prizym-text-muted)' }}
                      >
                        Asset
                      </th>
                      <th
                        className="text-right pb-2 text-[10px] uppercase tracking-[0.5px] font-mono"
                        style={{ color: 'var(--prizym-text-muted)' }}
                      >
                        Rate
                      </th>
                      <th
                        className="text-right pb-2 text-[10px] uppercase tracking-[0.5px] font-mono"
                        style={{ color: 'var(--prizym-text-muted)' }}
                      >
                        Days
                      </th>
                      <th
                        className="text-right pb-2 text-[10px] uppercase tracking-[0.5px] font-mono"
                        style={{ color: 'var(--prizym-text-muted)' }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRes.lines.map((line) => (
                      <tr
                        key={line.assetId}
                        style={{
                          borderTop: '1px solid rgba(0,0,0,0.06)',
                        }}
                      >
                        <td className="py-2">
                          <div
                            className="font-medium"
                            style={{ color: 'var(--prizym-text-primary)' }}
                          >
                            {line.assetName}
                          </div>
                          <div
                            className="font-mono text-[10px]"
                            style={{ color: 'var(--prizym-text-muted)' }}
                          >
                            {line.assetId}
                          </div>
                        </td>
                        <td
                          className="py-2 text-right font-mono"
                          style={{ color: 'var(--prizym-text-secondary)' }}
                        >
                          {fmtDollar(line.dailyRate)}
                        </td>
                        <td
                          className="py-2 text-right font-mono"
                          style={{ color: 'var(--prizym-text-secondary)' }}
                        >
                          {line.days}
                        </td>
                        <td
                          className="py-2 text-right font-mono font-semibold"
                          style={{ color: 'var(--prizym-text-primary)' }}
                        >
                          {fmtDollar(line.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        borderTop: '1px solid var(--prizym-border-default)',
                      }}
                    >
                      <td
                        colSpan={3}
                        className="py-2 text-right font-semibold"
                        style={{ color: 'var(--prizym-text-secondary)' }}
                      >
                        Total
                      </td>
                      <td
                        className="py-2 text-right font-mono font-bold text-[14px]"
                        style={{ color: 'var(--prizym-text-primary)' }}
                      >
                        {fmtDollar(selectedRes.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Deposit info */}
              <div
                className="px-5 py-3"
                style={{
                  borderBottom: selectedRes.notes
                    ? '1px solid rgba(0,0,0,0.06)'
                    : 'none',
                }}
              >
                <div
                  className="text-[10px] uppercase tracking-[1px] font-mono font-semibold mb-2"
                  style={{ color: 'var(--prizym-text-muted)' }}
                >
                  Deposit
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[14px] font-mono font-bold"
                    style={{ color: 'var(--prizym-text-primary)' }}
                  >
                    {fmtDollar(selectedRes.depositAmount)}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                    style={{
                      background:
                        DEPOSIT_COLORS[selectedRes.depositStatus].bg,
                      color: DEPOSIT_COLORS[selectedRes.depositStatus].text,
                    }}
                  >
                    {selectedRes.depositStatus}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedRes.notes && (
                <div className="px-5 py-3">
                  <div
                    className="text-[10px] uppercase tracking-[1px] font-mono font-semibold mb-2"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    Notes
                  </div>
                  <p
                    className="text-[12px] leading-relaxed"
                    style={{ color: 'var(--prizym-text-secondary)' }}
                  >
                    {selectedRes.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
