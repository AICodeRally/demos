'use client';

import { useState } from 'react';
import { StatCard, BarChart, DonutChart, HeatMap } from '@/components/demos/crestline';
import { SPIFFS, SELLING_DEPTS, COLORS } from '@/data/crestline';

/* ── Promotion data ──────────────────────────────────────── */

const MONTH_LABELS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

const PROMO_EVENTS = [
  { name: 'Spring Designer Launch', months: [0, 1], span: 'Mar - Apr', color: '#7c3aed', departments: ['Designer Apparel', 'Accessories'], budget: '$1.8M', lift: '15%' },
  { name: 'Mother\'s Day Beauty', months: [2], span: 'May', color: '#d946ef', departments: ['Cosmetics & Fragrance'], budget: '$1.2M', lift: '22%' },
  { name: 'Summer Shoe Event', months: [4], span: 'Jul', color: '#2563eb', departments: ['Shoes'], budget: '$0.9M', lift: '18%' },
  { name: 'Back-to-School', months: [5], span: 'Aug', color: '#059669', departments: ['Designer Apparel', 'Shoes'], budget: '$1.4M', lift: '20%' },
  { name: 'Holiday Gift Guide', months: [8, 9], span: 'Nov - Dec', color: '#c9a84c', departments: ['All Departments'], budget: '$3.2M', lift: '35%' },
  { name: 'Winter Clearance', months: [10], span: 'Jan', color: '#64748b', departments: ['Designer Apparel', 'Home'], budget: '$0.8M', lift: '12%' },
];

const totalSpiffBudget = '$180K';
const totalPromoBudget = '$9.3M';

const ROI_DATA = PROMO_EVENTS.map((p) => ({
  label: p.name.split(' ').slice(0, 2).join(' '),
  value: parseInt(p.lift),
  color: p.color,
}));

const SPEND_SEGMENTS = [
  { label: 'Digital Ads', value: 32, color: COLORS.flagship },
  { label: 'In-Store Events', value: 24, color: COLORS.standard },
  { label: 'SPIFFs & Bonuses', value: 20, color: COLORS.accent },
  { label: 'Visual Merch', value: 14, color: COLORS.rack },
  { label: 'Influencer / PR', value: 10, color: COLORS.counter },
];

// Promo x Department participation matrix
const PROMO_DEPT_MATRIX = [
  [0, 100, 0, 100, 0],   // Spring Designer Launch
  [100, 0, 0, 0, 0],     // Mother's Day Beauty
  [0, 0, 100, 0, 0],     // Summer Shoe Event
  [0, 100, 100, 0, 0],   // Back-to-School
  [100, 100, 100, 100, 100], // Holiday Gift Guide
  [0, 100, 0, 0, 100],   // Winter Clearance
];

// Monthly promo calendar view
const MONTHLY_ACTIVITY = [
  { month: 'Mar', events: 1, spiffs: 2, spend: '$0.9M' },
  { month: 'Apr', events: 1, spiffs: 2, spend: '$0.9M' },
  { month: 'May', events: 1, spiffs: 1, spend: '$1.2M' },
  { month: 'Jun', events: 0, spiffs: 1, spend: '$0.2M' },
  { month: 'Jul', events: 1, spiffs: 1, spend: '$0.9M' },
  { month: 'Aug', events: 1, spiffs: 1, spend: '$1.4M' },
  { month: 'Sep', events: 0, spiffs: 1, spend: '$0.2M' },
  { month: 'Oct', events: 0, spiffs: 1, spend: '$0.2M' },
  { month: 'Nov', events: 1, spiffs: 3, spend: '$1.6M' },
  { month: 'Dec', events: 1, spiffs: 3, spend: '$1.6M' },
  { month: 'Jan', events: 1, spiffs: 1, spend: '$0.8M' },
  { month: 'Feb', events: 0, spiffs: 1, spend: '$0.2M' },
];

