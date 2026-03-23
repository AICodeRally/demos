'use client';

import { VENDOR_REBATES, REBATE_PERFORMANCE, getRebatePerformance } from '@/data/ridgeline';
import { fmtDollar, fmtM } from '@/lib/utils';

const totalEarned = VENDOR_REBATES.reduce((s, r) => s + r.earnedRebate, 0);
const totalProjected = VENDOR_REBATES.reduce((s, r) => s + r.projectedRebate, 0);

export default function RebatesPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
        >
          <span className="text-3xl text-white">&#129534;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#F59E0B' }}>
            Act 4 &middot; RevOps Control Plane
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Vendor Rebates
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            {VENDOR_REBATES.length} active programs &middot; YTD Earned: {fmtDollar(totalEarned)} &middot; Projected: {fmtDollar(totalProjected)}
          </p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'YTD Earned', value: fmtDollar(totalEarned), color: '#10B981' },
          { label: 'Projected FY', value: fmtDollar(totalProjected), color: '#2563EB' },
          { label: 'Active Programs', value: String(VENDOR_REBATES.filter((r) => r.status === 'active').length), color: '#F59E0B' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border p-5 text-center"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--rl-shadow)' }}
          >
            <div className="text-[10px] uppercase tracking-[1.5px] font-semibold mb-2" style={{ color: 'var(--rl-text-muted)' }}>{kpi.label}</div>
            <div className="text-2xl font-extrabold" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Rebate Program Cards */}
      <div className="space-y-4">
        {VENDOR_REBATES.map((rebate) => {
          const perf = getRebatePerformance(rebate.id);
          const progress = (rebate.ytdPurchases / rebate.annualTarget) * 100;
          return (
            <div
              key={rebate.id}
              className="rounded-xl border p-6"
              style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', opacity: rebate.status === 'expired' ? 0.6 : 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[15px] font-bold" style={{ color: 'var(--rl-text)' }}>{rebate.programName}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
                      style={{
                        background: rebate.rebateType === 'volume' ? 'rgba(37,99,235,0.1)' : rebate.rebateType === 'growth' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: rebate.rebateType === 'volume' ? '#2563EB' : rebate.rebateType === 'growth' ? '#10B981' : '#F59E0B',
                      }}
                    >
                      {rebate.rebateType}
                    </span>
                  </div>
                  <div className="text-[12px]" style={{ color: 'var(--rl-text-muted)' }}>
                    {rebate.vendor} &middot; {rebate.category} &middot; {rebate.effectiveStart} to {rebate.effectiveEnd}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Current Tier</div>
                  <div className="text-lg font-bold" style={{ color: '#F59E0B' }}>{rebate.currentTier}</div>
                </div>
              </div>

              {/* Tier Structure */}
              <div className="flex gap-2 h-12 mb-4">
                {rebate.tierStructure.map((tier, i) => {
                  const isActive = tier.label === rebate.currentTier;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded flex flex-col items-center justify-center text-[10px]"
                      style={{
                        background: isActive ? '#1E3A5F' : '#F1F5F9',
                        color: isActive ? 'white' : 'var(--rl-text-muted)',
                        border: isActive ? '2px solid #1E3A5F' : '1px solid var(--rl-border)',
                      }}
                    >
                      <span className="font-bold">{tier.label}</span>
                      <span>{(tier.rate * 100).toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] mb-1">
                  <span style={{ color: 'var(--rl-text-muted)' }}>YTD: {fmtDollar(rebate.ytdPurchases)} / {fmtDollar(rebate.annualTarget)}</span>
                  <span className="font-bold" style={{ color: 'var(--rl-text)' }}>{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(progress, 100)}%`, background: '#1E3A5F' }} />
                </div>
              </div>

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
            </div>
          );
        })}
      </div>
    </>
  );
}
