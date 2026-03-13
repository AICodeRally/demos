'use client';

import { LightSectionCard, ProofDonutChart, ActNavigation } from '@/components/demos/proofline';
import {
  BRAND_FAMILIES,
  SUPPLIER_PORTFOLIO_SHARE,
  SUPPLIER_COLORS,
  BRAND_TOTAL_REVENUE,
  BRAND_TOTAL_CASES,
  TOTAL_ROUTES,
  TOTAL_ACCOUNTS,
  HOMETOWNS,
  type SupplierGroup,
} from '@/data/proofline';
import { fmtM, fmt, pct } from '@/lib/utils';

/* ── Supplier labels ─────────────────────────────────── */
const SUPPLIER_LABELS: Record<SupplierGroup, string> = {
  'molson-coors': 'Molson Coors',
  constellation: 'Constellation',
  heineken: 'Heineken',
  craft: 'Craft & Regional',
  sazerac: 'Sazerac',
  'fmb-rtd': 'FMB / RTD',
};

/* ── Donut data ──────────────────────────────────────── */
const donutData = (Object.keys(SUPPLIER_PORTFOLIO_SHARE) as SupplierGroup[]).map((key) => ({
  name: SUPPLIER_LABELS[key],
  value: SUPPLIER_PORTFOLIO_SHARE[key],
  color: SUPPLIER_COLORS[key],
}));

/* ── YoY Comparison ──────────────────────────────────── */
const YOY = [
  { metric: 'Revenue', fy25: '$173M', fy26: '$180M', delta: '+4.0%', positive: true },
  { metric: 'Cases', fy25: `${fmt(BRAND_TOTAL_CASES * 4)}`, fy26: `${fmt(Math.round(BRAND_TOTAL_CASES * 4 * 1.028))}`, delta: '+2.8%', positive: true },
  { metric: 'Spirits Share', fy25: '5%', fy26: '8%', delta: '+3pp', positive: true },
  { metric: 'Routes', fy25: '32', fy26: String(TOTAL_ROUTES), delta: `+${TOTAL_ROUTES - 32}`, positive: true },
  { metric: 'Accounts', fy25: fmt(10500), fy26: fmt(TOTAL_ACCOUNTS), delta: `+${fmt(TOTAL_ACCOUNTS - 10500)}`, positive: true },
  { metric: 'Display Compliance', fy25: '82%', fy26: '89%', delta: '+7pp', positive: true },
];

/* ── Strategic Priorities ────────────────────────────── */
const PRIORITIES = [
  {
    title: 'Spirits Integration',
    desc: 'Grow Sazerac from 5% to 8% portfolio share. Buffalo Trace, Fireball, Southern Comfort across all territories.',
    stat: '5% → 8%',
    icon: '🥃',
  },
  {
    title: 'South Texas Expansion',
    desc: 'Laredo (acquired 2024) and Corpus Christi: target 580K cases combined. Cross-border growth corridor.',
    stat: '580K cases',
    icon: '📍',
  },
  {
    title: 'Revenue Per Case Growth',
    desc: 'Shift from volume to revenue selling. Improve mix toward higher-margin imports and premium craft.',
    stat: '+$2.40/case',
    icon: '📈',
  },
  {
    title: 'Display Compliance to 89%',
    desc: 'Reinstate gate system. Enforce cooler planograms and shelf standards across all accounts.',
    stat: '82% → 89%',
    icon: '📊',
  },
];

/* ── Computed values ─────────────────────────────────── */
const southTXCases = HOMETOWNS.filter((h) => h.id === 'crp' || h.id === 'lar').reduce(
  (s, h) => s + h.cases,
  0
);

