'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { GOVERNANCE_FRAMEWORK } from '@/data/prizym-governance/engine/framework';
import { SCP_POLICIES } from '@/data/prizym-governance/policies';
import { asc606Policies, asc606Frameworks, asc606Templates } from '@/data/prizym-governance/asc606';
import { APPROVALS, DECISIONS } from '@/data/prizym-governance/operate';
import { DISPUTE_CASES } from '@/data/prizym-governance/dispute';
import { Search, BookOpen, FileText, Gavel, CheckSquare, Briefcase, Grid3x3 } from 'lucide-react';

interface SearchResult {
  kind: 'checkpoint' | 'policy' | 'framework' | 'template' | 'approval' | 'decision' | 'dispute';
  id: string;
  title: string;
  snippet: string;
  href: string;
  badge: string;
  color: string;
  icon: typeof Search;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const phase of GOVERNANCE_FRAMEWORK.phases) {
    for (const cp of phase.checkpoints) {
      results.push({
        kind: 'checkpoint',
        id: cp.id,
        title: cp.label,
        snippet: cp.description,
        href: '/prizym-governance/library/framework',
        badge: `${cp.id.toUpperCase()} · ${phase.name}`,
        color: '#06b6d4',
        icon: Grid3x3,
      });
    }
  }

  for (const p of SCP_POLICIES) {
    results.push({
      kind: 'policy',
      id: p.id,
      title: p.title,
      snippet: p.description,
      href: '/prizym-governance/policies',
      badge: `${p.code} · ${p.category}`,
      color: '#8b5cf6',
      icon: BookOpen,
    });
  }

  for (const p of asc606Policies) {
    results.push({
      kind: 'policy',
      id: p.id,
      title: p.name,
      snippet: p.description ?? '',
      href: '/prizym-governance/design/asc606-library',
      badge: `ASC 606 · ${p.category ?? 'Policy'}`,
      color: '#8b5cf6',
      icon: BookOpen,
    });
  }

  for (const f of asc606Frameworks) {
    results.push({
      kind: 'framework',
      id: f.id,
      title: f.title,
      snippet: f.content.slice(0, 240),
      href: '/prizym-governance/design/asc606-library',
      badge: `${f.code} · Framework`,
      color: '#0ea5e9',
      icon: FileText,
    });
  }

  for (const t of asc606Templates) {
    results.push({
      kind: 'template',
      id: t.id,
      title: t.name,
      snippet: t.description ?? '',
      href: '/prizym-governance/design/asc606-library',
      badge: `${t.code} · Template`,
      color: '#3b82f6',
      icon: FileText,
    });
  }

  for (const a of APPROVALS) {
    results.push({
      kind: 'approval',
      id: a.id,
      title: a.title,
      snippet: a.summary,
      href: '/prizym-governance/operate/approvals',
      badge: `${a.policyRef} · ${a.status}`,
      color: '#f59e0b',
      icon: CheckSquare,
    });
  }

  for (const d of DECISIONS) {
    results.push({
      kind: 'decision',
      id: d.id,
      title: d.title,
      snippet: d.rationale,
      href: '/prizym-governance/operate/decisions',
      badge: `${d.policyRef} · ${d.decision}`,
      color: '#10b981',
      icon: Gavel,
    });
  }

  for (const c of DISPUTE_CASES) {
    results.push({
      kind: 'dispute',
      id: c.id,
      title: c.title,
      snippet: c.summary,
      href: '/prizym-governance/dispute/cases',
      badge: `${c.caseNumber} · ${c.status.replace('_', ' ')}`,
      color: '#6366f1',
      icon: Briefcase,
    });
  }

  return results;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<SearchResult['kind'] | 'all'>('all');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    const base = kindFilter === 'all' ? index : index.filter(r => r.kind === kindFilter);
    if (!q) return base.slice(0, 40);
    return base.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.snippet.toLowerCase().includes(q) ||
      r.badge.toLowerCase().includes(q)
    );
  }, [query, kindFilter, index]);

  const kinds: Array<SearchResult['kind'] | 'all'> = ['all', 'checkpoint', 'policy', 'framework', 'template', 'approval', 'decision', 'dispute'];
  const kindLabel: Record<SearchResult['kind'] | 'all', string> = {
    all: 'All',
    checkpoint: '88-Checkpoints',
    policy: 'Policies',
    framework: 'Frameworks',
    template: 'Templates',
    approval: 'Approvals',
    decision: 'Decisions',
    dispute: 'Disputes',
  };

  return (
    <PrizymPage title="Universal Search" subtitle="Search across 88 checkpoints, policies, frameworks, approvals, decisions, and disputes">
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--pg-text-muted)' }} />
        <input
          type="text"
          placeholder="Search policies, frameworks, approvals, decisions, cases..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
          style={{
            width: '100%', padding: '16px 16px 16px 48px',
            background: 'var(--pg-card)', border: '1px solid var(--pg-border)', borderRadius: 12,
            color: 'var(--pg-text)', fontSize: 16,
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {kinds.map(k => {
          const active = kindFilter === k;
          const count = k === 'all' ? index.length : index.filter(r => r.kind === k).length;
          return (
            <button
              key={k}
              onClick={() => setKindFilter(k)}
              style={{
                padding: '6px 14px', borderRadius: 20,
                background: active ? 'rgba(14,165,233,0.15)' : 'var(--pg-stripe)',
                border: active ? '1px solid rgba(14,165,233,0.5)' : '1px solid var(--pg-border)',
                color: active ? 'var(--pg-cyan)' : 'var(--pg-text-muted)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {kindLabel[k]} ({count})
            </button>
          );
        })}
      </div>

      <div className="pg-caption" style={{ marginBottom: 14 }}>
        {query ? (
          <>Found <strong style={{ color: 'var(--pg-text)' }}>{results.length}</strong> results for &ldquo;{query}&rdquo;</>
        ) : (
          <>Showing <strong style={{ color: 'var(--pg-text)' }}>{Math.min(40, results.length)}</strong> of <strong style={{ color: 'var(--pg-text)' }}>{index.length}</strong> indexed items</>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {results.map((r, i) => {
          const Icon = r.icon;
          return (
            <Link
              key={`${r.kind}-${r.id}-${i}`}
              href={r.href}
              className="pg-card"
              style={{
                display: 'flex', gap: 14, textDecoration: 'none', alignItems: 'flex-start',
                borderLeft: `3px solid ${r.color}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-4px)',
                transition: 'all 0.3s ease',
                transitionDelay: `${i * 0.02}s`,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${r.color}18`, border: `1px solid ${r.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={16} style={{ color: r.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span className="pg-overline" style={{ color: r.color, fontSize: 14 }}>{r.badge}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)', marginBottom: 4, lineHeight: 1.3 }}>{r.title}</h3>
                <p className="pg-caption" style={{ fontSize: 14, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {r.snippet}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </PrizymPage>
  );
}
