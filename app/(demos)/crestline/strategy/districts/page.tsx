'use client';

import { useState } from 'react';
import { StatCard, BarChart, DonutChart, RadarChart, HeatMap, FormatSelector } from '@/components/demos/crestline';
import { DISTRICTS, FORMATS, COLORS } from '@/data/crestline';

/* ── Derived data ────────────────────────────────────────── */

const DISTRICT_BAR_DATA = DISTRICTS.map((d) => ({
  label: d.name,
  value: d.revenue.flagship + d.revenue.standard + d.revenue.rack + d.revenue.counter,
  color: COLORS.primary,
}));

const STACKED_BY_FORMAT: Record<string, { label: string; value: number; color: string }[]> = {
  flagship: DISTRICTS.map((d) => ({ label: d.name, value: d.revenue.flagship, color: COLORS.flagship })),
  standard: DISTRICTS.map((d) => ({ label: d.name, value: d.revenue.standard, color: COLORS.standard })),
  rack: DISTRICTS.map((d) => ({ label: d.name, value: d.revenue.rack, color: COLORS.rack })),
  counter: DISTRICTS.map((d) => ({ label: d.name, value: d.revenue.counter, color: COLORS.counter })),
};

const totalRevenue = DISTRICTS.reduce((s, d) => s + d.revenue.flagship + d.revenue.standard + d.revenue.rack + d.revenue.counter, 0);
const totalStores = DISTRICTS.reduce((s, d) => s + d.stores, 0);
const avgAttainment = Math.round(DISTRICTS.reduce((s, d) => s + d.attainment, 0) / DISTRICTS.length);
const totalQuota = DISTRICTS.reduce((s, d) => s + d.quota, 0);

// Pacific NW radar (top district)
const PACIFIC_NW = DISTRICTS.find((d) => d.name === 'Pacific NW')!;
const pnwTotal = PACIFIC_NW.revenue.flagship + PACIFIC_NW.revenue.standard + PACIFIC_NW.revenue.rack + PACIFIC_NW.revenue.counter;
const RADAR_AXES = [
  { label: 'Revenue', value: Math.round((pnwTotal / 200) * 100) },
  { label: 'Attainment', value: PACIFIC_NW.attainment },
  { label: 'Growth', value: 88 },
  { label: 'Staffing', value: 92 },
  { label: 'Retention', value: 85 },
];
const COMPANY_AVG = [75, 80, 72, 78, 70];

const HEATMAP_METRICS = ['Revenue $M', 'Attainment %', 'Stores', 'Quota $M'];
const HEATMAP_DATA = DISTRICTS.map((d) => {
  const rev = d.revenue.flagship + d.revenue.standard + d.revenue.rack + d.revenue.counter;
  return [
    Math.round((rev / 200) * 100),
    d.attainment,
    Math.round((d.stores / 30) * 100),
    Math.round((d.quota / 200) * 100),
  ];
});

const FORMAT_MIX_DONUT = FORMATS.map((f) => ({
  label: f.name,
  value: f.count,
  color: f.color,
}));

export default function DistrictPlanning() {
  const [format, setFormat] = useState<string>('flagship');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>District Planning</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          8-district performance analysis across {totalStores} stores — revenue, growth, and quota attainment
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`$${totalRevenue}M`} color={COLORS.primary} />
        <StatCard label="Total Stores" value={String(totalStores)} color={COLORS.accent} />
        <StatCard label="Avg Attainment" value={`${avgAttainment}%`} trend="up" trendValue="+2pp YoY" color="#10B981" />
        <StatCard label="Total Quota" value={`$${totalQuota}M`} color={COLORS.standard} />
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Heat Map: Districts x Metrics */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          District Performance Matrix
        </p>
        <HeatMap
          rows={DISTRICTS.map((d) => d.name)}
          cols={HEATMAP_METRICS}
          data={HEATMAP_DATA}
          colorScale={{ low: '#EF4444', mid: '#F59E0B', high: '#10B981' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Revenue by District — {format.charAt(0).toUpperCase() + format.slice(1)} ($M)
          </p>
          <BarChart
            data={STACKED_BY_FORMAT[format] ?? STACKED_BY_FORMAT.flagship}
            unit="M"
          />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Store Format Mix ({totalStores} stores)
          </p>
          <DonutChart segments={FORMAT_MIX_DONUT} centerValue={String(totalStores)} centerLabel="Stores" size={180} />
        </div>
      </div>

      {/* District Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {DISTRICTS.map((d) => {
          const rev = d.revenue.flagship + d.revenue.standard + d.revenue.rack + d.revenue.counter;
          return (
            <div key={d.name} className="rounded-xl bg-white border p-4" style={{ borderColor: '#E2E8F0' }}>
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>{d.name}</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>{d.dm}</p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#94A3B8' }}>Stores</span>
                  <span className="font-medium" style={{ color: '#0F172A' }}>{d.stores}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#94A3B8' }}>Revenue</span>
                  <span className="font-medium" style={{ color: '#0F172A' }}>${rev}M</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#94A3B8' }}>Attainment</span>
                  <span className="font-medium" style={{ color: d.attainment >= 95 ? '#10B981' : '#F59E0B' }}>{d.attainment}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#94A3B8' }}>Quota</span>
                  <span className="font-medium" style={{ color: '#0F172A' }}>${d.quota}M</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Radar + Quota Attainment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Pacific NW vs Company Average
          </p>
          <div className="flex justify-center">
            <RadarChart axes={RADAR_AXES} color={COLORS.flagship} benchmarkData={COMPANY_AVG} size={280} />
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ backgroundColor: COLORS.flagship }} />
              <span className="text-[11px]" style={{ color: '#475569' }}>Pacific NW</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded border-dashed border-b" style={{ borderColor: '#A8A29E' }} />
              <span className="text-[11px]" style={{ color: '#475569' }}>Company Avg</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Annual Quota Attainment by District
          </p>
          <div className="space-y-3">
            {DISTRICTS.map((d) => {
              const barColor = d.attainment >= 95 ? '#10B981' : d.attainment >= 80 ? '#F59E0B' : '#EF4444';
              return (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="w-[90px] text-right text-[11px] shrink-0" style={{ color: '#475569' }}>{d.name}</span>
                  <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${d.attainment}%`, backgroundColor: barColor }}
                    >
                      <span className="text-[10px] font-mono text-white">{d.attainment}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>&ge;95%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>80-94%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#EF4444' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>&lt;80%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
