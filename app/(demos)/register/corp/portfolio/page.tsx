'use client';

import { useState } from 'react';
import { FormatSelector, HeatMap, BarChart, BubbleChart, DonutChart, SparklineRow } from '@/components/demos/register';
import { FORMAT_META } from '@/data/register/store-data';
import type { FormatId } from '@/data/register/store-data';

const DISTRICTS = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'Pacific NW', 'Mountain', 'Mid-Atlantic', 'Great Lakes'];

const STORE_COUNT_DATA = [
  [6, 18, 8, 3],   // Northeast
  [4, 16, 7, 4],   // Southeast
  [3, 14, 8, 3],   // Midwest
  [3, 12, 6, 4],   // Southwest
  [3, 10, 5, 3],   // Pacific NW
  [1, 8, 4, 2],    // Mountain
  [3, 12, 7, 3],   // Mid-Atlantic
  [2, 10, 5, 3],   // Great Lakes
];

const REV_PER_SQFT = [
  { label: 'Flagship', value: 420, color: '#1E3A5F' },
  { label: 'Standard', value: 420, color: '#06B6D4' },
  { label: 'Outlet', value: 327, color: '#8B5CF6' },
  { label: 'Shop-in-Shop', value: 475, color: '#10B981' },
];

const FORMAT_BUBBLES = [
  { x: 13, y: 84, size: 60, color: '#1E3A5F', label: 'Flagship' },
  { x: 50, y: 42, size: 90, color: '#06B6D4', label: 'Standard' },
  { x: 25, y: 20, size: 30, color: '#8B5CF6', label: 'Outlet' },
  { x: 13, y: 32, size: 8, color: '#10B981', label: 'Shop-in-Shop' },
];

const SQFT_ALLOCATION = [
  { label: 'Flagship (625K)', value: 625, color: '#1E3A5F' },
  { label: 'Standard (500K)', value: 500, color: '#06B6D4' },
  { label: 'Outlet (150K)', value: 150, color: '#8B5CF6' },
  { label: 'Shop-in-Shop (20K)', value: 20, color: '#10B981' },
];

const TOP_STORES = [
  { rank: 1, name: 'Manhattan Flagship', format: 'flagship', district: 'Northeast', revenue: '$8.2M', yoy: '+18%', sparkline: [62, 68, 72, 74, 78, 80, 82] },
  { rank: 2, name: 'Beverly Hills Flagship', format: 'flagship', district: 'Southwest', revenue: '$7.8M', yoy: '+15%', sparkline: [60, 64, 68, 70, 74, 76, 78] },
  { rank: 3, name: 'Chicago Michigan Ave', format: 'flagship', district: 'Great Lakes', revenue: '$6.4M', yoy: '+12%', sparkline: [50, 52, 56, 58, 60, 62, 64] },
  { rank: 4, name: 'Dallas Galleria', format: 'standard', district: 'Southwest', revenue: '$4.1M', yoy: '+22%', sparkline: [28, 30, 32, 34, 36, 38, 41] },
  { rank: 5, name: 'Atlanta Buckhead', format: 'standard', district: 'Southeast', revenue: '$3.8M', yoy: '+14%', sparkline: [30, 31, 32, 34, 35, 36, 38] },
  { rank: 6, name: 'San Francisco Union Sq', format: 'flagship', district: 'Pacific NW', revenue: '$5.6M', yoy: '+10%', sparkline: [48, 49, 50, 52, 53, 54, 56] },
  { rank: 7, name: 'Miami Beach', format: 'standard', district: 'Southeast', revenue: '$3.5M', yoy: '+19%', sparkline: [24, 26, 28, 30, 32, 33, 35] },
  { rank: 8, name: 'Denver Downtown', format: 'standard', district: 'Mountain', revenue: '$3.2M', yoy: '+16%', sparkline: [22, 24, 26, 28, 30, 31, 32] },
  { rank: 9, name: 'Phoenix Outlet Mall', format: 'outlet', district: 'Southwest', revenue: '$2.4M', yoy: '+28%', sparkline: [14, 16, 18, 20, 21, 22, 24] },
  { rank: 10, name: 'Seattle Bellevue', format: 'standard', district: 'Pacific NW', revenue: '$3.0M', yoy: '+11%', sparkline: [24, 25, 26, 27, 28, 29, 30] },
];

