'use client';

import {
  Users, UserCheck, UserPlus, Shield, Search, Filter,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, ChevronDown,
  Mail, Clock,
} from 'lucide-react';
import { fmtDollar } from '@/lib/utils';

/* ── Data ──────────────────────────────────────────────────────── */
type Role = 'Admin' | 'Manager' | 'Rep' | 'Viewer';
type Status = 'Active' | 'Inactive' | 'Pending';

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  team: string;
  status: Status;
  lastLogin: string;
  avatar: string;
  quotaAssigned: number;
}

const USERS: User[] = [
  { id: 1, name: 'Sarah Chen', email: 'sarah.chen@bhg.com', role: 'Admin', team: 'Platform', status: 'Active', lastLogin: '2 min ago', avatar: 'SC', quotaAssigned: 0 },
  { id: 2, name: 'Marcus Johnson', email: 'marcus.j@bhg.com', role: 'Manager', team: 'Enterprise', status: 'Active', lastLogin: '1 hr ago', avatar: 'MJ', quotaAssigned: 4_500_000 },
  { id: 3, name: 'Elena Rodriguez', email: 'elena.r@bhg.com', role: 'Manager', team: 'Mid-Market', status: 'Active', lastLogin: '3 hrs ago', avatar: 'ER', quotaAssigned: 3_200_000 },
  { id: 4, name: 'James Park', email: 'james.park@bhg.com', role: 'Rep', team: 'Enterprise', status: 'Active', lastLogin: '30 min ago', avatar: 'JP', quotaAssigned: 1_200_000 },
  { id: 5, name: 'Aisha Patel', email: 'aisha.p@bhg.com', role: 'Rep', team: 'Enterprise', status: 'Active', lastLogin: '45 min ago', avatar: 'AP', quotaAssigned: 1_100_000 },
  { id: 6, name: 'David Kim', email: 'david.kim@bhg.com', role: 'Rep', team: 'Mid-Market', status: 'Active', lastLogin: '2 hrs ago', avatar: 'DK', quotaAssigned: 900_000 },
  { id: 7, name: 'Rachel Foster', email: 'rachel.f@bhg.com', role: 'Viewer', team: 'Finance', status: 'Pending', lastLogin: 'Never', avatar: 'RF', quotaAssigned: 0 },
  { id: 8, name: 'Tom Bradley', email: 'tom.b@bhg.com', role: 'Rep', team: 'SMB', status: 'Inactive', lastLogin: '14 days ago', avatar: 'TB', quotaAssigned: 750_000 },
];

const PERMISSIONS: { action: string; Admin: boolean; Manager: boolean; Rep: boolean; Viewer: boolean }[] = [
  { action: 'View Dashboards', Admin: true, Manager: true, Rep: true, Viewer: true },
  { action: 'View Own Quota', Admin: true, Manager: true, Rep: true, Viewer: true },
  { action: 'View Team Quotas', Admin: true, Manager: true, Rep: false, Viewer: false },
  { action: 'Assign Quotas', Admin: true, Manager: true, Rep: false, Viewer: false },
  { action: 'Edit Comp Plans', Admin: true, Manager: false, Rep: false, Viewer: false },
  { action: 'Approve Disputes', Admin: true, Manager: true, Rep: false, Viewer: false },
  { action: 'Manage Users', Admin: true, Manager: false, Rep: false, Viewer: false },
  { action: 'System Config', Admin: true, Manager: false, Rep: false, Viewer: false },
  { action: 'Export Reports', Admin: true, Manager: true, Rep: true, Viewer: false },
  { action: 'API Access', Admin: true, Manager: false, Rep: false, Viewer: false },
];

