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
