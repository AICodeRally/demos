'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';

const REGIONS = [
  { name: 'South', stores: 72, revenue: '$98M', pctTotal: '29%' },
  { name: 'West', stores: 48, revenue: '$72M', pctTotal: '21%' },
  { name: 'Northeast', stores: 44, revenue: '$94M', pctTotal: '28%' },
  { name: 'Midwest', stores: 36, revenue: '$76M', pctTotal: '22%' },
];

const FORMAT_PERF = [
  { format: 'Flagship', revPerStore: '$4.2M', asp: '$2,800', attachRate: '38%', color: '#1E3A5F' },
  { format: 'Standard', revPerStore: '$2.1M', asp: '$1,900', attachRate: '31%', color: '#06B6D4' },
  { format: 'Outlet', revPerStore: '$980K', asp: '$1,200', attachRate: '18%', color: '#8B5CF6' },
  { format: 'Shop-in-Shop', revPerStore: '$380K', asp: '$1,600', attachRate: '35%', color: '#10B981' },
];

const TOP_STORES = [
  { rank: 1, name: 'Flagship #3 — Scottsdale', revenue: '$6.8M', asp: '$3,100', badge: 'Top Performer' },
  { rank: 2, name: 'Flagship #7 — Manhattan', revenue: '$6.2M', asp: '$3,400', badge: 'Top Performer' },
  { rank: 3, name: 'Standard #42 — Nashville', revenue: '$3.1M', asp: '$2,200', badge: 'Breakout' },
];

const BOTTOM_STORES = [
  { rank: 198, name: 'Outlet #31 — Tulsa', revenue: '$420K', asp: '$780', badge: 'Under Review' },
  { rank: 199, name: 'SiS #14 — Mall of Georgia', revenue: '$285K', asp: '$1,100', badge: 'At Risk' },
  { rank: 200, name: 'Outlet #44 — Bakersfield', revenue: '$210K', asp: '$690', badge: 'Conversion Candidate' },
];

const thStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--register-text-muted)',
  textAlign: 'left',
  borderBottom: '1px solid var(--register-border)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 20px',
  fontSize: '0.875rem',
  color: 'var(--register-text)',
  borderBottom: '1px solid var(--register-border)',
};

export default function StorePortfolio() {
  const insight = getInsight('corp/portfolio');

  return (
    <RegisterPage title="Store Portfolio" subtitle="200 Locations by Format & Region" accentColor="#1E3A5F">
      {/* Regional Breakdown Table */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>Regional Breakdown</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--register-bg-surface)' }}>
              {['Region', 'Stores', 'Revenue', '% of Total'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REGIONS.map((r) => (
              <tr key={r.name}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{r.name}</td>
                <td style={tdStyle}>{r.stores}</td>
                <td style={tdStyle}>{r.revenue}</td>
                <td style={tdStyle}>{r.pctTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Format Performance Comparison */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 20px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>Format Performance Comparison</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--register-bg-surface)' }}>
              {['Format', 'Rev / Store', 'Avg ASP', 'Attach Rate'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FORMAT_PERF.map((f) => (
              <tr key={f.format}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>
                  <span className="inline-flex items-center gap-2">
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, display: 'inline-block', flexShrink: 0 }} />
                    {f.format}
                  </span>
                </td>
                <td style={tdStyle}>{f.revPerStore}</td>
                <td style={tdStyle}>{f.asp}</td>
                <td style={tdStyle}>{f.attachRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top / Bottom Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 14 }}>Top 3 Stores</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TOP_STORES.map((s) => (
              <div key={s.rank} style={{ background: 'var(--register-bg-surface)', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2 }}>Rev: {s.revenue} &middot; ASP: {s.asp}</div>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{s.badge}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 14 }}>Bottom 3 Stores</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BOTTOM_STORES.map((s) => (
              <div key={s.rank} style={{ background: 'var(--register-bg-surface)', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2 }}>Rev: {s.revenue} &middot; ASP: {s.asp}</div>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{s.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </RegisterPage>
  );
}
