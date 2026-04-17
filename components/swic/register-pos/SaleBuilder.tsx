'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, X, User } from 'lucide-react';
import { MATTRESSES, BASES, ACCESSORIES, PROTECTION, BUNDLE_SUGGESTIONS, type POSProduct, type CustomerProfile } from '@/lib/swic/data/summit-sleep-pos';
import { BundleSuggestions } from './BundleSuggestions';
import { FinancingWhatsIf } from './FinancingWhatsIf';

interface CartItem {
  product: POSProduct;
  quantity: number;
}

interface SaleBuilderProps {
  cart: CartItem[];
  customer: CustomerProfile;
  onAddToCart: (product: POSProduct) => void;
  onRemoveFromCart: (productId: string) => void;
  onCustomerChange: (customer: CustomerProfile) => void;
  isDark: boolean;
  scenario: string | null;
}

const CATEGORIES = [
  { key: 'mattress', label: 'Mattresses', items: MATTRESSES },
  { key: 'base', label: 'Bases', items: BASES },
  { key: 'accessory', label: 'Accessories', items: ACCESSORIES },
  { key: 'protection', label: 'Protection', items: PROTECTION },
] as const;

export function SaleBuilder({ cart, customer, onAddToCart, onRemoveFromCart, onCustomerChange, isDark, scenario }: SaleBuilderProps) {
  const [activeCategory, setActiveCategory] = useState<string>('mattress');
  const activeItems = CATEGORIES.find((c) => c.key === activeCategory)?.items ?? [];

  const bg = isDark ? '#0F172A' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const textPrimary = isDark ? '#F1F5F9' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';
  const textMuted = isDark ? '#64748B' : '#94A3B8';
  const accent = '#1E3A5F';

  const saleTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Find relevant bundle suggestions based on cart contents
  const cartCategories = cart.map((item) => item.product.category);
  const cartMaxPrice = Math.max(0, ...cart.map((item) => item.product.price));
  const relevantSuggestions = BUNDLE_SUGGESTIONS.filter(
    (s) =>
      cartCategories.includes(s.triggerCategory as POSProduct['category']) &&
      cartMaxPrice >= s.triggerMinPrice &&
      !cart.some((item) => item.product.id === s.suggestion.id)
  );

  return (
    <div className="h-full flex flex-col" style={{ background: bg }}>
      {/* Customer Profile Bar */}
      <div className="px-4 py-3 border-b" style={{ borderColor, background: cardBg }}>
        <div className="flex items-center gap-3">
          <User size={16} style={{ color: accent }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>Customer</span>
          {scenario && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: isDark ? '#1E3A5F20' : '#1E3A5F10', color: accent }}>
              Coaching: {scenario}
            </span>
          )}
        </div>
        <div className="flex gap-6 mt-2 text-xs" style={{ color: textSecondary }}>
          <span><strong style={{ color: textPrimary }}>Type:</strong> {customer.type}</span>
          <span><strong style={{ color: textPrimary }}>Sleep:</strong> {customer.sleepPref || '—'}</span>
          <span><strong style={{ color: textPrimary }}>Budget:</strong> {customer.budget || '—'}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b" style={{ borderColor }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className="flex-1 px-3 py-2.5 text-xs font-semibold transition-colors"
            style={{
              color: activeCategory === cat.key ? accent : textMuted,
              borderBottom: activeCategory === cat.key ? `2px solid ${accent}` : '2px solid transparent',
              background: activeCategory === cat.key ? (isDark ? '#1E3A5F15' : '#1E3A5F08') : 'transparent',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {activeItems.map((product) => {
            const inCart = cart.some((item) => item.product.id === product.id);
            return (
              <button
                key={product.id}
                onClick={() => onAddToCart(product)}
                className="rounded-lg border p-3 text-left transition-all hover:shadow-md"
                style={{
                  borderColor: inCart ? accent : borderColor,
                  background: inCart ? (isDark ? '#1E3A5F20' : '#1E3A5F08') : cardBg,
                }}
              >
                <div className="text-sm font-medium mb-1" style={{ color: textPrimary }}>{product.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold" style={{ color: textPrimary }}>${product.price.toLocaleString()}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#10B98120', color: '#10B981' }}>
                    +${product.commission}
                  </span>
                </div>
                {product.comfort && product.size && (
                  <div className="text-[10px] mt-1" style={{ color: textMuted }}>
                    {product.size.toUpperCase()} · {product.comfort}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bundle Suggestions */}
        {relevantSuggestions.length > 0 && (
          <BundleSuggestions
            suggestions={relevantSuggestions}
            onAdd={onAddToCart}
            isDark={isDark}
          />
        )}

        {/* Financing What-If */}
        {saleTotal > 0 && (
          <FinancingWhatsIf saleTotal={saleTotal} isDark={isDark} />
        )}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="border-t p-4" style={{ borderColor, background: cardBg }}>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart size={14} style={{ color: accent }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>
              Cart ({cart.length} items)
            </span>
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between text-xs">
                <span style={{ color: textPrimary }}>{item.product.name} {item.quantity > 1 ? `×${item.quantity}` : ''}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono" style={{ color: textPrimary }}>${(item.product.price * item.quantity).toLocaleString()}</span>
                  <button onClick={() => onRemoveFromCart(item.product.id)} className="p-0.5 rounded hover:bg-red-500/20">
                    <X size={12} style={{ color: '#EF4444' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t text-sm font-bold" style={{ borderColor, color: textPrimary }}>
            <span>Sale Total</span>
            <span>${saleTotal.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
