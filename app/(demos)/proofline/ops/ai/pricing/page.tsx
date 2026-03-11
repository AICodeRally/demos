'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import { BRAND_FAMILIES, SUPPLIER_COLORS, type SupplierGroup } from '@/data/proofline';
import { pct } from '@/lib/utils';

/* ── Price Elasticity Data ──────────────────── */
const PRICE_TIERS = [
  { brand: 'Coors Light', supplier: 'molson-coors' as SupplierGroup, currentPrice: 21.49, optimalPrice: 22.29, elasticity: -1.8, margin: 0.242, optMargin: 0.268, lift: '+$0.80/cs', risk: 'low' },
  { brand: 'Miller Lite', supplier: 'molson-coors' as SupplierGroup, currentPrice: 21.49, optimalPrice: 21.99, elasticity: -2.1, margin: 0.238, optMargin: 0.254, lift: '+$0.50/cs', risk: 'low' },
  { brand: 'Corona Extra', supplier: 'constellation' as SupplierGroup, currentPrice: 28.99, optimalPrice: 29.49, elasticity: -1.2, margin: 0.312, optMargin: 0.328, lift: '+$0.50/cs', risk: 'low' },
  { brand: 'Modelo Especial', supplier: 'constellation' as SupplierGroup, currentPrice: 27.49, optimalPrice: 28.99, elasticity: -0.9, margin: 0.298, optMargin: 0.332, lift: '+$1.50/cs', risk: 'medium' },
  { brand: 'Blue Moon', supplier: 'molson-coors' as SupplierGroup, currentPrice: 17.99, optimalPrice: 18.49, elasticity: -1.5, margin: 0.262, optMargin: 0.278, lift: '+$0.50/cs', risk: 'low' },
  { brand: 'Shiner Bock', supplier: 'craft' as SupplierGroup, currentPrice: 16.99, optimalPrice: 17.99, elasticity: -1.3, margin: 0.248, optMargin: 0.282, lift: '+$1.00/cs', risk: 'low' },
  { brand: 'Sazerac Buffalo Trace', supplier: 'sazerac' as SupplierGroup, currentPrice: 42.99, optimalPrice: 44.99, elasticity: -0.6, margin: 0.385, optMargin: 0.412, lift: '+$2.00/cs', risk: 'low' },
  { brand: 'White Claw', supplier: 'fmb-rtd' as SupplierGroup, currentPrice: 18.99, optimalPrice: 18.49, elasticity: -3.2, margin: 0.218, optMargin: 0.205, lift: '-$0.50/cs', risk: 'high' },
];

const CHANNEL_PRICING = [
  { channel: 'Off-Premise Grocery', avgPrice: 24.80, margin: 0.248, volume: 42, trend: 'stable' as const },
  { channel: 'Off-Premise Convenience', avgPrice: 26.20, margin: 0.272, volume: 28, trend: 'up' as const },
  { channel: 'On-Premise Bar/Restaurant', avgPrice: 32.40, margin: 0.342, volume: 18, trend: 'up' as const },
  { channel: 'On-Premise Venue/Stadium', avgPrice: 38.60, margin: 0.408, volume: 8, trend: 'stable' as const },
  { channel: 'Package Store', avgPrice: 22.90, margin: 0.232, volume: 4, trend: 'down' as const },
];

const PROMO_IMPACT = [
  { promo: '$2 Off 12pk (Coors Light)', weeks: 'W7–W8', volumeLift: 0.24, marginImpact: -0.08, netRevenue: '+$18K', roi: 2.4 },
  { promo: 'BOGO 6pk (Blue Moon)', weeks: 'W5–W6', volumeLift: 0.38, marginImpact: -0.15, netRevenue: '+$8K', roi: 1.6 },
  { promo: 'Display Allowance (Corona)', weeks: 'W8–W10', volumeLift: 0.18, marginImpact: -0.04, netRevenue: '+$32K', roi: 3.8 },
  { promo: 'Tap Takeover (Shiner)', weeks: 'W9–W10', volumeLift: 0.42, marginImpact: -0.02, netRevenue: '+$6K', roi: 4.1 },
];

