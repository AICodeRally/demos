'use client';

import { useState } from 'react';
import { FormatSelector, StatCard, BarChart } from '@/components/demos/register';
import { HEADCOUNT_DATA, type HeadcountRow } from '@/data/register/planning-data';
import type { FormatId } from '@/data/register/store-data';

export default function Headcount() {
  const [format, setFormat] = useState<string>('flagship');
  const fmt = format as FormatId;

  const filtered: HeadcountRow[] = HEADCOUNT_DATA.filter((r) => r.format === fmt);

  const totalCurrent = filtered.reduce((s, r) => s + r.current, 0);
  const totalOptimal = filtered.reduce((s, r) => s + r.optimal, 0);
  const totalGap = filtered.reduce((s, r) => s + r.gap, 0);

  /* Paired bar chart data */
  const currentBars = filtered.map((r) => ({
    label: r.store.split('—')[0].trim(),
    value: r.current,
    color: '#1E3A5F',
  }));
  const optimalBars = filtered.map((r) => ({
    label: r.store.split('—')[0].trim(),
    value: r.optimal,
    color: '#10B981',
  }));

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Workforce Planning</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Headcount analysis by format — current staffing versus optimal model, gap identification, and shift-level needs
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Current Headcount"
          value={String(totalCurrent)}
          color="#1E3A5F"
        />
        <StatCard
          label="Total Optimal Headcount"
          value={String(totalOptimal)}
          color="#10B981"
        />
        <StatCard
          label="Total Gap"
          value={`+${totalGap}`}
          trend={totalGap > 0 ? 'down' : 'flat'}
          trendValue={totalGap > 0 ? `${totalGap} positions unfilled` : 'Fully staffed'}
          color="#EF4444"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Table */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Store Headcount Detail</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                  <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Store</th>
                  <th className="text-center py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Current</th>
                  <th className="text-center py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Optimal</th>
                  <th className="text-center py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Gap</th>
                  <th className="text-center py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Weekday</th>
                  <th className="text-center py-2 font-semibold" style={{ color: '#94A3B8' }}>Weekend</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td className="py-2.5 pr-3 font-medium" style={{ color: '#0F172A' }}>
                      <span className="block truncate max-w-[140px]" title={row.store}>{row.store}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-center font-mono" style={{ color: '#475569' }}>{row.current}</td>
                    <td className="py-2.5 pr-3 text-center font-mono" style={{ color: '#475569' }}>{row.optimal}</td>
                    <td className="py-2.5 pr-3 text-center">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor: row.gap > 0 ? '#FEF2F2' : '#F0FDF4',
                          color: row.gap > 0 ? '#DC2626' : '#059669',
                        }}
                      >
                        {row.gap > 0 ? `+${row.gap}` : '0'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-center font-mono" style={{ color: '#475569' }}>{row.weekdayNeed}</td>
                    <td className="py-2.5 text-center font-mono" style={{ color: '#475569' }}>{row.weekendNeed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BarChart: current vs optimal */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Current vs Optimal by Store</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: '#1E3A5F' }} />
              <span className="text-[11px]" style={{ color: '#475569' }}>Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: '#10B981' }} />
              <span className="text-[11px]" style={{ color: '#475569' }}>Optimal</span>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-[10px] mb-2 font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Current Headcount</p>
            <BarChart data={currentBars} />
          </div>
          <div>
            <p className="text-[10px] mb-2 font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>Optimal Headcount</p>
            <BarChart data={optimalBars} />
          </div>
        </div>
      </div>

      {/* Staffing insight callout */}
      <div
        className="rounded-xl border px-6 py-5 flex items-start gap-4"
        style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}
      >
        <span className="text-xl shrink-0">💡</span>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#1E40AF' }}>
            AI Staffing Recommendation
          </p>
          <p className="text-[12px] mt-1" style={{ color: '#3B82F6' }}>
            Based on trailing 90-day sales velocity and conversion data, closing the {totalGap}-person gap across {filtered.length} stores
            in the <span className="font-semibold">{fmt.replace('-', ' ')}</span> format is projected to lift monthly revenue by
            approximately <span className="font-semibold">6–9%</span> during peak weekend windows. Priority hire: weekend closing shifts.
          </p>
        </div>
      </div>
    </>
  );
}
