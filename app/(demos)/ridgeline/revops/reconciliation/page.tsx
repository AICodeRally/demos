'use client';

import { useState } from 'react';
import { fmtDollar, fmt } from '@/lib/utils';

const RECONCILIATION_STATUS = {
  lastRun: '2026-03-23T06:00:00Z',
  status: 'completed',
  transactionsProcessed: 14820,
  transactionsMatched: 14573,
  transactionsUnmatched: 247,
  matchRate: 98.3,
  accrualVariance: -42000,
  payoutsReconciled: 847,
  exceptionsFound: 12,
};

const VARIANCE_ITEMS = [
  { category: 'Commission Underpayment', count: 4, amount: 18200, direction: 'underpaid', status: 'pending_correction', severity: 'high' },
  { category: 'Return Clawback Excess', count: 2, amount: 15600, direction: 'overpaid', status: 'under_review', severity: 'medium' },
  { category: 'SPIFF Miscategorization', count: 3, amount: 7800, direction: 'underpaid', status: 'corrected', severity: 'low' },
  { category: 'Territory Credit Mismatch', count: 2, amount: 12400, direction: 'misattributed', status: 'pending_correction', severity: 'high' },
  { category: 'Data Feed Timing Gap', count: 1, amount: 8200, direction: 'delayed', status: 'resolved', severity: 'low' },
];

const RECONCILIATION_STEPS = [
  { step: 1, name: 'Transaction Ingestion', desc: 'ERP → Legacy ICM feed validated', status: 'complete', records: '14,820', time: '12m', icon: '📥' },
  { step: 2, name: 'Territory Resolution', desc: 'Match transactions to territories', status: 'complete', records: '14,573', time: '8m', icon: '🗺️' },
  { step: 3, name: 'Commission Calculation', desc: 'Apply plans, tiers, SPIFFs', status: 'complete', records: '847 reps', time: '15m', icon: '🧮' },
  { step: 4, name: 'Accrual Comparison', desc: 'Expected vs actual variance', status: 'complete', records: '$42K var', time: '3m', icon: '📊' },
  { step: 5, name: 'Exception Detection', desc: 'Flag outliers for review', status: 'complete', records: '12 flags', time: '2m', icon: '🚨' },
  { step: 6, name: 'Approval Routing', desc: 'Route to comp manager', status: 'in_progress', records: '3 pending', time: 'N/A', icon: '✍️' },
];

const sevColors: Record<string, string> = { low: '#10B981', medium: '#F59E0B', high: '#EF4444' };

