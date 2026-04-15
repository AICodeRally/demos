'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { calculate } from '@/lib/swic-engine/calculator';
import type { SaleItem } from '@/lib/swic-engine/types';
import { LONE_STAR_CONFIG, LONE_STAR_CATALOG, LONE_STAR_PERIODS } from '@/data/routeiq/royal-config';
import { ROUTE_STOPS, ROUTE_META } from '@/data/routeiq/route-data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TabletFrame } from '@/components/demos/routeiq/TabletFrame';
import { RouteIQHeader } from '@/components/demos/routeiq/RouteIQHeader';
import { RouteMap } from '@/components/demos/routeiq/RouteMap';
import { StopList } from '@/components/demos/routeiq/StopList';
import { StopDetail } from '@/components/demos/routeiq/StopDetail';
import { CommissionPanel } from '@/components/demos/routeiq/CommissionPanel';
import { ManagerToast } from '@/components/demos/routeiq/ManagerToast';

/* ══════════════════════════════════════════════════════════
   ROUTEIQ Field Tablet — Royal Distributing
   8-stop Kansas City delivery route, 4-pane iPad layout.
   ══════════════════════════════════════════════════════════ */

export default function RouteiqTabletPage() {
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [addedSuggestions, setAddedSuggestions] = useState<Record<string, string[]>>({});
  const [isDark, setIsDark] = useState(true);
  const [isPWA, setIsPWA] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [sidePane, setSidePane] = useState<'map' | 'commission'>('map');
  const [fontSize, setFontSize] = useState(1.3);

  useEffect(() => {
    const mq = window.matchMedia('(display-mode: standalone)');
    setIsPWA(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsPWA(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    return () => { document.documentElement.classList.remove('dark'); };
  }, [isDark]);

  const navigateStop = useCallback((direction: 'left' | 'right') => {
    setSlideDirection(direction);
    setActiveStopIndex((prev) => {
      if (direction === 'left') return Math.min(prev + 1, ROUTE_STOPS.length - 1);
      return Math.max(prev - 1, 0);
    });
    setTimeout(() => setSlideDirection(null), 300);
  }, []);

  const allSaleItems = useMemo(() => {
    const items: Map<string, SaleItem> = new Map();

    for (const stop of ROUTE_STOPS) {
      for (const m of stop.manifest) {
        const catalogItem = LONE_STAR_CATALOG.find((c) => c.id === m.productId);
        if (!catalogItem) continue;

        const existing = items.get(m.productId);
        if (existing) {
          existing.quantity += m.cases;
          existing.price += catalogItem.price * m.cases;
          existing.cost += catalogItem.cost * m.cases;
        } else {
          items.set(m.productId, {
            id: m.productId,
            name: m.name,
            category: catalogItem.category,
            tags: [...catalogItem.tags],
            price: catalogItem.price * m.cases,
            cost: catalogItem.cost * m.cases,
            quantity: m.cases,
          });
        }
      }
    }

    for (const stop of ROUTE_STOPS) {
      const acceptedIds = addedSuggestions[stop.id] ?? [];
      for (const sugId of acceptedIds) {
        const suggestion = stop.aiSuggestions.find((s) => s.id === sugId);
        if (!suggestion) continue;

        const catalogItem = LONE_STAR_CATALOG.find((c) => c.id === suggestion.productId);
        if (!catalogItem) continue;

        const existing = items.get(suggestion.productId);
        if (existing) {
          existing.quantity += suggestion.cases;
          existing.price += catalogItem.price * suggestion.cases;
          existing.cost += catalogItem.cost * suggestion.cases;
          for (const tag of suggestion.tags) {
            if (!existing.tags.includes(tag)) existing.tags.push(tag);
          }
        } else {
          items.set(suggestion.productId, {
            id: suggestion.productId,
            name: suggestion.product,
            category: catalogItem.category,
            tags: [...new Set([...catalogItem.tags, ...suggestion.tags])],
            price: catalogItem.price * suggestion.cases,
            cost: catalogItem.cost * suggestion.cases,
            quantity: suggestion.cases,
          });
        }
      }
    }

    return Array.from(items.values());
  }, [addedSuggestions]);

  const baselineItems = useMemo(() => {
    const items: Map<string, SaleItem> = new Map();
    for (const stop of ROUTE_STOPS) {
      for (const m of stop.manifest) {
        const catalogItem = LONE_STAR_CATALOG.find((c) => c.id === m.productId);
        if (!catalogItem) continue;
        const existing = items.get(m.productId);
        if (existing) {
          existing.quantity += m.cases;
          existing.price += catalogItem.price * m.cases;
          existing.cost += catalogItem.cost * m.cases;
        } else {
          items.set(m.productId, {
            id: m.productId,
            name: m.name,
            category: catalogItem.category,
            tags: [...catalogItem.tags],
            price: catalogItem.price * m.cases,
            cost: catalogItem.cost * m.cases,
            quantity: m.cases,
          });
        }
      }
    }
    return Array.from(items.values());
  }, []);

  const period = LONE_STAR_PERIODS[ROUTE_META.repId];

  const result = useMemo(() => {
    if (allSaleItems.length === 0) return null;
    return calculate(LONE_STAR_CONFIG, allSaleItems, period);
  }, [allSaleItems, period]);

  const baselineResult = useMemo(() => {
    if (baselineItems.length === 0) return null;
    return calculate(LONE_STAR_CONFIG, baselineItems, period);
  }, [baselineItems, period]);

  const baselineCommission = baselineResult?.totalCommission ?? 0;

  const totalUnits = allSaleItems.reduce((sum, item) => sum + item.quantity, 0) + period.units;
  const currentTierMax = totalUnits < 500 ? 500 : totalUnits < 1000 ? 1000 : 1500;
  const currentTierMin = totalUnits < 500 ? 0 : totalUnits < 1000 ? 500 : 1000;
  const tierProgress = ((totalUnits - currentTierMin) / (currentTierMax - currentTierMin)) * 100;
  const tierLabel = totalUnits < 500
    ? `${totalUnits}/500 → 4%`
    : totalUnits < 1000
      ? `${totalUnits}/1000 → 5%`
      : `${totalUnits} — Top (5%)`;

  const handleAddSuggestion = useCallback((stopId: string, suggestionId: string) => {
    setAddedSuggestions((prev) => ({
      ...prev,
      [stopId]: [...(prev[stopId] ?? []), suggestionId],
    }));
  }, []);

  const handleAcceptAll = useCallback((stopId: string) => {
    const stop = ROUTE_STOPS.find((s) => s.id === stopId);
    if (!stop) return;
    const currentAccepted = addedSuggestions[stopId] ?? [];
    const newIds = stop.aiSuggestions
      .filter((s) => !currentAccepted.includes(s.id))
      .map((s) => s.id);
    setAddedSuggestions((prev) => ({
      ...prev,
      [stopId]: [...(prev[stopId] ?? []), ...newIds],
    }));
  }, [addedSuggestions]);

  const activeStop = ROUTE_STOPS[activeStopIndex];

  const content = (
    <div className="flex flex-col h-full overflow-hidden">
      <ManagerToast />
      <RouteIQHeader
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        sidePane={sidePane}
        onToggleSidePane={() => setSidePane((p) => p === 'map' ? 'commission' : 'map')}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {sidePane === 'map' && (
          <div
            className="flex-shrink-0 overflow-hidden pane-transition"
            style={{ width: '30%', borderRight: '1px solid var(--pl-zone-border)' }}
          >
            <RouteMap
              activeStopIndex={activeStopIndex}
              onStopClick={setActiveStopIndex}
            />
          </div>
        )}

        <div
          className="flex-shrink-0 overflow-hidden"
          style={{ width: '22%', borderRight: '1px solid var(--pl-zone-border)', fontSize: `${fontSize}rem` }}
        >
          <StopList
            activeStopIndex={activeStopIndex}
            onStopClick={setActiveStopIndex}
            completedSuggestions={addedSuggestions}
          />
        </div>

        <div className="flex-1 min-w-0 overflow-hidden" style={{ fontSize: `${fontSize}rem` }}>
          <StopDetail
            stop={activeStop}
            slideDirection={slideDirection}
            onSwipeLeft={() => navigateStop('left')}
            onSwipeRight={() => navigateStop('right')}
          />
        </div>

        {sidePane === 'commission' && (
          <div className="flex-shrink-0 h-full" style={{ fontSize: `${fontSize}rem` }}>
            <CommissionPanel
              activeStop={activeStop}
              result={result}
              baselineCommission={baselineCommission}
              addedSuggestions={addedSuggestions}
              onAddSuggestion={handleAddSuggestion}
              onAcceptAll={handleAcceptAll}
              tierProgress={tierProgress}
              tierLabel={tierLabel}
              collapsed={false}
              onToggle={() => setSidePane('map')}
            />
          </div>
        )}
      </div>
    </div>
  );

  if (isPWA) {
    return (
      <div
        className="w-screen overflow-hidden"
        style={{ height: '100dvh', background: 'var(--pl-content-bg)' }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 30% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(15, 23, 42, 0.9) 0%, transparent 50%), #0A0A15'
          : 'radial-gradient(ellipse at 30% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(232, 237, 248, 0.85) 0%, transparent 50%), #EEF2FF',
      }}
    >
      <Link
        href="/routeiq/cockpit"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold backdrop-blur-md transition-colors"
        style={{
          background: isDark ? 'rgba(20, 20, 40, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          color: isDark ? '#F59E0B' : '#4338CA',
          border: `1px solid ${isDark ? 'rgba(245, 158, 11, 0.4)' : 'rgba(67, 56, 202, 0.3)'}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to RouteIQ Cockpit
      </Link>
      <TabletFrame isDark={isDark}>
        {content}
      </TabletFrame>
    </div>
  );
}
