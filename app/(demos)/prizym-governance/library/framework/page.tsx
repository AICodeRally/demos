'use client';

import { useState, useEffect, useMemo } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { GOVERNANCE_FRAMEWORK } from '@/data/prizym-governance/engine/framework';
import { Grid3x3, ShieldCheck, Search, ChevronDown, ChevronRight } from 'lucide-react';

const QUADRANT_COLORS: Record<string, string> = {
  design: '#06b6d4',
  operate: '#3b82f6',
  dispute: '#6366f1',
  oversee: '#8b5cf6',
};

export default function FrameworkBrowserPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<number>>(new Set([1]));
  const [quadrantFilter, setQuadrantFilter] = useState<string>('all');
  const [soxOnly, setSoxOnly] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return GOVERNANCE_FRAMEWORK.phases
      .filter(p => quadrantFilter === 'all' || p.quadrant === quadrantFilter)
      .map(p => ({
        ...p,
        checkpoints: p.checkpoints.filter(c => {
          if (soxOnly && !c.soxRelevant) return false;
          if (!q) return true;
          return c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.id.includes(q);
        }),
      }))
      .filter(p => p.checkpoints.length > 0);
  }, [search, quadrantFilter, soxOnly]);

  const totalVisible = filtered.reduce((sum, p) => sum + p.checkpoints.length, 0);
  const soxCount = GOVERNANCE_FRAMEWORK.phases.reduce((s, p) => s + p.checkpoints.filter(c => c.soxRelevant).length, 0);

  const togglePhase = (num: number) => {
    const next = new Set(expanded);
    if (next.has(num)) next.delete(num); else next.add(num);
    setExpanded(next);
  };

  return (
    <PrizymPage title="88-Checkpoint Framework" subtitle="Browse the complete SGM governance framework across 12 phases and 4 quadrants">
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--pg-text-muted)' }} />
          <input
            type="text"
            placeholder="Search checkpoints..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              background: 'var(--pg-card)', border: '1px solid var(--pg-border)', borderRadius: 8,
              color: 'var(--pg-text)', fontSize: 14,
            }}
          />
        </div>

        <select
          value={quadrantFilter}
          onChange={e => setQuadrantFilter(e.target.value)}
          style={{
            padding: '10px 14px', background: 'var(--pg-card)', border: '1px solid var(--pg-border)',
            borderRadius: 8, color: 'var(--pg-text)', fontSize: 13, cursor: 'pointer',
          }}
        >
          <option value="all">All Quadrants</option>
          <option value="design">Design</option>
          <option value="operate">Operate</option>
          <option value="dispute">Dispute</option>
          <option value="oversee">Oversee</option>
        </select>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--pg-text-muted)', cursor: 'pointer', padding: '10px 14px', background: soxOnly ? 'rgba(139,92,246,0.15)' : 'var(--pg-card)', border: soxOnly ? '1px solid rgba(139,92,246,0.5)' : '1px solid var(--pg-border)', borderRadius: 8 }}>
          <input type="checkbox" checked={soxOnly} onChange={e => setSoxOnly(e.target.checked)} />
          <ShieldCheck size={14} /> SOX Relevant ({soxCount})
        </label>
      </div>

      <div className="pg-caption" style={{ marginBottom: 16 }}>
        Showing <strong style={{ color: 'var(--pg-text)' }}>{totalVisible}</strong> of <strong style={{ color: 'var(--pg-text)' }}>{GOVERNANCE_FRAMEWORK.totalCheckpoints}</strong> checkpoints across <strong style={{ color: 'var(--pg-text)' }}>{filtered.length}</strong> phases
      </div>

      {/* Phases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((phase, pi) => {
          const color = QUADRANT_COLORS[phase.quadrant];
          const isOpen = expanded.has(phase.number);
          return (
            <div
              key={phase.number}
              className="pg-card"
              style={{
                padding: 0, overflow: 'hidden',
                borderLeft: `3px solid ${color}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(6px)',
                transition: 'all 0.3s ease',
                transitionDelay: `${pi * 0.03}s`,
              }}
            >
              <button
                onClick={() => togglePhase(phase.number)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
                }}
              >
                {isOpen ? <ChevronDown size={16} style={{ color }} /> : <ChevronRight size={16} style={{ color }} />}
                <span style={{ minWidth: 32, fontSize: 11, fontWeight: 700, color, background: `${color}18`, padding: '3px 8px', borderRadius: 6, textAlign: 'center' }}>
                  P{phase.number}
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--pg-text)', flex: 1, textAlign: 'left' }}>
                  {phase.name}
                </span>
                <span style={{ fontSize: 10, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  {phase.quadrant}
                </span>
                <span style={{ fontSize: 12, color: 'var(--pg-text-muted)' }}>{phase.checkpoints.length}</span>
              </button>

              {isOpen && (
                <div style={{ padding: '0 18px 16px 50px' }}>
                  {phase.checkpoints.map(cp => (
                    <div
                      key={cp.id}
                      style={{
                        padding: '10px 14px', borderRadius: 6,
                        background: 'var(--pg-surface-alt)', marginBottom: 6,
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700, color, minWidth: 44, fontFamily: 'monospace' }}>{cp.id}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--pg-text)' }}>{cp.label}</span>
                          {cp.soxRelevant && (
                            <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 10, background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', fontWeight: 700 }}>SOX</span>
                          )}
                        </div>
                        <p className="pg-caption" style={{ fontSize: 12, lineHeight: 1.5 }}>{cp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PrizymPage>
  );
}
