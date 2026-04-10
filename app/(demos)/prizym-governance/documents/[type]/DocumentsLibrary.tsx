'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { DOCUMENTS, getDocumentStats } from '@/data/prizym-governance/documents/catalog';
import {
  DOCUMENT_TYPE_LABELS, LIFECYCLE_STATUS_LABELS, isReviewOverdue,
  type DocumentType, type LifecycleStatus, type DocumentRecord,
} from '@/data/prizym-governance/documents/types';
import { FileText, BookOpen, ListChecks, ShieldCheck, LayoutTemplate, X, AlertTriangle } from 'lucide-react';

export const URL_TO_TYPE: Record<string, DocumentType> = {
  'comp-plans': 'comp_plan',
  'policies': 'policy',
  'procedures': 'procedure',
  'controls': 'control',
  'templates': 'template',
};

const TYPE_TO_URL: Record<DocumentType, string> = {
  comp_plan: 'comp-plans',
  policy: 'policies',
  procedure: 'procedures',
  control: 'controls',
  template: 'templates',
};

const TYPE_ICONS: Record<DocumentType, typeof FileText> = {
  comp_plan: FileText,
  policy: BookOpen,
  procedure: ListChecks,
  control: ShieldCheck,
  template: LayoutTemplate,
};

const TODAY = new Date('2026-04-10');

export function DocumentsLibrary({ typeSlug }: { typeSlug: string }) {
  const docType = URL_TO_TYPE[typeSlug];

  const [statusFilter, setStatusFilter] = useState<LifecycleStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selected, setSelected] = useState<DocumentRecord | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const docs = useMemo(() => DOCUMENTS.filter((d) => d.type === docType), [docType]);
  const categories = useMemo(() => Array.from(new Set(docs.map(d => d.category))), [docs]);
  const filtered = useMemo(
    () => docs.filter(d =>
      (statusFilter === 'all' || d.status === statusFilter) &&
      (categoryFilter === 'all' || d.category === categoryFilter)
    ),
    [docs, statusFilter, categoryFilter]
  );

  const stats = getDocumentStats();
  const overdueCount = docs.filter(d => isReviewOverdue(d, TODAY)).length;

  const tabs: DocumentType[] = ['comp_plan', 'policy', 'procedure', 'control', 'template'];

  return (
    <PrizymPage
      title={`${DOCUMENT_TYPE_LABELS[docType]}`}
      subtitle={`${filtered.length} of ${docs.length} ${DOCUMENT_TYPE_LABELS[docType].toLowerCase()} shown · ${overdueCount} review overdue`}
    >
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--pg-border)', marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map((t) => {
          const Icon = TYPE_ICONS[t];
          const active = t === docType;
          return (
            <Link
              key={t}
              href={`/prizym-governance/documents/${TYPE_TO_URL[t]}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 18px',
                borderBottom: active ? '2px solid var(--pg-cyan)' : '2px solid transparent',
                color: active ? 'var(--pg-cyan)' : 'var(--pg-text-muted)',
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
              }}
            >
              <Icon size={16} />
              {DOCUMENT_TYPE_LABELS[t]}
              <span style={{ padding: '2px 8px', borderRadius: 10, background: active ? 'rgba(14,165,233,0.15)' : 'var(--pg-stripe)', fontSize: 12, fontWeight: 700 }}>
                {stats.byType[t]}
              </span>
            </Link>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['all', 'draft', 'in_review', 'approved', 'published', 'superseded'] as const).map((s) => {
            const active = statusFilter === s;
            return (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '6px 12px', borderRadius: 16,
                background: active ? 'rgba(16,185,129,0.2)' : 'var(--pg-stripe)',
                border: active ? '1px solid rgba(16,185,129,0.5)' : '1px solid var(--pg-border)',
                color: active ? '#10b981' : 'var(--pg-text-muted)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              }}>
                {s === 'all' ? 'All Status' : LIFECYCLE_STATUS_LABELS[s as LifecycleStatus]}
              </button>
            );
          })}
        </div>
        {categories.length > 1 && (
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ padding: '8px 12px', background: 'var(--pg-card)', border: '1px solid var(--pg-border)', borderRadius: 8, color: 'var(--pg-text)', fontSize: 14 }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      <div className="pg-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--pg-surface-alt)', borderBottom: '1px solid var(--pg-border)' }}>
                {['Code', 'Title', 'Category', 'Status', 'Version', 'Owner', 'Next Review', 'Attestation'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const overdue = isReviewOverdue(d, TODAY);
                return (
                  <tr
                    key={d.id}
                    onClick={() => setSelected(d)}
                    style={{
                      borderBottom: '1px solid var(--pg-border-faint)', cursor: 'pointer',
                      opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease', transitionDelay: `${i * 0.02}s`,
                    }}
                  >
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--pg-cyan)' }}>{d.code}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>
                      {d.title}
                      {overdue && (
                        <span style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 10, background: 'rgba(239,68,68,0.22)', color: '#fca5a5', fontSize: 11, fontWeight: 700 }}>
                          <AlertTriangle size={11} /> REVIEW OVERDUE
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{d.category}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={d.status} /></td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-muted)' }}>v{d.version}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{d.owner}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: overdue ? '#fca5a5' : 'var(--pg-text-muted)' }}>{d.nextReview}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text)', fontWeight: 600 }}>
                      {d.attestationPct !== undefined ? `${d.attestationPct}%` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <aside onClick={e => e.stopPropagation()} className="pg-card" style={{ width: 'min(820px, 92vw)', height: '100%', overflowY: 'auto', borderRadius: 0, padding: '28px 36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>{selected.code} · {DOCUMENT_TYPE_LABELS[selected.type]}</span>
                <h2 className="pg-heading" style={{ marginTop: 4 }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--pg-text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Status</div>
                <div style={{ marginTop: 4 }}><StatusBadge status={selected.status} /></div>
              </div>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Version</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>v{selected.version}</div>
              </div>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Owner</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.owner}</div>
              </div>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Next Review</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.nextReview}</div>
              </div>
              {selected.attestationPct !== undefined && (
                <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                  <div className="pg-overline" style={{ fontSize: 11 }}>Attestation</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.attestationPct}% of {selected.targetAudience}</div>
                </div>
              )}
            </div>

            <h3 className="pg-subheading" style={{ marginBottom: 10 }}>Description</h3>
            <p className="pg-caption" style={{ lineHeight: 1.7, marginBottom: 20 }}>{selected.description}</p>

            {selected.content && (
              <>
                <h3 className="pg-subheading" style={{ marginBottom: 10 }}>Content</h3>
                <div style={{ fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--pg-text)', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                  {selected.content}
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </PrizymPage>
  );
}
