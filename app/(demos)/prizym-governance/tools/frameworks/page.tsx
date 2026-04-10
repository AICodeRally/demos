'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
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
    accent: '#0891b2',
  },
  ...asc606Frameworks.map(f => ({
    code: f.code,
    title: f.title,
    description: f.content.slice(0, 240) + '...',
    href: '/prizym-governance/documents/policies',
    icon: BookOpen,
    accent: '#10b981',
  })),
];

export default function FrameworksReferencePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <PrizymPage
      title="Governance Frameworks"
      subtitle="Authoritative reference frameworks for sales compensation governance, revenue recognition, and SOX compliance."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FRAMEWORKS.map((f, i) => {
          const Icon = f.icon;
          return (
            <Link key={f.code} href={f.href} className="pg-card-elevated" style={{
              display: 'block', textDecoration: 'none', borderTop: `3px solid ${f.accent}`,
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: `${0.2 + i * 0.1}s`,
            }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${f.accent}22`, border: `1px solid ${f.accent}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} style={{ color: f.accent }} />
                </div>
                <div style={{ flex: 1 }}>
                  <span className="pg-overline" style={{ color: f.accent, fontSize: 11 }}>{f.code}</span>
                  <h3 className="pg-subheading" style={{ marginTop: 4 }}>{f.title}</h3>
                </div>
              </div>
              <p className="pg-caption" style={{ lineHeight: 1.6, marginBottom: 14 }}>{f.description}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: f.accent, fontSize: 14, fontWeight: 600 }}>
                Open framework <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </PrizymPage>
  );
}
