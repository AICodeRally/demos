'use client';

import { StatCard, MigrationTracker, BarChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const MIGRATION_MODULES = [
  { name: 'Deposits', progress: 100, status: 'live' as const, validationScore: 99.8 },
  { name: 'Lending', progress: 85, status: 'parallel' as const, validationScore: 98.4 },
  { name: 'Cards', progress: 60, status: 'testing' as const, validationScore: 96.2 },
  { name: 'Payments', progress: 45, status: 'testing' as const, validationScore: 94.8 },
  { name: 'Compliance', progress: 10, status: 'pending' as const, validationScore: 0 },
  { name: 'HR/Payroll', progress: 0, status: 'pending' as const, validationScore: 0 },
];

const VALIDATION_SCORES = [
  { label: 'Deposits', value: 99.8, color: '#059669' },
  { label: 'Lending', value: 98.4, color: '#6B8F71' },
  { label: 'Cards', value: 96.2, color: '#475569' },
  { label: 'Payments', value: 94.8, color: '#475569' },
  { label: 'Compliance', value: 0, color: '#A8A29E' },
  { label: 'HR/Payroll', value: 0, color: '#A8A29E' },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function MigrationTrackerPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Migration Tracker</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Core system migration progress, parallel run status, and data validation scores
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Modules Live" value="1 / 6" color="#6B8F71" />
        <StatCard label="Parallel Run" value="Active" color="#B87333" />
        <StatCard label="Data Accuracy" value="99.2%" trend="up" trendValue="+0.4%" color="#475569" />
        <StatCard label="Target Go-Live" value="Q3 2026" color="#475569" />
      </div>

      {/* Migration Progress */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Module Migration Progress</h2>
        <MigrationTracker modules={MIGRATION_MODULES} />
      </div>

      {/* Data Validation Scores */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Data Validation Scores by Module (%)</h2>
        <BarChart data={VALIDATION_SCORES} maxVal={100} unit="%" />
      </div>
    </>
  );
}
