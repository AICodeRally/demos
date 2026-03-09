'use client';

import { StatCard } from '@/components/demos/crestline';
import { Scale, Hammer, ShoppingCart, AlertTriangle, ArrowRight, Clock, Users, Wrench, ChevronRight } from 'lucide-react';
import Link from 'next/link';

/* ── Color tokens ─────────────────────────────────────────────────────── */
const C = {
  heading: '#0F172A',
  body: '#475569',
  muted: '#94a3b8',
  border: '#E2E8F0',
  bg: '#F8FAFC',
  red: '#DC2626',
  amber: '#F59E0B',
  green: '#059669',
  blue: '#2563EB',
};

/* ── Badge definitions ────────────────────────────────────────────────── */
type Complexity = 'Very High' | 'High' | 'Moderate';
type Risk = 'Critical' | 'High' | 'Moderate';
type Readiness = 'Native' | 'Configurable' | 'Custom Extension';

const complexityColor: Record<Complexity, string> = { 'Very High': C.red, 'High': C.amber, 'Moderate': C.green };
const riskColor: Record<Risk, string> = { 'Critical': C.red, 'High': C.amber, 'Moderate': C.green };
const readinessColor: Record<Readiness, string> = { 'Native': C.green, 'Configurable': C.blue, 'Custom Extension': C.amber };

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {label}
    </span>
  );
}

/* ── Component data ───────────────────────────────────────────────────── */
interface ComponentRow {
  name: string;
  buildComplexity: Complexity;
  buildRisk: Risk;
  buyReadiness: Readiness;
  keyDifferentiator: string;
  buildBullets: string[];
  buildEffort: string;
  buildRiskFactors: string[];
  buyBullets: string[];
  insight: string;
}

