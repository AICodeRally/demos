'use client';

import { ActNavigation, SectionCard, KpiCard, SignalStrip, ThesisSpotlight } from '@/components/demos/meridian';
import { FUND } from '@/data/meridian';
import { pct } from '@/lib/utils';

const TERMS = [
  { label: 'Fund Size', value: `$${(FUND.committedCapital / 1e9).toFixed(2)}B`, detail: `Target was $${(FUND.targetSize / 1e9).toFixed(1)}B — oversubscribed by $250M` },
  { label: 'Management Fee', value: pct(FUND.managementFee), detail: 'On committed capital during investment period; on invested capital thereafter' },
  { label: 'Carried Interest', value: pct(FUND.carriedInterest), detail: 'European (whole-fund) waterfall with GP catch-up' },
  { label: 'Hurdle Rate', value: pct(FUND.hurdleRate), detail: 'Compounding preferred return before GP participates in profits' },
  { label: 'GP Catch-Up', value: `${FUND.catchUpSplit[0]}/${FUND.catchUpSplit[1]}`, detail: 'GP receives 100% until 20% of total profit achieved' },
  { label: 'Post Catch-Up', value: `${FUND.postCatchUpSplit[0]}/${FUND.postCatchUpSplit[1]}`, detail: 'Standard carried interest split on remaining distributions' },
  { label: 'GP Commitment', value: `$${(FUND.gpCommitment / 1e6).toFixed(1)}M`, detail: `${pct(FUND.gpCommitmentPct)} of fund — demonstrates alignment` },
  { label: 'Investment Period', value: `${FUND.investmentPeriod} years`, detail: 'New platform investments; bolt-ons allowed outside period' },
  { label: 'Fund Life', value: `${FUND.fundLife} years`, detail: 'Two 1-year extensions with LPAC approval' },
  { label: 'Clawback', value: FUND.clawbackProvision ? 'Yes' : 'No', detail: '30% escrow holdback on carry distributions. Full clawback to LP preferred return.' },
  { label: 'Key Person', value: FUND.keyPersonClause.join(' & '), detail: 'Suspension trigger if either partner departs during investment period' },
];

