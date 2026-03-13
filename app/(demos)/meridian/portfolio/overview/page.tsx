'use client';

import { ActNavigation, SectionCard, KpiCard } from '@/components/demos/meridian';
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

  return (
    <>
      <ActNavigation currentAct={3} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
          Act 3 &middot; Portfolio Companies
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Portfolio Overview
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          {PORTFOLIO.length} platform investments &middot; {totalBoltOns} bolt-on acquisitions
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-8">
        <KpiCard label="Total NAV" value={`$${(totalNAV / 1e6).toFixed(0)}M`} accent="#D4A847" sub="Current portfolio value" stagger={0} />
        <KpiCard label="Invested" value={`$${(totalInvested / 1e6).toFixed(0)}M`} accent="#3B82F6" sub="Total equity deployed" stagger={1} />
        <KpiCard label="Blended MOIC" value={`${weightedMOIC.toFixed(2)}x`} accent="#10B981" sub="Gross multiple" stagger={2} />
        <KpiCard label="Companies" value={String(PORTFOLIO.length)} accent="#8B5CF6" sub="Platform investments" stagger={3} />
        <KpiCard label="Bolt-Ons" value={String(totalBoltOns)} accent="#F59E0B" sub="Add-on acquisitions" stagger={4} />
      </div>

      {/* Portfolio Grid */}
      <SectionCard title="Portfolio Company Summary">
        <div className="space-y-3">
          {PORTFOLIO.map((pc) => (
            <div key={pc.id} className="rounded-lg border p-4" style={{ borderColor: 'var(--mr-border)', background: 'var(--mr-card-alt)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[15px] font-bold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>{pc.name}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${STATUS_COLORS[pc.status]}15`, color: STATUS_COLORS[pc.status] }}>
                      {pc.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--mr-text-muted)' }}>
                    {pc.sector} &middot; Acquired {pc.acquired.slice(0, 7)} &middot; CEO: {pc.ceo} &middot; Board: {pc.boardSeat}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono" style={{ color: pc.moic >= 1.5 ? '#10B981' : pc.moic >= 1.2 ? '#3B82F6' : '#F59E0B' }}>
                    {pc.moic.toFixed(2)}x
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>MOIC</div>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {[
                  { l: 'Entry EV', v: `$${(pc.entryEV / 1e6).toFixed(0)}M` },
                  { l: 'Current EV', v: `$${(pc.currentEV / 1e6).toFixed(0)}M` },
                  { l: 'EBITDA', v: `$${(pc.currentEbitda / 1e6).toFixed(0)}M` },
                  { l: 'Revenue', v: `$${(pc.currentRevenue / 1e6).toFixed(0)}M` },
                  { l: 'Gross IRR', v: `${(pc.grossIRR * 100).toFixed(0)}%` },
                  { l: 'Bolt-Ons', v: String(pc.boltOns) },
                  { l: 'Employees', v: fmt(pc.employees) },
                ].map((m) => (
                  <div key={m.l} className="text-center">
                    <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>{m.l}</div>
                    <div className="text-sm font-bold font-mono" style={{ color: 'var(--mr-text)' }}>{m.v}</div>
                  </div>
                ))}
              </div>

              {/* EBITDA growth bar */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>EBITDA growth:</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${Math.min(((pc.currentEbitda / pc.entryEbitda - 1) * 100), 100)}%`,
                    background: pc.currentEbitda / pc.entryEbitda > 1.5 ? '#10B981' : '#3B82F6',
                  }} />
                </div>
                <span className="text-xs font-bold font-mono" style={{ color: '#10B981' }}>
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
