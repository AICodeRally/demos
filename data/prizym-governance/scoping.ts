// Scoping questionnaire + engagement estimate calculator.
// Ported from aicr-sgm-cf/apps/workers/src/api/scoping.ts — the server
// Hono route is collapsed into a pure client-side function here so the
// demo has no backend dependency.

export interface Question {
  id: string;
  text: string;
  type: 'select' | 'range' | 'multi-select';
  options?: string[];
}

export interface Category {
  id: string;
  name: string;
  questions: Question[];
}

export interface StaffingTemplate {
  name: 'Lean' | 'Standard' | 'Enterprise';
  headcount: number;
  roles: string[];
  weeklyHours: number;
}

export interface RateCardEntry {
  role: string;
  rate: number; // $ per hour
}

export interface Estimate {
  complexity: number;
  template: StaffingTemplate['name'];
  staffing: StaffingTemplate;
  estimate: {
    weeklyRate: number;
    totalWeeks: number;
    totalEstimate: number;
  };
}

export const SCOPING_CATEGORIES: Category[] = [
  {
    id: 'intake',
    name: 'Intake & Discovery',
    questions: [
      { id: 'sc-01', text: 'What is the primary business driver for this SPM initiative?', type: 'select', options: ['New system implementation', 'System migration', 'Plan redesign', 'Process optimization', 'Compliance remediation'] },
      { id: 'sc-02', text: 'How many sales compensation plans do you currently administer?', type: 'range', options: ['1-5', '6-15', '16-50', '51-100', '100+'] },
      { id: 'sc-03', text: 'What is your total incentive-eligible headcount?', type: 'range', options: ['Under 50', '50-200', '200-500', '500-2000', '2000+'] },
      { id: 'sc-04', text: 'Which SPM vendor(s) are you currently using or evaluating?', type: 'multi-select', options: ['Xactly', 'Varicent', 'SAP Commissions', 'Anaplan', 'CaptivateIQ', 'Forma.ai', 'Excel/Manual', 'Other'] },
    ],
  },
  {
    id: 'current-state',
    name: 'Current State Assessment',
    questions: [
      { id: 'sc-05', text: 'How are compensation calculations currently performed?', type: 'select', options: ['Fully automated in SPM tool', 'Semi-automated (SPM + manual)', 'Spreadsheet-based', 'Fully manual'] },
      { id: 'sc-06', text: 'What is your current average dispute resolution time?', type: 'select', options: ['Under 48 hours', '2-5 business days', '1-2 weeks', 'Over 2 weeks', 'No formal process'] },
      { id: 'sc-07', text: 'Do you have a formal governance committee for compensation?', type: 'select', options: ['Yes, meets regularly', 'Yes, but inactive', 'Informal only', 'No'] },
      { id: 'sc-08', text: 'How would you rate your current data quality for comp calculations?', type: 'select', options: ['Excellent (automated validation)', 'Good (some manual checks)', 'Fair (frequent corrections needed)', 'Poor (significant issues)'] },
    ],
  },
  {
    id: 'requirements',
    name: 'Requirements & Scope',
    questions: [
      { id: 'sc-09', text: 'Which capabilities are in scope for this engagement?', type: 'multi-select', options: ['Plan design', 'Territory management', 'Quota setting', 'Crediting rules', 'Calculation engine', 'Dispute resolution', 'Reporting/analytics', 'Governance framework'] },
      { id: 'sc-10', text: 'Are there regulatory compliance requirements?', type: 'multi-select', options: ['SOX compliance', 'ASC 606', 'IFRS 15', 'GDPR', 'State wage laws', 'None'] },
      { id: 'sc-11', text: 'What is the target go-live timeline?', type: 'select', options: ['Under 3 months', '3-6 months', '6-12 months', '12+ months', 'No specific timeline'] },
      { id: 'sc-12', text: 'What is the budget range for this initiative?', type: 'select', options: ['Under $100K', '$100K-$250K', '$250K-$500K', '$500K-$1M', 'Over $1M', 'Not yet determined'] },
    ],
  },
  {
    id: 'technical',
    name: 'Technical Environment',
    questions: [
      { id: 'sc-13', text: 'What CRM system(s) are in use?', type: 'multi-select', options: ['Salesforce', 'HubSpot', 'Microsoft Dynamics', 'Other', 'None'] },
      { id: 'sc-14', text: 'What ERP/finance system is in use?', type: 'multi-select', options: ['SAP', 'Oracle', 'NetSuite', 'Workday', 'QuickBooks', 'Other'] },
      { id: 'sc-15', text: 'What HRIS system is in use?', type: 'multi-select', options: ['Workday', 'ADP', 'BambooHR', 'UKG', 'Other'] },
      { id: 'sc-16', text: 'How many source systems feed into compensation calculations?', type: 'range', options: ['1-2', '3-5', '6-10', '10+'] },
    ],
  },
  {
    id: 'complexity',
    name: 'Complexity Scoring',
    questions: [
      { id: 'sc-17', text: 'How many distinct sales roles require unique compensation plans?', type: 'range', options: ['1-3', '4-8', '9-15', '16-30', '30+'] },
      { id: 'sc-18', text: 'Do you have overlay or specialist roles with split crediting?', type: 'select', options: ['Yes, complex multi-credit', 'Yes, simple splits', 'No'] },
      { id: 'sc-19', text: 'How many geographic regions or business units need territory coverage?', type: 'range', options: ['1 (single region)', '2-5', '6-15', '16+'] },
      { id: 'sc-20', text: 'What is the frequency of plan changes or mid-cycle adjustments?', type: 'select', options: ['Rarely (annual only)', 'Occasionally (1-2 per year)', 'Frequently (quarterly)', 'Constant (monthly or more)'] },
    ],
  },
];

