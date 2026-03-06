'use client';

import { useState } from 'react';
import { StatCard, SankeyFlow, AreaChart, BarChart, DonutChart, ConfidenceBand, HeatMap } from '@/components/demos/register';

/* ── Sankey: Revenue → Comp Expense → Components → Formats ── */

const SANKEY_NODES = [
  { id: 'revenue', label: 'Revenue ($1.4B)' },
  { id: 'comp', label: 'Comp Expense ($42M)' },
  { id: 'base', label: 'Base ($24M)' },
  { id: 'commission', label: 'Commission ($12M)' },
  { id: 'spiffs', label: 'SPIFFs ($4M)' },
  { id: 'accelerators', label: 'Accelerators ($2M)' },
];

const SANKEY_LINKS = [
  { source: 'revenue', target: 'comp', value: 42, color: 'rgba(30,58,95,0.25)' },
  { source: 'comp', target: 'base', value: 24, color: 'rgba(71,85,105,0.25)' },
  { source: 'comp', target: 'commission', value: 12, color: 'rgba(30,58,95,0.25)' },
  { source: 'comp', target: 'spiffs', value: 4, color: 'rgba(6,182,212,0.25)' },
  { source: 'comp', target: 'accelerators', value: 2, color: 'rgba(16,185,129,0.25)' },
];

/* ── 12-month comp expense trend ─────────────────────────── */

const COMP_TREND = [
  { label: 'Mar', value: 3.4 }, { label: 'Apr', value: 3.3 }, { label: 'May', value: 3.8 },
  { label: 'Jun', value: 3.5 }, { label: 'Jul', value: 3.6 }, { label: 'Aug', value: 3.4 },
  { label: 'Sep', value: 3.9 }, { label: 'Oct', value: 3.6 }, { label: 'Nov', value: 4.2 },
  { label: 'Dec', value: 3.8 }, { label: 'Jan', value: 3.0 }, { label: 'Feb', value: 3.5 },
];

/* ── Comp-to-revenue ratio by format ─────────────────────── */

const COMP_RATIO = [
  { label: 'Flagship', value: 2.4, color: '#1E3A5F' },
  { label: 'Standard', value: 3.0, color: '#06B6D4' },
  { label: 'Outlet', value: 3.8, color: '#8B5CF6' },
  { label: 'Shop-in-Shop', value: 4.2, color: '#10B981' },
];

/* ── Comp expense by format ──────────────────────────────── */

const COMP_BY_FORMAT = [
  { label: 'Flagship', value: 35, color: '#1E3A5F' },
  { label: 'Standard', value: 38, color: '#06B6D4' },
  { label: 'Outlet', value: 18, color: '#8B5CF6' },
  { label: 'Shop-in-Shop', value: 9, color: '#10B981' },
];

/* ── Next quarter projection ─────────────────────────────── */

const Q_PROJECTION = [
  { label: 'Apr', value: 11.2, low: 10.4, high: 12.0 },
  { label: 'May', value: 11.4, low: 10.6, high: 12.2 },
  { label: 'Jun', value: 11.2, low: 10.4, high: 12.0 },
];

/* ── District HeatMap ────────────────────────────────────── */

const DISTRICT_NAMES = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'Pacific NW', 'Mountain', 'Mid-Atlantic', 'Great Lakes'];
const COMP_METRICS = ['Expense %', 'Turnover %', 'Attainment %', 'CSAT'];
const DISTRICT_DATA = [
  [25, 28, 82, 88],  // Northeast
  [30, 32, 78, 85],  // Southeast
  [35, 38, 72, 80],  // Midwest
  [40, 42, 68, 76],  // Southwest
  [22, 25, 85, 90],  // Pacific NW
  [45, 48, 62, 72],  // Mountain
  [28, 30, 80, 86],  // Mid-Atlantic
  [32, 35, 75, 82],  // Great Lakes
];

