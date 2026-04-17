'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { Award, Zap, Target, Plus, X, GitCompareArrows, ArrowLeft, Beaker } from 'lucide-react';
import { COMP_TIERS } from '@/data/register/comp-data';
import { SAMPLE_PERIODS } from '@/data/register/summit-sleep';

const ACCENT = '#10B981';

/* ── What-If scenario data ────────────────────────────────── */

const BASE_SALARY_BIWEEKLY = 1384.62;

const COMP_COMPONENTS = [
  { name: 'Mattress Commission', weight: 0.36, color: '#1E3A5F' },
  { name: 'Accessory Commission', weight: 0.05, color: '#06B6D4' },
  { name: 'Volume Tier Bonus', weight: 0.40, color: '#10B981' },
  { name: 'SPIFF Bonus', weight: 0.12, color: '#F59E0B' },
  { name: 'Attach Accelerator', weight: 0.07, color: '#8B5CF6' },
];

const RECENT_SALES = [
  { time: '2:47 PM', item: 'King Hybrid + Adj Base + Protector', amount: 5247, commission: 236.12, components: 'Base 4.5% + SPIFF $25 + Bundle $75' },
  { time: '1:12 PM', item: 'Queen Hybrid + Protector', amount: 1968, commission: 88.56, components: 'Base 4.5%' },
  { time: '11:30 AM', item: 'Full Firm', amount: 849, commission: 38.21, components: 'Base 4.5%' },
  { time: '10:15 AM', item: 'King Pillow-Top + Base + Protector + Pillows', amount: 3636, commission: 163.62, components: 'Base 4.5% + SPIFF $25 + Bundle $75' },
  { time: '9:02 AM', item: 'Queen Medium + Sheets', amount: 1428, commission: 64.26, components: 'Base 4.5%' },
];

/* ── Helpers ──────────────────────────────────────────────── */

