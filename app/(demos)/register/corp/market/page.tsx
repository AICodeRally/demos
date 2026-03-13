'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';

const MARKET_SHARE = [
  { name: 'Mattress Firm', pct: 28, color: '#64748B' },
  { name: 'Summit Sleep', pct: 18, color: '#1E3A5F' },
  { name: 'Tempur Sealy', pct: 15, color: '#8B5CF6' },
  { name: 'Sleep Number', pct: 12, color: '#06B6D4' },
  { name: 'Other', pct: 27, color: '#CBD5E1' },
];

const DIFFERENTIATORS = [
  { title: 'Multi-Format Strategy', desc: '4 distinct store formats targeting different customer segments — premium through value.' },
  { title: 'AI-Powered Compensation', desc: 'Real-time tier tracking and SPIFF optimization drives 12% higher rep retention than industry average.' },
  { title: 'Adjustable Base Leadership', desc: '31% attach rate vs. 18% industry average — $68M incremental revenue annually.' },
  { title: 'Partner Ecosystem', desc: 'Shop-in-Shop format captures incremental traffic at 40% lower cost-per-acquisition.' },
];

const GROWTH_OPPS = [
  { title: 'DTC Bridge Expansion', impact: '+$22M', desc: 'Purple partnership DTC-to-retail conversion — 20 new SiS locations planned.' },
  { title: 'Outlet Network Growth', impact: '+$18M', desc: 'Convert 8 underperforming Standard stores to Outlet format in saturated markets.' },
  { title: 'Sleep Tech Category', impact: '+$14M', desc: 'Smart mattress and sleep tracker accessories — projected 8% of Flagship revenue by FY27.' },
];

export default function MarketPosition() {
  return (
    <RegisterPage title="Market Position" subtitle="Competitive Landscape" accentColor="#1E3A5F">
      {/* Market Share — Horizontal Stacked Bar */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          U.S. Specialty Mattress Retail — Market Share
        </h2>
        {/* Stacked bar */}
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 40, marginBottom: 16 }}>
          {MARKET_SHARE.map((s) => (
            <div
              key={s.name}
              style={{
                width: `${s.pct}%`,
                background: s.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'width 0.4s ease',
              }}
            >
              {s.pct >= 12 && (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>{s.pct}%</span>
              )}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {MARKET_SHARE.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--register-text)' }}>{s.name}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--register-text-muted)' }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Differentiators */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Key Differentiators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIFFERENTIATORS.map((d) => (
            <div key={d.title} style={{ background: 'var(--register-bg-surface)', borderRadius: 10, padding: '14px 18px', borderLeft: '3px solid #1E3A5F' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 4 }}>{d.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Opportunities */}
      <div style={{ background: 'var(--register-bg-elevated)', border: '1px solid var(--register-border)', borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 16 }}>
          Growth Opportunities
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {GROWTH_OPPS.map((g) => (
            <div key={g.title} style={{ background: 'var(--register-bg-surface)', borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{g.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', marginTop: 2 }}>{g.desc}</div>
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#10B981', marginLeft: 16, whiteSpace: 'nowrap' }}>{g.impact}</span>
            </div>
          ))}
        </div>
      </div>
    </RegisterPage>
  );
}
