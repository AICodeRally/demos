'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { calculate } from '@/lib/swic-engine/calculator';
import type { SaleItem } from '@/lib/swic-engine/types';
import { LONE_STAR_CONFIG, LONE_STAR_CATALOG, LONE_STAR_PERIODS } from '@/data/proofline-route/lone-star-spirits';
import { ROUTE_STOPS, ROUTE_META } from '@/data/proofline-route/route-data';
import { TabletFrame } from '@/components/demos/proofline-route/TabletFrame';
import { ProoflineHeader } from '@/components/demos/proofline-route/ProoflineHeader';
import { RouteMap } from '@/components/demos/proofline-route/RouteMap';
import { StopList } from '@/components/demos/proofline-route/StopList';
import { StopDetail } from '@/components/demos/proofline-route/StopDetail';
import { CommissionPanel } from '@/components/demos/proofline-route/CommissionPanel';

/* ══════════════════════════════════════════════════════════
   PROOFLINE Route Commission Demo

   4-pane horizontal layout inside an iPad tablet frame:
   1. Route Map (left, collapsible)
   2. Stop List (center-left, always visible)
   3. Stop Detail (center-right, always visible)
   4. Commission Panel (right, collapsible)
   ══════════════════════════════════════════════════════════ */

export default function ProoflineRoutePage() {
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
    ? `${totalUnits}/500 \u2192 4%`
    : totalUnits < 1000
      ? `${totalUnits}/1000 \u2192 5%`
      : `${totalUnits} \u2014 Top (5%)`;

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
      <ProoflineHeader
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
      className="min-h-screen flex items-center justify-center"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 30% 20%, rgba(198, 160, 82, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(15, 23, 42, 0.8) 0%, transparent 50%), #060810'
          : 'radial-gradient(ellipse at 30% 20%, rgba(198, 160, 82, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(240, 237, 228, 0.8) 0%, transparent 50%), #e8e5dc',
      }}
    >
      <TabletFrame isDark={isDark}>
        {content}
      </TabletFrame>
    </div>
  );
}
