'use client';

import { StatCard, KanbanBoard } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const KANBAN_COLUMNS = [
  {
    title: 'Application',
    color: '#B87333',
    cards: [
      { title: 'Maria Gonzalez', assignee: 'Auto Loan · $32,500', priority: 'medium' as const, due: 'Mar 5', category: 'Auto' },
      { title: 'David Kim', assignee: 'Personal Loan · $15,000', priority: 'low' as const, due: 'Mar 6', category: 'Personal' },
      { title: 'Jennifer Walsh', assignee: 'HELOC · $85,000', priority: 'high' as const, due: 'Mar 4', category: 'HELOC' },
      { title: 'Robert Chen', assignee: 'Auto Loan · $28,000', priority: 'medium' as const, due: 'Mar 7', category: 'Auto' },
      { title: 'Lisa Thompson', assignee: 'Personal Loan · $8,500', priority: 'low' as const, due: 'Mar 8', category: 'Personal' },
      { title: 'Michael Brown', assignee: 'HELOC · $120,000', priority: 'high' as const, due: 'Mar 4', category: 'HELOC' },
      { title: 'Sarah Miller', assignee: 'Auto Loan · $41,000', priority: 'medium' as const, due: 'Mar 9', category: 'Auto' },
      { title: 'James Wilson', assignee: 'Personal Loan · $22,000', priority: 'medium' as const, due: 'Mar 6', category: 'Personal' },
    ],
  },
  {
    title: 'Underwriting',
    color: '#64748B',
    cards: [
      { title: 'Patricia Davis', assignee: 'Mortgage · $285,000', priority: 'high' as const, due: 'Mar 3', category: 'Mortgage' },
      { title: 'Andrew Park', assignee: 'Auto Loan · $36,200', priority: 'medium' as const, due: 'Mar 4', category: 'Auto' },
      { title: 'Karen Mitchell', assignee: 'HELOC · $95,000', priority: 'high' as const, due: 'Mar 5', category: 'HELOC' },
      { title: 'Thomas Lee', assignee: 'Personal Loan · $18,000', priority: 'low' as const, due: 'Mar 6', category: 'Personal' },
      { title: 'Rebecca Nguyen', assignee: 'Auto Loan · $29,500', priority: 'medium' as const, due: 'Mar 5', category: 'Auto' },
      { title: 'Christopher Hall', assignee: 'Commercial · $450,000', priority: 'critical' as const, due: 'Mar 3', category: 'Commercial' },
    ],
  },
  {
    title: 'Approved',
    color: '#059669',
    cards: [
      { title: 'Michelle Adams', assignee: 'Auto Loan · $33,800', priority: 'medium' as const, category: 'Auto' },
      { title: 'Daniel Foster', assignee: 'Mortgage · $310,000', priority: 'high' as const, category: 'Mortgage' },
      { title: 'Amanda Clark', assignee: 'Personal Loan · $12,000', priority: 'low' as const, category: 'Personal' },
      { title: 'Brian Taylor', assignee: 'HELOC · $78,000', priority: 'medium' as const, category: 'HELOC' },
    ],
  },
  {
    title: 'Closing',
    color: '#7C3AED',
    cards: [
      { title: 'Nicole Roberts', assignee: 'Mortgage · $265,000', priority: 'high' as const, due: 'Mar 7', category: 'Mortgage' },
      { title: 'Steven Wright', assignee: 'Auto Loan · $44,500', priority: 'medium' as const, due: 'Mar 5', category: 'Auto' },
      { title: 'Laura Martinez', assignee: 'HELOC · $110,000', priority: 'high' as const, due: 'Mar 6', category: 'HELOC' },
    ],
  },
  {
    title: 'Funded',
    color: '#0D9488',
    cards: [
      { title: 'Kevin Johnson', assignee: 'Auto Loan · $27,600', priority: 'low' as const, category: 'Auto' },
      { title: 'Elizabeth Moore', assignee: 'Personal Loan · $9,800', priority: 'low' as const, category: 'Personal' },
      { title: 'Ryan Garcia', assignee: 'Mortgage · $340,000', priority: 'medium' as const, category: 'Mortgage' },
      { title: 'Jessica Turner', assignee: 'HELOC · $65,000', priority: 'low' as const, category: 'HELOC' },
      { title: 'Mark Anderson', assignee: 'Auto Loan · $38,200', priority: 'low' as const, category: 'Auto' },
    ],
  },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function LoanPipeline() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Loan Pipeline</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Application tracking from intake through funding
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Pipeline Value" value="$48M" trend="up" trendValue="+12% vs last month" color="#475569" />
        <StatCard label="Avg Days to Close" value="32" trend="down" trendValue="-3 days" color="#B87333" />
        <StatCard label="Approval Rate" value="78%" trend="up" trendValue="+2.1%" color="#6B8F71" />
        <StatCard label="Funded This Month" value="$12.4M" trend="up" trendValue="+8.5%" color="#475569" />
      </div>

      {/* Kanban Board */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Loan Pipeline Board</h2>
        <KanbanBoard columns={KANBAN_COLUMNS} />
      </div>
    </>
  );
}
