'use client';

import { ActNavigation, SectionCard, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { CAPITAL_ACCOUNTS } from '@/data/meridian';

export default function CapitalAccountsPage() {
  const totalCommitment = CAPITAL_ACCOUNTS.reduce((s, a) => s + a.commitment, 0);
  const totalCalled = CAPITAL_ACCOUNTS.reduce((s, a) => s + a.called, 0);
  const totalDistributed = CAPITAL_ACCOUNTS.reduce((s, a) => s + a.distributed, 0);
  const totalNAV = CAPITAL_ACCOUNTS.reduce((s, a) => s + a.nav, 0);

  return (
    <>
      <ActNavigation currentAct={4} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Total Committed', value: `$${totalCommitment}M`, status: 'green', detail: `${CAPITAL_ACCOUNTS.length} LPs` },
          { label: 'Capital Called', value: `${((totalCalled / totalCommitment) * 100).toFixed(0)}%`, status: 'green', detail: `$${totalCalled}M drawn` },
          { label: 'Distributions', value: `$${totalDistributed.toFixed(0)}M`, status: 'green', detail: 'Returned to LPs' },
          { label: 'Blended TVPI', value: `${((totalDistributed + totalNAV) / totalCalled).toFixed(2)}x`, status: 'green', detail: 'Fund-level multiple' },
        ]}
      />

      <div className="mt-2 mb-6 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#10B981' }}>
          Capital Accounts &middot; LP Balances
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          LP Capital Account Statements
        </h1>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Transparent Capital Accounting Drives LP Confidence"
        insight="Real-time capital account visibility ensures every LP has an auditable view of commitments, drawdowns, distributions, and net asset value. Automated reconciliation eliminates manual errors and accelerates quarterly reporting cycles."
        accentColor="#10B981"
        implications={[
          'All capital calls and distributions reconciled within 24 hours of execution — zero discrepancies in last 8 quarters.',
          'Blended fund TVPI tracking above 1.5x with strong distribution velocity across top-quartile LPs.',
        ]}
      />

      <SectionCard title="Capital Account Summary ($M)" variant="hero" accentColor="#10B981">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[13px] min-w-[600px]">
            <thead>
              <tr style={{ color: 'var(--mr-text-muted)' }}>
                <th className="text-left font-semibold pb-3 pl-2">Limited Partner</th>
                <th className="text-right font-semibold pb-3">Commitment</th>
                <th className="text-right font-semibold pb-3">Called</th>
                <th className="text-right font-semibold pb-3">Distributed</th>
                <th className="text-right font-semibold pb-3">NAV</th>
                <th className="text-right font-semibold pb-3">Unfunded</th>
                <th className="text-right font-semibold pb-3 pr-2">TVPI</th>
              </tr>
            </thead>
            <tbody>
              {CAPITAL_ACCOUNTS.map((a, i) => (
                <tr key={a.lp} style={i % 2 === 0 ? { background: 'var(--mr-stripe)' } : undefined}>
                  <td className="py-2.5 pl-2 font-semibold" style={{ color: 'var(--mr-text)' }}>{a.lp}</td>
                  <td className="py-2.5 text-right tabular-nums" style={{ color: 'var(--mr-text)' }}>${a.commitment}</td>
                  <td className="py-2.5 text-right tabular-nums" style={{ color: 'var(--mr-text-muted)' }}>${a.called}</td>
                  <td className="py-2.5 text-right tabular-nums" style={{ color: '#10B981' }}>${a.distributed.toFixed(1)}</td>
                  <td className="py-2.5 text-right tabular-nums font-bold" style={{ color: '#D4A847' }}>${a.nav}</td>
                  <td className="py-2.5 text-right tabular-nums" style={{ color: 'var(--mr-text-faint)' }}>${a.unfunded}</td>
                  <td className="py-2.5 text-right tabular-nums font-bold pr-2" style={{ color: '#10B981' }}>{a.tvpi.toFixed(2)}x</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--mr-border)' }}>
                <td className="py-2.5 pl-2 font-bold" style={{ color: 'var(--mr-text)' }}>Total</td>
                <td className="py-2.5 text-right tabular-nums font-bold" style={{ color: '#D4A847' }}>${totalCommitment}</td>
                <td className="py-2.5 text-right tabular-nums font-bold" style={{ color: 'var(--mr-text)' }}>${totalCalled}</td>
                <td className="py-2.5 text-right tabular-nums font-bold" style={{ color: '#10B981' }}>${totalDistributed.toFixed(1)}</td>
                <td className="py-2.5 text-right tabular-nums font-bold" style={{ color: '#D4A847' }}>${totalNAV}</td>
                <td className="py-2.5 text-right tabular-nums font-bold" style={{ color: 'var(--mr-text-muted)' }}>${CAPITAL_ACCOUNTS.reduce((s, a) => s + a.unfunded, 0)}</td>
                <td className="py-2.5 text-right tabular-nums font-bold pr-2" style={{ color: '#10B981' }}>
                  {((totalDistributed + totalNAV) / totalCalled).toFixed(2)}x
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>

      {/* Visualization */}
      <SectionCard title="Capital Allocation Waterfall (Per LP)" meta={`Top ${CAPITAL_ACCOUNTS.slice(0, 8).length} LPs by commitment`}>
        <div className="space-y-2">
          {CAPITAL_ACCOUNTS.slice(0, 8).map((a, i) => {
            const calledPct = (a.called / a.commitment) * 100;
            const distPct = (a.distributed / a.commitment) * 100;
            return (
              <div key={a.lp} className="flex items-center gap-3 animate-mr-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-36 shrink-0 text-right text-[12px] tabular-nums truncate" style={{ color: 'var(--mr-text)' }}>
                  {a.lp}
                </div>
                <div className="flex-1 h-5 rounded-full overflow-hidden flex" style={{ background: 'var(--mr-chart-bar-track)' }}>
                  <div className="h-full" style={{ width: `${distPct}%`, background: '#10B981' }} title={`Distributed: $${a.distributed.toFixed(1)}M`} />
                  <div className="h-full" style={{ width: `${calledPct - distPct}%`, background: '#3B82F6' }} title={`Invested: $${(a.called - a.distributed).toFixed(0)}M`} />
                </div>
                <div className="w-16 text-right text-xs tabular-nums font-bold" style={{ color: '#D4A847' }}>
                  {a.tvpi.toFixed(2)}x
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--mr-text-faint)' }}>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: '#10B981' }} /> Distributed</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: '#3B82F6' }} /> Invested (unreturned)</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: 'var(--mr-chart-bar-track)' }} /> Unfunded</div>
        </div>
      </SectionCard>
    </>
  );
}