export default function FundTermsPage() {
  return (
    <>
      <ActNavigation currentAct={1} />

      {/* Signal Strip */}
      <SignalStrip
        signals={[
          { label: 'LP Alignment', value: 'Strong', status: 'green', detail: '3% GP commit' },
          { label: 'Waterfall', value: 'European', status: 'green', detail: 'Whole-fund model' },
          { label: 'Clawback', value: '30% Escrow', status: 'green', detail: 'LP protection active' },
          { label: 'Key Person', value: 'In Place', status: 'green', detail: 'Both partners active' },
        ]}
      />

      <div className="mt-2 mb-8 animate-mr-fade-in">
        <div className="text-[11px] tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#D4A847' }}>
          Fund Structure &middot; Legal Terms
        </div>
        <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Fund IV — Key Terms & Structure
        </h1>
        <p className="text-[14px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>
          Delaware LP &middot; Cayman feeder &middot; European waterfall &middot; Vintage 2022
        </p>
      </div>

      {/* Thesis Spotlight */}
      <ThesisSpotlight
        headline="LP-Friendly Structure with Strong Alignment"
        insight="Fund IV employs a European (whole-fund) waterfall with 30% carry escrow, ensuring LPs receive full return of capital plus 8% preferred return before GP participates in profits. GP commitment of 3% demonstrates skin-in-the-game alignment."
        accentColor="#D4A847"
        implications={[
          'Oversubscription by $250M reflects strong LP confidence — 8 of 10 LPs are re-ups from Fund III.',
          'Clawback provision with escrow holdback provides downside protection rarely seen in mid-market PE funds.',
        ]}
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <KpiCard label="Carry Rate" value="20%" accent="#D4A847" sub="Above 8% hurdle" variant="primary" stagger={0} />
        <KpiCard label="Mgmt Fee" value="2.0%" accent="#3B82F6" sub="On committed capital" variant="primary" stagger={1} />
        <KpiCard label="GP Commit" value={`$${(FUND.gpCommitment / 1e6).toFixed(0)}M`} accent="#10B981" sub={`${pct(FUND.gpCommitmentPct)} of fund`} delta="3%" deltaDirection="neutral" stagger={2} />
        <KpiCard label="Escrow" value="30%" accent="#F59E0B" sub="Clawback holdback" stagger={3} />
      </div>

      {/* Terms Table */}
      <SectionCard title="Fund IV Term Sheet Summary" meta="11 key provisions">
        <div className="overflow-x-auto -mx-1">
          <div className="space-y-0 min-w-[600px]">
            {TERMS.map((t, i) => (
              <div
                key={t.label}
                className="flex items-start gap-4 py-3 px-3"
                style={i % 2 === 0 ? { background: 'var(--mr-stripe)', borderRadius: 8 } : undefined}
              >
                <div className="w-40 shrink-0">
                  <div className="text-xs font-bold uppercase font-semibold" style={{ color: 'var(--mr-text-muted)' }}>{t.label}</div>
                </div>
                <div className="w-32 shrink-0">
                  <div className="text-[16px] font-bold tabular-nums" style={{ color: '#D4A847' }}>{t.value}</div>
                </div>
                <div className="flex-1">
                  <div className="text-[13px]" style={{ color: 'var(--mr-text-secondary)' }}>{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Waterfall Structure Diagram */}
      <SectionCard title="Waterfall Structure (European / Whole-Fund)" variant="hero" accentColor="#D4A847">
        <div className="space-y-3">
          {[
            { step: 1, name: 'Return of Capital', desc: 'LPs receive 100% of distributions until all called capital ($1.93B) is returned', split: '0 / 100', color: '#6B7280' },
            { step: 2, name: 'Preferred Return', desc: '8% compounding IRR hurdle on called capital before GP participates', split: '0 / 100', color: '#3B82F6' },
            { step: 3, name: 'GP Catch-Up', desc: 'GP receives 100% until GP has received 20% of total cumulative profits', split: '100 / 0', color: '#D4A847' },
            { step: 4, name: 'Carried Interest', desc: 'All remaining distributions split 20% GP / 80% LP in perpetuity', split: '20 / 80', color: '#10B981' },
          ].map((s, i) => (
            <div
              key={s.step}
              className="flex items-center gap-4 p-4 rounded-xl hover:shadow-lg transition-all animate-mr-fade-in"
              style={{ background: `${s.color}08`, border: `1px solid ${s.color}25`, animationDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: `${s.color}20`, color: s.color }}>
                {s.step}
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-bold" style={{ color: 'var(--mr-text)' }}>{s.name}</div>
                <div className="text-[12px]" style={{ color: 'var(--mr-text-muted)' }}>{s.desc}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs" style={{ color: 'var(--mr-text-faint)' }}>GP / LP</div>
                <div className="text-[16px] font-bold tabular-nums" style={{ color: s.color }}>{s.split}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Key Person */}
      <div className="rounded-xl px-6 py-4 animate-mr-fade-in" style={{ background: 'rgba(239,68,68,0.04)', borderLeft: '3px solid #EF4444', animationDelay: '400ms' }}>
        <div className="text-xs font-bold mb-1" style={{ color: '#EF4444' }}>KEY PERSON CLAUSE</div>
        <p className="text-[13px]" style={{ color: 'var(--mr-text-secondary)' }}>
          If either <strong>{FUND.keyPersonClause[0]}</strong> or <strong>{FUND.keyPersonClause[1]}</strong> ceases
          to devote substantially all professional time to Fund IV, the investment period suspends until LPAC vote (majority-in-interest).
          Cure period: 180 days to propose replacement.
        </p>
      </div>
    </>
  );
}
