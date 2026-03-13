'use client';


import { DISPATCH_JOBS, type DispatchJob, type JobStatus } from '@/data/equipr/dispatch';
import { Truck, CornerDownLeft, Clock } from 'lucide-react';

/* ── Helpers ─────────────────────────────────────────── */

const STATUS_STYLES: Record<JobStatus, { bg: string; text: string; label: string }> = {
  scheduled: { bg: 'rgba(37,99,235,0.10)', text: '#2563EB', label: 'Scheduled' },
  en_route: { bg: 'rgba(245,158,11,0.10)', text: '#D97706', label: 'En Route' },
  complete: { bg: 'rgba(16,185,129,0.10)', text: '#059669', label: 'Complete' },
};

function driverInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function statusCount(status: JobStatus): number {
  return DISPATCH_JOBS.filter((j) => j.status === status).length;
}

/* ── Dispatch Card ───────────────────────────────────── */

function DispatchCard({ job }: { job: DispatchJob }) {
  const st = STATUS_STYLES[job.status];
  const Icon = job.type === 'deliver' ? Truck : CornerDownLeft;

  return (
    <div
      className="rounded-xl p-4 transition-shadow hover:shadow-lg flex flex-col gap-3"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
      }}
    >
      {/* Top row: type + status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            size={16}
            style={{ color: job.type === 'deliver' ? '#2563EB' : '#7C3AED' }}
          />
          <span
            className="text-[11px] uppercase tracking-wider font-semibold"
            style={{ color: job.type === 'deliver' ? '#2563EB' : '#7C3AED' }}
          >
            {job.type === 'deliver' ? 'Delivery' : 'Pickup'}
          </span>
        </div>
        <span
          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
          style={{ background: st.bg, color: st.text }}
        >
          {st.label}
        </span>
      </div>

      {/* Customer */}
      <div
        className="text-[14px] font-bold leading-tight"
        style={{ color: 'var(--prizym-text-primary)' }}
      >
        {job.customerName}
      </div>

      {/* Address */}
      <div
        className="text-[12px] truncate"
        style={{ color: 'var(--prizym-text-muted)' }}
        title={job.address}
      >
        {job.address}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-0.5">
        {job.items.map((item) => (
          <div
            key={item}
            className="text-[12px] flex items-start gap-1.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            <span className="mt-[5px] shrink-0 h-1 w-1 rounded-full bg-current" />
            <span className="leading-snug">{item}</span>
          </div>
        ))}
      </div>

      {/* Time window */}
      <div className="flex items-center gap-1.5">
        <Clock size={13} style={{ color: 'var(--prizym-text-muted)' }} />
        <span
          className="text-[12px] font-medium"
          style={{ color: 'var(--prizym-text-secondary)' }}
        >
          {job.timeWindow}
        </span>
      </div>

      {/* Driver badge */}
      <div
        className="flex items-center gap-2 pt-2 mt-auto"
        style={{ borderTop: '1px solid var(--prizym-border-default)' }}
      >
        <div
          className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: 'rgba(37,99,235,0.10)', color: '#2563EB' }}
        >
          {driverInitials(job.driver)}
        </div>
        <span
          className="text-[12px] font-medium"
          style={{ color: 'var(--prizym-text-secondary)' }}
        >
          {job.driver}
        </span>
      </div>
    </div>
  );
}

/* ── Source Badge ─────────────────────────────────────── */

function SourceBadge({ source, synced }: { source: string; synced: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px]" style={{ color: 'var(--prizym-text-muted)' }}>
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span>{source}</span>
      <span style={{ opacity: 0.5 }}>&bull;</span>
      <span>Synced {synced}</span>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */

export default function DispatchPage() {
  const amJobs = DISPATCH_JOBS.slice(0, 4);
  const pmJobs = DISPATCH_JOBS.slice(4, 8);

  const scheduled = statusCount('scheduled');
  const enRoute = statusCount('en_route');
  const complete = statusCount('complete');

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h1
            className="text-2xl font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Today&apos;s Dispatch &mdash; Mon, Mar 3
          </h1>
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(37,99,235,0.10)', color: '#2563EB' }}
          >
            {DISPATCH_JOBS.length} jobs
          </span>
        </div>
        <div
          className="text-[12px] font-medium"
          style={{ color: 'var(--prizym-text-secondary)' }}
        >
          {scheduled} Scheduled &middot; {enRoute} En Route &middot; {complete} Complete
        </div>
      </div>
      <SourceBadge source="Wynne Systems + Trackunit GPS" synced="Live" />

      {/* Morning Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2
            className="text-[11px] uppercase tracking-[1.5px] font-bold tabular-nums"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Morning (AM)
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--prizym-border-default)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {amJobs.map((job) => (
            <DispatchCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Afternoon Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2
            className="text-[11px] uppercase tracking-[1.5px] font-bold tabular-nums"
            style={{ color: 'var(--prizym-text-muted)' }}
          >
            Afternoon (PM)
          </h2>
          <div className="flex-1 h-px" style={{ background: 'var(--prizym-border-default)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pmJobs.map((job) => (
            <DispatchCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </>
  );
}
