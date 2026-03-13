'use client';

import { ActNavigation, SectionCard, KpiCard } from '@/components/demos/meridian';
import { CLAWBACK_SCENARIOS, CARRY_POOL_SUMMARY } from '@/data/meridian';

export default function ClawbackAnalysisPage() {
  return (
    <>
      <ActNavigation currentAct={4} />

      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#10B981' }}>
          Risk Management &middot; Clawback
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--mr-text)', fontFamily: 'var(--mr-font)' }}>
          Clawback Analysis & Escrow
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <KpiCard label="Escrow Rate" value={`${(CARRY_POOL_SUMMARY.clawbackEscrow * 100).toFixed(0)}%`} accent="#EF4444" sub="Of carry distributions" stagger={0} />
        <KpiCard label="Base Case Carry" value="$335M" accent="#10B981" sub="No clawback risk" stagger={1} />
        <KpiCard label="Downside Carry" value="$192M" accent="#F59E0B" sub="-20% NAV scenario" stagger={2} />
        <KpiCard label="Max Clawback" value="$290M" accent="#EF4444" sub="Catastrophic scenario" stagger={3} />
      </div>

      {/* Scenario Analysis */}
      <SectionCard title="Clawback Scenario Analysis">
        <div className="space-y-3">
          {CLAWBACK_SCENARIOS.map((s) => {
            const riskColor = s.clawbackRisk === 0 ? '#10B981' : s.clawbackRisk < 100 ? '#F59E0B' : '#EF4444';
            return (
              <div key={s.scenario} className="p-4 rounded-lg border" style={{ borderColor: `${riskColor}25`, background: `${riskColor}04` }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold" style={{ color: 'var(--mr-text)' }}>{s.scenario}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${riskColor}15`, color: riskColor }}>
                        {(s.probability * 100).toFixed(0)}% probability
                      </span>
                    </div>
                    <div className="text-[12px] mt-1" style={{ color: 'var(--mr-text-muted)' }}>{s.description}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div className="text-center p-2 rounded" style={{ background: 'var(--mr-card)' }}>
                    <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>Total Distributions</div>
                    <div className="text-lg font-bold font-mono" style={{ color: 'var(--mr-text)' }}>${(s.totalDistributions / 1e3).toFixed(1)}B</div>
                  </div>
                  <div className="text-center p-2 rounded" style={{ background: 'var(--mr-card)' }}>
                    <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>GP Carry</div>
                    <div className="text-lg font-bold font-mono" style={{ color: s.gpCarry > 0 ? '#10B981' : '#EF4444' }}>
                      ${s.gpCarry}M
                    </div>
                  </div>
                  <div className="text-center p-2 rounded" style={{ background: 'var(--mr-card)' }}>
                    <div className="text-xs font-mono" style={{ color: 'var(--mr-text-faint)' }}>Clawback Risk</div>
                    <div className="text-lg font-bold font-mono" style={{ color: riskColor }}>
                      {s.clawbackRisk === 0 ? 'None' : `$${s.clawbackRisk}M`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Escrow Mechanics */}
      <SectionCard title="Clawback Escrow Mechanics">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <div className="text-xs font-bold font-mono mb-2" style={{ color: '#EF4444' }}>ESCROW PROVISIONS</div>
            <div className="space-y-2 text-[13px]" style={{ color: 'var(--mr-text-secondary)' }}>
              <div><strong>Holdback:</strong> 30% of all carry distributions held in escrow</div>
              <div><strong>Release:</strong> Escrow released upon fund liquidation or when LPAC determines no remaining clawback risk</div>
              <div><strong>Guarantee:</strong> Individual GP partners jointly and severally liable for clawback obligations</div>
              <div><strong>Tax offset:</strong> Clawback calculated net of taxes paid on carry distributions</div>
            </div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="text-xs font-bold font-mono mb-2" style={{ color: '#10B981' }}>LP PROTECTIONS</div>
            <div className="space-y-2 text-[13px]" style={{ color: 'var(--mr-text-secondary)' }}>
              <div><strong>Whole-fund waterfall:</strong> Carry only after ALL capital + pref returned (not deal-by-deal)</div>
              <div><strong>True-up:</strong> Annual waterfall recalculation ensures GP never receives excess carry</div>
              <div><strong>LPAC oversight:</strong> Advisory committee reviews all distributions and clawback calculations</div>
              <div><strong>Third-party audit:</strong> Annual fund audit by Big 4 includes carry calculation verification</div>
            </div>
          </div>
        </div>
      </SectionCard>
    </>
  );
}