/* ── Elasticity Curve SVG ─────────────────── */
function ElasticityCurve({ elasticity, color }: { elasticity: number; color: string }) {
  const w = 120, h = 40;
  const absE = Math.abs(elasticity);
  const points = Array.from({ length: 20 }, (_, i) => {
    const x = (i / 19) * w;
    const pctChange = (i - 10) / 10;
    const qChange = pctChange * absE;
    const y = h / 2 - (qChange / 4) * h;
    return `${i === 0 ? 'M' : 'L'}${x},${Math.max(2, Math.min(h - 2, y))}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }}>
      <line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke="var(--pl-border)" strokeWidth="1" />
      <line x1={w / 2} y1={0} x2={w / 2} y2={h} stroke="var(--pl-border)" strokeWidth="1" />
      <path d={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export default function PricingPage() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const avgMargin = BRAND_FAMILIES.reduce((s, b) => s + b.revQ * b.gp, 0) / BRAND_FAMILIES.reduce((s, b) => s + b.revQ, 0);
  const optUplift = PRICE_TIERS.reduce((s, p) => s + (p.optMargin - p.margin), 0) / PRICE_TIERS.length;
  const lowRiskOpps = PRICE_TIERS.filter(p => p.risk === 'low' && p.optimalPrice > p.currentPrice).length;

  return (
    <>
      <ActNavigation currentAct={3} />

      {/* Breadcrumb */}
      <div className="mt-4 flex items-center gap-2 text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        <Link href="/proofline/ops/ai" style={{ color: '#2563EB' }}>AI Intelligence Hub</Link>
        <span>/</span>
        <span>Price Optimization</span>
      </div>

      {/* Header */}
      <div className="mt-4 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
          Revenue Maximization &middot; AI-Driven Pricing
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          Price Optimization Engine
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {PRICE_TIERS.length} brands analyzed &middot; {lowRiskOpps} low-risk price opportunities &middot; Elasticity models updated weekly
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Blended Margin" value={pct(avgMargin)} accent="#22C55E" sub="Current portfolio" stagger={0} />
        <LightKpiCard label="Optimization Uplift" value={`+${(optUplift * 100).toFixed(1)}pp`} accent="#2563EB" sub="If all implemented" stagger={1} />
        <LightKpiCard label="Low-Risk Opps" value={String(lowRiskOpps)} accent="#22C55E" sub="Safe to implement" stagger={2} />
        <LightKpiCard label="Avg $/Case" value={`$${(PRICE_TIERS.reduce((s, p) => s + p.currentPrice, 0) / PRICE_TIERS.length).toFixed(2)}`} accent="#C6A052" sub="Across portfolio" stagger={3} />
        <LightKpiCard label="Best ROI Promo" value="4.1x" accent="#8B5CF6" sub="Shiner Tap Takeover" stagger={4} />
      </div>

      {/* Price Elasticity Table */}
      <LightSectionCard title="BRAND PRICE ELASTICITY & OPTIMIZATION" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                {['Brand', 'Current $/cs', 'Optimal $/cs', 'Elasticity', 'Curve', 'Current Margin', 'Optimal Margin', 'Lift', 'Risk'].map(h => (
                  <th key={h} className="text-left pb-2 pr-3 text-xs uppercase tracking-wider font-bold"
                    style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRICE_TIERS.map((p) => {
                const color = SUPPLIER_COLORS[p.supplier] ?? '#666';
                const riskColor = p.risk === 'low' ? '#22C55E' : p.risk === 'medium' ? '#F59E0B' : '#F87171';
                return (
                  <tr key={p.brand} style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    <td className="py-2 pr-3 font-bold" style={{ color }}>{p.brand}</td>
                    <td className="py-2 pr-3" style={{ color: 'var(--pl-text)' }}>${p.currentPrice.toFixed(2)}</td>
                    <td className="py-2 pr-3 font-bold" style={{ color: p.optimalPrice > p.currentPrice ? '#22C55E' : '#F87171' }}>
                      ${p.optimalPrice.toFixed(2)}
                    </td>
                    <td className="py-2 pr-3" style={{ color: Math.abs(p.elasticity) > 2 ? '#F87171' : '#22C55E' }}>
                      {p.elasticity.toFixed(1)}
                    </td>
                    <td className="py-2 pr-3">
                      <ElasticityCurve elasticity={p.elasticity} color={color} />
                    </td>
                    <td className="py-2 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{pct(p.margin)}</td>
                    <td className="py-2 pr-3 font-bold" style={{ color: '#22C55E' }}>{pct(p.optMargin)}</td>
                    <td className="py-2 pr-3 font-bold" style={{ color: p.optimalPrice > p.currentPrice ? '#22C55E' : '#F87171' }}>{p.lift}</td>
                    <td className="py-2 pr-3">
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: `${riskColor}15`, color: riskColor }}>
                        {p.risk.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
          Elasticity = % volume change per 1% price increase. Values closer to 0 = less price sensitive (safe to raise). White Claw at -3.2 = highly elastic, recommend price decrease to defend share.
        </div>
      </LightSectionCard>

      {/* Channel Pricing */}
      <LightSectionCard title="CHANNEL PRICING ANALYSIS" className="mb-6">
        <div className="grid grid-cols-5 gap-3">
          {CHANNEL_PRICING.map((ch) => {
            const isSelected = selectedChannel === ch.channel;
            const trendColor = ch.trend === 'up' ? '#22C55E' : ch.trend === 'down' ? '#F87171' : 'var(--pl-text-muted)';
            const trendIcon = ch.trend === 'up' ? '\u2191' : ch.trend === 'down' ? '\u2193' : '\u2192';
            return (
              <button
                key={ch.channel}
                onClick={() => setSelectedChannel(isSelected ? null : ch.channel)}
                className="p-3 rounded-lg text-left transition-all"
                style={{
                  background: isSelected ? 'rgba(37,99,235,0.08)' : 'var(--pl-card-alt)',
                  border: `1px solid ${isSelected ? 'rgba(37,99,235,0.3)' : 'var(--pl-border)'}`,
                }}
              >
                <div className="text-xs font-mono mb-2" style={{ color: 'var(--pl-text-muted)' }}>{ch.channel}</div>
                <div className="text-lg font-bold font-mono" style={{ color: 'var(--pl-text)' }}>${ch.avgPrice.toFixed(2)}</div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>avg $/case</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold font-mono" style={{ color: '#C6A052' }}>{pct(ch.margin)}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>margin</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-bold" style={{ color: trendColor }}>{trendIcon}</span>
                  <span className="text-xs font-mono" style={{ color: trendColor }}>{ch.trend}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>&middot; {ch.volume}% vol</span>
                </div>
              </button>
            );
          })}
        </div>
      </LightSectionCard>

      {/* Promotion ROI */}
      <LightSectionCard title="PROMOTION ROI ANALYSIS" className="mb-6">
        <div className="space-y-3">
          {PROMO_IMPACT.map((promo) => {
            const roiColor = promo.roi >= 3 ? '#22C55E' : promo.roi >= 2 ? '#F59E0B' : '#F87171';
            return (
              <div key={promo.promo} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                <div className="flex-1">
                  <div className="text-[13px] font-bold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>{promo.promo}</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>{promo.weeks}</div>
                </div>
                <div className="flex items-center gap-6 text-xs font-mono">
                  <div className="text-center">
                    <div className="font-bold" style={{ color: '#22C55E' }}>+{(promo.volumeLift * 100).toFixed(0)}%</div>
                    <div style={{ color: 'var(--pl-text-faint)' }}>Volume</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold" style={{ color: '#F87171' }}>{(promo.marginImpact * 100).toFixed(0)}%</div>
                    <div style={{ color: 'var(--pl-text-faint)' }}>Margin</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold" style={{ color: '#2563EB' }}>{promo.netRevenue}</div>
                    <div style={{ color: 'var(--pl-text-faint)' }}>Net Rev</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: roiColor }}>{promo.roi}x</div>
                    <div style={{ color: 'var(--pl-text-faint)' }}>ROI</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
          ROI calculated as incremental revenue / promotion cost. Tap takeovers and display allowances consistently outperform price-cut promotions due to lower margin erosion.
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        Elasticity models trained on 52-week POS scan data (IRI/Nielsen) + internal shipment history. Channel pricing from eoStar invoice data.
        Promotion ROI from A/B control periods with matched store panels. Updated weekly.
      </div>
    </>
  );
}
