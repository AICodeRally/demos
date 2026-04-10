import type { DocumentRecord, DocumentType } from './types';
import { SCP_POLICIES } from '@/data/prizym-governance/policies';
import { asc606Policies, asc606Templates } from '@/data/prizym-governance/asc606';
import { PLANS } from '@/data/prizym-governance/plans';
import { COMPLIANCE_CONTROLS } from '@/data/prizym-governance/oversee';

/**
 * Today is 2026-04-10 for the demo — dates below are relative to that.
 * Past dates with status=published drive "review overdue" badges.
 */

// Comp Plans — existing PLANS data mapped into DocumentRecord shape
const compPlanDocs: DocumentRecord[] = PLANS.map((p) => ({
  id: p.id,
  type: 'comp_plan' as const,
  code: p.planCode,
  title: p.title,
  category: 'Compensation Plan',
  status: (
    p.status === 'APPROVED' ? 'approved' :
    p.status === 'PUBLISHED' ? 'published' :
    p.status === 'DRAFT' ? 'draft' :
    p.status === 'IN_PROGRESS' ? 'in_review' :
    'draft'
  ) as DocumentRecord['status'],
  version: p.version,
  effectiveDate: p.effectiveDate,
  nextReview: p.expirationDate,
  owner: p.owner,
  description: p.description,
  attestationPct: p.completionPercentage,
  targetAudience: 40 + ((p.id.charCodeAt(0) + p.id.length) % 60),
  tags: p.tags,
}));

// Policies — SCP policies + ASC 606 policies
const scpPolicyDocs: DocumentRecord[] = SCP_POLICIES.map((p, i) => ({
  id: p.id,
  type: 'policy' as const,
  code: p.code,
  title: p.title,
  category: p.category,
  status: (p.status === 'APPROVED' ? 'published' : p.status === 'DRAFT' ? 'draft' : p.status === 'UNDER_REVIEW' ? 'in_review' : 'published') as DocumentRecord['status'],
  version: p.version,
  effectiveDate: p.effectiveDate ?? '2026-01-01',
  nextReview: i % 3 === 0 ? '2026-03-15' : '2026-10-01', // mix some overdue
  owner: p.owner,
  description: p.description,
  attestationPct: 70 + (i * 7) % 28,
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
  attestationPct: 65 + (i * 9) % 25,
  targetAudience: 40,
}));

// Procedures — NEW synthetic data (6 procedures)
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
    effectiveDate: '2026-01-01', nextReview: '2026-04-01',
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

// Controls — existing COMPLIANCE_CONTROLS mapped into DocumentRecord shape
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

// Templates — ASC 606 templates + 2 new plan templates
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
    id: 'tpl-plan-001', type: 'template' as const, code: 'TPL-PLAN-001',
    title: 'Enterprise AE Compensation Plan Template',
    category: 'Compensation Plan',
    status: 'published' as const, version: '2026.1',
    effectiveDate: '2026-01-01', nextReview: '2027-01-01',
    owner: 'Sales Comp',
    description: 'Standard template for enterprise Account Executive plans. 50:50 pay mix, 2.5x accelerators above 100% quota, SPIF placeholders, clawback clauses.',
    attestationPct: 100, targetAudience: 1,
    tags: ['enterprise', 'AE', 'template'],
  },
  {
    id: 'tpl-plan-002', type: 'template' as const, code: 'TPL-PLAN-002',
    title: 'Inside Sales Plan Template',
    category: 'Compensation Plan',
    status: 'published' as const, version: '2026.1',
    effectiveDate: '2026-01-01', nextReview: '2027-01-01',
    owner: 'Sales Comp',
    description: 'Standard template for Inside Sales rep plans. 70:30 pay mix, flat commission rate, SPIF placeholders, quarterly quotas.',
    attestationPct: 100, targetAudience: 1,
    tags: ['inside sales', 'template'],
  },
];

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
  const today = new Date('2026-04-10');
  return {
    total: DOCUMENTS.length,
    byType: {
      comp_plan: compPlanDocs.length,
      policy: scpPolicyDocs.length + asc606PolicyDocs.length,
      procedure: procedureDocs.length,
      control: controlDocs.length,
      template: templateDocs.length,
    } as Record<DocumentType, number>,
    reviewOverdue: DOCUMENTS.filter((d) => d.status === 'published' && new Date(d.nextReview) < today).length,
    inReview: DOCUMENTS.filter((d) => d.status === 'in_review').length,
    draft: DOCUMENTS.filter((d) => d.status === 'draft').length,
  };
}
