'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, Save } from 'lucide-react';
import {
  DOCUMENT_TYPE_LABELS, LIFECYCLE_STATUS_LABELS,
  type DocumentType, type LifecycleStatus, type DocumentRecord,
} from '@/data/prizym-governance/documents/types';

interface DocumentFormModalProps {
  doc: DocumentRecord | null;
  defaultType: DocumentType;
  existingCategories: string[];
  onSave: (doc: DocumentRecord) => void;
  onClose: () => void;
}

const DOC_TYPES: DocumentType[] = ['comp_plan', 'policy', 'procedure', 'control', 'template'];
const DOC_STATUSES: LifecycleStatus[] = ['draft', 'in_review', 'approved', 'published', 'superseded', 'retired'];

function emptyDoc(type: DocumentType): DocumentRecord {
  const today = new Date().toISOString().slice(0, 10);
  const oneYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return {
    id: `doc-${Date.now().toString(36)}`,
    type,
    code: '',
    title: '',
    category: '',
    status: 'draft',
    version: '1.0',
    effectiveDate: today,
    nextReview: oneYear,
    owner: '',
    description: '',
    content: '',
  };
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 800,
  color: '#f1f5f9',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(15, 23, 42, 0.55)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  borderRadius: 10,
  color: '#ffffff',
  fontSize: 15,
  fontWeight: 600,
  outline: 'none',
  fontFamily: 'inherit',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  lineHeight: 1.5,
  fontWeight: 500,
};

export function DocumentFormModal({
  doc,
  defaultType,
  existingCategories,
  onSave,
  onClose,
}: DocumentFormModalProps) {
  const isEdit = doc !== null;
  const [form, setForm] = useState<DocumentRecord>(() => doc ?? emptyDoc(defaultType));
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSave();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const missing = useMemo(() => {
    const m: string[] = [];
    if (!form.code.trim()) m.push('Code');
    if (!form.title.trim()) m.push('Title');
    if (!form.category.trim()) m.push('Category');
    if (!form.owner.trim()) m.push('Owner');
    return m;
  }, [form]);

  function update<K extends keyof DocumentRecord>(key: K, value: DocumentRecord[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    setTouched(true);
    if (missing.length > 0) return;
    onSave(form);
  }

  const primary = 'var(--pg-cyan-bright)'; // #7dd3fc — forge cyan bright

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pg-scroll"
        style={{
          width: 'min(880px, 96vw)',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(24px) saturate(150%)',
          border: '1px solid rgba(255, 255, 255, 0.28)',
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(15,23,42,0.5)',
          padding: '30px 36px 32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: primary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {isEdit ? 'Edit Document' : 'New Document'}
            </div>
            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#ffffff', marginTop: 6, lineHeight: 1.2 }}>
              {isEdit ? form.title || 'Untitled' : `New ${DOCUMENT_TYPE_LABELS[form.type].slice(0, -1)}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="pg-icon-bubble"
            style={{ border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
            aria-label="Close"
          >
            <X size={20} color="#ffffff" strokeWidth={2.4} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Code *</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => update('code', e.target.value)}
              placeholder="e.g. POL-COMP-042"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Version</label>
            <input
              type="text"
              value={form.version}
              onChange={(e) => update('version', e.target.value)}
              placeholder="1.0"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Quota Adjustment Policy"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Type</label>
            <select value={form.type} onChange={(e) => update('type', e.target.value as DocumentType)} style={inputStyle}>
              {DOC_TYPES.map((t) => (
                <option key={t} value={t} style={{ background: '#0f172a', color: '#ffffff' }}>
                  {DOCUMENT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value as LifecycleStatus)} style={inputStyle}>
              {DOC_STATUSES.map((s) => (
                <option key={s} value={s} style={{ background: '#0f172a', color: '#ffffff' }}>
                  {LIFECYCLE_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Category *</label>
            <input
              type="text"
              list="pg-doc-categories"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              placeholder="e.g. Sales, SOX, ASC 606"
              style={inputStyle}
            />
            <datalist id="pg-doc-categories">
              {existingCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label style={labelStyle}>Owner *</label>
            <input
              type="text"
              value={form.owner}
              onChange={(e) => update('owner', e.target.value)}
              placeholder="e.g. VP Sales Ops"
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Effective Date</label>
            <input
              type="date"
              value={form.effectiveDate}
              onChange={(e) => update('effectiveDate', e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>
          <div>
            <label style={labelStyle}>Next Review</label>
            <input
              type="date"
              value={form.nextReview}
              onChange={(e) => update('nextReview', e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
            placeholder="Short summary of what this document covers and who it applies to."
            style={textareaStyle}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>Content (optional)</label>
          <textarea
            value={form.content ?? ''}
            onChange={(e) => update('content', e.target.value)}
            rows={8}
            placeholder="Full body (markdown supported in the detail panel)."
            style={textareaStyle}
          />
        </div>

        {touched && missing.length > 0 && (
          <div
            style={{
              padding: '12px 16px',
              marginBottom: 16,
              background: 'rgba(252,165,165,0.14)',
              border: '1px solid var(--pg-danger-bright)',
              borderRadius: 10,
              color: 'var(--pg-danger-bright)',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Missing required: {missing.join(', ')}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#cbd5e1', marginRight: 'auto' }}>
            <kbd style={{ padding: '2px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.22)', fontSize: 12 }}>Esc</kbd> close ·{' '}
            <kbd style={{ padding: '2px 7px', borderRadius: 5, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.22)', fontSize: 12 }}>⌘↵</kbd> save
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '11px 22px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.24)',
              borderRadius: 10,
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={touched && missing.length > 0}
            style={{
              padding: '11px 22px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 60%, #8b5cf6 100%)',
              border: '1px solid rgba(255,255,255,0.35)',
              borderRadius: 10,
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 8px 24px rgba(14,165,233,0.3)',
            }}
          >
            <Save size={16} strokeWidth={2.4} />
            {isEdit ? 'Save Changes' : 'Create Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
