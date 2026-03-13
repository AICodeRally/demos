'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';

const FORMAT_TARGETS = [
  { format: 'Flagship', target: '$280K', current: '$248K', pct: 89, stores: 12, color: '#1E3A5F' },
  { format: 'Standard', target: '$160K', current: '$142K', pct: 89, stores: 120, color: '#06B6D4' },
  { format: 'Outlet', target: '$95K', current: '$88K', pct: 93, stores: 48, color: '#8B5CF6' },
  { format: 'Shop-in-Shop', target: '$55K', current: '$51K', pct: 93, stores: 20, color: '#10B981' },
];

const VARIANCE = [
  { format: 'Flagship', variance: '-$32K', status: 'Under', statusColor: '#EF4444', note: 'Q1 traffic below forecast in 4 locations' },
  { format: 'Standard', variance: '-$18K', status: 'Under', statusColor: '#EF4444', note: 'Seasonal softness — recovery expected by May' },
  { format: 'Outlet', variance: '-$7K', status: 'Slight Under', statusColor: '#F59E0B', note: 'Clearance inventory replenishment pending' },
  { format: 'Shop-in-Shop', variance: '-$4K', status: 'On Track', statusColor: '#10B981', note: 'Purple partnership driving above-plan weekends' },
];

export default function StoreTargets() {
  return (
    <RegisterPage title="Store Targets" subtitle="FY26 Target Allocation" accentColor="#06B6D4">
      {/* Target Allocation by Format */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 20 }}>
          Target Allocation by Format (per store/month)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FORMAT_TARGETS.map((f) => (
            <div
              key={f.format}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '16px 18px',
                borderLeft: `4px solid ${f.color}`,
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {f.format} ({f.stores} stores)
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--register-text)', marginTop: 6 }}>
                {f.target}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
                per store / month
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current vs Target Progress Bars */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 20 }}>
          Current vs. Target (MTD)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FORMAT_TARGETS.map((f) => (
            <div key={f.format}>
              <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                <div className="flex items-center gap-2">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, display: 'inline-block' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--register-text)' }}>{f.format}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)' }}>
                  {f.current} / {f.target}
                  <span style={{ fontWeight: 700, color: f.pct >= 90 ? '#10B981' : '#F59E0B', marginLeft: 8 }}>
                    {f.pct}%
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 10, borderRadius: 5, background: 'var(--register-bg-surface)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${f.pct}%`,
                    borderRadius: 5,
                    background: f.color,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Variance Analysis */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>Variance Analysis</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--register-bg-surface)' }}>
              {['Format', 'Variance', 'Status', 'Notes'].map((h) => (
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
            {VARIANCE.map((v) => (
              <tr key={v.format}>
                <td style={{ padding: '12px 20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--register-text)', borderBottom: '1px solid var(--register-border)' }}>
                  {v.format}
                </td>
                <td style={{ padding: '12px 20px', fontSize: '0.85rem', fontWeight: 700, color: '#EF4444', borderBottom: '1px solid var(--register-border)' }}>
                  {v.variance}
                </td>
                <td style={{ padding: '12px 20px', borderBottom: '1px solid var(--register-border)' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: `${v.statusColor}18`, color: v.statusColor, textTransform: 'uppercase' }}>
                    {v.status}
                  </span>
                </td>
                <td style={{ padding: '12px 20px', fontSize: '0.8rem', color: 'var(--register-text-muted)', borderBottom: '1px solid var(--register-border)' }}>
                  {v.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RegisterPage>
  );
}
