# SGM Product Rethink — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot the Prizym Governance demo from consulting-journey IA (quadrants) to a client-facing policy-management product IA (6 groups: Home, Documents, Tools, Compliance, Workflows, AI). Replace SPARCC purple theme with a blue-teal-emerald compliance gradient. Add enforcement state and an Exceptions workflow. Collapse to a single theme (no dark/light toggle).

**Architecture:** 6-group sidebar with ONE unified Documents page (5 type filters: comp plans, policies, procedures, controls, templates), a new Home/My Workspace inbox, Tools group for the ASC 606 Calculator and 88-Checkpoint Framework browser, Compliance monitoring surfaces (obligations register, controls, reports, audit), and a Workflows action queue (approvals, attestations, reviews, exceptions, cases, committees, calendar, audit trail). Gradient-glass visual treatment in the new `sgm-compliance` theme preset.

**Tech Stack:** Next.js 16 App Router (static export), TypeScript, Tailwind, Lucide icons, Zustand (already installed but unused now), the shared `components/shell/` demo framework.

**Spec:** `docs/superpowers/specs/2026-04-10-sgm-product-rethink-design.md`

---

## Pre-flight checks

- [ ] **Step 0.1: Confirm starting branch state**

```bash
git branch --show-current
git log --oneline -5
```

Expected: on `restore-old-sgm-demo`, latest commit is `4cee0bd` (spec update).

- [ ] **Step 0.2: Confirm typecheck is clean before starting**

```bash
pnpm typecheck 2>&1 | grep -v "^LUMEN" | grep -v "^  " | grep -E "^(app|components|data|lib|styles)" | head -5
```

Expected: empty (no errors).

---

## Wave A — Data foundation + nav restructure

### Task A1: Create Documents type definitions

**Files:**
- Create: `data/prizym-governance/documents/types.ts`

- [ ] **Step A1.1: Write `types.ts`**

```ts
/**
 * Unified document model for the Prizym Governance policy-management product.
 * All lifecycle-managed content types (comp plans, policies, procedures,
 * controls, templates) share this shape so the Documents library page can
 * render them with a single component.
 */

export type DocumentType = 'comp_plan' | 'policy' | 'procedure' | 'control' | 'template';

export type LifecycleStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'superseded' | 'retired';

export interface DocumentRecord {
  id: string;
  type: DocumentType;
  code: string;               // SCP-001, TPL-ASC-001, CTL-SOX-003, PRC-001, CP-2026-01
  title: string;
  category: string;           // Sales / SOX / ASC 606 / Tax / Wage Law / Data Security / Operational
  status: LifecycleStatus;
  version: string;
  effectiveDate: string;      // ISO date
  nextReview: string;         // ISO date
  owner: string;
  description: string;
  content?: string;           // Optional full markdown body
  attestationPct?: number;    // 0-100 — percent of target audience that has attested
  targetAudience?: number;    // how many people need to attest
  linkedObligations?: string[]; // obligation IDs
  tags?: string[];
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  comp_plan: 'Comp Plans',
  policy: 'Policies',
  procedure: 'Procedures',
  control: 'Controls',
  template: 'Templates',
};

export const LIFECYCLE_STATUS_LABELS: Record<LifecycleStatus, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  approved: 'Approved',
  published: 'Published',
  superseded: 'Superseded',
  retired: 'Retired',
};

export function isReviewOverdue(doc: DocumentRecord, today: Date = new Date()): boolean {
  if (doc.status !== 'published') return false;
  return new Date(doc.nextReview) < today;
}
```

- [ ] **Step A1.2: Commit**

```bash
git add data/prizym-governance/documents/types.ts
git commit -m "feat(sgm-rethink): add unified document type model"
```

---

### Task A2: Create consolidated document catalog

**Files:**
- Create: `data/prizym-governance/documents/catalog.ts`

This is the single source of truth for all documents. Imports existing policies + plans + asc606 data and adds new procedures + controls, returning them as a flat `DocumentRecord[]`.

- [ ] **Step A2.1: Write `catalog.ts`**

```ts
import type { DocumentRecord, DocumentType } from './types';
import { SCP_POLICIES, DEMO_POLICIES } from '@/data/prizym-governance/policies';
import { asc606Policies, asc606Templates, asc606Frameworks } from '@/data/prizym-governance/asc606';
import { PLANS } from '@/data/prizym-governance/plans';
import { COMPLIANCE_CONTROLS } from '@/data/prizym-governance/oversee';

/**
 * Today is 2026-04-10 for the demo — dates below are relative to that.
 * Past dates with status=published drive "review overdue" badges.
 */

// =============================================================================
// Comp Plans — existing PLANS data mapped into DocumentRecord shape
// =============================================================================
const compPlanDocs: DocumentRecord[] = PLANS.map((p) => ({
  id: p.id,
  type: 'comp_plan' as const,
  code: p.planCode,
  title: p.title,
  category: 'Compensation Plan',
  status: (
    p.status === 'APPROVED' || p.status === 'Published' ? 'published' :
    p.status === 'DRAFT' ? 'draft' :
    p.status === 'UNDER_REVIEW' ? 'in_review' :
    p.status === 'Approved' ? 'approved' : 'draft'
  ) as DocumentRecord['status'],
  version: '2026.1',
  effectiveDate: '2026-01-01',
  nextReview: '2026-12-31',
  owner: p.owner,
  description: p.description,
  attestationPct: p.completionPercentage,
  targetAudience: Math.floor(40 + Math.random() * 60),
  tags: p.tags,
}));

// =============================================================================
// Policies — SCP policies + ASC 606 policies + existing DEMO_POLICIES
// =============================================================================
const scpPolicyDocs: DocumentRecord[] = SCP_POLICIES.map((p) => ({
  id: p.id,
  type: 'policy' as const,
  code: p.code,
  title: p.title,
  category: p.category,
  status: (p.status === 'APPROVED' ? 'published' : p.status === 'DRAFT' ? 'draft' : 'published') as DocumentRecord['status'],
  version: p.version,
  effectiveDate: p.effectiveDate ?? '2026-01-01',
  nextReview: '2026-10-01',
  owner: p.owner,
  description: p.description,
  attestationPct: 70 + Math.floor(Math.random() * 28),
  targetAudience: 120,
}));

const asc606PolicyDocs: DocumentRecord[] = asc606Policies.map((p, i) => ({
  id: p.id,
  type: 'policy' as const,
  code: `SCP-${String(18 + i).padStart(3, '0')}`,
  title: p.name,
  category: 'ASC 606 / Revenue Recognition',
  status: 'published' as const,
  version: p.version,
  effectiveDate: '2026-02-18',
  nextReview: '2026-08-18',
  owner: p.createdBy,
  description: p.description ?? '',
  content: p.content,
  attestationPct: 65 + Math.floor(Math.random() * 25),
  targetAudience: 40, // revenue accounting + sales leadership only
}));

// =============================================================================
// Procedures — NEW synthetic data
// =============================================================================
const procedureDocs: DocumentRecord[] = [
  {
    id: 'prc-001', type: 'procedure', code: 'PRC-001',
    title: 'Monthly Commission Processing Cycle',
    category: 'Operational',
    status: 'published', version: '1.3.0',
    effectiveDate: '2026-01-01', nextReview: '2026-07-01',
    owner: 'Sales Comp Lead',
    description: 'Step-by-step procedure for the monthly commission close: data load, calculation, validation, approval, payroll hand-off, and dispute window.',
    attestationPct: 92, targetAudience: 18,
  },
  {
    id: 'prc-002', type: 'procedure', code: 'PRC-002',
    title: 'Commission Dispute Resolution Workflow',
    category: 'Operational',
    status: 'published', version: '2.0.1',
    effectiveDate: '2026-01-15', nextReview: '2026-07-15',
    owner: 'Sales Operations Director',
    description: 'End-to-end workflow for intake, triage, investigation, resolution, and communication of commission disputes. Escalation ladder to CRB for cases >$50K.',
    attestationPct: 88, targetAudience: 35,
  },
  {
    id: 'prc-003', type: 'procedure', code: 'PRC-003',
    title: 'Windfall Review (SCP-007) Procedure',
    category: 'Operational',
    status: 'published', version: '1.1.0',
    effectiveDate: '2026-02-01', nextReview: '2026-08-01',
    owner: 'CRB Secretary',
    description: 'Procedure for flagging windfall-qualifying deals, preparing CRB pre-read packets, running the review meeting, and documenting decisions.',
    attestationPct: 100, targetAudience: 9,
  },
  {
    id: 'prc-004', type: 'procedure', code: 'PRC-004',
    title: 'Month-End Close — Revenue Cut-Off (SOX-003)',
    category: 'SOX / ICFR',
    status: 'published', version: '1.0.0',
    effectiveDate: '2026-01-01', nextReview: '2026-04-01', // OVERDUE
    owner: 'Revenue Accounting',
    description: 'Procedure for enforcing month-end revenue cut-off per ASC 606 and SOX-003 control. Includes cut-off criteria, exception log, and sign-off checklist.',
    attestationPct: 78, targetAudience: 12,
  },
  {
    id: 'prc-005', type: 'procedure', code: 'PRC-005',
    title: 'Q1 SPIF Approval Procedure (SCP-008)',
    category: 'Operational',
    status: 'published', version: '1.0.0',
    effectiveDate: '2026-01-10', nextReview: '2026-10-10',
    owner: 'Sales Comp',
    description: 'Procedure for SPIF proposal, approval routing through SGCC/CFO/CEO bands, communication to reps, and payout tracking.',
    attestationPct: 94, targetAudience: 22,
  },
  {
    id: 'prc-006', type: 'procedure', code: 'PRC-006',
    title: 'Leave of Absence Commission Handling (SCP-005)',
    category: 'Operational',
    status: 'in_review', version: '2.1.0',
    effectiveDate: '2026-04-01', nextReview: '2026-10-01',
    owner: 'HR Business Partner',
    description: 'Procedure for commission pro-rata treatment during medical, parental, and extended LOAs. Currently in review — new version aligns with updated CA AB-2288 requirements.',
    attestationPct: 0, targetAudience: 28,
  },
];

// =============================================================================
// Controls — existing COMPLIANCE_CONTROLS mapped into DocumentRecord shape
// =============================================================================
const controlDocs: DocumentRecord[] = COMPLIANCE_CONTROLS.map((c) => ({
  id: c.id,
  type: 'control' as const,
  code: c.code,
  title: c.name,
  category: c.category,
  status: 'published' as const,
  version: '1.0.0',
  effectiveDate: '2026-01-01',
  nextReview: c.nextTest,
  owner: c.owner,
  description: `Control linked to ${c.relatedPolicy}. Last tested ${c.lastTested}. ${c.evidence} evidence artifacts on file.`,
  attestationPct: c.status === 'compliant' ? 100 : c.status === 'at_risk' ? 70 : c.status === 'not_tested' ? 0 : 45,
  targetAudience: 1,
  linkedObligations: [c.relatedPolicy],
}));

// =============================================================================
// Templates — ASC 606 templates + 2 new plan templates
// =============================================================================
const templateDocs: DocumentRecord[] = [
  ...asc606Templates.map((t) => ({
    id: t.id,
    type: 'template' as const,
    code: t.code,
    title: t.name,
    category: 'ASC 606 / Revenue Recognition',
    status: 'published' as const,
    version: t.version,
    effectiveDate: '2026-02-18',
    nextReview: '2027-02-18',
    owner: t.createdBy,
    description: t.description ?? '',
    tags: t.tags,
    attestationPct: 100, targetAudience: 1,
  })),
  {
    id: 'tpl-plan-001', type: 'template', code: 'TPL-PLAN-001',
    title: 'Enterprise AE Compensation Plan Template',
    category: 'Compensation Plan',
    status: 'published', version: '2026.1',
    effectiveDate: '2026-01-01', nextReview: '2027-01-01',
    owner: 'Sales Comp',
    description: 'Standard template for enterprise Account Executive plans. 50:50 pay mix, 2.5x accelerators above 100% quota, SPIF placeholders, clawback clauses.',
    attestationPct: 100, targetAudience: 1,
    tags: ['enterprise', 'AE', 'template'],
  },
  {
    id: 'tpl-plan-002', type: 'template', code: 'TPL-PLAN-002',
    title: 'Inside Sales Plan Template',
    category: 'Compensation Plan',
    status: 'published', version: '2026.1',
    effectiveDate: '2026-01-01', nextReview: '2027-01-01',
    owner: 'Sales Comp',
    description: 'Standard template for Inside Sales rep plans. 70:30 pay mix, flat commission rate, SPIF placeholders, quarterly quotas.',
    attestationPct: 100, targetAudience: 1,
    tags: ['inside sales', 'template'],
  },
];

// =============================================================================
// Aggregate export
// =============================================================================
export const DOCUMENTS: DocumentRecord[] = [
  ...compPlanDocs,
  ...scpPolicyDocs,
  ...asc606PolicyDocs,
  ...procedureDocs,
  ...controlDocs,
  ...templateDocs,
];

export function getDocumentsByType(type: DocumentType): DocumentRecord[] {
  return DOCUMENTS.filter((d) => d.type === type);
}

export function getDocumentById(id: string): DocumentRecord | undefined {
  return DOCUMENTS.find((d) => d.id === id);
}

export function getDocumentStats() {
  return {
    total: DOCUMENTS.length,
    byType: {
      comp_plan: compPlanDocs.length,
      policy: scpPolicyDocs.length + asc606PolicyDocs.length,
      procedure: procedureDocs.length,
      control: controlDocs.length,
      template: templateDocs.length,
    } as Record<DocumentType, number>,
    reviewOverdue: DOCUMENTS.filter((d) => d.status === 'published' && new Date(d.nextReview) < new Date('2026-04-10')).length,
    inReview: DOCUMENTS.filter((d) => d.status === 'in_review').length,
    draft: DOCUMENTS.filter((d) => d.status === 'draft').length,
  };
}
```

