'use client';

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SaleItem, ClientConfig } from '@/lib/swic/engine/types';
import { calculate, formatCurrency } from '@/lib/swic/engine/calculator';
import { CLIENT_REGISTRY } from '@/lib/swic/data/registry';
import { CommissionPreview } from '@/components/swic/CommissionPreview';
import { sendToParent, isSWICMessage } from '@/lib/swic/util/postmessage';

export default function WidgetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen mesh-bg-dark" />}>
      <WidgetContent />
    </Suspense>
  );
}

function WidgetContent() {
  const searchParams = useSearchParams();
  const clientParam = searchParams.get('client') ?? 'tablet';
  const repParam = searchParams.get('rep');
  const themeParam = searchParams.get('theme') ?? 'dark';

  const bundle = CLIENT_REGISTRY[clientParam] ?? CLIENT_REGISTRY['tablet'];

  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [config, setConfig] = useState<ClientConfig>(bundle.config);
  const [repId, setRepId] = useState(repParam ?? bundle.reps[0]?.id ?? 'rep-001');
  const [isDark, setIsDark] = useState(themeParam === 'dark');

  const period = bundle.periods[repId] ?? {
    revenue: 42000, cost: 24000, margin: 18000,
    units: 85, periodStart: '2026-02-01', periodEnd: '2026-02-28', target: 50000,
  };

  const result = useMemo(() => {
    if (saleItems.length === 0) return null;
    return calculate(config, saleItems, period);
  }, [config, saleItems, period]);

  // Send commission update to parent
  useEffect(() => {
    if (result) {
      sendToParent({
        type: 'swic:commissionUpdate',
        total: result.totalCommission,
        components: result.components.map((c) => ({
          id: c.componentId,
          label: c.label,
          amount: c.amount,
        })),
      });
    }
  }, [result]);

  // Send ready signal on mount
  useEffect(() => {
    sendToParent({ type: 'swic:ready' });
  }, []);

  // Handle inbound PostMessage
  const handleMessage = useCallback((event: MessageEvent) => {
    if (!isSWICMessage(event.data)) return;
    const msg = event.data;

    switch (msg.type) {
      case 'swic:addItem':
        setSaleItems((prev) => {
          const existing = prev.find((i) => i.id === msg.item.id);
          if (existing) {
            return prev.map((i) =>
              i.id === msg.item.id ? { ...i, quantity: i.quantity + (msg.item.quantity || 1) } : i
            );
          }
          return [...prev, msg.item];
        });
        break;
      case 'swic:removeItem':
        setSaleItems((prev) => prev.filter((i) => i.id !== msg.itemId));
        break;
      case 'swic:clearSale':
        setSaleItems([]);
        break;
      case 'swic:setItems':
        setSaleItems(msg.items);
        break;
      case 'swic:setRep':
        setRepId(msg.repId);
        break;
      case 'swic:setTheme':
        setIsDark(msg.theme === 'dark');
        break;
      case 'swic:setConfig':
        setConfig(msg.config);
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  // Apply dark class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const accent = config.theme?.accent ?? '#6366f1';
  const totalComm = result?.totalCommission ?? 0;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'mesh-bg-dark' : 'mesh-bg-light'}`}
      style={{ maxWidth: 420 }}
    >
      {/* Compact header */}
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <span className="text-white font-black text-[8px]">SW</span>
          </div>
          <span className="text-[10px] font-bold" style={{ color: 'var(--page-muted)' }}>
            SWIC
          </span>
        </div>
        {totalComm > 0 && (
          <span
            className="text-xs font-mono font-black"
            style={{ color: accent }}
          >
            {formatCurrency(totalComm)}
          </span>
        )}
      </div>

      {/* Commission panel */}
      <div className="px-2 pb-3">
        <CommissionPreview
          config={config}
          result={result}
          repName={bundle.reps.find((r) => r.id === repId)?.name}
          pulseKey={0}
        />
      </div>

      {/* Item count indicator */}
      {saleItems.length > 0 && (
        <div className="px-3 pb-3">
          <div
            className="glass rounded-lg px-3 py-2 flex items-center justify-between text-[10px]"
            style={{ color: 'var(--page-muted)' }}
          >
            <span>{saleItems.length} item{saleItems.length !== 1 ? 's' : ''} in sale</span>
            <span className="font-mono font-bold">
              {formatCurrency(saleItems.reduce((s, i) => s + i.price * i.quantity, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
