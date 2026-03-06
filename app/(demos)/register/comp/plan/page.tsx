'use client';

import { useState } from 'react';
import { FormatSelector, StatCard, BarChart, WaterfallChart, HeatMap } from '@/components/demos/register';
import { COMP_PLANS, type FormatId } from '@/data/register/store-data';

/* ── Tier definitions by format ──────────────────────────── */

const TIERS: Record<FormatId, { label: string; range: string; rate: string; pct: number }[]> = {
  flagship: [
    { label: 'Tier 1', range: '$0 – $50K', rate: '3%', pct: 3 },
    { label: 'Tier 2', range: '$50K – $100K', rate: '4%', pct: 4 },
    { label: 'Tier 3', range: '$100K – $150K', rate: '5%', pct: 5 },
    { label: 'Tier 4', range: '$150K+', rate: '6%', pct: 6 },
  ],
  standard: [
    { label: 'Tier 1', range: '$0 – $40K', rate: '2.5%', pct: 2.5 },
    { label: 'Tier 2', range: '$40K – $80K', rate: '3.5%', pct: 3.5 },
    { label: 'Tier 3', range: '$80K – $120K', rate: '4.5%', pct: 4.5 },
    { label: 'Tier 4', range: '$120K+', rate: '5%', pct: 5 },
  ],
  outlet: [
    { label: 'Flat', range: 'All sales', rate: '1.5%', pct: 1.5 },
  ],
  'shop-in-shop': [],
};

/* ── Estimated annual earnings ───────────────────────────── */

const ANNUAL_EARNINGS = [
  { label: 'Flagship', value: 72, color: '#1E3A5F' },
  { label: 'Standard', value: 52, color: '#06B6D4' },
  { label: 'Outlet', value: 42, color: '#8B5CF6' },
  { label: 'Shop-in-Shop', value: 38, color: '#10B981' },
];

/* ── Waterfall comp buildup by format ────────────────────── */

const WATERFALL: Record<FormatId, { label: string; value: number; type: 'add' | 'subtract' | 'total' }[]> = {
  flagship: [
    { label: 'Base Pay', value: 37440, type: 'add' },
    { label: 'Commission', value: 22800, type: 'add' },
    { label: 'SPIFFs', value: 6200, type: 'add' },
    { label: 'Accelerators', value: 5560, type: 'add' },
    { label: 'Total OTE', value: 0, type: 'total' },
  ],
  standard: [
    { label: 'Base Pay', value: 31200, type: 'add' },
    { label: 'Commission', value: 14800, type: 'add' },
    { label: 'SPIFFs', value: 4200, type: 'add' },
    { label: 'Accelerators', value: 1800, type: 'add' },
    { label: 'Total OTE', value: 0, type: 'total' },
  ],
  outlet: [
    { label: 'Base Pay', value: 29120, type: 'add' },
    { label: 'Commission', value: 4680, type: 'add' },
    { label: 'Volume Bonus', value: 8200, type: 'add' },
    { label: 'Total OTE', value: 0, type: 'total' },
  ],
  'shop-in-shop': [
    { label: 'Base Pay', value: 33280, type: 'add' },
    { label: 'SPIFF Only', value: 4720, type: 'add' },
    { label: 'Total OTE', value: 0, type: 'total' },
  ],
};

/* ── HeatMap: % of reps in earnings bracket ──────────────── */

const BRACKET_ROWS = ['Flagship', 'Standard', 'Outlet', 'Shop-in-Shop'];
const BRACKET_COLS = ['$30-40K', '$40-50K', '$50-60K', '$60-70K', '$70K+'];
const BRACKET_DATA = [
  [5, 12, 25, 35, 23],   // Flagship
  [10, 30, 38, 18, 4],   // Standard
  [22, 42, 28, 8, 0],    // Outlet
  [35, 45, 18, 2, 0],    // SiS
];

/* ── Comp plan card config ───────────────────────────────── */

const PLAN_DETAILS: Record<FormatId, { title: string; desc: string; icon: string }> = {
  flagship: { title: 'Flagship', desc: 'Base $18/hr + 3-6% tiered commission + accelerators above quota', icon: 'F' },
  standard: { title: 'Standard', desc: 'Base $15/hr + 2.5-5% tiered commission', icon: 'S' },
  outlet: { title: 'Outlet', desc: 'Base $14/hr + 1.5% flat rate + $200/wk volume bonus above 15 units', icon: 'O' },
  'shop-in-shop': { title: 'Shop-in-Shop', desc: 'Base $16/hr + $25/mattress SPIFF only', icon: 'Si' },
};

