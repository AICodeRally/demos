'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { SPIFF_CALENDAR } from '@/data/register/comp-data';

const PAST_ROI = [
  { name: 'New Year Mattress Push', spend: '$42K', incremental: '$186K', roi: '4.4x', roiColor: '#10B981' },
  { name: "Presidents' Day Sale SPIFF", spend: '$38K', incremental: '$210K', roi: '5.5x', roiColor: '#10B981' },
];

const UPCOMING = [
  { name: 'Spring Clearance Bonus', month: 'April', product: 'Outlet Inventory', bonus: '2x commission', projectedROI: '3.8x' },
  { name: 'Memorial Day Weekend', month: 'May', product: 'All Products', bonus: '$10/unit + team pool', projectedROI: '4.2x' },
  { name: 'Summer Sleep Challenge', month: 'June', product: 'Cooling Products', bonus: '$20/unit', projectedROI: '3.5x' },
];

export default function PromotionCalendar() {
  const insight = getInsight('strategy/promotions');

  return (
    <RegisterPage title="Promotion Calendar" subtitle="SPIFF & Incentive Programs" accentColor="#06B6D4">
      {/* Timeline View */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          FY26 SPIFF Timeline
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SPIFF_CALENDAR.map((s) => {
            const isPast = !s.active && new Date(s.endDate) < new Date('2026-03-13');
            const isFuture = !s.active && !isPast;
            let borderStyle: string;
            let bgStyle: string;
            let opacity = 1;

            if (s.active) {
              borderStyle = '2px solid #10B981';
              bgStyle = 'rgba(16, 185, 129, 0.06)';
            } else if (isPast) {
              borderStyle = '1px solid var(--register-border)';
              bgStyle = 'var(--register-bg-surface)';
              opacity = 0.5;
            } else {
              borderStyle = '1px dashed #06B6D4';
              bgStyle = 'var(--register-bg-surface)';
            }

            return (
              <div
                key={s.name}
                style={{
                  background: bgStyle,
                  border: borderStyle,
                  borderRadius: 10,
                  padding: '12px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity,
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{s.name}</span>
                    {s.active && (
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#10B981', color: '#fff', textTransform: 'uppercase' }}>
                        Active
                      </span>
                    )}
                    {isFuture && (
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(6, 182, 212, 0.12)', color: '#06B6D4', textTransform: 'uppercase' }}>
                        Upcoming
                      </span>
                    )}
                    {isPast && (
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'var(--register-bg-surface)', color: 'var(--register-text-dim)', textTransform: 'uppercase' }}>
                        Completed
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
                    {s.product} &middot; {s.bonus}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--register-text-dim)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {s.startDate.slice(5)} &mdash; {s.endDate.slice(5)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Promotion ROI */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>Past Promotion ROI</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--register-bg-surface)' }}>
              {['Promotion', 'Spend', 'Incremental Rev', 'ROI'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 20px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: 'var(--register-text-muted)',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--register-border)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAST_ROI.map((r) => (
              <tr key={r.name}>
                <td style={{ padding: '12px 20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--register-text)', borderBottom: '1px solid var(--register-border)' }}>
                  {r.name}
                </td>
                <td style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--register-text)', borderBottom: '1px solid var(--register-border)' }}>
                  {r.spend}
                </td>
                <td style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--register-text)', borderBottom: '1px solid var(--register-border)' }}>
                  {r.incremental}
                </td>
                <td style={{ padding: '12px 20px', fontSize: '0.85rem', fontWeight: 700, color: r.roiColor, borderBottom: '1px solid var(--register-border)' }}>
                  {r.roi}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Promotions */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Upcoming Promotions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {UPCOMING.map((u) => (
            <div
              key={u.name}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '16px 18px',
                borderLeft: '3px solid #06B6D4',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{u.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 4 }}>
                {u.month} &middot; {u.product}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
                Bonus: {u.bonus}
              </div>
              <div style={{ marginTop: 8, fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--register-text-dim)' }}>Projected ROI: </span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>{u.projectedROI}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </RegisterPage>
  );
}
