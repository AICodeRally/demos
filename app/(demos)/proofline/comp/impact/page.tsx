'use client';

import { ActNavigation, LightSectionCard } from '@/components/demos/proofline';
import { fmt } from '@/lib/utils';

/* ── Impact metrics (Before → After PROOFLINE) ── */
interface ImpactMetric {
  label: string;
  category: string;
  before: string;
  after: string;
  delta: string;
  deltaColor: string;
  description: string;
}

const IMPACT_METRICS: ImpactMetric[] = [
  {
    label: 'Annual Revenue',
    category: 'Revenue',
    before: '$4.95B', after: '$5.20B', delta: '+$250M', deltaColor: '#22C55E',
    description: 'CEO mandate of 4% growth achieved through portfolio optimization, spirits integration, and Laredo expansion.',
  },
  {
    label: 'Spirits Portfolio Share',
    category: 'Portfolio',
    before: '2%', after: '8%', delta: '+6pp', deltaColor: '#10B981',
    description: 'Sazerac integration from 0% to 8% in 18 months. 1.5% adder incentivizing rep adoption. 215+ spirits-carrying accounts.',
  },
  {
    label: 'Display Compliance',
    category: 'Execution',
    before: '71%', after: '89%', delta: '+18pp', deltaColor: '#22C55E',
    description: 'AI-powered display monitoring and coaching cards driving accountability. Cold vault share up to 42% (target 40%).',
  },
  {
    label: 'Rep Turnover',
    category: 'People',
    before: '24%', after: '14%', delta: '-10pp', deltaColor: '#22C55E',
    description: 'Real-time comp visibility and transparent inquiry resolution reduced frustration-driven departures. Avg tenure up 8 months.',
  },
  {
    label: 'Gate Pass Rate',
    category: 'Compensation',
    before: '1.2/4', after: '2.8/4', delta: '+133%', deltaColor: '#2563EB',
    description: 'Clear gate visibility and weekly coaching cards helping reps understand exactly what to focus on to unlock multipliers.',
  },
  {
    label: 'Inquiry Resolution',
    category: 'Trust',
    before: '12 days', after: '2.1 days', delta: '-83%', deltaColor: '#22C55E',
    description: 'Automated tracking with 3-step transparent process. 98% of inquiries resolved within SLA. Zero escalations to legal.',
  },
  {
    label: 'Manager Coaching',
    category: 'People',
    before: 'Monthly', after: 'Weekly AI', delta: '4x', deltaColor: '#2563EB',
    description: 'AI coaching cards generated weekly for every rep. Territory Command dashboard giving managers real-time visibility.',
  },
  {
    label: 'Forecast Accuracy',
    category: 'Intelligence',
    before: '±22%', after: '±6.2%', delta: '-72%', deltaColor: '#22C55E',
    description: 'ML-powered demand forecasting with seasonal overlays, weather integration, and competitive signals.',
  },
];

/* ── Before/After Card ───────────────────────── */
function ImpactCard({ metric }: { metric: ImpactMetric }) {
  return (
    <>
    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--pl-border)' }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold tabular-nums px-1.5 py-0.5 rounded mr-2" style={{ background: 'var(--pl-chart-bar-track)', color: 'var(--pl-text-muted)' }}>
            {metric.category.toUpperCase()}
          </span>
          <span className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{metric.label}</span>
        </div>
        <span className="text-[12px] font-bold tabular-nums px-2 py-0.5 rounded" style={{ background: `${metric.deltaColor}15`, color: metric.deltaColor }}>
          {metric.delta}
        </span>
      </div>

      {/* Before → After bar */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 text-center rounded-lg py-2" style={{ background: 'var(--pl-card-alt)' }}>
          <div className="text-xs" style={{ color: 'var(--pl-text-faint)' }}>BEFORE</div>
          <div className="text-[18px] font-bold tabular-nums" style={{ color: 'var(--pl-text-faint)' }}>{metric.before}</div>
        </div>
        <div className="text-[16px]" style={{ color: '#CBD5E0' }}>{'\u2192'}</div>
        <div className="flex-1 text-center rounded-lg py-2" style={{ background: 'rgba(16,185,129,0.04)' }}>
          <div className="text-xs" style={{ color: '#10B981' }}>AFTER</div>
          <div className="text-[18px] font-bold tabular-nums" style={{ color: 'var(--pl-text)' }}>{metric.after}</div>
        </div>
      </div>

      <p className="text-xs" style={{ color: 'var(--pl-text-muted)' }}>{metric.description}</p>
    </div>
    </>
  );
}

