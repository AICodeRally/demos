'use client';

import { useState, useMemo } from 'react';
import { LENDERS, LENDER_TYPE_COLORS, CUSTOMERS, DEALS, VEHICLES } from '@/data/lotos';
import { DataTable, type Column, DetailPanel, DealDetail, VehicleDetail, CustomerDetail } from '@/components/demos/lotos';
import type { Lender, CreditTier } from '@/data/lotos';

const TIER_TO_SCORE: Record<CreditTier, number> = {
  prime: 740,
  'near-prime': 690,
  subprime: 620,
  'deep-subprime': 530,
};

function getMatchStatus(minScore: number, estimatedScore: number): { icon: string; color: string; bg: string; label: string } {
  const gap = estimatedScore - minScore;
  if (gap >= 0) {
    return { icon: '✓', color: '#16A34A', bg: '#F0FDF4', label: 'Qualifies' };
  } else if (gap >= -30) {
    return { icon: '~', color: '#D97706', bg: '#FFFBEB', label: 'Marginal' };
  } else {
    return { icon: '✕', color: '#DC2626', bg: '#FEF2F2', label: 'Does Not Qualify' };
  }
}

type PanelEntity = { type: 'vehicle' | 'customer' | 'deal'; id: string } | null;

const lenderTypeLabels: Record<string, string> = {
  bank: 'Bank',
  'credit-union': 'Credit Union',
  captive: 'Captive',
  subprime: 'Subprime',
  bhph: 'BHPH',
};

