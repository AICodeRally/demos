'use client';

import { useState } from 'react';
import { PAYMENTS, PAYMENT_STATUS_COLORS } from '@/data/lotos';
import { StatusBadge } from '@/components/demos/lotos';

const CASHFLOW_PROJECTION = [
  { period: 'Week 1 (Apr 1-7)', inflows: 45000, outflows: 32000, sources: 'DL-2026-004 funding, DL-2026-005 expected', expenses: 'Payroll, floorplan interest', inflowItems: [{ label: 'DL-2026-004 funding', amount: 28000 }, { label: 'DL-2026-005 expected close', amount: 12000 }, { label: 'BHPH payments', amount: 5000 }], outflowItems: [{ label: 'Payroll', amount: 18000 }, { label: 'Floorplan interest', amount: 8500 }, { label: 'Utilities', amount: 3000 }, { label: 'Misc', amount: 2500 }] },
  { period: 'Week 2 (Apr 8-14)', inflows: 38000, outflows: 28000, sources: '2 projected sales at avg gross', expenses: 'Rent, marketing', inflowItems: [{ label: 'Projected sale #1', amount: 18000 }, { label: 'Projected sale #2', amount: 16000 }, { label: 'BHPH collections', amount: 4000 }], outflowItems: [{ label: 'Rent', amount: 12000 }, { label: 'Marketing', amount: 8000 }, { label: 'Parts/supplies', amount: 5000 }, { label: 'Misc', amount: 3000 }] },
  { period: 'Week 3 (Apr 15-21)', inflows: 52000, outflows: 35000, sources: '3 projected sales, BHPH payments', expenses: 'Payroll, auction purchases', inflowItems: [{ label: 'Projected sale #1', amount: 22000 }, { label: 'Projected sale #2', amount: 18000 }, { label: 'Projected sale #3', amount: 8000 }, { label: 'BHPH payments', amount: 4000 }], outflowItems: [{ label: 'Payroll', amount: 18000 }, { label: 'Auction purchases', amount: 12000 }, { label: 'Insurance', amount: 3000 }, { label: 'Misc', amount: 2000 }] },
  { period: 'Week 4 (Apr 22-30)', inflows: 48000, outflows: 30000, sources: '2-3 projected sales', expenses: 'Insurance, utilities', inflowItems: [{ label: 'Projected sale #1', amount: 20000 }, { label: 'Projected sale #2', amount: 18000 }, { label: 'Projected sale #3', amount: 6000 }, { label: 'BHPH payments', amount: 4000 }], outflowItems: [{ label: 'Insurance', amount: 12000 }, { label: 'Utilities', amount: 6000 }, { label: 'Recon costs', amount: 8000 }, { label: 'Misc', amount: 4000 }] },
  { period: 'May (30-60d)', inflows: 165000, outflows: 120000, sources: 'Projected 12-14 unit sales', expenses: 'Standard operating', inflowItems: [{ label: 'Vehicle sales (12-14 units)', amount: 148000 }, { label: 'BHPH collections', amount: 12000 }, { label: 'F&I products', amount: 5000 }], outflowItems: [{ label: 'Payroll (2 cycles)', amount: 36000 }, { label: 'Rent', amount: 12000 }, { label: 'Inventory acquisition', amount: 48000 }, { label: 'Operating expenses', amount: 24000 }] },
  { period: 'June (60-90d)', inflows: 180000, outflows: 125000, sources: 'Summer buying season boost', expenses: 'Standard operating + marketing push', inflowItems: [{ label: 'Vehicle sales (14-16 units)', amount: 162000 }, { label: 'BHPH collections', amount: 12000 }, { label: 'F&I products', amount: 6000 }], outflowItems: [{ label: 'Payroll (2 cycles)', amount: 36000 }, { label: 'Rent', amount: 12000 }, { label: 'Inventory acquisition', amount: 52000 }, { label: 'Marketing push', amount: 15000 }, { label: 'Operating', amount: 10000 }] },
];

const STARTING_CASH = 125000;

type Scenario = 'conservative' | 'expected' | 'optimistic';
const SCENARIO_MULTIPLIERS: Record<Scenario, number> = {
  conservative: 0.8,
  expected: 1.0,
  optimistic: 1.2,
};

