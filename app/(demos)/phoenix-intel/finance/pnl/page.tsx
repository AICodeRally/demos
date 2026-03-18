'use client';

import { useState } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { PNL_CATEGORIES, CLIENT_REVENUE, STATE_REVENUE, BUDGET_VARIANCE } from '@/data/phoenix-intel/financial-data';

type ViewMode = 'summary' | 'client' | 'state' | 'variance';

export default function PnlPage() {
  const insight = getInsight('finance/pnl');
  const [view, setView] = useState<ViewMode>('summary');

  const totalRevenue = PNL_CATEGORIES.revenue.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = PNL_CATEGORIES.expenses.reduce((s, e) => s + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  const views: { key: ViewMode; label: string }[] = [
    { key: 'summary', label: 'P&L Summary' },
    { key: 'client', label: 'By Client' },
    { key: 'state', label: 'By State' },
    { key: 'variance', label: 'Budget Variance' },
  ];

  return (
    <PhoenixPage title="Profit & Loss" subtitle="YTD financial performance by service line, client, and state" accentColor="#3b6bf5">
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {views.map(v => (
          <button key={v.key} onClick={() => setView(v.key)} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', border: 'none',
            background: view === v.key ? 'var(--pi-sapphire)' : 'var(--pi-card)',
            color: view === v.key ? '#fff' : 'var(--pi-text-muted)',
          }}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'summary' && (
        <div className="phoenix-card" style={{ marginBottom: 20 }}>
          <h3 className="pi-section-title">Income Statement (YTD)</h3>
          <div className="pi-overline" style={{ color: '#10b981', marginBottom: 8 }}>Revenue</div>
          {PNL_CATEGORIES.revenue.map(r => (
            <div key={r.category} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
              <span className="pi-body" style={{ color: 'var(--pi-text-secondary)' }}>{r.category}</span>
              <span className="pi-label">${r.amount.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 800, borderBottom: '2px solid var(--pi-sapphire)' }}>
            <span className="pi-label">Total Revenue</span>
            <span className="pi-label" style={{ color: '#10b981' }}>${totalRevenue.toLocaleString()}</span>
          </div>

          <div className="pi-overline" style={{ color: '#ef4444', marginTop: 16, marginBottom: 8 }}>Expenses</div>
          {PNL_CATEGORIES.expenses.map(e => (
            <div key={e.category} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
              <span className="pi-body" style={{ color: 'var(--pi-text-secondary)' }}>{e.category}</span>
              <span className="pi-label">(${e.amount.toLocaleString()})</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 800, borderBottom: '2px solid var(--pi-sapphire)' }}>
            <span className="pi-label">Total Expenses</span>
            <span className="pi-label" style={{ color: '#ef4444' }}>(${totalExpenses.toLocaleString()})</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', marginTop: 8 }}>
            <span className="pi-subheading">Net Income</span>
            <span className="pi-subheading" style={{ color: netIncome >= 0 ? '#10b981' : '#ef4444' }}>${netIncome.toLocaleString()}</span>
          </div>
        </div>
      )}

      {view === 'client' && (
        <div className="phoenix-card" style={{ marginBottom: 20 }}>
          <h3 className="pi-section-title">Revenue by Client</h3>
          {CLIENT_REVENUE.map(c => {
            const pct = (c.revenue / totalRevenue) * 100;
            return (
              <div key={c.clientName} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="pi-label" style={{ fontWeight: 600 }}>{c.clientName}</span>
                  <span className="pi-label">${(c.revenue / 1000).toFixed(0)}K ({pct.toFixed(1)}%)</span>
                </div>
                <div className="pi-bar-track" style={{ height: 8, borderRadius: 4 }}>
                  <div className="pi-bar-fill" style={{ width: `${pct}%`, background: '#3b6bf5', borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'state' && (
        <div className="phoenix-card" style={{ marginBottom: 20 }}>
          <h3 className="pi-section-title">Revenue by State</h3>
          {STATE_REVENUE.map(s => {
            const pct = (s.revenue / totalRevenue) * 100;
            return (
              <div key={s.state} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="pi-label" style={{ fontWeight: 600 }}>{s.state} ({s.clients} client{s.clients > 1 ? 's' : ''})</span>
                  <span className="pi-label">${(s.revenue / 1000).toFixed(0)}K</span>
                </div>
                <div className="pi-bar-track" style={{ height: 8, borderRadius: 4 }}>
                  <div className="pi-bar-fill" style={{ width: `${pct}%`, background: '#c9942b', borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'variance' && (
        <div className="phoenix-card" style={{ marginBottom: 20 }}>
          <h3 className="pi-section-title">Budget vs Actual</h3>
          {BUDGET_VARIANCE.map(v => (
            <div key={v.category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--pi-border-faint)' }}>
              <span className="pi-label" style={{ fontWeight: 600 }}>{v.category}</span>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <span className="pi-body-muted" style={{ width: 80, textAlign: 'right' }}>${(v.budgeted / 1000).toFixed(0)}K</span>
                <span className="pi-label" style={{ width: 80, textAlign: 'right' }}>${(v.actual / 1000).toFixed(0)}K</span>
                <span className="pi-label" style={{ width: 80, textAlign: 'right', color: v.variance >= 0 ? '#10b981' : '#ef4444' }}>
                  {v.variance >= 0 ? '+' : ''}${(v.variance / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
