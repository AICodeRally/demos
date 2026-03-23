'use client';

import { SPIFF_PROGRAMS } from '@/data/ridgeline';
import { fmtDollar, fmt } from '@/lib/utils';

const statusColors: Record<string, string> = {
  active: '#10B981',
  upcoming: '#2563EB',
  expired: '#94A3B8',
};

export default function SpiffsPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
        >
          <span className="text-3xl text-white">&#9889;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#10B981' }}>
            Act 3 &middot; Sales Comp & Incentives
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            SPIFFs & Promotions
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Vendor-funded incentive programs &middot; {SPIFF_PROGRAMS.length} programs
          </p>
        </div>
      </div>

      {/* SPIFF Cards */}
      <div className="space-y-4">
        {SPIFF_PROGRAMS.map((spiff) => {
          const utilPct = spiff.totalBudget > 0 ? ((spiff.utilized / spiff.totalBudget) * 100).toFixed(1) : '0';
          return (
            <div
              key={spiff.id}
              className="rounded-xl border p-6"
              style={{
                background: 'var(--rl-card)',
                borderColor: 'var(--rl-border)',
                boxShadow: 'var(--rl-shadow)',
                opacity: spiff.status === 'expired' ? 0.6 : 1,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${statusColors[spiff.status]}15`, color: statusColors[spiff.status] }}
                    >
                      {spiff.status}
                    </span>
                    <h3 className="text-[15px] font-bold" style={{ color: 'var(--rl-text)' }}>{spiff.name}</h3>
                  </div>
                  <div className="text-[12px] mt-1" style={{ color: 'var(--rl-text-muted)' }}>
                    {spiff.vendor} &middot; {spiff.productCategory} &middot; {spiff.startDate} to {spiff.endDate}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Payout</div>
                  <div className="text-xl font-extrabold" style={{ color: '#10B981' }}>
                    ${spiff.payoutPerUnit.toFixed(2)}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>per {spiff.unitType}</div>
                </div>
              </div>

              {/* Budget + Utilization */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Total Budget</div>
                  <div className="text-lg font-bold" style={{ color: 'var(--rl-text)' }}>{fmtDollar(spiff.totalBudget)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Utilized</div>
                  <div className="text-lg font-bold" style={{ color: '#F59E0B' }}>{fmtDollar(spiff.utilized)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Remaining</div>
                  <div className="text-lg font-bold" style={{ color: '#2563EB' }}>{fmtDollar(spiff.totalBudget - spiff.utilized)}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] mb-1">
                  <span style={{ color: 'var(--rl-text-muted)' }}>Budget Utilization</span>
                  <span className="font-bold" style={{ color: 'var(--rl-text)' }}>{utilPct}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${utilPct}%`, background: parseFloat(utilPct) > 80 ? '#EF4444' : parseFloat(utilPct) > 50 ? '#F59E0B' : '#10B981' }}
                  />
                </div>
              </div>

              {/* Eligible Roles */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Eligible:</span>
                {spiff.eligibleRoles.map((role) => (
                  <span
                    key={role}
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                    style={{ background: '#1E3A5F' }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
