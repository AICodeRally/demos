'use client';

import { use } from 'react';
import Link from 'next/link';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { ENGAGEMENTS, CONSULTANTS } from '@/data/phoenix-intel/nonprofit-data';
import { ArrowLeft, Calendar, DollarSign, FileText, Users, CheckCircle, AlertCircle, Circle, Briefcase, Activity, Clock } from 'lucide-react';

// Deliverable names by engagement type
const DELIVERABLE_NAMES: Record<string, string[]> = {
  'Campaign Readiness': ['Feasibility Report', 'Donor Interview Summary', 'Gift Range Chart', 'Campaign Timeline', 'Case for Support Draft', 'Prospect List', 'Board Presentation', 'Final Recommendation'],
  'Board Engagement': ['Board Assessment Survey', 'Governance Review', 'Board Manual Update', 'Recruitment Plan', 'Orientation Guide', 'Annual Plan'],
  'Donor Pipeline': ['Donor Analysis Report', 'Cultivation Matrix', 'Solicitation Plan', 'Stewardship Calendar', 'Major Gift Toolkit', 'Pipeline Dashboard', 'Ask Training Materials', 'Acknowledgment Templates', 'Impact Report Template', 'Final Review'],
  'Campaign Management': ['Campaign Plan', 'Volunteer Training', 'Prospect Screening', 'Gift Range Update', 'Solicitation Schedule', 'Progress Report Q1', 'Progress Report Q2', 'Donor Communications', 'Recognition Plan', 'Mid-Campaign Assessment', 'Progress Report Q3', 'Year-End Appeal', 'Progress Report Q4', 'Annual Report', 'Campaign Evaluation'],
  'Fundraising Maturity': ['Current State Assessment', 'Stakeholder Interviews', 'Benchmarking Analysis', 'Gap Analysis Report', 'Recommendations Document', 'Implementation Roadmap', 'Board Presentation', 'Final Assessment Report'],
  'Donor Stewardship': ['Stewardship Audit', 'Donor Recognition Plan', 'Communication Calendar', 'Impact Reporting Templates'],
  'Annual Fund': ['Annual Fund Analysis', 'Donor Segmentation', 'Solicitation Strategy', 'Appeal Calendar', 'Thank-You Sequence'],
  'Planned Giving': ['Planned Giving Assessment', 'Marketing Materials', 'Prospect Identification', 'Legacy Society Framework', 'Staff Training Guide', 'Launch Plan'],
  'Development Staffing': ['Position Analysis', 'Job Description', 'Search Committee Guide', 'Candidate Screening', 'Onboarding Plan'],
  'Grant Writing': ['Prospect Research', 'LOI Drafts', 'Full Proposals', 'Budget Narratives', 'Final Submissions'],
};

