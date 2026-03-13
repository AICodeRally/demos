'use client';

import { ActNavigation, SectionCard, DonutChart, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { VALUE_CREATION_LEVERS, PORTFOLIO } from '@/data/meridian';

export default function ValueCreationPage() {
  const donutData = VALUE_CREATION_LEVERS.map((l) => ({ name: l.lever, value: l.contribution, color: l.color }));
  const totalValueCreated = PORTFOLIO.reduce((s, p) => s + (p.currentNAV - p.equityInvested), 0);

  return (
    <>
      <ActNavigation currentAct={3} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Value Created', value: `$${(totalValueCreated / 1e6).toFixed(0)}M`, status: 'green', detail: `${PORTFOLIO.length} companies` },
          { label: 'Top Driver', value: 'Revenue', status: 'green', detail: '35% of value' },
          { label: 'Margin Uplift', value: '340bps', status: 'green', detail: 'Avg improvement' },
          { label: 'Multiple Exp.', value: 'Positive', status: 'green', detail: '5 of 7 companies' },
        ]}
      />

      <div className="mt-2 mb-6 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#2563EB' }}>
          Value Creation &middot; Attribution
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Value Creation Analysis
        </h1>
        <p className="text-[14px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          Total value created: ${(totalValueCreated / 1e6).toFixed(0)}M across {PORTFOLIO.length} portfolio companies
        </p>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Operational Alpha Over Financial Engineering"
        insight="Over 60% of Fund IV value creation is driven by operational improvement — revenue growth and margin expansion — rather than leverage or multiple arbitrage. This philosophy produces more sustainable returns and reduces dependency on favorable exit markets."
        accentColor="#2563EB"
        implications={[
          'Revenue growth (organic + bolt-on) is the single largest value driver at 35%, reflecting successful platform consolidation strategies.',
          'Multiple expansion of 1.2x average across the portfolio validates that scaled platforms command premium exit multiples.',
        ]}
      />

      {/* Value Bridge */}
      <SectionCard title="Value Creation Attribution" variant="hero" accentColor="#10B981">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <DonutChart data={donutData} size={220} label={`$${(totalValueCreated / 1e6).toFixed(0)}M`} />
          <div className="flex-1 space-y-4">
            {VALUE_CREATION_LEVERS.map((lever, i) => (
              <div key={lever.lever} className="animate-mr-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: lever.color }} />
                    <span className="text-[14px] font-bold" style={{ color: 'var(--mr-text)' }}>{lever.lever}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums" style={{ color: lever.color }}>
                    {(lever.contribution * 100).toFixed(0)}% &middot; ${((totalValueCreated * lever.contribution) / 1e6).toFixed(0)}M
                  </span>
                </div>
                <div className="h-2 rounded-full mb-1" style={{ background: 'var(--mr-chart-bar-track)' }}>
                  <div className="h-full rounded-full" style={{ width: `${lever.contribution * 100}%`, background: lever.color }} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {lever.examples.map((e) => (
                    <span key={e} className="text-xs px-2 py-0.5 rounded" style={{ background: `${lever.color}10`, color: lever.color }}>
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Per-company value bridge */}
      <SectionCard title="Value Creation by Portfolio Company" meta={`${PORTFOLIO.length} companies ranked`}>
        <div className="space-y-3">
          {PORTFOLIO.sort((a, b) => (b.currentNAV - b.equityInvested) - (a.currentNAV - a.equityInvested)).map((pc, i) => {
            const valueCreated = pc.currentNAV - pc.equityInvested;
            const ebitdaGrowth = (pc.currentEbitda / pc.entryEbitda - 1);
            const multipleExpansion = pc.currentMultiple - pc.entryMultiple;
            return (
              <div
                key={pc.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in"
                style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)', animationDelay: `${i * 60}ms` }}
              >
                <div className="flex-1">
                  <div className="text-[13px] font-bold" style={{ color: 'var(--mr-text)' }}>{pc.name}</div>
                  <div className="text-xs" style={{ color: 'var(--mr-text-muted)' }}>{pc.sector}</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-xs" style={{ color: 'var(--mr-text-faint)' }}>EBITDA Growth</div>
                  <div className="text-sm font-bold tabular-nums" style={{ color: '#10B981' }}>+{(ebitdaGrowth * 100).toFixed(0)}%</div>
                </div>
                <div className="text-center px-3">
                  <div className="text-xs" style={{ color: 'var(--mr-text-faint)' }}>Multiple &Delta;</div>
                  <div className="text-sm font-bold tabular-nums" style={{ color: multipleExpansion > 0 ? '#8B5CF6' : '#F59E0B' }}>
                    {multipleExpansion > 0 ? '+' : ''}{multipleExpansion.toFixed(1)}x
                  </div>
                </div>
                <div className="text-center px-3">
                  <div className="text-xs" style={{ color: 'var(--mr-text-faint)' }}>Value Created</div>
                  <div className="text-sm font-bold tabular-nums" style={{ color: '#D4A847' }}>
                    ${(valueCreated / 1e6).toFixed(0)}M
                  </div>
                </div>
                <div className="text-center px-3">
                  <div className="text-xs" style={{ color: 'var(--mr-text-faint)' }}>MOIC</div>
                  <div className="text-lg font-bold tabular-nums" style={{ color: pc.moic >= 1.5 ? '#10B981' : '#3B82F6' }}>
                    {pc.moic.toFixed(2)}x
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="rounded-xl px-6 py-4 animate-mr-fade-in" style={{ background: 'rgba(16,185,129,0.04)', borderLeft: '3px solid #10B981', animationDelay: '400ms' }}>
        <div className="text-xs font-bold mb-1" style={{ color: '#10B981' }}>VALUE CREATION PHILOSOPHY</div>
        <p className="text-[13px]" style={{ color: 'var(--mr-text-secondary)' }}>
          Granite Peak targets 60%+ of value creation from operational improvement (revenue growth + margin expansion)
          rather than financial engineering. This approach is more sustainable and less dependent on favorable exit markets.
        </p>
      </div>
    </>
  );
}