export default function LendersPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState('CUS-010');
  const [expandedLender, setExpandedLender] = useState<string | null>(null);
  const [panelEntity, setPanelEntity] = useState<PanelEntity>(null);

  const customer = CUSTOMERS.find((c) => c.id === selectedCustomerId)!;
  const creditScore = TIER_TO_SCORE[customer.creditTier];

  const sorted = useMemo(() => [...LENDERS].sort((a, b) => b.approvalRate - a.approvalRate), []);

  const avgApprovalRate = Math.round(
    LENDERS.reduce((sum, l) => sum + l.approvalRate, 0) / LENDERS.length
  );
  const fastestFunder = [...LENDERS].sort((a, b) => a.avgDaysToFund - b.avgDaysToFund)[0];
  const bestRate = [...LENDERS].sort((a, b) => a.avgBuyRate - b.avgBuyRate)[0];

  const columns: Column<Lender>[] = [
    {
      key: 'name',
      label: 'Lender',
      render: (l) => <span style={{ fontWeight: 700, color: '#1C1917', fontSize: '15px' }}>{l.name}</span>,
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    {
      key: 'type',
      label: 'Type',
      render: (l) => (
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{
            background: LENDER_TYPE_COLORS[l.type] + '20',
            color: LENDER_TYPE_COLORS[l.type],
            border: `1px solid ${LENDER_TYPE_COLORS[l.type]}40`,
            whiteSpace: 'nowrap',
          }}
        >
          {lenderTypeLabels[l.type]}
        </span>
      ),
    },
    {
      key: 'minCreditScore',
      label: 'Min Credit',
      sortFn: (a, b) => a.minCreditScore - b.minCreditScore,
      render: (l) => <span style={{ fontWeight: 500 }}>{l.minCreditScore === 0 ? 'None' : l.minCreditScore}</span>,
    },
    {
      key: 'maxAdvance',
      label: 'Max Advance',
      align: 'right',
      sortFn: (a, b) => a.maxAdvance - b.maxAdvance,
      render: (l) => <span style={{ fontWeight: 500 }}>{l.maxAdvance}%</span>,
    },
    {
      key: 'avgBuyRate',
      label: 'Avg Buy Rate',
      align: 'right',
      sortFn: (a, b) => a.avgBuyRate - b.avgBuyRate,
      render: (l) => <span style={{ fontWeight: 700, color: '#1C1917' }}>{l.avgBuyRate}%</span>,
    },
    {
      key: 'avgDaysToFund',
      label: 'Days to Fund',
      align: 'right',
      sortFn: (a, b) => a.avgDaysToFund - b.avgDaysToFund,
      render: (l) => <span style={{ fontWeight: 500 }}>{l.avgDaysToFund === 0 ? 'Same Day' : `${l.avgDaysToFund} days`}</span>,
    },
    {
      key: 'approvalRate',
      label: 'Approval Rate',
      sortFn: (a, b) => a.approvalRate - b.approvalRate,
      render: (l) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
          <div style={{ flex: 1, height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${l.approvalRate}%`,
                background: l.approvalRate >= 80 ? '#16A34A' : l.approvalRate >= 65 ? '#2563EB' : '#D97706',
                borderRadius: '4px',
              }}
            />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C1917', minWidth: '36px' }}>{l.approvalRate}%</span>
        </div>
      ),
    },
    {
      key: 'match',
      label: 'Match',
      render: (l) => {
        const match = getMatchStatus(l.minCreditScore, creditScore);
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: match.bg,
              color: match.color,
              border: `1px solid ${match.color}40`,
              borderRadius: '9999px',
              padding: '3px 10px',
              fontSize: '14px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 800 }}>{match.icon}</span>
            {match.label}
          </span>
        );
      },
    },
  ];

  const lenderDeals = (lenderName: string) =>
    DEALS.filter((d) => d.lender === lenderName);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            Lender Matching
          </h1>
          <p style={{ color: '#57534E', fontSize: '16px', marginTop: '4px' }}>
            Ranked by approval rate — matched to {customer.firstName} {customer.lastName} (est. {creditScore} credit score, {customer.creditTier})
          </p>
        </div>
        <select
          value={selectedCustomerId}
          onChange={(e) => { setSelectedCustomerId(e.target.value); setExpandedLender(null); }}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1.5px solid #E7E5E4',
            fontSize: '14px',
            fontWeight: 600,
            color: '#1C1917',
            background: '#FFFFFF',
            cursor: 'pointer',
          }}
        >
          {CUSTOMERS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName} — {c.creditTier}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          className="rounded-xl bg-white border p-6"
          style={{ borderColor: '#E7E5E4', borderLeftWidth: '4px', borderLeftColor: '#2563EB' }}
        >
          <div className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            {avgApprovalRate}%
          </div>
          <div style={{ fontSize: '14px', color: '#57534E', marginTop: '4px', fontWeight: 500 }}>
            Avg Approval Rate
          </div>
        </div>
        <div
          className="rounded-xl bg-white border p-6"
          style={{ borderColor: '#E7E5E4', borderLeftWidth: '4px', borderLeftColor: '#16A34A' }}
        >
          <div className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            {fastestFunder.avgDaysToFund === 0 ? 'Same Day' : `${fastestFunder.avgDaysToFund} day`}
          </div>
          <div style={{ fontSize: '14px', color: '#57534E', marginTop: '4px', fontWeight: 500 }}>
            Fastest Funder ({fastestFunder.name})
          </div>
        </div>
        <div
          className="rounded-xl bg-white border p-6"
          style={{ borderColor: '#E7E5E4', borderLeftWidth: '4px', borderLeftColor: '#7C3AED' }}
        >
          <div className="text-3xl font-bold" style={{ color: '#1C1917' }}>
            {bestRate.avgBuyRate}%
          </div>
          <div style={{ fontSize: '14px', color: '#57534E', marginTop: '4px', fontWeight: 500 }}>
            Best Buy Rate ({bestRate.name})
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-xl font-bold" style={{ color: '#1C1917', marginBottom: '16px' }}>
          Lender Comparison
        </h2>
        <DataTable
          columns={columns}
          data={sorted}
          keyFn={(l) => l.id}
          onRowClick={(l) => setExpandedLender(expandedLender === l.id ? null : l.id)}
        />

        {expandedLender && (() => {
          const lender = LENDERS.find((l) => l.id === expandedLender);
          if (!lender) return null;
          const deals = lenderDeals(lender.name);
          return (
            <div
              style={{
                marginTop: '12px',
                padding: '16px',
                background: '#FAFAF9',
                borderRadius: '10px',
                border: '1.5px solid #E7E5E4',
              }}
            >
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#1C1917', marginBottom: '12px' }}>
                Recent Deals — {lender.name}
              </h3>
              {deals.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#78716C', fontStyle: 'italic' }}>No deals funded through this lender.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {deals.map((d) => {
                    const v = VEHICLES.find((veh) => veh.id === d.vehicleId);
                    return (
                      <div
                        key={d.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 14px',
                          background: '#FFFFFF',
                          borderRadius: '8px',
                          border: '1px solid #E7E5E4',
                          cursor: 'pointer',
                        }}
                        onClick={() => setPanelEntity({ type: 'deal', id: d.id })}
                      >
                        <div>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: '#1C1917' }}>{d.id}</span>
                          <span style={{ fontSize: '14px', color: '#57534E', marginLeft: '10px' }}>
                            {v ? `${v.year} ${v.make} ${v.model}` : d.vehicleId}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1C1917' }}>${d.salePrice.toLocaleString()}</span>
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                            style={{
                              background: d.status === 'funded' ? '#F0FDF4' : '#FFFBEB',
                              color: d.status === 'funded' ? '#16A34A' : '#D97706',
                              textTransform: 'capitalize',
                            }}
                          >
                            {d.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        <div style={{ marginTop: '16px', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E7E5E4' }}>
          <div style={{ fontSize: '14px', color: '#78716C' }}>
            <strong style={{ color: '#57534E' }}>Match Logic:</strong> Green = lender min score ≤ customer est. score ({creditScore}).
            Amber = within 30 points. Red = does not qualify.
          </div>
        </div>
      </div>

      <DetailPanel
        open={!!panelEntity}
        onClose={() => setPanelEntity(null)}
        title={panelEntity?.type === 'vehicle' ? 'Vehicle Details' : panelEntity?.type === 'customer' ? 'Customer Details' : 'Deal Details'}
      >
        {panelEntity?.type === 'vehicle' && <VehicleDetail vehicleId={panelEntity.id} onDealClick={(id) => setPanelEntity({ type: 'deal', id })} />}
        {panelEntity?.type === 'customer' && <CustomerDetail customerId={panelEntity.id} onDealClick={(id) => setPanelEntity({ type: 'deal', id })} onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })} />}
        {panelEntity?.type === 'deal' && <DealDetail dealId={panelEntity.id} onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })} onCustomerClick={(id) => setPanelEntity({ type: 'customer', id })} />}
      </DetailPanel>
    </div>
  );
}
