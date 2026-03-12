'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Tablet, TrendingDown, TrendingUp, Sparkles, MessageSquare } from 'lucide-react';
import { StatCard } from '@/components/demos/register';
import { getRepById, getScenarioByRepId } from '@/data/register/coaching-data';

export default function RepCoachingClient({ params }: { params: Promise<{ id: string }> }) {
  const { id: repId } = use(params);
  const rep = getRepById(repId);
  const scenario = getScenarioByRepId(repId);

  if (!rep || !scenario) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: '#94A3B8' }}>Rep not found</p>
      </div>
    );
  }

  const swicBase = process.env.NEXT_PUBLIC_SWIC_URL || 'http://localhost:3010';
  const swicUrl = `${swicBase}/register-pos?scenario=${repId}`;

  return (
    <>
      {/* Back nav */}
      <Link
        href="/register/ops/manager"
        className="inline-flex items-center gap-2 mb-6 text-sm font-medium transition-colors hover:opacity-80"
        style={{ color: '#8B5CF6' }}
      >
        <ArrowLeft size={16} />
        Back to Manager Console
      </Link>

      {/* Rep header */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
          >
            {rep.avatar}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#0F172A' }}>{rep.name}</h1>
            <p className="text-sm" style={{ color: '#64748B' }}>{rep.role} — {rep.store}</p>
            <p className="text-xs" style={{ color: '#94A3B8' }}>{rep.shift}</p>
          </div>
          <div className="ml-auto">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
            >
              <TrendingDown size={12} />
              {scenario.weaknessLabel}
            </span>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Attach Rate" value={`${rep.metrics.attachRate}%`} trend="down" trendValue={`Floor avg: ${rep.metrics.floorAvgAttach}%`} color="#EF4444" />
          <StatCard label="Financing Pitch" value={`${rep.metrics.financingPitch}%`} trend={rep.metrics.financingPitch < rep.metrics.floorAvgFinancing ? 'down' : 'up'} trendValue={`Floor avg: ${rep.metrics.floorAvgFinancing}%`} color={rep.metrics.financingPitch < rep.metrics.floorAvgFinancing ? '#EF4444' : '#10B981'} />
          <StatCard label="Avg Sale Price" value={`$${rep.metrics.asp.toLocaleString()}`} trend={rep.metrics.asp < rep.metrics.floorAvgAsp ? 'down' : 'up'} trendValue={`Floor avg: $${rep.metrics.floorAvgAsp.toLocaleString()}`} color={rep.metrics.asp < rep.metrics.floorAvgAsp ? '#F59E0B' : '#10B981'} />
          <StatCard label="Shift Revenue" value={`$${rep.metrics.shiftRevenue.toLocaleString()}`} color="#1E3A5F" />
        </div>
      </div>

      {/* Split view: What they did vs What they should do */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Left: What they did */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFF1F2', borderColor: '#FECDD3' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={18} className="text-red-500" />
            <h2 className="text-base font-bold" style={{ color: '#0F172A' }}>What They Did</h2>
          </div>
          <p className="text-sm mb-3" style={{ color: '#64748B' }}>Last sale — missed opportunity</p>

          <div className="space-y-2 mb-4">
            {scenario.lastSale.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span style={{ color: '#0F172A' }}>{item.name}</span>
                <span className="font-mono font-medium" style={{ color: '#0F172A' }}>${item.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between text-sm font-bold" style={{ borderColor: '#FECDD3' }}>
              <span style={{ color: '#0F172A' }}>Total</span>
              <span style={{ color: '#0F172A' }}>${scenario.lastSale.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-4 text-xs" style={{ color: '#64748B' }}>
            <span>Attach Rate: {scenario.lastSale.attachRate}%</span>
            <span>Financing: {scenario.lastSale.financingUsed ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {/* Right: What they should do */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-green-500" />
            <h2 className="text-base font-bold" style={{ color: '#0F172A' }}>What They Should Do</h2>
          </div>
          <p className="text-sm mb-3" style={{ color: '#64748B' }}>{scenario.recommendation.action}</p>

          {scenario.recommendation.products.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#10B981' }}>Recommended Add-ons</p>
              {scenario.recommendation.products.map((product, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span style={{ color: '#0F172A' }}>{product.name}</span>
                  <span className="font-mono font-medium" style={{ color: '#10B981' }}>+${product.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          <div
            className="rounded-lg p-3 flex items-center gap-2"
            style={{ backgroundColor: '#DCFCE7' }}
          >
            <Sparkles size={16} className="text-green-600" />
            <span className="text-sm font-semibold" style={{ color: '#166534' }}>
              +${scenario.recommendation.commissionDelta} commission per sale
            </span>
          </div>
        </div>
      </div>

      {/* Coaching Script */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={18} style={{ color: '#8B5CF6' }} />
          <h2 className="text-base font-bold" style={{ color: '#0F172A' }}>Coaching Script</h2>
        </div>
        <ol className="space-y-3">
          {scenario.recommendation.script.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm" style={{ color: '#334155' }}>
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#8B5CF6' }}>
                {i + 1}
              </span>
              <span className="pt-0.5">{point}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Open on iPad CTA */}
      <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
        <Tablet size={32} className="mx-auto mb-3" style={{ color: '#1E3A5F' }} />
        <h3 className="text-base font-bold mb-1" style={{ color: '#0F172A' }}>Practice This Scenario on iPad</h3>
        <p className="text-sm mb-4" style={{ color: '#64748B' }}>
          Open the POS simulator pre-loaded with {rep.name.split(' ')[0]}&apos;s scenario
        </p>
        <button
          onClick={() => window.open(swicUrl, '_blank')}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #1E3A5F, #06B6D4)' }}
        >
          <Tablet size={16} />
          Open on iPad
        </button>
      </div>
    </>
  );
}
