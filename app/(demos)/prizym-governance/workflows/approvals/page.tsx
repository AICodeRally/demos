'use client';

import { useState, useEffect } from 'react';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { APPROVALS, getApprovalStats, type ApprovalStatus } from '@/data/prizym-governance/operate';
import { CheckSquare, AlertTriangle, Clock, ShieldCheck, MessageSquare } from 'lucide-react';

type FilterTab = 'all' | ApprovalStatus;

const STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: 'var(--pg-warning-bright)',
  approved: 'var(--pg-success-bright)',
  rejected: 'var(--pg-danger-bright)',
  escalated: 'var(--pg-oversee-bright)',
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
    { label: 'Pending', value: String(stats.pending), icon: Clock, color: 'var(--pg-warning-bright)' },
    { label: 'Approved', value: String(stats.approved), icon: CheckSquare, color: 'var(--pg-success-bright)' },
    { label: 'Escalated', value: String(stats.escalated), icon: AlertTriangle, color: 'var(--pg-oversee-bright)' },
    { label: 'High Priority', value: String(stats.highPriority), icon: ShieldCheck, color: 'var(--pg-danger-bright)' },
  ];

  const tabs: FilterTab[] = ['all', 'pending', 'approved', 'escalated', 'rejected'];

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Approvals Queue
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          CRB, SGCC, and policy-gated approvals awaiting action.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.22)', marginBottom: 14, flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const active = tab === t;
          const count = t === 'all' ? APPROVALS.length : APPROVALS.filter(a => a.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 18px', background: 'transparent', border: 'none',
                borderBottom: active ? '2px solid var(--pg-operate-bright)' : '2px solid transparent',
                color: active ? 'var(--pg-operate-bright)' : '#ffffff',
                fontSize: 15, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {t} <span style={{ padding: '3px 10px', borderRadius: 10, background: active ? 'rgba(147, 197, 253, 0.22)' : 'rgba(255,255,255,0.1)', fontSize: 14, fontWeight: 700 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        {filtered.map((a, i) => (
          <div
            key={a.id}
            style={{
              padding: '16px 18px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.12)',
              borderTop: '1px solid rgba(255, 255, 255, 0.22)',
              borderRight: '1px solid rgba(255, 255, 255, 0.22)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
              borderLeft: `5px solid ${STATUS_COLORS[a.status]}`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s ease',
              transitionDelay: `${i * 0.04}s`,
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 6, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-operate-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{a.policyRef}</span>
                  <StatusBadge status={a.status} />
                  <StatusBadge status={a.priority} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: 4 }}>{a.title}</h3>
                <p style={{ fontSize: 15, color: '#f1f5f9', lineHeight: 1.5, marginBottom: 8 }}>{a.summary}</p>
              </div>
              {a.amount && (
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginTop: 2 }}>{formatMoney(a.amount)}</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 14, color: '#ffffff', flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.16)' }}>
              <span><strong style={{ color: '#f1f5f9', fontWeight: 700 }}>Requestor:</strong> {a.requestor}</span>
              <span><strong style={{ color: '#f1f5f9', fontWeight: 700 }}>Reviewer:</strong> {a.reviewer}</span>
              <span><strong style={{ color: '#f1f5f9', fontWeight: 700 }}>Due:</strong> {a.decisionDueBy}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <MessageSquare size={14} strokeWidth={2.4} /> {a.threadCount} comments
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
