'use client';

import { ActNavigation, SectionCard } from '@/components/demos/meridian';

export default function PlatformArchitecturePage() {
  return (
    <>
      <ActNavigation currentAct={6} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#F97316' }}>
          Platform &middot; Architecture
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          MERIDIAN Platform Architecture
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          AI-powered PE fund administration, waterfall calculation, and carry allocation
        </p>
      </div>

      {/* Capabilities Grid */}
      <SectionCard title="Platform Capabilities">
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'Waterfall Engine', desc: 'Real-time waterfall calculation for European, American, and hybrid structures. Multi-currency support. Automated LP capital account maintenance.', color: '#10B981' },
            { name: 'Carry Calculator', desc: 'Individual carry allocation with vesting tracking, clawback escrow, and tax-lot optimization. Point-based allocation with automated true-up.', color: '#D4A847' },
            { name: 'Deal Pipeline CRM', desc: 'Full-lifecycle deal tracking from screening to close. IC memo generation, DD tracker, and automated compliance checks.', color: '#8B5CF6' },
            { name: 'Portfolio Monitoring', desc: 'Real-time operating KPIs from portfolio companies. Value creation attribution, benchmarking, and early warning indicators.', color: '#3B82F6' },
            { name: 'LP Reporting', desc: 'ILPA-compliant quarterly reporting. Capital account statements, performance attribution, and ESG disclosures. White-label LP portal.', color: '#0EA5E9' },
            { name: 'AI Analytics', desc: 'GPT-powered deal screening, market research, and portfolio analysis. Natural language querying of fund data. Predictive exit modeling.', color: '#F97316' },
          ].map((c) => (
            <div key={c.name} className="p-4 rounded-lg" style={{ background: `${c.color}06`, border: `1px solid ${c.color}20` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm" style={{ color: c.color }}>{'\u25C6'}</span>
                <span className="text-[14px] font-bold" style={{ color: c.color }}>{c.name}</span>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--mr-text-secondary)' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Integration Layer */}
      <SectionCard title="Integration Ecosystem">
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: 'Salesforce', type: 'CRM', status: 'Connected', color: '#3B82F6' },
            { name: 'Carta', type: 'Cap Table', status: 'Connected', color: '#10B981' },
            { name: 'Allvue', type: 'Fund Admin', status: 'Connected', color: '#8B5CF6' },
            { name: 'Bloomberg', type: 'Market Data', status: 'Connected', color: '#F59E0B' },
            { name: 'DocuSign', type: 'Documents', status: 'Connected', color: '#D4A847' },
            { name: 'Workday', type: 'HR/Payroll', status: 'Connected', color: '#0EA5E9' },
            { name: 'NetSuite', type: 'Accounting', status: 'Connected', color: '#EF4444' },
            { name: 'Power BI', type: 'Analytics', status: 'Available', color: '#6B7280' },
          ].map((i) => (
            <div key={i.name} className="p-3 rounded-lg border text-center" style={{ borderColor: 'var(--mr-border)' }}>
              <div className="text-sm font-bold" style={{ color: 'var(--mr-text)' }}>{i.name}</div>
              <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>{i.type}</div>
              <span className="text-xs font-mono px-2 py-0.5 rounded mt-1 inline-block" style={{ background: `${i.color}15`, color: i.color }}>
                {i.status}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Tech Stack */}
      <SectionCard title="Technology Stack">
        <div className="grid grid-cols-2 gap-4">
          {[
            { layer: 'Frontend', tech: 'React, TypeScript, Tailwind CSS, Recharts', desc: 'Responsive dashboard with real-time data visualization' },
            { layer: 'Backend', tech: 'Node.js, Go microservices, gRPC', desc: 'High-performance waterfall calculations and event-driven architecture' },
            { layer: 'Database', tech: 'PostgreSQL, Redis, Vector DB', desc: 'ACID transactions for fund accounting, caching, AI embeddings' },
            { layer: 'AI/ML', tech: 'Claude, GPT-4, custom models', desc: 'Deal screening, document analysis, predictive analytics' },
            { layer: 'Security', tech: 'SOC 2 Type II, AES-256, SSO', desc: 'Bank-grade encryption, audit trail, role-based access' },
            { layer: 'Infrastructure', tech: 'AWS, Kubernetes, Terraform', desc: 'Multi-region, 99.99% SLA, automated DR' },
          ].map((s) => (
            <div key={s.layer} className="p-3 rounded-lg" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)' }}>
              <div className="text-xs font-bold font-mono uppercase" style={{ color: '#D4A847' }}>{s.layer}</div>
              <div className="text-[13px] font-semibold mt-1" style={{ color: 'var(--mr-text)' }}>{s.tech}</div>
              <div className="text-[12px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* CTA */}
      <div className="rounded-xl p-6 text-center" style={{ background: 'linear-gradient(135deg, #D4A84715, #3B82F615)', border: '1px solid #D4A84730' }}>
        <div className="text-2xl font-extrabold mb-2" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Ready to transform your fund operations?
        </div>
        <p className="text-[14px] mb-4" style={{ color: 'var(--mr-text-muted)' }}>
          MERIDIAN powers $50B+ in AUM across 30+ PE/VC funds worldwide.
        </p>
        <div className="inline-flex gap-3">
          <div className="px-6 py-3 rounded-lg text-sm font-bold" style={{ background: '#D4A847', color: '#0a0f1a' }}>
            Request Demo
          </div>
          <div className="px-6 py-3 rounded-lg text-sm font-bold border" style={{ borderColor: '#D4A847', color: '#D4A847' }}>
            Contact Sales
          </div>
        </div>
      </div>
    </>
  );
}
