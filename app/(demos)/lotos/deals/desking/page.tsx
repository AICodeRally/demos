'use client';

import { useState, useMemo } from 'react';
import { DEALS, DEAL_STATUS_COLORS } from '@/data/lotos';
import { VEHICLES } from '@/data/lotos';
import { CUSTOMERS } from '@/data/lotos';
import { LENDERS } from '@/data/lotos';
import { DetailPanel, VehicleDetail, CustomerDetail, DealDetail } from '@/components/demos/lotos';

function calcMonthlyPayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (r * principal) / (1 - Math.pow(1 + r, -months));
}

type PanelEntity = { type: 'vehicle' | 'customer' | 'deal'; id: string } | null;

export default function DeskingPage() {
  const [selectedDealId, setSelectedDealId] = useState('DL-2026-007');
  const deal = DEALS.find((d) => d.id === selectedDealId)!;
  const vehicle = VEHICLES.find((v) => v.id === deal.vehicleId)!;
  const customer = CUSTOMERS.find((c) => c.id === deal.customerId)!;

  const [editablePrice, setEditablePrice] = useState(deal.salePrice);
  const [editableTrade, setEditableTrade] = useState(deal.tradeAllowance);
  const [editableDown, setEditableDown] = useState(deal.downPayment);
  const [panelEntity, setPanelEntity] = useState<PanelEntity>(null);

  const handleDealChange = (dealId: string) => {
    setSelectedDealId(dealId);
    const d = DEALS.find((dl) => dl.id === dealId)!;
    setEditablePrice(d.salePrice);
    setEditableTrade(d.tradeAllowance);
    setEditableDown(d.downPayment);
  };

  const amountFinanced = useMemo(() => editablePrice - editableTrade - editableDown, [editablePrice, editableTrade, editableDown]);

  const scenarios = [
    { lender: LENDERS.find((l) => l.name === 'Arizona Federal CU')!, term: 60, approval: 'Low', approvalColor: '#DC2626', approvalBg: '#FEF2F2' },
    { lender: LENDERS.find((l) => l.name === 'Ally Financial')!, term: 72, approval: 'Medium', approvalColor: '#D97706', approvalBg: '#FFFBEB' },
    { lender: LENDERS.find((l) => l.name === 'Chase Auto')!, term: 84, approval: 'High', approvalColor: '#16A34A', approvalBg: '#F0FDF4' },
  ];

  const estFniGross = 2100;
  const totalGrossProjection = deal.frontGross + estFniGross;

  const inputStyle = {
    background: 'var(--lot-card-alt)',
    border: '1px solid var(--lot-border)',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '15px',
    fontWeight: 700 as const,
    minWidth: '110px',
    textAlign: 'right' as const,
    outline: 'none',
  };

  return (
    <div className="lot-page">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="lot-heading">
            Desking Tool
          </h1>
          <p className="lot-description">
            Deal structuring and payment scenario comparison
          </p>
        </div>
        <select
          value={selectedDealId}
          onChange={(e) => handleDealChange(e.target.value)}
          className="lot-input"
        >
          {DEALS.map((d) => {
            const v = VEHICLES.find((veh) => veh.id === d.vehicleId);
            return (
              <option key={d.id} value={d.id}>
                {d.id} — {v ? `${v.year} ${v.make} ${v.model}` : d.vehicleId}
              </option>
            );
          })}
        </select>
      </div>

      <div
        className="lot-card lot-animate-in"
        style={{ borderLeftWidth: '4px', borderLeftColor: '#2563EB', marginBottom: '20px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="text-xl font-bold" style={{ color: 'var(--lot-text)' }}>{deal.id}</span>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                style={{
                  background: DEAL_STATUS_COLORS[deal.status] + '20',
                  color: DEAL_STATUS_COLORS[deal.status],
                  border: `1px solid ${DEAL_STATUS_COLORS[deal.status]}40`,
                  textTransform: 'capitalize',
                }}
              >
                {deal.status}
              </span>
            </div>
            <div
              style={{ fontSize: '18px', fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}
              onClick={() => setPanelEntity({ type: 'vehicle', id: vehicle.id })}
            >
              {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
            </div>
            <div style={{ fontSize: '15px', color: 'var(--lot-text-secondary)', marginTop: '2px' }}>
              STK: {vehicle.id} &middot; {vehicle.mileage.toLocaleString()} mi &middot; {vehicle.color}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>Customer</div>
            <div
              style={{ fontSize: '17px', fontWeight: 700, color: '#2563EB', cursor: 'pointer' }}
              onClick={() => setPanelEntity({ type: 'customer', id: customer.id })}
            >
              {customer.firstName} {customer.lastName}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>{customer.email}</div>
            <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>{customer.phone}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="lot-card lot-animate-in">
          <h2 className="lot-subheading" style={{ marginBottom: '16px' }}>
            Deal Structure
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', fontWeight: 500 }}>Sale Price</span>
              <input
                type="number"
                value={editablePrice}
                onChange={(e) => setEditablePrice(Number(e.target.value))}
                style={{ ...inputStyle, color: 'var(--lot-text)' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', fontWeight: 500 }}>Trade Allowance</span>
              <input
                type="number"
                value={editableTrade}
                onChange={(e) => setEditableTrade(Number(e.target.value))}
                style={{ ...inputStyle, color: '#16A34A' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', fontWeight: 500 }}>Down Payment</span>
              <input
                type="number"
                value={editableDown}
                onChange={(e) => setEditableDown(Number(e.target.value))}
                style={{ ...inputStyle, color: '#16A34A' }}
              />
            </div>
            <div
              style={{
                borderTop: '2px solid var(--lot-border)',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '15px', color: 'var(--lot-text)', fontWeight: 700 }}>Amt Financed</span>
              <div
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#2563EB',
                  minWidth: '110px',
                  textAlign: 'right',
                }}
              >
                ${amountFinanced.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="lot-card lot-animate-in">
          <h2 className="lot-subheading" style={{ marginBottom: '16px' }}>
            Lender Scenarios
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {scenarios.map((s) => {
              const monthly = calcMonthlyPayment(amountFinanced, s.lender.avgBuyRate, s.term);
              const totalPaid = monthly * s.term;
              const totalInterest = totalPaid - amountFinanced;
              return (
                <div
                  key={s.lender.id}
                  style={{
                    border: '1.5px solid var(--lot-border)',
                    borderRadius: '10px',
                    padding: '16px',
                    background: 'var(--lot-card-alt)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--lot-text)', marginBottom: '4px' }}>
                    {s.lender.name}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginBottom: '12px' }}>
                    {s.term}-month term
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>Buy Rate</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--lot-text)' }}>
                        {s.lender.avgBuyRate}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>Monthly Pmt</span>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#2563EB' }}>
                        ${Math.round(monthly).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>Total Interest</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#DC2626' }}>
                        ${Math.round(totalInterest).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                        Approval Likelihood
                      </div>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: s.approvalBg,
                          color: s.approvalColor,
                          border: `1px solid ${s.approvalColor}40`,
                        }}
                      >
                        {s.approval}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lot-card lot-animate-in">
        <h2 className="lot-subheading" style={{ marginBottom: '16px' }}>
          Gross Projection
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div
            className="lot-card"
            style={{ borderLeftWidth: '4px', borderLeftColor: '#2563EB' }}
          >
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600, marginBottom: '4px' }}>
              Front Gross
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--lot-text)' }}>
              ${deal.frontGross.toLocaleString()}
            </div>
          </div>
          <div
            className="lot-card"
            style={{ borderLeftWidth: '4px', borderLeftColor: '#7C3AED' }}
          >
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600, marginBottom: '4px' }}>
              Est. F&amp;I Gross
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--lot-text)' }}>
              ${estFniGross.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginTop: '2px' }}>based on avg penetration</div>
          </div>
          <div
            className="lot-card"
            style={{ borderLeftWidth: '4px', borderLeftColor: '#16A34A' }}
          >
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600, marginBottom: '4px' }}>
              Total Gross Projection
            </div>
            <div className="text-3xl font-bold" style={{ color: '#16A34A' }}>
              ${totalGrossProjection.toLocaleString()}
            </div>
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