export default function CompPlan() {
  const [format, setFormat] = useState<string>('flagship');
  const fmt = format as FormatId;
  const tiers = TIERS[fmt];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Comp Plan Design</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Commission structures, tier staircase visualization, and earnings analysis by format
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Comp Plan Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {(Object.keys(PLAN_DETAILS) as FormatId[]).map((fid) => {
          const plan = PLAN_DETAILS[fid];
          const comp = COMP_PLANS[fid];
          const isActive = fid === fmt;
          return (
            <div
              key={fid}
              className="rounded-xl border p-4 transition-all"
              style={{
                backgroundColor: isActive ? '#F0FDF4' : '#FFFFFF',
                borderColor: isActive ? '#10B981' : '#E2E8F0',
                borderWidth: isActive ? 2 : 1,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold text-white"
                  style={{ backgroundColor: isActive ? '#10B981' : '#94A3B8' }}
                >
                  {plan.icon}
                </span>
                <span className="text-[13px] font-bold" style={{ color: '#0F172A' }}>{plan.title}</span>
              </div>
              <p className="text-[11px] leading-relaxed mb-3" style={{ color: '#475569' }}>{plan.desc}</p>
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#F1F5F9' }}>
                <span className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>OTE</span>
                <span className="text-[14px] font-bold" style={{ color: isActive ? '#10B981' : '#0F172A' }}>{comp.ote}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Tier Staircase Visualization */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Commission Tier Staircase
          </p>
          {tiers.length > 0 ? (
            <div className="flex items-end gap-3" style={{ height: 180 }}>
              {tiers.map((tier, i) => {
                const maxPct = Math.max(...tiers.map((t) => t.pct));
                const barHeight = (tier.pct / maxPct) * 150;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[11px] font-bold" style={{ color: '#10B981' }}>{tier.rate}</span>
                    <div
                      className="w-full rounded-t-lg transition-all duration-300"
                      style={{
                        height: barHeight,
                        background: `linear-gradient(180deg, #10B981 0%, #059669 100%)`,
                        opacity: 0.7 + (i * 0.1),
                      }}
                    />
                    <span className="text-[10px] font-medium text-center" style={{ color: '#0F172A' }}>{tier.label}</span>
                    <span className="text-[9px] text-center" style={{ color: '#94A3B8' }}>{tier.range}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center" style={{ height: 180 }}>
              <div className="text-center">
                <p className="text-[13px] font-semibold" style={{ color: '#475569' }}>SPIFF-Only Model</p>
                <p className="text-[11px] mt-1" style={{ color: '#94A3B8' }}>$25 per mattress sold &mdash; no tiered commission</p>
              </div>
            </div>
          )}
        </div>

        {/* Estimated Annual Earnings */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Estimated Annual Earnings at 100% Attainment ($K)
          </p>
          <BarChart data={ANNUAL_EARNINGS} unit="K" />
        </div>
      </div>

      {/* Waterfall + HeatMap */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Comp Build-Up &mdash; {PLAN_DETAILS[fmt].title}
          </p>
          <WaterfallChart data={WATERFALL[fmt]} height={260} />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Rep Earnings Distribution (% of reps in bracket)
          </p>
          <HeatMap
            rows={BRACKET_ROWS}
            cols={BRACKET_COLS}
            data={BRACKET_DATA}
            colorScale={{ low: '#F1F5F9', mid: '#10B981', high: '#059669' }}
          />
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Format Comparison
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Format</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Base</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Commission Rate</th>
                <th className="text-center py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>SPIFF Eligible</th>
                <th className="text-center py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Accelerator</th>
                <th className="text-right py-2 font-semibold" style={{ color: '#94A3B8' }}>OTE</th>
              </tr>
            </thead>
            <tbody>
              {([
                { name: 'Flagship', base: '$18/hr', rate: '3-6% tiered', spiff: true, accel: true, ote: '$72K' },
                { name: 'Standard', base: '$15/hr', rate: '2.5-5% tiered', spiff: true, accel: false, ote: '$52K' },
                { name: 'Outlet', base: '$14/hr', rate: '1.5% flat', spiff: false, accel: false, ote: '$42K' },
                { name: 'Shop-in-Shop', base: '$16/hr', rate: 'N/A (SPIFF only)', spiff: true, accel: false, ote: '$38K' },
              ]).map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="py-2.5 pr-4 font-semibold" style={{ color: '#0F172A' }}>{row.name}</td>
                  <td className="py-2.5 pr-4 font-mono" style={{ color: '#475569' }}>{row.base}</td>
                  <td className="py-2.5 pr-4 font-mono" style={{ color: '#475569' }}>{row.rate}</td>
                  <td className="py-2.5 pr-4 text-center">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: row.spiff ? '#F0FDF4' : '#FEF2F2',
                        color: row.spiff ? '#059669' : '#DC2626',
                      }}
                    >
                      {row.spiff ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-center">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: row.accel ? '#F0FDF4' : '#FEF2F2',
                        color: row.accel ? '#059669' : '#DC2626',
                      }}
                    >
                      {row.accel ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold" style={{ color: '#10B981' }}>{row.ote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
