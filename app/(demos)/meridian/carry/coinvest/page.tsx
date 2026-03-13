'use client';

import { ActNavigation, SectionCard, KpiCard } from '@/components/demos/meridian';
import { TEAM, COINVEST_PROGRAM } from '@/data/meridian';
import { fmt } from '@/lib/utils';

export default function CoInvestPage() {
  return (
    <>
      <ActNavigation currentAct={5} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#0EA5E9' }}>
          Co-Investment &middot; Alignment
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Co-Investment Program
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <KpiCard label="Total Commitment" value={`$${(COINVEST_PROGRAM.totalCommitment / 1e6).toFixed(1)}M`} accent="#D4A847" sub="Team co-invest" stagger={0} />
        <KpiCard label="Deployed" value={`$${(COINVEST_PROGRAM.deployed / 1e6).toFixed(1)}M`} accent="#10B981" sub={`${((COINVEST_PROGRAM.deployed / COINVEST_PROGRAM.totalCommitment) * 100).toFixed(0)}% called`} stagger={1} />
        <KpiCard label="Tax Advantage" value="LTCG" accent="#3B82F6" sub="vs ordinary on carry" stagger={2} />
        <KpiCard label="No Carry" value="0%" accent="#8B5CF6" sub="On co-invest returns" stagger={3} />
      </div>

      {/* Co-Invest Terms */}
      <SectionCard title="Co-Investment Program Terms">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="text-xs font-bold font-mono mb-2" style={{ color: '#10B981' }}>BENEFITS</div>
            <div className="space-y-1 text-[13px]" style={{ color: 'var(--mr-text-secondary)' }}>
              <div>&#x2022; Same terms as fund (no premium)</div>
              <div>&#x2022; No management fee on co-invest</div>
              <div>&#x2022; No carried interest charged</div>
              <div>&#x2022; Pro-rata distributions with fund</div>
              <div>&#x2022; Long-term capital gains treatment</div>
            </div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <div className="text-xs font-bold font-mono mb-2" style={{ color: '#3B82F6' }}>MINIMUM COMMITMENTS</div>
            <div className="space-y-1 text-[13px]" style={{ color: 'var(--mr-text-secondary)' }}>
              {Object.entries(COINVEST_PROGRAM.minCommitmentByLevel).map(([level, min]) => (
                <div key={level} className="flex justify-between">
                  <span>{level}</span>
                  <span className="font-mono font-bold">${(min / 1e6).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Individual Co-Invest */}
      <SectionCard title="Team Co-Investment Status">
        <div className="space-y-2">
          {TEAM.map((t) => {
            const pctDeployed = t.coinvestDeployed / t.coinvestCommitment;
            return (
              <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)' }}>
                <div className="w-44 shrink-0">
                  <div className="text-[13px] font-bold" style={{ color: 'var(--mr-text)' }}>{t.name}</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--mr-text-muted)' }}>{t.level}</div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-mono mb-1" style={{ color: 'var(--mr-text-muted)' }}>
                    <span>Committed: ${(t.coinvestCommitment / 1e6).toFixed(1)}M</span>
                    <span>Deployed: ${(t.coinvestDeployed / 1e6).toFixed(1)}M ({(pctDeployed * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pctDeployed * 100}%`, background: '#10B981' }} />
                  </div>
                </div>
                <div className="text-right w-24">
                  <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>Est. Return</div>
                  <div className="text-sm font-bold font-mono" style={{ color: '#D4A847' }}>
                    ${((t.coinvestDeployed * 1.62) / 1e6).toFixed(1)}M
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="rounded-lg px-6 py-4" style={{ background: 'rgba(212,168,71,0.06)', borderLeft: '3px solid #D4A847' }}>
        <div className="text-xs font-bold font-mono mb-1" style={{ color: '#D4A847' }}>TAX ADVANTAGE</div>
        <p className="text-[13px]" style={{ color: 'var(--mr-text-secondary)' }}>
          Co-invest returns are taxed as long-term capital gains (20% + 3.8% NIIT = 23.8%) vs carried interest which
          may be taxed as ordinary income (up to 37%) depending on holding period. For a partner with $100M carry,
          the tax differential can exceed $13M.
        </p>
      </div>
    </>
  );
}
