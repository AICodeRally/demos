'use client';

import { useState, useMemo, useCallback } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import {
  ADMIN_PLANS, PUSH_HISTORY,
  type CompPlan, type CompTier, type PlanStatus, type SpiffRule,
} from '@/data/register/comp-data';
import { broadcastCompUpdate, broadcastPosSync } from '@/lib/register-broadcast';

const ACCENT = '#10B981';

/* ── Status config ───────────────────────────────────────── */

const STATUS_CONFIG: Record<PlanStatus, { color: string; bg: string; label: string }> = {
  active:   { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  label: 'Active' },
  draft:    { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  label: 'Draft' },
  pending:  { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',  label: 'Pending' },
  archived: { color: '#94A3B8', bg: 'rgba(148,163,184,0.1)', label: 'Archived' },
};

/* ── Tier Editor ──────────────────────────────────────────── */

function TierEditor({ tiers, onUpdate }: {
  tiers: CompTier[];
  onUpdate: (tiers: CompTier[]) => void;
}) {
  return (
    <div className="space-y-2">
      {tiers.map((tier, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg px-3 py-2"
          style={{ background: `${tier.color}15` }}
        >
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
          <span className="text-xs font-semibold w-24" style={{ color: 'var(--register-text)' }}>
            {tier.name}
          </span>
          <span className="text-[11px] flex-1" style={{ color: 'var(--register-text-muted)' }}>
            ${tier.minRevenue.toLocaleString()} &ndash; {tier.maxRevenue === Infinity ? '\u221e' : `$${tier.maxRevenue.toLocaleString()}`}
          </span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={(tier.rate * 100).toFixed(1)}
              onChange={(e) => {
                const newRate = parseFloat(e.target.value) / 100;
                if (isNaN(newRate) || newRate < 0 || newRate > 0.20) return;
                const updated = tiers.map((t, j) => j === i ? { ...t, rate: newRate } : t);
                onUpdate(updated);
              }}
              className="w-16 rounded px-2 py-1 text-right text-xs font-mono font-bold"
              style={{
                background: 'var(--register-bg-surface)',
                border: '1px solid var(--register-border)',
                color: 'var(--register-text)',
              }}
            />
            <span className="text-xs" style={{ color: 'var(--register-text-muted)' }}>%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── SPIFF Toggles ────────────────────────────────────────── */

function SpiffToggles({ spiffs, onToggle }: {
  spiffs: SpiffRule[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {spiffs.map((spiff) => (
        <div
          key={spiff.id}
          className="flex items-center justify-between rounded-lg px-3 py-2"
          style={{ background: 'var(--register-bg-surface)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: 'var(--register-text)' }}>{spiff.name}</span>
            <span className="text-[10px]" style={{ color: 'var(--register-text-muted)' }}>{spiff.product}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold" style={{ color: 'var(--register-text)' }}>${spiff.bonus}</span>
            <button
              onClick={() => onToggle(spiff.id)}
              className="rounded px-2 py-0.5 text-[10px] font-bold transition-all"
              style={{
                backgroundColor: spiff.active ? 'rgba(16,185,129,0.15)' : 'var(--register-bg-surface)',
                color: spiff.active ? ACCENT : 'var(--register-text-muted)',
                border: `1px solid ${spiff.active ? ACCENT : 'var(--register-border)'}`,
              }}
            >
              {spiff.active ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Commission Simulator ────────────────────────────────── */

function CommissionSimulator({ plan, draftTiers }: { plan: CompPlan; draftTiers?: CompTier[] }) {
  const sampleSale = 2500;
  const sampleYtd = 38000;

  const calcComm = useCallback((tiers: CompTier[]) => {
    const tier = tiers.find((t) => sampleYtd >= t.minRevenue && sampleYtd <= t.maxRevenue);
    return tier ? sampleSale * tier.rate : sampleSale * tiers[0].rate;
  }, []);

  const currentComm = calcComm(plan.tiers);
  const draftComm = draftTiers ? calcComm(draftTiers) : currentComm;
  const delta = draftComm - currentComm;

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)' }}
    >
      <p className="text-sm font-bold mb-4" style={{ color: 'var(--register-text)' }}>
        Commission Simulator
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg p-3" style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}>
          <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--register-text-muted)' }}>Sample Sale</p>
          <p className="text-lg font-bold font-mono" style={{ color: 'var(--register-text)' }}>${sampleSale.toLocaleString()}</p>
          <p className="text-[10px]" style={{ color: 'var(--register-text-muted)' }}>Queen Hybrid + Protector</p>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}>
          <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--register-text-muted)' }}>YTD Revenue</p>
          <p className="text-lg font-bold font-mono" style={{ color: 'var(--register-text)' }}>${sampleYtd.toLocaleString()}</p>
          <p className="text-[10px]" style={{ color: 'var(--register-text-muted)' }}>Silver tier</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3 text-center" style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}>
          <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--register-text-muted)' }}>Current Plan</p>
          <p className="text-xl font-bold font-mono" style={{ color: 'var(--register-text)' }}>${currentComm.toFixed(2)}</p>
        </div>
        <div
          className="rounded-lg p-3 text-center"
          style={{
            background: draftTiers ? 'rgba(16,185,129,0.08)' : 'var(--register-bg-elevated)',
            border: `1px solid ${draftTiers ? ACCENT : 'var(--register-border)'}`,
          }}
        >
          <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--register-text-muted)' }}>
            {draftTiers ? 'Draft Plan' : 'No Changes'}
          </p>
          <p className="text-xl font-bold font-mono" style={{ color: draftTiers ? ACCENT : 'var(--register-text)' }}>
            ${draftComm.toFixed(2)}
          </p>
        </div>
      </div>

      {draftTiers && delta !== 0 && (
        <div
          className="mt-3 rounded-lg p-2.5 text-center"
          style={{ background: delta > 0 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)' }}
        >
          <p className="text-xs font-semibold" style={{ color: delta > 0 ? '#F59E0B' : '#EF4444' }}>
            {delta > 0 ? '+' : ''}{delta.toFixed(2)} per sale &middot; Affects {plan.enrolled} reps &middot;{' '}
            Est. {delta > 0 ? '+' : ''}${Math.abs(delta * plan.enrolled * 15).toFixed(0)}/mo
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */

export default function CompAdminPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('plan-flagship');
  const [draftTiers, setDraftTiers] = useState<Record<string, CompTier[]>>({});
  const [draftSpiffs, setDraftSpiffs] = useState<Record<string, SpiffRule[]>>({});
  const [pushSent, setPushSent] = useState(false);
  const insight = getInsight('comp/admin');

  const plan = ADMIN_PLANS.find((p) => p.id === selectedPlan)!;
  const currentDraftTiers = draftTiers[selectedPlan];
  const currentDraftSpiffs = draftSpiffs[selectedPlan];
  const hasChanges = !!currentDraftTiers || !!currentDraftSpiffs;

  const handleTierUpdate = useCallback((tiers: CompTier[]) => {
    setDraftTiers((prev) => ({ ...prev, [selectedPlan]: tiers }));
  }, [selectedPlan]);

  const handleSpiffToggle = useCallback((spiffId: string) => {
    const currentSpiffs = draftSpiffs[selectedPlan] ?? plan.spiffs;
    const updated = currentSpiffs.map((s) => s.id === spiffId ? { ...s, active: !s.active } : s);
    setDraftSpiffs((prev) => ({ ...prev, [selectedPlan]: updated }));
  }, [selectedPlan, draftSpiffs, plan.spiffs]);

  const handleRevert = useCallback(() => {
    setDraftTiers((prev) => { const next = { ...prev }; delete next[selectedPlan]; return next; });
    setDraftSpiffs((prev) => { const next = { ...prev }; delete next[selectedPlan]; return next; });
  }, [selectedPlan]);

  const handlePushAll = useCallback(() => {
    broadcastCompUpdate({
      id: `comp-${Date.now()}`,
      planId: plan.id,
      planName: plan.name,
      changeType: 'full_plan',
      summary: `Updated ${plan.name} — plan changes pushed`,
      pushedBy: 'Dana K. (Comp Admin)',
      timestamp: new Date().toISOString(),
    });
    broadcastPosSync({
      id: `sync-${Date.now()}`,
      reason: 'Comp plan update',
      planIds: [plan.id],
      timestamp: new Date().toISOString(),
    });
    setPushSent(true);
    setTimeout(() => setPushSent(false), 3000);
  }, [plan]);

  const totalEnrolled = useMemo(() => ADMIN_PLANS.reduce((s, p) => s + p.enrolled, 0), []);
  const totalBudget = useMemo(() => ADMIN_PLANS.reduce((s, p) => s + p.monthlyBudget, 0), []);

  return (
    <RegisterPage title="Compensation Admin" subtitle="Plan Design & Distribution" accentColor={ACCENT}>
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Plans', value: String(ADMIN_PLANS.filter((p) => p.status === 'active').length), color: ACCENT },
          { label: 'Drafts', value: String(ADMIN_PLANS.filter((p) => p.status === 'draft').length), color: '#F59E0B' },
          { label: 'Reps Enrolled', value: String(totalEnrolled), color: '#06B6D4' },
          { label: 'Monthly Budget', value: `$${(totalBudget / 1000).toFixed(0)}K`, color: '#1E3A5F' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl p-4"
            style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
          >
            <p className="text-[10px] uppercase tracking-wide font-semibold mb-1" style={{ color: 'var(--register-text-muted)' }}>
              {kpi.label}
            </p>
            <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Left Panel (60%) — Plan List & Editor */}
        <div className="lg:col-span-3 space-y-4">
          {ADMIN_PLANS.map((p) => {
            const stCfg = STATUS_CONFIG[p.status];
            const isSelected = p.id === selectedPlan;
            const hasDraft = !!draftTiers[p.id] || !!draftSpiffs[p.id];

            return (
              <div key={p.id}>
                <button
                  onClick={() => setSelectedPlan(p.id)}
                  className="w-full text-left rounded-xl p-5 transition-all"
                  style={{
                    background: isSelected ? 'var(--register-bg-elevated)' : 'var(--register-bg-surface)',
                    border: `2px solid ${isSelected ? '#1E3A5F' : 'var(--register-border)'}`,
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold" style={{ color: 'var(--register-text)' }}>{p.name}</p>
                        {hasDraft && (
                          <span className="rounded px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: '#F59E0B' }}>
                            UNSAVED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px]" style={{ color: 'var(--register-text-muted)' }}>
                        {p.format} &middot; v{p.version} &middot; {p.effectiveFrom} to {p.effectiveTo}
                      </p>
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: stCfg.bg, color: stCfg.color }}
                    >
                      {stCfg.label}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="rounded-lg p-2 text-center" style={{ background: 'var(--register-bg-surface)' }}>
                      <p className="text-[10px]" style={{ color: 'var(--register-text-muted)' }}>Enrolled</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--register-text)' }}>{p.enrolled}</p>
                    </div>
                    <div className="rounded-lg p-2 text-center" style={{ background: 'var(--register-bg-surface)' }}>
                      <p className="text-[10px]" style={{ color: 'var(--register-text-muted)' }}>Budget</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--register-text)' }}>${(p.monthlyBudget / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="rounded-lg p-2 text-center" style={{ background: 'var(--register-bg-surface)' }}>
                      <p className="text-[10px]" style={{ color: 'var(--register-text-muted)' }}>Max Rate</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--register-text)' }}>
                        {(Math.max(...p.tiers.map((t) => t.rate)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Tier bar */}
                  <div className="flex h-3 rounded-full overflow-hidden">
                    {(draftTiers[p.id] ?? p.tiers).map((tier, i) => (
                      <div
                        key={i}
                        className="h-full"
                        style={{ backgroundColor: tier.color, flex: tier.maxRevenue === Infinity ? 2 : 1 }}
                        title={`${tier.name}: ${(tier.rate * 100).toFixed(1)}%`}
                      />
                    ))}
                  </div>
                </button>

                {/* Expanded Editor */}
                {isSelected && (
                  <div
                    className="rounded-b-xl px-5 pb-5 -mt-1 pt-4"
                    style={{ background: 'var(--register-bg-elevated)', borderLeft: '2px solid #1E3A5F', borderRight: '2px solid #1E3A5F', borderBottom: '2px solid #1E3A5F' }}
                  >
                    {/* Tier Editor */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold" style={{ color: 'var(--register-text)' }}>Tier Editor</p>
                      {hasChanges && (
                        <button
                          onClick={handleRevert}
                          className="text-[10px] font-medium"
                          style={{ color: '#EF4444' }}
                        >
                          Revert All
                        </button>
                      )}
                    </div>
                    <TierEditor
                      tiers={draftTiers[p.id] ?? p.tiers}
                      onUpdate={handleTierUpdate}
                    />

                    {/* SPIFF Toggles */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--register-text)' }}>SPIFF Toggles</p>
                      <SpiffToggles
                        spiffs={draftSpiffs[p.id] ?? p.spiffs}
                        onToggle={handleSpiffToggle}
                      />
                    </div>

                    {/* Accelerator Rules */}
                    <div className="mt-4">
                      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--register-text)' }}>Accelerators</p>
                      <div className="space-y-1.5">
                        {p.accelerators.map((acc, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 rounded-lg px-3 py-2"
                            style={{ background: 'rgba(59,130,246,0.06)' }}
                          >
                            <span className="text-xs" style={{ color: '#3B82F6' }}>{acc.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-5">
                      <button
                        className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: 'var(--register-bg-surface)', border: '1px solid var(--register-border)', color: 'var(--register-text)' }}
                      >
                        Save Draft
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                        style={{ backgroundColor: ACCENT }}
                      >
                        Activate
                      </button>
                      {hasChanges && (
                        <button
                          onClick={handleRevert}
                          className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
                        >
                          Revert
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Panel (40%) — Live Preview + Push */}
        <div className="lg:col-span-2 space-y-6">
          {/* Commission Simulator */}
          <CommissionSimulator plan={plan} draftTiers={currentDraftTiers} />

          {/* Impact Analysis */}
          {hasChanges && (
            <div
              className="rounded-xl p-5"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <p className="text-sm font-bold mb-2" style={{ color: 'var(--register-text)' }}>Impact Analysis</p>
              <p className="text-xs" style={{ color: 'var(--register-text-muted)' }}>
                This change affects <strong>{plan.enrolled} reps</strong> across all {plan.format} locations.
                Monthly budget: ${(plan.monthlyBudget / 1000).toFixed(0)}K. All POS terminals will reload comp rules on push.
              </p>
            </div>
          )}

          {/* Push to All POS */}
          <button
            onClick={handlePushAll}
            disabled={!hasChanges || pushSent}
            className="w-full rounded-xl px-5 py-3 text-sm font-bold text-white transition-all disabled:opacity-40"
            style={{ backgroundColor: pushSent ? ACCENT : '#1E3A5F' }}
          >
            {pushSent ? 'Pushed to All POS!' : 'Push to All POS'}
          </button>

          {/* Push History */}
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
          >
            <p className="text-sm font-bold mb-4" style={{ color: 'var(--register-text)' }}>Push History</p>
            <div className="space-y-3">
              {PUSH_HISTORY.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className="shrink-0 mt-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#06B6D4' }} />
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--register-text)' }}>{entry.summary}</p>
                    <p className="text-[10px]" style={{ color: 'var(--register-text-muted)' }}>
                      {entry.timestamp} &middot; {entry.pushedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      {insight && (
        <AIInsightCard label={insight.label}>
          {insight.text}
        </AIInsightCard>
      )}
    </RegisterPage>
  );
}
