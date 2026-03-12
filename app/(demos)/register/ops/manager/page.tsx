'use client';

import Link from 'next/link';
import { ChevronRight, Tablet } from 'lucide-react';
import { StatCard, BarChart, AreaChart, KanbanBoard } from '@/components/demos/register';
import { REPS } from '@/data/register/coaching-data';

/* ── Rep performance data ────────────────────────────────── */

const REP_PERFORMANCE = [
  { label: 'Sarah J.', value: 18.4, color: '#10B981' },
  { label: 'Marcus W.', value: 16.2, color: '#1E3A5F' },
  { label: 'Diana K.', value: 14.8, color: '#1E3A5F' },
  { label: 'Emily R.', value: 12.6, color: '#1E3A5F' },
  { label: 'James T.', value: 11.2, color: '#1E3A5F' },
  { label: 'Raj P.', value: 9.8, color: '#1E3A5F' },
];

/* ── Kanban task board ───────────────────────────────────── */

const KANBAN_COLUMNS = [
  {
    title: 'Morning Tasks',
    color: '#06B6D4',
    cards: [
      { title: 'Floor walk & display check', assignee: 'Manager', priority: 'medium' as const },
      { title: 'Review overnight web leads', assignee: 'Manager', priority: 'high' as const },
    ],
  },
  {
    title: 'In Progress',
    color: '#F59E0B',
    cards: [
      { title: 'Purple endcap refresh', assignee: 'Raj P.', priority: 'medium' as const },
      { title: 'New hire training \u2014 Casey', assignee: 'Sarah J.', priority: 'high' as const },
      { title: 'Finance approval backlog', assignee: 'Manager', priority: 'critical' as const },
    ],
  },
  {
    title: 'Blocked',
    color: '#EF4444',
    cards: [
      { title: 'Sealy display model replacement', assignee: 'Vendor', priority: 'critical' as const },
      { title: 'POS terminal #3 repair', assignee: 'IT Support', priority: 'high' as const },
    ],
  },
  {
    title: 'Done',
    color: '#10B981',
    cards: [
      { title: 'Morning team huddle', assignee: 'Manager', priority: 'low' as const },
      { title: 'Restock bedding wall', assignee: 'Raj P.', priority: 'medium' as const },
      { title: 'Update promo signage', assignee: 'Emily R.', priority: 'low' as const },
    ],
  },
];

/* ── Hourly revenue vs target ────────────────────────────── */

const HOURLY_ACTUAL = [
  { label: '8AM', value: 1.2 }, { label: '9AM', value: 3.8 }, { label: '10AM', value: 7.4 },
  { label: '11AM', value: 12.2 }, { label: '12PM', value: 9.6 }, { label: '1PM', value: 8.4 },
  { label: '2PM', value: 10.8 }, { label: '3PM', value: 13.1 }, { label: '4PM', value: 11.2 },
  { label: '5PM', value: 9.4 }, { label: '6PM', value: 7.8 }, { label: '7PM', value: 5.6 },
  { label: '8PM', value: 3.2 },
];

const HOURLY_TARGET = [
  { label: '8AM', value: 2.0 }, { label: '9AM', value: 4.5 }, { label: '10AM', value: 8.0 },
  { label: '11AM', value: 11.0 }, { label: '12PM', value: 9.0 }, { label: '1PM', value: 8.5 },
  { label: '2PM', value: 10.0 }, { label: '3PM', value: 12.0 }, { label: '4PM', value: 11.0 },
  { label: '5PM', value: 9.0 }, { label: '6PM', value: 8.0 }, { label: '7PM', value: 6.0 },
  { label: '8PM', value: 4.0 },
];

/* ── Exception alerts ────────────────────────────────────── */

const EXCEPTIONS = [
  { message: 'Financing system timeout \u2014 3 pending approvals', detail: 'Last response: 4min 22s ago. Avg wait: 3min.', color: '#EF4444', bg: '#FEE2E2' },
  { message: 'Display model damaged \u2014 King Purple Hybrid', detail: 'Coil exposed at footboard edge. Pulled from floor 1hr ago.', color: '#F59E0B', bg: '#FEF3C7' },
  { message: 'Rep tardiness: Mike L. \u2014 45min late, no call', detail: 'Scheduled 10AM. Not checked in. Pattern: 3rd time this month.', color: '#EF4444', bg: '#FEE2E2' },
];

/* ── Coaching queue ──────────────────────────────────────── */

const COACHING = [
  {
    rep: 'Casey (new hire)',
    repId: 'casey',
    area: 'Attach rate 12%',
    benchmark: 'store avg 42%',
    action: 'Shadow Sarah J. for next 3 sales',
    color: '#EF4444',
  },
  {
    rep: 'Raj P.',
    repId: 'raj',
    area: 'Financing pitch 28%',
    benchmark: 'store avg 55%',
    action: 'Practice 3-payment breakdown script',
    color: '#F59E0B',
  },
  {
    rep: 'James T.',
    repId: 'james',
    area: 'ASP $1,420',
    benchmark: 'store avg $1,893',
    action: 'Focus on premium tier during next ups',
    color: '#F59E0B',
  },
];

