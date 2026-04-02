'use client';

import { VEHICLES } from '@/data/lotos';

const APR = 0.065;

function calcCurtailmentDate(acquiredDate: string): string {
  const d = new Date(acquiredDate);
  d.setDate(d.getDate() + 90);
  return d.toISOString().split('T')[0];
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

const TODAY = '2026-04-01';

export default function FloorplanPage() {
  // Non-sold vehicles; assume auction purchases are on floorplan, trade-ins are cash
  const activeVehicles = VEHICLES.filter(v => v.status !== 'sold' && v.status !== 'wholesale');

  const floorplanVehicles = activeVehicles.filter(v =>
    v.source === 'auction-manheim' || v.source === 'auction-adesa'
  );
  const cashVehicles = activeVehicles.filter(v =>
    v.source === 'trade-in' || v.source === 'private-party'
  );

  const totalFloorplanBalance = floorplanVehicles.reduce((sum, v) => sum + v.acquisitionCost, 0);
  const monthlyInterestTotal = floorplanVehicles.reduce((sum, v) => sum + Math.round((v.acquisitionCost * APR) / 12), 0);
  const avgDaysOnPlan = floorplanVehicles.length > 0
    ? Math.round(floorplanVehicles.reduce((sum, v) => sum + v.daysOnLot, 0) / floorplanVehicles.length)
    : 0;

  function curtailmentStatus(daysTo: number): { label: string; bg: string; color: string } {
    if (daysTo > 30) return { label: 'On Track', bg: '#DCFCE7', color: '#16A34A' };
    if (daysTo > 15) return { label: 'Watch', bg: '#FEF9C3', color: '#D97706' };
    return { label: 'Urgent', bg: '#FEE2E2', color: '#DC2626' };
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Floorplan Tracker
        </h1>
        <p className="mt-1 text-base" style={{ color: '#57534E' }}>
          Vehicles on floorplan financing — curtailment dates and interest accruing
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Total Floorplan Balance
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>
            ${totalFloorplanBalance.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>{floorplanVehicles.length} units on plan</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Monthly Interest
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#D97706' }}>
            ${monthlyInterestTotal.toLocaleString()}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>at 6.5% APR</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Avg Days on Plan
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#2563EB' }}>
            {avgDaysOnPlan}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>days average</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Units on Floorplan
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>
            {floorplanVehicles.length}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>of {activeVehicles.length} active units</p>
        </div>
      </div>

      {/* Floorplan Table */}
      <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #E7E5E4' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>
            Floorplan Detail
          </h2>
          <p className="text-sm mt-0.5" style={{ color: '#57534E' }}>
            Auction-sourced vehicles — 90-day curtailment window
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E7E5E4' }}>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Stock #</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Vehicle</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Days on Lot</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Floorplan Amt</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Mo. Interest</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Curtailment Date</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Days Left</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {floorplanVehicles.map((v, i) => {
              const curtailDate = calcCurtailmentDate(v.acquiredDate);
              const daysLeft = daysBetween(TODAY, curtailDate);
              const status = curtailmentStatus(daysLeft);
              const monthlyInterest = Math.round((v.acquisitionCost * APR) / 12);
              return (
                <tr key={v.id} style={{ borderBottom: i < floorplanVehicles.length - 1 ? '1px solid #F5F5F4' : undefined }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1C1917' }}>{v.id}</td>
                  <td className="px-4 py-3" style={{ color: '#57534E' }}>{v.year} {v.make} {v.model} {v.trim}</td>
                  <td className="px-4 py-3 text-right" style={{ color: '#57534E' }}>{v.daysOnLot}</td>
                  <td className="px-4 py-3 text-right font-semibold" style={{ color: '#1C1917' }}>${v.acquisitionCost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right" style={{ color: '#D97706' }}>${monthlyInterest.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center" style={{ color: '#57534E' }}>{curtailDate}</td>
                  <td
                    className="px-4 py-3 text-right font-semibold"
                    style={{ color: daysLeft < 15 ? '#DC2626' : daysLeft < 30 ? '#D97706' : '#16A34A' }}
                  >
                    {daysLeft}d
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#F8FAFC', borderTop: '2px solid #E7E5E4' }}>
              <td className="px-4 py-3 font-bold text-sm" colSpan={3} style={{ color: '#1C1917' }}>Totals</td>
              <td className="px-4 py-3 text-right font-bold text-sm" style={{ color: '#1C1917' }}>
                ${totalFloorplanBalance.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right font-bold text-sm" style={{ color: '#D97706' }}>
                ${monthlyInterestTotal.toLocaleString()}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Cash vs Floorplan Comparison */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1C1917' }}>
          Cash vs Floorplan Mix
        </h2>
        <div className="flex items-end gap-8 h-36">
          {[
            { label: 'Floorplan (Auction)', count: floorplanVehicles.length, color: '#2563EB', total: totalFloorplanBalance },
            { label: 'Cash (Trade-in / Private)', count: cashVehicles.length, color: '#16A34A', total: cashVehicles.reduce((s, v) => s + v.acquisitionCost, 0) },
          ].map(bar => {
            const maxCount = Math.max(floorplanVehicles.length, cashVehicles.length);
            const heightPct = maxCount > 0 ? Math.round((bar.count / maxCount) * 100) : 0;
            return (
              <div key={bar.label} className="flex flex-col items-center gap-2 flex-1">
                <p className="text-sm font-bold" style={{ color: '#1C1917' }}>{bar.count} units</p>
                <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                  <div
                    className="w-24 rounded-t-lg"
                    style={{ height: `${heightPct}%`, backgroundColor: bar.color, minHeight: '20px' }}
                  />
                </div>
                <p className="text-sm font-semibold text-center" style={{ color: '#57534E' }}>{bar.label}</p>
                <p className="text-xs" style={{ color: '#78716C' }}>${bar.total.toLocaleString()} total</p>
              </div>
            );
          })}
        </div>
        <p className="text-sm mt-4" style={{ color: '#57534E' }}>
          <strong style={{ color: '#1C1917' }}>{floorplanVehicles.length} of {activeVehicles.length}</strong> active units are on floorplan financing.
          Monthly interest cost of <strong style={{ color: '#D97706' }}>${monthlyInterestTotal.toLocaleString()}</strong> incentivizes faster turnover on aged units.
        </p>
      </div>
    </div>
  );
}
