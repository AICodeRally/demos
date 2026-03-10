'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  HOMETOWNS,
  HOMETOWN_COMPLIANCE,
  DISPLAY_COMPLIANCE,
  ACCOUNT_TABC_STATUS,
  TABC_LICENSE_TYPES,
  countTABCIssues,
  getHometownCompliance,
  getLicenseInfo,
  type HometownComplianceSummary,
  type DisplayCompliance as DisplayComplianceType,
  type AccountTABCStatus,
} from '@/data/proofline';
import { pct } from '@/lib/utils';

/* ── Status badge colors ─────────────────────── */
const COMPLIANCE_COLORS: Record<string, { color: string; bg: string }> = {
  compliant:      { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  partial:        { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  'non-compliant': { color: '#F87171', bg: 'rgba(248,113,113,0.08)' },
};

const TABC_STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  active:    { color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  expiring:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  expired:   { color: '#F87171', bg: 'rgba(248,113,113,0.08)' },
  suspended: { color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  pending:   { color: 'var(--pl-text-muted)', bg: 'rgba(113,128,150,0.08)' },
};

/* ── Cold Vault Bar ──────────────────────────── */
function ColdVaultBar({ label, share, target }: { label: string; share: number; target: number }) {
  const maxPct = 0.55;
  const onTarget = share >= target;
  return (
    <>
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px] font-semibold" style={{ color: 'var(--pl-text)' }}>{label}</span>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span style={{ color: 'var(--pl-text-muted)' }}>Share: <strong style={{ color: onTarget ? '#22C55E' : '#F87171' }}>{pct(share)}</strong></span>
          <span style={{ color: 'var(--pl-text-faint)' }}>Target: {pct(target)}</span>
        </div>
      </div>
      <div className="relative h-4 rounded-full" style={{ background: 'var(--pl-chart-bar-track)' }}>
        <div
          className="absolute top-0 h-full rounded-full transition-all duration-500"
          style={{ width: `${(share / maxPct) * 100}%`, background: onTarget ? '#22C55E' : '#F87171', opacity: 0.7 }}
        />
        {/* Target marker */}
        <div
          className="absolute top-0 h-full w-0.5"
          style={{ left: `${(target / maxPct) * 100}%`, background: 'var(--pl-text)' }}
        />
      </div>
    </div>
    </>
  );
}

/* ── Hometown Compliance Card ────────────────── */
function HometownCard({ summary }: { summary: HometownComplianceSummary }) {
  const hometown = HOMETOWNS.find(h => h.id === summary.hometownId);
  const compPct = summary.compliantAccounts / summary.totalAccounts;
  const partPct = summary.partialAccounts / summary.totalAccounts;
  const ncPct = summary.nonCompliantAccounts / summary.totalAccounts;

  return (
    <>
    <div className="rounded-lg border p-4" style={{ borderColor: 'var(--pl-border)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>
          {hometown?.name.replace(' HQ', '') ?? summary.hometownId}
        </span>
        <span
          className="text-[18px] font-bold font-mono"
          style={{ color: summary.avgScore >= 85 ? '#22C55E' : summary.avgScore >= 75 ? '#F59E0B' : '#F87171' }}
        >
          {summary.avgScore}
        </span>
      </div>

      {/* Stacked compliance bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-2" style={{ background: 'var(--pl-chart-bar-track)' }}>
        <div style={{ width: `${compPct * 100}%`, background: '#22C55E' }} />
        <div style={{ width: `${partPct * 100}%`, background: '#F59E0B' }} />
        <div style={{ width: `${ncPct * 100}%`, background: '#F87171' }} />
      </div>

      <div className="grid grid-cols-3 gap-1 text-[10px] font-mono mb-2">
        <div className="text-center">
          <span style={{ color: '#22C55E' }}>{pct(compPct)}</span>
          <br /><span style={{ color: 'var(--pl-text-faint)' }}>Compliant</span>
        </div>
        <div className="text-center">
          <span style={{ color: '#F59E0B' }}>{pct(partPct)}</span>
          <br /><span style={{ color: 'var(--pl-text-faint)' }}>Partial</span>
        </div>
        <div className="text-center">
          <span style={{ color: '#F87171' }}>{pct(ncPct)}</span>
          <br /><span style={{ color: 'var(--pl-text-faint)' }}>Non-Comp</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        <span>Vault: {pct(summary.avgColdVaultShare)}</span>
        <span>TABC issues: <strong style={{ color: summary.tabcIssues > 10 ? '#F87171' : 'var(--pl-text-muted)' }}>{summary.tabcIssues}</strong></span>
        <span>Audit: {summary.lastFullAudit}</span>
      </div>

      <div className="mt-2 text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>
        {summary.topIssue}
      </div>
    </div>
    </>
  );
}

export default function CompliancePage() {
  const [tab, setTab] = useState<'display' | 'tabc'>('display');

  // Aggregate KPIs
  const totalAccounts = HOMETOWN_COMPLIANCE.reduce((s, h) => s + h.totalAccounts, 0);
  const totalCompliant = HOMETOWN_COMPLIANCE.reduce((s, h) => s + h.compliantAccounts, 0);
  const avgScore = Math.round(HOMETOWN_COMPLIANCE.reduce((s, h) => s + h.avgScore, 0) / HOMETOWN_COMPLIANCE.length);
  const avgColdVault = HOMETOWN_COMPLIANCE.reduce((s, h) => s + h.avgColdVaultShare, 0) / HOMETOWN_COMPLIANCE.length;
  const tabcIssues = countTABCIssues();
  const totalTABCIssues = tabcIssues.expiring + tabcIssues.expired + tabcIssues.suspended;

  // Non-compliant sample accounts
  const ncAccounts = DISPLAY_COMPLIANCE.filter(d => d.status === 'non-compliant' || d.status === 'partial');

  // Flagged TABC
  const flaggedTABC = ACCOUNT_TABC_STATUS.filter(a => a.status !== 'active');

  return (
    <>

      <ActNavigation currentAct={3} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: '#2563EB' }}>
          Compliance &middot; Display &amp; TABC
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Compliance Dashboard
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          Display compliance, cold vault share, and TABC license monitoring across {HOMETOWNS.length} hometowns
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Overall Score" value={String(avgScore)} accent={avgScore >= 85 ? '#22C55E' : '#F59E0B'} sub="Avg across hometowns" />
        <LightKpiCard label="Compliance Rate" value={pct(totalCompliant / totalAccounts)} accent="#22C55E" sub={`${totalCompliant.toLocaleString()} of ${totalAccounts.toLocaleString()}`} />
        <LightKpiCard label="Cold Vault Share" value={pct(avgColdVault)} accent={avgColdVault >= 0.40 ? '#22C55E' : '#F59E0B'} sub="Avg Lone Star share" />
        <LightKpiCard label="TABC Flags" value={String(totalTABCIssues)} accent={totalTABCIssues > 0 ? '#F87171' : '#22C55E'} sub={`${tabcIssues.expired} expired · ${tabcIssues.suspended} suspended`} />
        <LightKpiCard label="Photo Verified" value={pct(DISPLAY_COMPLIANCE.filter(d => d.photoVerified).length / DISPLAY_COMPLIANCE.length)} accent="#3B82F6" sub="Of sample audits" />
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-3 mb-6">
        {(['display', 'tabc'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="text-[12px] font-mono px-4 py-1.5 rounded-lg border transition-colors"
            style={{
              borderColor: tab === t ? '#2563EB' : 'var(--pl-border)',
              background: tab === t ? 'rgba(37,99,235,0.08)' : 'var(--pl-card)',
              color: tab === t ? '#2563EB' : 'var(--pl-text-muted)',
              fontWeight: tab === t ? 700 : 400,
            }}
          >
            {t === 'display' ? 'Display Compliance' : 'TABC Compliance'}
          </button>
        ))}
      </div>

      {tab === 'display' ? (
        <>
          {/* Hometown Compliance Grid */}
          <LightSectionCard title="Display Compliance by Hometown" className="mb-6">
            <div className="grid grid-cols-3 gap-3">
              {HOMETOWN_COMPLIANCE.map(h => (
                <HometownCard key={h.hometownId} summary={h} />
              ))}
            </div>
          </LightSectionCard>

          {/* Cold Vault Share */}
          <LightSectionCard title="Cold Vault Share — Lone Star vs Target by Hometown" className="mb-6">
            {HOMETOWN_COMPLIANCE.map(h => {
              const ht = HOMETOWNS.find(x => x.id === h.hometownId);
              return (
                <ColdVaultBar
                  key={h.hometownId}
                  label={ht?.name.replace(' HQ', '') ?? h.hometownId}
                  share={h.avgColdVaultShare}
                  target={0.40}
                />
              );
            })}
            <div className="flex items-center gap-4 mt-2 text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
              <span>■ bar = current share</span>
              <span>│ marker = 40% target</span>
              <span>Cold vault = cooler/refrigerator door facings allocated to Lone Star brands</span>
            </div>
          </LightSectionCard>

          {/* Account Issues Table */}
          <LightSectionCard title="Accounts with Issues — Sample Audit Data" className="mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr style={{ color: 'var(--pl-text-muted)' }}>
                    <th className="text-left font-medium pb-3 pl-2">Account</th>
                    <th className="text-left font-medium pb-3">Route</th>
                    <th className="text-right font-medium pb-3">Score</th>
                    <th className="text-left font-medium pb-3">Status</th>
                    <th className="text-right font-medium pb-3">Cold Vault</th>
                    <th className="text-right font-medium pb-3">Shelf</th>
                    <th className="text-left font-medium pb-3 pr-2">Top Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {ncAccounts.map((d, i) => {
                    const sc = COMPLIANCE_COLORS[d.status] ?? COMPLIANCE_COLORS['partial'];
                    return (
                      <tr key={d.accountId} style={i % 2 === 0 ? { background: 'var(--pl-stripe)' } : undefined}>
                        <td className="py-2 pl-2 font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{d.accountId}</td>
                        <td className="py-2 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{d.routeId}</td>
                        <td className="py-2 text-right font-mono font-bold" style={{ color: sc.color }}>{d.overallScore}</td>
                        <td className="py-2">
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: sc.bg, color: sc.color }}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-2 text-right font-mono" style={{ color: d.coldVaultShare >= d.coldVaultTarget ? '#22C55E' : '#F87171' }}>
                          {pct(d.coldVaultShare)}
                        </td>
                        <td className="py-2 text-right font-mono" style={{ color: d.shelfCompliance >= 0.85 ? '#22C55E' : '#F59E0B' }}>
                          {pct(d.shelfCompliance)}
                        </td>
                        <td className="py-2 pr-2 text-[11px] max-w-[200px] truncate" style={{ color: 'var(--pl-text-muted)' }}>
                          {d.issues[0]?.description ?? '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>
        </>
      ) : (
        <>
          {/* TABC License Types Reference */}
          <LightSectionCard title="TABC License Types" className="mb-6">
            <div className="grid grid-cols-3 gap-3">
              {TABC_LICENSE_TYPES.map(lic => (
                <div key={lic.code} className="rounded-lg border p-3" style={{ borderColor: 'var(--pl-border)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded"
                      style={{
                        background: lic.allowsSpirits ? 'rgba(248,113,113,0.08)' : 'rgba(113,128,150,0.08)',
                        color: lic.allowsSpirits ? '#F87171' : 'var(--pl-text-muted)',
                      }}
                    >
                      {lic.code}
                    </span>
                    <span className="text-[12px] font-semibold" style={{ color: 'var(--pl-text)' }}>{lic.label}</span>
                  </div>
                  <p className="text-[10px]" style={{ color: 'var(--pl-text-muted)' }}>{lic.description}</p>
                  {lic.allowsSpirits && (
                    <div className="mt-1 text-[9px] font-bold font-mono" style={{ color: '#F87171' }}>SPIRITS ELIGIBLE</div>
                  )}
                </div>
              ))}
            </div>
          </LightSectionCard>

          {/* TABC Flagged Accounts */}
          <LightSectionCard title="TABC Flagged Accounts" className="mb-6">
            <div className="space-y-2">
              {flaggedTABC.map(a => {
                const sc = TABC_STATUS_COLORS[a.status] ?? TABC_STATUS_COLORS['pending'];
                return (
                  <div key={a.accountId} className="flex items-center gap-4 px-4 py-3 rounded-lg border" style={{ borderColor: sc.color + '30' }}>
                    <span className="text-[12px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{a.accountId}</span>
                    <span
                      className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded uppercase"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      {a.status}
                    </span>
                    <span className="text-[11px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{a.licenseCode} · #{a.licenseNumber}</span>
                    <span className="text-[11px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>Exp: {a.expirationDate}</span>
                    <span className="text-[11px] flex-1" style={{ color: sc.color }}>{a.notes}</span>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          {/* TABC Status by Hometown */}
          <LightSectionCard title="TABC Issues by Hometown" className="mb-6">
            <div className="grid grid-cols-3 gap-3">
              {HOMETOWN_COMPLIANCE.map(h => {
                const ht = HOMETOWNS.find(x => x.id === h.hometownId);
                return (
                  <div key={h.hometownId} className="rounded-lg border p-3 flex items-center justify-between" style={{ borderColor: 'var(--pl-border)' }}>
                    <span className="text-[12px] font-semibold" style={{ color: 'var(--pl-text)' }}>
                      {ht?.name.replace(' HQ', '') ?? h.hometownId}
                    </span>
                    <span
                      className="text-[16px] font-bold font-mono"
                      style={{ color: h.tabcIssues === 0 ? '#22C55E' : h.tabcIssues > 10 ? '#F87171' : '#F59E0B' }}
                    >
                      {h.tabcIssues}
                    </span>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Methodology */}
      <div className="text-[11px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        Display compliance scored 0-100 based on cold vault share, endcap placement, POS materials, and shelf planogram adherence.
        TABC license status verified quarterly. Cold vault target: 40% of cooler facings for Lone Star brands.
      </div>

    </>
  );
}
