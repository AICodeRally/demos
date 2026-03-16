'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import {
  ADMIN_PLANS, PUSH_HISTORY,
  type CompPlan, type CompTier, type PlanStatus,
} from '@/data/register/comp-data';
import {
  ChevronDown, ChevronRight, Send, Clock, CheckCircle, Settings, Users, Zap, FileText, TrendingUp, TrendingDown,
} from 'lucide-react';
import { calculate } from '@/lib/swic-engine/calculator';
import { SUMMIT_SLEEP_CONFIG, CATALOG_ITEMS, SAMPLE_PERIODS } from '@/data/register/summit-sleep';
import type { ClientConfig, SaleItem } from '@/lib/swic-engine/types';

const ACCENT = '#10B981';

/* ── Sample sale for SWIC simulation ─────────────────────── */

const SAMPLE_SALE: SaleItem[] = [
  { ...CATALOG_ITEMS[0], quantity: 1 },   // CloudRest King $2,999
  { ...CATALOG_ITEMS[8], quantity: 1 },   // ErgoMotion Pro $1,999
  { ...CATALOG_ITEMS[16], quantity: 1 },  // 5-Year Protection $149
];

const SAMPLE_PERIOD = SAMPLE_PERIODS['rep-sarah'];

/* ── Status config ───────────────────────────────────────── */

