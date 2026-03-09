'use client';

import { useState } from 'react';
import { StatCard, DonutChart, BarChart, AreaChart, FormatSelector, CRESTLINE_FORMATS } from '@/components/demos/crestline';
import { FORMATS, DISTRICTS, MONTHLY_REVENUE, BRAND, COLORS } from '@/data/crestline';
import { Crown, Store, Tag, Sparkles } from 'lucide-react';

const REVENUE_BY_FORMAT = [
  { label: 'Flagship', value: 40, color: COLORS.flagship },
  { label: 'Standard', value: 32, color: COLORS.standard },
  { label: 'Rack', value: 16, color: COLORS.rack },
  { label: 'Counter', value: 12, color: COLORS.counter },
];

const FORMAT_ICONS: Record<string, typeof Crown> = {
  flagship: Crown,
  standard: Store,
  rack: Tag,
  counter: Sparkles,
};

export default function CompanyOverview() {
  const [format, setFormat] = useState<string>('flagship');

  /* Compute district bar data filtered by format */
  const districtData = DISTRICTS.map((d) => ({
    label: d.name,
    value: d.revenue[format] ?? 0,
    color: COLORS[format as keyof typeof COLORS] ?? COLORS.primary,
  }));

  /* 12-month trend: total across all formats or filtered */
  const trendData = MONTHLY_REVENUE.map((m) => ({
    label: m.month,
    value: Math.round((m.flagship + m.standard + m.rack + m.counter) * 10) / 10,
  }));

  const filteredTrendData = MONTHLY_REVENUE.map((m) => ({
    label: m.month,
    value: m[format as keyof typeof m] as number,
  }));

  const currentFormat = FORMATS.find((f) => f.id === format);
  const formatColor = currentFormat?.color ?? COLORS.primary;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: COLORS.primary }}>Company Overview</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Crestline Department Stores — {BRAND.stores} stores across {BRAND.formats} formats
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Stores" value="200" color={COLORS.primary} />
        <StatCard
          label="Annual Revenue"
          value="$2.8B"
          trend="up"
          trendValue="+14%"
          color={COLORS.accent}
          sparkline={[180, 192, 200, 210, 218, 228, 238, 248, 255, 264, 272, 280]}
        />
        <StatCard label="Avg Transaction" value="$280" color={COLORS.standard} />
        <StatCard
          label="YoY Growth"
          value="14%"
          trend="up"
          trendValue="+3.2pp"
          color="#059669"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Format */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: COLORS.primary }}>Revenue by Format</p>
          <DonutChart
            segments={REVENUE_BY_FORMAT}
            centerValue="$2.8B"
            centerLabel="Total"
            size={200}
          />
        </div>

        {/* Revenue by District */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: COLORS.primary }}>
            Revenue by District ({currentFormat?.name ?? 'All'}, $M)
          </p>
          <BarChart
            data={districtData}
            unit="M"
            color={formatColor}
          />
        </div>
      </div>

      {/* 12-Month Revenue Trend */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: COLORS.primary }}>
          12-Month Revenue Trend ({currentFormat?.name ?? 'Total'}, $M)
        </p>
        <AreaChart
          data={filteredTrendData}
          color={formatColor}
          height={200}
        />
      </div>

      {/* Format Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FORMATS.map((f) => {
          const Icon = FORMAT_ICONS[f.id] ?? Store;
          const isActive = f.id === format;

          return (
            <div
              key={f.id}
              className="rounded-xl border p-5 transition-all cursor-pointer"
              style={{
                borderColor: isActive ? f.color : '#E2E8F0',
                backgroundColor: isActive ? `${f.color}08` : '#FFFFFF',
                borderWidth: isActive ? 2 : 1,
              }}
              onClick={() => setFormat(f.id)}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${f.color}15` }}
                >
                  <Icon size={16} style={{ color: f.color }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                  {f.name}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#94A3B8' }}>Stores</span>
                  <span className="font-medium" style={{ color: COLORS.primary }}>{f.count}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#94A3B8' }}>Avg Revenue</span>
                  <span className="font-medium" style={{ color: COLORS.primary }}>{f.avgRevenue}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#94A3B8' }}>Avg Staff</span>
                  <span className="font-medium" style={{ color: COLORS.primary }}>{f.avgStaff}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
