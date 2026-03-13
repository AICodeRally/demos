'use client';

import { ActNavigation, SectionCard } from '@/components/demos/meridian';

const COMPLIANCE_ITEMS = [
  { category: 'Regulatory', items: [
    { item: 'SEC Form ADV annual update', status: 'Complete', date: 'Jan 2026', color: '#10B981' },
    { item: 'Form PF quarterly filing', status: 'Complete', date: 'Mar 2026', color: '#10B981' },
    { item: 'Annual compliance review', status: 'In Progress', date: 'Apr 2026', color: '#F59E0B' },
    { item: 'LPAC annual meeting', status: 'Scheduled', date: 'May 2026', color: '#3B82F6' },
  ]},
  { category: 'Financial Reporting', items: [
    { item: 'Annual audited financials (KPMG)', status: 'Complete', date: 'Feb 2026', color: '#10B981' },
    { item: 'Q1 capital account statements', status: 'Complete', date: 'Mar 2026', color: '#10B981' },
    { item: 'ILPA template reporting', status: 'Complete', date: 'Mar 2026', color: '#10B981' },
    { item: 'Tax K-1 distributions', status: 'In Progress', date: 'Apr 2026', color: '#F59E0B' },
  ]},
  { category: 'Valuation', items: [
    { item: 'Q4 portfolio valuation (Duff & Phelps)', status: 'Complete', date: 'Jan 2026', color: '#10B981' },
    { item: 'Q1 internal valuations', status: 'Complete', date: 'Mar 2026', color: '#10B981' },
    { item: 'Valuation committee review', status: 'Complete', date: 'Mar 2026', color: '#10B981' },
    { item: 'NAV reconciliation', status: 'Complete', date: 'Mar 2026', color: '#10B981' },
  ]},
  { category: 'ESG & Governance', items: [
    { item: 'Annual ESG report (UNPRI)', status: 'In Progress', date: 'Apr 2026', color: '#F59E0B' },
    { item: 'Portfolio ESG assessment', status: 'Complete', date: 'Feb 2026', color: '#10B981' },
    { item: 'DEI disclosure', status: 'Complete', date: 'Jan 2026', color: '#10B981' },
    { item: 'Cybersecurity assessment', status: 'Scheduled', date: 'May 2026', color: '#3B82F6' },
  ]},
];

export default function CompliancePage() {
  const totalItems = COMPLIANCE_ITEMS.reduce((s, c) => s + c.items.length, 0);
  const completedItems = COMPLIANCE_ITEMS.reduce((s, c) => s + c.items.filter((i) => i.status === 'Complete').length, 0);

  return (
    <>
      <ActNavigation currentAct={6} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#F97316' }}>
          Compliance &middot; Reporting
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Compliance & Regulatory Dashboard
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          {completedItems}/{totalItems} items complete &middot; {totalItems - completedItems} pending
        </p>
      </div>

      {/* Overall progress */}
      <div className="mb-6 p-4 rounded-xl border" style={{ background: 'var(--mr-card)', borderColor: 'var(--mr-border)' }}>
        <div className="flex justify-between text-xs font-mono mb-2" style={{ color: 'var(--mr-text-muted)' }}>
          <span>Compliance Completion</span>
          <span>{((completedItems / totalItems) * 100).toFixed(0)}%</span>
        </div>
        <div className="h-3 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
          <div className="h-full rounded-full" style={{ width: `${(completedItems / totalItems) * 100}%`, background: 'linear-gradient(90deg, #10B981, #D4A847)' }} />
        </div>
      </div>

      {/* Category cards */}
      {COMPLIANCE_ITEMS.map((cat) => (
        <SectionCard key={cat.category} title={cat.category}>
          <div className="space-y-2">
            {cat.items.map((item) => (
              <div key={item.item} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--mr-card-alt)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `${item.color}20`, color: item.color }}>
                  <span className="text-xs">{item.status === 'Complete' ? '\u2713' : item.status === 'In Progress' ? '\u25CF' : '\u25CB'}</span>
                </div>
                <div className="flex-1 text-[13px]" style={{ color: 'var(--mr-text)' }}>{item.item}</div>
                <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${item.color}15`, color: item.color }}>
                  {item.status}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>{item.date}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </>
  );
}