const COMPONENTS: ComponentRow[] = [
  {
    name: 'Transaction Ingestion Pipeline',
    buildComplexity: 'Very High',
    buildRisk: 'Critical',
    buyReadiness: 'Native',
    keyDifferentiator: 'POS-to-commission pipeline with receipt-linked return handling, 14-attribute staging, audit controls. Modern platforms ingest POS natively.',
    buildBullets: [
      'Must build custom POS connectors for 200+ stores with heterogeneous terminal hardware',
      'Receipt-linked return matching requires real-time state management across 14 transaction attributes',
      'Any ingestion failure cascades to all downstream commission streams',
    ],
    buildEffort: '6-9 months, 4-6 engineers',
    buildRiskFactors: ['Data loss risk during peak holiday volume', 'POS vendor API changes break pipeline'],
    buyBullets: [
      'SPM platforms provide native POS ingestion with pre-built connectors for major retail systems',
      'Transaction staging, deduplication, and audit trail are foundational infrastructure',
    ],
    insight: 'This is plumbing, not differentiation. Every dollar spent here is a dollar not spent on associate experience.',
  },
  {
    name: 'Effective-Dated Configuration',
    buildComplexity: 'High',
    buildRisk: 'High',
    buyReadiness: 'Native',
    keyDifferentiator: 'Selling department rates, merchandise mapping, Achiever goals — all require effective dating. Platforms provide this as table infrastructure.',
    buildBullets: [
      'Every rate table, department mapping, and goal must be versioned with effective/expiry dates',
      'Retroactive changes require re-processing all transactions in the affected date range',
    ],
    buildEffort: '3-4 months, 2-3 engineers',
    buildRiskFactors: ['Temporal logic bugs are notoriously hard to test', 'Concurrent edits create version conflicts'],
    buyBullets: [
      'SPM platforms treat effective dating as core table infrastructure — not an add-on',
      'Built-in version history, diff views, and approval workflows for configuration changes',
    ],
    insight: 'Effective dating sounds simple until you layer in retro corrections, mid-period rate changes, and 200 stores with different go-live dates.',
  },
  {
    name: '5-Stream Commission Engine',
    buildComplexity: 'Very High',
    buildRisk: 'Critical',
    buyReadiness: 'Native',
    keyDifferentiator: 'Basic, Premium, Counter Lead Bonus, Achiever Scorecard, Negative Balance — 5 interdependent calc streams. SPM platforms are literally built for this.',
    buildBullets: [
      'Five calculation streams with interdependencies (Negative Balance carries forward, Achiever modifies rates)',
      'Each stream has different trigger conditions, periodicity, and aggregation rules',
      'Must handle 3,200 associates x 26 pay periods x 5 streams = 416,000 calculations per year',
    ],
    buildEffort: '9-12 months, 5-8 engineers',
    buildRiskFactors: ['Stream interaction bugs produce silent calculation errors', 'Performance degrades non-linearly with rule complexity'],
    buyBullets: [
      'Multi-stream commission calculation is the core competency of SPM platforms',
      'Rule engines support arbitrary stream interdependencies with built-in execution ordering',
      'Calculation audit trails show exactly how each dollar was computed',
    ],
    insight: 'This is the heart of the problem. Building a commission engine is building an SPM platform — the question is whether Crestline is a software company.',
  },
  {
    name: 'Percentile Calculation',
    buildComplexity: 'High',
    buildRisk: 'High',
    buyReadiness: 'Native',
    keyDifferentiator: 'Per-period percentile ranking across peer groups. Standard analytics function in SPM platforms.',
    buildBullets: [
      'Requires real-time ranking of 3,200 associates across dynamic peer groups (department, store, region)',
      'Peer group composition changes with transfers, new hires, and terminations mid-period',
    ],
    buildEffort: '2-3 months, 1-2 engineers',
    buildRiskFactors: ['Edge cases in small peer groups skew rankings', 'Must recalculate on every transaction'],
    buyBullets: [
      'Standard analytics function — most SPM platforms include percentile ranking out of the box',
      'Configurable peer group definitions with automatic rebalancing',
    ],
    insight: 'Low effort to build in isolation, but the complexity explodes when percentiles feed into Achiever eligibility and tier progression.',
  },
  {
    name: 'Achiever Assignment & Eligibility',
    buildComplexity: 'Very High',
    buildRisk: 'Critical',
    buyReadiness: 'Configurable',
    keyDifferentiator: 'YTD aggregation, staffing history, tier progression (Silver\u2192Gold\u2192Platinum), dual-sync with HR system. Configurable rule engines handle this.',
    buildBullets: [
      'Tier progression logic (Silver\u2192Gold\u2192Platinum) with YTD aggregation and staffing history requirements',
      'Must dual-sync with HR system for eligibility changes (transfers, leaves, terminations)',
      'Achiever status affects Premium commission rates — creating a circular dependency with the engine',
    ],
    buildEffort: '6-9 months, 3-5 engineers',
    buildRiskFactors: ['HR sync failures silently corrupt eligibility', 'Tier boundary disputes are high-volume'],
    buyBullets: [
      'Configurable rule engines support multi-criteria eligibility with tier progression',
      'HR integration connectors handle bidirectional sync with Workday, SAP, etc.',
      'Built-in dispute workflow for tier boundary cases',
    ],
    insight: 'The Achiever program is Crestline\'s primary retention tool for top sellers. Errors here directly impact the associates you can least afford to lose.',
  },
  {
    name: 'Custom Calendar Engine',
    buildComplexity: 'High',
    buildRisk: 'High',
    buyReadiness: 'Configurable',
    keyDifferentiator: '4-5-4 retail calendar for Counter Lead Bonus vs. semi-monthly payroll. SPM platforms support multiple calendar types.',
    buildBullets: [
      'Must support 4-5-4 retail calendar (Counter Lead Bonus) alongside semi-monthly payroll calendar',
      'Calendar boundaries affect accrual, payout timing, and retro correction windows',
    ],
    buildEffort: '3-4 months, 2-3 engineers',
    buildRiskFactors: ['Calendar misalignment causes double-counting or missed accruals', 'Leap year and fiscal year-end edge cases'],
    buyBullets: [
      'SPM platforms support multiple concurrent calendar types as configuration',
      'Period-aware calculations automatically handle boundary transitions',
    ],
    insight: 'Dual calendars sound manageable until a retro correction spans a 4-5-4 boundary that doesn\'t align with the payroll period it affects.',
  },
  {
    name: 'Retro Transfer Correction',
    buildComplexity: 'Very High',
    buildRisk: 'Critical',
    buyReadiness: 'Native',
    keyDifferentiator: 'Immutable snapshots, time-rewind replay, differential adjustments. Phil called this "untenable" in Workday Prism. SPM platforms have built-in retro processing.',
    buildBullets: [
      'Requires immutable snapshots of every calculation state for time-rewind replay',
      'Differential adjustments must propagate through all 5 commission streams',
      'Current process described as "untenable" — manual spreadsheet reconciliation taking days',
    ],
    buildEffort: '6-9 months, 3-5 engineers',
    buildRiskFactors: ['Snapshot storage grows unboundedly', 'Replay bugs compound across periods'],
    buyBullets: [
      'SPM platforms maintain immutable calculation history as a core architectural pattern',
      'Built-in retro processing with automatic differential adjustment propagation',
      'Audit trail shows before/after for every correction',
    ],
    insight: 'This is the single biggest pain point in Crestline\'s current operation. Phil\'s team spends 52 hours per week on manual corrections that a platform handles automatically.',
  },
  {
    name: 'Override & Adjustment Workflow',
    buildComplexity: 'High',
    buildRisk: 'High',
    buyReadiness: 'Native',
    keyDifferentiator: 'Manual corrections, override audit trail, X-in-X-out validation. Currently 52 hrs/week in OIC. Workflow engines are core SPM.',
    buildBullets: [
      'Must support multi-level approval workflows with role-based authorization',
      'X-in-X-out validation ensures every override has a balancing entry',
      'Currently consuming 52 hours/week of analyst time in the OIC',
    ],
    buildEffort: '4-6 months, 2-4 engineers',
    buildRiskFactors: ['Unapproved overrides create audit exposure', 'Workflow exceptions pile up at period-end'],
    buyBullets: [
      'Workflow engines with configurable approval chains are core SPM infrastructure',
      'Built-in override audit trail with SOX-ready reporting',
      'Automated X-in-X-out validation eliminates manual reconciliation',
    ],
    insight: 'The 52 hrs/week Phil\'s team spends on overrides is not a technology problem — it\'s the absence of a workflow engine. This is table stakes for any SPM platform.',
  },
  {
    name: 'Audit & Controls',
    buildComplexity: 'Very High',
    buildRisk: 'Critical',
    buyReadiness: 'Native',
    keyDifferentiator: 'Transaction-level reconciliation, dispute workflow, full POS\u2192payout trace. Compliance infrastructure is foundational in SPM.',
    buildBullets: [
      'Full POS-to-payout trace requires linking every commission dollar to its source transaction',
      'Dispute workflow must support associate self-service, manager review, and analyst resolution',
      'SOX compliance demands immutable audit logs with tamper-evident controls',
    ],
    buildEffort: '6-9 months, 3-5 engineers',
    buildRiskFactors: ['Audit gaps discovered during SOX review', 'Dispute backlog erodes associate trust'],
    buyBullets: [
      'Compliance infrastructure is foundational in SPM platforms — not bolted on',
      'Transaction-level lineage, dispute workflow, and SOX reporting are standard features',
      'Associate self-service portals reduce dispute volume by 40-60%',
    ],
    insight: 'Audit and controls are non-negotiable for a publicly traded retailer. Building compliance infrastructure from scratch is expensive and risky.',
  },
  {
    name: 'Payroll Integration',
    buildComplexity: 'Moderate',
    buildRisk: 'Moderate',
    buyReadiness: 'Configurable',
    keyDifferentiator: 'Commission\u2192Workday payroll feed, guarantee calculations, hours reconciliation. Standard integration pattern.',
    buildBullets: [
      'Commission-to-Workday payroll feed with guarantee calculations and hours reconciliation',
      'Must handle mid-period adjustments, retro corrections, and negative balance carry-forwards',
    ],
    buildEffort: '3-4 months, 2-3 engineers',
    buildRiskFactors: ['Payroll errors have immediate associate impact', 'Workday API versioning requires ongoing maintenance'],
    buyBullets: [
      'Standard integration pattern — most SPM platforms have pre-built Workday connectors',
      'Configurable payroll file formats, approval workflows, and reconciliation reports',
    ],
    insight: 'The simplest component on this list, but errors here are the most visible. Associates notice paycheck discrepancies immediately.',
  },
];