/* ── Total Impact Summary SVG ────────────────── */
function ImpactSummary() {
  const w = 700, h = 230;

  const impacts = [
    { label: 'Incremental\nRevenue', value: '$47.2M', sub: 'Year 1 projected', color: '#22C55E' },
    { label: 'Cost\nSavings', value: '$8.4M', sub: 'Reduced turnover + efficiency', color: '#2563EB' },
    { label: 'Spirits\nRevenue', value: '$12.8M', sub: 'New category (from $0)', color: '#10B981' },
    { label: 'Total\nROI', value: '340%', sub: 'Year 1 return', color: '#F59E0B' },
  ];

  const colW = (w - 60) / 4;
  const startX = 30;

  return (
    <>
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      <defs>
        {impacts.map((item, i) => (
          <radialGradient key={i} id={`impact-grad-${i}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={item.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={item.color} stopOpacity="0.04" />
          </radialGradient>
        ))}
      </defs>

      {impacts.map((item, i) => {
        const cx = startX + i * colW + colW / 2;
        const cy = 90;
        const r = 56;

        return (
          <g key={item.label}>
            {/* Gradient-filled circle */}
            <circle cx={cx} cy={cy} r={r} fill={`url(#impact-grad-${i})`} stroke={`${item.color}40`} strokeWidth="2" />

            {/* Inner accent ring */}
            <circle cx={cx} cy={cy} r={r - 10} fill="none" stroke={`${item.color}15`} strokeWidth="1" />

            {/* Value — large and prominent */}
            <text x={cx} y={cy - 2} textAnchor="middle" fontSize="26" fontWeight="bold" fill={item.color} fontFamily="monospace">
              {item.value}
            </text>

            {/* Label lines */}
            {item.label.split('\n').map((line, j) => (
              <text key={j} x={cx} y={cy + 18 + j * 12} textAnchor="middle" fontSize="12" fontWeight="bold" fill="var(--pl-text)" fontFamily="monospace">
                {line}
              </text>
            ))}

            {/* Sub description */}
            <text x={cx} y={cy + r + 18} textAnchor="middle" fontSize="12" fill="var(--pl-text-faint)" fontFamily="monospace">
              {item.sub}
            </text>

            {/* Flowing curved arrow connector */}
            {i < impacts.length - 1 && (
              <g>
                <path
                  d={`M${cx + r + 4},${cy} Q${cx + colW / 2},${cy - 14} ${cx + colW - r - 4},${cy}`}
                  fill="none" stroke={`${item.color}35`} strokeWidth="2"
                />
                <polygon
                  points={`${cx + colW - r - 12},${cy - 4} ${cx + colW - r - 3},${cy} ${cx + colW - r - 12},${cy + 4}`}
                  fill={`${impacts[i + 1].color}50`}
                />
              </g>
            )}
          </g>
        );
      })}

      {/* Bottom summary bar */}
      <rect x={40} y={h - 42} width={w - 80} height={32} rx={8} fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
      <text x={w / 2} y={h - 22} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#10B981" fontFamily="monospace">
        PROOFLINE pays for itself in 106 days {'\u2014'} Full deployment ROI: 340% Year 1
      </text>
    </svg>
    </>
  );
}

export default function CeoImpactPage() {
  return (
    <>
    
      <ActNavigation currentAct={4} />

      {/* Header */}
      <div className="mt-6 mb-8">
        <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#10B981' }}>
          Executive Summary &middot; The PROOFLINE Impact
        </div>
        <h1 className="text-[28px] font-extrabold leading-tight" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          From Spreadsheets to Revenue Operating System
        </h1>
        <p className="text-[14px] mt-2" style={{ color: 'var(--pl-text-muted)' }}>
          What changes when Lone Star Distribution deploys PROOFLINE across 6 hometowns, 36 routes, and 4,800+ accounts.
        </p>
      </div>

      {/* Total Impact SVG */}
      <LightSectionCard title="Total Impact — Year 1 Projections" className="mb-6">
        <ImpactSummary />
      </LightSectionCard>

      {/* Before/After Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {IMPACT_METRICS.map(m => (
          <ImpactCard key={m.label} metric={m} />
        ))}
      </div>

      {/* Investment vs. Return */}
      <LightSectionCard title="Investment vs. Return" className="mb-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Investment */}
          <div>
            <div className="text-xs font-bold tabular-nums mb-3" style={{ color: '#F87171' }}>YEAR 1 INVESTMENT</div>
            <div className="space-y-2">
              {[
                { item: 'PROOFLINE platform license', cost: '$480,000', note: '36 reps × $1,111/mo' },
                { item: 'Implementation & data migration', cost: '$120,000', note: '8-week deployment' },
                { item: 'Training & change management', cost: '$85,000', note: '6 hometown rollouts' },
                { item: 'AI/ML compute & integrations', cost: '$48,000', note: 'Forecasting + coaching' },
                { item: 'Support & optimization', cost: '$72,000', note: 'Dedicated CSM' },
              ].map(row => (
                <div key={row.item} className="flex items-center justify-between px-3 py-2 rounded" style={{ background: 'var(--pl-card-alt)' }}>
                  <div>
                    <div className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{row.item}</div>
                    <div className="text-xs" style={{ color: 'var(--pl-text-faint)' }}>{row.note}</div>
                  </div>
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: '#F87171' }}>{row.cost}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-3 py-2 rounded border-t-2" style={{ borderColor: 'var(--pl-border)' }}>
                <span className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>Total Year 1 Investment</span>
                <span className="text-[16px] font-bold tabular-nums" style={{ color: '#F87171' }}>$805,000</span>
              </div>
            </div>
          </div>

          {/* Returns */}
          <div>
            <div className="text-xs font-bold tabular-nums mb-3" style={{ color: '#22C55E' }}>YEAR 1 RETURNS</div>
            <div className="space-y-2">
              {[
                { item: 'Incremental revenue (4% growth)', value: '$47,200,000', note: 'CEO mandate achievement' },
                { item: 'Reduced turnover savings', value: '$3,600,000', note: '10pp reduction × $36K per rep' },
                { item: 'New spirits category revenue', value: '$12,800,000', note: '0% → 8% portfolio share' },
                { item: 'Route efficiency gains', value: '$2,100,000', note: '12% fuel + 18% delivery optimization' },
                { item: 'Display compliance uplift', value: '$1,800,000', note: '+18pp = incremental shelf space' },
              ].map(row => (
                <div key={row.item} className="flex items-center justify-between px-3 py-2 rounded" style={{ background: 'rgba(34,197,94,0.03)' }}>
                  <div>
                    <div className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{row.item}</div>
                    <div className="text-xs" style={{ color: 'var(--pl-text-faint)' }}>{row.note}</div>
                  </div>
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: '#22C55E' }}>{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-3 py-2 rounded border-t-2" style={{ borderColor: 'var(--pl-border)' }}>
                <span className="text-[12px] font-bold" style={{ color: 'var(--pl-text)' }}>Total Year 1 Return</span>
                <span className="text-[16px] font-bold tabular-nums" style={{ color: '#22C55E' }}>$67,500,000</span>
              </div>
            </div>
          </div>
        </div>
      </LightSectionCard>

      {/* CEO Quote / CTA */}
      <div className="rounded-xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(37,99,235,0.04) 100%)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="text-xs font-bold tabular-nums mb-3" style={{ color: '#10B981' }}>THE BOTTOM LINE</div>
        <p className="text-[16px] font-bold leading-relaxed mb-4" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          PROOFLINE transforms Lone Star Distribution from a company that discovers results at quarter-close into one that
          shapes outcomes in real-time. Every rep, every route, every case — visible, optimized, and aligned to the CEO mandate.
        </p>
        <div className="flex gap-4">
          <div className="rounded-lg px-4 py-2" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <span className="text-[13px] font-bold tabular-nums" style={{ color: '#10B981' }}>Payback: 106 days</span>
          </div>
          <div className="rounded-lg px-4 py-2" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <span className="text-[13px] font-bold tabular-nums" style={{ color: '#22C55E' }}>ROI: 340% Year 1</span>
          </div>
          <div className="rounded-lg px-4 py-2" style={{ background: 'rgba(37,99,235,0.1)' }}>
            <span className="text-[13px] font-bold tabular-nums" style={{ color: '#2563EB' }}>Deploy: 8 weeks</span>
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="text-[13px]" style={{ color: 'var(--pl-text-faint)' }}>
        Impact projections based on industry benchmarks for SPM platform deployments in beverage distribution (Aberdeen Group, Gartner).
        Revenue uplift calculated from historical Lone Star growth rate (1.4%) vs. PROOFLINE-enabled rate (4%). Turnover savings use
        SHRM replacement cost methodology ($36K per route sales rep). Spirits revenue is additive new category.
        Payback = Total investment / (Total returns / 365).
      </div>
    
    </>
  );
}
