'use client';

import { useState, useEffect } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import { SELLERS, HOMETOWNS } from '@/data/proofline';

/* ── Luxury colors ──────────────────────────────── */
const GOLD = '#C6A052';
const PLATINUM = '#B8C5D6';
const DIAMOND = '#9F7AEA';
const ACCENT = '#C6A052';

const TIER_COLORS: Record<number, string> = {
  1: '#22C55E',
  2: '#2563EB',
  3: '#F59E0B',
  4: '#94A3B8',
};

const RATE_SCHEDULE = [
  { tier: 1, label: 'Elite', floor: 110, ceiling: Infinity, ratePerCase: 3.80, range: '110%+' },
  { tier: 2, label: 'Achiever', floor: 90, ceiling: 110, ratePerCase: 3.20, range: '90\u2013110%' },
  { tier: 3, label: 'Contributor', floor: 75, ceiling: 90, ratePerCase: 2.60, range: '75\u201390%' },
  { tier: 4, label: 'Developing', floor: 0, ceiling: 75, ratePerCase: 2.00, range: '<75%' },
];

const HOMETOWNS_LIST = HOMETOWNS.map(h => ({ id: h.id, name: h.name }));

const ACTIVE_BONUSES = [
  { name: 'Q1 Volume Kicker', description: 'Extra $0.40/case for \u2265100% attainment', threshold: 1.00 },
  { name: 'Import Push Bonus', description: '$500 for unlocking Import gate + 5% over', threshold: 0.80 },
  { name: 'Spirits Adder', description: '$25/new spirits account in quarter', threshold: null },
];

// Build rep rewards data from SELLERS
const REP_REWARDS = SELLERS.map(seller => {
  const baseSalary = 52000;
  const variableTarget = 18000;
  const attPct = seller.attainment;
  const tierLevel = seller.tier;
  const casesQTD = Math.round(800 + attPct * 400 + Math.sin(seller.id.charCodeAt(0)) * 120);
  const ratePerCase = RATE_SCHEDULE.find(r => tierLevel === r.tier)?.ratePerCase ?? 2.00;
  const commissionEarned = Math.round(casesQTD * ratePerCase);
  const variableEarned = Math.round(variableTarget * Math.min(attPct / 1.0, 1.3));
  const bonusEarned = seller.spiritsAccounts >= 3 ? seller.spiritsAccounts * 25 : 0;
  const status = attPct >= 1.0 ? 'above' : attPct >= 0.85 ? 'at-risk' : 'below';

  return {
    ...seller,
    baseSalary,
    variableTarget,
    variableEarned,
    commissionEarned,
    bonusEarned,
    casesQTD,
    ratePerCase,
    status,
    attPct,
  };
});

const HOMETOWN_ROLLUP = HOMETOWNS_LIST.map(ht => {
  const reps = REP_REWARDS.filter(r => r.hometown === ht.id);
  const totalComm = reps.reduce((s, r) => s + r.commissionEarned, 0);
  const avgRate = reps.length > 0 ? reps.reduce((s, r) => s + r.ratePerCase, 0) / reps.length : 0;
  const top = [...reps].sort((a, b) => b.commissionEarned - a.commissionEarned)[0];
  return { ...ht, reps: reps.length, totalComm, avgRate, topEarner: top?.name ?? '\u2014', topAmount: top?.commissionEarned ?? 0 };
});

const STATUS_CFG = {
  above: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'ABOVE' },
  'at-risk': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'AT RISK' },
  below: { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'BELOW' },
};

/* ── Presidents Club tiers ──────────────────────── */
const CLUB_TIERS = [
  {
    name: 'Diamond Club',
    threshold: 120,
    color: DIAMOND,
    gradient: 'linear-gradient(135deg, #9F7AEA, #7C3AED, #6D28D9)',
    glow: '0 0 30px rgba(159,122,234,0.3)',
    icon: '\u2666',
    perks: ['Cancun Trip + Guest', '$5,000 Cash Bonus', 'Diamond Rolex', 'Reserved Parking 1yr'],
  },
  {
    name: 'Platinum Club',
    threshold: 110,
    color: PLATINUM,
    gradient: 'linear-gradient(135deg, #B8C5D6, #94A3B8, #64748B)',
    glow: '0 0 25px rgba(184,197,214,0.3)',
    icon: '\u2605',
    perks: ['Nashville Weekend', '$2,500 Gift Card', 'Platinum Watch', 'Priority Route Selection'],
  },
  {
    name: 'Gold Club',
    threshold: 100,
    color: GOLD,
    gradient: 'linear-gradient(135deg, #C6A052, #D4AF37, #B8860B)',
    glow: '0 0 20px rgba(198,160,82,0.25)',
    icon: '\u2606',
    perks: ['Dinner for Two', '$500 Gift Card', 'Gold Pin', 'Early Schedule Access'],
  },
];