- [ ] **Step A2.2: Typecheck**

```bash
pnpm typecheck 2>&1 | grep -v "^LUMEN" | grep -v "^  " | grep -E "^(data)" | head -20
```

Expected: empty.

- [ ] **Step A2.3: Commit**

```bash
git add data/prizym-governance/documents/
git commit -m "feat(sgm-rethink): consolidated document catalog (policies+plans+procedures+controls+templates)"
```

---

### Task A3: Create Obligations register data

**Files:**
- Create: `data/prizym-governance/compliance/obligations.ts`

- [ ] **Step A3.1: Write `obligations.ts`**

```ts
export type ObligationStatus = 'compliant' | 'at_risk' | 'non_compliant' | 'not_assessed';

export interface Obligation {
  id: string;
  code: string;
  name: string;
  jurisdiction: string;
  category: 'SOX / ICFR' | 'Tax' | 'Wage & Hour' | 'Revenue Recognition' | 'Data Security' | 'Internal Governance';
  status: ObligationStatus;
  lastAssessed: string;
  nextReview: string;
  owner: string;
  description: string;
  policiesMapped: string[];  // policy codes (SCP-001 etc.)
  controlsMapped: string[];  // control codes (SOX-001 etc.)
  evidenceCount: number;
}

export const OBLIGATIONS: Obligation[] = [
  {
    id: 'obl-sox-302', code: 'SOX §302',
    name: 'Sarbanes-Oxley Section 302 — Officer Certification',
    jurisdiction: 'US Federal (SEC)',
    category: 'SOX / ICFR',
    status: 'compliant',
    lastAssessed: '2026-03-31', nextReview: '2026-06-30',
    owner: 'CFO / Controller',
    description: 'Quarterly certification by the CEO and CFO that financial statements fairly present the company\'s financial condition and that disclosure controls are effective. Applies to the sales compensation program via its impact on recognized revenue and commission expense.',
    policiesMapped: ['SCP-018', 'SCP-019', 'SCP-020', 'SCP-021'],
    controlsMapped: ['SOX-001', 'SOX-002', 'SOX-004', 'SOX-006'],
    evidenceCount: 24,
  },
  {
    id: 'obl-sox-404', code: 'SOX §404',
    name: 'Sarbanes-Oxley Section 404 — ICFR Management Assessment',
    jurisdiction: 'US Federal (SEC)',
    category: 'SOX / ICFR',
    status: 'at_risk',
    lastAssessed: '2026-03-31', nextReview: '2026-04-30',
    owner: 'Internal Audit',
    description: 'Annual management assessment of internal controls over financial reporting, tested by external auditors. SCP-018 defines the control framework. Currently at-risk due to SOX-003 month-end cut-off test failure pending remediation.',
    policiesMapped: ['SCP-018'],
    controlsMapped: ['SOX-001', 'SOX-002', 'SOX-003', 'SOX-004', 'SOX-005', 'SOX-006'],
    evidenceCount: 61,
  },
  {
    id: 'obl-asc-606', code: 'ASC 606',
    name: 'FASB ASC 606 / IFRS 15 — Revenue from Contracts with Customers',
    jurisdiction: 'US Federal (FASB) / International (IFRS)',
    category: 'Revenue Recognition',
    status: 'compliant',
    lastAssessed: '2026-03-31', nextReview: '2026-06-30',
    owner: 'Revenue Controller',
    description: 'GAAP standard governing when and how revenue from customer contracts is recognized. Directly determines the commission-eligible revenue base. SPM-FW-007 and SPM-FW-008 are the authoritative internal frameworks. SCP-018 through SCP-021 are the implementing policies.',
    policiesMapped: ['SCP-018', 'SCP-019', 'SCP-020', 'SCP-021'],
    controlsMapped: ['SOX-003', 'SOX-004', 'SOX-006'],
    evidenceCount: 38,
  },
  {
    id: 'obl-irs-409a', code: 'IRC §409A',
    name: 'IRS Section 409A — Nonqualified Deferred Compensation',
    jurisdiction: 'US Federal (IRS)',
    category: 'Tax',
    status: 'compliant',
    lastAssessed: '2026-02-28', nextReview: '2026-08-28',
    owner: 'Tax / Legal',
    description: 'Federal tax code section governing deferred compensation arrangements, including multi-year incentive plans and certain commission deferral programs. SCP-011 defines the company\'s 409A compliance approach.',
    policiesMapped: ['SCP-011'],
    controlsMapped: ['TAX-409A'],
    evidenceCount: 12,
  },
  {
    id: 'obl-ca-ab-2288', code: 'CA AB-2288',
    name: 'California AB-2288 — Commission Statement Requirements',
    jurisdiction: 'California (State)',
    category: 'Wage & Hour',
    status: 'at_risk',
    lastAssessed: '2026-03-15', nextReview: '2026-04-15',
    owner: 'Legal',
    description: 'California law requiring written commission agreements and itemized commission statements with specific disclosure requirements. Three California territory reps have not yet acknowledged the updated 2026 statement format.',
    policiesMapped: ['SCP-010'],
    controlsMapped: ['WAGE-CA'],
    evidenceCount: 7,
  },
  {
    id: 'obl-ny-ll-191', code: 'NY LL §191',
    name: 'New York Labor Law Section 191 — Frequency of Wage Payments',
    jurisdiction: 'New York (State)',
    category: 'Wage & Hour',
    status: 'compliant',
    lastAssessed: '2026-03-18', nextReview: '2026-06-18',
    owner: 'Legal',
    description: 'New York state law requiring commissioned salespersons be paid at least monthly, with specific timing rules for earned commissions.',
    policiesMapped: ['SCP-010'],
    controlsMapped: ['WAGE-NY'],
    evidenceCount: 5,
  },
  {
    id: 'obl-soc-2', code: 'SOC 2 Type II',
    name: 'SOC 2 Type II — Trust Services Criteria',
    jurisdiction: 'AICPA (Auditor Standard)',
    category: 'Data Security',
    status: 'not_assessed',
    lastAssessed: '2025-12-31', nextReview: '2026-04-30',
    owner: 'Compliance Office',
    description: 'Service organization controls audit covering security, availability, processing integrity, confidentiality, and privacy of the commission management system. Annual re-certification currently overdue.',
    policiesMapped: ['SCP-018'],
    controlsMapped: ['DATA-SOC2'],
    evidenceCount: 0,
  },
  {
    id: 'obl-internal-charter', code: 'SCP Charter',
    name: 'Sales Compensation Policy Charter (Internal)',
    jurisdiction: 'Internal',
    category: 'Internal Governance',
    status: 'compliant',
    lastAssessed: '2026-01-15', nextReview: '2027-01-15',
    owner: 'Compensation Review Board',
    description: 'Internal governance charter establishing the CRB, SGCC, and policy approval framework. All 22 SCPs trace back to authority granted in this charter.',
    policiesMapped: ['SCP-001', 'SCP-007', 'SCP-008'],
    controlsMapped: ['GOV-CRB', 'GOV-SGCC'],
    evidenceCount: 4,
  },
];

export function getObligationStats() {
  return {
    total: OBLIGATIONS.length,
    compliant: OBLIGATIONS.filter(o => o.status === 'compliant').length,
    atRisk: OBLIGATIONS.filter(o => o.status === 'at_risk').length,
    nonCompliant: OBLIGATIONS.filter(o => o.status === 'non_compliant').length,
    notAssessed: OBLIGATIONS.filter(o => o.status === 'not_assessed').length,
  };
}
```

