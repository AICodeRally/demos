'use client';

import { useState } from 'react';
import { FormatSelector, StatCard } from '@/components/demos/register';
import { KPI_MEASUREMENTS, type KPIMeasurement } from '@/data/register/comp-data';
import type { FormatId } from '@/data/register/store-data';

type Period = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
const PERIODS: Period[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];

function getKpiColor(value: number, goal: number): string {
  const ratio = value / goal;
  if (ratio >= 1.0) return '#10B981';
  if (ratio >= 0.8) return '#F59E0B';
  return '#EF4444';
}


export default function Measurements() {
  const [format, setFormat] = useState<string>('flagship');
  const [period, setPeriod] = useState<Period>('Monthly');

  const fmt = format as FormatId;
  const kpis: KPIMeasurement[] = KPI_MEASUREMENTS[fmt];

  function formatValue(kpi: KPIMeasurement) {
    if (kpi.unit === '$') return `$${kpi.value.toLocaleString()}`;
    if (kpi.unit === '%') return `${kpi.value}%`;
    if (kpi.unit === '/5') return `${kpi.value}/5`;
    return `${kpi.value}`;
  }

  function formatGoal(kpi: KPIMeasurement) {
    if (kpi.unit === '$') return `$${kpi.goal.toLocaleString()}`;
    if (kpi.unit === '%') return `${kpi.goal}%`;
    if (kpi.unit === '/5') return `${kpi.goal}/5`;
    return `${kpi.goal}`;
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Performance Measurements</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          KPI tracking against goals by format and period — actuals vs targets
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Period Selector */}
      <div className="flex gap-2 mb-8">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
            style={{
              backgroundColor: period === p ? '#1E3A5F' : '#F1F5F9',
              color: period === p ? '#FFFFFF' : '#475569',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* 6 StatCards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {kpis.map((kpi) => {
          const color = getKpiColor(kpi.value, kpi.goal);
          return (
            <StatCard
              key={kpi.label}
              label={kpi.label}
              value={formatValue(kpi)}
              color={color}
              trendValue={`Goal: ${formatGoal(kpi)}`}
              sparkline={kpi.sparkline}
            />
          );
        })}
      </div>

      {/* Goal vs Actual Horizontal Bars */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-6" style={{ color: '#0F172A' }}>
          Goal vs. Actual — {period}
        </p>

        <div className="space-y-6">
          {kpis.map((kpi) => {
            const color = getKpiColor(kpi.value, kpi.goal);
            const maxVal = Math.max(kpi.value, kpi.goal);
            const actualPct = (kpi.value / maxVal) * 100;
            const goalPct = (kpi.goal / maxVal) * 100;

            return (
              <div key={kpi.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold" style={{ color: '#0F172A' }}>{kpi.label}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px]" style={{ color: '#94A3B8' }}>Goal: {formatGoal(kpi)}</span>
                    <span className="text-[12px] font-bold" style={{ color }}>{formatValue(kpi)}</span>
                  </div>
                </div>

                {/* Goal bar */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] w-12 text-right shrink-0" style={{ color: '#94A3B8' }}>Goal</span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${goalPct}%`, backgroundColor: '#CBD5E1' }}
                    />
                  </div>
                  <span className="text-[10px] w-20 shrink-0 font-mono" style={{ color: '#94A3B8' }}>{formatGoal(kpi)}</span>
                </div>

                {/* Actual bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] w-12 text-right shrink-0" style={{ color: '#475569' }}>Actual</span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${actualPct}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-[10px] w-20 shrink-0 font-mono font-semibold" style={{ color }}>{formatValue(kpi)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
            <span className="text-[11px]" style={{ color: '#475569' }}>On/above target (≥100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
            <span className="text-[11px]" style={{ color: '#475569' }}>Near target (80–99%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
            <span className="text-[11px]" style={{ color: '#475569' }}>Below target (&lt;80%)</span>
          </div>
        </div>
      </div>
    </>
  );
}
