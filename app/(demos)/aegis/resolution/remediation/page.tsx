'use client';

import { StatCard, BarChart, ConfidenceBand } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const WORKSTREAMS = [
  { name: 'Patch Critical Systems', pct: 80, start: 'Mar 2', end: 'Mar 8', owner: 'Marcus Webb' },
  { name: 'Upgrade Encryption', pct: 45, start: 'Mar 3', end: 'Mar 15', owner: 'Raj Patel' },
  { name: 'Retrain Staff (Security)', pct: 20, start: 'Mar 5', end: 'Mar 20', owner: 'Emily Nakamura' },
  { name: 'Revise Data Policies', pct: 60, start: 'Mar 2', end: 'Mar 12', owner: 'James Park' },
  { name: 'Deploy New Monitoring', pct: 35, start: 'Mar 4', end: 'Mar 18', owner: 'Marcus Webb' },
  { name: 'Customer Credit Monitoring', pct: 90, start: 'Mar 2', end: 'Mar 5', owner: 'Diana Torres' },
  { name: 'Insurance Documentation', pct: 70, start: 'Mar 2', end: 'Mar 10', owner: 'Sarah Chen' },
  { name: 'Board Governance Update', pct: 10, start: 'Mar 8', end: 'Mar 22', owner: 'Sarah Chen' },
];

const BAR_DATA = [...WORKSTREAMS]
  .sort((a, b) => b.pct - a.pct)
  .map((w) => ({ label: w.name, value: w.pct }));

const CONFIDENCE_DATA = [
  { label: 'M1', value: 30, low: 8, high: 55 },
  { label: 'M2', value: 28, low: 7, high: 52 },
  { label: 'M3', value: 32, low: 9, high: 58 },
  { label: 'M4', value: 29, low: 8, high: 54 },
  { label: 'M5', value: 27, low: 7, high: 50 },
  { label: 'M6', value: 31, low: 8, high: 56 },
  { label: 'M7', value: 26, low: 6, high: 48 },
  { label: 'M8', value: 30, low: 7, high: 55 },
  { label: 'M9', value: 28, low: 6, high: 52 },
  { label: 'M10', value: 25, low: 5, high: 50 },
  { label: 'M11', value: 29, low: 7, high: 53 },
  { label: 'M12', value: 27, low: 6, high: 50 },
];

const ACCOUNTABILITY = [
  { workstream: 'Patch Critical Systems', owner: 'Marcus Webb', deadline: 'Mar 8', status: 'On Track', statusColor: '#2563EB' },
  { workstream: 'Upgrade Encryption', owner: 'Raj Patel', deadline: 'Mar 15', status: 'On Track', statusColor: '#2563EB' },
  { workstream: 'Retrain Staff (Security)', owner: 'Emily Nakamura', deadline: 'Mar 20', status: 'Not Started', statusColor: '#A8A29E' },
  { workstream: 'Revise Data Policies', owner: 'James Park', deadline: 'Mar 12', status: 'On Track', statusColor: '#2563EB' },
  { workstream: 'Deploy New Monitoring', owner: 'Marcus Webb', deadline: 'Mar 18', status: 'At Risk', statusColor: '#EA580C' },
  { workstream: 'Customer Credit Monitoring', owner: 'Diana Torres', deadline: 'Mar 5', status: 'Complete', statusColor: '#059669' },
  { workstream: 'Insurance Documentation', owner: 'Sarah Chen', deadline: 'Mar 10', status: 'On Track', statusColor: '#2563EB' },
  { workstream: 'Board Governance Update', owner: 'Sarah Chen', deadline: 'Mar 22', status: 'Not Started', statusColor: '#A8A29E' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function RemediationPlan() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Remediation Plan</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Root cause remediation and implementation tracking
        </p>
      </div>

      {/* 3 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Budget" value="$3.2M" color="#8B7355" />
        <StatCard label="Spent" value="$1.8M" color="#EA580C" />
        <StatCard label="Remaining" value="$1.4M" color="#059669" />
      </div>

      {/* Gantt-style Timeline */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Implementation Timeline</h2>
        <div className="space-y-3">
          {WORKSTREAMS.map((w) => (
            <div key={w.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold truncate" style={{ color: '#1C1917', maxWidth: 220 }}>{w.name}</span>
                <span className="text-[11px] tabular-nums font-bold" style={{ color: '#059669' }}>{w.pct}%</span>
              </div>
              <div className="h-5 w-full rounded overflow-hidden relative" style={{ backgroundColor: '#F5F5F4' }}>
                <div
                  className="h-full rounded transition-all duration-500"
                  style={{
                    width: `${w.pct}%`,
                    backgroundColor: w.pct >= 80 ? '#059669' : w.pct >= 50 ? '#2563EB' : w.pct >= 30 ? '#EAB308' : '#A8A29E',
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px]" style={{ color: '#A8A29E' }}>{w.start} - {w.end}</span>
                <span className="text-[10px]" style={{ color: '#57534E' }}>{w.owner}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion by Workstream */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>Completion by Workstream</h2>
        <BarChart data={BAR_DATA} color="#059669" maxVal={100} unit="%" />
      </div>

      {/* Risk Recurrence Prediction */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Risk Recurrence Prediction</h2>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="rounded-xl p-3" style={{ backgroundColor: '#FEF2F2' }}>
            <p className="text-[11px] font-semibold" style={{ color: '#DC2626' }}>Without encryption upgrade</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#57534E' }}>64% breach recurrence in 18 months</p>
          </div>
          <div className="rounded-xl p-3" style={{ backgroundColor: '#ECFDF5' }}>
            <p className="text-[11px] font-semibold" style={{ color: '#059669' }}>With upgrade</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#57534E' }}>8% breach recurrence in 18 months</p>
          </div>
        </div>
        <ConfidenceBand data={CONFIDENCE_DATA} color="#059669" height={160} />
      </div>

      {/* Accountability Table */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Accountability Tracker</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-[11px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #E7E5E4' }}>
                {['Workstream', 'Owner', 'Deadline', 'Status', 'Dependencies'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold uppercase tracking-wider" style={{ color: '#A8A29E' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACCOUNTABILITY.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F5F5F4' }}>
                  <td className="py-2 px-2 font-semibold" style={{ color: '#1C1917' }}>{row.workstream}</td>
                  <td className="py-2 px-2" style={{ color: '#57534E' }}>{row.owner}</td>
                  <td className="py-2 px-2 font-mono" style={{ color: '#1C1917' }}>{row.deadline}</td>
                  <td className="py-2 px-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${row.statusColor}15`, color: row.statusColor }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 px-2" style={{ color: '#57534E' }}>
                    {i === 1 ? 'Patch Critical Systems' : i === 4 ? 'Upgrade Encryption' : i === 7 ? 'Revise Data Policies' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