export const STAFFING_TEMPLATES: StaffingTemplate[] = [
  { name: 'Lean', headcount: 3, roles: ['Project Lead', 'SPM Analyst', 'Technical Lead'], weeklyHours: 20 },
  { name: 'Standard', headcount: 5, roles: ['Engagement Lead', 'SPM Architect', 'SPM Analyst', 'Technical Lead', 'Change Manager'], weeklyHours: 30 },
  { name: 'Enterprise', headcount: 8, roles: ['Program Director', 'Engagement Lead', 'SPM Architect', 'SPM Analyst x2', 'Technical Lead', 'Data Engineer', 'Change Manager'], weeklyHours: 40 },
];

export const RATE_CARD: RateCardEntry[] = [
  { role: 'Program Director', rate: 450 },
  { role: 'Engagement Lead', rate: 375 },
  { role: 'SPM Architect', rate: 350 },
  { role: 'Technical Lead', rate: 325 },
  { role: 'Data Engineer', rate: 300 },
  { role: 'Project Lead', rate: 300 },
  { role: 'SPM Analyst', rate: 275 },
  { role: 'Change Manager', rate: 250 },
];

/**
 * Faithful port of the POST /estimate handler from
 * aicr-sgm-cf/apps/workers/src/api/scoping.ts (lines 91-155).
 * Complexity is an additive integer score; template is selected by
 * thresholds (>=10 → Enterprise, >=5 → Standard, else Lean).
 * Timeline answer (sc-11) controls totalWeeks.
 */
export function calculateEstimate(answers: Record<string, string | string[]>): Estimate {
  // Simple complexity scoring based on answers — ported verbatim from donor
  let complexity = 0;

  const planCount = answers['sc-02'] as string | undefined;
  if (planCount === '51-100' || planCount === '100+') complexity += 3;
  else if (planCount === '16-50') complexity += 2;
  else if (planCount === '6-15') complexity += 1;

  const headcount = answers['sc-03'] as string | undefined;
  if (headcount === '2000+') complexity += 3;
  else if (headcount === '500-2000') complexity += 2;
  else if (headcount === '200-500') complexity += 1;

  const vendors = answers['sc-04'] as string[] | undefined;
  if (vendors && vendors.length > 2) complexity += 1;

  const calcMethod = answers['sc-05'] as string | undefined;
  if (calcMethod === 'Fully manual' || calcMethod === 'Spreadsheet-based') complexity += 2;

  const compliance = answers['sc-10'] as string[] | undefined;
  if (compliance && compliance.includes('SOX compliance')) complexity += 2;

  const roles = answers['sc-17'] as string | undefined;
  if (roles === '30+') complexity += 3;
  else if (roles === '16-30') complexity += 2;
  else if (roles === '9-15') complexity += 1;

  const overlay = answers['sc-18'] as string | undefined;
  if (overlay === 'Yes, complex multi-credit') complexity += 2;

  // Map to template
  let templateName: StaffingTemplate['name'];
  if (complexity >= 10) templateName = 'Enterprise';
  else if (complexity >= 5) templateName = 'Standard';
  else templateName = 'Lean';

  const staffing = STAFFING_TEMPLATES.find(t => t.name === templateName)!;
  const weeklyRate = staffing.roles.reduce((sum, role) => {
    const cleanRole = role.replace(/ x\d+/, '');
    const countMatch = role.match(/x(\d+)/);
    const count = countMatch ? parseInt(countMatch[1]) : 1;
    const rate = RATE_CARD.find(r => r.role === cleanRole)?.rate || 275;
    return sum + (rate * staffing.weeklyHours * count);
  }, 0);

  const timeline = answers['sc-11'] as string | undefined;
  let weeks: number;
  if (timeline === 'Under 3 months') weeks = 10;
  else if (timeline === '3-6 months') weeks = 20;
  else if (timeline === '6-12 months') weeks = 36;
  else weeks = 24;

  return {
    complexity,
    template: templateName,
    staffing,
    estimate: {
      weeklyRate,
      totalWeeks: weeks,
      totalEstimate: weeklyRate * weeks,
    },
  };
}
