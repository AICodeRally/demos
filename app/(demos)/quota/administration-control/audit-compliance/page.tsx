'use client';

import {
  Shield, AlertTriangle, FileCheck, Activity, Clock,
  ArrowUpRight, ArrowDownRight, Search, Filter, ChevronDown,
  CheckCircle2, XCircle, AlertCircle, Eye, Download,
  User, Globe,
} from 'lucide-react';

/* ── Data ──────────────────────────────────────────────────────── */
type EventSeverity = 'info' | 'warning' | 'critical';

interface AuditEvent {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  oldValue: string;
  newValue: string;
  ip: string;
  severity: EventSeverity;
}

const AUDIT_EVENTS: AuditEvent[] = [
  { id: 1, timestamp: '2026-03-08 09:42:18', user: 'Sarah Chen', action: 'Quota Adjusted', entity: 'James Park — Q1 Target', oldValue: '$1,200,000', newValue: '$1,350,000', ip: '10.0.12.44', severity: 'warning' },
  { id: 2, timestamp: '2026-03-08 09:15:03', user: 'Marcus Johnson', action: 'Plan Approved', entity: 'Enterprise FY2026 v3.2', oldValue: 'Pending', newValue: 'Approved', ip: '10.0.12.51', severity: 'info' },
  { id: 3, timestamp: '2026-03-07 17:33:41', user: 'Elena Rodriguez', action: 'Commission Dispute', entity: 'Deal #4821 — Acme Corp', oldValue: '$14,200', newValue: 'Under Review', ip: '10.0.13.22', severity: 'critical' },
  { id: 4, timestamp: '2026-03-07 16:20:09', user: 'Sarah Chen', action: 'Role Changed', entity: 'Rachel Foster', oldValue: 'Rep', newValue: 'Viewer', ip: '10.0.12.44', severity: 'warning' },
  { id: 5, timestamp: '2026-03-07 14:55:32', user: 'System', action: 'Batch Recalc', entity: 'All Q1 Commissions', oldValue: '$847,200', newValue: '$851,400', ip: '10.0.1.1', severity: 'info' },
  { id: 6, timestamp: '2026-03-07 11:12:45', user: 'Marcus Johnson', action: 'Territory Reassigned', entity: 'Southwest Region', oldValue: 'David Kim', newValue: 'Aisha Patel', ip: '10.0.12.51', severity: 'warning' },
  { id: 7, timestamp: '2026-03-06 16:48:21', user: 'Sarah Chen', action: 'Plan Tier Modified', entity: 'Mid-Market FY2026', oldValue: 'Accel: 9%', newValue: 'Accel: 10%', ip: '10.0.12.44', severity: 'critical' },
  { id: 8, timestamp: '2026-03-06 14:30:00', user: 'System', action: 'Data Export', entity: 'Q4 2025 Commission Report', oldValue: '\u2014', newValue: 'Exported (CSV)', ip: '10.0.1.1', severity: 'info' },
  { id: 9, timestamp: '2026-03-06 10:05:18', user: 'Tom Bradley', action: 'Login Attempt', entity: 'User Account', oldValue: 'Inactive', newValue: 'Access Denied', ip: '192.168.1.105', severity: 'warning' },
  { id: 10, timestamp: '2026-03-05 15:22:09', user: 'Elena Rodriguez', action: 'Dispute Resolved', entity: 'Deal #4790 — TechStart', oldValue: '$8,400', newValue: '$9,100 (adjusted)', ip: '10.0.13.22', severity: 'info' },
  { id: 11, timestamp: '2026-03-05 09:41:33', user: 'Sarah Chen', action: 'User Invited', entity: 'Rachel Foster', oldValue: '\u2014', newValue: 'Viewer role', ip: '10.0.12.44', severity: 'info' },
  { id: 12, timestamp: '2026-03-04 17:18:55', user: 'Marcus Johnson', action: 'Quota Override', entity: 'SMB Team — Q1 Total', oldValue: '$3,600,000', newValue: '$3,200,000', ip: '10.0.12.51', severity: 'critical' },
];

type ComplianceStatus = 'pass' | 'fail' | 'review';

