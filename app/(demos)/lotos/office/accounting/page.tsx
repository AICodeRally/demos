'use client';

import { useState } from 'react';
import { DEALS, DEAL_STATUS_COLORS, VEHICLES, CUSTOMERS, MONTHLY_KPIS } from '@/data/lotos';
import { DataTable, type Column, DetailPanel, DealDetail, VehicleDetail, CustomerDetail } from '@/components/demos/lotos';
import type { Deal } from '@/data/lotos';

type PanelEntity = { type: 'vehicle' | 'customer' | 'deal'; id: string } | null;

export default function AccountingPage() {
  const [selectedMonth, setSelectedMonth] = useState(MONTHLY_KPIS[MONTHLY_KPIS.length - 2].month);
  const [panelEntity, setPanelEntity] = useState<PanelEntity>(null);

  const selectedKpi = MONTHLY_KPIS.find((k) => k.month === selectedMonth)!;

  const fundedDeals = DEALS.filter(d => d.status === 'funded');
  const totalRevenue = fundedDeals.reduce((sum, d) => sum + d.salePrice, 0);

  const soldVehicleIds = fundedDeals.map(d => d.vehicleId);
  const soldVehicles = VEHICLES.filter(v => soldVehicleIds.includes(v.id));
  const cogs = soldVehicles.reduce((sum, v) => sum + v.acquisitionCost + v.reconCost, 0);

  const grossProfit = totalRevenue - cogs;
  const operatingExpenses = 45000;

  const plRevenue = selectedKpi.totalRevenue;
  const plCogs = Math.round(plRevenue * 0.62);
  const plGrossProfit = plRevenue - plCogs;
  const payroll = 28000;
  const rent = 8000;
  const floorPlanInterest = 4000;
  const marketing = 3000;
  const utilities = 2000;
  const totalExpenses = payroll + rent + floorPlanInterest + marketing + utilities;
  const plNetProfit = plGrossProfit - totalExpenses;

  const plRows = [
    { label: 'Total Revenue', value: plRevenue, bold: false, color: 'var(--lot-text)' },
    { label: 'Cost of Goods Sold (COGS)', value: -plCogs, bold: false, color: '#DC2626' },
    { label: 'Gross Profit', value: plGrossProfit, bold: true, color: '#16A34A' },
    { label: '', value: null as number | null, bold: false, color: 'var(--lot-text)', divider: true },
    { label: 'Payroll', value: -payroll, bold: false, color: 'var(--lot-text-secondary)' },
    { label: 'Rent', value: -rent, bold: false, color: 'var(--lot-text-secondary)' },
    { label: 'Floor Plan Interest', value: -floorPlanInterest, bold: false, color: 'var(--lot-text-secondary)' },
    { label: 'Marketing', value: -marketing, bold: false, color: 'var(--lot-text-secondary)' },
    { label: 'Utilities', value: -utilities, bold: false, color: 'var(--lot-text-secondary)' },
    { label: 'Total Expenses', value: -totalExpenses, bold: true, color: '#DC2626' },
    { label: '', value: null as number | null, bold: false, color: 'var(--lot-text)', divider: true },
    { label: 'Net Profit', value: plNetProfit, bold: true, color: plNetProfit >= 0 ? '#16A34A' : '#DC2626' },
  ];

  const dealColumns: Column<Deal>[] = [
    {
      key: 'id',
      label: 'Deal #',
      sortFn: (a, b) => a.id.localeCompare(b.id),
      render: (d) => <span style={{ fontWeight: 700, color: 'var(--lot-text)' }}>{d.id}</span>,
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (d) => {
        const c = CUSTOMERS.find((cust) => cust.id === d.customerId);
        return <span>{c ? `${c.firstName} ${c.lastName}` : d.customerId}</span>;
      },
    },
    {
      key: 'salePrice',
      label: 'Sale Price',
      align: 'right',
      sortFn: (a, b) => a.salePrice - b.salePrice,
      render: (d) => <span style={{ fontWeight: 600, color: 'var(--lot-text)' }}>${d.salePrice.toLocaleString()}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (d) => (
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ backgroundColor: `${DEAL_STATUS_COLORS[d.status]}20`, color: DEAL_STATUS_COLORS[d.status] }}
        >
          {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
        </span>
      ),
    },
    {
      key: 'posted',
      label: 'Posted to GL',
      align: 'center',
      render: (d) => d.status === 'funded' ? (
        <span className="text-base font-bold" style={{ color: '#16A34A' }}>✓</span>
      ) : (
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ backgroundColor: '#FEF9C3', color: '#D97706' }}
        >
          Pending
        </span>
      ),
    },
  ];

  return (
    <div className="lot-page">
      <div>
        <h1 className="lot-heading">
          Accounting
        </h1>
        <p className="lot-description">
          General ledger summary, deal posting, and monthly P&L
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 lot-animate-in">
        <div className="lot-card">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--lot-text-muted)' }}>
            Total Revenue
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--lot-text)' }}>
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--lot-text-secondary)' }}>{fundedDeals.length} funded deals</p>
        </div>
        <div className="lot-card">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--lot-text-muted)' }}>
            COGS
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#DC2626' }}>
            ${cogs.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--lot-text-secondary)' }}>acquisition + recon</p>
        </div>
        <div className="lot-card">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--lot-text-muted)' }}>
            Gross Profit
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#16A34A' }}>
            ${grossProfit.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--lot-text-secondary)' }}>{totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0}% margin</p>
        </div>
        <div className="lot-card">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--lot-text-muted)' }}>
            Operating Expenses
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#D97706' }}>
            ${operatingExpenses.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--lot-text-secondary)' }}>this month</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 lot-animate-in">
        <div className="lot-card overflow-hidden !p-0">
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--lot-border)' }}>
            <div>
              <h2 className="lot-subheading">
                Monthly P&amp;L
              </h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--lot-text-secondary)' }}>
                {selectedKpi.month} — {selectedKpi.unitsSold} units sold
              </p>
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="lot-input"
            >
              {MONTHLY_KPIS.map((k) => (
                <option key={k.month} value={k.month}>{k.month}</option>
              ))}
            </select>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {plRows.map((row, i) => {
                if ('divider' in row && row.divider) {
                  return <tr key={i}><td colSpan={2} style={{ borderTop: '2px solid var(--lot-border)', padding: 0 }} /></tr>;
                }
                return (
                  <tr
                    key={i}
                    style={{ borderBottom: i < plRows.length - 1 ? '1px solid var(--lot-border-faint)' : undefined, backgroundColor: row.bold ? 'var(--lot-card-alt)' : undefined }}
                  >
                    <td
                      className="px-6 py-3"
                      style={{ color: 'var(--lot-text-secondary)', fontWeight: row.bold ? 700 : 400 }}
                    >
                      {row.label}
                    </td>
                    <td
                      className="px-6 py-3 text-right"
                      style={{ color: row.value !== null && row.value < 0 ? '#DC2626' : row.color, fontWeight: row.bold ? 700 : 400 }}
                    >
                      {row.value !== null ? (
                        row.value < 0
                          ? `($${Math.abs(row.value).toLocaleString()})`
                          : `$${row.value.toLocaleString()}`
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="lot-card overflow-hidden !p-0">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--lot-border)' }}>
            <h2 className="lot-subheading">
              Deal Posting Status
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--lot-text-secondary)' }}>
              GL posting status for active deals — click row for details
            </p>
          </div>
          <div className="px-2">
            <DataTable
              columns={dealColumns}
              data={DEALS}
              keyFn={(d) => d.id}
              onRowClick={(d) => setPanelEntity({ type: 'deal', id: d.id })}
            />
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