export default function ManagerConsole() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Manager Console</h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          Real-time shift management, team performance, and operational exceptions
        </p>
      </div>

      {/* Shift Summary Card */}
      <div className="rounded-xl bg-white border p-5 mb-6" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Today&apos;s Shift</span>
              <p className="text-sm font-bold" style={{ color: '#0F172A' }}>10:00 AM &ndash; 8:00 PM</p>
            </div>
            <div className="h-8 w-px" style={{ backgroundColor: '#E2E8F0' }} />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Reps on Floor</span>
              <p className="text-sm font-bold" style={{ color: '#10B981' }}>6 / 8</p>
            </div>
            <div className="h-8 w-px" style={{ backgroundColor: '#E2E8F0' }} />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Scheduled</span>
              <p className="text-sm font-bold" style={{ color: '#0F172A' }}>8</p>
            </div>
            <div className="h-8 w-px" style={{ backgroundColor: '#E2E8F0' }} />
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Call-outs</span>
              <p className="text-sm font-bold" style={{ color: '#EF4444' }}>2</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>Absent</span>
            <p className="text-[12px] font-medium" style={{ color: '#EF4444' }}>Mike L., Pat R.</p>
          </div>
        </div>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="relative">
          <StatCard label="Today's Revenue" value="$89K" color="#1E3A5F" />
          <span
            className="absolute top-3 right-3 text-[10px] font-mono"
            style={{ color: '#EF4444' }}
          >
            vs $95K target (-$6K)
          </span>
        </div>
        <StatCard label="Transactions" value="47" trend="up" trendValue="+8 vs yesterday" color="#06B6D4" />
        <StatCard label="Team Avg ASP" value="$1,893" trend="up" trendValue="+$42" color="#8B5CF6" />
        <StatCard label="Comp Earned Today" value="$2,847" sparkline={[180, 220, 260, 310, 360, 420, 480, 540]} color="#10B981" />
      </div>

      {/* Rep Performance + Hourly Revenue */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Rep Performance Today ($K)
          </p>
          <BarChart data={REP_PERFORMANCE} unit="K" />
          <div className="mt-3 pt-2 border-t text-center" style={{ borderColor: '#F1F5F9' }}>
            <span className="text-[10px]" style={{ color: '#94A3B8' }}>
              Top performer:{' '}
              <span className="font-bold" style={{ color: '#10B981' }}>Sarah J.</span>{' '}
              &mdash; $18.4K (194% of daily target)
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
            Hourly Revenue vs Target ($K)
          </p>
          <div className="relative">
            <AreaChart data={HOURLY_ACTUAL} color="#1E3A5F" />
            {/* Overlay target line indicator */}
            <div className="absolute top-0 right-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 rounded" style={{ backgroundColor: '#1E3A5F' }} />
                  <span className="text-[10px]" style={{ color: '#475569' }}>Actual</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-0.5 rounded border-b border-dashed" style={{ borderColor: '#94A3B8' }} />
                  <span className="text-[10px]" style={{ color: '#475569' }}>Target</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[10px] font-mono" style={{ color: '#F59E0B' }}>
              Pacing: 93.7% of daily target &mdash; need $6K in remaining 3hrs
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Shift Task Board
        </p>
        <KanbanBoard columns={KANBAN_COLUMNS} />
      </div>

      {/* Exception Alerts */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {EXCEPTIONS.map((ex, i) => (
          <div
            key={i}
            className="rounded-xl border p-4"
            style={{ backgroundColor: ex.bg, borderColor: `${ex.color}30` }}
          >
            <div className="flex items-start gap-2 mb-2">
              <span
                className="shrink-0 w-2 h-2 rounded-full mt-1"
                style={{ backgroundColor: ex.color }}
              />
              <p className="text-[12px] font-semibold leading-tight" style={{ color: ex.color }}>
                {ex.message}
              </p>
            </div>
            <p className="text-[11px] ml-4" style={{ color: '#475569' }}>
              {ex.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Coaching Queue */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>
          Coaching Queue
        </p>
        <div className="grid grid-cols-3 gap-4">
          {COACHING.map((coach, i) => {
            const rep = REPS.find((r) => r.id === coach.repId);
            return (
              <div key={i} className="relative group">
                <Link
                  href={`/register/ops/manager/coaching/${coach.repId}`}
                  className="block rounded-lg border-l-4 p-4 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
                  style={{ borderLeftColor: coach.color, backgroundColor: '#F8FAFC' }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: '#0F172A' }}>
                        {coach.rep}
                      </p>
                      {rep && (
                        <p className="text-[10px]" style={{ color: '#94A3B8' }}>
                          {rep.role}
                        </p>
                      )}
                    </div>
                    <ChevronRight
                      className="w-4 h-4 shrink-0 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity"
                      style={{ color: coach.color }}
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono" style={{ color: coach.color }}>
                      {coach.area}
                    </span>
                    <span className="text-[10px]" style={{ color: '#94A3B8' }}>
                      ({coach.benchmark})
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[10px] font-medium shrink-0 mt-px" style={{ color: '#10B981' }}>Action:</span>
                    <p className="text-[11px]" style={{ color: '#475569' }}>
                      {coach.action}
                    </p>
                  </div>
                </Link>
                <a
                  href={`/register/ops/manager/coaching/${coach.repId}?view=ipad`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open on iPad"
                  className="absolute top-2 right-8 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{ backgroundColor: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Tablet className="w-3 h-3" />
                  iPad
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
