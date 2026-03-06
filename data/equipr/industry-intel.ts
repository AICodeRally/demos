/* ══════════════════════════════════════════════════════════════
   Industry Intelligence — Real Pain Points from Equipment Rental
   M&A integration, CRM friction, lead gen, rate/commission visibility
   ══════════════════════════════════════════════════════════════ */

// ─── M&A Integration Data ──────────────────────────────────────

export interface AcquisitionScenario {
  acquirer: string;
  target: string;
  branches: number;
  reps: number;
  accounts: number;
  fromSystem: string;
  toSystem: string;
}

export const ACQUISITION_SCENARIO: AcquisitionScenario = {
  acquirer: 'SunBelt Equipment',
  target: 'Desert Equipment Co',
  branches: 12,
  reps: 34,
  accounts: 2340,
  fromSystem: 'Wynne Systems',
  toSystem: 'Point of Rental',
};

export interface IntegrationPhase {
  name: string;
  traditionalWeeks: number;
  equiprWeeks: number;
  status: 'complete' | 'in-progress' | 'upcoming';
  traditionalRisk: string;
  equiprAdvantage: string;
}

export const INTEGRATION_PHASES: IntegrationPhase[] = [
  {
    name: 'Account Mapping',
    traditionalWeeks: 4,
    equiprWeeks: 1,
    status: 'complete',
    traditionalRisk: 'Manual spreadsheet matching, 15% error rate',
    equiprAdvantage: 'AI fuzzy-match on name, address, EIN — 98.5% accuracy',
  },
  {
    name: 'Customer Merge',
    traditionalWeeks: 3,
    equiprWeeks: 1,
    status: 'complete',
    traditionalRisk: 'Duplicate accounts persist for months',
    equiprAdvantage: 'Confidence-scored merge queue, human review on conflicts only',
  },
  {
    name: 'Rate Harmonization',
    traditionalWeeks: 3,
    equiprWeeks: 1,
    status: 'in-progress',
    traditionalRisk: 'Race to bottom — lowest rate wins by default',
    equiprAdvantage: 'Market-rate benchmarking preserves margin during merge',
  },
  {
    name: 'Territory Realignment',
    traditionalWeeks: 2,
    equiprWeeks: 1,
    status: 'upcoming',
    traditionalRisk: 'Overlap disputes, reps lose accounts they built',
    equiprAdvantage: 'Revenue-weighted territory optimizer, zero-loss reassignment',
  },
  {
    name: 'Comp Stabilization',
    traditionalWeeks: 2,
    equiprWeeks: 1,
    status: 'upcoming',
    traditionalRisk: 'Average commission to all — kills motivation',
    equiprAdvantage: 'Territory-weighted transition pay, preserves incentives',
  },
  {
    name: 'Go-Live',
    traditionalWeeks: 2,
    equiprWeeks: 1,
    status: 'upcoming',
    traditionalRisk: 'Big-bang cutover, 30% data loss typical',
    equiprAdvantage: 'Parallel-run validation, zero-downtime switchover',
  },
];

export const TRADITIONAL_TOTAL_WEEKS = INTEGRATION_PHASES.reduce((s, p) => s + p.traditionalWeeks, 0);
export const EQUIPR_TOTAL_WEEKS = INTEGRATION_PHASES.reduce((s, p) => s + p.equiprWeeks, 0);

export interface AccountMergeExample {
  customer: string;
  systemA: string;
  systemB: string;
  systemC?: string;
  confidence: number;
  status: 'merged' | 'review' | 'conflict';
  note: string;
}

export const ACCOUNT_MERGE_EXAMPLES: AccountMergeExample[] = [
  {
    customer: 'Apex Energy Services',
    systemA: 'APEX-001',
    systemB: 'AES-4492',
    systemC: 'APXE-77',
    confidence: 94,
    status: 'merged',
    note: '3 accounts across 2 systems — AI matched on EIN + job history',
  },
  {
    customer: 'Martinez Grading LLC',
    systemA: 'MART-312',
    systemB: 'MGL-0088',
    confidence: 98,
    status: 'merged',
    note: 'Exact EIN match, address within 0.2 mi',
  },
  {
    customer: 'Copper State Concrete',
    systemA: 'CSC-1102',
    systemB: 'COPP-445',
    confidence: 87,
    status: 'review',
    note: 'Name similar but different address — possible satellite office',
  },
  {
    customer: 'Valley Wide Excavation',
    systemA: 'VWE-0901',
    systemB: 'VLYW-22',
    confidence: 72,
    status: 'conflict',
    note: 'Different EIN, similar name — may be related companies',
  },
  {
    customer: 'Ironwood Development',
    systemA: 'IRON-553',
    systemB: 'IWD-1200',
    confidence: 96,
    status: 'merged',
    note: 'Phone number + contact name match confirmed',
  },
];