export default function ExecutiveView() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Executive View</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Enterprise compensation economics, ROI analysis, and strategic workforce metrics
        </p>
      </div>

      {/* 5 StatCards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Comp Expense" value="$42M" color="#1E3A5F" />
        <StatCard label="Comp-to-Revenue" value="3.0%" trend="down" trendValue="-0.2pp" color="#10B981" />
        <StatCard label="Avg OTE" value="$52K" color="#06B6D4" />
        <StatCard label="Turnover" value="34%" trend="down" trendValue="-2%" color="#F59E0B" sparkline={[42, 40, 38, 36, 35, 34]} />
        <StatCard label="Cost per Hire" value="$4.2K" color="#8B5CF6" />
      </div>

      {/* Sankey Flow */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Revenue to Compensation Flow
        </p>
        <SankeyFlow nodes={SANKEY_NODES} links={SANKEY_LINKS} height={280} />
      </div>

      {/* Comp Trend + Comp Ratio */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            12-Month Comp Expense Trend ($M)
          </p>
          <AreaChart data={COMP_TREND} color="#1E3A5F" />
          <div className="mt-2 text-center">
            <span className="text-[10px] font-mono" style={{ color: '#94A3B8' }}>
              Avg: $3.5M/mo &mdash; Revenue overlay: $116M/mo avg
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Comp-to-Revenue Ratio by Format (%)
          </p>
          <BarChart data={COMP_RATIO} unit="%" maxVal={5} />
          <div className="mt-3 pt-2 border-t text-center" style={{ borderColor: '#F1F5F9' }}>
            <span className="text-[10px]" style={{ color: '#94A3B8' }}>
              Industry benchmark: <span className="font-bold" style={{ color: '#10B981' }}>3.5%</span> &mdash; Summit Sleep at 3.0% (below avg)
            </span>
          </div>
        </div>
      </div>

      {/* Donut + Confidence Band */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Comp Expense by Format
          </p>
          <DonutChart
            segments={COMP_BY_FORMAT}
            centerValue="$42M"
            centerLabel="Total"
          />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
              Q2 Comp Expense Projection ($M)
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono" style={{ color: '#10B981' }}>High: $12.0M</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: '#0F172A' }}>Center: $11.2M</span>
              <span className="text-[10px] font-mono" style={{ color: '#F59E0B' }}>Low: $10.4M</span>
            </div>
          </div>
          <ConfidenceBand data={Q_PROJECTION} color="#1E3A5F" />
        </div>
      </div>

      {/* ROI Analysis Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div
          className="rounded-xl border-2 p-5"
          style={{ borderColor: '#10B981', backgroundColor: '#F0FDF4' }}
        >
          <div className="flex items-start gap-3">
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl text-[16px] font-bold text-white shrink-0"
              style={{ backgroundColor: '#10B981' }}
            >
              $
            </span>
            <div>
              <p className="text-[14px] font-bold" style={{ color: '#0F172A' }}>
                Every $1 in SPIFFs generates $14 in revenue
              </p>
              <p className="text-[11px] mt-1" style={{ color: '#475569' }}>
                SPIFF ROI: 1,400% &mdash; highest return of any comp component. Purple brand SPIFF alone drove $2.1M in incremental sales last quarter.
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border-2 p-5"
          style={{ borderColor: '#06B6D4', backgroundColor: '#ECFEFF' }}
        >
          <div className="flex items-start gap-3">
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl text-[16px] font-bold text-white shrink-0"
              style={{ backgroundColor: '#06B6D4' }}
            >
              %
            </span>
            <div>
              <p className="text-[14px] font-bold" style={{ color: '#0F172A' }}>
                Accelerator program ROI: 340%
              </p>
              <p className="text-[11px] mt-1" style={{ color: '#475569' }}>
                Top 15% of reps drive 38% of revenue. Accelerator investment of $2M returns $6.8M in incremental comp-attributed revenue above baseline.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* District HeatMap */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          District Comp Metrics
        </p>
        <HeatMap
          rows={DISTRICT_NAMES}
          cols={COMP_METRICS}
          data={DISTRICT_DATA}
          colorScale={{ low: '#10B981', mid: '#F59E0B', high: '#EF4444' }}
        />
        <div className="mt-3 pt-2 border-t text-center" style={{ borderColor: '#F1F5F9' }}>
          <span className="text-[10px]" style={{ color: '#94A3B8' }}>
            Mountain &amp; Southwest districts show highest expense ratios &mdash; comp plan optimization recommended
          </span>
        </div>
      </div>
    </>
  );
}
