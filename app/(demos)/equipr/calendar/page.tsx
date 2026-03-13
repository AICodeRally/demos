'use client';

import React, { useMemo, useState } from 'react';

import {
  ASSETS,
  RESERVATIONS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '@/data/equipr';
import type { AssetCategory } from '@/data/equipr/assets';
import type { ReservationStatus } from '@/data/equipr/reservations';

/* ── Constants ──────────────────────────────────────────────── */

const DATE_START = new Date('2026-02-28');
const NUM_DAYS = 14;

const STATUS_BAR_COLORS: Record<ReservationStatus, string> = {
  quote: '#8B5CF6',
  booked: '#2563EB',
  checked_out: '#0891B2',
  returning: '#F59E0B',
  overdue: '#EF4444',
  closed: '#64748B',
};

const STATUS_LABELS: Record<ReservationStatus, string> = {
  quote: 'Quote',
  booked: 'Booked',
  checked_out: 'Checked Out',
  returning: 'Returning',
  overdue: 'Overdue',
  closed: 'Closed',
};

const ALL_FILTER = 'all' as const;
type FilterCategory = AssetCategory | typeof ALL_FILTER;

const CATEGORY_ORDER: AssetCategory[] = [
  'heavy',
  'aerial',
  'compaction',
  'power',
  'tools',
];

/* ── Helpers ────────────────────────────────────────────────── */

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function dateRange(): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < NUM_DAYS; i++) {
    const d = new Date(DATE_START);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateLabel(d: Date): string {
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
  return `${dow} ${d.getDate()}`;
}

function isWeekend(d: Date): boolean {
  return d.getDay() === 0 || d.getDay() === 6;
}

function dateToStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

/* ── Conflict entry (synthetic) ─────────────────────────────── */

/** We inject a synthetic reservation to create a visible conflict on AER-001 (JLG 600S Boom Lift) on Mar 3. */
const CONFLICT_RESERVATION = {
  id: 'RES-CONFLICT',
  customerId: 'CUST-015',
  customerName: 'Dan Mitchell (SunBuild FL)',
  status: 'booked' as ReservationStatus,
  startDate: '2026-03-02',
  endDate: '2026-03-04',
  lines: [
    {
      assetId: 'AER-001',
      assetName: 'JLG 600S Boom Lift',
      dailyRate: 650,
      days: 3,
      lineTotal: 1950,
    },
  ],
  total: 1950,
  depositStatus: 'held' as const,
  depositAmount: 500,
  locationId: 'orl',
  notes: 'Roofing project overlap — CONFLICT with existing checkout.',
};

/* We also need an existing reservation that covers AER-001 on Mar 3.
   AER-001 appears in RES-2026-0109 (checked_out, Feb 24 - Mar 7) — NO, that uses HVY-001 and HVY-002.
   AER-001 doesn't appear in any reservation. Let's add a second synthetic one: */
const CONFLICT_BASE_RESERVATION = {
  id: 'RES-2026-0121',
  customerId: 'CUST-001',
  customerName: 'Tom Hargrove (Coastal Builders)',
  status: 'checked_out' as ReservationStatus,
  startDate: '2026-03-01',
  endDate: '2026-03-06',
  lines: [
    {
      assetId: 'AER-001',
      assetName: 'JLG 600S Boom Lift',
      dailyRate: 650,
      days: 6,
      lineTotal: 3900,
    },
    {
      assetId: 'AER-010',
      assetName: 'CAT TL1055D Telehandler',
      dailyRate: 550,
      days: 6,
      lineTotal: 3300,
    },
  ],
  total: 7200,
  depositStatus: 'held' as const,
  depositAmount: 2000,
  locationId: 'orl',
  notes: 'Steel erection — Dr. Phillips Blvd commercial.',
};

/* ── Data structure for the Gantt ────────────────────────────── */

interface DayEntry {
  date: string;
  reservationId: string;
  customerName: string;
  status: ReservationStatus;
}

interface ConflictInfo {
  date: string;
  assetId: string;
  entries: DayEntry[];
}

function buildOccupancyMap(
  allReservations: typeof RESERVATIONS,
): {
  occupancy: Map<string, DayEntry[]>;
  conflicts: ConflictInfo[];
} {
  // Map<assetId, Map<dateStr, DayEntry[]>>
  const rawMap = new Map<string, Map<string, DayEntry[]>>();

  for (const res of allReservations) {
    const start = new Date(res.startDate);
    const end = new Date(res.endDate);

    for (const line of res.lines) {
      if (!rawMap.has(line.assetId)) {
        rawMap.set(line.assetId, new Map());
      }
      const assetMap = rawMap.get(line.assetId)!;

      // Iterate each day from start to end (inclusive)
      const cursor = new Date(start);
      while (cursor <= end) {
        const key = dateToStr(cursor);
        if (!assetMap.has(key)) {
          assetMap.set(key, []);
        }
        assetMap.get(key)!.push({
          date: key,
          reservationId: res.id,
          customerName: res.customerName,
          status: res.status,
        });
        cursor.setDate(cursor.getDate() + 1);
      }
    }
  }

  // Flatten to occupancy map (assetId -> DayEntry[] across all dates)
  const occupancy = new Map<string, DayEntry[]>();
  const conflicts: ConflictInfo[] = [];

  for (const [assetId, dateMap] of rawMap) {
    const entries: DayEntry[] = [];
    for (const [dateStr, dayEntries] of dateMap) {
      entries.push(...dayEntries);
      if (dayEntries.length > 1) {
        conflicts.push({ date: dateStr, assetId, entries: dayEntries });
      }
    }
    occupancy.set(assetId, entries);
  }

  return { occupancy, conflicts };
}

/* ── Build bar segments for rendering ────────────────────────── */

interface BarSegment {
  reservationId: string;
  customerName: string;
  status: ReservationStatus;
  startCol: number; // 1-based grid column (within the 14-day section)
  spanCols: number;
}

function buildBars(
  assetId: string,
  allReservations: typeof RESERVATIONS,
  dates: Date[],
): BarSegment[] {
  const bars: BarSegment[] = [];
  const rangeStart = dates[0];
  const rangeEnd = dates[dates.length - 1];
  const seen = new Set<string>();

  for (const res of allReservations) {
    if (seen.has(res.id + ':' + assetId)) continue;
    const hasAsset = res.lines.some((l) => l.assetId === assetId);
    if (!hasAsset) continue;
    seen.add(res.id + ':' + assetId);

    const resStart = new Date(res.startDate);
    const resEnd = new Date(res.endDate);

    // Clip to our visible range
    const visStart = resStart < rangeStart ? rangeStart : resStart;
    const visEnd = resEnd > rangeEnd ? rangeEnd : resEnd;

    if (visStart > rangeEnd || visEnd < rangeStart) continue;

    const startCol = daysBetween(rangeStart, visStart) + 1; // 1-based
    const spanCols = daysBetween(visStart, visEnd) + 1;

    if (spanCols <= 0) continue;

    bars.push({
      reservationId: res.id,
      customerName: res.customerName,
      status: res.status,
      startCol,
      spanCols,
    });
  }

  return bars;
}

/* ── Source Badge ────────────────────────────────────────────── */

function SourceBadge({ source, synced }: { source: string; synced: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px]" style={{ color: 'var(--prizym-text-muted)' }}>
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span>{source}</span>
      <span style={{ opacity: 0.5 }}>&bull;</span>
      <span>Synced {synced}</span>
    </div>
  );
}