/* ── Sparkle Effect ─────────────────────────────── */
function SparkleEffect({ color, count = 6 }: { color: string; count?: number }) {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
    setSparkles(items);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map(s => (
        <div key={s.id} className="absolute rounded-full" style={{
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
          background: color,
          opacity: 0.6,
          animation: `sparkle-pulse 2s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes sparkle-pulse {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.8; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ── Leaderboard Rank Badge ─────────────────────── */
function RankBadge({ rank }: { rank: number }) {
  const config = rank === 1
    ? { bg: 'linear-gradient(135deg, #C6A052, #D4AF37)', color: '#FFF', label: '1st', glow: '0 0 12px rgba(198,160,82,0.4)' }
    : rank === 2
    ? { bg: 'linear-gradient(135deg, #B8C5D6, #94A3B8)', color: '#FFF', label: '2nd', glow: '0 0 10px rgba(184,197,214,0.3)' }
    : rank === 3
    ? { bg: 'linear-gradient(135deg, #CD7F32, #B87333)', color: '#FFF', label: '3rd', glow: '0 0 10px rgba(205,127,50,0.3)' }
    : { bg: 'var(--pl-card-alt)', color: 'var(--pl-text-muted)', label: `${rank}`, glow: 'none' };

  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
      style={{ background: config.bg, color: config.color, boxShadow: config.glow }}>
      {config.label}
    </div>
  );
}

/* ── Progress Journey ───────────────────────────── */
function QualificationJourney({ attPct }: { attPct: number }) {
  const milestones = [
    { pct: 75, label: 'Base', color: '#94A3B8' },
    { pct: 100, label: 'Gold', color: GOLD },
    { pct: 110, label: 'Platinum', color: PLATINUM },
    { pct: 120, label: 'Diamond', color: DIAMOND },
  ];
  const progress = Math.min((attPct / 1.3) * 100, 100); // scale to 130% max

  return (
    <div className="relative mt-2">
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
        <div className="h-full rounded-full" style={{
          width: `${progress}%`,
          background: attPct >= 1.2 ? `linear-gradient(to right, ${GOLD}, ${PLATINUM}, ${DIAMOND})`
            : attPct >= 1.1 ? `linear-gradient(to right, ${GOLD}, ${PLATINUM})`
            : attPct >= 1.0 ? `linear-gradient(to right, #22C55E, ${GOLD})`
            : 'var(--pl-text-faint)',
          transition: 'width 1s ease',
        }} />
      </div>
      <div className="flex justify-between mt-1">
        {milestones.map(m => (
          <div key={m.pct} className="flex flex-col items-center" style={{ width: 40 }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{
              background: attPct * 100 >= m.pct ? m.color : 'var(--pl-border)',
              boxShadow: attPct * 100 >= m.pct ? `0 0 6px ${m.color}40` : 'none',
            }} />
            <span className="text-xs font-mono mt-0.5" style={{
              color: attPct * 100 >= m.pct ? m.color : 'var(--pl-text-faint)',
            }}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────  */
export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'club' | 'variable' | 'commission' | 'bonus'>('club');
  const [hometownFilter, setHometownFilter] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const tabs = [
    { key: 'club', label: 'Presidents Club' },
    { key: 'variable', label: 'Variable Pay' },
    { key: 'commission', label: 'Commission' },
    { key: 'bonus', label: 'Bonus' },
  ] as const;

  const filteredReps = hometownFilter
    ? REP_REWARDS.filter(r => r.hometown === hometownFilter)
    : REP_REWARDS;

  const sorted = [...filteredReps].sort((a, b) => b.attPct - a.attPct);

  const aboveCount = REP_REWARDS.filter(r => r.status === 'above').length;
  const belowCount = REP_REWARDS.filter(r => r.status === 'below').length;
  const totalVariable = REP_REWARDS.reduce((s, r) => s + r.variableEarned, 0);
  const avgRatio = REP_REWARDS.reduce((s, r) => s + r.variableEarned / r.variableTarget, 0) / REP_REWARDS.length;

  // Presidents Club qualifiers
  const leaderboard = [...REP_REWARDS].sort((a, b) => b.attPct - a.attPct);
  const diamondQualifiers = leaderboard.filter(r => r.attPct >= 1.20);
  const platinumQualifiers = leaderboard.filter(r => r.attPct >= 1.10 && r.attPct < 1.20);
  const goldQualifiers = leaderboard.filter(r => r.attPct >= 1.00 && r.attPct < 1.10);

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Hero Section */}
      <div className="rounded-xl overflow-hidden mb-6 relative" style={{
        background: `linear-gradient(135deg, rgba(198,160,82,0.12), rgba(159,122,234,0.08), rgba(184,197,214,0.06))`,
        border: '1px solid rgba(198,160,82,0.25)',
      }}>
        <SparkleEffect color={GOLD} count={8} />
        <div className="relative z-10 p-6 text-center">
          <div className="text-4xl mb-2">{'\u2606'}</div>
          <div className="text-xs tracking-[4px] uppercase font-mono mb-2" style={{ color: GOLD }}>
            Lone Star Distribution
          </div>
          <h1 className="text-2xl font-extrabold mb-1" style={{
            color: 'var(--pl-text)',
            fontFamily: 'var(--pl-font)',
          }}>
            Presidents Club & Rewards
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
            {diamondQualifiers.length + platinumQualifiers.length + goldQualifiers.length} qualifiers across 3 tiers &middot; Celebrating top performers
          </p>
          <div className="flex justify-center gap-6 mt-4">
            {[
              { label: 'Diamond', count: diamondQualifiers.length, color: DIAMOND },
              { label: 'Platinum', count: platinumQualifiers.length, color: PLATINUM },
              { label: 'Gold', count: goldQualifiers.length, color: GOLD },
            ].map(t => (
              <div key={t.label} className="text-center">
                <div className="text-[24px] font-bold font-mono" style={{ color: t.color }}>{t.count}</div>
                <div className="text-xs font-mono uppercase tracking-wider" style={{ color: t.color }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-0 border-b mb-6" style={{ borderColor: 'var(--pl-border)' }}>
        {tabs.map(t => {
          const isClub = t.key === 'club';
          const tabColor = isClub ? GOLD : '#0EA5E9';
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider transition-colors"
              style={{
                color: activeTab === t.key ? tabColor : 'var(--pl-text-muted)',
                borderBottom: activeTab === t.key ? `2px solid ${tabColor}` : '2px solid transparent',
                marginBottom: -1,
                background: 'transparent',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Presidents Club Tab */}
      {activeTab === 'club' && (
        <>
          {/* Tier Cards with gradients and glow */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {CLUB_TIERS.map(tier => {
              const qualifiers = leaderboard.filter(r => {
                const pct = r.attPct * 100;
                if (tier.threshold === 120) return pct >= 120;
                if (tier.threshold === 110) return pct >= 110 && pct < 120;
                return pct >= 100 && pct < 110;
              });
              return (
                <div key={tier.name} className="rounded-xl overflow-hidden relative" style={{
                  border: `1px solid ${tier.color}40`,
                  boxShadow: tier.glow,
                }}>
                  <SparkleEffect color={tier.color} count={5} />
                  {/* Gradient header */}
                  <div className="p-4 text-center relative z-10" style={{ background: tier.gradient }}>
                    <div className="text-2xl mb-1">{tier.icon}</div>
                    <div className="text-sm font-bold font-mono text-white">{tier.name}</div>
                    <div className="text-xs font-mono text-white/80">{tier.threshold}%+ Attainment</div>
                  </div>
                  {/* Body */}
                  <div className="p-4 relative z-10" style={{ background: `${tier.color}08` }}>
                    <div className="text-center mb-3">
                      <div className="text-[32px] font-bold font-mono" style={{ color: tier.color }}>
                        {qualifiers.length}
                      </div>
                      <div className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--pl-text-muted)' }}>
                        Qualifiers
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {qualifiers.slice(0, 4).map(q => (
                        <div key={q.id} className="flex items-center justify-between text-xs font-mono px-2 py-1 rounded"
                          style={{ background: `${tier.color}10` }}>
                          <span style={{ color: 'var(--pl-text)' }}>{q.name}</span>
                          <span className="font-bold" style={{ color: tier.color }}>{(q.attPct * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                      {qualifiers.length > 4 && (
                        <div className="text-center text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>
                          +{qualifiers.length - 4} more
                        </div>
                      )}
                    </div>
                    {/* Perks */}
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: `${tier.color}20` }}>
                      <div className="text-xs font-mono font-bold uppercase tracking-wider mb-1.5" style={{ color: tier.color }}>
                        Rewards
                      </div>
                      {tier.perks.map(perk => (
                        <div key={perk} className="text-xs font-mono flex items-center gap-1.5 py-0.5" style={{ color: 'var(--pl-text-muted)' }}>
                          <span style={{ color: tier.color }}>{'\u2713'}</span> {perk}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Leaderboard */}
          <LightSectionCard title="PRESIDENTS CLUB LEADERBOARD">
            <div className="space-y-2">
              {leaderboard.slice(0, 15).map((rep, idx) => {
                const rank = idx + 1;
                const clubTier = rep.attPct >= 1.20 ? CLUB_TIERS[0]
                  : rep.attPct >= 1.10 ? CLUB_TIERS[1]
                  : rep.attPct >= 1.00 ? CLUB_TIERS[2]
                  : null;
                return (
                  <div key={rep.id} className="flex items-center gap-3 p-3 rounded-lg transition-all"
                    style={{
                      background: clubTier ? `${clubTier.color}06` : 'var(--pl-card-alt)',
                      border: `1px solid ${clubTier ? clubTier.color + '20' : 'var(--pl-border)'}`,
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateX(0)' : 'translateX(-12px)',
                      transition: `all 0.3s ease ${idx * 40}ms`,
                    }}>
                    <RankBadge rank={rank} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{rep.name}</span>
                        {clubTier && (
                          <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded-full"
                            style={{ background: clubTier.color + '20', color: clubTier.color }}>
                            {clubTier.name.replace(' Club', '')}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>
                        Route {rep.routeId} &middot; {rep.casesQTD.toLocaleString()} cases
                      </div>
                      <QualificationJourney attPct={rep.attPct} />
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold font-mono" style={{
                        color: clubTier?.color ?? 'var(--pl-text-muted)',
                      }}>
                        {(rep.attPct * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>attainment</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Variable Pay Tab */}
      {activeTab === 'variable' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Total Variable Paid (QTD)" value={`$${(totalVariable / 1000).toFixed(0)}K`} accent={ACCENT} stagger={0} />
            <LightKpiCard label="Avg Payout Ratio" value={`${(avgRatio * 100).toFixed(0)}%`} accent={ACCENT} stagger={1} />
            <LightKpiCard label="Above Target" value={String(aboveCount)} accent={ACCENT} sub="of 36 reps" stagger={2} />
            <LightKpiCard label="Below Target" value={String(belowCount)} accent={ACCENT} stagger={3} />
          </div>

          {/* Hometown Filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => setHometownFilter(null)}
              className="px-3 py-1 rounded text-xs font-bold font-mono uppercase transition-colors"
              style={{
                background: hometownFilter === null ? ACCENT : 'var(--pl-card-alt)',
                color: hometownFilter === null ? 'white' : 'var(--pl-text-muted)',
                border: `1px solid ${hometownFilter === null ? ACCENT : 'var(--pl-border)'}`,
              }}
            >
              All
            </button>
            {HOMETOWNS_LIST.map(ht => (
              <button
                key={ht.id}
                onClick={() => setHometownFilter(ht.id)}
                className="px-3 py-1 rounded text-xs font-bold font-mono uppercase transition-colors"
                style={{
                  background: hometownFilter === ht.id ? ACCENT : 'var(--pl-card-alt)',
                  color: hometownFilter === ht.id ? 'white' : 'var(--pl-text-muted)',
                  border: `1px solid ${hometownFilter === ht.id ? ACCENT : 'var(--pl-border)'}`,
                }}
              >
                {ht.name}
              </button>
            ))}
          </div>

          <LightSectionCard title={`VARIABLE PAY \u2014 ${sorted.length} REPS`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rep', 'Route', 'Base Salary', 'Variable Target', 'Earned', '% of Target', 'Status'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-xs uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(rep => {
                    const ratio = rep.variableEarned / rep.variableTarget;
                    const cfg = STATUS_CFG[rep.status as keyof typeof STATUS_CFG];
                    return (
                      <tr key={rep.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{rep.name}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>{rep.routeId}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>$52,000</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>$18,000</td>
                        <td className="py-1.5 pr-3 font-bold" style={{ color: ACCENT }}>${rep.variableEarned.toLocaleString()}</td>
                        <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text)' }}>{(ratio * 100).toFixed(0)}%</td>
                        <td className="py-1.5">
                          <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                            style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          {/* Distribution */}
          <LightSectionCard title="PAYOUT RATIO DISTRIBUTION">
            <div className="flex gap-3 items-end h-24">
              {[
                { label: '<60%', count: REP_REWARDS.filter(r => r.attPct < 0.60).length, color: '#F87171' },
                { label: '60\u201375%', count: REP_REWARDS.filter(r => r.attPct >= 0.60 && r.attPct < 0.75).length, color: '#F87171' },
                { label: '75\u201390%', count: REP_REWARDS.filter(r => r.attPct >= 0.75 && r.attPct < 0.90).length, color: '#F59E0B' },
                { label: '90\u2013100%', count: REP_REWARDS.filter(r => r.attPct >= 0.90 && r.attPct < 1.00).length, color: '#2563EB' },
                { label: '100\u2013110%', count: REP_REWARDS.filter(r => r.attPct >= 1.00 && r.attPct < 1.10).length, color: '#22C55E' },
                { label: '110%+', count: REP_REWARDS.filter(r => r.attPct >= 1.10).length, color: '#22C55E' },
              ].map(b => {
                const maxCount = 12;
                const pctH = (b.count / maxCount) * 100;
                return (
                  <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs font-mono font-bold" style={{ color: b.color }}>{b.count}</div>
                    <div className="w-full rounded-t" style={{ height: `${pctH}%`, background: `${b.color}60`, minHeight: 4 }} />
                    <div className="text-xs font-mono text-center" style={{ color: 'var(--pl-text-faint)' }}>{b.label}</div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Commission Tab */}
      {activeTab === 'commission' && (
        <>
          <LightSectionCard title="COMMISSION RATE SCHEDULE">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {RATE_SCHEDULE.map(tier => (
                <div key={tier.tier} className="p-4 rounded-lg text-center"
                  style={{ background: `${TIER_COLORS[tier.tier]}12`, border: `1px solid ${TIER_COLORS[tier.tier]}30` }}>
                  <div className="text-xs font-bold font-mono uppercase mb-1" style={{ color: TIER_COLORS[tier.tier] }}>
                    T{tier.tier} \u2014 {tier.label}
                  </div>
                  <div className="text-2xl font-bold font-mono mb-1" style={{ color: TIER_COLORS[tier.tier] }}>
                    ${tier.ratePerCase.toFixed(2)}
                  </div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>per case</div>
                  <div className="text-xs font-mono mt-2" style={{ color: 'var(--pl-text-muted)' }}>
                    Attainment: {tier.range}
                  </div>
                </div>
              ))}
            </div>
          </LightSectionCard>

          <LightSectionCard title="REP COMMISSION \u2014 QTD">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rep', 'Tier', 'Volume (Cases)', 'Rate/Case', 'Commission', 'QTD Total'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-xs uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...REP_REWARDS].sort((a, b) => b.commissionEarned - a.commissionEarned).map(rep => (
                    <tr key={rep.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                      <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{rep.name}</td>
                      <td className="py-1.5 pr-3">
                        <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                          style={{ background: `${TIER_COLORS[rep.tier]}18`, color: TIER_COLORS[rep.tier] }}>
                          T{rep.tier} {RATE_SCHEDULE.find(r => r.tier === rep.tier)?.label}
                        </span>
                      </td>
                      <td className="py-1.5 pr-3 text-right" style={{ color: 'var(--pl-text)' }}>{rep.casesQTD.toLocaleString()}</td>
                      <td className="py-1.5 pr-3 text-right" style={{ color: 'var(--pl-text-muted)' }}>${rep.ratePerCase.toFixed(2)}</td>
                      <td className="py-1.5 pr-3 font-bold text-right" style={{ color: ACCENT }}>${rep.commissionEarned.toLocaleString()}</td>
                      <td className="py-1.5 font-bold text-right" style={{ color: ACCENT }}>${(rep.commissionEarned + rep.variableEarned).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LightSectionCard>

          <LightSectionCard title="HOMETOWN COMMISSION ROLLUP">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {HOMETOWN_ROLLUP.map(ht => (
                <div key={ht.id} className="p-4 rounded-lg" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                  <div className="text-xs font-bold font-mono uppercase mb-2" style={{ color: 'var(--pl-text)' }}>{ht.name}</div>
                  <div className="text-xl font-bold font-mono" style={{ color: ACCENT }}>${ht.totalComm.toLocaleString()}</div>
                  <div className="text-xs font-mono mb-2" style={{ color: 'var(--pl-text-faint)' }}>total commission &middot; {ht.reps} reps</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>Avg rate: ${ht.avgRate.toFixed(2)}/case</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>Top: {ht.topEarner}</div>
                </div>
              ))}
            </div>
          </LightSectionCard>
        </>
      )}

      {/* Bonus Tab */}
      {activeTab === 'bonus' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <LightKpiCard label="Total Bonus Paid (QTD)" value={`$${REP_REWARDS.reduce((s, r) => s + r.bonusEarned, 0).toLocaleString()}`} accent={ACCENT} stagger={0} />
            <LightKpiCard label="Q1 Kicker Qualifiers" value={String(REP_REWARDS.filter(r => r.attPct >= 1.0).length)} accent={ACCENT} sub="of 36 reps" stagger={1} />
            <LightKpiCard label="Spirits Adder Total" value={`$${REP_REWARDS.reduce((s, r) => s + (r.spiritsAccounts >= 3 ? r.spiritsAccounts * 25 : 0), 0).toLocaleString()}`} accent={ACCENT} stagger={2} />
            <LightKpiCard label="Avg Bonus / Rep" value={`$${Math.round(REP_REWARDS.reduce((s, r) => s + r.bonusEarned, 0) / REP_REWARDS.length).toLocaleString()}`} accent={ACCENT} stagger={3} />
          </div>

          <LightSectionCard title="ACTIVE BONUS PROGRAMS">
            <div className="grid gap-3">
              {ACTIVE_BONUSES.map(bonus => {
                const qualifiers = bonus.threshold
                  ? REP_REWARDS.filter(r => r.attPct >= bonus.threshold!).length
                  : REP_REWARDS.filter(r => r.spiritsAccounts >= 3).length;
                return (
                  <div key={bonus.name} className="flex items-center gap-4 p-3 rounded-lg"
                    style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                    <div className="flex-1">
                      <div className="text-xs font-bold font-mono" style={{ color: 'var(--pl-text)' }}>{bonus.name}</div>
                      <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--pl-text-muted)' }}>{bonus.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono" style={{ color: ACCENT }}>{qualifiers}</div>
                      <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>qualifiers</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </LightSectionCard>

          <LightSectionCard title="BONUS PAYOUT TABLE">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pl-border)' }}>
                    {['Rep', 'Bonus Type', 'Qualification', 'Payout', 'Pay Date'].map(h => (
                      <th key={h} className="text-left pb-2 pr-3 text-xs uppercase tracking-wider font-bold"
                        style={{ color: 'var(--pl-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REP_REWARDS.filter(r => r.attPct >= 1.0 || r.spiritsAccounts >= 3).map(rep => (
                    <tr key={rep.id} style={{ borderBottom: '1px solid var(--pl-border-faint)' }}>
                      <td className="py-1.5 pr-3 font-bold" style={{ color: 'var(--pl-text)' }}>{rep.name}</td>
                      <td className="py-1.5 pr-3" style={{ color: 'var(--pl-text-muted)' }}>
                        {rep.attPct >= 1.0 ? 'Q1 Volume Kicker' : 'Spirits Adder'}
                      </td>
                      <td className="py-1.5 pr-3">
                        <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                          style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>EARNED</span>
                      </td>
                      <td className="py-1.5 pr-3 font-bold" style={{ color: ACCENT }}>
                        ${rep.bonusEarned > 0 ? rep.bonusEarned.toLocaleString() : Math.round(rep.casesQTD * 0.40).toLocaleString()}
                      </td>
                      <td className="py-1.5" style={{ color: 'var(--pl-text-muted)' }}>Mar 28</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LightSectionCard>
        </>
      )}
    </>
  );
}
