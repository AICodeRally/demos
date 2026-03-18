'use client';

import { useState, useEffect } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { MetricCardWithIcon } from '@/components/demos/phoenix-intel/MetricCard';
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" role="region" aria-label="Financial summary">
        {summaryCards.map((card, i) => (
          <MetricCardWithIcon
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            color={card.color}
            sub={card.sub}
            mounted={mounted}
            delay={i * 0.08}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="phoenix-card" role="region" aria-label="Monthly revenue trend">
          <h3 className="pi-section-title">Monthly Revenue Trend</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160 }}>
            {MONTHLY_FINANCIALS.map((m) => {
              const maxRev = Math.max(...MONTHLY_FINANCIALS.map(f => f.revenue));
              const height = (m.revenue / maxRev) * 140;
              return (
                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span className="pi-caption" style={{ fontWeight: 600 }}>${(m.revenue / 1000).toFixed(0)}K</span>
                  <div
                    style={{ width: '100%', height, background: 'linear-gradient(to top, #3b6bf5, #6366f1)', borderRadius: '4px 4px 0 0', transition: 'height 0.8s ease-out' }}
                    role="img"
                    aria-label={`${m.month}: $${(m.revenue / 1000).toFixed(0)}K`}
                  />
                  <span className="pi-caption">{m.month.split(' ')[0].slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Line Revenue */}
        <div className="phoenix-card" role="region" aria-label="Revenue by service line">
          <h3 className="pi-section-title">Revenue by Service Line</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SERVICE_LINE_REVENUE.sort((a, b) => b.revenue - a.revenue).map((sl) => {
              const maxRev = SERVICE_LINE_REVENUE[0].revenue;
              const widthPct = (sl.revenue / maxRev) * 100;
              return (
                <div key={sl.serviceLine}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span className="pi-label" style={{ fontWeight: 600 }}>{sl.serviceLine}</span>
                    <span className="pi-label">${(sl.revenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="pi-bar-track" style={{ height: 8, borderRadius: 4 }}>
                    <div className="pi-bar-fill" style={{ width: `${widthPct}%`, background: '#3b6bf5', borderRadius: 4 }} />
                  </div>
                  <div className="pi-caption" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
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
      <div className="phoenix-card" style={{ marginBottom: 20, borderLeft: '3px solid #c9942b' }} role="region" aria-label="Financial operations">
        <h3 className="pi-section-title" style={{ marginBottom: 8 }}>Financial Operations</h3>
        <p className="pi-body-muted" style={{ marginBottom: 12 }}>
          Business Manager handles all finance: invoicing, reconciliation, payments, CPA coordination. Weekly AP/AR status report sent to Director of Operations every Friday.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pi-stack-sm">
          {[
            { system: 'QuickBooks Online', role: 'P&L, balance sheets, budget vs. actual', status: 'Active', color: '#10b981' },
            { system: 'Alliance Bank', role: 'Banking, ACH payments, daily balance checks', status: 'Active', color: '#3b6bf5' },
            { system: 'ADP', role: '1099 payroll, tax filings, W-9 collection', status: 'Active', color: '#7c3aed' },
            { system: 'Amex', role: 'Receipt reconciliation, travel reimbursements', status: 'Manual', color: '#c9942b' },
          ].map(s => (
            <div key={s.system} className="pi-metric-tile" style={{
              background: `${s.color}08`, border: `1px solid ${s.color}20`,
            }}>
              <div className="pi-label" style={{ color: s.color }}>{s.system}</div>
              <div className="pi-caption" style={{ marginTop: 2 }}>{s.role}</div>
              <span className="pi-badge" style={{
                marginTop: 4,
                background: s.status === 'Active' ? '#10b98120' : '#c9942b20',
                color: s.status === 'Active' ? '#10b981' : '#c9942b',
              }}>{s.status}</span>
            </div>
          ))}
        </div>
        <div className="pi-alert pi-alert-danger" style={{ marginTop: 10, marginBottom: 0 }}>
          <CreditCard size={14} color="#ef4444" aria-hidden="true" />
          <span className="pi-caption">
            <strong style={{ color: '#ef4444' }}>Pain point:</strong> Client payments still deposited via physical checks at Alliance Bank. Remote/mobile deposit capability recommended.
          </span>
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
