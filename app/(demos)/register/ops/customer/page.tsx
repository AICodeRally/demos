'use client';

import { useState } from 'react';
import { FormatSelector, BarChart, AreaChart, RadarChart, BubbleChart } from '@/components/demos/register';
import { FORMAT_META, type FormatId } from '@/data/register/store-data';

/* ── Format-specific funnels ─────────────────────────────── */

const FUNNELS: Record<FormatId, { stage: string; count: number; color: string }[]> = {
  flagship: [
    { stage: 'Walk-In Traffic', count: 138, color: '#1E3A5F' },
    { stage: 'Browse & Explore', count: 102, color: '#06B6D4' },
    { stage: 'Sleep Assessment', count: 68, color: '#8B5CF6' },
    { stage: 'Try & Compare', count: 48, color: '#F59E0B' },
    { stage: 'Close Sale', count: 22, color: '#10B981' },
    { stage: 'Schedule Delivery', count: 21, color: '#059669' },
  ],
  standard: [
    { stage: 'Walk-In Traffic', count: 114, color: '#1E3A5F' },
    { stage: 'Browse Floor', count: 78, color: '#06B6D4' },
    { stage: 'Engage Rep', count: 42, color: '#8B5CF6' },
    { stage: 'Try & Compare', count: 32, color: '#F59E0B' },
    { stage: 'Close Sale', count: 16, color: '#10B981' },
    { stage: 'Schedule Delivery', count: 15, color: '#059669' },
  ],
  outlet: [
    { stage: 'Walk-In Traffic', count: 109, color: '#1E3A5F' },
    { stage: 'Browse Deals', count: 82, color: '#06B6D4' },
    { stage: 'Price Check', count: 56, color: '#F59E0B' },
    { stage: 'Try Mattress', count: 28, color: '#8B5CF6' },
    { stage: 'Quick Close', count: 18, color: '#10B981' },
    { stage: 'Pickup/Deliver', count: 17, color: '#059669' },
  ],
  'shop-in-shop': [
    { stage: 'Dept Store Traffic', count: 58, color: '#1E3A5F' },
    { stage: 'Notice Display', count: 32, color: '#06B6D4' },
    { stage: 'Approach Rep', count: 18, color: '#8B5CF6' },
    { stage: 'Try Mattress', count: 12, color: '#F59E0B' },
    { stage: 'Close Sale', count: 6, color: '#10B981' },
    { stage: 'Schedule Delivery', count: 5, color: '#059669' },
  ],
};

/* ── Conversion rate by stage ────────────────────────────── */

const STAGE_CONVERSION: Record<FormatId, { label: string; value: number; color?: string }[]> = {
  flagship: [
    { label: 'Traffic \u2192 Browse', value: 74, color: '#06B6D4' },
    { label: 'Browse \u2192 Assess', value: 67, color: '#8B5CF6' },
    { label: 'Assess \u2192 Try', value: 71, color: '#F59E0B' },
    { label: 'Try \u2192 Close', value: 46, color: '#10B981' },
    { label: 'Close \u2192 Deliver', value: 95, color: '#059669' },
  ],
  standard: [
    { label: 'Traffic \u2192 Browse', value: 68, color: '#06B6D4' },
    { label: 'Browse \u2192 Engage', value: 54, color: '#8B5CF6' },
    { label: 'Engage \u2192 Try', value: 76, color: '#F59E0B' },
    { label: 'Try \u2192 Close', value: 50, color: '#10B981' },
    { label: 'Close \u2192 Deliver', value: 94, color: '#059669' },
  ],
  outlet: [
    { label: 'Traffic \u2192 Browse', value: 75, color: '#06B6D4' },
    { label: 'Browse \u2192 Price', value: 68, color: '#F59E0B' },
    { label: 'Price \u2192 Try', value: 50, color: '#8B5CF6' },
    { label: 'Try \u2192 Close', value: 64, color: '#10B981' },
    { label: 'Close \u2192 Pickup', value: 94, color: '#059669' },
  ],
  'shop-in-shop': [
    { label: 'Traffic \u2192 Notice', value: 55, color: '#06B6D4' },
    { label: 'Notice \u2192 Approach', value: 56, color: '#8B5CF6' },
    { label: 'Approach \u2192 Try', value: 67, color: '#F59E0B' },
    { label: 'Try \u2192 Close', value: 50, color: '#10B981' },
    { label: 'Close \u2192 Deliver', value: 83, color: '#059669' },
  ],
};

/* ── 30-day traffic trend ────────────────────────────────── */

const TRAFFIC_TREND = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  value: 110 + Math.round(Math.sin(i * 0.5) * 18 + (i % 7 >= 5 ? 20 : 0) + Math.random() * 8),
}));

/* ── Customer segments (bubble chart) ────────────────────── */

const CUSTOMER_SEGMENTS = [
  { x: 72, y: 28, size: 85, color: '#1E3A5F', label: 'Sleep Upgraders' },
  { x: 35, y: 68, size: 45, color: '#06B6D4', label: 'First-Time Buyers' },
  { x: 22, y: 82, size: 30, color: '#F59E0B', label: 'Accessory Seekers' },
  { x: 48, y: 55, size: 60, color: '#EF4444', label: 'Price Hunters' },
  { x: 88, y: 18, size: 95, color: '#8B5CF6', label: 'Premium Collectors' },
];

/* ── Customer satisfaction radar ─────────────────────────── */

