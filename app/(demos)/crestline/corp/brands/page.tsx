'use client';

import { DonutChart, BarChart, HeatMap } from '@/components/demos/crestline';
import { COLORS, SELLING_DEPTS, PRODUCT_MIX } from '@/data/crestline';

/* Brand catalog by selling department */
const DEPT_BRANDS = [
  {
    dept: 'Cosmetics & Fragrance',
    color: '#d946ef',
    brands: [
      { name: 'Chanel', type: 'Luxury', exclusiveSKUs: 18, coopFund: '$1.8M', share: 28 },
      { name: 'La Mer', type: 'Prestige', exclusiveSKUs: 12, coopFund: '$1.2M', share: 22 },
      { name: 'MAC', type: 'Professional', exclusiveSKUs: 8, coopFund: '$0.6M', share: 18 },
      { name: 'Jo Malone', type: 'Lifestyle', exclusiveSKUs: 14, coopFund: '$0.9M', share: 16 },
    ],
  },
  {
    dept: 'Designer Apparel',
    color: '#7c3aed',
    brands: [
      { name: 'Burberry', type: 'Luxury', exclusiveSKUs: 22, coopFund: '$2.4M', share: 32 },
      { name: 'Theory', type: 'Contemporary', exclusiveSKUs: 15, coopFund: '$1.1M', share: 24 },
      { name: 'Vince', type: 'Contemporary', exclusiveSKUs: 10, coopFund: '$0.8M', share: 20 },
    ],
  },
  {
    dept: 'Shoes',
    color: '#2563eb',
    brands: [
      { name: 'Louboutin', type: 'Luxury', exclusiveSKUs: 8, coopFund: '$1.4M', share: 22 },
      { name: 'Cole Haan', type: 'Premium', exclusiveSKUs: 12, coopFund: '$0.7M', share: 20 },
      { name: 'Nike', type: 'Athletic', exclusiveSKUs: 6, coopFund: '$0.5M', share: 18 },
      { name: 'UGG', type: 'Casual', exclusiveSKUs: 8, coopFund: '$0.4M', share: 15 },
    ],
  },
  {
    dept: 'Accessories & Handbags',
    color: '#c9a84c',
    brands: [
      { name: 'Louis Vuitton', type: 'Luxury', exclusiveSKUs: 10, coopFund: '$2.8M', share: 28 },
      { name: 'Tory Burch', type: 'Contemporary', exclusiveSKUs: 14, coopFund: '$1.0M', share: 18 },
      { name: 'David Yurman', type: 'Fine Jewelry', exclusiveSKUs: 8, coopFund: '$1.2M', share: 16 },
      { name: 'Ray-Ban', type: 'Lifestyle', exclusiveSKUs: 6, coopFund: '$0.3M', share: 10 },
      { name: 'Gucci', type: 'Luxury', exclusiveSKUs: 8, coopFund: '$1.6M', share: 22 },
    ],
  },
  {
    dept: 'Home',
    color: '#059669',
    brands: [
      { name: 'Casper', type: 'Sleep', exclusiveSKUs: 6, coopFund: '$0.5M', share: 24 },
      { name: 'Le Creuset', type: 'Kitchen', exclusiveSKUs: 10, coopFund: '$0.6M', share: 22 },
      { name: 'Dyson', type: 'Technology', exclusiveSKUs: 4, coopFund: '$0.8M', share: 28 },
      { name: 'Barefoot Dreams', type: 'Textiles', exclusiveSKUs: 8, coopFund: '$0.3M', share: 14 },
    ],
  },
];

/* Revenue contribution donut from PRODUCT_MIX */
const REVENUE_BY_DEPT = PRODUCT_MIX.map((p) => ({
  label: p.department,
  value: p.pct,
  color: p.color,
}));

