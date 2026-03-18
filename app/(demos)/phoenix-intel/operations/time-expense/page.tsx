'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { Clock, DollarSign, TrendingUp, AlertCircle, Zap, Mail, FileSpreadsheet, Monitor, PenTool, AlertTriangle } from 'lucide-react';

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
      <div className="phoenix-card" style={{ marginBottom: 20, borderLeft: '3px solid #7c3aed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Zap size={18} color="#7c3aed" />
          <h3 className="pi-label" style={{ color: '#7c3aed' }}>Smart Time Capture — Replaces Intervals</h3>
        </div>
        <p className="pi-body-muted" style={{ marginBottom: 12 }}>
          Passive telemetry auto-captures work across email, documents, and meetings. Manual entry only needed for offline/analog work. No more double-entry or end-of-week recall.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
                <s.icon size={14} color={s.color} />
                <span className="pi-overline" style={{ color: s.color, textTransform: 'none' }}>{s.label}</span>
              </div>
              <div className="pi-caption">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Tag Accuracy */}
      <div className="pi-body-muted" style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 16,
        borderRadius: 8, background: '#10b98108', border: '1px solid #10b98120',
      }}>
        <Zap size={14} color="#10b981" style={{ flexShrink: 0 }} />
        <span>Auto-tagging accuracy: <strong style={{ color: '#10b981' }}>94%</strong> — consultants review &amp; confirm weekly. Unmatched entries flagged for manual classification.</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'This Week Hours', value: `${totalHours.toFixed(1)}h`, icon: Clock, color: '#3b6bf5' },
          { label: 'Billable Revenue', value: `$${(totalBillable / 1000).toFixed(1)}K`, icon: DollarSign, color: '#10b981' },
          { label: 'Billable %', value: `${((billableHours / totalHours) * 100).toFixed(0)}%`, icon: TrendingUp, color: '#c9942b' },
          { label: 'Pending Expenses', value: `$${pendingExpenseTotal.toFixed(0)}`, icon: AlertCircle, color: '#ef4444' },
        ].map(m => (
          <div key={m.label} className="phoenix-card" style={{ textAlign: 'center' }}>
            <m.icon size={20} color={m.color} style={{ margin: '0 auto 8px' }} />
            <div className="pi-value">{m.value}</div>
            <div className="pi-caption" style={{ marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Utilization */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
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
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span className="pi-body" style={{ color: '#10b981', fontWeight: 600 }}>{w.billable}h billable</span>
                    <span className="pi-caption">{w.nonBillable}h non-bill</span>
                    <span className="pi-label" style={{ color: utilColor }}>{total}h / {w.target}h</span>
                  </div>
                </div>
                <div className="pi-bar-track" style={{ height: 8, borderRadius: 4, display: 'flex', overflow: 'hidden' }}>
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
        <div className="phoenix-card">
          <h3 className="pi-section-title" style={{ marginBottom: 16 }}>Recent Time Entries</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                  {['Date', 'Consultant', 'Client', 'Hours', 'Type'].map(h => (
                    <th key={h} className="pi-overline" style={{ textAlign: 'left', padding: '6px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_ENTRIES.map((e, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                    <td className="pi-caption" style={{ padding: '8px 6px' }}>{e.date.slice(5)}</td>
                    <td className="pi-label-muted" style={{ padding: '8px 6px' }}>{e.consultant.split(' ')[1]}</td>
                    <td className="pi-body-muted" style={{ padding: '8px 6px' }}>{e.client}</td>
                    <td className="pi-label" style={{ padding: '8px 6px' }}>{e.hours}h</td>
                    <td style={{ padding: '8px 6px' }}>
                      <span className="pi-badge" style={{
                        fontSize: 'var(--pi-fs-overline)',
                        background: e.billable ? '#10b98120' : '#94a3b820',
                        color: e.billable ? '#10b981' : '#94a3b8',
                      }}>
                        {e.billable ? 'Billable' : 'Internal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Approvals */}
        <div className="phoenix-card">
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
