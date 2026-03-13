'use client';

import { StatCard, BarChart, DonutChart, PrivilegeBadge } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const EVIDENCE_TABLE = [
  { id: 'EV-001', type: 'File', desc: 'Customer DB Snapshot', by: 'Raj Patel', time: '03:15 UTC', hash: 'a4f2...8e91', priv: true, status: 'Verified' },
  { id: 'EV-002', type: 'Log', desc: 'Firewall Access Logs (48hr)', by: 'Marcus Webb', time: '03:22 UTC', hash: 'b7c1...2f43', priv: false, status: 'Verified' },
  { id: 'EV-003', type: 'Image', desc: 'Email Server Forensic Image', by: 'Raj Patel', time: '04:22 UTC', hash: 'c3d8...5a67', priv: true, status: 'Verified' },
  { id: 'EV-004', type: 'Communication', desc: 'CISO Incident Report Email', by: 'Sarah Chen', time: '03:47 UTC', hash: 'd9e5...1b89', priv: true, status: 'Verified' },
  { id: 'EV-005', type: 'Document', desc: 'Threat Actor Profile', by: 'Marcus Webb', time: '05:10 UTC', hash: 'e2f6...3c12', priv: false, status: 'Pending' },
  { id: 'EV-006', type: 'File', desc: 'API Key Rotation Audit', by: 'Raj Patel', time: '05:45 UTC', hash: 'f1a3...4d78', priv: true, status: 'Verified' },
  { id: 'EV-007', type: 'Log', desc: 'Cloud IAM Activity Logs', by: 'Marcus Webb', time: '06:00 UTC', hash: 'a8b2...6e34', priv: false, status: 'Flagged' },
  { id: 'EV-008', type: 'File', desc: 'Exfiltration Traffic Capture', by: 'Raj Patel', time: '06:30 UTC', hash: 'c5d9...7f56', priv: true, status: 'Verified' },
];

const ARTIFACT_TYPE_DATA = [
  { label: 'Files', value: 42 },
  { label: 'Logs', value: 35 },
  { label: 'Forensic Images', value: 18 },
  { label: 'Communications', value: 22 },
  { label: 'Documents', value: 10 },
];

const INTEGRITY_SEGMENTS = [
  { label: 'Verified', value: 94, color: '#059669' },
  { label: 'Pending', value: 4, color: '#EAB308' },
  { label: 'Flagged', value: 2, color: '#DC2626' },
];

const PRIVILEGE_SEGMENTS = [
  { label: 'Privileged', value: 67, color: '#7C3AED' },
  { label: 'Work Product', value: 18, color: '#8B7355' },
  { label: 'Non-Privileged', value: 15, color: '#A8A29E' },
];

const PIPELINE_STEPS = [
  { name: 'Collection', count: 127 },
  { name: 'Verification', count: 119 },
  { name: 'Cataloging', count: 115 },
  { name: 'Secure Storage', count: 112 },
  { name: 'Privilege Review', count: 85 },
];

const RECENT_ADDITIONS = [
  { artifact: 'Exfiltration Traffic Capture', collector: 'Raj Patel', time: '06:30 UTC', hash: 'c5d9...7f56' },
  { artifact: 'Cloud IAM Activity Logs', collector: 'Marcus Webb', time: '06:00 UTC', hash: 'a8b2...6e34' },
  { artifact: 'API Key Rotation Audit', collector: 'Raj Patel', time: '05:45 UTC', hash: 'f1a3...4d78' },
  { artifact: 'Threat Actor Profile', collector: 'Marcus Webb', time: '05:10 UTC', hash: 'e2f6...3c12' },
  { artifact: 'CISO Incident Report Email', collector: 'Sarah Chen', time: '03:47 UTC', hash: 'd9e5...1b89' },
];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Verified: { bg: '#05966915', color: '#059669' },
  Pending: { bg: '#EAB30815', color: '#EAB308' },
  Flagged: { bg: '#DC262615', color: '#DC2626' },
};

