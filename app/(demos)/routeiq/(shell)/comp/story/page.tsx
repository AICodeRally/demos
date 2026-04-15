const WEEKS = [
  { week: 1,  cases: 42, cumulative: 42, attain: 3,   earned: 525,   event: null },
  { week: 2,  cases: 51, cumulative: 93, attain: 6,   earned: 1163,  event: null },
  { week: 3,  cases: 64, cumulative: 157, attain: 10, earned: 1963,  event: null },
  { week: 4,  cases: 58, cumulative: 215, attain: 14, earned: 2688,  event: null },
  { week: 5,  cases: 71, cumulative: 286, attain: 19, earned: 3575,  event: 'Spirits kicker activates' },
  { week: 6,  cases: 83, cumulative: 369, attain: 25, earned: 4613,  event: null },
  { week: 7,  cases: 79, cumulative: 448, attain: 30, earned: 5600,  event: null },
  { week: 8,  cases: 92, cumulative: 540, attain: 36, earned: 7200,  event: 'Tier 2 unlock (500 cases)' },
  { week: 9,  cases: 87, cumulative: 627, attain: 42, earned: 9155,  event: null },
  { week: 10, cases: 95, cumulative: 722, attain: 48, earned: 11330, event: null },
  { week: 11, cases: 101, cumulative: 823, attain: 55, earned: 13788, event: null },
  { week: 12, cases: 98, cumulative: 921, attain: 61, earned: 16178, event: null },
  { week: 13, cases: 115, cumulative: 1036, attain: 69, earned: 19055, event: 'Tier 3 unlock (1000 cases)' },
];

const MAX_EARN = Math.max(...WEEKS.map((w) => w.earned));

export default function CompStoryPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6 md:p-8">
      <header className="flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--rq-amber)' }}>§ 5b · 13-Week Earnings Story</div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--rq-text)' }}>
          Marcus Reyes · KC-01 · Q2 2026
        </h1>
        <p className="max-w-3xl text-base" style={{ color: 'var(--rq-text-muted)' }}>
          Marcus is in his 3rd year as a route rep. He starts the quarter at 1,500 cases of annual quota, needs to hit 1,500+ for tier 3, and the spirits kicker turns on at week 5 if he&rsquo;s on track. Here&rsquo;s what the quarter looks like.
        </p>
      </header>

      <div className="rounded-xl border p-5" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
        <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--rq-text)' }}>Cumulative earnings curve</h2>
        <div className="flex items-end gap-2 h-48">
          {WEEKS.map((w) => {
            const pct = (w.earned / MAX_EARN) * 100;
            return (
              <div key={w.week} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    background: w.event ? 'var(--rq-amber)' : 'var(--rq-indigo)',
                    height: `${pct}%`,
                    minHeight: 4,
                  }}
                  title={`Week ${w.week}: $${w.earned.toLocaleString()}`}
                />
                <div className="text-[10px]" style={{ color: 'var(--rq-text-faint)' }}>W{w.week}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'var(--rq-text-muted)' }}>
          <span>Quarter start</span>
          <span className="font-mono font-bold" style={{ color: 'var(--rq-amber)' }}>
            Quarter total: ${WEEKS[WEEKS.length - 1].earned.toLocaleString()}
          </span>
          <span>Quarter end</span>
        </div>
      </div>

      <div className="rounded-xl border p-5" style={{ background: 'var(--rq-card)', borderColor: 'var(--rq-border)' }}>
        <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--rq-text)' }}>Week-by-week log</h2>
        <div className="flex flex-col gap-2">
          {WEEKS.map((w) => (
            <div
              key={w.week}
              className="grid grid-cols-5 gap-3 rounded-lg p-3"
              style={{ background: w.event ? 'var(--rq-amber-soft)' : 'var(--rq-card-alt)' }}
            >
              <div className="font-mono text-sm font-bold" style={{ color: 'var(--rq-text)' }}>Week {w.week}</div>
              <div className="font-mono text-sm" style={{ color: 'var(--rq-text-muted)' }}>{w.cases} cases</div>
              <div className="font-mono text-sm" style={{ color: 'var(--rq-text-muted)' }}>{w.cumulative} cumulative</div>
              <div className="font-mono text-sm" style={{ color: 'var(--rq-text-muted)' }}>${w.earned.toLocaleString()}</div>
              <div className="text-sm font-semibold" style={{ color: w.event ? 'var(--rq-amber)' : 'var(--rq-text-faint)' }}>
                {w.event ?? '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border-l-4 p-5" style={{ background: 'var(--rq-amber-soft)', borderLeftColor: 'var(--rq-amber)' }}>
        <h3 className="text-lg font-bold" style={{ color: 'var(--rq-text)' }}>The moment the plan decided</h3>
        <p className="mt-2 text-sm" style={{ color: 'var(--rq-text-secondary)' }}>
          Week 5. The spirits kicker activated at 19% attainment because Marcus was on pace. That kicker was the single biggest lever in the whole quarter — it put him on a trajectory to hit tier 3 in week 13 instead of stranding him in tier 2. Without the week-5 unlock, his Q2 earnings would have been <span className="font-mono font-bold">${(19055 * 0.72).toFixed(0)}</span> instead of <span className="font-mono font-bold">$19,055</span>. That&rsquo;s the difference between him staying and leaving.
        </p>
      </div>
    </main>
  );
}
