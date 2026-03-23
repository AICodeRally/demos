'use client';

import { useState } from 'react';
import { DISPUTES, DISPUTE_METRICS } from '@/data/ridgeline';
import { fmtDollar } from '@/lib/utils';

const statusColors: Record<string, string> = { open: '#F59E0B', under_review: '#2563EB', escalated: '#EF4444', resolved: '#10B981', rejected: '#94A3B8' };
const priorityColors: Record<string, string> = { low: '#94A3B8', medium: '#F59E0B', high: '#EF4444', critical: '#DC2626' };

export default function DisputesPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filterStatus ? DISPUTES.filter((d) => d.status === filterStatus) : DISPUTES;

  // Status distribution for donut
  const statusCounts = Object.entries(
    DISPUTES.reduce<Record<string, number>>((acc, d) => { acc[d.status] = (acc[d.status] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes ringDraw { from { stroke-dashoffset: 201 } }
        @keyframes slideDown { from { max-height: 0; opacity: 0 } to { max-height: 300px; opacity: 1 } }
        @keyframes pulseRed { 0%, 100% { box-shadow: 0 0 6px rgba(239,68,68,0.2) } 50% { box-shadow: 0 0 16px rgba(239,68,68,0.4) } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
        >
          <span className="text-3xl text-white">&#128172;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#F59E0B' }}>
            Act 4 &middot; RevOps Control Plane
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>Disputes & Inquiries</h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            SLA: {DISPUTE_METRICS.slaCompliance}% &middot; Avg Resolution: {DISPUTE_METRICS.avgResolutionDays} days &middot; Click cards for detail
          </p>
        </div>
      </div>

      {/* KPI + Donut Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Open', value: String(DISPUTE_METRICS.totalOpen), color: '#F59E0B', icon: '⏳' },
            { label: 'Resolved', value: String(DISPUTE_METRICS.totalResolved), color: '#10B981', icon: '✅' },
            { label: 'Total Disputed', value: fmtDollar(DISPUTE_METRICS.totalDisputedAmount), color: '#EF4444', icon: '💰' },
            { label: 'SLA Compliance', value: `${DISPUTE_METRICS.slaCompliance}%`, color: DISPUTE_METRICS.slaCompliance >= 90 ? '#10B981' : '#F59E0B', icon: '📋' },
          ].map((kpi, i) => (
            <div
              key={kpi.label}
              className="rounded-xl border p-4 text-center"
              style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--rl-shadow)', animation: `fadeUp ${0.3 + i * 0.1}s ease-out` }}
            >
              <div className="text-xl mb-1">{kpi.icon}</div>
              <div className="text-2xl font-extrabold tabular-nums" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--rl-text-muted)' }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Status Donut */}
        <div className="rounded-xl border p-4 flex flex-col items-center justify-center" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.5s ease-out' }}>
          <svg viewBox="0 0 100 100" className="w-36 h-36">
            {(() => {
              const r = 32; const circ = 2 * Math.PI * r;
              let offset = 0;
              return statusCounts.map(([status, count], i) => {
                const pct = count / DISPUTES.length;
                const segment = pct * circ;
                const el = (
                  <circle key={status} cx="50" cy="50" r={r} fill="none"
                    stroke={statusColors[status] || '#94A3B8'} strokeWidth="10"
                    strokeDasharray={`${segment} ${circ - segment}`} strokeDashoffset={-offset}
                    strokeLinecap="round" transform="rotate(-90 50 50)"
                    style={{ cursor: 'pointer', animation: `ringDraw 0.8s ease-out ${i * 0.15}s both` }}
                    onClick={() => setFilterStatus(filterStatus === status ? null : status)} />
                );
                offset += segment;
                return el;
              });
            })()}
            <text x="50" y="48" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--rl-text)">{DISPUTES.length}</text>
            <text x="50" y="58" textAnchor="middle" fontSize="4.5" fill="var(--rl-text-muted)">total</text>
          </svg>
          <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
            {statusCounts.map(([status, count]) => (
              <button key={status} onClick={() => setFilterStatus(filterStatus === status ? null : status)}
                className="text-[8px] font-bold px-1.5 py-0.5 rounded-full transition-all"
                style={{ background: filterStatus === status ? statusColors[status] : `${statusColors[status] || '#94A3B8'}15`, color: filterStatus === status ? 'white' : statusColors[status] || '#94A3B8' }}>
                {status.replace(/_/g, ' ')} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* By Type — Animated Bars */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.6s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Disputes by Type
        </div>
        <div className="space-y-2">
          {DISPUTE_METRICS.byType.map((t, i) => (
            <div key={t.type} className="flex items-center gap-3" style={{ animation: `fadeUp ${0.4 + i * 0.08}s ease-out` }}>
              <div className="w-40 text-[12px] font-semibold capitalize" style={{ color: 'var(--rl-text)' }}>
                {t.type.replace(/_/g, ' ')}
              </div>
              <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                <div className="h-full rounded-lg flex items-center px-2"
                  style={{ width: `${(t.count / DISPUTES.length) * 100}%`, background: 'linear-gradient(90deg, #F59E0B80, #F59E0B)', minWidth: '40px', animation: `barReveal 0.6s ease-out ${i * 0.1}s both` }}>
                  <span className="text-[10px] font-bold text-white">{t.count}</span>
                </div>
              </div>
              <div className="w-20 text-right text-[12px] tabular-nums font-bold" style={{ color: '#EF4444' }}>
                {fmtDollar(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispute Stream — Interactive Cards */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.7s ease-out' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] uppercase tracking-[1.5px] font-semibold" style={{ color: 'var(--rl-text-muted)' }}>
            {filterStatus ? `Showing: ${filterStatus.replace(/_/g, ' ')}` : 'All Disputes'} ({filtered.length})
          </div>
          {filterStatus && (
            <button onClick={() => setFilterStatus(null)} className="text-[10px] font-bold px-2 py-1 rounded-lg border" style={{ color: '#F59E0B', borderColor: '#F59E0B40' }}>
              Clear Filter
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filtered.map((d, i) => {
            const isExpanded = expandedId === d.id;
            const sColor = statusColors[d.status] || '#94A3B8';
            const pColor = priorityColors[d.priority] || '#94A3B8';

            return (
              <button
                key={d.id}
                onClick={() => setExpandedId(isExpanded ? null : d.id)}
                className="w-full text-left"
              >
                <div
                  className="rounded-xl border p-4 transition-all"
                  style={{
                    borderColor: isExpanded ? sColor : 'var(--rl-border)',
                    borderLeft: `4px solid ${sColor}`,
                    background: isExpanded ? `${sColor}05` : 'transparent',
                    animation: `fadeUp ${0.3 + i * 0.05}s ease-out`,
                    ...(d.priority === 'critical' ? { animation: 'pulseRed 2s ease-in-out infinite' } : {}),
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${sColor}15`, color: sColor }}>
                        {d.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${pColor}15`, color: pColor }}>
                        {d.priority}
                      </span>
                      <span className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{d.repName}</span>
                    </div>
                    <div className="text-[16px] font-extrabold tabular-nums" style={{ color: d.amount > 0 ? '#EF4444' : 'var(--rl-text-muted)' }}>
                      {d.amount > 0 ? fmtDollar(d.amount) : '$0'}
                    </div>
                  </div>

                  <div className="text-[11px] capitalize" style={{ color: 'var(--rl-text-muted)' }}>
                    {d.type.replace(/_/g, ' ')} &middot; {d.id} &middot; {d.submittedDate}
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--rl-border)', animation: 'fadeUp 0.2s ease-out' }}>
                      <p className="text-[12px] leading-relaxed mb-2" style={{ color: 'var(--rl-text-muted)' }}>{d.description}</p>
                      <div className="flex gap-4 text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>
                        <span>Assigned: <strong>{d.assignedTo}</strong></span>
                        {d.resolvedDate && <span>Resolved: {d.resolvedDate}</span>}
                      </div>
                      {d.resolution && (
                        <div className="mt-2 rounded-lg p-2 text-[11px]" style={{ background: 'rgba(16,185,129,0.06)', color: '#059669' }}>
                          <strong>Resolution:</strong> {d.resolution}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
