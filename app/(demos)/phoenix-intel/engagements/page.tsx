'use client';

import Link from 'next/link';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { ENGAGEMENTS } from '@/data/phoenix-intel/nonprofit-data';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = { active: '#10b981', completed: '#3b6bf5', planning: '#c9942b' };

export default function EngagementsPage() {
  const insight = getInsight('engagements');
  const active = ENGAGEMENTS.filter(e => e.status === 'active');
  const totalBudget = ENGAGEMENTS.reduce((s, e) => s + e.budget, 0);
  const totalSpent = ENGAGEMENTS.reduce((s, e) => s + e.spent, 0);

  return (
    <PhoenixPage title="Engagements" subtitle={`${active.length} active — $${(totalBudget / 1000).toFixed(0)}K total budget`} accentColor="#c9942b">
      {/* Scope Compliance Alerts */}
      <div className="phoenix-card" style={{ marginBottom: 20, borderLeft: '3px solid #ef4444' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <AlertTriangle size={18} color="#ef4444" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444' }}>Scope Compliance Alerts</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 12 }}>
          Engagements where deliverables are not tracking against the original scope of work
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { client: 'Heritage Arts Collective', engagement: 'Fundraising Infrastructure Assessment', issue: 'Assessment is 88% complete but donor pipeline report (deliverable #5) has not been started', severity: 'high' },
            { client: 'Mountain View Academy', engagement: '$25M Capital Campaign', issue: 'Budget worksheet needs updating — 3 new team members added after original scope', severity: 'medium' },
          ].map((alert, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px',
              borderRadius: 8, background: alert.severity === 'high' ? '#ef444410' : '#c9942b10',
              border: `1px solid ${alert.severity === 'high' ? '#ef444420' : '#c9942b20'}`,
            }}>
              <AlertTriangle size={14} color={alert.severity === 'high' ? '#ef4444' : '#c9942b'} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pi-text)' }}>{alert.client} — {alert.engagement}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{alert.issue}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Consolidation — Replaces "Game of Telephone" */}
      <div className="phoenix-card" style={{ marginBottom: 16, borderLeft: '3px solid #7c3aed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <CheckCircle2 size={16} color="#7c3aed" />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7c3aed' }}>Single Source of Truth — Eliminates 8-9 Tracking Locations</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 10 }}>
          Previously, engagement data lived across Knack, Intervals, QuickBooks, spreadsheets, email threads, and more — creating a &ldquo;game of telephone&rdquo; where data got recommunicated and re-entered at each step. Now: proposal data auto-populates into engagement — budget, deliverables, team, and billing codes carry through from the accepted scope.
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Knack → Unified DB', 'Intervals → Telemetry', 'QuickBooks → Synced', 'Spreadsheets → Eliminated', 'Email Threads → CRM'].map(m => (
            <span key={m} style={{
              padding: '3px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700,
              background: '#7c3aed15', color: '#7c3aed',
            }}>{m}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {ENGAGEMENTS.map(eng => {
          const budgetPct = Math.min((eng.spent / eng.budget) * 100, 100);
          const budgetColor = budgetPct > 90 ? '#ef4444' : budgetPct > 75 ? '#c9942b' : '#10b981';
          return (
            <Link key={eng.id} href={`/phoenix-intel/engagements/${eng.id}`} style={{ textDecoration: 'none' }}>
              <div className="phoenix-card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pi-text)' }}>{eng.clientName}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{eng.title}</div>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700,
                    background: `${STATUS_COLORS[eng.status]}20`, color: STATUS_COLORS[eng.status],
                  }}>
                    {eng.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--pi-text-muted)' }}>Progress</span>
                    <span style={{ fontWeight: 700, color: 'var(--pi-text)' }}>{eng.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--pi-border-faint)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${eng.progress}%`, background: '#3b6bf5', borderRadius: 3, transition: 'width 0.8s' }} />
                  </div>
                </div>

                {/* Budget burn */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--pi-text-muted)' }}>Budget: ${(eng.spent / 1000).toFixed(0)}K / ${(eng.budget / 1000).toFixed(0)}K</span>
                    <span style={{ fontWeight: 700, color: budgetColor }}>{budgetPct.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--pi-border-faint)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${budgetPct}%`, background: budgetColor, borderRadius: 3, transition: 'width 0.8s' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: 'var(--pi-text-faint)', marginTop: 10, borderTop: '1px solid var(--pi-border-faint)', paddingTop: 8 }}>
                  <span>{eng.completedDeliverables}/{eng.deliverables} deliverables</span>
                  <span>{eng.sessions} sessions</span>
                  <span>{eng.leadConsultant}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
