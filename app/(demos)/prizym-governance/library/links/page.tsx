'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { ExternalLink, Link2, BookOpen, FileText, ShieldCheck, Scale, Globe } from 'lucide-react';

interface LinkItem {
  title: string;
  url: string;
  description: string;
  category: 'standards' | 'regulators' | 'benchmarks' | 'tools' | 'vendors';
  icon: typeof Link2;
}

const LINKS: LinkItem[] = [
  {
    title: 'FASB ASC 606 — Revenue from Contracts with Customers',
    url: 'https://asc.fasb.org/topic/606',
    description: 'Official FASB standards reference for revenue recognition under ASC 606.',
    category: 'standards',
    icon: BookOpen,
  },
  {
    title: 'IFRS 15 — Revenue from Contracts with Customers',
    url: 'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/',
    description: 'IFRS 15 international accounting standard for revenue recognition.',
    category: 'standards',
    icon: Globe,
  },
  {
    title: 'SEC SOX Section 404 Guidance',
    url: 'https://www.sec.gov/spotlight/sarbanes-oxley.htm',
    description: 'SEC guidance on Sarbanes-Oxley Section 404 internal controls over financial reporting.',
    category: 'regulators',
    icon: ShieldCheck,
  },
  {
    title: 'IRS Section 409A — Deferred Compensation',
    url: 'https://www.irs.gov/retirement-plans/nonqualified-deferred-compensation-audit-technique-guide',
    description: 'IRS guidance on Section 409A and deferred commission compliance.',
    category: 'regulators',
    icon: ShieldCheck,
  },
  {
    title: 'California AB-2288 — Commission Statements',
    url: 'https://leginfo.legislature.ca.gov/',
    description: 'California Labor Code commission statement requirements (AB-2288).',
    category: 'regulators',
    icon: Scale,
  },
  {
    title: 'WorldatWork Sales Compensation Research',
    url: 'https://worldatwork.org/',
    description: 'Industry benchmarks, research, and best practices for sales compensation.',
    category: 'benchmarks',
    icon: FileText,
  },
  {
    title: 'Alexander Group — Sales Compensation Benchmarks',
    url: 'https://www.alexandergroup.com/',
    description: 'Sales performance management benchmarks and advisory research.',
    category: 'benchmarks',
    icon: FileText,
  },
  {
    title: 'Gartner SPM Magic Quadrant',
    url: 'https://www.gartner.com/',
    description: 'Gartner evaluation of sales performance management platforms.',
    category: 'benchmarks',
    icon: FileText,
  },
  {
    title: 'Forrester Wave — Incentive Compensation',
    url: 'https://www.forrester.com/',
    description: 'Forrester research on incentive compensation management platforms.',
    category: 'benchmarks',
    icon: FileText,
  },
  {
    title: 'AICPA Revenue Recognition Resources',
    url: 'https://www.aicpa.org/topic/audit-assurance/audit-and-assurance-revenue-recognition',
    description: 'AICPA guidance and tools for ASC 606 implementation.',
    category: 'tools',
    icon: BookOpen,
  },
  {
    title: 'BHG Consulting — Governance Advisory',
    url: 'https://bhgconsulting.example',
    description: 'BHG Consulting sales governance advisory practice.',
    category: 'vendors',
    icon: Link2,
  },
  {
    title: 'Prizym Suite Platform Docs',
    url: 'https://docs.prizym.example',
    description: 'Product documentation for Prizym Governance and SPM platform.',
    category: 'vendors',
    icon: Link2,
  },
];

const CATEGORY_COLORS: Record<LinkItem['category'], { color: string; label: string }> = {
  standards: { color: '#06b6d4', label: 'Standards' },
  regulators: { color: '#8b5cf6', label: 'Regulators' },
  benchmarks: { color: '#3b82f6', label: 'Benchmarks' },
  tools: { color: '#10b981', label: 'Tools' },
  vendors: { color: '#f59e0b', label: 'Vendors' },
};

export default function LinksPage() {
  const [filter, setFilter] = useState<LinkItem['category'] | 'all'>('all');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const filtered = filter === 'all' ? LINKS : LINKS.filter(l => l.category === filter);
  const categories: Array<LinkItem['category'] | 'all'> = ['all', 'standards', 'regulators', 'benchmarks', 'tools', 'vendors'];

  return (
    <PrizymPage title="Links" subtitle="Curated external references for governance standards, regulators, benchmarks, and tools">
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map(c => {
          const active = filter === c;
          const count = c === 'all' ? LINKS.length : LINKS.filter(l => l.category === c).length;
          const color = c === 'all' ? '#06b6d4' : CATEGORY_COLORS[c].color;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: '8px 16px', borderRadius: 20,
                background: active ? `${color}20` : 'var(--pg-stripe)',
                border: active ? `1px solid ${color}60` : '1px solid var(--pg-border)',
                color: active ? color : 'var(--pg-text-muted)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              }}
            >
              {c} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((l, i) => {
          const cfg = CATEGORY_COLORS[l.category];
          const Icon = l.icon;
          return (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pg-card-elevated"
              style={{
                display: 'block', textDecoration: 'none',
                borderTop: `3px solid ${cfg.color}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${i * 0.04}s`,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${cfg.color}18`, border: `1px solid ${cfg.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} style={{ color: cfg.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className="pg-overline" style={{ color: cfg.color, fontSize: 10 }}>{cfg.label}</span>
                  <h3 className="pg-subheading" style={{ fontSize: 14, marginTop: 2, lineHeight: 1.3 }}>{l.title}</h3>
                </div>
                <ExternalLink size={14} style={{ color: 'var(--pg-text-muted)', flexShrink: 0 }} />
              </div>
              <p className="pg-caption" style={{ fontSize: 12, lineHeight: 1.55 }}>{l.description}</p>
            </a>
          );
        })}
      </div>
    </PrizymPage>
  );
}
