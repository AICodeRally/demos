'use client';

import { useState } from 'react';
import { FormatSelector, StatCard, BarChart, DonutChart, RadarChart, HeatMap } from '@/components/demos/register';
import { FORMAT_META, DISTRICT_REVENUE, type FormatId } from '@/data/register/store-data';

/* ── District data ────────────────────────────────────────── */

const DISTRICTS = [
  { name: 'Northeast', dm: 'Sarah Chen', flagship: 5, standard: 18, outlet: 8, sis: 3, revenue: '$76.2M', yoy: '+14.2%', yoyUp: true, quota: 92 },
  { name: 'Southeast', dm: 'Marcus Williams', flagship: 4, standard: 16, outlet: 7, sis: 4, revenue: '$66.9M', yoy: '+11.8%', yoyUp: true, quota: 87 },
  { name: 'Midwest', dm: 'Jennifer Park', flagship: 3, standard: 14, outlet: 6, sis: 3, revenue: '$54.6M', yoy: '+8.4%', yoyUp: true, quota: 78 },
  { name: 'Southwest', dm: 'David Rodriguez', flagship: 3, standard: 12, outlet: 6, sis: 3, revenue: '$49.1M', yoy: '+6.9%', yoyUp: true, quota: 72 },
  { name: 'Pacific NW', dm: 'Lisa Tanaka', flagship: 2, standard: 10, outlet: 5, sis: 3, revenue: '$39.6M', yoy: '+9.1%', yoyUp: true, quota: 84 },
  { name: 'Mountain', dm: 'Robert Foster', flagship: 2, standard: 8, outlet: 4, sis: 2, revenue: '$32.0M', yoy: '-1.2%', yoyUp: false, quota: 55 },
  { name: 'Mid-Atlantic', dm: 'Karen Mitchell', flagship: 4, standard: 14, outlet: 8, sis: 4, revenue: '$64.6M', yoy: '+10.5%', yoyUp: true, quota: 88 },
  { name: 'Great Lakes', dm: 'James O\'Brien', flagship: 2, standard: 8, outlet: 6, sis: 3, revenue: '$49.8M', yoy: '+7.6%', yoyUp: true, quota: 76 },
];

const HEATMAP_METRICS = ['Revenue $M', 'Growth %', 'Margin %', 'Conversion %'];

const HEATMAP_DATA: Record<FormatId, number[][]> = {
  flagship: [
    [92, 85, 78, 82], [80, 72, 74, 76], [68, 58, 65, 70],
    [62, 48, 60, 64], [55, 62, 72, 78], [42, 22, 55, 58],
    [85, 68, 76, 80], [68, 52, 62, 68],
  ],
  standard: [
    [88, 78, 70, 74], [82, 68, 66, 72], [72, 55, 62, 68],
    [65, 45, 58, 60], [52, 58, 68, 72], [40, 28, 52, 56],
    [78, 62, 72, 76], [65, 48, 60, 64],
  ],
  outlet: [
    [72, 65, 55, 62], [65, 58, 52, 58], [52, 42, 48, 54],
    [48, 38, 45, 50], [38, 48, 55, 60], [30, 18, 40, 42],
    [60, 52, 58, 62], [48, 40, 46, 52],
  ],
  'shop-in-shop': [
    [62, 55, 48, 58], [55, 48, 44, 52], [42, 35, 40, 48],
    [38, 30, 38, 44], [32, 42, 50, 55], [22, 15, 34, 38],
    [50, 44, 52, 56], [38, 32, 42, 48],
  ],
};

const NE_FORMAT_MIX = [
  { label: 'Flagship', value: 5, color: '#1E3A5F' },
  { label: 'Standard', value: 18, color: '#06B6D4' },
  { label: 'Outlet', value: 8, color: '#8B5CF6' },
  { label: 'Shop-in-Shop', value: 3, color: '#10B981' },
];

const NE_RADAR = [
  { label: 'Revenue', value: 92 },
  { label: 'Growth', value: 85 },
  { label: 'Margin', value: 78 },
  { label: 'ASP', value: 88 },
  { label: 'Conversion', value: 82 },
  { label: 'Satisfaction', value: 90 },
];
const COMPANY_AVG = [75, 68, 65, 72, 70, 74];

export default function DistrictPlanning() {
  const [format, setFormat] = useState<string>('flagship');
  const currentFormat = format as FormatId;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>District Planning</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          8-district performance analysis across 200 stores — revenue, growth, and quota attainment
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Heat Map: Districts x Metrics */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          District Performance Matrix ({FORMAT_META[currentFormat].name})
        </p>
        <HeatMap
          rows={DISTRICTS.map((d) => d.name)}
          cols={HEATMAP_METRICS}
          data={HEATMAP_DATA[currentFormat]}
          colorScale={{ low: '#EF4444', mid: '#F59E0B', high: '#10B981' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Revenue by District ({FORMAT_META[currentFormat].name}, $M)
          </p>
          <BarChart data={DISTRICT_REVENUE[currentFormat]} unit="M" color="#06B6D4" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Northeast — Format Mix (34 stores)
          </p>
          <DonutChart segments={NE_FORMAT_MIX} centerValue="34" centerLabel="Stores" size={180} />
        </div>
      </div>

      {/* District Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {DISTRICTS.map((d) => (
          <div key={d.name} className="rounded-xl bg-white border p-4" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>{d.name}</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>{d.dm}</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Stores</span>
                <span className="font-medium" style={{ color: '#0F172A' }}>
                  {d.flagship}F / {d.standard}S / {d.outlet}O / {d.sis}SiS
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Revenue</span>
                <span className="font-medium" style={{ color: '#0F172A' }}>{d.revenue}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>YoY</span>
                <span className="font-medium" style={{ color: d.yoyUp ? '#10B981' : '#EF4444' }}>{d.yoy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Radar + Quota Attainment */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Northeast vs Company Average
          </p>
          <div className="flex justify-center">
            <RadarChart axes={NE_RADAR} color="#06B6D4" benchmarkData={COMPANY_AVG} size={280} />
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ backgroundColor: '#06B6D4' }} />
              <span className="text-[11px]" style={{ color: '#475569' }}>Northeast</span>
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
              const barColor = d.quota >= 80 ? '#10B981' : d.quota >= 60 ? '#F59E0B' : '#EF4444';
              return (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="w-[90px] text-right text-[11px] shrink-0" style={{ color: '#475569' }}>{d.name}</span>
                  <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${d.quota}%`, backgroundColor: barColor }}
                    >
                      <span className="text-[10px] font-mono text-white">{d.quota}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>&ge;80%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>60-79%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#EF4444' }} />
              <span className="text-[10px]" style={{ color: '#94A3B8' }}>&lt;60%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
