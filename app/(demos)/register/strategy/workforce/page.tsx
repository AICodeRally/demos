'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';

const FORMAT_HEADCOUNT = [
  { format: 'Flagship', stores: 12, avgReps: 8, totalReps: 96, trafficRatio: '1:420', color: '#1E3A5F' },
  { format: 'Standard', stores: 120, avgReps: 4, totalReps: 480, trafficRatio: '1:580', color: '#06B6D4' },
  { format: 'Outlet', stores: 48, avgReps: 3, totalReps: 144, trafficRatio: '1:720', color: '#8B5CF6' },
  { format: 'Shop-in-Shop', stores: 20, avgReps: 2, totalReps: 40, trafficRatio: '1:350', color: '#10B981' },
];

const TURNOVER = [
  { label: 'Annual Turnover Rate', value: '22%', color: '#EF4444' },
  { label: 'Cost per Replacement', value: '$8,000', color: '#F59E0B' },
  { label: 'Avg Time-to-Productive', value: '6 weeks', color: '#06B6D4' },
  { label: 'Total Annual Turnover Cost', value: '$1.5M', color: '#EF4444' },
];

const TRAFFIC_ANALYSIS = [
  { format: 'Flagship', peakRatio: '1:280', offPeakRatio: '1:620', recommendation: 'Adequate staffing' },
  { format: 'Standard', peakRatio: '1:380', offPeakRatio: '1:840', recommendation: 'Add flex shifts on weekends' },
  { format: 'Outlet', peakRatio: '1:480', offPeakRatio: '1:960', recommendation: 'Consider cross-training' },
  { format: 'Shop-in-Shop', peakRatio: '1:220', offPeakRatio: '1:510', recommendation: 'Optimal — partner covers gaps' },
];

export default function WorkforceModel() {
  return (
    <RegisterPage title="Workforce Model" subtitle="Staffing Efficiency" accentColor="#06B6D4">
      {/* Headcount by Format */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Headcount by Format
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FORMAT_HEADCOUNT.map((f) => (
            <div
              key={f.format}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '16px 18px',
                borderTop: `3px solid ${f.color}`,
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {f.format}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--register-text)', marginTop: 6 }}>
                {f.avgReps}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--register-text-muted)', marginLeft: 4 }}>avg reps</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                <div className="flex justify-between" style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--register-text-dim)' }}>Total Reps</span>
                  <span style={{ fontWeight: 600, color: 'var(--register-text)' }}>{f.totalReps}</span>
                </div>
                <div className="flex justify-between" style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--register-text-dim)' }}>Stores</span>
                  <span style={{ fontWeight: 600, color: 'var(--register-text)' }}>{f.stores}</span>
                </div>
                <div className="flex justify-between" style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--register-text-dim)' }}>Rep:Traffic</span>
                  <span style={{ fontWeight: 600, color: 'var(--register-text)' }}>{f.trafficRatio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rep-to-Traffic Ratio Analysis */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>Rep-to-Traffic Ratio Analysis</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', margin: '4px 0 0' }}>Monthly walk-ins per sales rep</p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--register-bg-surface)' }}>
              {['Format', 'Peak Ratio', 'Off-Peak Ratio', 'Recommendation'].map((h) => (
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
            {TRAFFIC_ANALYSIS.map((t) => (
              <tr key={t.format}>
                <td style={{ padding: '12px 20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--register-text)', borderBottom: '1px solid var(--register-border)' }}>
                  {t.format}
                </td>
                <td style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--register-text)', borderBottom: '1px solid var(--register-border)' }}>
                  {t.peakRatio}
                </td>
                <td style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--register-text)', borderBottom: '1px solid var(--register-border)' }}>
                  {t.offPeakRatio}
                </td>
                <td style={{ padding: '12px 20px', fontSize: '0.8rem', color: 'var(--register-text-muted)', borderBottom: '1px solid var(--register-border)' }}>
                  {t.recommendation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Turnover Metrics */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Turnover Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TURNOVER.map((t) => (
            <div
              key={t.label}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '16px 18px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: t.color }}>{t.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 4 }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </RegisterPage>
  );
}
