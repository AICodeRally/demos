'use client';

import { useState } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { ArrowRight, CheckCircle2, Circle, Clock, AlertCircle, User } from 'lucide-react';

interface ProcessStep {
  id: string;
  name: string;
  description: string;
  owner: string;
  avgDays: number;
  actions: string[];
}

const SALES_PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'identify',
    name: 'Identify & Qualify',
    description: 'Prospect identification through referrals, conferences, website inquiries, and existing client networks.',
    owner: 'Business Development Lead',
    avgDays: 7,
    actions: [
      'Log prospect in CRM with source attribution',
      'Assess organizational fit & budget capacity',
      'Schedule introductory call',
      'Assign BD owner for moves management',
    ],
  },
  {
    id: 'discovery',
    name: 'Discovery & Needs Assessment',
    description: 'Deep-dive into the prospect\'s organizational challenges, advancement maturity, and strategic goals.',
    owner: 'Senior Consultant',
    avgDays: 14,
    actions: [
      'Conduct stakeholder interviews',
      'Review existing fundraising data',
      'Run preliminary assessment (if applicable)',
      'Document pain points & priorities',
      'Identify decision-makers & timeline',
    ],
  },
  {
    id: 'proposal',
    name: 'Proposal Development',
    description: 'Collaborative proposal creation drawing on templates, prior proposals, and assessment findings.',
    owner: 'Proposal Lead + Consulting Team',
    avgDays: 10,
    actions: [
      'Select proposal template from library',
      'Draft scope of work with deliverables',
      'Build budget worksheet & fee schedule',
      'Internal review (peer + Richard sign-off)',
      'Present proposal to client (with board session if >$50K)',
    ],
  },
  {
    id: 'negotiate',
    name: 'Negotiation & Close',
    description: 'Scope refinement, pricing discussions, and contract execution. Moves management tracks all touchpoints.',
    owner: 'Richard Tollefson',
    avgDays: 21,
    actions: [
      'Address scope questions & modifications',
      'Finalize pricing & payment terms',
      'Legal review of contract language',
      'Execute MSA + SOW',
      'Update pipeline stage to Contract → Active',
    ],
  },
  {
    id: 'handoff',
    name: 'Ops Handoff & Onboarding',
    description: 'Seamless transition from business development to project delivery. Proposal data auto-populates downstream.',
    owner: 'Operations Team',
    avgDays: 5,
    actions: [
      'Generate project management worksheet from proposal',
      'Auto-populate budget from accepted scope',
      'Assign consulting team members',
      'Set up time tracking codes & billing',
      'Schedule kickoff meeting with client',
      'Send welcome packet & data request',
    ],
  },
  {
    id: 'steward',
    name: 'Relationship Stewardship',
    description: 'Ongoing relationship management through engagement lifecycle and beyond for renewals & referrals.',
    owner: 'Lead Consultant + BD',
    avgDays: 0,
    actions: [
      'Quarterly check-in with client leadership',
      'Track deliverables against original scope',
      'Identify upsell & renewal opportunities',
      'Request testimonials & referrals',
      'Log all touchpoints in CRM',
    ],
  },
];

// Active prospect moves management tracker
const MOVES_TRACKER = [
  { prospect: 'SafeHaven Social Services', contact: 'Angela Brooks', stage: 'negotiate', lastTouch: '2026-03-14', nextAction: 'Final scope meeting', nextDate: '2026-03-20', owner: 'Richard T.' },
  { prospect: 'Green Valley Community Foundation', contact: 'Lisa Chang', stage: 'proposal', lastTouch: '2026-03-12', nextAction: 'Follow-up call', nextDate: '2026-03-22', owner: 'Jennifer B.' },
  { prospect: 'Sunrise Children\'s Hospital', contact: 'Dr. Patricia Moore', stage: 'discovery', lastTouch: '2026-03-10', nextAction: 'Needs assessment survey', nextDate: '2026-03-19', owner: 'Sarah K.' },
  { prospect: 'Northwest Arts Center', contact: 'Michael Torres', stage: 'identify', lastTouch: '2026-03-15', nextAction: 'Discovery call', nextDate: '2026-03-21', owner: 'Marcus R.' },
  { prospect: 'Mountain View Academy', contact: 'Robert Williams', stage: 'negotiate', lastTouch: '2026-03-13', nextAction: 'Contract signing', nextDate: '2026-03-18', owner: 'Richard T.' },
  { prospect: 'Coastal Humane Society', contact: 'Dr. Karen Wells', stage: 'identify', lastTouch: '2026-03-16', nextAction: 'Intro call', nextDate: '2026-03-24', owner: 'Thomas P.' },
];

const STAGE_COLORS: Record<string, string> = {
  identify: '#94a3b8',
  discovery: '#3b6bf5',
  proposal: '#6366f1',
  negotiate: '#c026d3',
  handoff: '#c9942b',
  steward: '#10b981',
};