export default function ReconciliationPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const matchPct = RECONCILIATION_STATUS.matchRate;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes pipelineFlow { from { opacity: 0; transform: translateX(-20px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes gaugeArc { from { stroke-dashoffset: 201 } }
        @keyframes connectorDraw { from { width: 0 } }
        @keyframes checkPop { from { transform: scale(0); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes pulseAmber { 0%, 100% { box-shadow: 0 0 6px rgba(245,158,11,0.2) } 50% { box-shadow: 0 0 16px rgba(245,158,11,0.4) } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
          <span className="text-3xl text-white">&#9989;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#2563EB' }}>Act 4 &middot; RevOps Control Plane</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>Reconciliation</h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Transaction-to-payout pipeline &middot; Match rate: {matchPct}% &middot; Last run: {new Date(RECONCILIATION_STATUS.lastRun).toLocaleString()}
          </p>
        </div>
      </div>

      {/* KPI + Match Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Processed', value: fmt(RECONCILIATION_STATUS.transactionsProcessed), color: '#1E3A5F', icon: '📥' },
            { label: 'Matched', value: fmt(RECONCILIATION_STATUS.transactionsMatched), color: '#10B981', icon: '✅' },
            { label: 'Exceptions', value: String(RECONCILIATION_STATUS.exceptionsFound), color: '#F59E0B', icon: '⚠️' },
            { label: 'Accrual Variance', value: fmtDollar(Math.abs(RECONCILIATION_STATUS.accrualVariance)), color: '#EF4444', icon: '📉' },
          ].map((kpi, i) => (
            <div key={kpi.label} className="rounded-xl border p-4 text-center"
              style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', borderTop: `3px solid ${kpi.color}`, boxShadow: 'var(--rl-shadow)', animation: `fadeUp ${0.3 + i * 0.1}s ease-out` }}>
              <div className="text-xl mb-1">{kpi.icon}</div>
              <div className="text-xl font-extrabold tabular-nums" style={{ color: kpi.color }}>{kpi.value}</div>
              <div className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--rl-text-muted)' }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Match Rate Gauge */}
        <div className="rounded-xl border p-4 flex flex-col items-center justify-center"
          style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.5s ease-out' }}>
          <svg viewBox="0 0 100 60" className="w-40">
            <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="var(--rl-border)" strokeWidth="6" strokeLinecap="round" />
            <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none"
              stroke={matchPct >= 98 ? '#10B981' : matchPct >= 95 ? '#F59E0B' : '#EF4444'}
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${(matchPct / 100) * 126} 126`}
              style={{ animation: 'gaugeArc 1s ease-out both' }} />
            <text x="50" y="48" textAnchor="middle" fontSize="14" fontWeight="800" fill={matchPct >= 98 ? '#10B981' : '#F59E0B'}>
              {matchPct}%
            </text>
            <text x="50" y="58" textAnchor="middle" fontSize="4.5" fill="var(--rl-text-muted)">match rate</text>
          </svg>
        </div>
      </div>

      {/* Pipeline — Visual Flow */}
      <div className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.6s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-5" style={{ color: 'var(--rl-text-muted)' }}>
          Reconciliation Pipeline
        </div>

        <div className="space-y-0">
          {RECONCILIATION_STEPS.map((step, idx) => {
            const isComplete = step.status === 'complete';
            const color = isComplete ? '#10B981' : '#F59E0B';

            return (
              <div key={step.step} style={{ animation: `pipelineFlow ${0.3 + idx * 0.1}s ease-out` }}>
                {/* Connector */}
                {idx > 0 && (
                  <div className="flex items-center ml-6 my-0">
                    <div className="w-0.5 h-4" style={{ background: isComplete ? '#10B98140' : '#F59E0B40' }} />
                  </div>
                )}

                <button
                  onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-4 rounded-xl border p-3 transition-all"
                    style={{
                      borderColor: expandedStep === step.step ? color : 'var(--rl-border)',
                      borderLeft: `4px solid ${color}`,
                      animation: !isComplete ? 'pulseAmber 2s ease-in-out infinite' : 'none',
                    }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                      style={{ background: isComplete ? '#10B98115' : '#F59E0B15', animation: `checkPop 0.3s ease-out ${idx * 0.1}s both` }}>
                      {isComplete ? '✅' : step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{step.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: `${color}15`, color }}>{isComplete ? 'complete' : 'in progress'}</span>
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--rl-text-muted)' }}>{step.desc}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--rl-text)' }}>{step.records}</div>
                      <div className="text-[10px] tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>{step.time}</div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Variance Items — Visual Cards */}
      <div className="rounded-xl border p-6"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.8s ease-out' }}>
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Variance Detail — {VARIANCE_ITEMS.length} items &middot; {fmtDollar(VARIANCE_ITEMS.reduce((s, v) => s + v.amount, 0))} total
        </div>

        <div className="space-y-3">
          {VARIANCE_ITEMS.map((v, i) => {
            const sColor = sevColors[v.severity] || '#94A3B8';
            const resolved = v.status === 'corrected' || v.status === 'resolved';

            return (
              <div key={v.category} className="rounded-xl border p-4 flex items-center gap-4"
                style={{ borderColor: 'var(--rl-border)', borderLeft: `4px solid ${sColor}`, opacity: resolved ? 0.7 : 1, animation: `fadeUp ${0.5 + i * 0.08}s ease-out` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                  style={{ background: sColor }}>
                  {v.count}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{v.category}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize"
                      style={{ background: resolved ? '#10B98115' : '#F59E0B15', color: resolved ? '#10B981' : '#F59E0B' }}>
                      {v.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] capitalize" style={{ color: 'var(--rl-text-muted)' }}>
                    Direction: {v.direction}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[16px] font-extrabold tabular-nums" style={{ color: '#EF4444' }}>{fmtDollar(v.amount)}</div>
                  <div className="text-[10px]" style={{ color: 'var(--rl-text-muted)' }}>{v.severity} severity</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
