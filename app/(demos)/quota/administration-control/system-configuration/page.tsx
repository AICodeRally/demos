'use client';

import {
  Settings, Calendar, Cpu, DollarSign, Database, Bell,
  ToggleRight, ToggleLeft, Clock, RefreshCw, ChevronDown,
} from 'lucide-react';

/* ── Toggle switch (visual only) ───────────────────────────────── */
function Toggle({ on }: { on: boolean }) {
  return on
    ? <ToggleRight className="h-5 w-5 text-amber-400" />
    : <ToggleLeft className="h-5 w-5 text-slate-300" />;
}

/* ── Setting row ───────────────────────────────────────────────── */
function SettingRow({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-3 last:border-0" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--prizym-text-muted)' }}>{sub}</p>}
      </div>
      <div className="text-sm font-mono" style={{ color: 'var(--prizym-text-secondary)' }}>{value}</div>
    </div>
  );
}

/* ── Status pill ───────────────────────────────────────────────── */
function StatusPill({ status }: { status: 'active' | 'disabled' | 'scheduled' }) {
  const colors = {
    active: 'bg-emerald-500/20 text-emerald-600',
    disabled: 'bg-slate-100 text-slate-400',
    scheduled: 'bg-amber-500/20 text-amber-400',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'active' ? 'bg-emerald-400' : status === 'scheduled' ? 'bg-amber-400' : 'bg-slate-300'}`} />
      {status}
    </span>
  );
}

/* ── Section card ──────────────────────────────────────────────── */
function SectionCard({ title, icon: Icon, status, children }: {
  title: string; icon: React.ElementType; status: 'active' | 'disabled' | 'scheduled'; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Icon className="h-4 w-4 text-amber-400" />
          </div>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>{title}</h2>
        </div>
        <StatusPill status={status} />
      </div>
      {children}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function SystemConfigurationPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>System Configuration</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Configure calculation methods, business rules, and global platform settings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--prizym-text-muted)' }}>
            <Clock className="h-3 w-3" /> Last saved 12 min ago
          </span>
          <button className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 transition">
            <RefreshCw className="h-3 w-3" /> Save Changes
          </button>
        </div>
      </div>

      {/* Environment Banner */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-amber-400" />
          <span className="text-xs" style={{ color: 'var(--prizym-text-secondary)' }}>Environment: <span className="font-semibold text-amber-400">Production</span></span>
          <span className="text-xs ml-2" style={{ color: 'var(--prizym-text-muted)' }}>Tenant: Blue Horizons Group</span>
        </div>
        <button className="flex items-center gap-1 text-xs transition" style={{ color: 'var(--prizym-text-muted)' }}>
          Switch <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fiscal Year */}
        <SectionCard title="Fiscal Year Settings" icon={Calendar} status="active">
          <SettingRow label="Fiscal Year Start" value="January" sub="FY2026 begins Jan 1, 2026" />
          <SettingRow label="Q1" value="Jan — Mar" />
          <SettingRow label="Q2" value="Apr — Jun" />
          <SettingRow label="Q3" value="Jul — Sep" />
          <SettingRow label="Q4" value="Oct — Dec" />
          <SettingRow label="Plan Year Rollover" value="Auto" sub="Quotas auto-copy to new FY on Jan 1" />
          <SettingRow label="Grace Period" value="15 days" sub="Late deals credited to prior quarter" />
        </SectionCard>

        {/* Calculation Engine */}
        <SectionCard title="Calculation Engine" icon={Cpu} status="active">
          <SettingRow label="Mode" value={<span className="text-amber-400 font-semibold">Real-Time</span>} sub="Commissions calculated on deal close" />
          <SettingRow label="Batch Fallback" value={<Toggle on />} sub="Nightly batch recalc at 02:00 UTC" />
          <SettingRow label="Recalc Frequency" value="Every 15 min" sub="Incremental delta calculation" />
          <SettingRow label="Parallel Workers" value="8 threads" />
          <SettingRow label="Queue Depth" value="342" sub="Current pending calculations" />
          <SettingRow label="Avg Calc Time" value="1.2s" sub="P95: 3.4s" />
          <SettingRow label="Error Rate" value={<span className="text-emerald-600">0.02%</span>} sub="Last 30 days" />
        </SectionCard>

        {/* Currency & Rounding */}
        <SectionCard title="Currency & Rounding" icon={DollarSign} status="active">
          <SettingRow label="Base Currency" value="USD ($)" />
          <SettingRow label="Decimal Precision" value="2 places" sub="All monetary calculations" />
          <SettingRow label="Rounding Method" value="Banker's Rounding" sub="Round half to even (IEEE 754)" />
          <SettingRow label="Multi-Currency" value={<Toggle on />} sub="Auto-convert at daily ECB rate" />
          <SettingRow label="Supported Currencies" value="USD, EUR, GBP, CAD" />
          <SettingRow label="Exchange Rate Source" value="ECB Daily Fix" sub="Updated 06:00 UTC" />
          <SettingRow label="Rate Override" value={<Toggle on={false} />} sub="Manual rate entry disabled" />
        </SectionCard>

        {/* Data Retention */}
        <SectionCard title="Data Retention Policy" icon={Database} status="active">
          <SettingRow label="Active Data" value="36 months" sub="Full query access" />
          <SettingRow label="Archive Period" value="60 months" sub="Read-only, compressed storage" />
          <SettingRow label="Purge After" value="84 months" sub="Auto-delete with audit trail" />
          <SettingRow label="Backup Schedule" value="Daily (02:00 UTC)" />
          <SettingRow label="Backup Retention" value="90 days" />
          <SettingRow label="Storage Used" value="2.4 GB / 10 GB" sub="24% utilization" />
          <SettingRow
            label="Compliance Hold"
            value={<Toggle on />}
            sub="Prevent purge of flagged records"
          />
        </SectionCard>

        {/* Notifications — full width */}
        <div className="lg:col-span-2">
          <SectionCard title="Notification Settings" icon={Bell} status="active">
            <div className="grid gap-0 md:grid-cols-3 md:gap-6">
              {/* Email */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--prizym-text-muted)' }}>Email</h3>
                <SettingRow label="Quota Assigned" value={<Toggle on />} />
                <SettingRow label="Deal Closed" value={<Toggle on />} />
                <SettingRow label="Commission Paid" value={<Toggle on />} />
                <SettingRow label="Dispute Filed" value={<Toggle on />} />
                <SettingRow label="Plan Changed" value={<Toggle on />} />
                <SettingRow label="Weekly Digest" value={<Toggle on />} />
              </div>
              {/* Slack */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--prizym-text-muted)' }}>Slack</h3>
                <SettingRow label="#sales-quota" value={<Toggle on />} />
                <SettingRow label="#leadership" value={<Toggle on />} />
                <SettingRow label="DM on Dispute" value={<Toggle on />} />
                <SettingRow label="Daily Standup" value={<Toggle on={false} />} />
                <SettingRow label="Milestone Alert" value={<Toggle on />} />
                <SettingRow label="Bot Updates" value={<Toggle on />} />
              </div>
              {/* In-App */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--prizym-text-muted)' }}>In-App</h3>
                <SettingRow label="Toast Notifications" value={<Toggle on />} />
                <SettingRow label="Badge Count" value={<Toggle on />} />
                <SettingRow label="Sound Alerts" value={<Toggle on={false} />} />
                <SettingRow label="Push (Mobile)" value={<Toggle on />} />
                <SettingRow label="Desktop Push" value={<Toggle on={false} />} />
                <SettingRow label="Quiet Hours" value="22:00 — 07:00" />
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--prizym-border-default)' }}>
        <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Configuration v2.4.1 — 14 settings modified since last deploy</p>
        <div className="flex items-center gap-4">
          <button className="text-xs transition" style={{ color: 'var(--prizym-text-muted)' }}>Reset to Defaults</button>
          <button className="text-xs transition" style={{ color: 'var(--prizym-text-muted)' }}>Export Config</button>
          <button className="text-xs text-amber-400 hover:text-amber-300 font-medium transition">View Change History</button>
        </div>
      </div>
    </>
  );
}
