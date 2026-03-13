'use client';

import { ActNavigation, SectionCard, KpiCard } from '@/components/demos/meridian';
import { FUND, WATERFALL_SUMMARY, DISTRIBUTION_HISTORY } from '@/data/meridian';

export default function HurdleCatchUpPage() {
  const totalDistributed = DISTRIBUTION_HISTORY[DISTRIBUTION_HISTORY.length - 1]?.cumDistributed ?? 0;
  const capitalReturned = totalDistributed / FUND.calledCapital;
  const prefReturnRequired = FUND.calledCapital * 0.08 * 3.5; // ~3.5 years avg
  const prefReturnProgress = Math.min(totalDistributed / (FUND.calledCapital + prefReturnRequired), 1);

  return (
    <>
      <ActNavigation currentAct={4} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#10B981' }}>
          Hurdle Mechanics &middot; Catch-Up
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Preferred Return & GP Catch-Up
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <KpiCard label="Hurdle Rate" value="8.0%" accent="#3B82F6" sub="Compounding preferred return" stagger={0} />
        <KpiCard label="Capital Returned" value={`${(capitalReturned * 100).toFixed(0)}%`} accent="#D4A847" sub={`$${(totalDistributed / 1e6).toFixed(0)}M of $${(FUND.calledCapital / 1e6).toFixed(0)}M`} stagger={1} />
        <KpiCard label="Catch-Up Split" value="100 / 0" accent="#10B981" sub="GP / LP until parity" stagger={2} />
        <KpiCard label="Carry Split" value="20 / 80" accent="#8B5CF6" sub="Post catch-up" stagger={3} />
      </div>

      {/* Progress to carry */}
      <SectionCard title="Progress Toward Carried Interest">
        <div className="space-y-6">
          {/* Step 1: Return of Capital */}
          <div>
            <div className="flex justify-between text-[13px] mb-2">
              <span className="font-bold" style={{ color: 'var(--mr-text)' }}>Step 1: Return of Capital</span>
              <span className="font-mono" style={{ color: capitalReturned >= 1 ? '#10B981' : '#D4A847' }}>
                ${(totalDistributed / 1e6).toFixed(0)}M / ${(FUND.calledCapital / 1e6).toFixed(0)}M ({(capitalReturned * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="h-4 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
              <div className="h-full rounded-full" style={{ width: `${capitalReturned * 100}%`, background: '#6B7280' }} />
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--mr-text-faint)' }}>
              Remaining: ${((FUND.calledCapital - totalDistributed) / 1e6).toFixed(0)}M to return before preferred return begins
            </div>
          </div>

          {/* Step 2: Preferred Return */}
          <div>
            <div className="flex justify-between text-[13px] mb-2">
              <span className="font-bold" style={{ color: 'var(--mr-text)' }}>Step 2: 8% Preferred Return (Hurdle)</span>
              <span className="font-mono" style={{ color: '#3B82F6' }}>Not yet started</span>
            </div>
            <div className="h-4 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
              <div className="h-full rounded-full" style={{ width: '0%', background: '#3B82F6' }} />
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--mr-text-faint)' }}>
              Est. preferred return owed: ~$462M (8% compound on called capital over fund life)
            </div>
          </div>

          {/* Step 3: GP Catch-Up */}
          <div>
            <div className="flex justify-between text-[13px] mb-2">
              <span className="font-bold" style={{ color: 'var(--mr-text)' }}>Step 3: GP Catch-Up (100/0)</span>
              <span className="font-mono" style={{ color: '#D4A847' }}>Pending</span>
            </div>
            <div className="h-4 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
              <div className="h-full rounded-full" style={{ width: '0%', background: '#D4A847' }} />
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--mr-text-faint)' }}>
              GP receives 100% until GP has 20% of total profits. Est. $116M catch-up tranche.
            </div>
          </div>

          {/* Step 4: Carried Interest */}
          <div>
            <div className="flex justify-between text-[13px] mb-2">
              <span className="font-bold" style={{ color: 'var(--mr-text)' }}>Step 4: Carried Interest (20/80)</span>
              <span className="font-mono" style={{ color: '#10B981' }}>Pending</span>
            </div>
            <div className="h-4 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
              <div className="h-full rounded-full" style={{ width: '0%', background: '#10B981' }} />
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--mr-text-faint)' }}>
              All remaining distributions split 20% GP / 80% LP. Est. $1.1B in this tranche.
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Hurdle Rate Mechanics */}
      <SectionCard title="Hurdle Rate Mechanics">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <div className="text-xs font-bold font-mono mb-2" style={{ color: '#3B82F6' }}>EUROPEAN WATERFALL</div>
            <p className="text-[12px] mb-2" style={{ color: 'var(--mr-text-secondary)' }}>
              GP does not receive ANY carry until ALL called capital is returned AND the 8% preferred return is achieved across the ENTIRE fund.
              This protects LPs from early carry on winners while losers remain unrealized.
            </p>
            <div className="text-xs font-mono" style={{ color: '#3B82F6' }}>Fund IV uses this structure</div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(107,114,128,0.06)', border: '1px solid rgba(107,114,128,0.15)' }}>
            <div className="text-xs font-bold font-mono mb-2" style={{ color: '#6B7280' }}>AMERICAN WATERFALL (Not Used)</div>
            <p className="text-[12px] mb-2" style={{ color: 'var(--mr-text-secondary)' }}>
              GP receives carry deal-by-deal as each investment is realized. More GP-friendly but creates clawback risk
              if early exits perform well but later exits underperform.
            </p>
            <div className="text-xs font-mono" style={{ color: '#6B7280' }}>Higher clawback risk for LPs</div>
          </div>
        </div>
      </SectionCard>
    </>
  );
}
