'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';

const DISTRICTS = [
  { name: 'Northeast', dm: 'Sarah Chen', stores: 34, revenue: '$76.2M', headcount: 142, status: 'On Track', statusColor: '#10B981', revPerStore: '$2.24M', revPerRep: '$537K', attachRate: '34%' },
  { name: 'Southeast', dm: 'Marcus Williams', stores: 31, revenue: '$66.9M', headcount: 124, status: 'On Track', statusColor: '#10B981', revPerStore: '$2.16M', revPerRep: '$540K', attachRate: '32%' },
  { name: 'Mid-Atlantic', dm: 'Karen Mitchell', stores: 30, revenue: '$64.6M', headcount: 118, status: 'On Track', statusColor: '#10B981', revPerStore: '$2.15M', revPerRep: '$547K', attachRate: '33%' },
  { name: 'Midwest', dm: 'Jennifer Park', stores: 26, revenue: '$54.6M', headcount: 98, status: 'Watch', statusColor: '#F59E0B', revPerStore: '$2.10M', revPerRep: '$557K', attachRate: '29%' },
  { name: 'Great Lakes', dm: "James O'Brien", stores: 19, revenue: '$49.8M', headcount: 82, status: 'Watch', statusColor: '#F59E0B', revPerStore: '$2.62M', revPerRep: '$607K', attachRate: '30%' },
  { name: 'Southwest', dm: 'David Rodriguez', stores: 24, revenue: '$49.1M', headcount: 92, status: 'Watch', statusColor: '#F59E0B', revPerStore: '$2.05M', revPerRep: '$534K', attachRate: '28%' },
  { name: 'Pacific NW', dm: 'Lisa Tanaka', stores: 20, revenue: '$39.6M', headcount: 76, status: 'On Track', statusColor: '#10B981', revPerStore: '$1.98M', revPerRep: '$521K', attachRate: '31%' },
  { name: 'Mountain', dm: 'Robert Foster', stores: 16, revenue: '$32.0M', headcount: 58, status: 'At Risk', statusColor: '#EF4444', revPerStore: '$2.00M', revPerRep: '$552K', attachRate: '24%' },
];

const thStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: '0.7rem',
  fontWeight: 700,
  color: 'var(--register-text-muted)',
  textAlign: 'left',
  borderBottom: '1px solid var(--register-border)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: '0.8rem',
  color: 'var(--register-text)',
  borderBottom: '1px solid var(--register-border)',
};

export default function DistrictPlanning() {
  const insight = getInsight('strategy/districts');

  return (
    <RegisterPage title="District Planning" subtitle="8 Districts — Store Alignment" accentColor="#06B6D4">
      {/* District Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {DISTRICTS.map((d) => (
          <div
            key={d.name}
            style={{
              background: 'var(--register-bg-elevated)',
              border: '1px solid var(--register-border)',
              borderRadius: 10,
              padding: '14px 18px',
              borderTop: '3px solid #06B6D4',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)' }}>{d.name}</div>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: `${d.statusColor}18`,
                  color: d.statusColor,
                  textTransform: 'uppercase',
                }}
              >
                {d.status}
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)', marginBottom: 8 }}>DM: {d.dm}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                ['Stores', String(d.stores)],
                ['Revenue', d.revenue],
                ['Headcount', String(d.headcount)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between" style={{ fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--register-text-dim)' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--register-text)' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* District Comparison Table */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>District Comparison</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--register-bg-surface)' }}>
              {['District', 'Rev / Store', 'Rev / Rep', 'Attach Rate'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DISTRICTS.map((d) => (
              <tr key={d.name}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{d.name}</td>
                <td style={tdStyle}>{d.revPerStore}</td>
                <td style={tdStyle}>{d.revPerRep}</td>
                <td style={tdStyle}>{d.attachRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </RegisterPage>
  );
}
