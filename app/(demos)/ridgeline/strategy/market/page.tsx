'use client';

import { useState } from 'react';

const MARKET_DATA = [
  { segment: 'Roofing Materials', share: 28, trend: '+2.1%', size: '$18.4B', color: '#1E3A5F' },
  { segment: 'Building Products', share: 15, trend: '+1.8%', size: '$12.6B', color: '#2563EB' },
  { segment: 'Insulation & Composites', share: 12, trend: '+3.2%', size: '$8.1B', color: '#7C3AED' },
  { segment: 'Landscaping Supply', share: 8, trend: '+4.5%', size: '$6.2B', color: '#10B981' },
  { segment: 'Pool Supplies', share: 5, trend: '+2.8%', size: '$3.8B', color: '#06B6D4' },
];

const COMPETITIVE = [
  { name: 'ABC Supply', revenue: 16.2, branches: 900, color: '#94A3B8', isSrs: false },
  { name: 'SRS Distribution', revenue: 12.8, branches: 982, color: '#1E3A5F', isSrs: true },
  { name: 'Beacon Roofing', revenue: 9.8, branches: 600, color: '#94A3B8', isSrs: false },
  { name: 'US LBM', revenue: 8.5, branches: 450, color: '#94A3B8', isSrs: false },
  { name: 'Allied Building', revenue: 3.2, branches: 210, color: '#94A3B8', isSrs: false },
];

const STRENGTHS = [
  { title: 'Local Density + National Platform', desc: 'Local branches provide jobsite fulfillment. National platform provides supplier leverage and shared systems.', icon: '🎯' },
  { title: 'Multi-Brand Go-to-Market', desc: 'Heritage and SRS Core brands serve distinct markets while sharing infrastructure and purchasing power.', icon: '🏷️' },
  { title: 'Digital Enablement (Roof Hub)', desc: 'Contractor portal with ordering, invoice history, delivery tracking, and live pricing integration.', icon: '💻' },
  { title: 'Acquisition Integration Engine', desc: 'Proven 90-day playbook for integrating local distributors — territory, comp plans, and reporting.', icon: '🚀' },
];

const maxRevenue = Math.max(...COMPETITIVE.map((c) => c.revenue));

