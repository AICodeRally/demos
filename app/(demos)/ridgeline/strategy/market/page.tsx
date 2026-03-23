'use client';

import { COMPANY } from '@/data/ridgeline';

const MARKET_DATA = [
  { segment: 'Roofing Materials', share: 28, trend: '+2.1%', size: '$18.4B' },
  { segment: 'Building Products', share: 15, trend: '+1.8%', size: '$12.6B' },
  { segment: 'Insulation & Composites', share: 12, trend: '+3.2%', size: '$8.1B' },
  { segment: 'Landscaping Supply', share: 8, trend: '+4.5%', size: '$6.2B' },
  { segment: 'Pool Supplies', share: 5, trend: '+2.8%', size: '$3.8B' },
];

const COMPETITIVE = [
  { name: 'SRS Distribution', revenue: 12.8, branches: 982, color: '#1E3A5F', isSrs: true },
  { name: 'ABC Supply', revenue: 16.2, branches: 900, color: '#94A3B8', isSrs: false },
  { name: 'Beacon Roofing', revenue: 9.8, branches: 600, color: '#94A3B8', isSrs: false },
  { name: 'US LBM', revenue: 8.5, branches: 450, color: '#94A3B8', isSrs: false },
  { name: 'Allied Building', revenue: 3.2, branches: 210, color: '#94A3B8', isSrs: false },
];

const STRENGTHS = [
  { title: 'Local Density + National Platform', desc: 'Local branches provide jobsite fulfillment and relationships. National platform provides supplier leverage, shared systems, and operational standards.' },
  { title: 'Multi-Brand Go-to-Market', desc: 'Heritage, SRS Core, and acquired brands each serve distinct markets while sharing infrastructure and purchasing power.' },
  { title: 'Digital Enablement (Roof Hub)', desc: 'Contractor portal for ordering, invoice history, delivery tracking — integrating with contractor software ecosystems for live pricing.' },
  { title: 'Acquisition Integration Engine', desc: 'Proven playbook for integrating local distributors at scale — territory, comp plans, and reporting within 90 days.' },
];

const maxRevenue = Math.max(...COMPETITIVE.map((c) => c.revenue));

export default function MarketPositionPage() {
  return (
    <>
      <div className="flex items-center gap-6 mt-6 mb-8">
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

      {/* Market Segments */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Addressable Market Segments
        </h2>
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ color: 'var(--rl-text-muted)' }}>
              <th className="text-left font-semibold pb-3 pl-2">Segment</th>
              <th className="text-right font-semibold pb-3">Market Size</th>
              <th className="text-right font-semibold pb-3">SRS Share</th>
              <th className="text-right font-semibold pb-3 pr-2">YoY Trend</th>
            </tr>
          </thead>
          <tbody>
            {MARKET_DATA.map((row, i) => (
              <tr key={row.segment} style={i % 2 === 0 ? { background: 'var(--rl-stripe)' } : undefined}>
                <td className="py-2.5 pl-2 font-semibold" style={{ color: 'var(--rl-text)' }}>{row.segment}</td>
                <td className="py-2.5 text-right tabular-nums" style={{ color: 'var(--rl-text)' }}>{row.size}</td>
                <td className="py-2.5 text-right">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-16 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <span className="block h-full rounded-full" style={{ width: `${row.share}%`, background: '#1E3A5F' }} />
                    </span>
                    <span className="tabular-nums font-bold" style={{ color: '#1E3A5F' }}>{row.share}%</span>
                  </span>
                </td>
                <td className="py-2.5 text-right pr-2 font-bold tabular-nums" style={{ color: '#10B981' }}>{row.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitive Landscape */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Competitive Landscape (Revenue $B)
        </h2>
        <div className="space-y-3">
          {COMPETITIVE.map((c) => (
            <div key={c.name} className="flex items-center gap-4">
              <div className="w-32 text-[13px] font-semibold" style={{ color: c.isSrs ? '#1E3A5F' : 'var(--rl-text)' }}>
                {c.name}
              </div>
              <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                <div
                  className="h-full rounded-lg flex items-center px-3"
                  style={{ width: `${(c.revenue / maxRevenue) * 100}%`, background: c.color, minWidth: '80px' }}
                >
                  <span className="text-[12px] font-bold text-white">${c.revenue}B</span>
                </div>
              </div>
              <div className="w-20 text-[12px] text-right tabular-nums" style={{ color: 'var(--rl-text-muted)' }}>
                {c.branches} loc.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Strengths */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--rl-card)', borderColor: 'var(--rl-border)', boxShadow: 'var(--rl-shadow)' }}>
        <h2 className="text-sm uppercase tracking-[1.5px] font-semibold mb-4" style={{ color: 'var(--rl-text-muted)' }}>
          Strategic Advantages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STRENGTHS.map((s) => (
            <div
              key={s.title}
              className="rounded-lg border p-4"
              style={{ borderColor: 'var(--rl-border)', borderLeft: '3px solid #2563EB' }}
            >
              <h3 className="text-[14px] font-bold mb-1" style={{ color: 'var(--rl-text)' }}>{s.title}</h3>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--rl-text-muted)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
