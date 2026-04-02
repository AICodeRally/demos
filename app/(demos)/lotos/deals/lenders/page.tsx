'use client';

import { LENDERS, LENDER_TYPE_COLORS } from '@/data/lotos';

// Nicole Anderson (CUS-010) — near-prime tier, estimated 660-719 → use 690
const CUSTOMER_CREDIT_SCORE = 690;

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

export default function LendersPage() {
  const sorted = [...LENDERS].sort((a, b) => b.approvalRate - a.approvalRate);

  const avgApprovalRate = Math.round(
    LENDERS.reduce((sum, l) => sum + l.approvalRate, 0) / LENDERS.length
  );
  const fastestFunder = [...LENDERS].sort((a, b) => a.avgDaysToFund - b.avgDaysToFund)[0];
  const bestRate = [...LENDERS].sort((a, b) => a.avgBuyRate - b.avgBuyRate)[0];

  const lenderTypeLabels: Record<string, string> = {
    bank: 'Bank',
    'credit-union': 'Credit Union',
    captive: 'Captive',
    subprime: 'Subprime',
    bhph: 'BHPH',
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Lender Matching
        </h1>
        <p style={{ color: '#57534E', fontSize: '16px', marginTop: '4px' }}>
          Ranked by approval rate — matched to active deal customer Nicole Anderson (est. 690 credit score)
        </p>
      </div>

      {/* Quick Stats */}
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

      {/* Lender Table */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-xl font-bold" style={{ color: '#1C1917', marginBottom: '16px' }}>
          Lender Comparison
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                {['Lender', 'Type', 'Min Credit', 'Max Advance', 'Avg Buy Rate', 'Avg Days to Fund', 'Approval Rate', 'Match'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 12px',
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {sorted.map((lender, idx) => {
                const match = getMatchStatus(lender.minCreditScore, CUSTOMER_CREDIT_SCORE);
                return (
                  <tr
                    key={lender.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAF9',
                    }}
                  >
                    {/* Lender Name */}
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#1C1917' }}>
                        {lender.name}
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td style={{ padding: '14px 12px' }}>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: LENDER_TYPE_COLORS[lender.type] + '20',
                          color: LENDER_TYPE_COLORS[lender.type],
                          border: `1px solid ${LENDER_TYPE_COLORS[lender.type]}40`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {lenderTypeLabels[lender.type]}
                      </span>
                    </td>

                    {/* Min Credit Score */}
                    <td style={{ padding: '14px 12px', fontSize: '14px', color: '#57534E', fontWeight: 500 }}>
                      {lender.minCreditScore === 0 ? 'None' : lender.minCreditScore}
                    </td>

                    {/* Max Advance */}
                    <td style={{ padding: '14px 12px', fontSize: '14px', color: '#57534E', fontWeight: 500 }}>
                      {lender.maxAdvance}%
                    </td>

                    {/* Avg Buy Rate */}
                    <td style={{ padding: '14px 12px', fontSize: '14px', fontWeight: 700, color: '#1C1917' }}>
                      {lender.avgBuyRate}%
                    </td>

                    {/* Avg Days to Fund */}
                    <td style={{ padding: '14px 12px', fontSize: '14px', color: '#57534E', fontWeight: 500 }}>
                      {lender.avgDaysToFund === 0 ? 'Same Day' : `${lender.avgDaysToFund} days`}
                    </td>

                    {/* Approval Rate with bar */}
                    <td style={{ padding: '14px 12px', minWidth: '140px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            flex: 1,
                            height: '8px',
                            background: '#F1F5F9',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${lender.approvalRate}%`,
                              background: lender.approvalRate >= 80 ? '#16A34A' : lender.approvalRate >= 65 ? '#2563EB' : '#D97706',
                              borderRadius: '4px',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C1917', minWidth: '36px' }}>
                          {lender.approvalRate}%
                        </span>
                      </div>
                    </td>

                    {/* Match Indicator */}
                    <td style={{ padding: '14px 12px' }}>
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
                          fontSize: '12px',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: 800 }}>{match.icon}</span>
                        {match.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '16px', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E7E5E4' }}>
          <div style={{ fontSize: '13px', color: '#78716C' }}>
            <strong style={{ color: '#57534E' }}>Match Logic:</strong> Green = lender min score ≤ customer est. score (690).
            Amber = within 30 points. Red = does not qualify.
          </div>
        </div>
      </div>
    </div>
  );
}
