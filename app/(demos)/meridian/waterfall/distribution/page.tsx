'use client';

import { ActNavigation, SectionCard, KpiCard, WaterfallChart, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { WATERFALL_TIERS, WATERFALL_SUMMARY, DISTRIBUTION_HISTORY } from '@/data/meridian';
import { fmt } from '@/lib/utils';

export default function DistributionWaterfallPage() {
  return (
    <>
      <ActNavigation currentAct={4} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Waterfall Status', value: 'Tier 1', status: 'green', detail: 'Capital return phase' },
          { label: 'LP Distributions', value: `$${(WATERFALL_SUMMARY.lpDistributions / 1e9).toFixed(2)}B`, status: 'green', detail: 'Net to LPs' },
          { label: 'GP Carry', value: `$${(WATERFALL_SUMMARY.gpCarry / 1e6).toFixed(0)}M`, status: 'green', detail: 'Projected carry' },
          { label: 'Hurdle', value: '8.0%', status: 'neutral', detail: 'Preferred return' },
        ]}
      />

      <div className="mt-2 mb-6 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#10B981' }}>
          Act 4 &middot; Waterfall &amp; Distributions
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Distribution Waterfall
        </h1>
        <p className="text-[14px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          European (whole-fund) waterfall &middot; 8% hurdle &middot; 100% GP catch-up &middot; 20/80 carry split
        </p>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Alignment-First Distribution Mechanics"
        insight="The European waterfall structure ensures LPs receive full capital return plus 8% preferred return before any GP carry. This alignment-first approach, combined with escrow provisions and clawback protections, maximizes LP confidence and supports re-up rates for successor fund raising."
        accentColor="#10B981"
        implications={[
          'Current projections show carry breakeven at $1.68B total distributions — Fund IV is tracking 15% ahead of this threshold.',
          'GP commitment of 5% ($100M) and 100% catch-up structure mean GP economics are fully aligned with LP returns above hurdle.',
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <KpiCard label="Total Distributions" value={`$${(WATERFALL_SUMMARY.totalDistributions / 1e9).toFixed(1)}B`} accent="#D4A847" sub="Projected at exit" variant="primary" stagger={0} />
        <KpiCard label="LP Distributions" value={`$${(WATERFALL_SUMMARY.lpDistributions / 1e9).toFixed(2)}B`} accent="#3B82F6" sub="Net to LPs" variant="primary" stagger={1} />
        <KpiCard label="GP Carry" value={`$${(WATERFALL_SUMMARY.gpCarry / 1e6).toFixed(0)}M`} accent="#10B981" sub="Carried interest" delta="+$18M" deltaDirection="up" stagger={2} />
        <KpiCard label="LP MOIC" value={`${WATERFALL_SUMMARY.lpMoIC.toFixed(2)}x`} accent="#8B5CF6" sub="Net to LPs" stagger={3} />
        <KpiCard label="GP MOIC" value={`${WATERFALL_SUMMARY.gpMoIC.toFixed(1)}x`} accent="#F59E0B" sub="On GP commitment" stagger={4} />
      </div>

      {/* Waterfall Chart */}
      <SectionCard title="Projected Distribution Waterfall" variant="hero" accentColor="#10B981">
        <WaterfallChart tiers={WATERFALL_TIERS} totalDistributions={WATERFALL_SUMMARY.totalDistributions} />
      </SectionCard>

      {/* Tier Detail */}
      <SectionCard title="Waterfall Tier Detail" meta="4-tier European structure">
        <div className="space-y-3">
          {WATERFALL_TIERS.map((tier, i) => (
            <div
              key={tier.name}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl transition-all hover:shadow-md animate-mr-fade-in"
              style={{ background: `${tier.color}08`, border: `1px solid ${tier.color}25`, animationDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: `${tier.color}20`, color: tier.color }}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>{tier.name}</div>
                <div className="text-[12px]" style={{ color: 'var(--mr-text-muted)' }}>{tier.description}</div>
              </div>
              <div className="text-center px-4">
                <div className="text-[10px] uppercase tracking-[1px] font-semibold" style={{ color: 'var(--mr-text-faint)' }}>GP / LP</div>
                <div className="text-[14px] font-bold tabular-nums" style={{ color: tier.color }}>{tier.split[0]} / {tier.split[1]}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold tabular-nums" style={{ color: tier.color, fontFamily: 'var(--mr-font)' }}>${(tier.amount / 1e9).toFixed(2)}B</div>
                <div className="text-[12px] tabular-nums" style={{ color: 'var(--mr-text-faint)' }}>Cum: ${(tier.cumulative / 1e9).toFixed(2)}B</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Distribution History */}
      <SectionCard title="Distribution History (Realized)" meta="Capital return phase">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[13px] min-w-[600px]">
            <thead>
              <tr style={{ color: 'var(--mr-text-muted)' }}>
                <th className="text-left font-semibold pb-3 pl-2">Date</th>
                <th className="text-left font-semibold pb-3">Type</th>
                <th className="text-left font-semibold pb-3">Source</th>
                <th className="text-right font-semibold pb-3">Amount</th>
                <th className="text-right font-semibold pb-3">LP Share</th>
                <th className="text-right font-semibold pb-3 pr-2">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {DISTRIBUTION_HISTORY.map((d, i) => (
                <tr key={`${d.date}-${d.source}`} style={i % 2 === 0 ? { background: 'var(--mr-stripe)' } : undefined}>
                  <td className="py-2.5 pl-2 tabular-nums" style={{ color: 'var(--mr-text-muted)' }}>{d.date}</td>
                  <td className="py-2.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: d.type === 'Capital Return' ? '#3B82F615' : '#8B5CF615', color: d.type === 'Capital Return' ? '#3B82F6' : '#8B5CF6' }}>
                      {d.type}
                    </span>
                  </td>
                  <td className="py-2.5 font-semibold" style={{ color: 'var(--mr-text)' }}>{d.source}</td>
                  <td className="py-2.5 text-right tabular-nums font-bold" style={{ color: 'var(--mr-text)' }}>${fmt(d.amount / 1e6)}M</td>
                  <td className="py-2.5 text-right tabular-nums" style={{ color: '#3B82F6' }}>${fmt(d.lpShare / 1e6)}M</td>
                  <td className="py-2.5 text-right tabular-nums pr-2" style={{ color: 'var(--mr-text-muted)' }}>${fmt(d.cumDistributed / 1e6)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-[12px]" style={{ color: 'var(--mr-text-faint)' }}>
          All distributions to date are capital return (Tier 1). Hurdle has not yet been reached. GP carry begins after full capital return + 8% preferred.
        </div>
      </SectionCard>
    </>
  );
}
