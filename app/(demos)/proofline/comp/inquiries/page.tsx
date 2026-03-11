'use client';

import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import { fmt } from '@/lib/utils';

/* ── Inquiry Data (inline since this is the only consumer) ── */
type InquiryStatus = 'open' | 'under-review' | 'resolved' | 'escalated';
type InquiryCategory = 'data-error' | 'gate-dispute' | 'territory-credit' | 'kicker-eligibility' | 'other';

interface Inquiry {
  id: string;
  repName: string;
  routeId: string;
  category: InquiryCategory;
  subject: string;
  description: string;
  submittedDate: string;
  status: InquiryStatus;
  reviewerName: string | null;
  resolution: string | null;
  resolvedDate: string | null;
  impactAmount: number | null; // $ impact if resolved in rep's favor
}

const INQUIRIES: Inquiry[] = [
  {
    id: 'INQ-001', repName: 'Marcus Reyes', routeId: 'DAL-03', category: 'data-error',
    subject: 'Missing cases from Cedar Springs Tap House delivery',
    description: 'Feb 18 delivery of 12 cases Corona Extra not credited to my route. POD attached. Store confirmed receipt. Affects my Import gate by 2pp.',
    submittedDate: '2026-02-20', status: 'resolved', reviewerName: 'Sarah Chen',
    resolution: '12 cases Corona Extra credited. Import gate recalculated from 82% to 84%. No tier impact.',
    resolvedDate: '2026-02-22', impactAmount: 340,
  },
  {
    id: 'INQ-002', repName: 'Rosa Gutierrez', routeId: 'LAR-01', category: 'territory-credit',
    subject: 'El Mercado delivery credited to LAR-02 instead of LAR-01',
    description: 'El Mercado #3 is on my route (LAR-01) but Feb 23 delivery of 28 cases was credited to Eduardo on LAR-02. This account has been mine since Laredo integration.',
    submittedDate: '2026-02-25', status: 'under-review', reviewerName: 'Roberto Garza',
    resolution: null, resolvedDate: null, impactAmount: 820,
  },
  {
    id: 'INQ-003', repName: 'Jake Williams', routeId: 'FTW-05', category: 'gate-dispute',
    subject: 'Emerging gate calculation missing Firestone Walker cases',
    description: 'My emerging gate shows 68% but Firestone Walker 805 cases from 3 accounts are not counting toward craft. These are craft brands and should be in my emerging category.',
    submittedDate: '2026-02-26', status: 'open', reviewerName: null,
    resolution: null, resolvedDate: null, impactAmount: 1200,
  },
  {
    id: 'INQ-004', repName: 'Kim Tran', routeId: 'DAL-02', category: 'kicker-eligibility',
    subject: 'Cinco de Mayo kicker should include Pacifico',
    description: 'Kicker definition says "Corona + Modelo volume" but I have 40 incremental cases of Pacifico which is also a Constellation import. Should Pacifico count toward the Cinco de Mayo kicker?',
    submittedDate: '2026-02-27', status: 'escalated', reviewerName: 'Sarah Chen',
    resolution: null, resolvedDate: null, impactAmount: 2800,
  },
  {
    id: 'INQ-005', repName: 'Derek Thompson', routeId: 'DAL-01', category: 'data-error',
    subject: 'Duplicate credit for Henderson Ave delivery',
    description: 'I was credited twice for a Feb 15 delivery to Henderson Ave. Overstated my revenue by $450. Flagging proactively — want my numbers accurate.',
    submittedDate: '2026-02-18', status: 'resolved', reviewerName: 'Sarah Chen',
    resolution: 'Duplicate removed. Revenue adjusted. No tier or gate impact. Noted for proactive integrity — positive coaching note added.',
    resolvedDate: '2026-02-19', impactAmount: -450,
  },
  {
    id: 'INQ-006', repName: 'Tommy Nguyen', routeId: 'ALN-01', category: 'territory-credit',
    subject: 'New Total Wine account should be on ALN-01 not ALN-03',
    description: 'Total Wine at Allen Premium Outlets was assigned to ALN-03 but it is in my territory ZIP code. I had initial meeting with store manager and submitted new account request.',
    submittedDate: '2026-02-28', status: 'open', reviewerName: null,
    resolution: null, resolvedDate: null, impactAmount: 3600,
  },
];

