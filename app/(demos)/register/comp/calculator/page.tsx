'use client';

import { useState, useMemo } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { COMP_TIERS } from '@/data/register/comp-data';
import { SUMMIT_SLEEP_CONFIG, SAMPLE_PERIODS } from '@/data/register/summit-sleep';
import { calculate } from '@/lib/swic-engine/calculator';
import type { SaleItem, PeriodContext } from '@/lib/swic-engine/types';

const ACCENT = '#10B981';

export default function CalculatorPage() {
  const [saleAmount, setSaleAmount] = useState(2500);
  const insight = getInsight('comp/calculator');

  // Create synthetic sale item and period for the engine
  const result = useMemo(() => {
    const syntheticItem: SaleItem = {
      id: 'calc-sim',
      name: 'Simulated Sale',
      category: 'Mattress',
      tags: [],
      price: saleAmount,
      cost: saleAmount * 0.6,
      quantity: 1,
    };
    const period: PeriodContext = SAMPLE_PERIODS['rep-casey'];
    return calculate(SUMMIT_SLEEP_CONFIG, [syntheticItem], period);
  }, [saleAmount]);

  // Determine which display tier the sale amount falls under (using COMP_TIERS for display)
  const currentTier = COMP_TIERS.find(
    (t) => saleAmount >= t.minRevenue && saleAmount <= t.maxRevenue
  ) ?? COMP_TIERS[0];

  // For the staircase: map where the current sale falls relative to rep's YTD position
  const caseyRevenue = SAMPLE_PERIODS['rep-casey'].revenue; // $21,400
  const activeTier = COMP_TIERS.find(
    (t) => caseyRevenue >= t.minRevenue && caseyRevenue <= t.maxRevenue
  ) ?? COMP_TIERS[0];

  return (
    <RegisterPage title="Commission Calculator" subtitle="What-If Scenario Builder" accentColor={ACCENT}>
      {/* Input Section */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--register-text)' }}>
          Sale Amount
        </h2>
        <div className="flex items-center gap-6">
          <input
            type="range"
            min={0}
            max={10000}
            step={50}
            value={saleAmount}
            onChange={(e) => setSaleAmount(Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: ACCENT, background: 'var(--register-border)' }}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--register-text-muted)' }}>$</span>
            <input
              type="number"
              min={0}
              max={10000}
              step={50}
              value={saleAmount}
              onChange={(e) => setSaleAmount(Math.max(0, Math.min(10000, Number(e.target.value))))}
              className="w-28 rounded-lg px-3 py-2 text-right text-lg font-bold font-mono"
              style={{
                background: 'var(--register-bg-surface)',
                border: '1px solid var(--register-border)',
                color: 'var(--register-text)',
              }}
            />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs" style={{ color: 'var(--register-text-muted)' }}>$0</span>
          <span className="text-xs" style={{ color: 'var(--register-text-muted)' }}>$10,000</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Results Display */}
        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
        >
          <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--register-text)' }}>
            Calculation Results
          </h2>

          {/* Big number */}
          <div
            className="rounded-lg p-5 mb-5 text-center"
            style={{ background: 'rgba(16,185,129,0.08)', borderLeft: `4px solid ${ACCENT}` }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--register-text-muted)' }}>
              Total Commission
            </p>
            <p className="text-3xl font-bold font-mono" style={{ color: ACCENT }}>
              ${result.totalCommission.toFixed(2)}
            </p>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="rounded-lg p-3 text-center" style={{ background: 'var(--register-bg-surface)' }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--register-text-muted)' }}>Sale Total</p>
              <p className="text-base font-bold font-mono" style={{ color: 'var(--register-text)' }}>
                ${result.saleTotal.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: 'var(--register-bg-surface)' }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--register-text-muted)' }}>Gross Margin</p>
              <p className="text-base font-bold font-mono" style={{ color: 'var(--register-text)' }}>
                ${result.grossMargin.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: 'var(--register-bg-surface)' }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--register-text-muted)' }}>Eff. Rate</p>
              <p className="text-base font-bold font-mono" style={{ color: ACCENT }}>
                {saleAmount > 0 ? ((result.totalCommission / saleAmount) * 100).toFixed(2) : '0.00'}%
              </p>
            </div>
          </div>

          {/* Component Breakdown */}
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--register-text)' }}>
            Component Breakdown
          </h3>
          <div className="space-y-2">
            {result.components.map((comp) => (
              <div
                key={comp.componentId}
                className="flex items-center justify-between rounded-lg px-4 py-2.5"
                style={{ background: 'var(--register-bg-surface)' }}
              >
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--register-text)' }}>{comp.label}</span>
                  <span className="ml-2 text-xs" style={{ color: 'var(--register-text-muted)' }}>({comp.detail})</span>
                </div>
                <span className="text-sm font-bold font-mono" style={{ color: comp.amount > 0 ? ACCENT : 'var(--register-text-muted)' }}>
                  ${comp.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier Staircase Visual */}
        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
        >
          <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--register-text)' }}>
            Tier Staircase
          </h2>
          <p className="text-xs mb-5" style={{ color: 'var(--register-text-muted)' }}>
            Casey Miller&apos;s current position: ${caseyRevenue.toLocaleString()} MTD revenue ({activeTier.tier} tier)
          </p>

          <div className="flex items-end gap-3" style={{ height: 220 }}>
            {COMP_TIERS.map((tier, i) => {
              const maxRate = Math.max(...COMP_TIERS.map((t) => t.rate));
              const barHeight = (tier.rate / maxRate) * 180;
              const isActive = tier.tier === activeTier.tier;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold" style={{ color: isActive ? ACCENT : 'var(--register-text-muted)' }}>
                    {(tier.rate * 100).toFixed(1)}%
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all relative"
                    style={{
                      height: barHeight,
                      backgroundColor: isActive ? ACCENT : `${tier.color}60`,
                      border: isActive ? `2px solid ${ACCENT}` : 'none',
                    }}
                  >
                    {isActive && (
                      <div
                        className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap"
                        style={{ backgroundColor: ACCENT }}
                      >
                        YOU
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-center" style={{ color: 'var(--register-text)' }}>
                    {tier.tier}
                  </span>
                  <span className="text-[10px] text-center" style={{ color: 'var(--register-text-muted)' }}>
                    {tier.maxRevenue === Infinity ? `$${(tier.minRevenue / 1000).toFixed(0)}K+` : `$${(tier.minRevenue / 1000).toFixed(0)}–${(tier.maxRevenue / 1000).toFixed(0)}K`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Threshold info */}
          {result.threshold && result.threshold.amountToNextTier !== null && (
            <div
              className="mt-5 rounded-lg p-4"
              style={{ background: 'rgba(245,158,11,0.08)', borderLeft: '3px solid #F59E0B' }}
            >
              <p className="text-sm font-medium" style={{ color: 'var(--register-text)' }}>
                <span className="font-bold" style={{ color: '#F59E0B' }}>
                  ${result.threshold.amountToNextTier.toLocaleString()}
                </span>{' '}
                more revenue to reach the next tier at{' '}
                <span className="font-bold">{((result.threshold.nextTierRate ?? 0) * 100).toFixed(1)}%</span>
              </p>
            </div>
          )}
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
