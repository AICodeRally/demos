'use client';

import { useState } from 'react';
import { StatCard, DonutChart, BarChart, FormatSelector } from '@/components/demos/crestline';
import { FORMATS, DISTRICTS, MONTHLY_REVENUE, BRAND, COLORS } from '@/data/crestline';
import { Crown, Store, Tag, Sparkles, MapPin } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

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

  /* Multi-line chart data: all 4 formats as separate series */
  const multiLineData = MONTHLY_REVENUE.map((m) => ({
    month: m.month,
    Flagship: m.flagship,
    Standard: m.standard,
    Rack: m.rack,
    Counter: m.counter,
    Total: Math.round((m.flagship + m.standard + m.rack + m.counter) * 10) / 10,
  }));

  const currentFormat = FORMATS.find((f) => f.id === format);
  const formatColor = currentFormat?.color ?? COLORS.primary;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--pl-text)' }}>Company Overview</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          Crestline Department Stores — {BRAND.stores} stores across {BRAND.formats} formats
        </p>
      </div>

      <FormatSelector selected={format} onSelect={setFormat} />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Stores" value="200" sparkline={[182, 185, 188, 190, 192, 195, 196, 198, 199, 200]} color={COLORS.primary} />
        <StatCard
          label="Annual Revenue"
          value="$2.8B"
          trend="up"
          trendValue="+14%"
          color={COLORS.accent}
          sparkline={[180, 192, 200, 210, 218, 228, 238, 248, 255, 264, 272, 280]}
        />
        <StatCard label="Avg Transaction" value="$280" sparkline={[245, 248, 252, 258, 262, 268, 272, 275, 278, 280]} color={COLORS.standard} />
        <StatCard label="Associates" value="3,200" sparkline={[2800, 2900, 3000, 3050, 3100, 3120, 3150, 3180, 3200]} color={COLORS.flagship} />
        <StatCard label="Districts" value="8" color="#2563eb" />
        <StatCard
          label="YoY Growth"
          value="14%"
          trend="up"
          trendValue="+3.2pp"
          color="#059669"
          sparkline={[8, 9, 10, 10, 11, 11, 12, 13, 13, 14]}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Format */}
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Revenue by Format</p>
          <DonutChart
            segments={REVENUE_BY_FORMAT}
            centerValue="$2.8B"
            centerLabel="Total"
            size={200}
          />
        </div>

        {/* Revenue by District */}
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Revenue by District ({currentFormat?.name ?? 'All'}, $M)
          </p>
          <BarChart
            data={districtData}
            unit="M"
            color={formatColor}
          />
        </div>
      </div>

      {/* 12-Month Revenue Trend — Multi-Line (all 4 formats) */}
      <div className="rounded-xl border p-6 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>
            12-Month Revenue Trend by Format ($M)
          </p>
          <div className="flex items-center gap-3">
            {[
              { key: 'Flagship', color: COLORS.flagship },
              { key: 'Standard', color: COLORS.standard },
              { key: 'Rack', color: COLORS.rack },
              { key: 'Counter', color: COLORS.counter },
            ].map((s) => (
              <div key={s.key} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>{s.key}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={multiLineData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gFlagship" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.flagship} stopOpacity={0.2} />
                <stop offset="95%" stopColor={COLORS.flagship} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gStandard" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.standard} stopOpacity={0.2} />
                <stop offset="95%" stopColor={COLORS.standard} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gRack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.rack} stopOpacity={0.2} />
                <stop offset="95%" stopColor={COLORS.rack} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gCounter" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.counter} stopOpacity={0.2} />
                <stop offset="95%" stopColor={COLORS.counter} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--pl-stripe)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--pl-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--pl-text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--pl-border)' }}
              formatter={((value: number) => [`$${value}M`]) as never}
            />
            <Area type="monotone" dataKey="Flagship" stroke={COLORS.flagship} fill="url(#gFlagship)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="Standard" stroke={COLORS.standard} fill="url(#gStandard)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="Rack" stroke={COLORS.rack} fill="url(#gRack)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="Counter" stroke={COLORS.counter} fill="url(#gCounter)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* District Mini-Summary Grid */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} style={{ color: COLORS.primary }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>District Performance</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DISTRICTS.map((d) => {
            const totalRev = (d.revenue.flagship ?? 0) + (d.revenue.standard ?? 0) + (d.revenue.rack ?? 0) + (d.revenue.counter ?? 0);
            const attPct = d.attainment;
            const barColor = attPct >= 96 ? '#059669' : attPct >= 94 ? '#F59E0B' : '#EF4444';
            return (
              <div
                key={d.name}
                className="rounded-xl border p-3.5"
                style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}
              >
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--pl-text)' }}>{d.name}</p>
                <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--pl-text-muted)' }}>{d.dm}</p>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-lg font-bold" style={{ color: 'var(--pl-text)' }}>{d.stores}</span>
                  <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>stores</span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>Attainment</span>
                    <span className="text-[10px] font-semibold" style={{ color: barColor }}>{attPct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--pl-stripe)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(attPct, 100)}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
                <p className="text-[10px] mt-1.5" style={{ color: 'var(--pl-text-muted)' }}>
                  ${totalRev}M revenue
                </p>
              </div>
            );
          })}
        </div>
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
                borderColor: isActive ? f.color : 'var(--pl-border)',
                backgroundColor: isActive ? `${f.color}08` : 'var(--pl-card)',
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
                <span className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>
                  {f.name}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--pl-text-muted)' }}>Stores</span>
                  <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{f.count}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--pl-text-muted)' }}>Avg Revenue</span>
                  <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{f.avgRevenue}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--pl-text-muted)' }}>Avg Staff</span>
                  <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{f.avgStaff}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
