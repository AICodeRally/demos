'use client';

import { Suspense, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SaleItem, Rule, ClientConfig, PeriodContext } from '@/lib/swic/engine/types';
import { calculate } from '@/lib/swic/engine/calculator';
import { CLIENT_REGISTRY, CLIENT_LIST, type ClientBundle } from '@/lib/swic/data/registry';
import { CommissionPreview } from '@/components/swic/CommissionPreview';
import { CommissionHistory } from '@/components/swic/CommissionHistory';
import { POSView } from '@/components/swic/POSView';
import { SaleBuilder } from '@/components/swic/SaleBuilder';
import { RuleSimulator } from '@/components/swic/RuleSimulator';
import { ForecastStrip } from '@/components/swic/ForecastStrip';
import { WhatIfPanel } from '@/components/swic/WhatIfPanel';
import { PipelineSimulator } from '@/components/swic/PipelineSimulator';
import { Users, Users2, RotateCcw, Sun, Moon, Database, Loader2, Wifi, WifiOff, Printer, History } from 'lucide-react';
import { D365EventLog } from '@/components/swic/tablet/D365EventLog';
import { generateTransactionEvent } from '@/lib/swic/adapters/d365';
import { STORE_CONTEXT } from '@/lib/swic/data/tablet';
import type { D365TransactionEvent } from '@/lib/swic/data/d365-schemas';

type DataSource = 'mock' | 'd365' | 'poc1' | 'poc2';

const DATA_SOURCE_LABELS: Record<DataSource, { label: string; color: string }> = {
  mock: { label: 'Mock', color: '#22c55e' },
  d365: { label: 'D365 Mock', color: '#0078d4' },
  poc1: { label: 'POC1', color: '#3b82f6' },
  poc2: { label: 'POC2', color: '#8b5cf6' },
};

// Generic SaleItem catalog for Varicent (since Varicent doesn't have a product catalog)
const VARICENT_CATALOG: SaleItem[] = [
  { id: 'var-001', name: 'Enterprise License', category: 'License', tags: [], price: 120000, cost: 36000, quantity: 1 },
  { id: 'var-002', name: 'Pro License', category: 'License', tags: [], price: 48000, cost: 14400, quantity: 1 },
  { id: 'var-003', name: 'Starter License', category: 'License', tags: [], price: 12000, cost: 3600, quantity: 1 },
  { id: 'var-004', name: 'Implementation Services', category: 'Services', tags: [], price: 45000, cost: 27000, quantity: 1 },
  { id: 'var-005', name: 'Premium Support (Annual)', category: 'Support', tags: [], price: 24000, cost: 7200, quantity: 1 },
  { id: 'var-006', name: 'Custom Integration', category: 'Services', tags: [], price: 35000, cost: 21000, quantity: 1 },
];

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen mesh-bg-light" />}>
      <SimulatorContent />
    </Suspense>
  );
}

type MobileTab = 'catalog' | 'commission' | 'modeler';

