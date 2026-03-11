'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import { SELLERS, MANAGERS, getSellersByHometown } from '@/data/proofline';

const ACCENT = '#10B981';
const GOLD = '#C6A052';
const BLUE = '#2563EB';
const PURPLE = '#8B5CF6';
const ORANGE = '#F97316';
const CYAN = '#0EA5E9';

/* ── Tier definitions ────────────────────────────── */
const TIERS = [
  { id: 'best', label: 'Best', payout: 1000, color: '#C6A052', threshold: 8, icon: '★' },
  { id: 'better', label: 'Better', payout: 800, color: '#94A3B8', threshold: 5, icon: '◆' },
  { id: 'good', label: 'Good', payout: 600, color: '#CD7F32', threshold: 3, icon: '●' },
] as const;

/* ── Active programs ─────────────────────────────── */
interface Program {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  district: string;
  quarter: string;
  status: 'active' | 'completed' | 'draft';
  focus: string;
  metric: string;
  description: string;
  startDate: string;
  endDate: string;
  budgetCap: number;
  tiers: { label: string; threshold: string; payout: number }[];
  repResults: { sellerId: string; progress: number; tier: 'best' | 'better' | 'good' | null }[];
}

const PROGRAMS: Program[] = [
  {
    id: 'PROG-Q2-DAL',
    name: 'Spirits Expansion Push',
    managerId: 'MGR-DAL',
    managerName: 'Sarah Chen',
    district: 'Dallas HQ',
    quarter: 'Q2 2026',
    status: 'active',
    focus: 'Sazerac Portfolio',
    metric: 'New spirits accounts placed',
    description: 'Place Sazerac portfolio (Buffalo Trace, Fireball, Southern Comfort) in accounts that currently carry zero spirits. Photo-verified. One qualifying brand = one account.',
    startDate: 'Apr 1',
    endDate: 'Jun 30',
    budgetCap: 7200,
    tiers: [
      { label: 'Best', threshold: '8+ new accounts', payout: 1000 },
      { label: 'Better', threshold: '5–7 new accounts', payout: 800 },
      { label: 'Good', threshold: '3–4 new accounts', payout: 600 },
    ],
    repResults: [
      { sellerId: 'SEL-DAL-01', progress: 10, tier: 'best' },
      { sellerId: 'SEL-DAL-04', progress: 9, tier: 'best' },
      { sellerId: 'SEL-DAL-06', progress: 8, tier: 'best' },
      { sellerId: 'SEL-DAL-03', progress: 7, tier: 'better' },
      { sellerId: 'SEL-DAL-02', progress: 5, tier: 'better' },
      { sellerId: 'SEL-DAL-05', progress: 4, tier: 'good' },
      { sellerId: 'SEL-DAL-07', progress: 3, tier: 'good' },
      { sellerId: 'SEL-DAL-08', progress: 1, tier: null },
    ],
  },
  {
    id: 'PROG-Q2-FTW',
    name: 'Display Compliance Blitz',
    managerId: 'MGR-FTW',
    managerName: 'Carlos Mendoza',
    district: 'Fort Worth',
    quarter: 'Q2 2026',
    status: 'active',
    focus: 'Display Standards',
    metric: 'Display compliance % improvement',
    description: 'Improve display compliance score on route by end of quarter. Photo-verified cooler audits weekly. Baseline is Q1 close compliance rate.',
    startDate: 'Apr 1',
    endDate: 'Jun 30',
    budgetCap: 6400,
    tiers: [
      { label: 'Best', threshold: '+12pp or 95%+', payout: 1000 },
      { label: 'Better', threshold: '+8pp or 90%+', payout: 800 },
      { label: 'Good', threshold: '+5pp or 87%+', payout: 600 },
    ],
    repResults: [
      { sellerId: 'SEL-FTW-01', progress: 95, tier: 'best' },
      { sellerId: 'SEL-FTW-03', progress: 93, tier: 'best' },
      { sellerId: 'SEL-FTW-06', progress: 91, tier: 'better' },
      { sellerId: 'SEL-FTW-04', progress: 90, tier: 'better' },
      { sellerId: 'SEL-FTW-02', progress: 88, tier: 'good' },
      { sellerId: 'SEL-FTW-05', progress: 87, tier: 'good' },
      { sellerId: 'SEL-FTW-07', progress: 84, tier: null },
      { sellerId: 'SEL-FTW-08', progress: 80, tier: null },
    ],
  },
  {
    id: 'PROG-Q2-ALN',
    name: 'New Account Acquisition',
    managerId: 'MGR-ALN',
    managerName: 'Lisa Park',
    district: 'Allen',
    quarter: 'Q2 2026',
    status: 'active',
    focus: 'Growth Accounts',
    metric: 'Net new accounts activated',
    description: 'Activate net-new accounts in Collin County growth corridor. Account must have 2+ deliveries and $500+ revenue within 30 days of activation to count.',
    startDate: 'Apr 1',
    endDate: 'Jun 30',
    budgetCap: 4800,
    tiers: [
      { label: 'Best', threshold: '8+ new accounts', payout: 1000 },
      { label: 'Better', threshold: '5–7 new accounts', payout: 800 },
      { label: 'Good', threshold: '3–4 new accounts', payout: 600 },
    ],
    repResults: [
      { sellerId: 'SEL-ALN-01', progress: 9, tier: 'best' },
      { sellerId: 'SEL-ALN-03', progress: 6, tier: 'better' },
      { sellerId: 'SEL-ALN-02', progress: 5, tier: 'better' },
      { sellerId: 'SEL-ALN-05', progress: 4, tier: 'good' },
      { sellerId: 'SEL-ALN-04', progress: 2, tier: null },
      { sellerId: 'SEL-ALN-06', progress: 1, tier: null },
    ],
  },
];

