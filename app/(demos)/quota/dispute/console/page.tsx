'use client';

import {
  AlertTriangle, Scale, Clock, TrendingUp, ArrowUpRight,
  ChevronRight, Shield, MapPin, BarChart3, CreditCard,
  Database, Layers, CalendarClock,
} from 'lucide-react';

/* ── Mock Data ─────────────────────────────────────────── */

type DisputeStatus = 'Under Review' | 'Investigating' | 'Pending Approval' | 'Escalated' | 'Resolved' | 'Pending';
type DisputeType = 'QUOTA_FAIRNESS' | 'TERRITORY_MISMATCH' | 'RAMP_SCHEDULE_ERROR' | 'CREDITING_DISPUTE' | 'DATA_QUALITY' | 'OVER_ASSIGNMENT' | 'MID_CYCLE_IMPACT';
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

interface Dispute {
  caseId: string;
  rep: string;
  type: DisputeType;
  territory: string;
  quotaImpact: number;
  status: DisputeStatus;
  filed: string;
  priority: Priority;
}

const disputes: Dispute[] = [
  { caseId: 'DIS-001', rep: 'Marcus Johnson', type: 'QUOTA_FAIRNESS', territory: 'Southeast MM', quotaImpact: -45_000, status: 'Under Review', filed: 'Mar 1', priority: 'High' },
  { caseId: 'DIS-002', rep: 'Sarah Chen', type: 'TERRITORY_MISMATCH', territory: 'West Enterprise', quotaImpact: -120_000, status: 'Investigating', filed: 'Feb 28', priority: 'Critical' },
  { caseId: 'DIS-003', rep: 'James Park', type: 'RAMP_SCHEDULE_ERROR', territory: 'Northeast SMB', quotaImpact: -18_000, status: 'Pending Approval', filed: 'Mar 3', priority: 'Medium' },
  { caseId: 'DIS-004', rep: 'Lisa Wang', type: 'CREDITING_DISPUTE', territory: 'Pacific NW', quotaImpact: -67_000, status: 'Under Review', filed: 'Mar 2', priority: 'High' },
  { caseId: 'DIS-005', rep: 'Michael Torres', type: 'OVER_ASSIGNMENT', territory: 'Southwest', quotaImpact: -93_000, status: 'Escalated', filed: 'Feb 25', priority: 'Critical' },
  { caseId: 'DIS-006', rep: 'Rachel Kim', type: 'DATA_QUALITY', territory: 'Midwest', quotaImpact: -32_000, status: 'Resolved', filed: 'Feb 20', priority: 'Low' },
  { caseId: 'DIS-007', rep: 'David Chen', type: 'MID_CYCLE_IMPACT', territory: 'Northeast Ent', quotaImpact: -54_000, status: 'Under Review', filed: 'Mar 4', priority: 'Medium' },
  { caseId: 'DIS-008', rep: 'Amanda Lopez', type: 'QUOTA_FAIRNESS', territory: 'Central', quotaImpact: -28_000, status: 'Pending', filed: 'Mar 5', priority: 'Medium' },
];

const typeLabels: Record<DisputeType, { label: string; icon: typeof Scale }> = {
  QUOTA_FAIRNESS:      { label: 'Quota Fairness',      icon: Scale },
  TERRITORY_MISMATCH:  { label: 'Territory Mismatch',  icon: MapPin },
  RAMP_SCHEDULE_ERROR: { label: 'Ramp Schedule Error',  icon: Clock },
  CREDITING_DISPUTE:   { label: 'Crediting Dispute',   icon: CreditCard },
  DATA_QUALITY:        { label: 'Data Quality',        icon: Database },
  OVER_ASSIGNMENT:     { label: 'Over-Assignment',     icon: Layers },
  MID_CYCLE_IMPACT:    { label: 'Mid-Cycle Impact',    icon: CalendarClock },
};

/* ── Helpers ───────────────────────────────────────────── */

function fmtDollar(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000) return `${n < 0 ? '-' : ''}$${(abs / 1_000).toFixed(0)}K`;
  return `${n < 0 ? '-' : ''}$${abs.toLocaleString()}`;
}

