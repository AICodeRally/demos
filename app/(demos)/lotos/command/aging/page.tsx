'use client';

import { useState } from 'react';
import { VEHICLES } from '@/data/lotos';
import { DetailPanel, VehicleDetail, Toast } from '@/components/demos/lotos';

type AgeBucket = '0-30' | '31-60' | '61-90' | '90+';

function getAgeBucket(days: number): AgeBucket {
  if (days <= 30) return '0-30';
  if (days <= 60) return '31-60';
  if (days <= 90) return '61-90';
  return '90+';
}

function getRecommendedAction(days: number): { label: string; color: string; bg: string } {
  if (days <= 30) return { label: 'Hold', color: '#16A34A', bg: '#F0FDF4' };
  if (days <= 45) return { label: 'Price Review', color: '#2563EB', bg: '#EFF6FF' };
  if (days <= 60) return { label: 'Price Reduction', color: '#D97706', bg: '#FFFBEB' };
  if (days <= 75) return { label: 'Aggressive Markdown', color: '#EA580C', bg: '#FFF7ED' };
  if (days <= 90) return { label: 'Wholesale Candidate', color: '#DC2626', bg: '#FEF2F2' };
  return { label: 'Immediate Wholesale', color: '#7F1D1D', bg: '#FEE2E2' };
}

function getMarketValue(askingPrice: number, daysOnLot: number): number {
  if (daysOnLot <= 30) return askingPrice;
  const extraDays = daysOnLot - 30;
  const periodsOf10 = Math.floor(extraDays / 10);
  return Math.round(askingPrice * Math.pow(0.99, periodsOf10));
}

function getDaysBadgeColor(days: number): { color: string; bg: string } {
  if (days <= 30) return { color: '#16A34A', bg: '#F0FDF4' };
  if (days <= 60) return { color: '#D97706', bg: '#FFFBEB' };
  if (days <= 90) return { color: '#DC2626', bg: '#FEF2F2' };
  return { color: '#7F1D1D', bg: '#FEE2E2' };
}

const BUCKET_CONFIG: Record<AgeBucket, { label: string; color: string; bg: string; border: string }> = {
  '0-30':  { label: '0-30 Days',  color: '#16A34A', bg: '#F0FDF4',  border: '#BBF7D0' },
  '31-60': { label: '31-60 Days', color: '#D97706', bg: '#FFFBEB',  border: '#FDE68A' },
  '61-90': { label: '61-90 Days', color: '#DC2626', bg: '#FEF2F2',  border: '#FCA5A5' },
  '90+':   { label: '90+ Days',   color: '#7F1D1D', bg: '#FEE2E2',  border: '#FCA5A5' },
};

