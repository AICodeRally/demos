'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  SCENARIOS,
  HOMETOWNS,
  getHometownById,
  type Scenario,
  type ScenarioId,
} from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

/* ── Scenario Card ────────────────────────────── */
function ScenarioCard({
  scenario,
  isSelected,
  onSelect,
}: {
  scenario: Scenario;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const annualRev = scenario.quarterlyProjection.reduce((s, q) => s + q, 0);

  return (
    <>
    <button
      onClick={onSelect}
      className="text-left rounded-xl border p-5 transition-all"
      style={{
        borderColor: isSelected ? scenario.color : '#E2E8F0',
        borderWidth: isSelected ? 2 : 1,
        boxShadow: isSelected ? `0 4px 12px ${scenario.color}20` : '0 1px 3px rgba(0,0,0,0.06)',
        background: isSelected ? `${scenario.color}06` : 'white',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full" style={{ background: scenario.color }} />
        <span className="text-[15px] font-extrabold" style={{ color: '#1A1A2E', fontFamily: 'var(--pl-font)' }}>
          {scenario.name}
        </span>
        <span
          className="text-xs font-bold font-mono px-1.5 py-0.5 rounded-full"
          style={{ background: `${scenario.color}15`, color: scenario.color }}
        >
          {scenario.label}
        </span>
      </div>
      <p className="text-[13px] mb-3" style={{ color: '#718096' }}>
        {scenario.description.slice(0, 100)}{scenario.description.length > 100 ? '...' : ''}
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="text-xs font-mono uppercase" style={{ color: '#A0AEC0' }}>Revenue</div>
          <div className="text-[15px] font-bold font-mono" style={{ color: '#1A1A2E' }}>{fmtM(scenario.revenueTarget)}</div>
        </div>
        <div>
          <div className="text-xs font-mono uppercase" style={{ color: '#A0AEC0' }}>Growth</div>
          <div className="text-[15px] font-bold font-mono" style={{ color: scenario.color }}>
            +{pct(scenario.yoyGrowth)}
          </div>
        </div>
        <div>
          <div className="text-xs font-mono uppercase" style={{ color: '#A0AEC0' }}>Risks</div>
          <div className="text-[15px] font-bold font-mono" style={{ color: scenario.risks.length >= 5 ? '#F87171' : '#718096' }}>
            {scenario.risks.length}
          </div>
        </div>
      </div>
    </button>
    </>
  );
}

/* ── Quarterly Projection Bars ─────────────────── */
function QuarterlyProjection({ scenario }: { scenario: Scenario }) {
  const maxQ = Math.max(...scenario.quarterlyProjection);
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const total = scenario.quarterlyProjection.reduce((s, q) => s + q, 0);

  return (
    <>
    <div>
      <div className="flex items-end gap-3 mb-3" style={{ height: 120 }}>
        {scenario.quarterlyProjection.map((val, i) => {
          const heightPct = (val / maxQ) * 100;
          return (
            <div key={quarters[i]} className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="text-xs font-mono font-bold mb-1" style={{ color: scenario.color }}>
                {fmtM(val)}
              </span>
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{ height: `${heightPct}%`, background: scenario.color, opacity: 0.7 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-3">
        {quarters.map((q, i) => (
          <div key={q} className="flex-1 text-center">
            <span className="text-[13px] font-mono font-bold" style={{ color: '#1A1A2E' }}>{q}</span>
          </div>
        ))}
      </div>
      <div className="text-center mt-2">
        <span className="text-[13px] font-mono" style={{ color: '#718096' }}>
          Annual total: <strong style={{ color: scenario.color }}>{fmtM(total)}</strong>
          {total !== scenario.revenueTarget && (
            <span style={{ color: '#A0AEC0' }}> (vs {fmtM(scenario.revenueTarget)} target)</span>
          )}
        </span>
      </div>
    </div>
    </>
  );
}

/* ── Gate Threshold Comparison ─────────────────── */
function EMCOComparison({ scenarios }: { scenarios: Scenario[] }) {
  const gates = ['core', 'import', 'emerging', 'combined'] as const;
  const gateLabels = { core: 'Core', import: 'Import', emerging: 'Emerging', combined: 'Combined' };

  return (
    <>
    <div className="space-y-3">
      {gates.map(gate => (
        <div key={gate} className="flex items-center gap-3">
          <span className="text-[12px] font-mono w-20 text-right" style={{ color: '#718096' }}>
            {gateLabels[gate]}
          </span>
          <div className="flex-1 flex items-center gap-2">
            {scenarios.map(s => {
              const val = s.emcoThresholds[gate];
              return (
                <div key={s.id} className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-3 rounded-full" style={{ background: '#F1F5F9' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${val * 100}%`, background: s.color, opacity: 0.7 }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold w-10 text-right" style={{ color: s.color }}>
                      {pct(val)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3 pt-2">
        <span className="w-20" />
        <div className="flex-1 flex gap-2">
          {scenarios.map(s => (
            <div key={s.id} className="flex-1 text-center">
              <span className="text-xs font-mono font-bold" style={{ color: s.color }}>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default function ScenarioModelingPage() {
  const [selected, setSelected] = useState<ScenarioId>('stretch');
  const activeScenario = SCENARIOS.find(s => s.id === selected)!;

  return (
    <>
    
      <ActNavigation currentAct={2} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#7C3AED' }}>
          Scenario Modeling &middot; FY2026 Planning
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E', fontFamily: 'var(--pl-font)' }}>
          Strategic Scenario Comparison
        </h1>
        <p className="text-[13px] mt-1" style={{ color: '#718096' }}>
          3 planning scenarios from conservative ($5.07B) to aggressive ($5.5B) &middot; Select to explore
        </p>
      </div>

      {/* Scenario Selector Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {SCENARIOS.map(s => (
          <ScenarioCard
            key={s.id}
            scenario={s}
            isSelected={selected === s.id}
            onSelect={() => setSelected(s.id)}
          />
        ))}
      </div>

      {/* KPI Row — selected scenario */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard
          label="Revenue Target"
          value={fmtM(activeScenario.revenueTarget)}
          accent={activeScenario.color}
          sub={`+${pct(activeScenario.yoyGrowth)} YoY`}
        />
        <LightKpiCard
          label="Case Target"
          value={`${(activeScenario.caseTarget / 1e6).toFixed(1)}M`}
          accent="#7C3AED"
        />
        <LightKpiCard
          label="Spirits Target"
          value={pct(activeScenario.spiritsTarget.portfolioShare)}
          accent="#F87171"
          sub={`${activeScenario.spiritsTarget.newSkuCount} new SKUs`}
        />
        <LightKpiCard
          label="Laredo Routes"
          value={String(activeScenario.laredoRamp.yearEndRoutes)}
          accent="#2563EB"
          sub={`${pct(activeScenario.laredoRamp.integrationPct)} integration`}
        />
        <LightKpiCard
          label="Risk Factors"
          value={String(activeScenario.risks.length)}
          accent={activeScenario.risks.length >= 5 ? '#F87171' : '#F59E0B'}
        />
      </div>

      {/* Two-column: Quarterly Projection + EMCO Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <LightSectionCard title={`${activeScenario.name} — Quarterly Revenue Projection`}>
          <QuarterlyProjection scenario={activeScenario} />
        </LightSectionCard>

        <LightSectionCard title="Gate Thresholds — All Scenarios">
          <EMCOComparison scenarios={SCENARIOS} />
        </LightSectionCard>
      </div>

      {/* Hometown Impact Table */}
      <LightSectionCard title={`${activeScenario.name} — Hometown Projections`} className="mb-6">
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ color: '#718096' }}>
              <th className="text-left font-medium pb-3 pl-2">Hometown</th>
              <th className="text-right font-medium pb-3">Case Growth</th>
              <th className="text-right font-medium pb-3">Revenue Growth</th>
              <th className="text-right font-medium pb-3">New Accounts</th>
              <th className="text-right font-medium pb-3">Spirits Penetration</th>
              <th className="text-right font-medium pb-3 pr-2">Impact</th>
            </tr>
          </thead>
          <tbody>
            {activeScenario.hometownProjections.map((hp, i) => {
              const hometown = getHometownById(hp.hometownId);
              if (!hometown) return null;
              const impactRev = hometown.rev * hp.revenueGrowth * 4; // annual impact

              return (
                <tr key={hp.hometownId} className={i % 2 === 0 ? 'bg-[#F8FAFC]' : ''}>
                  <td className="py-2.5 pl-2 font-semibold" style={{ color: '#1A1A2E' }}>{hometown.name}</td>
                  <td className="py-2.5 text-right font-mono font-bold" style={{ color: hp.caseGrowth >= 0.05 ? '#22C55E' : '#3B82F6' }}>
                    +{pct(hp.caseGrowth)}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold" style={{ color: hp.revenueGrowth >= 0.05 ? '#22C55E' : '#3B82F6' }}>
                    +{pct(hp.revenueGrowth)}
                  </td>
                  <td className="py-2.5 text-right font-mono" style={{ color: '#1A1A2E' }}>+{hp.newAccounts}</td>
                  <td className="py-2.5 text-right font-mono" style={{ color: hp.spiritsPenetration >= 0.25 ? '#F87171' : '#718096' }}>
                    {pct(hp.spiritsPenetration)}
                  </td>
                  <td className="py-2.5 text-right pr-2 font-mono font-bold" style={{ color: activeScenario.color }}>
                    +{fmtM(impactRev)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </LightSectionCard>

      {/* Laredo Ramp + Spirits Side by Side */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <LightSectionCard title="Laredo Integration Ramp">
          <div className="space-y-3">
            {[
              { label: 'Year-End Routes', current: 4, target: activeScenario.laredoRamp.yearEndRoutes, unit: '' },
              { label: 'Target Accounts', current: 1100, target: activeScenario.laredoRamp.yearEndAccounts, unit: '' },
              { label: 'Q Case Target', current: 72000, target: activeScenario.laredoRamp.yearEndCases, unit: '' },
              { label: 'Integration', current: 0.60, target: activeScenario.laredoRamp.integrationPct, unit: '%' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-semibold" style={{ color: '#1A1A2E' }}>{item.label}</span>
                  <span className="text-[13px] font-mono" style={{ color: activeScenario.color }}>
                    {item.unit === '%' ? pct(item.target) : fmt(item.target)}
                  </span>
                </div>
                <div className="h-2.5 rounded-full" style={{ background: '#F1F5F9' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((item.target / (item.unit === '%' ? 1 : item.target * 1.3)) * 100, 100)}%`,
                      background: activeScenario.color,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <div className="text-xs font-mono mt-0.5" style={{ color: '#A0AEC0' }}>
                  Current: {item.unit === '%' ? pct(item.current) : fmt(item.current)}
                </div>
              </div>
            ))}
          </div>
        </LightSectionCard>

        <LightSectionCard title="Spirits Integration (Sazerac)">
          <div className="space-y-3">
            {[
              { label: 'Portfolio Share', value: activeScenario.spiritsTarget.portfolioShare, fmt: pct },
              { label: 'Account Penetration', value: activeScenario.spiritsTarget.accountPenetration, fmt: pct },
              { label: 'Q Revenue Target', value: activeScenario.spiritsTarget.revenueTarget, fmt: fmtM },
              { label: 'New SKUs', value: activeScenario.spiritsTarget.newSkuCount, fmt: (v: number) => String(v) },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#F1F5F9' }}>
                <span className="text-[12px]" style={{ color: '#718096' }}>{item.label}</span>
                <span className="text-[14px] font-bold font-mono" style={{ color: '#1A1A2E' }}>{item.fmt(item.value)}</span>
              </div>
            ))}
          </div>
        </LightSectionCard>
      </div>

      {/* Risk Factors */}
      <LightSectionCard title={`${activeScenario.name} — Risk Factors`} className="mb-6">
        <div className="space-y-2">
          {activeScenario.risks.map((risk, i) => (
            <div key={i} className="flex items-start gap-3 py-2">
              <span
                className="text-xs font-bold font-mono w-6 h-6 flex items-center justify-center rounded-full shrink-0"
                style={{
                  background: i < 3 ? 'rgba(248,113,113,0.08)' : 'rgba(245,158,11,0.08)',
                  color: i < 3 ? '#F87171' : '#F59E0B',
                }}
              >
                {i + 1}
              </span>
              <span className="text-[12px]" style={{ color: '#4A5568' }}>{risk}</span>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* Scenario Comparison Summary */}
      <LightSectionCard title="Side-by-Side Comparison" className="mb-6">
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ color: '#718096' }}>
              <th className="text-left font-medium pb-3 pl-2">Metric</th>
              {SCENARIOS.map(s => (
                <th key={s.id} className="text-right font-medium pb-3 pr-2">
                  <span style={{ color: s.color }}>{s.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Revenue Target', values: SCENARIOS.map(s => fmtM(s.revenueTarget)) },
              { label: 'YoY Growth', values: SCENARIOS.map(s => `+${pct(s.yoyGrowth)}`) },
              { label: 'Case Target', values: SCENARIOS.map(s => `${(s.caseTarget / 1e6).toFixed(1)}M`) },
              { label: 'EMCO Combined', values: SCENARIOS.map(s => `≥${pct(s.emcoThresholds.combined)}`) },
              { label: 'Spirits Share', values: SCENARIOS.map(s => pct(s.spiritsTarget.portfolioShare)) },
              { label: 'Laredo Routes', values: SCENARIOS.map(s => String(s.laredoRamp.yearEndRoutes)) },
              { label: 'New Accounts', values: SCENARIOS.map(s => String(s.hometownProjections.reduce((sum, h) => sum + h.newAccounts, 0))) },
              { label: 'Risk Count', values: SCENARIOS.map(s => String(s.risks.length)) },
            ].map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? 'bg-[#F8FAFC]' : ''}>
                <td className="py-2.5 pl-2 font-semibold" style={{ color: '#1A1A2E' }}>{row.label}</td>
                {row.values.map((v, j) => (
                  <td key={j} className="py-2.5 text-right pr-2 font-mono font-bold" style={{ color: SCENARIOS[j].color }}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: '#A0AEC0' }}>
        Scenarios model FY2026 outcomes under three risk profiles. Conservative protects base; Stretch meets CEO mandate ($5.2B);
        Aggressive pushes beyond with route expansion and maximum spirits ramp. All scenarios assume Molson Coors house alignment.
      </div>
    
    </>
  );
}
