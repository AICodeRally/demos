'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import {
  asc606Frameworks,
  asc606Policies,
  asc606Templates,
} from '@/data/prizym-governance/asc606';
import type {
  GovernanceFramework,
  Policy,
  PlanTemplate,
} from '@/data/prizym-governance/asc606';
import { ChevronRight, BookOpen, FileText, LayoutTemplate, Landmark, X } from 'lucide-react';

type Tab = 'frameworks' | 'policies' | 'templates';

interface OpenItem {
  kind: Tab;
  id: string;
}

export default function ASC606LibraryPage() {
  const [tab, setTab] = useState<Tab>('frameworks');
  const [open, setOpen] = useState<OpenItem | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedFramework: GovernanceFramework | undefined =
    open?.kind === 'frameworks' ? asc606Frameworks.find((f) => f.id === open.id) : undefined;
  const selectedPolicy: Policy | undefined =
    open?.kind === 'policies' ? asc606Policies.find((p) => p.id === open.id) : undefined;
  const selectedTemplate: PlanTemplate | undefined =
    open?.kind === 'templates' ? asc606Templates.find((t) => t.id === open.id) : undefined;

  const tabs: { id: Tab; label: string; count: number; icon: typeof BookOpen }[] = [
    { id: 'frameworks', label: 'Frameworks', count: asc606Frameworks.length, icon: Landmark },
    { id: 'policies', label: 'Policies', count: asc606Policies.length, icon: BookOpen },
    { id: 'templates', label: 'Templates', count: asc606Templates.length, icon: LayoutTemplate },
  ];

  return (
    <PrizymPage
      title="ASC 606 Library"
      subtitle="Revenue recognition frameworks, policies, and templates — GAAP-compliant reference content"
      mode="design"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          href="/prizym-governance/design"
          className="pg-caption"
          style={{ textDecoration: 'none' }}
        >
          Design
        </Link>
        <ChevronRight size={14} style={{ color: 'var(--pg-text-muted)' }} />
        <span className="pg-caption" style={{ color: 'var(--pg-cyan)', fontWeight: 600 }}>
          ASC 606 Library
        </span>
      </nav>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          borderBottom: '1px solid var(--pg-border)',
        }}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setOpen(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid var(--pg-cyan)' : '2px solid transparent',
                color: active ? 'var(--pg-cyan)' : 'var(--pg-text-muted)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={16} />
              {t.label}
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 10,
                  background: active ? 'var(--pg-cyan-bg)' : 'var(--pg-stripe)',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card grid */}
      {tab === 'frameworks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {asc606Frameworks.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setOpen({ kind: 'frameworks', id: f.id })}
              className="pg-card-elevated"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                border: 'none',
                width: '100%',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.1 + i * 0.08}s`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>
                  {f.code}
                </span>
                <span className="pg-tag" style={{ fontSize: 14 }}>
                  {f.status}
                </span>
              </div>
              <h3 className="pg-subheading" style={{ marginBottom: 6 }}>
                {f.title}
              </h3>
              <p className="pg-caption" style={{ marginBottom: 10 }}>
                {f.category} · v{f.version} · {f.isMandatory ? 'Mandatory' : 'Optional'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--pg-cyan)', fontSize: 14, fontWeight: 600 }}>
                Read framework
                <ChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>
      )}

      {tab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {asc606Policies.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setOpen({ kind: 'policies', id: p.id })}
              className="pg-card-elevated"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                border: 'none',
                width: '100%',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.1 + i * 0.08}s`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="pg-overline" style={{ color: 'var(--pg-oversee)' }}>
                  {p.id.replace('pol-asc606-', 'SCP-').toUpperCase()}
                </span>
                <span className="pg-tag" style={{ fontSize: 14 }}>
                  {p.status}
                </span>
              </div>
              <h3 className="pg-subheading" style={{ marginBottom: 6 }}>
                {p.name}
              </h3>
              <p className="pg-caption" style={{ marginBottom: 10, lineHeight: 1.5 }}>
                {p.description}
              </p>
              <p className="pg-caption" style={{ fontSize: 14 }}>
                {p.category} · v{p.version}
              </p>
            </button>
          ))}
        </div>
      )}

      {tab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {asc606Templates.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setOpen({ kind: 'templates', id: t.id })}
              className="pg-card-elevated"
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                border: 'none',
                width: '100%',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.1 + i * 0.08}s`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="pg-overline" style={{ color: 'var(--pg-operate)' }}>
                  {t.code}
                </span>
                <span className="pg-tag" style={{ fontSize: 14 }}>
                  {t.status}
                </span>
              </div>
              <h3 className="pg-subheading" style={{ marginBottom: 6 }}>
                {t.name}
              </h3>
              <p className="pg-caption" style={{ marginBottom: 10, lineHeight: 1.5 }}>
                {t.description}
              </p>
              {t.tags && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {t.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="pg-tag" style={{ fontSize: 14 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Drawer for selected item */}
      {open && (
        <div
          onClick={() => setOpen(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 60,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="pg-card"
            style={{
              width: 'min(880px, 92vw)',
              height: '100%',
              overflowY: 'auto',
              borderRadius: 0,
              padding: '28px 36px',
              boxShadow: '-24px 0 60px rgba(0,0,0,0.4)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 18,
              }}
            >
              <div>
                <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>
                  {selectedFramework?.code ??
                    selectedTemplate?.code ??
                    (selectedPolicy ? selectedPolicy.id.replace('pol-asc606-', 'SCP-').toUpperCase() : '')}
                </span>
                <h2 className="pg-heading" style={{ marginTop: 4 }}>
                  {selectedFramework?.title ?? selectedPolicy?.name ?? selectedTemplate?.name}
                </h2>
              </div>
              <button
                onClick={() => setOpen(null)}
                style={{
                  background: 'var(--pg-surface-alt)',
                  border: '1px solid var(--pg-border)',
                  borderRadius: 8,
                  padding: 8,
                  cursor: 'pointer',
                  color: 'var(--pg-text-muted)',
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {selectedFramework && (
              <MarkdownBlock content={selectedFramework.content} />
            )}
            {selectedPolicy && <MarkdownBlock content={selectedPolicy.content} />}
            {selectedTemplate && (
              <div>
                <p className="pg-caption" style={{ marginBottom: 12 }}>
                  {selectedTemplate.description}
                </p>
                <div
                  className="pg-card"
                  style={{ padding: 16, background: 'var(--pg-surface-alt)' }}
                >
                  <p className="pg-overline" style={{ marginBottom: 10 }}>
                    Metadata
                  </p>
                  <pre
                    style={{
                      fontSize: 14,
                      color: 'var(--pg-text-secondary)',
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {JSON.stringify(selectedTemplate.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </PrizymPage>
  );
}

function MarkdownBlock({ content }: { content: string }) {
  return (
    <div
      className="pg-prose"
      style={{
        color: 'var(--pg-text)',
        fontSize: 14,
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      {content}
    </div>
  );
}
