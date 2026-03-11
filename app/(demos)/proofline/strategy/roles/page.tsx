'use client';

import { useState } from 'react';
import { Users, Building2, Truck, Package, ChevronDown, ChevronRight } from 'lucide-react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  ROLE_DEFINITIONS, COMMISSION_BANDS,
  ROUTES, HOMETOWNS,
  type RoleDefinition, type CommissionBand,
} from '@/data/proofline';
import { fmt, fmtM, pct } from '@/lib/utils';

const ROLE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Users, Building2, Truck, Package,
};

/* ── Tenure table data ──────────────────── */
const TENURE_ROWS = [
  { tenure: '0-6 months', baseAdj: '+0%', variableAdj: 'Draw period', rationale: 'Guaranteed floor, no commission recovery' },
  { tenure: '6-12 months', baseAdj: '+0%', variableAdj: 'Standard', rationale: 'Full commission rates, draw recovery begins' },
  { tenure: '1-2 years', baseAdj: '+3%', variableAdj: '+0%', rationale: 'Experience premium on base' },
  { tenure: '2-5 years', baseAdj: '+6%', variableAdj: '+0%', rationale: 'Retention tier, market adjustment' },
  { tenure: '5+ years', baseAdj: '+10%', variableAdj: '+0%', rationale: 'Senior tier, institutional knowledge premium' },
];

/* ── Channel rate data ──────────────────── */
const CHANNEL_RATES = [
  { label: 'Off-Premise', rate: 1.6, desc: 'grocery, convenience, package stores' },
  { label: 'On-Premise', rate: 2.2, desc: 'bars, restaurants, hotels' },
  { label: 'Draught', rate: 2.7, desc: 'on-premise + draught adder (+0.5%)' },
  { label: 'Spirits On-Premise', rate: 2.5, desc: 'Sazerac on-premise (+0.3%)' },
];
const MAX_CHANNEL_RATE = 2.7;

