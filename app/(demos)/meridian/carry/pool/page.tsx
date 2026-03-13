'use client';

import { ActNavigation, SectionCard, KpiCard, DonutChart, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { TEAM, CARRY_POOL_SUMMARY } from '@/data/meridian';
import { fmt } from '@/lib/utils';

const LEVEL_COLORS: Record<string, string> = {
  Partner: '#D4A847',
  'Managing Director': '#3B82F6',
  Principal: '#8B5CF6',
  'Vice President': '#10B981',
  Associate: '#F59E0B',
};

export default function CarryPoolPage() {
  const donutData = TEAM.map((t) => ({
    name: t.name.split(' ')[1],
    value: t.carryPoints,
    color: LEVEL_COLORS[t.level],
  }));

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Pool Utilization', value: `${CARRY_POOL_SUMMARY.allocatedPoints / 100}%`, status: 'green', detail: 'Points allocated' },
          { label: 'Escrow Reserve', value: `${(CARRY_POOL_SUMMARY.clawbackEscrow * 100).toFixed(0)}%`, status: 'amber', detail: 'Clawback holdback' },
          { label: 'Team Size', value: `${TEAM.length}`, status: 'green', detail: 'Carry participants' },
          { label: 'Cliff Status', value: 'Active', status: 'green', detail: `${CARRY_POOL_SUMMARY.vestingCliff}-yr cliff period` },
        ]}
      />

      {/* Hero */}
      <div className="mt-2 mb-8 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#0EA5E9' }}>
          Act 5 &middot; Carry Allocation
        </div>
        <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Team Carry Pool
        </h1>
        <p className="text-[14px]" style={{ color: 'var(--mr-text-muted)' }}>
          ${(CARRY_POOL_SUMMARY.totalCarryPool / 1e6).toFixed(0)}M total carry &middot; {TEAM.length} team members &middot; {CARRY_POOL_SUMMARY.allocatedPoints / 100}% allocated
        </p>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Alignment Through Ownership: Carry as Retention Engine"
        insight="The carry pool structure ties team economics directly to fund performance, ensuring every investment professional has meaningful upside. Our allocation methodology weights deal leadership, board service, and value creation contribution."
        accentColor="#D4A847"
        implications={[
          'Partners and MDs hold 68% of carry points — reflecting deal origination responsibility and LP relationship management.',
          'The 30% escrow holdback and 5-year vesting create $47M in unvested "golden handcuffs" across the team.',
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <KpiCard label="Total Carry Pool" value={`$${(CARRY_POOL_SUMMARY.totalCarryPool / 1e6).toFixed(0)}M`} accent="#D4A847" sub="At current NAV" variant="primary" stagger={0} />
        <KpiCard label="Team Members" value={String(TEAM.length)} accent="#3B82F6" sub="Carry participants" variant="primary" stagger={1} />
        <KpiCard label="Vesting Period" value={`${CARRY_POOL_SUMMARY.vestingPeriod} years`} accent="#10B981" sub={`${CARRY_POOL_SUMMARY.vestingCliff}-year cliff`} stagger={2} />
        <KpiCard label="Escrow Holdback" value={`${(CARRY_POOL_SUMMARY.clawbackEscrow * 100).toFixed(0)}%`} accent="#EF4444" sub="Clawback protection" stagger={3} />
        <KpiCard label="Allocated" value={`${CARRY_POOL_SUMMARY.allocatedPoints / 100}%`} accent="#8B5CF6" sub="Of total points" delta="Full" deltaDirection="neutral" stagger={4} />
      </div>

      {/* Carry Allocation Donut */}
      <SectionCard title="Carry Point Allocation" variant="hero" accentColor="#D4A847">
        <div className="flex items-center gap-8">
          <DonutChart data={donutData} size={220} label="10,000 pts" />
          <div className="flex-1 space-y-2">
            {TEAM.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: LEVEL_COLORS[t.level] }} />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--mr-text)' }}>{t.name}</span>
                    <span className="text-xs ml-2" style={{ color: 'var(--mr-text-faint)' }}>{t.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold tabular-nums" style={{ color: LEVEL_COLORS[t.level] }}>
                      {(t.carryPoints / 100).toFixed(0)}%
                    </span>
                    <span className="text-xs tabular-nums ml-2" style={{ color: 'var(--mr-text-faint)' }}>
                      ${(t.estimatedCarry / 1e6).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Team Compensation Table */}
      <SectionCard title="Team Compensation Summary" meta={`${TEAM.length} professionals`}>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[12px] min-w-[600px]">
            <thead>
              <tr style={{ color: 'var(--mr-text-muted)' }}>
                <th className="text-left font-semibold pb-3 pl-2">Name</th>
                <th className="text-left font-semibold pb-3">Level</th>
                <th className="text-right font-semibold pb-3">Base</th>
                <th className="text-right font-semibold pb-3">Bonus</th>
                <th className="text-right font-semibold pb-3">Cash Comp</th>
                <th className="text-right font-semibold pb-3">Carry %</th>
                <th className="text-right font-semibold pb-3">Est. Carry</th>
                <th className="text-right font-semibold pb-3 pr-2">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {TEAM.map((t, i) => (
                <tr key={t.id} style={i % 2 === 0 ? { background: 'var(--mr-stripe)' } : undefined}>
                  <td className="py-2.5 pl-2 font-semibold" style={{ color: 'var(--mr-text)' }}>{t.name}</td>
                  <td className="py-2.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: `${LEVEL_COLORS[t.level]}15`, color: LEVEL_COLORS[t.level] }}>
                      {t.level}
                    </span>
                  </td>
                  <td className="py-2.5 text-right tabular-nums" style={{ color: 'var(--mr-text)' }}>${(t.baseSalary / 1e3).toFixed(0)}K</td>
                  <td className="py-2.5 text-right tabular-nums" style={{ color: 'var(--mr-text-muted)' }}>${(t.bonus / 1e3).toFixed(0)}K</td>
                  <td className="py-2.5 text-right tabular-nums font-bold" style={{ color: 'var(--mr-text)' }}>${(t.totalComp / 1e6).toFixed(2)}M</td>
                  <td className="py-2.5 text-right tabular-nums" style={{ color: LEVEL_COLORS[t.level] }}>{(t.carryPoints / 100).toFixed(0)}%</td>
                  <td className="py-2.5 text-right tabular-nums font-bold" style={{ color: '#D4A847' }}>${(t.estimatedCarry / 1e6).toFixed(1)}M</td>
                  <td className="py-2.5 text-right tabular-nums font-bold pr-2" style={{ color: '#10B981' }}>
                    ${((t.totalComp * 5 + t.estimatedCarry) / 1e6).toFixed(1)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs mt-2" style={{ color: 'var(--mr-text-faint)' }}>
          Total Value = 5-year cash compensation + estimated carried interest at current NAV. Carry subject to vesting and clawback.
        </div>
      </SectionCard>
    </>
  );
}
