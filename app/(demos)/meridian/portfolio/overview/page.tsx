'use client';

import { ActNavigation, SectionCard, KpiCard, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { PORTFOLIO } from '@/data/meridian';
import { fmt } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  'Exit Ready': '#10B981',
  'Performing': '#3B82F6',
  'Watch': '#F59E0B',
  'Underperforming': '#EF4444',
};

export default function PortfolioOverviewPage() {
  const totalNAV = PORTFOLIO.reduce((s, p) => s + p.currentNAV, 0);
  const totalInvested = PORTFOLIO.reduce((s, p) => s + p.equityInvested, 0);
  const weightedMOIC = totalNAV / totalInvested;
  const totalBoltOns = PORTFOLIO.reduce((s, p) => s + p.boltOns, 0);
  const exitReady = PORTFOLIO.filter((p) => p.status === 'Exit Ready').length;

  return (
    <>
      <ActNavigation currentAct={3} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Portfolio Health', value: `${PORTFOLIO.length} Active`, status: 'green', detail: `${exitReady} exit-ready` },
          { label: 'Value Creation', value: `${weightedMOIC.toFixed(2)}x`, status: 'green', detail: 'Blended gross MOIC' },
          { label: 'Bolt-On Pipeline', value: `${totalBoltOns} Completed`, status: 'green', detail: 'Add-on acquisitions' },
          { label: 'Avg Hold Period', value: '2.4 yrs', status: 'neutral', detail: 'Target 4-6 years' },
        ]}
      />

      <div className="mt-2 mb-6 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#2563EB' }}>
          Act 3 &middot; Portfolio Companies
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Portfolio Overview
        </h1>
        <p className="text-[14px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          {PORTFOLIO.length} platform investments &middot; {totalBoltOns} bolt-on acquisitions
        </p>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Operational Value Creation at Scale"
        insight="Active portfolio management drives EBITDA expansion through procurement leverage, management professionalization, and strategic bolt-on acquisitions. Average EBITDA margin improvement of 340bps across platform investments within 24 months of acquisition."
        accentColor="#2563EB"
        implications={[
          'Exit-ready companies represent $1.2B in potential realizations — timing aligned with favorable M&A and sponsor-to-sponsor market conditions.',
          'Bolt-on strategy accounts for 35% of total value creation — identified pipeline of 8 additional targets across 3 platforms.',
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <KpiCard label="Total NAV" value={`$${(totalNAV / 1e6).toFixed(0)}M`} accent="#D4A847" sub="Current portfolio value" variant="primary" stagger={0} />
        <KpiCard label="Invested" value={`$${(totalInvested / 1e6).toFixed(0)}M`} accent="#3B82F6" sub="Total equity deployed" variant="primary" stagger={1} />
        <KpiCard label="Blended MOIC" value={`${weightedMOIC.toFixed(2)}x`} accent="#10B981" sub="Gross multiple" delta="+0.14x" deltaDirection="up" stagger={2} />
        <KpiCard label="Companies" value={String(PORTFOLIO.length)} accent="#8B5CF6" sub="Platform investments" stagger={3} />
        <KpiCard label="Bolt-Ons" value={String(totalBoltOns)} accent="#F59E0B" sub="Add-on acquisitions" stagger={4} />
      </div>

      {/* Portfolio Grid */}
      <SectionCard title="Portfolio Company Summary" variant="hero" accentColor="#2563EB">
        <div className="space-y-4">
          {PORTFOLIO.map((pc, idx) => (
            <div
              key={pc.id}
              className="rounded-xl border p-5 transition-all hover:shadow-lg animate-mr-fade-in"
              style={{
                borderColor: `${STATUS_COLORS[pc.status]}30`,
                background: 'var(--mr-card-alt)',
                animationDelay: `${idx * 60}ms`,
              }}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[16px] font-bold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>{pc.name}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${STATUS_COLORS[pc.status]}15`, color: STATUS_COLORS[pc.status] }}>
                      {pc.status}
                    </span>
                  </div>
                  <div className="text-[12px]" style={{ color: 'var(--mr-text-muted)' }}>
                    {pc.sector} &middot; Acquired {pc.acquired.slice(0, 7)} &middot; CEO: {pc.ceo} &middot; Board: {pc.boardSeat}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-bold" style={{ color: pc.moic >= 1.5 ? '#10B981' : pc.moic >= 1.2 ? '#3B82F6' : '#F59E0B', fontFamily: 'var(--mr-font)' }}>
                    {pc.moic.toFixed(2)}x
                  </div>
                  <div className="text-[12px]" style={{ color: 'var(--mr-text-faint)' }}>MOIC</div>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-3">
                {[
                  { l: 'Entry EV', v: `$${(pc.entryEV / 1e6).toFixed(0)}M` },
                  { l: 'Current EV', v: `$${(pc.currentEV / 1e6).toFixed(0)}M` },
                  { l: 'EBITDA', v: `$${(pc.currentEbitda / 1e6).toFixed(0)}M` },
                  { l: 'Revenue', v: `$${(pc.currentRevenue / 1e6).toFixed(0)}M` },
                  { l: 'Gross IRR', v: `${(pc.grossIRR * 100).toFixed(0)}%` },
                  { l: 'Bolt-Ons', v: String(pc.boltOns) },
                  { l: 'Employees', v: fmt(pc.employees) },
                ].map((m) => (
                  <div key={m.l} className="text-center p-2 rounded-lg" style={{ background: 'var(--mr-card)' }}>
                    <div className="text-[10px] uppercase tracking-[1px] font-semibold" style={{ color: 'var(--mr-text-faint)' }}>{m.l}</div>
                    <div className="text-[14px] font-bold tabular-nums" style={{ color: 'var(--mr-text)' }}>{m.v}</div>
                  </div>
                ))}
              </div>

              {/* EBITDA growth bar */}
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold" style={{ color: 'var(--mr-text-faint)' }}>EBITDA growth:</span>
                <div className="flex-1 h-2.5 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${Math.min(((pc.currentEbitda / pc.entryEbitda - 1) * 100), 100)}%`,
                    background: pc.currentEbitda / pc.entryEbitda > 1.5 ? '#10B981' : '#3B82F6',
                  }} />
                </div>
                <span className="text-xs font-bold tabular-nums" style={{ color: '#10B981' }}>
                  +{((pc.currentEbitda / pc.entryEbitda - 1) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
