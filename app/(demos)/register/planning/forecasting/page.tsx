'use client';

import { useState } from 'react';
import { FormatSelector, StatCard, AreaChart } from '@/components/demos/register';
import { FORECAST_DATA, type ForecastPoint } from '@/data/register/planning-data';
import type { FormatId } from '@/data/register/store-data';

/* ── Per-format stat values ──────────────────────────────── */

const FORMAT_STATS: Record<FormatId, {
  currentMonthActual: string;
  nextMonthForecast: string;
  ytdRevenue: string;
}> = {
  flagship: { currentMonthActual: '$5,800K', nextMonthForecast: '$5,200K', ytdRevenue: '$27,600K' },
  standard: { currentMonthActual: '$3,900K', nextMonthForecast: '$3,500K', ytdRevenue: '$18,400K' },
  outlet: { currentMonthActual: '$2,500K', nextMonthForecast: '$2,200K', ytdRevenue: '$11,750K' },
  'shop-in-shop': { currentMonthActual: '$1,250K', nextMonthForecast: '$1,100K', ytdRevenue: '$5,900K' },
};

export default function Forecasting() {
  const [format, setFormat] = useState<string>('flagship');
  const fmt = format as FormatId;
  const stats = FORMAT_STATS[fmt];
  const forecastPoints: ForecastPoint[] = FORECAST_DATA[fmt];

  /* Build AreaChart data from forecast line */
  const forecastLineData = forecastPoints.map((p) => ({
    label: p.month,
    value: p.forecast,
  }));

  /* Build AreaChart data from actual values (where actual > 0) */
  const actualLineData = forecastPoints
    .filter((p) => p.actual > 0)
    .map((p) => ({ label: p.month, value: p.actual }));

  /* Confidence range note */
  const lastForecast = forecastPoints[forecastPoints.length - 1];
  const rangeNote = `Dec forecast range: $${(lastForecast.lower / 1000).toFixed(0)}K – $${(lastForecast.upper / 1000).toFixed(0)}K`;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>AI Demand Forecasting</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Predictive revenue modeling with confidence bands, seasonal signals, and format-level drill-down
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Current Month Actual"
          value={stats.currentMonthActual}
          trend="up"
          trendValue="+5.5% vs forecast"
          color="#1E3A5F"
        />
        <StatCard
          label="Next Month Forecast"
          value={stats.nextMonthForecast}
          color="#8B5CF6"
        />
        <StatCard
          label="YTD Revenue"
          value={stats.ytdRevenue}
          trend="up"
          trendValue="+8.2% vs prior year"
          color="#06B6D4"
        />
        <StatCard
          label="Forecast Accuracy"
          value="95%"
          trend="up"
          trendValue="+1.2pp vs Q1"
          color="#10B981"
        />
      </div>

      {/* Main Forecast Chart */}
      <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div className="flex items-start justify-between mb-1">
          <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
            Monthly Revenue Forecast — Full Year ($K)
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full inline-block" style={{ backgroundColor: '#1E3A5F' }} />
              <span style={{ color: '#475569' }}>Forecast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full inline-block" style={{ backgroundColor: '#10B981' }} />
              <span style={{ color: '#475569' }}>Actual</span>
            </div>
          </div>
        </div>
        <p className="text-[11px] mb-4" style={{ color: '#94A3B8' }}>
          Confidence band shown for forecast months &mdash; {rangeNote}
        </p>

        {/* Forecast line */}
        <AreaChart data={forecastLineData} color="#1E3A5F" height={220} />

        {/* Actual overlay (shown inline as a separate smaller chart labeled) */}
        {actualLineData.length > 0 && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
            <p className="text-[11px] font-medium mb-2" style={{ color: '#475569' }}>
              Actual vs Forecast — Jan through Jun (realized months)
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] mb-1" style={{ color: '#94A3B8' }}>Actual Revenue ($K)</p>
                <AreaChart data={actualLineData} color="#10B981" height={120} />
              </div>
              <div>
                <p className="text-[10px] mb-1" style={{ color: '#94A3B8' }}>Forecast Reference ($K)</p>
                <AreaChart
                  data={forecastPoints.filter((p) => p.actual > 0).map((p) => ({ label: p.month, value: p.forecast }))}
                  color="#1E3A5F"
                  height={120}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confidence Band Note + Seasonal Callout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Confidence band detail */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Forecast Confidence Bands</p>
          <div className="space-y-3">
            {forecastPoints.filter((p) => p.actual === 0).map((p) => (
              <div key={p.month} className="flex items-center gap-3">
                <span className="w-8 text-[11px] font-medium shrink-0" style={{ color: '#475569' }}>{p.month}</span>
                <div className="flex-1 relative h-5 rounded overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                  {/* full band */}
                  <div
                    className="absolute inset-y-0 rounded"
                    style={{
                      left: `${((p.lower / (p.upper * 1.05)) * 100).toFixed(1)}%`,
                      width: `${(((p.upper - p.lower) / (p.upper * 1.05)) * 100).toFixed(1)}%`,
                      backgroundColor: '#1E3A5F20',
                    }}
                  />
                  {/* forecast point */}
                  <div
                    className="absolute top-1 bottom-1 w-0.5 rounded"
                    style={{
                      left: `${((p.forecast / (p.upper * 1.05)) * 100).toFixed(1)}%`,
                      backgroundColor: '#1E3A5F',
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono shrink-0" style={{ color: '#94A3B8' }}>
                  ${(p.lower / 1000).toFixed(0)}K–${(p.upper / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal callout */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }}>
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl">🎄</span>
            <div>
              <p className="text-sm font-bold" style={{ color: '#92400E' }}>Holiday Surge Expected Nov–Dec</p>
              <p className="text-[12px] mt-0.5" style={{ color: '#B45309' }}>
                +38% over baseline — highest revenue period of the year
              </p>
            </div>
          </div>
          <div className="space-y-3 text-[12px]">
            <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#FDE68A' }}>
              <span style={{ color: '#92400E' }}>November forecast lift</span>
              <span className="font-bold" style={{ color: '#059669' }}>+33% vs Oct</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#FDE68A' }}>
              <span style={{ color: '#92400E' }}>December forecast lift</span>
              <span className="font-bold" style={{ color: '#059669' }}>+38% vs Oct</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span style={{ color: '#92400E' }}>AI confidence score</span>
              <span className="font-bold" style={{ color: '#0F172A' }}>94.2%</span>
            </div>
          </div>
          <p className="text-[11px] mt-4 pt-3 border-t" style={{ borderColor: '#FDE68A', color: '#92400E' }}>
            Historical pattern: 2021–2024 avg holiday premium was +35%. Model trained on 4 years of weekly POS data plus regional foot-traffic signals.
          </p>
        </div>
      </div>
    </>
  );
}
