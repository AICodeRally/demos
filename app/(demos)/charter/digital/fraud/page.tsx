'use client';

import { StatCard, HeatMap, BarChart, DonutChart } from '@/components/demos/charter';

/* ── Mock Data ────────────────────────────────────────────── */

const HEATMAP_ROWS = ['Card Not Present', 'Account Takeover', 'Identity Theft', 'Check Fraud'];
const HEATMAP_COLS = ['Mobile', 'Web', 'Branch', 'ATM', 'Phone'];
const HEATMAP_DATA = [
  [85, 72, 12,  8, 18],   // Card Not Present
  [62, 58,  5,  3, 42],   // Account Takeover
  [28, 35, 22,  4, 15],   // Identity Theft
  [ 6,  4, 38, 14,  8],   // Check Fraud
];

const ALERT_VOLUME_TREND = [
  { label: 'Oct', value: 620, color: '#475569' },
  { label: 'Nov', value: 680, color: '#475569' },
  { label: 'Dec', value: 780, color: '#B91C1C' },
  { label: 'Jan', value: 740, color: '#475569' },
  { label: 'Feb', value: 810, color: '#B91C1C' },
  { label: 'Mar', value: 847, color: '#B91C1C' },
];

const RESOLUTION_OUTCOMES = [
  { label: 'Confirmed Fraud', value: 12, color: '#B91C1C' },
  { label: 'False Positive', value: 68, color: '#6B8F71' },
  { label: 'Under Review', value: 20, color: '#B87333' },
];

interface FraudAlert {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

const FRAUD_ALERTS: FraudAlert[] = [
  { id: 'f1', title: 'Card-Not-Present Alert', subtitle: '$2,847 — Online Purchase', timestamp: '2 min ago', severity: 'critical' },
  { id: 'f2', title: 'Account Takeover Attempt', subtitle: 'Password reset from new device', timestamp: '18 min ago', severity: 'high' },
  { id: 'f3', title: 'Unusual Wire Transfer', subtitle: '$45,000 — International', timestamp: '1 hr ago', severity: 'high' },
  { id: 'f4', title: 'Duplicate Check Deposit', subtitle: '$1,200 — Mobile deposit', timestamp: '2 hr ago', severity: 'medium' },
  { id: 'f5', title: 'Velocity Alert', subtitle: '12 transactions in 3 minutes', timestamp: '3 hr ago', severity: 'low' },
];

const SEVERITY_STYLES: Record<FraudAlert['severity'], { bg: string; text: string; dot: string }> = {
  critical: { bg: '#FEF2F2', text: '#B91C1C', dot: '#DC2626' },
  high:     { bg: '#FFF7ED', text: '#C2410C', dot: '#EA580C' },
  medium:   { bg: '#FFFBEB', text: '#A16207', dot: '#D97706' },
  low:      { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
};

/* ── Page ─────────────────────────────────────────────────── */

export default function FraudDetection() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Fraud Detection</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>
          Real-time fraud monitoring, alert analysis, and resolution tracking
        </p>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Alerts This Month" value="847" trend="up" trendValue="+4.6%" color="#B91C1C" />
        <StatCard label="Confirmed Fraud" value="12%" trend="down" trendValue="-1.8%" color="#475569" />
        <StatCard label="False Positive Rate" value="68%" trend="down" trendValue="-3.2%" color="#B87333" />
        <StatCard label="Avg Resolution" value="4.2 hr" trend="down" trendValue="-0.8 hr" color="#6B8F71" />
      </div>

      {/* Fraud HeatMap */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Fraud Type x Channel &mdash; Alert Counts</h2>
        <HeatMap rows={HEATMAP_ROWS} cols={HEATMAP_COLS} data={HEATMAP_DATA} />
      </div>

      {/* Alert Volume + Resolution Outcomes */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Alert Volume Trend (6 months)</h2>
          <BarChart data={ALERT_VOLUME_TREND} />
        </div>
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Resolution Outcomes (%)</h2>
          <DonutChart
            segments={RESOLUTION_OUTCOMES}
            centerValue="847"
            centerLabel="Total Alerts"
          />
        </div>
      </div>

      {/* Recent Fraud Alerts Feed */}
      <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#1C1917' }}>
          Recent Fraud Alerts
        </h3>
        <div className="space-y-2">
          {FRAUD_ALERTS.map((alert) => {
            const style = SEVERITY_STYLES[alert.severity];
            return (
              <div
                key={alert.id}
                className="flex items-center gap-3 rounded-lg px-4 py-3"
                style={{ backgroundColor: style.bg }}
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: style.dot }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#1C1917' }}>
                    {alert.title}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#57534E' }}>
                    {alert.subtitle}
                  </p>
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase shrink-0"
                  style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.dot}30` }}
                >
                  {alert.severity}
                </span>
                <span className="text-xs shrink-0" style={{ color: '#A8A29E' }}>
                  {alert.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