/* ── Page Component ──────────────────────────────────────────── */

export default function CalendarPage() {
  const [filter, setFilter] = useState<FilterCategory>(ALL_FILTER);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const dates = useMemo(() => dateRange(), []);

  const allReservations = useMemo(
    () => [...RESERVATIONS, CONFLICT_BASE_RESERVATION, CONFLICT_RESERVATION],
    [],
  );

  const { occupancy, conflicts } = useMemo(
    () => buildOccupancyMap(allReservations),
    [allReservations],
  );

  // Build set of asset IDs that have any reservation overlapping our date range
  const activeAssetIds = useMemo(() => {
    const ids = new Set<string>();
    const rangeStart = dates[0];
    const rangeEnd = dates[dates.length - 1];

    for (const res of allReservations) {
      const resStart = new Date(res.startDate);
      const resEnd = new Date(res.endDate);
      if (resStart <= rangeEnd && resEnd >= rangeStart) {
        for (const line of res.lines) {
          ids.add(line.assetId);
        }
      }
    }
    return ids;
  }, [allReservations, dates]);

  // Also include a handful of "available" assets for contrast
  const availableAssets = useMemo(
    () =>
      ASSETS.filter(
        (a) =>
          a.status === 'available' && !activeAssetIds.has(a.id),
      ).slice(0, 4),
    [activeAssetIds],
  );

  const visibleAssets = useMemo(() => {
    const visible = ASSETS.filter(
      (a) => activeAssetIds.has(a.id) || availableAssets.some((av) => av.id === a.id),
    );

    // Apply category filter
    if (filter !== ALL_FILTER) {
      return visible.filter((a) => a.category === filter);
    }
    return visible;
  }, [activeAssetIds, availableAssets, filter]);

  // Group by category
  const groupedAssets = useMemo(() => {
    const groups: { category: AssetCategory; assets: typeof ASSETS }[] = [];
    for (const cat of CATEGORY_ORDER) {
      const catAssets = visibleAssets.filter((a) => a.category === cat);
      if (catAssets.length > 0) {
        groups.push({ category: cat, assets: catAssets });
      }
    }
    return groups;
  }, [visibleAssets]);

  // Build conflict lookup: key = "assetId:dateStr"
  const conflictLookup = useMemo(() => {
    const map = new Set<string>();
    for (const c of conflicts) {
      map.add(`${c.assetId}:${c.date}`);
    }
    return map;
  }, [conflicts]);

  // Count total rows for grid
  const totalRows = useMemo(() => {
    let rows = 0;
    for (const g of groupedAssets) {
      rows += 1; // category header
      rows += g.assets.length; // asset rows
    }
    return rows;
  }, [groupedAssets]);

  // Date range label
  const rangeLabelStart = dates[0];
  const rangeLabelEnd = dates[dates.length - 1];
  const rangeLabel = `${rangeLabelStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} \u2014 ${rangeLabelEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <>
      {/* ── Global animation keyframes ─── */}
      <style>{`
        @keyframes conflictPulse {
          0%, 100% { box-shadow: inset 0 0 0 1.5px rgba(239, 68, 68, 0.6); }
          50% { box-shadow: inset 0 0 0 2px rgba(239, 68, 68, 1), 0 0 8px rgba(239, 68, 68, 0.3); }
        }
      `}</style>

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Availability Calendar
          </h1>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            Gantt-style asset timeline &middot; {visibleAssets.length} assets shown
          </p>
          <SourceBadge source="Wynne Systems ERP" synced="Live" />
        </div>
        <div
          className="text-[12px] font-medium px-3 py-1.5 rounded-lg shrink-0"
          style={{
            background: 'rgba(37,99,235,0.12)',
            color: '#2563EB',
            border: '1px solid rgba(37,99,235,0.25)',
          }}
        >
          {rangeLabel}
        </div>
      </div>

      {/* ── Category Filter Tabs ───────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilter(ALL_FILTER)}
          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer"
          style={{
            background:
              filter === ALL_FILTER
                ? 'rgba(37,99,235,0.12)'
                : 'rgba(0,0,0,0.04)',
            color:
              filter === ALL_FILTER
                ? '#2563EB'
                : 'var(--prizym-text-muted)',
            border:
              filter === ALL_FILTER
                ? '1px solid rgba(37,99,235,0.30)'
                : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          All Categories
        </button>
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer"
            style={{
              background:
                filter === cat
                  ? `${CATEGORY_COLORS[cat]}20`
                  : 'rgba(0,0,0,0.06)',
              color:
                filter === cat
                  ? CATEGORY_COLORS[cat]
                  : 'var(--prizym-text-muted)',
              border:
                filter === cat
                  ? `1px solid ${CATEGORY_COLORS[cat]}40`
                  : '1px solid rgba(0,0,0,0.04)',
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* ── Gantt Chart ────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="overflow-x-auto">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px repeat(14, minmax(60px, 1fr))',
              minWidth: '1100px',
            }}
          >
            {/* ── Column Headers ──────────────────────────── */}
            <div
              className="sticky left-0 z-20 px-3 py-2 text-[10px] uppercase tracking-[1.5px] font-bold tabular-nums"
              style={{
                background: 'var(--prizym-card-bg)',
                color: 'var(--prizym-text-muted)',
                borderBottom: '1px solid var(--prizym-border-default)',
              }}
            >
              Asset
            </div>
            {dates.map((d, i) => {
              const weekend = isWeekend(d);
              const isToday = dateToStr(d) === '2026-02-28'; // "today" in our demo context
              return (
                <div
                  key={i}
                  className="px-1 py-2 text-center text-[10px]"
                  style={{
                    background: weekend
                      ? 'rgba(0,0,0,0.02)'
                      : 'transparent',
                    color: isToday ? '#2563EB' : 'var(--prizym-text-muted)',
                    fontWeight: isToday ? 700 : 500,
                    borderBottom: '1px solid var(--prizym-border-default)',
                    borderLeft: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {formatDateLabel(d)}
                </div>
              );
            })}

            {/* ── Asset Rows ──────────────────────────────── */}
            {groupedAssets.map((group) => (
              <React.Fragment key={`group-${group.category}`}>
                {/* Category Header */}
                <div
                  key={`cat-${group.category}`}
                  className="sticky left-0 z-20 col-span-1 px-3 py-1.5 flex items-center gap-2"
                  style={{
                    background: `${CATEGORY_COLORS[group.category]}10`,
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: CATEGORY_COLORS[group.category] }}
                  />
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: CATEGORY_COLORS[group.category] }}
                  >
                    {CATEGORY_LABELS[group.category]}
                  </span>
                </div>
                {/* Category header fills remaining columns */}
                {Array.from({ length: 14 }).map((_, ci) => (
                  <div
                    key={`cat-${group.category}-col-${ci}`}
                    style={{
                      background: `${CATEGORY_COLORS[group.category]}08`,
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      borderLeft: '1px solid rgba(0,0,0,0.06)',
                    }}
                  />
                ))}

                {/* Asset Rows */}
                {group.assets.map((asset, assetIdx) => {
                  const bars = buildBars(asset.id, allReservations, dates);
                  const isEvenRow = assetIdx % 2 === 0;

                  return (
                    <React.Fragment key={`asset-${asset.id}`}>
                      {/* Asset Name Cell */}
                      <div
                        className="sticky left-0 z-10 px-3 flex items-center"
                        style={{
                          height: '36px',
                          background: isEvenRow
                            ? 'var(--prizym-card-bg)'
                            : 'rgba(0,0,0,0.015)',
                          borderBottom: '1px solid rgba(0,0,0,0.06)',
                        }}
                      >
                        <span
                          className="text-[11px] truncate"
                          style={{ color: 'var(--prizym-text-secondary)' }}
                          title={`${asset.id} — ${asset.name}`}
                        >
                          {asset.name}
                        </span>
                      </div>

                      {/* Day Cells (background grid) + Bar overlay */}
                      <div
                        key={`row-${asset.id}`}
                        className="relative"
                        style={{
                          gridColumn: '2 / -1',
                          height: '36px',
                          borderBottom: '1px solid rgba(0,0,0,0.06)',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(14, 1fr)',
                        }}
                      >
                        {/* Background cells for weekends + conflicts */}
                        {dates.map((d, ci) => {
                          const weekend = isWeekend(d);
                          const hasConflict = conflictLookup.has(
                            `${asset.id}:${dateToStr(d)}`,
                          );
                          return (
                            <div
                              key={ci}
                              style={{
                                background: hasConflict
                                  ? 'rgba(239, 68, 68, 0.15)'
                                  : weekend
                                    ? isEvenRow
                                      ? 'rgba(0,0,0,0.025)'
                                      : 'rgba(0,0,0,0.06)'
                                    : isEvenRow
                                      ? 'transparent'
                                      : 'rgba(0,0,0,0.015)',
                                borderLeft: '1px solid rgba(0,0,0,0.06)',
                                animation: hasConflict
                                  ? 'conflictPulse 2s ease-in-out infinite'
                                  : undefined,
                                position: 'relative',
                                zIndex: hasConflict ? 5 : 0,
                              }}
                            >
                              {hasConflict && (
                                <div
                                  className="absolute inset-0 flex items-center justify-center"
                                  style={{ zIndex: 10 }}
                                >
                                  <span
                                    className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded"
                                    style={{
                                      background: 'rgba(239, 68, 68, 0.9)',
                                      color: '#fff',
                                    }}
                                  >
                                    Conflict
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Reservation bars overlaid on top */}
                        {bars.map((bar) => {
                          const barColor = STATUS_BAR_COLORS[bar.status];
                          const isConflictBar =
                            bar.reservationId === 'RES-CONFLICT' ||
                            bar.reservationId === 'RES-2026-0121';
                          const isHovered = hoveredBar === `${asset.id}:${bar.reservationId}`;
                          const showLabel = bar.spanCols >= 3;

                          return (
                            <div
                              key={bar.reservationId}
                              onMouseEnter={() =>
                                setHoveredBar(`${asset.id}:${bar.reservationId}`)
                              }
                              onMouseLeave={() => setHoveredBar(null)}
                              style={{
                                position: 'absolute',
                                top: '6px',
                                bottom: '6px',
                                left: `${((bar.startCol - 1) / 14) * 100}%`,
                                width: `${(bar.spanCols / 14) * 100}%`,
                                background: isHovered
                                  ? barColor
                                  : `${barColor}CC`,
                                borderRadius: '6px',
                                zIndex: isConflictBar ? 3 : 4,
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '6px',
                                paddingRight: '4px',
                                overflow: 'hidden',
                                transition: 'background 150ms, transform 100ms',
                                transform: isHovered ? 'scaleY(1.15)' : 'scaleY(1)',
                                cursor: 'default',
                                boxShadow: isHovered
                                  ? `0 2px 8px ${barColor}60`
                                  : `0 1px 3px ${barColor}30`,
                              }}
                              title={`${bar.customerName}\n${bar.status.replace('_', ' ')} — ${bar.reservationId}`}
                            >
                              {showLabel && (
                                <span
                                  className="text-[9px] font-semibold truncate"
                                  style={{ color: '#fff' }}
                                >
                                  {bar.customerName.split('(')[0].split(' ').slice(0, 2).join(' ')}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Conflict Alert ─────────────────────────────────── */}
      {conflicts.length > 0 && (
        <div
          className="mt-4 rounded-xl px-4 py-3 flex items-start gap-3"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <div
            className="mt-0.5 h-2 w-2 rounded-full shrink-0"
            style={{
              background: '#EF4444',
              animation: 'conflictPulse 2s ease-in-out infinite',
            }}
          />
          <div>
            <div className="text-[12px] font-bold" style={{ color: '#EF4444' }}>
              {conflicts.length} Scheduling Conflict{conflicts.length !== 1 ? 's' : ''} Detected
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>
              {conflicts.map((c) => {
                const asset = ASSETS.find((a) => a.id === c.assetId);
                return `${asset?.name ?? c.assetId} on ${new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
              }).join('; ')}
            </div>
          </div>
        </div>
      )}

      {/* ── Legend ──────────────────────────────────────────── */}
      <div
        className="mt-4 rounded-xl px-5 py-4"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
        }}
      >
        <div
          className="text-[10px] uppercase tracking-[1.5px] font-bold tabular-nums mb-3"
          style={{ color: 'var(--prizym-text-muted)' }}
        >
          Reservation Status
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {(
            Object.entries(STATUS_BAR_COLORS) as [ReservationStatus, string][]
          )
            .filter(([status]) => status !== 'closed')
            .map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div
                  className="w-4 h-2 rounded-sm"
                  style={{ background: color }}
                />
                <span
                  className="text-[11px]"
                  style={{ color: 'var(--prizym-text-secondary)' }}
                >
                  {STATUS_LABELS[status]}
                </span>
              </div>
            ))}
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-2 rounded-sm"
              style={{
                background: 'rgba(239, 68, 68, 0.3)',
                border: '1px solid #EF4444',
              }}
            />
            <span
              className="text-[11px]"
              style={{ color: 'var(--prizym-text-secondary)' }}
            >
              Conflict
            </span>
          </div>
        </div>
      </div>

      {/* ── Summary Stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <SummaryCard
          label="Assets Shown"
          value={String(visibleAssets.length)}
          accent="#2563EB"
        />
        <SummaryCard
          label="Active Reservations"
          value={String(allReservations.filter((r) => r.status !== 'closed').length)}
          accent="#0891B2"
        />
        <SummaryCard
          label="Conflicts"
          value={String(conflicts.length)}
          accent="#EF4444"
        />
        <SummaryCard
          label="Available Slots"
          value={String(
            visibleAssets.length * NUM_DAYS -
              Array.from(occupancy.values()).reduce((sum, entries) => {
                const inRange = entries.filter((e) => {
                  const ed = new Date(e.date);
                  return ed >= dates[0] && ed <= dates[dates.length - 1];
                });
                // Count unique dates
                return sum + new Set(inRange.map((e) => e.date)).size;
              }, 0),
          )}
          accent="#10B981"
        />
      </div>
    </>
  );
}

/* ── Summary Card ────────────────────────────────────────────── */

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="relative rounded-xl p-4 transition-shadow hover:shadow-lg"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
      }}
    >
      <div
        className="absolute top-3 left-0 w-[3px] h-6 rounded-r"
        style={{ background: accent }}
      />
      <div
        className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-1"
        style={{ color: 'var(--prizym-text-muted)' }}
      >
        {label}
      </div>
      <div
        className="text-xl font-bold"
        style={{
          color: 'var(--prizym-text-primary)',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {value}
      </div>
    </div>
  );
}