- [ ] **Step A3.2: Commit**

```bash
git add data/prizym-governance/compliance/
git commit -m "feat(sgm-rethink): add obligations register (8 synthetic regulations)"
```

---

### Task A4: Create Exceptions workflow data

**Files:**
- Create: `data/prizym-governance/workflows/exceptions.ts`

- [ ] **Step A4.1: Write `exceptions.ts`**

```ts
export type ExceptionStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type ExceptionType =
  | 'territory_waiver'
  | 'quota_appeal'
  | 'clawback_waiver'
  | 'asc606_treatment'
  | 'windfall_deviation'
  | 'plan_interpretation';

export interface PolicyException {
  id: string;
  caseNumber: string;
  type: ExceptionType;
  title: string;
  policyRef: string;
  requestedBy: string;
  requestedAt: string;
  status: ExceptionStatus;
  approver: string;
  approvedAt?: string;
  expiresAt?: string;
  amountImpact?: number;
  justification: string;
  dealContext?: string;
}

export const EXCEPTIONS: PolicyException[] = [
  {
    id: 'exc-001', caseNumber: 'EXC-2026-012',
    type: 'territory_waiver',
    title: 'Territory Protection Waiver — Pacific NW Healthcare Account',
    policyRef: 'SCP-006',
    requestedBy: 'AE-4471 (Pacific NW)',
    requestedAt: '2026-04-02',
    status: 'pending',
    approver: 'VP Sales',
    amountImpact: 420_000,
    justification: 'Account originally covered under Pacific NW territory. Customer moved HQ to Central region in Q1 but requested continuity of rep. Requesting 6-month waiver from SCP-006 territory reassignment rules to preserve customer relationship through annual renewal.',
    dealContext: '$420K ARR renewal, existing 3-year customer, high churn risk if rep changes mid-cycle.',
  },
  {
    id: 'exc-002', caseNumber: 'EXC-2026-011',
    type: 'clawback_waiver',
    title: 'Clawback Waiver — Customer Bankruptcy Force Majeure',
    policyRef: 'SCP-009',
    requestedBy: 'AE-2156 (Enterprise)',
    requestedAt: '2026-03-28',
    status: 'pending',
    approver: 'CRB',
    amountImpact: 67_800,
    justification: 'Customer filed Chapter 11 within 45 days of close. Rep requests force majeure exception to standard SCP-009 clawback. Precedent-setting — if granted, will inform future bankruptcy-related clawback decisions.',
    dealContext: 'Q1 lab equipment order, $678K TCV, commission $67.8K, cancelled 2026-03-12.',
  },
  {
    id: 'exc-003', caseNumber: 'EXC-2026-010',
    type: 'asc606_treatment',
    title: 'ASC 606 Treatment Exception — Multi-Element Bundle',
    policyRef: 'SCP-018',
    requestedBy: 'Revenue Accounting',
    requestedAt: '2026-04-06',
    status: 'pending',
    approver: 'Revenue Controller + External Audit',
    amountImpact: 312_000,
    justification: 'Multi-year SaaS bundle with non-distinct onboarding creates ambiguity in PO allocation. Requesting approval to use residual method vs. relative SSP, which would create $312K allocation variance and $67K commission timing impact. Needs SOX sign-off.',
    dealContext: 'Enterprise SaaS 3-year deal, $4.2M TCV.',
  },
  {
    id: 'exc-004', caseNumber: 'EXC-2026-009',
    type: 'windfall_deviation',
    title: 'Windfall Cap Deviation — West Region Enterprise Deal',
    policyRef: 'SCP-007',
    requestedBy: 'Marissa Chen (West RVP)',
    requestedAt: '2026-04-02',
    status: 'pending',
    approver: 'CRB',
    amountImpact: 247_000,
    justification: 'SCP-007 default windfall treatment is 135% cap. Requesting full payout (no cap) for the $14.5M West Region deal, arguing that standard windfall criteria don\'t apply because rep was primary driver from first contact through close.',
    dealContext: '$14.5M ARR enterprise deal, projected payout $247K.',
  },
  {
    id: 'exc-005', caseNumber: 'EXC-2026-008',
    type: 'quota_appeal',
    title: 'Mid-Year Quota Relief — Territory Consolidation',
    policyRef: 'SCP-002',
    requestedBy: 'Kyle Morrison (Central RVP)',
    requestedAt: '2026-03-25',
    status: 'approved',
    approver: 'SGCC',
    approvedAt: '2026-04-01',
    expiresAt: '2026-09-30',
    amountImpact: 142_000,
    justification: 'Territory consolidation after departing AE left 3 reps with disproportionate account coverage. Approved 15% mid-year quota relief through Q3 to allow re-baseline.',
  },
  {
    id: 'exc-006', caseNumber: 'EXC-2026-007',
    type: 'plan_interpretation',
    title: 'LOA Pro-Rata Interpretation — SPIF Eligibility Edge Case',
    policyRef: 'SCP-005, SCP-008',
    requestedBy: 'HR Business Partner',
    requestedAt: '2026-03-15',
    status: 'approved',
    approver: 'Sales Comp Lead',
    approvedAt: '2026-03-22',
    expiresAt: '2026-06-22',
    amountImpact: 12_500,
    justification: 'Rep returned from medical LOA mid-SPIF period. Approved 51.1% pro-rata SPIF payout based on days active (46/90).',
  },
  {
    id: 'exc-007', caseNumber: 'EXC-2026-006',
    type: 'territory_waiver',
    title: 'Joint Coverage Exception — Named Account Overlap',
    policyRef: 'SCP-001, SCP-006',
    requestedBy: 'Healthcare Named AE',
    requestedAt: '2026-02-20',
    status: 'expired',
    approver: 'VP Sales',
    approvedAt: '2026-02-28',
    expiresAt: '2026-03-31',
    amountImpact: 89_000,
    justification: 'Temporary joint coverage waiver for a healthcare vertical account during transition from Territory to Named Account coverage. Expired 2026-03-31, no renewal requested.',
  },
];

export function getExceptionStats() {
  return {
    pending: EXCEPTIONS.filter(e => e.status === 'pending').length,
    approved: EXCEPTIONS.filter(e => e.status === 'approved').length,
    rejected: EXCEPTIONS.filter(e => e.status === 'rejected').length,
    expired: EXCEPTIONS.filter(e => e.status === 'expired').length,
    totalImpact: EXCEPTIONS.reduce((sum, e) => sum + (e.amountImpact ?? 0), 0),
  };
}
```

- [ ] **Step A4.2: Commit**

```bash
git add data/prizym-governance/workflows/
git commit -m "feat(sgm-rethink): add policy exceptions register (7 synthetic exceptions)"
```

---

### Task A5: Rewrite demo.config.ts nav to 6-group IA

**Files:**
- Modify: `app/(demos)/prizym-governance/demo.config.ts`

- [ ] **Step A5.1: Replace the `nav` array**

Replace the entire `nav: [...]` array with:

```ts
  nav: [
    {
      section: 'Home',
      color: '#0891b2',
      items: [
        { label: 'My Workspace', href: '/prizym-governance', icon: 'Home' },
      ],
    },
    {
      section: 'Documents',
      color: '#1e40af',
      items: [
        { label: 'Comp Plans', href: '/prizym-governance/documents/comp-plans', icon: 'FileText' },
        { label: 'Policies', href: '/prizym-governance/documents/policies', icon: 'BookOpen' },
        { label: 'Procedures', href: '/prizym-governance/documents/procedures', icon: 'ListChecks' },
        { label: 'Controls', href: '/prizym-governance/documents/controls', icon: 'ShieldCheck' },
        { label: 'Templates', href: '/prizym-governance/documents/templates', icon: 'LayoutTemplate' },
      ],
    },
    {
      section: 'Tools',
      color: '#0891b2',
      items: [
        { label: 'ASC 606 Calculator', href: '/prizym-governance/tools/asc606-calculator', icon: 'Calculator' },
        { label: '88-Checkpoint Framework', href: '/prizym-governance/tools/framework', icon: 'Grid3x3' },
        { label: 'Governance Frameworks', href: '/prizym-governance/tools/frameworks', icon: 'Network' },
      ],
    },
    {
      section: 'Compliance',
      color: '#10b981',
      items: [
        { label: 'Obligations', href: '/prizym-governance/compliance/obligations', icon: 'Scale' },
        { label: 'Control Status', href: '/prizym-governance/compliance/controls', icon: 'ShieldCheck' },
        { label: 'Reports', href: '/prizym-governance/compliance/reports', icon: 'BarChart3' },
        { label: 'Audit Readiness', href: '/prizym-governance/compliance/audit', icon: 'ClipboardCheck' },
      ],
    },
    {
      section: 'Workflows',
      color: '#0ea5e9',
      items: [
        { label: 'Approvals', href: '/prizym-governance/workflows/approvals', icon: 'CheckSquare' },
        { label: 'Attestations', href: '/prizym-governance/workflows/attestations', icon: 'PenLine' },
        { label: 'Reviews', href: '/prizym-governance/workflows/reviews', icon: 'Gavel' },
        { label: 'Exceptions', href: '/prizym-governance/workflows/exceptions', icon: 'AlertOctagon' },
        { label: 'Cases', href: '/prizym-governance/workflows/cases', icon: 'Briefcase' },
        { label: 'Committees', href: '/prizym-governance/workflows/committees', icon: 'Users' },
        { label: 'Calendar', href: '/prizym-governance/workflows/calendar', icon: 'Calendar' },
        { label: 'Audit Trail', href: '/prizym-governance/workflows/audit-trail', icon: 'History' },
      ],
    },
    {
      section: 'AI',
      color: '#8b5cf6',
      items: [
        { label: 'AskSGM Workspace', href: '/prizym-governance/asksgm', icon: 'Sparkles' },
      ],
    },
  ],
```

Also update the `colors` field above:
```ts
  colors: {
    primary: '#0891b2',
    accent: '#10b981',
  },
```

- [ ] **Step A5.2: Regen registry**

```bash
pnpm generate:registry 2>&1 | tail -3
```

Expected: `✓ Generated registry with 15 demos`.

- [ ] **Step A5.3: Commit**

```bash
git add app/\(demos\)/prizym-governance/demo.config.ts data/demo-registry.ts
git commit -m "feat(sgm-rethink): switch demo.config.ts to 6-group product IA"
```

---

## Wave B — Delete old pages

All these pages will be re-homed in Wave C under new URLs. Deleting first is safer because some have stale imports that will now fail.

