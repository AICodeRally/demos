'use client';

import { useState, useEffect } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { ANNUAL_SUMMARY, MONTHLY_FINANCIALS, SERVICE_LINE_REVENUE } from '@/data/phoenix-intel/financial-data';
import { DollarSign, TrendingUp, Wallet, CreditCard } from 'lucide-react';

export default function FinancePage() {
  const insight = getInsight('finance');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const summaryCards = [
    { label: 'Total Revenue', value: `$${(ANNUAL_SUMMARY.totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: '#3b6bf5', sub: `+${ANNUAL_SUMMARY.revenueGrowth}% YoY` },
    { label: 'Net Profit', value: `$${(ANNUAL_SUMMARY.netProfit / 1000).toFixed(0)}K`, icon: TrendingUp, color: '#10b981', sub: `${ANNUAL_SUMMARY.profitMargin}% margin` },
    { label: 'Cash Position', value: `$${(ANNUAL_SUMMARY.cashPosition / 1000).toFixed(0)}K`, icon: Wallet, color: '#c9942b', sub: 'Operating balance' },
    { label: 'Accounts Receivable', value: `$${(ANNUAL_SUMMARY.accountsReceivable / 1000).toFixed(0)}K`, icon: CreditCard, color: '#7c3aed', sub: `$${(ANNUAL_SUMMARY.accountsPayable / 1000).toFixed(0)}K payable` },
  ];

  return (
    <PhoenixPage title="Financial Overview" subtitle="Revenue, margins, and financial health" accentColor="#3b6bf5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="phoenix-card" style={{
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: `${i * 0.08}s`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ background: `${card.color}18`, borderRadius: 8, padding: 6, display: 'flex' }}>
                  <Icon size={16} color={card.color} />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{card.label}</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--pi-text)' }}>{card.value}</div>
              <div style={{ fontSize: '0.85rem', color: card.color, fontWeight: 600, marginTop: 4 }}>{card.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend (simplified bar chart) */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Monthly Revenue Trend</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160 }}>
            {MONTHLY_FINANCIALS.map((m) => {
              const maxRev = Math.max(...MONTHLY_FINANCIALS.map(f => f.revenue));
              const height = (m.revenue / maxRev) * 140;
              return (
                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', fontWeight: 600 }}>${(m.revenue / 1000).toFixed(0)}K</div>
                  <div style={{ width: '100%', height, background: 'linear-gradient(to top, #3b6bf5, #6366f1)', borderRadius: '4px 4px 0 0', transition: 'height 0.8s ease-out' }} />
                  <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-faint)' }}>{m.month.split(' ')[0].slice(0, 3)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Line Revenue */}
        <div className="phoenix-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>Revenue by Service Line</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SERVICE_LINE_REVENUE.sort((a, b) => b.revenue - a.revenue).map((sl) => {
              const maxRev = SERVICE_LINE_REVENUE[0].revenue;
              const widthPct = (sl.revenue / maxRev) * 100;
              return (
                <div key={sl.serviceLine}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--pi-text-secondary)', fontWeight: 600 }}>{sl.serviceLine}</span>
                    <span style={{ color: 'var(--pi-text)', fontWeight: 700 }}>${(sl.revenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--pi-border-faint)', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${widthPct}%`, background: '#3b6bf5', borderRadius: 4, transition: 'width 0.8s ease-out' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--pi-text-faint)', marginTop: 2 }}>
                    <span>{sl.engagements} engagements</span>
                    <span>{sl.margin}% margin</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Operations Stack */}
      <div className="phoenix-card" style={{ marginBottom: 20, borderLeft: '3px solid #c9942b' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 8 }}>Financial Operations</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 12 }}>
          Business Manager handles all finance: invoicing, reconciliation, payments, CPA coordination. Weekly AP/AR status report sent to Director of Operations every Friday.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { system: 'QuickBooks Online', role: 'P&L, balance sheets, budget vs. actual', status: 'Active', color: '#10b981' },
            { system: 'Alliance Bank', role: 'Banking, ACH payments, daily balance checks', status: 'Active', color: '#3b6bf5' },
            { system: 'ADP', role: '1099 payroll, tax filings, W-9 collection', status: 'Active', color: '#7c3aed' },
            { system: 'Amex', role: 'Receipt reconciliation, travel reimbursements', status: 'Manual', color: '#c9942b' },
          ].map(s => (
            <div key={s.system} style={{
              padding: '10px 12px', borderRadius: 8,
              background: `${s.color}08`, border: `1px solid ${s.color}20`,
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: s.color }}>{s.system}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{s.role}</div>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: 4, marginTop: 4, display: 'inline-block',
                background: s.status === 'Active' ? '#10b98120' : '#c9942b20',
                color: s.status === 'Active' ? '#10b981' : '#c9942b',
              }}>{s.status}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '8px 12px', borderRadius: 6, background: '#ef444408', border: '1px solid #ef444420' }}>
          <CreditCard size={14} color="#ef4444" />
          <span style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)' }}>
            <strong style={{ color: '#ef4444' }}>Pain point:</strong> Client payments still deposited via physical checks at Alliance Bank. Remote/mobile deposit capability recommended.
          </span>
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
