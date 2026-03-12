'use client';

import { useState } from 'react';
import { STATEMENTS, type MonthlyStatement } from '@/data/register/comp-data';

function fmtCurrency(val: number): string {
  if (val === 0) return '—';
  return val < 0
    ? `-$${Math.abs(val).toFixed(2)}`
    : `$${val.toFixed(2)}`;
}

function StatementDoc({ stmt }: { stmt: MonthlyStatement }) {
  const totalLineItems = stmt.lineItems.reduce((sum, li) => sum + li.amount, 0);
  const totalAdjustments = stmt.adjustments.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div
      className="rounded-xl border bg-white"
      style={{ borderColor: '#CBD5E1', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      {/* Document Header */}
      <div
        className="px-8 py-6 rounded-t-xl"
        style={{ backgroundColor: '#1E3A5F' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#93C5FD' }}>
              Commission Statement
            </p>
            <p className="text-xl font-bold text-white">Summit Sleep Co.</p>
          </div>
          <div className="text-right">
            <p className="text-[11px]" style={{ color: '#93C5FD' }}>Period</p>
            <p className="text-[14px] font-bold text-white">{stmt.periodLabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t" style={{ borderColor: '#2D5A8E' }}>
          <div>
            <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#93C5FD' }}>Rep Name</p>
            <p className="text-[13px] font-semibold text-white">{stmt.repName}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#93C5FD' }}>Store</p>
            <p className="text-[13px] font-semibold text-white">{stmt.store}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#93C5FD' }}>Plan</p>
            <p className="text-[12px] font-semibold text-white">{stmt.planName}</p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="px-8 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide mb-4" style={{ color: '#94A3B8' }}>
          Compensation Components
        </p>
        <table className="w-full text-[12px] mb-6">
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Category</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Description</th>
              <th className="text-right py-2 font-semibold" style={{ color: '#94A3B8' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {stmt.lineItems.map((li, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F8FAFC' }}>
                <td className="py-2.5 pr-4 font-semibold" style={{ color: '#1E3A5F' }}>{li.category}</td>
                <td className="py-2.5 pr-4" style={{ color: '#475569' }}>{li.description}</td>
                <td
                  className="py-2.5 text-right font-mono font-semibold"
                  style={{ color: li.amount === 0 ? '#CBD5E1' : '#0F172A' }}
                >
                  {fmtCurrency(li.amount)}
                </td>
              </tr>
            ))}
            <tr style={{ borderTop: '2px solid #E2E8F0' }}>
              <td className="pt-3 pr-4 text-[12px] font-bold" style={{ color: '#0F172A' }}>Subtotal</td>
              <td />
              <td className="pt-3 text-right font-mono font-bold text-[13px]" style={{ color: '#0F172A' }}>
                ${totalLineItems.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Adjustments */}
        {stmt.adjustments.length > 0 && (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#94A3B8' }}>
              Adjustments
            </p>
            <table className="w-full text-[12px] mb-6">
              <tbody>
                {stmt.adjustments.map((adj, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td className="py-2.5 pr-4 font-semibold" style={{ color: '#F59E0B' }}>{adj.category}</td>
                    <td className="py-2.5 pr-4" style={{ color: '#475569' }}>{adj.description}</td>
                    <td className="py-2.5 text-right font-mono font-semibold" style={{ color: '#10B981' }}>
                      {adj.amount >= 0 ? '+' : ''}{fmtCurrency(adj.amount)}
                    </td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid #E2E8F0' }}>
                  <td className="pt-3 pr-4 text-[12px] font-bold" style={{ color: '#0F172A' }}>Adjustments Total</td>
                  <td />
                  <td className="pt-3 text-right font-mono font-bold text-[13px]" style={{ color: '#10B981' }}>
                    {totalAdjustments >= 0 ? '+' : ''}{fmtCurrency(totalAdjustments)}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {/* Net Payout */}
        <div
          className="rounded-xl px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: '#F0FDF4', borderLeft: '4px solid #10B981' }}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#16A34A' }}>
              Net Payout
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: '#475569' }}>Deposited on next pay date</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
            ${stmt.netPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Download button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => alert('PDF download coming in production')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold border transition-all hover:shadow-sm"
            style={{ borderColor: '#CBD5E1', color: '#475569' }}
          >
            <span>⬇</span> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Statements() {
  const [selectedPeriod, setSelectedPeriod] = useState(STATEMENTS[0].period);

  const currentStatement = STATEMENTS.find((s) => s.period === selectedPeriod) ?? STATEMENTS[0];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Commission Statements</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Formal pay statements by period — review, verify, and download
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-[12px] font-semibold" style={{ color: '#475569' }}>Period:</span>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="rounded-lg border px-3 py-1.5 text-[13px] font-medium outline-none"
          style={{ borderColor: '#E2E8F0', color: '#0F172A', backgroundColor: '#FFFFFF' }}
        >
          {STATEMENTS.map((s) => (
            <option key={s.period} value={s.period}>
              {s.periodLabel}
            </option>
          ))}
        </select>
      </div>

      <StatementDoc stmt={currentStatement} />
    </>
  );
}
