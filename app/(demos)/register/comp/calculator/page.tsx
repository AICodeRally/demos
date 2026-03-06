'use client';

import { useState } from 'react';
import { FormatSelector, StatCard, BarChart } from '@/components/demos/register';
import { COMP_PLANS, type FormatId } from '@/data/register/store-data';

/* ── Product catalog ─────────────────────────────────────── */

const CATALOG = [
  { id: 'king-tp', name: 'King Tempur-Pedic ProAdapt', category: 'Mattress', price: 3299 },
  { id: 'queen-beauty', name: 'Queen Beautyrest Harmony', category: 'Mattress', price: 1499 },
  { id: 'queen-sealy', name: 'Queen Sealy Posturepedic', category: 'Mattress', price: 999 },
  { id: 'twin-serta', name: 'Twin Serta Perfect Sleeper', category: 'Mattress', price: 599 },
  { id: 'adj-king', name: 'King Adjustable Base', category: 'Base', price: 1299 },
  { id: 'adj-queen', name: 'Queen Adjustable Base', category: 'Base', price: 899 },
  { id: 'pillow-tp', name: 'Tempur-Pedic Pillow (2-pack)', category: 'Bedding', price: 199 },
  { id: 'protector', name: 'Mattress Protector', category: 'Bedding', price: 129 },
  { id: 'sheets', name: 'Premium Sheet Set', category: 'Bedding', price: 149 },
  { id: 'tracker', name: 'Sleep Tracker Pro', category: 'Sleep Tech', price: 249 },
];

/* ── Commission tiers by format ──────────────────────────── */

const TIERS: Record<string, { threshold: number; rate: number; label: string }[]> = {
  flagship: [
    { threshold: 0, rate: 0.03, label: '3% (Tier 1)' },
    { threshold: 50000, rate: 0.04, label: '4% (Tier 2)' },
    { threshold: 100000, rate: 0.05, label: '5% (Tier 3)' },
    { threshold: 150000, rate: 0.06, label: '6% (Tier 4)' },
  ],
  standard: [
    { threshold: 0, rate: 0.025, label: '2.5% (Tier 1)' },
    { threshold: 40000, rate: 0.035, label: '3.5% (Tier 2)' },
    { threshold: 80000, rate: 0.045, label: '4.5% (Tier 3)' },
    { threshold: 120000, rate: 0.05, label: '5% (Tier 4)' },
  ],
  outlet: [
    { threshold: 0, rate: 0.015, label: '1.5% (Flat)' },
  ],
  'shop-in-shop': [],
};

/* ── Recent transactions (preset) ────────────────────────── */

const RECENT_SALES = [
  { time: '2:15 PM', items: 'Queen Beautyrest + Protector', total: 1628, commission: 48.84 },
  { time: '1:40 PM', items: 'King Tempur-Pedic ProAdapt', total: 3299, commission: 98.97 },
  { time: '12:20 PM', items: 'Twin Serta + Sheets', total: 748, commission: 22.44 },
  { time: '11:05 AM', items: 'Queen Adjustable Base', total: 899, commission: 26.97 },
  { time: '10:30 AM', items: 'King Adjustable + Tracker', total: 1548, commission: 46.44 },
];

/* ── Active SPIFFs ───────────────────────────────────────── */

const SPIFFS = [
  { title: 'Purple SPIFF', desc: '+$50 on any Purple-brand mattress in your cart', color: '#8B5CF6', bg: '#F5F3FF' },
  { title: 'Base Bonus', desc: '+$75 if adjustable base added to mattress sale', color: '#06B6D4', bg: '#ECFEFF' },
  { title: 'Bedding Bundle', desc: '+$25 when 3+ bedding accessories in one transaction', color: '#10B981', bg: '#F0FDF4' },
];

function getCurrentTier(format: string, ytdSales: number) {
  const tiers = TIERS[format] || [];
  let currentTier = tiers[0];
  for (const tier of tiers) {
    if (ytdSales >= tier.threshold) currentTier = tier;
  }
  return currentTier;
}

function getNextTier(format: string, ytdSales: number) {
  const tiers = TIERS[format] || [];
  for (const tier of tiers) {
    if (ytdSales < tier.threshold) return tier;
  }
  return null;
}

