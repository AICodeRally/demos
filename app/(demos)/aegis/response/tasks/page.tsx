'use client';

import { StatCard, KanbanBoard, AreaChart, DonutChart, ConfidenceBand } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const KANBAN_COLUMNS = [
  {
    title: 'To Do',
    color: '#A8A29E',
    cards: [
      { title: 'Draft customer FAQ', assignee: 'Diana Torres', priority: 'medium' as const, due: 'Mar 4', category: 'Communications' },
      { title: 'Prepare board briefing deck', assignee: 'Sarah Chen', priority: 'high' as const, due: 'Mar 3', category: 'Legal' },
      { title: 'Coordinate press conference', assignee: 'Diana Torres', priority: 'high' as const, due: 'Mar 4', category: 'Communications' },
      { title: 'Review insurance policy terms', assignee: 'Emily Nakamura', priority: 'medium' as const, due: 'Mar 5', category: 'Financial' },
      { title: 'Update incident response wiki', assignee: 'Marcus Webb', priority: 'low' as const, due: 'Mar 7', category: 'Technical' },
    ],
  },
  {
    title: 'In Progress',
    color: '#2563EB',
    cards: [
      { title: 'Complete forensic analysis', assignee: 'Raj Patel', priority: 'critical' as const, due: 'Mar 3', category: 'Technical' },
      { title: 'File SEC Form 8-K', assignee: 'James Park', priority: 'critical' as const, due: 'Mar 5', category: 'Regulatory' },
      { title: 'GDPR DPA notification', assignee: 'Sarah Chen', priority: 'high' as const, due: 'Mar 4', category: 'Regulatory' },
      { title: 'Endpoint hardening phase 2', assignee: 'Marcus Webb', priority: 'high' as const, due: 'Mar 4', category: 'Technical' },
    ],
  },
  {
    title: 'Blocked',
    color: '#DC2626',
    cards: [
      { title: 'Insurance claim submission', assignee: 'Emily Nakamura', priority: 'high' as const, due: 'Mar 7', category: 'Financial' },
      { title: 'Third-party audit scheduling', assignee: 'Marcus Webb', priority: 'medium' as const, category: 'Technical' },
      { title: 'NY SHIELD Act filing', assignee: 'James Park', priority: 'medium' as const, due: 'Apr 30', category: 'Regulatory' },
    ],
  },
  {
    title: 'Done',
    color: '#059669',
    cards: [
      { title: 'Secure evidence vault', assignee: 'Raj Patel', priority: 'critical' as const, category: 'Technical' },
      { title: 'Issue holding statement', assignee: 'Diana Torres', priority: 'high' as const, category: 'Communications' },
      { title: 'Establish privilege umbrella', assignee: 'Sarah Chen', priority: 'critical' as const, category: 'Legal' },
      { title: 'Deploy forensics team', assignee: 'Marcus Webb', priority: 'critical' as const, category: 'Technical' },
      { title: 'CEO statement approved', assignee: 'Diana Torres', priority: 'high' as const, category: 'Communications' },
      { title: 'Customer notification sent', assignee: 'Emily Nakamura', priority: 'high' as const, category: 'Communications' },
    ],
  },
];

const VELOCITY_DATA = [
  { label: 'Day 1', value: 4 },
  { label: 'Day 2', value: 6 },
  { label: 'Day 3', value: 8 },
  { label: 'Day 4', value: 10 },
  { label: 'Day 5', value: 8 },
  { label: 'Day 6', value: 12 },
  { label: 'Day 7', value: 8 },
];

const MEMBER_SEGMENTS = [
  { label: 'Sarah', value: 8, color: '#8B7355' },
  { label: 'Marcus', value: 10, color: '#2563EB' },
  { label: 'Diana', value: 7, color: '#7C3AED' },
  { label: 'James', value: 9, color: '#059669' },
  { label: 'Raj', value: 11, color: '#DC2626' },
  { label: 'Emily', value: 7, color: '#EA580C' },
];

const BLOCKERS = [
  'Insurance claim requires completed forensic report (ETA: Mar 4)',
  'Third-party audit firm has scheduling conflict — next available slot Mar 10',
  'NY SHIELD Act filing depends on final scope determination from forensics',
];

const RESOLUTION_CONFIDENCE = [
  { label: 'Day 12', value: 18, low: 15, high: 21 },
  { label: 'Day 13', value: 18, low: 15, high: 21 },
  { label: 'Day 14', value: 18, low: 15, high: 21 },
  { label: 'Day 15', value: 18, low: 15, high: 21 },
  { label: 'Day 16', value: 18, low: 15, high: 21 },
  { label: 'Day 17', value: 18, low: 16, high: 20 },
  { label: 'Day 18', value: 18, low: 16, high: 20 },
  { label: 'Day 19', value: 18, low: 15, high: 21 },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function TaskBoard() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Task Board</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Response action tracking and team coordination
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tasks" value="52" color="#8B7355" />
        <StatCard label="Completed" value="34" color="#059669" />
        <StatCard label="Blocked" value="3" color="#DC2626" />
        <StatCard label="Velocity" value="8/day" color="#8B7355" />
      </div>

      {/* Kanban Board */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Response Actions</h2>
        <KanbanBoard columns={KANBAN_COLUMNS} />
      </div>

      {/* Two-column: Velocity + Donut */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>Task Velocity</h2>
          <AreaChart data={VELOCITY_DATA} color="#7C3AED" height={160} />
        </div>
        <div className="rounded-xl bg-white border p-5 flex flex-col items-center justify-center" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4 self-start" style={{ color: '#1C1917' }}>Tasks by Team Member</h2>
          <DonutChart segments={MEMBER_SEGMENTS} centerValue="52" centerLabel="Total" />
        </div>
      </div>

      {/* Blocked Items Alert */}
      <div
        className="rounded-xl p-5 mb-8"
        style={{
          backgroundColor: '#FEF2F2',
          border: '2px solid #DC2626',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold" style={{ color: '#DC2626' }}>3 Tasks Blocked</span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: '#DC262615', color: '#DC2626' }}
          >
            Action Required
          </span>
        </div>
        <ul className="space-y-1.5">
          {BLOCKERS.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[11px] mt-0.5" style={{ color: '#DC2626' }}>&bull;</span>
              <span className="text-[12px]" style={{ color: '#57534E' }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Predicted Resolution */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: '#1C1917' }}>Predicted Resolution</h2>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold"
            style={{ backgroundColor: '#7C3AED15', color: '#7C3AED' }}
          >
            March 18 &plusmn; 3 days
          </span>
        </div>
        <ConfidenceBand data={RESOLUTION_CONFIDENCE} color="#7C3AED" height={140} />
      </div>
    </>
  );
}