function statusStyle(s: DisputeStatus) {
  switch (s) {
    case 'Resolved':         return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
    case 'Under Review':     return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
    case 'Investigating':    return { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' };
    case 'Escalated':        return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
    case 'Pending Approval': return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
    case 'Pending':          return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
  }
}

function priorityStyle(p: Priority) {
  switch (p) {
    case 'Critical': return { bg: '#fee2e2', text: '#991b1b' };
    case 'High':     return { bg: '#fef3c7', text: '#92400e' };
    case 'Medium':   return { bg: '#dbeafe', text: '#1e40af' };
    case 'Low':      return { bg: '#f3f4f6', text: '#6b7280' };
  }
}

/* ── Dispute Type Breakdown ────────────────────────────── */

function typeCount(t: DisputeType) {
  return disputes.filter(d => d.type === t).length;
}

/* ── Workflow Steps ────────────────────────────────────── */

const workflowSteps = [
  'Rep Files Dispute',
  'Sales Ops Review',
  'Valid?',
  'Create Adjustment',
  'Apply & Notify',
];

/* ── KPIs ──────────────────────────────────────────────── */

const kpis = [
  { label: 'Open Disputes', value: '8', icon: AlertTriangle, delta: '+3 this week', up: false, color: 'text-amber-500' },
  { label: 'Avg Resolution Time', value: '4.2 days', icon: Clock, delta: 'Under 5-day target', up: true, color: 'text-emerald-600' },
  { label: 'Resolution Rate', value: '94%', icon: TrendingUp, delta: '+2% vs last quarter', up: true, color: 'text-emerald-600' },
  { label: 'Escalated to CRO', value: '2', icon: Shield, delta: '25% of open', up: false, color: 'text-red-500' },
];

/* ── Page ──────────────────────────────────────────────── */

export default function DisputeConsolePage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
            Dispute Console
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Manage quota disputes, fairness challenges, and crediting exceptions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 text-xs rounded-lg transition"
            style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)' }}
          >
            Export Report
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition">
            + New Dispute
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {kpis.map(k => (
          <div
            key={k.label}
            className="rounded-xl p-5"
            style={{
              background: 'var(--prizym-card-bg)',
              border: '1px solid var(--prizym-border-default)',
              boxShadow: 'var(--prizym-shadow-card)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--prizym-text-muted)' }}>
                {k.label}
              </span>
              <k.icon className={`h-4 w-4 ${k.color}`} />
            </div>
            <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--prizym-text-primary)' }}>
              {k.value}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className={`h-3 w-3 ${k.up ? 'text-emerald-600' : 'text-red-500'}`} />
              <span className={`text-xs ${k.up ? 'text-emerald-600' : 'text-red-500'}`}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Disputes Table */}
      <div
        className="rounded-xl mb-6 overflow-hidden"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>
            Active Disputes
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>
            All open and recently resolved dispute cases
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                {['Case ID', 'Rep', 'Type', 'Territory', 'Quota Impact', 'Status', 'Filed', 'Priority'].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-medium uppercase tracking-wider"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {disputes.map(d => {
                const ss = statusStyle(d.status);
                const ps = priorityStyle(d.priority);
                const tl = typeLabels[d.type];
                return (
                  <tr
                    key={d.caseId}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    style={{ borderBottom: '1px solid var(--prizym-border-default)' }}
                  >
                    <td className="px-4 py-3 font-mono font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>
                      {d.caseId}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--prizym-text-primary)' }}>
                      {d.rep}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <tl.icon className="h-3.5 w-3.5" style={{ color: 'var(--prizym-text-secondary)' }} />
                        <span style={{ color: 'var(--prizym-text-secondary)' }}>{tl.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--prizym-text-secondary)' }}>
                      {d.territory}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-red-600">
                      {fmtDollar(d.quotaImpact)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          background: ss.bg,
                          color: ss.text,
                          border: `1px solid ${ss.border}`,
                        }}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--prizym-text-muted)' }}>
                      {d.filed}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: ps.bg, color: ps.text }}
                      >
                        {d.priority}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Type Breakdown */}
      <div
        className="rounded-xl mb-6"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>
            Dispute Type Breakdown
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 p-5">
          {(Object.keys(typeLabels) as DisputeType[]).map(t => {
            const tl = typeLabels[t];
            const count = typeCount(t);
            return (
              <div
                key={t}
                className="rounded-lg p-3 text-center"
                style={{
                  background: 'var(--prizym-card-bg)',
                  border: '1px solid var(--prizym-border-default)',
                }}
              >
                <tl.icon className="h-4 w-4 mx-auto mb-2 text-amber-500" />
                <p className="text-lg font-bold" style={{ color: 'var(--prizym-text-primary)' }}>
                  {count}
                </p>
                <p className="text-[10px] leading-tight mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
                  {tl.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resolution Workflow */}
      <div
        className="rounded-xl"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>
            Resolution Workflow
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>
            Standard dispute resolution pipeline
          </p>
        </div>
        <div className="p-5 overflow-x-auto">
          <div className="flex items-center justify-center gap-0 min-w-[600px]">
            {workflowSteps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div
                  className="flex items-center justify-center px-5 py-3 rounded-lg text-xs font-semibold whitespace-nowrap"
                  style={{
                    background: i === 0 ? '#fef3c7' : i === workflowSteps.length - 1 ? '#dcfce7' : '#f3f4f6',
                    color: i === 0 ? '#92400e' : i === workflowSteps.length - 1 ? '#166534' : '#374151',
                    border: `1px solid ${i === 0 ? '#fde68a' : i === workflowSteps.length - 1 ? '#bbf7d0' : '#e5e7eb'}`,
                  }}
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5 opacity-60" />
                  {step}
                </div>
                {i < workflowSteps.length - 1 && (
                  <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" style={{ color: 'var(--prizym-text-muted)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
