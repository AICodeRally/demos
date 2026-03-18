'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { MetricCard } from '@/components/demos/phoenix-intel/MetricCard';
import { DataTable } from '@/components/demos/phoenix-intel/DataTable';
import { Alert } from '@/components/demos/phoenix-intel/Alert';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { Clock, DollarSign, TrendingUp, AlertCircle, Zap, Mail, FileSpreadsheet, Monitor, PenTool } from 'lucide-react';

const TIME_ENTRIES = [
  { date: '2026-03-17', consultant: 'Jennifer Blake', client: 'Mountain View Academy', hours: 4.5, category: 'Campaign Management', billable: true, rate: 175 },
  { date: '2026-03-17', consultant: 'Marcus Rivera', client: 'Hope Springs Foundation', hours: 3.0, category: 'Board Development', billable: true, rate: 150 },
  { date: '2026-03-17', consultant: 'Sarah Kim', client: 'Heritage Arts Collective', hours: 6.0, category: 'Assessment', billable: true, rate: 150 },
  { date: '2026-03-16', consultant: 'Thomas Park', client: 'Riverside Health Alliance', hours: 2.5, category: 'Planned Giving', billable: true, rate: 175 },
  { date: '2026-03-16', consultant: 'Jennifer Blake', client: 'Hope Springs Foundation', hours: 3.0, category: 'Feasibility Study', billable: true, rate: 175 },
  { date: '2026-03-16', consultant: 'Carlos Mendez', client: 'Internal', hours: 4.0, category: 'Project Management', billable: false, rate: 0 },
  { date: '2026-03-15', consultant: 'Diana Reeves', client: 'Mountain View Academy', hours: 5.0, category: 'Prospect Research', billable: true, rate: 125 },
  { date: '2026-03-15', consultant: 'Marcus Rivera', client: 'Heritage Arts Collective', hours: 3.5, category: 'Stewardship', billable: true, rate: 150 },
  { date: '2026-03-14', consultant: 'Jennifer Blake', client: 'SafeHaven Social Services', hours: 2.0, category: 'Proposal Development', billable: false, rate: 0 },
  { date: '2026-03-14', consultant: 'Sarah Kim', client: 'Faith & Light Ministries', hours: 4.0, category: 'Stewardship Program', billable: true, rate: 150 },
];

const PENDING_EXPENSES = [
  { date: '2026-03-12', consultant: 'Jennifer Blake', description: 'Travel to Mountain View campus', amount: 345.00, category: 'Travel', status: 'pending' },
  { date: '2026-03-10', consultant: 'Marcus Rivera', description: 'Client dinner — Hope Springs', amount: 125.50, category: 'Meals', status: 'pending' },
  { date: '2026-03-08', consultant: 'Thomas Park', description: 'AFP Conference registration', amount: 495.00, category: 'Conference', status: 'approved' },
  { date: '2026-03-05', consultant: 'Sarah Kim', description: 'Assessment supplies & printing', amount: 87.25, category: 'Supplies', status: 'approved' },
  { date: '2026-03-01', consultant: 'Carlos Mendez', description: 'Software license — Asana', amount: 210.00, category: 'Software', status: 'approved' },
];

const WEEKLY_SUMMARY = [
  { consultant: 'Jennifer Blake', billable: 28.5, nonBillable: 6.0, target: 36 },
  { consultant: 'Marcus Rivera', billable: 22.0, nonBillable: 4.0, target: 36 },
  { consultant: 'Sarah Kim', billable: 30.0, nonBillable: 2.0, target: 36 },
  { consultant: 'Thomas Park', billable: 18.5, nonBillable: 8.0, target: 36 },
  { consultant: 'Carlos Mendez', billable: 0, nonBillable: 36.0, target: 40 },
  { consultant: 'Diana Reeves', billable: 16.0, nonBillable: 2.0, target: 20 },
];

