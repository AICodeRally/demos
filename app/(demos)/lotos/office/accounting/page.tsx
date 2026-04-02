'use client';

import { DEALS, DEAL_STATUS_COLORS, VEHICLES, MONTHLY_KPIS } from '@/data/lotos';

export default function AccountingPage() {
  // Compute GL values from data
  const fundedDeals = DEALS.filter(d => d.status === 'funded');
  const totalRevenue = fundedDeals.reduce((sum, d) => sum + d.salePrice, 0);

  const soldVehicleIds = fundedDeals.map(d => d.vehicleId);
  const soldVehicles = VEHICLES.filter(v => soldVehicleIds.includes(v.id));
  const cogs = soldVehicles.reduce((sum, v) => sum + v.acquisitionCost + v.reconCost, 0);

  const grossProfit = totalRevenue - cogs;
  const operatingExpenses = 45000;
  const netProfit = grossProfit - operatingExpenses;

  // Most recent month P&L
  const mostRecentKpi = MONTHLY_KPIS[MONTHLY_KPIS.length - 1];
  const plRevenue = mostRecentKpi.totalRevenue;
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
    { label: 'Total Revenue', value: plRevenue, bold: false, color: '#1C1917' },
    { label: 'Cost of Goods Sold (COGS)', value: -plCogs, bold: false, color: '#DC2626' },
    { label: 'Gross Profit', value: plGrossProfit, bold: true, color: '#16A34A' },
    { label: '', value: null, bold: false, color: '#1C1917', divider: true },
    { label: 'Payroll', value: -payroll, bold: false, color: '#57534E' },
    { label: 'Rent', value: -rent, bold: false, color: '#57534E' },
    { label: 'Floor Plan Interest', value: -floorPlanInterest, bold: false, color: '#57534E' },
    { label: 'Marketing', value: -marketing, bold: false, color: '#57534E' },
    { label: 'Utilities', value: -utilities, bold: false, color: '#57534E' },
    { label: 'Total Expenses', value: -totalExpenses, bold: true, color: '#DC2626' },
    { label: '', value: null, bold: false, color: '#1C1917', divider: true },
    { label: 'Net Profit', value: plNetProfit, bold: true, color: plNetProfit >= 0 ? '#16A34A' : '#DC2626' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Accounting
        </h1>
        <p className="mt-1 text-base" style={{ color: '#57534E' }}>
          General ledger summary, deal posting, and monthly P&L — April 2026
        </p>
      </div>

      {/* GL Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Total Revenue
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>{fundedDeals.length} funded deals</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            COGS
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#DC2626' }}>
            ${cogs.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>acquisition + recon</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Gross Profit
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#16A34A' }}>
            ${grossProfit.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>{Math.round((grossProfit / totalRevenue) * 100)}% margin</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Operating Expenses
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#D97706' }}>
            ${operatingExpenses.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>this month</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Monthly P&L Table */}
        <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #E7E5E4' }}>
            <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>
              Monthly P&amp;L
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#57534E' }}>
              {mostRecentKpi.month} — {mostRecentKpi.unitsSold} units sold
            </p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {plRows.map((row, i) => {
                if ('divider' in row && row.divider) {
                  return <tr key={i}><td colSpan={2} style={{ borderTop: '2px solid #E7E5E4', padding: 0 }} /></tr>;
                }
                return (
                  <tr
                    key={i}
                    style={{ borderBottom: i < plRows.length - 1 ? '1px solid #F5F5F4' : undefined, backgroundColor: row.bold ? '#F8FAFC' : undefined }}
                  >
                    <td
                      className="px-6 py-3"
                      style={{ color: '#57534E', fontWeight: row.bold ? 700 : 400 }}
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

        {/* Deal Posting Status */}
        <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #E7E5E4' }}>
            <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>
              Deal Posting Status
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#57534E' }}>
              GL posting status for active deals
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E7E5E4' }}>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Deal #</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Customer</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Sale Price</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Status</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Posted to GL</th>
              </tr>
            </thead>
            <tbody>
              {DEALS.map((deal, i) => {
                const customer = ['CUS-002', 'CUS-001', 'CUS-008', 'CUS-005', 'CUS-006', 'CUS-007', 'CUS-010'][i] || deal.customerId;
                const customerNames: Record<string, string> = {
                  'CUS-001': 'Marcus Rivera',
                  'CUS-002': 'Sarah Chen',
                  'CUS-005': 'David Thompson',
                  'CUS-006': 'Ashley Brown',
                  'CUS-007': 'Robert Martinez',
                  'CUS-008': 'Jennifer Lee',
                  'CUS-010': 'Nicole Anderson',
                };
                const posted = deal.status === 'funded';
                return (
                  <tr key={deal.id} style={{ borderBottom: i < DEALS.length - 1 ? '1px solid #F5F5F4' : undefined }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: '#1C1917' }}>{deal.id}</td>
                    <td className="px-4 py-3" style={{ color: '#57534E' }}>{customerNames[deal.customerId] || deal.customerId}</td>
                    <td className="px-4 py-3 text-right font-semibold" style={{ color: '#1C1917' }}>${deal.salePrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{ backgroundColor: `${DEAL_STATUS_COLORS[deal.status]}20`, color: DEAL_STATUS_COLORS[deal.status] }}
                      >
                        {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {posted ? (
                        <span className="text-base font-bold" style={{ color: '#16A34A' }}>✓</span>
                      ) : (
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                          style={{ backgroundColor: '#FEF9C3', color: '#D97706' }}
                        >
                          Pending
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
    </div>
  );
}
