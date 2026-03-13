'use client';

import { useState } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { STATEMENTS, type MonthlyStatement } from '@/data/register/comp-data';

const ACCENT = '#10B981';

function fmtCurrency(val: number): string {
  if (val === 0) return '\u2014';
  return val < 0 ? `-$${Math.abs(val).toFixed(2)}` : `$${val.toFixed(2)}`;
}

function StatementDoc({ stmt }: { stmt: MonthlyStatement }) {
  const totalLineItems = stmt.lineItems.reduce((sum, li) => sum + li.amount, 0);
  const totalAdjustments = stmt.adjustments.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)' }}
    >
      {/* Document Header */}
      <div className="px-8 py-6" style={{ backgroundColor: '#1E3A5F' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#93C5FD' }}>
              Commission Statement
            </p>
            <p className="text-xl font-bold text-white">Summit Sleep Co.</p>
          </div>
          <div className="text-right">
            <p className="text-[11px]" style={{ color: '#93C5FD' }}>Period</p>
            <p className="text-sm font-bold text-white">{stmt.periodLabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-4" style={{ borderTop: '1px solid #2D5A8E' }}>
          <div>
            <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#93C5FD' }}>Rep Name</p>
            <p className="text-sm font-semibold text-white">{stmt.repName}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#93C5FD' }}>Store</p>
            <p className="text-sm font-semibold text-white">{stmt.store}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: '#93C5FD' }}>Plan</p>
            <p className="text-xs font-semibold text-white">{stmt.planName}</p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="px-8 py-6">
        <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--register-text-muted)' }}>
          Compensation Components
        </p>
        <table className="w-full text-sm mb-6">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--register-border)' }}>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Category</th>
              <th className="text-left py-2 pr-4 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Description</th>
              <th className="text-right py-2 font-semibold" style={{ color: 'var(--register-text-muted)' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {stmt.lineItems.map((li, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--register-border)' }}>
                <td className="py-2.5 pr-4 font-semibold" style={{ color: 'var(--register-text)' }}>{li.category}</td>
                <td className="py-2.5 pr-4" style={{ color: 'var(--register-text-muted)' }}>{li.description}</td>
                <td
                  className="py-2.5 text-right font-mono font-semibold"
                  style={{ color: li.amount === 0 ? 'var(--register-text-muted)' : 'var(--register-text)' }}
                >
                  {fmtCurrency(li.amount)}
                </td>
              </tr>
            ))}
            <tr style={{ borderTop: '2px solid var(--register-border)' }}>
              <td className="pt-3 pr-4 font-bold" style={{ color: 'var(--register-text)' }}>Subtotal</td>
              <td />
              <td className="pt-3 text-right font-mono font-bold text-base" style={{ color: 'var(--register-text)' }}>
                ${totalLineItems.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Adjustments */}
        {stmt.adjustments.length > 0 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--register-text-muted)' }}>
              Adjustments
            </p>
            <table className="w-full text-sm mb-6">
              <tbody>
                {stmt.adjustments.map((adj, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--register-border)' }}>
                    <td className="py-2.5 pr-4 font-semibold" style={{ color: '#F59E0B' }}>{adj.category}</td>
                    <td className="py-2.5 pr-4" style={{ color: 'var(--register-text-muted)' }}>{adj.description}</td>
                    <td className="py-2.5 text-right font-mono font-semibold" style={{ color: ACCENT }}>
                      {adj.amount >= 0 ? '+' : ''}{fmtCurrency(adj.amount)}
                    </td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid var(--register-border)' }}>
                  <td className="pt-3 pr-4 font-bold" style={{ color: 'var(--register-text)' }}>Adjustments Total</td>
                  <td />
                  <td className="pt-3 text-right font-mono font-bold text-base" style={{ color: ACCENT }}>
                    {totalAdjustments >= 0 ? '+' : ''}{fmtCurrency(totalAdjustments)}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {/* Net Payout */}
        <div
          className="rounded-xl px-6 py-5 flex items-center justify-between"
          style={{ background: 'rgba(16,185,129,0.08)', borderLeft: `4px solid ${ACCENT}` }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>
              Net Payout
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--register-text-muted)' }}>
              Deposited on next pay date
            </p>
          </div>
          <p className="text-3xl font-bold" style={{ color: ACCENT }}>
            ${stmt.netPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StatementsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState(STATEMENTS[0].period);
  const currentStatement = STATEMENTS.find((s) => s.period === selectedPeriod) ?? STATEMENTS[0];

  return (
    <RegisterPage title="Commission Statements" subtitle="Casey Miller — Flagship #12" accentColor={ACCENT}>
      {/* Period Selector Tabs */}
      <div className="flex items-center gap-2 mb-8">
        {STATEMENTS.map((stmt) => (
          <button
            key={stmt.period}
            onClick={() => setSelectedPeriod(stmt.period)}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: stmt.period === selectedPeriod ? ACCENT : 'var(--register-bg-elevated)',
              color: stmt.period === selectedPeriod ? '#FFFFFF' : 'var(--register-text-muted)',
              border: `1px solid ${stmt.period === selectedPeriod ? ACCENT : 'var(--register-border)'}`,
            }}
          >
            {stmt.periodLabel}
          </button>
        ))}
      </div>

      <StatementDoc stmt={currentStatement} />
    </RegisterPage>
  );
}
