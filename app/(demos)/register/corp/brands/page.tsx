'use client';

import { DonutChart, BarChart, WaterfallChart, SankeyFlow, HeatMap } from '@/components/demos/register';

/* ── Brand catalog ── */
const BRANDS = [
  { name: 'Tempur-Pedic', exclusive: 12, spiff: 80, coop: '$2.1M', share: 24, color: '#1E3A5F' },
  { name: 'Sealy', exclusive: 8, spiff: 45, coop: '$1.4M', share: 18, color: '#06B6D4' },
  { name: 'Beautyrest', exclusive: 6, spiff: 55, coop: '$1.1M', share: 14, color: '#8B5CF6' },
  { name: 'Purple', exclusive: 4, spiff: 70, coop: '$0.9M', share: 12, color: '#10B981' },
  { name: 'Serta', exclusive: 5, spiff: 40, coop: '$0.8M', share: 11, color: '#F59E0B' },
  { name: 'Stearns & Foster', exclusive: 3, spiff: 65, coop: '$0.7M', share: 9, color: '#EC4899' },
  { name: 'Casper', exclusive: 2, spiff: 35, coop: '$0.6M', share: 7, color: '#14B8A6' },
  { name: 'Nectar', exclusive: 2, spiff: 30, coop: '$0.6M', share: 5, color: '#A855F7' },
];

/* ── Revenue share donut ── */
const REVENUE_SHARE = BRANDS.map((b) => ({ label: b.name, value: b.share, color: b.color }));

/* ── SPIFF rates bar chart ── */
const SPIFF_DATA = BRANDS.map((b) => ({ label: b.name, value: b.spiff, color: b.color }));

/* ── Co-op funding waterfall ── */
const COOP_WATERFALL = [
  { label: 'Vendor Fund', value: 8.2, type: 'add' as const },
  { label: 'Marketing', value: 3.1, type: 'subtract' as const },
  { label: 'Floor Samples', value: 2.0, type: 'subtract' as const },
  { label: 'Training', value: 1.5, type: 'subtract' as const },
  { label: 'Events', value: 1.0, type: 'subtract' as const },
  { label: 'Remaining', value: 0, type: 'total' as const },
];

/* ── Sankey: Brands → Categories → Formats ── */
const SANKEY_NODES = [
  { id: 'tp', label: 'Tempur-Pedic' },
  { id: 'se', label: 'Sealy' },
  { id: 'br', label: 'Beautyrest' },
  { id: 'pu', label: 'Purple' },
  { id: 'sr', label: 'Serta' },
  { id: 'sf', label: 'S&F' },
  { id: 'ca', label: 'Casper' },
  { id: 'ne', label: 'Nectar' },
  { id: 'matt', label: 'Mattress' },
  { id: 'base', label: 'Base' },
  { id: 'bed', label: 'Bedding' },
  { id: 'tech', label: 'Tech' },
];

const SANKEY_LINKS = [
  { source: 'tp', target: 'matt', value: 18, color: '#1E3A5F55' },
  { source: 'tp', target: 'base', value: 4, color: '#1E3A5F33' },
  { source: 'tp', target: 'tech', value: 2, color: '#1E3A5F22' },
  { source: 'se', target: 'matt', value: 14, color: '#06B6D455' },
  { source: 'se', target: 'base', value: 3, color: '#06B6D433' },
  { source: 'se', target: 'bed', value: 1, color: '#06B6D422' },
  { source: 'br', target: 'matt', value: 10, color: '#8B5CF655' },
  { source: 'br', target: 'base', value: 3, color: '#8B5CF633' },
  { source: 'br', target: 'bed', value: 1, color: '#8B5CF622' },
  { source: 'pu', target: 'matt', value: 8, color: '#10B98155' },
  { source: 'pu', target: 'bed', value: 3, color: '#10B98133' },
  { source: 'pu', target: 'tech', value: 1, color: '#10B98122' },
  { source: 'sr', target: 'matt', value: 9, color: '#F59E0B55' },
  { source: 'sr', target: 'base', value: 2, color: '#F59E0B33' },
  { source: 'sf', target: 'matt', value: 7, color: '#EC489955' },
  { source: 'sf', target: 'base', value: 2, color: '#EC489933' },
  { source: 'ca', target: 'matt', value: 5, color: '#14B8A655' },
  { source: 'ca', target: 'bed', value: 2, color: '#14B8A633' },
  { source: 'ne', target: 'matt', value: 4, color: '#A855F755' },
  { source: 'ne', target: 'bed', value: 1, color: '#A855F733' },
];

