'use client';

import { useState } from 'react';
import { FormatSelector, HeatMap, BarChart, DonutChart, SparklineRow } from '@/components/demos/crestline';
import { FORMATS, DISTRICTS, COLORS } from '@/data/crestline';

const DISTRICT_NAMES = DISTRICTS.map((d) => d.name);

/* Store count per district × format (rows = districts, cols = formats) */
const STORE_COUNT_DATA = [
  [4, 14, 7, 3],   // Northeast (28 total)
  [3, 13, 7, 3],   // Southeast (26)
  [3, 12, 6, 3],   // Midwest (24)
  [3, 10, 6, 3],   // Southwest (22)
  [4, 16, 7, 3],   // Pacific NW (30)
  [2, 8, 5, 3],    // Mountain (18)
  [4, 14, 7, 3],   // Mid-Atlantic (28)
  [2, 13, 5, 4],   // Great Lakes (24)
];

const REV_PER_SQFT = [
  { label: 'Flagship', value: 520, color: COLORS.flagship },
  { label: 'Standard', value: 380, color: COLORS.standard },
  { label: 'Rack', value: 290, color: COLORS.rack },
  { label: 'Counter', value: 610, color: COLORS.counter },
];

const SQFT_ALLOCATION = [
  { label: 'Flagship (1.25M)', value: 1250, color: COLORS.flagship },
  { label: 'Standard (1.5M)', value: 1500, color: COLORS.standard },
  { label: 'Rack (400K)', value: 400, color: COLORS.rack },
  { label: 'Counter (50K)', value: 50, color: COLORS.counter },
];

const TOP_STORES = [
  { rank: 1, name: 'Manhattan Fifth Ave', format: 'flagship', district: 'Northeast', revenue: '$12.4M', yoy: '+18%', sparkline: [82, 88, 92, 96, 100, 108, 124] },
  { rank: 2, name: 'Beverly Hills', format: 'flagship', district: 'Southwest', revenue: '$11.2M', yoy: '+15%', sparkline: [78, 82, 86, 90, 96, 102, 112] },
  { rank: 3, name: 'Chicago Michigan Ave', format: 'flagship', district: 'Great Lakes', revenue: '$9.8M', yoy: '+12%', sparkline: [72, 76, 80, 84, 88, 92, 98] },
  { rank: 4, name: 'Seattle Flagship', format: 'flagship', district: 'Pacific NW', revenue: '$9.2M', yoy: '+16%', sparkline: [64, 68, 72, 76, 80, 86, 92] },
  { rank: 5, name: 'Dallas NorthPark', format: 'standard', district: 'Southwest', revenue: '$5.1M', yoy: '+22%', sparkline: [32, 34, 38, 40, 44, 48, 51] },
  { rank: 6, name: 'Atlanta Lenox', format: 'standard', district: 'Southeast', revenue: '$4.8M', yoy: '+19%', sparkline: [30, 32, 36, 38, 42, 45, 48] },
  { rank: 7, name: 'DC Georgetown', format: 'standard', district: 'Mid-Atlantic', revenue: '$4.5M', yoy: '+14%', sparkline: [32, 34, 36, 38, 40, 42, 45] },
  { rank: 8, name: 'San Francisco Union Sq', format: 'standard', district: 'Pacific NW', revenue: '$4.2M', yoy: '+11%', sparkline: [34, 35, 36, 38, 39, 40, 42] },
  { rank: 9, name: 'Scottsdale Rack', format: 'rack', district: 'Southwest', revenue: '$2.8M', yoy: '+28%', sparkline: [16, 18, 20, 22, 24, 26, 28] },
  { rank: 10, name: 'Portland Counter', format: 'counter', district: 'Pacific NW', revenue: '$1.6M', yoy: '+20%', sparkline: [10, 11, 12, 13, 14, 15, 16] },
];

const FORMAT_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  flagship: { bg: `${COLORS.flagship}20`, text: COLORS.flagship },
  standard: { bg: `${COLORS.standard}20`, text: COLORS.standard },
  rack: { bg: `${COLORS.rack}20`, text: COLORS.rack },
  counter: { bg: `${COLORS.counter}20`, text: COLORS.counter },
};

