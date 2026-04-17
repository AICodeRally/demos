'use client';

import { useState } from 'react';
import type { Rule, ComponentConfig, TierStep } from '@/lib/swic/engine/types';
import { TierStaircase } from './TierStaircase';
import { Plus, Trash2, ChevronDown, ChevronUp, FlaskConical, RotateCcw } from 'lucide-react';

interface RuleSimulatorProps {
  components: ComponentConfig[];
  onRulesChange: (overrides: Record<string, Rule>) => void;
  overrides: Record<string, Rule>;
  accent: string;
}

const RULE_TYPES = [
  { value: 'placeholder', label: 'Placeholder (TBD)' },
  { value: 'percent_of', label: 'Percent Of' },
  { value: 'tiered', label: 'Tiered Rate' },
  { value: 'fixed_per_match', label: 'Fixed Per Match' },
  { value: 'multiplier', label: 'Multiplier' },
] as const;

const BASIS_OPTIONS = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'cost', label: 'Cost' },
  { value: 'margin', label: 'Margin' },
  { value: 'margin_percent', label: 'Margin %' },
];

const MATCH_FIELD_OPTIONS = [
  { value: 'tag', label: 'Tag' },
  { value: 'category', label: 'Category' },
  { value: 'sku', label: 'SKU' },
];

function defaultRuleForType(type: string): Rule {
  switch (type) {
    case 'percent_of':
      return { type: 'percent_of', rate: 0.04, basis: 'revenue' };
    case 'tiered':
      return {
        type: 'tiered', basis: 'revenue', marginal: true,
        tiers: [{ min: 0, rate: 0.03 }, { min: 50000, rate: 0.05 }],
      };
    case 'fixed_per_match':
      return { type: 'fixed_per_match', amount: 25, match: { field: 'tag', value: 'premium' } };
    case 'multiplier':
      return { type: 'multiplier', factor: 0.5, appliesTo: 'all' };
    default:
      return { type: 'placeholder', description: 'Not configured' };
  }
}

