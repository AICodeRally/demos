'use client';

import { StatCard, SankeyFlow, KanbanBoard } from '@/components/demos/charter';

/* -- Mock Data ---------------------------------------------------------- */

const SPARKLINE_CALL = [30, 28, 25, 22, 20, 18, 18, 18, 18, 18, 18, 18];
const SPARKLINE_HMDA = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const SPARKLINE_CRA = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const SPARKLINE_5300 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const SANKEY_NODES = [
  { id: 'collect', label: 'Data Collection' },
  { id: 'validate', label: 'Validation' },
  { id: 'review', label: 'Review' },
  { id: 'submit', label: 'Submission' },
  { id: 'confirm', label: 'Confirmation' },
];

const SANKEY_LINKS = [
  { source: 'collect', target: 'validate', value: 12, color: 'rgba(71, 85, 105, 0.3)' },
  { source: 'validate', target: 'review', value: 11, color: 'rgba(107, 143, 113, 0.3)' },
  { source: 'validate', target: 'collect', value: 1, color: 'rgba(185, 28, 28, 0.25)' },
  { source: 'review', target: 'submit', value: 10, color: 'rgba(71, 85, 105, 0.3)' },
  { source: 'review', target: 'validate', value: 1, color: 'rgba(234, 179, 8, 0.3)' },
  { source: 'submit', target: 'confirm', value: 10, color: 'rgba(107, 143, 113, 0.3)' },
];

const KANBAN_COLUMNS = [
  {
    title: 'Preparing',
    color: '#EAB308',
    cards: [
      { title: 'Q1 Call Report', assignee: 'Compliance Team', priority: 'high' as const, due: 'Apr 30', category: 'NCUA' },
      { title: 'HMDA Annual', assignee: 'Data Team', priority: 'critical' as const, due: 'Mar 1', category: 'FFIEC' },
    ],
  },
  {
    title: 'In Review',
    color: '#B87333',
    cards: [
      { title: 'CRA Self-Assessment', assignee: 'Internal Audit', priority: 'medium' as const, category: 'CRA' },
      { title: 'BSA Risk Assessment', assignee: 'BSA Officer', priority: 'high' as const, category: 'BSA/AML' },
    ],
  },
  {
    title: 'Submitted',
    color: '#475569',
    cards: [
      { title: 'Q4 Call Report', assignee: 'Compliance Team', priority: 'low' as const, category: 'Confirmed' },
      { title: 'HMDA LAR', assignee: 'Data Team', priority: 'low' as const, category: 'Accepted' },
    ],
  },
  {
    title: 'Confirmed',
    color: '#6B8F71',
    cards: [
      { title: 'Annual Privacy Notice', assignee: 'Legal', priority: 'low' as const, category: 'Compliant' },
      { title: 'TILA Disclosures', assignee: 'Compliance Team', priority: 'low' as const, category: 'Approved' },
    ],
  },
];

/* -- Page --------------------------------------------------------------- */

export default function RegulatoryReporting() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Regulatory Reporting</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Filing status, report workflow &amp; regulatory calendar management
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Call Report Due" value="18 days" trend="down" trendValue="Apr 30" color="#B87333" sparkline={SPARKLINE_CALL} />
        <StatCard label="HMDA Status" value="Submitted" trend="up" trendValue="On time" color="#6B8F71" sparkline={SPARKLINE_HMDA} />
        <StatCard label="CRA Rating" value="Satisfactory" trend="flat" trendValue="Maintained" color="#475569" sparkline={SPARKLINE_CRA} />
        <StatCard label="5300 Filed" value="On Time" trend="up" trendValue="Q4 complete" color="#6B8F71" sparkline={SPARKLINE_5300} />
      </div>

      {/* Reporting Workflow Sankey */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Reporting Workflow</h2>
        <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>
          Report flow from data collection through confirmation (12 active reports)
        </p>
        <SankeyFlow nodes={SANKEY_NODES} links={SANKEY_LINKS} height={260} />
      </div>

      {/* Report Status Kanban */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Report Status Board</h2>
        <KanbanBoard columns={KANBAN_COLUMNS} />
      </div>
    </>
  );
}