const FORMAT_COMPARE = [
  { id: 'flagship', stores: 25, sqft: '50,000', revPerSqft: '$520', avgStaff: '45' },
  { id: 'standard', stores: 100, sqft: '15,000', revPerSqft: '$380', avgStaff: '22' },
  { id: 'rack', stores: 50, sqft: '8,000', revPerSqft: '$290', avgStaff: '12' },
  { id: 'counter', stores: 25, sqft: '2,000', revPerSqft: '$610', avgStaff: '6' },
];

export default function StorePortfolio() {
  const [format, setFormat] = useState<string>('flagship');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Store Portfolio</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          200-store fleet analysis across 8 districts and 4 formats
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Heat Map + Rev/SqFt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Store Count by District & Format</p>
          <HeatMap
            rows={DISTRICT_NAMES}
            cols={['Flagship', 'Standard', 'Rack', 'Counter']}
            data={STORE_COUNT_DATA}
            colorScale={{ low: '#F1F5F9', mid: COLORS.accent, high: COLORS.primary }}
          />
        </div>

        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Revenue per Square Foot</p>
          <BarChart data={REV_PER_SQFT} unit="$/sqft" />
        </div>
      </div>

      {/* District Revenue + SqFt Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>District Revenue ($M)</p>
          <BarChart
            data={DISTRICTS.map((d) => ({
              label: d.name,
              value: Object.values(d.revenue).reduce((s, v) => s + v, 0),
              color: COLORS.primary,
            }))}
            unit="M"
            color={COLORS.primary}
          />
        </div>

        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Square Footage Allocation</p>
          <DonutChart
            segments={SQFT_ALLOCATION}
            centerValue="3.2M"
            centerLabel="Total SqFt"
            size={200}
          />
        </div>
      </div>

      {/* Top 10 Performance Ranking */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Top 10 Performing Stores</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                {['Rank', 'Store Name', 'Format', 'District', 'Revenue', 'YoY', 'Trend'].map((h) => (
                  <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold" style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_STORES.map((store) => {
                const badge = FORMAT_BADGE_COLORS[store.format] || FORMAT_BADGE_COLORS.standard;
                const formatMeta = FORMATS.find((f) => f.id === store.format);
                return (
                  <tr key={store.rank} style={{ borderBottom: '1px solid var(--pl-stripe)' }}>
                    <td className="py-2.5 pr-4 font-mono text-xs" style={{ color: 'var(--pl-text-muted)' }}>#{store.rank}</td>
                    <td className="py-2.5 pr-4 font-medium" style={{ color: 'var(--pl-text)' }}>{store.name}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        {formatMeta?.name ?? store.format}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-xs" style={{ color: 'var(--pl-text-secondary)' }}>{store.district}</td>
                    <td className="py-2.5 pr-4 font-mono font-medium" style={{ color: 'var(--pl-text)' }}>{store.revenue}</td>
                    <td className="py-2.5 pr-4">
                      <span className="text-xs font-semibold" style={{ color: '#10B981' }}>{store.yoy}</span>
                    </td>
                    <td className="py-2.5">
                      <SparklineRow data={store.sparkline} color="#10B981" width={48} height={18} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Format Comparison Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FORMAT_COMPARE.map((fc) => {
          const meta = FORMATS.find((f) => f.id === fc.id);
          const fColor = FORMAT_BADGE_COLORS[fc.id]?.text ?? '#475569';
          return (
            <div key={fc.id} className="rounded-xl border p-5" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: fColor }}>{meta?.name ?? fc.id}</p>
              <div className="space-y-2">
                {[
                  ['Stores', String(fc.stores)],
                  ['Avg SqFt', fc.sqft],
                  ['Rev/SqFt', fc.revPerSqft],
                  ['Avg Staff', fc.avgStaff],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span style={{ color: 'var(--pl-text-muted)' }}>{label}</span>
                    <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
