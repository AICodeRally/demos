'use client';

import { useState } from 'react';
import { StatCard, BarChart, DonutChart } from '@/components/demos/crestline';
import { ACHIEVER_TIERS, ASSOCIATES, COLORS } from '@/data/crestline';

/* Pre-compute associate data */
const enriched = ASSOCIATES.map((a) => {
  const attainment = Math.round((a.ytdSales / a.ytdTarget) * 100);
  const tier = ACHIEVER_TIERS.find((t) => t.id === a.achieverTier)!;
  const nextTier = ACHIEVER_TIERS.find((t) => t.threshold > tier.threshold);
  const distanceToNext = nextTier
    ? Math.max(0, Math.round(a.ytdTarget * (nextTier.threshold / 100) - a.ytdSales))
    : 0;
  return { ...a, attainment, tier, nextTier, distanceToNext };
}).sort((a, b) => b.ytdSales - a.ytdSales);

/* Percentile ranking */
const ranked = enriched.map((a, i) => ({
  ...a,
  percentile: Math.round(((enriched.length - i) / enriched.length) * 100),
}));

/* Tier counts */
const tierCounts = ACHIEVER_TIERS.map((t) => ({
  ...t,
  count: ASSOCIATES.filter((a) => a.achieverTier === t.id).length,
}));

/* Donut data */
const donutData = tierCounts.map((t) => ({
  label: t.label,
  value: t.count,
  color: t.color,
}));

/* Bar chart data — attainment by associate */
const attainmentBarData = ranked.map((a) => ({
  label: a.name.split(' ')[0],
  value: a.attainment,
  color: a.tier.color,
}));

/* Sales performance bar data — sorted by YTD sales */
const salesBarData = ranked.map((a) => ({
  label: a.name.split(' ')[0],
  value: Math.round(a.ytdSales / 1000),
  color: a.tier.color,
}));

/* 6-month tier progression for selected rep */
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
function getTierProgression(repId: string) {
  const rep = ASSOCIATES.find((a) => a.id === repId)!;
  const target = rep.ytdTarget;
  /* Simulate monthly accumulation */
  const monthlyRate = rep.ytdSales / 6;
  return MONTHS.map((month, i) => {
    const cumSales = monthlyRate * (i + 1);
    const pct = Math.round((cumSales / target) * 100);
    let tierId: string = 'none';
    for (const t of [...ACHIEVER_TIERS].reverse()) {
      if (pct >= t.threshold && t.threshold > 0) { tierId = t.id; break; }
    }
    if (pct < 80) tierId = 'none';
    const tier = ACHIEVER_TIERS.find((t) => t.id === tierId)!;
    return { month, pct, tier, cumSales: Math.round(cumSales) };
  });
}