function SimulatorContent() {
  const searchParams = useSearchParams();
  const initialClient = searchParams.get('client');
  const [dataSource, setDataSource] = useState<DataSource>('mock');
  const [mobileTab, setMobileTab] = useState<MobileTab>('commission');
  const [clientId, setClientId] = useState(
    initialClient && CLIENT_REGISTRY[initialClient] ? initialClient : CLIENT_LIST[0].id
  );
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedRepIdx, setSelectedRepIdx] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [ruleOverrides, setRuleOverrides] = useState<Record<string, Rule>>({});
  const [splitFactor, setSplitFactor] = useState(1);

  // D365 event log state
  const [d365Events, setD365Events] = useState<D365TransactionEvent[]>([]);

  // Varicent-loaded data
  const [varicentConfig, setVaricentConfig] = useState<ClientConfig | null>(null);
  const [varicentReps, setVaricentReps] = useState<{ id: string; name: string }[]>([]);
  const [varicentPeriod, setVaricentPeriod] = useState<PeriodContext | null>(null);
  const [varicentLoading, setVaricentLoading] = useState(false);
  const [varicentError, setVaricentError] = useState<string | null>(null);
  const [varicentHealth, setVaricentHealth] = useState<{ ok: boolean; latencyMs: number; model: string } | null>(null);

  const isVaricent = dataSource === 'poc1' || dataSource === 'poc2';

  // Fetch Varicent data when switching to POC1/POC2
  useEffect(() => {
    if (!isVaricent) {
      setVaricentConfig(null);
      setVaricentReps([]);
      setVaricentPeriod(null);
      setVaricentError(null);
      setVaricentHealth(null);
      return;
    }

    let cancelled = false;
    setVaricentLoading(true);
    setVaricentError(null);

    async function fetchVaricent() {
      try {
        const [configRes, repsRes, periodRes] = await Promise.all([
          fetch('/api/varicent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ env: dataSource, action: 'config' }),
          }),
          fetch('/api/varicent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ env: dataSource, action: 'reps' }),
          }),
          fetch('/api/varicent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ env: dataSource, action: 'period' }),
          }),
        ]);

        const [configData, repsData, periodData] = await Promise.all([
          configRes.json(),
          repsRes.json(),
          periodRes.json(),
        ]);

        if (cancelled) return;

        if (configData.ok) setVaricentConfig(configData.data);
        else setVaricentError(configData.error ?? 'Failed to load config');

        if (repsData.ok) setVaricentReps(repsData.data);
        if (periodData.ok) setVaricentPeriod(periodData.data);

        // Fire health check (non-blocking)
        fetch('/api/varicent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ env: dataSource, action: 'health' }),
        })
          .then((r) => r.json())
          .then((h) => { if (!cancelled && h.ok) setVaricentHealth(h.data); })
          .catch(() => {});
      } catch (err) {
        if (!cancelled) {
          setVaricentError(err instanceof Error ? err.message : 'Connection failed');
        }
      } finally {
        if (!cancelled) setVaricentLoading(false);
      }
    }

    fetchVaricent();
    return () => { cancelled = true; };
  }, [dataSource, isVaricent]);

  // Resolve current data based on data source
  const bundle: ClientBundle | null = isVaricent ? null : CLIENT_REGISTRY[clientId];
  const baseConfig = isVaricent ? (varicentConfig ?? {
    id: 'loading', name: 'Loading...', components: [], summaryMetrics: [],
  } as ClientConfig) : bundle!.config;
  const catalog = isVaricent ? VARICENT_CATALOG : bundle!.catalog;
  const reps: { id: string; name: string; storeId?: string; title?: string }[] = isVaricent ? varicentReps : bundle!.reps;
  const rep = reps[selectedRepIdx] ?? reps[0] ?? { id: 'unknown', name: 'Loading...' };
  const period = isVaricent
    ? (varicentPeriod ?? { revenue: 0, cost: 0, margin: 0, units: 0, periodStart: '2026-01-01', periodEnd: '2026-03-31', target: 750000 })
    : (bundle!.periods[rep.id] ?? { revenue: 30000, cost: 18000, margin: 12000, units: 50, periodStart: '2026-02-01', periodEnd: '2026-02-28', target: 40000 });

  // Client list for dropdown
  const clientList = isVaricent
    ? [{ id: baseConfig.id, name: baseConfig.name }]
    : CLIENT_LIST;

  // Apply rule overrides from the modeler + split factor
  const config: ClientConfig = useMemo(() => {
    const withOverrides = Object.keys(ruleOverrides).length === 0
      ? baseConfig
      : {
          ...baseConfig,
          components: baseConfig.components.map((comp) =>
            ruleOverrides[comp.id]
              ? { ...comp, rule: ruleOverrides[comp.id] }
              : comp
          ),
        };
    // Apply split factor override
    if (splitFactor !== 1) {
      return {
        ...withOverrides,
        splitConfig: { enabled: true, defaultFactor: splitFactor, label: 'Split Credit' },
      };
    }
    return withOverrides;
  }, [baseConfig, ruleOverrides, splitFactor]);

  const result = useMemo(() => {
    if (saleItems.length === 0) return null;
    return calculate(config, saleItems, period);
  }, [config, saleItems, period]);

  // Track previous commission for pulse animation
  const prevCommission = useRef(0);
  const [pulseKey, setPulseKey] = useState(0);
  useEffect(() => {
    const curr = result?.totalCommission ?? 0;
    if (curr !== prevCommission.current && curr > 0) {
      setPulseKey((k) => k + 1);
    }
    prevCommission.current = curr;
  }, [result?.totalCommission]);

  // Generate D365 preview events when items change in D365 mode
  const isD365SummitSleepCo = dataSource === 'd365' && clientId === 'tablet';
  useEffect(() => {
    if (!isD365SummitSleepCo || saleItems.length === 0) return;
    const previewEvent = generateTransactionEvent(
      saleItems,
      { id: rep.id, name: rep.name, storeId: rep.storeId ?? STORE_CONTEXT.storeId },
      STORE_CONTEXT
    );
    setD365Events((prev) => [...prev, previewEvent]);
  }, [isD365SummitSleepCo, saleItems, rep.id, rep.name, rep.storeId]);

  const handleDataSourceChange = useCallback((ds: DataSource) => {
    setDataSource(ds);
    setSaleItems([]);
    setSelectedRepIdx(0);
    setRuleOverrides({});
    setSplitFactor(1);
    setD365Events([]);
  }, []);

  const handleClientSwitch = useCallback((newClientId: string) => {
    setClientId(newClientId);
    setSaleItems([]);
    setSelectedRepIdx(0);
    setRuleOverrides({});
    setSplitFactor(1);
  }, []);

  const handleRepSwitch = useCallback((idx: number) => {
    setSelectedRepIdx(idx);
    setSaleItems([]);
  }, []);

  const handleAddItem = useCallback((item: SaleItem) => {
    setSaleItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    // On mobile, auto-switch to commission view after adding item
    setMobileTab('commission');
  }, []);

  const handleUpdateQuantity = useCallback((itemId: string, delta: number) => {
    setSaleItems((prev) =>
      prev.map((i) => i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setSaleItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const activeRules = config.components.filter((c) => c.rule.type !== 'placeholder').length;
  const totalRules = config.components.length;
  const hasOverrides = Object.keys(ruleOverrides).length > 0;
  const rulesStatus = hasOverrides
    ? `${activeRules}/${totalRules} modeled`
    : activeRules === totalRules
      ? `${totalRules} rules active`
      : `${activeRules}/${totalRules} configured`;

  const accent = config.theme?.accent ?? '#6366f1';
  const dsInfo = DATA_SOURCE_LABELS[dataSource];

  // Attainment
  const attainmentPct = period.target ? (period.revenue / period.target) * 100 : 0;
  const attainmentColor = attainmentPct >= 100 ? '#22c55e' : attainmentPct >= 75 ? '#f59e0b' : '#ef4444';

  // Toggle dark class on html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? 'mesh-bg-dark' : 'mesh-bg-light'} mesh-brand`}
      style={{ '--brand-glow': `${accent}15` } as React.CSSProperties}
    >
      {/* ── Glass Top Bar ────────────────────────────────────── */}
      <div className="glass-nav sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Left: SWIC Logo + Data Source + Client */}
          <div className="flex items-center gap-3">
            {/* SWIC Brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)' }}>
                <span className="text-white font-black text-[10px] tracking-tight">SW</span>
              </div>
              <div>
                <span className="text-sm font-black tracking-tight">
                  <span style={{ color: '#6366f1' }}>SW</span><span style={{ color: '#a855f7' }}>IC</span>
                </span>
                <p className="text-[9px] leading-tight" style={{ color: 'var(--page-muted)' }}>What-If Calculator</p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6" style={{ background: 'var(--glass-border)' }} />

            {/* Data Source toggle */}
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" style={{ color: 'var(--page-muted)' }} />
              <select
                value={dataSource}
                onChange={(e) => handleDataSourceChange(e.target.value as DataSource)}
                className="glass-input rounded-lg px-2 py-1 text-[10px] font-semibold cursor-pointer"
                style={{ color: dsInfo.color }}
              >
                <option value="mock">Mock Data</option>
                <option value="d365">D365 Mock</option>
                <option value="poc1">Varicent POC1</option>
                <option value="poc2">Varicent POC2</option>
              </select>
              {varicentLoading && (
                <Loader2 className="w-3 h-3 animate-spin" style={{ color: dsInfo.color }} />
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-6" style={{ background: 'var(--glass-border)' }} />

            {/* Client badge */}
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-[10px]"
                style={{ background: `linear-gradient(135deg, ${accent}, ${config.theme?.primary ?? '#14141f'})` }}
              >
                {config.name.charAt(0)}
              </div>
              <select
                value={isVaricent ? baseConfig.id : clientId}
                onChange={(e) => handleClientSwitch(e.target.value)}
                className="glass-input rounded-lg px-2 py-1 text-xs font-semibold cursor-pointer"
                disabled={isVaricent}
              >
                {clientList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {/* Rep selector */}
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" style={{ color: 'var(--page-muted)' }} />
              <select
                value={selectedRepIdx}
                onChange={(e) => handleRepSwitch(Number(e.target.value))}
                className="glass-input rounded-lg px-2 py-1 text-xs cursor-pointer"
              >
                {reps.map((r, i) => (
                  <option key={r.id} value={i}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* Rules badge */}
            <span
              className="glass-pill text-[10px] px-2.5 py-1 rounded-full font-semibold hidden lg:inline-flex"
              style={{
                borderColor: hasOverrides ? `${accent}40` : activeRules === totalRules ? '#22c55e30' : '#f59e0b30',
                color: hasOverrides ? accent : activeRules === totalRules ? '#16a34a' : '#d97706',
                background: hasOverrides ? `${accent}12` : activeRules === totalRules ? '#22c55e0a' : '#f59e0b0a',
              }}
            >
              {hasOverrides && <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 animate-status-pulse" style={{ backgroundColor: accent }} />}
              {rulesStatus}
            </span>

            {/* Split Credit toggle */}
            <div className="flex items-center gap-1 glass-pill rounded-lg px-2 py-1 hidden lg:flex">
              <Users2 className="w-3 h-3" style={{ color: splitFactor < 1 ? accent : 'var(--page-muted)' }} />
              <select
                value={splitFactor}
                onChange={(e) => setSplitFactor(parseFloat(e.target.value))}
                className="glass-input rounded px-1 py-0.5 text-[10px] font-mono cursor-pointer"
                title="Split credit factor"
                style={{ color: splitFactor < 1 ? accent : undefined }}
              >
                <option value={1}>100%</option>
                <option value={0.75}>75%</option>
                <option value={0.5}>50%</option>
                <option value={0.33}>33%</option>
                <option value={0.25}>25%</option>
              </select>
            </div>

            {/* Dark/Light toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="glass-pill p-1.5 rounded-lg transition-all hover:scale-105"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode
                ? <Sun className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                : <Moon className="w-3.5 h-3.5" style={{ color: 'var(--page-muted)' }} />}
            </button>

            {/* Print */}
            {result && (
              <button
                onClick={() => window.print()}
                className="glass-pill p-1.5 rounded-lg transition-all hover:scale-105"
                title="Print ticket summary"
              >
                <Printer className="w-3.5 h-3.5" style={{ color: 'var(--page-muted)' }} />
              </button>
            )}

            {/* New Sale */}
            <button
              onClick={() => setSaleItems([])}
              className="py-1 px-3 text-[10px] flex items-center gap-1 rounded-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                color: '#ffffff',
                boxShadow: `0 2px 8px ${accent}40`,
              }}
            >
              <RotateCcw className="w-3 h-3" />
              New Sale
            </button>
          </div>
        </div>
      </div>

      {/* ── Info Strip ───────────────────────────────────────── */}
      <div className="glass-nav">
        <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Data source indicator */}
            <span
              className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1.5"
              style={{ borderColor: `${dsInfo.color}30` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dsInfo.color }} />
              <span style={{ color: dsInfo.color }} className="font-semibold">{dsInfo.label}</span>
            </span>
            {dataSource === 'd365' && (
              <span
                className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1.5 font-semibold"
                style={{ background: '#0078d420', borderColor: '#0078d440', color: '#0078d4' }}
              >
                D365 Commerce Mode
              </span>
            )}
            {dataSource === 'd365' && clientId !== 'tablet' && (
              <span
                className="glass-pill px-2.5 py-0.5 rounded-full text-[10px]"
                style={{ color: 'var(--page-muted)' }}
              >
                D365 mode available for Summit Sleep Co. only
              </span>
            )}
            {isVaricent && varicentHealth && (
              <span
                className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1.5"
                style={{ borderColor: varicentHealth.ok ? '#22c55e30' : '#ef444430' }}
              >
                {varicentHealth.ok
                  ? <Wifi className="w-3 h-3" style={{ color: '#22c55e' }} />
                  : <WifiOff className="w-3 h-3" style={{ color: '#ef4444' }} />}
                <span style={{ color: varicentHealth.ok ? '#22c55e' : '#ef4444' }} className="font-semibold">
                  {varicentHealth.ok ? `${varicentHealth.latencyMs}ms` : 'Offline'}
                </span>
              </span>
            )}
            <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px]">
              <span style={{ color: 'var(--page-muted)' }}>Rep: </span>
              <strong>{rep.name}</strong>
            </span>
            {rep.storeId && (
              <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px]">
                <span style={{ color: 'var(--page-muted)' }}>Store: </span>
                <strong>{rep.storeId}</strong>
              </span>
            )}
            {splitFactor < 1 && (
              <span
                className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1.5"
                style={{ borderColor: `${accent}30` }}
              >
                <Users2 className="w-3 h-3" style={{ color: accent }} />
                <span style={{ color: accent }} className="font-semibold">
                  Split {(splitFactor * 100).toFixed(0)}%
                </span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px]">
              <span style={{ color: 'var(--page-muted)' }}>MTD: </span>
              <strong className="font-mono">${period.revenue.toLocaleString()}</strong>
            </span>
            {period.target && (
              <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px]">
                <span style={{ color: 'var(--page-muted)' }}>Target: </span>
                <strong className="font-mono">${period.target.toLocaleString()}</strong>
              </span>
            )}
            {period.target && (
              <div className="flex items-center gap-1">
                <svg width="18" height="18" viewBox="0 0 22 22">
                  <circle cx="11" cy="11" r="9" fill="none" stroke="var(--glass-border)" strokeWidth="2.5" />
                  <circle
                    cx="11" cy="11" r="9"
                    fill="none"
                    stroke={attainmentColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min(attainmentPct, 100) * 0.5655} 56.55`}
                    transform="rotate(-90 11 11)"
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                </svg>
                <span className="text-[10px] font-mono font-bold" style={{ color: attainmentColor }}>
                  {attainmentPct.toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Varicent Error Banner ───────────────────────────── */}
      {varicentError && isVaricent && (
        <div className="max-w-[1600px] mx-auto px-4 pt-3">
          <div
            className="glass rounded-xl px-4 py-2.5 text-xs flex items-center gap-2"
            style={{ borderLeft: '3px solid #ef4444', color: '#fca5a5' }}
          >
            <span className="font-semibold" style={{ color: '#ef4444' }}>Varicent:</span>
            {varicentError}
          </div>
        </div>
      )}

      {/* ── Forecast Strip ──────────────────────────────────── */}
      <ForecastStrip
        config={config}
        period={period}
        daysInPeriod={(() => {
          const start = new Date(period.periodStart);
          const end = new Date(period.periodEnd);
          return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        })()}
        daysElapsed={(() => {
          const start = new Date(period.periodStart);
          const now = new Date();
          return Math.max(0, Math.ceil((Math.min(now.getTime(), new Date(period.periodEnd).getTime()) - start.getTime()) / (1000 * 60 * 60 * 24)));
        })()}
        accent={accent}
      />

      {/* ── Mobile Tab Bar (visible < lg) ────────────────────── */}
      <div className="lg:hidden flex items-center gap-1 px-4 pt-3">
        {([
          { key: 'catalog' as MobileTab, label: 'Catalog', count: catalog.length },
          { key: 'commission' as MobileTab, label: 'Commission', count: saleItems.length || undefined },
          { key: 'modeler' as MobileTab, label: 'Modeler' },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMobileTab(tab.key)}
            className="flex-1 text-center py-2 rounded-lg text-xs font-semibold transition-all"
            style={mobileTab === tab.key ? {
              background: `linear-gradient(135deg, ${accent}20, ${accent}10)`,
              color: accent,
              border: `1px solid ${accent}30`,
            } : {
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--page-muted)',
            }}
          >
            {tab.label}
            {tab.count != null && (
              <span className="ml-1 text-[10px] opacity-60">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* ── 3-Pane POS Layout (3-5-4) ─────────────────────────── */}
      <div className="max-w-[1600px] mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* LEFT PANE (col-span-3): Catalog + Basket */}
          <div className={`lg:col-span-3 flex flex-col gap-4 lg:max-h-[calc(100vh-140px)] lg:overflow-hidden ${mobileTab !== 'catalog' ? 'hidden lg:flex' : ''}`}>
            {/* Product Catalog — compact */}
            <div className="glass rounded-2xl p-4 flex flex-col flex-1 min-h-0">
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h2 className="text-xs font-bold tracking-tight uppercase" style={{ color: 'var(--page-muted)' }}>
                  Catalog
                </h2>
                <span className="text-[10px] font-mono" style={{ color: 'var(--page-muted)' }}>
                  {catalog.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar">
                <SaleBuilder catalogItems={catalog} onAddItem={handleAddItem} accent={accent} compact />
              </div>
            </div>

            {/* Current Sale (Basket) */}
            <div className="flex-shrink-0">
              <POSView
                items={saleItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                accent={accent}
                compact
              />
            </div>
          </div>

          {/* CENTER PANE (col-span-5): Commission Preview — HERO */}
          <div className={`lg:col-span-5 print-area ${mobileTab !== 'commission' ? 'hidden lg:block' : ''}`}>
            <div className="lg:sticky lg:top-[100px]">
              <CommissionPreview
                config={config}
                result={result}
                repName={rep.name}
                pulseKey={pulseKey}
                glass
              />
              {isD365SummitSleepCo && (
                <D365EventLog events={d365Events} className="mt-4" />
              )}
              <CommissionHistory
                clientId={isVaricent ? `varicent-${dataSource}` : clientId}
                repName={rep.name}
                accent={accent}
              />
              <WhatIfPanel
                config={config}
                period={period}
                saleItems={saleItems}
                accent={accent}
              />
            </div>
          </div>

          {/* RIGHT PANE (col-span-4): Comp Plan Modeler + Pipeline Simulator */}
          <div className={`lg:col-span-4 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto no-scrollbar ${mobileTab !== 'modeler' ? 'hidden lg:block' : ''}`}>
            <RuleSimulator
              components={baseConfig.components}
              overrides={ruleOverrides}
              onRulesChange={setRuleOverrides}
              accent={accent}
            />
            <PipelineSimulator
              config={config}
              period={period}
              accent={accent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
