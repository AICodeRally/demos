'use client';

import { useState } from 'react';
import { StatCard } from '@/components/demos/crestline';
import { CALC_SNAPSHOTS, COLORS } from '@/data/crestline';

const AUDIT_TRAIL = [
  { ts: '2026-03-16 06:00', actor: 'System', action: 'Snapshot frozen', detail: 'PP3 original calculation finalized for Elena Vasquez. Total: $6,430.' },
  { ts: '2026-04-01 06:00', actor: 'System', action: 'Snapshot frozen', detail: 'PP4 calculation finalized for Elena Vasquez. Total: $6,910.' },
  { ts: '2026-04-02 09:15', actor: 'Diana Okafor (Comp Analyst)', action: 'Error detected', detail: 'POS receipt #R-84721 for Burberry Trench Coat ($2,290) was mis-assigned to Home dept instead of Designer Apparel.' },
  { ts: '2026-04-02 10:30', actor: 'Diana Okafor', action: 'Correction initiated', detail: 'Loaded frozen PP3 snapshot. Recalculated with corrected dept assignment.' },
  { ts: '2026-04-02 14:30', actor: 'System', action: 'Corrected snapshot created', detail: 'PP3 CORRECTED snapshot frozen. New total: $6,830. Delta: +$400.' },
  { ts: '2026-04-02 14:35', actor: 'System', action: 'Adjustment generated', detail: '+$400 adjustment queued for PP5 (Apr 1-15) payroll run.' },
  { ts: '2026-04-02 15:00', actor: 'Karen Mitchell (Comp Manager)', action: 'Adjustment approved', detail: 'Retro adjustment of +$400 approved for Elena Vasquez, PP5 payout.' },
];

const REPLAY_STEPS = [
  { label: 'Detect Error', icon: '1', desc: 'Analyst identifies mis-assignment in POS data' },
  { label: 'Load Frozen Snapshot', icon: '2', desc: 'Original immutable PP3 snapshot retrieved' },
  { label: 'Recalculate', icon: '3', desc: 'Engine replays with corrected selling dept data' },
  { label: 'Generate Adjustment', icon: '4', desc: 'Delta computed: $6,830 - $6,430 = +$400' },
  { label: 'Feed to Payroll', icon: '5', desc: '+$400 applied to next open payroll period (PP5)' },
];

