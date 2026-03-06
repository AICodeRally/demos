'use client';


import { LOCATIONS } from '@/data/equipr/locations';
import {
  Database,
  Server,
  Radio,
  Wrench,
  BarChart3,
  Award,
  Plug,
} from 'lucide-react';

/* ── Integrations Data ──────────────────────────────── */
const INTEGRATIONS = [
  {
    name: 'Wynne Systems',
    type: 'Rental ERP',
    status: 'connected' as const,
    uptime: '99.97%',
    lastSync: '2 min ago',
    dataPoints: '12,847 records synced',
    feeds: ['Reservations', 'Contracts', 'Billing', 'Customer accounts', 'Rate tables'],
    color: '#2563EB',
    icon: 'Database',
    logo: 'W',
  },
  {
    name: 'Point of Rental',
    type: 'Rental Management',
    status: 'connected' as const,
    uptime: '99.91%',
    lastSync: '5 min ago',
    dataPoints: '8,234 records synced',
    feeds: ['Inventory status', 'Availability', 'Customer CRM', 'Rate governance'],
    color: '#0891B2',
    icon: 'Server',
    logo: 'POR',
  },
  {
    name: 'Trackunit',
    type: 'Telematics & GPS',
    status: 'connected' as const,
    uptime: '99.99%',
    lastSync: 'Live streaming',
    dataPoints: '147 units • 2.3M events/day',
    feeds: ['GPS location', 'Engine hours', 'Fuel levels', 'Fault codes', 'Geofencing'],
    color: '#10B981',
    icon: 'Radio',
    logo: 'TU',
  },
  {
    name: 'SmartEquip',
    type: 'Parts & Service',
    status: 'connected' as const,
    uptime: '99.85%',
    lastSync: '14 min ago',
    dataPoints: '3,456 parts indexed',
    feeds: ['Parts catalog', 'Work orders', 'Service history', 'Warranty tracking'],
    color: '#8B5CF6',
    icon: 'Wrench',
    logo: 'SE',
  },
  {
    name: 'Rouse Analytics',
    type: 'Market Benchmarks',
    status: 'connected' as const,
    uptime: '99.99%',
    lastSync: 'Q4 2025 loaded',
    dataPoints: '4,200+ rate benchmarks',
    feeds: ['National rate averages', 'Regional utilization', 'Market trends', 'Fleet age analysis'],
    color: '#F59E0B',
    icon: 'BarChart3',
    logo: 'RA',
  },
  {
    name: 'ARA Benchmarks',
    type: 'Industry Standards',
    status: 'connected' as const,
    uptime: '100%',
    lastSync: '2025 Annual loaded',
    dataPoints: '18 KPI benchmarks',
    feeds: ['Cost of Rental survey', 'Safety benchmarks', 'Utilization targets', 'Revenue per employee'],
    color: '#DC2626',
    icon: 'Award',
    logo: 'ARA',
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Database,
  Server,
  Radio,
  Wrench,
  BarChart3,
  Award,
};

/* ── Rate Rules Data ──────────────────────────────────── */
const RATE_RULES = [
  {
    category: 'Heavy Equipment',
    floorRate: '$650/day',
    discountApproval: '>10% → Manager',
    maxDiscount: '15%',
    weekendMultiplier: '1.0x',
  },
  {
    category: 'Aerial / Lifts',
    floorRate: '$275/day',
    discountApproval: '>10% → Manager',
    maxDiscount: '15%',
    weekendMultiplier: '1.0x',
  },
  {
    category: 'Compaction & Concrete',
    floorRate: '$120/day',
    discountApproval: '>15% → Manager',
    maxDiscount: '20%',
    weekendMultiplier: '0.9x',
  },
  {
    category: 'Power & HVAC',
    floorRate: '$95/day',
    discountApproval: '>15% → Manager',
    maxDiscount: '20%',
    weekendMultiplier: '0.9x',
  },
  {
    category: 'Tools & Small',
    floorRate: '$45/day',
    discountApproval: '>20% → Auto-ok',
    maxDiscount: '25%',
    weekendMultiplier: '0.8x',
  },
];

/* ── Team Data ────────────────────────────────────────── */
const TEAM = [
  { name: 'Dave Richardson', role: 'Branch Manager', location: 'Orlando Central', email: 'dave.r@bhes.com', access: 'Full' },
  { name: 'Lisa Nakamura', role: 'Branch Manager', location: 'Tampa Bay Yard', email: 'lisa.n@bhes.com', access: 'Full' },
  { name: 'Carlos Vega', role: 'Branch Manager', location: 'Jacksonville Depot', email: 'carlos.v@bhes.com', access: 'Full' },
  { name: 'Mike Torres', role: 'Sales Rep', location: 'Orlando Central', email: 'mike.t@bhes.com', access: 'Standard' },
  { name: 'Sarah Chen', role: 'Sales Rep', location: 'Tampa Bay Yard', email: 'sarah.c@bhes.com', access: 'Standard' },
  { name: 'Jake Williams', role: 'Sales Rep', location: 'Jacksonville Depot', email: 'jake.w@bhes.com', access: 'Standard' },
  { name: 'Tom Bradley', role: 'Dispatcher', location: 'Orlando Central', email: 'tom.b@bhes.com', access: 'Dispatch' },
  { name: 'Maria Santos', role: 'Inspector', location: 'Tampa Bay Yard', email: 'maria.s@bhes.com', access: 'Inspect' },
];

/* ── Access Badge Colors ──────────────────────────────── */
const ACCESS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Full:     { bg: 'rgba(16,185,129,0.12)', text: '#10B981', border: 'rgba(16,185,129,0.25)' },
  Standard: { bg: 'rgba(37,99,235,0.12)',  text: '#2563EB', border: 'rgba(37,99,235,0.25)' },
  Dispatch: { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
  Inspect:  { bg: 'rgba(168,85,247,0.12)', text: '#A855F7', border: 'rgba(168,85,247,0.25)' },
};

/* ── Section Header ───────────────────────────────────── */
function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-4">
      <h2
        className="text-lg font-bold"
        style={{
          color: 'var(--prizym-text-primary)',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {title}
      </h2>
      <p className="text-[13px] mt-0.5" style={{ color: 'var(--prizym-text-secondary)' }}>
        {sub}
      </p>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{
              color: 'var(--prizym-text-primary)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Settings
          </h1>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: 'var(--prizym-text-secondary)' }}
          >
            Organization configuration and access management
          </p>
        </div>
        <div
          className="text-[12px] font-mono font-medium px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(37,99,235,0.12)',
            color: '#2563EB',
            border: '1px solid rgba(37,99,235,0.25)',
          }}
        >
          BHES Admin
        </div>
      </div>

      {/* ── Section 0: Connected Integrations ─────────── */}
      <div className="mb-8">
        {/* Section header with badge */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Plug size={18} style={{ color: 'var(--prizym-text-primary)' }} />
              <h2
                className="text-lg font-bold"
                style={{
                  color: 'var(--prizym-text-primary)',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Connected Integrations
              </h2>
            </div>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--prizym-text-secondary)' }}>
              EQUIPR pulls real-time data from 6 industry systems
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 text-[12px] font-mono font-medium px-3 py-1.5 rounded-lg"
            style={{
              background: 'rgba(16,185,129,0.12)',
              color: '#10B981',
              border: '1px solid rgba(16,185,129,0.25)',
            }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: '#10B981' }}
            />
            6 of 6 Connected
          </div>
        </div>

        {/* Integration cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {INTEGRATIONS.map((int) => {
            const Icon = ICON_MAP[int.icon] ?? Database;
            return (
              <div
                key={int.name}
                className="rounded-xl p-5 transition-shadow hover:shadow-lg"
                style={{
                  background: 'var(--prizym-card-bg)',
                  border: '1px solid var(--prizym-border-default)',
                  boxShadow: 'var(--prizym-shadow-card)',
                }}
              >
                {/* Header: Logo + Name + Type badge */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex items-center justify-center rounded-lg text-[13px] font-bold text-white shrink-0"
                    style={{
                      width: 40,
                      height: 40,
                      background: int.color,
                    }}
                  >
                    {int.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-[15px] font-bold truncate"
                      style={{
                        color: 'var(--prizym-text-primary)',
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {int.name}
                    </h3>
                    <span
                      className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md"
                      style={{
                        background: `${int.color}18`,
                        color: int.color,
                        border: `1px solid ${int.color}30`,
                      }}
                    >
                      {int.type}
                    </span>
                  </div>
                  <Icon size={18} style={{ color: int.color, opacity: 0.6 }} />
                </div>

                {/* Status row */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-2 h-2 rounded-full animate-pulse"
                      style={{ background: '#10B981' }}
                    />
                    <span className="text-[12px] font-medium" style={{ color: '#10B981' }}>
                      Connected
                    </span>
                  </div>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--prizym-text-muted)' }}>
                    {int.uptime} uptime
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--prizym-text-muted)' }}>
                    |
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--prizym-text-secondary)' }}>
                    {int.lastSync}
                  </span>
                </div>

                {/* Data points */}
                <div
                  className="text-[12px] font-mono mb-3"
                  style={{ color: 'var(--prizym-text-secondary)' }}
                >
                  {int.dataPoints}
                </div>

                {/* Feeds pills */}
                <div className="flex flex-wrap gap-1.5">
                  {int.feeds.map((feed) => (
                    <span
                      key={feed}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: `${int.color}18`,
                        color: int.color,
                      }}
                    >
                      {feed}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Data Points', value: '31K+ records synced' },
            { label: 'Average Uptime', value: '99.95%' },
            { label: 'Data Freshness', value: '< 5 min average lag' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 text-center"
              style={{
                background: 'var(--prizym-card-bg)',
                border: '1px solid var(--prizym-border-default)',
                boxShadow: 'var(--prizym-shadow-card)',
              }}
            >
              <div
                className="text-[10px] uppercase tracking-[1.5px] font-mono font-semibold mb-1"
                style={{ color: 'var(--prizym-text-muted)' }}
              >
                {stat.label}
              </div>
              <div
                className="text-[15px] font-bold font-mono"
                style={{ color: 'var(--prizym-text-primary)' }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 1: Locations ────────────────────────── */}
      <SectionHeader title="Locations" sub={`${LOCATIONS.length} branches across Florida`} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {LOCATIONS.map((loc) => (
          <div
            key={loc.id}
            className="rounded-xl p-5 transition-shadow hover:shadow-lg"
            style={{
              background: 'var(--prizym-card-bg)',
              border: '1px solid var(--prizym-border-default)',
              boxShadow: 'var(--prizym-shadow-card)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3
                className="text-[15px] font-bold"
                style={{
                  color: 'var(--prizym-text-primary)',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {loc.name}
              </h3>
              <span
                className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md"
                style={{
                  background: 'rgba(37,99,235,0.12)',
                  color: '#2563EB',
                  border: '1px solid rgba(37,99,235,0.25)',
                }}
              >
                {loc.assetCount} assets
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-[12px]" style={{ color: 'var(--prizym-text-secondary)' }}>
                {loc.address}
              </div>
              <div className="text-[12px]" style={{ color: 'var(--prizym-text-muted)' }}>
                {loc.phone}
              </div>
              <div className="text-[12px] mt-2" style={{ color: 'var(--prizym-text-secondary)' }}>
                <span style={{ color: 'var(--prizym-text-muted)' }}>Manager:</span>{' '}
                <span className="font-medium" style={{ color: 'var(--prizym-text-primary)' }}>
                  {loc.manager}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 2: Rate Rules ───────────────────────── */}
      <SectionHeader title="Rate Rules" sub="Floor rates and discount approval thresholds by category" />
      <div
        className="rounded-xl overflow-hidden mb-8"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                style={{
                  background: '#F9FAFB',
                  borderBottom: '1px solid var(--prizym-border-default)',
                }}
              >
                {['Category', 'Floor Rate', 'Discount Approval', 'Max Discount', 'Weekend Multiplier'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-[10px] uppercase tracking-[1.5px] font-mono font-semibold"
                      style={{ color: 'var(--prizym-text-muted)' }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {RATE_RULES.map((rule, i) => (
                <tr
                  key={rule.category}
                  style={{
                    background: i % 2 === 1 ? 'rgba(0,0,0,0.02)' : 'transparent',
                    borderBottom:
                      i < RATE_RULES.length - 1
                        ? '1px solid rgba(0,0,0,0.06)'
                        : undefined,
                  }}
                >
                  <td
                    className="px-5 py-3 text-[13px] font-medium"
                    style={{ color: 'var(--prizym-text-primary)' }}
                  >
                    {rule.category}
                  </td>
                  <td
                    className="px-5 py-3 text-[13px] font-mono"
                    style={{ color: 'var(--prizym-text-secondary)' }}
                  >
                    {rule.floorRate}
                  </td>
                  <td
                    className="px-5 py-3 text-[13px]"
                    style={{ color: 'var(--prizym-text-secondary)' }}
                  >
                    {rule.discountApproval}
                  </td>
                  <td
                    className="px-5 py-3 text-[13px] font-mono"
                    style={{ color: 'var(--prizym-text-secondary)' }}
                  >
                    {rule.maxDiscount}
                  </td>
                  <td
                    className="px-5 py-3 text-[13px] font-mono"
                    style={{ color: 'var(--prizym-text-secondary)' }}
                  >
                    {rule.weekendMultiplier}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 3: Team ─────────────────────────────── */}
      <SectionHeader title="Team" sub={`${TEAM.length} members across ${LOCATIONS.length} locations`} />
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'var(--prizym-card-bg)',
          border: '1px solid var(--prizym-border-default)',
          boxShadow: 'var(--prizym-shadow-card)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                style={{
                  background: '#F9FAFB',
                  borderBottom: '1px solid var(--prizym-border-default)',
                }}
              >
                {['Name', 'Role', 'Location', 'Email', 'Access'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-[10px] uppercase tracking-[1.5px] font-mono font-semibold"
                    style={{ color: 'var(--prizym-text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM.map((member, i) => {
                const colors = ACCESS_COLORS[member.access] ?? ACCESS_COLORS.Standard;
                return (
                  <tr
                    key={member.email}
                    style={{
                      background: i % 2 === 1 ? 'rgba(0,0,0,0.02)' : 'transparent',
                      borderBottom:
                        i < TEAM.length - 1
                          ? '1px solid rgba(0,0,0,0.06)'
                          : undefined,
                    }}
                  >
                    <td
                      className="px-5 py-3 text-[13px] font-medium"
                      style={{ color: 'var(--prizym-text-primary)' }}
                    >
                      {member.name}
                    </td>
                    <td
                      className="px-5 py-3 text-[13px]"
                      style={{ color: 'var(--prizym-text-secondary)' }}
                    >
                      {member.role}
                    </td>
                    <td
                      className="px-5 py-3 text-[13px]"
                      style={{ color: 'var(--prizym-text-secondary)' }}
                    >
                      {member.location}
                    </td>
                    <td
                      className="px-5 py-3 text-[13px] font-mono"
                      style={{ color: 'var(--prizym-text-muted)' }}
                    >
                      {member.email}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md"
                        style={{
                          background: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        {member.access}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