/* Commission rate bar chart */
const COMMISSION_RATES = SELLING_DEPTS.map((d) => ({
  label: d.name.replace(' & Fragrance', '').replace(' & Handbags', ''),
  value: d.premiumRate * 100,
  color: d.color,
}));

/* Brand availability heatmap: brands × formats */
const ALL_BRANDS = DEPT_BRANDS.flatMap((d) => d.brands.map((b) => b.name));
const FORMAT_NAMES = ['Flagship', 'Standard', 'Rack', 'Counter'];
// Availability: 100=full, 70=available, 30=limited, 0=not carried
const AVAILABILITY_DATA = [
  // Cosmetics
  [100, 70, 30, 100],  // Chanel
  [100, 70, 0, 70],    // La Mer
  [70, 100, 30, 100],  // MAC
  [100, 70, 0, 100],   // Jo Malone
  // Designer
  [100, 70, 30, 0],    // Burberry
  [100, 100, 70, 0],   // Theory
  [70, 100, 70, 0],    // Vince
  // Shoes
  [100, 30, 0, 0],     // Louboutin
  [70, 100, 70, 0],    // Cole Haan
  [30, 70, 100, 0],    // Nike
  [70, 100, 100, 0],   // UGG
  // Accessories
  [100, 30, 0, 0],     // Louis Vuitton
  [100, 100, 70, 30],  // Tory Burch
  [100, 70, 0, 30],    // David Yurman
  [70, 100, 100, 70],  // Ray-Ban
  [100, 30, 0, 0],     // Gucci
  // Home
  [100, 100, 70, 0],   // Casper
  [100, 100, 30, 0],   // Le Creuset
  [100, 70, 70, 30],   // Dyson
  [70, 100, 100, 30],  // Barefoot Dreams
];

export default function BrandPartners() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Brand Partners</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          5 selling departments, 20 key brand partnerships driving $2.8B in revenue
        </p>
      </div>

      {/* Department Brand Cards */}
      {DEPT_BRANDS.map((dept) => (
        <div key={dept.dept} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>{dept.dept}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(dept.brands.length, 4)}, 1fr)` }}>
            {dept.brands.map((brand) => (
              <div
                key={brand.name}
                className="rounded-xl border p-5"
                style={{ borderColor: 'var(--pl-border)', borderLeft: `4px solid ${dept.color}`, backgroundColor: 'var(--pl-card)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>{brand.name}</p>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ backgroundColor: `${dept.color}18`, color: dept.color }}
                  >
                    {brand.type}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--pl-text-muted)' }}>Exclusive SKUs</span>
                    <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{brand.exclusiveSKUs}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--pl-text-muted)' }}>Co-op Fund</span>
                    <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{brand.coopFund}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--pl-text-muted)' }}>Dept Share</span>
                    <span className="font-semibold" style={{ color: dept.color }}>{brand.share}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Revenue by Dept + Commission Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Revenue by Department (%)</p>
          <DonutChart
            segments={REVENUE_BY_DEPT}
            centerValue="$2.8B"
            centerLabel="Total"
            size={200}
          />
        </div>

        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Premium Commission Rates by Dept (%)</p>
          <BarChart data={COMMISSION_RATES} unit="%" />
        </div>
      </div>

      {/* Brand Availability Heatmap */}
      <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
          Brand Availability Matrix (by Format)
        </p>
        <HeatMap
          rows={ALL_BRANDS}
          cols={FORMAT_NAMES}
          data={AVAILABILITY_DATA}
          colorScale={{ low: '#F1F5F9', mid: COLORS.accent, high: COLORS.primary }}
        />
        <div className="flex gap-6 mt-3 justify-center">
          {[
            { label: 'Full (100)', color: COLORS.primary },
            { label: 'Available (70)', color: COLORS.accent },
            { label: 'Limited (30)', color: '#E2E8F0' },
            { label: 'Not Carried (0)', color: '#F8FAFC' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-[10px]" style={{ color: 'var(--pl-text-secondary)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
