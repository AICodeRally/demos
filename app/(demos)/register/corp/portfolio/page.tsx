'use client';

import { useState, useEffect } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { MapPin, TrendingUp, ArrowDown } from 'lucide-react';

const REGIONS = [
  { name: 'South', stores: 72, revenue: '$98M', pctTotal: 29, color: '#1E3A5F' },
  { name: 'West', stores: 48, revenue: '$72M', pctTotal: 21, color: '#06B6D4' },
  { name: 'Northeast', stores: 44, revenue: '$94M', pctTotal: 28, color: '#8B5CF6' },
  { name: 'Midwest', stores: 36, revenue: '$76M', pctTotal: 22, color: '#10B981' },
];

const FORMAT_PERF = [
  { format: 'Flagship', revPerStore: '$4.2M', asp: '$2,800', attachRate: 38, color: '#1E3A5F' },
  { format: 'Standard', revPerStore: '$2.1M', asp: '$1,900', attachRate: 31, color: '#06B6D4' },
  { format: 'Outlet', revPerStore: '$980K', asp: '$1,200', attachRate: 18, color: '#8B5CF6' },
  { format: 'Shop-in-Shop', revPerStore: '$380K', asp: '$1,600', attachRate: 35, color: '#10B981' },
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

export default function StorePortfolio() {
  const insight = getInsight('corp/portfolio');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <RegisterPage title="Store Portfolio" subtitle="200 Locations by Format & Region" accentColor="#1E3A5F">
      {/* Regional Breakdown — Visual Cards */}
      <div
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {REGIONS.map((r, i) => (
            <div
              key={r.name}
              className="register-card"
              style={{
                padding: '18px 20px',
                borderTop: `3px solid ${r.color}`,
                position: 'relative',
                overflow: 'hidden',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 60, height: 60,
                background: `radial-gradient(circle at top right, ${r.color}12, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <MapPin size={14} color={r.color} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--register-text)' }}>{r.name}</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--register-text)' }}>
                {r.revenue}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2 }}>
                {r.stores} stores
              </div>
              {/* Percentage bar */}
              <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: `${r.color}15`, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: mounted ? `${r.pctTotal}%` : '0%',
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${r.color}, ${r.color}BB)`,
                  transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${0.3 + i * 0.1}s`,
                }} />
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: r.color, marginTop: 4 }}>
                {r.pctTotal}% of total
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Format Performance Comparison */}
      <div className="register-section" style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '0.3s',
      }}>
        <h2 className="register-section-header" style={{ marginBottom: 20 }}>
          Format Performance Comparison
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FORMAT_PERF.map((f, i) => (
            <div
              key={f.format}
              style={{
                background: 'var(--register-bg-surface)',
                borderRadius: 10,
                padding: '14px 18px',
                borderLeft: `4px solid ${f.color}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${0.4 + i * 0.08}s`,
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <div className="flex items-center gap-2">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: f.color, display: 'inline-block' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--register-text)' }}>{f.format}</span>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: f.color }}>{f.revPerStore}</span>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--register-text-dim)', letterSpacing: '0.04em' }}>ASP</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)', marginLeft: 6 }}>{f.asp}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--register-text-dim)', letterSpacing: '0.04em' }}>Attach</span>
                  <div style={{ width: 60, height: 6, borderRadius: 3, background: `${f.color}20`, overflow: 'hidden', marginLeft: 4 }}>
                    <div style={{
                      height: '100%',
                      width: mounted ? `${f.attachRate}%` : '0%',
                      borderRadius: 3,
                      background: f.color,
                      transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                      transitionDelay: `${0.6 + i * 0.1}s`,
                    }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: f.color, marginLeft: 4 }}>{f.attachRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top / Bottom Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="register-section" style={{
          padding: 20,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.5s',
        }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
            <TrendingUp size={16} color="#10B981" />
            <h2 className="register-section-header" style={{ marginBottom: 0 }}>Top 3 Stores</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TOP_STORES.map((s, i) => (
              <div
                key={s.rank}
                style={{
                  background: 'var(--register-bg-surface)',
                  borderRadius: 8,
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeft: '3px solid #10B981',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                  transition: 'all 0.4s ease',
                  transitionDelay: `${0.6 + i * 0.08}s`,
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.12)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 800, color: '#10B981',
                    }}>
                      {s.rank}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{s.name}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2, marginLeft: 30 }}>
                    Rev: {s.revenue} &middot; ASP: {s.asp}
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {s.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="register-section" style={{
          padding: 20,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.55s',
        }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
            <ArrowDown size={16} color="#EF4444" />
            <h2 className="register-section-header" style={{ marginBottom: 0 }}>Bottom 3 Stores</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BOTTOM_STORES.map((s, i) => (
              <div
                key={s.rank}
                style={{
                  background: 'var(--register-bg-surface)',
                  borderRadius: 8,
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeft: '3px solid #EF4444',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                  transition: 'all 0.4s ease',
                  transitionDelay: `${0.65 + i * 0.08}s`,
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.12)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 800, color: '#EF4444',
                    }}>
                      {s.rank}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--register-text)' }}>{s.name}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', marginTop: 2, marginLeft: 30 }}>
                    Rev: {s.revenue} &middot; ASP: {s.asp}
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {s.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </RegisterPage>
  );
}
