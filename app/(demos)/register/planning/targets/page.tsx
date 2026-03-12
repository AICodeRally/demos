'use client';

import { useState } from 'react';
import { FormatSelector, StatCard, BarChart } from '@/components/demos/register';
import { STORE_TARGETS, type StoreTarget } from '@/data/register/planning-data';
import type { FormatId } from '@/data/register/store-data';

const TREND_ICON: Record<StoreTarget['trend'], string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};
const TREND_COLOR: Record<StoreTarget['trend'], string> = {
  up: '#059669',
  down: '#DC2626',
  flat: '#94A3B8',
};

function attainmentColor(pct: number): { bg: string; text: string } {
  if (pct >= 100) return { bg: '#F0FDF4', text: '#059669' };
  if (pct >= 90) return { bg: '#FFFBEB', text: '#D97706' };
  return { bg: '#FEF2F2', text: '#DC2626' };
}

export default function Targets() {
  const [format, setFormat] = useState<string>('flagship');
  const fmt = format as FormatId;

  const targets: StoreTarget[] = STORE_TARGETS[fmt];

  const avgAttainment = Math.round(targets.reduce((s, t) => s + t.attainment, 0) / targets.length);
  const aboveTarget = targets.filter((t) => t.attainment >= 100).length;
  const formatYtd = targets.reduce((s, t) => s + t.ytdActual, 0);

  /* BarChart: attainment by store */
  const attainmentBars = targets.map((t) => ({
    label: t.store.split('—')[0].trim(),
    value: t.attainment,
    color: t.attainment >= 100 ? '#10B981' : t.attainment >= 90 ? '#F59E0B' : '#EF4444',
  }));

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Store Targets</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Monthly and YTD attainment tracking by store — target performance, trend signals, and category leaders
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Avg Attainment"
          value={`${avgAttainment}%`}
          trend={avgAttainment >= 100 ? 'up' : avgAttainment >= 90 ? 'flat' : 'down'}
          trendValue={avgAttainment >= 100 ? 'Above target' : avgAttainment >= 90 ? 'Near target' : 'Below target'}
          color="#1E3A5F"
        />
        <StatCard
          label="Stores Above Target"
          value={`${aboveTarget} / ${targets.length}`}
          color="#10B981"
        />
        <StatCard
          label="Format YTD Revenue"
          value={`$${(formatYtd / 1_000_000).toFixed(1)}M`}
          trend="up"
          color="#06B6D4"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Targets Table */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Store Performance Detail</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                  <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Store</th>
                  <th className="text-right py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Mo. Target</th>
                  <th className="text-right py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>YTD Actual</th>
                  <th className="text-center py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Attainment</th>
                  <th className="text-center py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Trend</th>
                  <th className="text-left py-2 font-semibold" style={{ color: '#94A3B8' }}>Top Cat.</th>
                </tr>
              </thead>
              <tbody>
                {targets.map((row, i) => {
                  const ac = attainmentColor(row.attainment);
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td className="py-2.5 pr-3 font-medium" style={{ color: '#0F172A' }}>
                        <span className="block truncate max-w-[130px]" title={row.store}>{row.store}</span>
                      </td>
                      <td className="py-2.5 pr-3 text-right font-mono" style={{ color: '#475569' }}>
                        ${(row.monthlyTarget / 1000).toFixed(0)}K
                      </td>
                      <td className="py-2.5 pr-3 text-right font-mono" style={{ color: '#475569' }}>
                        ${(row.ytdActual / 1_000_000).toFixed(1)}M
                      </td>
                      <td className="py-2.5 pr-3 text-center">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ backgroundColor: ac.bg, color: ac.text }}
                        >
                          {row.attainment}%
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-center">
                        <span className="text-[14px] font-bold" style={{ color: TREND_COLOR[row.trend] }}>
                          {TREND_ICON[row.trend]}
                        </span>
                      </td>
                      <td className="py-2.5 text-[11px]" style={{ color: '#475569' }}>{row.topCategory}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attainment BarChart */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#0F172A' }}>Attainment by Store (%)</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: '#10B981' }} />
              <span className="text-[10px]" style={{ color: '#475569' }}>≥ 100% (On/Above target)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: '#F59E0B' }} />
              <span className="text-[10px]" style={{ color: '#475569' }}>90–99%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: '#EF4444' }} />
              <span className="text-[10px]" style={{ color: '#475569' }}>{'< 90%'}</span>
            </div>
          </div>
          <BarChart data={attainmentBars} maxVal={120} unit="%" />

          {/* Target line annotation */}
          <div className="mt-4 pt-4 border-t flex items-center gap-2" style={{ borderColor: '#F1F5F9' }}>
            <div className="w-6 border-b-2 border-dashed" style={{ borderColor: '#1E3A5F' }} />
            <span className="text-[10px]" style={{ color: '#475569' }}>100% = monthly target</span>
          </div>
        </div>
      </div>

      {/* Attainment distribution callout */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="rounded-xl border px-5 py-4"
          style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: '#059669' }}>
            On / Above Target
          </p>
          <p className="text-2xl font-bold" style={{ color: '#059669' }}>
            {targets.filter((t) => t.attainment >= 100).length}
          </p>
          <p className="text-[11px] mt-1" style={{ color: '#059669' }}>
            {targets.filter((t) => t.attainment >= 100).map((t) => t.store.split('—')[0].trim()).join(', ') || '—'}
          </p>
        </div>
        <div
          className="rounded-xl border px-5 py-4"
          style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: '#D97706' }}>
            Near Target (90–99%)
          </p>
          <p className="text-2xl font-bold" style={{ color: '#D97706' }}>
            {targets.filter((t) => t.attainment >= 90 && t.attainment < 100).length}
          </p>
          <p className="text-[11px] mt-1" style={{ color: '#D97706' }}>
            {targets.filter((t) => t.attainment >= 90 && t.attainment < 100).map((t) => t.store.split('—')[0].trim()).join(', ') || '—'}
          </p>
        </div>
        <div
          className="rounded-xl border px-5 py-4"
          style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: '#DC2626' }}>
            Below Target ({'< 90%'})
          </p>
          <p className="text-2xl font-bold" style={{ color: '#DC2626' }}>
            {targets.filter((t) => t.attainment < 90).length}
          </p>
          <p className="text-[11px] mt-1" style={{ color: '#DC2626' }}>
            {targets.filter((t) => t.attainment < 90).map((t) => t.store.split('—')[0].trim()).join(', ') || '—'}
          </p>
        </div>
      </div>
    </>
  );
}
