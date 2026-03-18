'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { CONSULTANTS, ENGAGEMENTS } from '@/data/phoenix-intel/nonprofit-data';
import { Clock, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';

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
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 16,
        borderRadius: 8, background: '#10b98108', border: '1px solid #10b98120', fontSize: '0.85rem', color: 'var(--pi-text-muted)',
      }}>
        <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0 }} />
        <span><strong style={{ color: '#10b981' }}>Passive telemetry active:</strong> Email, document, and meeting time auto-tagged to engagements from M365. Manual entry required only for offline work (site visits, phone calls). Intervals is fully deprecated.</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Hours', value: String(totalHours), icon: Clock, color: '#3b6bf5' },
          { label: 'Billable Hours', value: String(totalBillable), icon: DollarSign, color: '#10b981' },
          { label: 'Billable Rate', value: `${billableRate}%`, icon: DollarSign, color: billableRate >= 80 ? '#10b981' : '#f59e0b' },
          { label: 'Auto-Tagged', value: `${autoTagRate}%`, icon: CheckCircle, color: '#7c3aed' },
        ].map(m => (
          <div key={m.label} className="phoenix-card" style={{ textAlign: 'center' }}>
            <m.icon size={20} color={m.color} style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pi-text)' }}>{m.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Week selector label */}
      <div style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 12 }}>
        Week of <strong style={{ color: 'var(--pi-text)' }}>{new Date(CURRENT_WEEK).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
      </div>

      {/* Timesheet Table */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                {['Consultant', 'Total', 'Billable', 'Non-Bill', 'Auto', 'Manual', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px', color: 'var(--pi-text-muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMESHEET_ENTRIES.map(t => (
                <tr key={t.consultant} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                  <td style={{ padding: '10px 8px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--pi-text)' }}>{t.consultant}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-faint)' }}>{t.title}</div>
                  </td>
                  <td style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--pi-text)' }}>{t.totalHours}h</td>
                  <td style={{ padding: '10px 8px', color: '#10b981', fontWeight: 600 }}>{t.billableHours}h</td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text-muted)' }}>{t.nonBillable}h</td>
                  <td style={{ padding: '10px 8px', color: '#7c3aed', fontWeight: 600 }}>{t.autoTagged}h</td>
                  <td style={{ padding: '10px 8px', color: t.manualEntry > 5 ? '#f59e0b' : 'var(--pi-text-muted)' }}>{t.manualEntry}h</td>
                  <td style={{ padding: '10px 8px' }}>
                    {t.approved ? (
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, background: '#10b98120', color: '#10b981' }}>Approved</span>
                    ) : t.submitted ? (
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, background: '#3b6bf520', color: '#3b6bf5' }}>Submitted</span>
                    ) : (
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, background: '#f59e0b20', color: '#f59e0b' }}>Draft</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Breakdown */}
      <div className="phoenix-card" style={{ marginBottom: 20, borderLeft: '3px solid #7c3aed' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 8 }}>Auto-Tag Accuracy</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 12 }}>
          Passive telemetry captured {autoTagRate}% of this week&apos;s hours automatically. Only {100 - autoTagRate}% required manual entry (site visits, phone calls). Auto-tagging accuracy at 94%, up from 89% at launch.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color }}>{s.pct}%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-muted)' }}>{s.source}</div>
            </div>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
