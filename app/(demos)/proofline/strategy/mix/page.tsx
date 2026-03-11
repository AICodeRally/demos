'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  BRAND_FAMILIES,
  BRAND_TOTAL_REVENUE as TOTAL_QUARTERLY_REVENUE,
  SUPPLIER_PORTFOLIO_SHARE,
  SUPPLIER_COLORS,
  getBrandsBySupplier,
  type SupplierGroup,
  type BrandFamily,
  HOMETOWNS,
  getRoutesByHometown,
  SCENARIOS,
} from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

/* ── Supplier display names ────────────────────── */
const SUPPLIER_NAMES: Record<SupplierGroup, string> = {
  'molson-coors': 'Molson Coors',
  'constellation': 'Constellation',
  'heineken': 'Heineken',
  'craft': 'Craft / Regional',
  'sazerac': 'Sazerac',
  'fmb-rtd': 'FMB / RTD',
};

const SUPPLIERS: SupplierGroup[] = ['molson-coors', 'constellation', 'heineken', 'craft', 'sazerac', 'fmb-rtd'];

/* ── Mix Target Bar ────────────────────────────── */
function MixTargetBar({
  supplier,
  current,
  target,
  maxPct,
}: {
  supplier: SupplierGroup;
  current: number;
  target: number;
  maxPct: number;
}) {
  const color = SUPPLIER_COLORS[supplier];
  const delta = target - current;
  const brands = getBrandsBySupplier(supplier);
  const supplierRev = brands.reduce((s, b) => s + b.revQ, 0);
  const supplierGP = brands.reduce((s, b) => s + b.revQ * b.gp, 0) / supplierRev;

  return (
    <>
    <div className="py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ background: color }} />
          <span className="text-[13px] font-bold" style={{ color: '#1A1A2E' }}>
            {SUPPLIER_NAMES[supplier]}
          </span>
          <span className="text-[13px] font-mono" style={{ color: '#A0AEC0' }}>
            {brands.length} brands · {fmtM(supplierRev)}/Q · {pct(supplierGP)} GP
          </span>
        </div>
        <div className="flex items-center gap-3 text-[13px] font-mono">
          <span style={{ color: '#718096' }}>Current: <strong style={{ color }}>{pct(current)}</strong></span>
          <span style={{ color: '#718096' }}>Target: <strong style={{ color }}>{pct(target)}</strong></span>
          <span
            className="font-bold"
            style={{ color: delta > 0 ? '#22C55E' : delta < 0 ? '#F87171' : '#718096' }}
          >
            {delta > 0 ? '+' : ''}{(delta * 100).toFixed(1)}pp
          </span>
        </div>
      </div>
      {/* Dual bar */}
      <div className="relative h-5 rounded-full" style={{ background: '#F1F5F9' }}>
        {/* Current */}
        <div
          className="absolute top-0 h-full rounded-full transition-all duration-700"
          style={{ width: `${(current / maxPct) * 100}%`, background: color, opacity: 0.3 }}
        />
        {/* Target */}
        <div
          className="absolute top-0 h-full rounded-full border-2 transition-all duration-700"
          style={{
            width: `${(target / maxPct) * 100}%`,
            borderColor: color,
            background: 'transparent',
          }}
        />
        {/* Current marker */}
        <div
          className="absolute top-0 h-full w-0.5"
          style={{ left: `${(current / maxPct) * 100}%`, background: color }}
        />
      </div>
      <div className="flex items-center gap-4 mt-1.5 text-xs font-mono" style={{ color: '#A0AEC0' }}>
        <span>■ filled = current</span>
        <span>□ outline = target</span>
      </div>
    </div>
    </>
  );
}