export default function CeoMandatePage() {
  return (
    <>
    
      <ActNavigation currentAct={1} />

      {/* Hero Section */}
      <div className="flex items-center gap-6 mt-6 mb-8">
        {/* Icon circle */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #C6A052 0%, #A0841E 100%)',
            boxShadow: '0 4px 12px rgba(198,160,82,0.3)',
          }}
        >
          <span
            className="text-3xl"
          >
            &#9670;
          </span>
        </div>
        <div>
          <div
            className="text-xs tracking-[3px] uppercase font-semibold mb-1"
            style={{ color: '#C6A052' }}
          >
            Act 1 &middot; Corporate Strategy
          </div>
          <h1
            className="text-3xl font-extrabold mb-1"
            style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}
          >
            FY2026 CEO Mandate
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
            Lone Star Distribution &middot; North &amp; South Texas
          </p>
        </div>
      </div>

      {/* ── 3 KPI Hero Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Revenue Target */}
        <div
          className="rounded-xl border p-5 text-center"
          style={{ background: 'var(--pl-card)', borderColor: 'var(--pl-border)', borderTop: '3px solid #C6A052', boxShadow: 'var(--pl-shadow)' }}
        >
          <div className="text-xs uppercase tracking-[1.5px] font-semibold mb-2" style={{ color: 'var(--pl-text-muted)' }}>
            Revenue Target
          </div>
          <div
            className="text-3xl font-extrabold mb-1"
            style={{ color: '#C6A052', fontFamily: 'var(--pl-font)' }}
          >
            $180M
          </div>
          <div className="text-[12px] font-semibold" style={{ color: '#C6A052' }}>
            +4% YoY from ~$173M
          </div>
        </div>

        {/* Sazerac Target */}
        <div
          className="rounded-xl border p-5 text-center"
          style={{ background: 'var(--pl-card)', borderColor: 'var(--pl-border)', borderTop: '3px solid #F87171', boxShadow: 'var(--pl-shadow)' }}
        >
          <div className="text-xs uppercase tracking-[1.5px] font-semibold mb-2" style={{ color: 'var(--pl-text-muted)' }}>
            Sazerac Target Share
          </div>
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span className="text-lg tabular-nums" style={{ color: 'var(--pl-text-muted)' }}>5%</span>
            <span className="text-lg" style={{ color: 'var(--pl-text-faint)' }}>&rarr;</span>
            <span className="text-3xl font-extrabold" style={{ color: '#F87171', fontFamily: 'var(--pl-font)' }}>8%</span>
          </div>
          <div className="text-[12px] font-semibold" style={{ color: 'var(--pl-text-muted)' }}>
            +3pp growth target
          </div>
        </div>

        {/* South TX Target */}
        <div
          className="rounded-xl border p-5 text-center"
          style={{ background: 'var(--pl-card)', borderColor: 'var(--pl-border)', borderTop: '3px solid #2563EB', boxShadow: 'var(--pl-shadow)' }}
        >
          <div className="text-xs uppercase tracking-[1.5px] font-semibold mb-2" style={{ color: 'var(--pl-text-muted)' }}>
            South TX Cases
          </div>
          <div
            className="text-3xl font-extrabold mb-1"
            style={{ color: '#2563EB', fontFamily: 'var(--pl-font)' }}
          >
            580K
          </div>
          <div className="text-[12px] font-semibold" style={{ color: 'var(--pl-text-muted)' }}>
            Currently {fmtM(southTXCases * 4)} annual
          </div>
        </div>
      </div>

      {/* ── Brand Portfolio Donut + Legend ────────────── */}
      <LightSectionCard title="Supplier Portfolio Composition" className="mb-8">
        <div className="flex items-center gap-8">
          <ProofDonutChart
            data={donutData}
            size={200}
            label={`${BRAND_FAMILIES.length} brands`}
            labelColor="var(--pl-text)"
          />
          <div className="flex-1 grid grid-cols-2 gap-3">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: d.color }}
                />
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--pl-text)' }}>
                    {d.name}
                  </div>
                  <div className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
                    {pct(d.value)} share
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LightSectionCard>

      {/* ── Year-over-Year Comparison ────────────────── */}
      <LightSectionCard title="FY2025 vs FY2026 Targets" className="mb-8">
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ color: 'var(--pl-text-muted)' }}>
              <th className="text-left font-semibold pb-3 pl-2">Metric</th>
              <th className="text-right font-semibold pb-3">FY2025</th>
              <th className="text-right font-semibold pb-3">FY2026 Target</th>
              <th className="text-right font-semibold pb-3 pr-2">Change</th>
            </tr>
          </thead>
          <tbody>
            {YOY.map((row, i) => (
              <tr
                key={row.metric}
                style={i % 2 === 0 ? { background: 'var(--pl-stripe)' } : undefined}
              >
                <td className="py-2.5 pl-2 font-semibold" style={{ color: 'var(--pl-text)' }}>
                  {row.metric}
                </td>
                <td className="py-2.5 text-right tabular-nums" style={{ color: 'var(--pl-text-muted)' }}>
                  {row.fy25}
                </td>
                <td
                  className="py-2.5 text-right font-bold tabular-nums"
                  style={{ color: 'var(--pl-text)' }}
                >
                  {row.fy26}
                </td>
                <td
                  className="py-2.5 text-right pr-2 font-bold tabular-nums"
                  style={{ color: row.positive ? '#10B981' : '#F87171' }}
                >
                  {row.delta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </LightSectionCard>

      {/* ── Strategic Priorities ──────────────────────── */}
      <div className="mb-4">
        <div
          className="text-[13px] uppercase tracking-[1.5px] font-semibold mb-4"
          style={{ color: 'var(--pl-text-muted)' }}
        >
          Strategic Priorities
        </div>
        <div className="grid grid-cols-2 gap-4">
          {PRIORITIES.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border p-5 hover:shadow-md transition-shadow"
              style={{ background: 'var(--pl-card)', borderColor: 'var(--pl-border)', borderLeft: '3px solid #C6A052', boxShadow: 'var(--pl-shadow)' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{p.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-[14px] font-bold"
                      style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}
                    >
                      {p.title}
                    </span>
                    <span
                      className="text-[12px] font-bold tabular-nums px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(198,160,82,0.10)', color: '#C6A052' }}
                    >
                      {p.stat}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Vision */}
      <div
        className="rounded-lg px-6 py-4 mt-6"
        style={{ background: 'rgba(198,160,82,0.06)', borderLeft: '3px solid #C6A052' }}
      >
        <p className="text-[14px] italic leading-relaxed" style={{ color: 'var(--pl-text-secondary)' }}>
          &ldquo;We need to sell the right product, not just more product. If we hit 8% spirits
          and get display compliance to 89%, we will blow past $180 million.&rdquo;
        </p>
        <p className="text-[12px] font-semibold mt-2" style={{ color: '#C6A052' }}>
          &mdash; Executive Leadership
        </p>
      </div>
    
    </>
  );
}
