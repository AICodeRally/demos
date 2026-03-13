'use client';

import { ActNavigation, SectionCard, KpiCard, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';

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
  const inProgressItems = COMPLIANCE_ITEMS.reduce((s, c) => s + c.items.filter((i) => i.status === 'In Progress').length, 0);

  return (
    <>
      <ActNavigation currentAct={6} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'Compliance Score', value: `${((completedItems / totalItems) * 100).toFixed(0)}%`, status: completedItems / totalItems > 0.7 ? 'green' : 'amber', detail: `${completedItems}/${totalItems} complete` },
          { label: 'In Progress', value: `${inProgressItems}`, status: 'amber', detail: 'Items underway' },
          { label: 'Next Deadline', value: 'Apr 2026', status: 'amber', detail: 'K-1 + compliance review' },
          { label: 'Audit Status', value: 'Clean', status: 'green', detail: 'KPMG FY2025' },
        ]}
      />

      <div className="mt-2 mb-6 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#F97316' }}>
          Compliance &middot; Reporting
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Compliance & Regulatory Dashboard
        </h1>
        <p className="text-[14px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          {completedItems}/{totalItems} items complete &middot; {totalItems - completedItems} pending
        </p>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="Proactive Compliance Reduces Regulatory Risk"
        insight="Automated compliance tracking across SEC reporting, financial audits, valuations, and ESG governance ensures no filing deadlines are missed. Real-time dashboard visibility replaces quarterly manual checklists."
        accentColor="#F97316"
        implications={[
          'All regulatory filings (Form ADV, Form PF) completed on time with zero deficiencies across last 4 reporting cycles.',
          'ILPA-compliant reporting and Big 4 audit integration streamline LP communication and reduce CCO workload by 40%.',
        ]}
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <KpiCard label="Completed" value={`${completedItems}`} accent="#10B981" sub={`of ${totalItems} items`} variant="primary" stagger={0} />
        <KpiCard label="In Progress" value={`${inProgressItems}`} accent="#F59E0B" sub="Active workstreams" variant="primary" stagger={1} />
        <KpiCard label="Scheduled" value={`${totalItems - completedItems - inProgressItems}`} accent="#3B82F6" sub="Upcoming items" stagger={2} />
        <KpiCard label="Completion" value={`${((completedItems / totalItems) * 100).toFixed(0)}%`} accent="#D4A847" sub="Overall progress" delta="+8%" deltaDirection="up" stagger={3} />
      </div>

      {/* Overall progress */}
      <div className="mb-6 p-4 rounded-xl border animate-mr-fade-in" style={{ background: 'var(--mr-card)', borderColor: 'var(--mr-border)' }}>
        <div className="flex justify-between text-xs font-semibold mb-2" style={{ color: 'var(--mr-text-muted)' }}>
          <span>Compliance Completion</span>
          <span className="tabular-nums">{((completedItems / totalItems) * 100).toFixed(0)}%</span>
        </div>
        <div className="h-3 rounded-full" style={{ background: 'var(--mr-chart-bar-track)' }}>
          <div className="h-full rounded-full" style={{ width: `${(completedItems / totalItems) * 100}%`, background: 'linear-gradient(90deg, #10B981, #D4A847)' }} />
        </div>
      </div>

      {/* Category cards */}
      {COMPLIANCE_ITEMS.map((cat, catIdx) => (
        <SectionCard key={cat.category} title={cat.category} meta={`${cat.items.filter(i => i.status === 'Complete').length}/${cat.items.length} complete`}>
          <div className="space-y-2">
            {cat.items.map((item, i) => (
              <div
                key={item.item}
                className="flex items-center gap-3 p-2 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in"
                style={{ background: 'var(--mr-card-alt)', animationDelay: `${(catIdx * 4 + i) * 40}ms` }}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `${item.color}20`, color: item.color }}>
                  <span className="text-xs">{item.status === 'Complete' ? '\u2713' : item.status === 'In Progress' ? '\u25CF' : '\u25CB'}</span>
                </div>
                <div className="flex-1 text-[13px]" style={{ color: 'var(--mr-text)' }}>{item.item}</div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: `${item.color}15`, color: item.color }}>
                  {item.status}
                </span>
                <span className="text-xs tabular-nums" style={{ color: 'var(--mr-text-faint)' }}>{item.date}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </>
  );
}
