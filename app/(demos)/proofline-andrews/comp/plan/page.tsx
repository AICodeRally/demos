'use client';

import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  COMP_PLAN,
  COMP_TIERS,
  BBI_GATES,
  SPIRITS_ADDER,
  estimateQuarterlyEarnings,
} from '@/data/proofline';
import { fmt, pct } from '@/lib/utils';

/* ── Horizontal Tier Track ────────────────────── */
function TierTrack() {
  const w = 700, h = 180;
  const trackY = 78, trackH = 44;
  const pad = 40;
  const trackW = w - pad * 2;
  const maxAtt = 1.30;
  const toX = (att: number) => pad + (Math.min(att, maxAtt) / maxAtt) * trackW;

  const tiers = [...COMP_TIERS].reverse(); // T4 at left → T1 at right
  const tierColors = ['#94A3B8', '#F59E0B', '#2563EB', '#22C55E'];
  const marcus = 0.92; // sample position

  return (
    <>
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      <text x={w / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="bold" fill="var(--pl-text)" fontFamily="monospace">
        ATTAINMENT PROGRESSION → TIER → COMMISSION RATE
      </text>

      {/* Background track */}
      <rect x={pad} y={trackY} width={trackW} height={trackH} rx={8} fill="var(--pl-chart-bar-track)" />

      {/* Tier bands */}
      {tiers.map((tier, i) => {
        const x1 = toX(tier.floor);
        const x2 = toX(tier.ceiling === 999 ? maxAtt : tier.ceiling);
        const color = tierColors[i];
        return (
          <g key={tier.level}>
            <rect x={x1} y={trackY} width={x2 - x1} height={trackH} fill={`${color}20`} stroke={color} strokeWidth="1.5" />

            {/* Commission rate above */}
            <text x={(x1 + x2) / 2} y={trackY - 22} textAnchor="middle" fontSize="20" fontWeight="bold" fill={color} fontFamily="monospace">
              {(tier.rate * 100).toFixed(1)}%
            </text>
            <text x={(x1 + x2) / 2} y={trackY - 8} textAnchor="middle" fontSize="12" fill={color} fontFamily="monospace" fontWeight="bold">
              RATE
            </text>

            {/* Tier label inside band */}
            <text x={(x1 + x2) / 2} y={trackY + trackH / 2 + 2} textAnchor="middle" fontSize="12" fontWeight="bold" fill={color} fontFamily="monospace">
              T{tier.level} {tier.label.split(' \u2014 ')[1]}
            </text>

            {/* Attainment range below */}
            <text x={(x1 + x2) / 2} y={trackY + trackH + 14} textAnchor="middle" fontSize="12" fill="var(--pl-text-faint)" fontFamily="monospace">
              {tier.floor === 0 ? '0' : (tier.floor * 100).toFixed(0)}{'\u2013'}{tier.ceiling === 999 ? '\u221E' : (tier.ceiling * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}

      {/* Marcus position marker */}
      <line x1={toX(marcus)} y1={trackY - 30} x2={toX(marcus)} y2={trackY + trackH + 4} stroke="#F87171" strokeWidth="2" strokeDasharray="4 2" />
      <circle cx={toX(marcus)} cy={trackY + trackH / 2} r={6} fill="#F87171" stroke="white" strokeWidth="2" />
      <rect x={toX(marcus) - 36} y={trackY - 44} width={72} height={14} rx={4} fill="#F87171" />
      <text x={toX(marcus)} y={trackY - 34} textAnchor="middle" fontSize="12" fontWeight="bold" fill="white" fontFamily="monospace">
        MARCUS 92%
      </text>

      <text x={w / 2} y={h - 8} textAnchor="middle" fontSize="12" fill="var(--pl-text-faint)" fontFamily="monospace">
        Higher tiers = lower rate but higher absolute earnings (volume {'\u00D7'} rate). Inverted rates protect floor earnings.
      </text>
    </svg>
    </>
  );
}

/* ── Gate Rings ──────────────────────────── */
function BBIGateRings() {
  const w = 700, h = 200;
  const spacing = w / (BBI_GATES.length + 1);
  const r = 40;

  return (
    <>
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      <text x={w / 2} y={18} textAnchor="middle" fontSize="12" fontWeight="bold" fill="var(--pl-text)" fontFamily="monospace">
        GATE CASCADE — Multiplier Progression
      </text>

      <defs>
        {BBI_GATES.map(gate => (
          <linearGradient key={gate.name} id={`gr-${gate.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gate.color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={gate.color} stopOpacity="0.4" />
          </linearGradient>
        ))}
      </defs>

      {BBI_GATES.map((gate, i) => {
        const cx = spacing * (i + 1);
        const cy = 100;
        const circ = 2 * Math.PI * r;

        return (
          <g key={gate.name}>
            {/* Background ring */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--pl-chart-bar-track)" strokeWidth="8" />

            {/* Progress arc (fills to threshold %) */}
            <circle cx={cx} cy={cy} r={r} fill="none"
              stroke={`url(#gr-${gate.name})`} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${gate.threshold * circ} ${circ}`}
              transform={`rotate(-90 ${cx} ${cy})`}
            />

            {/* Multiplier value */}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="16" fontWeight="bold" fill="var(--pl-text)" fontFamily="monospace">
              {gate.multiplier.toFixed(2)}x
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="12" fontWeight="bold" fill={gate.color} fontFamily="monospace">
              {'\u2265'}{(gate.threshold * 100).toFixed(0)}%
            </text>

            {/* Gate name above ring */}
            <text x={cx} y={cy - r - 12} textAnchor="middle" fontSize="12" fontWeight="bold" fill={gate.color} fontFamily="monospace">
              {gate.name.toUpperCase()}
            </text>

            {/* Supplier groups below ring */}
            <text x={cx} y={cy + r + 16} textAnchor="middle" fontSize="12" fill="var(--pl-text-faint)" fontFamily="monospace">
              {gate.supplierGroups.join(' + ')}
            </text>

            {/* Flowing arrow connector */}
            {i < BBI_GATES.length - 1 && (
              <g>
                <path
                  d={`M${cx + r + 6},${cy} Q${cx + spacing / 2},${cy - 12} ${cx + spacing - r - 6},${cy}`}
                  fill="none" stroke="#CBD5E0" strokeWidth="2"
                />
                <polygon
                  points={`${cx + spacing - r - 12},${cy - 4} ${cx + spacing - r - 4},${cy} ${cx + spacing - r - 12},${cy + 4}`}
                  fill="#CBD5E0"
                />
              </g>
            )}
          </g>
        );
      })}

      <text x={w / 2} y={h - 8} textAnchor="middle" fontSize="12" fill="var(--pl-text-muted)" fontFamily="monospace">
        Cascade: Core {'\u2192'} Import {'\u2192'} Emerging {'\u2192'} Combined. Only highest unlocked multiplier applies.
      </text>
    </svg>
    </>
  );
}

/* ── Earnings Comparison ─────────────────────── */
function EarningsComparison() {
  const baseRev = 380000;
  const spiritsRev = 28000;

  const low = estimateQuarterlyEarnings(
    baseRev, 0.92,
    { core: 0.87, import: 0.81, emerging: 0.71, combined: 0.89 },
    spiritsRev, 8
  );

  const high = estimateQuarterlyEarnings(
    baseRev * 1.17, 1.08,
    { core: 0.94, import: 0.86, emerging: 0.82, combined: 0.94 },
    spiritsRev * 1.5, 12
  );

  const scenarios = [
    { label: 'Marcus @ 92%', data: low, color: '#F59E0B' },
    { label: 'Marcus @ 108%', data: high, color: '#22C55E' },
  ];

  return (
    <>
    <div className="grid grid-cols-2 gap-4">
      {scenarios.map(s => (
        <div key={s.label} className="rounded-lg border p-4" style={{ borderColor: `${s.color}40` }}>
          <div className="text-xs font-bold font-mono mb-2" style={{ color: s.color }}>{s.label}</div>

          <div className="text-[28px] font-bold font-mono mb-3" style={{ color: 'var(--pl-text)' }}>
            ${fmt(Math.round(s.data.totalEstimate))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[13px]">
              <span style={{ color: 'var(--pl-text-muted)' }}>Base (quarterly)</span>
              <span className="font-mono font-bold" style={{ color: 'var(--pl-text)' }}>${fmt(Math.round(s.data.baseEarnings))}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span style={{ color: 'var(--pl-text-muted)' }}>Variable ({s.data.tier.label})</span>
              <span className="font-mono font-bold" style={{ color: 'var(--pl-text)' }}>${fmt(Math.round(s.data.variableEarnings))}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span style={{ color: 'var(--pl-text-muted)' }}>Gate multiplier</span>
              <span className="font-mono font-bold" style={{ color: s.data.bbiMultiplier > 1 ? '#22C55E' : 'var(--pl-text-faint)' }}>
                {s.data.bbiMultiplier.toFixed(2)}x ({s.data.unlockedGates}/4 gates)
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span style={{ color: 'var(--pl-text-muted)' }}>Spirits adder</span>
              <span className="font-mono font-bold" style={{ color: s.data.spiritsBonus > 0 ? '#10B981' : 'var(--pl-text-faint)' }}>
                {s.data.spiritsBonus > 0 ? `+$${fmt(Math.round(s.data.spiritsBonus))}` : 'Not qualified'}
              </span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between text-[13px]" style={{ borderColor: 'var(--pl-border)' }}>
              <span className="font-bold" style={{ color: 'var(--pl-text)' }}>Annualized OTE</span>
              <span className="font-mono font-bold" style={{ color: s.color }}>${fmt(Math.round(s.data.totalEstimate * 4))}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    </>
  );
}

/* ── Draw / Guarantee Program ──────────────────── */
const DRAW_PROGRAM = {
  amount: 3200,
  frequency: 'biweekly',
  durationMonths: 6,
  recoveryPct: 0.25,
  recoveryDescription: '25% of earned commission above guarantee floor applied to draw balance',
};

const DRAW_TIMELINE = [
  { phase: 'Guarantee', months: '1-6', description: '$3,200 biweekly minimum guaranteed', color: '#3B82F6', pct: 50 },
  { phase: 'Partial Ramp', months: '7-12', description: 'Draw tapers, recoverable against earned', color: '#F59E0B', pct: 33 },
  { phase: 'Full Plan', months: '13+', description: 'Standard comp plan, no draw', color: '#22C55E', pct: 17 },
];

const CURRENT_DRAW_BALANCES = [
  { rep: 'Nathan Chowdhury', route: 'DAL-08', hireDate: 'Jan 15, 2026', balance: 4800, phase: 'Guarantee', monthsRemaining: 4 },
  { rep: 'Jackie Hernandez', route: 'DAL-07', hireDate: 'Feb 1, 2026', balance: 1200, phase: 'Guarantee', monthsRemaining: 5 },
];

export default function CompPlanPage() {
  const plan = COMP_PLAN;
  const maxMultiplier = Math.max(...BBI_GATES.map(g => g.multiplier));

  return (
    <>
    
      <ActNavigation currentAct={4} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#10B981' }}>
          Compensation Architecture &middot; FY{plan.planYear}
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          {plan.planName}
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {COMP_TIERS.length} tiers &middot; {BBI_GATES.length} gates &middot; {plan.kickers.length} quarterly kickers &middot; Spirits {(SPIRITS_ADDER.rate * 100).toFixed(1)}% adder
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Base Salary" value={`$${(plan.baseSalary.median / 1000).toFixed(0)}K`} accent="#2563EB" sub={`$${(plan.baseSalary.min / 1000).toFixed(0)}K\u2013$${(plan.baseSalary.max / 1000).toFixed(0)}K range`} stagger={0} />
        <LightKpiCard label="Variable Target" value={pct(plan.variableTarget)} accent="#10B981" sub="Of base salary" stagger={1} />
        <LightKpiCard label="Median OTE" value={`$${(plan.ote.median / 1000).toFixed(1)}K`} accent="#22C55E" sub="On-target earnings" stagger={2} />
        <LightKpiCard label="Max Multiplier" value={`${maxMultiplier.toFixed(1)}x`} accent="#F59E0B" sub="Combined gate" stagger={3} />
        <LightKpiCard label="Spirits Adder" value={`+${(SPIRITS_ADDER.rate * 100).toFixed(1)}%`} accent="#10B981" sub={`Min ${SPIRITS_ADDER.minAccounts} accounts`} stagger={4} />
      </div>

      {/* Tier Ladder */}
      <LightSectionCard title="Commission Tier Structure" className="mb-4">
        <TierTrack />
        <div className="mt-3 rounded-md px-4 py-3" style={{ background: 'rgba(16,185,129,0.04)', borderLeft: '3px solid #10B981' }}>
          <div className="text-xs font-bold font-mono mb-1" style={{ color: '#10B981' }}>WHY INVERSE RATES?</div>
          <p className="text-[13px]" style={{ color: 'var(--pl-text-secondary)' }}>
            Lower-tier reps get higher commission rates to ensure livable earnings while they develop. Higher-tier reps earn more in absolute dollars
            because their volume is larger. A T1 rep at 2.5% on $450K revenue earns more than a T4 rep at 6.5% on $180K revenue.
            This &quot;inverted rate&quot; design incentivizes upward mobility without floor earnings risk.
          </p>
        </div>
      </LightSectionCard>

      {/* Gate System */}
      <LightSectionCard title="Gate Cascade" className="mb-4">
        <BBIGateRings />
      </LightSectionCard>

      {/* Spirits Adder Card */}
      <LightSectionCard title="Spirits Integration Bonus" className="mb-4">
        <div className="rounded-lg p-5" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[16px] font-bold" style={{ color: 'var(--pl-text)' }}>Sazerac Portfolio Adder</div>
              <p className="text-[12px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>{SPIRITS_ADDER.description}</p>
              <div className="mt-3">
                <div className="text-xs font-bold font-mono" style={{ color: '#10B981' }}>QUALIFYING BRANDS</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {SPIRITS_ADDER.qualifyingBrands.map(b => (
                    <span key={b} className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                      {b.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="text-[32px] font-bold font-mono" style={{ color: '#10B981' }}>+{(SPIRITS_ADDER.rate * 100).toFixed(1)}%</div>
              <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>on all Sazerac revenue</div>
              <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>Min {SPIRITS_ADDER.minAccounts} spirits accounts</div>
            </div>
          </div>
        </div>
      </LightSectionCard>

      {/* Earnings Comparison */}
      <LightSectionCard title="Earnings Scenario: Marcus Reyes (DAL-03)" className="mb-4">
        <div className="text-[13px] mb-3" style={{ color: 'var(--pl-text-muted)' }}>
          Side-by-side quarterly earnings comparison showing how attainment, gate status, and spirits accounts compound.
        </div>
        <EarningsComparison />
      </LightSectionCard>

      {/* Plan details grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg border p-4" style={{ borderColor: 'var(--pl-border)' }}>
          <div className="text-xs font-bold font-mono mb-2" style={{ color: '#2563EB' }}>PLAN MECHANICS</div>
          <div className="space-y-1.5 text-[13px]" style={{ color: 'var(--pl-text-secondary)' }}>
            <div>Pay frequency: <strong className="font-mono">{plan.payFrequency}</strong></div>
            <div>True-up frequency: <strong className="font-mono">{plan.trueUpFrequency}</strong></div>
            <div>Plan year: <strong className="font-mono">FY{plan.planYear}</strong></div>
            <div>gates: <strong className="font-mono">{plan.bbiGates.length} gates</strong></div>
            <div>Kickers: <strong className="font-mono">{plan.kickers.length} quarterly</strong></div>
          </div>
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: 'var(--pl-border)' }}>
          <div className="text-xs font-bold font-mono mb-2" style={{ color: '#22C55E' }}>OTE RANGES</div>
          <div className="space-y-1.5 text-[13px]" style={{ color: 'var(--pl-text-secondary)' }}>
            <div>Minimum OTE: <strong className="font-mono">${fmt(plan.ote.min)}</strong></div>
            <div>Median OTE: <strong className="font-mono">${fmt(plan.ote.median)}</strong></div>
            <div>Maximum OTE: <strong className="font-mono">${fmt(plan.ote.max)}</strong></div>
            <div>Variable %: <strong className="font-mono">{(plan.variableTarget * 100).toFixed(0)}% of base</strong></div>
            <div>Max multiplier: <strong className="font-mono">{maxMultiplier.toFixed(2)}x (combined gate)</strong></div>
          </div>
        </div>
      </div>

      {/* ═══════ DRAW / GUARANTEE PROGRAM ═══════ */}
      <LightSectionCard title="NEW HIRE DRAW / GUARANTEE PROGRAM">
        {/* Program summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <div className="text-2xl font-bold font-mono" style={{ color: '#3B82F6' }}>${DRAW_PROGRAM.amount.toLocaleString()}</div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Biweekly guarantee</div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="text-2xl font-bold font-mono" style={{ color: '#F59E0B' }}>{DRAW_PROGRAM.durationMonths} months</div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Guarantee period</div>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div className="text-2xl font-bold font-mono" style={{ color: '#22C55E' }}>{(DRAW_PROGRAM.recoveryPct * 100).toFixed(0)}%</div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>Recovery rate above floor</div>
          </div>
        </div>

        {/* Transition Timeline SVG */}
        <div className="mb-6">
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--pl-text-muted)' }}>
            TRANSITION TIMELINE
          </div>
          <div className="flex rounded-xl overflow-hidden" style={{ height: 48, border: '1px solid var(--pl-border)' }}>
            {DRAW_TIMELINE.map((phase) => (
              <div key={phase.phase} className="flex items-center justify-center px-3" style={{
                width: `${phase.pct}%`,
                background: `${phase.color}15`,
                borderRight: '1px solid var(--pl-border)',
              }}>
                <div className="text-center">
                  <div className="text-xs font-bold font-mono" style={{ color: phase.color }}>{phase.phase}</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Mo {phase.months}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-4">
            {DRAW_TIMELINE.map((phase) => (
              <div key={phase.phase} className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                <span className="font-bold" style={{ color: phase.color }}>{phase.phase}:</span> {phase.description}
              </div>
            ))}
          </div>
        </div>

        {/* Current Draw Balances */}
        <div className="text-xs font-bold font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--pl-text-muted)' }}>
          CURRENT DRAW BALANCES
        </div>
        <div className="grid gap-3">
          {CURRENT_DRAW_BALANCES.map((rep) => (
            <div key={rep.rep} className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>{rep.rep}</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                  {rep.route} &middot; Hired {rep.hireDate} &middot; {rep.monthsRemaining} months remaining
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold font-mono" style={{ color: '#F59E0B' }}>${rep.balance.toLocaleString()}</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>outstanding draw</div>
              </div>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        Compensation plan designed by PROOFLINE for Lone Star Distribution FY2026. Tier rates are inverse to attainment to protect floor earnings.
        gates cascade from Core → Import → Emerging → Combined. Spirits adder stacks on top of gate-adjusted variable.
        Kickers are quarterly bonus opportunities tied to seasonal events and supplier priorities.
      </div>

    </>
  );
}
