'use client';

import { PrivilegeBadge, CrisisTimeline } from '@/components/demos/aegis';
import { Shield, Lock, BookOpen, Archive, MessageSquare, FileText } from 'lucide-react';

/* ── Mock Data ────────────────────────────────────────────── */

const STATUS_TILES = [
  { label: 'Encryption', detail: 'AES-256 Active', icon: Shield },
  { label: 'Privilege Notice', detail: 'Posted & Acknowledged', icon: FileText },
  { label: 'Playbook', detail: 'Cyber Breach v3.2 Loaded', icon: BookOpen },
  { label: 'Evidence Vault', detail: 'Initialized & Recording', icon: Archive },
  { label: 'Comms Channel', detail: 'Secure — E2E Encrypted', icon: MessageSquare },
  { label: 'Audit Log', detail: 'Recording All Actions', icon: FileText },
];

const PLAYBOOK_STEPS = [
  { text: 'Activate privilege umbrella', done: true },
  { text: 'Establish secure communications', done: true },
  { text: 'Deploy forensics team', done: true },
  { text: 'Notify regulatory counsel', done: false },
  { text: 'Draft initial holding statement', done: false },
  { text: 'Secure evidence preservation orders', done: false },
];

const PARTICIPANTS = [
  { name: 'Sarah Chen', initials: 'SC', role: 'Lead Counsel', color: '#8B7355' },
  { name: 'Marcus Webb', initials: 'MW', role: 'Cyber IR', color: '#2563EB' },
  { name: 'Diana Torres', initials: 'DT', role: 'PR Director', color: '#7C3AED' },
  { name: 'James Park', initials: 'JP', role: 'Regulatory', color: '#059669' },
  { name: 'Raj Patel', initials: 'RP', role: 'Forensics', color: '#DC2626' },
  { name: 'Emily Nakamura', initials: 'EN', role: 'Client Liaison', color: '#EA580C' },
];

const TIMELINE_EVENTS = [
  { time: '02:47', title: 'Incident reported', description: 'CISO office detected anomalous data exfiltration from customer database', type: 'cyber' as const },
  { time: '03:15', title: 'Privilege activated', description: 'Attorney-client privilege umbrella established for all response communications', type: 'legal' as const, privileged: true },
  { time: '03:28', title: 'Team assembled', description: '6-member crisis response team mobilized and briefed', type: 'internal' as const },
  { time: '03:42', title: 'War room created', description: 'Secure command center initialized with AES-256 encryption', type: 'internal' as const },
  { time: '04:00', title: 'Playbook loaded', description: 'Cyber Breach Response v3.2 matched and activated (94% confidence)', type: 'internal' as const },
  { time: '04:15', title: 'First briefing scheduled', description: 'Board briefing and regulatory notification strategy review', type: 'legal' as const },
];

/* ── Page ─────────────────────────────────────────────────── */

export default function WarRoomActivation() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>War Room Activation</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>Secure command center &mdash; Meridian Dynamics response</p>
      </div>

      {/* 6 Status Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {STATUS_TILES.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.label}
              className="rounded-xl bg-white p-5 flex items-start gap-4"
              style={{ border: '1px solid #E7E5E4', borderLeft: '4px solid #059669' }}
            >
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: 36, height: 36, backgroundColor: '#ECFDF5' }}
              >
                <Icon size={18} style={{ color: '#059669' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>{t.label}</p>
                  <span className="text-[10px]" style={{ color: '#059669' }}>&#10003;</span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: '#57534E' }}>{t.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Privilege Coverage Bar */}
      <div className="rounded-xl bg-white border p-5 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ color: '#1C1917' }}>Privilege Coverage</h2>
          <PrivilegeBadge size="md" />
        </div>
        <div className="h-3 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#F5F5F4' }}>
          <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: '#7C3AED' }} />
        </div>
        <p className="text-[11px] mt-2" style={{ color: '#7C3AED' }}>100% of channels under attorney-client privilege</p>
      </div>

      {/* Two-column: Playbook + Participants */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Playbook Card */}
        <div
          className="rounded-xl bg-white p-6"
          style={{ border: '1px solid #E7E5E4', borderLeft: '4px solid #8B7355' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: '#1C1917' }}>Active Playbook</h2>
            <span className="text-[11px] tabular-nums" style={{ color: '#8B7355' }}>94% match</span>
          </div>
          <p className="text-base font-bold mb-4" style={{ color: '#1C1917' }}>Cyber Breach Response v3.2</p>
          <div className="space-y-2">
            {PLAYBOOK_STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded shrink-0"
                  style={{
                    width: 22,
                    height: 22,
                    backgroundColor: s.done ? '#ECFDF5' : '#F5F5F4',
                    border: s.done ? '1px solid #059669' : '1px solid #E7E5E4',
                  }}
                >
                  {s.done ? (
                    <span className="text-[11px] font-bold" style={{ color: '#059669' }}>&#10003;</span>
                  ) : (
                    <span className="text-[10px]" style={{ color: '#A8A29E' }}>{i + 1}</span>
                  )}
                </div>
                <span
                  className="text-[12px]"
                  style={{
                    color: s.done ? '#57534E' : '#1C1917',
                    textDecoration: s.done ? 'line-through' : 'none',
                    opacity: s.done ? 0.7 : 1,
                  }}
                >
                  {s.text}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid #F5F5F4' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: '#A8A29E' }}>Progress</span>
              <span className="text-[11px] font-bold" style={{ color: '#8B7355' }}>3 / 6 complete</span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden mt-1" style={{ backgroundColor: '#F5F5F4' }}>
              <div className="h-full rounded-full" style={{ width: '50%', backgroundColor: '#8B7355' }} />
            </div>
          </div>
        </div>

        {/* Active Participants */}
        <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Active Participants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {PARTICIPANTS.map((p) => (
              <div key={p.name} className="flex flex-col items-center">
                <div className="relative">
                  <div
                    className="flex items-center justify-center rounded-full text-white text-sm font-bold"
                    style={{ width: 44, height: 44, backgroundColor: p.color }}
                  >
                    {p.initials}
                  </div>
                  {/* Online dot */}
                  <div
                    className="absolute -bottom-0.5 -right-0.5 rounded-full"
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: '#059669',
                      border: '2px solid white',
                    }}
                  />
                </div>
                <p className="text-[11px] font-semibold mt-2 text-center" style={{ color: '#1C1917' }}>{p.name}</p>
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[9px] font-medium mt-1"
                  style={{ backgroundColor: '#F5F5F4', color: '#57534E' }}
                >
                  {p.role}
                </span>
              </div>
            ))}
          </div>

          {/* Encryption Badge */}
          <div
            className="rounded-xl p-5 text-center"
            style={{ backgroundColor: '#F5F5F4', border: '1px solid #E7E5E4' }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock size={16} style={{ color: '#1C1917' }} />
              <span className="text-sm font-bold" style={{ color: '#1C1917' }}>AES-256 End-to-End Encrypted</span>
            </div>
            <p className="text-[11px] mb-2" style={{ color: '#57534E' }}>All communications privilege-protected</p>
            <div className="flex justify-center">
              <PrivilegeBadge size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Timeline */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Response Timeline</h2>
        <CrisisTimeline events={TIMELINE_EVENTS} />
      </div>
    </>
  );
}