interface ComplianceItem {
  id: string;
  name: string;
  category: string;
  status: ComplianceStatus;
  lastCheck: string;
  detail: string;
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  { id: 'SOX-1', name: 'SOX Section 302 — Officer Certification', category: 'SOX', status: 'pass', lastCheck: 'Mar 8, 2026', detail: 'All plan changes require dual approval' },
  { id: 'SOX-2', name: 'SOX Section 404 — Internal Controls', category: 'SOX', status: 'pass', lastCheck: 'Mar 8, 2026', detail: 'Segregation of duties verified' },
  { id: 'SOX-3', name: 'SOX Audit Trail Completeness', category: 'SOX', status: 'pass', lastCheck: 'Mar 8, 2026', detail: 'All modifications logged with IP and user' },
  { id: 'GDPR-1', name: 'GDPR Art. 17 — Right to Erasure', category: 'GDPR', status: 'pass', lastCheck: 'Mar 7, 2026', detail: 'Data retention policy enforced (36 months)' },
  { id: 'GDPR-2', name: 'GDPR Art. 25 — Data Protection by Design', category: 'GDPR', status: 'pass', lastCheck: 'Mar 7, 2026', detail: 'PII encrypted at rest (AES-256)' },
  { id: 'GDPR-3', name: 'GDPR Consent Records', category: 'GDPR', status: 'review', lastCheck: 'Mar 5, 2026', detail: '2 records pending consent verification' },
  { id: 'INT-1', name: 'Dual Approval for Plan Changes', category: 'Internal', status: 'pass', lastCheck: 'Mar 8, 2026', detail: 'Enforced — 0 violations this quarter' },
  { id: 'INT-2', name: 'Commission Cap Adherence', category: 'Internal', status: 'pass', lastCheck: 'Mar 8, 2026', detail: 'All payouts within 3x base salary cap' },
  { id: 'INT-3', name: 'Dispute Resolution SLA', category: 'Internal', status: 'fail', lastCheck: 'Mar 8, 2026', detail: '1 dispute exceeds 5-day SLA (Deal #4821)' },
  { id: 'INT-4', name: 'Quarterly Access Review', category: 'Internal', status: 'pass', lastCheck: 'Mar 1, 2026', detail: 'All user roles verified Q1 2026' },
];

/* ── Components ────────────────────────────────────────────────── */
function KPI({ label, value, icon: Icon, trend, trendUp }: {
  label: string; value: string; icon: React.ElementType; trend: string; trendUp: boolean;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-2" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--prizym-text-muted)' }}>{label}</span>
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>{value}</p>
      <div className="flex items-center gap-1.5">
        {trendUp
          ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
          : <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />}
        <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>{trend}</span>
        <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>vs last month</span>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: EventSeverity }) {
  const config = {
    info: { color: 'bg-blue-500/20 text-blue-400', dot: 'bg-blue-400' },
    warning: { color: 'bg-amber-500/20 text-amber-400', dot: 'bg-amber-400' },
    critical: { color: 'bg-red-500/20 text-red-600', dot: 'bg-red-400' },
  };
  const c = config[severity];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {severity}
    </span>
  );
}

