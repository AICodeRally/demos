'use client';

import { useState } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard } from '@/components/demos/proofline';
import {
  MGMT_INQUIRIES,
  STATUS_CONFIG,
  CATEGORY_LABELS,
  type Inquiry,
  type InquiryStatus,
  type InquiryCategory,
} from '@/data/proofline';
import { fmt } from '@/lib/utils';

const ACT5_ACCENT = '#0EA5E9';

// ── 3-Step Timeline ───────────────────────────────
function InquiryTimeline({ inquiry }: { inquiry: Inquiry }) {
  const steps = [
    { label: 'Submitted', date: inquiry.submittedDate, done: true },
    { label: 'Under Review', date: inquiry.reviewerName ? 'Assigned' : 'Pending', done: !!inquiry.reviewerName },
    { label: 'Resolved', date: inquiry.resolvedDate ?? 'Pending', done: inquiry.status === 'resolved' },
  ];

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{
              background: step.done ? '#22C55E' : 'var(--pl-chart-bar-track)',
              color: step.done ? 'white' : 'var(--pl-text-faint)',
            }}>
              {step.done ? '\u2713' : i + 1}
            </div>
            <div className="text-[8px] font-mono mt-0.5" style={{ color: step.done ? '#22C55E' : 'var(--pl-text-faint)' }}>{step.label}</div>
            <div className="text-[7px] font-mono" style={{ color: '#CBD5E0' }}>{step.date}</div>
          </div>
          {i < steps.length - 1 && (
            <div className="w-8 h-0.5 mx-1" style={{ background: step.done ? '#22C55E' : 'var(--pl-border)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────
export default function MgmtInquiriesPage() {
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<InquiryCategory | 'all'>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openCount = MGMT_INQUIRIES.filter(i => i.status === 'open').length;
  const reviewCount = MGMT_INQUIRIES.filter(i => i.status === 'under-review').length;
  const resolvedCount = MGMT_INQUIRIES.filter(i => i.status === 'resolved').length;
  const escalatedCount = MGMT_INQUIRIES.filter(i => i.status === 'escalated').length;
  const avgResolutionDays = 2.1;
  const totalImpact = MGMT_INQUIRIES
    .filter(i => i.impactAmount && i.impactAmount > 0)
    .reduce((s, i) => s + (i.impactAmount ?? 0), 0);

  // Status filter tabs config
  const STATUS_TABS: { id: InquiryStatus | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: MGMT_INQUIRIES.length },
    { id: 'open', label: 'Open', count: openCount },
    { id: 'under-review', label: 'Under Review', count: reviewCount },
    { id: 'resolved', label: 'Resolved', count: resolvedCount },
    { id: 'escalated', label: 'Escalated', count: escalatedCount },
  ];

  // Apply filters
  const filteredInquiries = MGMT_INQUIRIES.filter(i => {
    const statusMatch = statusFilter === 'all' || i.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || i.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  return (
    <>
      <ActNavigation currentAct={5} />

      {/* Header */}
      <div className="mt-6 mb-6">
        <div className="text-[10px] tracking-[3px] uppercase font-mono mb-1" style={{ color: ACT5_ACCENT }}>
          Sales Comp Management &middot; Inquiries
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--pl-text)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Compensation Inquiries
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--pl-text-muted)' }}>
          {MGMT_INQUIRIES.length} total inquiries &middot; {avgResolutionDays}-day avg resolution &middot; Transparent 3-step process
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="Open" value={String(openCount)} accent="#2563EB" sub="Awaiting review" />
        <LightKpiCard label="Under Review" value={String(reviewCount)} accent="#F59E0B" sub="Manager assigned" />
        <LightKpiCard label="Resolved" value={String(resolvedCount)} accent="#22C55E" sub="This quarter" />
        <LightKpiCard label="Escalated" value={String(escalatedCount)} accent="#F87171" sub="Needs VP review" />
        <LightKpiCard label="Avg Resolution" value={`${avgResolutionDays}d`} accent={ACT5_ACCENT} sub="Target: <3 days" />
      </div>

      {/* Resolution Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-lg border p-4 text-center" style={{ borderColor: 'var(--pl-border)' }}>
          <div className="text-[9px] font-bold font-mono mb-1" style={{ color: '#2563EB' }}>BY CATEGORY</div>
          {Object.entries(CATEGORY_LABELS).slice(0, 4).map(([key, label]) => {
            const count = MGMT_INQUIRIES.filter(i => i.category === key).length;
            return (
              <div key={key} className="flex justify-between text-[10px] py-0.5">
                <span style={{ color: 'var(--pl-text-muted)' }}>{label}</span>
                <span className="font-mono font-bold" style={{ color: 'var(--pl-text)' }}>{count}</span>
              </div>
            );
          })}
        </div>
        <div className="rounded-lg border p-4 text-center" style={{ borderColor: 'var(--pl-border)' }}>
          <div className="text-[9px] font-bold font-mono mb-1" style={{ color: '#22C55E' }}>RESOLUTION RATE</div>
          <div className="text-[28px] font-bold font-mono" style={{ color: '#22C55E' }}>{((resolvedCount / MGMT_INQUIRIES.length) * 100).toFixed(0)}%</div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>{resolvedCount} of {MGMT_INQUIRIES.length} resolved</div>
        </div>
        <div className="rounded-lg border p-4 text-center" style={{ borderColor: 'var(--pl-border)' }}>
          <div className="text-[9px] font-bold font-mono mb-1" style={{ color: ACT5_ACCENT }}>TOTAL $ IMPACT</div>
          <div className="text-[28px] font-bold font-mono" style={{ color: 'var(--pl-text)' }}>${fmt(totalImpact)}</div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--pl-text-muted)' }}>pending + resolved adjustments</div>
        </div>
      </div>

      {/* Status Filter Tabs + Category Dropdown */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        {/* Status Tabs */}
        <div className="flex gap-0 rounded-lg overflow-hidden" style={{ background: 'var(--pl-hover)', border: '1px solid var(--pl-border)' }}>
          {STATUS_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className="px-3 py-2 text-[11px] font-semibold transition-all flex items-center gap-1.5"
              style={{
                background: statusFilter === tab.id ? `${ACT5_ACCENT}15` : 'transparent',
                borderBottom: statusFilter === tab.id ? `2px solid ${ACT5_ACCENT}` : '2px solid transparent',
                color: statusFilter === tab.id ? ACT5_ACCENT : 'var(--pl-text-muted)',
              }}
            >
              {tab.label}
              <span
                className="text-[9px] font-mono px-1 py-0.5 rounded"
                style={{
                  background: statusFilter === tab.id ? `${ACT5_ACCENT}20` : 'var(--pl-chart-bar-track)',
                  color: statusFilter === tab.id ? ACT5_ACCENT : 'var(--pl-text-faint)',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as InquiryCategory | 'all')}
          className="text-[11px] rounded-lg px-3 py-2 font-medium"
          style={{
            background: 'var(--pl-chart-bar-track)',
            color: 'var(--pl-text)',
            border: '1px solid var(--pl-border)',
          }}
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Filtered Inquiry Cards */}
      <LightSectionCard title={`Inquiries (${filteredInquiries.length})`} className="mb-6">
        {filteredInquiries.length === 0 ? (
          <div className="py-8 text-center text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
            No inquiries match the current filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInquiries.map(inquiry => {
              const statusCfg = STATUS_CONFIG[inquiry.status];
              const isExpanded = expandedIds.has(inquiry.id);
              return (
                <div
                  key={inquiry.id}
                  className="rounded-lg border transition-all cursor-pointer"
                  style={{
                    borderColor: inquiry.status === 'escalated' ? 'rgba(248,113,113,0.3)' : 'var(--pl-border)',
                  }}
                  onClick={() => toggleExpand(inquiry.id)}
                >
                  {/* Card Header — always visible */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                            style={{ background: statusCfg.bg, color: statusCfg.color }}>
                            {statusCfg.label}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--pl-chart-bar-track)', color: 'var(--pl-text-muted)' }}>
                            {CATEGORY_LABELS[inquiry.category]}
                          </span>
                          <span className="text-[10px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>{inquiry.id}</span>
                        </div>
                        <h4 className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{inquiry.subject}</h4>
                        <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--pl-text-muted)' }}>
                          {inquiry.repName} ({inquiry.routeId}) &middot; {inquiry.submittedDate}
                          {inquiry.reviewerName && <> &middot; Reviewer: {inquiry.reviewerName}</>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {inquiry.impactAmount !== null && (
                          <div className="text-right">
                            <div className="text-[14px] font-bold font-mono"
                              style={{ color: inquiry.impactAmount > 0 ? '#F59E0B' : '#22C55E' }}>
                              {inquiry.impactAmount > 0 ? `+$${fmt(inquiry.impactAmount)}` : `-$${fmt(Math.abs(inquiry.impactAmount))}`}
                            </div>
                            <div className="text-[9px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>$ impact</div>
                          </div>
                        )}
                        <div className="text-[10px]" style={{ color: 'var(--pl-text-faint)' }}>
                          {isExpanded ? '\u25B4' : '\u25BE'}
                        </div>
                      </div>
                    </div>

                    {/* Timeline — always visible */}
                    <InquiryTimeline inquiry={inquiry} />
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--pl-border)' }}>
                      <p className="text-[11px] mt-3 mb-3" style={{ color: 'var(--pl-text-secondary)' }}>
                        {inquiry.description}
                      </p>
                      {inquiry.resolution && (
                        <div className="rounded-md px-3 py-2" style={{ background: 'rgba(34,197,94,0.04)', borderLeft: '3px solid #22C55E' }}>
                          <div className="text-[9px] font-bold font-mono mb-0.5" style={{ color: '#22C55E' }}>RESOLUTION</div>
                          <p className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>{inquiry.resolution}</p>
                        </div>
                      )}
                      {!inquiry.resolution && (
                        <div className="rounded-md px-3 py-2" style={{ background: `${ACT5_ACCENT}08`, borderLeft: `3px solid ${ACT5_ACCENT}` }}>
                          <div className="text-[9px] font-bold font-mono mb-0.5" style={{ color: ACT5_ACCENT }}>PENDING</div>
                          <p className="text-[11px]" style={{ color: 'var(--pl-text-secondary)' }}>
                            This inquiry is {inquiry.status === 'escalated' ? 'escalated for VP review' : inquiry.status === 'under-review' ? 'currently under manager review' : 'awaiting assignment'}. Resolution notes will appear here when complete.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </LightSectionCard>

      {/* Methodology */}
      <div className="text-[11px] font-mono" style={{ color: 'var(--pl-text-faint)' }}>
        PROOFLINE inquiry management follows a 3-step process: Submit &rarr; Review &rarr; Resolve. Target SLA is &lt;3 business days.
        All inquiries are tracked with full audit trail. Escalations go to VP Sales Ops. Impact amounts are calculated based
        on the comp plan and applied retroactively when resolved in the rep&apos;s favor.
      </div>
    </>
  );
}