const STATUS_CONFIG: Record<InquiryStatus, { bg: string; color: string; label: string }> = {
  'open': { bg: 'rgba(37,99,235,0.1)', color: '#2563EB', label: 'OPEN' },
  'under-review': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'REVIEWING' },
  'resolved': { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', label: 'RESOLVED' },
  'escalated': { bg: 'rgba(248,113,113,0.1)', color: '#F87171', label: 'ESCALATED' },
};

const CATEGORY_LABELS: Record<InquiryCategory, string> = {
  'data-error': 'Data Error',
  'gate-dispute': 'Gate Dispute',
  'territory-credit': 'Territory Credit',
  'kicker-eligibility': 'Kicker Eligibility',
  'other': 'Other',
};

/* ── 3-Step Timeline ─────────────────────────── */
function InquiryTimeline({ inquiry }: { inquiry: Inquiry }) {
  const steps = [
    { label: 'Submitted', date: inquiry.submittedDate, done: true },
    { label: 'Under Review', date: inquiry.reviewerName ? 'Assigned' : 'Pending', done: !!inquiry.reviewerName },
    { label: 'Resolved', date: inquiry.resolvedDate ?? 'Pending', done: inquiry.status === 'resolved' },
  ];

  return (
    <>
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{
              background: step.done ? '#22C55E' : '#F1F5F9',
              color: step.done ? 'white' : '#A0AEC0',
            }}>
              {step.done ? '\u2713' : i + 1}
            </div>
            <div className="text-xs font-mono mt-0.5" style={{ color: step.done ? '#22C55E' : '#A0AEC0' }}>{step.label}</div>
            <div className="text-xs font-mono" style={{ color: '#CBD5E0' }}>{step.date}</div>
          </div>
          {i < steps.length - 1 && (
            <div className="w-8 h-0.5 mx-1" style={{ background: step.done ? '#22C55E' : '#E2E8F0' }} />
          )}
        </div>
      ))}
    </div>
    </>
  );
}