/* ── Page ─────────────────────────────────────────────────── */

export default function EvidenceVault() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Evidence Vault</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Chain-of-custody management and forensic integrity
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Artifacts" value="127" color="#7C3AED" />
        <StatCard label="Verified" value="94%" color="#059669" />
        <StatCard label="Privileged" value="67%" color="#7C3AED" />
        <StatCard label="Flagged" value="3" color="#DC2626" />
      </div>

      {/* Chain-of-Custody Table */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Chain of Custody</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-[11px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #E7E5E4' }}>
                {['ID', 'Type', 'Description', 'Collected By', 'Timestamp', 'SHA-256', 'Privilege', 'Status'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold uppercase tracking-wider" style={{ color: '#A8A29E' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EVIDENCE_TABLE.map((row) => {
                const st = STATUS_COLORS[row.status] ?? STATUS_COLORS.Pending;
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F5F5F4' }}>
                    <td className="py-2 px-2 font-mono font-semibold" style={{ color: '#1C1917' }}>{row.id}</td>
                    <td className="py-2 px-2" style={{ color: '#57534E' }}>{row.type}</td>
                    <td className="py-2 px-2" style={{ color: '#1C1917' }}>{row.desc}</td>
                    <td className="py-2 px-2" style={{ color: '#57534E' }}>{row.by}</td>
                    <td className="py-2 px-2 font-mono" style={{ color: '#A8A29E' }}>{row.time}</td>
                    <td className="py-2 px-2 font-mono" style={{ color: '#A8A29E' }}>{row.hash}</td>
                    <td className="py-2 px-2">{row.priv && <PrivilegeBadge size="sm" />}</td>
                    <td className="py-2 px-2">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: st.bg, color: st.color }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-column: Bar + Donut */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Artifacts by Type</h2>
          <BarChart data={ARTIFACT_TYPE_DATA} color="#7C3AED" />
        </div>
        <div className="rounded-xl bg-white border p-5 flex flex-col items-center justify-center" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4 self-start" style={{ color: '#1C1917' }}>Integrity Score</h2>
          <DonutChart segments={INTEGRITY_SEGMENTS} centerValue="94%" centerLabel="Verified" />
        </div>
      </div>

      {/* Custody Flow Pipeline */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Custody Flow Pipeline</h2>
        <div className="flex items-center justify-between gap-2">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.name} className="flex items-center flex-1">
              <div
                className="rounded-xl p-3 text-center flex-1"
                style={{
                  backgroundColor: '#F5F5F4',
                  border: '1px solid #E7E5E4',
                }}
              >
                <p className="text-[11px] font-semibold" style={{ color: '#1C1917' }}>{step.name}</p>
                <p className="text-lg font-bold mt-1" style={{ color: '#7C3AED' }}>{step.count}</p>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <span className="text-lg shrink-0 mx-1" style={{ color: '#A8A29E' }}>&rarr;</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Privilege Distribution Donut */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-5 flex flex-col items-center justify-center" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4 self-start" style={{ color: '#1C1917' }}>Privilege Distribution</h2>
          <DonutChart segments={PRIVILEGE_SEGMENTS} centerValue="67%" centerLabel="Protected" />
        </div>

        {/* Recent Additions */}
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Recent Additions</h2>
          <table className="w-full min-w-[600px] text-[11px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #E7E5E4' }}>
                {['Artifact', 'Collector', 'Time', 'Hash'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold uppercase tracking-wider" style={{ color: '#A8A29E' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ADDITIONS.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F5F5F4' }}>
                  <td className="py-2 px-2" style={{ color: '#1C1917' }}>{row.artifact}</td>
                  <td className="py-2 px-2" style={{ color: '#57534E' }}>{row.collector}</td>
                  <td className="py-2 px-2 font-mono" style={{ color: '#A8A29E' }}>{row.time}</td>
                  <td className="py-2 px-2 font-mono" style={{ color: '#A8A29E' }}>{row.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
