'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard, RadarChart, Sparkline } from '@/components/demos/proofline';
import {
  BRAND_FAMILIES,
  BRAND_TOTAL_REVENUE as TOTAL_QUARTERLY_REVENUE,
  SUPPLIER_PORTFOLIO_SHARE,
  SUPPLIER_COLORS,
  getBrandsBySupplier,
  SCENARIOS,
  type SupplierGroup,
  type Scenario,
} from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

const SUPPLIERS: SupplierGroup[] = ['molson-coors', 'constellation', 'heineken', 'craft', 'sazerac', 'fmb-rtd'];
const SUPPLIER_NAMES: Record<SupplierGroup, string> = {
  'molson-coors': 'Molson Coors',
  constellation: 'Constellation',
  heineken: 'Heineken',
  craft: 'Craft / Regional',
  sazerac: 'Sazerac',
  'fmb-rtd': 'FMB / RTD',
};

/* ── Normal PDF helper ──────────────────── */
function normalPDF(x: number, mean: number, stddev: number): number {
  return (1 / (stddev * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * ((x - mean) / stddev) ** 2);
}

/* ── Mix Target Bar ──────────────────────── */
function MixTargetBar({
  supplier,
  current,
  target,
  maxPct,
  growthRate,
}: {
  supplier: SupplierGroup;
  current: number;
  target: number;
  maxPct: number;
  growthRate: number;
}) {
  const color = SUPPLIER_COLORS[supplier];
  const brands = getBrandsBySupplier(supplier);
  const supplierRev = brands.reduce((s, b) => s + b.revQ, 0);
  const supplierGP = brands.reduce((s, b) => s + b.revQ * b.gp, 0) / supplierRev;
  const delta = target - current;

  return (
    <div className="py-3 px-4 rounded-lg hover:opacity-80 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ background: color }} />
          <span className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>
            {SUPPLIER_NAMES[supplier]}
          </span>
          <span className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
            {brands.length} brands &middot; {fmtM(supplierRev)}/Q &middot; {pct(supplierGP)} GP
          </span>
        </div>
        <div className="flex items-center gap-3 text-[13px] font-mono">
          <span style={{ color: 'var(--pl-text-muted)' }}>Current: <strong style={{ color }}>{pct(current)}</strong></span>
          <span style={{ color: 'var(--pl-text-muted)' }}>Target: <strong style={{ color }}>{pct(target)}</strong></span>
          <span
            className="font-bold px-1.5 py-0.5 rounded text-[11px]"
            style={{
              color: growthRate > 0 ? '#22C55E' : growthRate < 0 ? '#F87171' : 'var(--pl-text-muted)',
              background: growthRate > 0 ? 'rgba(34,197,94,0.08)' : growthRate < 0 ? 'rgba(248,113,113,0.08)' : 'transparent',
            }}
          >
            {growthRate > 0 ? '+' : ''}{pct(growthRate)}
          </span>
        </div>
      </div>
      {/* Dual bar */}
      <div className="relative h-5 rounded-full" style={{ background: 'var(--pl-chart-bar-track)' }}>
        <div
          className="absolute top-0 h-full rounded-full transition-all duration-700"
          style={{ width: `${(current / maxPct) * 100}%`, background: color, opacity: 0.3 }}
        />
        <div
          className="absolute top-0 h-full rounded-full border-2 transition-all duration-700"
          style={{
            width: `${(target / maxPct) * 100}%`,
            borderColor: color,
            background: 'transparent',
          }}
        />
        <div
          className="absolute top-0 h-full w-0.5"
          style={{ left: `${(current / maxPct) * 100}%`, background: color }}
        />
      </div>
      <div className="flex items-center gap-4 mt-1.5 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        <span>filled = current</span>
        <span>outline = target</span>
        <span>{delta > 0 ? '+' : ''}{(delta * 100).toFixed(1)}pp shift</span>
      </div>
    </div>
  );
}

/* ── Plan Cost Sensitivity Data ────────── */
const PLAN_COST_DATA = [
  { scenario: 'Conservative', avgAttainment: '96%', totalComp: '$5.2M', compRev: '10.3%', variableSpend: '$1.8M', upsideRisk: '+$180K', idx: 0 },
  { scenario: 'Stretch', avgAttainment: '100%', totalComp: '$5.6M', compRev: '10.8%', variableSpend: '$2.1M', upsideRisk: '+$420K', idx: 1 },
  { scenario: 'Aggressive', avgAttainment: '104%', totalComp: '$6.4M', compRev: '11.6%', variableSpend: '$2.8M', upsideRisk: '+$850K', idx: 2 },
];

/* ── Cost Modeling Data ────────────────────────── */
const ATTAINMENT_BANDS = [
  { band: '<60%', reps: 2, totalPayout: 78000 },
  { band: '60-80%', reps: 6, totalPayout: 312000 },
  { band: '80-100%', reps: 15, totalPayout: 1680000 },
  { band: '100-120%', reps: 13, totalPayout: 1820000 },
  { band: '120-140%', reps: 5, totalPayout: 850000 },
  { band: '>140%', reps: 2, totalPayout: 420000 },
];

const COMP_TO_REV_TREND = [11.8, 11.5, 11.2, 11.0, 11.0, 10.9, 11.0, 11.0]; // 8 quarters

export default function BrandMixScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState<number>(1); // default: Stretch
  const scenario = SCENARIOS[selectedScenario];

  // Build target & growth maps
  const targetMap: Record<SupplierGroup, number> = {} as Record<SupplierGroup, number>;
  const growthMap: Record<SupplierGroup, number> = {} as Record<SupplierGroup, number>;
  scenario.supplierAdjustments.forEach(adj => {
    targetMap[adj.supplier] = adj.mixTarget;
    growthMap[adj.supplier] = adj.growthRate;
  });

  const maxPct = 0.45;

  // Portfolio metrics
  const totalGP = BRAND_FAMILIES.reduce((s, b) => s + b.revQ * b.gp, 0);
  const avgGP = totalGP / TOTAL_QUARTERLY_REVENUE;
  const emergingRev = BRAND_FAMILIES.filter(b => b.emerging).reduce((s, b) => s + b.revQ, 0);
  const emergingShare = emergingRev / TOTAL_QUARTERLY_REVENUE;
  const spiritsRev = getBrandsBySupplier('sazerac').reduce((s, b) => s + b.revQ, 0);

  /* ── Bell Curve SVG ──── */
  const bellW = 500;
  const bellH = 280;
  const bPadL = 50;
  const bPadR = 20;
  const bPadT = 30;
  const bPadB = 50;
  const bChartW = bellW - bPadL - bPadR;
  const bChartH = bellH - bPadT - bPadB;

  const bellXTicks = [60, 80, 100, 120, 140];
  const bXScale = (val: number) => bPadL + ((val - 60) / 80) * bChartW;
  const bellCurves = [
    { mean: 0.96, stddev: 0.08, color: SCENARIOS[0].color, name: SCENARIOS[0].name },
    { mean: 1.00, stddev: 0.10, color: SCENARIOS[1].color, name: SCENARIOS[1].name },
    { mean: 1.04, stddev: 0.14, color: SCENARIOS[2].color, name: SCENARIOS[2].name },
  ];

  // Find max density for y-scaling
  let maxDensity = 0;
  bellCurves.forEach(c => {
    const peakDensity = normalPDF(c.mean, c.mean, c.stddev);
    if (peakDensity > maxDensity) maxDensity = peakDensity;
  });
  const bYScale = (density: number) => bPadT + bChartH - (density / (maxDensity * 1.1)) * bChartH;

  // Generate curve paths
  function bellPath(mean: number, stddev: number): { line: string; area: string } {
    const pts: Array<[number, number]> = [];
    for (let i = 0; i <= 40; i++) {
      const x = 0.60 + (i / 40) * 0.80; // 60% to 140%
      const y = normalPDF(x, mean, stddev);
      pts.push([bXScale(x * 100), bYScale(y)]);
    }
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    const yBottom = bPadT + bChartH;
    const area = line + ` L ${pts[pts.length - 1][0].toFixed(1)} ${yBottom} L ${pts[0][0].toFixed(1)} ${yBottom} Z`;
    return { line, area };
  }

  return (
    <>
      <ActNavigation currentAct={2} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#7C3AED' }}>
          Brand Mix &amp; Scenarios &middot; Portfolio Strategy + FY2026 Modeling
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          Portfolio Strategy &amp; Scenario Comparison
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {BRAND_FAMILIES.length} brands across {SUPPLIERS.length} supplier groups &middot; 3 planning scenarios
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Q Revenue" value={fmtM(TOTAL_QUARTERLY_REVENUE)} accent="#7C3AED" sub="All brands" stagger={0} />
        <LightKpiCard label="Avg Gross Profit" value={pct(avgGP)} accent="#22C55E" sub="Blended margin" stagger={1} />
        <LightKpiCard label="Emerging Share" value={pct(emergingShare)} accent="#F59E0B" sub={`${BRAND_FAMILIES.filter(b => b.emerging).length} brands`} stagger={2} />
        <LightKpiCard label="Spirits Revenue" value={fmtM(spiritsRev)} accent="#F87171" sub={`${pct(spiritsRev / TOTAL_QUARTERLY_REVENUE)} of portfolio`} stagger={3} />
        <LightKpiCard label="Target Scenario" value={scenario.name} accent={scenario.color} sub={scenario.label} stagger={4} />
      </div>

      {/* ═══ Section A — 2 columns: Portfolio Targets + BBI Radar ═══ */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Left: Portfolio Targets */}
        <LightSectionCard title={`Portfolio Targets — ${scenario.name} Scenario`}>
          {/* Stacked bar */}
          <div className="h-9 rounded-lg flex overflow-hidden mb-4">
            {SUPPLIERS.map(s => (
              <div
                key={s}
                style={{
                  width: `${SUPPLIER_PORTFOLIO_SHARE[s] * 100}%`,
                  background: SUPPLIER_COLORS[s],
                }}
                title={`${SUPPLIER_NAMES[s]}: ${pct(SUPPLIER_PORTFOLIO_SHARE[s])}`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {SUPPLIERS.map(s => {
              const growth = growthMap[s] ?? 0;
              return (
                <div key={s} className="flex items-center gap-2 text-[11px] font-mono">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: SUPPLIER_COLORS[s] }} />
                  <span style={{ color: 'var(--pl-text)' }}>{SUPPLIER_NAMES[s]}</span>
                  <span style={{ color: 'var(--pl-text-muted)' }}>{pct(SUPPLIER_PORTFOLIO_SHARE[s])}</span>
                  <span
                    className="font-bold px-1 py-0.5 rounded text-[10px]"
                    style={{
                      color: growth > 0 ? '#22C55E' : growth < 0 ? '#F87171' : 'var(--pl-text-muted)',
                      background: growth > 0 ? 'rgba(34,197,94,0.08)' : growth < 0 ? 'rgba(248,113,113,0.08)' : 'transparent',
                    }}
                  >
                    {growth > 0 ? '+' : ''}{pct(growth)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Supplier detail bars */}
          <div className="space-y-1">
            {SUPPLIERS.map(supplier => (
              <MixTargetBar
                key={supplier}
                supplier={supplier}
                current={SUPPLIER_PORTFOLIO_SHARE[supplier]}
                target={targetMap[supplier] ?? SUPPLIER_PORTFOLIO_SHARE[supplier]}
                maxPct={maxPct}
                growthRate={growthMap[supplier] ?? 0}
              />
            ))}
          </div>
        </LightSectionCard>

        {/* Right: BBI Radar Chart */}
        <LightSectionCard title="Brand Balance Index — Rep Comparison">
          <RadarChart
            axes={['Core Volume', 'Import Mix', 'Emerging Growth', 'Spirits Pen.', 'Display Comp.', 'New Acct Rate']}
            series={[
              {
                label: 'Target',
                values: [0.90, 0.85, 0.80, 0.25, 0.92, 0.85],
                color: '#C6A052',
                filled: false,
                dashed: true,
              },
              {
                label: 'Marcus Webb (DAL-01)',
                values: [0.95, 0.82, 0.70, 0.18, 0.96, 1.0],
                color: '#3B82F6',
                filled: true,
              },
              {
                label: 'Jake Torres (LAR-02)',
                values: [0.78, 0.90, 0.85, 0.30, 0.82, 0.5],
                color: '#F87171',
                filled: true,
              },
            ]}
          />
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5" style={{ background: '#C6A052', display: 'inline-block', borderTop: '2px dashed #C6A052' }} />
              <span style={{ color: '#C6A052' }}>Target</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid #3B82F6' }} />
              <span style={{ color: '#3B82F6' }}>Marcus Webb (DAL-01)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(248,113,113,0.2)', border: '1px solid #F87171' }} />
              <span style={{ color: '#F87171' }}>Jake Torres (LAR-02)</span>
            </span>
          </div>
        </LightSectionCard>
      </div>

      {/* ═══ Section B — 2 columns: Scenario Comparison + Bell Curves ═══ */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Left: Scenario Comparison Table */}
        <LightSectionCard title="Scenario Comparison">
          <div className="grid grid-cols-3 gap-0">
            {SCENARIOS.map((s, i) => {
              const isActive = selectedScenario === i;
              const totalNewAccounts = s.hometownProjections.reduce((sum, h) => sum + h.newAccounts, 0);
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(i)}
                  className="text-left p-3 transition-colors rounded-lg"
                  style={{
                    borderTop: isActive ? `3px solid ${s.color}` : '3px solid transparent',
                    background: isActive ? `${s.color}0A` : 'transparent',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-[12px] font-bold" style={{ color: isActive ? s.color : 'var(--pl-text)' }}>
                      {s.name}
                    </span>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: `${s.color}15`, color: s.color }}
                    >
                      {s.label}
                    </span>
                  </div>

                  {/* Metric rows */}
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <MetricRow label="Revenue Target" value={fmtM(s.revenueTarget)} color={isActive ? s.color : undefined} />
                    <MetricRow label="YoY Growth" value={`+${pct(s.yoyGrowth)}`} color={isActive ? s.color : undefined} />
                    <MetricRow label="Case Target" value={`${(s.caseTarget / 1e6).toFixed(1)}M`} />
                    <MetricRow label="BBI Gate" value={`>=${pct(s.bbiThresholds.combined)}`} />
                    <MetricRow label="Spirits Share" value={pct(s.spiritsTarget.portfolioShare)} />
                    <MetricRow label="Laredo Routes" value={String(s.laredoRamp.yearEndRoutes)} />
                    <MetricRow label="New Accounts" value={String(totalNewAccounts)} />
                    <MetricRow label="Risk Count" value={String(s.risks.length)} color={s.risks.length > 4 ? '#F87171' : undefined} />
                  </div>
                </button>
              );
            })}
          </div>
        </LightSectionCard>

        {/* Right: Bell Curve Distributions */}
        <LightSectionCard title="Attainment Distribution — Scenario Comparison">
          <svg viewBox={`0 0 ${bellW} ${bellH}`} className="w-full">
            {/* Grid lines */}
            {bellXTicks.map(t => (
              <line key={t} x1={bXScale(t)} y1={bPadT} x2={bXScale(t)} y2={bPadT + bChartH}
                stroke="var(--pl-chart-grid)" strokeWidth="0.5" />
            ))}

            {/* Curves */}
            {bellCurves.map(c => {
              const { line, area } = bellPath(c.mean, c.stddev);
              return (
                <g key={c.name}>
                  <path d={area} fill={c.color} opacity="0.06" />
                  <path d={line} fill="none" stroke={c.color} strokeWidth="2" />
                </g>
              );
            })}

            {/* Target line at 100% */}
            <line x1={bXScale(100)} y1={bPadT} x2={bXScale(100)} y2={bPadT + bChartH}
              stroke="var(--pl-text-muted)" strokeWidth="1" strokeDasharray="4 3" />
            <text x={bXScale(100)} y={bPadT - 8} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="10" fontFamily="monospace">
              Target
            </text>

            {/* X-axis ticks */}
            {bellXTicks.map(t => (
              <g key={t}>
                <line x1={bXScale(t)} y1={bPadT + bChartH} x2={bXScale(t)} y2={bPadT + bChartH + 4}
                  stroke="var(--pl-text-faint)" strokeWidth="0.5" />
                <text x={bXScale(t)} y={bPadT + bChartH + 16} textAnchor="middle"
                  fill="var(--pl-text-faint)" fontSize="10" fontFamily="monospace">
                  {t}%
                </text>
              </g>
            ))}

            {/* Axis labels */}
            <text x={bellW / 2} y={bellH - 4} textAnchor="middle"
              fill="var(--pl-text-muted)" fontSize="10" fontFamily="monospace">
              Attainment
            </text>
            <line x1={bPadL} y1={bPadT + bChartH} x2={bPadL} y2={bPadT}
              stroke="var(--pl-text-faint)" strokeWidth="0.5" />
            <text x={14} y={bPadT + bChartH / 2} textAnchor="middle"
              fill="var(--pl-text-muted)" fontSize="10" fontFamily="monospace"
              transform={`rotate(-90, 14, ${bPadT + bChartH / 2})`}>
              Density
            </text>
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-2 text-[11px] font-mono">
            {bellCurves.map(c => (
              <span key={c.name} className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded" style={{ background: c.color, display: 'inline-block' }} />
                <span style={{ color: c.color }}>{c.name}</span>
              </span>
            ))}
          </div>
          <p className="text-[11px] mt-2" style={{ color: 'var(--pl-text-faint)' }}>
            Wider spread = higher risk, higher reward potential
          </p>
        </LightSectionCard>
      </div>

      {/* ═══ Plan Cost Sensitivity ═══ */}
      <LightSectionCard title="Plan Cost Sensitivity" className="mb-6">
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ color: 'var(--pl-text-muted)' }}>
              <th className="text-left font-medium pb-2">Scenario</th>
              <th className="text-right font-medium pb-2">Avg Attainment</th>
              <th className="text-right font-medium pb-2">Total Comp Cost</th>
              <th className="text-right font-medium pb-2">Comp/Revenue %</th>
              <th className="text-right font-medium pb-2">Variable Spend</th>
              <th className="text-right font-medium pb-2 pr-2">Upside Risk</th>
            </tr>
          </thead>
          <tbody>
            {PLAN_COST_DATA.map((row, i) => {
              const isActive = selectedScenario === row.idx;
              return (
                <tr
                  key={row.scenario}
                  style={{
                    background: i % 2 === 0 ? 'var(--pl-stripe)' : undefined,
                    borderLeft: isActive ? '3px solid #C6A052' : '3px solid transparent',
                  }}
                >
                  <td className="py-2 pl-1 font-mono font-bold" style={{ color: isActive ? SCENARIOS[row.idx].color : 'var(--pl-text)' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: SCENARIOS[row.idx].color }} />
                      {row.scenario}
                    </div>
                  </td>
                  <td className="py-2 text-right font-mono" style={{ color: 'var(--pl-text-muted)' }}>{row.avgAttainment}</td>
                  <td className="py-2 text-right font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{row.totalComp}</td>
                  <td className="py-2 text-right font-mono" style={{ color: 'var(--pl-text-muted)' }}>{row.compRev}</td>
                  <td className="py-2 text-right font-mono" style={{ color: '#C6A052' }}>{row.variableSpend}</td>
                  <td className="py-2 text-right font-mono pr-2" style={{ color: '#F59E0B' }}>{row.upsideRisk}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-[11px] font-mono mt-3" style={{ color: 'var(--pl-text-faint)' }}>
          Upside risk = additional comp cost if attainment exceeds plan by 10pp
        </p>
      </LightSectionCard>

      {/* ═══════ TOTAL COST OF COMPENSATION — MODELING ═══════ */}
      <LightSectionCard title="TOTAL COST OF COMPENSATION \u2014 MODELING">
        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <LightKpiCard label="Total Annual Field Comp" value="$4.92M" accent="#8B5CF6" />
          <LightKpiCard label="Comp-to-Revenue Ratio" value="11.0%" accent="#22C55E" sub="Benchmark: 10-13%" />
          <LightKpiCard label="Field FTEs" value="43" accent="#3B82F6" sub="36 RSRs + 6 managers + 1 director" />
          <LightKpiCard label="Avg Comp / FTE" value="$114K" accent="#F59E0B" sub="base + variable" />
        </div>

        {/* Attainment Distribution Bar Chart */}
        <div className="mb-6">
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--pl-text-muted)' }}>
            ATTAINMENT DISTRIBUTION — 43 REPS
          </div>
          <div className="w-full overflow-hidden rounded-xl" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
            <svg viewBox="0 0 600 200" className="w-full" style={{ minHeight: 160 }}>
              {ATTAINMENT_BANDS.map((band, i) => {
                const maxReps = Math.max(...ATTAINMENT_BANDS.map(b => b.reps));
                const barH = (band.reps / maxReps) * 120;
                const barW = 70;
                const gap = 20;
                const x = 40 + i * (barW + gap);
                const y = 150 - barH;
                const color = i < 3 ? '#3B82F6' : '#22C55E';
                return (
                  <g key={band.band}>
                    <rect x={x} y={y} width={barW} height={barH} rx={4} fill={color} opacity={0.8} />
                    <text x={x + barW / 2} y={y - 8} textAnchor="middle" fill={color} fontSize="13" fontWeight="bold" fontFamily="monospace">
                      {band.reps}
                    </text>
                    <text x={x + barW / 2} y={170} textAnchor="middle" fill="var(--pl-text-muted)" fontSize="10" fontFamily="monospace">
                      {band.band}
                    </text>
                    <text x={x + barW / 2} y={185} textAnchor="middle" fill="var(--pl-text-faint)" fontSize="9" fontFamily="monospace">
                      ${(band.totalPayout / 1000).toFixed(0)}K
                    </text>
                  </g>
                );
              })}
              {/* Axis line */}
              <line x1="30" y1="150" x2="580" y2="150" stroke="var(--pl-border)" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Sensitivity Card */}
        <div className="mb-6 p-4 rounded-xl" style={{
          background: 'rgba(245,158,11,0.06)',
          borderLeft: '4px solid #F59E0B',
          border: '1px solid rgba(245,158,11,0.15)',
        }}>
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-1" style={{ color: '#F59E0B' }}>
            SENSITIVITY ANALYSIS
          </div>
          <div className="text-sm font-bold mb-1" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
            +5% avg attainment = +$182K variable payout (+8.8%)
          </div>
          <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
            Model assumes current plan structure, territory assignments, and brand mix targets. Does not include kicker payouts.
          </div>
        </div>

        {/* Comp-to-Revenue Trend */}
        <div className="p-4 rounded-xl" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold font-mono uppercase tracking-widest" style={{ color: 'var(--pl-text-muted)' }}>
              COMP / REVENUE RATIO — 8-QUARTER TREND
            </div>
            <div className="text-sm font-bold font-mono" style={{ color: '#22C55E' }}>11.0%</div>
          </div>
          <Sparkline data={COMP_TO_REV_TREND} color="#22C55E" width={400} height={48} />
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-8 h-0 border-t border-dashed" style={{ borderColor: '#22C55E' }} />
              <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Low benchmark (10%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-0 border-t border-dashed" style={{ borderColor: '#F59E0B' }} />
              <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>High benchmark (13%)</span>
            </div>
          </div>
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        Mix targets derived from CEO revenue mandate, supplier incentive structures, and gate alignment.
        Bell curves model expected attainment distribution under each scenario. Wider variance = higher risk/reward.
      </div>
    </>
  );
}

/* ── Metric Row helper ──────────────────── */
function MetricRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: 'var(--pl-text-muted)' }}>{label}</span>
      <span className="font-bold" style={{ color: color ?? 'var(--pl-text)' }}>{value}</span>
    </div>
  );
}
