'use client';

import { ActNavigation, SectionCard, KpiCard, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { TEAM, COINVEST_PROGRAM } from '@/data/meridian';
import { fmt } from '@/lib/utils';

export default function CoInvestPage() {
  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Capital Called', value: `${((COINVEST_PROGRAM.deployed / COINVEST_PROGRAM.totalCommitment) * 100).toFixed(0)}%`, status: 'green', detail: 'Of commitments' },
          { label: 'Tax Rate', value: '23.8%', status: 'green', detail: 'LTCG + NIIT' },
          { label: 'No Carry Fee', value: '0%', status: 'green', detail: 'On co-invest returns' },
          { label: 'Est. Multiple', value: '1.62x', status: 'green', detail: 'At current NAV' },
        ]}
      />

      {/* Hero */}
      <div className="mt-2 mb-8 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#0EA5E9' }}>
          Co-Investment &middot; Alignment
        </div>
        <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Co-Investment Program
        </h1>
        <p className="text-[14px]" style={{ color: 'var(--mr-text-muted)' }}>
          Team capital alongside fund &middot; No fees, no carry &middot; LTCG tax treatment
        </p>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Skin in the Game: Tax-Efficient Team Alignment"
        insight="The co-investment program allows team members to invest personal capital alongside the fund at identical terms — no management fee, no carried interest. Returns are taxed at long-term capital gains rates, providing significant tax alpha versus ordinary income."
        accentColor="#10B981"
        implications={[
          'For a partner with $100M in carry, the LTCG vs. ordinary income differential on co-invest can exceed $13M in tax savings over the fund life.',
          'Pro-rata distributions with the fund ensure co-investors share identical economics and timing with LPs.',
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <KpiCard label="Total Commitment" value={`$${(COINVEST_PROGRAM.totalCommitment / 1e6).toFixed(1)}M`} accent="#D4A847" sub="Team co-invest" variant="primary" stagger={0} />
        <KpiCard label="Deployed" value={`$${(COINVEST_PROGRAM.deployed / 1e6).toFixed(1)}M`} accent="#10B981" sub={`${((COINVEST_PROGRAM.deployed / COINVEST_PROGRAM.totalCommitment) * 100).toFixed(0)}% called`} variant="primary" delta="+8%" deltaDirection="up" stagger={1} />
        <KpiCard label="Tax Advantage" value="LTCG" accent="#3B82F6" sub="vs ordinary on carry" stagger={2} />
        <KpiCard label="No Carry" value="0%" accent="#8B5CF6" sub="On co-invest returns" stagger={3} />
        <KpiCard label="Est. Return" value="1.62x" accent="#D4A847" sub="At current NAV" delta="+0.04x" deltaDirection="up" stagger={4} />
      </div>

      {/* Co-Invest Terms */}
      <SectionCard title="Co-Investment Program Terms" variant="hero" accentColor="#10B981">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', animationDelay: '0ms' }}>
            <div className="text-xs font-bold font-semibold mb-2" style={{ color: '#10B981' }}>BENEFITS</div>
            <div className="space-y-1 text-[14px]" style={{ color: 'var(--mr-text-secondary)' }}>
              <div>&#x2022; Same terms as fund (no premium)</div>
              <div>&#x2022; No management fee on co-invest</div>
              <div>&#x2022; No carried interest charged</div>
              <div>&#x2022; Pro-rata distributions with fund</div>
              <div>&#x2022; Long-term capital gains treatment</div>
            </div>
          </div>
          <div className="p-4 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', animationDelay: '80ms' }}>
            <div className="text-xs font-bold font-semibold mb-2" style={{ color: '#3B82F6' }}>MINIMUM COMMITMENTS</div>
            <div className="space-y-1 text-[14px]" style={{ color: 'var(--mr-text-secondary)' }}>
              {Object.entries(COINVEST_PROGRAM.minCommitmentByLevel).map(([level, min]) => (
                <div key={level} className="flex justify-between">
                  <span>{level}</span>
                  <span className="tabular-nums font-bold">${(min / 1e6).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Individual Co-Invest */}
      <SectionCard title="Team Co-Investment Status" meta={`${TEAM.length} participants`}>
        <div className="space-y-2">
          {TEAM.map((t, i) => {
            const pctDeployed = t.coinvestDeployed / t.coinvestCommitment;
            return (
              <div
                key={t.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in"
                style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)', animationDelay: `${i * 60}ms` }}
              >
                <div className="w-44 shrink-0">
                  <div className="text-[13px] font-bold" style={{ color: 'var(--mr-text)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--mr-text-muted)' }}>{t.level}</div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs tabular-nums mb-1" style={{ color: 'var(--mr-text-muted)' }}>
                    <span>Committed: ${(t.coinvestCommitment / 1e6).toFixed(1)}M</span>
                    <span>Deployed: ${(t.coinvestDeployed / 1e6).toFixed(1)}M ({(pctDeployed * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pctDeployed * 100}%`, background: '#10B981' }} />
                  </div>
                </div>
                <div className="text-right w-24">
                  <div className="text-xs" style={{ color: 'var(--mr-text-faint)' }}>Est. Return</div>
                  <div className="text-sm font-bold tabular-nums" style={{ color: '#D4A847' }}>
                    ${((t.coinvestDeployed * 1.62) / 1e6).toFixed(1)}M
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div
        className="rounded-xl px-6 py-5 mt-2 animate-mr-fade-in"
        style={{
          background: 'rgba(212,168,71,0.06)',
          borderLeft: '3px solid #D4A847',
          boxShadow: 'var(--mr-shadow)',
          animationDelay: '400ms',
        }}
      >
        <div className="text-xs font-bold font-semibold mb-1" style={{ color: '#D4A847' }}>TAX ADVANTAGE</div>
        <p className="text-[14px]" style={{ color: 'var(--mr-text-secondary)' }}>
          Co-invest returns are taxed as long-term capital gains (20% + 3.8% NIIT = 23.8%) vs carried interest which
          may be taxed as ordinary income (up to 37%) depending on holding period. For a partner with $100M carry,
          the tax differential can exceed $13M.
        </p>
      </div>
    </>
  );
}