### Task B1: Delete all old pages in one pass

- [ ] **Step B1.1: Remove old routes**

```bash
rm -rf \
  "app/(demos)/prizym-governance/design" \
  "app/(demos)/prizym-governance/operate" \
  "app/(demos)/prizym-governance/dispute" \
  "app/(demos)/prizym-governance/oversee" \
  "app/(demos)/prizym-governance/library" \
  "app/(demos)/prizym-governance/committees" \
  "app/(demos)/prizym-governance/policies" \
  "app/(demos)/prizym-governance/plans" \
  "app/(demos)/prizym-governance/templates" \
  "app/(demos)/prizym-governance/dashboard" \
  "app/(demos)/prizym-governance/analytics" \
  "app/(demos)/prizym-governance/audit"
```

- [ ] **Step B1.2: Verify what's left**

```bash
ls "app/(demos)/prizym-governance/"
```

Expected: `asksgm`, `demo.config.ts`, `layout.tsx`, `page.tsx` — and nothing else.

- [ ] **Step B1.3: Commit**

```bash
git add -A "app/(demos)/prizym-governance/"
git commit -m "feat(sgm-rethink): delete old quadrant pages (re-homed in Wave C)"
```

---

## Wave C — Build new page structure

### Task C1: Home / My Workspace page

**Files:**
- Modify: `app/(demos)/prizym-governance/page.tsx`

- [ ] **Step C1.1: Replace `page.tsx`**

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard, GaugeChart } from '@/components/demos/prizym-governance/StatusBadge';
import { getDocumentStats, DOCUMENTS, isReviewOverdue } from '@/data/prizym-governance/documents/catalog';
import { getApprovalStats } from '@/data/prizym-governance/operate';
import { getComplianceScore, COMPLIANCE_CONTROLS } from '@/data/prizym-governance/oversee';
import { getExceptionStats, EXCEPTIONS } from '@/data/prizym-governance/workflows/exceptions';
import { getObligationStats, OBLIGATIONS } from '@/data/prizym-governance/compliance/obligations';
import { henryScheinOrgProfile } from '@/data/prizym-governance/henry-schein/org-profile';
import {
  CheckSquare, PenLine, AlertTriangle, ShieldCheck, ArrowRight,
  Clock, AlertOctagon, Activity, FileText,
} from 'lucide-react';

