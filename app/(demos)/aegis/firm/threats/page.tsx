'use client';

import { StatCard, HeatMap, AreaChart, ConfidenceBand } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

const THREAT_HEATMAP_ROWS = ['Technology', 'Financial', 'Healthcare', 'Energy', 'Retail'];
const THREAT_HEATMAP_COLS = ['Cyber', 'Regulatory', 'Media', 'Legal', 'Operational'];
const THREAT_HEATMAP_DATA = [
  [92, 65, 72, 58, 45], // Technology
  [78, 88, 55, 82, 40], // Financial
  [70, 82, 48, 60, 55], // Healthcare
  [60, 75, 62, 50, 78], // Energy
  [55, 42, 80, 38, 68], // Retail
];

const INCIDENT_TREND = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1}`,
  value: Math.round(
    8 + Math.sin(i / 4) * 3 + Math.random() * 4 + (i > 20 ? (i - 20) * 0.5 : 0),
  ),
}));

const PREDICTION_DATA = [
  { label: 'W1', value: 12, low: 8, high: 16 },
  { label: 'W2', value: 14, low: 9, high: 19 },
  { label: 'W3', value: 13, low: 8, high: 20 },
  { label: 'W4', value: 15, low: 9, high: 22 },
  { label: 'W5', value: 16, low: 10, high: 24 },
  { label: 'W6', value: 18, low: 11, high: 26 },
  { label: 'W7', value: 17, low: 10, high: 27 },
  { label: 'W8', value: 19, low: 12, high: 28 },
  { label: 'W9', value: 20, low: 13, high: 30 },
  { label: 'W10', value: 22, low: 14, high: 32 },
  { label: 'W11', value: 21, low: 13, high: 31 },
  { label: 'W12', value: 23, low: 15, high: 34 },
];

type Severity = 'critical' | 'high' | 'medium';

interface ThreatCard {
  title: string;
  industry: string;
  severity: Severity;
  description: string;
  trendPct: string;
  trendUp: boolean;
}

const THREAT_CARDS: ThreatCard[] = [
  {
    title: 'SEC Cyber Disclosure Enforcement Wave',
    industry: 'Financial',
    severity: 'critical',
    description: 'SEC intensifying enforcement of 4-day materiality disclosure rule. Three major firms received Wells notices in February.',
    trendPct: '+42%',
    trendUp: true,
  },
  {
    title: 'AI-Generated Deepfake Executive Impersonation',
    industry: 'Technology',
    severity: 'critical',
    description: 'Sophisticated voice and video deepfakes targeting C-suite authorization of wire transfers. Two confirmed $10M+ losses in Q1.',
    trendPct: '+68%',
    trendUp: true,
  },
  {
    title: 'Supply Chain Ransomware Cascade Risk',
    industry: 'Healthcare',
    severity: 'high',
    description: 'Major medical device manufacturer compromise exposing 200+ hospital networks. Patch deployment lagging at 34%.',
    trendPct: '+28%',
    trendUp: true,
  },
  {
    title: 'ESG Litigation Wave — Greenwashing Claims',
    industry: 'Energy',
    severity: 'high',
    description: 'Class action filings against energy companies for misleading sustainability claims tripled year-over-year.',
    trendPct: '+55%',
    trendUp: true,
  },
];

const SEVERITY_STYLES: Record<Severity, { border: string; badge: string; badgeBg: string }> = {
  critical: { border: '#DC2626', badge: '#DC2626', badgeBg: '#FEF2F2' },
  high: { border: '#F59E0B', badge: '#D97706', badgeBg: '#FFFBEB' },
  medium: { border: '#8B7355', badge: '#8B7355', badgeBg: '#FAF5F0' },
};

const INDUSTRY_COLORS: Record<string, string> = {
  Technology: '#2563EB',
  Financial: '#8B7355',
  Healthcare: '#059669',
  Energy: '#EA580C',
  Retail: '#7C3AED',
};

/* ── Page ─────────────────────────────────────────────────── */

export default function ThreatLandscape() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>Threat Landscape</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>External threat intelligence and predictive risk analysis</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Threats" value="12" trend="up" trendValue="+3" color="#8B7355" sparkline={[6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12]} />
        <StatCard label="Critical" value="3" trend="up" trendValue="+1" color="#DC2626" sparkline={[1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3]} />
        <StatCard label="New This Week" value="4" trend="up" trendValue="+2" color="#8B7355" sparkline={[1, 2, 1, 2, 3, 2, 1, 3, 2, 2, 3, 4]} />
        <StatCard label="Predicted Escalations" value="2" trend="up" trendValue="+1" color="#EA580C" sparkline={[0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2]} />
      </div>

      {/* Threat HeatMap */}
      <div className="rounded-xl bg-white border p-6 mb-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-2" style={{ color: '#1C1917' }}>Industry x Threat Type Matrix</h2>
        <p className="text-xs mb-4" style={{ color: '#A8A29E' }}>Risk intensity scored 0-100 based on aggregated threat intelligence</p>
        <HeatMap
          rows={THREAT_HEATMAP_ROWS}
          cols={THREAT_HEATMAP_COLS}
          data={THREAT_HEATMAP_DATA}
        />
      </div>

      {/* Two-Column: Incident Trend + Prediction */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>30-Day Incident Trend</h2>
          <AreaChart data={INCIDENT_TREND} color="#DC2626" height={200} showDots={false} />
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5" style={{ backgroundColor: '#DC2626' }} />
              <span className="text-[10px]" style={{ color: '#A8A29E' }}>Daily incidents</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold" style={{ color: '#DC2626' }}>+18%</span>
              <span className="text-[10px]" style={{ color: '#A8A29E' }}>vs. prior 30d</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>90-Day Prediction</h2>
          <ConfidenceBand data={PREDICTION_DATA} color="#8B7355" height={200} />
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5" style={{ backgroundColor: '#8B7355' }} />
              <span className="text-[10px]" style={{ color: '#A8A29E' }}>Projected incidents</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 opacity-40" style={{ backgroundColor: '#8B7355', borderBottom: '1px dashed #8B7355' }} />
              <span className="text-[10px]" style={{ color: '#A8A29E' }}>Confidence band</span>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Cards */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Active Threat Advisories</h2>
        <div className="grid grid-cols-2 gap-4">
          {THREAT_CARDS.map((t, i) => {
            const ss = SEVERITY_STYLES[t.severity];
            const ic = INDUSTRY_COLORS[t.industry] || '#8B7355';
            return (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{ borderLeft: `4px solid ${ss.border}`, backgroundColor: '#FAFAF9' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm leading-tight pr-3" style={{ color: '#1C1917' }}>{t.title}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-bold" style={{ color: t.trendUp ? '#DC2626' : '#059669' }}>
                      {t.trendUp ? '\u2191' : '\u2193'} {t.trendPct}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: `${ic}15`, color: ic }}>{t.industry}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: ss.badgeBg, color: ss.badge }}>{t.severity}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#57534E' }}>{t.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: '#A8A29E' }}>Highest-Risk Sector</p>
          <p className="text-lg font-bold" style={{ color: '#2563EB' }}>Technology</p>
          <p className="text-xs mt-1" style={{ color: '#57534E' }}>Cyber + AI deepfake convergence</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: '#A8A29E' }}>Fastest-Growing Threat</p>
          <p className="text-lg font-bold" style={{ color: '#DC2626' }}>AI Deepfakes</p>
          <p className="text-xs mt-1" style={{ color: '#57534E' }}>+68% quarter-over-quarter</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: '#A8A29E' }}>Regulatory Horizon</p>
          <p className="text-lg font-bold" style={{ color: '#F59E0B' }}>3 New Rules</p>
          <p className="text-xs mt-1" style={{ color: '#57534E' }}>SEC, FTC, and EU DORA enforcement</p>
        </div>
      </div>
    </>
  );
}
