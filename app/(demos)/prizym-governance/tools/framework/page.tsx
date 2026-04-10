'use client';

import { useState, useEffect, useMemo } from 'react';
import { GOVERNANCE_FRAMEWORK } from '@/data/prizym-governance/engine/framework';
import { ShieldCheck, Search, ChevronDown, ChevronRight } from 'lucide-react';

const QUADRANT_COLORS: Record<string, string> = {
  design: 'var(--pg-design-bright)',
  operate: 'var(--pg-operate-bright)',
  dispute: 'var(--pg-dispute-bright)',
  oversee: 'var(--pg-oversee-bright)',
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
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          88-Checkpoint Framework
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Browse the complete SGM governance framework across 12 phases and 4 quadrants.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} color="#f1f5f9" strokeWidth={2.4} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search checkpoints..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px 11px 38px',
              background: 'rgba(15, 23, 42, 0.55)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 10,
              color: '#ffffff',
              fontSize: 15,
            }}
          />
        </div>

        <select
          value={quadrantFilter}
          onChange={e => setQuadrantFilter(e.target.value)}
          style={{
            padding: '11px 16px',
            background: 'rgba(15, 23, 42, 0.55)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 10,
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <option value="all">All Quadrants</option>
          <option value="design">Design</option>
          <option value="operate">Operate</option>
          <option value="dispute">Dispute</option>
          <option value="oversee">Oversee</option>
        </select>

        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 15, fontWeight: 700,
          color: soxOnly ? 'var(--pg-oversee-bright)' : '#ffffff',
          cursor: 'pointer',
          padding: '11px 16px',
          background: soxOnly ? 'rgba(196,181,253,0.18)' : 'rgba(15, 23, 42, 0.55)',
          border: soxOnly ? '1.5px solid var(--pg-oversee-bright)' : '1px solid rgba(255,255,255,0.25)',
          borderRadius: 10,
        }}>
          <input type="checkbox" checked={soxOnly} onChange={e => setSoxOnly(e.target.checked)} />
          <ShieldCheck size={15} strokeWidth={2.4} /> SOX Relevant ({soxCount})
        </label>
      </div>

      <div style={{ fontSize: 14, color: '#ffffff', marginBottom: 12 }}>
        Showing <strong style={{ color: 'var(--pg-cyan-bright)', fontWeight: 800 }}>{totalVisible}</strong> of <strong style={{ color: 'var(--pg-cyan-bright)', fontWeight: 800 }}>{GOVERNANCE_FRAMEWORK.totalCheckpoints}</strong> checkpoints across <strong style={{ color: 'var(--pg-cyan-bright)', fontWeight: 800 }}>{filtered.length}</strong> phases.
      </div>

      <div className="pg-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        {filtered.map((phase, pi) => {
          const color = QUADRANT_COLORS[phase.quadrant];
          const isOpen = expanded.has(phase.number);
          return (
            <div
              key={phase.number}
              style={{
                padding: 0, overflow: 'hidden',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.1)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                borderLeft: `5px solid ${color}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(6px)',
                transition: 'all 0.3s ease',
                transitionDelay: `${pi * 0.03}s`,
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => togglePhase(phase.number)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'inherit',
                }}
              >
                {isOpen ? <ChevronDown size={18} color={color} strokeWidth={2.6} /> : <ChevronRight size={18} color={color} strokeWidth={2.6} />}
                <span style={{
                  minWidth: 40, padding: '4px 10px', borderRadius: 8,
                  background: 'rgba(0, 0, 0, 0.32)',
                  border: `1.5px solid ${color}`,
                  fontSize: 14, fontWeight: 800, color, textAlign: 'center',
                }}>
                  P{phase.number}
                </span>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#ffffff', flex: 1, textAlign: 'left' }}>
                  {phase.name}
                </span>
                <span style={{ fontSize: 14, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {phase.quadrant}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{phase.checkpoints.length}</span>
              </button>

              {isOpen && (
                <div style={{ padding: '0 18px 16px 56px' }}>
                  {phase.checkpoints.map(cp => (
                    <div
                      key={cp.id}
                      style={{
                        padding: '11px 14px', borderRadius: 8,
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        marginBottom: 6,
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 800, color, minWidth: 48, fontFamily: 'ui-monospace, SFMono-Regular, monospace', textTransform: 'uppercase' }}>{cp.id}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{cp.label}</span>
                          {cp.soxRelevant && (
                            <span style={{ fontSize: 13, padding: '2px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.32)', border: '1.5px solid var(--pg-oversee-bright)', color: 'var(--pg-oversee-bright)', fontWeight: 800, letterSpacing: '0.05em' }}>SOX</span>
                          )}
                        </div>
                        <p style={{ fontSize: 14, color: '#f1f5f9', lineHeight: 1.5 }}>{cp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
