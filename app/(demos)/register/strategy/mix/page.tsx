'use client';

import { useState } from 'react';
import { FormatSelector, DonutChart, BarChart, TreeMap, AreaChart } from '@/components/demos/register';
import { FORMAT_META, PRODUCT_MIX, type FormatId } from '@/data/register/store-data';

/* ── Product mix data ─────────────────────────────────────── */

const TARGET_MIX = [
  { label: 'Mattresses', value: 60, color: '#1E3A5F' },
  { label: 'Adjustable Bases', value: 20, color: '#06B6D4' },
  { label: 'Bedding', value: 15, color: '#10B981' },
  { label: 'Sleep Tech', value: 5, color: '#8B5CF6' },
];

const MIX_COMPARISON = [
  { label: 'Matt. Target', value: 60, color: '#1E3A5F44' },
  { label: 'Matt. Actual', value: 62, color: '#1E3A5F' },
  { label: 'Base Target', value: 20, color: '#06B6D444' },
  { label: 'Base Actual', value: 18, color: '#06B6D4' },
  { label: 'Bedding Tgt', value: 15, color: '#10B98144' },
  { label: 'Bedding Act', value: 14, color: '#10B981' },
  { label: 'Tech Target', value: 5, color: '#8B5CF644' },
  { label: 'Tech Actual', value: 6, color: '#8B5CF6' },
];

const TREEMAP_DATA = [
  { label: 'King Mattress', value: 180, color: '#1E3A5F' },
  { label: 'Queen Mattress', value: 140, color: '#1E4D6F' },
  { label: 'Adj. King Base', value: 80, color: '#06B6D4' },
  { label: 'Twin Mattress', value: 60, color: '#2E5A7F' },
  { label: 'Adj. Queen Base', value: 50, color: '#0AA5C0' },
  { label: 'Pillows', value: 40, color: '#10B981' },
  { label: 'Sheets', value: 30, color: '#16A075' },
  { label: 'Protectors', value: 25, color: '#1D8B6A' },
  { label: 'Mattress Toppers', value: 20, color: '#248060' },
  { label: 'Sleep Trackers', value: 15, color: '#8B5CF6' },
];

const MARGIN_DATA = [
  { category: 'Mattresses', margin: '42%', revenue: '$840M', contribution: '60%', trend: 'Stable' },
  { category: 'Adjustable Bases', margin: '55%', revenue: '$280M', contribution: '20%', trend: 'Growing' },
  { category: 'Bedding', margin: '65%', revenue: '$210M', contribution: '15%', trend: 'Stable' },
  { category: 'Sleep Tech', margin: '48%', revenue: '$70M', contribution: '5%', trend: 'Growing' },
  { category: 'Accessories', margin: '72%', revenue: '$42M', contribution: '3%', trend: 'Growing' },
];

const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

const MATTRESS_TREND = MONTHS.map((label, i) => ({
  label,
  value: 65 - (i * 0.45),
}));

const BASES_TREND = MONTHS.map((label, i) => ({
  label,
  value: 16 + (i * 0.36),
}));

const FORMAT_MIX_NOTES: Record<FormatId, { title: string; note: string; highlight: string }> = {
  flagship: { title: 'Flagship', note: 'Highest Sleep Tech attach (12%). Premium mattress focus with adjustable base upsell.', highlight: 'Tech-forward mix drives highest ASP' },
  standard: { title: 'Standard', note: 'Balanced core mix. Mattresses at 62% with steady bedding attachment.', highlight: 'Balanced — room to grow bases' },
  outlet: { title: 'Outlet', note: 'Clearance mattress heavy (72%). Minimal tech and base penetration.', highlight: 'Volume play — low margin per unit' },
  'shop-in-shop': { title: 'Shop-in-Shop', note: 'Featured mattresses 65%. Limited SKU range optimized for host foot traffic.', highlight: 'Curated SKUs for partner retail' },
};

export default function ProductMix() {
  const [format, setFormat] = useState<string>('flagship');
  const currentFormat = format as FormatId;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Product Mix</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Category allocation, margin analysis, and mix shift tracking across 200 stores
        </p>
      </div>

      {/* Donut + Bar side by side */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Target Product Mix</p>
          <DonutChart segments={TARGET_MIX} centerValue="$1.4B" centerLabel="Revenue" size={200} />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Target vs Actual Mix (%)</p>
          <BarChart data={MIX_COMPARISON} unit="%" />
        </div>
      </div>

      {/* TreeMap */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Revenue by Product Sub-Category ($M)</p>
        <TreeMap data={TREEMAP_DATA} />
      </div>

      {/* Margin Analysis Table */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Margin Analysis by Category</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                {['Category', 'Gross Margin', 'Revenue', 'Contribution', 'Trend'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-semibold" style={{ color: '#94A3B8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MARGIN_DATA.map((row) => (
                <tr key={row.category} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="py-2 px-3 font-medium" style={{ color: '#0F172A' }}>{row.category}</td>
                  <td className="py-2 px-3 font-mono font-semibold" style={{ color: '#06B6D4' }}>{row.margin}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: '#0F172A' }}>{row.revenue}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: '#475569' }}>{row.contribution}</td>
                  <td className="py-2 px-3">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: row.trend === 'Growing' ? '#10B98118' : '#06B6D418',
                        color: row.trend === 'Growing' ? '#10B981' : '#06B6D4',
                      }}
                    >
                      {row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mix Shift Area Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>Mattress Share Trend (%)</p>
          <p className="text-[11px] mb-3" style={{ color: '#94A3B8' }}>Declining from 65% to 60% as bases grow</p>
          <AreaChart data={MATTRESS_TREND} color="#1E3A5F" height={160} />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>Adjustable Base Share Trend (%)</p>
          <p className="text-[11px] mb-3" style={{ color: '#94A3B8' }}>Growing from 16% to 20% — key margin driver</p>
          <AreaChart data={BASES_TREND} color="#06B6D4" height={160} />
        </div>
      </div>

      {/* Format Impact Cards */}
      <FormatSelector selected={format} onSelect={setFormat} />

      <div className="grid grid-cols-4 gap-4">
        {(Object.keys(FORMAT_MIX_NOTES) as FormatId[]).map((fid) => {
          const note = FORMAT_MIX_NOTES[fid];
          const mix = PRODUCT_MIX[fid];
          const isActive = fid === currentFormat;
          return (
            <div
              key={fid}
              className="rounded-xl border p-4 cursor-pointer transition-all"
              style={{
                borderColor: isActive ? '#06B6D4' : '#E2E8F0',
                backgroundColor: isActive ? '#06B6D408' : '#FFFFFF',
                borderWidth: isActive ? 2 : 1,
              }}
              onClick={() => setFormat(fid)}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>{note.title}</p>
              <div className="space-y-1 mb-3">
                {mix.map((m) => (
                  <div key={m.label} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-[11px] flex-1" style={{ color: '#475569' }}>{m.label}</span>
                    <span className="text-[11px] font-mono font-medium" style={{ color: '#0F172A' }}>{m.value}%</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] italic" style={{ color: '#94A3B8' }}>{note.highlight}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