/* ── Components ────────────────────────────────────────────────── */
function KPI({ label, value, icon: Icon, trend, trendUp }: {
  label: string; value: string; icon: React.ElementType; trend: string; trendUp: boolean;
}) {
  return (
    <div className="rounded-xl p-5 flex flex-col gap-2" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--prizym-text-muted)' }}>{label}</span>
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>{value}</p>
      <div className="flex items-center gap-1.5">
        {trendUp
          ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
          : <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />}
        <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>{trend}</span>
        <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>vs last month</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const colors: Record<Status, string> = {
    Active: 'bg-emerald-500/20 text-emerald-600',
    Inactive: 'bg-red-500/20 text-red-600',
    Pending: 'bg-amber-500/20 text-amber-400',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-400' : status === 'Pending' ? 'bg-amber-400' : 'bg-red-400'}`} />
      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const colors: Record<Role, string> = {
    Admin: 'bg-purple-500/20 text-purple-400',
    Manager: 'bg-blue-500/20 text-blue-400',
    Rep: 'bg-amber-500/20 text-amber-400',
    Viewer: 'bg-slate-100 text-slate-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors[role]}`}>
      {role}
    </span>
  );
}

function PermCheck({ allowed }: { allowed: boolean }) {
  return allowed
    ? <span className="text-emerald-600 text-xs font-bold">&#10003;</span>
    : <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>&#8212;</span>;
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function UserManagementPage() {
  const activeCount = USERS.filter(u => u.status === 'Active').length;
  const pendingCount = USERS.filter(u => u.status === 'Pending').length;
  const adminCount = USERS.filter(u => u.role === 'Admin').length;

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--prizym-text-primary)' }}>User Management</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--prizym-text-muted)' }}>
            Manage team access, roles, and permissions across the quota platform.
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 transition">
          <UserPlus className="h-3 w-3" /> Invite User
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPI label="Total Users" value={String(USERS.length)} icon={Users} trend="+2" trendUp />
        <KPI label="Active" value={String(activeCount)} icon={UserCheck} trend="+1" trendUp />
        <KPI label="Pending Invite" value={String(pendingCount)} icon={Mail} trend="+1" trendUp />
        <KPI label="Administrators" value={String(adminCount)} icon={Shield} trend="0" trendUp />
      </div>

      {/* Search / Filter Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:border-amber-500/50"
            style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-primary)' }}
          />
        </div>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', color: 'var(--prizym-text-secondary)' }}>
          <Filter className="h-3 w-3" /> Filters <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* User Table */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>All Users</h2>
          <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{USERS.length} users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>User</th>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Role</th>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Team</th>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Status</th>
                <th className="pb-3 text-xs font-medium text-right" style={{ color: 'var(--prizym-text-muted)' }}>Quota Assigned</th>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Last Login</th>
                <th className="pb-3 text-xs font-medium w-10" style={{ color: 'var(--prizym-text-muted)' }}></th>
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id} className="transition hover:bg-slate-50" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                        {u.avatar}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'var(--prizym-text-primary)' }}>{u.name}</p>
                        <p className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><RoleBadge role={u.role} /></td>
                  <td className="py-3" style={{ color: 'var(--prizym-text-secondary)' }}>{u.team}</td>
                  <td className="py-3"><StatusBadge status={u.status} /></td>
                  <td className="py-3 text-right font-mono" style={{ color: 'var(--prizym-text-secondary)' }}>
                    {u.quotaAssigned > 0 ? fmtDollar(u.quotaAssigned) : '\u2014'}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5" style={{ color: 'var(--prizym-text-muted)' }}>
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{u.lastLogin}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <button className="p-1 rounded hover:bg-slate-100 transition">
                      <MoreHorizontal className="h-4 w-4" style={{ color: 'var(--prizym-text-muted)' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix */}
      <div className="rounded-xl p-5" style={{ background: 'var(--prizym-card-bg)', border: '1px solid var(--prizym-border-default)', boxShadow: 'var(--prizym-shadow-card)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--prizym-text-primary)' }}>Role Permission Matrix</h2>
          <button className="text-xs text-amber-400 hover:text-amber-300 font-medium transition">Edit Permissions</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                <th className="pb-3 text-xs font-medium" style={{ color: 'var(--prizym-text-muted)' }}>Permission</th>
                <th className="pb-3 text-xs font-medium text-center text-purple-400">Admin</th>
                <th className="pb-3 text-xs font-medium text-center text-blue-400">Manager</th>
                <th className="pb-3 text-xs font-medium text-center text-amber-400">Rep</th>
                <th className="pb-3 text-xs font-medium text-center" style={{ color: 'var(--prizym-text-muted)' }}>Viewer</th>
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p, i) => (
                <tr key={i} className="transition hover:bg-slate-50" style={{ borderBottom: '1px solid var(--prizym-border-default)' }}>
                  <td className="py-2.5" style={{ color: 'var(--prizym-text-secondary)' }}>{p.action}</td>
                  <td className="py-2.5 text-center"><PermCheck allowed={p.Admin} /></td>
                  <td className="py-2.5 text-center"><PermCheck allowed={p.Manager} /></td>
                  <td className="py-2.5 text-center"><PermCheck allowed={p.Rep} /></td>
                  <td className="py-2.5 text-center"><PermCheck allowed={p.Viewer} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--prizym-border-default)' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Active ({activeCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Pending ({pendingCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>Inactive ({USERS.filter(u => u.status === 'Inactive').length})</span>
          </div>
        </div>
        <span className="text-xs" style={{ color: 'var(--prizym-text-muted)' }}>SSO via Azure AD</span>
      </div>
    </>
  );
}
