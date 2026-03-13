'use client';

import { RegisterPage } from '@/components/demos/register/RegisterPage';

/* ── Module breakdown ────────────────────────────────────── */

const MODULES = [
  {
    act: 1,
    name: 'Corporate Strategy',
    color: '#1E3A5F',
    items: ['Portfolio analysis across 4 store formats', 'Market positioning vs. competitors', 'Seasonal trend planning', 'Brand mix optimization'],
  },
  {
    act: 2,
    name: 'Sales Strategy',
    color: '#06B6D4',
    items: ['District-level territory planning', 'Store target allocation & gap analysis', 'Product mix optimization by format', 'Workforce planning & scheduling', 'Promotion management & SPIFF calendar'],
  },
  {
    act: 3,
    name: 'Store Operations',
    color: '#8B5CF6',
    items: ['Live POS with real-time commission display', 'Manager coaching console with AI nudges', 'Sales contests & leaderboards', 'BroadcastChannel instant sync'],
  },
  {
    act: 4,
    name: 'Sales Compensation',
    color: '#10B981',
    items: ['Comp plan designer with tier editor', 'What-if calculator for reps', 'Live earnings statements', 'Team analytics & executive dashboard', 'Comp admin with push-to-POS'],
  },
  {
    act: 5,
    name: 'Platform & Integration',
    color: '#F59E0B',
    items: ['D365 Commerce real-time integration', 'Transaction event pipeline (<200ms)', 'BroadcastChannel 5-type protocol', 'Product overview & ROI analysis'],
  },
];

/* ── Technology highlights ───────────────────────────────── */

const TECH = [
  { label: 'AI-Powered Insights', desc: 'Every page surfaces contextual AI coaching — attach rate nudges, upsell prompts, comp optimization tips', color: '#8B5CF6' },
  { label: 'BroadcastChannel Real-Time', desc: 'Manager-to-POS instant communication — coaching, comp updates, alerts, and sync — zero server round-trip', color: '#06B6D4' },
  { label: 'SWIC Engine', desc: 'Sales, Workforce, Incentive, Compensation calculation engine powers live commission display and what-if modeling', color: '#10B981' },
  { label: 'D365 Commerce Native', desc: 'Built on Microsoft Dynamics 365 Retail schemas — RetailTransactionTable, SalesTrans, PaymentTrans — for seamless ERP integration', color: '#F59E0B' },
];

export default function ProductOverviewPage() {
  return (
    <RegisterPage
      title="Product Overview"
      subtitle="REGISTER — Retail Revenue Operating System"
      accentColor="#F59E0B"
    >
      {/* ── Hero Summary ─────────────────────────────────────── */}
      <section className="mb-10">
        <div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #06B6D4 100%)' }}
        >
          <div className="relative z-10">
            <p className="text-3xl font-black tracking-tight text-white mb-2">
              REGISTER
            </p>
            <p className="text-base font-semibold text-white mb-1">
              Retail Revenue Operating System
            </p>
            <p className="text-sm mb-6" style={{ color: '#BAE6FD' }}>
              Floor-to-boardroom visibility for mattress retail chains with 100&ndash;500 stores.
              Real-time commission on every sale, AI coaching at store open, and comp admin
              that pushes plan changes to every POS tablet instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { stat: '200', label: 'Stores', sub: 'Across 4 formats' },
                { stat: '850', label: 'Sales Reps', sub: 'Active headcount' },
                { stat: '<200ms', label: 'Sync Latency', sub: 'POS to Manager' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                >
                  <p className="text-xl font-black text-white">{s.stat}</p>
                  <p className="text-[12px] font-semibold text-white">{s.label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#BAE6FD' }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div
            className="absolute -right-16 -top-16 rounded-full opacity-10"
            style={{ width: 300, height: 300, backgroundColor: '#FFFFFF' }}
          />
        </div>
      </section>

      {/* ── Module Breakdown ─────────────────────────────────── */}
      <section className="mb-10">
        <p className="register-section-header">
          Five-Act Platform
        </p>
        <p className="text-[11px] mb-5" style={{ color: 'var(--register-text-muted)' }}>
          Each act addresses a layer of the retail revenue stack
        </p>

        <div className="space-y-4">
          {MODULES.map((mod) => (
            <div
              key={mod.act}
              className="register-card p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-xl text-[12px] font-bold text-white"
                  style={{ backgroundColor: mod.color }}
                >
                  {mod.act}
                </div>
                <div>
                  <p className="text-[14px] font-bold" style={{ color: 'var(--register-text)' }}>
                    {mod.name}
                  </p>
                  <p className="register-meta-label" style={{ color: mod.color }}>
                    Act {mod.act}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {mod.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-xl px-3 py-2"
                    style={{ backgroundColor: `${mod.color}10` }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: mod.color }}
                    />
                    <span className="text-[11px]" style={{ color: 'var(--register-text)' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Technology Highlights ─────────────────────────────── */}
      <section className="mb-6">
        <p className="register-section-header">
          Technology Highlights
        </p>
        <p className="text-[11px] mb-5" style={{ color: 'var(--register-text-muted)' }}>
          Built for real-time retail at scale
        </p>

        <div className="grid grid-cols-2 gap-4">
          {TECH.map((t) => (
            <div
              key={t.label}
              className="register-card register-card-hover p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: t.color }}
                />
                <p className="text-[13px] font-bold" style={{ color: t.color }}>
                  {t.label}
                </p>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--register-text-muted)' }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </RegisterPage>
  );
}