function fmtCurrency(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getTierForRevenue(revenue: number) {
  return COMP_TIERS.find((t) => revenue >= t.minRevenue && revenue <= t.maxRevenue) ?? COMP_TIERS[0];
}

/* ── SVG Gauge ────────────────────────────────────────────── */

function AttainmentGauge({ revenue, maxRevenue }: { revenue: number; maxRevenue: number }) {
  const pct = Math.min(revenue / maxRevenue, 1);
  const tier = getTierForRevenue(revenue);
  const nextTier = COMP_TIERS[COMP_TIERS.indexOf(tier) + 1] ?? null;

  // Arc: 0% = -135deg, 100% = +135deg (270deg sweep)
  const needleAngle = -135 + pct * 270;

  return (
    <div
      className="rounded-xl p-5 flex flex-col items-center justify-center reg-fade-up reg-stagger-2"
      style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
    >
      <svg viewBox="0 0 100 65" className="w-full" style={{ maxWidth: 280 }}>
        {/* Background arc */}
        <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="var(--register-border)" strokeWidth="6" strokeLinecap="round" />

        {/* Tier color segments */}
        {COMP_TIERS.map((t) => {
          const startPct = Math.min(t.minRevenue / maxRevenue, 1);
          const endPct = Math.min((t.maxRevenue === Infinity ? maxRevenue : t.maxRevenue) / maxRevenue, 1);
          const startAngle = -135 + startPct * 270;
          const endAngle = -135 + endPct * 270;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const cx = 50, cy = 55, r = 40;
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);
          const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
          const isActive = tier.tier === t.tier;
          return (
            <path
              key={t.tier}
              d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none"
              stroke={t.color}
              strokeWidth="6"
              strokeLinecap="round"
              opacity={isActive ? 1 : 0.25}
              style={{ transition: 'opacity 0.3s' }}
            />
          );
        })}

        {/* Needle */}
        <g style={{ transformOrigin: '50px 55px', transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.8s ease-out' }}>
          <line x1="50" y1="55" x2="82" y2="55" stroke={tier.color} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="50" cy="55" r="3" fill={tier.color} />
        </g>

        {/* Center text */}
        <text x="50" y="48" textAnchor="middle" fontSize="9" fontWeight="800" fill={tier.color}>
          {fmtCurrency(revenue)}
        </text>
        <text x="50" y="56" textAnchor="middle" fontSize="4" fill="var(--register-text-muted)">
          monthly revenue
        </text>

        {/* Labels */}
        <text x="8" y="62" textAnchor="start" fontSize="3.5" fill="var(--register-text-muted)">$0</text>
        <text x="92" y="62" textAnchor="end" fontSize="3.5" fill="var(--register-text-muted)">{fmtCurrency(maxRevenue)}</text>
      </svg>

      {/* Tier badge */}
      <div
        className="mt-2 px-4 py-1.5 rounded-full text-sm font-bold"
        style={{ background: `${tier.color}18`, color: tier.color, transition: 'all 0.3s' }}
      >
        {tier.tier} Tier — {(tier.rate * 100).toFixed(1)}% rate
      </div>
      {nextTier && (
        <p className="text-xs mt-2" style={{ color: 'var(--register-text-muted)' }}>
          {fmtCurrency(nextTier.minRevenue - revenue)} to {nextTier.tier}
        </p>
      )}
    </div>
  );
}

/* ── Designer Deep-Link Breadcrumb ────────────────────────
   Shown when user arrives via "Simulate in What-If →" from
   Plan Designer. Surfaces which rule they're testing and a
   back-link to the source. */

function DesignerBreadcrumb() {
  const params = useSearchParams();
  const from = params.get('from');
  const ruleId = params.get('rule');
  if (from !== 'designer' || !ruleId) return null;

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', marginBottom: 16,
        background: 'color-mix(in srgb, var(--register-ai) 10%, transparent)',
        border: '1px solid color-mix(in srgb, var(--register-ai) 35%, transparent)',
        borderRadius: 10,
        flexWrap: 'wrap',
      }}
    >
      <Beaker size={16} style={{ color: 'var(--register-ai)' }} />
      <span style={{ fontSize: '0.88rem', color: 'var(--register-text)' }}>
        Simulating rule <strong style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.88rem' }}>{ruleId}</strong> from Plan Designer draft.
      </span>
      <Link
        href="/register/comp/admin"
        style={{
          marginLeft: 'auto',
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '5px 10px', borderRadius: 6,
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border-strong)',
          color: 'var(--register-text)',
          fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none',
        }}
      >
        <ArrowLeft size={13} /> Back to Designer
      </Link>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */

