'use client';

import { StatCard, DonutChart, BarChart } from '@/components/demos/wellspring';
import { WATER_DISPOSAL, EMISSIONS } from '@/data/wellspring';

/* ── Water disposal donut ─────────────────────────────── */

const totalWater = WATER_DISPOSAL.reduce((s, w) => s + w.volumeBwpd, 0);
const recycleRate = WATER_DISPOSAL.filter((w) => w.method === 'Recycling')
  .reduce((s, w) => s + w.volumeBwpd, 0) / totalWater;

const waterSegments = [
  { label: 'SWD Injection', value: 4200, color: '#2563EB' },
  { label: 'Recycling', value: 600, color: '#059669' },
  { label: 'Evaporation', value: 200, color: '#EAB308' },
];

/* ── Emissions bar chart ──────────────────────────────── */

const emissionsBarData = EMISSIONS.map((e) => ({
  label: e.category,
  value: e.tonsPerYear,
  color:
    e.percentOfLimit > 0.4
      ? '#EA580C'
      : e.percentOfLimit > 0.2
        ? '#EAB308'
        : '#059669',
}));

/* ── Disposal well table data ─────────────────────────── */

const DISPOSAL_WELLS = [
  { name: 'PBR SWD #1', type: 'Operated SWD', capacity: 3000, utilization: 80, lastInspection: '2026-02-15' },
  { name: 'Clearwater Disposal', type: '3rd Party SWD', capacity: 2500, utilization: 72, lastInspection: '2026-01-28' },
  { name: 'PBR Recycle Facility', type: 'Recycling', capacity: 800, utilization: 75, lastInspection: '2026-02-20' },
  { name: 'Mustang Evap Pond', type: 'Evaporation', capacity: 300, utilization: 67, lastInspection: '2026-02-10' },
];

export default function HseEnvironmentalPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase mb-1"
          style={{ color: '#DC2626' }}
        >
          Act 5 &middot; HSE Officer
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: '#F1F5F9' }}>
          Environmental
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Water management, emissions monitoring &amp; disposal compliance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Water Recycling Rate"
          value={`${(recycleRate * 100).toFixed(0)}%`}
          trend="up"
          trendValue="+2%"
          color="#059669"
          sparkline={[8, 9, 10, 10, 11, 12]}
        />
        <StatCard
          label="Emissions Intensity"
          value="12.4 kg/BOE"
          trend="down"
          trendValue="-0.8"
          color="#059669"
          sparkline={[14.2, 13.8, 13.4, 13.0, 12.6, 12.4]}
        />
        <StatCard
          label="Spill Count (YTD)"
          value="0"
          trend="flat"
          trendValue="zero incidents"
          color="#059669"
        />
        <StatCard
          label="Disposal Well Capacity"
          value="82%"
          trend="flat"
          trendValue="avg utilization"
          color="#DC2626"
          sparkline={[78, 79, 80, 81, 82, 82]}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Water Disposal Donut */}
        <div
          className="rounded-xl border p-5 flex flex-col items-center"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3 className="text-sm font-semibold mb-1 self-start" style={{ color: '#F1F5F9' }}>
            Water Disposal Method
          </h3>
          <p className="text-[11px] mb-4 self-start" style={{ color: '#64748B' }}>
            {totalWater.toLocaleString()} BWPD total produced water
          </p>
          <DonutChart
            segments={waterSegments}
            centerValue={`${totalWater.toLocaleString()}`}
            centerLabel="BWPD"
            size={220}
          />
        </div>

        {/* Emissions by Source */}
        <div
          className="rounded-xl border p-5"
          style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
            Emissions by Source
          </h3>
          <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
            Annual tons — color indicates proximity to permit limit
          </p>
          <BarChart data={emissionsBarData} unit=" tpy" />
        </div>
      </div>

      {/* Disposal Well Status Table */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Disposal Well Status
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          Capacity, utilization &amp; inspection schedule
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Facility</th>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Type</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Capacity (BWPD)</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Utilization</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Last Inspection</th>
              </tr>
            </thead>
            <tbody>
              {DISPOSAL_WELLS.map((well, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #252B36' }}>
                  <td className="py-2 font-medium" style={{ color: '#F1F5F9' }}>{well.name}</td>
                  <td className="py-2" style={{ color: '#CBD5E1' }}>{well.type}</td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#CBD5E1' }}>
                    {well.capacity.toLocaleString()}
                  </td>
                  <td className="py-2 text-right">
                    <span
                      className="font-bold tabular-nums"
                      style={{ color: well.utilization > 85 ? '#DC2626' : well.utilization > 70 ? '#EAB308' : '#059669' }}
                    >
                      {well.utilization}%
                    </span>
                  </td>
                  <td className="py-2 text-right tabular-nums" style={{ color: '#94A3B8' }}>
                    {well.lastInspection}
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
