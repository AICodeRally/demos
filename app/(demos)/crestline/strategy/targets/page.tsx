'use client';

import { useState } from 'react';
import { StatCard, BarChart, HeatMap, FormatSelector } from '@/components/demos/crestline';
import { DISTRICTS, ASSOCIATES, ACHIEVER_TIERS, COLORS } from '@/data/crestline';

/* ── Derived data ────────────────────────────────────────── */

const totalQuota = DISTRICTS.reduce((s, d) => s + d.quota, 0);
const avgAttainment = Math.round(ASSOCIATES.reduce((s, a) => s + (a.ytdSales / a.ytdTarget) * 100, 0) / ASSOCIATES.length);

const tierCounts = ACHIEVER_TIERS.map((tier) => ({
  ...tier,
  count: ASSOCIATES.filter((a) => a.achieverTier === tier.id).length,
}));

// Associate attainment bar data
const ASSOCIATE_ATTAINMENT = ASSOCIATES.map((a) => ({
  label: a.name.split(' ')[0],
  value: Math.round((a.ytdSales / a.ytdTarget) * 100),
  color: a.achieverTier === 'platinum' ? COLORS.platinum : a.achieverTier === 'gold' ? COLORS.gold : a.achieverTier === 'silver' ? COLORS.silver : '#64748b',
}));

// Quota allocation by district
const DISTRICT_QUOTA_DATA = DISTRICTS.map((d) => ({
  label: d.name,
  value: d.quota,
  color: COLORS.accent,
}));

// HeatMap: Districts x Months attainment
const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
const DISTRICT_MONTHLY_ATTAINMENT = [
  [92, 88, 94, 90, 86, 98, 95, 91, 88, 102, 108, 93],
  [90, 86, 92, 88, 84, 96, 93, 89, 86, 100, 106, 91],
  [88, 84, 90, 86, 82, 94, 91, 87, 84, 98, 104, 89],
  [90, 86, 92, 88, 84, 96, 93, 89, 86, 100, 106, 91],
  [94, 90, 96, 92, 88, 100, 97, 93, 90, 104, 110, 95],
  [92, 88, 94, 90, 86, 98, 95, 91, 88, 102, 108, 93],
  [91, 87, 93, 89, 85, 97, 94, 90, 87, 101, 107, 92],
  [93, 89, 95, 91, 87, 99, 96, 92, 89, 103, 109, 94],
];

// Format-specific quota breakdown
const FORMAT_QUOTAS: Record<string, { name: string; store: string; quota: string; actual: string; attainment: number; pacing: string }[]> = {
  flagship: [
    { name: 'Elena Vasquez', store: 'F-001', quota: '$750K', actual: '$892K', attainment: 119, pacing: 'Ahead' },
    { name: 'Marcus Chen', store: 'F-003', quota: '$720K', actual: '$745K', attainment: 103, pacing: 'On Track' },
    { name: 'James Park', store: 'F-002', quota: '$700K', actual: '$680K', attainment: 97, pacing: 'On Track' },
    { name: 'Priya Sharma', store: 'F-005', quota: '$800K', actual: '$920K', attainment: 115, pacing: 'Ahead' },
  ],
  standard: [
    { name: 'Diana Okafor', store: 'S-015', quota: '$380K', actual: '$410K', attainment: 108, pacing: 'On Track' },
    { name: 'Sarah Kim', store: 'S-042', quota: '$350K', actual: '$285K', attainment: 81, pacing: 'At Risk' },
    { name: 'Tyler Morrison', store: 'S-028', quota: '$340K', actual: '$310K', attainment: 91, pacing: 'On Track' },
  ],
  rack: [
    { name: 'Roberto Diaz', store: 'R-008', quota: '$180K', actual: '$195K', attainment: 108, pacing: 'On Track' },
    { name: 'Chris Nakamura', store: 'R-012', quota: '$160K', actual: '$145K', attainment: 91, pacing: 'On Track' },
  ],
  counter: [
    { name: 'Aisha Thompson', store: 'C-005', quota: '$300K', actual: '$320K', attainment: 107, pacing: 'On Track' },
  ],
};