function RuleEditor({
  rule, onChange, accent,
}: {
  rule: Rule; onChange: (r: Rule) => void; accent: string;
}) {
  switch (rule.type) {
    case 'percent_of':
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs" style={{ color: 'var(--page-muted)' }}>Rate %</label>
          <input
            type="number"
            step="0.5"
            value={(rule.rate * 100).toFixed(1)}
            onChange={(e) => onChange({ ...rule, rate: parseFloat(e.target.value) / 100 || 0 })}
            className="glass-input w-20 px-2 py-1.5 rounded-lg text-sm font-mono"
          />
          <label className="text-xs" style={{ color: 'var(--page-muted)' }}>of</label>
          <select
            value={rule.basis}
            onChange={(e) => onChange({ ...rule, basis: e.target.value as typeof rule.basis })}
            className="glass-input px-2 py-1.5 rounded-lg text-sm"
          >
            {BASIS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {/* Mini gauge */}
          <div className="flex items-center gap-1.5 ml-2">
            <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--glass-border)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(rule.rate * 100 * 5, 100)}%`,
                  background: `linear-gradient(90deg, ${accent}, ${accent}cc)`,
                }}
              />
            </div>
            <span className="text-[10px] font-mono" style={{ color: accent }}>
              {(rule.rate * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      );

    case 'tiered':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-xs" style={{ color: 'var(--page-muted)' }}>Basis</label>
            <select
              value={rule.basis}
              onChange={(e) => onChange({ ...rule, basis: e.target.value as typeof rule.basis })}
              className="glass-input px-2 py-1.5 rounded-lg text-sm"
            >
              <option value="revenue">Revenue</option>
              <option value="margin">Margin</option>
              <option value="units">Units</option>
            </select>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: 'var(--page-muted)' }}>
              <input
                type="checkbox"
                checked={rule.marginal}
                onChange={(e) => onChange({ ...rule, marginal: e.target.checked })}
                className="rounded"
                style={{ accentColor: accent }}
              />
              Marginal
            </label>
          </div>

          <div className="flex gap-4">
            {/* Tier inputs */}
            <div className="space-y-1.5 flex-1">
              {rule.tiers.map((tier, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="text-[10px] w-5 h-5 rounded flex items-center justify-center font-bold"
                    style={{ backgroundColor: `${accent}15`, color: accent }}
                  >
                    {i + 1}
                  </span>
                  <label className="text-[10px]" style={{ color: 'var(--page-muted)' }}>Min $</label>
                  <input
                    type="number"
                    value={tier.min}
                    onChange={(e) => {
                      const tiers = [...rule.tiers];
                      tiers[i] = { ...tier, min: parseFloat(e.target.value) || 0 };
                      onChange({ ...rule, tiers });
                    }}
                    className="glass-input w-24 px-2 py-1 rounded-lg text-sm font-mono"
                  />
                  <label className="text-[10px]" style={{ color: 'var(--page-muted)' }}>Rate %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={(tier.rate * 100).toFixed(1)}
                    onChange={(e) => {
                      const tiers = [...rule.tiers];
                      tiers[i] = { ...tier, rate: parseFloat(e.target.value) / 100 || 0 };
                      onChange({ ...rule, tiers });
                    }}
                    className="glass-input w-20 px-2 py-1 rounded-lg text-sm font-mono"
                  />
                  {rule.tiers.length > 1 && (
                    <button
                      onClick={() => {
                        const tiers = rule.tiers.filter((_, idx) => idx !== i);
                        onChange({ ...rule, tiers });
                      }}
                      className="p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  const lastTier = rule.tiers[rule.tiers.length - 1];
                  const newMin = lastTier ? lastTier.min + 25000 : 0;
                  const newRate = lastTier ? lastTier.rate + 0.01 : 0.03;
                  onChange({ ...rule, tiers: [...rule.tiers, { min: newMin, rate: newRate }] });
                }}
                className="glass-pill flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg hover:scale-[1.02] transition-all"
                style={{ color: 'var(--page-muted)' }}
              >
                <Plus className="w-3 h-3" /> Add tier
              </button>
            </div>

            {/* Staircase visualization */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--page-muted)' }}>
                Rate structure
              </span>
              <div className="glass rounded-lg p-2">
                <TierStaircase tiers={rule.tiers} accent={accent} />
              </div>
            </div>
          </div>
        </div>
      );

    case 'fixed_per_match':
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs" style={{ color: 'var(--page-muted)' }}>$ Amount</label>
          <input
            type="number"
            value={rule.amount}
            onChange={(e) => onChange({ ...rule, amount: parseFloat(e.target.value) || 0 })}
            className="glass-input w-20 px-2 py-1.5 rounded-lg text-sm font-mono"
          />
          <label className="text-xs" style={{ color: 'var(--page-muted)' }}>per item with</label>
          <select
            value={rule.match.field}
            onChange={(e) => onChange({ ...rule, match: { ...rule.match, field: e.target.value as 'tag' | 'category' | 'sku' } })}
            className="glass-input px-2 py-1.5 rounded-lg text-sm"
          >
            {MATCH_FIELD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <span className="text-xs font-bold" style={{ color: accent }}>=</span>
          <input
            type="text"
            value={rule.match.value}
            onChange={(e) => onChange({ ...rule, match: { ...rule.match, value: e.target.value } })}
            className="glass-input w-32 px-2 py-1.5 rounded-lg text-sm"
            placeholder="e.g. premium"
          />
        </div>
      );

    case 'multiplier':
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs" style={{ color: 'var(--page-muted)' }}>Factor</label>
          <input
            type="number"
            step="0.1"
            value={rule.factor}
            onChange={(e) => onChange({ ...rule, factor: parseFloat(e.target.value) || 0 })}
            className="glass-input w-20 px-2 py-1.5 rounded-lg text-sm font-mono"
          />
          <span className="text-xs" style={{ color: 'var(--page-muted)' }}>(e.g. 0.5 = 50% split credit)</span>
        </div>
      );

    case 'placeholder':
      return (
        <p className="text-xs italic" style={{ color: 'var(--page-muted)', opacity: 0.6 }}>
          No formula configured — select a rule type to start modeling.
        </p>
      );

    default:
      return null;
  }
}

export function RuleSimulator({ components, onRulesChange, overrides, accent }: RuleSimulatorProps) {
  const [expanded, setExpanded] = useState(true);
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});

  const hasOverrides = Object.keys(overrides).length > 0;

  const toggleRule = (id: string) => {
    setExpandedRules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTypeChange = (compId: string, newType: string) => {
    const newRule = defaultRuleForType(newType);
    onRulesChange({ ...overrides, [compId]: newRule });
  };

  const handleRuleChange = (compId: string, rule: Rule) => {
    onRulesChange({ ...overrides, [compId]: rule });
  };

  const handleReset = (compId: string) => {
    const next = { ...overrides };
    delete next[compId];
    onRulesChange(next);
  };

  const handleResetAll = () => {
    onRulesChange({});
  };

  return (
    <div className="glass rounded-2xl overflow-hidden" style={{ borderTop: `2px solid ${accent}` }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1"
          onClick={() => setExpanded(!expanded)}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accent}30, ${accent}10)` }}
          >
            <FlaskConical className="w-4 h-4" style={{ color: accent }} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold tracking-tight">Comp Plan Modeler</h3>
            <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--page-muted)' }}>
              {hasOverrides && (
                <span className="inline-block w-1.5 h-1.5 rounded-full animate-status-pulse" style={{ backgroundColor: '#22c55e' }} />
              )}
              {hasOverrides
                ? `${Object.keys(overrides).length} rule${Object.keys(overrides).length !== 1 ? 's' : ''} modified — commission updates live`
                : 'Configure rules to model different comp plans'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasOverrides && (
            <button
              onClick={handleResetAll}
              className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              style={{ color: '#ef4444', background: '#ef444410', border: '1px solid #ef444420' }}
            >
              <RotateCcw className="w-3 h-3" /> Reset All
            </button>
          )}
          <div
            className="cursor-pointer p-1.5 rounded-lg hover:opacity-80 transition-opacity"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded
              ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--page-muted)' }} />
              : <ChevronDown className="w-4 h-4" style={{ color: 'var(--page-muted)' }} />}
          </div>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="px-5 pb-5 space-y-3 animate-fade-in-up">
          {components.map((comp) => {
            const currentRule = overrides[comp.id] ?? comp.rule;
            const isOverridden = comp.id in overrides;
            const isExpanded = expandedRules[comp.id] ?? false;

            return (
              <div
                key={comp.id}
                className="glass rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  borderLeft: isOverridden ? `3px solid ${accent}` : '3px solid transparent',
                }}
              >
                {/* Component header */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1"
                    onClick={() => toggleRule(comp.id)}
                  >
                    <span className="text-sm font-semibold">{comp.label}</span>
                    {isOverridden && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${accent}30, ${accent}15)`,
                          color: accent,
                        }}
                      >
                        MODIFIED
                      </span>
                    )}
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                      style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--page-muted)' }}
                    >
                      {currentRule.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOverridden && (
                      <button
                        onClick={() => handleReset(comp.id)}
                        className="text-xs px-2 py-0.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        style={{ color: '#ef4444' }}
                      >
                        Reset
                      </button>
                    )}
                    <div
                      className="cursor-pointer p-1 rounded-lg hover:opacity-80 transition-opacity"
                      onClick={() => toggleRule(comp.id)}
                    >
                      {isExpanded
                        ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--page-muted)' }} />
                        : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--page-muted)' }} />}
                    </div>
                  </div>
                </div>

                {/* Rule editor */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-fade-in-up">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium" style={{ color: 'var(--page-muted)' }}>Rule Type</label>
                      <select
                        value={currentRule.type}
                        onChange={(e) => handleTypeChange(comp.id, e.target.value)}
                        className="glass-input px-2 py-1.5 rounded-lg text-sm font-medium"
                      >
                        {RULE_TYPES.map((rt) => (
                          <option key={rt.value} value={rt.value}>{rt.label}</option>
                        ))}
                      </select>
                    </div>
                    <RuleEditor
                      rule={currentRule}
                      onChange={(r) => handleRuleChange(comp.id, r)}
                      accent={accent}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
