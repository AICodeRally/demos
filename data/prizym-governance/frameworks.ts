/**
 * Prizym Governance — Governance Frameworks (Static Demo)
 */

export interface GovernanceFramework {
  id: string;
  code: string;
  title: string;
  category: string;
  status: 'ACTIVE' | 'DRAFT';
  version: string;
  isMandatory: boolean;
  applicableTo: string[];
  summary: string;
  keyPrinciples: string[];
}

export const FRAMEWORKS: GovernanceFramework[] = [
  {
    id: 'fw-001',
    code: 'SPM-FW-001',
    title: 'SPARCC Core Methodology',
    category: 'METHODOLOGY',
    status: 'ACTIVE',
    version: '1.0.0',
    isMandatory: true,
    applicableTo: ['Compensation Plans', 'Governance Plans'],
    summary: 'SPARCC (Sales Performance, Alignment, Recognition, Compensation & Communication) is the foundational framework for designing and implementing compensation plans.',
    keyPrinciples: ['Strategic Alignment', 'Performance Measurement', 'Recognition & Rewards', 'Compensation Structure', 'Communication'],
  },
  {
    id: 'fw-002',
    code: 'SPM-FW-002',
    title: 'Compensation Governance Best Practices',
    category: 'BEST_PRACTICES',
    status: 'ACTIVE',
    version: '1.0.0',
    isMandatory: false,
    applicableTo: ['Compensation Plans'],
    summary: 'Design principles for compensation plans covering simplicity, fairness, and competitiveness with governance checkpoints.',
    keyPrinciples: ['Simplicity', 'Fairness', 'Competitiveness', 'Pre-Launch Checks', 'Post-Launch Monitoring'],
  },
  {
    id: 'fw-003',
    code: 'SPM-FW-003',
    title: 'Policy Writing Standards',
    category: 'STANDARDS',
    status: 'ACTIVE',
    version: '1.0.0',
    isMandatory: false,
    applicableTo: ['Policy Creation Plans'],
    summary: 'Document structure standards for all policy documents — headers, purpose, definitions, procedures, roles, compliance, exceptions, and revision history.',
    keyPrinciples: ['Clarity', 'Consistency', 'Accessibility', 'Review & Approval Process'],
  },
  {
    id: 'fw-004',
    code: 'ASC606-FW-001',
    title: 'ASC 606 Revenue Recognition Framework',
    category: 'COMPLIANCE',
    status: 'ACTIVE',
    version: '1.0.0',
    isMandatory: true,
    applicableTo: ['Compliance Plans', 'Compensation Plans'],
    summary: 'Revenue recognition compliance framework per ASC 606 standards for commission-related accounting.',
    keyPrinciples: ['5-Step Revenue Model', 'Contract Modifications', 'Variable Consideration', 'Constraint Application'],
  },
];
