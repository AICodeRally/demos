'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { calculate } from '@/lib/swic/engine/calculator';
import type { SaleItem, CalculationResult } from '@/lib/swic/engine/types';
import {
  TABLET_CONFIG,
  CATALOG_ITEMS,
  REPS,
  SAMPLE_PERIODS,
  STORE_CONTEXT,
} from '@/lib/swic/data/tablet';
import type { D365TransactionEvent } from '@/lib/swic/data/d365-schemas';
import { detectBundles, TABLET_BUNDLES } from '@/components/swic/tablet/BundleBuilder';
import { ShowroomCatalog } from '@/components/swic/tablet/ShowroomCatalog';
import { SaleTicket } from '@/components/swic/tablet/SaleTicket';
import { CommissionPreview } from '@/components/swic/CommissionPreview';
import { CloseSaleFlow } from '@/components/swic/tablet/CloseSaleFlow';
import { D365EventLog } from '@/components/swic/tablet/D365EventLog';
import { Sun, Moon, Users, Wifi, RotateCcw, PauseCircle, ShoppingCart } from 'lucide-react';

// ── Page ──────────────────────────────────────────────────────

export default function SummitSleepCoPOSPage() {
  // ── State ─────────────────────────────────────────────────
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedRepIdx, setSelectedRepIdx] = useState(0);
  const [closeSaleOpen, setCloseSaleOpen] = useState(false);
  const [completedEvents, setCompletedEvents] = useState<D365TransactionEvent[]>([]);
  const [isDark, setIsDark] = useState(true);

  // ── Derived ───────────────────────────────────────────────
  const rep = REPS[selectedRepIdx];
  const period = SAMPLE_PERIODS[rep.id];
  const result: CalculationResult | null = useMemo(
    () => (saleItems.length > 0 ? calculate(TABLET_CONFIG, saleItems, period) : null),
    [saleItems, period],
  );
  const bundles = useMemo(
    () => detectBundles(saleItems, TABLET_BUNDLES),
    [saleItems],
  );

  // ── Dark mode — toggle class on <html> ───────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [isDark]);

  // ── Document title ────────────────────────────────────────
  useEffect(() => {
    document.title = 'Summit Sleep Co. POS — SWIC';
  }, []);

  // ── Handlers ──────────────────────────────────────────────

  const handleAddItem = useCallback((item: SaleItem) => {
    setSaleItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setSaleItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setSaleItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
      );
    }
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setSaleItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleCloseSale = useCallback((event: D365TransactionEvent) => {
    setCompletedEvents((prev) => [event, ...prev]);
    setSaleItems([]);
    setCloseSaleOpen(false);
  }, []);

  const handleNewSale = useCallback(() => {
    setSaleItems([]);
  }, []);

  // ── Accent color ──────────────────────────────────────────
  const accent = TABLET_CONFIG.theme?.accent ?? '#d42b2b';

  // ── Render ────────────────────────────────────────────────
  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'mesh-bg-dark' : 'mesh-bg-light'}`}
    >
      {/* ═══════ TOP BAR ═══════════════════════════════════════ */}
      <div className="glass-nav sticky top-0 z-30">
        <div className="max-w-[1280px] mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Left — Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)' }}
              >
                <span className="text-white font-black text-[10px] tracking-tight">RC</span>
              </div>
              <div>
                <span className="text-sm font-black tracking-tight">
                  <span style={{ color: accent }}>SummitSleepCo</span>{' '}
                  <span style={{ color: 'var(--page-muted)' }}>POS</span>
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6" style={{ background: 'var(--glass-border)' }} />

            {/* Store Info */}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="glass-pill px-2.5 py-0.5 rounded-full">
                <span style={{ color: 'var(--page-muted)' }}>Store: </span>
                <strong>{STORE_CONTEXT.storeName.split(' ').slice(-1)[0]} #{STORE_CONTEXT.storeId}</strong>
              </span>
              <span className="glass-pill px-2.5 py-0.5 rounded-full hidden md:inline-flex">
                <span style={{ color: 'var(--page-muted)' }}>Terminal: </span>
                <strong>115</strong>
              </span>
              <span className="glass-pill px-2.5 py-0.5 rounded-full hidden md:inline-flex">
                <span style={{ color: 'var(--page-muted)' }}>Shift: </span>
                <strong>AM</strong>
              </span>
            </div>
          </div>

          {/* Right — Controls */}
          <div className="flex items-center gap-2">
            {/* Rep selector */}
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" style={{ color: 'var(--page-muted)' }} />
              <select
                value={selectedRepIdx}
                onChange={(e) => setSelectedRepIdx(Number(e.target.value))}
                className="glass-input rounded-lg px-2 py-1 text-xs cursor-pointer"
              >
                {REPS.map((r, i) => (
                  <option key={r.id} value={i}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark/Light toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="glass-pill p-1.5 rounded-lg transition-all hover:scale-105"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
              ) : (
                <Moon className="w-3.5 h-3.5" style={{ color: 'var(--page-muted)' }} />
              )}
            </button>

            {/* D365 Status */}
            <span
              className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1.5"
              style={{ borderColor: '#22c55e30' }}
            >
              <Wifi className="w-3 h-3" style={{ color: '#22c55e' }} />
              <span style={{ color: '#22c55e' }} className="font-semibold">
                D365 Connected
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ MAIN 2-PANE LAYOUT ═══════════════════════════ */}
      <div className="flex-1 max-w-[1280px] mx-auto w-full p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {/* ── LEFT PANE (40%) — Showroom Catalog ─────────── */}
          <div className="md:col-span-5 flex flex-col min-h-0" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="glass rounded-2xl p-4 flex flex-col flex-1 min-h-0 overflow-hidden">
              <ShowroomCatalog catalog={CATALOG_ITEMS} onAddItem={handleAddItem} />
            </div>
          </div>

          {/* ── RIGHT PANE (60%) — Ticket + Commission + Log  */}
          <div className="md:col-span-7 flex flex-col gap-4 min-h-0 overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {/* Sale Ticket */}
            <SaleTicket
              items={saleItems}
              taxRate={STORE_CONTEXT.taxRate}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              bundles={bundles}
            />

            {/* Commission Preview */}
            <CommissionPreview
              config={TABLET_CONFIG}
              result={result}
              repName={rep.name}
              glass
            />

            {/* D365 Event Log */}
            <D365EventLog events={completedEvents} />
          </div>
        </div>
      </div>

      {/* ═══════ BOTTOM BAR ════════════════════════════════════ */}
      <div className="glass-nav sticky bottom-0 z-30">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* New Sale */}
          <button
            onClick={handleNewSale}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--page-text)',
            }}
          >
            <RotateCcw className="w-4 h-4" />
            New Sale
          </button>

          {/* Hold (placeholder) */}
          <button
            disabled
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--page-muted)',
            }}
          >
            <PauseCircle className="w-4 h-4" />
            Hold
          </button>

          {/* Close Sale */}
          <button
            onClick={() => setCloseSaleOpen(true)}
            disabled={saleItems.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background:
                saleItems.length > 0
                  ? `linear-gradient(135deg, ${accent}, ${accent}cc)`
                  : 'var(--glass-bg)',
              border:
                saleItems.length > 0
                  ? 'none'
                  : '1px solid var(--glass-border)',
              color: saleItems.length > 0 ? '#ffffff' : 'var(--page-muted)',
              boxShadow:
                saleItems.length > 0 ? `0 4px 16px ${accent}40` : 'none',
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Close Sale
          </button>
        </div>
      </div>

      {/* ═══════ CLOSE SALE MODAL ══════════════════════════════ */}
      {closeSaleOpen && result && (
        <CloseSaleFlow
          items={saleItems}
          rep={{ ...rep, storeId: rep.storeId ?? STORE_CONTEXT.storeId }}
          store={STORE_CONTEXT}
          commission={result}
          onComplete={handleCloseSale}
          onCancel={() => setCloseSaleOpen(false)}
        />
      )}
    </div>
  );
}
