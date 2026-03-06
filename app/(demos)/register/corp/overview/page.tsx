'use client';

import { useState } from 'react';
import { FormatSelector, StatCard, DonutChart, BarChart, AreaChart } from '@/components/demos/register';
import { FORMAT_META, DISTRICT_REVENUE, MONTHLY_REVENUE } from '@/data/register/store-data';
import type { FormatId } from '@/data/register/store-data';
import { Crown, Store, Tag, ShoppingBag } from 'lucide-react';

const REVENUE_BY_FORMAT = [
  { label: 'Flagship', value: 42, color: '#1E3A5F' },
  { label: 'Standard', value: 38, color: '#06B6D4' },
  { label: 'Outlet', value: 12, color: '#8B5CF6' },
  { label: 'Shop-in-Shop', value: 8, color: '#10B981' },
];

const FORMAT_ICONS = {
  flagship: Crown,
  standard: Store,
  outlet: Tag,
  'shop-in-shop': ShoppingBag,
} as const;

const FORMAT_COLORS: Record<string, string> = {
  flagship: '#1E3A5F',
  standard: '#06B6D4',
  outlet: '#8B5CF6',
  'shop-in-shop': '#10B981',
};

export default function CompanyOverview() {
  const [format, setFormat] = useState<string>('flagship');
  const currentFormat = format as FormatId;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Company Overview</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Summit Sleep Co. enterprise performance dashboard across 200 stores and 4 formats
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Stores" value="200" color="#1E3A5F" />
        <StatCard
          label="Annual Revenue"
          value="$1.4B"
          trend="up"
          trendValue="+12%"
          color="#1E3A5F"
          sparkline={[92, 96, 100, 98, 105, 108, 112, 116, 120, 124, 130, 140]}
        />
        <StatCard label="Avg ASP" value="$1,920" color="#06B6D4" />
        <StatCard
          label="YoY Growth"
          value="12%"
          trend="up"
          trendValue="+2.4pp"
          color="#10B981"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Revenue by Format */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Revenue by Format</p>
          <DonutChart
            segments={REVENUE_BY_FORMAT}
            centerValue="$1.4B"
            centerLabel="Total"
            size={200}
          />
        </div>

        {/* Revenue by District */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Revenue by District ({FORMAT_META[currentFormat].name})
          </p>
          <BarChart
            data={DISTRICT_REVENUE[currentFormat]}
            unit="M"
            color={FORMAT_COLORS[format]}
          />
        </div>
      </div>

      {/* 12-Month Revenue Trend */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          12-Month Revenue Trend ({FORMAT_META[currentFormat].name}, $M)
        </p>
        <AreaChart
          data={MONTHLY_REVENUE[currentFormat]}
          color={FORMAT_COLORS[format]}
          height={200}
        />
      </div>

      {/* Format Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {(Object.keys(FORMAT_META) as FormatId[]).map((fid) => {
          const meta = FORMAT_META[fid];
          const Icon = FORMAT_ICONS[fid];
          const isActive = fid === format;
          const fColor = FORMAT_COLORS[fid];

          return (
            <div
              key={fid}
              className="rounded-xl border p-5 transition-all cursor-pointer"
              style={{
                borderColor: isActive ? fColor : '#E2E8F0',
                backgroundColor: isActive ? `${fColor}08` : '#FFFFFF',
                borderWidth: isActive ? 2 : 1,
              }}
              onClick={() => setFormat(fid)}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${fColor}15` }}
                >
                  <Icon size={16} style={{ color: fColor }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>
                  {meta.name}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#94A3B8' }}>Stores</span>
                  <span className="font-medium" style={{ color: '#0F172A' }}>{meta.stores}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#94A3B8' }}>Avg Revenue</span>
                  <span className="font-medium" style={{ color: '#0F172A' }}>{meta.avgRevenue}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#94A3B8' }}>ASP</span>
                  <span className="font-medium" style={{ color: '#0F172A' }}>{meta.asp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