/* ── Border color by build risk ───────────────────────────────────────── */
function borderColorForRisk(risk: Risk): string {
  return riskColor[risk];
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function BuildVsBuyPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#64748B18' }}>
            <Scale size={20} style={{ color: '#64748B' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: C.heading }}>Build vs. Buy Analysis</h1>
            <p className="text-sm" style={{ color: C.body }}>
              Neutral advisor assessment — 10 components, independently evaluated
            </p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Components Assessed" value="10" color="#64748B" />
        <StatCard label="Build Estimate" value="18-24 mo" color={C.red} />
        <StatCard label="Engineers Required" value="15-25" color={C.amber} />
        <StatCard label="Ongoing FTEs" value="5-8" color="#7c3aed" />
      </div>

      {/* ─── Section 1: Summary Scorecard ─────────────────────────────── */}
      <div className="rounded-xl bg-white border p-6 mb-8" style={{ borderColor: C.border }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: C.heading }}>
          Summary Scorecard Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ color: C.muted }}>
                <th className="text-left pb-3 font-medium pr-4">Component</th>
                <th className="text-left pb-3 font-medium pr-4">Build Complexity</th>
                <th className="text-left pb-3 font-medium pr-4">Build Risk</th>
                <th className="text-left pb-3 font-medium pr-4">Buy Readiness</th>
                <th className="text-left pb-3 font-medium">Key Differentiator</th>
              </tr>
            </thead>
            <tbody>
              {COMPONENTS.map((c, i) => (
                <tr key={i} className="border-t" style={{ borderColor: '#F1F5F9' }}>
                  <td className="py-3 pr-4 font-semibold whitespace-nowrap" style={{ color: C.heading }}>{c.name}</td>
                  <td className="py-3 pr-4"><Badge label={c.buildComplexity} color={complexityColor[c.buildComplexity]} /></td>
                  <td className="py-3 pr-4"><Badge label={c.buildRisk} color={riskColor[c.buildRisk]} /></td>
                  <td className="py-3 pr-4"><Badge label={c.buyReadiness} color={readinessColor[c.buyReadiness]} /></td>
                  <td className="py-3 text-[11px] leading-snug" style={{ color: C.body }}>{c.keyDifferentiator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Section 2: Per-Component Detail Cards ────────────────────── */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold" style={{ color: C.heading }}>
          Per-Component Analysis
        </h2>
        <p className="text-xs mt-1" style={{ color: C.muted }}>
          Each card compares the build path against platform capabilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {COMPONENTS.map((c, i) => (
          <div
            key={i}
            className="rounded-xl bg-white border p-5"
            style={{ borderColor: C.border, borderLeftWidth: 4, borderLeftColor: borderColorForRisk(c.buildRisk) }}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: C.heading }}>{c.name}</h3>
              <div className="flex gap-2">
                <Badge label={c.buildComplexity} color={complexityColor[c.buildComplexity]} />
                <Badge label={c.buildRisk} color={riskColor[c.buildRisk]} />
              </div>
            </div>

            {/* Build vs Buy Columns */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Build side */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Hammer size={13} style={{ color: C.red }} />
                  <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: C.red }}>Build</span>
                </div>
                <ul className="space-y-1.5">
                  {c.buildBullets.map((b, j) => (
                    <li key={j} className="text-[11px] leading-snug flex gap-1.5" style={{ color: C.body }}>
                      <span className="shrink-0 mt-1" style={{ color: C.muted }}>&bull;</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex items-center gap-1.5">
                  <Clock size={11} style={{ color: C.muted }} />
                  <span className="text-[10px] font-semibold" style={{ color: C.heading }}>{c.buildEffort}</span>
                </div>
                <div className="mt-1">
                  {c.buildRiskFactors.map((r, j) => (
                    <div key={j} className="flex items-start gap-1 mt-0.5">
                      <AlertTriangle size={10} className="shrink-0 mt-0.5" style={{ color: C.amber }} />
                      <span className="text-[10px]" style={{ color: C.body }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buy side */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ShoppingCart size={13} style={{ color: C.green }} />
                  <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: C.green }}>Buy</span>
                </div>
                <ul className="space-y-1.5">
                  {c.buyBullets.map((b, j) => (
                    <li key={j} className="text-[11px] leading-snug flex gap-1.5" style={{ color: C.body }}>
                      <span className="shrink-0 mt-1" style={{ color: C.muted }}>&bull;</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <Badge label={c.buyReadiness} color={readinessColor[c.buyReadiness]} />
                </div>
              </div>
            </div>

            {/* Insight callout */}
            <div className="rounded-lg p-3" style={{ backgroundColor: C.bg, borderLeft: `3px solid ${C.muted}` }}>
              <p className="text-[11px] leading-snug italic" style={{ color: C.body }}>
                {c.insight}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Section 3: Summary Footer ────────────────────────────────── */}
      <div className="rounded-xl bg-white border p-6 mb-6" style={{ borderColor: C.border }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: C.heading }}>
          Aggregate Build Estimate
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg p-4" style={{ backgroundColor: `${C.red}08`, border: `1px solid ${C.red}20` }}>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} style={{ color: C.red }} />
              <span className="text-xs font-semibold" style={{ color: C.red }}>Total Build Timeline</span>
            </div>
            <p className="text-xl font-bold" style={{ color: C.heading }}>18-24 Months</p>
            <p className="text-[11px] mt-1" style={{ color: C.body }}>
              15-25 engineers working in parallel across 6-7 workstreams
            </p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: `${C.amber}08`, border: `1px solid ${C.amber}20` }}>
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} style={{ color: C.amber }} />
              <span className="text-xs font-semibold" style={{ color: C.amber }}>Ongoing Maintenance</span>
            </div>
            <p className="text-xl font-bold" style={{ color: C.heading }}>5-8 FTEs</p>
            <p className="text-[11px] mt-1" style={{ color: C.body }}>
              For ongoing operations, maintenance, and bi-weekly calculation support
            </p>
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: `${C.green}08`, border: `1px solid ${C.green}20` }}>
            <div className="flex items-center gap-2 mb-1">
              <Wrench size={14} style={{ color: C.green }} />
              <span className="text-xs font-semibold" style={{ color: C.green }}>Critical Components</span>
            </div>
            <p className="text-xl font-bold" style={{ color: C.heading }}>5 of 10</p>
            <p className="text-[11px] mt-1" style={{ color: C.body }}>
              Rated "Critical" build risk — failure in any one cascades to downstream systems
            </p>
          </div>
        </div>
      </div>

      {/* CTA Callout */}
      <Link href="/crestline/comp/engine" className="block">
        <div
          className="rounded-xl border-2 p-5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderColor: C.green, backgroundColor: `${C.green}06` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${C.green}18` }}>
              <ArrowRight size={20} style={{ color: C.green }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: C.heading }}>
                See how Crestline&apos;s platform handles each component
              </p>
              <p className="text-xs mt-0.5" style={{ color: C.body }}>
                Commission Engine &mdash; 5-stream calculation pipeline with built-in retro processing, audit trail, and real-time visibility
              </p>
            </div>
          </div>
          <ChevronRight size={20} style={{ color: C.green }} />
        </div>
      </Link>
    </>
  );
}
