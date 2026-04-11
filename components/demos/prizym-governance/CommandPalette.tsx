'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home, FileText, BookOpen, ListChecks, ShieldCheck, LayoutTemplate,
  Calculator, Grid3x3, Network, Scale, BarChart3, ClipboardCheck,
  CheckSquare, PenLine, Gavel, AlertOctagon, Briefcase, Users,
  Calendar, History, Sparkles, Circle, Search,
} from 'lucide-react';
import demoConfig from '@/app/(demos)/prizym-governance/demo.config';

const ICON_MAP: Record<string, typeof Home> = {
  Home, FileText, BookOpen, ListChecks, ShieldCheck, LayoutTemplate,
  Calculator, Grid3x3, Network, Scale, BarChart3, ClipboardCheck,
  CheckSquare, PenLine, Gavel, AlertOctagon, Briefcase, Users,
  Calendar, History, Sparkles,
};

type Entry = {
  label: string;
  section: string;
  href: string;
  icon: string;
  color: string;
};

const ALL_ENTRIES: Entry[] = demoConfig.nav.flatMap((sec) =>
  sec.items.map((item) => ({
    label: item.label,
    section: sec.section,
    href: item.href,
    icon: item.icon,
    color: sec.color,
  })),
);

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ENTRIES;
    return ALL_ENTRIES.filter(
      (e) => e.label.toLowerCase().includes(q) || e.section.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCursor(0);
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const hit = results[cursor];
        if (hit) {
          router.push(hit.href);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, cursor, router, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(640px, 92vw)',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(24px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.28)',
          borderRadius: 16,
          boxShadow: '0 32px 80px rgba(15,23,42,0.6)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <Search size={20} color="var(--pg-cyan-bright)" strokeWidth={2.4} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules and pages…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: 17,
              fontWeight: 600,
            }}
          />
          <kbd style={{
            fontSize: 12, fontWeight: 700,
            padding: '3px 8px', borderRadius: 6,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.22)',
            color: '#f1f5f9',
          }}>
            ESC
          </kbd>
        </div>

        <div style={{ maxHeight: '50vh', overflowY: 'auto' }} className="pg-scroll">
          {results.length === 0 && (
            <div style={{ padding: '28px 20px', textAlign: 'center', color: '#f1f5f9', fontSize: 15 }}>
              No matches for "{query}"
            </div>
          )}
          {results.map((r, i) => {
            const Icon = ICON_MAP[r.icon] ?? Circle;
            const isActive = i === cursor;
            return (
              <button
                key={r.href}
                type="button"
                onMouseEnter={() => setCursor(i)}
                onClick={() => { router.push(r.href); onClose(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  width: '100%',
                  padding: '12px 20px',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${isActive ? r.color : 'transparent'}`,
                  color: '#ffffff',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div className="pg-icon-bubble pg-icon-bubble-sm" style={{ borderColor: r.color }}>
                  <Icon size={14} color={r.color} strokeWidth={2.4} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#ffffff', fontWeight: 700 }}>{r.label}</div>
                  <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>
                    {r.section}
                  </div>
                </div>
                {isActive && (
                  <span style={{ fontSize: 12, color: '#f1f5f9', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Enter ↵
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.16)', fontSize: 13, color: '#f1f5f9', display: 'flex', gap: 16, fontWeight: 600 }}>
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
