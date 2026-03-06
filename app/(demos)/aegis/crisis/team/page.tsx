'use client';

import { StatCard, HeatMap, RadarChart } from '@/components/demos/aegis';

/* ── Mock Data ────────────────────────────────────────────── */

interface TeamMember {
  name: string;
  initials: string;
  role: string;
  skillMatch: number;
  activeCases: number;
  avatarColor: string;
  availability: number[]; // 24 segments, 0=unavail, 1=amber, 2=green
}

const TEAM: TeamMember[] = [
  {
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'Lead Counsel',
    skillMatch: 96,
    activeCases: 2,
    avatarColor: '#8B7355',
    availability: [2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0,0,0,2,2,2,2],
  },
  {
    name: 'Marcus Webb',
    initials: 'MW',
    role: 'Cyber IR Lead',
    skillMatch: 94,
    activeCases: 3,
    avatarColor: '#2563EB',
    availability: [2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,0,0,0,2,2,2],
  },
  {
    name: 'Diana Torres',
    initials: 'DT',
    role: 'PR Director',
    skillMatch: 92,
    activeCases: 1,
    avatarColor: '#7C3AED',
    availability: [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  },
  {
    name: 'James Park',
    initials: 'JP',
    role: 'Regulatory Specialist',
    skillMatch: 91,
    activeCases: 4,
    avatarColor: '#059669',
    availability: [2,2,2,2,1,1,1,1,2,2,2,2,2,2,2,2,0,0,0,0,2,2,2,2],
  },
  {
    name: 'Raj Patel',
    initials: 'RP',
    role: 'Forensics Analyst',
    skillMatch: 97,
    activeCases: 2,
    avatarColor: '#DC2626',
    availability: [2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2],
  },
  {
    name: 'Emily Nakamura',
    initials: 'EN',
    role: 'Client Liaison',
    skillMatch: 89,
    activeCases: 3,
    avatarColor: '#EA580C',
    availability: [2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,1,1,2,2],
  },
];

const AVAILABILITY_ROWS = TEAM.map((t) => t.name);
const AVAILABILITY_COLS = ['0-6h', '6-12h', '12-18h', '18-24h', '24-30h', '30-36h', '36-42h', '42-48h'];
const AVAILABILITY_DATA = [
  [95, 90, 85, 40, 90, 95, 85, 90],
  [90, 70, 85, 90, 80, 60, 35, 85],
  [95, 95, 90, 95, 90, 90, 90, 95],
  [85, 55, 80, 90, 50, 35, 80, 90],
  [90, 90, 65, 85, 90, 90, 85, 90],
  [85, 40, 80, 90, 85, 75, 65, 85],
];

const RADAR_AXES = [
  { label: 'Legal', value: 95 },
  { label: 'Cyber', value: 92 },
  { label: 'Communications', value: 88 },
  { label: 'Regulatory', value: 90 },
  { label: 'Forensics', value: 94 },
  { label: 'Client Relations', value: 86 },
];

function workloadColor(cases: number): { bg: string; text: string } {
  if (cases <= 2) return { bg: '#ECFDF5', text: '#059669' };
  if (cases <= 3) return { bg: '#FFFBEB', text: '#D97706' };
  return { bg: '#FEF2F2', text: '#DC2626' };
}

/* ── Page ─────────────────────────────────────────────────── */

export default function TeamAssembly() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Team Assembly</h1>
        <p className="text-sm mt-1" style={{ color: '#57534E' }}>Crisis response team mobilization</p>
      </div>

      {/* 3 StatCards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Team Size" value="6" color="#8B7355" />
        <StatCard label="Estimated Ready" value="2.4hr" color="#059669" />
        <StatCard label="Skill Coverage" value="94%" color="#8B7355" sparkline={[88, 90, 91, 92, 93, 94]} />
      </div>

      {/* Team Member Cards — 3x2 grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {TEAM.map((m) => {
          const wl = workloadColor(m.activeCases);
          return (
            <div key={m.name} className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div
                  className="flex items-center justify-center rounded-full text-white text-sm font-bold"
                  style={{ width: 40, height: 40, backgroundColor: m.avatarColor }}
                >
                  {m.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>{m.name}</p>
                  <p className="text-[11px]" style={{ color: '#57534E' }}>{m.role}</p>
                </div>
              </div>

              {/* Skill Match */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: '#A8A29E' }}>Skill Match</span>
                  <span className="text-[11px] font-bold" style={{ color: '#059669' }}>{m.skillMatch}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#F5F5F4' }}>
                  <div className="h-full rounded-full" style={{ width: `${m.skillMatch}%`, backgroundColor: '#059669' }} />
                </div>
              </div>

              {/* Workload */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: '#A8A29E' }}>Workload</span>
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ backgroundColor: wl.bg, color: wl.text }}
                >
                  {m.activeCases} active cases
                </span>
              </div>

              {/* 24-segment availability bar */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: '#A8A29E' }}>Availability (24h)</span>
                <div className="flex gap-px mt-1">
                  {m.availability.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 h-2 rounded-sm"
                      style={{
                        backgroundColor: v === 2 ? '#059669' : v === 1 ? '#EAB308' : '#E7E5E4',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Org Chart */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-6" style={{ color: '#1C1917' }}>Response Org Structure</h2>
        <div className="flex flex-col items-center">
          {/* Lead */}
          <div
            className="rounded-xl px-6 py-3 text-center mb-2"
            style={{ border: '2px solid #8B7355', backgroundColor: '#FAFAF9' }}
          >
            <p className="text-sm font-bold" style={{ color: '#1C1917' }}>Sarah Chen</p>
            <p className="text-[10px]" style={{ color: '#8B7355' }}>Lead Counsel</p>
          </div>

          {/* Connector line down */}
          <div className="w-px h-6" style={{ backgroundColor: '#E7E5E4' }} />

          {/* Horizontal connector */}
          <div className="relative w-full max-w-xl">
            <div className="absolute top-0 left-1/6 right-1/6 h-px" style={{ backgroundColor: '#E7E5E4' }} />
            <div className="grid grid-cols-3 gap-4">
              {/* Legal Branch */}
              <div className="flex flex-col items-center">
                <div className="w-px h-4" style={{ backgroundColor: '#E7E5E4' }} />
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#A8A29E' }}>Legal</p>
                <div className="rounded-lg px-4 py-2 text-center w-full" style={{ border: '1px solid #E7E5E4', backgroundColor: 'white' }}>
                  <p className="text-xs font-semibold" style={{ color: '#1C1917' }}>James Park</p>
                  <p className="text-[10px]" style={{ color: '#57534E' }}>Regulatory</p>
                </div>
              </div>

              {/* Technical Branch */}
              <div className="flex flex-col items-center">
                <div className="w-px h-4" style={{ backgroundColor: '#E7E5E4' }} />
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#A8A29E' }}>Technical</p>
                <div className="space-y-2 w-full">
                  <div className="rounded-lg px-4 py-2 text-center" style={{ border: '1px solid #E7E5E4', backgroundColor: 'white' }}>
                    <p className="text-xs font-semibold" style={{ color: '#1C1917' }}>Marcus Webb</p>
                    <p className="text-[10px]" style={{ color: '#57534E' }}>Cyber IR</p>
                  </div>
                  <div className="rounded-lg px-4 py-2 text-center" style={{ border: '1px solid #E7E5E4', backgroundColor: 'white' }}>
                    <p className="text-xs font-semibold" style={{ color: '#1C1917' }}>Raj Patel</p>
                    <p className="text-[10px]" style={{ color: '#57534E' }}>Forensics</p>
                  </div>
                </div>
              </div>

              {/* Communications Branch */}
              <div className="flex flex-col items-center">
                <div className="w-px h-4" style={{ backgroundColor: '#E7E5E4' }} />
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#A8A29E' }}>Communications</p>
                <div className="space-y-2 w-full">
                  <div className="rounded-lg px-4 py-2 text-center" style={{ border: '1px solid #E7E5E4', backgroundColor: 'white' }}>
                    <p className="text-xs font-semibold" style={{ color: '#1C1917' }}>Diana Torres</p>
                    <p className="text-[10px]" style={{ color: '#57534E' }}>PR Director</p>
                  </div>
                  <div className="rounded-lg px-4 py-2 text-center" style={{ border: '1px solid #E7E5E4', backgroundColor: 'white' }}>
                    <p className="text-xs font-semibold" style={{ color: '#1C1917' }}>Emily Nakamura</p>
                    <p className="text-[10px]" style={{ color: '#57534E' }}>Client Liaison</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 48-Hour Availability HeatMap */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>48-Hour Availability</h2>
        <HeatMap
          rows={AVAILABILITY_ROWS}
          cols={AVAILABILITY_COLS}
          data={AVAILABILITY_DATA}
          colorScale={{ low: '#DC2626', mid: '#EAB308', high: '#059669' }}
        />
        <div className="flex items-center gap-4 mt-3 justify-end">
          {[
            { label: 'Available', color: '#059669' },
            { label: 'Limited', color: '#EAB308' },
            { label: 'Unavailable', color: '#DC2626' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: l.color }} />
              <span className="text-[10px]" style={{ color: '#A8A29E' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Combined Team Coverage Radar */}
      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#1C1917' }}>Combined Team Coverage</h2>
        <div className="flex justify-center">
          <RadarChart
            axes={RADAR_AXES}
            color="#8B7355"
            size={320}
            benchmarkData={[80, 80, 80, 80, 80, 80]}
          />
        </div>
        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4" style={{ backgroundColor: '#8B7355' }} />
            <span className="text-[10px]" style={{ color: '#57534E' }}>Team Coverage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4" style={{ backgroundColor: '#A8A29E', borderTop: '1px dashed #A8A29E' }} />
            <span className="text-[10px]" style={{ color: '#57534E' }}>Benchmark (80%)</span>
          </div>
        </div>
      </div>
    </>
  );
}
