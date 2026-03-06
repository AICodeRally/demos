'use client';

import { useState, useMemo } from 'react';

import {
  ASSETS,
  LOCATIONS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  STATUS_COLORS,
  type AssetCategory,
  type AssetStatus,
} from '@/data/equipr';
import { fmtDollar } from '@/lib/utils';

/* ── Status sort priority ─────────────────────────────── */
const STATUS_ORDER: Record<AssetStatus, number> = {
  overdue: 0,
  rented: 1,
  reserved: 2,
  maintenance: 3,
  available: 4,
};

const LOCATION_MAP: Record<string, string> = {
  orl: 'Orlando Central',
  tpa: 'Tampa Bay Yard',
  jax: 'Jacksonville Depot',
};

const CATEGORIES: (AssetCategory | 'all')[] = ['all', 'heavy', 'aerial', 'compaction', 'power', 'tools'];
const CATEGORY_TAB_LABELS: Record<string, string> = {
  all: 'All',
  heavy: 'Heavy',
  aerial: 'Aerial',
  compaction: 'Compaction',
  power: 'Power',
  tools: 'Tools',
};

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

export default function InventoryPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');

  const filtered = useMemo(() => {
    let result = [...ASSETS];
    if (selectedLocation !== 'all') {
      result = result.filter((a) => a.locationId === selectedLocation);
    }
    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.category === selectedCategory);
    }
    result.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
    return result;
  }, [selectedLocation, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const base = selectedLocation === 'all' ? ASSETS : ASSETS.filter((a) => a.locationId === selectedLocation);
    const counts: Record<string, number> = { all: base.length };
    for (const cat of ['heavy', 'aerial', 'compaction', 'power', 'tools'] as AssetCategory[]) {
      counts[cat] = base.filter((a) => a.category === cat).length;
    }
    return counts;
  }, [selectedLocation]);

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
          Fleet Inventory
        </h1>
        <span
          className="text-[12px] font-mono font-semibold px-2.5 py-1 rounded-lg"
          style={{
            background: 'rgba(37,99,235,0.12)',
            color: '#2563EB',
            border: '1px solid rgba(37,99,235,0.25)',
          }}
        >
          {filtered.length} assets
        </span>
      </div>
      <SourceBadge source="Point of Rental + Trackunit GPS" synced="2 min ago" />

      {/* ── Filter Bar ──────────────────────────────────── */}
      <div
        className="rounded-xl p-4 mb-5 flex flex-col lg:flex-row items-start lg:items-center gap-4"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
        }}
      >
        {/* Location dropdown */}
        <div className="flex items-center gap-2">
          <label
            className="text-[11px] uppercase tracking-[1px] font-mono font-semibold"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="text-[13px] font-medium rounded-lg px-3 py-1.5 outline-none cursor-pointer"
            style={{
              background: '#F9FAFB',
              color: 'var(--prizym-text-primary)',
              border: '1px solid var(--prizym-border-default)',
            }}
          >
            <option value="all">All Locations</option>
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const color = cat === 'all' ? '#2563EB' : CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: isActive ? `${color}20` : 'transparent',
                  color: isActive ? color : 'var(--prizym-text-secondary)',
                  border: isActive ? `1px solid ${color}40` : '1px solid transparent',
                }}
              >
                {CATEGORY_TAB_LABELS[cat]}{' '}
                <span
                  className="text-[10px] font-mono"
                  style={{ opacity: 0.7 }}
                >
                  {categoryCounts[cat]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr
                style={{
                  background: '#F9FAFB',
                  borderBottom: '1px solid var(--prizym-border-default)',
                }}
              >
                {['Asset ID', 'Name', 'Category', 'Location', 'Status', 'Daily Rate', 'Utilization', 'Last Inspection'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] font-mono font-semibold"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => {
                const statusColor = STATUS_COLORS[asset.status];
                const catColor = CATEGORY_COLORS[asset.category];
                const utilColor =
                  asset.utilizationPct >= 80
                    ? '#10B981'
                    : asset.utilizationPct >= 60
                      ? '#F59E0B'
                      : '#EF4444';

                return (
                  <tr
                    key={asset.id}
                    className="transition-colors"
                    style={{
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    {/* Asset ID */}
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-[12px]"
                        style={{ color: 'var(--prizym-text-secondary)' }}
                      >
                        {asset.id}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <span
                        className="font-semibold"
                        style={{ color: 'var(--prizym-text-primary)' }}
                      >
                        {asset.name}
                      </span>
                    </td>

                    {/* Category badge */}
                    <td className="px-4 py-3">
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: `${catColor}18`,
                          color: catColor,
                        }}
                      >
                        {CATEGORY_LABELS[asset.category]}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3">
                      <span style={{ color: 'var(--prizym-text-secondary)' }}>
                        {LOCATION_MAP[asset.locationId] ?? asset.locationId}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ background: statusColor }}
                        />
                        <span
                          className="text-[12px] capitalize"
                          style={{ color: statusColor }}
                        >
                          {asset.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>

                    {/* Daily Rate */}
                    <td className="px-4 py-3">
                      <span
                        className="font-mono font-medium"
                        style={{ color: 'var(--prizym-text-primary)' }}
                      >
                        {fmtDollar(asset.dailyRate)}
                      </span>
                    </td>

                    {/* Utilization */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-[50px] h-[6px] rounded-full overflow-hidden"
                          style={{ background: '#E5E7EB' }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${asset.utilizationPct}%`,
                              background: utilColor,
                            }}
                          />
                        </div>
                        <span
                          className="text-[11px] font-mono"
                          style={{ color: utilColor }}
                        >
                          {asset.utilizationPct}%
                        </span>
                      </div>
                    </td>

                    {/* Last Inspection */}
                    <td className="px-4 py-3">
                      <span
                        className="text-[12px]"
                        style={{ color: 'var(--prizym-text-muted)' }}
                      >
                        {new Date(asset.lastInspection).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div
            className="text-center py-12 text-[13px]"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            No assets match the current filters.
          </div>
        )}
      </div>
    </>
  );
}
