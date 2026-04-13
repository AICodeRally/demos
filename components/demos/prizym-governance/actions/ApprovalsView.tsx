'use client';

import { useState, useEffect, useMemo } from 'react';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { showDemoToast } from '@/components/demos/prizym-governance/Toast';
import { APPROVALS, type ApprovalItem, type ApprovalStatus } from '@/data/prizym-governance/operate';
import { CheckSquare, AlertTriangle, Clock, ShieldCheck, MessageSquare, Check, X, ArrowUpRight } from 'lucide-react';

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

export function ApprovalsView() {
  const [tab, setTab] = useState<FilterTab>('all');
  const [approvals, setApprovals] = useState<ApprovalItem[]>(() => [...APPROVALS]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = useMemo(() => ({
    pending: approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    escalated: approvals.filter(a => a.status === 'escalated').length,
    highPriority: approvals.filter(a => a.priority === 'high').length,
  }), [approvals]);

  const filtered = tab === 'all' ? approvals : approvals.filter(a => a.status === tab);

  const metrics = [
    { label: 'Pending', value: String(stats.pending), icon: Clock, color: 'var(--pg-warning-bright)' },
    { label: 'Approved', value: String(stats.approved), icon: CheckSquare, color: 'var(--pg-success-bright)' },
    { label: 'Escalated', value: String(stats.escalated), icon: AlertTriangle, color: 'var(--pg-oversee-bright)' },
    { label: 'High Priority', value: String(stats.highPriority), icon: ShieldCheck, color: 'var(--pg-danger-bright)' },
  ];

  const tabs: FilterTab[] = ['all', 'pending', 'approved', 'escalated', 'rejected'];

  function updateStatus(id: string, next: ApprovalStatus, verb: string) {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: next } : a));
    const item = approvals.find(a => a.id === id);
    showDemoToast(`${verb} · ${item?.policyRef ?? ''} ${item?.title ?? ''}`.trim(), next === 'rejected' ? 'warning' : 'success');
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.05} />)}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const active = tab === t;
          const count = t === 'all' ? approvals.length : approvals.filter(a => a.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 16px', borderRadius: 20,
                background: active ? 'rgba(147, 197, 253, 0.18)' : 'rgba(255,255,255,0.06)',
                border: active ? '1.5px solid var(--pg-operate-bright)' : '1px solid rgba(255,255,255,0.2)',
                color: active ? 'var(--pg-operate-bright)' : '#ffffff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
              }}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        {filtered.map((a, i) => (
          <div
            key={a.id}
            style={{
              padding: '14px 16px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.12)',
              borderTop: '1px solid rgba(255, 255, 255, 0.22)',
              borderRight: '1px solid rgba(255, 255, 255, 0.22)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.22)',
              borderLeft: `5px solid ${STATUS_COLORS[a.status]}`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s ease',
              transitionDelay: `${i * 0.03}s`,
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 6, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-operate-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{a.policyRef}</span>
                  <StatusBadge status={a.status} />
                  <StatusBadge status={a.priority} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: 4 }}>{a.title}</h3>
                <p style={{ fontSize: 14, color: '#f1f5f9', lineHeight: 1.5, marginBottom: 6 }}>{a.summary}</p>
              </div>
              {a.amount && (
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginTop: 2 }}>{formatMoney(a.amount)}</div>
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
            {a.status === 'pending' && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.16)', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => updateStatus(a.id, 'approved', 'Approved')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '9px 18px',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: 10, color: '#ffffff',
                    fontSize: 14, fontWeight: 800, cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(14,165,233,0.28)',
                  }}
                >
                  <Check size={15} strokeWidth={2.8} /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(a.id, 'rejected', 'Rejected')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '9px 18px',
                    background: 'rgba(252,165,165,0.14)',
                    border: '1.5px solid var(--pg-danger-bright)',
                    borderRadius: 10, color: 'var(--pg-danger-bright)',
                    fontSize: 14, fontWeight: 800, cursor: 'pointer',
                  }}
                >
                  <X size={15} strokeWidth={2.8} /> Reject
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(a.id, 'escalated', 'Escalated')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '9px 18px',
                    background: 'rgba(196,181,252,0.14)',
                    border: '1.5px solid var(--pg-oversee-bright)',
                    borderRadius: 10, color: 'var(--pg-oversee-bright)',
                    fontSize: 14, fontWeight: 800, cursor: 'pointer',
                  }}
                >
                  <ArrowUpRight size={15} strokeWidth={2.8} /> Escalate
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
