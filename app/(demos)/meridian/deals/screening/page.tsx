'use client';

import { ActNavigation, SectionCard } from '@/components/demos/meridian';

const SCREENING_CRITERIA = [
  { criterion: 'Enterprise Value', range: '$150M \u2013 $750M', rationale: 'Sweet spot for platform + bolt-on strategy', weight: 'Required', color: '#D4A847' },
  { criterion: 'EBITDA', range: '$15M \u2013 $60M', rationale: 'Sufficient cash flow to service leverage and fund growth', weight: 'Required', color: '#D4A847' },
  { criterion: 'EBITDA Margin', range: '> 12%', rationale: 'Indicates pricing power and operational efficiency', weight: 'Required', color: '#D4A847' },
  { criterion: 'Revenue Growth', range: '> 8% CAGR', rationale: 'Organic growth reduces dependence on multiple expansion', weight: 'Preferred', color: '#3B82F6' },
  { criterion: 'Customer Concentration', range: 'Top 10 < 40%', rationale: 'Diversified revenue base reduces exit risk', weight: 'Preferred', color: '#3B82F6' },
  { criterion: 'Recurring Revenue', range: '> 60%', rationale: 'Predictable cash flows support higher leverage and valuations', weight: 'Preferred', color: '#3B82F6' },
  { criterion: 'Market Position', range: '#1 or #2', rationale: 'Market leaders command premium exits', weight: 'Preferred', color: '#3B82F6' },
  { criterion: 'Management Team', range: 'Retainable', rationale: 'Operator-led thesis requires stable management', weight: 'Required', color: '#D4A847' },
];

const FUNNEL_DATA = [
  { stage: 'Opportunities Reviewed', count: 847, color: '#6B7280' },
  { stage: 'Passed Initial Screen', count: 142, color: '#F59E0B' },
  { stage: 'NDA / CIM Received', count: 68, color: '#8B5CF6' },
  { stage: 'Management Meeting', count: 31, color: '#3B82F6' },
  { stage: 'LOI Submitted', count: 14, color: '#10B981' },
  { stage: 'Closed / Portfolio', count: 7, color: '#D4A847' },
];

export default function ScreeningPage() {
  const conversionRate = (7 / 847 * 100).toFixed(1);

  return (
    <>
      <ActNavigation currentAct={2} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#8B5CF6' }}>
          Deal Origination &middot; Screening
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Deal Screening & Origination Funnel
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          Fund IV lifetime &middot; {conversionRate}% close rate from initial review
        </p>
      </div>

      {/* Funnel */}
      <SectionCard title="Origination Funnel (Fund IV Lifetime)">
        <div className="space-y-2">
          {FUNNEL_DATA.map((f, i) => {
            const widthPct = (f.count / FUNNEL_DATA[0].count) * 100;
            return (
              <div key={f.stage} className="flex items-center gap-3">
                <div className="w-44 shrink-0 text-right">
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--mr-text)' }}>{f.stage}</span>
                </div>
                <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: 'var(--mr-chart-bar-track)' }}>
                  <div
                    className="h-full rounded-lg flex items-center px-3 transition-all"
                    style={{ width: `${Math.max(widthPct, 5)}%`, background: f.color }}
                  >
                    <span className="text-xs font-bold font-mono text-white">{f.count}</span>
                  </div>
                </div>
                {i > 0 && (
                  <div className="w-14 text-right text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>
                    {((f.count / FUNNEL_DATA[i - 1].count) * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Screening Criteria */}
      <SectionCard title="Investment Screening Criteria">
        <div className="space-y-0">
          {SCREENING_CRITERIA.map((c, i) => (
            <div
              key={c.criterion}
              className="flex items-center gap-4 py-3 px-3"
              style={i % 2 === 0 ? { background: 'var(--mr-stripe)', borderRadius: 8 } : undefined}
            >
              <div className="w-40 shrink-0">
                <div className="text-[13px] font-bold" style={{ color: 'var(--mr-text)' }}>{c.criterion}</div>
              </div>
              <div className="w-32 shrink-0">
                <span className="text-sm font-bold font-mono" style={{ color: c.color }}>{c.range}</span>
              </div>
              <div className="flex-1">
                <span className="text-[12px]" style={{ color: 'var(--mr-text-muted)' }}>{c.rationale}</span>
              </div>
              <div className="w-20 text-right">
                <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${c.color}15`, color: c.color }}>
                  {c.weight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Source mix */}
      <SectionCard title="Deal Source Mix (Fund IV)">
        <div className="grid grid-cols-4 gap-4">
          {[
            { source: 'Proprietary', pct: 38, deals: 3, color: '#10B981', desc: 'Direct relationships, proactive outreach' },
            { source: 'Bank Process', pct: 28, deals: 2, color: '#3B82F6', desc: 'Competitive auctions, banker-led' },
            { source: 'Relationship', pct: 22, deals: 1, color: '#8B5CF6', desc: 'Industry contacts, operating partners' },
            { source: 'Auction', pct: 12, deals: 1, color: '#F59E0B', desc: 'Broad auction processes' },
          ].map((s) => (
            <div key={s.source} className="text-center p-4 rounded-lg" style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
              <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.pct}%</div>
              <div className="text-sm font-bold mt-1" style={{ color: 'var(--mr-text)' }}>{s.source}</div>
              <div className="text-xs font-mono mt-1" style={{ color: 'var(--mr-text-faint)' }}>{s.deals} investments</div>
              <div className="text-xs mt-2" style={{ color: 'var(--mr-text-muted)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
