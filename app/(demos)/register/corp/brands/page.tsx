'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';

const PARTNERS = [
  {
    name: 'Tempur-Sealy',
    tier: 'Premium',
    tierColor: '#FFD700',
    revPct: '38%',
    margin: 'High (42-48%)',
    coMarketing: 'Active',
    coMarketingColor: '#10B981',
    desc: 'Flagship anchor brand. Exclusive Tempur-Pedic gallery-within-gallery in all 12 Flagships.',
  },
  {
    name: 'Serta-Simmons',
    tier: 'Value / Mid',
    tierColor: '#C0C0C0',
    revPct: '32%',
    margin: 'Medium (28-34%)',
    coMarketing: 'Active',
    coMarketingColor: '#10B981',
    desc: 'Volume driver for Standard and Outlet formats. iComfort and Beautyrest lines.',
  },
  {
    name: 'Purple',
    tier: 'DTC Bridge',
    tierColor: '#8B5CF6',
    revPct: '18%',
    margin: 'Medium-High (35-40%)',
    coMarketing: 'Pilot',
    coMarketingColor: '#F59E0B',
    desc: 'Shop-in-Shop exclusivity. DTC-to-retail conversion partnership — 20 new locations planned FY27.',
  },
  {
    name: 'ErgoMotion',
    tier: 'Adjustable Bases',
    tierColor: '#06B6D4',
    revPct: '12%',
    margin: 'High (45-52%)',
    coMarketing: 'Inactive',
    coMarketingColor: '#64748B',
    desc: 'Sole adjustable base supplier. Key driver of attach rate strategy — 31% attach across all formats.',
  },
];

export default function BrandPartners() {
  return (
    <RegisterPage title="Brand Partners" subtitle="Manufacturing & Distribution Partners" accentColor="#1E3A5F">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PARTNERS.map((p) => (
          <div
            key={p.name}
            style={{
              background: 'var(--register-bg-elevated)',
              border: '1px solid var(--register-border)',
              borderRadius: 12,
              padding: 24,
              borderTop: `3px solid ${p.tierColor}`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--register-text)' }}>{p.name}</div>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: `${p.tierColor}20`,
                  color: p.tierColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {p.tier}
              </span>
            </div>

            {/* Description */}
            <div style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
              {p.desc}
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: 'var(--register-bg-surface)', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  % of Revenue
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--register-text)', marginTop: 2 }}>
                  {p.revPct}
                </div>
              </div>
              <div style={{ background: 'var(--register-bg-surface)', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Margin Profile
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--register-text)', marginTop: 4 }}>
                  {p.margin}
                </div>
              </div>
            </div>

            {/* Co-Marketing Status */}
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--register-text-dim)' }}>Co-Marketing:</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: `${p.coMarketingColor}18`,
                  color: p.coMarketingColor,
                  textTransform: 'uppercase',
                }}
              >
                {p.coMarketing}
              </span>
            </div>
          </div>
        ))}
      </div>
    </RegisterPage>
  );
}
