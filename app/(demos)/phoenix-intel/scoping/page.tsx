'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { DollarSign, Clock, Users, FileText } from 'lucide-react';

const SERVICE_LINES = [
  { name: 'Campaign Readiness & Feasibility', rate: '$175/hr', typical: '$35K – $55K', duration: '4–6 months', icon: '🎯' },
  { name: 'Major Gifts Program Design', rate: '$200/hr', typical: '$45K – $75K', duration: '5–8 months', icon: '💎' },
  { name: 'Board Development & Engagement', rate: '$150/hr', typical: '$18K – $32K', duration: '3–6 months', icon: '🏛️' },
  { name: 'Annual Fund Optimization', rate: '$150/hr', typical: '$25K – $40K', duration: '4–7 months', icon: '📊' },
  { name: 'Planned Giving Launch', rate: '$175/hr', typical: '$28K – $45K', duration: '5–8 months', icon: '📋' },
  { name: 'Strategic Planning', rate: '$200/hr', typical: '$40K – $80K', duration: '6–10 months', icon: '🗺️' },
  { name: 'Development Staffing Assessment', rate: '$125/hr', typical: '$12K – $20K', duration: '2–3 months', icon: '👥' },
  { name: 'Grant Strategy Development', rate: '$150/hr', typical: '$18K – $30K', duration: '3–5 months', icon: '📝' },
];

const ACTIVE_SCOPES = [
  { client: 'SafeHaven Social Services', service: 'Comprehensive Advancement Program', hours: 320, rate: 175, status: 'pricing', consultant: 'Jennifer Blake' },
  { client: 'Green Valley Community Foundation', service: 'Capital Campaign Consulting', hours: 480, rate: 175, status: 'scope-review', consultant: 'Jennifer Blake' },
  { client: 'Sunrise Children\'s Hospital', service: 'Major Gifts Strategy', hours: 220, rate: 200, status: 'discovery', consultant: 'Sarah Kim' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'discovery': { bg: '#3b6bf520', text: '#3b6bf5' },
  'scope-review': { bg: '#c9942b20', text: '#c9942b' },
  'pricing': { bg: '#c026d320', text: '#c026d3' },
};

export default function ScopingPage() {
  const insight = getInsight('scoping');

  return (
    <PhoenixPage title="Scoping / CPQ" subtitle="Service line pricing, scope configuration, and active quotes" accentColor="#3b6bf5">
      {/* Billing Model Context */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 16,
        borderRadius: 8, background: '#3b6bf508', border: '1px solid #3b6bf520', fontSize: '0.85rem', color: 'var(--pi-text-muted)',
      }}>
        <DollarSign size={14} color="#3b6bf5" style={{ flexShrink: 0 }} />
        <span>Billing model: hourly rates × estimated hours, <strong style={{ color: 'var(--pi-text)' }}>billed monthly</strong>. Typical engagement: $100-120K annually. Campaign engagements run 5-7 years. Multiple contract types: fixed, retainer, hourly, and blended.</span>
      </div>

      {/* Service Line Rate Card */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 4 }}>Service Line Portfolio</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 16 }}>Standard pricing — actual quotes configured per engagement. Project costs divided over monthly billing cycles.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SERVICE_LINES.map(s => (
            <div key={s.name} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12,
              borderRadius: 8, background: 'var(--pi-surface-alt, rgba(255,255,255,0.03))',
              border: '1px solid var(--pi-border-faint)',
            }}>
              <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 4 }}>{s.name}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--pi-text-muted)' }}>
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
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 4 }}>Active Quotes</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 16 }}>In-progress scope configurations awaiting finalization</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                {['Client', 'Service', 'Est. Hours', 'Rate', 'Quote Value', 'Status', 'Lead'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px', color: 'var(--pi-text-muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACTIVE_SCOPES.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                  <td style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--pi-text)' }}>{s.client}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text-secondary)' }}>{s.service}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text)', fontWeight: 600 }}>{s.hours}h</td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text-muted)' }}>${s.rate}/hr</td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text)', fontWeight: 800 }}>${(s.hours * s.rate / 1000).toFixed(0)}K</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
                      background: STATUS_COLORS[s.status]?.bg, color: STATUS_COLORS[s.status]?.text,
                      textTransform: 'capitalize',
                    }}>
                      {s.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', color: 'var(--pi-text-muted)' }}>{s.consultant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Service Lines', value: '8', icon: FileText },
          { label: 'Active Quotes', value: '3', icon: DollarSign },
          { label: 'Total Quote Value', value: '$179K', icon: DollarSign },
          { label: 'Avg. Engagement', value: '$42K', icon: Users },
        ].map(m => (
          <div key={m.label} className="phoenix-card" style={{ textAlign: 'center' }}>
            <m.icon size={20} color="#3b6bf5" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pi-text)' }}>{m.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Budget Worksheet Flow */}
      <div className="phoenix-card" style={{ marginBottom: 20, borderLeft: '3px solid #7c3aed' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 8 }}>Budget Worksheet Workflow</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 12 }}>
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
              {i > 0 && <span style={{ color: 'var(--pi-text-faint)', fontSize: '0.8rem' }}>→</span>}
              <span style={{
                padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
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
