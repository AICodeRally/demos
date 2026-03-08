'use client';

import {
  FileText, Users, DollarSign, CheckCircle2,
  AlertCircle, ArrowUpRight, ArrowDownRight,
  ChevronRight, Edit3, Eye, Copy,
} from 'lucide-react';
import { fmtDollar } from '@/lib/utils';

/* ── Data ──────────────────────────────────────────────────────── */
type PlanStatus = 'Active' | 'Draft' | 'Archived' | 'Pending Approval';

interface Tier {
  name: string;
  threshold: string;
  rate: string;
}

interface CompPlan {
  id: number;
  name: string;
  status: PlanStatus;
  enrolled: number;
  budget: number;
  effectiveFrom: string;
  effectiveTo: string;
  approvedBy: string | null;
  approvedDate: string | null;
  version: string;
  tiers: Tier[];
}

const PLANS: CompPlan[] = [
  {
    id: 1, name: 'Enterprise FY2026', status: 'Active', enrolled: 12, budget: 2_400_000,
    effectiveFrom: 'Jan 1, 2026', effectiveTo: 'Dec 31, 2026',
    approvedBy: 'Sarah Chen', approvedDate: 'Dec 15, 2025', version: 'v3.2',
    tiers: [
      { name: 'Base', threshold: '0 — 80%', rate: '6%' },
      { name: 'Standard', threshold: '80 — 100%', rate: '8%' },
      { name: 'Accelerator', threshold: '100 — 120%', rate: '12%' },
      { name: 'Super Accelerator', threshold: '120%+', rate: '18%' },
    ],
  },
  {
    id: 2, name: 'Mid-Market FY2026', status: 'Active', enrolled: 8, budget: 1_600_000,
    effectiveFrom: 'Jan 1, 2026', effectiveTo: 'Dec 31, 2026',
    approvedBy: 'Sarah Chen', approvedDate: 'Dec 18, 2025', version: 'v2.1',
    tiers: [
      { name: 'Base', threshold: '0 — 75%', rate: '5%' },
      { name: 'Standard', threshold: '75 — 100%', rate: '7%' },
      { name: 'Accelerator', threshold: '100 — 115%', rate: '10%' },
      { name: 'Super Accelerator', threshold: '115%+', rate: '15%' },
    ],
  },
  {
    id: 3, name: 'SMB FY2026', status: 'Active', enrolled: 6, budget: 720_000,
    effectiveFrom: 'Jan 1, 2026', effectiveTo: 'Dec 31, 2026',
    approvedBy: 'Marcus Johnson', approvedDate: 'Dec 20, 2025', version: 'v1.4',
    tiers: [
      { name: 'Base', threshold: '0 — 70%', rate: '4%' },
      { name: 'Standard', threshold: '70 — 100%', rate: '6%' },
      { name: 'Accelerator', threshold: '100 — 110%', rate: '9%' },
      { name: 'Super Accelerator', threshold: '110%+', rate: '14%' },
    ],
  },
  {
    id: 4, name: 'Enterprise FY2027 (Draft)', status: 'Draft', enrolled: 0, budget: 2_800_000,
    effectiveFrom: 'Jan 1, 2027', effectiveTo: 'Dec 31, 2027',
    approvedBy: null, approvedDate: null, version: 'v0.1',
    tiers: [
      { name: 'Base', threshold: '0 — 80%', rate: '6.5%' },
      { name: 'Standard', threshold: '80 — 100%', rate: '8.5%' },
      { name: 'Accelerator', threshold: '100 — 120%', rate: '13%' },
      { name: 'Super Accelerator', threshold: '120%+', rate: '20%' },
    ],
  },
];

const VERSION_HISTORY = [
  { version: 'v3.2', date: 'Dec 15, 2025', author: 'Sarah Chen', change: 'Approved for FY2026 — increased super accelerator from 16% to 18%' },
  { version: 'v3.1', date: 'Dec 10, 2025', change: 'Added Q4 SPIF bonus structure', author: 'Marcus Johnson' },
  { version: 'v3.0', date: 'Nov 28, 2025', change: 'Major restructure — 4-tier model replacing 3-tier', author: 'Sarah Chen' },
  { version: 'v2.5', date: 'Jul 1, 2025', change: 'Mid-year accelerator adjustment', author: 'Elena Rodriguez' },
  { version: 'v2.0', date: 'Jan 1, 2025', change: 'FY2025 plan launch', author: 'Sarah Chen' },
];