function buildRunningBalance(scenario: Scenario) {
  const mult = SCENARIO_MULTIPLIERS[scenario];
  let balance = STARTING_CASH;
  return CASHFLOW_PROJECTION.map((row) => {
    const inflows = Math.round(row.inflows * mult);
    const outflows = row.outflows;
    const net = inflows - outflows;
    balance += net;
    return { period: row.period, inflows, outflows, net, runningBalance: balance };
  });
}

export default function LotosCashflowPage() {
  const [scenario, setScenario] = useState<Scenario>('expected');
  const [expandedPeriod, setExpandedPeriod] = useState<number | null>(null);

  const mult = SCENARIO_MULTIPLIERS[scenario];
  const runningBalance = buildRunningBalance(scenario);
  const maxBalance = Math.max(STARTING_CASH, ...runningBalance.map((r) => r.runningBalance));

  const projected30 = runningBalance.slice(0, 4).reduce((sum, r) => sum + r.net, 0);
  const projected60 = runningBalance.slice(0, 5).reduce((sum, r) => sum + r.net, 0);
  const projected90 = runningBalance.reduce((sum, r) => sum + r.net, 0);

  return (
    <div className="lot-page">
      <div style={{ marginBottom: '24px' }}>
        <h1 className="lot-heading">
          Cashflow Forecast
        </h1>
        <p className="lot-description">
          30 / 60 / 90-day cash position projection with weekly detail
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {(['conservative', 'expected', 'optimistic'] as Scenario[]).map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className={scenario === s ? 'lot-btn lot-btn-active' : 'lot-btn'}
            style={{ textTransform: 'capitalize' }}
          >
            {s} {s === 'conservative' ? '(0.8x)' : s === 'expected' ? '(1.0x)' : '(1.2x)'}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {[
          { label: 'Current Cash Position', value: STARTING_CASH, color: 'var(--lot-text)', note: 'As of Apr 1, 2026' },
          { label: '30-Day Projected', value: projected30, color: projected30 >= 0 ? '#16A34A' : '#DC2626', note: 'Net inflow/outflow', prefix: projected30 >= 0 ? '+' : '' },
          { label: '60-Day Projected', value: projected60, color: projected60 >= 0 ? '#16A34A' : '#DC2626', note: 'Cumulative net', prefix: projected60 >= 0 ? '+' : '' },
          { label: '90-Day Projected', value: projected90, color: projected90 >= 0 ? '#16A34A' : '#DC2626', note: 'Cumulative net', prefix: projected90 >= 0 ? '+' : '' },
        ].map(({ label, value, color, note, prefix = '' }) => (
          <div
            key={label}
            className="lot-card lot-animate-in"
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--lot-text-muted)', marginBottom: '6px' }}>
              {label}
            </div>
            <div className="text-3xl font-bold" style={{ color }}>
              {prefix}${Math.abs(value).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginTop: '4px' }}>{note}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Floorplan Alert
          </div>
          <div style={{ fontSize: '15px', color: '#78350F', fontWeight: 600 }}>
            2 units approaching 90-day mark
          </div>
          <div style={{ fontSize: '14px', color: '#92400E', marginTop: '2px' }}>
            Curtailment payoff required: <strong>$66,500</strong>
          </div>
        </div>
        <div
          style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            BHPH Collections
          </div>
          <div style={{ fontSize: '15px', color: '#1E3A8A', fontWeight: 600 }}>
            Collections due this pay period
          </div>
          <div style={{ fontSize: '14px', color: '#1E40AF', marginTop: '2px' }}>
            Expected BHPH payment: <strong>$850</strong>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <h2 className="lot-subheading">Inflows vs Outflows</h2>
      </div>
      <div
        className="lot-card"
        style={{ overflowX: 'auto', marginBottom: '28px', padding: 0 }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--lot-border-faint)' }}>
              {['Period', 'Inflows', 'Outflows', 'Net', 'Sources', 'Expenses'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 14px',
                    textAlign: 'left',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    color: 'var(--lot-text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CASHFLOW_PROJECTION.map((row, idx) => {
              const inflows = Math.round(row.inflows * mult);
              const outflows = row.outflows;
              const net = inflows - outflows;
              const isExpanded = expandedPeriod === idx;
              return (
                <>
                  <tr
                    key={row.period}
                    style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--lot-border-faint)', cursor: 'pointer', background: isExpanded ? 'var(--lot-card-alt)' : 'transparent' }}
                    onClick={() => setExpandedPeriod(isExpanded ? null : idx)}
                  >
                    <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 600, color: 'var(--lot-text)', whiteSpace: 'nowrap' }}>
                      {row.period}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 700, color: '#16A34A', whiteSpace: 'nowrap' }}>
                      +${inflows.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 700, color: '#DC2626', whiteSpace: 'nowrap' }}>
                      -${outflows.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: '12px 14px',
                        fontSize: '14px',
                        fontWeight: 800,
                        color: net >= 0 ? '#16A34A' : '#DC2626',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {net >= 0 ? '+' : '-'}${Math.abs(net).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', color: 'var(--lot-text-secondary)', minWidth: '200px' }}>
                      {row.sources}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', color: 'var(--lot-text-secondary)', minWidth: '180px' }}>
                      {row.expenses}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${row.period}-detail`} style={{ borderBottom: '1px solid var(--lot-border-faint)' }}>
                      <td colSpan={6} style={{ padding: '0 14px 16px 14px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '12px 16px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Inflow Breakdown
                            </div>
                            {row.inflowItems.map((item) => (
                              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>{item.label}</span>
                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A' }}>+${Math.round(item.amount * mult).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '12px 16px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Outflow Breakdown
                            </div>
                            {row.outflowItems.map((item) => (
                              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>{item.label}</span>
                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626' }}>-${item.amount.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <h2 className="lot-subheading">
          BHPH Collections
        </h2>
      </div>
      <div
        className="lot-card"
        style={{ overflowX: 'auto', marginBottom: '28px', padding: 0 }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--lot-border-faint)' }}>
              {['Payment ID', 'Deal', 'Amount', 'Due Date', 'Paid Date', 'Status'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 14px',
                    textAlign: 'left',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    color: 'var(--lot-text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((pmt) => (
              <tr key={pmt.id} style={{ borderBottom: '1px solid var(--lot-border-faint)' }}>
                <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 600, color: 'var(--lot-text)' }}>{pmt.id}</td>
                <td style={{ padding: '12px 14px', fontSize: '14px', color: 'var(--lot-text-secondary)' }}>{pmt.dealId}</td>
                <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 700, color: 'var(--lot-text)' }}>${pmt.amount.toLocaleString()}</td>
                <td style={{ padding: '12px 14px', fontSize: '14px', color: 'var(--lot-text-secondary)' }}>{pmt.dueDate}</td>
                <td style={{ padding: '12px 14px', fontSize: '14px', color: 'var(--lot-text-secondary)' }}>{pmt.paidDate ?? '-'}</td>
                <td style={{ padding: '12px 14px' }}>
                  <StatusBadge label={pmt.status} color={PAYMENT_STATUS_COLORS[pmt.status]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <h2 className="lot-subheading">
          Cumulative Cash Position (90-Day Outlook)
        </h2>
      </div>
      <div
        className="lot-card lot-animate-in"
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}
        >
          <span style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>Starting:</span>
          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--lot-text)' }}>
            ${STARTING_CASH.toLocaleString()}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '160px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--lot-text)',
                marginBottom: '4px',
                textAlign: 'center',
              }}
            >
              ${STARTING_CASH.toLocaleString()}
            </div>
            <div
              style={{
                width: '100%',
                height: `${(STARTING_CASH / (maxBalance * 1.1)) * 120}px`,
                background: '#CBD5E1',
                borderRadius: '6px 6px 0 0',
                minHeight: '8px',
              }}
            />
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginTop: '4px', textAlign: 'center' }}>
              Start
            </div>
          </div>

          {runningBalance.map((row, i) => {
            const barHeight = Math.max(8, (row.runningBalance / (maxBalance * 1.1)) * 120);
            const isPositive = row.runningBalance >= 0;
            const shortLabel = i < 4 ? `Wk ${i + 1}` : i === 4 ? 'May' : 'Jun';
            return (
              <div
                key={row.period}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isPositive ? '#16A34A' : '#DC2626',
                    marginBottom: '4px',
                    textAlign: 'center',
                  }}
                >
                  ${row.runningBalance.toLocaleString()}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: `${barHeight}px`,
                    background: isPositive ? '#16A34A' : '#DC2626',
                    borderRadius: '6px 6px 0 0',
                    minHeight: '8px',
                  }}
                />
                <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginTop: '4px', textAlign: 'center' }}>
                  {shortLabel}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ borderTop: '2px solid var(--lot-text)', marginTop: '0', opacity: 0.15 }} />

        <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--lot-text-muted)' }}>
          * Projections based on pipeline data, historical averages, and BHPH payment schedules. Scenario: {scenario}.
        </div>
      </div>
    </div>
  );
}
