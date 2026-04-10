/**
 * Prizym Governance — Compensation Plans & Templates (Static Demo)
 */

export interface PlanTemplate {
  id: string;
  code: string;
  name: string;
  description: string;
  planType: string;
  category: string;
  tags: string[];
  version: string;
  status: 'ACTIVE' | 'DRAFT';
  tier: string;
  sectionCount: number;
}

export interface Plan {
  id: string;
  planCode: string;
  title: string;
  description: string;
  category: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'APPROVED' | 'PUBLISHED';
  version: string;
  owner: string;
  templateName: string;
  completionPercentage: number;
  sectionsCompleted: number;
  sectionsTotal: number;
  effectiveDate: string;
  expirationDate: string;
  tags: string[];
}

export const PLAN_TEMPLATES: PlanTemplate[] = [
  { id: 'tpl-001', code: 'TPL-COMP-001', name: 'Annual Sales Compensation Plan', description: 'Comprehensive template for annual sales compensation planning with quota structures, commission rates, and payment schedules', planType: 'COMPENSATION_PLAN', category: 'Sales Compensation', tags: ['sales', 'annual', 'quota', 'commission'], version: '1.0.0', status: 'ACTIVE', tier: 'Gold Standard', sectionCount: 5 },
  { id: 'tpl-002', code: 'TPL-COMP-002', name: 'SPIF Campaign Template', description: 'Short-term Sales Performance Incentive Fund (SPIF) campaign template', planType: 'COMPENSATION_PLAN', category: 'SPIF', tags: ['spif', 'campaign', 'short-term', 'incentive'], version: '1.0.0', status: 'ACTIVE', tier: 'Gold Standard', sectionCount: 2 },
  { id: 'tpl-003', code: 'TPL-GOV-001', name: 'Policy Rollout Implementation Plan', description: 'Template for planning and executing policy rollouts across the organization', planType: 'GOVERNANCE_PLAN', category: 'Policy Implementation', tags: ['governance', 'policy', 'rollout', 'implementation'], version: '1.0.0', status: 'ACTIVE', tier: 'Gold Standard', sectionCount: 2 },
  { id: 'tpl-004', code: 'TPL-ASC606-001', name: 'ASC 606 Revenue Recognition Plan', description: 'Revenue recognition compliance plan per ASC 606 standards', planType: 'COMPLIANCE_PLAN', category: 'Accounting Compliance', tags: ['asc606', 'revenue', 'compliance'], version: '1.0.0', status: 'ACTIVE', tier: 'Gold Standard', sectionCount: 4 },
];

export const PLANS: Plan[] = [
  {
    id: 'plan-001',
    planCode: 'PLAN-NA-2026-001',
    title: '2026 North America Sales Compensation Plan',
    description: 'Annual sales compensation plan for North America region',
    category: 'Sales Compensation',
    status: 'IN_PROGRESS',
    version: '1.0.0',
    owner: 'Sales Operations Manager',
    templateName: 'Annual Sales Compensation Plan',
    completionPercentage: 40,
    sectionsCompleted: 2,
    sectionsTotal: 5,
    effectiveDate: '2026-01-01',
    expirationDate: '2026-12-31',
    tags: ['sales', 'north-america', '2026', 'annual'],
  },
  {
    id: 'plan-002',
    planCode: 'PLAN-SPIF-Q1-2026',
    title: 'Q1 2026 Product Launch SPIF',
    description: 'Special incentive for Q1 product launch campaign',
    category: 'SPIF',
    status: 'DRAFT',
    version: '1.0.0',
    owner: 'Marketing Director',
    templateName: 'SPIF Campaign Template',
    completionPercentage: 10,
    sectionsCompleted: 0,
    sectionsTotal: 2,
    effectiveDate: '2026-01-15',
    expirationDate: '2026-03-31',
    tags: ['spif', 'q1-2026', 'product-launch'],
  },
  {
    id: 'plan-003',
    planCode: 'PLAN-EMEA-2026-001',
    title: '2026 EMEA Sales Compensation Plan',
    description: 'Annual sales compensation plan for EMEA region',
    category: 'Sales Compensation',
    status: 'APPROVED',
    version: '2.1.0',
    owner: 'EMEA Sales Director',
    templateName: 'Annual Sales Compensation Plan',
    completionPercentage: 100,
    sectionsCompleted: 5,
    sectionsTotal: 5,
    effectiveDate: '2026-01-01',
    expirationDate: '2026-12-31',
    tags: ['sales', 'emea', '2026', 'annual'],
  },
  {
    id: 'plan-004',
    planCode: 'PLAN-SE-2026-001',
    title: '2026 Solutions Engineer Comp Plan',
    description: 'Compensation plan for pre-sales solutions engineering team',
    category: 'Sales Compensation',
    status: 'PUBLISHED',
    version: '1.0.0',
    owner: 'VP Sales Engineering',
    templateName: 'Annual Sales Compensation Plan',
    completionPercentage: 100,
    sectionsCompleted: 5,
    sectionsTotal: 5,
    effectiveDate: '2026-01-01',
    expirationDate: '2026-12-31',
    tags: ['solutions-engineering', '2026', 'annual'],
  },
];

export function getPlanStats() {
  return {
    total: PLANS.length,
    draft: PLANS.filter(p => p.status === 'DRAFT').length,
    inProgress: PLANS.filter(p => p.status === 'IN_PROGRESS').length,
    approved: PLANS.filter(p => p.status === 'APPROVED').length,
    published: PLANS.filter(p => p.status === 'PUBLISHED').length,
    avgCompletion: Math.round(PLANS.reduce((sum, p) => sum + p.completionPercentage, 0) / PLANS.length),
  };
}