function ComplianceIcon({ status }: { status: ComplianceStatus }) {
  if (status === 'pass') return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (status === 'fail') return <XCircle className="h-4 w-4 text-red-600" />;
  return <AlertCircle className="h-4 w-4 text-amber-400" />;
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function AuditCompliancePage() {
  const passCount = COMPLIANCE_ITEMS.filter(c => c.status === 'pass').length;
  const complianceScore = Math.round((passCount / COMPLIANCE_ITEMS.length) * 100);
  const criticalEvents = AUDIT_EVENTS.filter(e => e.severity === 'critical').length;
  const policyChanges = AUDIT_EVENTS.filter(e => e.action.includes('Modified') || e.action.includes('Adjusted') || e.action.includes('Override')).length;
  const openFindings = COMPLIANCE_ITEMS.filter(c => c.status !== 'pass').length;

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>Audit & Compliance</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Track every change, enforce policies, and maintain regulatory compliance.
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-secondary)' }}>
          <Download className="h-3 w-3" /> Export Audit Log
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPI label="Events This Month" value={String(AUDIT_EVENTS.length)} icon={Activity} trend="+18%" trendUp={false} />
        <KPI label="Policy Changes" value={String(policyChanges)} icon={AlertTriangle} trend="+2" trendUp={false} />
        <KPI label="Compliance Score" value={`${complianceScore}%`} icon={Shield} trend="+3%" trendUp />
        <KPI label="Open Findings" value={String(openFindings)} icon={FileCheck} trend="-1" trendUp />
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit events..."
            className="w-full rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:border-amber-500/50"
            style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-primary)' }}
          />
        </div>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-secondary)' }}>
          <Filter className="h-3 w-3" /> Severity <ChevronDown className="h-3 w-3" />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-secondary)' }}>
          <Clock className="h-3 w-3" /> Date Range <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Audit Event Log */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Audit Event Log</h2>
          <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{AUDIT_EVENTS.length} events — Mar 4-8, 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Timestamp</th>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>User</th>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Action</th>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Entity</th>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Old Value</th>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>New Value</th>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Severity</th>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>IP</th>
                <th className="pb-3 text-xs font-medium w-10" style={{ color: 'var(--prizym-text-muted)' }}></th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_EVENTS.map(e => (
                <tr key={e.id} className="transition hover:bg-slate-50" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5" style={{ color: 'var(--prizym-text-muted)' }}>
                      <Clock className="h-3 w-3 shrink-0" />
                      <span className="text-xs font-mono whitespace-nowrap">{e.timestamp}</span>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 shrink-0" style={{ color: 'var(--prizym-text-muted)' }} />
                      <span className="text-xs whitespace-nowrap" style={{ color: 'var(--prizym-text-secondary)' }}>{e.user}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-xs font-medium whitespace-nowrap" style={{ color: 'var(--prizym-text-primary)' }}>{e.action}</td>
                  <td className="py-2.5 text-xs max-w-[180px] truncate" style={{ color: 'var(--prizym-text-secondary)' }}>{e.entity}</td>
                  <td className="py-2.5 text-xs font-mono whitespace-nowrap" style={{ color: 'var(--prizym-text-muted)' }}>{e.oldValue}</td>
                  <td className="py-2.5 text-xs font-mono whitespace-nowrap" style={{ color: 'var(--prizym-text-secondary)' }}>{e.newValue}</td>
                  <td className="py-2.5"><SeverityBadge severity={e.severity} /></td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1" style={{ color: 'var(--prizym-text-muted)' }}>
                      <Globe className="h-3 w-3 shrink-0" />
                      <span className="text-[10px] font-mono">{e.ip}</span>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <button className="p-1 rounded hover:bg-slate-100 transition">
                      <Eye className="h-3.5 w-3.5" style={{ color: 'var(--prizym-text-muted)' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Compliance Checklist</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-600 font-medium">{passCount}/{COMPLIANCE_ITEMS.length} passing</span>
            <div className="h-2 w-24 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${complianceScore}%` }} />
            </div>
          </div>
        </div>

        {['SOX', 'GDPR', 'Internal'].map(category => (
          <div key={category} className="mb-4 last:mb-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--prizym-text-muted)' }}>{category}</h3>
            {COMPLIANCE_ITEMS.filter(c => c.category === category).map(item => (
              <div key={item.id} className="flex items-center justify-between py-2.5 last:border-0" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                <div className="flex items-center gap-3">
                  <ComplianceIcon status={item.status} />
                  <div>
                    <p className="text-sm" style={{ color: 'var(--prizym-text-primary)' }}>{item.name}</p>
                    <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{item.detail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px]" style={{ color: 'var(--prizym-text-muted)' }}>Checked {item.lastCheck}</span>
                  <span className={`text-[10px] font-semibold uppercase ${item.status === 'pass' ? 'text-emerald-600' : item.status === 'fail' ? 'text-red-600' : 'text-amber-400'}`}>
                    {item.status === 'pass' ? 'PASS' : item.status === 'fail' ? 'FAIL' : 'REVIEW'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--prizym-border-default)' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />
            <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Info ({AUDIT_EVENTS.filter(e => e.severity === 'info').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Warning ({AUDIT_EVENTS.filter(e => e.severity === 'warning').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Critical ({criticalEvents})</span>
          </div>
        </div>
        <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Retention: 84 months | Next audit: Apr 1, 2026</span>
      </div>
    </>
  );
}
