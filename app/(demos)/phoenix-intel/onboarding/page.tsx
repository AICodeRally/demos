'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { UserPlus, Clock, CheckCircle, Circle, AlertCircle, ListChecks } from 'lucide-react';

interface OnboardingClient {
  id: string;
  clientName: string;
  contactName: string;
  dealValue: number;
  startDate: string;
  status: 'in-progress' | 'pending';
  completedSteps: number;
  totalSteps: number;
}

const ACTIVE_ONBOARDING: OnboardingClient[] = [
  { id: 'ob-1', clientName: 'SafeHaven Social Services', contactName: 'Angela Brooks', dealValue: 58000, startDate: '2026-04-15', status: 'in-progress', completedSteps: 3, totalSteps: 10 },
  { id: 'ob-2', clientName: 'Sunrise Children\'s Hospital', contactName: 'Dr. Patricia Moore', dealValue: 42000, startDate: '2026-05-01', status: 'pending', completedSteps: 0, totalSteps: 10 },
];

interface ChecklistStep {
  id: number;
  name: string;
  description: string;
  owner: string;
}

const CHECKLIST_TEMPLATE: ChecklistStep[] = [
  { id: 1, name: 'Engagement Letter Signed', description: 'DocuSign engagement letter with scope, timeline, and billing terms', owner: 'Kelly Martinez' },
  { id: 2, name: 'Billing Setup (QuickBooks)', description: 'Create client in QuickBooks, set billing frequency and payment terms', owner: 'Cassandra (Business Manager)' },
  { id: 3, name: 'Team Assignment', description: 'Assign lead consultant and project coordinator based on engagement type', owner: 'Kelly Martinez' },
  { id: 4, name: 'Kickoff Meeting Scheduled', description: 'Internal kickoff with team, followed by client kickoff call', owner: 'Lead Consultant' },
  { id: 5, name: 'Document Access (SharePoint)', description: 'Create client folder structure in SharePoint, set permissions', owner: 'Timmesse (Corp. Ops)' },
  { id: 6, name: 'Assessment Scheduling', description: 'Schedule initial assessment interviews and site visits', owner: 'Lead Consultant' },
  { id: 7, name: 'Communication Plan', description: 'Define reporting cadence, meeting schedule, and primary contacts', owner: 'Kelly Martinez' },
  { id: 8, name: 'PM Worksheet Auto-Populated', description: 'Engagement data flows into project management worksheet from contract', owner: 'System (Auto)' },
  { id: 9, name: 'Client Portal Access', description: 'Provision client portal login for deliverable tracking and communication', owner: 'Timmesse (Corp. Ops)' },
  { id: 10, name: 'Quarterly Review Cadence Set', description: 'Schedule quarterly business reviews for engagement duration', owner: 'Kelly Martinez' },
];

function getStepStatus(clientSteps: number, stepIndex: number): 'complete' | 'in-progress' | 'pending' {
  if (stepIndex < clientSteps) return 'complete';
  if (stepIndex === clientSteps) return 'in-progress';
  return 'pending';
}

const STATUS_ICON = { complete: CheckCircle, 'in-progress': AlertCircle, pending: Circle };
const STATUS_COLOR = { complete: '#10b981', 'in-progress': '#f59e0b', pending: 'var(--pi-text-faint)' };

export default function OnboardingPage() {
  const insight = getInsight('onboarding');

  const activeCount = ACTIVE_ONBOARDING.length;
  const avgDays = 14;
  const completionRate = 94;
  const totalItems = CHECKLIST_TEMPLATE.length;

  return (
    <PhoenixPage title="Client Onboarding" subtitle="Standardized onboarding workflows for new engagements" accentColor="#3b6bf5">
      {/* Workflow reference */}
      <div className="pi-body-muted" style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 16,
        borderRadius: 8, background: '#7c3aed08', border: '1px solid #7c3aed20',
      }}>
        <ListChecks size={14} color="#7c3aed" style={{ flexShrink: 0 }} />
        <span><strong style={{ color: '#7c3aed' }}>Workflow:</strong> Kelly drafts contracts &#8594; consultant reviews &#8594; Kelly finalizes &#8594; auto-populates engagement record and PM worksheet downstream.</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Onboarding', value: String(activeCount), icon: UserPlus, color: '#3b6bf5' },
          { label: 'Avg Days to Complete', value: String(avgDays), icon: Clock, color: '#c9942b' },
          { label: 'Completion Rate', value: `${completionRate}%`, icon: CheckCircle, color: '#10b981' },
          { label: 'Checklist Items', value: String(totalItems), icon: ListChecks, color: '#7c3aed' },
        ].map(m => (
          <div key={m.label} className="phoenix-card" style={{ textAlign: 'center' }}>
            <m.icon size={20} color={m.color} style={{ margin: '0 auto 8px' }} />
            <div className="pi-value">{m.value}</div>
            <div className="pi-caption" style={{ marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Active Onboarding */}
      {ACTIVE_ONBOARDING.map(client => {
        const pct = (client.completedSteps / client.totalSteps) * 100;
        return (
          <div key={client.id} className="phoenix-card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div>
                <h3 className="pi-label">{client.clientName}</h3>
                <div className="pi-caption">
                  Contact: {client.contactName} &middot; ${(client.dealValue / 1000).toFixed(0)}K engagement &middot; Start: {client.startDate}
                </div>
              </div>
              <div className="pi-overline" style={{
                color: client.status === 'in-progress' ? '#3b6bf5' : 'var(--pi-text-faint)',
              }}>
                {client.status === 'in-progress' ? 'In Progress' : 'Pending'}
              </div>
            </div>

            {/* Progress bar */}
            <div className="pi-bar-track" style={{ height: 6, borderRadius: 3, marginBottom: 12 }}>
              <div className="pi-bar-fill" style={{ width: `${pct}%`, borderRadius: 3, background: '#3b6bf5' }} />
            </div>

            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {CHECKLIST_TEMPLATE.map((step, i) => {
                const status = client.status === 'pending' ? 'pending' : getStepStatus(client.completedSteps, i);
                const Icon = STATUS_ICON[status];
                return (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '4px 0' }}>
                    <Icon size={14} color={STATUS_COLOR[status]} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <span className="pi-body" style={{
                        color: status === 'complete' ? 'var(--pi-text-muted)' : 'var(--pi-text)',
                        textDecoration: status === 'complete' ? 'line-through' : 'none',
                        fontWeight: status === 'in-progress' ? 600 : 400,
                      }}>
                        {step.name}
                      </span>
                      {status === 'in-progress' && (
                        <span className="pi-badge" style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: 'var(--pi-fs-overline)', marginLeft: 6 }}>IN PROGRESS</span>
                      )}
                      <div className="pi-overline" style={{ textTransform: 'none', marginTop: 1 }}>
                        {step.description} &middot; <em>{step.owner}</em>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {insight && <div style={{ marginTop: 20 }}><AIInsightCard>{insight.text}</AIInsightCard></div>}
    </PhoenixPage>
  );
}
