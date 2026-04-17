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

/* ── Governance & Security ─────────────────────────────── */

const GOVERNANCE_LAYERS = [
  {
    name: 'Identity & Access Control',
    color: '#DC2626',
    items: [
      'SSO / SAML integration with Azure AD, Google, and enterprise IdPs',
      'Role-based access: Super Admin, Admin, Manager, User, Viewer, Guest',
      'Security group management with tenant-scoped permissions',
      'Session monitoring — track active sessions, force logout for security',
      'Multi-factor authentication support',
    ],
  },
  {
    name: 'Data Governance & Tenant Isolation',
    color: '#7C3AED',
    items: [
      '5-layer tenant isolation: infrastructure, middleware, Prisma extension, PostgreSQL RLS, automated testing',
      'Row-Level Security on every multi-tenant table — data cannot leak between clients',
      'Isolation tiers: Standard (shared DB + RLS), Professional (dedicated DB branch), Enterprise (dedicated instance)',
      'Data residency controls: US, EU, AP region selection for compliance',
      'PII detection and automatic redaction in audit trails',
    ],
  },
  {
    name: 'AI Governance & Cost Control',
    color: '#2563EB',
    items: [
      '5 AI policy types: confidence thresholds, escalation limits, cost limits, human review gates, rate limits',
      'Human-in-the-loop review queue — AI decisions above policy threshold require manager approval',
      'Per-model, per-agent, per-tenant budget controls with hard limits that block overspend',
      'Complete AI action audit trail — every prompt, response, cost, and decision logged',
      'Model orchestration across 21 models / 5 providers with automatic fallback',
    ],
  },
  {
    name: 'Policy Engine & Approvals',
    color: '#0891B2',
    items: [
      'Configurable policies: Allow, Block, Require Approval, or Alert on any action',
      'Policy simulation — test new rules against production data before deployment',
      'Multi-level approval workflows for policy changes, budget increases, deployments',
      'Break-glass emergency bypass with full audit trail and automatic expiration',
      'Three governance presets: Conservative, Balanced, Permissive — or build custom',
    ],
  },
  {
    name: 'Security Operations',
    color: '#059669',
    items: [
      '6 automated security probes: auth enforcement, secret hygiene, injection detection, rate limiting, network exposure, token safety',
      'Real-time security findings with severity levels (Critical, High, Medium)',
      'Incident tracking and response workflows',
      'Continuous security scanning — probes run daily, surface issues as coaching cards',
      'Nightly CI security sweeps — full auth/tenant guard tree scan + health smoke tests',
    ],
  },
  {
    name: 'Audit & Compliance',
    color: '#D97706',
    items: [
      'Immutable evidence spine — every material action recorded with cryptographic hash chains',
      'Server-generated timestamps — no client-provided timestamps accepted',
      'Complete event coverage: user logins, policy changes, approvals, AI actions, data access, deployments',
      'Evidence bundle export for compliance reviews (JSON, CSV)',
      'Retention policy management with configurable archival',
    ],
  },
];

/* ── Implementation & Support ──────────────────────────── */

const IMPLEMENTATION = [
  { label: 'UAT & Testing', desc: 'Dedicated staging environment with isolated database branch per deployment. Full regression testing before go-live with automated quality gates.', color: '#8B5CF6' },
  { label: 'Developer Training', desc: 'API documentation, integration guides, and sandbox environments. D365 connector reference implementations and ICM sync playbooks (Varicent, CaptivateIQ, Xactly, Spiff, Performio, and more).', color: '#06B6D4' },
  { label: 'AI Committee Support', desc: 'Complete governance documentation for AI/data committees. Policy presets, audit trails, and cost controls designed for enterprise review and approval.', color: '#10B981' },
  { label: 'Change Management', desc: 'Phased rollout with pilot stores, approval workflows for plan changes, and rollback capabilities. Every change tracked in the evidence spine.', color: '#F59E0B' },
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
                  <p className="text-sm font-semibold text-white">{s.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#BAE6FD' }}>{s.sub}</p>
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
        <p className="text-sm mb-5" style={{ color: 'var(--register-text-muted)' }}>
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
                  className="flex items-center justify-center w-8 h-8 rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: mod.color }}
                >
                  {mod.act}
                </div>
                <div>
                  <p className="text-base font-bold" style={{ color: 'var(--register-text)' }}>
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
                    <span className="text-sm" style={{ color: 'var(--register-text)' }}>
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
      <section className="mb-10">
        <p className="register-section-header">
          Technology Highlights
        </p>
        <p className="text-sm mb-5" style={{ color: 'var(--register-text-muted)' }}>
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
                <p className="text-sm font-bold" style={{ color: t.color }}>
                  {t.label}
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--register-text-muted)' }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platform Governance & Security ──────────────────────── */}
      <section className="mb-10">
        <p className="register-section-header">
          Platform Governance &amp; Security
        </p>
        <p className="text-sm mb-2" style={{ color: 'var(--register-text-muted)' }}>
          Enterprise-grade controls at every layer
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--register-text-muted)' }}>
          REGISTER runs on the AICR governance platform — the same control plane that enforces
          policy gates, audit trails, and tenant isolation across every deployment. Security
          is not an add-on; it is the foundation.
        </p>

        <div className="space-y-4">
          {GOVERNANCE_LAYERS.map((layer) => (
            <div
              key={layer.name}
              className="register-card p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-xl"
                  style={{ backgroundColor: `${layer.color}20` }}
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                </div>
                <p className="text-base font-bold" style={{ color: 'var(--register-text)' }}>
                  {layer.name}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {layer.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-xl px-3 py-2"
                    style={{ backgroundColor: `${layer.color}08` }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-sm" style={{ color: 'var(--register-text)' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Implementation & Support ────────────────────────────── */}
      <section className="mb-6">
        <p className="register-section-header">
          Implementation &amp; Support
        </p>
        <p className="text-sm mb-5" style={{ color: 'var(--register-text-muted)' }}>
          From pilot to production with enterprise support
        </p>

        <div className="grid grid-cols-2 gap-4">
          {IMPLEMENTATION.map((t) => (
            <div
              key={t.label}
              className="register-card register-card-hover p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: t.color }}
                />
                <p className="text-sm font-bold" style={{ color: t.color }}>
                  {t.label}
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--register-text-muted)' }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </RegisterPage>
  );
}
