'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { asc606Frameworks } from '@/data/prizym-governance/asc606';
import { Network, BookOpen, ArrowRight } from 'lucide-react';

interface FrameworkEntry {
  code: string;
  title: string;
  description: string;
  href: string;
  icon: typeof Network;
  accent: string;
}

const FRAMEWORKS: FrameworkEntry[] = [
  {
    code: 'SGM-88',
    title: '88-Checkpoint Governance Framework',
    description: 'The complete Sales Governance Management framework covering 12 phases across Design, Operate, Dispute, and Oversee quadrants.',
    href: '/prizym-governance/tools/framework',
    icon: Network,
    accent: 'var(--pg-cyan-bright)',
  },
  ...asc606Frameworks.map(f => ({
    code: f.code,
    title: f.title,
    description: f.content.slice(0, 240) + '...',
    href: '/prizym-governance/documents/policies',
    icon: BookOpen,
    accent: 'var(--pg-success-bright)',
  })),
];

export default function FrameworksReferencePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          Governance Frameworks
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Authoritative reference frameworks for sales compensation governance, revenue recognition, and SOX compliance.
        </p>
      </div>

      <div className="pg-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
          {FRAMEWORKS.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.code}
                href={f.href}
                className="pg-card-elevated"
                style={{
                  display: 'block', textDecoration: 'none', padding: 20,
                  borderTop: `4px solid ${f.accent}`,
                  opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: `${0.15 + i * 0.08}s`,
                }}
              >
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
                  <div className="pg-icon-bubble pg-icon-bubble-lg" style={{ borderColor: f.accent }}>
                    <Icon size={22} color={f.accent} strokeWidth={2.4} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: f.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.code}</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginTop: 3, lineHeight: 1.3 }}>{f.title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: 15, color: '#ffffff', lineHeight: 1.55, marginBottom: 14 }}>{f.description}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: f.accent, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Open framework <ArrowRight size={15} strokeWidth={2.6} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
