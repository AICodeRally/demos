'use client';

import { ActNavigation, SectionCard } from '@/components/demos/meridian';
import { PORTFOLIO } from '@/data/meridian';
import { fmt } from '@/lib/utils';

export default function PortfolioKPIsPage() {
  return (
    <>
      <ActNavigation currentAct={3} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
          Operating Metrics &middot; Performance
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Portfolio Operating KPIs
        </h1>
      </div>

      {/* Comparison Table */}
      <SectionCard title="Portfolio Performance Matrix">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ color: 'var(--mr-text-muted)' }}>
                <th className="text-left font-medium pb-3 pl-2">Company</th>
                <th className="text-right font-medium pb-3">Revenue</th>
                <th className="text-right font-medium pb-3">Rev Growth</th>
                <th className="text-right font-medium pb-3">EBITDA</th>
                <th className="text-right font-medium pb-3">Margin</th>
                <th className="text-right font-medium pb-3">EV / EBITDA</th>
                <th className="text-right font-medium pb-3">Employees</th>
                <th className="text-right font-medium pb-3">Rev / Emp</th>
                <th className="text-right font-medium pb-3 pr-2">MOIC</th>
              </tr>
            </thead>
            <tbody>
              {PORTFOLIO.map((pc, i) => {
                const revGrowth = (pc.currentRevenue / pc.revenueAtEntry - 1);
                const margin = pc.currentEbitda / pc.currentRevenue;
                const revPerEmp = pc.currentRevenue / pc.employees;
                return (
                  <tr key={pc.id} style={i % 2 === 0 ? { background: 'var(--mr-stripe)' } : undefined}>
                    <td className="py-2.5 pl-2">
                      <div className="font-semibold" style={{ color: 'var(--mr-text)' }}>{pc.name}</div>
                      <div className="text-xs" style={{ color: 'var(--mr-text-faint)' }}>{pc.sector}</div>
                    </td>
                    <td className="py-2.5 text-right font-mono" style={{ color: 'var(--mr-text)' }}>${(pc.currentRevenue / 1e6).toFixed(0)}M</td>
                    <td className="py-2.5 text-right font-mono font-bold" style={{ color: revGrowth > 0.3 ? '#10B981' : revGrowth > 0.15 ? '#3B82F6' : '#F59E0B' }}>
                      +{(revGrowth * 100).toFixed(0)}%
                    </td>
                    <td className="py-2.5 text-right font-mono" style={{ color: 'var(--mr-text)' }}>${(pc.currentEbitda / 1e6).toFixed(0)}M</td>
                    <td className="py-2.5 text-right font-mono" style={{ color: margin > 0.15 ? '#10B981' : '#F59E0B' }}>
                      {(margin * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 text-right font-mono" style={{ color: 'var(--mr-text-muted)' }}>{pc.currentMultiple.toFixed(1)}x</td>
                    <td className="py-2.5 text-right font-mono" style={{ color: 'var(--mr-text-muted)' }}>{fmt(pc.employees)}</td>
                    <td className="py-2.5 text-right font-mono" style={{ color: 'var(--mr-text-muted)' }}>${(revPerEmp / 1e3).toFixed(0)}K</td>
                    <td className="py-2.5 text-right font-mono font-bold pr-2" style={{ color: pc.moic >= 1.5 ? '#10B981' : pc.moic >= 1.2 ? '#3B82F6' : '#F59E0B' }}>
                      {pc.moic.toFixed(2)}x
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--mr-border)' }}>
                <td className="py-2.5 pl-2 font-bold" style={{ color: 'var(--mr-text)' }}>Portfolio Total</td>
                <td className="py-2.5 text-right font-mono font-bold" style={{ color: '#D4A847' }}>
                  ${(PORTFOLIO.reduce((s, p) => s + p.currentRevenue, 0) / 1e6).toFixed(0)}M
                </td>
                <td className="py-2.5 text-right" />
                <td className="py-2.5 text-right font-mono font-bold" style={{ color: '#D4A847' }}>
                  ${(PORTFOLIO.reduce((s, p) => s + p.currentEbitda, 0) / 1e6).toFixed(0)}M
                </td>
                <td colSpan={3} />
                <td className="py-2.5 text-right font-mono" style={{ color: 'var(--mr-text-muted)' }}>
                  {fmt(PORTFOLIO.reduce((s, p) => s + p.employees, 0))}
                </td>
                <td className="py-2.5 text-right font-mono font-bold pr-2" style={{ color: '#D4A847' }}>
                  {(PORTFOLIO.reduce((s, p) => s + p.currentNAV, 0) / PORTFOLIO.reduce((s, p) => s + p.equityInvested, 0)).toFixed(2)}x
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>

      {/* Watchlist */}
      <SectionCard title="Watchlist & Action Items">
        {PORTFOLIO.filter((p) => p.status === 'Watch').map((pc) => (
          <div key={pc.id} className="p-4 rounded-lg mb-3" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded" style={{ background: '#F59E0B20', color: '#F59E0B' }}>WATCH</span>
              <span className="text-[14px] font-bold" style={{ color: 'var(--mr-text)' }}>{pc.name}</span>
            </div>
            <p className="text-[12px]" style={{ color: 'var(--mr-text-secondary)' }}>
              Below-plan EBITDA growth ({((pc.currentEbitda / pc.entryEbitda - 1) * 100).toFixed(0)}% vs 40%+ target). Management team under review.
              Operational improvement plan activated Q4 2025. Board meeting scheduled for margin recovery update.
            </p>
          </div>
        ))}
      </SectionCard>
    </>
  );
}
