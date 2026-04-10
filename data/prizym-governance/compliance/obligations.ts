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
  policiesMapped: string[];
  controlsMapped: string[];
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
