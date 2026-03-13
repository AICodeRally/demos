'use client';

import { ActNavigation, SectionCard, KpiCard, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { FUND, DISTRIBUTION_HISTORY } from '@/data/meridian';

export default function HurdleCatchUpPage() {
  const totalDistributed = DISTRIBUTION_HISTORY[DISTRIBUTION_HISTORY.length - 1]?.cumDistributed ?? 0;
  const capitalReturned = totalDistributed / FUND.calledCapital;
  const prefReturnRequired = FUND.calledCapital * 0.08 * 3.5; // ~3.5 years avg
  const prefReturnProgress = Math.min(totalDistributed / (FUND.calledCapital + prefReturnRequired), 1);

  return (
    <>
      <ActNavigation currentAct={4} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Hurdle Status', value: 'Step 1', status: 'amber', detail: 'Returning capital' },
          { label: 'Capital Returned', value: `${(capitalReturned * 100).toFixed(0)}%`, status: capitalReturned >= 0.8 ? 'green' : 'amber', detail: `$${(totalDistributed / 1e6).toFixed(0)}M returned` },
          { label: 'Catch-Up Split', value: '100/0', status: 'green', detail: 'GP until parity' },
          { label: 'Waterfall Type', value: 'European', status: 'green', detail: 'Whole-fund structure' },
        ]}
      />

      <div className="mt-2 mb-6 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#10B981' }}>
          Hurdle Mechanics &middot; Catch-Up
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Preferred Return & GP Catch-Up
        </h1>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="European Waterfall: LP-First Distribution Mechanics"
        insight="Fund IV employs a whole-fund European waterfall — the most LP-protective structure available. GP carry is deferred until all called capital is returned and the 8% compounding preferred return is fully satisfied across the entire fund."
        accentColor="#3B82F6"
        implications={[
          'No carry leakage on early exits — GP economics are aligned with total fund performance, not individual deal outcomes.',
          '100% GP catch-up tranche ensures GP reaches 20% of total profits before reverting to standard 20/80 split.',
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <KpiCard label="Hurdle Rate" value="8.0%" accent="#3B82F6" sub="Compounding preferred return" variant="primary" stagger={0} />
        <KpiCard label="Capital Returned" value={`${(capitalReturned * 100).toFixed(0)}%`} accent="#D4A847" sub={`$${(totalDistributed / 1e6).toFixed(0)}M of $${(FUND.calledCapital / 1e6).toFixed(0)}M`} variant="primary" delta={`${(capitalReturned * 100).toFixed(0)}%`} deltaDirection="up" stagger={1} />
        <KpiCard label="Catch-Up Split" value="100 / 0" accent="#10B981" sub="GP / LP until parity" stagger={2} />
        <KpiCard label="Carry Split" value="20 / 80" accent="#8B5CF6" sub="Post catch-up" stagger={3} />
      </div>

      {/* Progress to carry */}
      <SectionCard title="Progress Toward Carried Interest" variant="hero" accentColor="#3B82F6">
        <div className="space-y-6">
          {/* Step 1: Return of Capital */}
          <div className="animate-mr-fade-in" style={{ animationDelay: '0ms' }}>
            <div className="flex justify-between text-[14px] mb-2">
              <span className="font-bold" style={{ color: 'var(--mr-text)' }}>Step 1: Return of Capital</span>
              <span className="tabular-nums font-semibold" style={{ color: capitalReturned >= 1 ? '#10B981' : '#D4A847' }}>
                ${(totalDistributed / 1e6).toFixed(0)}M / ${(FUND.calledCapital / 1e6).toFixed(0)}M ({(capitalReturned * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="h-4 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
              <div className="h-full rounded-full" style={{ width: `${capitalReturned * 100}%`, background: '#6B7280' }} />
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--mr-text-faint)' }}>
              Remaining: ${((FUND.calledCapital - totalDistributed) / 1e6).toFixed(0)}M to return before preferred return begins
            </div>
          </div>

          {/* Step 2: Preferred Return */}
          <div className="animate-mr-fade-in" style={{ animationDelay: '80ms' }}>
            <div className="flex justify-between text-[14px] mb-2">
              <span className="font-bold" style={{ color: 'var(--mr-text)' }}>Step 2: 8% Preferred Return (Hurdle)</span>
              <span className="tabular-nums font-semibold" style={{ color: '#3B82F6' }}>Not yet started</span>
            </div>
            <div className="h-4 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
              <div className="h-full rounded-full" style={{ width: '0%', background: '#3B82F6' }} />
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--mr-text-faint)' }}>
              Est. preferred return owed: ~$462M (8% compound on called capital over fund life)
            </div>
          </div>

          {/* Step 3: GP Catch-Up */}
          <div className="animate-mr-fade-in" style={{ animationDelay: '160ms' }}>
            <div className="flex justify-between text-[14px] mb-2">
              <span className="font-bold" style={{ color: 'var(--mr-text)' }}>Step 3: GP Catch-Up (100/0)</span>
              <span className="tabular-nums font-semibold" style={{ color: '#D4A847' }}>Pending</span>
            </div>
            <div className="h-4 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
              <div className="h-full rounded-full" style={{ width: '0%', background: '#D4A847' }} />
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--mr-text-faint)' }}>
              GP receives 100% until GP has 20% of total profits. Est. $116M catch-up tranche.
            </div>
          </div>

          {/* Step 4: Carried Interest */}
          <div className="animate-mr-fade-in" style={{ animationDelay: '240ms' }}>
            <div className="flex justify-between text-[14px] mb-2">
              <span className="font-bold" style={{ color: 'var(--mr-text)' }}>Step 4: Carried Interest (20/80)</span>
              <span className="tabular-nums font-semibold" style={{ color: '#10B981' }}>Pending</span>
            </div>
            <div className="h-4 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
              <div className="h-full rounded-full" style={{ width: '0%', background: '#10B981' }} />
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--mr-text-faint)' }}>
              All remaining distributions split 20% GP / 80% LP. Est. $1.1B in this tranche.
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Hurdle Rate Mechanics */}
      <SectionCard title="Hurdle Rate Mechanics" meta="European vs American structure">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', animationDelay: '0ms' }}>
            <div className="text-xs font-bold font-semibold mb-2" style={{ color: '#3B82F6' }}>EUROPEAN WATERFALL</div>
            <p className="text-[12px] mb-2" style={{ color: 'var(--mr-text-secondary)' }}>
              GP does not receive ANY carry until ALL called capital is returned AND the 8% preferred return is achieved across the ENTIRE fund.
              This protects LPs from early carry on winners while losers remain unrealized.
            </p>
            <div className="text-xs font-semibold" style={{ color: '#3B82F6' }}>Fund IV uses this structure</div>
          </div>
          <div className="p-4 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in" style={{ background: 'rgba(107,114,128,0.06)', border: '1px solid rgba(107,114,128,0.15)', animationDelay: '80ms' }}>
            <div className="text-xs font-bold font-semibold mb-2" style={{ color: '#6B7280' }}>AMERICAN WATERFALL (Not Used)</div>
            <p className="text-[12px] mb-2" style={{ color: 'var(--mr-text-secondary)' }}>
              GP receives carry deal-by-deal as each investment is realized. More GP-friendly but creates clawback risk
              if early exits perform well but later exits underperform.
            </p>
            <div className="text-xs font-semibold" style={{ color: '#6B7280' }}>Higher clawback risk for LPs</div>
          </div>
        </div>
      </SectionCard>
    </>
  );
}
