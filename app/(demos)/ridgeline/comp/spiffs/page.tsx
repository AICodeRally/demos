'use client';

import { useState } from 'react';
import { SPIFF_PROGRAMS } from '@/data/ridgeline';
import { fmtDollar } from '@/lib/utils';

const statusColors: Record<string, string> = { active: '#10B981', upcoming: '#2563EB', expired: '#94A3B8' };
const statusIcons: Record<string, string> = { active: '⚡', upcoming: '🚀', expired: '⏸' };

export default function SpiffsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [expandedSpiff, setExpandedSpiff] = useState<string | null>(null);

  const filtered = selectedStatus ? SPIFF_PROGRAMS.filter((s) => s.status === selectedStatus) : SPIFF_PROGRAMS;

  const totalBudget = SPIFF_PROGRAMS.reduce((s, sp) => s + sp.totalBudget, 0);
  const totalUtilized = SPIFF_PROGRAMS.reduce((s, sp) => s + sp.utilized, 0);
  const activeCount = SPIFF_PROGRAMS.filter((s) => s.status === 'active').length;
  const upcomingCount = SPIFF_PROGRAMS.filter((s) => s.status === 'upcoming').length;

  // Timeline range: earliest start to latest end
  const allDates = SPIFF_PROGRAMS.flatMap((s) => [new Date(s.startDate).getTime(), new Date(s.endDate).getTime()]);
  const timeMin = Math.min(...allDates);
  const timeMax = Math.max(...allDates);
  const timeRange = timeMax - timeMin || 1;
  const dateToX = (d: string) => ((new Date(d).getTime() - timeMin) / timeRange) * 100;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes gaugeArc { from { stroke-dashoffset: 220 } }
        @keyframes timelineBar { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 8px rgba(16,185,129,0.2) } 50% { box-shadow: 0 0 20px rgba(16,185,129,0.4) } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
        >
          <span className="text-3xl text-white">&#9889;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#F59E0B' }}>
            Act 3 &middot; Sales Comp & Incentives
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            SPIFFs & Promotions
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Vendor-funded incentive programs &middot; {fmtDollar(totalBudget)} total budget
          </p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Programs', value: activeCount, color: '#10B981', icon: '⚡' },
          { label: 'Total Budget', value: fmtDollar(totalBudget), color: '#2563EB', icon: '💰' },
          { label: 'Utilized', value: fmtDollar(totalUtilized), color: '#F59E0B', icon: '📊' },
          { label: 'Upcoming', value: upcomingCount, color: '#7C3AED', icon: '🚀' },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            className="rounded-xl border p-4 text-center"
            style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--rl-shadow)', animation: `fadeUp ${0.3 + i * 0.1}s ease-out` }}
          >
            <div className="text-2xl mb-1">{kpi.icon}</div>
            <div className="text-2xl font-extrabold tabular-nums" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--rl-text-muted)' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Timeline Swim Lanes */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.5s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-5" style={{ color: 'var(--rl-text-muted)' }}>
          Program Timeline — Click to expand
        </div>

        <div className="space-y-3">
          {SPIFF_PROGRAMS.map((spiff, idx) => {
            const color = statusColors[spiff.status];
            const startX = dateToX(spiff.startDate);
            const endX = dateToX(spiff.endDate);
            const utilPct = spiff.totalBudget > 0 ? (spiff.utilized / spiff.totalBudget) * 100 : 0;
            const isExpanded = expandedSpiff === spiff.id;

            return (
              <div key={spiff.id} style={{ animation: `fadeUp ${0.4 + idx * 0.1}s ease-out` }}>
                <button
                  onClick={() => setExpandedSpiff(isExpanded ? null : spiff.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg">{statusIcons[spiff.status]}</span>
                    <span className="text-[12px] font-bold" style={{ color: 'var(--rl-text)' }}>{spiff.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto" style={{ background: `${color}15`, color }}>{spiff.status}</span>
                  </div>

                  {/* Timeline bar */}
                  <div className="relative h-8 rounded-lg overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                    <div
                      className="absolute top-1 bottom-1 rounded-md flex items-center justify-center"
                      style={{
                        left: `${startX}%`,
                        width: `${endX - startX}%`,
                        background: `linear-gradient(90deg, ${color}60, ${color})`,
                        transformOrigin: 'left',
                        animation: `timelineBar 0.8s ease-out ${idx * 0.15}s both`,
                      }}
                    >
                      <span className="text-[9px] font-bold text-white px-1 truncate">
                        {spiff.vendor} &middot; ${spiff.payoutPerUnit}/{spiff.unitType}
                      </span>
                    </div>

                    {/* Utilization overlay within the bar */}
                    {spiff.utilized > 0 && (
                      <div
                        className="absolute top-1 bottom-1 rounded-md"
                        style={{
                          left: `${startX}%`,
                          width: `${(endX - startX) * (utilPct / 100)}%`,
                          background: `${color}`,
                          opacity: 0.4,
                        }}
                      />
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div
                    className="mt-3 ml-8 rounded-xl border p-5 grid grid-cols-[160px_1fr] gap-6"
                    style={{ background: `${color}08`, borderColor: `${color}30`, animation: 'fadeUp 0.3s ease-out' }}
                  >
                    {/* Circular Gauge */}
                    <div className="flex flex-col items-center">
                      <svg viewBox="0 0 100 100" className="w-36 h-36">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="var(--rl-border)" strokeWidth="8" strokeDasharray="220 40" strokeLinecap="round" transform="rotate(135 50 50)" />
                        <circle
                          cx="50" cy="50" r="38" fill="none"
                          stroke={utilPct > 80 ? '#EF4444' : utilPct > 50 ? '#F59E0B' : '#10B981'}
                          strokeWidth="8"
                          strokeDasharray={`${(utilPct / 100) * 220} ${260 - (utilPct / 100) * 220}`}
                          strokeLinecap="round"
                          transform="rotate(135 50 50)"
                          style={{ animation: `gaugeArc 1s ease-out both` }}
                        />
                        <text x="50" y="46" textAnchor="middle" fontSize="14" fontWeight="800" fill={color}>
                          {utilPct.toFixed(0)}%
                        </text>
                        <text x="50" y="58" textAnchor="middle" fontSize="5" fill="var(--rl-text-muted)">
                          budget used
                        </text>
                      </svg>
                    </div>

                    {/* Detail grid */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Vendor</div>
                          <div className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{spiff.vendor}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Category</div>
                          <div className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{spiff.productCategory}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Payout</div>
                          <div className="text-[13px] font-bold" style={{ color }}>${spiff.payoutPerUnit.toFixed(2)} / {spiff.unitType}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Total Budget</div>
                          <div className="text-[16px] font-extrabold tabular-nums" style={{ color: 'var(--rl-text)' }}>{fmtDollar(spiff.totalBudget)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Utilized</div>
                          <div className="text-[16px] font-extrabold tabular-nums" style={{ color: '#F59E0B' }}>{fmtDollar(spiff.utilized)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase" style={{ color: 'var(--rl-text-muted)' }}>Remaining</div>
                          <div className="text-[16px] font-extrabold tabular-nums" style={{ color: '#10B981' }}>{fmtDollar(spiff.totalBudget - spiff.utilized)}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase mb-1" style={{ color: 'var(--rl-text-muted)' }}>Eligible Roles</div>
                        <div className="flex gap-1.5">
                          {spiff.eligibleRoles.map((role) => (
                            <span key={role} className="text-[10px] font-bold px-2 py-1 rounded-lg text-white" style={{ background: color }}>
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                        {spiff.startDate} &mdash; {spiff.endDate}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Timeline axis */}
        <div className="flex justify-between mt-3 text-[9px] tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>
          <span>Jan 2026</span>
          <span>Apr 2026</span>
          <span>Jul 2026</span>
          <span>Sep 2026</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-4" style={{ animation: 'fadeUp 0.7s ease-out' }}>
        <button
          onClick={() => setSelectedStatus(null)}
          className="text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all"
          style={{
            background: selectedStatus === null ? 'var(--rl-text)' : 'transparent',
            color: selectedStatus === null ? 'white' : 'var(--rl-text-muted)',
            borderColor: selectedStatus === null ? 'var(--rl-text)' : 'var(--rl-border)',
          }}
        >
          All ({SPIFF_PROGRAMS.length})
        </button>
        {['active', 'upcoming', 'expired'].map((status) => {
          const count = SPIFF_PROGRAMS.filter((s) => s.status === status).length;
          const color = statusColors[status];
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all"
              style={{
                background: selectedStatus === status ? color : 'transparent',
                color: selectedStatus === status ? 'white' : color,
                borderColor: selectedStatus === status ? color : `${color}40`,
              }}
            >
              {statusIcons[status]} {status} ({count})
            </button>
          );
        })}
      </div>
    </>
  );
}
