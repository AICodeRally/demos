'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';

const REPS = [
  { id: 'r1', name: 'Marcus Reyes', dc: 'KC-01', baseAttain: 84, quarterly: 285000 },
  { id: 'r2', name: 'Jenna Walsh', dc: 'KC-02', baseAttain: 112, quarterly: 312000 },
  { id: 'r3', name: 'Diego Ramirez', dc: 'WIC-01', baseAttain: 68, quarterly: 245000 },
  { id: 'r4', name: 'Priya Chen', dc: 'OMA-01', baseAttain: 96, quarterly: 302000 },
  { id: 'r5', name: 'Tyler Brooks', dc: 'DSM-01', baseAttain: 78, quarterly: 268000 },
  { id: 'r6', name: 'Amara Okoye', dc: 'LR-01', baseAttain: 58, quarterly: 232000 },
];

const BASE_RATE = 0.05;
const OLD_ACCEL_TRIGGER = 100;
const OLD_ACCEL_MULT = 1.5;

function computePayout(revenue: number, quota: number, accelTrigger: number, accelMult: number) {
  const attainPct = (revenue / quota) * 100;
  let rate = BASE_RATE;
  if (attainPct >= accelTrigger) rate *= accelMult;
  const payout = revenue * rate;
  return { attainPct, rate, payout };
}

export default function CompCalculatorPage() {
  const [repId, setRepId] = useState(REPS[0].id);
  const [accelTrigger, setAccelTrigger] = useState(OLD_ACCEL_TRIGGER);
  const [accelMult, setAccelMult] = useState(OLD_ACCEL_MULT);

  const rep = REPS.find((r) => r.id === repId) ?? REPS[0];
  const revenue = rep.quarterly;
  const quota = rep.quarterly / (rep.baseAttain / 100);

  const current = computePayout(revenue, quota, accelTrigger, accelMult);
  const baseline = computePayout(revenue, quota, OLD_ACCEL_TRIGGER, OLD_ACCEL_MULT);
  const delta = current.payout - baseline.payout;

  const teamTotal = REPS.reduce((sum, r) => {
    const q = r.quarterly / (r.baseAttain / 100);
    return sum + computePayout(r.quarterly, q, accelTrigger, accelMult).payout;
  }, 0);
  const teamBaseline = REPS.reduce((sum, r) => {
    const q = r.quarterly / (r.baseAttain / 100);
    return sum + computePayout(r.quarterly, q, OLD_ACCEL_TRIGGER, OLD_ACCEL_MULT).payout;
  }, 0);
  const teamDelta = teamTotal - teamBaseline;

  const fmt = (n: number) => '$' + Math.round(n).toLocaleString();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>
          <Calculator className="h-4 w-4" />
          § 5a · Payout Calculator
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--rq-text)' }}>Interactive comp plan — rebuild live</h1>
        <p className="text-base" style={{ color: 'var(--rq-text-muted)' }}>
          Drag the accelerator trigger down and watch what happens. The baseline is the current plan (trigger 100%, 1.5× mult). Delta shows what changes.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border p-5" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--rq-text)' }}>Plan parameters</h2>

          <div className="flex flex-col gap-2">
            <label className="flex justify-between text-sm" style={{ color: 'var(--rq-text-muted)' }}>
              <span>Rep</span>
              <span className="font-mono" style={{ color: 'var(--rq-text)' }}>{rep.dc}</span>
            </label>
            <select
              value={repId}
              onChange={(e) => setRepId(e.target.value)}
              className="rounded-lg border px-3 py-2 font-mono text-sm"
              style={{ background: 'var(--rq-card-alt)', borderColor: 'var(--rq-border)', color: 'var(--rq-text)' }}
            >
              {REPS.map((r) => (
                <option key={r.id} value={r.id}>{r.name} ({r.dc}) — {r.baseAttain}% attain</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex justify-between text-sm" style={{ color: 'var(--rq-text-muted)' }}>
              <span>Accelerator trigger (% attainment)</span>
              <span className="font-mono font-bold" style={{ color: 'var(--rq-amber)' }}>{accelTrigger}%</span>
            </label>
            <input
              type="range"
              min={70}
              max={120}
              step={5}
              value={accelTrigger}
              onChange={(e) => setAccelTrigger(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--rq-amber)' }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex justify-between text-sm" style={{ color: 'var(--rq-text-muted)' }}>
              <span>Accelerator multiplier</span>
              <span className="font-mono font-bold" style={{ color: 'var(--rq-amber)' }}>{accelMult}×</span>
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.25}
              value={accelMult}
              onChange={(e) => setAccelMult(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--rq-amber)' }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border p-5" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--rq-text)' }}>{rep.name}&rsquo;s payout</h2>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg p-3" style={{ background: 'var(--rq-card-alt)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>Revenue</div>
              <div className="font-mono text-lg font-bold" style={{ color: 'var(--rq-text)' }}>{fmt(revenue)}</div>
            </div>
            <div className="rounded-lg p-3" style={{ background: 'var(--rq-card-alt)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>Attainment</div>
              <div className="font-mono text-lg font-bold" style={{ color: 'var(--rq-text)' }}>{current.attainPct.toFixed(0)}%</div>
            </div>
            <div className="rounded-lg p-3" style={{ background: 'var(--rq-card-alt)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>Rate</div>
              <div className="font-mono text-lg font-bold" style={{ color: 'var(--rq-text)' }}>{(current.rate * 100).toFixed(1)}%</div>
            </div>
          </div>

          <div className="rounded-lg border-l-4 p-4" style={{ background: 'var(--rq-amber-soft)', borderLeftColor: 'var(--rq-amber)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>Payout under this plan</div>
            <div className="mt-1 font-mono text-3xl font-bold" style={{ color: 'var(--rq-text)' }}>{fmt(current.payout)}</div>
            <div className="mt-1 font-mono text-sm font-semibold" style={{ color: delta >= 0 ? '#059669' : '#DC2626' }}>
              Δ {delta >= 0 ? '+' : ''}{fmt(delta)} vs baseline
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-5" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
        <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--rq-text)' }}>Team-wide impact (all 6 sample reps)</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>Baseline payout</div>
            <div className="font-mono text-2xl font-bold" style={{ color: 'var(--rq-text)' }}>{fmt(teamBaseline)}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>New plan payout</div>
            <div className="font-mono text-2xl font-bold" style={{ color: 'var(--rq-text)' }}>{fmt(teamTotal)}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--rq-text-faint)' }}>Delta</div>
            <div className="font-mono text-2xl font-bold" style={{ color: teamDelta >= 0 ? '#059669' : '#DC2626' }}>
              {teamDelta >= 0 ? '+' : ''}{fmt(teamDelta)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