/* ── Helpers ──────────────────────────────────────── */
const getSellerName = (id: string) => SELLERS.find(s => s.id === id)?.name ?? id;
const getSellerRoute = (id: string) => SELLERS.find(s => s.id === id)?.routeId ?? '';

const tierColor = (t: 'best' | 'better' | 'good' | null) =>
  t === 'best' ? '#C6A052' : t === 'better' ? '#94A3B8' : t === 'good' ? '#CD7F32' : 'var(--pl-text-faint)';

const tierIcon = (t: 'best' | 'better' | 'good' | null) =>
  t === 'best' ? '★' : t === 'better' ? '◆' : t === 'good' ? '●' : '—';

/* ── Page ─────────────────────────────────────────── */
export default function OpportunityBonusPage() {
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS[0].id);
  const activeProgram = PROGRAMS.find(p => p.id === selectedProgram) ?? PROGRAMS[0];

  // Aggregate stats
  const totalBudget = PROGRAMS.reduce((s, p) => s + p.budgetCap, 0);
  const totalQualifying = PROGRAMS.reduce((s, p) => s + p.repResults.filter(r => r.tier !== null).length, 0);
  const totalReps = PROGRAMS.reduce((s, p) => s + p.repResults.length, 0);
  const totalProjectedPayout = PROGRAMS.reduce((s, p) =>
    s + p.repResults.reduce((rs, r) =>
      rs + (r.tier === 'best' ? 1000 : r.tier === 'better' ? 800 : r.tier === 'good' ? 600 : 0), 0), 0);

  const programPayout = activeProgram.repResults.reduce((s, r) =>
    s + (r.tier === 'best' ? 1000 : r.tier === 'better' ? 800 : r.tier === 'good' ? 600 : 0), 0);

  const bestCount = activeProgram.repResults.filter(r => r.tier === 'best').length;
  const betterCount = activeProgram.repResults.filter(r => r.tier === 'better').length;
  const goodCount = activeProgram.repResults.filter(r => r.tier === 'good').length;
  const noTier = activeProgram.repResults.filter(r => r.tier === null).length;

  return (
    <>
      <ActNavigation currentAct={4} />

      {/* ═══════ HERO ═══════ */}
      <div className="rounded-xl overflow-hidden mb-8" style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(198,160,82,0.06))',
        border: '1px solid rgba(16,185,129,0.25)',
      }}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{ background: `${ACCENT}18`, color: ACCENT }}>
              &#9733;
            </div>
            <div>
              <div className="text-xs tracking-[4px] uppercase font-mono font-bold" style={{ color: ACCENT }}>
                Act 4 &middot; RSM Quarterly Programs
              </div>
              <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
                Opportunity Bonus Programs
              </h1>
            </div>
          </div>
          <p className="text-sm font-mono leading-relaxed max-w-3xl" style={{ color: 'var(--pl-text-muted)' }}>
            Regional Sales Managers design quarterly bonus programs targeting specific strategic objectives.
            Three-tier structure (Good / Better / Best) lets managers reward incremental effort, not just top performers.
            All programs are budget-capped, auditable, and tracked inside PROOFLINE.
          </p>
        </div>
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, ${GOLD})`, opacity: 0.5 }} />
      </div>

      {/* ═══════ KPIs ═══════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <LightKpiCard
          label="Active Programs"
          value={String(PROGRAMS.length)}
          accent={ACCENT}
          sub={`${PROGRAMS.length} managers running programs`}
          stagger={0}
        />
        <LightKpiCard
          label="Total Budget"
          value={`$${(totalBudget / 1000).toFixed(1)}K`}
          accent={GOLD}
          sub="quarterly allocation"
          stagger={1}
        />
        <LightKpiCard
          label="Projected Payout"
          value={`$${(totalProjectedPayout / 1000).toFixed(1)}K`}
          accent={BLUE}
          sub={`${totalQualifying} of ${totalReps} reps qualifying`}
          stagger={2}
        />
        <LightKpiCard
          label="Budget Utilization"
          value={`${((totalProjectedPayout / totalBudget) * 100).toFixed(0)}%`}
          accent={PURPLE}
          sub="of allocated budget"
          stagger={3}
        />
      </div>

      {/* ═══════ TIER STRUCTURE ═══════ */}
      <LightSectionCard title="THREE-TIER PAYOUT STRUCTURE">
        <div className="grid grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div key={tier.id} className="rounded-xl p-5 text-center" style={{
              background: `${tier.color}08`,
              border: `1px solid ${tier.color}25`,
            }}>
              <div className="text-3xl mb-2">{tier.icon}</div>
              <div className="text-lg font-extrabold mb-1" style={{ color: tier.color, fontFamily: 'var(--pl-font)' }}>
                {tier.label}
              </div>
              <div className="text-2xl font-extrabold font-mono mb-2" style={{ color: 'var(--pl-text)' }}>
                ${tier.payout}
              </div>
              <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                per qualifying rep
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--pl-hover)', border: '1px solid var(--pl-border)' }}>
          <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>
            RSMs set the qualification criteria for each tier. Programs are budget-capped &mdash; if projected payouts exceed budget,
            the RSM is alerted before the program closes. All payouts run through the standard comp approval workflow.
          </p>
        </div>
      </LightSectionCard>

      {/* ═══════ PROGRAM SELECTOR ═══════ */}
      <LightSectionCard title="ACTIVE PROGRAMS — Q2 2026">
        {/* Tab selector */}
        <div className="flex gap-2 mb-6">
          {PROGRAMS.map((p) => {
            const isSelected = p.id === selectedProgram;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProgram(p.id)}
                className="flex-1 rounded-xl p-4 text-left transition-all"
                style={{
                  background: isSelected ? `${ACCENT}12` : 'var(--pl-card)',
                  border: isSelected ? `2px solid ${ACCENT}` : '1px solid var(--pl-border)',
                  boxShadow: isSelected ? `0 0 12px ${ACCENT}15` : 'var(--pl-shadow)',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold" style={{ color: isSelected ? ACCENT : 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
                    {p.name}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{
                    background: `${ACCENT}15`,
                    color: ACCENT,
                  }}>ACTIVE</span>
                </div>
                <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                  {p.managerName} &middot; {p.district}
                </div>
                <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>
                  {p.focus} &middot; {p.repResults.filter(r => r.tier).length}/{p.repResults.length} qualifying
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Selected Program Detail ────────────────── */}
        <div className="rounded-xl p-6" style={{
          background: `${ACCENT}04`,
          border: `1px solid ${ACCENT}18`,
        }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs tracking-[2px] uppercase font-mono mb-1" style={{ color: ACCENT }}>
                {activeProgram.quarter} &middot; {activeProgram.district}
              </div>
              <h3 className="text-xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
                {activeProgram.name}
              </h3>
              <p className="text-sm font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>
                Created by {activeProgram.managerName} &middot; {activeProgram.startDate} &ndash; {activeProgram.endDate}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Budget</div>
              <div className="text-lg font-bold font-mono" style={{ color: GOLD }}>${activeProgram.budgetCap.toLocaleString()}</div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg p-3 mb-5" style={{ background: 'var(--pl-hover)', border: '1px solid var(--pl-border)' }}>
            <div className="text-xs font-bold font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--pl-text-faint)' }}>
              Program Rules
            </div>
            <p className="text-sm font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>
              {activeProgram.description}
            </p>
          </div>

          {/* Tier thresholds */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {activeProgram.tiers.map((t, i) => {
              const tierDef = TIERS[i];
              return (
                <div key={t.label} className="rounded-lg p-3 text-center" style={{
                  background: `${tierDef.color}08`,
                  border: `1px solid ${tierDef.color}20`,
                }}>
                  <div className="text-lg font-bold" style={{ color: tierDef.color }}>{tierDef.icon} {t.label}</div>
                  <div className="text-sm font-mono font-bold" style={{ color: 'var(--pl-text)' }}>${t.payout}</div>
                  <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>{t.threshold}</div>
                </div>
              );
            })}
          </div>

          {/* Tier distribution bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider" style={{ color: 'var(--pl-text-faint)' }}>
                Tier Distribution
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                ${programPayout.toLocaleString()} of ${activeProgram.budgetCap.toLocaleString()} budget
              </span>
            </div>
            <div className="flex h-8 rounded-lg overflow-hidden" style={{ border: '1px solid var(--pl-border)' }}>
              {bestCount > 0 && (
                <div className="flex items-center justify-center text-xs font-bold font-mono" style={{
                  width: `${(bestCount / activeProgram.repResults.length) * 100}%`,
                  background: '#C6A05230',
                  color: '#C6A052',
                  borderRight: '1px solid var(--pl-border)',
                }}>
                  ★ {bestCount}
                </div>
              )}
              {betterCount > 0 && (
                <div className="flex items-center justify-center text-xs font-bold font-mono" style={{
                  width: `${(betterCount / activeProgram.repResults.length) * 100}%`,
                  background: '#94A3B820',
                  color: '#94A3B8',
                  borderRight: '1px solid var(--pl-border)',
                }}>
                  ◆ {betterCount}
                </div>
              )}
              {goodCount > 0 && (
                <div className="flex items-center justify-center text-xs font-bold font-mono" style={{
                  width: `${(goodCount / activeProgram.repResults.length) * 100}%`,
                  background: '#CD7F3220',
                  color: '#CD7F32',
                  borderRight: '1px solid var(--pl-border)',
                }}>
                  ● {goodCount}
                </div>
              )}
              {noTier > 0 && (
                <div className="flex items-center justify-center text-xs font-mono" style={{
                  width: `${(noTier / activeProgram.repResults.length) * 100}%`,
                  background: 'var(--pl-hover)',
                  color: 'var(--pl-text-faint)',
                }}>
                  {noTier} below
                </div>
              )}
            </div>
          </div>

          {/* Rep leaderboard */}
          <div className="text-xs font-bold font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--pl-text-faint)' }}>
            Rep Progress
          </div>
          <div className="space-y-2">
            {activeProgram.repResults.map((r, i) => {
              const seller = SELLERS.find(s => s.id === r.sellerId);
              if (!seller) return null;
              const tc = tierColor(r.tier);
              const maxProgress = activeProgram.repResults[0]?.progress ?? 1;
              const barWidth = Math.max((r.progress / Math.max(maxProgress, 1)) * 100, 4);
              return (
                <div key={r.sellerId} className="flex items-center gap-3 rounded-lg px-3 py-2.5" style={{
                  background: i % 2 === 0 ? 'var(--pl-stripe)' : 'transparent',
                }}>
                  {/* Rank */}
                  <div className="w-6 text-center text-sm font-bold font-mono" style={{ color: tc }}>
                    {tierIcon(r.tier)}
                  </div>
                  {/* Name & route */}
                  <div className="w-36 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: 'var(--pl-text)' }}>
                      {seller.name}
                    </div>
                    <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
                      {seller.routeId}
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="flex-1">
                    <div className="h-5 rounded-full overflow-hidden" style={{ background: 'var(--pl-hover)' }}>
                      <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{
                        width: `${barWidth}%`,
                        background: `${tc}30`,
                        borderRight: `3px solid ${tc}`,
                      }}>
                        <span className="text-xs font-bold font-mono" style={{ color: tc }}>
                          {r.progress}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Tier label */}
                  <div className="w-16 text-right">
                    {r.tier ? (
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full" style={{
                        background: `${tc}15`,
                        color: tc,
                      }}>
                        ${r.tier === 'best' ? '1,000' : r.tier === 'better' ? '800' : '600'}
                      </span>
                    ) : (
                      <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </LightSectionCard>

      {/* ═══════ ALL PROGRAMS SUMMARY TABLE ═══════ */}
      <LightSectionCard title="PROGRAM OVERVIEW — ALL DISTRICTS">
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ color: 'var(--pl-text-muted)' }}>
              <th className="text-left font-medium pb-3 pl-2">Program</th>
              <th className="text-left font-medium pb-3">RSM</th>
              <th className="text-center font-medium pb-3">★</th>
              <th className="text-center font-medium pb-3">◆</th>
              <th className="text-center font-medium pb-3">●</th>
              <th className="text-right font-medium pb-3">Projected</th>
              <th className="text-right font-medium pb-3 pr-2">Budget</th>
            </tr>
          </thead>
          <tbody>
            {PROGRAMS.map((p, i) => {
              const best = p.repResults.filter(r => r.tier === 'best').length;
              const better = p.repResults.filter(r => r.tier === 'better').length;
              const good = p.repResults.filter(r => r.tier === 'good').length;
              const projected = best * 1000 + better * 800 + good * 600;
              return (
                <tr
                  key={p.id}
                  className="cursor-pointer hover:bg-[var(--pl-hover)] transition-colors"
                  style={i % 2 === 0 ? { background: 'var(--pl-stripe)' } : undefined}
                  onClick={() => setSelectedProgram(p.id)}
                >
                  <td className="py-2.5 pl-2">
                    <div className="font-semibold" style={{ color: 'var(--pl-text)' }}>{p.name}</div>
                    <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>{p.focus}</div>
                  </td>
                  <td className="py-2.5">
                    <div className="font-mono" style={{ color: 'var(--pl-text-muted)' }}>{p.managerName}</div>
                    <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>{p.district}</div>
                  </td>
                  <td className="py-2.5 text-center font-mono font-bold" style={{ color: '#C6A052' }}>{best}</td>
                  <td className="py-2.5 text-center font-mono font-bold" style={{ color: '#94A3B8' }}>{better}</td>
                  <td className="py-2.5 text-center font-mono font-bold" style={{ color: '#CD7F32' }}>{good}</td>
                  <td className="py-2.5 text-right font-mono font-bold" style={{ color: ACCENT }}>
                    ${projected.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right pr-2 font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                    ${p.budgetCap.toLocaleString()}
                  </td>
                </tr>
              );
            })}
            {/* Totals row */}
            <tr style={{ borderTop: '2px solid var(--pl-border)' }}>
              <td className="pt-3 pl-2 font-bold" style={{ color: 'var(--pl-text)' }}>TOTAL</td>
              <td className="pt-3 font-mono" style={{ color: 'var(--pl-text-muted)' }}>{PROGRAMS.length} programs</td>
              <td className="pt-3 text-center font-mono font-bold" style={{ color: '#C6A052' }}>
                {PROGRAMS.reduce((s, p) => s + p.repResults.filter(r => r.tier === 'best').length, 0)}
              </td>
              <td className="pt-3 text-center font-mono font-bold" style={{ color: '#94A3B8' }}>
                {PROGRAMS.reduce((s, p) => s + p.repResults.filter(r => r.tier === 'better').length, 0)}
              </td>
              <td className="pt-3 text-center font-mono font-bold" style={{ color: '#CD7F32' }}>
                {PROGRAMS.reduce((s, p) => s + p.repResults.filter(r => r.tier === 'good').length, 0)}
              </td>
              <td className="pt-3 text-right font-mono font-bold" style={{ color: ACCENT }}>
                ${totalProjectedPayout.toLocaleString()}
              </td>
              <td className="pt-3 text-right pr-2 font-mono font-bold" style={{ color: 'var(--pl-text-muted)' }}>
                ${totalBudget.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </LightSectionCard>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <LightSectionCard title="HOW RSM PROGRAMS WORK">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'RSM Designs', desc: 'Manager picks a strategic focus, sets Good/Better/Best thresholds, and requests budget approval.', color: ACCENT, icon: '✎' },
            { step: '2', title: 'Director Approves', desc: 'Director reviews budget, criteria, and alignment with corporate priorities before activation.', color: GOLD, icon: '✓' },
            { step: '3', title: 'Reps Execute', desc: 'Reps see their program targets in the rep portal. Progress updates in real-time from verified data.', color: BLUE, icon: '▶' },
            { step: '4', title: 'Auto-Payout', desc: 'At quarter close, qualifying reps are paid through the standard comp approval workflow. Full audit trail.', color: PURPLE, icon: '$' },
          ].map((s) => (
            <div key={s.step} className="rounded-xl p-4" style={{
              background: `${s.color}06`,
              border: `1px solid ${s.color}18`,
            }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-mono"
                  style={{ background: `${s.color}20`, color: s.color }}>
                  {s.step}
                </div>
                <span className="text-sm font-bold" style={{ color: s.color, fontFamily: 'var(--pl-font)' }}>
                  {s.title}
                </span>
              </div>
              <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--pl-text-muted)' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </LightSectionCard>

      {/* ═══════ KEY DIFFERENTIATOR ═══════ */}
      <div className="rounded-lg px-6 py-4 mt-2 mb-6" style={{
        background: `rgba(16,185,129,0.06)`,
        borderLeft: `3px solid ${ACCENT}`,
      }}>
        <p className="text-[14px] italic leading-relaxed" style={{ color: 'var(--pl-text-secondary)' }}>
          &ldquo;Most ICM tools only handle formula-driven comp. PROOFLINE lets managers run their own programs
          inside the same system &mdash; with budget controls, approval gates, and full auditability.
          No spreadsheets. No shadow comp.&rdquo;
        </p>
        <p className="text-[12px] font-semibold mt-2" style={{ color: ACCENT }}>
          &mdash; Platform Value Proposition
        </p>
      </div>
    </>
  );
}
