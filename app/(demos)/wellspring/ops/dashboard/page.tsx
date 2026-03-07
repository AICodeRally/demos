'use client';

import { StatCard, AreaChart, BarChart, SparklineRow } from '@/components/demos/wellspring';
import { PADS } from '@/data/wellspring';

/* ── Inline mock data ─────────────────────────────────── */

const THIRTY_DAY_TREND = Array.from({ length: 30 }, (_, i) => {
  const d = new Date('2026-02-02');
  d.setDate(d.getDate() + i);
  const base = 1800;
  const ramp = i * 1.6;
  const noise = Math.sin(i * 0.4) * 25 + Math.cos(i * 0.7) * 15;
  return {
    label: `${d.getMonth() + 1}/${d.getDate()}`,
    value: Math.round(base + ramp + noise),
  };
});

const PAD_PRODUCTION = PADS.map((p) => ({
  label: p.name.replace(' Pad', ''),
  value: p.avgOilBpd * p.activeWells,
  color:
    p.id === 'pad-a'
      ? '#16A34A'
      : p.id === 'pad-b'
        ? '#EA580C'
        : p.id === 'pad-c'
          ? '#2563EB'
          : '#7C3AED',
}));

const TOP_WELLS = [
  { name: 'Diamondback 1-1H', oil: 248, gas: 520, pad: 'Diamondback', spark: [220, 230, 245, 240, 248, 248] },
  { name: 'Diamondback 2-1H', oil: 215, gas: 445, pad: 'Diamondback', spark: [190, 200, 208, 210, 215, 215] },
  { name: 'Diamondback 3-2H', oil: 192, gas: 410, pad: 'Diamondback', spark: [180, 185, 188, 190, 192, 192] },
  { name: 'Sidewinder 5-1H', oil: 178, gas: 368, pad: 'Sidewinder', spark: [165, 170, 172, 175, 178, 178] },
  { name: 'Sidewinder 3-1H', oil: 156, gas: 330, pad: 'Sidewinder', spark: [140, 148, 150, 152, 156, 156] },
  { name: 'Sidewinder 7-2H', oil: 142, gas: 298, pad: 'Sidewinder', spark: [130, 135, 138, 140, 142, 142] },
  { name: 'Rattlesnake 8-1H', oil: 118, gas: 248, pad: 'Rattlesnake', spark: [105, 110, 112, 115, 118, 118] },
  { name: 'Rattlesnake 12-2H', oil: 95, gas: 202, pad: 'Rattlesnake', spark: [88, 90, 92, 94, 95, 95] },
  { name: 'Mustang 4-1H', oil: 62, gas: 132, pad: 'Mustang', spark: [55, 58, 60, 61, 62, 62] },
  { name: 'Mustang 11-2H', oil: 48, gas: 98, pad: 'Mustang', spark: [42, 44, 45, 47, 48, 48] },
];

export default function OpsDashboardPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-mono mb-1"
          style={{ color: '#0D9488' }}
        >
          Act 4 &middot; Operations Manager
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#F1F5F9' }}>
          Field Dashboard
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Permian Basin &middot; 60 wells across 4 pads &middot; Real-time field overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total BOE/d"
          value="1,847"
          trend="up"
          trendValue="+3.2%"
          color="#0D9488"
          sparkline={[1790, 1810, 1825, 1840, 1830, 1847]}
        />
        <StatCard
          label="LOE / BOE"
          value="$12.40"
          trend="down"
          trendValue="-$0.60"
          color="#059669"
          sparkline={[13.80, 13.40, 13.00, 12.80, 12.60, 12.40]}
        />
        <StatCard
          label="Well Count"
          value="60"
          trend="flat"
          trendValue="54 active"
          color="#0D9488"
          sparkline={[58, 59, 60, 60, 60, 60]}
        />
        <StatCard
          label="Uptime"
          value="94.2%"
          trend="up"
          trendValue="+1.1%"
          color="#0D9488"
          sparkline={[91.5, 92.0, 93.1, 93.8, 94.0, 94.2]}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
            30-Day Field Production Trend
          </h3>
          <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
            Total BOE/d — gradual ramp from new completions
          </p>
          <AreaChart data={THIRTY_DAY_TREND} color="#0D9488" height={220} showDots={false} />
        </div>

        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
            Production by Pad
          </h3>
          <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
            Current daily BOE by pad location
          </p>
          <BarChart data={PAD_PRODUCTION} unit=" BOE/d" />
        </div>
      </div>

      {/* Top Wells Table */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Top 10 Wells by Production
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          Ranked by oil rate (bopd) — 7-day sparkline
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>#</th>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Well</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Oil (bpd)</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Gas (Mcfd)</th>
                <th className="text-left py-2 font-medium pl-4" style={{ color: '#94A3B8' }}>Pad</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {TOP_WELLS.map((w, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #252B36' }}>
                  <td className="py-2 font-mono" style={{ color: '#64748B' }}>{i + 1}</td>
                  <td className="py-2 font-medium" style={{ color: '#F1F5F9' }}>{w.name}</td>
                  <td className="py-2 text-right font-mono font-bold" style={{ color: '#0D9488' }}>
                    {w.oil}
                  </td>
                  <td className="py-2 text-right font-mono" style={{ color: '#CBD5E1' }}>
                    {w.gas}
                  </td>
                  <td className="py-2 pl-4" style={{ color: '#94A3B8' }}>{w.pad}</td>
                  <td className="py-2 text-right">
                    <div className="flex justify-end">
                      <SparklineRow data={w.spark} color="#0D9488" width={60} height={18} />
                    </div>
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
