'use client';

import { useState } from 'react';
import { VENDOR_REBATES, getRebatePerformance } from '@/data/ridgeline';
import { fmtDollar } from '@/lib/utils';

const totalEarned = VENDOR_REBATES.reduce((s, r) => s + r.earnedRebate, 0);
const totalProjected = VENDOR_REBATES.reduce((s, r) => s + r.projectedRebate, 0);

export default function RebatesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes gaugeArc { from { stroke-dashoffset: 201 } }
        @keyframes tierPulse { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.05) } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
          <span className="text-3xl text-white">&#129534;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#10B981' }}>Act 4 &middot; RevOps Control Plane</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>Vendor Rebates</h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {VENDOR_REBATES.length} programs &middot; YTD: {fmtDollar(totalEarned)} earned &middot; {fmtDollar(totalProjected)} projected
          </p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'YTD Earned', value: fmtDollar(totalEarned), color: '#10B981', icon: '💰' },
          { label: 'Projected FY', value: fmtDollar(totalProjected), color: '#2563EB', icon: '📊' },
          { label: 'Active Programs', value: String(VENDOR_REBATES.filter((r) => r.status === 'active').length), color: '#F59E0B', icon: '⚡' },
        ].map((kpi, i) => (
          <div key={kpi.label} className="rounded-xl border p-5 text-center"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--rl-shadow)', animation: `fadeUp ${0.3 + i * 0.1}s ease-out` }}>
            <div className="text-2xl mb-1">{kpi.icon}</div>
            <div className="text-2xl font-extrabold tabular-nums" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--rl-text-muted)' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Rebate Cards — Interactive */}
      <div className="space-y-4">
        {VENDOR_REBATES.map((rebate, idx) => {
          const perf = getRebatePerformance(rebate.id);
          const progress = (rebate.ytdPurchases / rebate.annualTarget) * 100;
          const isExpanded = expandedId === rebate.id;
          const typeColor = rebate.rebateType === 'volume' ? '#2563EB' : rebate.rebateType === 'growth' ? '#10B981' : '#F59E0B';

          return (
            <button key={rebate.id} onClick={() => setExpandedId(isExpanded ? null : rebate.id)} className="w-full text-left"
              style={{ animation: `fadeUp ${0.4 + idx * 0.1}s ease-out` }}>
              <div className="rounded-xl border p-5 transition-all"
                style={{ background: isExpanded ? `${typeColor}05` : 'var(--rl-card)', borderColor: isExpanded ? typeColor : 'var(--rl-border)', borderLeft: `4px solid ${typeColor}`, boxShadow: 'var(--rl-shadow)', opacity: rebate.status === 'expired' ? 0.6 : 1 }}>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[15px] font-bold" style={{ color: 'var(--rl-text)' }}>{rebate.programName}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: `${typeColor}15`, color: typeColor }}>{rebate.rebateType}</span>
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>
                      {rebate.vendor} &middot; {rebate.category} &middot; {rebate.effectiveStart} to {rebate.effectiveEnd}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold tabular-nums" style={{ color: typeColor }}>{rebate.currentTier}</div>
                    <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>current tier</div>
                  </div>
                </div>

                {/* Tier Progress Bar */}
                <div className="flex gap-1.5 h-8 mb-3">
                  {rebate.tierStructure.map((tier, i) => {
                    const isActive = tier.label === rebate.currentTier;
                    return (
                      <div key={i} className="flex-1 rounded-lg flex flex-col items-center justify-center text-[9px] transition-all"
                        style={{
                          background: isActive ? typeColor : `${typeColor}10`,
                          color: isActive ? 'white' : typeColor,
                          border: isActive ? `2px solid ${typeColor}` : '1px solid transparent',
                          animation: isActive ? 'tierPulse 2s ease-in-out infinite' : 'none',
                        }}>
                        <span className="font-bold">{tier.label}</span>
                        <span>{(tier.rate * 100).toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>

                {/* Progress gauge */}
                <div className="mb-2">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span style={{ color: 'var(--rl-text-muted)' }}>YTD: {fmtDollar(rebate.ytdPurchases)} / {fmtDollar(rebate.annualTarget)}</span>
                    <span className="font-bold" style={{ color: typeColor }}>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(progress, 100)}%`, background: `linear-gradient(90deg, ${typeColor}80, ${typeColor})`, animation: `barReveal 0.8s ease-out ${idx * 0.1}s both` }} />
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 text-[11px]">
                  <div>
                    <span style={{ color: 'var(--rl-text-muted)' }}>Earned: </span>
                    <span className="font-bold" style={{ color: '#10B981' }}>{fmtDollar(rebate.earnedRebate)}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--rl-text-muted)' }}>Projected: </span>
                    <span className="font-bold" style={{ color: '#2563EB' }}>{fmtDollar(rebate.projectedRebate)}</span>
                  </div>
                  {perf && (
                    <div>
                      <span style={{ color: 'var(--rl-text-muted)' }}>Next Tier Gap: </span>
                      <span className="font-bold" style={{ color: '#F59E0B' }}>{fmtDollar(perf.nextTierGap)}</span>
                    </div>
                  )}
                </div>

                {/* Expanded detail */}
                {isExpanded && perf && (
                  <div className="mt-4 pt-4 grid grid-cols-3 gap-4" style={{ borderTop: '1px solid var(--rl-border)', animation: 'fadeUp 0.2s ease-out' }}>
                    <div>
                      <div className="text-[10px] uppercase mb-1" style={{ color: 'var(--rl-text-muted)' }}>Period Earned</div>
                      <div className="text-[14px] font-bold" style={{ color: '#10B981' }}>
                        {fmtDollar(perf.rebateEarned)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase mb-1" style={{ color: 'var(--rl-text-muted)' }}>Current Rate</div>
                      <div className="text-[14px] font-bold" style={{ color: '#2563EB' }}>
                        {(perf.rebateRate * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase mb-1" style={{ color: 'var(--rl-text-muted)' }}>Days Remaining</div>
                      <div className="text-[14px] font-bold" style={{ color: perf.daysRemaining < 60 ? '#F59E0B' : 'var(--rl-text)' }}>
                        {perf.daysRemaining}d
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-[9px] mt-2 text-right" style={{ color: typeColor }}>
                  {isExpanded ? '▲ Less' : '▼ More detail'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