export default function RolesMechanicsPage() {
  const [kamOpen, setKamOpen] = useState(false);
  const [dsmOpen, setDsmOpen] = useState(false);
  const [channelOpen, setChannelOpen] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);

  const totalHeadcount = ROLE_DEFINITIONS.reduce((s, r) => s + r.headcount, 0);
  const totalCompBudget = ROLE_DEFINITIONS.reduce((s, r) => s + r.ote * r.headcount, 0);
  const totalAnnualRev = ROUTES.reduce((s, r) => s + r.rev, 0) * 4;
  const revPerFTE = totalAnnualRev / totalHeadcount;
  const compOverRevenue = totalCompBudget / totalAnnualRev;
  const totalVariable = ROLE_DEFINITIONS.reduce((s, r) => s + (r.ote * r.payMix.variable / 100) * r.headcount, 0);
  const variableOverRevenue = totalVariable / totalAnnualRev;
  const avgAttainment = ROUTES.reduce((s, r) => s + r.attain, 0) / ROUTES.length;

  const sortedRoles = [...ROLE_DEFINITIONS].sort((a, b) => b.ote - a.ote);
  const maxOTE = Math.max(...ROLE_DEFINITIONS.map(r => r.ote));

  /* ── Accelerator curve SVG helpers ──── */
  const svgW = 500;
  const svgH = 300;
  const padL = 55;
  const padR = 20;
  const padT = 35;
  const padB = 40;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  const xTicks = [0, 50, 80, 100, 120, 150, 200];
  const yTicks = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];
  const xScale = (val: number) => padL + (val / 200) * chartW;
  const yScale = (val: number) => padT + chartH - (val / 3.5) * chartH;

  // Build step function path from COMMISSION_BANDS
  const bandPoints: Array<{ x: number; y: number }> = [];
  COMMISSION_BANDS.forEach(band => {
    const ratePercent = band.rate * 100; // e.g. 0.008 -> 0.8
    bandPoints.push({ x: band.minAttainment * 100, y: ratePercent });
    bandPoints.push({ x: band.maxAttainment * 100 > 200 ? 200 : band.maxAttainment * 100, y: ratePercent });
  });

  const pathD = bandPoints.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`
  ).join(' ');

  // Area path (close to bottom)
  const areaD = pathD + ` L ${xScale(bandPoints[bandPoints.length - 1].x)} ${yScale(0)} L ${xScale(bandPoints[0].x)} ${yScale(0)} Z`;

  // Band label positions & colors
  const bandLabels = [
    { label: 'Ramp', x: 25, color: '#64748B' },
    { label: 'Base', x: 65, color: '#3B82F6' },
    { label: 'Target', x: 90, color: '#22C55E' },
    { label: 'Accelerator', x: 110, color: '#C6A052' },
    { label: 'Super', x: 135, color: '#F59E0B' },
    { label: 'Decel', x: 175, color: '#F87171' },
  ];

  return (
    <>
      <ActNavigation currentAct={2} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#7C3AED' }}>
          Roles &amp; Mechanics &middot; FY2026 Compensation Architecture
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          Sales Force Job Architecture
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          4 roles, {totalHeadcount} headcount, ${fmtM(totalCompBudget)} total comp budget
        </p>
      </div>

      {/* ═══ Section A — Role Cards ═══ */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {ROLE_DEFINITIONS.map(role => {
          const Icon = ROLE_ICONS[role.icon];
          return (
            <div
              key={role.role}
              className="rounded-xl p-5 hover:shadow-md transition-shadow"
              style={{ border: '1px solid var(--pl-border)', background: 'var(--pl-card)' }}
            >
              {/* Top row */}
              <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon size={24} className="shrink-0" />}
                <span className="text-lg font-bold" style={{ color: 'var(--pl-text)' }}>{role.title}</span>
              </div>

              {/* Headcount badge */}
              <span
                className="inline-block text-[11px] font-mono px-2 py-0.5 rounded-full mb-3"
                style={{ background: 'var(--pl-stripe)', color: 'var(--pl-text-muted)' }}
              >
                {role.headcount} positions
              </span>

              {/* Pay mix bar */}
              <div className="h-2 rounded-full flex overflow-hidden mb-1">
                <div style={{ width: `${role.payMix.base}%`, background: '#64748B' }} />
                <div style={{ width: `${role.payMix.variable}%`, background: '#C6A052' }} />
              </div>
              <div className="text-xs font-mono mb-3" style={{ color: 'var(--pl-text-muted)' }}>
                {role.payMix.base}% base / {role.payMix.variable}% variable
              </div>

              {/* OTE */}
              <div className="text-2xl font-bold mb-0.5" style={{ color: '#C6A052' }}>
                ${fmt(role.ote)}
              </div>
              <div className="text-xs font-mono mb-3" style={{ color: 'var(--pl-text-muted)' }}>
                ${fmt(role.baseRange[0])} - ${fmt(role.baseRange[1])}
              </div>

              {/* Primary metric */}
              <span
                className="inline-block text-[11px] font-mono font-bold px-2 py-1 rounded mb-2"
                style={{ background: 'rgba(198,160,82,0.1)', color: '#C6A052' }}
              >
                {role.primaryMetric}
              </span>

              {/* Secondary metrics */}
              <div className="text-xs mb-2" style={{ color: 'var(--pl-text-muted)' }}>
                {role.secondaryMetrics.join(', ')}
              </div>

              {/* Description */}
              <p className="text-[13px] mt-2" style={{ color: 'var(--pl-text-muted)' }}>
                {role.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* ═══ Section B — 2 columns: Pay Architecture + Accelerator Curve ═══ */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Left: Pay Architecture */}
        <LightSectionCard title="Pay Architecture — Base vs Variable">
          <div className="space-y-3">
            {sortedRoles.map(role => {
              const barWidth = (role.ote / maxOTE) * 100;
              return (
                <div key={role.role} className="flex items-center gap-3">
                  <span className="w-32 text-[13px] font-mono font-bold shrink-0" style={{ color: 'var(--pl-text)' }}>
                    {role.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <div
                      className="h-7 rounded-md flex overflow-hidden"
                      style={{ width: `${barWidth}%` }}
                    >
                      <div style={{ width: `${role.payMix.base}%`, background: '#64748B' }} />
                      <div style={{ width: `${role.payMix.variable}%`, background: '#C6A052' }} />
                    </div>
                    <span className="text-[13px] font-mono font-bold shrink-0" style={{ color: '#C6A052' }}>
                      ${fmt(role.ote)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-[11px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#64748B' }} /> Base</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#C6A052' }} /> Variable</span>
          </div>

          {/* Tenure Adjustment Table */}
          <div className="mt-6">
            <h4 className="text-[13px] font-bold mb-3" style={{ color: 'var(--pl-text)' }}>Tenure Adjustments</h4>
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ color: 'var(--pl-text-muted)' }}>
                  <th className="text-left font-medium pb-2">Tenure</th>
                  <th className="text-left font-medium pb-2">Base Adj</th>
                  <th className="text-left font-medium pb-2">Variable Adj</th>
                  <th className="text-left font-medium pb-2">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {TENURE_ROWS.map((row, i) => (
                  <tr key={row.tenure} style={i % 2 === 0 ? { background: 'var(--pl-stripe)' } : undefined}>
                    <td className="py-1.5 font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{row.tenure}</td>
                    <td className="py-1.5 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{row.baseAdj}</td>
                    <td className="py-1.5 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{row.variableAdj}</td>
                    <td className="py-1.5" style={{ color: 'var(--pl-text-faint)' }}>{row.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LightSectionCard>

        {/* Right: Accelerator Curve + Gate Badges */}
        <div className="space-y-4">
          <LightSectionCard title="Commission Accelerator Curve">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
              {/* Grid lines */}
              {yTicks.map(t => (
                <line key={t} x1={padL} y1={yScale(t)} x2={svgW - padR} y2={yScale(t)}
                  stroke="var(--pl-chart-grid)" strokeWidth="0.5" />
              ))}

              {/* Area fill */}
              <path d={areaD} fill="#C6A052" opacity="0.06" />

              {/* Step function line */}
              <path d={pathD} fill="none" stroke="#C6A052" strokeWidth="2.5" />

              {/* Target line at 100% */}
              <line x1={xScale(100)} y1={padT} x2={xScale(100)} y2={padT + chartH}
                stroke="#22C55E" strokeWidth="1" strokeDasharray="4 3" />
              <text x={xScale(100)} y={padT - 8} textAnchor="middle" fill="#22C55E" fontSize="10" fontFamily="monospace">
                Target
              </text>

              {/* Cap line at 150% */}
              <line x1={xScale(150)} y1={padT} x2={xScale(150)} y2={padT + chartH}
                stroke="#F87171" strokeWidth="1" strokeDasharray="4 3" />
              <text x={xScale(150)} y={padT - 8} textAnchor="middle" fill="#F87171" fontSize="10" fontFamily="monospace">
                Cap
              </text>

              {/* Band labels along top */}
              {bandLabels.map(bl => (
                <text key={bl.label} x={xScale(bl.x)} y={padT + 14} textAnchor="middle"
                  fill={bl.color} fontSize="9" fontFamily="monospace" fontWeight="bold">
                  {bl.label}
                </text>
              ))}

              {/* X-axis ticks */}
              {xTicks.map(t => (
                <g key={t}>
                  <line x1={xScale(t)} y1={padT + chartH} x2={xScale(t)} y2={padT + chartH + 4}
                    stroke="var(--pl-text-faint)" strokeWidth="0.5" />
                  <text x={xScale(t)} y={padT + chartH + 16} textAnchor="middle"
                    fill="var(--pl-text-faint)" fontSize="10" fontFamily="monospace">
                    {t}%
                  </text>
                </g>
              ))}

              {/* Y-axis ticks */}
              {yTicks.filter(t => t > 0).map(t => (
                <text key={t} x={padL - 6} y={yScale(t) + 4} textAnchor="end"
                  fill="var(--pl-text-faint)" fontSize="10" fontFamily="monospace">
                  {t.toFixed(1)}%
                </text>
              ))}

              {/* Axis labels */}
              <text x={svgW / 2} y={svgH - 2} textAnchor="middle"
                fill="var(--pl-text-muted)" fontSize="10" fontFamily="monospace">
                Attainment
              </text>
              <text x={12} y={svgH / 2} textAnchor="middle"
                fill="var(--pl-text-muted)" fontSize="10" fontFamily="monospace"
                transform={`rotate(-90, 12, ${svgH / 2})`}>
                Rate
              </text>
            </svg>
          </LightSectionCard>

          {/* Gate Checkpoint Badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { gate: 'BBI Gate', value: '>= 75%', color: '#10B981', desc: 'Brand Balance Index must meet minimum threshold for variable eligibility' },
              { gate: 'New Account Gate', value: '>= 1/quarter', color: '#3B82F6', desc: 'At least one net-new account per quarter to qualify' },
              { gate: 'Compliance Gate', value: '>= 85%', color: '#F59E0B', desc: 'Display compliance floor for variable pay activation' },
            ].map(g => (
              <div
                key={g.gate}
                className="rounded-lg p-3"
                style={{ border: `1px solid ${g.color}30`, background: `${g.color}08` }}
              >
                <div className="text-[12px] font-bold mb-1" style={{ color: g.color }}>{g.gate}</div>
                <div className="text-lg font-bold font-mono mb-1" style={{ color: g.color }}>{g.value}</div>
                <p className="text-[11px]" style={{ color: 'var(--pl-text-muted)' }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Section C — Collapsible Mechanics ═══ */}
      <div className="space-y-3 mb-6">
        {/* KAM Mechanics */}
        <MechanicsToggle label="KAM Mechanics" open={kamOpen} onToggle={() => setKamOpen(!kamOpen)}>
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ color: 'var(--pl-text-muted)' }}>
                <th className="text-left font-medium pb-2">Component</th>
                <th className="text-left font-medium pb-2">Rate/Value</th>
                <th className="text-left font-medium pb-2">Trigger</th>
                <th className="text-left font-medium pb-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Base Commission', '1.8% of revenue', 'All revenue', 'Applied to managed account portfolio'],
                ['Growth Kicker', '3.0% of incremental', 'YoY growth > 0', 'Only on revenue above prior year'],
                ['Renewal Bonus', '$2,500', 'Annual renewal', 'Per retained key account'],
                ['SKU Placement', '$150/SKU', 'New SKU landed', 'Per net-new SKU in key account'],
              ].map((row, i) => (
                <tr key={row[0]} style={i % 2 === 0 ? { background: 'var(--pl-stripe)' } : undefined}>
                  <td className="py-1.5 font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{row[0]}</td>
                  <td className="py-1.5 font-mono" style={{ color: '#C6A052' }}>{row[1]}</td>
                  <td className="py-1.5 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{row[2]}</td>
                  <td className="py-1.5" style={{ color: 'var(--pl-text-faint)' }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </MechanicsToggle>

        {/* DSM Mechanics */}
        <MechanicsToggle label="DSM Mechanics" open={dsmOpen} onToggle={() => setDsmOpen(!dsmOpen)}>
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ color: 'var(--pl-text-muted)' }}>
                <th className="text-left font-medium pb-2">Component</th>
                <th className="text-left font-medium pb-2">Rate/Value</th>
                <th className="text-left font-medium pb-2">Trigger</th>
                <th className="text-left font-medium pb-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Team Override', '0.3% of district', 'All district revenue', 'Applied to total district production'],
                ['Distribution Bonus', '$5,000', '100% compliance', 'All routes meet distribution targets'],
                ['Turnover Penalty', '-$2,000', 'Rep departure', 'Per voluntary departure in quarter'],
              ].map((row, i) => (
                <tr key={row[0]} style={i % 2 === 0 ? { background: 'var(--pl-stripe)' } : undefined}>
                  <td className="py-1.5 font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{row[0]}</td>
                  <td className="py-1.5 font-mono" style={{ color: '#C6A052' }}>{row[1]}</td>
                  <td className="py-1.5 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{row[2]}</td>
                  <td className="py-1.5" style={{ color: 'var(--pl-text-faint)' }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </MechanicsToggle>

        {/* Channel Rate Differentials */}
        <MechanicsToggle label="Channel Rate Differentials" open={channelOpen} onToggle={() => setChannelOpen(!channelOpen)}>
          <div className="space-y-3 mb-4">
            {CHANNEL_RATES.map(ch => (
              <div key={ch.label} className="flex items-center gap-3">
                <span className="w-36 text-[13px] font-mono font-bold shrink-0" style={{ color: 'var(--pl-text)' }}>
                  {ch.label}
                </span>
                <div className="flex-1">
                  <div
                    className="h-5 rounded"
                    style={{ width: `${(ch.rate / MAX_CHANNEL_RATE) * 100}%`, background: '#C6A052' }}
                  />
                </div>
                <span className="text-[13px] font-mono font-bold w-14 text-right" style={{ color: '#C6A052' }}>
                  {ch.rate.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
          <div className="text-[11px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
            Off-Premise: grocery, convenience, package stores. On-Premise: bars, restaurants, hotels. Draught and Spirits adders stack on top of base channel rate.
          </div>
        </MechanicsToggle>

        {/* Draw/Guarantee Program */}
        <MechanicsToggle label="Draw / Guarantee Program" open={drawOpen} onToggle={() => setDrawOpen(!drawOpen)}>
          <div className="mb-3 text-[13px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>
            Draw amount: <strong style={{ color: '#C6A052' }}>$3,200 biweekly</strong> for 6 months &middot;
            Recovery rate: <strong style={{ color: '#F59E0B' }}>25%</strong> of earned commissions
          </div>
          <svg viewBox="0 0 400 60" className="w-full">
            {/* Guarantee period */}
            <rect x="20" y="10" width="170" height="30" rx="4" fill="#C6A052" opacity="0.2" stroke="#C6A052" strokeWidth="1" />
            <text x="105" y="28" textAnchor="middle" fill="#C6A052" fontSize="10" fontFamily="monospace" fontWeight="bold">
              Guarantee Period
            </text>
            <text x="105" y="50" textAnchor="middle" fill="var(--pl-text-muted)" fontSize="9" fontFamily="monospace">
              $3,200/biweekly
            </text>

            {/* Recovery period */}
            <rect x="200" y="10" width="170" height="30" rx="4" fill="#F59E0B" opacity="0.15" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 2" />
            <text x="285" y="28" textAnchor="middle" fill="#F59E0B" fontSize="10" fontFamily="monospace" fontWeight="bold">
              Recovery Period
            </text>
            <text x="285" y="50" textAnchor="middle" fill="var(--pl-text-muted)" fontSize="9" fontFamily="monospace">
              25% recovery
            </text>

            {/* Tick marks */}
            {[0, 3, 6, 9, 12].map(m => {
              const x = 20 + (m / 12) * 340;
              return (
                <g key={m}>
                  <line x1={x} y1={6} x2={x} y2={10} stroke="var(--pl-text-faint)" strokeWidth="0.5" />
                  <text x={x} y={4} textAnchor="middle" fill="var(--pl-text-faint)" fontSize="8" fontFamily="monospace">
                    M{m}
                  </text>
                </g>
              );
            })}
          </svg>
        </MechanicsToggle>
      </div>

      {/* ═══ Section D — Role Economics Strip ═══ */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <LightKpiCard label="Revenue/FTE" value={fmtM(revPerFTE)} accent="#7C3AED" sub="Annual per headcount" stagger={0} />
        <LightKpiCard label="Comp/Revenue" value={pct(compOverRevenue)} accent="#C6A052" sub="Total comp budget" stagger={1} />
        <LightKpiCard label="Variable/Revenue" value={pct(variableOverRevenue)} accent="#F59E0B" sub="At-risk compensation" stagger={2} />
        <LightKpiCard label="Avg Attainment" value={pct(avgAttainment)} accent="#22C55E" sub="All routes trailing" stagger={3} />
      </div>

      {/* Methodology footer */}
      <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        Role definitions based on FY2026 compensation plan. OTE = On-Target Earnings (base + variable at 100% attainment).
        Accelerator curve shows commission rate by attainment band. Gate checkpoints must be met for variable eligibility.
      </div>
    </>
  );
}

/* ── Collapsible mechanics section ──── */
function MechanicsToggle({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const Chevron = open ? ChevronDown : ChevronRight;
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-lg border transition-colors"
        style={{
          borderColor: open ? '#C6A052' : 'var(--pl-border)',
          background: open ? 'rgba(198,160,82,0.04)' : 'var(--pl-card)',
        }}
      >
        <Chevron size={16} style={{ color: '#C6A052' }} />
        <span className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{label}</span>
      </button>
      {open && (
        <LightSectionCard title="" className="mt-2">
          {children}
        </LightSectionCard>
      )}
    </div>
  );
}
