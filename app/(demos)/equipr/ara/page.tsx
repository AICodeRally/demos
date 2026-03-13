'use client';

import {
  Truck,
  Brain,
  Map,
  Shield,
  ClipboardCheck,
  Search,
  Play,
} from 'lucide-react';

const PILLARS = [
  {
    icon: Truck,
    title: 'Fleet Overview',
    stats: ['847 assets tracked', '94% utilization rate', '$12.4M fleet value'],
    color: '#1E3A5F',
  },
  {
    icon: Brain,
    title: 'AI Intelligence',
    stats: ['4 AI engines', '23% cost reduction', '30-sec damage scan'],
    color: '#0891B2',
  },
  {
    icon: Map,
    title: 'Sales & Territory',
    stats: [
      '7-stop route optimization',
      '6am mobile push',
      'Day-in-the-life planning',
    ],
    color: '#2563EB',
    featured: true,
  },
  {
    icon: Shield,
    title: 'Rate Governance',
    stats: [
      '$2.3M leakage recovered',
      'Real-time benchmarks',
      '4-tier comp structure',
    ],
    color: '#7C3AED',
  },
  {
    icon: ClipboardCheck,
    title: 'Operations',
    stats: ['Dispatch board', 'Predictive maintenance', 'Contract lifecycle'],
    color: '#059669',
  },
] as const;

export default function ARALandingPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* ── Header Bar ─────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-8 py-4"
        style={{ backgroundColor: '#1E3A5F' }}
      >
        <span
          className="text-2xl font-bold tracking-[0.2em] text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          EQUIPR
        </span>
        <span className="text-sm font-medium text-white/80">
          ARA Show 2026 · Orlando
        </span>
        <span
          className="text-lg font-semibold text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Blue Horizons Group
        </span>
      </header>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center px-8 py-10">
        <h1
          className="text-center text-5xl font-bold"
          style={{
            color: '#1E3A5F',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          The Equipment Rental Operating System
        </h1>
        <p className="mt-3 text-center text-xl text-slate-500">
          AI-powered fleet, sales &amp; rate governance
        </p>
      </section>

      {/* ── Pillar Cards ───────────────────────────────────── */}
      <section className="px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isFeatured = 'featured' in pillar && pillar.featured;
            return (
              <div
                key={pillar.title}
                className={`relative rounded-xl border bg-white p-6 shadow-md transition-shadow ${
                  isFeatured
                    ? 'border-[#2563EB] shadow-lg shadow-blue-100'
                    : 'border-slate-200'
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-[#2563EB] px-3 py-0.5 text-xs font-semibold text-white">
                    Featured
                  </span>
                )}
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <Icon className="h-6 w-6" style={{ color: pillar.color }} />
                </div>
                <h3
                  className="mb-3 text-lg font-bold text-slate-900"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {pillar.title}
                </h3>
                <ul className="space-y-1.5">
                  {pillar.stats.map((stat) => (
                    <li
                      key={stat}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: pillar.color }}
                      />
                      {stat}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────── */}
      <section className="mt-auto flex items-center justify-center gap-6 px-8 py-8">
        <button
          onClick={() => window.open('/equipr/dashboard', '_blank')}
          className="flex items-center gap-3 rounded-full border-2 border-[#2563EB] bg-white px-8 py-4 text-lg font-semibold text-[#2563EB] shadow-md transition-all hover:bg-blue-50 hover:shadow-lg"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <Search className="h-5 w-5" />
          Explore Demo
        </button>
        <button
          onClick={() => {
            window.location.href = '/equipr/dashboard?tour=kiosk';
          }}
          className="flex items-center gap-3 rounded-full bg-[#2563EB] px-8 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <Play className="h-5 w-5 fill-current" />
          Watch Tour
        </button>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-8 py-3">
        <span className="text-sm text-slate-500">
          © 2026 Blue Horizons Group
        </span>
        <span className="text-sm text-slate-400">Powered by AICR</span>
      </footer>
    </div>
  );
}
