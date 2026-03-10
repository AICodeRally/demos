'use client';

import { RadarChart, BarChart, DonutChart, AreaChart } from '@/components/demos/crestline';
import { COLORS } from '@/data/crestline';

/* Radar: Competitive dimensions */
const COMPETITIVE_AXES = [
  { label: 'Brand Equity', value: 88 },
  { label: 'Customer Experience', value: 82 },
  { label: 'Digital', value: 55 },
  { label: 'Assortment', value: 90 },
  { label: 'Price', value: 40 },
];

const INDUSTRY_BENCHMARK = [70, 65, 72, 75, 60];

/* Market share donut */
const MARKET_SHARE = [
  { label: 'Nordstrom', value: 28, color: '#1E3A5F' },
  { label: 'Crestline', value: 18, color: COLORS.accent },
  { label: "Macy's", value: 22, color: '#EF4444' },
  { label: 'Bloomingdales', value: 12, color: '#8B5CF6' },
  { label: 'Neiman Marcus', value: 10, color: '#06B6D4' },
  { label: 'Others', value: 10, color: '#94A3B8' },
];

/* Regional share */
const REGION_SHARE = [
  { label: 'Northeast', value: 22, color: COLORS.primary },
  { label: 'Southeast', value: 18, color: COLORS.primary },
  { label: 'Midwest', value: 15, color: COLORS.primary },
  { label: 'Southwest', value: 16, color: COLORS.primary },
  { label: 'Pacific NW', value: 24, color: COLORS.primary },
  { label: 'Mountain', value: 12, color: COLORS.primary },
  { label: 'Mid-Atlantic', value: 20, color: COLORS.primary },
  { label: 'Great Lakes', value: 14, color: COLORS.primary },
];

/* 5-year market share trend */
const MARKET_SHARE_TREND = [
  { label: '2021', value: 12.0 },
  { label: '2022', value: 13.2 },
  { label: '2023', value: 14.8 },
  { label: '2024', value: 16.1 },
  { label: '2025', value: 17.5 },
  { label: '2026E', value: 18.8 },
];

/* Competitor cards */
const COMPETITORS = [
  { name: 'Nordstrom', stores: '380', revenue: '$15.1B', threat: 'High', color: '#1E3A5F', threatBg: '#DBEAFE' },
  { name: "Macy's", stores: '720', revenue: '$24.5B', threat: 'High', color: '#EF4444', threatBg: '#FEE2E2' },
  { name: 'Bloomingdales', stores: '55', revenue: '$3.2B', threat: 'Medium', color: '#8B5CF6', threatBg: '#EDE9FE' },
  { name: 'Neiman Marcus', stores: '37', revenue: '$4.8B', threat: 'Medium', color: '#06B6D4', threatBg: '#CFFAFE' },
];

/* SWOT */
const SWOT = [
  {
    title: 'Strengths',
    color: '#10B981',
    bg: '#D1FAE5',
    items: ['4-format diversity (Flagship to Counter)', 'Premium brand partnerships (LV, Chanel, Burberry)', 'High customer loyalty & NPS', 'Strong cosmetics & accessories mix'],
  },
  {
    title: 'Weaknesses',
    color: '#EF4444',
    bg: '#FEE2E2',
    items: ['Scale vs Nordstrom/Macy\'s (200 vs 380/720)', 'Limited e-commerce penetration', 'Geographic concentration in coastal markets', 'High associate comp costs in Flagship'],
  },
  {
    title: 'Opportunities',
    color: '#06B6D4',
    bg: '#CFFAFE',
    items: ['Counter format expansion in airports & hotels', 'Rack format growth in suburban markets', 'Digital clienteling & personal shopping', 'Exclusive designer capsule collections'],
  },
  {
    title: 'Threats',
    color: '#F59E0B',
    bg: '#FEF3C7',
    items: ['DTC luxury brands bypassing retailers', 'Amazon Luxury marketplace growth', 'Economic downturn → trade-down effect', 'Off-price competition (TJ Maxx, Nordstrom Rack)'],
  },
];

export default function MarketPosition() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Market Position</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          Competitive landscape analysis for the $120B U.S. department store market
        </p>
      </div>

      {/* Market Share Donut + Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>National Market Share (%)</p>
          <DonutChart
            segments={MARKET_SHARE}
            centerValue="18%"
            centerLabel="Crestline"
            size={200}
          />
        </div>

        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>
            Competitive Dimensions (vs Industry Avg)
          </p>
          <div className="flex justify-center">
            <RadarChart
              axes={COMPETITIVE_AXES}
              maxVal={100}
              color={COLORS.primary}
              benchmarkData={INDUSTRY_BENCHMARK}
              size={260}
            />
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded" style={{ backgroundColor: COLORS.primary }} />
              <span className="text-[10px]" style={{ color: 'var(--pl-text-secondary)' }}>Crestline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded border-dashed" style={{ borderBottom: '1.5px dashed #A8A29E' }} />
              <span className="text-[10px]" style={{ color: 'var(--pl-text-secondary)' }}>Industry Avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Share + 5-Year Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>Crestline Market Share by Region (%)</p>
          <BarChart data={REGION_SHARE} unit="%" color={COLORS.primary} />
        </div>

        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>5-Year Market Share Trend (%)</p>
          <AreaChart data={MARKET_SHARE_TREND} color={COLORS.accent} height={180} />
        </div>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {COMPETITORS.map((c) => (
          <div key={c.name} className="rounded-xl border p-5" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--pl-text)' }}>{c.name}</span>
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
                <span style={{ color: 'var(--pl-text-muted)' }}>Stores</span>
                <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{c.stores}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--pl-text-muted)' }}>Revenue</span>
                <span className="font-medium" style={{ color: 'var(--pl-text)' }}>{c.revenue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SWOT Grid */}
      <p className="text-sm font-semibold mb-4" style={{ color: 'var(--pl-text)' }}>SWOT Analysis</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SWOT.map((q) => (
          <div
            key={q.title}
            className="rounded-xl border p-5"
            style={{ borderColor: 'var(--pl-border)', borderLeft: `4px solid ${q.color}` }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: q.color }}>{q.title}</p>
            <ul className="space-y-1.5">
              {q.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--pl-text-secondary)' }}>
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
