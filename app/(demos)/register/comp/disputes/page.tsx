'use client';

import { StatCard } from '@/components/demos/register';
import { DISPUTES, type DisputeRecord } from '@/data/register/comp-data';

const STATUS_STYLES: Record<DisputeRecord['status'], { label: string; bg: string; color: string }> = {
  submitted: { label: 'Submitted', bg: '#FEF9C3', color: '#CA8A04' },
  under_review: { label: 'Under Review', bg: '#DBEAFE', color: '#1D4ED8' },
  resolved: { label: 'Resolved', bg: '#DCFCE7', color: '#16A34A' },
};

export default function Disputes() {
  const openDisputes = DISPUTES.filter((d) => d.status !== 'resolved');
  const resolvedDisputes = DISPUTES.filter((d) => d.status === 'resolved');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Dispute Management</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Track, file, and resolve commission discrepancies and calculation disputes
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Open Disputes"
          value={String(openDisputes.length)}
          color="#F59E0B"
          trendValue="Awaiting resolution"
        />
        <StatCard
          label="Avg Resolution Time"
          value="2.4 days"
          color="#06B6D4"
          trendValue="Last 90 days"
        />
        <StatCard
          label="Resolution Rate"
          value="94%"
          color="#10B981"
          trend="up"
          trendValue="YTD"
        />
      </div>

      {/* Dispute Table */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>All Disputes</p>
          <button
            onClick={() => alert('Filing disputes coming in production')}
            className="px-4 py-1.5 rounded-lg text-[12px] font-semibold"
            style={{ backgroundColor: '#1E3A5F', color: '#FFFFFF' }}
          >
            + File Dispute
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>ID</th>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Sale Date</th>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Transaction</th>
                <th className="text-right py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Expected</th>
                <th className="text-right py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Calculated</th>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Discrepancy</th>
                <th className="text-center py-2 pr-3 font-semibold" style={{ color: '#94A3B8' }}>Status</th>
                <th className="text-left py-2 font-semibold" style={{ color: '#94A3B8' }}>Filed</th>
              </tr>
            </thead>
            <tbody>
              {DISPUTES.map((d) => {
                const style = STATUS_STYLES[d.status];
                const diff = d.expectedAmount - d.calculatedAmount;
                return (
                  <tr key={d.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td className="py-2.5 pr-3 font-mono font-semibold" style={{ color: '#1E3A5F' }}>{d.id}</td>
                    <td className="py-2.5 pr-3" style={{ color: '#475569' }}>{d.saleDate}</td>
                    <td className="py-2.5 pr-3 font-mono" style={{ color: '#475569' }}>{d.transactionId}</td>
                    <td className="py-2.5 pr-3 text-right font-mono" style={{ color: '#0F172A' }}>
                      ${d.expectedAmount.toFixed(2)}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono" style={{ color: '#475569' }}>
                      ${d.calculatedAmount.toFixed(2)}
                    </td>
                    <td className="py-2.5 pr-3" style={{ color: '#475569', maxWidth: 220 }}>
                      <div className="flex items-start gap-1.5">
                        <span className="shrink-0 font-bold font-mono" style={{ color: '#EF4444' }}>
                          -${diff.toFixed(2)}
                        </span>
                        <span className="text-[11px] leading-relaxed">{d.discrepancy}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-center">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        {style.label}
                      </span>
                    </td>
                    <td className="py-2.5" style={{ color: '#94A3B8' }}>{d.filedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution History */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Resolution History</p>

        {resolvedDisputes.length === 0 ? (
          <p className="text-[12px] text-center py-8" style={{ color: '#94A3B8' }}>No resolved disputes yet</p>
        ) : (
          <div className="space-y-4">
            {resolvedDisputes.map((d) => (
              <div
                key={d.id}
                className="flex gap-4 p-4 rounded-xl"
                style={{ backgroundColor: '#F0FDF4', borderLeft: '3px solid #10B981' }}
              >
                <div className="shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#10B981' }}
                  >
                    <span className="text-white text-[11px] font-bold">✓</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold" style={{ color: '#0F172A' }}>
                      {d.id} — {d.transactionId}
                    </span>
                    <span className="text-[10px]" style={{ color: '#94A3B8' }}>
                      Resolved {d.resolvedDate}
                    </span>
                  </div>
                  <p className="text-[11px] mb-1" style={{ color: '#475569' }}>{d.discrepancy}</p>
                  <p className="text-[11px] font-semibold" style={{ color: '#16A34A' }}>
                    Resolution: {d.resolution}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-mono" style={{ color: '#94A3B8' }}>
                      Expected: ${d.expectedAmount.toFixed(2)}
                    </span>
                    <span className="text-[10px]" style={{ color: '#94A3B8' }}>→</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: '#10B981' }}>
                      Credited: ${d.expectedAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
