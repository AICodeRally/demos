'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  Moon,
  Wifi,
  Database,
  RotateCcw,
  FileDown,
  Sparkles,
} from 'lucide-react';
import type { ClosedSale } from '@/lib/swic/data/d365-schemas';
import {
  STORE_CONTEXT,
  CATALOG_ITEMS,
  REPS,
  SAMPLE_PERIODS,
  SUMMIT_SLEEP_CONFIG,
} from '@/lib/swic/data/summit-sleep';
import { onBroadcast, broadcastShiftReset } from '@/lib/swic/util/broadcast';
import { generateTransactionEvent } from '@/lib/swic/adapters/d365';
import { calculate } from '@/lib/swic/engine/calculator';
import type { SaleItem } from '@/lib/swic/engine/types';
import { ManagerFeed } from '@/components/swic/summit-sleep/ManagerFeed';
import { Leaderboard } from '@/components/swic/summit-sleep/Leaderboard';
import { TeamMetrics } from '@/components/swic/summit-sleep/TeamMetrics';
import { ShiftSummary } from '@/components/swic/summit-sleep/ShiftSummary';
import { TierDistribution } from '@/components/swic/summit-sleep/TierDistribution';
import { CommissionBudget } from '@/components/swic/summit-sleep/CommissionBudget';

/* ══════════════════════════════════════════════════════════
   Manager Dashboard — /summit-sleep/manager
   ══════════════════════════════════════════════════════════ */