function pacingColor(pacing: string) {
  if (pacing === 'Ahead') return '#10B981';
  if (pacing === 'On Track') return COLORS.standard;
  if (pacing === 'At Risk') return '#F59E0B';
  return '#EF4444';
}

export default function TargetsAndQuotas() {
  const [format, setFormat] = useState<string>('flagship');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Targets & Quotas</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          ${totalQuota}M corporate target cascading through districts, formats, and achiever tiers
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Quota" value={`$${totalQuota}M`} color={COLORS.primary} />
        <StatCard label="Avg Attainment" value={`${avgAttainment}%`} trend="up" trendValue="+4pp YoY" color="#10B981" />
        <StatCard label="Platinum Achievers" value={String(tierCounts.find((t) => t.id === 'platinum')?.count ?? 0)} color={COLORS.platinum} />
        <StatCard label="Gold Achievers" value={String(tierCounts.find((t) => t.id === 'gold')?.count ?? 0)} color={COLORS.gold} />
      </div>

      {/* Achiever Tier Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {ACHIEVER_TIERS.map((tier) => {
          const count = ASSOCIATES.filter((a) => a.achieverTier === tier.id).length;
          return (
            <div key={tier.id} className="rounded-xl bg-white border p-4" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>{tier.label}</span>
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: tier.color }}>{tier.threshold}%</p>
              <p className="text-[10px]" style={{ color: '#94A3B8' }}>Attainment Threshold</p>
              <div className="mt-2 flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Associates</span>
                <span className="font-mono font-medium" style={{ color: '#0F172A' }}>{count}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span style={{ color: '#94A3B8' }}>Additive Rate</span>
                <span className="font-mono font-medium" style={{ color: tier.color }}>{(tier.additiveRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attainment Bar + Quota by District */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Associate Attainment vs Target (%)
          </p>
          <BarChart data={ASSOCIATE_ATTAINMENT} unit="%" />
          <div className="flex justify-center gap-4 mt-3">
            {ACHIEVER_TIERS.filter((t) => t.id !== 'none').map((t) => (
              <div key={t.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-[10px]" style={{ color: '#94A3B8' }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Quota Allocation by District ($M)
          </p>
          <BarChart data={DISTRICT_QUOTA_DATA} unit="M" />
        </div>
      </div>

      {/* District x Month Attainment HeatMap */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          District Attainment by Month (% of target)
        </p>
        <HeatMap
          rows={DISTRICTS.map((d) => d.name)}
          cols={MONTHS}
          data={DISTRICT_MONTHLY_ATTAINMENT}
          colorScale={{ low: '#EF4444', mid: '#F59E0B', high: '#10B981' }}
        />
      </div>

      {/* Rep Quota Table */}
      <FormatSelector selected={format} onSelect={setFormat} />

      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Associate Quotas — {format.charAt(0).toUpperCase() + format.slice(1)}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                {['Name', 'Store', 'Quota', 'Actual', 'Attainment', 'Pacing'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-semibold" style={{ color: '#94A3B8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(FORMAT_QUOTAS[format] ?? []).map((r) => (
                <tr key={r.name} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="py-2 px-3 font-medium" style={{ color: '#0F172A' }}>{r.name}</td>
                  <td className="py-2 px-3" style={{ color: '#475569' }}>{r.store}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: '#0F172A' }}>{r.quota}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: '#0F172A' }}>{r.actual}</td>
                  <td className="py-2 px-3 font-mono font-semibold" style={{ color: r.attainment >= 100 ? '#10B981' : r.attainment >= 90 ? COLORS.standard : '#EF4444' }}>
                    {r.attainment}%
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `${pacingColor(r.pacing)}18`, color: pacingColor(r.pacing) }}
                    >
                      {r.pacing}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