export default function AchieverProgram() {
  const [selectedRep, setSelectedRep] = useState('a1');
  const progression = getTierProgression(selectedRep);
  const selectedAssoc = ASSOCIATES.find((a) => a.id === selectedRep)!;

  const platCount = tierCounts.find((t) => t.id === 'platinum')?.count ?? 0;
  const goldCount = tierCounts.find((t) => t.id === 'gold')?.count ?? 0;
  const silverCount = tierCounts.find((t) => t.id === 'silver')?.count ?? 0;
  const noneCount = tierCounts.find((t) => t.id === 'none')?.count ?? 0;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Achiever Program</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Tier progression, percentile ranking, and additive commission rates
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Platinum" value={String(platCount)} color={COLORS.platinum} />
        <StatCard label="Gold" value={String(goldCount)} color={COLORS.gold} />
        <StatCard label="Silver" value={String(silverCount)} color={COLORS.silver} />
        <StatCard label="Not Qualified" value={String(noneCount)} color="#64748b" />
      </div>

      {/* Tier Overview Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {tierCounts.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border-2 p-5"
            style={{ borderColor: t.color, backgroundColor: `${t.color}08` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color: COLORS.primary }}>{t.label}</span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: `${t.color}20`, color: t.color }}
              >
                {t.count} reps
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94a3b8' }}>Threshold</span>
                <span className="font-mono font-semibold" style={{ color: COLORS.primary }}>
                  {t.threshold > 0 ? `${t.threshold}%` : '--'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94a3b8' }}>Additive Rate</span>
                <span className="font-mono font-semibold" style={{ color: t.color }}>
                  {t.additiveRate > 0 ? `+${(t.additiveRate * 100).toFixed(1)}%` : '--'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Associate Progress Table */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: COLORS.primary }}>
          Associate Progress & Ranking
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ color: '#94a3b8' }}>
                <th className="text-left pb-3 font-medium">Rank</th>
                <th className="text-left pb-3 font-medium">Associate</th>
                <th className="text-right pb-3 font-medium">YTD Sales</th>
                <th className="text-right pb-3 font-medium">Target</th>
                <th className="text-right pb-3 font-medium">Attainment</th>
                <th className="text-center pb-3 font-medium">Tier</th>
                <th className="text-right pb-3 font-medium">Percentile</th>
                <th className="text-right pb-3 font-medium">To Next Tier</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((a, i) => (
                <tr
                  key={a.id}
                  className="border-t cursor-pointer hover:bg-slate-50 transition-colors"
                  style={{ borderColor: '#F1F5F9', backgroundColor: selectedRep === a.id ? `${a.tier.color}06` : undefined }}
                  onClick={() => setSelectedRep(a.id)}
                >
                  <td className="py-2.5 font-mono font-medium" style={{ color: '#94a3b8' }}>#{i + 1}</td>
                  <td className="py-2.5">
                    <div>
                      <span className="font-medium" style={{ color: COLORS.primary }}>{a.name}</span>
                      <span className="ml-2 text-[10px]" style={{ color: '#94a3b8' }}>{a.storeId}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold" style={{ color: COLORS.primary }}>
                    ${(a.ytdSales / 1000).toFixed(0)}K
                  </td>
                  <td className="py-2.5 text-right font-mono" style={{ color: '#94a3b8' }}>
                    ${(a.ytdTarget / 1000).toFixed(0)}K
                  </td>
                  <td className="py-2.5 text-right">
                    <span
                      className="font-mono font-bold"
                      style={{ color: a.attainment >= 100 ? '#059669' : a.attainment >= 80 ? COLORS.accent : '#ef4444' }}
                    >
                      {a.attainment}%
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${a.tier.color}20`, color: a.tier.color }}
                    >
                      {a.tier.label}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="font-mono" style={{ color: '#475569' }}>P{a.percentile}</span>
                  </td>
                  <td className="py-2.5 text-right font-mono" style={{ color: a.nextTier ? '#475569' : '#94a3b8' }}>
                    {a.nextTier ? `$${(a.distanceToNext / 1000).toFixed(0)}K` : '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Attainment vs Target Bar Chart */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: COLORS.primary }}>
            Attainment vs Target (%)
          </p>
          <BarChart data={attainmentBarData} unit="%" maxVal={140} />
        </div>

        {/* Tier Distribution Donut */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: COLORS.primary }}>
            Tier Distribution
          </p>
          <DonutChart
            segments={donutData}
            centerValue={String(ASSOCIATES.length)}
            centerLabel="Associates"
            size={200}
          />
        </div>
      </div>

      {/* Percentile Ranking + Tier Progression */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Percentile Bar Chart */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: COLORS.primary }}>
            Sales Performance Ranking ($K YTD)
          </p>
          <BarChart data={salesBarData} unit="K" />
        </div>

        {/* Tier Progression Timeline */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: COLORS.primary }}>
            Tier Progression Timeline
          </p>
          <p className="text-[11px] mb-4" style={{ color: '#94a3b8' }}>
            {selectedAssoc.name} — 6-month simulated trajectory
          </p>

          <div className="flex items-end gap-3 h-48">
            {progression.map((p) => {
              const maxPct = 140;
              const barHeight = Math.min((p.pct / maxPct) * 100, 100);
              return (
                <div key={p.month} className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] font-mono mb-1" style={{ color: p.tier.color }}>
                    {p.pct}%
                  </span>
                  <div className="w-full flex items-end" style={{ height: '140px' }}>
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${barHeight}%`,
                        backgroundColor: p.tier.color,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                  <span className="text-[10px] mt-1" style={{ color: '#94a3b8' }}>{p.month}</span>
                  <span
                    className="text-[8px] font-bold px-1 rounded mt-0.5"
                    style={{ backgroundColor: `${p.tier.color}20`, color: p.tier.color }}
                  >
                    {p.tier.label === 'Not Qualified' ? 'NQ' : p.tier.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tier threshold lines (legend) */}
          <div className="flex gap-4 mt-4 pt-3 border-t" style={{ borderColor: '#F1F5F9' }}>
            {ACHIEVER_TIERS.filter((t) => t.threshold > 0).map((t) => (
              <div key={t.id} className="flex items-center gap-1.5 text-[10px]">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                <span style={{ color: '#475569' }}>{t.label}</span>
                <span className="font-mono" style={{ color: '#94a3b8' }}>{t.threshold}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
