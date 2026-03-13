'use client';

import { ActNavigation, SectionCard } from '@/components/demos/meridian';
import { GOVERNANCE_CLAUSES } from '@/data/meridian/tax-governance';

export default function CarryGovernancePage() {
  const activeCount = GOVERNANCE_CLAUSES.filter((c) => c.status === 'Active').length;
  const monitoringCount = GOVERNANCE_CLAUSES.filter((c) => c.status === 'Monitoring').length;
  const categories = [...new Set(GOVERNANCE_CLAUSES.map((c) => c.category))];

  return (
    <>
      <ActNavigation currentAct={5} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#8B5CF6' }}>
          Governance &middot; LPA Provisions
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          LPA Governance &amp; Controls
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          {GOVERNANCE_CLAUSES.length} clauses monitored &middot; {activeCount} active &middot; {monitoringCount} under watch
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Clauses', value: GOVERNANCE_CLAUSES.length, color: '#D4A847' },
          { label: 'Active', value: activeCount, color: '#10B981' },
          { label: 'Monitoring', value: monitoringCount, color: '#F59E0B' },
          { label: 'Not Triggered', value: GOVERNANCE_CLAUSES.filter((c) => c.status === 'Not Triggered').length, color: '#6B7280' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl text-center" style={{ background: 'var(--mr-card)', border: '1px solid var(--mr-border)' }}>
            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Clauses by Category */}
      {categories.map((cat) => {
        const clauses = GOVERNANCE_CLAUSES.filter((c) => c.category === cat);
        const catColor = cat === 'Waterfall' ? '#10B981' : cat === 'Governance' ? '#8B5CF6' : cat === 'Transfer' ? '#3B82F6' : cat === 'Tax' ? '#D4A847' : '#0EA5E9';
        return (
          <SectionCard key={cat} title={cat}>
            <div className="space-y-3">
              {clauses.map((clause) => (
                <div key={clause.clause} className="p-4 rounded-lg" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: `${clause.color}20`, color: clause.color }}>
                      <span className="text-[10px] font-bold">
                        {clause.status === 'Active' ? '\u2713' : clause.status === 'Monitoring' ? '\u25CF' : '\u25CB'}
                      </span>
                    </div>
                    <span className="text-[14px] font-bold" style={{ color: 'var(--mr-text)' }}>{clause.clause}</span>
                    <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded" style={{
                      background: `${clause.color}15`, color: clause.color,
                    }}>
                      {clause.status}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{
                      background: clause.risk === 'Low' ? '#10B98115' : clause.risk === 'Medium' ? '#F59E0B15' : '#EF444415',
                      color: clause.risk === 'Low' ? '#10B981' : clause.risk === 'Medium' ? '#F59E0B' : '#EF4444',
                    }}>
                      {clause.risk} Risk
                    </span>
                  </div>
                  <p className="text-[12px] mb-2" style={{ color: 'var(--mr-text-secondary)' }}>{clause.description}</p>
                  <div className="flex items-start gap-2 p-2 rounded" style={{ background: 'var(--mr-card)' }}>
                    <span className="text-[10px] font-mono font-bold shrink-0 mt-0.5" style={{ color: catColor }}>LP PROTECTION:</span>
                    <span className="text-[11px]" style={{ color: 'var(--mr-text-muted)' }}>{clause.lpProtection}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        );
      })}

      {/* M&A Diligence Checklist */}
      <SectionCard title="M&A Carry Diligence Checklist">
        <p className="text-[12px] mb-4" style={{ color: 'var(--mr-text-muted)' }}>
          Critical items for GP platform transactions, GP stake sales, and change-of-control events.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              area: 'Legal Structure',
              items: [
                'Where does carry live? (GP entity, carry vehicle, individuals, or combination)',
                'Is carry already crystallized vs expected on unrealized positions?',
                'Are there SPVs or parallel funds with separate carry waterfalls?',
              ],
              color: '#8B5CF6',
            },
            {
              area: 'Economics & Clawback',
              items: [
                'Deal-by-deal or whole-fund waterfall timing?',
                'Escrow holdback percentage and release schedule?',
                'Tax giveback treatment on clawback obligations?',
              ],
              color: '#10B981',
            },
            {
              area: 'Governance Triggers',
              items: [
                'Does control change trigger key person suspension?',
                'GP removal thresholds (for cause / without cause)?',
                'Successor GP consent requirements from LPAC?',
              ],
              color: '#F59E0B',
            },
            {
              area: 'Tax & Accounting',
              items: [
                'Section 1061 holding period analysis per investment',
                'Capital interest exception availability for GP commit',
                'ASC 718 scope for profits interests / synthetic carry',
              ],
              color: '#D4A847',
            },
            {
              area: 'Valuation',
              items: [
                'Agreed FMV methodology for unrealized carry?',
                'NAV adjustment mechanics and independent valuation rights?',
                'Discount for illiquidity and clawback uncertainty?',
              ],
              color: '#3B82F6',
            },
            {
              area: 'Retention & Transition',
              items: [
                'Rollover incentive pool for key team carry recipients?',
                'Re-grant of profits interest under new ownership?',
                'Non-compete and non-solicit scope post-transaction?',
              ],
              color: '#0EA5E9',
            },
          ].map((area) => (
            <div key={area.area} className="p-4 rounded-lg" style={{ background: 'var(--mr-card-alt)', border: '1px solid var(--mr-border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm" style={{ color: area.color }}>{'\u25C6'}</span>
                <span className="text-[13px] font-bold" style={{ color: area.color }}>{area.area}</span>
              </div>
              <div className="space-y-2">
                {area.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs shrink-0 mt-0.5" style={{ color: 'var(--mr-text-faint)' }}>{'\u25CB'}</span>
                    <span className="text-[12px]" style={{ color: 'var(--mr-text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* GP Stakes Transaction Flow */}
      <div className="rounded-xl p-6 text-center" style={{ background: 'linear-gradient(135deg, #8B5CF615, #D4A84715)', border: '1px solid #8B5CF630' }}>
        <div className="text-xs tracking-[3px] uppercase font-mono mb-2" style={{ color: '#8B5CF6' }}>
          GP Platform Transaction Flow
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {[
            { step: '1', label: 'Carry Mapping', desc: 'LPA + carry plan stack' },
            { step: '2', label: 'Tax Analysis', desc: 'Section 1061 + exceptions' },
            { step: '3', label: 'Governance Review', desc: 'Key person + CoC triggers' },
            { step: '4', label: 'Valuation', desc: 'NAV + discount + escrow' },
            { step: '5', label: 'Retention Design', desc: 'Rollover + re-grant' },
            { step: '6', label: 'LP Consent', desc: 'LPAC notification + vote' },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-3">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-1" style={{ background: '#8B5CF620', color: '#8B5CF6' }}>
                  {s.step}
                </div>
                <div className="text-[11px] font-bold" style={{ color: 'var(--mr-text)' }}>{s.label}</div>
                <div className="text-[10px]" style={{ color: 'var(--mr-text-faint)' }}>{s.desc}</div>
              </div>
              {i < 5 && <span className="text-lg" style={{ color: 'var(--mr-text-faint)' }}>{'\u2192'}</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
