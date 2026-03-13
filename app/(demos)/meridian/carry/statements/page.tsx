'use client';

import { useState } from 'react';
import { ActNavigation, SectionCard, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { TEAM } from '@/data/meridian';
import { fmt } from '@/lib/utils';

export default function IndividualStatementsPage() {
  const [selected, setSelected] = useState(TEAM[0].id);
  const member = TEAM.find((t) => t.id === selected) ?? TEAM[0];

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Viewing', value: member.name.split(' ')[1], status: 'green', detail: member.level },
          { label: 'Total Value', value: `$${((member.totalComp * 5 + member.estimatedCarry + member.coinvestDeployed * 0.62) / 1e6).toFixed(1)}M`, status: 'green', detail: 'Fund IV lifetime' },
          { label: 'Vested', value: `${(member.vestedPct * 100).toFixed(0)}%`, status: member.vestedPct >= 0.6 ? 'green' : 'amber', detail: 'Of carry allocation' },
          { label: 'Deals Led', value: `${member.dealsLed.length}`, status: member.dealsLed.length > 0 ? 'green' : 'amber', detail: 'Active leadership' },
        ]}
      />

      {/* Hero */}
      <div className="mt-2 mb-8 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#0EA5E9' }}>
          Individual Statement &middot; Carry Detail
        </div>
        <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Individual Carry Statements
        </h1>
        <p className="text-[14px]" style={{ color: 'var(--mr-text-muted)' }}>
          Comprehensive view of compensation, carry, and co-investment by team member
        </p>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Total Compensation Transparency"
        insight="Individual carry statements provide full visibility into each professional's economic alignment with fund performance. The combination of cash compensation, carried interest, and co-investment creates a multi-layered incentive structure."
        accentColor="#D4A847"
        implications={[
          'Senior professionals derive 60-75% of total economic value from carry and co-invest — directly tying outcomes to fund returns.',
          'Co-investment profit (taxed at LTCG rates) provides meaningful tax-advantaged upside beyond carried interest.',
        ]}
      />

      {/* Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TEAM.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className="px-3 py-2 rounded-xl text-sm transition-all hover:shadow-lg"
            style={{
              background: selected === t.id ? '#D4A84720' : 'var(--mr-card)',
              border: `1px solid ${selected === t.id ? '#D4A847' : 'var(--mr-border)'}`,
              color: selected === t.id ? '#D4A847' : 'var(--mr-text-muted)',
            }}
          >
            {t.name.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Statement Card */}
      <SectionCard title={`Carry Statement — ${member.name}`} variant="hero" accentColor="#D4A847">
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Summary */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)', animationDelay: '0ms' }}>
              <div className="text-xs font-bold uppercase mb-3" style={{ color: 'var(--mr-text-muted)' }}>Compensation Summary</div>
              {[
                { l: 'Title', v: member.title },
                { l: 'Base Salary', v: `$${fmt(member.baseSalary)}` },
                { l: 'Annual Bonus', v: `$${fmt(member.bonus)}` },
                { l: 'Total Cash Comp', v: `$${fmt(member.totalComp)}` },
              ].map((r) => (
                <div key={r.l} className="flex justify-between text-[13px] py-1">
                  <span style={{ color: 'var(--mr-text-muted)' }}>{r.l}</span>
                  <span className="tabular-nums font-bold" style={{ color: 'var(--mr-text)' }}>{r.v}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)', animationDelay: '80ms' }}>
              <div className="text-xs font-bold uppercase mb-3" style={{ color: 'var(--mr-text-muted)' }}>Carried Interest</div>
              {[
                { l: 'Carry Points', v: `${(member.carryPoints / 100).toFixed(0)}% (${fmt(member.carryPoints)} bps)` },
                { l: 'Vesting Start', v: member.vestingStartDate },
                { l: 'Vested', v: `${(member.vestedPct * 100).toFixed(0)}%` },
                { l: 'Vested Carry', v: `$${((member.estimatedCarry * member.vestedPct) / 1e6).toFixed(1)}M`, color: '#10B981' },
                { l: 'Unvested Carry', v: `$${((member.estimatedCarry * member.unvestedPct) / 1e6).toFixed(1)}M`, color: '#F59E0B' },
                { l: 'Total Est. Carry', v: `$${(member.estimatedCarry / 1e6).toFixed(1)}M`, color: '#D4A847' },
              ].map((r) => (
                <div key={r.l} className="flex justify-between text-[13px] py-1">
                  <span style={{ color: 'var(--mr-text-muted)' }}>{r.l}</span>
                  <span className="tabular-nums font-bold" style={{ color: (r as { color?: string }).color ?? 'var(--mr-text)' }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)', animationDelay: '160ms' }}>
              <div className="text-xs font-bold uppercase mb-3" style={{ color: 'var(--mr-text-muted)' }}>Co-Investment</div>
              {[
                { l: 'Commitment', v: `$${(member.coinvestCommitment / 1e6).toFixed(1)}M` },
                { l: 'Deployed', v: `$${(member.coinvestDeployed / 1e6).toFixed(1)}M` },
                { l: 'Est. Return (1.62x)', v: `$${((member.coinvestDeployed * 1.62) / 1e6).toFixed(1)}M`, color: '#10B981' },
                { l: 'Est. Profit', v: `$${((member.coinvestDeployed * 0.62) / 1e6).toFixed(1)}M`, color: '#D4A847' },
              ].map((r) => (
                <div key={r.l} className="flex justify-between text-[13px] py-1">
                  <span style={{ color: 'var(--mr-text-muted)' }}>{r.l}</span>
                  <span className="tabular-nums font-bold" style={{ color: (r as { color?: string }).color ?? 'var(--mr-text)' }}>{r.v}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)', animationDelay: '240ms' }}>
              <div className="text-xs font-bold uppercase mb-3" style={{ color: 'var(--mr-text-muted)' }}>Deals & Board Seats</div>
              <div className="mb-2">
                <div className="text-xs mb-1" style={{ color: 'var(--mr-text-faint)' }}>Deals Led ({member.dealsLed.length})</div>
                <div className="flex flex-wrap gap-1">
                  {member.dealsLed.length > 0 ? member.dealsLed.map((d) => (
                    <span key={d} className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: '#3B82F615', color: '#3B82F6' }}>{d}</span>
                  )) : <span className="text-xs" style={{ color: 'var(--mr-text-faint)' }}>Supporting role on deal teams</span>}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--mr-text-faint)' }}>Board Seats ({member.boardSeats.length})</div>
                <div className="flex flex-wrap gap-1">
                  {member.boardSeats.length > 0 ? member.boardSeats.map((b) => (
                    <span key={b} className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>{b}</span>
                  )) : <span className="text-xs" style={{ color: 'var(--mr-text-faint)' }}>No board seats yet</span>}
                </div>
              </div>
            </div>

            {/* Total wealth */}
            <div className="p-4 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in" style={{ background: 'rgba(212,168,71,0.08)', border: '1px solid rgba(212,168,71,0.25)', animationDelay: '320ms' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#D4A847' }}>TOTAL ESTIMATED VALUE (FUND IV)</div>
              <div className="text-3xl font-bold tabular-nums" style={{ color: '#D4A847' }}>
                ${((member.totalComp * 5 + member.estimatedCarry + member.coinvestDeployed * 0.62) / 1e6).toFixed(1)}M
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--mr-text-muted)' }}>
                5-yr cash + carry + co-invest profit (at current NAV)
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </>
  );
}
