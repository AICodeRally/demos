'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { FINANCING_TERMS } from '@/lib/swic/data/summit-sleep-pos';

interface FinancingWhatsIfProps {
  saleTotal: number;
  isDark: boolean;
}

export function FinancingWhatsIf({ saleTotal, isDark }: FinancingWhatsIfProps) {
  const [selectedTerm, setSelectedTerm] = useState(0);
  const cardBg = isDark ? '#1E293B' : '#F0F9FF';
  const borderColor = isDark ? '#334155' : '#BAE6FD';
  const textPrimary = isDark ? '#F1F5F9' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';

  const term = FINANCING_TERMS[selectedTerm];
  const monthly = term.months > 0
    ? Math.round(saleTotal / term.months)
    : saleTotal;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard size={14} style={{ color: '#3B82F6' }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3B82F6' }}>
          Financing What-If
        </span>
      </div>
      <div className="rounded-lg border p-3" style={{ borderColor, background: cardBg }}>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {FINANCING_TERMS.map((t, i) => (
            <button
              key={t.months}
              onClick={() => setSelectedTerm(i)}
              className="px-2.5 py-1 rounded text-[10px] font-medium transition-colors"
              style={{
                backgroundColor: selectedTerm === i ? '#3B82F6' : (isDark ? '#334155' : '#E0F2FE'),
                color: selectedTerm === i ? '#FFFFFF' : textSecondary,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-bold" style={{ color: textPrimary }}>
            {term.months > 0 ? `$${monthly}/mo` : `$${saleTotal.toLocaleString()}`}
          </span>
          {term.apr > 0 && (
            <span className="text-[10px]" style={{ color: textSecondary }}>{term.apr}% APR</span>
          )}
        </div>
        <div className="text-xs" style={{ color: '#3B82F6' }}>{term.closeRateData}</div>
        <div className="mt-2 text-[10px] px-2 py-1 rounded" style={{ backgroundColor: isDark ? '#10B98115' : '#10B98110', color: '#10B981' }}>
          Same commission regardless of payment term
        </div>
      </div>
    </div>
  );
}