// Type-specific timeline events
function getTimelineEvents(eng: typeof ENGAGEMENTS[number]) {
  const events: { date: string; event: string; type: 'milestone' | 'deliverable' | 'session' | 'review' }[] = [
    { date: eng.startDate, event: 'Engagement kicked off — contract signed and team assigned', type: 'milestone' },
  ];

  const typeEvents: Record<string, { date: string; event: string; type: 'milestone' | 'deliverable' | 'session' | 'review' }[]> = {
    'Campaign Readiness': [
      { date: 'Week 2', event: 'Discovery interviews with board members and key donors', type: 'session' },
      { date: 'Week 4', event: 'Feasibility study donor interviews (15-20 prospects)', type: 'deliverable' },
      { date: 'Week 8', event: 'Gift range chart and prospect list delivered', type: 'deliverable' },
      { date: 'Week 12', event: 'Draft case for support reviewed by board committee', type: 'review' },
    ],
    'Board Engagement': [
      { date: 'Week 1', event: 'Board assessment survey distributed to all members', type: 'deliverable' },
      { date: 'Week 3', event: 'One-on-one interviews with board leadership', type: 'session' },
      { date: 'Week 6', event: 'Governance review presented to executive committee', type: 'review' },
      { date: 'Month 3', event: 'Board recruitment plan finalized', type: 'deliverable' },
    ],
    'Donor Pipeline': [
      { date: 'Week 2', event: 'Donor data audit and wealth screening completed', type: 'deliverable' },
      { date: 'Week 5', event: 'Cultivation matrix drafted with top 50 prospects', type: 'deliverable' },
      { date: 'Week 8', event: 'Solicitation training workshop for development staff', type: 'session' },
      { date: 'Month 4', event: 'Pipeline dashboard configured and team trained', type: 'deliverable' },
    ],
    'Campaign Management': [
      { date: 'Month 1', event: 'Campaign plan finalized with leadership gifts committee', type: 'deliverable' },
      { date: 'Month 3', event: 'Volunteer solicitor training completed', type: 'session' },
      { date: 'Month 6', event: 'Mid-campaign assessment and strategy adjustment', type: 'review' },
      { date: 'Quarterly', event: `Progress reports delivered (${eng.sessions} sessions to date)`, type: 'review' },
    ],
    'Fundraising Maturity': [
      { date: 'Week 1', event: 'Stakeholder interview schedule confirmed', type: 'session' },
      { date: 'Week 3', event: 'Benchmarking analysis against peer organizations', type: 'deliverable' },
      { date: 'Week 6', event: 'Gap analysis and scoring completed', type: 'deliverable' },
      { date: 'Week 10', event: 'Final assessment presented to board', type: 'review' },
    ],
    'Annual Fund': [
      { date: 'Week 2', event: 'Annual fund performance audit completed', type: 'deliverable' },
      { date: 'Week 4', event: 'Donor segmentation and giving analysis', type: 'deliverable' },
      { date: 'Week 8', event: 'Appeal calendar and messaging framework', type: 'deliverable' },
      { date: 'Month 3', event: 'Thank-you sequence and stewardship plan launched', type: 'deliverable' },
    ],
  };

  const specific = typeEvents[eng.type] || [
    { date: 'Week 2', event: 'Initial assessment and discovery phase', type: 'session' as const },
    { date: 'Month 1', event: 'First deliverable milestone', type: 'deliverable' as const },
    { date: 'Midpoint', event: 'Progress review with client leadership', type: 'review' as const },
  ];

  events.push(...specific);
  events.push({ date: `${eng.sessions} sessions`, event: 'Client working sessions conducted to date', type: 'session' });
  events.push({ date: eng.endDate, event: 'Target engagement completion', type: 'milestone' });

  return events;
}

const STATUS_ICON = { complete: CheckCircle, 'in-progress': AlertCircle, pending: Circle };
const STATUS_COLOR = { complete: '#10b981', 'in-progress': '#f59e0b', pending: 'var(--pi-text-faint)' };

