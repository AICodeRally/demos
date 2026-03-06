'use client';

import { useState } from 'react';
import { FormatSelector, BubbleChart, BarChart, RadarChart, AreaChart } from '@/components/demos/register';

/* ── Competitive positioning (normalized to 0-100 scale for BubbleChart) ── */
const COMPETITIVE_MAP = [
  { x: 11, y: 60, size: 8, color: '#1E3A5F', label: 'Summit Sleep' },
  { x: 100, y: 44, size: 42, color: '#EF4444', label: 'Mattress Firm' },
  { x: 36, y: 100, size: 15, color: '#8B5CF6', label: 'Sleep Number' },
  { x: 3, y: 56, size: 5, color: '#06B6D4', label: 'Casper' },
  { x: 2, y: 66, size: 4, color: '#10B981', label: 'Purple' },
];

/* ── Market share by region (grouped bars) ── */
const REGIONS = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'Pacific NW', 'Mountain'];

const REGION_SHARE_SUMMIT = [
  { label: 'Northeast', value: 10, color: '#1E3A5F' },
  { label: 'Southeast', value: 8, color: '#1E3A5F' },
  { label: 'Midwest', value: 7, color: '#1E3A5F' },
  { label: 'Southwest', value: 9, color: '#1E3A5F' },
  { label: 'Pacific NW', value: 6, color: '#1E3A5F' },
  { label: 'Mountain', value: 5, color: '#1E3A5F' },
];

/* ── Radar: Competitive dimensions ── */
const COMPETITIVE_AXES = [
  { label: 'Price', value: 72 },
  { label: 'Selection', value: 85 },
  { label: 'Service', value: 90 },
  { label: 'Location', value: 60 },
  { label: 'Brand', value: 55 },
  { label: 'Digital', value: 45 },
];

const INDUSTRY_BENCHMARK = [65, 70, 60, 80, 70, 75];

/* ── 5-year market share trend ── */
const MARKET_SHARE_TREND = [
  { label: '2021', value: 5.0 },
  { label: '2022', value: 5.4 },
  { label: '2023', value: 6.1 },
  { label: '2024', value: 6.8 },
  { label: '2025', value: 7.4 },
  { label: '2026E', value: 8.0 },
];

/* ── Competitor cards ── */
const COMPETITORS = [
  { name: 'Mattress Firm', stores: '1,800', revenue: '$5.2B', threat: 'High', color: '#EF4444', threatBg: '#FEE2E2' },
  { name: 'Sleep Number', stores: '650', revenue: '$2.1B', threat: 'Medium', color: '#8B5CF6', threatBg: '#EDE9FE' },
  { name: 'Casper', stores: '60', revenue: '$580M', threat: 'Medium', color: '#06B6D4', threatBg: '#CFFAFE' },
  { name: 'Purple', stores: '30', revenue: '$420M', threat: 'Low', color: '#10B981', threatBg: '#D1FAE5' },
];

/* ── SWOT data ── */
const SWOT = [
  {
    title: 'Strengths',
    color: '#10B981',
    bg: '#D1FAE5',
    items: ['Format diversity (4 tiers)', 'Sleep expertise & consultative selling', 'Premium brand partnerships', 'High ASP ($1,920 avg)'],
  },
  {
    title: 'Weaknesses',
    color: '#EF4444',
    bg: '#FEE2E2',
    items: ['Scale vs Mattress Firm (200 vs 1,800)', 'Limited digital/DTC presence', 'Geographic concentration', 'High associate turnover'],
  },
  {
    title: 'Opportunities',
    color: '#06B6D4',
    bg: '#CFFAFE',
    items: ['DTC + sleep tech market growth', 'Shop-in-Shop expansion via retailers', 'Connected sleep ecosystem', 'International expansion'],
  },
  {
    title: 'Threats',
    color: '#F59E0B',
    bg: '#FEF3C7',
    items: ['Online-first brands (Casper, Purple DTC)', 'Amazon mattress growth', 'Economic downturn → trade-down', 'Mattress Firm acquisitions'],
  },
];

export default function MarketPosition() {
  const [format, setFormat] = useState<string>('flagship');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Market Position</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Competitive landscape analysis for the $18B U.S. mattress retail market
        </p>
      </div>

      {/* Competitive Positioning Map */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Competitive Positioning (Store Count vs ASP, bubble = market share)
        </p>
        <BubbleChart
          data={COMPETITIVE_MAP}
          xLabel="Relative Store Count"
          yLabel="Average Selling Price"
          height={320}
        />
      </div>

      {/* Market Share by Region + Radar */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Summit Market Share by Region (%)</p>
          <BarChart data={REGION_SHARE_SUMMIT} unit="%" color="#1E3A5F" />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Competitive Dimensions (vs Industry Avg)
          </p>
          <div className="flex justify-center">
            <RadarChart
              axes={COMPETITIVE_AXES}
              maxVal={100}
              color="#1E3A5F"
              benchmarkData={INDUSTRY_BENCHMARK}
              size={260}
            />
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded" style={{ backgroundColor: '#1E3A5F' }} />
              <span className="text-[10px]" style={{ color: '#475569' }}>Summit Sleep</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded border-dashed" style={{ borderBottom: '1.5px dashed #A8A29E' }} />
              <span className="text-[10px]" style={{ color: '#475569' }}>Industry Avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Year Trend */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>5-Year Market Share Trend (%)</p>
        <AreaChart data={MARKET_SHARE_TREND} color="#1E3A5F" height={180} />
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {COMPETITORS.map((c) => (
          <div key={c.name} className="rounded-xl bg-white border p-5" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>{c.name}</span>
              </div>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: c.threatBg, color: c.color }}
              >
                {c.threat}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Stores</span>
                <span className="font-medium" style={{ color: '#0F172A' }}>{c.stores}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Revenue</span>
                <span className="font-medium" style={{ color: '#0F172A' }}>{c.revenue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SWOT Grid */}
      <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>SWOT Analysis</p>
      <div className="grid grid-cols-2 gap-4">
        {SWOT.map((q) => (
          <div
            key={q.title}
            className="rounded-xl border p-5"
            style={{ borderColor: '#E2E8F0', borderLeft: `4px solid ${q.color}` }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: q.color }}>{q.title}</p>
            <ul className="space-y-1.5">
              {q.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#475569' }}>
                  <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: q.color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
