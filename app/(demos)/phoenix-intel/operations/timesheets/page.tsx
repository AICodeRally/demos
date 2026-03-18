'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { MetricCard } from '@/components/demos/phoenix-intel/MetricCard';
import { DataTable } from '@/components/demos/phoenix-intel/DataTable';
import { Alert } from '@/components/demos/phoenix-intel/Alert';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { CONSULTANTS, ENGAGEMENTS } from '@/data/phoenix-intel/nonprofit-data';
import { Clock, DollarSign, CheckCircle } from 'lucide-react';

// Simulated weekly timesheet data
const CURRENT_WEEK = '2026-03-09';
const TIMESHEET_ENTRIES = CONSULTANTS.filter(c => c.activeEngagements > 0).map(c => {
  const engs = ENGAGEMENTS.filter(e => e.leadConsultant === c.name && e.status === 'active');
  const totalHours = Math.round(c.utilization * 0.4); // ~40hr week scaled by utilization
  const billableHours = Math.round(totalHours * 0.85);
  return {
    consultant: c.name,
    title: c.title,
    totalHours,
    billableHours,
    nonBillable: totalHours - billableHours,
    autoTagged: Math.round(totalHours * 0.82),
    manualEntry: totalHours - Math.round(totalHours * 0.82),
    engagements: engs.map(e => ({
      client: e.clientName,
      hours: Math.round(billableHours / engs.length),
    })),
    submitted: c.utilization > 70,
    approved: c.utilization > 85,
  };
});

export default function TimesheetsPage() {
  const insight = getInsight('operations/timesheets');
  const totalBillable = TIMESHEET_ENTRIES.reduce((s, t) => s + t.billableHours, 0);
  const totalHours = TIMESHEET_ENTRIES.reduce((s, t) => s + t.totalHours, 0);
  const billableRate = Math.round((totalBillable / totalHours) * 100);
  const autoTagRate = Math.round((TIMESHEET_ENTRIES.reduce((s, t) => s + t.autoTagged, 0) / totalHours) * 100);

  return (
    <PhoenixPage title="Timesheets" subtitle="Weekly time capture with passive telemetry auto-tagging" accentColor="#f59e0b">
      {/* Telemetry Banner */}
      <Alert variant="success" icon={CheckCircle}>
        <strong style={{ color: '#10b981' }}>Passive telemetry active:</strong> Email, document, and meeting time auto-tagged to engagements from M365. Manual entry required only for offline work (site visits, phone calls). Intervals is fully deprecated.
      </Alert>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" role="region" aria-label="Timesheet summary">
        <MetricCard label="Total Hours" value={String(totalHours)} icon={Clock} color="#3b6bf5" />
        <MetricCard label="Billable Hours" value={String(totalBillable)} icon={DollarSign} color="#10b981" />
        <MetricCard label="Billable Rate" value={`${billableRate}%`} icon={DollarSign} color={billableRate >= 80 ? '#10b981' : '#f59e0b'} />
        <MetricCard label="Auto-Tagged" value={`${autoTagRate}%`} icon={CheckCircle} color="#7c3aed" />
      </div>

      {/* Week selector label */}
      <div className="pi-body-muted" style={{ marginBottom: 12 }}>
        Week of <strong style={{ color: 'var(--pi-text)' }}>{new Date(CURRENT_WEEK).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
      </div>

      {/* Timesheet Table */}
      <div className="phoenix-card pi-card-section">
        <DataTable
          data={TIMESHEET_ENTRIES}
          keyFn={(t) => t.consultant}
          emptyMessage="No timesheet entries this week"
          columns={[
            {
              key: 'consultant',
              header: 'Consultant',
              render: (t) => (
                <div>
                  <div className="pi-label">{t.consultant}</div>
                  <div className="pi-overline" style={{ textTransform: 'none' }}>{t.title}</div>
                </div>
              ),
            },
            { key: 'total', header: 'Total', render: (t) => <span className="pi-label">{t.totalHours}h</span> },
            { key: 'billable', header: 'Billable', render: (t) => <span className="pi-body" style={{ color: '#10b981', fontWeight: 600 }}>{t.billableHours}h</span> },
            { key: 'nonBill', header: 'Non-Bill', hideSm: true, render: (t) => <span className="pi-body-muted">{t.nonBillable}h</span> },
            { key: 'auto', header: 'Auto', hideSm: true, render: (t) => <span className="pi-body" style={{ color: '#7c3aed', fontWeight: 600 }}>{t.autoTagged}h</span> },
            { key: 'manual', header: 'Manual', hideSm: true, render: (t) => <span className="pi-body" style={{ color: t.manualEntry > 5 ? '#f59e0b' : 'var(--pi-text-muted)' }}>{t.manualEntry}h</span> },
            {
              key: 'status',
              header: 'Status',
              render: (t) => {
                if (t.approved) return <span className="pi-badge" style={{ background: '#10b98120', color: '#10b981' }}>Approved</span>;
                if (t.submitted) return <span className="pi-badge" style={{ background: '#3b6bf520', color: '#3b6bf5' }}>Submitted</span>;
                return <span className="pi-badge" style={{ background: '#f59e0b20', color: '#f59e0b' }}>Draft</span>;
              },
            },
          ]}
        />
      </div>

      {/* Engagement Breakdown */}
      <div className="phoenix-card" style={{ borderLeft: '3px solid #7c3aed' }}>
        <h3 className="pi-section-title">Auto-Tag Accuracy</h3>
        <p className="pi-body-muted" style={{ marginBottom: 12 }}>
          Passive telemetry captured {autoTagRate}% of this week&apos;s hours automatically. Only {100 - autoTagRate}% required manual entry (site visits, phone calls). Auto-tagging accuracy at 94%, up from 89% at launch.
        </p>
        <div className="pi-flex-wrap">
          {[
            { source: 'Email (M365)', pct: 35, color: '#3b6bf5' },
            { source: 'Documents (SharePoint)', pct: 25, color: '#10b981' },
            { source: 'Meetings (Teams)', pct: 22, color: '#7c3aed' },
            { source: 'Manual Entry', pct: 18, color: '#f59e0b' },
          ].map(s => (
            <div key={s.source} style={{
              flex: '1 1 120px', padding: '8px 12px', borderRadius: 8, textAlign: 'center',
              background: `${s.color}08`, border: `1px solid ${s.color}20`,
            }}>
              <div className="pi-value-sm" style={{ color: s.color }}>{s.pct}%</div>
              <div className="pi-caption">{s.source}</div>
            </div>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