export default function LotosAgingPage() {
  const [activeBucket, setActiveBucket] = useState<string | null>(null);
  const [panelEntity, setPanelEntity] = useState<{ type: 'vehicle'; id: string } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeVehicles = VEHICLES.filter((v) => v.status !== 'sold');
  const sortedByAge = [...activeVehicles].sort((a, b) => b.daysOnLot - a.daysOnLot);

  const buckets: Record<AgeBucket, { count: number; totalInvestment: number }> = {
    '0-30': { count: 0, totalInvestment: 0 },
    '31-60': { count: 0, totalInvestment: 0 },
    '61-90': { count: 0, totalInvestment: 0 },
    '90+': { count: 0, totalInvestment: 0 },
  };
  activeVehicles.forEach((v) => {
    const b = getAgeBucket(v.daysOnLot);
    buckets[b].count += 1;
    buckets[b].totalInvestment += v.acquisitionCost + v.reconCost;
  });

  const vehiclesWithLoss = sortedByAge.map((v) => {
    const marketValue = getMarketValue(v.askingPrice, v.daysOnLot);
    const totalCost = v.acquisitionCost + v.reconCost;
    const unrealizedLoss = marketValue < totalCost ? totalCost - marketValue : 0;
    return { ...v, marketValue, totalCost, unrealizedLoss };
  });

  const filteredVehicles = activeBucket
    ? vehiclesWithLoss.filter((v) => getAgeBucket(v.daysOnLot) === activeBucket)
    : vehiclesWithLoss;

  const totalUnrealizedLoss = vehiclesWithLoss.reduce((sum, v) => sum + v.unrealizedLoss, 0);

  function handleWholesale(v: typeof vehiclesWithLoss[0]) {
    const wholesaleOffer = Math.round(v.marketValue * 0.85);
    setToastMsg(`Wholesale offer: $${wholesaleOffer.toLocaleString()} from Manheim Phoenix`);
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px' }}>
      {toastMsg && <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />}

      <DetailPanel
        open={panelEntity !== null}
        onClose={() => setPanelEntity(null)}
        title={panelEntity?.type === 'vehicle' ? `Vehicle ${panelEntity.id}` : ''}
      >
        {panelEntity?.type === 'vehicle' && <VehicleDetail vehicleId={panelEntity.id} />}
      </DetailPanel>

      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Aging Report
        </h1>
        <p style={{ color: '#57534E', fontSize: '16px', marginTop: '4px' }}>
          Inventory age analysis with recommended actions and unrealized loss tracking
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {(Object.keys(BUCKET_CONFIG) as AgeBucket[]).map((bucket) => {
          const cfg = BUCKET_CONFIG[bucket];
          const data = buckets[bucket];
          const isActive = activeBucket === bucket;
          return (
            <div
              key={bucket}
              className="rounded-xl border p-6"
              style={{
                background: cfg.bg,
                borderColor: isActive ? cfg.color : cfg.border,
                borderWidth: isActive ? '2px' : '1px',
                cursor: 'pointer',
                boxShadow: isActive ? `0 0 0 2px ${cfg.color}40` : 'none',
              }}
              onClick={() => setActiveBucket(isActive ? null : bucket)}
            >
              <div style={{ fontSize: '14px', fontWeight: 600, color: cfg.color, marginBottom: '6px' }}>
                {cfg.label}
              </div>
              <div className="text-3xl font-bold" style={{ color: '#1C1917', marginBottom: '4px' }}>
                {data.count} units
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#57534E' }}>
                ${data.totalInvestment.toLocaleString()} invested
              </div>
              {isActive && (
                <div style={{ fontSize: '14px', color: cfg.color, marginTop: '4px', fontWeight: 600 }}>
                  Filtered
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalUnrealizedLoss > 0 && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '12px',
            padding: '16px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Unrealized Loss
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#DC2626', marginTop: '2px' }}>
              -${totalUnrealizedLoss.toLocaleString()}
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#991B1B', maxWidth: '400px' }}>
            Market depreciation on aged inventory exceeds acquisition cost. Immediate action on wholesale candidates
            can recover capital for fresher stock.
          </div>
        </div>
      )}

      {activeBucket && (
        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: '#78716C' }}>
            Showing {filteredVehicles.length} vehicles in {BUCKET_CONFIG[activeBucket as AgeBucket]?.label ?? activeBucket} bucket
          </span>
          <button
            onClick={() => setActiveBucket(null)}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid #E7E5E4',
              background: '#FFFFFF',
              color: '#57534E',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Clear Filter
          </button>
        </div>
      )}

      <div
        className="rounded-xl bg-white border"
        style={{ borderColor: '#E7E5E4', overflowX: 'auto' }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
              {[
                'Stock #',
                'Vehicle',
                'Days on Lot',
                'Acq Cost',
                'Asking Price',
                'Market Value',
                'Unrealized Loss',
                'Action',
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 14px',
                    textAlign: 'left',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    color: '#78716C',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((v) => {
              const action = getRecommendedAction(v.daysOnLot);
              const daysStyle = getDaysBadgeColor(v.daysOnLot);
              const isWholesale = action.label.toLowerCase().includes('wholesale');
              return (
                <tr
                  key={v.id}
                  style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
                  onClick={() => setPanelEntity({ type: 'vehicle', id: v.id })}
                >
                  <td
                    style={{
                      padding: '12px 14px',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#1C1917',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {v.id}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '14px', color: '#1C1917' }}>
                    <div style={{ fontWeight: 600 }}>
                      {v.year} {v.make} {v.model}
                    </div>
                    <div style={{ fontSize: '14px', color: '#78716C' }}>{v.trim}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{
                        background: daysStyle.bg,
                        color: daysStyle.color,
                        border: `1px solid ${daysStyle.color}40`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {v.daysOnLot}d
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '14px', color: '#57534E', whiteSpace: 'nowrap' }}>
                    ${v.acquisitionCost.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 600, color: '#1C1917', whiteSpace: 'nowrap' }}>
                    ${v.askingPrice.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: '12px 14px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: v.marketValue < v.totalCost ? '#DC2626' : '#57534E',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ${v.marketValue.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: '12px 14px',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: v.unrealizedLoss > 0 ? '#DC2626' : '#16A34A',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {v.unrealizedLoss > 0 ? `-$${v.unrealizedLoss.toLocaleString()}` : '-'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {isWholesale ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleWholesale(v); }}
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: action.bg,
                          color: action.color,
                          border: `1px solid ${action.color}30`,
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                        }}
                      >
                        {action.label}
                      </button>
                    ) : (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: action.bg,
                          color: action.color,
                          border: `1px solid ${action.color}30`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {action.label}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
