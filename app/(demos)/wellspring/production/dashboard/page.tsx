'use client';

import { StatCard, AreaChart, BarChart, DonutChart } from '@/components/demos/wellspring';

/* ── Inline mock data ─────────────────────────────────── */

const THIRTY_DAY_TREND = Array.from({ length: 30 }, (_, i) => {
  const d = new Date('2026-02-02');
  d.setDate(d.getDate() + i);
  const base = 1847;
  const noise = Math.sin(i * 0.3) * 60 + Math.cos(i * 0.5) * 30;
  return {
    label: `${d.getMonth() + 1}/${d.getDate()}`,
    value: Math.round(base + noise),
  };
});

const PAD_PRODUCTION = [
  { label: 'Diamondback', value: 893, color: '#7C3AED' },
  { label: 'Sidewinder', value: 522, color: '#2563EB' },
  { label: 'Rattlesnake', value: 298, color: '#EA580C' },
  { label: 'Mustang', value: 134, color: '#16A34A' },
];

const LIFT_TYPE_SEGMENTS = [
  { label: 'Rod Pump', value: 24, color: '#B45309' },
  { label: 'ESP', value: 14, color: '#7C3AED' },
  { label: 'Gas Lift', value: 13, color: '#2563EB' },
  { label: 'Natural Flow', value: 9, color: '#16A34A' },
];

export default function ProductionDashboardPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-mono mb-1"
          style={{ color: '#B45309' }}
        >
          Act 3 &middot; Production Operations
        </div>
        <h1
          className="text-2xl font-extrabold"
          style={{ color: '#F1F5F9' }}
        >
          Production Dashboard
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Permian Basin &middot; Reeves &amp; Pecos Counties &middot; 60
          wells across 4 pads
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total BOE/d"
          value="1,847"
          trend="up"
          trendValue="+3.2%"
          sparkline={[1790, 1810, 1825, 1840, 1830, 1847]}
        />
        <StatCard
          label="Water Cut"
          value="34%"
          trend="up"
          trendValue="+0.8%"
          color="#DC2626"
          sparkline={[31, 32, 32.5, 33, 33.5, 34]}
        />
        <StatCard
          label="Gas-Oil Ratio"
          value="2.1"
          trend="flat"
          trendValue="Mcf/bbl"
          sparkline={[2.0, 2.1, 2.05, 2.1, 2.08, 2.1]}
        />
        <StatCard
          label="Active Wells"
          value="54/60"
          trend="down"
          trendValue="6 offline"
          sparkline={[56, 55, 55, 54, 54, 54]}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* 30-Day Production Trend */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3
            className="text-sm font-semibold mb-1"
            style={{ color: '#F1F5F9' }}
          >
            30-Day Production Trend
          </h3>
          <p
            className="text-[11px] mb-4"
            style={{ color: '#64748B' }}
          >
            Total BOE/d across all pads
          </p>
          <AreaChart
            data={THIRTY_DAY_TREND}
            color="#B45309"
            height={220}
            showDots={false}
          />
        </div>

        {/* Production by Pad */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3
            className="text-sm font-semibold mb-1"
            style={{ color: '#F1F5F9' }}
          >
            Production by Pad
          </h3>
          <p
            className="text-[11px] mb-4"
            style={{ color: '#64748B' }}
          >
            Current daily BOE by pad location
          </p>
          <BarChart data={PAD_PRODUCTION} unit=" BOE/d" />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lift Type Distribution */}
        <div
          className="rounded-xl border p-5 flex flex-col items-center"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3
            className="text-sm font-semibold mb-1 self-start"
            style={{ color: '#F1F5F9' }}
          >
            Production by Lift Type
          </h3>
          <p
            className="text-[11px] mb-4 self-start"
            style={{ color: '#64748B' }}
          >
            Active wells by artificial lift method
          </p>
          <DonutChart
            segments={LIFT_TYPE_SEGMENTS}
            centerValue="60"
            centerLabel="total wells"
            size={200}
          />
        </div>

        {/* Key Metrics Summary */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: '#F1F5F9' }}
          >
            Key Metrics
          </h3>
          <div className="space-y-3">
            {[
              {
                label: 'Avg Oil Rate',
                value: '30.8 bopd/well',
                note: 'Flowing wells only',
              },
              {
                label: 'Avg Gas Rate',
                value: '68.2 Mcfd/well',
                note: 'GOR 2.1:1',
              },
              {
                label: 'LOE / BOE',
                value: '$12.40',
                note: 'Target < $14.00',
              },
              {
                label: 'Uptime',
                value: '94.2%',
                note: 'Last 30 days',
              },
              {
                label: 'SCADA Coverage',
                value: '52/60 wells',
                note: '87% telemetry',
              },
              {
                label: 'Flowback Wells',
                value: '1',
                note: 'Copperhead 18-1H (new completion)',
              },
            ].map((metric, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid #252B36' }}
              >
                <div>
                  <div
                    className="text-[12px] font-medium"
                    style={{ color: '#CBD5E1' }}
                  >
                    {metric.label}
                  </div>
                  <div
                    className="text-[10px]"
                    style={{ color: '#64748B' }}
                  >
                    {metric.note}
                  </div>
                </div>
                <div
                  className="text-sm font-bold font-mono"
                  style={{ color: '#F1F5F9' }}
                >
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