export default function PromotionsAndSpiffs() {
  const [selectedPromo, setSelectedPromo] = useState<number>(0);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Promotions & SPIFFs</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          6 promotional events and 3 active SPIFFs driving {totalPromoBudget} in annual spend with targeted revenue lift
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Promo Budget" value={totalPromoBudget} color={COLORS.primary} />
        <StatCard label="SPIFF Budget" value={totalSpiffBudget} color={COLORS.accent} />
        <StatCard label="Active SPIFFs" value={String(SPIFFS.filter((s) => s.active).length)} color="#10B981" />
        <StatCard label="Avg Lift" value="20%" trend="up" trendValue="+3pp" color={COLORS.flagship} />
      </div>

      {/* SPIFF Cards */}
      <p className="text-sm font-semibold mb-3" style={{ color: 'var(--pl-text)' }}>Active SPIFF Programs</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {SPIFFS.map((spiff) => (
          <div key={spiff.name} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)', borderTopWidth: 3, borderTopColor: COLORS.accent }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>{spiff.name}</p>
              {spiff.active && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: '#10B98118', color: '#10B981' }}>
                  Active
                </span>
              )}
            </div>
            <p className="text-2xl font-bold mb-2" style={{ color: COLORS.accent }}>${spiff.amount}</p>
            <p className="text-[11px] mb-3" style={{ color: 'var(--pl-text-secondary)' }}>{spiff.trigger}</p>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--pl-text-muted)' }}>Expires</span>
              <span className="font-mono" style={{ color: 'var(--pl-text)' }}>{spiff.expires ?? 'Ongoing'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Promotion Timeline */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Annual Promotion Timeline</p>
        <div className="relative">
          <div className="flex mb-2">
            {MONTH_LABELS.map((m) => (
              <div key={m} className="flex-1 text-center text-[10px] font-medium" style={{ color: 'var(--pl-text-muted)' }}>{m}</div>
            ))}
          </div>
          <div className="space-y-2">
            {PROMO_EVENTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-[130px] text-right text-[11px] shrink-0 truncate" style={{ color: 'var(--pl-text-secondary)' }}>{p.name}</span>
                <div className="flex-1 relative h-6">
                  {p.months.map((m) => {
                    const left = (m / 12) * 100;
                    const width = (1 / 12) * 100;
                    return (
                      <div
                        key={m}
                        className="absolute top-0 h-full rounded cursor-pointer transition-opacity"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          backgroundColor: p.color,
                          opacity: selectedPromo === i ? 1 : 0.6,
                        }}
                        onClick={() => setSelectedPromo(i)}
                      >
                        <span className="text-[8px] text-white font-medium px-1 truncate block leading-6">{p.span}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI Bar + Spend Donut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Revenue Lift by Promotion (%)</p>
          <BarChart data={ROI_DATA} unit="%" />
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Promotional Spend Breakdown</p>
          <DonutChart segments={SPEND_SEGMENTS} centerValue={totalPromoBudget} centerLabel="Total Spend" size={200} />
        </div>
      </div>

      {/* Promo x Department HeatMap */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Promotion x Department Participation</p>
        <HeatMap
          rows={PROMO_EVENTS.map((p) => p.name)}
          cols={SELLING_DEPTS.map((d) => d.name.split(' ')[0])}
          data={PROMO_DEPT_MATRIX}
          colorScale={{ low: '#F1F5F9', mid: COLORS.standard, high: COLORS.primary }}
        />
        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.primary }} />
            <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>Participating</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--pl-stripe)', border: '1px solid var(--pl-border)' }} />
            <span className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>Not participating</span>
          </div>
        </div>
      </div>

      {/* Monthly Calendar Table */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: 'var(--pl-card)', borderColor: 'var(--pl-border)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Monthly Promotion Calendar</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                {['Month', 'Events', 'Active SPIFFs', 'Est. Spend'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-semibold" style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MONTHLY_ACTIVITY.map((row) => (
                <tr key={row.month} style={{ borderBottom: '1px solid var(--pl-stripe)' }}>
                  <td className="py-2 px-3 font-medium" style={{ color: 'var(--pl-text)' }}>{row.month}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: row.events > 0 ? COLORS.flagship : 'var(--pl-text-muted)' }}>{row.events}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: row.spiffs > 1 ? COLORS.accent : 'var(--pl-text-secondary)' }}>{row.spiffs}</td>
                  <td className="py-2 px-3 font-mono font-medium" style={{ color: 'var(--pl-text)' }}>{row.spend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promo Detail Cards */}
      <p className="text-sm font-semibold mb-3" style={{ color: 'var(--pl-text)' }}>Promotion Details</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROMO_EVENTS.map((p, i) => (
          <div
            key={p.name}
            className="rounded-xl border p-4 cursor-pointer transition-all"
            style={{
              borderColor: selectedPromo === i ? p.color : 'var(--pl-border)',
              borderWidth: selectedPromo === i ? 2 : 1,
              borderTopWidth: 3,
              borderTopColor: p.color,
              backgroundColor: selectedPromo === i ? `${p.color}08` : 'var(--pl-card)',
            }}
            onClick={() => setSelectedPromo(i)}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>{p.name}</p>
            <p className="text-[11px] mb-3" style={{ color: 'var(--pl-text-muted)' }}>{p.span}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--pl-text-muted)' }}>Departments</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {p.departments.map((d) => (
                    <span key={d} className="rounded px-1 py-0.5 text-[9px] font-medium" style={{ backgroundColor: 'var(--pl-stripe)', color: 'var(--pl-text-secondary)' }}>{d.split(' ')[0]}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--pl-text-muted)' }}>Budget</span>
                <span className="font-mono font-medium" style={{ color: 'var(--pl-text)' }}>{p.budget}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--pl-text-muted)' }}>Projected Lift</span>
                <span className="font-mono font-semibold" style={{ color: '#10B981' }}>+{p.lift}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
