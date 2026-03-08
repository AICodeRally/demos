'use client';

import { useState, useMemo } from 'react';
import { PRODUCTS, ASSOCIATES, SELLING_DEPTS, ACHIEVER_TIERS, COLORS, calculateCommission, whatIf } from '@/data/crestline';
import type { SaleItem, Associate } from '@/data/crestline';

/* -- Department filter tabs ----------------------------- */

const DEPT_TABS = [
  { id: 'all', label: 'All' },
  { id: 'cosmetics', label: 'Cosmetics' },
  { id: 'designer', label: 'Designer' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'home', label: 'Home' },
];

const DEPT_COLORS: Record<string, string> = {
  cosmetics: '#d946ef',
  designer: '#7c3aed',
  shoes: '#2563eb',
  accessories: '#c9a84c',
  home: '#059669',
};

const TIER_COLORS: Record<string, string> = {
  none: '#64748b',
  silver: '#94a3b8',
  gold: '#c9a84c',
  platinum: '#a78bfa',
};

function formatCurrency(n: number): string {
  return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function RtwcWhatIf() {
  const [selectedRep, setSelectedRep] = useState<Associate>(ASSOCIATES[0]);
  const [basket, setBasket] = useState<SaleItem[]>([]);
  const [deptFilter, setDeptFilter] = useState('all');

  const filteredProducts = useMemo(
    () => deptFilter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.department === deptFilter),
    [deptFilter],
  );

  const commission = useMemo(() => calculateCommission(basket, selectedRep), [basket, selectedRep]);
  const impact = useMemo(() => whatIf(basket, selectedRep), [basket, selectedRep]);

  const basketTotal = basket.reduce((s, i) => s + i.price * i.quantity, 0);

  function addProduct(productId: string) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    setBasket((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1, department: product.department, tags: product.tags }];
    });
  }

  function updateQuantity(productId: string, delta: number) {
    setBasket((prev) => {
      return prev
        .map((i) => i.productId === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0);
    });
  }

  function removeItem(productId: string) {
    setBasket((prev) => prev.filter((i) => i.productId !== productId));
  }

  // Achiever tier progress
  const repDept = SELLING_DEPTS.find((d) => d.id === selectedRep.department);
  const attainmentPct = Math.round((selectedRep.ytdSales / selectedRep.ytdTarget) * 100);

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Real-Time What-If Calculator</h1>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: '#EDE9FE', color: '#7c3aed' }}
          >
            RTWC
          </span>
        </div>
        <p className="text-sm" style={{ color: '#475569' }}>
          Build a sale basket, select a rep, and see commission impact in real time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── LEFT PANEL: Product Catalog ── */}
        <div className="lg:col-span-3">
          <div className="rounded-xl bg-white border p-4" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>Product Catalog</p>

            {/* Department filter tabs */}
            <div className="flex flex-wrap gap-1 mb-3">
              {DEPT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDeptFilter(tab.id)}
                  className="rounded-md px-2 py-1 text-[10px] font-semibold transition-all"
                  style={{
                    backgroundColor: deptFilter === tab.id ? (DEPT_COLORS[tab.id] ?? COLORS.primary) : '#F1F5F9',
                    color: deptFilter === tab.id ? '#FFFFFF' : '#475569',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Product cards */}
            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 border"
                  style={{ borderColor: '#F1F5F9', backgroundColor: '#FAFAFA' }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium truncate" style={{ color: '#0F172A' }}>{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="rounded-full px-1.5 py-px text-[8px] font-bold uppercase"
                        style={{ backgroundColor: `${DEPT_COLORS[p.department] ?? '#94A3B8'}15`, color: DEPT_COLORS[p.department] ?? '#94A3B8' }}
                      >
                        {p.department}
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: '#475569' }}>${p.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addProduct(p.id)}
                    className="shrink-0 ml-2 rounded-md px-2 py-1 text-[10px] font-bold transition-all hover:opacity-80"
                    style={{ backgroundColor: COLORS.accent, color: '#FFFFFF' }}
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTER PANEL: Commission Preview (hero) ── */}
        <div className="lg:col-span-5">
          <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E2E8F0' }}>
            {/* Rep selector */}
            <div className="mb-4">
              <label className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Select Associate</label>
              <select
                value={selectedRep.id}
                onChange={(e) => {
                  const rep = ASSOCIATES.find((a) => a.id === e.target.value);
                  if (rep) setSelectedRep(rep);
                }}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-medium"
                style={{ borderColor: '#E2E8F0', color: '#0F172A', backgroundColor: '#F8FAFC' }}
              >
                {ASSOCIATES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} &mdash; {a.storeId} ({a.department}, {a.achieverTier})
                  </option>
                ))}
              </select>
            </div>

            {/* Rep info bar */}
            <div className="flex items-center gap-3 mb-4 rounded-lg px-4 py-2.5" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Department</span>
                <p className="text-[12px] font-bold" style={{ color: DEPT_COLORS[selectedRep.department] ?? '#475569' }}>
                  {repDept?.name ?? selectedRep.department}
                </p>
              </div>
              <div className="h-6 w-px" style={{ backgroundColor: '#E2E8F0' }} />
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Tier</span>
                <p className="text-[12px] font-bold" style={{ color: TIER_COLORS[selectedRep.achieverTier] ?? '#64748b' }}>
                  {selectedRep.achieverTier === 'none' ? 'Not Qualified' : selectedRep.achieverTier.charAt(0).toUpperCase() + selectedRep.achieverTier.slice(1)}
                </p>
              </div>
              <div className="h-6 w-px" style={{ backgroundColor: '#E2E8F0' }} />
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>YTD Attainment</span>
                <p className="text-[12px] font-bold" style={{ color: attainmentPct >= 100 ? '#059669' : attainmentPct >= 80 ? '#c9a84c' : '#EF4444' }}>
                  {attainmentPct}%
                </p>
              </div>
              <div className="h-6 w-px" style={{ backgroundColor: '#E2E8F0' }} />
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Base Rate</span>
                <p className="text-[12px] font-bold font-mono" style={{ color: '#0F172A' }}>
                  {((repDept?.baseRate ?? 0) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Basket summary */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>Current Basket</p>
              {basket.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed px-4 py-6 text-center" style={{ borderColor: '#E2E8F0' }}>
                  <p className="text-[12px]" style={{ color: '#94A3B8' }}>Add products from the catalog to begin</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                  {basket.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium truncate" style={{ color: '#0F172A' }}>{item.name}</p>
                        <span className="text-[10px] font-mono" style={{ color: '#475569' }}>
                          ${item.price} x {item.quantity} = ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="w-6 h-6 rounded text-[12px] font-bold flex items-center justify-center"
                          style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-[11px] font-mono font-bold" style={{ color: '#0F172A' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="w-6 h-6 rounded text-[12px] font-bold flex items-center justify-center"
                          style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="ml-1 w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center"
                          style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {basket.length > 0 && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: '#F1F5F9' }}>
                  <span className="text-[11px] font-semibold" style={{ color: '#475569' }}>
                    {basket.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                  <span className="text-[14px] font-bold" style={{ color: '#0F172A' }}>
                    Subtotal: {formatCurrency(basketTotal)}
                  </span>
                </div>
              )}
            </div>

            {/* Commission breakdown */}
            <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.primary + '08', border: `1px solid ${COLORS.primary}20` }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: COLORS.primary }}>Commission Breakdown</p>
              {commission.components.length === 0 ? (
                <p className="text-[11px]" style={{ color: '#94A3B8' }}>Add items to see commission preview</p>
              ) : (
                <div className="space-y-2">
                  {commission.components.map((c) => (
                    <div key={c.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium" style={{ color: '#475569' }}>{c.label}</span>
                        {c.rate !== undefined && c.rate > 0 && (
                          <span className="text-[9px] font-mono rounded px-1 py-px" style={{ backgroundColor: '#F1F5F9', color: '#94A3B8' }}>
                            {(c.rate * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] font-bold font-mono" style={{ color: '#059669' }}>
                        {formatCurrency(c.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t flex items-center justify-between" style={{ borderColor: `${COLORS.primary}20` }}>
                    <span className="text-[12px] font-bold" style={{ color: COLORS.primary }}>Total Commission</span>
                    <span className="text-[18px] font-bold font-mono" style={{ color: '#059669' }}>
                      {formatCurrency(commission.total)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Threshold Meter */}
            {commission.nextTier && (
              <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                    Progress to {commission.nextTier.label}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: TIER_COLORS[commission.nextTier.label.toLowerCase()] ?? '#94A3B8' }}>
                    {commission.nextTier.threshold}% attainment needed
                  </span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(5, 100 - (commission.nextTier.remaining / (selectedRep.ytdTarget * 0.2)) * 100))}%`,
                      backgroundColor: TIER_COLORS[commission.nextTier.label.toLowerCase()] ?? COLORS.accent,
                    }}
                  />
                </div>
                <p className="text-[10px] mt-1 text-right font-mono" style={{ color: '#475569' }}>
                  ${commission.nextTier.remaining.toLocaleString()} remaining to {commission.nextTier.label}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL: What-If Impact ── */}
        <div className="lg:col-span-4">
          <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>What-If Impact</p>

            {basket.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed px-4 py-8 text-center" style={{ borderColor: '#E2E8F0' }}>
                <p className="text-[12px]" style={{ color: '#94A3B8' }}>Build a basket to see projected impact</p>
              </div>
            ) : (
              <>
                {/* Tier crossed alert */}
                {impact.tierCrossed && impact.newTier && (
                  <div
                    className="rounded-lg px-4 py-3 mb-4 text-center"
                    style={{ backgroundColor: '#D1FAE5', border: '1px solid #059669' }}
                  >
                    <p className="text-[13px] font-bold" style={{ color: '#059669' }}>
                      New Tier Reached: {impact.newTier.charAt(0).toUpperCase() + impact.newTier.slice(1)}!
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#047857' }}>
                      This sale would push {selectedRep.name} into the next Achiever tier
                    </p>
                  </div>
                )}

                {/* Big delta card */}
                <div
                  className="rounded-lg p-5 mb-4 text-center"
                  style={{ backgroundColor: impact.delta > 0 ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${impact.delta > 0 ? '#BBF7D0' : '#FECACA'}` }}
                >
                  <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>
                    Commission Impact
                  </span>
                  <p
                    className="text-3xl font-bold font-mono mt-1"
                    style={{ color: impact.delta > 0 ? '#059669' : '#EF4444' }}
                  >
                    {impact.delta >= 0 ? '+' : ''}{formatCurrency(impact.delta)}
                  </p>
                  {impact.deltaPercent !== 0 && (
                    <p className="text-[11px] font-mono mt-1" style={{ color: '#475569' }}>
                      ({impact.deltaPercent >= 0 ? '+' : ''}{(impact.deltaPercent * 100).toFixed(1)}%)
                    </p>
                  )}
                </div>

                {/* Baseline vs Projected */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Baseline (MTD)</span>
                    <p className="text-[16px] font-bold font-mono mt-1" style={{ color: '#475569' }}>
                      {formatCurrency(impact.baseline)}
                    </p>
                  </div>
                  <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                    <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Projected</span>
                    <p className="text-[16px] font-bold font-mono mt-1" style={{ color: '#059669' }}>
                      {formatCurrency(impact.projected)}
                    </p>
                  </div>
                </div>

                {/* Component-by-component delta */}
                <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>
                    Component Deltas
                  </p>
                  <div className="space-y-2">
                    {impact.componentDeltas.map((cd) => (
                      <div key={cd.id} className="flex items-center justify-between">
                        <span className="text-[11px] font-medium" style={{ color: '#475569' }}>{cd.label}</span>
                        <span
                          className="text-[12px] font-bold font-mono"
                          style={{ color: cd.delta > 0 ? '#059669' : cd.delta < 0 ? '#EF4444' : '#94A3B8' }}
                        >
                          {cd.delta >= 0 ? '+' : ''}{formatCurrency(cd.delta)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sale summary */}
                <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: `${COLORS.accent}10`, border: `1px solid ${COLORS.accent}30` }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: COLORS.accent }}>
                    Sale Summary
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]" style={{ color: '#475569' }}>Basket Value</span>
                    <span className="text-[12px] font-bold font-mono" style={{ color: '#0F172A' }}>{formatCurrency(basketTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px]" style={{ color: '#475569' }}>Effective Commission Rate</span>
                    <span className="text-[12px] font-bold font-mono" style={{ color: '#059669' }}>
                      {basketTotal > 0 ? ((commission.total / basketTotal) * 100).toFixed(2) : '0.00'}%
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
