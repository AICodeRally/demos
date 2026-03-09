'use client';

import { useState } from 'react';
import { StatCard, DonutChart, BarChart, FormatSelector } from '@/components/demos/crestline';
import { PRODUCT_MIX, PRODUCTS, SELLING_DEPTS, FORMATS, COLORS } from '@/data/crestline';

/* ── Derived data ────────────────────────────────────────── */

const MIX_DONUT = PRODUCT_MIX.map((m) => ({
  label: m.department,
  value: m.pct,
  color: m.color,
}));

const REVENUE_BARS = PRODUCT_MIX.map((m) => ({
  label: m.department.split(' ')[0],
  value: m.revenue,
  color: m.color,
}));

// Margin analysis by department
const DEPT_MARGINS = SELLING_DEPTS.map((dept) => {
  const deptProducts = PRODUCTS.filter((p) => p.department === dept.id);
  const avgMargin = deptProducts.length > 0
    ? Math.round(deptProducts.reduce((s, p) => s + p.margin, 0) / deptProducts.length * 100)
    : 0;
  const mix = PRODUCT_MIX.find((m) => m.department === dept.name);
  return {
    department: dept.name,
    margin: `${avgMargin}%`,
    revenue: mix ? `$${mix.revenue}M` : '$0M',
    contribution: mix ? `${mix.pct}%` : '0%',
    baseRate: `${(dept.baseRate * 100).toFixed(1)}%`,
    premiumRate: `${(dept.premiumRate * 100).toFixed(1)}%`,
    color: dept.color,
  };
});

const MARGIN_BAR_DATA = SELLING_DEPTS.map((dept) => {
  const deptProducts = PRODUCTS.filter((p) => p.department === dept.id);
  const avgMargin = deptProducts.length > 0
    ? Math.round(deptProducts.reduce((s, p) => s + p.margin, 0) / deptProducts.length * 100)
    : 0;
  return { label: dept.name.split(' ')[0], value: avgMargin, color: dept.color };
});

// Format-specific mix notes
const FORMAT_MIX_NOTES: Record<string, { note: string; highlight: string }> = {
  flagship: { note: 'Designer Apparel dominates at 35%. Premium fragrance and luxury accessories drive highest ASP across all formats.', highlight: 'Luxury-first mix with designer focus' },
  standard: { note: 'Balanced mix with Shoes leading at 24%. Strong cosmetics counter presence with steady accessory attachment.', highlight: 'Balanced everyday luxury mix' },
  rack: { note: 'Shoes heavy (32%) with off-price designer. Lower margin but high volume. Home category over-indexes.', highlight: 'Volume play, value-driven shoppers' },
  counter: { note: 'Cosmetics & Fragrance at 55%. Concentrated counter selling with high commission rates and loyalty upsell.', highlight: 'Counter-intensive, beauty-first model' },
};

const totalRevenue = PRODUCT_MIX.reduce((s, m) => s + m.revenue, 0);

export default function ProductMix() {
  const [format, setFormat] = useState<string>('flagship');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Product Mix</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Category allocation, margin analysis, and department performance across 5 selling departments
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`$${totalRevenue}M`} color={COLORS.primary} />
        <StatCard label="Departments" value="5" color={COLORS.accent} />
        <StatCard label="Product SKUs" value={String(PRODUCTS.length)} color={COLORS.flagship} />
        <StatCard label="Avg Margin" value="50%" trend="up" trendValue="+2pp" color="#10B981" />
      </div>

      {/* Donut + Revenue Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Revenue by Department (%)</p>
          <DonutChart segments={MIX_DONUT} centerValue={`$${totalRevenue}M`} centerLabel="Revenue" size={200} />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Department Revenue ($M)</p>
          <BarChart data={REVENUE_BARS} unit="M" />
        </div>
      </div>

      {/* Margin Analysis Table */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Department Margin & Commission Analysis</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                {['Department', 'Avg Margin', 'Revenue', 'Mix %', 'Base Rate', 'Premium Rate'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-semibold" style={{ color: '#94A3B8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEPT_MARGINS.map((row) => (
                <tr key={row.department} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                      <span className="font-medium" style={{ color: '#0F172A' }}>{row.department}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 font-mono font-semibold" style={{ color: COLORS.accent }}>{row.margin}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: '#0F172A' }}>{row.revenue}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: '#475569' }}>{row.contribution}</td>
                  <td className="py-2 px-3 font-mono" style={{ color: '#475569' }}>{row.baseRate}</td>
                  <td className="py-2 px-3 font-mono font-semibold" style={{ color: '#10B981' }}>{row.premiumRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Margin Bar Chart */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Average Product Margin by Department (%)</p>
        <BarChart data={MARGIN_BAR_DATA} unit="%" />
      </div>

      {/* Product Catalog Grid */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Product Catalog</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRODUCTS.map((p) => {
            const dept = SELLING_DEPTS.find((d) => d.id === p.department);
            return (
              <div key={p.id} className="rounded-lg border p-3" style={{ borderColor: '#E2E8F0', borderLeftWidth: 3, borderLeftColor: dept?.color ?? '#94A3B8' }}>
                <p className="text-xs font-medium truncate" style={{ color: '#0F172A' }}>{p.name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>{p.category}</p>
                <div className="mt-2 flex justify-between text-[11px]">
                  <span className="font-mono font-medium" style={{ color: '#0F172A' }}>${p.price}</span>
                  <span className="font-mono" style={{ color: '#10B981' }}>{Math.round(p.margin * 100)}% margin</span>
                </div>
                {p.tags.length > 0 && (
                  <div className="mt-1.5 flex gap-1 flex-wrap">
                    {p.tags.map((tag) => (
                      <span key={tag} className="rounded px-1 py-0.5 text-[9px] font-medium" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Format Mix Impact */}
      <FormatSelector selected={format} onSelect={setFormat} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FORMATS.map((f) => {
          const isActive = f.id === format;
          const note = FORMAT_MIX_NOTES[f.id];
          return (
            <div
              key={f.id}
              className="rounded-xl border p-4 cursor-pointer transition-all"
              style={{
                borderColor: isActive ? f.color : '#E2E8F0',
                backgroundColor: isActive ? `${f.color}08` : '#FFFFFF',
                borderWidth: isActive ? 2 : 1,
              }}
              onClick={() => setFormat(f.id)}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>{f.name}</p>
              <p className="text-[11px] mb-2" style={{ color: '#94A3B8' }}>{f.count} stores</p>
              <p className="text-[11px] mb-2" style={{ color: '#475569' }}>{note?.note}</p>
              <p className="text-[10px] italic" style={{ color: f.color }}>{note?.highlight}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
