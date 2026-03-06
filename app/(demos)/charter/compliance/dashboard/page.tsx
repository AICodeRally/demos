'use client';

import { StatCard, BarChart, DonutChart } from '@/components/demos/charter';

/* -- Mock Data ---------------------------------------------------------- */

const SPARKLINE_SARS = [2, 3, 4, 3, 5, 4, 6, 3, 5, 4, 5, 3];
const SPARKLINE_CTRS = [92, 96, 104, 98, 110, 105, 112, 108, 115, 118, 106, 120];
const SPARKLINE_TRAINING = [82, 84, 86, 87, 88, 89, 90, 91, 92, 93, 93, 94];
const SPARKLINE_FINDINGS = [14, 13, 12, 11, 10, 10, 9, 9, 8, 8, 8, 8];

const BSA_FILING_DATA = [
  { label: 'Jan', value: 3, color: '#B87333' },
  { label: 'Feb', value: 4, color: '#B87333' },
  { label: 'Mar', value: 5, color: '#B87333' },
  { label: 'Apr', value: 3, color: '#B87333' },
  { label: 'May', value: 6, color: '#B87333' },
  { label: 'Jun', value: 4, color: '#B87333' },
  { label: 'Jul', value: 5, color: '#B87333' },
  { label: 'Aug', value: 3, color: '#B87333' },
  { label: 'Sep', value: 4, color: '#B87333' },
  { label: 'Oct', value: 5, color: '#B87333' },
  { label: 'Nov', value: 3, color: '#B87333' },
  { label: 'Dec', value: 4, color: '#B87333' },
];

const CTR_FILING_DATA = [
  { label: 'Jan', value: 92, color: '#475569' },
  { label: 'Feb', value: 96, color: '#475569' },
  { label: 'Mar', value: 104, color: '#475569' },
  { label: 'Apr', value: 98, color: '#475569' },
  { label: 'May', value: 110, color: '#475569' },
  { label: 'Jun', value: 105, color: '#475569' },
  { label: 'Jul', value: 112, color: '#475569' },
  { label: 'Aug', value: 108, color: '#475569' },
  { label: 'Sep', value: 115, color: '#475569' },
  { label: 'Oct', value: 118, color: '#475569' },
  { label: 'Nov', value: 106, color: '#475569' },
  { label: 'Dec', value: 120, color: '#475569' },
];

const ALERT_DISPOSITION = [
  { label: 'Cleared', value: 62, color: '#6B8F71' },
  { label: 'Escalated', value: 18, color: '#EAB308' },
  { label: 'SAR Filed', value: 12, color: '#B91C1C' },
  { label: 'Pending', value: 8, color: '#A8A29E' },
];

/* -- Page --------------------------------------------------------------- */

export default function ComplianceDashboard() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Compliance Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          BSA/AML monitoring, filing activity &amp; alert disposition
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="SARs Filed YTD" value="47" trend="up" trendValue="+12%" color="#B91C1C" sparkline={SPARKLINE_SARS} />
        <StatCard label="CTRs Processed" value="1,284" trend="up" trendValue="+8.3%" color="#475569" sparkline={SPARKLINE_CTRS} />
        <StatCard label="Training Completion" value="94%" trend="up" trendValue="+6%" color="#6B8F71" sparkline={SPARKLINE_TRAINING} />
        <StatCard label="Open Findings" value="8" trend="down" trendValue="-4" color="#B87333" sparkline={SPARKLINE_FINDINGS} />
      </div>

      {/* BSA Filing Volume */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Monthly BSA Filing Volume</h2>
        <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>SARs filed per month (12-month trend)</p>
        <BarChart data={BSA_FILING_DATA} color="#B87333" />
      </div>

      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-1" style={{ color: '#1C1917' }}>Monthly CTR Volume</h2>
        <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>Currency Transaction Reports processed per month</p>
        <BarChart data={CTR_FILING_DATA} color="#475569" />
      </div>

      {/* Alert Disposition */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Alert Disposition</h2>
        <div className="flex justify-center">
          <DonutChart
            segments={ALERT_DISPOSITION}
            centerValue="100%"
            centerLabel="Resolved"
            size={200}
          />
        </div>
      </div>
    </>
  );
}