function getDaysUntil(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date('2026-03-17');
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function SalesProcessPage() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const insight = getInsight('sales-process');

  return (
    <PhoenixPage title="Sales Process" subtitle="Multi-step business development workflow with moves management" accentColor="#3b6bf5">
      {/* Process Steps Visual */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 16 }}>
          Business Development Lifecycle
        </h3>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 8 }}>
          {SALES_PROCESS_STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              style={{
                flex: '1 1 0',
                minWidth: 140,
                padding: '12px 10px',
                borderRadius: 10,
                border: activeStep === step.id ? `2px solid ${STAGE_COLORS[step.id]}` : '2px solid transparent',
                background: activeStep === step.id ? `${STAGE_COLORS[step.id]}15` : 'var(--pi-card)',
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '50%', margin: '0 auto 8px',
                background: STAGE_COLORS[step.id],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: '0.85rem',
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pi-text)', lineHeight: 1.3 }}>
                {step.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--pi-text-faint)', marginTop: 4 }}>
                ~{step.avgDays > 0 ? `${step.avgDays} days` : 'Ongoing'}
              </div>
              {i < SALES_PROCESS_STEPS.length - 1 && (
                <ArrowRight
                  size={14}
                  style={{
                    position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--pi-text-faint)', zIndex: 1,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Expanded step detail */}
        {activeStep && (() => {
          const step = SALES_PROCESS_STEPS.find(s => s.id === activeStep)!;
          return (
            <div style={{
              marginTop: 16, padding: 16, borderRadius: 10,
              background: `${STAGE_COLORS[step.id]}08`,
              borderLeft: `3px solid ${STAGE_COLORS[step.id]}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 4 }}>{step.name}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--pi-text-muted)' }}>{step.description}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: STAGE_COLORS[step.id], fontWeight: 600, whiteSpace: 'nowrap' }}>
                  <User size={14} />
                  {step.owner}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {step.actions.map((action, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                    <CheckCircle2 size={14} color={STAGE_COLORS[step.id]} style={{ flexShrink: 0 }} />
                    <span style={{ color: 'var(--pi-text-secondary)' }}>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Moves Management Tracker */}
      <div className="phoenix-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 4 }}>
          Moves Management Tracker
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 16 }}>
          Active prospects with next steps, owners, and contact cadence
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                {['Prospect', 'Contact', 'Stage', 'Last Touch', 'Next Action', 'Due', 'Owner'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 8px', color: 'var(--pi-text-muted)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOVES_TRACKER.map((m, i) => {
                const daysUntil = getDaysUntil(m.nextDate);
                const urgencyColor = daysUntil <= 1 ? '#ef4444' : daysUntil <= 3 ? '#c9942b' : 'var(--pi-text-faint)';
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--pi-text)' }}>{m.prospect}</td>
                    <td style={{ padding: '10px 8px', color: 'var(--pi-text-secondary)' }}>{m.contact}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700,
                        background: `${STAGE_COLORS[m.stage]}20`, color: STAGE_COLORS[m.stage],
                        textTransform: 'capitalize',
                      }}>
                        {m.stage}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', color: 'var(--pi-text-faint)' }}>{m.lastTouch}</td>
                    <td style={{ padding: '10px 8px', color: 'var(--pi-text-secondary)', fontWeight: 600 }}>{m.nextAction}</td>
                    <td style={{ padding: '10px 8px', color: urgencyColor, fontWeight: 700 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {daysUntil <= 1 ? <AlertCircle size={13} /> : daysUntil <= 3 ? <Clock size={13} /> : <Circle size={13} />}
                        {m.nextDate}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', color: 'var(--pi-text-muted)' }}>{m.owner}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Lifecycle */}
      <div className="phoenix-card" style={{ marginBottom: 24, borderLeft: '3px solid #10b981' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)', marginBottom: 8 }}>Engagement Lifecycle — 5-7 Year Campaigns</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginBottom: 12 }}>
          Phoenix engagements are long-term partnerships — campaign work typically spans 5-7 years. Revenue phases shift from high-touch planning to steady management.
        </p>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {[
            { phase: 'Year 1-2', label: 'Planning & Feasibility', revenue: '$200-250K/yr', color: '#3b6bf5', desc: 'Feasibility study, board engagement, campaign architecture' },
            { phase: 'Year 2-5', label: 'Active Campaign', revenue: '$100-120K/yr', color: '#10b981', desc: 'Campaign management, major gift solicitation, stewardship' },
            { phase: 'Year 5-7', label: 'Wrap & Stewardship', revenue: '$60-80K/yr', color: '#c9942b', desc: 'Pledge fulfillment, donor recognition, transition to internal' },
          ].map(p => (
            <div key={p.phase} style={{
              flex: '1 1 200px', padding: '12px 14px', borderRadius: 8,
              background: `${p.color}08`, border: `1px solid ${p.color}20`,
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: p.color, marginBottom: 2 }}>{p.phase}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--pi-text)', marginBottom: 2 }}>{p.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: p.color, marginBottom: 4 }}>{p.revenue}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-faint)' }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Avg. Days to Close', value: '57', sub: 'Identify → Contract' },
          { label: 'Active Prospects', value: '6', sub: 'Across all stages' },
          { label: 'Win Rate', value: '68%', sub: 'Last 12 months' },
          { label: 'Pipeline Value', value: '$298K', sub: '5 open deals' },
        ].map(m => (
          <div key={m.label} className="phoenix-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pi-text)' }}>{m.value}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pi-text-muted)', marginTop: 2 }}>{m.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pi-text-faint)', marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