const CSAT_RADAR = [
  { label: 'Product Quality', value: 88 },
  { label: 'Service', value: 92 },
  { label: 'Price', value: 72 },
  { label: 'Selection', value: 85 },
  { label: 'Experience', value: 90 },
  { label: 'Delivery', value: 78 },
];
const CSAT_INDUSTRY_AVG = [80, 76, 70, 78, 72, 74];

/* ── Abandonment analysis ────────────────────────────────── */

const ABANDONMENT = [
  {
    transition: 'Browse \u2192 Engage',
    dropPct: '38%',
    reason: 'No greeting within 2 minutes',
    suggestion: 'Implement 30-second greeting standard',
    color: '#F59E0B',
  },
  {
    transition: 'Try \u2192 Close',
    dropPct: '58%',
    reason: 'Price shock at mattress + accessories total',
    suggestion: 'Lead with financing options before final total',
    color: '#EF4444',
  },
  {
    transition: 'Close \u2192 Deliver',
    dropPct: '6%',
    reason: 'Delivery window too narrow or too far out',
    suggestion: 'Offer same-week delivery for in-stock items',
    color: '#06B6D4',
  },
];

export default function CustomerJourney() {
  const [format, setFormat] = useState<string>('flagship');
  const currentFormat = format as FormatId;
  const funnel = FUNNELS[currentFormat];
  const maxCount = funnel[0].count;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Customer Journey</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          End-to-end conversion funnel, segment analysis, and abandonment insights for {FORMAT_META[currentFormat].name} stores
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* Funnel Visualization */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-5" style={{ color: '#0F172A' }}>
          Conversion Funnel &mdash; {FORMAT_META[currentFormat].name}
        </p>
        <div className="space-y-2">
          {funnel.map((stage, i) => {
            const widthPct = Math.max((stage.count / maxCount) * 100, 12);
            const prevCount = i > 0 ? funnel[i - 1].count : stage.count;
            const convPct = i > 0 ? ((stage.count / prevCount) * 100).toFixed(0) : '100';
            return (
              <div key={stage.stage} className="flex items-center gap-4">
                <span className="w-[140px] text-right text-[12px] font-medium shrink-0" style={{ color: '#475569' }}>
                  {stage.stage}
                </span>
                <div className="flex-1 relative">
                  <div
                    className="h-9 rounded-lg flex items-center justify-between px-4 transition-all duration-500"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: stage.color,
                      minWidth: '80px',
                    }}
                  >
                    <span className="text-white text-[13px] font-bold">{stage.count}</span>
                    <span className="text-white/80 text-[11px] font-mono">
                      {i > 0 ? `${convPct}%` : ''}
                    </span>
                  </div>
                </div>
                {i > 0 && (
                  <span className="text-[11px] font-mono shrink-0 w-[48px]" style={{ color: parseInt(convPct) >= 70 ? '#10B981' : parseInt(convPct) >= 50 ? '#F59E0B' : '#EF4444' }}>
                    {convPct}% cvr
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t text-center" style={{ borderColor: '#F1F5F9' }}>
          <span className="text-[12px]" style={{ color: '#94A3B8' }}>
            Overall Conversion: Traffic \u2192 Sale ={' '}
            <span className="font-bold" style={{ color: '#10B981' }}>
              {((funnel[funnel.length - 2].count / funnel[0].count) * 100).toFixed(1)}%
            </span>
          </span>
        </div>
      </div>

      {/* Conversion Rate by Stage + Traffic Trend */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Stage Conversion Rate (%)
          </p>
          <BarChart data={STAGE_CONVERSION[currentFormat]} unit="%" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            30-Day Traffic Trend (daily visitors)
          </p>
          <AreaChart data={TRAFFIC_TREND} color="#06B6D4" showDots={false} />
        </div>
      </div>

      {/* Bubble Chart + Radar Chart */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Customer Segments
          </p>
          <BubbleChart
            data={CUSTOMER_SEGMENTS}
            xLabel="Avg Spend Index"
            yLabel="Visit Frequency"
            height={300}
          />
          <p className="text-[10px] text-center mt-2" style={{ color: '#94A3B8' }}>
            Bubble size = estimated lifetime value
          </p>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Customer Satisfaction (CSAT)
          </p>
          <div className="flex justify-center">
            <RadarChart axes={CSAT_RADAR} color="#8B5CF6" benchmarkData={CSAT_INDUSTRY_AVG} size={280} />
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ backgroundColor: '#8B5CF6' }} />
              <span className="text-[11px]" style={{ color: '#475569' }}>Summit Sleep</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded border-b border-dashed" style={{ borderColor: '#A8A29E' }} />
              <span className="text-[11px]" style={{ color: '#475569' }}>Industry Avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Abandonment Analysis Cards */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Abandonment Analysis
        </p>
        <div className="grid grid-cols-3 gap-4">
          {ABANDONMENT.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border-l-4 p-4"
              style={{
                borderLeftColor: item.color,
                backgroundColor: '#F8FAFC',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-semibold" style={{ color: '#0F172A' }}>
                  Drop-off: {item.transition}
                </span>
                <span className="text-[13px] font-bold font-mono" style={{ color: item.color }}>
                  {item.dropPct}
                </span>
              </div>
              <p className="text-[11px] mb-2" style={{ color: '#475569' }}>
                <span className="font-medium" style={{ color: '#EF4444' }}>Reason:</span> {item.reason}
              </p>
              <p className="text-[11px]" style={{ color: '#475569' }}>
                <span className="font-medium" style={{ color: '#10B981' }}>Action:</span> {item.suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