export default function TimeExpensePage() {
  const insight = getInsight('operations/time-expense');
  const totalBillable = TIME_ENTRIES.filter(e => e.billable).reduce((s, e) => s + e.hours * e.rate, 0);
  const totalHours = TIME_ENTRIES.reduce((s, e) => s + e.hours, 0);
  const billableHours = TIME_ENTRIES.filter(e => e.billable).reduce((s, e) => s + e.hours, 0);
  const pendingExpenseTotal = PENDING_EXPENSES.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0);

  return (
    <PhoenixPage title="Time & Expense" subtitle="Passive telemetry + manual capture — replaces Intervals" accentColor="#f59e0b">
      {/* Intervals Replacement Banner */}
      <div className="phoenix-card pi-card-section" style={{ borderLeft: '3px solid #7c3aed' }} role="region" aria-label="Smart time capture">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Zap size={18} color="#7c3aed" aria-hidden="true" />
          <h3 className="pi-label" style={{ color: '#7c3aed' }}>Smart Time Capture — Replaces Intervals</h3>
        </div>
        <p className="pi-body-muted" style={{ marginBottom: 12 }}>
          Passive telemetry auto-captures work across email, documents, and meetings. Manual entry only needed for offline/analog work. No more double-entry or end-of-week recall.
        </p>
        <div className="pi-flex-wrap" style={{ gap: 8 }}>
          {[
            { icon: Mail, label: 'Email Activity', desc: 'Outlook threads auto-tagged to client/engagement', color: '#3b6bf5' },
            { icon: FileSpreadsheet, label: 'Document Work', desc: 'Excel, Word, PowerPoint tracked via M365', color: '#10b981' },
            { icon: Monitor, label: 'Meeting Time', desc: 'Zoom/Teams sessions auto-captured with attendees', color: '#c9942b' },
            { icon: PenTool, label: 'Manual Override', desc: 'Offline/analog work — phone calls, site visits, travel', color: '#ec4899' },
          ].map(s => (
            <div key={s.label} style={{
              flex: '1 1 180px', padding: '10px 12px', borderRadius: 8,
              background: `${s.color}08`, border: `1px solid ${s.color}20`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <s.icon size={14} color={s.color} aria-hidden="true" />
                <span className="pi-overline" style={{ color: s.color, textTransform: 'none' }}>{s.label}</span>
              </div>
              <div className="pi-caption">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Tag Accuracy */}
      <Alert variant="success" icon={Zap}>
        Auto-tagging accuracy: <strong style={{ color: '#10b981' }}>94%</strong> — consultants review &amp; confirm weekly. Unmatched entries flagged for manual classification.
      </Alert>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" role="region" aria-label="Time and expense summary">
        <MetricCard label="This Week Hours" value={`${totalHours.toFixed(1)}h`} icon={Clock} color="#3b6bf5" />
        <MetricCard label="Billable Revenue" value={`$${(totalBillable / 1000).toFixed(1)}K`} icon={DollarSign} color="#10b981" />
        <MetricCard label="Billable %" value={`${((billableHours / totalHours) * 100).toFixed(0)}%`} icon={TrendingUp} color="#c9942b" />
        <MetricCard label="Pending Expenses" value={`$${pendingExpenseTotal.toFixed(0)}`} icon={AlertCircle} color="#ef4444" />
      </div>

      {/* Weekly Utilization */}
      <div className="phoenix-card pi-card-section" role="region" aria-label="Weekly utilization">
        <h3 className="pi-section-title" style={{ marginBottom: 16 }}>Weekly Utilization — Week of Mar 10</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {WEEKLY_SUMMARY.map(w => {
            const total = w.billable + w.nonBillable;
            const pctBillable = (w.billable / w.target) * 100;
            const pctNonBill = (w.nonBillable / w.target) * 100;
            const utilColor = pctBillable > 90 ? '#ef4444' : pctBillable > 75 ? '#10b981' : pctBillable > 50 ? '#c9942b' : '#94a3b8';
            return (
              <div key={w.consultant}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="pi-label">{w.consultant}</span>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span className="pi-body" style={{ color: '#10b981', fontWeight: 600 }}>{w.billable}h billable</span>
                    <span className="pi-caption">{w.nonBillable}h non-bill</span>
                    <span className="pi-label" style={{ color: utilColor }}>{total}h / {w.target}h</span>
                  </div>
                </div>
                <div className="pi-bar-track" style={{ height: 8, borderRadius: 4, display: 'flex', overflow: 'hidden' }}
                  role="progressbar"
                  aria-valuenow={Math.round(pctBillable)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${w.consultant}: ${w.billable}h billable of ${w.target}h target`}
                >
                  <div className="pi-bar-fill" style={{ width: `${pctBillable}%`, background: '#10b981', borderRadius: '4px 0 0 4px' }} />
                  <div style={{ height: '100%', width: `${pctNonBill}%`, background: '#f59e0b' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Time Entries */}
        <div className="phoenix-card" role="region" aria-label="Recent time entries">
          <h3 className="pi-section-title" style={{ marginBottom: 16 }}>Recent Time Entries</h3>
          <DataTable
            data={TIME_ENTRIES}
            keyFn={(_, i) => String(i)}
            columns={[
              { key: 'date', header: 'Date', render: (e) => <span className="pi-caption">{e.date.slice(5)}</span> },
              { key: 'consultant', header: 'Consultant', render: (e) => <span className="pi-label-muted">{e.consultant.split(' ')[1]}</span> },
              { key: 'client', header: 'Client', hideSm: true, render: (e) => <span className="pi-body-muted">{e.client}</span> },
              { key: 'hours', header: 'Hours', render: (e) => <span className="pi-label">{e.hours}h</span> },
              {
                key: 'type',
                header: 'Type',
                render: (e) => (
                  <span className="pi-badge" style={{
                    fontSize: 'var(--pi-fs-overline)',
                    background: e.billable ? '#10b98120' : '#94a3b820',
                    color: e.billable ? '#10b981' : '#94a3b8',
                  }}>
                    {e.billable ? 'Billable' : 'Internal'}
                  </span>
                ),
              },
            ]}
          />
        </div>

        {/* Expense Approvals */}
        <div className="phoenix-card" role="region" aria-label="Expense approvals">
          <h3 className="pi-section-title" style={{ marginBottom: 16 }}>Expense Approvals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PENDING_EXPENSES.map((e, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--pi-border-faint)',
              }}>
                <div>
                  <div className="pi-label-muted">{e.description}</div>
                  <div className="pi-caption">{e.consultant} · {e.date} · {e.category}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="pi-label">${e.amount.toFixed(2)}</span>
                  <span className="pi-badge" style={{
                    fontSize: 'var(--pi-fs-overline)',
                    background: e.status === 'pending' ? '#c9942b20' : '#10b98120',
                    color: e.status === 'pending' ? '#c9942b' : '#10b981',
                    textTransform: 'capitalize',
                  }}>
                    {e.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
