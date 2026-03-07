'use client';

import { StatCard, KanbanBoard } from '@/components/demos/wellspring';

/* ── Permit Kanban data ──────────────────────────────── */

const PERMIT_COLUMNS = [
  {
    title: 'Draft',
    color: '#94A3B8',
    cards: [
      {
        title: 'W-2 Permit — Mustang 25-2H',
        assignee: 'J. Hargrove',
        priority: 'medium' as const,
        due: 'Mar 15',
        category: 'Drilling',
      },
      {
        title: 'P-17 Injection — Sidewinder SWD #3',
        assignee: 'M. Chen',
        priority: 'low' as const,
        due: 'Mar 22',
        category: 'Injection',
      },
    ],
  },
  {
    title: 'Submitted',
    color: '#C2A04E',
    cards: [
      {
        title: 'W-2 Permit — PBR Federal 24-2H',
        assignee: 'J. Hargrove',
        priority: 'high' as const,
        due: 'Mar 8',
        category: 'Drilling',
      },
      {
        title: 'W-2 Permit — Rattlesnake 17-2H',
        assignee: 'J. Hargrove',
        priority: 'high' as const,
        due: 'Mar 10',
        category: 'Drilling',
      },
      {
        title: 'H-10 Completion — Copperhead 18-1H',
        assignee: 'R. Vasquez',
        priority: 'medium' as const,
        due: 'Mar 12',
        category: 'Completion',
      },
    ],
  },
  {
    title: 'Approved',
    color: '#059669',
    cards: [
      {
        title: 'W-2 Permit — PBR Federal 24-1H',
        assignee: 'J. Hargrove',
        priority: 'high' as const,
        due: 'Feb 28',
        category: 'Drilling',
      },
      {
        title: 'W-2 Permit — Rattlesnake 17-1H',
        assignee: 'J. Hargrove',
        priority: 'medium' as const,
        due: 'Feb 25',
        category: 'Drilling',
      },
    ],
  },
];

export default function PermitsPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase font-mono mb-1"
          style={{ color: '#C2A04E' }}
        >
          Act 1 &middot; The Landman
        </div>
        <h1
          className="text-2xl font-extrabold"
          style={{ color: '#F1F5F9' }}
        >
          RRC Permits
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Railroad Commission of Texas &middot; Permit tracking &amp; status
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Active Permits"
          value="7"
          trend="up"
          trendValue="+2 this month"
          color="#C2A04E"
          sparkline={[4, 4, 5, 5, 6, 7]}
        />
        <StatCard
          label="Pending Review"
          value="3"
          trend="flat"
          trendValue="at RRC"
          color="#C2A04E"
        />
        <StatCard
          label="Approved This Mo."
          value="2"
          trend="up"
          trendValue="on schedule"
          color="#059669"
          sparkline={[0, 1, 1, 1, 2, 2]}
        />
        <StatCard
          label="Avg Approval Days"
          value="14"
          trend="down"
          trendValue="-3 days"
          color="#C2A04E"
          sparkline={[21, 19, 18, 16, 15, 14]}
        />
      </div>

      {/* Kanban Board */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}
      >
        <h3
          className="text-sm font-semibold mb-1"
          style={{ color: '#F1F5F9' }}
        >
          Permit Pipeline
        </h3>
        <p
          className="text-[11px] mb-4"
          style={{ color: '#64748B' }}
        >
          Drag-style board &middot; 7 active permits across 3 stages
        </p>
        <KanbanBoard columns={PERMIT_COLUMNS} />
      </div>
    </>
  );
}
