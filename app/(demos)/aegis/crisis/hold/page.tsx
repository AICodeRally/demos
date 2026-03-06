'use client';

import {
  StatCard,
  TreeMap,
  DonutChart,
  CountdownTimer,
  PrivilegeBadge,
} from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

type CustodianStatus = 'Preserved' | 'In Progress' | 'Pending';

interface Custodian {
  name: string;
  volume: string;
  status: CustodianStatus;
}

const CUSTODIANS: Custodian[] = [
  { name: 'IT Systems', volume: '1.2TB', status: 'Preserved' },
  { name: 'Email Server', volume: '820GB', status: 'Preserved' },
  { name: 'Cloud Storage', volume: '1.4TB', status: 'In Progress' },
  { name: 'CRM', volume: '340GB', status: 'Preserved' },
  { name: 'Payment Gateway', volume: '280GB', status: 'In Progress' },
  { name: 'Log Archives', volume: '450GB', status: 'Preserved' },
  { name: 'Backup Systems', volume: '180GB', status: 'Pending' },
  { name: 'HR Records', volume: '90GB', status: 'Preserved' },
];

const STATUS_COLORS: Record<CustodianStatus, { bg: string; text: string }> = {
  'Preserved': { bg: '#ECFDF5', text: '#059669' },
  'In Progress': { bg: '#FFFBEB', text: '#D97706' },
  'Pending': { bg: '#F5F5F4', text: '#A8A29E' },
};

const TREEMAP_DATA = [
  { label: 'Email', value: 2100, color: '#2563EB' },
  { label: 'Cloud Storage', value: 1400, color: '#7C3AED' },
  { label: 'Database', value: 890, color: '#059669' },
  { label: 'Log Archives', value: 340, color: '#EA580C' },
  { label: 'CRM', value: 120, color: '#8B7355' },
];

const DONUT_SEGMENTS = [
  { label: 'Acknowledged', value: 85, color: '#059669' },
  { label: 'Pending', value: 10, color: '#EAB308' },
  { label: 'Overdue', value: 5, color: '#DC2626' },
];

const DEADLINES = [
  { label: 'SEC Preservation', deadline: '2026-03-04T02:47:00Z' },
  { label: 'Insurance Notice', deadline: '2026-03-03T02:47:00Z' },
  { label: 'Internal Audit', deadline: '2026-03-02T02:47:00Z' },
  { label: 'State AG Response', deadline: '2026-03-31T02:47:00Z' },
];

interface CustodyRow {
  timestamp: string;
  artifact: string;
  custodian: string;
  action: string;
  hash: string;
}

const CUSTODY_LOG: CustodyRow[] = [
  { timestamp: '03:15 UTC', artifact: 'Customer DB Snapshot', custodian: 'Raj Patel', action: 'Forensic Copy', hash: 'SHA-256: a4f2...8e91' },
  { timestamp: '03:22 UTC', artifact: 'Email Server Image', custodian: 'Marcus Webb', action: 'Full Backup', hash: 'SHA-256: b7c3...2f44' },
  { timestamp: '03:31 UTC', artifact: 'Cloud Storage Freeze', custodian: 'IT Systems', action: 'Access Lock', hash: 'SHA-256: c8d1...5a73' },
  { timestamp: '03:45 UTC', artifact: 'CRM Export', custodian: 'Emily Nakamura', action: 'Data Extract', hash: 'SHA-256: d9e2...6b84' },
  { timestamp: '04:02 UTC', artifact: 'Payment Logs', custodian: 'Raj Patel', action: 'Forensic Copy', hash: 'SHA-256: e1f3...7c95' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function LegalHold() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Legal Hold</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>Evidence preservation and chain-of-custody initialization</p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Custodians" value="8" color="#8B7355" />
        <StatCard label="Data Volume" value="4.7TB" color="#2563EB" sparkline={[2.1, 2.8, 3.4, 3.9, 4.3, 4.7]} />
        <StatCard label="Acknowledged" value="85%" color="#059669" sparkline={[45, 56, 62, 71, 78, 85]} />
        <StatCard label="Overdue" value="5%" color="#DC2626" />
      </div>

      {/* Custodian Network Grid */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Custodian Network</h2>
        <div className="grid grid-cols-4 gap-4">
          {CUSTODIANS.map((c) => {
            const sc = STATUS_COLORS[c.status];
            return (
              <div
                key={c.name}
                className="rounded-xl p-4 text-center"
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${c.status === 'Preserved' ? '#059669' : c.status === 'In Progress' ? '#D97706' : '#E7E5E4'}`,
                }}
              >
                <div
                  className="mx-auto mb-2 flex items-center justify-center rounded-lg"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: sc.bg,
                  }}
                >
                  <span className="text-lg" style={{ color: sc.text }}>
                    {c.status === 'Preserved' ? '\u2713' : c.status === 'In Progress' ? '\u21BB' : '\u2022'}
                  </span>
                </div>
                <p className="text-xs font-semibold" style={{ color: '#1C1917' }}>{c.name}</p>
                <p className="text-[10px] mt-0.5 font-mono" style={{ color: '#57534E' }}>{c.volume}</p>
                <span
                  className="inline-block mt-2 rounded-full px-2 py-0.5 text-[9px] font-medium"
                  style={{ backgroundColor: sc.bg, color: sc.text }}
                >
                  {c.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column: TreeMap + DonutChart */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Preservation Scope by System (GB)</h2>
          <TreeMap data={TREEMAP_DATA} />
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Hold Compliance</h2>
          <div className="flex justify-center">
            <DonutChart
              segments={DONUT_SEGMENTS}
              centerValue="85%"
              centerLabel="Compliant"
              size={200}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {DONUT_SEGMENTS.map((s) => (
              <div key={s.label} className="rounded-lg p-3 text-center" style={{ backgroundColor: '#F5F5F4' }}>
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}%</p>
                <p className="text-[10px]" style={{ color: '#57534E' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deadline Countdown Section */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Preservation Deadlines</h2>
        <div className="space-y-3">
          {DEADLINES.map((d) => (
            <CountdownTimer key={d.label} deadline={d.deadline} label={d.label} />
          ))}
        </div>
      </div>

      {/* Chain-of-Custody Init Log */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: '#1C1917' }}>Chain-of-Custody Initialization Log</h2>
          <PrivilegeBadge size="md" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #E7E5E4' }}>
                {['Timestamp', 'Artifact', 'Custodian', 'Action', 'Hash', ''].map((h) => (
                  <th key={h} className="text-left pb-3 font-medium text-xs uppercase tracking-wider" style={{ color: '#A8A29E' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CUSTODY_LOG.map((r, i) => (
                <tr key={i} style={{ borderBottom: i < CUSTODY_LOG.length - 1 ? '1px solid #F5F5F4' : 'none' }}>
                  <td className="py-3 font-mono text-[11px]" style={{ color: '#57534E' }}>{r.timestamp}</td>
                  <td className="py-3 font-medium text-xs" style={{ color: '#1C1917' }}>{r.artifact}</td>
                  <td className="py-3 text-xs" style={{ color: '#57534E' }}>{r.custodian}</td>
                  <td className="py-3">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}
                    >
                      {r.action}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[10px]" style={{ color: '#A8A29E' }}>{r.hash}</td>
                  <td className="py-3">
                    <PrivilegeBadge size="sm" />
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
