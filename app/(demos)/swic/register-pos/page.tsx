'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TabletFrame } from '@/components/swic/TabletFrame';
import { SaleBuilder } from '@/components/swic/register-pos/SaleBuilder';
import { CommissionPanel } from '@/components/swic/register-pos/CommissionPanel';
import {
  ALL_PRODUCTS,
  COACHING_PRELOADS,
  TIER_THRESHOLDS,
  type POSProduct,
  type CustomerProfile,
} from '@/lib/swic/data/summit-sleep-pos';

interface CartItem {
  product: POSProduct;
  quantity: number;
}

function RegisterPOSContent() {
  const searchParams = useSearchParams();
  const scenario = searchParams.get('scenario');
  const mode = searchParams.get('mode');

  const preload = scenario ? COACHING_PRELOADS[scenario] : null;

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (!preload) return [];
    return preload.cartItemIds
      .map((id) => ALL_PRODUCTS.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => ({ product: p!, quantity: 1 }));
  });
  const [customer, setCustomer] = useState<CustomerProfile>(() => {
    if (!preload) return { type: 'walk-in', sleepPref: '', budget: '' };
    return preload.customer;
  });
  const [isPWA, setIsPWA] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
  );
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(display-mode: standalone)');
    const handler = () => setIsPWA(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const addToCart = (product: POSProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const saleTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const baseCommission = cart.reduce((sum, item) => sum + item.product.commission * item.quantity, 0);

  const monthlyRevenueSoFar = 42000;
  const projectedMonthly = monthlyRevenueSoFar + saleTotal;
  const currentTier = [...TIER_THRESHOLDS].reverse().find((t) => projectedMonthly >= t.minRevenue) ?? TIER_THRESHOLDS[0];

  const content = (
    <div className="flex h-full overflow-hidden" style={{ background: isDark ? '#0F172A' : '#F8FAFC' }}>
      <div className="flex-[55] overflow-y-auto border-r" style={{ borderColor: isDark ? '#1E293B' : '#E2E8F0' }}>
        <SaleBuilder
          cart={cart}
          customer={customer}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onCustomerChange={setCustomer}
          isDark={isDark}
          scenario={scenario}
        />
      </div>
      <div className="flex-[45] overflow-y-auto">
        <CommissionPanel
          cart={cart}
          saleTotal={saleTotal}
          baseCommission={baseCommission}
          currentTier={currentTier}
          monthlyRevenue={projectedMonthly}
          isDark={isDark}
        />
      </div>
    </div>
  );

  if (isPWA) {
    return <div style={{ height: '100dvh' }}>{content}</div>;
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen p-8"
      style={{ background: isDark ? '#0a0a0a' : '#f1f5f9' }}
    >
      <div className="w-full max-w-[1280px]">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>
            Summit Sleep — POS Simulator
          </h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="text-xs px-3 py-1 rounded"
            style={{
              backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
              color: isDark ? '#94A3B8' : '#64748B',
            }}
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
        <TabletFrame isDark={isDark}>{content}</TabletFrame>
      </div>
    </div>
  );
}

export default function RegisterPOSPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>}>
      <RegisterPOSContent />
    </Suspense>
  );
}
