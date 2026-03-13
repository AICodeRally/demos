'use client';

import { ActNavigation, SectionCard, KpiCard, DonutChart } from '@/components/demos/meridian';
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

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#0EA5E9' }}>
          Act 5 &middot; Carry Allocation
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Team Carry Pool
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          ${(CARRY_POOL_SUMMARY.totalCarryPool / 1e6).toFixed(0)}M total carry &middot; {TEAM.length} team members &middot; {CARRY_POOL_SUMMARY.allocatedPoints / 100}% allocated
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <KpiCard label="Total Carry Pool" value={`$${(CARRY_POOL_SUMMARY.totalCarryPool / 1e6).toFixed(0)}M`} accent="#D4A847" sub="At current NAV" stagger={0} />
        <KpiCard label="Team Members" value={String(TEAM.length)} accent="#3B82F6" sub="Carry participants" stagger={1} />
        <KpiCard label="Vesting Period" value={`${CARRY_POOL_SUMMARY.vestingPeriod} years`} accent="#10B981" sub={`${CARRY_POOL_SUMMARY.vestingCliff}-year cliff`} stagger={2} />
        <KpiCard label="Escrow Holdback" value={`${(CARRY_POOL_SUMMARY.clawbackEscrow * 100).toFixed(0)}%`} accent="#EF4444" sub="Clawback protection" stagger={3} />
      </div>

      {/* Carry Allocation Donut */}
      <SectionCard title="Carry Point Allocation">
        <div className="flex items-center gap-8">
          <DonutChart data={donutData} size={220} label="10,000 pts" />
          <div className="flex-1 space-y-2">
            {TEAM.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: LEVEL_COLORS[t.level] }} />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--mr-text)' }}>{t.name}</span>
                    <span className="text-xs font-mono ml-2" style={{ color: 'var(--mr-text-faint)' }}>{t.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono" style={{ color: LEVEL_COLORS[t.level] }}>
                      {(t.carryPoints / 100).toFixed(0)}%
                    </span>
                    <span className="text-xs font-mono ml-2" style={{ color: 'var(--mr-text-faint)' }}>
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
      <SectionCard title="Team Compensation Summary">
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ color: 'var(--mr-text-muted)' }}>
              <th className="text-left font-medium pb-3 pl-2">Name</th>
              <th className="text-left font-medium pb-3">Level</th>
              <th className="text-right font-medium pb-3">Base</th>
              <th className="text-right font-medium pb-3">Bonus</th>
              <th className="text-right font-medium pb-3">Cash Comp</th>
              <th className="text-right font-medium pb-3">Carry %</th>
              <th className="text-right font-medium pb-3">Est. Carry</th>
              <th className="text-right font-medium pb-3 pr-2">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {TEAM.map((t, i) => (
              <tr key={t.id} style={i % 2 === 0 ? { background: 'var(--mr-stripe)' } : undefined}>
                <td className="py-2.5 pl-2 font-semibold" style={{ color: 'var(--mr-text)' }}>{t.name}</td>
                <td className="py-2.5">
                  <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${LEVEL_COLORS[t.level]}15`, color: LEVEL_COLORS[t.level] }}>
                    {t.level}
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono" style={{ color: 'var(--mr-text)' }}>${(t.baseSalary / 1e3).toFixed(0)}K</td>
                <td className="py-2.5 text-right font-mono" style={{ color: 'var(--mr-text-muted)' }}>${(t.bonus / 1e3).toFixed(0)}K</td>
                <td className="py-2.5 text-right font-mono font-bold" style={{ color: 'var(--mr-text)' }}>${(t.totalComp / 1e6).toFixed(2)}M</td>
                <td className="py-2.5 text-right font-mono" style={{ color: LEVEL_COLORS[t.level] }}>{(t.carryPoints / 100).toFixed(0)}%</td>
                <td className="py-2.5 text-right font-mono font-bold" style={{ color: '#D4A847' }}>${(t.estimatedCarry / 1e6).toFixed(1)}M</td>
                <td className="py-2.5 text-right font-mono font-bold pr-2" style={{ color: '#10B981' }}>
                  ${((t.totalComp * 5 + t.estimatedCarry) / 1e6).toFixed(1)}M
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs font-mono mt-2" style={{ color: 'var(--mr-text-faint)' }}>
          Total Value = 5-year cash compensation + estimated carried interest at current NAV. Carry subject to vesting and clawback.
        </div>
      </SectionCard>
    </>
  );
}
