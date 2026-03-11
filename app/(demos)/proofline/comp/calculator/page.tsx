'use client';

import { useState, useMemo } from 'react';
import { ActNavigation, LightSectionCard } from '@/components/demos/proofline';
import {
  BRAND_FAMILIES,
  SELLERS,
  BBI_GATES,
  COMP_TIERS,
  SPIRITS_ADDER,
  estimateQuarterlyEarnings,
  getGateStatus,
  type BrandFamily,
} from '@/data/proofline';
import { fmt } from '@/lib/utils';

/* ── Types ───────────────────────────────────── */
interface DealItem {
  brand: BrandFamily;
  cases: number;
}

/* ── Gate Ring (radial progress with slider) ─── */
function GateRing({ gate, value, onChange }: {
  gate: typeof BBI_GATES[0]; value: number; onChange: (v: number) => void;
}) {
  const status = getGateStatus(gate.threshold, value);
  const isUnlocked = status === 'unlocked';
  const size = 80, r = 30;
  const circ = 2 * Math.PI * r;
  const color = isUnlocked ? '#22C55E' : status === 'at-risk' ? '#F59E0B' : gate.color;

  return (
    <>
    <div className="text-center">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <defs>
          <linearGradient id={`calc-gr-${gate.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--pl-chart-bar-track)" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={`url(#calc-gr-${gate.name})`} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${Math.min(value, 1) * circ} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all"
        />
        <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fontSize="13" fontWeight="bold" fill="var(--pl-text)" fontFamily="monospace">
          {(value * 100).toFixed(0)}%
        </text>
        <text x={size / 2} y={size / 2 + 11} textAnchor="middle" fontSize="12" fill={color} fontFamily="monospace" fontWeight="bold">
          {isUnlocked ? `${'\u2713'} ${gate.multiplier.toFixed(2)}x` : `${'\u2265'}${(gate.threshold * 100).toFixed(0)}%`}
        </text>
      </svg>
      <div className="text-xs font-mono font-bold mt-0.5" style={{ color: gate.color }}>
        {gate.name.toUpperCase()}
      </div>
      <input
        type="range" min={0.50} max={1.00} step={0.01} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-16 h-1 appearance-none cursor-pointer mt-1"
        style={{ accentColor: color }}
      />
    </div>
    </>
  );
}

/* ── Tier Step Chart ─────────────────────────── */
function TierSteps({ attainment }: { attainment: number }) {
  const tierColors = ['#22C55E', '#2563EB', '#F59E0B', '#94A3B8'];
  const currentTier = COMP_TIERS.find(t => attainment >= t.floor && attainment < t.ceiling) ?? COMP_TIERS[3];

  return (
    <>
    <div className="flex items-end gap-1.5 justify-center" style={{ height: 56 }}>
      {[...COMP_TIERS].reverse().map((tier, i) => {
        const h = 18 + i * 10;
        const isActive = tier.level === currentTier.level;
        const color = tierColors[tier.level - 1];
        return (
          <div key={tier.level} className="flex flex-col items-center gap-0.5">
            <div className="rounded-t transition-all" style={{
              width: 28, height: h,
              background: isActive ? color : `${color}15`,
              border: isActive ? `2px solid ${color}` : '1px solid transparent',
            }} />
            <div className="text-xs font-mono font-bold" style={{ color: isActive ? color : 'var(--pl-text-faint)' }}>
              T{tier.level}
            </div>
            <div className="text-xs font-mono" style={{ color: isActive ? color : '#CBD5E0' }}>
              {(tier.rate * 100).toFixed(1)}%
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
}

/* ── Main Page ───────────────────────────────── */
export default function RtccCalculatorPage() {
  const [selectedSeller, setSelectedSeller] = useState(SELLERS[2]); // Marcus (DAL-03)

  // Deal builder state
  const [dealItems, setDealItems] = useState<DealItem[]>([]);
  const [selectedBrand, setSelectedBrand] = useState(BRAND_FAMILIES[0].id);
  const [dealCases, setDealCases] = useState(500);

  // Comp model state (initialized from seller)
  const [attainment, setAttainment] = useState(selectedSeller.attainment);
  const [coreGate, setCoreGate] = useState(selectedSeller.bbiGates.core);
  const [importGate, setImportGate] = useState(selectedSeller.bbiGates.import);
  const [emergingGate, setEmergingGate] = useState(selectedSeller.bbiGates.emerging);
  const [combinedGate, setCombinedGate] = useState(selectedSeller.bbiGates.combined);
  const [spiritsAccounts, setSpiritsAccounts] = useState(selectedSeller.spiritsAccounts);

  // Derived revenue
  const dealRevenue = dealItems.reduce((s, d) => s + d.cases * d.brand.revenuePerCase, 0);
  const dealSpiritsRev = dealItems
    .filter(d => d.brand.supplier === 'sazerac')
    .reduce((s, d) => s + d.cases * d.brand.revenuePerCase, 0);
  const baselineRevenue = 380000;
  const totalRevenue = baselineRevenue + dealRevenue;
  const totalSpiritsRev = 28000 + dealSpiritsRev;

  // Baseline earnings (seller's actual current state)
  const baseline = useMemo(() =>
    estimateQuarterlyEarnings(
      baselineRevenue, selectedSeller.attainment,
      selectedSeller.bbiGates, 28000, selectedSeller.spiritsAccounts
    ), [selectedSeller]
  );

  // Projected earnings (with deal + slider adjustments)
  const projected = useMemo(() =>
    estimateQuarterlyEarnings(
      totalRevenue, attainment,
      { core: coreGate, import: importGate, emerging: emergingGate, combined: combinedGate },
      totalSpiritsRev, spiritsAccounts
    ), [totalRevenue, attainment, coreGate, importGate, emergingGate, combinedGate, totalSpiritsRev, spiritsAccounts]
  );

  const delta = projected.totalEstimate - baseline.totalEstimate;
  const deltaColor = delta >= 0 ? '#22C55E' : '#F87171';

  const handleSellerChange = (seller: typeof SELLERS[0]) => {
    setSelectedSeller(seller);
    setAttainment(seller.attainment);
    setCoreGate(seller.bbiGates.core);
    setImportGate(seller.bbiGates.import);
    setEmergingGate(seller.bbiGates.emerging);
    setCombinedGate(seller.bbiGates.combined);
    setSpiritsAccounts(seller.spiritsAccounts);
    setDealItems([]);
  };

  const addDeal = () => {
    const brand = BRAND_FAMILIES.find(b => b.id === selectedBrand);
    if (!brand || dealCases <= 0) return;
    setDealItems(prev => [...prev, { brand, cases: dealCases }]);
    setDealCases(500);
  };

  const removeDeal = (idx: number) => {
    setDealItems(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
    
      <ActNavigation currentAct={4} />

      {/* Header */}
      <div className="mt-6 mb-4">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#10B981' }}>
          What-If Calculator &middot; Real-Time Comp Modeling
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          Real-Time What-If Calculator
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          Build a deal, see the commission impact in real-time. All calculations use the live FY2026 comp plan.
        </p>
      </div>

      {/* Rep Selector */}
      <div className="flex flex-wrap gap-1 mb-4">
        {SELLERS.slice(0, 12).map(s => (
          <button
            key={s.id}
            onClick={() => handleSellerChange(s)}
            className="px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors"
            style={{
              background: selectedSeller.id === s.id ? '#10B981' : 'var(--pl-chart-bar-track)',
              color: selectedSeller.id === s.id ? 'white' : 'var(--pl-text-muted)',
            }}
          >
            {s.name.split(' ')[0]} ({s.routeId})
          </button>
        ))}
        <span className="px-2 py-1 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
          +{SELLERS.length - 12} more
        </span>
      </div>

      {/* ═══ 3-PANE LAYOUT ═══ */}
      <div className="grid grid-cols-12 gap-3">

        {/* ─── LEFT: Brand / Deal Builder (col-span-3) ─── */}
        <div className="col-span-3 space-y-3">
          <LightSectionCard title="Brand / Deal Builder">
            {/* Brand selector */}
            <div className="mb-3">
              <label className="text-xs font-mono font-bold block mb-1" style={{ color: 'var(--pl-text-muted)' }}>
                SELECT BRAND
              </label>
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="w-full text-[13px] font-mono rounded-lg border px-2 py-1.5"
                style={{ borderColor: 'var(--pl-border)', color: 'var(--pl-text)' }}
              >
                {BRAND_FAMILIES.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} {'\u2014'} ${b.revenuePerCase.toFixed(2)}/case
                  </option>
                ))}
              </select>
            </div>

            {/* Cases input + Add button */}
            <div className="mb-3">
              <label className="text-xs font-mono font-bold block mb-1" style={{ color: 'var(--pl-text-muted)' }}>
                CASES
              </label>
              <div className="flex gap-2">
                <input
                  type="number" value={dealCases}
                  onChange={e => setDealCases(Number(e.target.value))}
                  className="flex-1 text-[12px] font-mono rounded-lg border px-2 py-1.5"
                  style={{ borderColor: 'var(--pl-border)', color: 'var(--pl-text)' }}
                  min={0} max={50000} step={100}
                />
                <button
                  onClick={addDeal}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-white"
                  style={{ background: '#10B981' }}
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Deal items list */}
            {dealItems.length > 0 && (
              <div className="space-y-1.5 mb-3">
                <div className="text-xs font-mono font-bold" style={{ color: 'var(--pl-text-muted)' }}>DEAL ITEMS</div>
                {dealItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-2 py-1.5 rounded-lg" style={{ background: 'var(--pl-card-alt)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate" style={{ color: 'var(--pl-text)' }}>{item.brand.name}</div>
                      <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
                        {fmt(item.cases)} cases {'\u00D7'} ${item.brand.revenuePerCase.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-xs font-bold font-mono" style={{ color: '#10B981' }}>
                        ${fmt(Math.round(item.cases * item.brand.revenuePerCase))}
                      </span>
                      <button onClick={() => removeDeal(idx)} className="text-[14px] leading-none" style={{ color: '#F87171' }}>
                        {'\u00D7'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Deal totals */}
            <div className="rounded-lg px-3 py-2" style={{
              background: dealItems.length > 0 ? 'rgba(16,185,129,0.06)' : 'var(--pl-card-alt)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <div className="flex justify-between text-[13px]">
                <span className="font-mono" style={{ color: 'var(--pl-text-muted)' }}>Deal Revenue</span>
                <span className="font-bold font-mono" style={{ color: dealRevenue > 0 ? '#10B981' : 'var(--pl-text-faint)' }}>
                  +${fmt(dealRevenue)}
                </span>
              </div>
              <div className="flex justify-between text-[13px] mt-1">
                <span className="font-mono" style={{ color: 'var(--pl-text-muted)' }}>Total Q Revenue</span>
                <span className="font-bold font-mono" style={{ color: 'var(--pl-text)' }}>${fmt(totalRevenue)}</span>
              </div>
            </div>
          </LightSectionCard>
        </div>

        {/* ─── CENTER: Revenue Impact (col-span-5) ─── */}
        <div className="col-span-5 space-y-3">
          {/* Commission hero card */}
          <div className="rounded-xl p-5" style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(37,99,235,0.04))',
            border: '1px solid rgba(16,185,129,0.15)',
          }}>
            {/* Hero number */}
            <div className="text-center mb-4">
              <div className="text-xs font-mono font-bold mb-2" style={{ color: 'var(--pl-text-muted)' }}>
                PROJECTED QUARTERLY COMMISSION
              </div>
              <div className="text-[48px] font-bold font-mono leading-none" style={{ color: 'var(--pl-text)' }}>
                ${fmt(Math.round(projected.totalEstimate))}
              </div>
              <div className="text-[12px] font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>
                Annualized: ${fmt(Math.round(projected.totalEstimate * 4))}
              </div>
            </div>

            {/* Delta badge */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{
                background: `${deltaColor}10`,
                border: `1px solid ${deltaColor}30`,
              }}>
                <span className="text-[14px] font-bold font-mono" style={{ color: deltaColor }}>
                  {delta >= 0 ? '+' : ''}{'\u0024'}{fmt(Math.abs(Math.round(delta)))}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>vs baseline</span>
              </div>
            </div>

            {/* Earnings breakdown grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <div className="text-xs font-mono font-bold" style={{ color: 'var(--pl-text-faint)' }}>BASE SALARY</div>
                <div className="text-[16px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>
                  ${fmt(Math.round(projected.baseEarnings))}
                </div>
              </div>
              <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <div className="text-xs font-mono font-bold" style={{ color: 'var(--pl-text-faint)' }}>
                  VARIABLE ({projected.tier.label.split(' \u2014 ')[1]})
                </div>
                <div className="text-[16px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>
                  ${fmt(Math.round(projected.variableEarnings))}
                </div>
              </div>
              <div className="rounded-lg px-3 py-2" style={{
                background: projected.bbiMultiplier > 1 ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.6)',
              }}>
                <div className="text-xs font-mono font-bold" style={{ color: 'var(--pl-text-faint)' }}>GATE MULTIPLIER</div>
                <div className="text-[16px] font-bold font-mono" style={{ color: projected.bbiMultiplier > 1 ? '#22C55E' : 'var(--pl-text-faint)' }}>
                  {projected.bbiMultiplier.toFixed(2)}x
                </div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>{projected.unlockedGates}/4 gates</div>
              </div>
              <div className="rounded-lg px-3 py-2" style={{
                background: projected.spiritsBonus > 0 ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.6)',
              }}>
                <div className="text-xs font-mono font-bold" style={{ color: 'var(--pl-text-faint)' }}>SPIRITS ADDER</div>
                <div className="text-[16px] font-bold font-mono" style={{ color: projected.spiritsBonus > 0 ? '#10B981' : 'var(--pl-text-faint)' }}>
                  {projected.spiritsBonus > 0 ? `+$${fmt(Math.round(projected.spiritsBonus))}` : 'N/A'}
                </div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                  {spiritsAccounts}/{SPIRITS_ADDER.minAccounts} accts
                </div>
              </div>
            </div>
          </div>

          {/* Attainment slider */}
          <LightSectionCard title="Attainment What-If">
            <div className="flex items-center gap-4">
              <input
                type="range" min={0.50} max={1.30} step={0.01} value={attainment}
                onChange={e => setAttainment(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#10B981' }}
              />
              <span className="text-[16px] font-bold font-mono w-14 text-right" style={{
                color: attainment >= 1 ? '#22C55E' : attainment >= 0.85 ? '#F59E0B' : '#F87171',
              }}>
                {(attainment * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between text-xs font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>
              <span>50%</span><span>75%</span><span>90%</span><span>100%</span><span>105%</span><span>130%</span>
            </div>
          </LightSectionCard>

          {/* Baseline vs Projected comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3" style={{ borderColor: 'var(--pl-border)' }}>
              <div className="text-xs font-mono font-bold mb-2" style={{ color: 'var(--pl-text-faint)' }}>BASELINE (CURRENT)</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                ${fmt(Math.round(baseline.totalEstimate))}
              </div>
              <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
                T{baseline.tier.level} &middot; {baseline.unlockedGates}/4 gates &middot; {baseline.bbiMultiplier.toFixed(2)}x
              </div>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: `${deltaColor}40` }}>
              <div className="text-xs font-mono font-bold mb-2" style={{ color: deltaColor }}>PROJECTED (WITH DEAL)</div>
              <div className="text-[20px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>
                ${fmt(Math.round(projected.totalEstimate))}
              </div>
              <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                T{projected.tier.level} &middot; {projected.unlockedGates}/4 gates &middot; {projected.bbiMultiplier.toFixed(2)}x
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Gate Progress + Tier (col-span-4) ─── */}
        <div className="col-span-4 space-y-3">
          {/* Gate Rings */}
          <LightSectionCard title="Gate Progress">
            <div className="grid grid-cols-2 gap-3">
              <GateRing gate={BBI_GATES[0]} value={coreGate} onChange={setCoreGate} />
              <GateRing gate={BBI_GATES[1]} value={importGate} onChange={setImportGate} />
              <GateRing gate={BBI_GATES[2]} value={emergingGate} onChange={setEmergingGate} />
              <GateRing gate={BBI_GATES[3]} value={combinedGate} onChange={setCombinedGate} />
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs font-mono px-3 py-1 rounded-full" style={{
                background: projected.bbiMultiplier >= 1.5 ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                color: projected.bbiMultiplier >= 1.5 ? '#22C55E' : '#F59E0B',
              }}>
                Effective: {projected.bbiMultiplier.toFixed(2)}x multiplier
              </span>
            </div>
          </LightSectionCard>

          {/* Tier Progression */}
          <LightSectionCard title="Tier Progression">
            <TierSteps attainment={attainment} />
            <div className="text-center mt-2">
              <span className="text-[13px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>
                {projected.tier.label}
              </span>
              <span className="text-xs font-mono ml-2" style={{ color: 'var(--pl-text-muted)' }}>
                @ {(projected.tier.rate * 100).toFixed(1)}% rate
              </span>
            </div>
          </LightSectionCard>

          {/* Spirits Control */}
          <LightSectionCard title="Spirits Accounts">
            <div className="flex items-center gap-3">
              <input
                type="range" min={0} max={20} step={1} value={spiritsAccounts}
                onChange={e => setSpiritsAccounts(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#10B981' }}
              />
              <span className="text-[14px] font-bold font-mono w-8 text-right" style={{
                color: spiritsAccounts >= 5 ? '#10B981' : '#F87171',
              }}>
                {spiritsAccounts}
              </span>
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>
              {spiritsAccounts >= SPIRITS_ADDER.minAccounts
                ? `${'\u2713'} Qualified \u2014 +${(SPIRITS_ADDER.rate * 100).toFixed(1)}% on $${fmt(totalSpiritsRev)} spirits rev`
                : `Need ${SPIRITS_ADDER.minAccounts - spiritsAccounts} more accounts to qualify`}
            </div>
          </LightSectionCard>

          {/* Quick Presets */}
          <div className="rounded-lg border p-3" style={{ borderColor: 'var(--pl-border)' }}>
            <div className="text-xs font-mono font-bold mb-2" style={{ color: 'var(--pl-text-muted)' }}>QUICK PRESETS</div>
            {[
              { label: 'All gates open', action: () => { setCoreGate(0.92); setImportGate(0.85); setEmergingGate(0.75); setCombinedGate(0.92); } },
              { label: 'Elite tier (110%)', action: () => setAttainment(1.10) },
              { label: 'Max spirits (15 accts)', action: () => setSpiritsAccounts(15) },
              { label: 'Add Corona 1K cases', action: () => {
                const corona = BRAND_FAMILIES.find(b => b.id === 'corona-extra');
                if (corona) setDealItems(prev => [...prev, { brand: corona, cases: 1000 }]);
              }},
              { label: 'Reset to baseline', action: () => handleSellerChange(selectedSeller) },
            ].map(s => (
              <button
                key={s.label}
                onClick={s.action}
                className="block w-full text-left text-xs font-mono px-2 py-1.5 rounded hover:opacity-80 transition-colors"
                style={{ color: '#2563EB' }}
              >
                {s.label} {'\u2192'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="mt-4 text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        RTWC = Real-Time What-If Calculator. Variable = Revenue {'\u00D7'} Tier Rate {'\u00D7'} Gate Multiplier.
        Spirits adder requires {'\u2265'}{SPIRITS_ADDER.minAccounts} accounts. Deal items add to baseline Q revenue of ${fmt(baselineRevenue)}.
        All calculations follow the FY2026 comp plan exactly.
      </div>
    
    </>
  );
}