const FORMAT_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  flagship: { bg: '#1E3A5F20', text: '#1E3A5F' },
  standard: { bg: '#06B6D420', text: '#0891B2' },
  outlet: { bg: '#8B5CF620', text: '#7C3AED' },
  'shop-in-shop': { bg: '#10B98120', text: '#059669' },
};

const FORMAT_COMPARE = [
  { id: 'flagship', stores: 25, sqft: '25,000', revPerSqft: '$420', asp: '$2,800' },
  { id: 'standard', stores: 100, sqft: '5,000', revPerSqft: '$420', asp: '$1,900' },
  { id: 'outlet', stores: 50, sqft: '3,000', revPerSqft: '$327', asp: '$1,200' },
  { id: 'shop-in-shop', stores: 25, sqft: '800', revPerSqft: '$475', asp: '$1,600' },
];

export default function StorePortfolio() {
  const [format, setFormat] = useState<string>('flagship');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Store Portfolio</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          200-store fleet analysis across 8 districts and 4 formats
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Heat Map + Rev/SqFt */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Store Count by District & Format</p>
          <HeatMap
            rows={DISTRICTS}
            cols={['Flagship', 'Standard', 'Outlet', 'SiS']}
            data={STORE_COUNT_DATA}
            colorScale={{ low: '#F1F5F9', mid: '#06B6D4', high: '#1E3A5F' }}
          />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Revenue per Square Foot</p>
          <BarChart data={REV_PER_SQFT} unit="$/sqft" />
        </div>
      </div>

      {/* Bubble + Donut */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Format Comparison (Stores vs Avg Revenue)</p>
          <BubbleChart
            data={FORMAT_BUBBLES}
            xLabel="Store Count (% of 200)"
            yLabel="Avg Revenue (% of $5M)"
            height={280}
          />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Square Footage Allocation</p>
          <DonutChart
            segments={SQFT_ALLOCATION}
            centerValue="1.3M"
            centerLabel="Total SqFt"
            size={200}
          />
        </div>
      </div>

      {/* Top 10 Performance Ranking */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Top 10 Performing Stores</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                {['Rank', 'Store Name', 'Format', 'District', 'Revenue', 'YoY', 'Trend'].map((h) => (
                  <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold" style={{ color: '#94A3B8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_STORES.map((store) => {
                const badge = FORMAT_BADGE_COLORS[store.format] || FORMAT_BADGE_COLORS.standard;
                return (
                  <tr key={store.rank} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td className="py-2.5 pr-4 font-mono text-xs" style={{ color: '#94A3B8' }}>#{store.rank}</td>
                    <td className="py-2.5 pr-4 font-medium" style={{ color: '#0F172A' }}>{store.name}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        {FORMAT_META[store.format as FormatId].name}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-xs" style={{ color: '#475569' }}>{store.district}</td>
                    <td className="py-2.5 pr-4 font-mono font-medium" style={{ color: '#0F172A' }}>{store.revenue}</td>
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
      <div className="grid grid-cols-4 gap-4">
        {FORMAT_COMPARE.map((fc) => {
          const meta = FORMAT_META[fc.id as FormatId];
          const fColor = FORMAT_BADGE_COLORS[fc.id]?.text || '#475569';
          return (
            <div key={fc.id} className="rounded-xl bg-white border p-5" style={{ borderColor: '#E2E8F0' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: fColor }}>{meta.name}</p>
              <div className="space-y-2">
                {[
                  ['Stores', String(fc.stores)],
                  ['Avg SqFt', fc.sqft],
                  ['Rev/SqFt', fc.revPerSqft],
                  ['ASP', fc.asp],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span style={{ color: '#94A3B8' }}>{label}</span>
                    <span className="font-medium" style={{ color: '#0F172A' }}>{val}</span>
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