const CATEGORY_ICONS: Record<string, string> = {
  Mattress: 'M',
  Base: 'B',
  Bedding: 'Bd',
  'Sleep Tech': 'T',
};

const CATEGORY_COLORS: Record<string, string> = {
  Mattress: '#1E3A5F',
  Base: '#06B6D4',
  Bedding: '#10B981',
  'Sleep Tech': '#8B5CF6',
};

export default function Calculator() {
  const [format, setFormat] = useState<string>('flagship');
  const [cart, setCart] = useState<string[]>([]);

  const fmt = format as FormatId;
  const presetYTDSales = 78400;
  const presetDailyCommission = 847;

  // Cart calculations
  const cartItems = cart.map((id) => CATALOG.find((c) => c.id === id)!).filter(Boolean);
  const saleTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Commission calculation
  const currentTier = getCurrentTier(format, presetYTDSales);
  const nextTier = getNextTier(format, presetYTDSales);
  const tiers = TIERS[format] || [];
  const isSPIFFOnly = tiers.length === 0;

  let commissionOnSale = 0;
  if (isSPIFFOnly) {
    const mattressCount = cartItems.filter((i) => i.category === 'Mattress').length;
    commissionOnSale = mattressCount * 25;
  } else if (currentTier) {
    commissionOnSale = saleTotal * currentTier.rate;
  }

  const hasMattress = cartItems.some((i) => i.category === 'Mattress');
  const hasBase = cartItems.some((i) => i.category === 'Base');
  const beddingCount = cartItems.filter((i) => i.category === 'Bedding').length;
  const baseBonusDelta = hasMattress && !hasBase ? 75 : 0;

  const addToCart = (id: string) => setCart((prev) => [...prev, id]);
  const clearCart = () => setCart([]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Real-Time Calculator</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Build a sale and see commission calculated instantly based on current tier and format
        </p>
      </div>

      <FormatSelector selected={format} onSelect={(id) => { setFormat(id); clearCart(); }} />

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Left Panel — Sale Builder */}
        <div>
          <div className="rounded-xl bg-white border p-5 mb-4" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Product Catalog</p>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono" style={{ color: '#475569' }}>
                  {cart.length} item{cart.length !== 1 ? 's' : ''} &middot; ${saleTotal.toLocaleString()}
                </span>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {CATALOG.map((item) => {
                const inCart = cart.filter((id) => id === item.id).length;
                const catColor = CATEGORY_COLORS[item.category] || '#475569';
                return (
                  <button
                    key={item.id}
                    onClick={() => addToCart(item.id)}
                    className="text-left rounded-lg border p-3 transition-all hover:shadow-sm"
                    style={{
                      borderColor: inCart > 0 ? '#10B981' : '#E2E8F0',
                      backgroundColor: inCart > 0 ? '#F0FDF4' : '#FFFFFF',
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="flex items-center justify-center w-6 h-6 rounded text-[9px] font-bold text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: catColor }}
                      >
                        {CATEGORY_ICONS[item.category]}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium leading-tight truncate" style={{ color: '#0F172A' }}>
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[12px] font-bold font-mono" style={{ color: catColor }}>
                            ${item.price.toLocaleString()}
                          </span>
                          {inCart > 0 && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                            >
                              x{inCart}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active SPIFF Callouts */}
          <div className="space-y-2">
            {SPIFFS.map((spiff, i) => (
              <div
                key={i}
                className="rounded-lg border p-3 flex items-start gap-2"
                style={{ backgroundColor: spiff.bg, borderColor: `${spiff.color}30` }}
              >
                <span
                  className="shrink-0 w-2 h-2 rounded-full mt-1.5"
                  style={{ backgroundColor: spiff.color }}
                />
                <div>
                  <p className="text-[11px] font-bold" style={{ color: spiff.color }}>{spiff.title}</p>
                  <p className="text-[10px]" style={{ color: '#475569' }}>{spiff.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — Commission Preview */}
        <div>
          {/* Commission Preview Card */}
          <div className="rounded-xl bg-white border p-5 mb-4" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Commission Preview</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: '#94A3B8' }}>Sale Total</span>
                <span className="text-[16px] font-bold font-mono" style={{ color: '#0F172A' }}>
                  ${saleTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: '#94A3B8' }}>Commission Rate</span>
                <span className="text-[13px] font-semibold" style={{ color: '#10B981' }}>
                  {isSPIFFOnly ? '$25/mattress' : currentTier ? `${(currentTier.rate * 100).toFixed(1)}%` : '—'}
                </span>
              </div>
              <div className="h-px" style={{ backgroundColor: '#F1F5F9' }} />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold" style={{ color: '#475569' }}>Commission on This Sale</span>
                <span className="text-[18px] font-bold font-mono" style={{ color: '#10B981' }}>
                  ${commissionOnSale.toFixed(2)}
                </span>
              </div>
              <div className="h-px" style={{ backgroundColor: '#F1F5F9' }} />
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: '#94A3B8' }}>Daily Running Total</span>
                <span className="text-[13px] font-mono" style={{ color: '#475569' }}>
                  ${(presetDailyCommission + commissionOnSale).toFixed(2)}
                  <span className="text-[10px] ml-1" style={{ color: '#94A3B8' }}>
                    (${presetDailyCommission} + ${commissionOnSale.toFixed(2)})
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="rounded-xl bg-white border p-5 mb-4" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>Tier Progress</p>
            {tiers.length > 0 ? (
              <div className="space-y-3">
                {tiers.map((tier, i) => {
                  const isCurrentTier = currentTier && tier.threshold === currentTier.threshold && (!tiers[i + 1] || presetYTDSales < tiers[i + 1].threshold);
                  const isUnlocked = presetYTDSales >= tier.threshold;
                  const nextThreshold = tiers[i + 1]?.threshold;
                  const progress = nextThreshold
                    ? Math.min(((presetYTDSales - tier.threshold) / (nextThreshold - tier.threshold)) * 100, 100)
                    : 100;

                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-medium" style={{ color: isCurrentTier ? '#10B981' : '#475569' }}>
                          {tier.label}
                          {isCurrentTier && <span className="ml-1 text-[9px] font-bold">(CURRENT)</span>}
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: '#94A3B8' }}>
                          ${tier.threshold.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${isUnlocked ? (isCurrentTier ? progress : 100) : 0}%`,
                            backgroundColor: isCurrentTier ? '#10B981' : isUnlocked ? '#059669' : '#E2E8F0',
                          }}
                        />
                      </div>
                      {isCurrentTier && nextTier && (
                        <p className="text-[10px] mt-1" style={{ color: '#F59E0B' }}>
                          Just ${(nextTier.threshold - presetYTDSales).toLocaleString()} more to unlock {(nextTier.rate * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-center py-4" style={{ color: '#94A3B8' }}>
                SPIFF-only model &mdash; no tiered progression
              </p>
            )}
          </div>

          {/* What-If Card */}
          {hasMattress && !hasBase && (
            <div
              className="rounded-xl border p-4 mb-4"
              style={{ backgroundColor: '#ECFEFF', borderColor: '#06B6D430' }}
            >
              <p className="text-[12px] font-bold mb-1" style={{ color: '#06B6D4' }}>
                What if you add an adjustable base?
              </p>
              <p className="text-[11px]" style={{ color: '#475569' }}>
                Adding a Queen Adjustable Base ($899) would earn an additional{' '}
                <span className="font-bold" style={{ color: '#10B981' }}>
                  ${(isSPIFFOnly ? 0 : (899 * (currentTier?.rate || 0))).toFixed(2)}
                </span>{' '}
                in commission + <span className="font-bold" style={{ color: '#06B6D4' }}>$75</span> Base Bonus SPIFF
              </p>
            </div>
          )}

          {/* Transaction History */}
          <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>Recent Sales</p>
            <div className="space-y-2">
              {RECENT_SALES.map((sale, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b"
                  style={{ borderColor: '#F1F5F9' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono w-14 shrink-0" style={{ color: '#94A3B8' }}>
                      {sale.time}
                    </span>
                    <span className="text-[11px] truncate" style={{ color: '#475569', maxWidth: 200 }}>
                      {sale.items}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-mono" style={{ color: '#0F172A' }}>
                      ${sale.total.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold font-mono" style={{ color: '#10B981' }}>
                      +${sale.commission.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
