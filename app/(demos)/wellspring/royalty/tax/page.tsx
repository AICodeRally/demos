'use client';

import { StatCard, KanbanBoard } from '@/components/demos/wellspring';
import { SEVERANCE_TAXES } from '@/data/wellspring';

/* ── Kanban: tax filing status ────────────────────────── */

const kanbanColumns = [
  {
    title: 'Draft',
    color: '#94A3B8',
    cards: [
      {
        title: 'Q1 2026 Ad Valorem — Reeves County',
        assignee: 'Lisa Park',
        priority: 'medium' as const,
        due: 'Apr 15',
        category: 'Ad Valorem',
      },
      {
        title: 'Q1 2026 Ad Valorem — Pecos County',
        assignee: 'Lisa Park',
        priority: 'medium' as const,
        due: 'Apr 15',
        category: 'Ad Valorem',
      },
    ],
  },
  {
    title: 'Submitted',
    color: '#EAB308',
    cards: [
      {
        title: 'Feb 2026 Oil Severance Tax (4.6%)',
        assignee: 'James Wright',
        priority: 'high' as const,
        due: 'Mar 20',
        category: 'Severance',
      },
      {
        title: 'Feb 2026 Gas Severance Tax (7.5%)',
        assignee: 'James Wright',
        priority: 'high' as const,
        due: 'Mar 20',
        category: 'Severance',
      },
    ],
  },
  {
    title: 'Accepted',
    color: '#059669',
    cards: [
      {
        title: 'Jan 2026 Oil Severance Tax (4.6%)',
        assignee: 'James Wright',
        priority: 'low' as const,
        due: 'Feb 20',
        category: 'Severance',
      },
      {
        title: 'Jan 2026 Gas Severance Tax (7.5%)',
        assignee: 'James Wright',
        priority: 'low' as const,
        due: 'Feb 20',
        category: 'Severance',
      },
    ],
  },
];

/* ── Tax calculation by lease ─────────────────────────── */

const LEASE_TAXES = [
  {
    lease: 'Mustang Ranch Unit',
    oilVol: 4785,
    gasVol: 10200,
    oilTax: 16048,
    gasTax: 5805,
    total: 21853,
    status: 'filed' as const,
  },
  {
    lease: 'Rattlesnake Draw',
    oilVol: 6405,
    gasVol: 13600,
    oilTax: 21478,
    gasTax: 7752,
    total: 29230,
    status: 'filed' as const,
  },
  {
    lease: 'Sidewinder Mesa',
    oilVol: 7575,
    gasVol: 16100,
    oilTax: 25402,
    gasTax: 9177,
    total: 34579,
    status: 'pending' as const,
  },
  {
    lease: 'Diamondback Federal',
    oilVol: 10210,
    gasVol: 21700,
    oilTax: 34244,
    gasTax: 12368,
    total: 46612,
    status: 'pending' as const,
  },
];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  filed: { bg: 'rgba(5, 150, 105, 0.15)', text: '#059669' },
  pending: { bg: 'rgba(234, 179, 8, 0.15)', text: '#EAB308' },
  due: { bg: 'rgba(220, 38, 38, 0.15)', text: '#DC2626' },
};

export default function RoyaltyTaxPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-semibold mb-1"
          style={{ color: '#7C3AED' }}
        >
          Act 6 &middot; Royalty Accountant
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: '#F1F5F9' }}>
          Tax &amp; Compliance
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Filing status, severance tax calculations &amp; regulatory compliance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Severance Tax Due"
          value="$192K"
          color="#7C3AED"
          sparkline={[170, 175, 180, 185, 188, 192]}
        />
        <StatCard
          label="Ad Valorem"
          value="$84K"
          trend="flat"
          trendValue="Q1 estimate"
          color="#7C3AED"
        />
        <StatCard
          label="Next Filing"
          value="Mar 15"
          trend="flat"
          trendValue="11 days"
          color="#DC2626"
        />
        <StatCard
          label="Compliance Status"
          value="Current"
          trend="up"
          trendValue="all filings"
          color="#059669"
        />
      </div>

      {/* Kanban Board */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Filing Status Board
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          Tax filings by stage — Draft → Submitted → Accepted
        </p>
        <KanbanBoard columns={kanbanColumns} />
      </div>

      {/* Tax Calculation by Lease */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#F1F5F9' }}>
          Tax Calculation by Lease
        </h3>
        <p className="text-[11px] mb-4" style={{ color: '#64748B' }}>
          February 2026 — Oil (4.6%) + Gas (7.5%) severance taxes
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th className="text-left py-2 font-medium" style={{ color: '#94A3B8' }}>Lease</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Oil (BBL)</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Gas (MCF)</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Oil Tax</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Gas Tax</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Total</th>
                <th className="text-right py-2 font-medium" style={{ color: '#94A3B8' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {LEASE_TAXES.map((lt, i) => {
                const statusStyle = STATUS_STYLES[lt.status] || STATUS_STYLES.pending;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #252B36' }}>
                    <td className="py-2 font-medium" style={{ color: '#F1F5F9' }}>{lt.lease}</td>
                    <td className="py-2 text-right tabular-nums" style={{ color: '#CBD5E1' }}>
                      {lt.oilVol.toLocaleString()}
                    </td>
                    <td className="py-2 text-right tabular-nums" style={{ color: '#CBD5E1' }}>
                      {lt.gasVol.toLocaleString()}
                    </td>
                    <td className="py-2 text-right tabular-nums" style={{ color: '#B45309' }}>
                      ${lt.oilTax.toLocaleString()}
                    </td>
                    <td className="py-2 text-right tabular-nums" style={{ color: '#6B7280' }}>
                      ${lt.gasTax.toLocaleString()}
                    </td>
                    <td className="py-2 text-right font-bold tabular-nums" style={{ color: '#7C3AED' }}>
                      ${lt.total.toLocaleString()}
                    </td>
                    <td className="py-2 text-right">
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                      >
                        {lt.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr style={{ borderTop: '2px solid #334155' }}>
                <td className="py-2 font-bold" style={{ color: '#F1F5F9' }}>Total</td>
                <td className="py-2 text-right font-bold tabular-nums" style={{ color: '#CBD5E1' }}>
                  {LEASE_TAXES.reduce((s, l) => s + l.oilVol, 0).toLocaleString()}
                </td>
                <td className="py-2 text-right font-bold tabular-nums" style={{ color: '#CBD5E1' }}>
                  {LEASE_TAXES.reduce((s, l) => s + l.gasVol, 0).toLocaleString()}
                </td>
                <td className="py-2 text-right font-bold tabular-nums" style={{ color: '#B45309' }}>
                  ${LEASE_TAXES.reduce((s, l) => s + l.oilTax, 0).toLocaleString()}
                </td>
                <td className="py-2 text-right font-bold tabular-nums" style={{ color: '#6B7280' }}>
                  ${LEASE_TAXES.reduce((s, l) => s + l.gasTax, 0).toLocaleString()}
                </td>
                <td className="py-2 text-right font-bold tabular-nums" style={{ color: '#7C3AED' }}>
                  ${LEASE_TAXES.reduce((s, l) => s + l.total, 0).toLocaleString()}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
