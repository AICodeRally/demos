'use client';

import { useState } from 'react';
import { StatCard } from '@/components/demos/crestline';
import { CALC_SNAPSHOTS, COLORS } from '@/data/crestline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

/* Monthly correction volume — 6-month history */
const CORRECTIONS_BY_MONTH = [
  { month: 'Oct', count: 12, severity: 'amber' },
  { month: 'Nov', count: 8, severity: 'amber' },
  { month: 'Dec', count: 15, severity: 'amber' },
  { month: 'Jan', count: 22, severity: 'red' },
  { month: 'Feb', count: 10, severity: 'amber' },
  { month: 'Mar', count: 6, severity: 'amber' },
];

/* Waterfall data: original → adjustments → final */
const WATERFALL_DATA = [
  { name: 'Original Calc', value: 4250, cumulative: 4250, fill: '#1a1f3d', base: 0 },
  { name: 'Rate Correction', value: -180, cumulative: 4070, fill: '#DC2626', base: 4070 },
  { name: 'Transfer Adj.', value: 320, cumulative: 4390, fill: '#059669', base: 4070 },
  { name: 'Achiever Reclass.', value: 85, cumulative: 4475, fill: '#059669', base: 4390 },
  { name: 'Final Adjusted', value: 4475, cumulative: 4475, fill: '#c9a84c', base: 0 },
];

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
        <h1 className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>Retro Corrections</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--pl-text-secondary)' }}>
          Time-rewind and replay — immutable snapshots make corrections traceable, not destructive
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Snapshots Stored / Year" value="2,400" color={COLORS.standard} />
        <StatCard label="Avg Correction Time" value="4 hrs" trend="down" trendValue="-62%" color="#059669" />
        <StatCard label="Corrections This Quarter" value="18" color={COLORS.accent} />
        <StatCard label="Accuracy Rate" value="99.97%" trend="up" trendValue="+0.03pp" color="#059669" />
      </div>

      {/* Snapshot Viewer */}
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Snapshot Viewer — Elena Vasquez</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
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
                  backgroundColor: isActive ? (isCorrected ? '#DCFCE7' : '#DBEAFE') : 'var(--pl-bg)',
                  color: isActive ? (isCorrected ? '#059669' : COLORS.standard) : 'var(--pl-text-muted)',
                  border: isActive ? `2px solid ${isCorrected ? '#059669' : COLORS.standard}` : '1px solid var(--pl-border)',
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
            <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--pl-bg)' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold" style={{ color: 'var(--pl-text)' }}>{snap.repName}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--pl-text-secondary)' }}>{snap.department} | Store {snap.store}</span>
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
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--pl-border)' }}>
                    <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Component</th>
                    <th className="text-right py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {snap.components.map(c => (
                    <tr key={c.componentId} style={{ borderBottom: '1px solid var(--pl-stripe)' }}>
                      <td className="py-2 text-xs" style={{ color: 'var(--pl-text)' }}>{c.label}</td>
                      <td className="py-2 text-xs text-right font-mono font-medium" style={{ color: 'var(--pl-text)' }}>${c.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid var(--pl-border)' }}>
                    <td className="py-2 text-sm font-bold" style={{ color: 'var(--pl-text)' }}>Total</td>
                    <td className="py-2 text-sm font-bold text-right font-mono" style={{ color: 'var(--pl-text)' }}>${snap.total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
              </div>
              <p className="text-[10px] mt-2 font-mono" style={{ color: 'var(--pl-text-muted)' }}>Frozen at: {fmtTs(snap.frozenAt)}</p>
            </div>
          );
        })()}
      </div>

      {/* Diff View: Original vs Corrected */}
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Diff View — Original vs. Corrected</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
          Side-by-side comparison showing exactly what changed and why
        </p>

        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--pl-border)' }}>
              <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Component</th>
              <th className="text-right py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Original (PP3)</th>
              <th className="text-right py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Corrected (PP3)</th>
              <th className="text-right py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>Delta</th>
            </tr>
          </thead>
          <tbody>
            {original.components.map((oc, i) => {
              const cc = corrected.components[i];
              const delta = cc.amount - oc.amount;
              return (
                <tr key={oc.componentId} style={{ borderBottom: '1px solid var(--pl-stripe)' }}>
                  <td className="py-3 text-xs font-medium" style={{ color: 'var(--pl-text)' }}>{oc.label}</td>
                  <td className="py-3 text-xs text-right font-mono" style={{ color: 'var(--pl-text-muted)' }}>${oc.amount.toLocaleString()}</td>
                  <td className="py-3 text-xs text-right font-mono" style={{ color: 'var(--pl-text)' }}>${cc.amount.toLocaleString()}</td>
                  <td className="py-3 text-xs text-right font-mono font-semibold" style={{ color: delta > 0 ? '#059669' : delta < 0 ? '#DC2626' : 'var(--pl-text-muted)' }}>
                    {delta > 0 ? '+' : ''}{delta === 0 ? '—' : `$${delta.toLocaleString()}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--pl-border)' }}>
              <td className="py-3 text-sm font-bold" style={{ color: 'var(--pl-text)' }}>Total</td>
              <td className="py-3 text-sm font-bold text-right font-mono" style={{ color: 'var(--pl-text-muted)' }}>${original.total.toLocaleString()}</td>
              <td className="py-3 text-sm font-bold text-right font-mono" style={{ color: 'var(--pl-text)' }}>${corrected.total.toLocaleString()}</td>
              <td className="py-3 text-sm font-bold text-right font-mono" style={{ color: '#059669' }}>+${(corrected.total - original.total).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        </div>
      </div>

      {/* Adjustment Output */}
      <div className="rounded-xl border-2 p-5 mb-8" style={{ borderColor: '#059669', backgroundColor: '#F0FDF4' }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#059669' }}>
            <span className="text-white text-lg font-bold">$</span>
          </div>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--pl-text)' }}>Payroll Adjustment Generated</h3>
            <p className="text-xs" style={{ color: 'var(--pl-text-secondary)' }}>
              <strong style={{ color: '#059669' }}>+$400</strong> adjustment applied to <strong>PP5 (Apr 1-15)</strong> for Elena Vasquez.
              Original PP3 snapshot preserved. Corrected snapshot created as separate immutable record.
            </p>
          </div>
        </div>
      </div>

      {/* Replay Mechanism */}
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Replay Mechanism</h2>
        <p className="text-xs mb-5" style={{ color: 'var(--pl-text-secondary)' }}>
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
                <p className="text-xs font-semibold text-center mb-1" style={{ color: 'var(--pl-text)' }}>{step.label}</p>
                <p className="text-[10px] text-center px-1" style={{ color: 'var(--pl-text-secondary)' }}>{step.desc}</p>
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
      <div className="rounded-xl border p-5 mb-8" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>Audit Trail</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
          Every action timestamped and attributed — complete chain of custody
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5" style={{ backgroundColor: 'var(--pl-border)' }} />

          <div className="space-y-4">
            {AUDIT_TRAIL.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 pl-1">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 z-10 border-2"
                  style={{
                    backgroundColor: i === AUDIT_TRAIL.length - 1 ? '#059669' : 'var(--pl-card)',
                    borderColor: i === AUDIT_TRAIL.length - 1 ? '#059669' : '#CBD5E1',
                  }}
                />
                <div className="flex-1 rounded-lg p-3" style={{ backgroundColor: 'var(--pl-bg)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: 'var(--pl-text)' }}>{entry.action}</span>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{entry.ts}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>{entry.detail}</p>
                  <p className="text-[10px] mt-1 font-medium" style={{ color: 'var(--pl-text-muted)' }}>{entry.actor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Corrections by Month */}
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>
            Corrections by Month
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
            6-month history — January spike from year-end reconciliation
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CORRECTIONS_BY_MONTH} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
              <XAxis dataKey="month" tick={{ fill: 'var(--pl-text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--pl-text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => [v, 'Corrections']} />
              <ReferenceLine y={15} stroke="var(--pl-text-muted)" strokeDasharray="3 3" label={{ value: 'Avg', fill: 'var(--pl-text-muted)', fontSize: 10, position: 'right' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                {CORRECTIONS_BY_MONTH.map((entry, i) => (
                  <Cell key={i} fill={entry.severity === 'red' ? '#DC2626' : '#D97706'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Waterfall Chart — Adjustment Breakdown */}
        <div className="rounded-xl border p-6" style={{ borderColor: 'var(--pl-border)', backgroundColor: 'var(--pl-card)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--pl-text)' }}>
            Adjustment Waterfall
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
            Original calculation through each correction to final adjusted payout
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={WATERFALL_DATA} margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: 'var(--pl-text-muted)', fontSize: 9 }} interval={0} angle={0} />
              <YAxis domain={[0, 5000]} tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(1)}k`} tick={{ fill: 'var(--pl-text-muted)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
                formatter={(v, name) => {
                  if (name === 'base') return [null, null];
                  return [`$${Number(v).toLocaleString()}`, 'Amount'];
                }}
              />
              {/* Invisible base bar for stacking */}
              <Bar dataKey="base" stackId="waterfall" fill="transparent" />
              {/* Visible value bar */}
              <Bar dataKey="value" stackId="waterfall" radius={[4, 4, 0, 0]} barSize={36}>
                {WATERFALL_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#1a1f3d' }} />
              <span className="text-[10px]" style={{ color: 'var(--pl-text-secondary)' }}>Original / Final</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#059669' }} />
              <span className="text-[10px]" style={{ color: 'var(--pl-text-secondary)' }}>Increase</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#DC2626' }} />
              <span className="text-[10px]" style={{ color: 'var(--pl-text-secondary)' }}>Decrease</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key callout */}
      <div className="rounded-xl border-2 p-4" style={{ borderColor: COLORS.accent, backgroundColor: '#FFFBEB' }}>
        <p className="text-xs font-semibold" style={{ color: 'var(--pl-text)' }}>
          Every calculation is immutable and timestamped. Corrections create new snapshots — originals are never modified.
        </p>
      </div>
    </>
  );
}
