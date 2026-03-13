'use client';

import { StatCard, WaterfallChart, ConfidenceBand, BarChart } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const WATERFALL_DATA = [
  { label: 'GDPR', value: 1.2, type: 'add' as const },
  { label: 'SEC', value: 2.0, type: 'add' as const },
  { label: 'California', value: 0.75, type: 'add' as const },
  { label: 'Massachusetts', value: 0.3, type: 'add' as const },
  { label: 'New York', value: 0.5, type: 'add' as const },
  { label: 'Total', value: 4.75, type: 'total' as const },
];

// Scale to thousands for the chart display
const WATERFALL_SCALED = WATERFALL_DATA.map((d) => ({
  ...d,
  value: d.value * 1000,
}));

const COMPLIANCE_ITEMS = [
  { jurisdiction: 'SEC', pct: 60, daysLeft: 2, status: 'In Progress', statusColor: '#EAB308' },
  { jurisdiction: 'California (CCPA)', pct: 45, daysLeft: 1, status: 'In Progress', statusColor: '#EAB308' },
  { jurisdiction: 'GDPR (EU)', pct: 80, daysLeft: 1, status: 'In Progress', statusColor: '#EAB308' },
  { jurisdiction: 'Massachusetts', pct: 20, daysLeft: 28, status: 'Not Started', statusColor: '#A8A29E' },
  { jurisdiction: 'New York (SHIELD)', pct: 10, daysLeft: 58, status: 'Not Started', statusColor: '#A8A29E' },
];

const CONFIDENCE_DATA = [
  { label: 'Day 1', value: 85, low: 70, high: 95 },
  { label: 'Day 2', value: 87, low: 72, high: 96 },
  { label: 'Day 3', value: 89, low: 75, high: 97 },
  { label: 'Day 4', value: 90, low: 77, high: 97 },
  { label: 'Day 5', value: 89, low: 76, high: 96 },
  { label: 'Day 6', value: 88, low: 74, high: 96 },
  { label: 'Day 7', value: 91, low: 78, high: 97 },
  { label: 'Day 8', value: 89, low: 75, high: 97 },
];

const PENALTY_DATA = [
  { label: 'SEC', value: 2000 },
  { label: 'GDPR', value: 1200 },
  { label: 'California', value: 750 },
  { label: 'New York', value: 500 },
  { label: 'Massachusetts', value: 300 },
];

const FILING_CHECKLIST = [
  { jurisdiction: 'SEC', requirement: 'Form 8-K Material Event', deadline: 'Mar 5', status: 'In Progress', statusColor: '#EAB308', attorney: 'James Park' },
  { jurisdiction: 'SEC', requirement: 'Preservation Notice', deadline: 'Mar 3', status: 'Filed', statusColor: '#059669', attorney: 'Sarah Chen' },
  { jurisdiction: 'California', requirement: 'CCPA Breach Notice', deadline: 'Mar 4', status: 'In Progress', statusColor: '#EAB308', attorney: 'James Park' },
  { jurisdiction: 'California', requirement: 'AG Written Notice', deadline: 'Mar 4', status: 'Not Started', statusColor: '#A8A29E', attorney: 'James Park' },
  { jurisdiction: 'GDPR', requirement: 'DPA Notification (Art 33)', deadline: 'Mar 4', status: 'In Progress', statusColor: '#EAB308', attorney: 'Sarah Chen' },
  { jurisdiction: 'GDPR', requirement: 'Data Subject Notification', deadline: 'Mar 6', status: 'Not Started', statusColor: '#A8A29E', attorney: 'Sarah Chen' },
  { jurisdiction: 'Massachusetts', requirement: 'AG + Consumer Affairs', deadline: 'Apr 1', status: 'Not Started', statusColor: '#A8A29E', attorney: 'James Park' },
  { jurisdiction: 'New York', requirement: 'SHIELD Act Notice', deadline: 'Apr 30', status: 'Not Started', statusColor: '#A8A29E', attorney: 'James Park' },
];

