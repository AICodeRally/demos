'use client';

import { useState } from 'react';
import { Sparkles, Tablet, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { StatCard, BarChart } from '@/components/demos/register';
import { REPS, SHIFT_SALES } from '@/data/register/coaching-data';

export default function RepAssessmentPage() {
  const [selectedRep] = useState(REPS[0]); // Default to first rep for demo
  const rep = selectedRep;

  const swicBase = process.env.NEXT_PUBLIC_SWIC_URL || 'http://localhost:3010';
  const swicUrl = `${swicBase}/register-pos?mode=training`;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>My Shift Summary</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Real-time performance snapshot and AI coaching for your current shift
        </p>
      </div>

      {/* Rep card */}
      <div className="rounded-xl border p-5 mb-6 flex items-center gap-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
        >
          {rep.avatar}
        </div>
        <div>
          <p className="text-base font-bold" style={{ color: '#0F172A' }}>{rep.name}</p>
          <p className="text-xs" style={{ color: '#94A3B8' }}>{rep.shift} — {rep.store}</p>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="My Attach Rate"
          value={`${rep.metrics.attachRate}%`}
          trend={rep.metrics.attachRate < rep.metrics.floorAvgAttach ? 'down' : 'up'}
          trendValue={`Floor: ${rep.metrics.floorAvgAttach}%`}
          color={rep.metrics.attachRate < rep.metrics.floorAvgAttach ? '#EF4444' : '#10B981'}
        />
        <StatCard
          label="My ASP"
          value={`$${rep.metrics.asp.toLocaleString()}`}
          trend={rep.metrics.asp < rep.metrics.floorAvgAsp ? 'down' : 'up'}
          trendValue={`Floor: $${rep.metrics.floorAvgAsp.toLocaleString()}`}
          color={rep.metrics.asp < rep.metrics.floorAvgAsp ? '#F59E0B' : '#10B981'}
        />
        <StatCard
          label="Financing Pitch"
          value={`${rep.metrics.financingPitch}%`}
          trend={rep.metrics.financingPitch < rep.metrics.floorAvgFinancing ? 'down' : 'up'}
          trendValue={`Floor: ${rep.metrics.floorAvgFinancing}%`}
          color={rep.metrics.financingPitch < rep.metrics.floorAvgFinancing ? '#EF4444' : '#10B981'}
        />
        <StatCard label="Shift Revenue" value={`$${rep.metrics.shiftRevenue.toLocaleString()}`} color="#1E3A5F" />
      </div>

      {/* Performance comparison */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <h2 className="text-base font-bold mb-4" style={{ color: '#0F172A' }}>Performance Snapshot</h2>
        <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>Today vs Weekly Avg vs Floor Avg</p>
        <BarChart
          data={[
            { label: 'Attach Rate', value: rep.metrics.attachRate, color: '#8B5CF6' },
            { label: 'Attach (Weekly)', value: Math.round(rep.metrics.attachRate * 1.1), color: '#C4B5FD' },
            { label: 'Attach (Floor)', value: rep.metrics.floorAvgAttach, color: '#E2E8F0' },
            { label: 'Financing', value: rep.metrics.financingPitch, color: '#8B5CF6' },
            { label: 'Financing (Weekly)', value: Math.round(rep.metrics.financingPitch * 0.95), color: '#C4B5FD' },
            { label: 'Financing (Floor)', value: rep.metrics.floorAvgFinancing, color: '#E2E8F0' },
          ]}
          unit="%"
          maxVal={100}
        />
      </div>

      {/* Last 5 sales */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <h2 className="text-base font-bold mb-4" style={{ color: '#0F172A' }}>
          <ShoppingCart size={16} className="inline mr-2" style={{ color: '#8B5CF6' }} />
          Today&apos;s Sales
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: '#94A3B8' }}>
                <th className="text-left py-2 font-medium">ID</th>
                <th className="text-left py-2 font-medium">Time</th>
                <th className="text-left py-2 font-medium">Items</th>
                <th className="text-right py-2 font-medium">Total</th>
                <th className="text-right py-2 font-medium">Attach</th>
                <th className="text-center py-2 font-medium">Financing</th>
              </tr>
            </thead>
            <tbody>
              {SHIFT_SALES.map((sale) => (
                <tr key={sale.id} className="border-t" style={{ borderColor: '#F1F5F9' }}>
                  <td className="py-3 font-mono text-xs" style={{ color: '#64748B' }}>{sale.id}</td>
                  <td className="py-3" style={{ color: '#0F172A' }}>{sale.time}</td>
                  <td className="py-3" style={{ color: '#0F172A' }}>
                    {sale.items.map((item) => item.name).join(', ')}
                  </td>
                  <td className="py-3 text-right font-mono font-medium" style={{ color: '#0F172A' }}>
                    ${sale.total.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ color: sale.attachRate >= 50 ? '#10B981' : '#EF4444' }}
                    >
                      {sale.attachRate >= 50 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {sale.attachRate}%
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: sale.financingUsed ? '#10B981' : '#E2E8F0' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insight */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: '#DBEAFE' }}>
            <Sparkles size={20} style={{ color: '#2563EB' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: '#0F172A' }}>AI Coaching Insight</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>
              Your attach rate dropped 8% this week compared to last week. Customers who bought a mattress
              were 3x more likely to add an adjustable base when you demonstrated the zero-gravity position.
              Try leading with the base demo right after mattress selection — it takes 90 seconds and adds
              an average of $72 to your commission per sale.
            </p>
          </div>
        </div>
      </div>

      {/* Practice Sale CTA */}
      <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }}>
        <Tablet size={32} className="mx-auto mb-3" style={{ color: '#8B5CF6' }} />
        <h3 className="text-base font-bold mb-1" style={{ color: '#0F172A' }}>Practice a Sale</h3>
        <p className="text-sm mb-4" style={{ color: '#64748B' }}>
          Open the POS simulator to practice bundling and upselling techniques
        </p>
        <button
          onClick={() => window.open(swicUrl, '_blank')}
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
        >
          <Tablet size={16} />
          Practice Sale
        </button>
      </div>
    </>
  );
}