export default function ManagerDashboardPage() {
  const [sales, setSales] = useState<ClosedSale[]>([]);
  const [isDark, setIsDark] = useState(true);

  // ── Dark mode ────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [isDark]);

  // ── Document title ───────────────────────────────────────
  useEffect(() => {
    document.title = 'Summit Sleep Co. Manager Dashboard \u2014 SWIC';
  }, []);

  // ── BroadcastChannel listener ────────────────────────────
  useEffect(() => {
    const unsub = onBroadcast((msg) => {
      if (msg.type === 'sale:closed') {
        setSales((prev) => [msg.data, ...prev]);
      } else if (msg.type === 'shift:reset') {
        setSales([]);
      }
    });
    return unsub;
  }, []);

  // ── Seed Demo Data ───────────────────────────────────────
  const handleSeedData = useCallback(() => {
    const count = 5 + Math.floor(Math.random() * 4); // 5-8 sales
    const now = Date.now();
    const seeded: ClosedSale[] = [];

    for (let i = 0; i < count; i++) {
      // Pick a random rep
      const rep = REPS[Math.floor(Math.random() * REPS.length)];
      const period = SAMPLE_PERIODS[rep.id];

      // Pick 1-4 random items from the catalog
      const itemCount = 1 + Math.floor(Math.random() * 4);
      const shuffled = [...CATALOG_ITEMS].sort(() => Math.random() - 0.5);
      const items: SaleItem[] = shuffled.slice(0, itemCount).map((item) => ({
        ...item,
        quantity: 1,
      }));

      // Generate the D365 event with a staggered timestamp (10-30 min apart)
      const offsetMs = i * (10 + Math.floor(Math.random() * 21)) * 60 * 1000;
      const saleTime = new Date(now - offsetMs);

      const event = generateTransactionEvent(items, rep, STORE_CONTEXT);

      // Override the event timestamps to simulate spread across the shift
      event.EventTime = saleTime.toISOString();
      event.beginDateTime = new Date(saleTime.getTime() - 180000).toISOString();
      const dateStr = saleTime.toISOString().split('T')[0];
      const timeStr = saleTime.toTimeString().split(' ')[0];
      event.transDate = dateStr;
      event.transTime = timeStr;
      event.businessDate = dateStr;
      event.timeWhenTransClosed = timeStr;

      // Calculate commission
      const result = calculate(SUMMIT_SLEEP_CONFIG, items, period);

      seeded.push({
        event,
        commission: {
          total: result.totalCommission,
          components: result.components.map((c) => ({
            id: c.componentId,
            label: c.label,
            amount: c.amount,
          })),
        },
        rep: { id: rep.id, name: rep.name, storeId: rep.storeId },
        timestamp: saleTime.toISOString(),
      });
    }

    // Sort by timestamp descending (most recent first)
    seeded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setSales((prev) => [...seeded, ...prev]);
  }, []);

  // ── Export Audit Log ─────────────────────────────────────
  const handleExport = useCallback(() => {
    if (sales.length === 0) return;
    const data = JSON.stringify(sales, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manager-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sales]);

  // ── Reset ────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setSales([]);
    broadcastShiftReset();
  }, []);

  // ── Accent color ─────────────────────────────────────────
  const accent = SUMMIT_SLEEP_CONFIG.theme?.accent ?? '#d42b2b';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // ── Render ───────────────────────────────────────────────
  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'mesh-bg-dark' : 'mesh-bg-light'}`}
    >
      {/* ═══════ TOP BAR ═══════════════════════════════════════ */}
      <div className="glass-nav sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Left — Brand + Store */}
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
                  <span style={{ color: accent }}>SummitSleep</span>{' '}
                  <span style={{ color: 'var(--page-muted)' }}>Manager</span>
                </span>
              </div>
            </div>

            <div className="w-px h-6" style={{ background: 'var(--glass-border)' }} />

            {/* Store / Date / Shift */}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="glass-pill px-2.5 py-0.5 rounded-full">
                <span style={{ color: 'var(--page-muted)' }}>Store: </span>
                <strong>{STORE_CONTEXT.storeName}</strong>
              </span>
              <span className="glass-pill px-2.5 py-0.5 rounded-full hidden md:inline-flex">
                {today}
              </span>
              <span className="glass-pill px-2.5 py-0.5 rounded-full hidden md:inline-flex">
                <span style={{ color: 'var(--page-muted)' }}>Shift: </span>
                <strong>AM ({STORE_CONTEXT.shiftStart})</strong>
              </span>
            </div>
          </div>

          {/* Right — Controls */}
          <div className="flex items-center gap-2">
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
                D365
              </span>
              <Database className="w-3 h-3" style={{ color: '#22c55e' }} />
              <span style={{ color: '#22c55e' }} className="font-semibold">
                Live
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ MAIN 2-COLUMN LAYOUT ══════════════════════════ */}
      <div className="flex-1 max-w-[1440px] mx-auto w-full p-4">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          style={{ minHeight: 'calc(100vh - 140px)' }}
        >
          {/* ── LEFT COLUMN (50%) — Live Sales Feed ──────────── */}
          <div className="flex flex-col min-h-0" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <ManagerFeed sales={sales} store={STORE_CONTEXT} />
          </div>

          {/* ── RIGHT COLUMN (50%) — Widgets ─────────────────── */}
          <div
            className="flex flex-col gap-4 min-h-0 overflow-y-auto no-scrollbar"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            <Leaderboard sales={sales} store={STORE_CONTEXT} />
            <TeamMetrics sales={sales} store={STORE_CONTEXT} />
            <ShiftSummary sales={sales} store={STORE_CONTEXT} />
            <CommissionBudget sales={sales} store={STORE_CONTEXT} />
            <TierDistribution sales={sales} store={STORE_CONTEXT} />
          </div>
        </div>
      </div>

      {/* ═══════ BOTTOM BAR ════════════════════════════════════ */}
      <div className="glass-nav sticky bottom-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Seed Demo Data */}
          <button
            onClick={handleSeedData}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Sparkles className="w-4 h-4" />
            Seed Demo Data
          </button>

          {/* Export Audit Log */}
          <button
            onClick={handleExport}
            disabled={sales.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--page-text)',
            }}
          >
            <FileDown className="w-4 h-4" />
            Export Audit Log
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: accent,
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