export interface CompStabilization {
  approach: string;
  description: string;
  monthlyVariance: string;
  repMotivation: string;
  riskLevel: 'low' | 'medium' | 'high';
  color: string;
}

export const COMP_STABILIZATION: Record<'industry' | 'equipr', CompStabilization> = {
  industry: {
    approach: 'Industry Standard',
    description: 'Average commission rate applied to all reps during transition. Safe but expensive — top performers subsidize low performers.',
    monthlyVariance: '±$2,800/rep',
    repMotivation: 'Drops 35% (top reps feel punished)',
    riskLevel: 'high',
    color: '#64748B',
  },
  equipr: {
    approach: 'EQUIPR AI-Optimized',
    description: 'Territory-weighted transition pay. Each rep\'s comp reflects their actual book of business value, adjusted for merged territory potential.',
    monthlyVariance: '±$400/rep',
    repMotivation: 'Stable (incentives preserved through transition)',
    riskLevel: 'low',
    color: '#10B981',
  },
};

// ─── CRM Speed Comparison ──────────────────────────────────────

export interface CrmTask {
  task: string;
  legacy: { time: string; system: string };
  current: { time: string; system: string };
  equipr: { time: string; method: string };
}

export const CRM_TASKS: CrmTask[] = [
  {
    task: 'Log Sales Call',
    legacy: { time: '1 min', system: 'Mobile Sales Pro' },
    current: { time: '12 min', system: 'Connect360' },
    equipr: { time: '30 sec', method: 'Voice → auto-log' },
  },
  {
    task: 'Update Pipeline',
    legacy: { time: '2 min', system: 'Excel + email' },
    current: { time: '15 min', system: 'Salesforce' },
    equipr: { time: '45 sec', method: 'AI auto-stage' },
  },
  {
    task: 'Create Quote',
    legacy: { time: '1.5 min', system: 'Handwritten' },
    current: { time: '10 min', system: 'CPQ module' },
    equipr: { time: '30 sec', method: 'Template + rates' },
  },
  {
    task: 'Check Territory',
    legacy: { time: '2 min', system: 'Paper map' },
    current: { time: '8 min', system: 'BI Dashboard' },
    equipr: { time: '1 min', method: 'Live territory view' },
  },
];

export interface AdoptionMetric {
  label: string;
  legacy: { value: string; pct: number };
  current: { value: string; pct: number };
  equipr: { value: string; pct: number };
}

export const ADOPTION_METRICS: AdoptionMetric[] = [
  {
    label: 'Rep Adoption',
    legacy: { value: '95%', pct: 95 },
    current: { value: '42%', pct: 42 },
    equipr: { value: '94%', pct: 94 },
  },
  {
    label: 'Daily Sessions',
    legacy: { value: '8.2', pct: 82 },
    current: { value: '1.4', pct: 14 },
    equipr: { value: '7.8', pct: 78 },
  },
  {
    label: 'Avg Time in CRM',
    legacy: { value: '22 min', pct: 73 },
    current: { value: '45 min', pct: 45 },
    equipr: { value: '12 min', pct: 90 },
  },
  {
    label: 'Data Completeness',
    legacy: { value: '88%', pct: 88 },
    current: { value: '34%', pct: 34 },
    equipr: { value: '96%', pct: 96 },
  },
];

// ─── Lead Intelligence ─────────────────────────────────────────

export interface LeadSource {
  name: string;
  icon: string;
  today: string;
  equipr: string;
  leadsPerWeek: number;
  daysEarlier: number;
  color: string;
}