export default function BrandMixTargetsPage() {
  const [selectedScenario, setSelectedScenario] = useState<0 | 1 | 2>(1); // default to Stretch
  const scenario = SCENARIOS[selectedScenario];

  // Build target map from scenario supplier adjustments
  const targetMap: Record<SupplierGroup, number> = {} as Record<SupplierGroup, number>;
  scenario.supplierAdjustments.forEach(adj => {
    targetMap[adj.supplier] = adj.mixTarget;
  });

  const maxPct = 0.45; // max bar scale

  // Brand performance table — top brands by revenue
  const sortedBrands = [...BRAND_FAMILIES].sort((a, b) => b.revQ - a.revQ);

  // Portfolio metrics
  const totalGP = BRAND_FAMILIES.reduce((s, b) => s + b.revQ * b.gp, 0);
  const avgGP = totalGP / TOTAL_QUARTERLY_REVENUE;
  const emergingRev = BRAND_FAMILIES.filter(b => b.emerging).reduce((s, b) => s + b.revQ, 0);
  const emergingShare = emergingRev / TOTAL_QUARTERLY_REVENUE;
  const spiritsRev = getBrandsBySupplier('sazerac').reduce((s, b) => s + b.revQ, 0);

  return (
    <>
    
      <ActNavigation currentAct={2} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#7C3AED' }}>
          Brand Mix Targets &middot; Portfolio Optimization
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E', fontFamily: 'var(--pl-font)' }}>
          Supplier Mix Strategy
        </h1>
        <p className="text-[13px] mt-1" style={{ color: '#718096' }}>
          {BRAND_FAMILIES.length} brands across {SUPPLIERS.length} supplier groups &middot; Current vs target portfolio allocation
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6 items-stretch">
        <LightKpiCard label="Q Revenue" value={fmtM(TOTAL_QUARTERLY_REVENUE)} accent="#7C3AED" sub="All brands" />
        <LightKpiCard label="Avg Gross Profit" value={pct(avgGP)} accent="#22C55E" sub="Blended margin" />
        <LightKpiCard label="Emerging Share" value={pct(emergingShare)} accent="#F59E0B" sub={`${BRAND_FAMILIES.filter(b => b.emerging).length} brands`} />
        <LightKpiCard label="Spirits Revenue" value={fmtM(spiritsRev)} accent="#F87171" sub={`${pct(spiritsRev / TOTAL_QUARTERLY_REVENUE)} of portfolio`} />
        <LightKpiCard label="Target Scenario" value={scenario.name} accent={scenario.color} sub={scenario.label} />
      </div>

      {/* Scenario Selector */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[13px] font-mono" style={{ color: '#718096' }}>Scenario:</span>
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSelectedScenario(i as 0 | 1 | 2)}
            className="text-[12px] font-mono px-4 py-1.5 rounded-lg border transition-colors"
            style={{
              borderColor: selectedScenario === i ? s.color : '#E2E8F0',
              background: selectedScenario === i ? `${s.color}12` : 'white',
              color: selectedScenario === i ? s.color : '#718096',
              fontWeight: selectedScenario === i ? 700 : 400,
            }}
          >
            {s.name}
          </button>
        ))}
        <span className="text-[13px] font-mono ml-2" style={{ color: '#A0AEC0' }}>
          {scenario.description.slice(0, 80)}...
        </span>
      </div>

      {/* Mix Target Bars */}
      <LightSectionCard title={`Portfolio Mix — Current vs ${scenario.name} Target`} className="mb-6">
        <div className="space-y-1">
          {SUPPLIERS.map(supplier => (
            <MixTargetBar
              key={supplier}
              supplier={supplier}
              current={SUPPLIER_PORTFOLIO_SHARE[supplier]}
              target={targetMap[supplier] ?? SUPPLIER_PORTFOLIO_SHARE[supplier]}
              maxPct={maxPct}
            />
          ))}
        </div>

        {/* Summary delta */}
        <div className="mt-4 pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
          <div className="flex items-center gap-6 text-[13px] font-mono" style={{ color: '#718096' }}>
            <span>
              Revenue target: <strong style={{ color: '#1A1A2E' }}>{fmtM(scenario.revenueTarget)}</strong>
              ({scenario.yoyGrowth > 0 ? '+' : ''}{pct(scenario.yoyGrowth)} YoY)
            </span>
            <span>
              Spirits target: <strong style={{ color: '#F87171' }}>{pct(scenario.spiritsTarget.portfolioShare)}</strong> portfolio
            </span>
            <span>
              Gate combined: <strong style={{ color: '#1A1A2E' }}>≥{pct(scenario.emcoThresholds.combined)}</strong>
            </span>
          </div>
        </div>
      </LightSectionCard>

      {/* Top Brands Table */}
      <LightSectionCard title="Brand Performance — All 27 Brands by Revenue" className="mb-6">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-[12px]">
            <thead className="sticky top-0 bg-white">
              <tr style={{ color: '#718096' }}>
                <th className="text-left font-medium pb-3 pl-2">#</th>
                <th className="text-left font-medium pb-3">Brand</th>
                <th className="text-left font-medium pb-3">Supplier</th>
                <th className="text-left font-medium pb-3">Tier</th>
                <th className="text-right font-medium pb-3">Q Revenue</th>
                <th className="text-right font-medium pb-3">Q Cases</th>
                <th className="text-right font-medium pb-3">GP %</th>
                <th className="text-right font-medium pb-3">$/Case</th>
                <th className="text-right font-medium pb-3">Share</th>
                <th className="text-right font-medium pb-3 pr-2">Seasonal</th>
              </tr>
            </thead>
            <tbody>
              {sortedBrands.map((brand, i) => {
                const share = brand.revQ / TOTAL_QUARTERLY_REVENUE;
                const supplierColor = SUPPLIER_COLORS[brand.supplier];
                const q2Trend = brand.seasonalTrend[1]; // Q2 (current-ish)

                return (
                  <tr key={brand.id} className={i % 2 === 0 ? 'bg-[#F8FAFC]' : ''}>
                    <td className="py-2 pl-2 text-xs font-mono" style={{ color: '#A0AEC0' }}>{i + 1}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold" style={{ color: '#1A1A2E' }}>{brand.name}</span>
                        {brand.emerging && (
                          <span className="text-xs font-bold font-mono px-1 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B' }}>
                            {brand.tier === 'New Launch' ? 'NEW' : 'EMG'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2">
                      <span className="text-[13px] font-mono" style={{ color: supplierColor }}>{SUPPLIER_NAMES[brand.supplier]}</span>
                    </td>
                    <td className="py-2 text-[13px] font-mono" style={{ color: '#718096' }}>{brand.tier}</td>
                    <td className="py-2 text-right font-mono font-bold" style={{ color: '#1A1A2E' }}>{fmtM(brand.revQ)}</td>
                    <td className="py-2 text-right font-mono" style={{ color: '#718096' }}>{fmt(brand.casesQ)}</td>
                    <td className="py-2 text-right font-mono" style={{ color: brand.gp >= 0.28 ? '#22C55E' : brand.gp >= 0.22 ? '#3B82F6' : '#718096' }}>
                      {pct(brand.gp)}
                    </td>
                    <td className="py-2 text-right font-mono" style={{ color: '#718096' }}>${brand.revenuePerCase}</td>
                    <td className="py-2 text-right font-mono font-bold" style={{ color: supplierColor }}>
                      {(share * 100).toFixed(1)}%
                    </td>
                    <td className="py-2 text-right pr-2">
                      <span className="text-xs font-mono" style={{ color: q2Trend >= 1.1 ? '#22C55E' : q2Trend >= 1.0 ? '#718096' : '#F87171' }}>
                        Q2: {q2Trend >= 1.0 ? '+' : ''}{((q2Trend - 1) * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LightSectionCard>

      {/* Supplier Strategy Notes */}
      <LightSectionCard title={`${scenario.name} Scenario — Supplier Strategy Notes`} className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          {scenario.supplierAdjustments.map(adj => {
            const color = SUPPLIER_COLORS[adj.supplier];
            return (
              <div key={adj.supplier} className="rounded-lg border p-3" style={{ borderColor: '#E2E8F0' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-[12px] font-bold" style={{ color: '#1A1A2E' }}>
                    {SUPPLIER_NAMES[adj.supplier]}
                  </span>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: adj.growthRate >= 0.05 ? '#22C55E' : adj.growthRate >= 0 ? '#3B82F6' : '#F87171' }}
                  >
                    {adj.growthRate >= 0 ? '+' : ''}{pct(adj.growthRate)} growth
                  </span>
                </div>
                <p className="text-[13px]" style={{ color: '#718096' }}>{adj.notes}</p>
              </div>
            );
          })}
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: '#A0AEC0' }}>
        Mix targets derived from CEO revenue mandate, supplier incentive structures, and gate alignment.
        Filled bar = current portfolio share. Outline = target under selected scenario. GP = gross profit margin.
      </div>
    
    </>
  );
}
