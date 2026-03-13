'use client';

import { useState, useEffect } from 'react';
import { RegisterPage } from '@/components/demos/register/RegisterPage';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { getInsight } from '@/data/register/ai-insights';
import { Map, Users, BarChart3 } from 'lucide-react';

const DISTRICTS = [
  { name: 'Northeast', dm: 'Sarah Chen', stores: 34, revenue: '$76.2M', headcount: 142, status: 'On Track', statusColor: '#10B981', revPerStore: '$2.24M', revPerRep: '$537K', attachRate: 34 },
  { name: 'Southeast', dm: 'Marcus Williams', stores: 31, revenue: '$66.9M', headcount: 124, status: 'On Track', statusColor: '#10B981', revPerStore: '$2.16M', revPerRep: '$540K', attachRate: 32 },
  { name: 'Mid-Atlantic', dm: 'Karen Mitchell', stores: 30, revenue: '$64.6M', headcount: 118, status: 'On Track', statusColor: '#10B981', revPerStore: '$2.15M', revPerRep: '$547K', attachRate: 33 },
  { name: 'Midwest', dm: 'Jennifer Park', stores: 26, revenue: '$54.6M', headcount: 98, status: 'Watch', statusColor: '#F59E0B', revPerStore: '$2.10M', revPerRep: '$557K', attachRate: 29 },
  { name: 'Great Lakes', dm: "James O'Brien", stores: 19, revenue: '$49.8M', headcount: 82, status: 'Watch', statusColor: '#F59E0B', revPerStore: '$2.62M', revPerRep: '$607K', attachRate: 30 },
  { name: 'Southwest', dm: 'David Rodriguez', stores: 24, revenue: '$49.1M', headcount: 92, status: 'Watch', statusColor: '#F59E0B', revPerStore: '$2.05M', revPerRep: '$534K', attachRate: 28 },
  { name: 'Pacific NW', dm: 'Lisa Tanaka', stores: 20, revenue: '$39.6M', headcount: 76, status: 'On Track', statusColor: '#10B981', revPerStore: '$1.98M', revPerRep: '$521K', attachRate: 31 },
  { name: 'Mountain', dm: 'Robert Foster', stores: 16, revenue: '$32.0M', headcount: 58, status: 'At Risk', statusColor: '#EF4444', revPerStore: '$2.00M', revPerRep: '$552K', attachRate: 24 },
];

const maxAttach = Math.max(...DISTRICTS.map(d => d.attachRate));

export default function DistrictPlanning() {
  const insight = getInsight('strategy/districts');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <RegisterPage title="District Planning" subtitle="8 Districts — Store Alignment" accentColor="#06B6D4">
      {/* District Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {DISTRICTS.map((d, i) => (
          <div
            key={d.name}
            style={{
              background: 'var(--register-bg-elevated)',
              border: '1px solid var(--register-border)',
              borderRadius: 10,
              padding: '14px 18px',
              borderTop: `3px solid #06B6D4`,
              position: 'relative',
              overflow: 'hidden',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${i * 0.06}s`,
            }}
          >
            {/* Status glow */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: 40, height: 40,
              background: `radial-gradient(circle at top right, ${d.statusColor}15, transparent 70%)`,
              pointerEvents: 'none',
            }} />
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
            <div className="flex items-center gap-1" style={{ marginBottom: 8 }}>
              <Users size={11} color="var(--register-text-dim)" />
              <span style={{ fontSize: '0.7rem', color: 'var(--register-text-muted)' }}>DM: {d.dm}</span>
            </div>
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
            {/* Attach rate mini bar */}
            <div style={{ marginTop: 8 }}>
              <div className="flex justify-between" style={{ fontSize: '0.65rem', marginBottom: 3 }}>
                <span style={{ color: 'var(--register-text-dim)' }}>Attach</span>
                <span style={{ fontWeight: 700, color: '#06B6D4' }}>{d.attachRate}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(6,182,212,0.12)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: mounted ? `${(d.attachRate / maxAttach) * 100}%` : '0%',
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #06B6D4, #06B6D4CC)',
                  transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${0.3 + i * 0.06}s`,
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* District Comparison — Visual Bars */}
      <div style={{
        background: 'var(--register-bg-elevated)',
        border: '1px solid var(--register-border)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '0.4s',
      }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
          <BarChart3 size={16} color="#06B6D4" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--register-text)', margin: 0 }}>District Comparison</h2>
        </div>

        {/* Column headers */}
        <div className="grid" style={{ gridTemplateColumns: '120px 1fr 1fr 1fr', gap: 12, marginBottom: 8 }}>
          {['District', 'Rev / Store', 'Rev / Rep', 'Attach Rate'].map(h => (
            <div key={h} style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--register-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {h}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DISTRICTS.map((d, i) => {
            // Parse numeric values for bar widths
            const revStore = parseFloat(d.revPerStore.replace('$', '').replace('M', ''));
            const revRep = parseFloat(d.revPerRep.replace('$', '').replace('K', ''));
            const maxRevStore = 2.62;
            const maxRevRep = 607;
            return (
              <div
                key={d.name}
                className="grid"
                style={{
                  gridTemplateColumns: '120px 1fr 1fr 1fr',
                  gap: 12,
                  alignItems: 'center',
                  padding: '6px 0',
                  borderBottom: '1px solid var(--register-border)',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                  transition: 'all 0.4s ease',
                  transitionDelay: `${0.5 + i * 0.04}s`,
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--register-text)' }}>{d.name}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(6,182,212,0.1)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: mounted ? `${(revStore / maxRevStore) * 100}%` : '0%',
                        borderRadius: 3,
                        background: '#06B6D4',
                        transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        transitionDelay: `${0.6 + i * 0.05}s`,
                      }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--register-text)', width: 50, textAlign: 'right' }}>{d.revPerStore}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(139,92,246,0.1)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: mounted ? `${(revRep / maxRevRep) * 100}%` : '0%',
                        borderRadius: 3,
                        background: '#8B5CF6',
                        transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        transitionDelay: `${0.6 + i * 0.05}s`,
                      }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--register-text)', width: 44, textAlign: 'right' }}>{d.revPerRep}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(16,185,129,0.1)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: mounted ? `${(d.attachRate / maxAttach) * 100}%` : '0%',
                        borderRadius: 3,
                        background: '#10B981',
                        transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        transitionDelay: `${0.6 + i * 0.05}s`,
                      }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--register-text)', width: 32, textAlign: 'right' }}>{d.attachRate}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </RegisterPage>
  );
}