const CONTACT_LOG = [
  { date: 'Mar 3, 04:15', agency: 'SEC Division of Enforcement', channel: 'Formal Filing', summary: 'Initial breach disclosure submitted' },
  { date: 'Mar 3, 05:30', agency: 'CA Attorney General', channel: 'Legal Letter', summary: 'CCPA notification filed' },
  { date: 'Mar 3, 06:00', agency: 'EU DPA (Ireland)', channel: 'Portal Submission', summary: 'GDPR Art 33 preliminary notification' },
  { date: 'Mar 3, 03:00', agency: 'Internal Legal', channel: 'Secure Email', summary: 'Preservation notice to all custodians' },
  { date: 'Mar 2, 22:00', agency: 'FBI Cyber Division', channel: 'Phone', summary: 'Voluntary notification — cooperation pledged' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function RegulatoryTracker() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Regulatory Tracker</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Multi-jurisdiction compliance and filing management
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Jurisdictions" value="5" color="#8B7355" />
        <StatCard label="Filed" value="2/5" color="#EAB308" />
        <StatCard label="On-Time Rate" value="100%" color="#059669" />
        <StatCard label="Penalty Exposure" value="$4.75M" color="#DC2626" />
      </div>

      {/* Waterfall: Jurisdiction Deadlines */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Penalty Exposure by Jurisdiction</h2>
        <p className="text-[10px] mb-3" style={{ color: '#A8A29E' }}>Cumulative penalty exposure across 5 jurisdictions (values in $K)</p>
        <WaterfallChart data={WATERFALL_SCALED} height={280} />
      </div>

      {/* Compliance Progress */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Compliance Progress</h2>
        <div className="space-y-4">
          {COMPLIANCE_ITEMS.map((item) => (
            <div key={item.jurisdiction}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold" style={{ color: '#1C1917' }}>{item.jurisdiction}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] tabular-nums" style={{ color: '#A8A29E' }}>
                    {item.daysLeft}d remaining
                  </span>
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: `${item.statusColor}15`, color: item.statusColor }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#F5F5F4' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.pct}%`,
                    backgroundColor: item.pct >= 70 ? '#059669' : item.pct >= 40 ? '#EAB308' : '#A8A29E',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column: Confidence Band + Penalty Bar */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>On-Time Filing Probability</h2>
          <ConfidenceBand data={CONFIDENCE_DATA} color="#059669" height={160} />
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Penalty Exposure ($K)</h2>
          <BarChart data={PENALTY_DATA} color="#DC2626" unit="K" />
        </div>
      </div>

      {/* Filing Checklist Table */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Filing Checklist</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-[11px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #E7E5E4' }}>
                {['Jurisdiction', 'Requirement', 'Deadline', 'Status', 'Attorney'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold uppercase tracking-wider" style={{ color: '#A8A29E' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FILING_CHECKLIST.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F5F5F4' }}>
                  <td className="py-2 px-2 font-semibold" style={{ color: '#1C1917' }}>{row.jurisdiction}</td>
                  <td className="py-2 px-2" style={{ color: '#57534E' }}>{row.requirement}</td>
                  <td className="py-2 px-2 tabular-nums" style={{ color: '#1C1917' }}>{row.deadline}</td>
                  <td className="py-2 px-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: `${row.statusColor}15`, color: row.statusColor }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2 px-2" style={{ color: '#57534E' }}>{row.attorney}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Log */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Recent Agency Contact Log</h2>
        <div className="space-y-3">
          {CONTACT_LOG.map((entry, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-lg px-3 py-2"
              style={{ backgroundColor: i % 2 === 0 ? '#F5F5F4' : 'transparent' }}
            >
              <span className="text-[10px] shrink-0 pt-0.5" style={{ color: '#A8A29E', width: 100 }}>
                {entry.date}
              </span>
              <div className="flex-1">
                <p className="text-[12px] font-semibold" style={{ color: '#1C1917' }}>{entry.agency}</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#57534E' }}>{entry.summary}</p>
              </div>
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] shrink-0"
                style={{ backgroundColor: '#F5F5F4', color: '#57534E' }}
              >
                {entry.channel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