export default function MarketPositionPage() {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // Build treemap-style visualization
  const totalShare = MARKET_DATA.reduce((s, m) => s + m.share, 0);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes barReveal { from { width: 0 } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-20px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes shimmer { 0% { background-position: -200% center } 100% { background-position: 200% center } }
      `}</style>

      <div className="flex items-center gap-6 mt-6 mb-8" style={{ animation: 'fadeUp 0.4s ease-out' }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F1D30 100%)', boxShadow: '0 4px 12px rgba(30,58,95,0.3)' }}
        >
          <span className="text-3xl text-white">&#127758;</span>
        </div>
        <div>
          <div className="text-xs tracking-[3px] uppercase font-semibold mb-1" style={{ color: '#1E3A5F' }}>
            Act 1 &middot; Executive Strategy
          </div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: 'var(--rl-text)' }}>
            Market Position
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--rl-text-muted)' }}>
            Wholesale distribution industry: $8.2T &middot; 6M+ workers &middot; ~1/3 U.S. GDP
          </p>
        </div>
      </div>

      {/* Market Segments — Visual Treemap */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.5s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-5" style={{ color: 'var(--rl-text-muted)' }}>
          Addressable Market Segments — Hover for detail
        </div>

        {/* Treemap-style blocks */}
        <div className="flex gap-2 h-32 mb-4">
          {MARKET_DATA.map((seg, i) => {
            const isHovered = hoveredSegment === seg.segment;
            return (
              <div
                key={seg.segment}
                className="rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden"
                style={{
                  flex: seg.share,
                  background: isHovered ? seg.color : `${seg.color}15`,
                  color: isHovered ? 'white' : seg.color,
                  border: `2px solid ${isHovered ? seg.color : `${seg.color}30`}`,
                  transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isHovered ? `0 0 20px ${seg.color}40` : 'none',
                  animation: `scaleIn ${0.3 + i * 0.1}s ease-out`,
                }}
                onMouseEnter={() => setHoveredSegment(seg.segment)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="text-[18px] font-extrabold tabular-nums">{seg.share}%</div>
                <div className="text-[10px] font-bold text-center px-1 leading-tight">{seg.segment}</div>
                {isHovered && (
                  <div className="text-[9px] mt-1 font-semibold">{seg.size} &middot; {seg.trend} YoY</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail strip for hovered segment */}
        {hoveredSegment && (() => {
          const seg = MARKET_DATA.find((m) => m.segment === hoveredSegment)!;
          return (
            <div
              className="rounded-lg border p-3 flex items-center justify-between"
              style={{ borderColor: `${seg.color}30`, background: `${seg.color}08`, animation: 'fadeUp 0.2s ease-out' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: seg.color }} />
                <span className="text-[13px] font-bold" style={{ color: 'var(--rl-text)' }}>{seg.segment}</span>
              </div>
              <div className="flex items-center gap-6 text-[12px] tabular-nums">
                <span style={{ color: 'var(--rl-text-muted)' }}>Market: <strong style={{ color: seg.color }}>{seg.size}</strong></span>
                <span style={{ color: 'var(--rl-text-muted)' }}>SRS Share: <strong style={{ color: seg.color }}>{seg.share}%</strong></span>
                <span style={{ color: '#10B981' }}>Trend: <strong>{seg.trend}</strong></span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Competitive Landscape — Animated Bar Race */}
      <div
        className="rounded-xl border p-6 mb-8"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.6s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-5" style={{ color: 'var(--rl-text-muted)' }}>
          Competitive Landscape — Revenue ($B) & Locations
        </div>

        <div className="space-y-3">
          {COMPETITIVE.sort((a, b) => b.revenue - a.revenue).map((c, i) => (
            <div key={c.name} className="flex items-center gap-4" style={{ animation: `slideRight ${0.3 + i * 0.12}s ease-out` }}>
              <div
                className="w-36 text-[13px] font-bold truncate"
                style={{ color: c.isSrs ? '#1E3A5F' : 'var(--rl-text)' }}
              >
                {c.isSrs ? '★ ' : ''}{c.name}
              </div>
              <div className="flex-1 h-10 rounded-lg overflow-hidden" style={{ background: 'var(--rl-stripe)' }}>
                <div
                  className="h-full rounded-lg flex items-center px-3 relative"
                  style={{
                    width: `${(c.revenue / maxRevenue) * 100}%`,
                    background: c.isSrs
                      ? 'linear-gradient(90deg, #1E3A5F, #2563EB)'
                      : `linear-gradient(90deg, ${c.color}60, ${c.color})`,
                    animation: `barReveal 0.8s ease-out ${i * 0.15}s both`,
                    boxShadow: c.isSrs ? '0 0 12px rgba(30,58,95,0.3)' : 'none',
                  }}
                >
                  <span className="text-[12px] font-extrabold text-white">${c.revenue}B</span>
                </div>
              </div>
              <div className="w-20 text-right">
                <div className="text-[12px] font-bold tabular-nums" style={{ color: c.isSrs ? '#2563EB' : 'var(--rl-text-muted)' }}>
                  {c.branches}
                </div>
                <div className="text-[9px]" style={{ color: 'var(--rl-text-muted)' }}>locations</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Strengths — Animated Cards */}
      <div
        className="rounded-xl border p-6"
        style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)', animation: 'fadeUp 0.8s ease-out' }}
      >
        <div className="text-[11px] uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Strategic Advantages
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STRENGTHS.map((s, i) => (
            <div
              key={s.title}
              className="rounded-xl border p-5 transition-all hover:scale-[1.02]"
              style={{ borderColor: 'var(--rl-border)', borderLeft: '4px solid #2563EB', boxShadow: 'var(--rl-shadow)', animation: `fadeUp ${0.6 + i * 0.12}s ease-out` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{s.icon}</span>
                <h3 className="text-[14px] font-bold" style={{ color: 'var(--rl-text)' }}>{s.title}</h3>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--rl-text-muted)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