/* ── Components ────────────────────────────────────────────────── */
function KPI({ label, value, icon: Icon, trend, trendUp }: {
  label: string; value: string; icon: React.ElementType; trend: string; trendUp: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white/50">{label}</span>
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <div className="flex items-center gap-1.5">
        {trendUp
          ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
          : <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />}
        <span className={`text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>{trend}</span>
        <span className="text-xs text-white/40">vs prior year</span>
      </div>
    </div>
  );
}

function PlanStatusBadge({ status }: { status: PlanStatus }) {
  const colors: Record<PlanStatus, string> = {
    Active: 'bg-emerald-500/20 text-emerald-400',
    Draft: 'bg-blue-500/20 text-blue-400',
    Archived: 'bg-white/10 text-white/40',
    'Pending Approval': 'bg-amber-500/20 text-amber-400',
  };
  const dots: Record<PlanStatus, string> = {
    Active: 'bg-emerald-400',
    Draft: 'bg-blue-400',
    Archived: 'bg-white/30',
    'Pending Approval': 'bg-amber-400',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}

function TierBar({ tiers }: { tiers: Tier[] }) {
  const colors = ['bg-white/10', 'bg-amber-500/30', 'bg-amber-500/60', 'bg-amber-500'];
  return (
    <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
      {tiers.map((_, i) => (
        <div key={i} className={`flex-1 ${colors[i]}`} />
      ))}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function CompensationPlansPage() {
  const activePlans = PLANS.filter(p => p.status === 'Active').length;
  const draftPlans = PLANS.filter(p => p.status === 'Draft').length;
  const totalEnrolled = PLANS.reduce((s, p) => s + p.enrolled, 0);
  const totalBudget = PLANS.reduce((s, p) => s + p.budget, 0);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Compensation Plans</h1>
          <p className="text-sm text-white/50 mt-1">
            Design, manage, and version commission structures and incentive plans.
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-amber-400 transition">
          <FileText className="h-3 w-3" /> New Plan
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPI label="Active Plans" value={String(activePlans)} icon={FileText} trend="+1" trendUp />
        <KPI label="Drafts" value={String(draftPlans)} icon={Edit3} trend="+1" trendUp />
        <KPI label="Reps Enrolled" value={String(totalEnrolled)} icon={Users} trend="+4" trendUp />
        <KPI label="Total Budget" value={fmtDollar(totalBudget)} icon={DollarSign} trend="+16.7%" trendUp />
      </div>

      {/* Plan Cards */}
      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        {PLANS.map(plan => (
          <div key={plan.id} className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-amber-500/30 transition group">
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
                  <PlanStatusBadge status={plan.status} />
                </div>
                <p className="text-xs text-white/40">{plan.effectiveFrom} — {plan.effectiveTo}</p>
              </div>
              <span className="text-xs text-white/30 font-mono">{plan.version}</span>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-white/5 p-2.5 text-center">
                <p className="text-xs text-white/40 mb-0.5">Enrolled</p>
                <p className="text-sm font-bold text-white">{plan.enrolled}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-2.5 text-center">
                <p className="text-xs text-white/40 mb-0.5">Budget</p>
                <p className="text-sm font-bold text-white">{fmtDollar(plan.budget)}</p>
              </div>
              <div className="rounded-lg bg-white/5 p-2.5 text-center">
                <p className="text-xs text-white/40 mb-0.5">Max Rate</p>
                <p className="text-sm font-bold text-amber-400">{plan.tiers[plan.tiers.length - 1].rate}</p>
              </div>
            </div>

            {/* Tier Structure */}
            <div className="mb-3">
              <p className="text-xs text-white/40 mb-2">Tier Structure</p>
              <TierBar tiers={plan.tiers} />
              <div className="flex justify-between mt-1.5">
                {plan.tiers.map((t, i) => (
                  <div key={i} className="text-center flex-1">
                    <p className="text-[10px] text-white/30">{t.name}</p>
                    <p className="text-xs font-semibold text-white/70">{t.rate}</p>
                    <p className="text-[10px] text-white/20">{t.threshold}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              {plan.approvedBy ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Approved by {plan.approvedBy} on {plan.approvedDate}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <AlertCircle className="h-3 w-3" />
                  Awaiting approval
                </div>
              )}
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded hover:bg-white/10 transition" title="View">
                  <Eye className="h-3.5 w-3.5 text-white/30" />
                </button>
                <button className="p-1.5 rounded hover:bg-white/10 transition" title="Clone">
                  <Copy className="h-3.5 w-3.5 text-white/30" />
                </button>
                <button className="p-1.5 rounded hover:bg-white/10 transition" title="Edit">
                  <Edit3 className="h-3.5 w-3.5 text-white/30" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Version History */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Version History — Enterprise Plan</h2>
          <span className="text-xs text-white/40">Last 5 changes</span>
        </div>
        <div className="relative pl-6">
          {/* Timeline line */}
          <div className="absolute left-2 top-1 bottom-1 w-px bg-white/10" />
          {VERSION_HISTORY.map((v, i) => (
            <div key={i} className="relative mb-4 last:mb-0">
              {/* Timeline dot */}
              <div className={`absolute -left-4 top-1 h-2.5 w-2.5 rounded-full border-2 ${i === 0 ? 'bg-amber-400 border-amber-400' : 'bg-zinc-900 border-white/20'}`} />
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">{v.version}</span>
                    <span className="text-xs text-white/30">{v.date}</span>
                  </div>
                  <p className="text-sm text-white/60 mt-0.5">{v.change}</p>
                  <p className="text-xs text-white/30 mt-0.5">by {v.author}</p>
                </div>
                <button className="text-xs text-white/30 hover:text-white/60 transition flex items-center gap-0.5">
                  Details <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-xs text-white/30">Plans governed by SOX compliance policy P-2024-091</p>
        <div className="flex items-center gap-4">
          <button className="text-xs text-white/40 hover:text-white/70 transition">Compare Plans</button>
          <button className="text-xs text-amber-400 hover:text-amber-300 font-medium transition">Export All Plans</button>
        </div>
      </div>
    </>
  );
}
