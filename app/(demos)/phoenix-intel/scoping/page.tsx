'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { MetricCard } from '@/components/demos/phoenix-intel/MetricCard';
import { DataTable } from '@/components/demos/phoenix-intel/DataTable';
import { Alert } from '@/components/demos/phoenix-intel/Alert';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { DollarSign, Clock, Users, FileText, Target, Gem, Building2, BarChart3, ClipboardList, Map, UserCheck, FileEdit } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const SERVICE_LINES: { name: string; rate: string; typical: string; duration: string; icon: LucideIcon }[] = [
  { name: 'Campaign Readiness & Feasibility', rate: '$175/hr', typical: '$35K – $55K', duration: '4–6 months', icon: Target },
  { name: 'Major Gifts Program Design', rate: '$200/hr', typical: '$45K – $75K', duration: '5–8 months', icon: Gem },
  { name: 'Board Development & Engagement', rate: '$150/hr', typical: '$18K – $32K', duration: '3–6 months', icon: Building2 },
  { name: 'Annual Fund Optimization', rate: '$150/hr', typical: '$25K – $40K', duration: '4–7 months', icon: BarChart3 },
  { name: 'Planned Giving Launch', rate: '$175/hr', typical: '$28K – $45K', duration: '5–8 months', icon: ClipboardList },
  { name: 'Strategic Planning', rate: '$200/hr', typical: '$40K – $80K', duration: '6–10 months', icon: Map },
  { name: 'Development Staffing Assessment', rate: '$125/hr', typical: '$12K – $20K', duration: '2–3 months', icon: UserCheck },
  { name: 'Grant Strategy Development', rate: '$150/hr', typical: '$18K – $30K', duration: '3–5 months', icon: FileEdit },
];

const ACTIVE_SCOPES = [
  { client: 'SafeHaven Social Services', service: 'Comprehensive Advancement Program', hours: 320, rate: 175, status: 'pricing', consultant: 'Jennifer Blake' },
  { client: 'Green Valley Community Foundation', service: 'Capital Campaign Consulting', hours: 480, rate: 175, status: 'scope-review', consultant: 'Jennifer Blake' },
  { client: 'Sunrise Children\'s Hospital', service: 'Major Gifts Strategy', hours: 220, rate: 200, status: 'discovery', consultant: 'Sarah Kim' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'discovery': { bg: '#2563eb20', text: '#2563eb' },
  'scope-review': { bg: '#c9942b20', text: '#c9942b' },
  'pricing': { bg: '#c026d320', text: '#c026d3' },
};

export default function ScopingPage() {
  const insight = getInsight('scoping');

  return (
    <PhoenixPage title="Scoping / CPQ" subtitle="Service line pricing, scope configuration, and active quotes" accentColor="#3b6bf5">
      {/* Billing Model Context */}
      <Alert variant="info" icon={DollarSign}>
        Billing model: hourly rates × estimated hours, <strong style={{ color: 'var(--pi-text)' }}>billed monthly</strong>. Typical engagement: $100-120K annually. Campaign engagements run 5-7 years. Multiple contract types: fixed, retainer, hourly, and blended.
      </Alert>

      {/* Service Line Rate Card */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <h3 className="pi-section-title" style={{ marginBottom: 4 }}>Service Line Portfolio</h3>
        <p className="pi-body-muted" style={{ marginBottom: 16 }}>Standard pricing — actual quotes configured per engagement. Project costs divided over monthly billing cycles.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SERVICE_LINES.map(s => (
            <div key={s.name} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12,
              borderRadius: 8, background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))',
              border: '1px solid var(--pi-border-faint)',
            }}>
              <s.icon size={20} color="var(--pi-text-muted)" />
              <div style={{ flex: 1 }}>
                <div className="pi-label" style={{ marginBottom: 4 }}>{s.name}</div>
                <div className="pi-caption" style={{ display: 'flex', gap: 16 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={12} /> {s.rate}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={12} /> {s.typical}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {s.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Scope Configurations */}
      <div className="phoenix-card" style={{ marginBottom: 24 }} role="region" aria-label="Active quotes">
        <h3 className="pi-section-title" style={{ marginBottom: 4 }}>Active Quotes</h3>
        <p className="pi-body-muted" style={{ marginBottom: 16 }}>In-progress scope configurations awaiting finalization</p>
        <DataTable
          data={ACTIVE_SCOPES}
          keyFn={(_, i) => String(i)}
          columns={[
            { key: 'client', header: 'Client', render: (s) => <span className="pi-label">{s.client}</span> },
            { key: 'service', header: 'Service', hideSm: true, render: (s) => <span className="pi-body-muted">{s.service}</span> },
            { key: 'hours', header: 'Est. Hours', render: (s) => <span className="pi-label">{s.hours}h</span> },
            { key: 'rate', header: 'Rate', hideSm: true, render: (s) => <span className="pi-body-muted">${s.rate}/hr</span> },
            { key: 'value', header: 'Quote Value', render: (s) => <span className="pi-label" style={{ fontWeight: 800 }}>${(s.hours * s.rate / 1000).toFixed(0)}K</span> },
            { key: 'status', header: 'Status', render: (s) => (
              <span className="pi-badge" style={{ background: STATUS_COLORS[s.status]?.bg, color: STATUS_COLORS[s.status]?.text, textTransform: 'capitalize' }}>
                {s.status.replace('-', ' ')}
              </span>
            )},
            { key: 'lead', header: 'Lead', hideSm: true, render: (s) => <span className="pi-body-muted">{s.consultant}</span> },
          ]}
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" role="region" aria-label="Scoping summary">
        <MetricCard label="Service Lines" value="8" icon={FileText} color="#3b6bf5" />
        <MetricCard label="Active Quotes" value="3" icon={DollarSign} color="#3b6bf5" />
        <MetricCard label="Total Quote Value" value="$179K" icon={DollarSign} color="#10b981" />
        <MetricCard label="Avg. Engagement" value="$42K" icon={Users} color="#c9942b" />
      </div>

      {/* Budget Worksheet Flow */}
      <div className="phoenix-card" style={{ marginBottom: 20, borderLeft: '3px solid #7c3aed' }}>
        <h3 className="pi-section-title" style={{ marginBottom: 8 }}>Budget Worksheet Workflow</h3>
        <p className="pi-body-muted" style={{ marginBottom: 12 }}>
          Kelly (Director of Client Services) prepares budget worksheets, circulates for consultant input, finalizes, and enters into the system. Accepted scope auto-populates downstream: PM worksheet, budget, billing codes, team assignments.
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { step: 'Kelly drafts budget worksheet', color: '#3b6bf5' },
            { step: 'Consultant reviews & inputs', color: '#c9942b' },
            { step: 'Kelly finalizes & enters system', color: '#10b981' },
            { step: 'Auto-populates to engagement', color: '#7c3aed' },
          ].map((s, i) => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span className="pi-caption">→</span>}
              <span className="pi-badge" style={{
                background: `${s.color}15`, color: s.color,
              }}>{s.step}</span>
            </div>
          ))}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