export default function EngagementDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const eng = ENGAGEMENTS.find(e => e.id === id) ?? ENGAGEMENTS[0];
  const budgetPct = Math.min((eng.spent / eng.budget) * 100, 100);
  const consultant = CONSULTANTS.find(c => c.name === eng.leadConsultant);

  // Build deliverables for this engagement
  const deliverableNames = DELIVERABLE_NAMES[eng.type] || Array.from({ length: eng.deliverables }, (_, i) => `Deliverable ${i + 1}`);
  const deliverables = deliverableNames.slice(0, eng.deliverables).map((name, i) => ({
    name,
    status: i < eng.completedDeliverables ? 'complete' as const : i === eng.completedDeliverables ? 'in-progress' as const : 'pending' as const,
  }));

  // Contract details
  const contractType = eng.budget > 100000 ? 'Retainer' : eng.budget > 30000 ? 'Fixed Fee' : 'Hourly';
  const billingFrequency = contractType === 'Retainer' ? 'Monthly' : contractType === 'Fixed Fee' ? 'Milestone-based' : 'Monthly';

  // Timeline
  const timeline = getTimelineEvents(eng);

  return (
    <PhoenixPage title={eng.clientName} subtitle={eng.title} accentColor="#c9942b">
      <Link href="/phoenix-intel/engagements" className="pi-body" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--pi-sapphire)', textDecoration: 'none', marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Engagements
      </Link>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Calendar, label: 'Duration', value: `${eng.startDate} → ${eng.endDate}`, color: '#3b6bf5' },
          { icon: DollarSign, label: 'Budget', value: `$${(eng.budget / 1000).toFixed(0)}K`, color: '#10b981' },
          { icon: FileText, label: 'Deliverables', value: `${eng.completedDeliverables}/${eng.deliverables}`, color: '#c9942b' },
          { icon: Users, label: 'Lead', value: eng.leadConsultant, color: '#7c3aed' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="phoenix-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ background: `${card.color}18`, borderRadius: 6, padding: 4, display: 'flex' }}><Icon size={14} color={card.color} /></div>
                <span className="pi-overline">{card.label}</span>
              </div>
              <div className="pi-label">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Progress & Budget */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <h3 className="pi-section-title">Progress & Budget</h3>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span className="pi-body-muted">Overall Progress</span>
            <span className="pi-label">{eng.progress}%</span>
          </div>
          <div className="pi-bar-track" style={{ height: 10, borderRadius: 5 }}>
            <div className="pi-bar-fill" style={{ width: `${eng.progress}%`, background: '#3b6bf5', borderRadius: 5 }} />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span className="pi-body-muted">Budget Burn: ${(eng.spent / 1000).toFixed(1)}K of ${(eng.budget / 1000).toFixed(0)}K</span>
            <span className="pi-label" style={{ color: budgetPct > 90 ? '#ef4444' : '#10b981' }}>{budgetPct.toFixed(0)}%</span>
          </div>
          <div className="pi-bar-track" style={{ height: 10, borderRadius: 5 }}>
            <div className="pi-bar-fill" style={{ width: `${budgetPct}%`, background: budgetPct > 90 ? '#ef4444' : '#10b981', borderRadius: 5 }} />
          </div>
        </div>
      </div>

      {/* Two-column layout: Deliverables + Scope & Contract */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Deliverables Checklist */}
        <div className="phoenix-card">
          <h3 className="pi-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={16} color="#c9942b" /> Deliverables
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {deliverables.map((d, i) => {
              const Icon = STATUS_ICON[d.status];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
                  <Icon size={14} color={STATUS_COLOR[d.status]} />
                  <span className="pi-body" style={{
                    color: d.status === 'complete' ? 'var(--pi-text-muted)' : 'var(--pi-text)',
                    textDecoration: d.status === 'complete' ? 'line-through' : 'none',
                    fontWeight: d.status === 'in-progress' ? 600 : 400,
                  }}>{d.name}</span>
                  {d.status === 'in-progress' && (
                    <span className="pi-badge" style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: 'var(--pi-fs-overline)' }}>IN PROGRESS</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scope & Contract */}
        <div className="phoenix-card">
          <h3 className="pi-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Briefcase size={16} color="#3b6bf5" /> Scope & Contract
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Engagement Type', value: eng.type },
              { label: 'Contract Type', value: contractType },
              { label: 'Billing Frequency', value: billingFrequency },
              { label: 'Sessions Conducted', value: `${eng.sessions} sessions` },
              { label: 'Status', value: eng.status.charAt(0).toUpperCase() + eng.status.slice(1) },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid var(--pi-border-faint)' }}>
                <span className="pi-label-muted">{row.label}</span>
                <span className="pi-label">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="pi-caption" style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: '#7c3aed08', border: '1px solid #7c3aed20' }}>
            <strong style={{ color: '#7c3aed' }}>Auto-populated:</strong> PM worksheet, billing schedule, and deliverable tracker generated from signed engagement letter.
          </div>
        </div>
      </div>

      {/* Team Mini-Section */}
      {consultant && (
        <div className="phoenix-card" style={{ marginBottom: 20 }}>
          <h3 className="pi-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color="#7c3aed" /> Team
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#7c3aed18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#7c3aed', fontSize: '0.85rem' }}>
              {consultant.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1 }}>
              <div className="pi-label">{consultant.name}</div>
              <div className="pi-body-muted">{consultant.title} &middot; {consultant.specialty}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                <Activity size={12} color={consultant.utilization > 90 ? '#ef4444' : '#10b981'} />
                <span className="pi-label" style={{ color: consultant.utilization > 90 ? '#ef4444' : 'var(--pi-text)' }}>{consultant.utilization}%</span>
              </div>
              <div className="pi-overline" style={{ textTransform: 'none' }}>Utilization</div>
              {consultant.utilization > 90 && (
                <div className="pi-overline" style={{ color: '#ef4444', textTransform: 'none', marginTop: 2 }}>Near capacity</div>
              )}
            </div>
          </div>
          <div className="pi-caption" style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <span>{consultant.activeEngagements} active engagements</span>
            <span>{consultant.yearsExperience} years experience</span>
          </div>
        </div>
      )}

      {/* Activity Feed / Timeline */}
      <div className="phoenix-card">
        <h3 className="pi-section-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={16} color="#c9942b" /> Activity Feed
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {timeline.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                background: t.type === 'milestone' ? '#3b6bf5' : t.type === 'deliverable' ? '#10b981' : t.type === 'review' ? '#7c3aed' : '#c9942b',
              }} />
              <div>
                <div className="pi-label-muted">{t.date}</div>
                <div className="pi-body">{t.event}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="pi-overline" style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--pi-border-faint)', textTransform: 'none' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b6bf5' }} /> Milestone</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Deliverable</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }} /> Review</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9942b' }} /> Session</span>
        </div>
      </div>
    </PhoenixPage>
  );
}
