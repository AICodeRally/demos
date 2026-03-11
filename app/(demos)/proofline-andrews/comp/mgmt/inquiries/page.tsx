'use client';

import { useState, useEffect } from 'react';
import { ActNavigation, LightSectionCard, LightKpiCard, ProofDonutChart } from '@/components/demos/proofline';
import {
  MGMT_INQUIRIES,
  STATUS_CONFIG,
  CATEGORY_LABELS,
  type Inquiry,
  type InquiryStatus,
  type InquiryCategory,
} from '@/data/proofline';
import { fmt } from '@/lib/utils';

/* ── Color palette ──────────────────────────────── */
const STATUS_COLORS: Record<string, string> = {
  open: '#3B82F6',          // blue for new
  'under-review': '#F59E0B', // amber for pending
  resolved: '#22C55E',       // green for resolved
  escalated: '#EF4444',      // red for escalated
};

const PRIORITY_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  escalated: { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.25)', icon: '!!' },
  'under-review': { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.20)', icon: '~' },
  open: { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.20)', icon: '+' },
  resolved: { bg: 'rgba(34,197,94,0.04)', border: 'rgba(34,197,94,0.15)', icon: '\u2713' },
};

/* ── Animated Timeline ──────────────────────────── */
function InquiryTimeline({ inquiry, animate }: { inquiry: Inquiry; animate: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!animate) { setStep(3); return; }
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 300);
    const t2 = setTimeout(() => setStep(2), 700);
    const t3 = setTimeout(() => setStep(3), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [animate]);

  const steps = [
    { label: 'Submitted', date: inquiry.submittedDate, done: true, color: '#3B82F6' },
    { label: 'Under Review', date: inquiry.reviewerName ? 'Assigned' : 'Pending', done: !!inquiry.reviewerName, color: '#F59E0B' },
    { label: 'Resolved', date: inquiry.resolvedDate ?? 'Pending', done: inquiry.status === 'resolved', color: '#22C55E' },
  ];

  return (
    <div className="flex items-center gap-0 mt-2">
      {steps.map((s, i) => {
        const visible = step > i;
        const active = s.done;
        return (
          <div key={s.label} className="flex items-center">
            <div className="flex flex-col items-center" style={{
              opacity: visible ? 1 : 0.3,
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              transform: visible ? 'translateY(0)' : 'translateY(4px)',
            }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: active ? s.color : 'var(--pl-chart-bar-track)',
                  color: active ? 'white' : 'var(--pl-text-faint)',
                  boxShadow: active ? `0 0 8px ${s.color}40` : 'none',
                }}>
                {active ? '\u2713' : i + 1}
              </div>
              <div className="text-xs font-mono font-semibold mt-1" style={{ color: active ? s.color : 'var(--pl-text-faint)' }}>{s.label}</div>
              <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>{s.date}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="w-10 h-0.5 mx-1 rounded-full overflow-hidden" style={{ background: 'var(--pl-border)' }}>
                <div style={{
                  width: active ? '100%' : '0%',
                  height: '100%',
                  background: `linear-gradient(to right, ${s.color}, ${steps[i + 1].color})`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Submit Inquiry Demo ────────────────────────── */
function SubmitInquiryDemo() {
  const [formStep, setFormStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setFormStep(0); }, 3000);
  };

  return (
    <div className="rounded-xl p-5" style={{
      background: 'linear-gradient(135deg, rgba(59,130,246,0.04), rgba(34,197,94,0.04))',
      border: '1px solid var(--pl-border)',
    }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>+</div>
        <div>
          <div className="text-sm font-bold" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
            Submit New Inquiry
          </div>
          <div className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>Interactive demo — try it out</div>
        </div>
      </div>

      {submitted ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-2" style={{
            animation: 'pulse 1s ease-in-out infinite',
          }}>
            <span style={{ color: '#22C55E', fontSize: '32px', fontWeight: 'bold' }}>{'\u2713'}</span>
          </div>
          <div className="text-sm font-bold" style={{ color: '#22C55E' }}>Inquiry Submitted Successfully!</div>
          <div className="text-[13px] font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>
            Ticket #INQ-025 created. Expected resolution: 2-3 business days.
          </div>
        </div>
      ) : (
        <>
          {/* Step indicators */}
          <div className="flex gap-2 mb-4">
            {['Category', 'Details', 'Review'].map((label, i) => (
              <button key={label} onClick={() => setFormStep(i)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-all"
                style={{
                  background: formStep >= i ? `${STATUS_COLORS.open}15` : 'var(--pl-card-alt)',
                  color: formStep >= i ? STATUS_COLORS.open : 'var(--pl-text-faint)',
                  border: `1px solid ${formStep === i ? STATUS_COLORS.open : 'var(--pl-border)'}`,
                }}>
                {i + 1}. {label}
              </button>
            ))}
          </div>

          {formStep === 0 && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button key={key} onClick={() => setFormStep(1)}
                  className="p-3 rounded-lg text-left transition-all hover:scale-[1.02]"
                  style={{
                    background: 'var(--pl-card-alt)',
                    border: '1px solid var(--pl-border)',
                  }}>
                  <div className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{label}</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--pl-text-faint)' }}>Select category</div>
                </button>
              ))}
            </div>
          )}
          {formStep === 1 && (
            <div className="space-y-3">
              <div className="rounded-lg p-3" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                <div className="text-xs font-mono font-bold mb-1" style={{ color: 'var(--pl-text-muted)' }}>SUBJECT</div>
                <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text)' }}>Missing commission on order #48201</div>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
                <div className="text-xs font-mono font-bold mb-1" style={{ color: 'var(--pl-text-muted)' }}>DESCRIPTION</div>
                <div className="text-[13px] font-mono" style={{ color: 'var(--pl-text)' }}>Order placed 2/15 for 240 cases of Modelo. Commission not showing in my dashboard...</div>
              </div>
              <button onClick={() => setFormStep(2)}
                className="w-full py-2 rounded-lg text-[13px] font-bold transition-all"
                style={{ background: STATUS_COLORS.open, color: 'white' }}>
                Continue to Review
              </button>
            </div>
          )}
          {formStep === 2 && (
            <div className="space-y-3">
              <div className="rounded-lg p-3" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div className="text-xs font-mono font-bold mb-2" style={{ color: STATUS_COLORS.open }}>INQUIRY SUMMARY</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div><span style={{ color: 'var(--pl-text-muted)' }}>Category:</span> <span style={{ color: 'var(--pl-text)' }}>Missing Credit</span></div>
                  <div><span style={{ color: 'var(--pl-text-muted)' }}>Priority:</span> <span style={{ color: '#F59E0B' }}>Medium</span></div>
                  <div><span style={{ color: 'var(--pl-text-muted)' }}>Est. Impact:</span> <span style={{ color: 'var(--pl-text)' }}>$912</span></div>
                  <div><span style={{ color: 'var(--pl-text-muted)' }}>SLA:</span> <span style={{ color: 'var(--pl-text)' }}>3 business days</span></div>
                </div>
              </div>
              <button onClick={handleSubmit}
                className="w-full py-2.5 rounded-lg text-[13px] font-bold transition-all hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                Submit Inquiry
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────  */
export default function MgmtInquiriesPage() {
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<InquiryCategory | 'all'>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

  // Donut chart data
  const donutData = [
    { name: 'Open', value: openCount, color: STATUS_COLORS.open },
    { name: 'Under Review', value: reviewCount, color: STATUS_COLORS['under-review'] },
    { name: 'Resolved', value: resolvedCount, color: STATUS_COLORS.resolved },
    { name: 'Escalated', value: escalatedCount, color: STATUS_COLORS.escalated },
  ];

  // Category filter chips with counts
  const categoryChips = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key,
    label,
    count: MGMT_INQUIRIES.filter(i => i.category === key).length,
  }));

  // Status filter tabs
  const STATUS_TABS: { id: InquiryStatus | 'all'; label: string; count: number; color: string }[] = [
    { id: 'all', label: 'All', count: MGMT_INQUIRIES.length, color: '#8B5CF6' },
    { id: 'open', label: 'New', count: openCount, color: STATUS_COLORS.open },
    { id: 'under-review', label: 'Pending', count: reviewCount, color: STATUS_COLORS['under-review'] },
    { id: 'resolved', label: 'Resolved', count: resolvedCount, color: STATUS_COLORS.resolved },
    { id: 'escalated', label: 'Escalated', count: escalatedCount, color: STATUS_COLORS.escalated },
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

      {/* Hero Header */}
      <div className="mt-6 mb-8 rounded-xl p-6" style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06), rgba(34,197,94,0.04))',
        border: '1px solid var(--pl-border)',
      }}>
        <div className="text-xs tracking-[3px] uppercase font-mono mb-2" style={{ color: '#3B82F6' }}>
          Sales Comp Management &middot; Inquiries
        </div>
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--pl-text)', fontFamily: 'var(--pl-font)' }}>
          Compensation Inquiries
        </h1>
        <p className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
          {MGMT_INQUIRIES.length} total inquiries &middot; {avgResolutionDays}-day avg resolution &middot; Transparent 3-step process
        </p>
      </div>

      {/* KPI Row with color-coded status */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <LightKpiCard label="New" value={String(openCount)} accent={STATUS_COLORS.open} sub="Awaiting review" />
        <LightKpiCard label="Pending" value={String(reviewCount)} accent={STATUS_COLORS['under-review']} sub="Manager assigned" />
        <LightKpiCard label="Resolved" value={String(resolvedCount)} accent={STATUS_COLORS.resolved} sub="This quarter" />
        <LightKpiCard label="Escalated" value={String(escalatedCount)} accent={STATUS_COLORS.escalated} sub="Needs VP review" />
        <LightKpiCard label="Avg Resolution" value={`${avgResolutionDays}d`} accent="#8B5CF6" sub="Target: <3 days" />
      </div>

      {/* Dashboard Row: Donut + Stats + Impact */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Donut Chart */}
        <div className="rounded-xl p-4 flex flex-col items-center" style={{
          background: 'var(--pl-card-alt)',
          border: '1px solid var(--pl-border)',
        }}>
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--pl-text-muted)' }}>
            Status Distribution
          </div>
          <ProofDonutChart data={donutData} size={140} label={`${MGMT_INQUIRIES.length}`} labelColor="var(--pl-text)" />
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {donutData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="text-xs font-mono" style={{ color: 'var(--pl-text-muted)' }}>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="rounded-xl p-4 flex flex-col items-center justify-center" style={{
          background: 'var(--pl-card-alt)',
          border: '1px solid var(--pl-border)',
        }}>
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-2" style={{ color: STATUS_COLORS.resolved }}>
            Resolution Rate
          </div>
          <div className="text-[42px] font-bold font-mono leading-none" style={{ color: STATUS_COLORS.resolved }}>
            {((resolvedCount / MGMT_INQUIRIES.length) * 100).toFixed(0)}%
          </div>
          <div className="text-[13px] font-mono mt-2" style={{ color: 'var(--pl-text-muted)' }}>
            {resolvedCount} of {MGMT_INQUIRIES.length} resolved
          </div>
          <div className="w-full mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
            <div className="h-full rounded-full" style={{
              width: `${(resolvedCount / MGMT_INQUIRIES.length) * 100}%`,
              background: `linear-gradient(to right, ${STATUS_COLORS.resolved}, #10B981)`,
              transition: 'width 1s ease',
            }} />
          </div>
        </div>

        {/* Total $ Impact */}
        <div className="rounded-xl p-4 flex flex-col items-center justify-center" style={{
          background: 'var(--pl-card-alt)',
          border: '1px solid var(--pl-border)',
        }}>
          <div className="text-xs font-bold font-mono uppercase tracking-widest mb-2" style={{ color: '#8B5CF6' }}>
            Total $ Impact
          </div>
          <div className="text-[36px] font-bold font-mono leading-none" style={{ color: 'var(--pl-text)' }}>
            ${fmt(totalImpact)}
          </div>
          <div className="text-[13px] font-mono mt-2" style={{ color: 'var(--pl-text-muted)' }}>
            pending + resolved adjustments
          </div>
          <div className="flex gap-3 mt-3">
            <div className="text-center">
              <div className="text-[14px] font-bold font-mono" style={{ color: STATUS_COLORS['under-review'] }}>
                ${fmt(MGMT_INQUIRIES.filter(i => i.status !== 'resolved' && i.impactAmount && i.impactAmount > 0).reduce((s, i) => s + (i.impactAmount ?? 0), 0))}
              </div>
              <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Pending</div>
            </div>
            <div className="text-center">
              <div className="text-[14px] font-bold font-mono" style={{ color: STATUS_COLORS.resolved }}>
                ${fmt(MGMT_INQUIRIES.filter(i => i.status === 'resolved' && i.impactAmount && i.impactAmount > 0).reduce((s, i) => s + (i.impactAmount ?? 0), 0))}
              </div>
              <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          onClick={() => setCategoryFilter('all')}
          className="px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all"
          style={{
            background: categoryFilter === 'all' ? '#8B5CF620' : 'var(--pl-card-alt)',
            color: categoryFilter === 'all' ? '#8B5CF6' : 'var(--pl-text-muted)',
            border: `1px solid ${categoryFilter === 'all' ? '#8B5CF640' : 'var(--pl-border)'}`,
          }}>
          All ({MGMT_INQUIRIES.length})
        </button>
        {categoryChips.map(chip => (
          <button
            key={chip.key}
            onClick={() => setCategoryFilter(chip.key as InquiryCategory)}
            className="px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all"
            style={{
              background: categoryFilter === chip.key ? '#3B82F620' : 'var(--pl-card-alt)',
              color: categoryFilter === chip.key ? '#3B82F6' : 'var(--pl-text-muted)',
              border: `1px solid ${categoryFilter === chip.key ? '#3B82F640' : 'var(--pl-border)'}`,
            }}>
            {chip.label} ({chip.count})
          </button>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-0 rounded-xl overflow-hidden mb-6" style={{ background: 'var(--pl-card-alt)', border: '1px solid var(--pl-border)' }}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className="px-4 py-2.5 text-[13px] font-semibold transition-all flex items-center gap-2 flex-1 justify-center"
            style={{
              background: statusFilter === tab.id ? `${tab.color}12` : 'transparent',
              borderBottom: statusFilter === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
              color: statusFilter === tab.id ? tab.color : 'var(--pl-text-muted)',
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: tab.color, opacity: statusFilter === tab.id ? 1 : 0.4 }} />
            {tab.label}
            <span className="text-xs font-mono px-1.5 py-0.5 rounded-full"
              style={{
                background: statusFilter === tab.id ? `${tab.color}20` : 'var(--pl-chart-bar-track)',
                color: statusFilter === tab.id ? tab.color : 'var(--pl-text-faint)',
              }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Submit Form */}
      <div className="mb-6">
        <SubmitInquiryDemo />
      </div>

      {/* Filtered Inquiry Cards */}
      <LightSectionCard title={`Inquiries (${filteredInquiries.length})`} className="mb-6">
        {filteredInquiries.length === 0 ? (
          <div className="py-8 text-center text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
            No inquiries match the current filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInquiries.map((inquiry, idx) => {
              const statusCfg = STATUS_CONFIG[inquiry.status];
              const isExpanded = expandedIds.has(inquiry.id);
              const priorityCfg = PRIORITY_COLORS[inquiry.status] ?? PRIORITY_COLORS.open;
              const statusColor = STATUS_COLORS[inquiry.status] ?? '#3B82F6';

              return (
                <div
                  key={inquiry.id}
                  className="rounded-xl transition-all cursor-pointer"
                  style={{
                    background: priorityCfg.bg,
                    border: `1px solid ${isExpanded ? statusColor + '40' : priorityCfg.border}`,
                    boxShadow: isExpanded ? `0 4px 16px ${statusColor}10` : 'none',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                    transition: `all 0.3s ease ${idx * 50}ms`,
                  }}
                  onClick={() => toggleExpand(inquiry.id)}
                >
                  {/* Card Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          {/* Priority indicator */}
                          <div className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
                            style={{ background: statusColor + '20', color: statusColor }}>
                            {priorityCfg.icon}
                          </div>
                          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full"
                            style={{ background: statusColor + '18', color: statusColor }}>
                            {statusCfg.label}
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--pl-chart-bar-track)', color: 'var(--pl-text-muted)' }}>
                            {CATEGORY_LABELS[inquiry.category]}
                          </span>
                          <span className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>{inquiry.id}</span>
                        </div>
                        <h4 className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{inquiry.subject}</h4>
                        <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--pl-text-muted)' }}>
                          {inquiry.repName} ({inquiry.routeId}) &middot; {inquiry.submittedDate}
                          {inquiry.reviewerName && <> &middot; Reviewer: {inquiry.reviewerName}</>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {inquiry.impactAmount !== null && (
                          <div className="text-right">
                            <div className="text-[14px] font-bold font-mono"
                              style={{ color: inquiry.impactAmount > 0 ? STATUS_COLORS['under-review'] : STATUS_COLORS.resolved }}>
                              {inquiry.impactAmount > 0 ? `+$${fmt(inquiry.impactAmount)}` : `-$${fmt(Math.abs(inquiry.impactAmount))}`}
                            </div>
                            <div className="text-xs font-mono" style={{ color: 'var(--pl-text-faint)' }}>$ impact</div>
                          </div>
                        )}
                        <div className="w-6 h-6 rounded-full flex items-center justify-center transition-transform"
                          style={{
                            background: statusColor + '12',
                            color: statusColor,
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}>
                          <span className="text-[13px]">{'\u25BE'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Animated Timeline */}
                    <InquiryTimeline inquiry={inquiry} animate={isExpanded} />
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: statusColor + '20' }}>
                      <p className="text-[13px] mt-3 mb-3 leading-relaxed" style={{ color: 'var(--pl-text-secondary)' }}>
                        {inquiry.description}
                      </p>
                      {inquiry.resolution ? (
                        <div className="rounded-lg px-4 py-3" style={{
                          background: 'rgba(34,197,94,0.06)',
                          borderLeft: `3px solid ${STATUS_COLORS.resolved}`,
                        }}>
                          <div className="text-xs font-bold font-mono mb-1" style={{ color: STATUS_COLORS.resolved }}>RESOLUTION</div>
                          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--pl-text-secondary)' }}>{inquiry.resolution}</p>
                          {inquiry.resolvedDate && (
                            <div className="text-xs font-mono mt-2" style={{ color: 'var(--pl-text-faint)' }}>
                              Resolved on {inquiry.resolvedDate}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-lg px-4 py-3" style={{
                          background: `${statusColor}08`,
                          borderLeft: `3px solid ${statusColor}`,
                        }}>
                          <div className="text-xs font-bold font-mono mb-1" style={{ color: statusColor }}>
                            {inquiry.status === 'escalated' ? 'ESCALATED' : 'PENDING'}
                          </div>
                          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--pl-text-secondary)' }}>
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

      {/* By Category Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {categoryChips.map(chip => {
          const catInquiries = MGMT_INQUIRIES.filter(i => i.category === chip.key);
          const catResolved = catInquiries.filter(i => i.status === 'resolved').length;
          return (
            <div key={chip.key} className="rounded-xl p-4" style={{
              background: 'var(--pl-card-alt)',
              border: '1px solid var(--pl-border)',
            }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold" style={{ color: 'var(--pl-text)' }}>{chip.label}</span>
                <span className="text-xs font-mono font-bold" style={{ color: '#3B82F6' }}>{chip.count}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--pl-chart-bar-track)' }}>
                <div className="h-full rounded-full" style={{
                  width: catInquiries.length > 0 ? `${(catResolved / catInquiries.length) * 100}%` : '0%',
                  background: `linear-gradient(to right, ${STATUS_COLORS.resolved}, #10B981)`,
                }} />
              </div>
              <div className="text-xs font-mono mt-1" style={{ color: 'var(--pl-text-faint)' }}>
                {catResolved}/{catInquiries.length} resolved
              </div>
            </div>
          );
        })}
      </div>

      {/* Methodology */}
      <div className="rounded-xl p-4 text-[13px] font-mono" style={{
        color: 'var(--pl-text-faint)',
        background: 'var(--pl-card-alt)',
        border: '1px solid var(--pl-border)',
      }}>
        PROOFLINE inquiry management follows a 3-step process: Submit &rarr; Review &rarr; Resolve. Target SLA is &lt;3 business days.
        All inquiries are tracked with full audit trail. Escalations go to VP Sales Ops. Impact amounts are calculated based
        on the comp plan and applied retroactively when resolved in the rep&apos;s favor.
      </div>
    </>
  );
}