/* ── Exclusivity heatmap: brands × formats ── */
const BRAND_NAMES = BRANDS.map((b) => b.name);
const FORMAT_NAMES = ['Flagship', 'Standard', 'Outlet', 'SiS'];
// 1=exclusive(100), 0.7=available(70), 0.3=limited(30), 0=not carried(0)
const EXCLUSIVITY_DATA = [
  [100, 70, 30, 70],  // Tempur-Pedic
  [70, 100, 70, 30],  // Sealy
  [70, 70, 70, 30],   // Beautyrest
  [100, 70, 0, 30],   // Purple
  [30, 100, 70, 70],  // Serta
  [100, 30, 0, 0],    // Stearns & Foster
  [30, 70, 0, 100],   // Casper
  [0, 70, 100, 30],   // Nectar
];

export default function BrandPartners() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Brand Partners</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          8 brand partnerships driving $1.4B in revenue with $8.2M co-op funding
        </p>
      </div>

      {/* Brand Cards Grid */}
      <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Brand Portfolio</p>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {BRANDS.map((brand) => (
          <div
            key={brand.name}
            className="rounded-xl bg-white border p-5"
            style={{ borderColor: '#E2E8F0', borderLeft: `4px solid ${brand.color}` }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>{brand.name}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Exclusive SKUs</span>
                <span className="font-medium" style={{ color: '#0F172A' }}>{brand.exclusive}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>SPIFF Rate</span>
                <span className="font-medium" style={{ color: '#0F172A' }}>${brand.spiff}/unit</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Co-op Fund</span>
                <span className="font-medium" style={{ color: '#0F172A' }}>{brand.coop}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#94A3B8' }}>Revenue Share</span>
                <span className="font-semibold" style={{ color: brand.color }}>{brand.share}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Share + SPIFF Rates */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Revenue Share by Brand</p>
          <DonutChart
            segments={REVENUE_SHARE}
            centerValue="$1.4B"
            centerLabel="Total"
            size={200}
          />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>SPIFF Rates by Brand ($/unit)</p>
          <BarChart data={SPIFF_DATA} unit="$" />
        </div>
      </div>

      {/* Co-op Waterfall */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Co-op Funding Allocation ($M)
        </p>
        <WaterfallChart data={COOP_WATERFALL} height={280} />
      </div>

      {/* Sankey Flow */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Revenue Flow: Brands to Product Categories
        </p>
        <SankeyFlow nodes={SANKEY_NODES} links={SANKEY_LINKS} height={360} />
      </div>

      {/* Exclusivity Heatmap */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Brand Exclusivity Matrix (by Format)
        </p>
        <HeatMap
          rows={BRAND_NAMES}
          cols={FORMAT_NAMES}
          data={EXCLUSIVITY_DATA}
          colorScale={{ low: '#F1F5F9', mid: '#86EFAC', high: '#059669' }}
        />
        <div className="flex gap-6 mt-3 justify-center">
          {[
            { label: 'Exclusive (100)', color: '#059669' },
            { label: 'Available (70)', color: '#86EFAC' },
            { label: 'Limited (30)', color: '#D1FAE5' },
            { label: 'Not Carried (0)', color: '#F1F5F9' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-[10px]" style={{ color: '#475569' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
