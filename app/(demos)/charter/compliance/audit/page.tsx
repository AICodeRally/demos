'use client';

import { StatCard, BarChart } from '@/components/demos/charter';

/* -- Mock Data ---------------------------------------------------------- */

const SPARKLINE_EVENTS = [10200, 10600, 11000, 11400, 11800, 12000, 12200, 12400, 12500, 12600, 12700, 12847];
const SPARKLINE_POLICY = [22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
const SPARKLINE_ACCESS = [110, 114, 118, 122, 126, 128, 130, 132, 134, 136, 138, 142];
const SPARKLINE_EXPORTS = [18, 19, 20, 21, 22, 23, 24, 25, 26, 26, 27, 28];

interface AuditEvent {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

const AUDIT_EVENTS: AuditEvent[] = [
  { id: 'a1', title: 'BSA Policy Updated', subtitle: 'Wire threshold changed to $3,000', timestamp: '1 hr ago', severity: 'high' },
  { id: 'a2', title: 'User Access Review', subtitle: '142 accounts reviewed — 6 deactivated', timestamp: '3 hr ago', severity: 'medium' },
  { id: 'a3', title: 'Rate Change Approved', subtitle: 'Money Market rate +0.15%', timestamp: '5 hr ago', severity: 'low' },
  { id: 'a4', title: 'Compliance Training', subtitle: '94% completion — 23 overdue', timestamp: '1 day ago', severity: 'medium' },
  { id: 'a5', title: 'System Patch Applied', subtitle: 'Core banking v4.2.1 security update', timestamp: '1 day ago', severity: 'low' },
  { id: 'a6', title: 'Board Report Generated', subtitle: 'Q4 compliance summary exported', timestamp: '2 days ago', severity: 'low' },
  { id: 'a7', title: 'SAR Filed', subtitle: 'Case #SAR-2026-047 submitted to FinCEN', timestamp: '3 days ago', severity: 'high' },
  { id: 'a8', title: 'Vendor Risk Assessment', subtitle: 'Jack Henry migration risk review', timestamp: '4 days ago', severity: 'medium' },
];

const SEVERITY_CONFIG = {
  high: { bg: '#FEE2E2', text: '#B91C1C', dot: '#B91C1C', label: 'HIGH' },
  medium: { bg: '#FEF3C7', text: '#D97706', dot: '#D97706', label: 'MED' },
  low: { bg: '#D1FAE5', text: '#059669', dot: '#059669', label: 'LOW' },
};

const EVENTS_BY_CATEGORY = [
  { label: 'Policy Changes', value: 34, color: '#B91C1C' },
  { label: 'Access Reviews', value: 142, color: '#475569' },
  { label: 'System Changes', value: 86, color: '#B87333' },
  { label: 'Compliance Events', value: 214, color: '#6B8F71' },
  { label: 'Data Exports', value: 28, color: '#475569' },
  { label: 'Login Anomalies', value: 19, color: '#EAB308' },
];

/* -- Page --------------------------------------------------------------- */

export default function AuditTrail() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Audit Trail</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Event log, policy changes &amp; access monitoring
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Events" value="12,847" trend="up" trendValue="+1,240" color="#475569" sparkline={SPARKLINE_EVENTS} />
        <StatCard label="Policy Changes" value="34" trend="up" trendValue="+8" color="#B91C1C" sparkline={SPARKLINE_POLICY} />
        <StatCard label="Access Reviews" value="142" trend="up" trendValue="+18" color="#B87333" sparkline={SPARKLINE_ACCESS} />
        <StatCard label="Data Exports" value="28" trend="up" trendValue="+6" color="#6B8F71" sparkline={SPARKLINE_EXPORTS} />
      </div>

      {/* Audit Event Feed */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Recent Audit Events</h2>
        <div className="space-y-2">
          {AUDIT_EVENTS.map((event, i) => {
            const sev = SEVERITY_CONFIG[event.severity];
            return (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-lg px-4 py-3"
                style={{ backgroundColor: i % 2 === 0 ? '#FAFAF9' : 'transparent' }}
              >
                {/* Severity dot */}
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: sev.dot }}
                />

                {/* Event details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold leading-tight" style={{ color: '#1C1917' }}>
                    {event.title}
                  </p>
                  <p className="text-[11px] mt-0.5 truncate" style={{ color: '#57534E' }}>
                    {event.subtitle}
                  </p>
                </div>

                {/* Severity badge */}
                <span
                  className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0"
                  style={{ backgroundColor: sev.bg, color: sev.text }}
                >
                  {sev.label}
                </span>

                {/* Timestamp */}
                <span
                  className="text-[11px] font-mono shrink-0 w-20 text-right"
                  style={{ color: '#A8A29E' }}
                >
                  {event.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events by Category */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Events by Category</h2>
        <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>6-month aggregate audit event breakdown</p>
        <BarChart data={EVENTS_BY_CATEGORY} />
      </div>
    </>
  );
}
