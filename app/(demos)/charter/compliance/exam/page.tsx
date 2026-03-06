'use client';

import { ComplianceMeter, RadarChart, BarChart } from '@/components/demos/charter';

/* -- Mock Data ---------------------------------------------------------- */

const CAMEL_AXES = [
  { label: 'Capital Adequacy', value: 88 },
  { label: 'Asset Quality', value: 82 },
  { label: 'Management', value: 90 },
  { label: 'Earnings', value: 85 },
  { label: 'Liquidity', value: 87 },
];

const COMPLIANCE_ZONES = [
  { threshold: 0, color: '#B91C1C', label: 'Critical' },
  { threshold: 40, color: '#EA580C', label: 'Needs Attention' },
  { threshold: 60, color: '#EAB308', label: 'Satisfactory' },
  { threshold: 80, color: '#6B8F71', label: 'Strong' },
];

const COMPLIANCE_DIMENSIONS = [
  { label: 'Capital', score: 88 },
  { label: 'Assets', score: 82 },
  { label: 'Management', score: 90 },
  { label: 'Earnings', score: 85 },
  { label: 'Liquidity', score: 87 },
];

const REMEDIATION_ITEMS = [
  { label: 'Documentation', value: 4, color: '#B87333' },
  { label: 'Policy Updates', value: 2, color: '#475569' },
  { label: 'Training', value: 1, color: '#6B8F71' },
  { label: 'System Fixes', value: 3, color: '#B91C1C' },
];

/* -- Page --------------------------------------------------------------- */

export default function NCUAExamReadiness() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>NCUA Exam Readiness</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          CAMEL rating analysis, exam preparedness &amp; remediation tracking
        </p>
      </div>

      {/* CAMEL Radar + Compliance Meter side-by-side */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Radar Chart */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>CAMEL Dimensions</h2>
          <div className="flex justify-center">
            <RadarChart axes={CAMEL_AXES} maxVal={100} color="#475569" size={280} />
          </div>
        </div>

        {/* Compliance Meter */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Exam Readiness Score</h2>
          <div className="flex justify-center">
            <ComplianceMeter
              score={86}
              label="Exam Readiness"
              zones={COMPLIANCE_ZONES}
              dimensions={COMPLIANCE_DIMENSIONS}
            />
          </div>
        </div>
      </div>

      {/* Remediation Items */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Remediation Items by Category</h2>
        <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>Open items requiring resolution before next examination</p>
        <BarChart data={REMEDIATION_ITEMS} />
      </div>
    </>
  );
}
