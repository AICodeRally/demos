'use client';

import { useState, useEffect } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { Handshake, Percent, DollarSign } from 'lucide-react';

const PARTNERS = [
  {
    name: 'Tempur-Sealy',
    tier: 'Premium',
    tierColor: '#FFD700',
    revPct: 38,
    margin: 'High (42-48%)',
    coMarketing: 'Active',
    coMarketingColor: '#10B981',
    desc: 'Flagship anchor brand. Exclusive Tempur-Pedic gallery-within-gallery in all 12 Flagships.',
  },
  {
    name: 'Serta-Simmons',
    tier: 'Value / Mid',
    tierColor: '#C0C0C0',
    revPct: 32,
    margin: 'Medium (28-34%)',
    coMarketing: 'Active',
    coMarketingColor: '#10B981',
    desc: 'Volume driver for Standard and Outlet formats. iComfort and Beautyrest lines.',
  },
  {
    name: 'Purple',
    tier: 'DTC Bridge',
    tierColor: '#8B5CF6',
    revPct: 18,
    margin: 'Medium-High (35-40%)',
    coMarketing: 'Pilot',
    coMarketingColor: '#F59E0B',
    desc: 'Shop-in-Shop exclusivity. DTC-to-retail conversion partnership — 20 new locations planned FY27.',
  },
  {
    name: 'ErgoMotion',
    tier: 'Adjustable Bases',
    tierColor: '#06B6D4',
    revPct: 12,
    margin: 'High (45-52%)',
    coMarketing: 'Inactive',
    coMarketingColor: '#64748B',
    desc: 'Sole adjustable base supplier. Key driver of attach rate strategy — 31% attach across all formats.',
  },
];

export default function BrandPartners() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const totalRevPct = PARTNERS.reduce((a, b) => a + b.revPct, 0);

  return (
    <RegisterPage title="Brand Partners" subtitle="Manufacturing & Distribution Partners" accentColor="#1E3A5F">
      {/* Revenue share bar */}
      <div style={{
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderRadius: 12,
        padding: '16px 24px',
        marginBottom: 20,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
          <DollarSign size={14} color="#1E3A5F" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>Revenue Share</span>
        </div>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 28, gap: 2 }}>
          {PARTNERS.map((p, i) => (
            <div
              key={p.name}
              style={{
                width: mounted ? `${(p.revPct / totalRevPct) * 100}%` : '0%',
                background: `linear-gradient(135deg, ${p.tierColor}, ${p.tierColor}BB)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.2 + i * 0.1}s`,
                borderRadius: i === 0 ? '8px 0 0 8px' : i === PARTNERS.length - 1 ? '0 8px 8px 0' : 0,
              }}
            >
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{p.revPct}%</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4" style={{ marginTop: 8 }}>
          {PARTNERS.map((p) => (
            <div key={p.name} className="flex items-center gap-1">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.tierColor, display: 'inline-block' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)' }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PARTNERS.map((p, i) => (
          <div
            key={p.name}
            style={{
              background: 'var(--register-bg-elevated)',
              border: '1px solid var(--register-border)',
              borderRadius: 12,
              padding: 24,
              borderTop: `3px solid ${p.tierColor}`,
              position: 'relative',
              overflow: 'hidden',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${0.2 + i * 0.1}s`,
            }}
          >
            {/* Gradient glow */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: 100, height: 100,
              background: `radial-gradient(circle at top right, ${p.tierColor}10, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Handshake size={16} color={p.tierColor} />
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--register-text)' }}>{p.name}</div>
              </div>
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
              <div style={{ background: 'var(--register-bg-surface)', borderRadius: 8, padding: '10px 14px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  % of Revenue
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--register-text)', marginTop: 2 }}>
                  {p.revPct}%
                </div>
                {/* Mini bar */}
                <div style={{ marginTop: 6, height: 4, borderRadius: 2, background: `${p.tierColor}15`, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: mounted ? `${(p.revPct / 38) * 100}%` : '0%',
                    borderRadius: 2,
                    background: p.tierColor,
                    transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${0.5 + i * 0.1}s`,
                  }} />
                </div>
              </div>
              <div style={{ background: 'var(--register-bg-surface)', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Margin Profile
                </div>
                <div className="flex items-center gap-1" style={{ marginTop: 4 }}>
                  <Percent size={12} color={p.tierColor} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--register-text)' }}>
                    {p.margin}
                  </span>
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
