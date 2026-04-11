'use client';

import { useState, useEffect, useMemo } from 'react';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { DOCUMENTS, getDocumentStats } from '@/data/prizym-governance/documents/catalog';
import {
  DOCUMENT_TYPE_LABELS, LIFECYCLE_STATUS_LABELS, isReviewOverdue,
  type DocumentType, type LifecycleStatus, type DocumentRecord,
} from '@/data/prizym-governance/documents/types';
import { FileText, BookOpen, ListChecks, ShieldCheck, LayoutTemplate, X, AlertTriangle } from 'lucide-react';

const TYPE_ICONS: Record<DocumentType, typeof FileText> = {
  comp_plan: FileText,
  policy: BookOpen,
  procedure: ListChecks,
  control: ShieldCheck,
  template: LayoutTemplate,
};

const ALL_TYPES: DocumentType[] = ['comp_plan', 'policy', 'procedure', 'control', 'template'];

const TODAY = new Date('2026-04-10');

export function DocumentsLibrary({ initialType = 'policy' }: { initialType?: DocumentType } = {}) {
  const [docType, setDocType] = useState<DocumentType>(initialType);
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

  // Reset category filter when type changes (categories vary per type)
  useEffect(() => { setCategoryFilter('all'); }, [docType]);

  const stats = getDocumentStats();
  const overdueCount = docs.filter(d => isReviewOverdue(d, TODAY)).length;

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Documents Library
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          {filtered.length} of {docs.length} {DOCUMENT_TYPE_LABELS[docType].toLowerCase()} shown · {overdueCount} review overdue · filter by type below.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.22)', marginBottom: 14, flexWrap: 'wrap' }}>
        {ALL_TYPES.map((t) => {
          const Icon = TYPE_ICONS[t];
          const active = t === docType;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setDocType(t)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid var(--pg-cyan-bright)' : '2px solid transparent',
                color: active ? 'var(--pg-cyan-bright)' : '#ffffff',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <Icon size={16} strokeWidth={2.4} />
              {DOCUMENT_TYPE_LABELS[t]}
              <span style={{ padding: '3px 10px', borderRadius: 10, background: active ? 'rgba(125,211,252,0.22)' : 'rgba(255,255,255,0.1)', fontSize: 14, fontWeight: 700 }}>
                {stats.byType[t]}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['all', 'draft', 'in_review', 'approved', 'published', 'superseded'] as const).map((s) => {
            const active = statusFilter === s;
            return (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '8px 14px', borderRadius: 16,
                background: active ? 'rgba(240, 171, 252, 0.22)' : 'rgba(255,255,255,0.06)',
                border: active ? '1.5px solid var(--pg-success-bright)' : '1px solid rgba(255,255,255,0.2)',
                color: active ? 'var(--pg-success-bright)' : '#ffffff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
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
            style={{
              padding: '10px 14px',
              background: 'rgba(15, 23, 42, 0.55)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 10,
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      <div className="pg-card" style={{ padding: 0, overflow: 'hidden', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="pg-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(15, 23, 42, 0.72)', backdropFilter: 'blur(12px)', zIndex: 1 }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.24)' }}>
                {['Code', 'Title', 'Category', 'Status', 'Version', 'Owner', 'Next Review', 'Attestation'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 14, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
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
                      borderBottom: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
                      opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease, background 0.15s ease', transitionDelay: `${i * 0.02}s`,
                    }}
                    onMouseEnter={(ev) => { ev.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={(ev) => { ev.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d.code}</td>
                    <td style={{ padding: '14px 16px', fontSize: 15, fontWeight: 700, color: '#ffffff' }}>
                      {d.title}
                      {overdue && (
                        <span style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 10, background: 'rgba(252,165,165,0.2)', color: 'var(--pg-danger-bright)', border: '1px solid var(--pg-danger-bright)', fontSize: 14, fontWeight: 800, letterSpacing: '0.04em' }}>
                          <AlertTriangle size={14} strokeWidth={2.4} /> REVIEW OVERDUE
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#ffffff' }}>{d.category}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={d.status} /></td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#f1f5f9' }}>v{d.version}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#ffffff' }}>{d.owner}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: overdue ? 'var(--pg-danger-bright)' : '#f1f5f9', fontWeight: overdue ? 700 : 400 }}>{d.nextReview}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#ffffff', fontWeight: 700 }}>
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
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <aside
            onClick={e => e.stopPropagation()}
            className="pg-scroll"
            style={{
              width: 'min(820px, 92vw)',
              height: '100%',
              overflowY: 'auto',
              padding: '32px 36px',
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(24px) saturate(150%)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.28)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--pg-cyan-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selected.code} · {DOCUMENT_TYPE_LABELS[selected.type]}</div>
                <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#ffffff', marginTop: 6, lineHeight: 1.2 }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="pg-icon-bubble" style={{ border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                <X size={20} color="#ffffff" strokeWidth={2.4} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 22 }}>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                <div style={{ marginTop: 5 }}><StatusBadge status={selected.status} /></div>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Version</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>v{selected.version}</div>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{selected.owner}</div>
              </div>
              <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Review</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{selected.nextReview}</div>
              </div>
              {selected.attestationPct !== undefined && (
                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attestation</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{selected.attestationPct}% of {selected.targetAudience}</div>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Description</h3>
            <p style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.7, marginBottom: 22 }}>{selected.description}</p>

            {selected.content && (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Content</h3>
                <div style={{ fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: '#ffffff', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                  {selected.content}
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
