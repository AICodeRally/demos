'use client';

import { useState } from 'react';

import {
  INSPECTIONS,
  type Inspection,
  type InspectionResult,
} from '@/data/equipr/inspections';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/* ── Helpers ─────────────────────────────────────────── */

const RESULT_STYLES: Record<
  InspectionResult,
  { bg: string; text: string; label: string; Icon: typeof CheckCircle }
> = {
  pass: { bg: 'rgba(16,185,129,0.10)', text: '#059669', label: 'Pass', Icon: CheckCircle },
  fail: { bg: 'rgba(239,68,68,0.10)', text: '#DC2626', label: 'Fail', Icon: XCircle },
  flag: { bg: 'rgba(245,158,11,0.10)', text: '#D97706', label: 'Flag', Icon: AlertTriangle },
};

const SEVERITY_STYLES: Record<string, { bg: string; text: string }> = {
  minor: { bg: 'rgba(245,158,11,0.10)', text: '#D97706' },
  moderate: { bg: 'rgba(249,115,22,0.10)', text: '#EA580C' },
  major: { bg: 'rgba(239,68,68,0.10)', text: '#DC2626' },
};

function flaggedCount(inspection: Inspection): number {
  return inspection.items.filter((i) => i.result !== 'pass').length;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── Inspection Card ─────────────────────────────────── */

function InspectionCard({ inspection }: { inspection: Inspection }) {
  const [expanded, setExpanded] = useState(false);
  const overall = inspection.overallResult;
  const flagged = flaggedCount(inspection);

  return (
    <div
      className="rounded-xl transition-shadow hover:shadow-lg overflow-hidden"
      style={{
        background: 'var(--prizym-card-bg)',
        border: '1px solid var(--prizym-border-default)',
        boxShadow: 'var(--prizym-shadow-card)',
      }}
    >
      {/* Summary row */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-center gap-4 cursor-pointer"
      >
        {/* Overall result icon */}
        <div className="shrink-0">
          {overall === 'pass' ? (
            <CheckCircle size={24} style={{ color: '#059669' }} />
          ) : (
            <XCircle size={24} style={{ color: '#DC2626' }} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[14px] font-bold"
              style={{ color: 'var(--prizym-text-primary)' }}
            >
              {inspection.assetName}
            </span>
            <span
              className="text-[11px] font-mono"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              {inspection.assetId}
            </span>
          </div>
          <div
            className="text-[12px] mt-0.5 flex items-center gap-3"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            <span>{formatDate(inspection.date)}</span>
            <span>&middot;</span>
            <span>{inspection.inspector}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Issue count */}
          {flagged > 0 && (
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(245,158,11,0.10)', color: '#D97706' }}
            >
              {flagged} issue{flagged > 1 ? 's' : ''}
            </span>
          )}

          {/* Damage badge */}
          {inspection.damageFound && (
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{
                background: SEVERITY_STYLES[inspection.damageSeverity ?? 'minor'].bg,
                color: SEVERITY_STYLES[inspection.damageSeverity ?? 'minor'].text,
              }}
            >
              <AlertTriangle size={11} />
              Damage
            </span>
          )}

          {/* Overall chip */}
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{
              background: overall === 'pass' ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)',
              color: overall === 'pass' ? '#059669' : '#DC2626',
            }}
          >
            {overall === 'pass' ? '\u2713 Pass' : '\u2717 Fail'}
          </span>

          {/* Expand chevron */}
          {expanded ? (
            <ChevronUp size={16} style={{ color: 'var(--prizym-text-muted)' }} />
          ) : (
            <ChevronDown size={16} style={{ color: 'var(--prizym-text-muted)' }} />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-4 pb-4"
          style={{ borderTop: '1px solid var(--prizym-border-default)' }}
        >
          {/* Checklist table */}
          <div className="mt-4 mb-3">
            <h4
              className="text-[11px] uppercase tracking-[1.5px] font-bold mb-2"
              style={{ color: 'var(--prizym-text-muted)' }}
            >
              Checklist
            </h4>
            <table className="w-full text-[12px]">
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--prizym-border-default)',
                  }}
                >
                  <th
                    className="text-left py-2 text-[10px] uppercase tracking-[1px] font-mono font-semibold"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    Item
                  </th>
                  <th
                    className="text-center py-2 text-[10px] uppercase tracking-[1px] font-mono font-semibold w-20"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    Result
                  </th>
                  <th
                    className="text-left py-2 text-[10px] uppercase tracking-[1px] font-mono font-semibold"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {inspection.items.map((item) => {
                  const rs = RESULT_STYLES[item.result];
                  const RIcon = rs.Icon;
                  return (
                    <tr
                      key={item.name}
                      style={{
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <td
                        className="py-2"
                        style={{ color: 'var(--prizym-text-primary)' }}
                      >
                        {item.name}
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                          style={{ background: rs.bg, color: rs.text }}
                        >
                          <RIcon size={11} />
                          {rs.label}
                        </span>
                      </td>
                      <td
                        className="py-2"
                        style={{ color: 'var(--prizym-text-secondary)' }}
                      >
                        {item.notes ?? '\u2014'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Damage section */}
          {inspection.damageFound && (
            <div
              className="rounded-lg p-3 mt-3"
              style={{
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.15)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} style={{ color: '#DC2626' }} />
                <span
                  className="text-[12px] font-bold"
                  style={{ color: '#DC2626' }}
                >
                  Damage Report
                </span>
                {inspection.damageSeverity && (
                  <span
                    className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: SEVERITY_STYLES[inspection.damageSeverity].bg,
                      color: SEVERITY_STYLES[inspection.damageSeverity].text,
                    }}
                  >
                    {inspection.damageSeverity}
                  </span>
                )}
              </div>
              {inspection.damageNotes && (
                <p
                  className="text-[12px] leading-relaxed mb-3"
                  style={{ color: 'var(--prizym-text-secondary)' }}
                >
                  {inspection.damageNotes}
                </p>
              )}

              {/* Photo placeholders */}
              {inspection.photoCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {Array.from({ length: Math.min(inspection.photoCount, 6) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[80px] h-[60px] rounded-md flex flex-col items-center justify-center gap-1"
                      style={{
                        background: '#F3F4F6',
                        border: '1px solid var(--prizym-border-default)',
                      }}
                    >
                      <Camera size={14} style={{ color: 'var(--prizym-text-muted)' }} />
                      <span
                        className="text-[9px]"
                        style={{ color: 'var(--prizym-text-muted)' }}
                      >
                        [Photo {i + 1}]
                      </span>
                    </div>
                  ))}
                  {inspection.photoCount > 6 && (
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: 'var(--prizym-text-muted)' }}
                    >
                      +{inspection.photoCount - 6} more
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Photo placeholders for non-damage inspections */}
          {!inspection.damageFound && inspection.photoCount > 0 && (
            <div className="mt-3">
              <h4
                className="text-[11px] uppercase tracking-[1.5px] font-bold mb-2"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                Photos ({inspection.photoCount})
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {Array.from({ length: Math.min(inspection.photoCount, 6) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[80px] h-[60px] rounded-md flex flex-col items-center justify-center gap-1"
                    style={{
                      background: '#F3F4F6',
                      border: '1px solid var(--prizym-border-default)',
                    }}
                  >
                    <Camera size={14} style={{ color: 'var(--prizym-text-muted)' }} />
                    <span
                      className="text-[9px]"
                      style={{ color: 'var(--prizym-text-muted)' }}
                    >
                      [Photo {i + 1}]
                    </span>
                  </div>
                ))}
                {inspection.photoCount > 6 && (
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    +{inspection.photoCount - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Source Badge ─────────────────────────────────────── */

function SourceBadge({ source, synced }: { source: string; synced: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      <span>{source}</span>
      <span style={{ opacity: 0.5 }}>&bull;</span>
      <span>Synced {synced}</span>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */

export default function InspectionsPage() {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1
          className="text-2xl font-bold"
          style={{
            color: 'var(--prizym-text-primary)',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Recent Inspections
        </h1>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(37,99,235,0.10)', color: '#2563EB' }}
        >
          {INSPECTIONS.length} total
        </span>
      </div>
      <SourceBadge source="SmartEquip + Trackunit" synced="14 min ago" />

      {/* Inspection list */}
      <div className="flex flex-col gap-3">
        {INSPECTIONS.map((insp) => (
          <InspectionCard key={insp.id} inspection={insp} />
        ))}
      </div>
    </>
  );
}
