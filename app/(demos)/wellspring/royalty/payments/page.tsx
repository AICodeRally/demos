'use client';

import { StatCard } from '@/components/demos/wellspring';
import { ROYALTY_OWNERS } from '@/data/wellspring';

/* ── Payment feed data ────────────────────────────────── */

const recentPayments = ROYALTY_OWNERS
  .filter((o) => o.filingStatus !== 'delinquent')
  .slice(0, 15)
  .map((owner, i) => ({
    owner: owner.name,
    amount: owner.totalMonthlyPayment,
    checkNo: `CHK-${(78420 + i).toString()}`,
    date: owner.lastPaymentDate,
    status: owner.filingStatus === 'current' ? 'paid' : 'processing',
    lease: owner.leaseName,
  }));

const totalPayments = ROYALTY_OWNERS.reduce((s, o) => s + o.totalMonthlyPayment, 0);
const avgCheck = totalPayments / ROYALTY_OWNERS.length;

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  paid: { bg: 'rgba(5, 150, 105, 0.15)', text: '#059669' },
  processing: { bg: 'rgba(234, 179, 8, 0.15)', text: '#EAB308' },
  pending: { bg: 'rgba(148, 163, 184, 0.15)', text: '#94A3B8' },
};

export default function RoyaltyPaymentsPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-mono mb-1"
          style={{ color: '#7C3AED' }}
        >
          Act 6 &middot; Royalty Accountant
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#F1F5F9' }}>
          Owner Payments
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Payment schedule, owner roster &amp; disbursement tracking
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Payments This Month"
          value={`$${(totalPayments / 1000).toFixed(0)}K`}
          trend="up"
          trendValue="+3.8%"
          color="#7C3AED"
          sparkline={[480, 500, 510, 520, 530, totalPayments / 1000]}
        />
        <StatCard
          label="Owners"
          value="38"
          trend="flat"
          trendValue="4 leases"
          color="#7C3AED"
        />
        <StatCard
          label="Avg Check"
          value={`$${(avgCheck / 1000).toFixed(1)}K`}
          color="#7C3AED"
        />
        <StatCard
          label="On-Time Rate"
          value="100%"
          trend="up"
          trendValue="all current"
          color="#059669"
        />
      </div>

      {/* Payment Feed */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#F1F5F9' }}>
          Recent Payments
        </h3>
        <div className="max-h-96 overflow-y-auto space-y-1.5">
          {recentPayments.map((payment, i) => {
            const statusStyle = STATUS_STYLES[payment.status] || STATUS_STYLES.pending;
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px]"
                style={{ backgroundColor: i % 2 === 0 ? '#2A3241' : 'transparent' }}
              >
                <span className="font-mono shrink-0 w-[70px]" style={{ color: '#94A3B8' }}>
                  {payment.date.slice(5)}
                </span>
                <span className="font-medium flex-1 truncate" style={{ color: '#F1F5F9' }}>
                  {payment.owner}
                </span>
                <span className="shrink-0 w-[120px] truncate" style={{ color: '#64748B' }}>
                  {payment.lease}
                </span>
                <span className="font-bold font-mono shrink-0 w-[80px] text-right" style={{ color: '#7C3AED' }}>
                  ${payment.amount.toLocaleString()}
                </span>
                <span className="font-mono shrink-0 w-[80px] text-right" style={{ color: '#94A3B8' }}>
                  {payment.checkNo}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase shrink-0"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                >
                  {payment.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Owner List Table */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Full Owner Roster
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          38 royalty owners across 4 leases
        </p>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-[11px]">
            <thead className="sticky top-0" style={{ backgroundColor: '#1E2530' }}>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Name</th>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Lease</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Interest %</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Amount</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Check #</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ROYALTY_OWNERS.map((owner, i) => {
                const statusStyle = owner.filingStatus === 'current'
                  ? STATUS_STYLES.paid
                  : owner.filingStatus === 'pending'
                    ? STATUS_STYLES.processing
                    : { bg: 'rgba(220, 38, 38, 0.15)', text: '#DC2626' };
                return (
                  <tr key={owner.id} style={{ borderBottom: '1px solid #252B36' }}>
                    <td className="py-1.5 font-medium" style={{ color: '#F1F5F9' }}>{owner.name}</td>
                    <td className="py-1.5" style={{ color: '#CBD5E1' }}>{owner.leaseName}</td>
                    <td className="py-1.5 text-right font-mono" style={{ color: '#CBD5E1' }}>
                      {(owner.decimalInterest * 100).toFixed(3)}%
                    </td>
                    <td className="py-1.5 text-right font-mono font-bold" style={{ color: '#7C3AED' }}>
                      ${owner.totalMonthlyPayment.toLocaleString()}
                    </td>
                    <td className="py-1.5 text-right font-mono" style={{ color: '#94A3B8' }}>
                      CHK-{(78420 + i).toString()}
                    </td>
                    <td className="py-1.5 text-right">
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                      >
                        {owner.filingStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
