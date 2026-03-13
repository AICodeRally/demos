'use client';

import { useState, useEffect } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { Globe, TrendingUp, CheckCircle } from 'lucide-react';

const MARKET_SHARE = [
  { name: 'RestWell Corp.', pct: 28, color: '#64748B' },
  { name: 'Summit Sleep', pct: 18, color: '#1E3A5F' },
  { name: 'DreamHaven Group', pct: 15, color: '#8B5CF6' },
  { name: 'NightOwl Select', pct: 12, color: '#06B6D4' },
  { name: 'Other', pct: 27, color: '#CBD5E1' },
];

const DIFFERENTIATORS = [
  { title: 'Multi-Format Strategy', desc: '4 distinct store formats targeting different customer segments — premium through value.', icon: '01' },
  { title: 'AI-Powered Compensation', desc: 'Real-time tier tracking and SPIFF optimization drives 12% higher rep retention than industry average.', icon: '02' },
  { title: 'Adjustable Base Leadership', desc: '31% attach rate vs. 18% industry average — $68M incremental revenue annually.', icon: '03' },
  { title: 'Partner Ecosystem', desc: 'Shop-in-Shop format captures incremental traffic at 40% lower cost-per-acquisition.', icon: '04' },
];

const GROWTH_OPPS = [
  { title: 'DTC Bridge Expansion', impact: '+$22M', desc: 'Brand partner DTC-to-retail conversion — 20 new SiS locations planned.', color: '#10B981' },
  { title: 'Outlet Network Growth', impact: '+$18M', desc: 'Convert 8 underperforming Standard stores to Outlet format in saturated markets.', color: '#06B6D4' },
  { title: 'Sleep Tech Category', impact: '+$14M', desc: 'Smart mattress and sleep tracker accessories — projected 8% of Flagship revenue by FY27.', color: '#8B5CF6' },
];

export default function MarketPosition() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <RegisterPage title="Market Position" subtitle="Competitive Landscape" accentColor="#1E3A5F">
      {/* Market Share — Horizontal Stacked Bar */}
      <div style={{
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <Globe size={16} color="#1E3A5F" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
            U.S. Specialty Mattress Retail — Market Share
          </h2>
        </div>
        {/* Stacked bar */}
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 44, marginBottom: 20 }}>
          {MARKET_SHARE.map((s, i) => (
            <div
              key={s.name}
              style={{
                width: mounted ? `${s.pct}%` : '0%',
                background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.2 + i * 0.08}s`,
                position: 'relative',
              }}
            >
              {s.pct >= 12 && (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{s.pct}%</span>
              )}
              {s.name === 'Summit Sleep' && (
                <div style={{
                  position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: `5px solid ${s.color}`,
                  opacity: mounted ? 1 : 0,
                  transition: 'opacity 0.5s ease 1s',
                }} />
              )}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {MARKET_SHARE.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, display: 'inline-block', boxShadow: s.name === 'Summit Sleep' ? `0 0 6px ${s.color}60` : 'none' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--register-text)', fontWeight: s.name === 'Summit Sleep' ? 700 : 400 }}>{s.name}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--register-text-muted)' }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Differentiators */}
      <div style={{
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '0.2s',
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <CheckCircle size={16} color="#1E3A5F" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
            Key Differentiators
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIFFERENTIATORS.map((d, i) => (
            <div
              key={d.title}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '16px 18px',
                borderLeft: '3px solid #1E3A5F',
                position: 'relative',
                overflow: 'hidden',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.3 + i * 0.08}s`,
              }}
            >
              {/* Number watermark */}
              <div style={{
                position: 'absolute', top: -8, right: 8,
                fontSize: '3rem', fontWeight: 900, color: '#1E3A5F',
                opacity: 0.06, lineHeight: 1, pointerEvents: 'none',
              }}>
                {d.icon}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 4 }}>{d.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', lineHeight: 1.5 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Opportunities */}
      <div style={{
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderRadius: 12,
        padding: 24,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '0.4s',
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
          <TrendingUp size={16} color="#10B981" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>
            Growth Opportunities
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {GROWTH_OPPS.map((g, i) => (
            <div
              key={g.title}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: `4px solid ${g.color}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.5 + i * 0.1}s`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{g.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--register-text-muted)', marginTop: 2 }}>{g.desc}</div>
              </div>
              <div style={{
                background: `${g.color}12`,
                borderRadius: 10,
                padding: '8px 16px',
                marginLeft: 16,
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: g.color }}>{g.impact}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>potential</div>
              </div>
            </div>
          ))}
        </div>
        {/* Total bar */}
        <div style={{
          marginTop: 16,
          padding: '12px 20px',
          background: 'linear-gradient(90deg, rgba(16,185,129,0.08), rgba(6,182,212,0.08))',
          borderRadius: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px dashed var(--register-border)',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.5s ease 0.8s',
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text-muted)' }}>Total Addressable Growth</span>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10B981' }}>+$54M</span>
        </div>
      </div>
    </RegisterPage>
  );
}