const STATUS_CONFIG: Record<PlanStatus, { color: string; bg: string; label: string }> = {
  active:   { color: '#10B981', bg: 'rgba(16,185,129,0.12)', label: 'Active' },
  draft:    { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Draft' },
  pending:  { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', label: 'Pending' },
  archived: { color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', label: 'Archived' },
};

/* ── Animated count-up hook ─────────────────────────────── */

function useCountUp(target: number, duration = 1200, decimals = 0, active = true) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) { setValue(0); return; }
    startTime.current = null;
    const step = (ts: number) => {
      if (!startTime.current) startTime.current = ts;
      const progress = Math.min((ts - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, decimals, active]);

  return value;
}

/* ── Tier Staircase Mini Viz ────────────────────────────── */

function TierStaircase({ tiers, label, highlight }: { tiers: { name: string; rate: number; color: string }[]; label: string; highlight?: boolean }) {
  const maxRate = Math.max(...tiers.map(t => t.rate));
  return (
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: highlight ? '#10B981' : 'var(--register-text-muted)', marginBottom: 8, textAlign: 'center' }}>
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 64 }}>
        {tiers.map((tier) => {
          const h = (tier.rate / maxRate) * 56 + 8;
          return (
            <div key={tier.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: tier.color }}>
                {(tier.rate * 100).toFixed(1)}%
              </span>
              <div
                style={{
                  width: '100%',
                  height: h,
                  borderRadius: '4px 4px 0 0',
                  background: highlight
                    ? `linear-gradient(180deg, ${tier.color}, ${tier.color}80)`
                    : `${tier.color}40`,
                  border: highlight ? `1px solid ${tier.color}` : `1px solid ${tier.color}30`,
                  transition: 'all 0.5s ease',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--register-text-dim)' }}>{tier.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Push History Entry ──────────────────────────────────── */

function PushEntry({ timestamp, who, what, status }: { timestamp: string; who: string; what: string; status: 'synced' | 'pending' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--register-border)' }}>
      <div style={{ marginTop: 2, flexShrink: 0 }}>
        {status === 'synced' ? (
          <CheckCircle size={14} color="#10B981" />
        ) : (
          <Clock size={14} color="#F59E0B" />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--register-text)', margin: 0, lineHeight: 1.3 }}>
          {what}
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)', margin: '2px 0 0' }}>
          {timestamp} &mdash; {who}
        </p>
      </div>
      <span
        style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 10,
          background: status === 'synced' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
          color: status === 'synced' ? '#10B981' : '#F59E0B',
          flexShrink: 0,
        }}
      >
        {status === 'synced' ? 'SYNCED' : 'PENDING'}
      </span>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function CompAdminPage() {
  const [expandedPlan, setExpandedPlan] = useState<string>('plan-flagship');
  const [showSimulator, setShowSimulator] = useState(true);
  const [pushAnimating, setPushAnimating] = useState(false);
  const [pushComplete, setPushComplete] = useState(false);
  const [pulseGlow, setPulseGlow] = useState(true);

  // Pulse the button glow
  useEffect(() => {
    const interval = setInterval(() => setPulseGlow(v => !v), 1800);
    return () => clearInterval(interval);
  }, []);

  // Simulated impact numbers animate when simulator is visible
  const affectedReps = useCountUp(47, 800, 0, showSimulator);
  const payoutDelta = useCountUp(12400, 1400, 0, showSimulator);
  const revImpact = useCountUp(89000, 1600, 0, showSimulator);

  const handlePush = useCallback(() => {
    setPushAnimating(true);
    setTimeout(() => {
      setPushAnimating(false);
      setPushComplete(true);
      setTimeout(() => setPushComplete(false), 3000);
    }, 2000);
  }, []);

  const plan = ADMIN_PLANS.find(p => p.id === expandedPlan)!;

  /* ── Editable tier state ──────────────────────────────── */
  const [editedTiers, setEditedTiers] = useState<Record<string, CompTier[]>>({});

  // Get current tiers for the expanded plan (edited or original)
  const currentTiers = plan ? (editedTiers[plan.id] ?? plan.tiers) : [];
  const originalTiers = plan?.tiers ?? [];
  const hasEdits = plan ? !!editedTiers[plan.id] : false;

  const updateTier = useCallback((planId: string, tierIndex: number, field: 'minRevenue' | 'maxRevenue' | 'rate', value: number) => {
    setEditedTiers(prev => {
      const base = prev[planId] ?? ADMIN_PLANS.find(p => p.id === planId)!.tiers;
      const updated = base.map((t, i) => i === tierIndex ? { ...t, [field]: value } : t);
      return { ...prev, [planId]: updated };
    });
  }, []);

  const resetTiers = useCallback((planId: string) => {
    setEditedTiers(prev => {
      const next = { ...prev };
      delete next[planId];
      return next;
    });
  }, []);

  /* ── SWIC Calculation (live impact) ───────────────────── */
  const swicResult = useMemo(() => {
    if (!plan) return null;

    // Original calculation
    const originalResult = calculate(SUMMIT_SLEEP_CONFIG, SAMPLE_SALE, SAMPLE_PERIOD);

    // Build modified config by cloning and replacing base-comm tiers
    const tiers = editedTiers[plan.id];
    if (!tiers) return { original: originalResult.totalCommission, modified: originalResult.totalCommission, delta: 0 };

    const modifiedConfig: ClientConfig = {
      ...SUMMIT_SLEEP_CONFIG,
      components: SUMMIT_SLEEP_CONFIG.components.map(comp => {
        if (comp.id === 'base-comm' && comp.rule.type === 'tiered') {
          return {
            ...comp,
            rule: {
              ...comp.rule,
              tiers: tiers.map(t => ({ min: t.minRevenue, rate: t.rate })),
            },
          };
        }
        return comp;
      }),
    };

    const modifiedResult = calculate(modifiedConfig, SAMPLE_SALE, SAMPLE_PERIOD);

    return {
      original: originalResult.totalCommission,
      modified: modifiedResult.totalCommission,
      delta: modifiedResult.totalCommission - originalResult.totalCommission,
    };
  }, [plan, editedTiers]);

  // Proposed tiers for the staircase viz — use edited if available, else simulated
  const proposedTiers = hasEdits
    ? currentTiers
    : plan.tiers.map((t, i) => {
        if (i === 1) return { ...t, minRevenue: 20000, maxRevenue: 44999 };
        if (i === 2) return { ...t, minRevenue: 45000 };
        return t;
      });

  return (
    <RegisterPage title="Comp Admin" subtitle="Design comp rules, simulate impact, push to Varicent" accentColor={ACCENT}>
      <div className="flex flex-col lg:flex-row" style={{ gap: 24 }}>

        {/* ══════════════════════════════════════════════
            LEFT PANEL — Active Plans (60%)
           ══════════════════════════════════════════════ */}
        <div style={{ flex: '0 0 60%', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Settings size={16} color="var(--register-text-muted)" />
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>Active Plans</h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)', marginLeft: 'auto' }}>
              {ADMIN_PLANS.length} plans &middot; {ADMIN_PLANS.reduce((s, p) => s + p.enrolled, 0)} reps
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ADMIN_PLANS.map((p) => {
              const stCfg = STATUS_CONFIG[p.status];
              const isExpanded = p.id === expandedPlan;

              return (
                <div key={p.id}>
                  {/* Plan Card Header */}
                  <button
                    onClick={() => setExpandedPlan(isExpanded ? '' : p.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: isExpanded
                        ? 'linear-gradient(135deg, var(--register-bg-elevated), rgba(30,58,95,0.1))'
                        : 'var(--register-bg-elevated)',
                      border: `1px solid ${isExpanded ? '#1E3A5F' : 'var(--register-border)'}`,
                      borderRadius: isExpanded ? '12px 12px 0 0' : 12,
                      padding: '16px 20px',
                      color: 'inherit',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {isExpanded ? (
                        <ChevronDown size={16} color="var(--register-text-muted)" />
                      ) : (
                        <ChevronRight size={16} color="var(--register-text-muted)" />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>
                            {p.name}
                          </span>
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 10,
                              background: stCfg.bg,
                              color: stCfg.color,
                            }}
                          >
                            {stCfg.label}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--register-text-dim)' }}>
                          {p.format} &middot; {p.enrolled} reps &middot; {p.effectiveFrom} to {p.effectiveTo}
                        </span>
                      </div>
                      {/* Mini tier preview */}
                      <div style={{ display: 'flex', height: 8, width: 80, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
                        {p.tiers.map((tier, i) => (
                          <div
                            key={i}
                            style={{
                              height: '100%',
                              flex: tier.maxRevenue === Infinity ? 2 : 1,
                              backgroundColor: tier.color,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Tier Editor */}
                  {isExpanded && (
                    <div
                      style={{
                        background: 'var(--register-bg-elevated)',
                        border: '1px solid #1E3A5F',
                        borderTop: 'none',
                        borderRadius: '0 0 12px 12px',
                        padding: '20px',
                        animation: 'fadeIn 0.3s ease',
                      }}
                    >
                      {/* Tier rows — editable */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <p className="register-meta-label" style={{ color: 'var(--register-text-muted)', margin: 0 }}>
                          Commission Tiers
                        </p>
                        {editedTiers[p.id] && (
                          <button
                            onClick={() => resetTiers(p.id)}
                            style={{
                              fontSize: '0.8rem', fontWeight: 600, color: '#F59E0B',
                              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                              borderRadius: 6, padding: '2px 8px', cursor: 'pointer',
                            }}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(editedTiers[p.id] ?? p.tiers).map((tier, i) => {
                          const orig = p.tiers[i];
                          const minChanged = tier.minRevenue !== orig.minRevenue;
                          const maxChanged = tier.maxRevenue !== orig.maxRevenue;
                          const rateChanged = tier.rate !== orig.rate;
                          return (
                            <div
                              key={i}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 14px',
                                borderRadius: 10,
                                background: `${tier.color}10`,
                                border: `1px solid ${(minChanged || maxChanged || rateChanged) ? '#F59E0B' : tier.color}25`,
                              }}
                            >
                              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: tier.color, flexShrink: 0 }} />
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--register-text)', width: 70 }}>{tier.name}</span>
                              {/* Threshold fields — editable inputs */}
                              <div
                                style={{
                                  flex: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  padding: '4px 10px',
                                  borderRadius: 6,
                                  background: 'var(--register-bg-surface)',
                                  border: `1px solid ${minChanged || maxChanged ? 'rgba(245,158,11,0.4)' : 'var(--register-border)'}`,
                                }}
                              >
                                <span style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)' }}>$</span>
                                <input
                                  type="number"
                                  value={tier.minRevenue}
                                  onChange={(e) => updateTier(p.id, i, 'minRevenue', Math.max(0, Number(e.target.value)))}
                                  style={{
                                    width: 60, background: 'transparent', border: 'none', outline: 'none',
                                    fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums',
                                    color: minChanged ? '#F59E0B' : 'var(--register-text-dim)',
                                    fontWeight: minChanged ? 700 : 400,
                                  }}
                                />
                                <span style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)' }}>&ndash;</span>
                                {tier.maxRevenue === Infinity ? (
                                  <span style={{ fontSize: '0.85rem', color: 'var(--register-text-dim)', fontVariantNumeric: 'tabular-nums' }}>{'\u221E'}</span>
                                ) : (
                                  <>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)' }}>$</span>
                                    <input
                                      type="number"
                                      value={tier.maxRevenue}
                                      onChange={(e) => updateTier(p.id, i, 'maxRevenue', Math.max(0, Number(e.target.value)))}
                                      style={{
                                        width: 60, background: 'transparent', border: 'none', outline: 'none',
                                        fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums',
                                        color: maxChanged ? '#F59E0B' : 'var(--register-text-dim)',
                                        fontWeight: maxChanged ? 700 : 400,
                                      }}
                                    />
                                  </>
                                )}
                              </div>
                              {/* Rate field — editable */}
                              <div
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  background: 'var(--register-bg-surface)',
                                  border: `1px solid ${rateChanged ? 'rgba(245,158,11,0.4)' : 'var(--register-border)'}`,
                                  display: 'flex', alignItems: 'center', gap: 2,
                                }}
                              >
                                <input
                                  type="number"
                                  step="0.1"
                                  value={parseFloat((tier.rate * 100).toFixed(2))}
                                  onChange={(e) => updateTier(p.id, i, 'rate', Math.max(0, Math.min(100, Number(e.target.value))) / 100)}
                                  style={{
                                    width: 42, background: 'transparent', border: 'none', outline: 'none',
                                    fontSize: '0.8rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right',
                                    color: rateChanged ? '#F59E0B' : tier.color,
                                  }}
                                />
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: rateChanged ? '#F59E0B' : tier.color }}>%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* SPIFF Toggles */}
                      <p className="register-meta-label" style={{ color: 'var(--register-text-muted)', marginTop: 20, marginBottom: 10 }}>
                        SPIFF Rules
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {p.spiffs.map((spiff) => (
                          <div
                            key={spiff.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              borderRadius: 10,
                              background: 'var(--register-bg-surface)',
                              border: '1px solid var(--register-border)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Zap size={13} color={spiff.active ? '#F59E0B' : 'var(--register-text-dim)'} />
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--register-text)' }}>{spiff.name}</span>
                              <span style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)' }}>${spiff.bonus}/unit</span>
                            </div>
                            {/* Toggle pill */}
                            <div
                              style={{
                                width: 40,
                                height: 20,
                                borderRadius: 10,
                                background: spiff.active ? '#10B981' : 'rgba(255,255,255,0.08)',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'background 0.3s',
                              }}
                            >
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 2,
                                  left: spiff.active ? 22 : 2,
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  background: 'white',
                                  transition: 'left 0.3s',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Accelerators */}
                      {p.accelerators.length > 0 && (
                        <>
                          <p className="register-meta-label" style={{ color: 'var(--register-text-muted)', marginTop: 20, marginBottom: 10 }}>
                            Accelerators
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {p.accelerators.map((acc, i) => (
                              <div
                                key={i}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  padding: '8px 14px',
                                  borderRadius: 10,
                                  background: 'rgba(59,130,246,0.06)',
                                  border: '1px solid rgba(59,130,246,0.15)',
                                }}
                              >
                                <Zap size={12} color="#3B82F6" />
                                <span style={{ fontSize: '0.85rem', color: 'var(--register-text)' }}>{acc.label}</span>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3B82F6', fontVariantNumeric: 'tabular-nums', marginLeft: 'auto' }}>
                                  {acc.multiplier}x
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            RIGHT PANEL — Simulator + Push (40%)
           ══════════════════════════════════════════════ */}
        <div style={{ flex: '0 0 38%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* AI Insight */}
          <AIInsightCard label="AI Impact Analysis" compact>
            Proposed tier change affects 47 reps across 12 stores. Net impact: +$12K monthly payout, projected +$89K incremental revenue from improved motivation at lower threshold.
          </AIInsightCard>

          {/* ── SWIC Live Calculation Panel ──────────────── */}
          {swicResult && hasEdits && (
            <div
              style={{
                borderRadius: 14,
                background: 'linear-gradient(135deg, var(--register-bg-elevated), rgba(139,92,246,0.04))',
                border: `1px solid ${swicResult.delta >= 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                padding: '20px',
                animation: 'fadeIn 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                {swicResult.delta >= 0 ? (
                  <TrendingUp size={15} color="#10B981" />
                ) : (
                  <TrendingDown size={15} color="#EF4444" />
                )}
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>SWIC Live Calc</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--register-text-dim)', marginLeft: 'auto' }}>sample sale</span>
              </div>

              {/* Sample sale description */}
              <div
                style={{
                  padding: '8px 12px', borderRadius: 8, marginBottom: 14,
                  background: 'rgba(6,182,212,0.06)',
                  border: '1px solid rgba(6,182,212,0.12)',
                }}
              >
                <p style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)', margin: 0, lineHeight: 1.4 }}>
                  CloudRest King ($2,999) + ErgoMotion Pro ($1,999) + 5-Year Protection ($149) = <strong style={{ color: 'var(--register-text)' }}>$5,147</strong>
                </p>
              </div>

              {/* Original vs Modified */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--register-text-muted)' }}>Original Commission</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)' }}>
                    ${swicResult.original.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--register-text-muted)' }}>Modified Commission</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: swicResult.delta >= 0 ? '#10B981' : '#EF4444' }}>
                    ${swicResult.modified.toFixed(2)}
                  </span>
                </div>
                <div style={{ height: 1, background: 'var(--register-border)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>Delta</span>
                  <span
                    style={{
                      fontSize: '1.1rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums',
                      color: swicResult.delta >= 0 ? '#10B981' : '#EF4444',
                    }}
                  >
                    {swicResult.delta >= 0 ? '+' : ''}{swicResult.delta.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Explanation */}
              <p
                style={{
                  fontSize: '0.82rem', color: 'var(--register-text-dim)',
                  margin: 0, lineHeight: 1.5, fontStyle: 'italic',
                  padding: '8px 10px', borderRadius: 8,
                  background: swicResult.delta >= 0 ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                  border: `1px solid ${swicResult.delta >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}`,
                }}
              >
                {swicResult.delta === 0
                  ? 'No change in commission for this sample sale.'
                  : `This changes the rep's earnings by $${Math.abs(swicResult.delta).toFixed(2)} ${swicResult.delta > 0 ? 'more' : 'less'} on this sample sale.`}
              </p>
            </div>
          )}

          {/* ── Live Impact Simulator ─────────────────── */}
          <div
            className="register-card"
            style={{
              background: 'linear-gradient(135deg, var(--register-bg-elevated), rgba(16,185,129,0.04))',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Zap size={15} color="#10B981" />
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>Live Impact Simulator</h3>
            </div>

            {/* Scenario description */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(6,182,212,0.06)',
                border: '1px solid rgba(6,182,212,0.15)',
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: '0.75rem', color: 'var(--register-text)', margin: 0, lineHeight: 1.5 }}>
                If you change <strong style={{ color: '#06B6D4' }}>Silver threshold</strong> from <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--register-text-muted)' }}>$25K &rarr; $20K</span> and <strong style={{ color: '#06B6D4' }}>Gold threshold</strong> from <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--register-text-muted)' }}>$50K &rarr; $45K</span>:
              </p>
            </div>

            {/* Impact metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              <div style={{ padding: '12px', borderRadius: 10, background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Users size={12} color="var(--register-text-muted)" />
                  <span className="register-meta-label">Affected Reps</span>
                </div>
                <p style={{ fontSize: '1.3rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)', margin: 0 }}>
                  {affectedReps}
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--register-text-dim)' }}>across 12 stores</span>
              </div>

              <div style={{ padding: '12px', borderRadius: 10, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span className="register-meta-label">Payout Delta</span>
                </div>
                <p style={{ fontSize: '1.3rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#10B981', margin: 0 }}>
                  +${payoutDelta.toLocaleString()}
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--register-text-dim)' }}>monthly increase</span>
              </div>

              <div style={{ padding: '12px', borderRadius: 10, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span className="register-meta-label">Revenue Impact</span>
                </div>
                <p style={{ fontSize: '1.3rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#10B981', margin: 0 }}>
                  +${revImpact.toLocaleString()}
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--register-text-dim)' }}>projected incremental</span>
              </div>

              <div style={{ padding: '12px', borderRadius: 10, background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span className="register-meta-label">Budget Impact</span>
                </div>
                <p style={{ fontSize: '1.3rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#F59E0B', margin: 0 }}>
                  +0.8%
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--register-text-dim)' }}>comp ratio increase</span>
              </div>
            </div>

            {/* Before / After tier staircases */}
            <div style={{ display: 'flex', gap: 16, padding: '14px', borderRadius: 10, background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)' }}>
              <TierStaircase
                tiers={plan.tiers.map(t => ({ name: t.name, rate: t.rate, color: t.color }))}
                label="Current"
              />
              <div style={{ width: 1, background: 'var(--register-border)', flexShrink: 0 }} />
              <TierStaircase
                tiers={proposedTiers.map(t => ({ name: t.name, rate: t.rate, color: t.color }))}
                label="Proposed"
                highlight
              />
            </div>

            {/* Rep distribution shift note */}
            <p style={{ fontSize: '0.82rem', color: 'var(--register-text-dim)', marginTop: 8, textAlign: 'center', fontStyle: 'italic' }}>
              12 reps shift from Bronze &rarr; Silver, 8 reps shift from Silver &rarr; Gold
            </p>
          </div>

          {/* ── Push to Varicent ─────────────────────── */}
          <div className="register-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Send size={15} color="#06B6D4" />
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>Push to Varicent</h3>
            </div>

            {/* Push button — the crown jewel */}
            <button
              onClick={handlePush}
              disabled={pushAnimating || pushComplete}
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: 12,
                border: 'none',
                cursor: pushAnimating || pushComplete ? 'default' : 'pointer',
                background: pushComplete
                  ? '#10B981'
                  : pushAnimating
                    ? 'linear-gradient(135deg, #1E3A5F, #06B6D4)'
                    : 'linear-gradient(135deg, #10B981, #06B6D4)',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                transition: 'all 0.4s ease',
                boxShadow: pulseGlow && !pushAnimating && !pushComplete
                  ? '0 0 24px rgba(16,185,129,0.4), 0 0 48px rgba(6,182,212,0.2)'
                  : '0 0 12px rgba(16,185,129,0.15)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {pushComplete ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <CheckCircle size={18} /> Pushed Successfully
                </span>
              ) : pushAnimating ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Pushing to Varicent...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Send size={16} /> Push Changes to Varicent
                </span>
              )}
            </button>

            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--register-text-dim)',
                textAlign: 'center',
                marginTop: 10,
                cursor: 'pointer',
              }}
            >
              Or <span style={{ color: '#06B6D4', fontWeight: 600, textDecoration: 'underline' }}>save as draft</span> for review
            </p>

            {/* Push History */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <FileText size={13} color="var(--register-text-muted)" />
                <span className="register-meta-label" style={{ color: 'var(--register-text-muted)' }}>
                  Push History
                </span>
              </div>
              <PushEntry
                timestamp="Mar 12, 2:15 PM"
                who="Sarah M."
                what="Pushed Tier 2 threshold change (Flagship)"
                status="synced"
              />
              <PushEntry
                timestamp="Mar 10, 9:30 AM"
                who="Todd B."
                what="Activated Q2 SPIFF calendar"
                status="synced"
              />
              <PushEntry
                timestamp="Mar 8, 4:45 PM"
                who="Sarah M."
                what="Pushed Bundle Accelerator update"
                status="synced"
              />
              {pushComplete && (
                <PushEntry
                  timestamp="Just now"
                  who="You"
                  what="Pushed threshold changes to Varicent"
                  status="pending"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </RegisterPage>
  );
}
