'use client';

import Link from 'next/link';
import { Building2, Target, LayoutGrid, DollarSign } from 'lucide-react';

const acts = [
  {
    title: 'Corporate Strategy',
    description: 'Executive KPIs, revenue by format, district analytics, seasonal planning, brand partnerships across 200 stores.',
    stats: '5 pages · 8 districts · $2.8B revenue',
    href: '/crestline/corp/overview',
    color: '#1a1f3d',
    Icon: Building2,
  },
  {
    title: 'Sales Strategy',
    description: 'District performance, quota allocation, product mix optimization, workforce planning, promotions & SPIFF programs.',
    stats: '5 pages · 5 selling departments · 3,200 associates',
    href: '/crestline/strategy/districts',
    color: '#c9a84c',
    Icon: Target,
  },
  {
    title: 'Store Operations',
    description: 'Live floor dashboard, POS analytics, Real-Time What-If Calculator, customer journey, manager console, contests.',
    stats: '6 pages · Real-time POS · RTWC engine',
    href: '/crestline/ops/floor',
    color: '#7c3aed',
    Icon: LayoutGrid,
  },
  {
    title: 'Sales Compensation',
    description: '5-stream commission engine, Achiever program, 4-5-4 calendar, retro corrections, dispute resolution, payroll output.',
    stats: '8 pages · 5 calc streams · Full audit trail',
    href: '/crestline/comp/engine',
    color: '#059669',
    Icon: DollarSign,
  },
];

export default function CrestlineHome() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--pl-bg)' }}>
      <header className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-10 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#1a1f3d' }}>
          <span className="text-2xl font-bold" style={{ color: '#c9a84c' }}>C</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-2" style={{ color: 'var(--pl-text)' }}>
          CRESTLINE
        </h1>
        <p className="text-xl mb-1" style={{ color: 'var(--pl-text-secondary)' }}>
          Department Stores
        </p>
        <p className="text-lg italic mb-4" style={{ color: 'var(--pl-text-secondary)' }}>
          Premium Retail, Intelligent Compensation
        </p>
        <p className="max-w-2xl text-base leading-relaxed" style={{ color: 'var(--pl-text-secondary)' }}>
          End-to-end sales performance management for multi-format retail — from corporate strategy to real-time POS commission to payroll output. 200 stores, 3,200 associates, $2.8B in annual revenue.
        </p>
        <div className="flex gap-8 mt-6">
          {[
            { label: 'Stores', value: '200' },
            { label: 'Formats', value: '4' },
            { label: 'Revenue', value: '$2.8B' },
            { label: 'Associates', value: '3,200' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: 'var(--pl-text)' }}>{s.value}</div>
              <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--pl-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      <section className="max-w-4xl mx-auto w-full px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {acts.map((act, idx) => (
            <Link
              key={act.href}
              href={act.href}
              className="group block rounded-lg transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: 'var(--pl-card)', border: '1px solid var(--pl-border)', borderTop: `4px solid ${act.color}` }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <act.Icon size={24} color={act.color} strokeWidth={1.8} />
                  <span className="text-xs font-semibold uppercase" style={{ color: act.color }}>
                    Act {idx + 1}
                  </span>
                </div>
                <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--pl-text)' }}>{act.title}</h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--pl-text-secondary)' }}>{act.description}</p>
                <p className="text-xs" style={{ color: 'var(--pl-text-muted)' }}>{act.stats}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="text-center pb-8 text-sm" style={{ color: 'var(--pl-text-muted)' }}>
        <p>&copy; 2026 Crestline Department Stores</p>
        <p className="mt-1">Powered by <span className="font-bold" style={{ color: 'var(--pl-text-secondary)' }}>AICR</span></p>
      </footer>
    </div>
  );
}