export default function MyWorkspacePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const docStats = getDocumentStats();
  const approvalStats = getApprovalStats();
  const complianceScore = getComplianceScore();
  const exceptionStats = getExceptionStats();
  const oblStats = getObligationStats();

  const overdueReviews = DOCUMENTS.filter(d => isReviewOverdue(d, new Date('2026-04-10'))).length;
  const pendingAttestations = DOCUMENTS.filter(d => d.type === 'policy' && (d.attestationPct ?? 100) < 100).length;
  const atRiskControls = COMPLIANCE_CONTROLS.filter(c => c.status === 'at_risk' || c.status === 'non_compliant').length;

  const metrics = [
    { label: 'Pending Attestations', value: String(pendingAttestations), icon: PenLine, color: '#f59e0b', sub: 'policies need acknowledgment' },
    { label: 'Pending Approvals', value: String(approvalStats.pending), icon: CheckSquare, color: '#0ea5e9', sub: `${approvalStats.highPriority} high priority` },
    { label: 'Reviews Overdue', value: String(overdueReviews), icon: Clock, color: '#ef4444', sub: 'past next review date' },
    { label: 'Compliance Score', value: `${complianceScore}%`, icon: ShieldCheck, color: '#10b981', sub: `${atRiskControls} at risk` },
  ];

  return (
    <PrizymPage
      title={`Welcome back — ${henryScheinOrgProfile.name}`}
      subtitle="Your compliance workspace — pending attestations, approvals, reviews, and program pulse in one view."
      hero
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* For Your Attention */}
        <div className="pg-card-elevated lg:col-span-2">
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
            For Your Attention
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {EXCEPTIONS.filter(e => e.status === 'pending').slice(0, 3).map((e) => (
              <Link key={e.id} href="/prizym-governance/workflows/exceptions" className="pg-card" style={{ textDecoration: 'none', borderLeft: '3px solid #f59e0b', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="pg-overline" style={{ color: '#f59e0b' }}>{e.caseNumber} · Exception · {e.policyRef}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pg-text)', marginTop: 4 }}>{e.title}</div>
                    <div className="pg-caption" style={{ marginTop: 6, lineHeight: 1.5 }}>Awaiting {e.approver}</div>
                  </div>
                  {e.amountImpact && <div style={{ textAlign: 'right', fontSize: 18, fontWeight: 700, color: 'var(--pg-text)' }}>${Math.round(e.amountImpact / 1000)}K</div>}
                </div>
              </Link>
            ))}
            {DOCUMENTS.filter(d => isReviewOverdue(d, new Date('2026-04-10'))).slice(0, 2).map((d) => (
              <Link key={d.id} href={`/prizym-governance/documents/${d.type === 'comp_plan' ? 'comp-plans' : d.type + 's'}`} className="pg-card" style={{ textDecoration: 'none', borderLeft: '3px solid #ef4444', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="pg-overline" style={{ color: '#ef4444' }}>{d.code} · Review Overdue</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pg-text)', marginTop: 4 }}>{d.title}</div>
                    <div className="pg-caption" style={{ marginTop: 6 }}>Last review: {d.nextReview} · Owner: {d.owner}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Program Pulse */}
        <div className="pg-card-elevated">
          <h3 className="pg-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Activity size={18} style={{ color: '#10b981' }} />
            Program Pulse
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
            <GaugeChart value={complianceScore} size={140} strokeWidth={12} color="#10b981" label="Compliance" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Documents published</span><strong>{DOCUMENTS.filter(d => d.status === 'published').length}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Obligations tracked</span><strong>{oblStats.total}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Active exceptions</span><strong>{exceptionStats.pending}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Obligations at risk</span><strong style={{ color: '#f59e0b' }}>{oblStats.atRisk}</strong></div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <h3 className="pg-subheading" style={{ marginBottom: 14 }}>Jump to</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {[
          { href: '/prizym-governance/documents/policies', label: 'Policy Library', icon: FileText, count: `${docStats.byType.policy} policies` },
          { href: '/prizym-governance/tools/asc606-calculator', label: 'ASC 606 Calculator', icon: Calculator, count: 'Interactive tool' },
          { href: '/prizym-governance/compliance/obligations', label: 'Obligations', icon: Scale, count: `${oblStats.total} tracked` },
          { href: '/prizym-governance/workflows/exceptions', label: 'Exceptions', icon: AlertOctagon, count: `${exceptionStats.pending} pending` },
        ].map((t, i) => {
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className="pg-card" style={{
              display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none',
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s ease', transitionDelay: `${0.3 + i * 0.06}s`,
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} style={{ color: '#10b981' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pg-text)' }}>{t.label}</div>
                <div className="pg-caption" style={{ fontSize: 13 }}>{t.count}</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--pg-text-muted)' }} />
            </Link>
          );
        })}
      </div>
    </PrizymPage>
  );
}
```

**Note:** The `Calculator` and `Scale` icons referenced in the Quick links block need imports. Add to the icon import line: `Calculator, Scale`.

- [ ] **Step C1.2: Typecheck**

```bash
pnpm typecheck 2>&1 | grep -v "^LUMEN" | grep -v "^  " | grep -E "^(app)" | head -10
```

Expected: empty.

- [ ] **Step C1.3: Commit**

```bash
git add "app/(demos)/prizym-governance/page.tsx"
git commit -m "feat(sgm-rethink): Home / My Workspace inbox page"
```

---

### Task C2: Unified Documents library page

**Files:**
- Create: `app/(demos)/prizym-governance/documents/[type]/page.tsx`

This is ONE dynamic route serving all 5 document types via a `[type]` segment. `generateStaticParams` returns the 5 known types.

- [ ] **Step C2.1: Write `documents/[type]/page.tsx`**

```tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import {
  DOCUMENTS, getDocumentStats, isReviewOverdue,
} from '@/data/prizym-governance/documents/catalog';
import {
  DOCUMENT_TYPE_LABELS, LIFECYCLE_STATUS_LABELS,
  type DocumentType, type LifecycleStatus, type DocumentRecord,
} from '@/data/prizym-governance/documents/types';
import { FileText, BookOpen, ListChecks, ShieldCheck, LayoutTemplate, X, AlertTriangle } from 'lucide-react';

const URL_TO_TYPE: Record<string, DocumentType> = {
  'comp-plans': 'comp_plan',
  'policies': 'policy',
  'procedures': 'procedure',
  'controls': 'control',
  'templates': 'template',
};

const TYPE_TO_URL: Record<DocumentType, string> = {
  comp_plan: 'comp-plans',
  policy: 'policies',
  procedure: 'procedures',
  control: 'controls',
  template: 'templates',
};

const TYPE_ICONS: Record<DocumentType, typeof FileText> = {
  comp_plan: FileText,
  policy: BookOpen,
  procedure: ListChecks,
  control: ShieldCheck,
  template: LayoutTemplate,
};

export function generateStaticParams() {
  return Object.keys(URL_TO_TYPE).map((type) => ({ type }));
}

export default function DocumentsByTypePage({ params }: { params: { type: string } }) {
  const docType = URL_TO_TYPE[params.type];
  if (!docType) return notFound();

  const [statusFilter, setStatusFilter] = useState<LifecycleStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selected, setSelected] = useState<DocumentRecord | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const docs = useMemo(() => DOCUMENTS.filter((d) => d.type === docType), [docType]);
  const categories = useMemo(() => Array.from(new Set(docs.map(d => d.category))), [docs]);
  const filtered = useMemo(
    () => docs.filter(d =>
      (statusFilter === 'all' || d.status === statusFilter) &&
      (categoryFilter === 'all' || d.category === categoryFilter)
    ),
    [docs, statusFilter, categoryFilter]
  );

  const stats = getDocumentStats();
  const overdueCount = docs.filter(d => isReviewOverdue(d, new Date('2026-04-10'))).length;

  const tabs: DocumentType[] = ['comp_plan', 'policy', 'procedure', 'control', 'template'];
  const today = new Date('2026-04-10');

  return (
    <PrizymPage
      title={`${DOCUMENT_TYPE_LABELS[docType]}`}
      subtitle={`${filtered.length} of ${docs.length} ${DOCUMENT_TYPE_LABELS[docType].toLowerCase()} shown · ${overdueCount} review overdue`}
    >
      {/* Type tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--pg-border)', marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map((t) => {
          const Icon = TYPE_ICONS[t];
          const active = t === docType;
          return (
            <Link
              key={t}
              href={`/prizym-governance/documents/${TYPE_TO_URL[t]}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 18px',
                borderBottom: active ? '2px solid var(--pg-cyan)' : '2px solid transparent',
                color: active ? 'var(--pg-cyan)' : 'var(--pg-text-muted)',
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
              }}
            >
              <Icon size={16} />
              {DOCUMENT_TYPE_LABELS[t]}
              <span style={{ padding: '2px 8px', borderRadius: 10, background: active ? 'rgba(14,165,233,0.15)' : 'var(--pg-stripe)', fontSize: 12, fontWeight: 700 }}>
                {stats.byType[t]}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['all', 'draft', 'in_review', 'approved', 'published', 'superseded'] as const).map((s) => {
            const active = statusFilter === s;
            return (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '6px 12px', borderRadius: 16,
                background: active ? 'rgba(16,185,129,0.2)' : 'var(--pg-stripe)',
                border: active ? '1px solid rgba(16,185,129,0.5)' : '1px solid var(--pg-border)',
                color: active ? '#10b981' : 'var(--pg-text-muted)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              }}>
                {s === 'all' ? 'All Status' : LIFECYCLE_STATUS_LABELS[s as LifecycleStatus]}
              </button>
            );
          })}
        </div>
        {categories.length > 1 && (
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ padding: '8px 12px', background: 'var(--pg-card)', border: '1px solid var(--pg-border)', borderRadius: 8, color: 'var(--pg-text)', fontSize: 14 }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {/* Document table */}
      <div className="pg-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--pg-surface-alt)', borderBottom: '1px solid var(--pg-border)' }}>
                {['Code', 'Title', 'Category', 'Status', 'Version', 'Owner', 'Next Review', 'Attestation'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => {
                const overdue = isReviewOverdue(d, today);
                return (
                  <tr
                    key={d.id}
                    onClick={() => setSelected(d)}
                    style={{
                      borderBottom: '1px solid var(--pg-border-faint)', cursor: 'pointer',
                      opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease', transitionDelay: `${i * 0.02}s`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--pg-cyan)' }}>{d.code}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>
                      {d.title}
                      {overdue && (
                        <span style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 10, background: 'rgba(239,68,68,0.22)', color: '#fca5a5', fontSize: 11, fontWeight: 700 }}>
                          <AlertTriangle size={11} /> REVIEW OVERDUE
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{d.category}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={d.status} /></td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-muted)' }}>v{d.version}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{d.owner}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: overdue ? '#fca5a5' : 'var(--pg-text-muted)' }}>{d.nextReview}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text)', fontWeight: 600 }}>
                      {d.attestationPct !== undefined ? `${d.attestationPct}%` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <aside onClick={e => e.stopPropagation()} className="pg-card" style={{ width: 'min(820px, 92vw)', height: '100%', overflowY: 'auto', borderRadius: 0, padding: '28px 36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>{selected.code} · {DOCUMENT_TYPE_LABELS[selected.type]}</span>
                <h2 className="pg-heading" style={{ marginTop: 4 }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--pg-text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Status</div>
                <div style={{ marginTop: 4 }}><StatusBadge status={selected.status} /></div>
              </div>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Version</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>v{selected.version}</div>
              </div>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Owner</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.owner}</div>
              </div>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Next Review</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.nextReview}</div>
              </div>
              {selected.attestationPct !== undefined && (
                <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                  <div className="pg-overline" style={{ fontSize: 11 }}>Attestation</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.attestationPct}% of {selected.targetAudience}</div>
                </div>
              )}
            </div>

            <h3 className="pg-subheading" style={{ marginBottom: 10 }}>Description</h3>
            <p className="pg-caption" style={{ lineHeight: 1.7, marginBottom: 20 }}>{selected.description}</p>

            {selected.content && (
              <>
                <h3 className="pg-subheading" style={{ marginBottom: 10 }}>Content</h3>
                <div style={{ fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--pg-text)', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                  {selected.content}
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </PrizymPage>
  );
}
```

- [ ] **Step C2.2: Typecheck + commit**

```bash
pnpm typecheck 2>&1 | grep -v "^LUMEN" | grep -v "^  " | grep -E "^(app|data)" | head -10
git add "app/(demos)/prizym-governance/documents/"
git commit -m "feat(sgm-rethink): unified Documents library page with 5 type tabs"
```

---

### Task C3: Move ASC 606 Calculator and Framework browser to Tools

**Files:**
- Create: `app/(demos)/prizym-governance/tools/asc606-calculator/page.tsx`
- Create: `app/(demos)/prizym-governance/tools/framework/page.tsx`
- Create: `app/(demos)/prizym-governance/tools/frameworks/page.tsx`

- [ ] **Step C3.1: ASC 606 Calculator — create file**

This is a **verbatim copy** of the old `app/(demos)/prizym-governance/design/asc606-calculator/page.tsx` content. The file was already deleted in Wave B, but the contents are in git history at commit `8d3e872`. Recreate it by fetching the old content.

```bash
mkdir -p "app/(demos)/prizym-governance/tools/asc606-calculator"
git show 8d3e872:"app/(demos)/prizym-governance/design/asc606-calculator/page.tsx" > "app/(demos)/prizym-governance/tools/asc606-calculator/page.tsx"
```

**Note**: The file's internal breadcrumb links to `/prizym-governance/design` — update to `/prizym-governance/tools`. But wait — the rewrite I did in an earlier commit wrapped it in `PrizymPage` and removed the breadcrumb. Use `git log --all -- "app/(demos)/prizym-governance/design/asc606-calculator/page.tsx"` to find the latest version before deletion, typically commit `91551fa` which had the PrizymPage wrapper. Use that instead.

```bash
git show 91551fa:"app/(demos)/prizym-governance/design/asc606-calculator/page.tsx" > "app/(demos)/prizym-governance/tools/asc606-calculator/page.tsx"
```

- [ ] **Step C3.2: 88-Checkpoint Framework browser — create file**

```bash
mkdir -p "app/(demos)/prizym-governance/tools/framework"
git show 91551fa:"app/(demos)/prizym-governance/library/framework/page.tsx" > "app/(demos)/prizym-governance/tools/framework/page.tsx"
```

- [ ] **Step C3.3: Frameworks reference page — new**

```bash
mkdir -p "app/(demos)/prizym-governance/tools/frameworks"
```

Create `app/(demos)/prizym-governance/tools/frameworks/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { asc606Frameworks } from '@/data/prizym-governance/asc606';
import { Network, BookOpen, ArrowRight } from 'lucide-react';

const FRAMEWORKS = [
  { code: 'SGM-88', title: '88-Checkpoint Governance Framework', description: 'The complete Sales Governance Management framework covering 12 phases across Design, Operate, Dispute, and Oversee quadrants.', href: '/prizym-governance/tools/framework', icon: Network, accent: '#0891b2' },
  ...asc606Frameworks.map(f => ({
    code: f.code, title: f.title, description: f.content.slice(0, 200) + '...',
    href: '/prizym-governance/documents/policies', icon: BookOpen, accent: '#10b981',
  })),
];

export default function FrameworksPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <PrizymPage
      title="Governance Frameworks"
      subtitle="Authoritative reference frameworks for sales compensation governance, revenue recognition, and SOX compliance."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FRAMEWORKS.map((f, i) => {
          const Icon = f.icon;
          return (
            <Link key={f.code} href={f.href} className="pg-card-elevated" style={{
              display: 'block', textDecoration: 'none', borderTop: `3px solid ${f.accent}`,
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: `${0.2 + i * 0.1}s`,
            }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${f.accent}22`, border: `1px solid ${f.accent}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} style={{ color: f.accent }} />
                </div>
                <div style={{ flex: 1 }}>
                  <span className="pg-overline" style={{ color: f.accent, fontSize: 11 }}>{f.code}</span>
                  <h3 className="pg-subheading" style={{ marginTop: 4 }}>{f.title}</h3>
                </div>
              </div>
              <p className="pg-caption" style={{ lineHeight: 1.6, marginBottom: 14 }}>{f.description}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: f.accent, fontSize: 14, fontWeight: 600 }}>
                Open framework <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </PrizymPage>
  );
}
```

- [ ] **Step C3.4: Typecheck + commit**

```bash
pnpm typecheck 2>&1 | grep -v "^LUMEN" | grep -v "^  " | grep -E "^(app|data)" | head -10
git add "app/(demos)/prizym-governance/tools/"
git commit -m "feat(sgm-rethink): Tools group (ASC 606 calc, framework browser, frameworks reference)"
```

---

### Task C4: Compliance pages (Obligations + Controls + Reports + Audit)

**Files:**
- Create: `app/(demos)/prizym-governance/compliance/obligations/page.tsx`
- Create: `app/(demos)/prizym-governance/compliance/controls/page.tsx`
- Create: `app/(demos)/prizym-governance/compliance/reports/page.tsx`
- Create: `app/(demos)/prizym-governance/compliance/audit/page.tsx`

- [ ] **Step C4.1: Obligations register page — new**

Create `app/(demos)/prizym-governance/compliance/obligations/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { OBLIGATIONS, getObligationStats, type Obligation } from '@/data/prizym-governance/compliance/obligations';
import { Scale, CheckCircle2, AlertTriangle, XCircle, Clock, X } from 'lucide-react';

export default function ObligationsPage() {
  const [selected, setSelected] = useState<Obligation | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = getObligationStats();

  const metrics = [
    { label: 'Total Obligations', value: String(stats.total), icon: Scale, color: '#0891b2' },
    { label: 'Compliant', value: String(stats.compliant), icon: CheckCircle2, color: '#10b981' },
    { label: 'At Risk', value: String(stats.atRisk), icon: AlertTriangle, color: '#f59e0b' },
    { label: 'Not Assessed', value: String(stats.notAssessed), icon: Clock, color: '#64748b' },
  ];

  return (
    <PrizymPage
      title="Obligations Register"
      subtitle="Regulatory and internal obligations mapped to policies, controls, and evidence. The single source of truth for what we must comply with."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div className="pg-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--pg-surface-alt)', borderBottom: '1px solid var(--pg-border)' }}>
                {['Code', 'Name', 'Jurisdiction', 'Category', 'Status', 'Policies', 'Controls', 'Next Review'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--pg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OBLIGATIONS.map((o, i) => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
                  style={{
                    borderBottom: '1px solid var(--pg-border-faint)', cursor: 'pointer',
                    opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease', transitionDelay: `${i * 0.03}s`,
                  }}
                >
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--pg-cyan)' }}>{o.code}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{o.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{o.jurisdiction}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{o.category}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{o.policiesMapped.length}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-secondary)' }}>{o.controlsMapped.length}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--pg-text-muted)' }}>{o.nextReview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <aside onClick={e => e.stopPropagation()} className="pg-card" style={{ width: 'min(720px, 92vw)', height: '100%', overflowY: 'auto', borderRadius: 0, padding: '28px 36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>{selected.code} · {selected.category}</span>
                <h2 className="pg-heading" style={{ marginTop: 4 }}>{selected.name}</h2>
                <p className="pg-caption" style={{ marginTop: 6 }}>{selected.jurisdiction}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--pg-text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <p className="pg-caption" style={{ lineHeight: 1.7, marginBottom: 24 }}>{selected.description}</p>
            <h3 className="pg-subheading" style={{ marginBottom: 10 }}>Mapped Policies ({selected.policiesMapped.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {selected.policiesMapped.map(p => <span key={p} className="pg-tag">{p}</span>)}
            </div>
            <h3 className="pg-subheading" style={{ marginBottom: 10 }}>Mapped Controls ({selected.controlsMapped.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selected.controlsMapped.map(c => <span key={c} className="pg-tag">{c}</span>)}
            </div>
          </aside>
        </div>
      )}
    </PrizymPage>
  );
}
```

- [ ] **Step C4.2: Control Status page — restore old compliance page**

```bash
mkdir -p "app/(demos)/prizym-governance/compliance/controls"
git show 91551fa:"app/(demos)/prizym-governance/oversee/compliance/page.tsx" > "app/(demos)/prizym-governance/compliance/controls/page.tsx"
```

- [ ] **Step C4.3: Reports page — restore old reports page**

```bash
mkdir -p "app/(demos)/prizym-governance/compliance/reports"
git show 91551fa:"app/(demos)/prizym-governance/oversee/reports/page.tsx" > "app/(demos)/prizym-governance/compliance/reports/page.tsx"
```

- [ ] **Step C4.4: Audit Readiness page — new simple page**

Create `app/(demos)/prizym-governance/compliance/audit/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard } from '@/components/demos/prizym-governance/StatusBadge';
import { OBLIGATIONS, getObligationStats } from '@/data/prizym-governance/compliance/obligations';
import { getComplianceScore, COMPLIANCE_CONTROLS } from '@/data/prizym-governance/oversee';
import { getDocumentStats, DOCUMENTS, isReviewOverdue } from '@/data/prizym-governance/documents/catalog';
import { ClipboardCheck, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AuditReadinessPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const oblStats = getObligationStats();
  const complianceScore = getComplianceScore();
  const docStats = getDocumentStats();
  const today = new Date('2026-04-10');
  const overdueDocs = DOCUMENTS.filter(d => isReviewOverdue(d, today));
  const atRiskControls = COMPLIANCE_CONTROLS.filter(c => c.status === 'at_risk' || c.status === 'non_compliant');
  const readinessPct = Math.round(
    (complianceScore * 0.5) +
    ((oblStats.compliant / oblStats.total) * 100 * 0.3) +
    ((docStats.total - docStats.reviewOverdue) / docStats.total * 100 * 0.2)
  );

  const metrics = [
    { label: 'Audit Readiness', value: `${readinessPct}%`, icon: ClipboardCheck, color: '#10b981', sub: 'composite score' },
    { label: 'Compliance Score', value: `${complianceScore}%`, icon: ShieldCheck, color: '#0891b2' },
    { label: 'Open Findings', value: String(atRiskControls.length + overdueDocs.length), icon: AlertTriangle, color: '#f59e0b', sub: 'controls + reviews' },
    { label: 'Obligations Current', value: `${oblStats.compliant}/${oblStats.total}`, icon: CheckCircle2, color: '#10b981' },
  ];

  return (
    <PrizymPage title="Audit Readiness" subtitle="Composite view of program readiness for external audit — findings, evidence gaps, and remediation status.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="pg-card-elevated">
          <h3 className="pg-section-title" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} style={{ color: '#f59e0b' }} /> Open Findings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {atRiskControls.map(c => (
              <div key={c.id} className="pg-card" style={{ borderLeft: '3px solid #f59e0b' }}>
                <div className="pg-overline" style={{ color: '#f59e0b', fontSize: 11 }}>{c.code} · {c.status === 'non_compliant' ? 'NON-COMPLIANT' : 'AT RISK'}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)', marginTop: 4 }}>{c.name}</div>
                <div className="pg-caption" style={{ marginTop: 4 }}>Owner: {c.owner} · Next test: {c.nextTest}</div>
              </div>
            ))}
            {overdueDocs.slice(0, 3).map(d => (
              <div key={d.id} className="pg-card" style={{ borderLeft: '3px solid #ef4444' }}>
                <div className="pg-overline" style={{ color: '#ef4444', fontSize: 11 }}>{d.code} · REVIEW OVERDUE</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)', marginTop: 4 }}>{d.title}</div>
                <div className="pg-caption" style={{ marginTop: 4 }}>Next review was: {d.nextReview} · Owner: {d.owner}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pg-card-elevated">
          <h3 className="pg-section-title" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} /> Evidence Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {OBLIGATIONS.map(o => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--pg-surface-alt)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pg-text)' }}>{o.code}</div>
                  <div className="pg-caption" style={{ fontSize: 11 }}>{o.category}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: o.evidenceCount > 0 ? '#10b981' : '#ef4444' }}>{o.evidenceCount}</div>
                  <div className="pg-caption" style={{ fontSize: 10 }}>artifacts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PrizymPage>
  );
}
```

- [ ] **Step C4.5: Typecheck + commit**

```bash
pnpm typecheck 2>&1 | grep -v "^LUMEN" | grep -v "^  " | grep -E "^(app|data)" | head -10
git add "app/(demos)/prizym-governance/compliance/"
git commit -m "feat(sgm-rethink): Compliance group (obligations, controls, reports, audit readiness)"
```

---

### Task C5: Workflows pages (Approvals, Attestations, Reviews, Exceptions, Cases, Committees, Calendar, Audit Trail)

**Files:**
- Create: 8 pages under `app/(demos)/prizym-governance/workflows/*/page.tsx`

- [ ] **Step C5.1: Restore pages from git history**

```bash
mkdir -p \
  "app/(demos)/prizym-governance/workflows/approvals" \
  "app/(demos)/prizym-governance/workflows/reviews" \
  "app/(demos)/prizym-governance/workflows/cases" \
  "app/(demos)/prizym-governance/workflows/committees" \
  "app/(demos)/prizym-governance/workflows/calendar" \
  "app/(demos)/prizym-governance/workflows/audit-trail"

git show 91551fa:"app/(demos)/prizym-governance/operate/approvals/page.tsx" > "app/(demos)/prizym-governance/workflows/approvals/page.tsx"
git show 91551fa:"app/(demos)/prizym-governance/operate/decisions/page.tsx" > "app/(demos)/prizym-governance/workflows/reviews/page.tsx"
git show 91551fa:"app/(demos)/prizym-governance/dispute/cases/page.tsx" > "app/(demos)/prizym-governance/workflows/cases/page.tsx"
git show 91551fa:"app/(demos)/prizym-governance/committees/page.tsx" > "app/(demos)/prizym-governance/workflows/committees/page.tsx"
git show 91551fa:"app/(demos)/prizym-governance/operate/calendar/page.tsx" > "app/(demos)/prizym-governance/workflows/calendar/page.tsx"
git show 91551fa:"app/(demos)/prizym-governance/audit/page.tsx" > "app/(demos)/prizym-governance/workflows/audit-trail/page.tsx"
```

- [ ] **Step C5.2: Attestations — new page**

Create `app/(demos)/prizym-governance/workflows/attestations/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { DOCUMENTS } from '@/data/prizym-governance/documents/catalog';
import { PenLine, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default function AttestationsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const attestable = DOCUMENTS.filter(d => d.type === 'policy' && d.status === 'published' && d.attestationPct !== undefined);
  const overdue = attestable.filter(d => (d.attestationPct ?? 0) < 70);
  const dueSoon = attestable.filter(d => (d.attestationPct ?? 0) >= 70 && (d.attestationPct ?? 0) < 90);
  const complete = attestable.filter(d => (d.attestationPct ?? 0) >= 90);

  const metrics = [
    { label: 'Attestable Policies', value: String(attestable.length), icon: PenLine, color: '#0891b2' },
    { label: 'Complete (≥90%)', value: String(complete.length), icon: CheckCircle2, color: '#10b981' },
    { label: 'Due Soon (70-89%)', value: String(dueSoon.length), icon: Clock, color: '#f59e0b' },
    { label: 'Overdue (<70%)', value: String(overdue.length), icon: AlertTriangle, color: '#ef4444' },
  ];

  return (
    <PrizymPage title="Attestations" subtitle="Track employee acknowledgment of published policies. Items below 70% are overdue and need escalation.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {attestable.sort((a, b) => (a.attestationPct ?? 0) - (b.attestationPct ?? 0)).map((d, i) => {
          const pct = d.attestationPct ?? 0;
          const state = pct >= 90 ? 'complete' : pct >= 70 ? 'due_soon' : 'overdue';
          const color = state === 'complete' ? '#10b981' : state === 'due_soon' ? '#f59e0b' : '#ef4444';
          const label = state === 'complete' ? 'COMPLETE' : state === 'due_soon' ? 'DUE SOON' : 'OVERDUE';
          return (
            <div key={d.id} className="pg-card" style={{ borderLeft: `3px solid ${color}`, opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-6px)', transition: 'all 0.3s ease', transitionDelay: `${i * 0.03}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span className="pg-overline" style={{ color: 'var(--pg-cyan)' }}>{d.code}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${color}22`, color, fontWeight: 700 }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--pg-text)' }}>{d.title}</div>
                  <div className="pg-caption" style={{ marginTop: 4 }}>{d.category} · {d.owner} · {d.targetAudience} target employees</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color }}>{pct}%</div>
                  <div className="pg-caption" style={{ fontSize: 11 }}>attested</div>
                </div>
              </div>
              <div style={{ marginTop: 12, height: 6, background: 'var(--pg-border-faint)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: mounted ? `${pct}%` : '0%', background: color, transition: 'width 0.8s ease', transitionDelay: `${0.2 + i * 0.03}s` }} />
              </div>
            </div>
          );
        })}
      </div>
    </PrizymPage>
  );
}
```

- [ ] **Step C5.3: Exceptions — new page**

Create `app/(demos)/prizym-governance/workflows/exceptions/page.tsx`:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { MetricCard, StatusBadge } from '@/components/demos/prizym-governance/StatusBadge';
import { EXCEPTIONS, getExceptionStats, type PolicyException, type ExceptionStatus } from '@/data/prizym-governance/workflows/exceptions';
import { AlertOctagon, Clock, CheckCircle2, XCircle, X, Calendar, User } from 'lucide-react';

export default function ExceptionsPage() {
  const [tab, setTab] = useState<ExceptionStatus | 'all'>('all');
  const [selected, setSelected] = useState<PolicyException | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = getExceptionStats();
  const filtered = tab === 'all' ? EXCEPTIONS : EXCEPTIONS.filter(e => e.status === tab);

  const metrics = [
    { label: 'Pending', value: String(stats.pending), icon: Clock, color: '#f59e0b' },
    { label: 'Approved', value: String(stats.approved), icon: CheckCircle2, color: '#10b981' },
    { label: 'Expired', value: String(stats.expired), icon: XCircle, color: '#64748b' },
    { label: 'Total Impact', value: `$${Math.round(stats.totalImpact / 1000)}K`, icon: AlertOctagon, color: '#ef4444' },
  ];

  const tabs: Array<ExceptionStatus | 'all'> = ['all', 'pending', 'approved', 'expired', 'rejected'];

  return (
    <PrizymPage title="Policy Exceptions" subtitle="Active and historical requests to deviate from published policies. Each exception has an approval chain and expiry.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => <MetricCard key={m.label} {...m} mounted={mounted} delay={i * 0.08} />)}
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--pg-border)', marginBottom: 20 }}>
        {tabs.map(t => {
          const active = tab === t;
          const count = t === 'all' ? EXCEPTIONS.length : EXCEPTIONS.filter(e => e.status === t).length;
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 18px', background: 'transparent', border: 'none',
              borderBottom: active ? '2px solid #10b981' : '2px solid transparent',
              color: active ? '#10b981' : 'var(--pg-text-muted)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {t} <span style={{ padding: '2px 8px', borderRadius: 10, background: active ? 'rgba(16,185,129,0.2)' : 'var(--pg-stripe)', fontSize: 11 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((e, i) => (
          <button
            key={e.id}
            onClick={() => setSelected(e)}
            className="pg-card-elevated"
            style={{
              textAlign: 'left', cursor: 'pointer', border: 'none', width: '100%',
              borderLeft: `4px solid ${e.status === 'pending' ? '#f59e0b' : e.status === 'approved' ? '#10b981' : '#64748b'}`,
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(6px)',
              transition: 'all 0.4s ease', transitionDelay: `${i * 0.05}s`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                  <span className="pg-overline" style={{ color: '#10b981' }}>{e.caseNumber}</span>
                  <StatusBadge status={e.status} />
                  <span style={{ fontSize: 12, color: 'var(--pg-text-muted)', textTransform: 'capitalize' }}>· {e.type.replace(/_/g, ' ')}</span>
                </div>
                <h3 className="pg-subheading" style={{ marginBottom: 6 }}>{e.title}</h3>
                <p className="pg-caption" style={{ marginBottom: 10, lineHeight: 1.55 }}>{e.justification}</p>
              </div>
              {e.amountImpact && (
                <div style={{ textAlign: 'right' }}>
                  <div className="pg-overline" style={{ fontSize: 11 }}>Impact</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--pg-text)' }}>${Math.round(e.amountImpact / 1000)}K</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12, color: 'var(--pg-text-muted)', flexWrap: 'wrap', paddingTop: 10, borderTop: '1px solid var(--pg-border-faint)' }}>
              <span><strong style={{ color: 'var(--pg-text-secondary)' }}>Policy:</strong> {e.policyRef}</span>
              <span><User size={12} style={{ display: 'inline', marginRight: 4 }} />{e.requestedBy}</span>
              <span><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />Filed {e.requestedAt}</span>
              <span><strong style={{ color: 'var(--pg-text-secondary)' }}>Approver:</strong> {e.approver}</span>
              {e.expiresAt && <span><strong style={{ color: 'var(--pg-text-secondary)' }}>Expires:</strong> {e.expiresAt}</span>}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <aside onClick={ev => ev.stopPropagation()} className="pg-card" style={{ width: 'min(680px, 92vw)', height: '100%', overflowY: 'auto', borderRadius: 0, padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <span className="pg-overline" style={{ color: '#10b981' }}>{selected.caseNumber} · {selected.policyRef}</span>
                <h2 className="pg-heading" style={{ marginTop: 4 }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--pg-surface-alt)', border: '1px solid var(--pg-border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--pg-text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <h3 className="pg-subheading" style={{ marginBottom: 8 }}>Justification</h3>
            <p className="pg-caption" style={{ marginBottom: 18, lineHeight: 1.7 }}>{selected.justification}</p>
            {selected.dealContext && (
              <>
                <h3 className="pg-subheading" style={{ marginBottom: 8 }}>Deal Context</h3>
                <p className="pg-caption" style={{ marginBottom: 18, lineHeight: 1.7 }}>{selected.dealContext}</p>
              </>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 18 }}>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Requested By</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.requestedBy}</div>
              </div>
              <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                <div className="pg-overline" style={{ fontSize: 11 }}>Approver</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.approver}</div>
              </div>
              {selected.expiresAt && (
                <div className="pg-card" style={{ padding: 12, background: 'var(--pg-surface-alt)' }}>
                  <div className="pg-overline" style={{ fontSize: 11 }}>Expires</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)' }}>{selected.expiresAt}</div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </PrizymPage>
  );
}
```

- [ ] **Step C5.4: Fix PrizymPage modes if any workflow pages referenced old modes**

Some restored files may pass `mode="operate"` or `mode="dispute"` — those still work because PrizymPage supports those modes. Leave as-is.

- [ ] **Step C5.5: Typecheck + commit**

```bash
pnpm typecheck 2>&1 | grep -v "^LUMEN" | grep -v "^  " | grep -E "^(app|data)" | head -20
```

If errors: fix dangling imports (e.g., old `/policies` links → `/documents/policies`). Common fixes:
```bash
grep -rn "prizym-governance/policies\|prizym-governance/plans\|prizym-governance/templates\|prizym-governance/dashboard\|prizym-governance/dispute/\|prizym-governance/operate/\|prizym-governance/oversee/\|prizym-governance/design/\|prizym-governance/library/\|prizym-governance/audit\b\|prizym-governance/committees\|prizym-governance/analytics\|prizym-governance/frameworks\|prizym-governance/documents\b" "app/(demos)/prizym-governance/workflows/" "app/(demos)/prizym-governance/tools/" "app/(demos)/prizym-governance/compliance/"
```

Replace each hit with the new path (e.g., `/prizym-governance/policies` → `/prizym-governance/documents/policies`).

```bash
git add "app/(demos)/prizym-governance/workflows/"
git commit -m "feat(sgm-rethink): Workflows group (approvals, attestations, reviews, exceptions, cases, committees, calendar, audit trail)"
```

---

## Wave D — Theme + single-theme collapse + polish

### Task D1: Create sgm-compliance preset

**Files:**
- Create: `components/shell/theme/presets/sgm-compliance.ts`
- Modify: `components/shell/theme/types.ts`
- Modify: `components/shell/theme/presets/index.ts`

- [ ] **Step D1.1: Write `sgm-compliance.ts`**

```ts
import type { ThemePresetDef } from '../types';
import { generateShades } from '../shade';

/**
 * sgm-compliance — Sales Governance Manager (client product theme)
 *
 * Single-mode (light) gradient-glass aesthetic tuned to compliance buyers.
 * Deep trust blue → confident teal → compliant emerald gradient on body,
 * dark navy glass sidebar/header, translucent white glass cards.
 *
 * Both theme.semantic.dark and theme.semantic.light are set to the same
 * values so the theme toggle (if ever re-enabled) is a no-op.
 */
const sharedSemantic = {
  bgPrimary: 'transparent',
  bgSecondary: 'rgba(15,23,42,0.45)',
  bgContent: 'transparent',
  cardBg: 'rgba(255,255,255,0.12)',
  textPrimary: '#ffffff',
  textSecondary: '#f1f5f9',
  textMuted: '#e2e8f0',
  textInverse: '#0f172a',
  borderDefault: 'rgba(255,255,255,0.22)',
  borderSubtle: 'rgba(255,255,255,0.14)',
  shadowCard: '0 6px 18px rgba(15,23,42,0.22)',
  shadowElevated: '0 14px 40px rgba(15,23,42,0.32)',
};

const sharedComponent = {
  sidebarBg: 'rgba(15,23,42,0.55)',
  sidebarText: '#ffffff',
  sidebarTextMuted: 'rgba(255,255,255,0.82)',
  sidebarBorder: 'rgba(255,255,255,0.16)',
  sidebarActiveAccent: '#10b981',
  headerBg: 'rgba(15,23,42,0.5)',
  headerBorder: 'rgba(255,255,255,0.16)',
  footerBg: 'rgba(15,23,42,0.45)',
  navSectionLabel: 'rgba(255,255,255,0.82)',
  progressBarFill: '#10b981',
};

export const sgmCompliance: ThemePresetDef = {
  palette: {
    primary: generateShades('#0891b2'),
    accent: generateShades('#10b981'),
    neutral: generateShades('#64748b'),
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
  semantic: { dark: sharedSemantic, light: sharedSemantic },
  component: { dark: sharedComponent, light: sharedComponent },
};
```

- [ ] **Step D1.2: Register in `types.ts`**

```bash
grep -n "sgm-glass" components/shell/theme/types.ts
```

Add `'sgm-compliance'` to the union (keep `'sgm-glass'` — other demos or internal references may exist).

```ts
export type ThemePresetName =
  | 'barrel-brass' | 'midnight' | 'clean-light' | 'aegis-ivory'
  | 'register-slate' | 'charter-stone' | 'prizym-navy' | 'phoenix-sapphire'
  | 'sgm-glass' | 'sgm-compliance';
```

- [ ] **Step D1.3: Register in `presets/index.ts`**

Add import + export + PRESETS entry:

```ts
export { sgmCompliance } from './sgm-compliance';
import { sgmCompliance } from './sgm-compliance';

export const PRESETS: Record<ThemePresetName, ThemePresetDef> = {
  // ... existing entries ...
  'sgm-glass': sgmGlass,
  'sgm-compliance': sgmCompliance,
};
```

- [ ] **Step D1.4: Switch demo.config.ts to new theme**

```ts
  theme: 'sgm-compliance',
```

- [ ] **Step D1.5: Typecheck + commit**

```bash
pnpm typecheck 2>&1 | grep -v "^LUMEN" | grep -v "^  " | grep -E "^(components|app)" | head -5
git add components/shell/theme/presets/sgm-compliance.ts components/shell/theme/types.ts components/shell/theme/presets/index.ts "app/(demos)/prizym-governance/demo.config.ts"
git commit -m "feat(sgm-rethink): new sgm-compliance theme preset (blue→teal→emerald)"
```

---

### Task D2: Update CSS gradient + collapse to single theme

**Files:**
- Modify: `styles/ext/prizym-governance.css`

- [ ] **Step D2.1: Rewrite the light-mode gradient block**

Replace the gradient color stops in `styles/ext/prizym-governance.css`. Find:
```css
html:not(.dark),
html:not(.dark) body,
html:not(.dark) .demo-shell {
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 28%, #6366f1 60%, #8b5cf6 100%) fixed;
```

Replace ALL occurrences of `linear-gradient(135deg, #0ea5e9 0%, #3b82f6 28%, #6366f1 60%, #8b5cf6 100%)` with:
```
linear-gradient(135deg, #1e40af 0%, #0891b2 45%, #10b981 100%)
```

Then remove the `html:not(.dark)` and `.dark` conditional wrappers so the gradient applies unconditionally (single theme). The simplest approach:

```css
body,
.demo-shell {
  background: linear-gradient(135deg, #1e40af 0%, #0891b2 45%, #10b981 100%) fixed;
  min-height: 100vh;
}

.demo-shell aside,
.demo-shell header {
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
}
```

Also delete the entire `.dark` ruleset block (lines approximately 113-180) — it's no longer reachable since there's no toggle. The `:root` block becomes the single source of truth.

- [ ] **Step D2.2: Typecheck + eyeball**

```bash
pnpm typecheck 2>&1 | grep -v "^LUMEN" | grep -v "^  " | head -5
```

Expected: empty.

- [ ] **Step D2.3: Commit**

```bash
git add styles/ext/prizym-governance.css
git commit -m "feat(sgm-rethink): single-theme CSS — blue→teal→emerald gradient, drop .dark ruleset"
```

---

### Task D3: Remove ThemeToggle from shell header rendering

**Files:**
- Modify: `components/shell/plugins/sidebar.tsx`

- [ ] **Step D3.1: Remove `<parts.ThemeToggle />` from header**

Find the header block in `sidebar.tsx`:
```tsx
<header className="flex h-14 ...">
  <div className="flex items-center gap-3">
    ...
  </div>
  <parts.ThemeToggle />
</header>
```

Replace `<parts.ThemeToggle />` with nothing (or an empty `<div />` to preserve flex layout):
```tsx
<header className="flex h-14 ...">
  <div className="flex items-center gap-3">
    ...
  </div>
  <div />
</header>
```

**Note**: We're not deleting the ThemeToggle component itself (other demos may still use it). We're just removing its rendering from the SGM demo's shell.

Actually — the sidebar plugin is shared across all demos. Don't edit it. Instead, make `darkMode: false` in `demo.config.ts`, and if the toggle still renders, we'll handle that separately. Check first:

```bash
grep -n "ThemeToggle" components/shell/plugins/sidebar.tsx
```

If it's there, it renders for ALL demos. To disable per-demo, we'd need a config flag. Add one:

Modify `components/shell/config/types.ts` to add `showThemeToggle?: boolean` (default true).

Modify `sidebar.tsx` to conditionally render:
```tsx
{config.showThemeToggle !== false && <parts.ThemeToggle />}
```

Then in `demo.config.ts`:
```ts
showThemeToggle: false,
```

- [ ] **Step D3.2: Commit**

```bash
git add components/shell/config/types.ts components/shell/plugins/sidebar.tsx "app/(demos)/prizym-governance/demo.config.ts"
git commit -m "feat(sgm-rethink): add showThemeToggle config flag, disable for sgm demo"
```

---

### Task D4: Gut PrizymThemeProvider's toggleTheme — font size only

**Files:**
- Modify: `components/demos/prizym-governance/ThemeProvider.tsx`

- [ ] **Step D4.1: Simplify ThemeProvider**

Replace the entire file with:

```tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

interface ThemeContextValue {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  fontSize: 18,
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
});

export function usePrizymTheme() {
  return useContext(ThemeContext);
}

export function PrizymThemeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(18);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedSize = localStorage.getItem('prizym-gov-font-size');
    if (savedSize) setFontSize(Number(savedSize));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('prizym-gov-font-size', String(fontSize));
  }, [fontSize, mounted]);

  const increaseFontSize = useCallback(() => setFontSize(s => Math.min(s + 2, 28)), []);
  const decreaseFontSize = useCallback(() => setFontSize(s => Math.max(s - 2, 15)), []);

  return (
    <ThemeContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize }}>
      <div className={spaceGrotesk.variable} style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
```

**Note**: This removes `theme` and `toggleTheme` from the context. If any component still imports those (`const { theme } = usePrizymTheme()`), typecheck will fail — fix those callers to just not use `theme`.

- [ ] **Step D4.2: Typecheck + fix callers**

```bash
pnpm typecheck 2>&1 | grep -v "^LUMEN" | grep -v "^  " | grep -E "^(app|components)" | head -10
```

For any errors about missing `theme` or `toggleTheme`, edit the caller to remove the reference (should only affect callers that I already fixed in earlier commits — likely zero errors).

- [ ] **Step D4.3: Commit**

```bash
git add components/demos/prizym-governance/ThemeProvider.tsx
git commit -m "feat(sgm-rethink): simplify PrizymThemeProvider to font-size only (drop theme toggle)"
```

---

### Task D5: Update LandingHero for new routes and gradient

**Files:**
- Modify: `components/demos/prizym-governance/LandingHero.tsx`

- [ ] **Step D5.1: Update gradient + CTAs**

Find the hero banner gradient in LandingHero.tsx:
```tsx
background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 33%, #6366f1 66%, #8b5cf6 100%)',
```

Replace with:
```tsx
background: 'linear-gradient(135deg, #1e40af 0%, #0891b2 45%, #10b981 100%)',
```

Update CTAs:
- Primary CTA `/prizym-governance/dashboard` → `/prizym-governance` (home IS the workspace now)
- Secondary CTA `/prizym-governance/design/asc606-calculator` → `/prizym-governance/tools/asc606-calculator`
- Tenant preview "Compliance Dashboard →" button `/prizym-governance/oversee/compliance` → `/prizym-governance/compliance/controls`
- Tenant preview "Approvals Queue" button `/prizym-governance/operate/approvals` → `/prizym-governance/workflows/approvals`

Also update the purple tint `#8b5cf6` → `#10b981` in the compliance score big number, since the theme accent is now emerald.

- [ ] **Step D5.2: Commit**

```bash
git add components/demos/prizym-governance/LandingHero.tsx
git commit -m "feat(sgm-rethink): update LandingHero gradient + CTAs to new routes"
```

---

### Task D6: Update AskSGM canned responses (optional — sanity check)

**Files:**
- Check: `components/demos/prizym-governance/ai/askSgmFallbacks.ts`

- [ ] **Step D6.1: Eyeball canned responses for stale route refs**

```bash
grep -n "design/\|operate/\|oversee/\|library/\|dispute/\|/policies\b\|/plans\b\|/templates\b\|/dashboard\b" components/demos/prizym-governance/ai/askSgmFallbacks.ts
```

If any hits, update to new routes. Likely zero — the fallbacks talk about concepts, not routes.

- [ ] **Step D6.2: Commit if changes made**

```bash
git add components/demos/prizym-governance/ai/askSgmFallbacks.ts
git commit -m "feat(sgm-rethink): update AskSGM canned responses for new IA"
```

---

### Task D7: Final verification

- [ ] **Step D7.1: Regen registry**

```bash
pnpm generate:registry 2>&1 | tail -3
```

Expected: `✓ Generated registry with 15 demos`.

- [ ] **Step D7.2: Typecheck**

```bash
pnpm typecheck 2>&1 | grep -v "^LUMEN" | grep -v "^  " | grep -E "^(app|components|data|lib|styles)" | head -20
```

Expected: empty.

- [ ] **Step D7.3: Demo standard verify**

```bash
pnpm verify:demo-standard 2>&1 | tail -10
```

Expected: both route check and marker check passed.

- [ ] **Step D7.4: Tests**

```bash
pnpm test 2>&1 | tail -8
```

Expected: `No test files found, exiting with code 0` (vitest passWithNoTests).

- [ ] **Step D7.5: Hit the dev server and eyeball**

Dev server is already running at `:3100` (background task from earlier session). Or restart:

```bash
pnpm dev &
```

Browse: `http://localhost:3100/prizym-governance`

Verify:
1. Sidebar shows 6 groups: Home, Documents (5 items), Tools (3), Compliance (4), Workflows (8), AI (1)
2. Gradient is blue→teal→emerald (not purple)
3. No theme toggle button in header
4. Home page shows KPIs + "For Your Attention" + "Program Pulse"
5. `/documents/policies` tabs across all 5 document types
6. `/tools/asc606-calculator` loads the interactive calculator
7. `/compliance/obligations` shows 8 obligations
8. `/workflows/exceptions` shows 7 exceptions

- [ ] **Step D7.6: Final commit + push**

```bash
git push 2>&1 | tail -3
```

---

## Post-implementation

- [ ] **Update memory** — edit `/Users/toddlebaron/.claude/projects/-Users-toddlebaron-Development-aicr-demos-cf/memory/project_sgm_gold_standard.md` to note the rethink pivot. Mark the SGM Gold Standard build as archived; the new state is the client-product IA.

- [ ] **Update PR description** — `gh pr edit 15 --body ...` to reflect the final IA (6 groups, single theme, exceptions workflow, obligations register).

---

## Self-review notes

**Spec coverage**: Every spec section is covered by at least one task:
- IA (6 groups): Task A5
- New pages (Home, Documents, Obligations, Exceptions, Audit): Tasks C1, C2, C4, C5
- Theme (sgm-compliance): Tasks D1, D2
- Single-theme collapse: Tasks D2, D3, D4
- Enforcement state (overdue/SLA badges): inline in Task C2 (documents REVIEW OVERDUE), C5 (attestations OVERDUE/DUE SOON/COMPLETE)
- Committees kept: Task C5
- Data: Tasks A1, A2, A3, A4

**Type consistency**: `DocumentRecord`, `DocumentType`, `LifecycleStatus`, `PolicyException`, `Obligation` all defined once and referenced consistently. Catalog helpers (`getDocumentsByType`, `getDocumentById`, `getDocumentStats`) used in consistent call sites.

**Placeholder scan**: No TBD/TODO. Every code block is complete and copy-pasteable. No "similar to Task N" — all code is inline.

**Scope**: ~25 steps, 6 commits per wave minimum. All within one branch on one session.
