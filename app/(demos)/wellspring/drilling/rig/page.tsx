'use client';

import { StatCard, BarChart, AreaChart } from '@/components/demos/wellspring';

/* ── ROP by section ──────────────────────────────────── */

const ROP_BY_SECTION = [
  { label: 'Surface', value: 85, color: '#94A3B8' },
  { label: 'Intermediate', value: 120, color: '#6B7280' },
  { label: 'Curve', value: 95, color: '#2563EB' },
  { label: 'Lateral', value: 142, color: '#059669' },
];

/* ── 24-hour ROP trend ───────────────────────────────── */

const ROP_TREND_24H = Array.from({ length: 24 }, (_, i) => {
  const base = 290;
  const noise = Math.sin(i * 0.4) * 30 + Math.cos(i * 0.7) * 15;
  const dip = i >= 2 && i <= 5 ? -200 : 0; // trip to surface window
  return {
    label: `${String(i).padStart(2, '0')}:00`,
    value: Math.max(0, Math.round(base + noise + dip)),
  };
});

/* ── Equipment status cards ──────────────────────────── */

const EQUIPMENT = [
  { name: 'BHA', status: 'Good', detail: 'BHA #4 — Motor + MWD + RSS', color: '#059669' },
  { name: 'Mud System', status: 'Circulating', detail: '10.2 ppg OBM — 2 shakers online', color: '#059669' },
  { name: 'Top Drive', status: 'Rotating', detail: '142 RPM — torque 12,400 ft-lbs', color: '#059669' },
];

export default function RigDashboardPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-semibold mb-1"
          style={{ color: '#6B7280' }}
        >
          Act 2 &middot; Drilling Superintendent
        </div>
        <h1
          className="text-3xl font-extrabold"
          style={{ color: '#F1F5F9' }}
        >
          Rig Dashboard
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Rig 47 (Patterson-UTI) &middot; PBR Federal 24-1H &middot; Real-time
          parameters
        </p>
      </div>

      {/* 6 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard
          label="Depth"
          value="8,420 ft"
          trend="up"
          trendValue="of 12,800 TD"
          color="#6B7280"
          sparkline={[7800, 7900, 8100, 8200, 8350, 8420]}
        />
        <StatCard
          label="ROP"
          value="310 ft/hr"
          trend="up"
          trendValue="+25 ft/hr"
          color="#6B7280"
          sparkline={[260, 270, 285, 290, 300, 310]}
        />
        <StatCard
          label="WOB"
          value="32 klbs"
          trend="flat"
          trendValue="target 30-35"
          color="#6B7280"
        />
        <StatCard
          label="Torque"
          value="12,400 ft-lbs"
          trend="flat"
          trendValue="normal"
          color="#6B7280"
        />
        <StatCard
          label="Pump Pressure"
          value="3,250 psi"
          trend="flat"
          trendValue="SPP stable"
          color="#6B7280"
          sparkline={[3180, 3200, 3220, 3240, 3250, 3250]}
        />
        <StatCard
          label="Mud Weight"
          value="10.2 ppg"
          trend="flat"
          trendValue="OBM"
          color="#6B7280"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* ROP by Section */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3
            className="text-sm font-semibold mb-1"
            style={{ color: '#F1F5F9' }}
          >
            ROP by Section
          </h3>
          <p
            className="text-[11px] mb-4"
            style={{ color: '#64748B' }}
          >
            Average rate of penetration per hole section (ft/hr)
          </p>
          <BarChart data={ROP_BY_SECTION} unit=" ft/hr" />
        </div>

        {/* 24h ROP Trend */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3
            className="text-sm font-semibold mb-1"
            style={{ color: '#F1F5F9' }}
          >
            24-Hour ROP Trend
          </h3>
          <p
            className="text-[11px] mb-4"
            style={{ color: '#64748B' }}
          >
            Instantaneous ROP — dip at 02:00-05:00 = trip for BHA change
          </p>
          <AreaChart
            data={ROP_TREND_24H}
            color="#6B7280"
            height={220}
            showDots={false}
          />
        </div>
      </div>

      {/* Equipment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {EQUIPMENT.map((eq) => (
          <div
            key={eq.name}
            className="rounded-xl border p-5"
            style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: eq.color }}
              />
              <h3
                className="text-sm font-semibold"
                style={{ color: '#F1F5F9' }}
              >
                {eq.name}
              </h3>
            </div>
            <p
              className="text-lg font-bold mb-1"
              style={{ color: eq.color }}
            >
              {eq.status}
            </p>
            <p className="text-[11px]" style={{ color: '#94A3B8' }}>
              {eq.detail}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
