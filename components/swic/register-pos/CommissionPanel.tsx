'use client';

import { DollarSign, TrendingUp, Award, Zap } from 'lucide-react';
import { TIER_THRESHOLDS } from '@/lib/swic/data/summit-sleep-pos';
import type { POSProduct } from '@/lib/swic/data/summit-sleep-pos';

interface CartItem {
  product: POSProduct;
  quantity: number;
}

interface CommissionPanelProps {
  cart: CartItem[];
  saleTotal: number;
  baseCommission: number;
  currentTier: typeof TIER_THRESHOLDS[number];
  monthlyRevenue: number;
  isDark: boolean;
}

export function CommissionPanel({ cart, saleTotal, baseCommission, currentTier, monthlyRevenue, isDark }: CommissionPanelProps) {
  const bg = isDark ? '#0F172A' : '#F8FAFC';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const textPrimary = isDark ? '#F1F5F9' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';

  const shiftEarningsSoFar = 342; // mock
  const thisSaleDelta = baseCommission;

  // Tier progress
  const nextTier = TIER_THRESHOLDS.find((t) => t.minRevenue > monthlyRevenue);
  const prevTierMin = currentTier.minRevenue;
  const nextTierMin = nextTier?.minRevenue ?? currentTier.minRevenue + 25000;
  const progress = Math.min(100, ((monthlyRevenue - prevTierMin) / (nextTierMin - prevTierMin)) * 100);

  // Projection: "What if you close 2 more like this?"
  const projectedWith2More = baseCommission * 3;

  // Attach rate comparison
  const attachItems = cart.filter((item) => item.product.category !== 'mattress');
  const attachRate = cart.length > 0 ? Math.round((attachItems.length / cart.length) * 100) : 0;

  return (
    <div className="h-full flex flex-col p-4 gap-4" style={{ background: bg }}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <DollarSign size={18} style={{ color: '#10B981' }} />
        <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#10B981' }}>Commission Live</span>
      </div>

      {/* Sale Total + Commission */}
      <div className="rounded-xl border p-4" style={{ borderColor, background: cardBg }}>
        <div className="text-xs mb-1" style={{ color: textSecondary }}>This Sale</div>
        <div className="text-2xl font-bold" style={{ color: textPrimary }}>${saleTotal.toLocaleString()}</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold" style={{ color: '#10B981' }}>+${baseCommission.toLocaleString()}</span>
          <span className="text-xs" style={{ color: textSecondary }}>commission</span>
        </div>
      </div>

      {/* Itemized Breakdown */}
      {cart.length > 0 && (
        <div className="rounded-xl border p-4" style={{ borderColor, background: cardBg }}>
          <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: textSecondary }}>Breakdown</div>
          <div className="space-y-1.5">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between text-xs">
                <span style={{ color: textPrimary }}>{item.product.name}</span>
                <span className="font-mono" style={{ color: '#10B981' }}>+${(item.product.commission * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tier Progress */}
      <div className="rounded-xl border p-4" style={{ borderColor, background: cardBg }}>
        <div className="flex items-center gap-2 mb-2">
          <Award size={14} style={{ color: currentTier.color }} />
          <span className="text-xs font-semibold" style={{ color: currentTier.color }}>{currentTier.tier} Tier</span>
          <span className="text-[10px]" style={{ color: textSecondary }}>({(currentTier.rate * 100).toFixed(1)}% rate)</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? '#334155' : '#E2E8F0' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier?.color ?? currentTier.color})` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px]" style={{ color: textSecondary }}>
          <span>${monthlyRevenue.toLocaleString()} MTD</span>
          {nextTier && <span>${(nextTier.minRevenue - monthlyRevenue).toLocaleString()} to {nextTier.tier}</span>}
        </div>
      </div>

      {/* Projection */}
      <div className="rounded-xl border p-4" style={{ borderColor, background: isDark ? '#10B98110' : '#10B98108' }}>
        <div className="flex items-center gap-2 mb-1">
          <Zap size={14} style={{ color: '#10B981' }} />
          <span className="text-xs font-semibold" style={{ color: '#10B981' }}>What if you close 2 more like this?</span>
        </div>
        <div className="text-lg font-bold" style={{ color: '#10B981' }}>+${projectedWith2More.toLocaleString()}</div>
        <div className="text-[10px]" style={{ color: textSecondary }}>additional commission today</div>
      </div>

      {/* Shift Earnings */}
      <div className="rounded-xl border p-4" style={{ borderColor, background: cardBg }}>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={14} style={{ color: textSecondary }} />
          <span className="text-xs font-semibold" style={{ color: textSecondary }}>Shift Earnings</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold" style={{ color: textPrimary }}>${(shiftEarningsSoFar + thisSaleDelta).toLocaleString()}</span>
          {thisSaleDelta > 0 && (
            <span className="text-xs font-medium" style={{ color: '#10B981' }}>+${thisSaleDelta} this sale</span>
          )}
        </div>
      </div>

      {/* Attach Rate */}
      <div className="rounded-xl border p-4" style={{ borderColor, background: cardBg }}>
        <div className="text-xs font-semibold mb-2" style={{ color: textSecondary }}>Attach Rate Impact</div>
        <div className="flex items-center gap-3">
          <div>
            <div className="text-[10px]" style={{ color: textSecondary }}>Your avg</div>
            <div className="text-sm font-bold" style={{ color: '#EF4444' }}>12%</div>
          </div>
          <span style={{ color: textSecondary }}>&rarr;</span>
          <div>
            <div className="text-[10px]" style={{ color: textSecondary }}>This sale</div>
            <div className="text-sm font-bold" style={{ color: attachRate > 12 ? '#10B981' : '#EF4444' }}>{attachRate}%</div>
          </div>
          <span style={{ color: textSecondary }}>&rarr;</span>
          <div>
            <div className="text-[10px]" style={{ color: textSecondary }}>Floor avg</div>
            <div className="text-sm font-bold" style={{ color: textSecondary }}>31%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
