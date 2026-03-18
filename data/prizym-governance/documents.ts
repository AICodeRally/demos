/**
 * Prizym Governance — Document Library (Static Demo)
 * 49 documents across 6 categories
 */

export interface GovernanceDocument {
  documentCode: string;
  title: string;
  documentType: 'FRAMEWORK' | 'POLICY' | 'PROCEDURE' | 'TEMPLATE' | 'CHECKLIST' | 'GUIDE';
  category: string;
  status: 'APPROVED' | 'ACTIVE' | 'DRAFT' | 'UNDER_REVIEW';
  version: string;
  effectiveDate: string | null;
  owner: string;
  description: string;
}

export const GOVERNANCE_DOCUMENTS: Record<string, GovernanceDocument[]> = {
  frameworks: [
    { documentCode: 'GC-001', title: 'Sales Compensation Governance Committee Charter', documentType: 'FRAMEWORK', category: 'Governance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'VP Sales Compensation', description: 'SGCC committee structure, authority, and decision-making framework. Establishes 7-member committee with approval thresholds and meeting cadence.' },
    { documentCode: 'CRB-001', title: 'Compensation Review Board Charter', documentType: 'FRAMEWORK', category: 'Governance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'VP Sales Compensation', description: 'CRB authority for windfall deals ($1M+), exceptions, and SPIF approvals. Defines 6 decision options for large deals.' },
    { documentCode: 'FWK-003', title: 'Sales Segment & Role Classification Framework', documentType: 'FRAMEWORK', category: 'Plan Design', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Plan types, segment definitions, and role assignments across Enterprise, Mid-Market, and SMB segments.' },
    { documentCode: 'FWK-004', title: 'Territory & Quota Management Framework', documentType: 'FRAMEWORK', category: 'Territory Management', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Territory rules, quota methodology, adjustment processes, and appeals framework.' },
    { documentCode: 'FWK-005', title: 'Commission Metrics Framework', documentType: 'FRAMEWORK', category: 'Metrics', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'All compensation metrics defined: GARR, Net New ARR, Deal Registration, MBO/SPIFs, accelerators.' },
    { documentCode: 'FWK-006', title: 'SPIF & Kicker Governance Framework', documentType: 'FRAMEWORK', category: 'SPIFs', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'SPIF types (Product Launch, Vertical, Seasonal), approval authority by budget tier, and tracking requirements.' },
    { documentCode: 'FWK-007', title: 'Standard Taxonomy & Definitions Dictionary', documentType: 'FRAMEWORK', category: 'Reference', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'Comprehensive glossary of compensation terms, SPARCC-specific language, and metric definitions.' },
  ],
  policies: [
    { documentCode: 'SCP-001', title: 'Sales Crediting Policy', documentType: 'POLICY', category: 'Crediting', status: 'APPROVED', version: '2.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Deal crediting rules for new logo, named accounts, renewals, and multi-rep splits.' },
    { documentCode: 'SCP-002', title: 'Quota Setting & Mid-Period Change Policy', documentType: 'POLICY', category: 'Quota Management', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Annual quota setting methodology, mid-year adjustment rules, and quota appeal process.' },
    { documentCode: 'SCP-003', title: 'Payment Timing & Draw Policy', documentType: 'POLICY', category: 'Payments', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Finance', description: 'Commission payment schedule, draw eligibility, and repayment terms.' },
    { documentCode: 'SCP-004', title: 'Termination & Severance Policy', documentType: 'POLICY', category: 'Employment', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'HR', description: 'Commission treatment on termination and severance scenarios.' },
    { documentCode: 'SCP-005', title: 'Leave of Absence Policy', documentType: 'POLICY', category: 'Employment', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'HR', description: 'Commission treatment during medical, parental, and extended leave.' },
    { documentCode: 'SCP-006', title: 'Territory Change Policy', documentType: 'POLICY', category: 'Territory Management', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Rules for territory reassignments, protection periods, and transition credits.' },
    { documentCode: 'SCP-007', title: 'Windfall & Large Deal Policy', documentType: 'POLICY', category: 'Large Deals', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'CRB', description: 'Windfall identification criteria and CRB review process with 6 decision options.' },
    { documentCode: 'SCP-008', title: 'SPIF Governance Policy', documentType: 'POLICY', category: 'SPIFs', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'SPIF approval thresholds by budget tier.' },
    { documentCode: 'SCP-009', title: 'Clawback & Recovery Policy', documentType: 'POLICY', category: 'Compliance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Finance', description: 'Overpayment recovery procedures and clawback triggers.' },
    { documentCode: 'SCP-010', title: 'Multi-State Wage Law Compliance', documentType: 'POLICY', category: 'Legal Compliance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Legal', description: 'State-specific wage law compliance for commission payments.' },
    { documentCode: 'SCP-011', title: 'Section 409A Compliance Policy', documentType: 'POLICY', category: 'Tax Compliance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Legal', description: 'IRS Section 409A compliance for deferred compensation.' },
    { documentCode: 'SCP-012', title: 'Data Retention Policy', documentType: 'POLICY', category: 'Data Governance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Legal', description: '7-year retention for compensation records.' },
    { documentCode: 'SCP-013', title: 'Version Control & Document Management', documentType: 'POLICY', category: 'Governance', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'Document versioning standards and approval workflows.' },
    { documentCode: 'SCP-014', title: 'Standard Terms & Conditions', documentType: 'POLICY', category: 'Legal', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Legal', description: 'Master T&Cs for all compensation plans.' },
    { documentCode: 'SCP-015', title: 'Cap & Threshold Guidelines', documentType: 'POLICY', category: 'Plan Design', status: 'DRAFT', version: '0.9', effectiveDate: null, owner: 'Sales Compensation', description: 'Financial limits, acceleration caps, and thresholds by role.' },
    { documentCode: 'SCP-016', title: 'Draws & Guarantees Policy', documentType: 'POLICY', category: 'Payments', status: 'DRAFT', version: '0.8', effectiveDate: null, owner: 'Finance', description: 'Draw request process, guarantee terms, and repayment.' },
    { documentCode: 'SCP-017', title: 'Mid-Period Plan Change Policy', documentType: 'POLICY', category: 'Plan Changes', status: 'UNDER_REVIEW', version: '0.9', effectiveDate: null, owner: 'Sales Compensation', description: 'Rules for mid-year plan changes including grandfathering.' },
  ],
  procedures: [
    { documentCode: 'PROC-001', title: 'Quota Setting Procedures', documentType: 'PROCEDURE', category: 'Quota Management', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Step-by-step annual quota setting process.' },
    { documentCode: 'PROC-002', title: 'Territory Change Procedures', documentType: 'PROCEDURE', category: 'Territory Management', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Territory reassignment workflow with transition period.' },
    { documentCode: 'PROC-003', title: 'Sales Crediting Rules Documentation', documentType: 'PROCEDURE', category: 'Crediting', status: 'APPROVED', version: '2.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Detailed crediting examples with SE allocation matrices.' },
    { documentCode: 'PROC-004', title: 'New Hire Onboarding Process', documentType: 'PROCEDURE', category: 'Onboarding', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'HR', description: 'Compensation onboarding checklist.' },
    { documentCode: 'PROC-005', title: 'Transfer & Promotion Procedures', documentType: 'PROCEDURE', category: 'Career Movement', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'HR', description: 'Plan changes on transfers and promotions.' },
    { documentCode: 'PROC-006', title: 'Commission Reconciliation Procedures', documentType: 'PROCEDURE', category: 'Reconciliation', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Finance', description: 'Month-end reconciliation with variance investigation.' },
    { documentCode: 'PROC-007', title: 'Pre-Payment Validation Checklist', documentType: 'PROCEDURE', category: 'Quality Control', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Finance', description: 'Quality control gates before commission payout.' },
    { documentCode: 'PROC-008', title: 'Dispute Resolution Procedures', documentType: 'PROCEDURE', category: 'Disputes', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'Escalation path: Manager → Sales Ops → CRB → SGCC.' },
    { documentCode: 'PROC-009', title: 'Exception Request Process', documentType: 'PROCEDURE', category: 'Exceptions', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'Exception request with documentation and routing.' },
    { documentCode: 'PROC-010', title: 'Calculation Documentation Standard', documentType: 'PROCEDURE', category: 'Documentation', status: 'APPROVED', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'Standard templates for documenting calculations.' },
  ],
  templates: [
    { documentCode: 'TPL-001', title: 'SGCC Meeting Agenda Template', documentType: 'TEMPLATE', category: 'Meetings', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'Standard agenda for quarterly SGCC meetings.' },
    { documentCode: 'TPL-002', title: 'CRB Meeting Agenda Template', documentType: 'TEMPLATE', category: 'Meetings', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'Agenda for windfall deal reviews.' },
    { documentCode: 'TPL-003', title: 'Meeting Minutes Template', documentType: 'TEMPLATE', category: 'Documentation', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'Standard format for meeting minutes.' },
    { documentCode: 'TPL-004', title: 'Plan Announcement Template', documentType: 'TEMPLATE', category: 'Communications', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'Email template for plan announcements.' },
    { documentCode: 'TPL-005', title: 'FAQ Template', documentType: 'TEMPLATE', category: 'Documentation', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'Plan FAQ format with common Q&A.' },
    { documentCode: 'TPL-006', title: 'Plan Summary Template', documentType: 'TEMPLATE', category: 'Plan Design', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'One-page plan summary for reps.' },
    { documentCode: 'TPL-007', title: 'CRB Decision Log Template', documentType: 'TEMPLATE', category: 'Decisions', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'CRB', description: 'Format for recording CRB windfall decisions.' },
    { documentCode: 'TPL-008', title: 'Quota Adjustment Request Form', documentType: 'TEMPLATE', category: 'Forms', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Mid-year quota adjustment request.' },
    { documentCode: 'TPL-009', title: 'Territory Change Request Form', documentType: 'TEMPLATE', category: 'Forms', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Operations', description: 'Territory reassignment request form.' },
    { documentCode: 'TPL-010', title: 'Exception Request Form', documentType: 'TEMPLATE', category: 'Forms', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: 'General exception request form.' },
    { documentCode: 'TPL-011', title: 'Commission Statement Template', documentType: 'TEMPLATE', category: 'Statements', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Finance', description: 'Monthly commission statement format.' },
    { documentCode: 'TPL-012', title: 'New Plan Launch Checklist', documentType: 'TEMPLATE', category: 'Checklists', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: '30-point checklist for launching new plans.' },
  ],
  checklists: [
    { documentCode: 'CHK-001', title: 'Governance Implementation Checklist', documentType: 'CHECKLIST', category: 'Implementation', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Compensation', description: '7-phase implementation checklist with 90+ tasks.' },
  ],
  guides: [
    { documentCode: 'GUIDE-001', title: 'Sales Rep Compensation Guide', documentType: 'GUIDE', category: 'Enablement', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Enablement', description: 'Complete guide for sales reps covering plans, crediting, statements, and disputes.' },
    { documentCode: 'GUIDE-002', title: 'Sales Manager Enablement Guide', documentType: 'GUIDE', category: 'Enablement', status: 'ACTIVE', version: '1.0', effectiveDate: '2026-01-01', owner: 'Sales Enablement', description: 'Manager guide for handling comp questions, approving exceptions, and coaching.' },
  ],
};

export const ALL_DOCUMENTS = [
  ...GOVERNANCE_DOCUMENTS.frameworks,
  ...GOVERNANCE_DOCUMENTS.policies,
  ...GOVERNANCE_DOCUMENTS.procedures,
  ...GOVERNANCE_DOCUMENTS.templates,
  ...GOVERNANCE_DOCUMENTS.checklists,
  ...GOVERNANCE_DOCUMENTS.guides,
];

export const DOCUMENT_COUNTS = {
  FRAMEWORK: GOVERNANCE_DOCUMENTS.frameworks.length,
  POLICY: GOVERNANCE_DOCUMENTS.policies.length,
  PROCEDURE: GOVERNANCE_DOCUMENTS.procedures.length,
  TEMPLATE: GOVERNANCE_DOCUMENTS.templates.length,
  CHECKLIST: GOVERNANCE_DOCUMENTS.checklists.length,
  GUIDE: GOVERNANCE_DOCUMENTS.guides.length,
  TOTAL: ALL_DOCUMENTS.length,
};

export const DOC_TYPE_COLORS: Record<string, string> = {
  FRAMEWORK: '#8b5cf6',
  POLICY: '#3b82f6',
  PROCEDURE: '#10b981',
  TEMPLATE: '#f59e0b',
  CHECKLIST: '#ec4899',
  GUIDE: '#06b6d4',
};