function fmtTs(frozenAt: string) {
  const d = new Date(frozenAt);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function RetroCorrections() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const original = CALC_SNAPSHOTS[0];
  const corrected = CALC_SNAPSHOTS[2];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Retro Corrections</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Time-rewind and replay — immutable snapshots make corrections traceable, not destructive
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Snapshots Stored / Year" value="2,400" color={COLORS.standard} />
        <StatCard label="Avg Correction Time" value="4 hrs" trend="down" trendValue="-62%" color="#059669" />
        <StatCard label="Corrections This Quarter" value="18" color={COLORS.accent} />
        <StatCard label="Accuracy Rate" value="99.97%" trend="up" trendValue="+0.03pp" color="#059669" />
      </div>

      {/* Snapshot Viewer */}
      <div className="rounded-xl border bg-white p-5 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: '#0F172A' }}>Snapshot Viewer — Elena Vasquez</h2>
        <p className="text-xs mb-4" style={{ color: '#475569' }}>
          Three immutable snapshots showing original, next period, and corrected calculations
        </p>

        {/* Snapshot tabs */}
        <div className="flex gap-2 mb-4">
          {CALC_SNAPSHOTS.map((snap, i) => {
            const isActive = selectedIdx === i;
            const isCorrected = snap.periodLabel.includes('CORRECTED');
            return (
              <button
                key={snap.periodId + i}
                onClick={() => setSelectedIdx(i)}
                className="rounded-lg px-4 py-2 text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: isActive ? (isCorrected ? '#DCFCE7' : '#DBEAFE') : '#F8FAFC',
                  color: isActive ? (isCorrected ? '#059669' : COLORS.standard) : '#64748B',
                  border: isActive ? `2px solid ${isCorrected ? '#059669' : COLORS.standard}` : '1px solid #E2E8F0',
                }}
              >
                {i === 0 ? 'Original' : i === 1 ? 'Next Period' : 'Corrected'}
                <span className="ml-2 font-mono text-[10px]">({snap.periodLabel})</span>
              </button>
            );
          })}
        </div>

        {/* Selected snapshot detail */}
        {(() => {
          const snap = CALC_SNAPSHOTS[selectedIdx];
          const isCorrected = snap.periodLabel.includes('CORRECTED');
          return (
            <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold" style={{ color: '#0F172A' }}>{snap.repName}</span>
                  <span className="text-xs ml-2" style={{ color: '#475569' }}>{snap.department} | Store {snap.store}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                    style={{ backgroundColor: '#E0E7FF', color: '#4338CA' }}
                  >
                    {snap.achieverTier.toUpperCase()}
                  </span>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                    style={{ backgroundColor: isCorrected ? '#DCFCE7' : '#FEF3C7', color: isCorrected ? '#059669' : '#D97706' }}
                  >
                    Immutable Snapshot
                  </span>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                    <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Component</th>
                    <th className="text-right py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {snap.components.map(c => (
                    <tr key={c.componentId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td className="py-2 text-xs" style={{ color: '#0F172A' }}>{c.label}</td>
                      <td className="py-2 text-xs text-right font-mono font-medium" style={{ color: '#0F172A' }}>${c.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid #E2E8F0' }}>
                    <td className="py-2 text-sm font-bold" style={{ color: '#0F172A' }}>Total</td>
                    <td className="py-2 text-sm font-bold text-right font-mono" style={{ color: '#0F172A' }}>${snap.total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
              <p className="text-[10px] mt-2 font-mono" style={{ color: '#94a3b8' }}>Frozen at: {fmtTs(snap.frozenAt)}</p>
            </div>
          );
        })()}
      </div>

      {/* Diff View: Original vs Corrected */}
      <div className="rounded-xl border bg-white p-5 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: '#0F172A' }}>Diff View — Original vs. Corrected</h2>
        <p className="text-xs mb-4" style={{ color: '#475569' }}>
          Side-by-side comparison showing exactly what changed and why
        </p>

        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
              <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Component</th>
              <th className="text-right py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Original (PP3)</th>
              <th className="text-right py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Corrected (PP3)</th>
              <th className="text-right py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Delta</th>
            </tr>
          </thead>
          <tbody>
            {original.components.map((oc, i) => {
              const cc = corrected.components[i];
              const delta = cc.amount - oc.amount;
              return (
                <tr key={oc.componentId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="py-3 text-xs font-medium" style={{ color: '#0F172A' }}>{oc.label}</td>
                  <td className="py-3 text-xs text-right font-mono" style={{ color: '#64748B' }}>${oc.amount.toLocaleString()}</td>
                  <td className="py-3 text-xs text-right font-mono" style={{ color: '#0F172A' }}>${cc.amount.toLocaleString()}</td>
                  <td className="py-3 text-xs text-right font-mono font-semibold" style={{ color: delta > 0 ? '#059669' : delta < 0 ? '#DC2626' : '#94a3b8' }}>
                    {delta > 0 ? '+' : ''}{delta === 0 ? '—' : `$${delta.toLocaleString()}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid #E2E8F0' }}>
              <td className="py-3 text-sm font-bold" style={{ color: '#0F172A' }}>Total</td>
              <td className="py-3 text-sm font-bold text-right font-mono" style={{ color: '#64748B' }}>${original.total.toLocaleString()}</td>
              <td className="py-3 text-sm font-bold text-right font-mono" style={{ color: '#0F172A' }}>${corrected.total.toLocaleString()}</td>
              <td className="py-3 text-sm font-bold text-right font-mono" style={{ color: '#059669' }}>+${(corrected.total - original.total).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Adjustment Output */}
      <div className="rounded-xl border-2 p-5 mb-8" style={{ borderColor: '#059669', backgroundColor: '#F0FDF4' }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#059669' }}>
            <span className="text-white text-lg font-bold">$</span>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: '#0F172A' }}>Payroll Adjustment Generated</h3>
            <p className="text-xs" style={{ color: '#475569' }}>
              <strong style={{ color: '#059669' }}>+$400</strong> adjustment applied to <strong>PP5 (Apr 1-15)</strong> for Elena Vasquez.
              Original PP3 snapshot preserved. Corrected snapshot created as separate immutable record.
            </p>
          </div>
        </div>
      </div>

      {/* Replay Mechanism */}
      <div className="rounded-xl border bg-white p-5 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: '#0F172A' }}>Replay Mechanism</h2>
        <p className="text-xs mb-5" style={{ color: '#475569' }}>
          The 5-step correction pipeline — errors are detected, snapshots replayed, and adjustments generated automatically
        </p>

        <div className="flex items-start gap-1">
          {REPLAY_STEPS.map((step, i) => (
            <div key={i} className="flex items-start flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white mb-2"
                  style={{ backgroundColor: COLORS.standard }}
                >
                  {step.icon}
                </div>
                <p className="text-xs font-semibold text-center mb-1" style={{ color: '#0F172A' }}>{step.label}</p>
                <p className="text-[10px] text-center px-1" style={{ color: '#475569' }}>{step.desc}</p>
              </div>
              {i < REPLAY_STEPS.length - 1 && (
                <div className="flex items-center pt-3 px-0.5 flex-shrink-0">
                  <div className="w-4 h-0.5" style={{ backgroundColor: '#CBD5E1' }} />
                  <div className="w-0 h-0 border-t-[3px] border-b-[3px] border-l-[5px]" style={{ borderColor: 'transparent transparent transparent #CBD5E1' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="rounded-xl border bg-white p-5 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: '#0F172A' }}>Audit Trail</h2>
        <p className="text-xs mb-4" style={{ color: '#475569' }}>
          Every action timestamped and attributed — complete chain of custody
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5" style={{ backgroundColor: '#E2E8F0' }} />

          <div className="space-y-4">
            {AUDIT_TRAIL.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 pl-1">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 z-10 border-2"
                  style={{
                    backgroundColor: i === AUDIT_TRAIL.length - 1 ? '#059669' : '#FFFFFF',
                    borderColor: i === AUDIT_TRAIL.length - 1 ? '#059669' : '#CBD5E1',
                  }}
                />
                <div className="flex-1 rounded-lg p-3" style={{ backgroundColor: '#F8FAFC' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: '#0F172A' }}>{entry.action}</span>
                    <span className="text-[10px] font-mono" style={{ color: '#94a3b8' }}>{entry.ts}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: '#475569' }}>{entry.detail}</p>
                  <p className="text-[10px] mt-1 font-medium" style={{ color: '#94a3b8' }}>{entry.actor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key callout */}
      <div className="rounded-xl border-2 p-4" style={{ borderColor: COLORS.accent, backgroundColor: '#FFFBEB' }}>
        <p className="text-xs font-semibold" style={{ color: '#0F172A' }}>
          Every calculation is immutable and timestamped. Corrections create new snapshots — originals are never modified.
        </p>
      </div>
    </>
  );
}