export default function CalculatorPage() {
  const caseyBase = SAMPLE_PERIODS['rep-casey'].revenue;
  const [revenueSlider, setRevenueSlider] = useState(caseyBase);
  const [liveEarnings, setLiveEarnings] = useState(3389.22);

  // Scenario comparison
  interface Scenario { label: string; revenue: number; }
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { label: 'Current Pace', revenue: caseyBase },
    { label: 'Push to Gold', revenue: 40000 },
  ]);
  const [showComparison, setShowComparison] = useState(false);

  const addScenario = useCallback(() => {
    if (scenarios.length >= 4) return;
    setScenarios((prev) => [...prev, { label: `Scenario ${prev.length + 1}`, revenue: revenueSlider }]);
  }, [scenarios.length, revenueSlider]);

  const removeScenario = useCallback((idx: number) => {
    setScenarios((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const updateScenarioRevenue = useCallback((idx: number, revenue: number) => {
    setScenarios((prev) => prev.map((s, i) => i === idx ? { ...s, revenue } : s));
  }, []);

  const updateScenarioLabel = useCallback((idx: number, label: string) => {
    setScenarios((prev) => prev.map((s, i) => i === idx ? { ...s, label } : s));
  }, []);

  const MAX_REVENUE = 100000;
  const tier = getTierForRevenue(revenueSlider);
  const incentiveEarned = Math.round(revenueSlider * tier.rate);
  const totalComp = Math.round(BASE_SALARY_BIWEEKLY + incentiveEarned);

  // Waterfall values
  const waterfall = COMP_COMPONENTS.map((comp) => ({
    ...comp,
    value: Math.round(incentiveEarned * comp.weight),
  }));

  // Animated live counter
  useEffect(() => {
    const id = setInterval(() => {
      setLiveEarnings((prev) => parseFloat((prev + 0.12 + Math.random() * 0.35).toFixed(2)));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const fmtFull = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <style>{`
        @keyframes stackGrow { from { height: 0 } }
        @keyframes shimmer { 0% { transform: translateX(-50%); } 100% { transform: translateX(50%); } }
      `}</style>

      <RegisterPage title="Commission Calculator" subtitle="What-If Modeling + Live Floor Earnings" accentColor={ACCENT}>

        <Suspense fallback={null}>
          <DesignerBreadcrumb />
        </Suspense>

        {/* ── What-If Controls ──────────────────────────────── */}
        <div
          className="register-section reg-fade-up"
          style={{ borderTop: `3px solid ${ACCENT}` }}
        >
          <div className="flex items-center gap-3 mb-5">
            <Target size={20} color={ACCENT} />
            <div>
              <p className="text-base font-bold" style={{ color: 'var(--register-text)', margin: 0 }}>
                What-If Scenario Builder
              </p>
              <p className="text-sm" style={{ color: 'var(--register-text-muted)', margin: 0 }}>
                Drag the slider to model commission at any revenue level
              </p>
            </div>
          </div>

          {/* Revenue slider */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--register-text-muted)' }}>Monthly Revenue</span>
              <span className="text-xl font-extrabold tabular-nums" style={{ color: tier.color, transition: 'color 0.3s' }}>
                {fmtCurrency(revenueSlider)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={MAX_REVENUE}
              step={500}
              value={revenueSlider}
              onChange={(e) => setRevenueSlider(parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: tier.color,
                background: `linear-gradient(90deg, #CD7F32 0%, #C0C0C0 25%, #FFD700 50%, #E5E4E2 75%, #10B981 100%)`,
              }}
            />
            <div className="flex justify-between text-xs mt-1 tabular-nums" style={{ color: 'var(--register-text-muted)' }}>
              {COMP_TIERS.map((t) => (
                <span
                  key={t.tier}
                  style={{ fontWeight: tier.tier === t.tier ? 800 : 400, color: tier.tier === t.tier ? t.color : undefined }}
                >
                  {t.tier} ({fmtCurrency(t.minRevenue)}+)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Scenario Comparison ─────────────────────────────── */}
        <div className="register-section reg-fade-up reg-stagger-2 mb-8">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-2 mb-4 text-sm font-bold"
            style={{ color: '#8B5CF6', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <GitCompareArrows size={18} />
            {showComparison ? 'Hide' : 'Show'} Scenario Comparison
          </button>

          {showComparison && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: 'var(--register-text-muted)', margin: 0 }}>
                  Compare up to 4 revenue scenarios side by side
                </p>
                {scenarios.length < 4 && (
                  <button
                    onClick={addScenario}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: 'none', cursor: 'pointer' }}
                  >
                    <Plus size={12} /> Add Scenario
                  </button>
                )}
              </div>

              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${scenarios.length}, 1fr)` }}>
                {scenarios.map((sc, idx) => {
                  const scTier = getTierForRevenue(sc.revenue);
                  const scIncentive = Math.round(sc.revenue * scTier.rate);
                  const scTotal = Math.round(BASE_SALARY_BIWEEKLY + scIncentive);
                  const baseTier = getTierForRevenue(scenarios[0].revenue);
                  const baseTotal = Math.round(BASE_SALARY_BIWEEKLY + scenarios[0].revenue * baseTier.rate);
                  const diff = scTotal - baseTotal;

                  return (
                    <div
                      key={idx}
                      className="rounded-xl p-4"
                      style={{
                        background: 'var(--register-bg-elevated)',
                        border: `2px solid ${scTier.color}30`,
                        borderTop: `3px solid ${scTier.color}`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <input
                          value={sc.label}
                          onChange={(e) => updateScenarioLabel(idx, e.target.value)}
                          className="text-sm font-bold bg-transparent border-none outline-none"
                          style={{ color: 'var(--register-text)', width: '100%' }}
                        />
                        {scenarios.length > 1 && (
                          <button
                            onClick={() => removeScenario(idx)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                          >
                            <X size={14} color="var(--register-text-muted)" />
                          </button>
                        )}
                      </div>

                      <input
                        type="range"
                        min={0}
                        max={100000}
                        step={500}
                        value={sc.revenue}
                        onChange={(e) => updateScenarioRevenue(idx, parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer mb-3"
                        style={{ accentColor: scTier.color }}
                      />

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span style={{ color: 'var(--register-text-muted)' }}>Revenue</span>
                          <span className="font-bold tabular-nums" style={{ color: 'var(--register-text)' }}>{fmtCurrency(sc.revenue)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span style={{ color: 'var(--register-text-muted)' }}>Tier</span>
                          <span className="font-bold" style={{ color: scTier.color }}>{scTier.tier} ({(scTier.rate * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span style={{ color: 'var(--register-text-muted)' }}>Incentive</span>
                          <span className="font-bold tabular-nums" style={{ color: scTier.color }}>{fmtCurrency(scIncentive)}</span>
                        </div>
                        <div
                          className="flex justify-between text-sm font-extrabold pt-2 mt-1"
                          style={{ borderTop: `1px solid var(--register-border)` }}
                        >
                          <span style={{ color: 'var(--register-text)' }}>Total Comp</span>
                          <span className="tabular-nums" style={{ color: scTier.color }}>{fmtCurrency(scTotal)}</span>
                        </div>
                        {idx > 0 && diff !== 0 && (
                          <div className="text-center pt-1">
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{
                                background: diff > 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                                color: diff > 0 ? '#10B981' : '#EF4444',
                              }}
                            >
                              {diff > 0 ? '+' : ''}{fmtCurrency(diff)} vs {scenarios[0].label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Gauge + Result Cards ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 mb-8">
          <AttainmentGauge revenue={revenueSlider} maxRevenue={MAX_REVENUE} />

          {/* Result cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Base Salary', value: fmtFull(BASE_SALARY_BIWEEKLY), sub: 'Bi-weekly ($36K/yr)', color: '#1E3A5F' },
              { label: 'Incentive Earned', value: fmtCurrency(incentiveEarned), sub: `${tier.tier} (${(tier.rate * 100).toFixed(1)}%)`, color: tier.color },
              { label: 'Total Comp', value: fmtCurrency(totalComp), sub: `At ${fmtCurrency(revenueSlider)} revenue`, color: ACCENT },
              { label: 'Effective Rate', value: revenueSlider > 0 ? `${((incentiveEarned / revenueSlider) * 100).toFixed(1)}%` : '0%', sub: 'Incentive / Revenue', color: '#06B6D4' },
            ].map((card, i) => (
              <div
                key={card.label}
                className="rounded-xl border p-5 text-center reg-fade-up"
                style={{
                  background: 'var(--register-bg-elevated)',
                  borderColor: 'var(--register-border)',
                  borderTop: `3px solid ${card.color}`,
                  animationDelay: `${0.2 + i * 0.1}s`,
                }}
              >
                <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--register-text-muted)' }}>
                  {card.label}
                </p>
                <p className="text-2xl font-extrabold tabular-nums" style={{ color: card.color, transition: 'color 0.3s' }}>
                  {card.value}
                </p>
                <p className="text-xs" style={{ color: 'var(--register-text-muted)' }}>
                  {card.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Component Waterfall ────────────────────────────── */}
        <div className="register-section reg-fade-up reg-stagger-4">
          <h2 className="register-section-header">
            Incentive Breakdown at {fmtCurrency(revenueSlider)}
          </h2>
          <div className="flex items-end gap-3" style={{ height: 200 }}>
            {/* Base column */}
            <div className="flex-1 flex flex-col items-center">
              <p className="text-xs font-bold tabular-nums mb-1" style={{ color: '#1E3A5F' }}>
                {fmtFull(BASE_SALARY_BIWEEKLY)}
              </p>
              <div
                className="w-full rounded-t-lg"
                style={{
                  height: `${totalComp > 0 ? Math.max((BASE_SALARY_BIWEEKLY / totalComp) * 100, 8) : 0}%`,
                  background: 'linear-gradient(180deg, #1E3A5F, #1E3A5F80)',
                  animation: 'stackGrow 0.6s ease-out both',
                  transition: 'height 0.5s ease',
                }}
              />
              <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Base</p>
            </div>

            {/* Component columns */}
            {waterfall.map((comp, i) => (
              <div key={comp.name} className="flex-1 flex flex-col items-center">
                <p className="text-xs font-bold tabular-nums mb-1" style={{ color: comp.color }}>
                  {fmtCurrency(comp.value)}
                </p>
                <div
                  className="w-full rounded-t-lg"
                  style={{
                    height: `${Math.max(totalComp > 0 ? (comp.value / totalComp) * 100 : 0, 4)}%`,
                    background: `linear-gradient(180deg, ${comp.color}, ${comp.color}80)`,
                    animation: `stackGrow 0.5s ease-out ${0.2 + i * 0.1}s both`,
                    transition: 'height 0.5s ease',
                    minHeight: 4,
                  }}
                />
                <p className="text-xs mt-1 font-semibold text-center leading-tight" style={{ color: 'var(--register-text-muted)' }}>
                  {comp.name.split(' ').slice(0, 2).join(' ')}
                </p>
              </div>
            ))}

            {/* Total column */}
            <div className="flex-1 flex flex-col items-center">
              <p className="text-xs font-extrabold tabular-nums mb-1" style={{ color: ACCENT }}>
                {fmtCurrency(totalComp)}
              </p>
              <div
                className="w-full rounded-t-lg"
                style={{
                  height: '100%',
                  background: `linear-gradient(180deg, ${ACCENT}, ${ACCENT}80)`,
                  animation: 'stackGrow 0.6s ease-out 0.7s both',
                  transition: 'height 0.5s ease',
                }}
              />
              <p className="text-xs mt-1 font-extrabold" style={{ color: ACCENT }}>TOTAL</p>
            </div>
          </div>
        </div>

        {/* ── Active Tier Scale ──────────────────────────────── */}
        <div className="register-section reg-fade-up reg-stagger-5">
          <h2 className="register-section-header">Tier Scale</h2>
          <div className="flex gap-2" style={{ height: 72 }}>
            {COMP_TIERS.map((t) => {
              const isActive = tier.tier === t.tier;
              const width = t.maxRevenue === Infinity ? 25 : ((t.maxRevenue - t.minRevenue) / MAX_REVENUE) * 100;
              return (
                <div
                  key={t.tier}
                  className="rounded-lg flex flex-col items-center justify-center transition-all"
                  style={{
                    flex: Math.max(width, 15),
                    background: isActive ? t.color : `${t.color}15`,
                    color: isActive ? 'white' : t.color,
                    border: isActive ? `2px solid ${t.color}` : '2px solid transparent',
                    boxShadow: isActive ? `0 0 16px ${t.color}40` : 'none',
                  }}
                >
                  <p className="text-sm font-bold">{t.tier}</p>
                  <p className="text-lg font-extrabold">{(t.rate * 100).toFixed(1)}%</p>
                  <p className="text-xs">{fmtCurrency(t.minRevenue)}+</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Live Floor Earnings ────────────────────────────── */}
        <div
          className="rounded-xl p-6 mb-8 reg-fade-up reg-stagger-6"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.04), rgba(16,185,129,0.12))',
            border: '2px solid rgba(16,185,129,0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Shimmer */}
          <div
            style={{
              position: 'absolute', top: 0, left: '-100%', width: '200%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.03), transparent)',
              animation: 'shimmer 3s infinite', pointerEvents: 'none',
            }}
          />

          <div className="flex items-center gap-3 mb-5" style={{ position: 'relative' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color={ACCENT} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-extrabold" style={{ color: ACCENT, margin: 0 }}>Live Floor Earnings</p>
                <div className="reg-live-dot" />
              </div>
              <p className="text-sm" style={{ color: 'var(--register-text-muted)', margin: 0 }}>
                Updating in real time from POS
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '16px 0', marginBottom: 16, borderBottom: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="register-meta-label" style={{ margin: '0 0 4px' }}>Earned Right Now</p>
            <p className="register-kpi-value" style={{ fontSize: '2.5rem', color: ACCENT, margin: 0 }}>
              {fmtFull(liveEarnings)}
            </p>
          </div>

          <div className="flex justify-center gap-8">
            <div style={{ textAlign: 'center' }}>
              <p className="register-meta-label" style={{ margin: '0 0 2px' }}>vs Varicent</p>
              <p className="text-lg font-extrabold tabular-nums" style={{ margin: 0, color: liveEarnings < 3847 ? '#F59E0B' : ACCENT }}>
                {liveEarnings < 3847 ? '-' : '+'}{fmtFull(Math.abs(liveEarnings - 3847))}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="register-meta-label" style={{ margin: '0 0 2px' }}>Today&apos;s Sales</p>
              <p className="text-lg font-extrabold tabular-nums" style={{ margin: 0, color: 'var(--register-text)' }}>5</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="register-meta-label" style={{ margin: '0 0 2px' }}>Eff. Rate</p>
              <p className="text-lg font-extrabold tabular-nums" style={{ margin: 0, color: '#06B6D4' }}>4.8%</p>
            </div>
          </div>
        </div>

        {/* ── Recent Sale Impact ─────────────────────────────── */}
        <div className="register-section reg-fade-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="register-section-header" style={{ marginBottom: 0 }}>Recent Sale Impact</h2>
            <span className="text-sm" style={{ color: 'var(--register-text-muted)' }}>Today, March 13</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Header */}
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: '60px 1fr 90px 90px 1fr', padding: '8px 12px', borderBottom: '2px solid var(--register-border)' }}
            >
              {['Time', 'Item', 'Sale', 'Commission', 'Components'].map((h) => (
                <span key={h} className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--register-text-muted)' }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {RECENT_SALES.map((sale, i) => (
              <div
                key={sale.time}
                className="grid gap-3"
                style={{
                  gridTemplateColumns: '60px 1fr 90px 90px 1fr',
                  padding: '10px 12px',
                  borderBottom: i < RECENT_SALES.length - 1 ? '1px solid var(--register-border)' : 'none',
                  background: i === 0 ? 'rgba(16,185,129,0.04)' : 'transparent',
                  animation: `reg-fadeUp 0.4s ease-out ${0.1 * i}s both`,
                }}
              >
                <span className="text-sm tabular-nums" style={{ color: 'var(--register-text-muted)' }}>{sale.time}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--register-text)' }}>{sale.item}</span>
                <span className="text-sm tabular-nums font-semibold" style={{ color: 'var(--register-text)' }}>${sale.amount.toLocaleString()}</span>
                <span className="text-sm tabular-nums font-bold" style={{ color: ACCENT }}>+${sale.commission.toFixed(2)}</span>
                <span className="text-xs" style={{ color: 'var(--register-text-muted)' }}>{sale.components}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI Insight ────────────────────────────────────── */}
        <div className="reg-fade-up reg-stagger-6">
          <AIInsightCard label="AI Pace Forecast">
            At current pace, Casey reaches <strong style={{ color: '#FFD700' }}>Gold</strong> tier
            by <strong>March 22</strong>. One additional <strong style={{ color: '#06B6D4' }}>$3K+ sale</strong> this
            week would accelerate by <strong>4 days</strong> — unlocking the higher rate on all remaining March revenue.
          </AIInsightCard>
        </div>
      </RegisterPage>
    </>
  );
}
