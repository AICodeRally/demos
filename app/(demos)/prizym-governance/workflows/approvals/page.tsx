'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { APPROVALS, getApprovalStats, type ApprovalStatus } from '@/data/prizym-governance/operate';
import { CheckSquare, AlertTriangle, Clock, ShieldCheck, MessageSquare } from 'lucide-react';

type FilterTab = 'all' | ApprovalStatus;

const STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444',
  escalated: '#8b5cf6',
};

function formatMoney(n?: number) {
  if (!n) return '—';
  return `$${(n / 1000).toFixed(0)}K`;
}

export default function ApprovalsPage() {
  const [tab, setTab] = useState<FilterTab>('all');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = getApprovalStats();
  const filtered = tab === 'all' ? APPROVALS : APPROVALS.filter(a => a.status === tab);

  const metrics = [
    { label: 'Pending', value: String(stats.pending), icon: Clock, color: '#f59e0b' },
    { label: 'Approved', value: String(stats.approved), icon: CheckSquare, color: '#10b981' },
    { label: 'Escalated', value: String(stats.escalated), icon: AlertTriangle, color: '#8b5cf6' },
    { label: 'High Priority', value: String(stats.highPriority), icon: ShieldCheck, color: '#ef4444' },
  ];

  const tabs: FilterTab[] = ['all', 'pending', 'approved', 'escalated', 'rejected'];

  return (
    <PrizymPage title="Approvals Queue" subtitle="CRB, SGCC, and policy-gated approvals awaiting action">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--pg-border)', marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const active = tab === t;
          const count = t === 'all' ? APPROVALS.length : APPROVALS.filter(a => a.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 18px', background: 'transparent', border: 'none',
                borderBottom: active ? '2px solid var(--pg-operate)' : '2px solid transparent',
                color: active ? 'var(--pg-operate)' : 'var(--pg-text-muted)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {t} <span style={{ padding: '2px 8px', borderRadius: 10, background: active ? 'rgba(59,130,246,0.15)' : 'var(--pg-stripe)', fontSize: 14 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((a, i) => (
          <div
            key={a.id}
            className="pg-card-elevated"
            style={{
              borderLeft: `4px solid ${STATUS_COLORS[a.status]}`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s ease',
              transitionDelay: `${i * 0.05}s`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                  <span className="pg-overline" style={{ color: 'var(--pg-operate)' }}>{a.policyRef}</span>
                  <StatusBadge status={a.status} />
                  <StatusBadge status={a.priority} />
                </div>
                <h3 className="pg-subheading" style={{ marginBottom: 6 }}>{a.title}</h3>
                <p className="pg-caption" style={{ marginBottom: 10, lineHeight: 1.55 }}>{a.summary}</p>
              </div>
              {a.amount && (
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div className="pg-overline">Amount</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--pg-text)' }}>{formatMoney(a.amount)}</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 14, color: 'var(--pg-text-muted)', flexWrap: 'wrap', paddingTop: 10, borderTop: '1px solid var(--pg-border-faint)' }}>
              <span><strong style={{ color: 'var(--pg-text-secondary)' }}>Requestor:</strong> {a.requestor}</span>
              <span><strong style={{ color: 'var(--pg-text-secondary)' }}>Reviewer:</strong> {a.reviewer}</span>
              <span><strong style={{ color: 'var(--pg-text-secondary)' }}>Due:</strong> {a.decisionDueBy}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <MessageSquare size={14} /> {a.threadCount} comments
              </span>
            </div>
          </div>
        ))}
      </div>
    </PrizymPage>
  );
}
