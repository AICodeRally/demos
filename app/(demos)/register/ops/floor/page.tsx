'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { REPS, SHIFT_SALES, getRepStatus } from '@/data/register/coaching-data';
import { getInsight } from '@/data/register/ai-insights';

const STATUS_DOT: Record<string, string> = {
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
};

export default function FloorDashboard() {
  const insight = getInsight('ops/floor');

  const stats = [
    { label: 'Traffic Today', value: '142', color: 'var(--register-accent)' },
    { label: 'Active Shoppers', value: '8', color: '#10B981' },
    { label: 'Avg Wait', value: '4 min', color: 'var(--register-warning)' },
    { label: 'Conversion Rate', value: '34%', color: 'var(--register-ai)' },
  ];

  return (
    <RegisterPage title="Floor Dashboard" accentColor="#8B5CF6">
      {/* AI Insight */}
      {insight && (
        <div style={{ marginBottom: 20 }}>
          <AIInsightCard>{insight.text}</AIInsightCard>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              padding: '16px 18px', borderRadius: 12,
              background: 'var(--register-bg-elevated)',
              border: '1px solid var(--register-border)',
            }}
          >
            <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--register-text-dim)', margin: 0 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace', color: stat.color, margin: '4px 0 0' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Shift Sales Table */}
      <div
        style={{
          padding: 18, borderRadius: 12,
          background: 'var(--register-bg-elevated)',
          border: '1px solid var(--register-border)',
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 12 }}>
          Shift Sales
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID', 'Time', 'Items', 'Total', 'Attach %', 'Financing'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: h === 'Total' || h === 'Attach %' ? 'right' : 'left',
                    padding: '8px 10px',
                    fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: 'var(--register-text-dim)',
                    borderBottom: '1px solid var(--register-border)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHIFT_SALES.map((sale, i) => (
              <tr key={sale.id} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--register-bg-surface)' }}>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--register-accent)' }}>
                  {sale.id}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', color: 'var(--register-text-muted)' }}>
                  {sale.time}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', color: 'var(--register-text)' }}>
                  {sale.items.map((it) => it.name).join(', ')}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--register-text)', textAlign: 'right' }}>
                  ${sale.total.toLocaleString()}
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'right', color: sale.attachRate >= 50 ? '#10B981' : '#EF4444' }}>
                  {sale.attachRate}%
                </td>
                <td style={{ padding: '8px 10px', fontSize: '0.75rem', color: sale.financingUsed ? '#10B981' : 'var(--register-text-dim)' }}>
                  {sale.financingUsed ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rep Status Cards */}
      <div>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 12 }}>
          Rep Status
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {REPS.map((rep) => {
            const status = getRepStatus(rep.id);
            const dotColor = status ? STATUS_DOT[status.statusColor] : '#10B981';
            return (
              <div
                key={rep.id}
                style={{
                  padding: 14, borderRadius: 12,
                  background: 'var(--register-bg-elevated)',
                  border: '1px solid var(--register-border)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: 5, background: dotColor, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>{rep.name}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--register-text-muted)', margin: '2px 0 0' }}>
                    {rep.shift} &middot; {status?.statusLabel ?? 'On Target'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--register-text)', margin: 0 }}>
                    ${rep.metrics.shiftRevenue.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '0.6rem', color: 'var(--register-text-dim)', margin: '2px 0 0' }}>shift revenue</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RegisterPage>
  );
}