export default function InquiryManagementPage() {
  const openCount = INQUIRIES.filter(i => i.status === 'open').length;
  const reviewCount = INQUIRIES.filter(i => i.status === 'under-review').length;
  const resolvedCount = INQUIRIES.filter(i => i.status === 'resolved').length;
  const escalatedCount = INQUIRIES.filter(i => i.status === 'escalated').length;
  const avgResolutionDays = 2.1; // simulated
  const totalImpact = INQUIRIES.filter(i => i.impactAmount && i.impactAmount > 0).reduce((s, i) => s + (i.impactAmount ?? 0), 0);

  return (
    <>
    
      <ActNavigation currentAct={4} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-xs tracking-[3px] uppercase font-mono mb-1" style={{ color: '#10B981' }}>
          Inquiry Management &middot; Dispute Resolution
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#1A1A2E', fontFamily: 'var(--pl-font)' }}>
          Compensation Inquiries
        </h1>
        <p className="text-[13px] mt-1" style={{ color: '#718096' }}>
          {INQUIRIES.length} total inquiries &middot; {avgResolutionDays}-day avg resolution &middot; Transparent 3-step process
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6 items-stretch">
        <LightKpiCard label="Open" value={String(openCount)} accent="#2563EB" sub="Awaiting review" />
        <LightKpiCard label="Under Review" value={String(reviewCount)} accent="#F59E0B" sub="Manager assigned" />
        <LightKpiCard label="Resolved" value={String(resolvedCount)} accent="#22C55E" sub="This quarter" />
        <LightKpiCard label="Escalated" value={String(escalatedCount)} accent="#F87171" sub="Needs VP review" />
        <LightKpiCard label="Avg Resolution" value={`${avgResolutionDays}d`} accent="#10B981" sub="Target: <3 days" />
      </div>

      {/* Resolution Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg border p-4 text-center" style={{ borderColor: '#E2E8F0' }}>
          <div className="text-xs font-bold font-mono mb-1" style={{ color: '#2563EB' }}>BY CATEGORY</div>
          {Object.entries(CATEGORY_LABELS).slice(0, 4).map(([key, label]) => {
            const count = INQUIRIES.filter(i => i.category === key).length;
            return (
              <div key={key} className="flex justify-between text-xs py-0.5">
                <span style={{ color: '#718096' }}>{label}</span>
                <span className="font-mono font-bold" style={{ color: '#1A1A2E' }}>{count}</span>
              </div>
            );
          })}
        </div>
        <div className="rounded-lg border p-4 text-center" style={{ borderColor: '#E2E8F0' }}>
          <div className="text-xs font-bold font-mono mb-1" style={{ color: '#22C55E' }}>RESOLUTION RATE</div>
          <div className="text-[28px] font-bold font-mono" style={{ color: '#22C55E' }}>{((resolvedCount / INQUIRIES.length) * 100).toFixed(0)}%</div>
          <div className="text-xs font-mono" style={{ color: '#718096' }}>{resolvedCount} of {INQUIRIES.length} resolved</div>
        </div>
        <div className="rounded-lg border p-4 text-center" style={{ borderColor: '#E2E8F0' }}>
          <div className="text-xs font-bold font-mono mb-1" style={{ color: '#10B981' }}>TOTAL $ IMPACT</div>
          <div className="text-[28px] font-bold font-mono" style={{ color: '#1A1A2E' }}>${fmt(totalImpact)}</div>
          <div className="text-xs font-mono" style={{ color: '#718096' }}>pending + resolved adjustments</div>
        </div>
      </div>

      {/* Inquiry Cards */}
      <LightSectionCard title="Active & Recent Inquiries" className="mb-6">
        <div className="space-y-3">
          {INQUIRIES.map(inquiry => {
            const statusCfg = STATUS_CONFIG[inquiry.status];
            return (
              <div key={inquiry.id} className="rounded-lg border p-4" style={{
                borderColor: inquiry.status === 'escalated' ? 'rgba(248,113,113,0.3)' : '#E2E8F0',
              }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold font-mono px-1.5 py-0.5 rounded" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                        {statusCfg.label}
                      </span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: '#F1F5F9', color: '#718096' }}>
                        {CATEGORY_LABELS[inquiry.category]}
                      </span>
                      <span className="text-xs font-mono" style={{ color: '#A0AEC0' }}>{inquiry.id}</span>
                    </div>
                    <h4 className="text-[13px] font-bold" style={{ color: '#1A1A2E' }}>{inquiry.subject}</h4>
                    <div className="text-xs font-mono mt-0.5" style={{ color: '#718096' }}>
                      {inquiry.repName} ({inquiry.routeId}) &middot; {inquiry.submittedDate}
                      {inquiry.reviewerName && <> &middot; Reviewer: {inquiry.reviewerName}</>}
                    </div>
                  </div>
                  {inquiry.impactAmount !== null && (
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-[14px] font-bold font-mono" style={{
                        color: inquiry.impactAmount > 0 ? '#F59E0B' : '#22C55E'
                      }}>
                        {inquiry.impactAmount > 0 ? `+$${fmt(inquiry.impactAmount)}` : `-$${fmt(Math.abs(inquiry.impactAmount))}`}
                      </div>
                      <div className="text-xs font-mono" style={{ color: '#A0AEC0' }}>$ impact</div>
                    </div>
                  )}
                </div>

                <p className="text-[13px] mb-3" style={{ color: '#4A5568' }}>{inquiry.description}</p>

                {/* Timeline */}
                <div className="mb-2">
                  <InquiryTimeline inquiry={inquiry} />
                </div>

                {/* Resolution */}
                {inquiry.resolution && (
                  <div className="rounded-md px-3 py-2" style={{ background: 'rgba(34,197,94,0.04)', borderLeft: '3px solid #22C55E' }}>
                    <div className="text-xs font-bold font-mono mb-0.5" style={{ color: '#22C55E' }}>RESOLUTION</div>
                    <p className="text-[13px]" style={{ color: '#4A5568' }}>{inquiry.resolution}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[13px] font-mono" style={{ color: '#A0AEC0' }}>
        PROOFLINE inquiry management follows a 3-step process: Submit → Review → Resolve. Target SLA is &lt;3 business days.
        All inquiries are tracked with full audit trail. Escalations go to VP Sales Ops. Impact amounts are calculated based
        on the comp plan and applied retroactively when resolved in the rep&apos;s favor.
      </div>
    
    </>
  );
}