export const LEAD_SOURCES: LeadSource[] = [
  {
    name: 'Dodge Construction',
    icon: 'Building2',
    today: 'Rep logs into portal, searches by zip, maybe finds it next week',
    equipr: 'Pushed to phone at 6am with project details + contact info',
    leadsPerWeek: 12,
    daysEarlier: 3,
    color: '#2563EB',
  },
  {
    name: 'Building Permits',
    icon: 'FileCheck',
    today: 'Check county website manually — most reps never do',
    equipr: 'Auto-scraped, geo-matched to territory, scored by equipment need',
    leadsPerWeek: 8,
    daysEarlier: 5,
    color: '#8B5CF6',
  },
  {
    name: 'GPS Proximity',
    icon: 'MapPin',
    today: 'No visibility — equipment is on a job, who knows where',
    equipr: 'Trackunit data shows your fleet near a new project site',
    leadsPerWeek: 4,
    daysEarlier: 2,
    color: '#F59E0B',
  },
  {
    name: 'Competitor Intel',
    icon: 'Target',
    today: 'Word of mouth at the branch, if you\'re lucky',
    equipr: 'Permit lapses, yard closures, price changes surfaced automatically',
    leadsPerWeek: 3,
    daysEarlier: 7,
    color: '#0891B2',
  },
];

export interface PipelineStage {
  stage: string;
  manualDays: number;
  equiprDays: number;
  manualConversion: number;
  equiprConversion: number;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { stage: 'Data Available', manualDays: 0, equiprDays: 0, manualConversion: 100, equiprConversion: 100 },
  { stage: 'Rep Notified', manualDays: 3, equiprDays: 0, manualConversion: 60, equiprConversion: 95 },
  { stage: 'First Contact', manualDays: 7, equiprDays: 1, manualConversion: 35, equiprConversion: 78 },
  { stage: 'Quote Sent', manualDays: 14, equiprDays: 3, manualConversion: 18, equiprConversion: 55 },
  { stage: 'Contract Won', manualDays: 28, equiprDays: 7, manualConversion: 8, equiprConversion: 32 },
];

// ─── Rate Intelligence ─────────────────────────────────────────

export type DemandSignal = 'surge' | 'high' | 'normal' | 'low';

export interface RateIntelRow {
  equipment: string;
  marketLow: number;
  marketAvg: number;
  marketHigh: number;
  yourRate: number;
  cstStep: number;
  demand: DemandSignal;
  floorAlert: boolean;
}

export const RATE_INTEL: RateIntelRow[] = [
  { equipment: '320 Excavator', marketLow: 850, marketAvg: 1050, marketHigh: 1250, yourRate: 975, cstStep: 5, demand: 'high', floorAlert: false },
  { equipment: '40\' Scissor Lift', marketLow: 280, marketAvg: 385, marketHigh: 475, yourRate: 350, cstStep: 5, demand: 'normal', floorAlert: false },
  { equipment: 'Skid Steer', marketLow: 225, marketAvg: 310, marketHigh: 395, yourRate: 245, cstStep: 5, demand: 'surge', floorAlert: true },
  { equipment: '60kW Generator', marketLow: 195, marketAvg: 275, marketHigh: 340, yourRate: 260, cstStep: 5, demand: 'normal', floorAlert: false },
  { equipment: 'Compactor (84")', marketLow: 310, marketAvg: 420, marketHigh: 510, yourRate: 395, cstStep: 5, demand: 'low', floorAlert: false },
];

export interface CommissionTier {
  label: string;
  range: string;
  rate: string;
  color: string;
  bgColor: string;
  alert?: boolean;
}

export const COMMISSION_TIERS: CommissionTier[] = [
  { label: '110%+ of market', range: '≥110%', rate: '3.5%', color: '#059669', bgColor: 'rgba(16,185,129,0.15)' },
  { label: '100-110% of market', range: '100-110%', rate: '3.0%', color: '#10B981', bgColor: 'rgba(16,185,129,0.10)' },
  { label: '90-100% of market', range: '90-100%', rate: '2.0%', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.12)' },
  { label: 'Below 90%', range: '<90%', rate: '1.5%', color: '#EF4444', bgColor: 'rgba(239,68,68,0.10)', alert: true },
];

// ─── Demand Signal Styles (reusable) ───────────────────────────

export const DEMAND_STYLES: Record<DemandSignal, { bg: string; text: string; label: string }> = {
  surge: { bg: 'rgba(220,38,38,0.12)', text: '#DC2626', label: 'SURGE' },
  high: { bg: 'rgba(249,115,22,0.10)', text: '#EA580C', label: 'HIGH' },
  normal: { bg: 'rgba(37,99,235,0.10)', text: '#2563EB', label: 'NORMAL' },
  low: { bg: 'rgba(107,114,128,0.10)', text: '#6B7280', label: 'LOW' },
};
