/**
 * Prizym Governance — Committee Data (Static Demo)
 */

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  title: string;
  department: string;
  isVoting: boolean;
}

export interface Committee {
  id: string;
  code: string;
  name: string;
  description: string;
  purpose: string;
  authority: string[];
  members: CommitteeMember[];
  meetingCadence: string;
  quorumRequirement: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const SGCC: Committee = {
  id: 'committee-sgcc',
  code: 'SGCC',
  name: 'Sales Compensation Governance Committee',
  description: 'Establishes and oversees the governance framework for all sales compensation programs',
  purpose: 'Responsible for establishing, maintaining, and improving the sales compensation governance framework. Ensures all compensation plans, policies, and procedures are fair, compliant, transparent, and aligned with business strategy.',
  authority: [
    'Approve new compensation plans and significant plan changes',
    'Approve all compensation policies and procedures',
    'Establish approval thresholds for exceptions and SPIFs',
    'Review and resolve compensation disputes requiring escalation',
    'Recommend plan changes to executive leadership',
    'Establish governance standards and best practices',
  ],
  members: [
    { id: 'm-sgcc-1', name: 'Sarah Chen', role: 'Chair', title: 'VP Sales Compensation', department: 'Sales Operations', isVoting: true },
    { id: 'm-sgcc-2', name: 'Michael Rodriguez', role: 'Vice Chair', title: 'Chief Financial Officer', department: 'Finance', isVoting: true },
    { id: 'm-sgcc-3', name: 'Jennifer Williams', role: 'Member', title: 'Chief Human Resources Officer', department: 'Human Resources', isVoting: true },
    { id: 'm-sgcc-4', name: 'David Thompson', role: 'Member', title: 'General Counsel', department: 'Legal', isVoting: true },
    { id: 'm-sgcc-5', name: 'Robert Kim', role: 'Member', title: 'Chief Sales Officer', department: 'Sales', isVoting: true },
    { id: 'm-sgcc-6', name: 'Amanda Foster', role: 'Member', title: 'VP Sales Operations', department: 'Sales Operations', isVoting: true },
    { id: 'm-sgcc-7', name: 'James Martinez', role: 'Member', title: 'Regional Sales Director (Rotating)', department: 'Sales', isVoting: true },
    { id: 'm-sgcc-8', name: 'Lisa Park', role: 'Secretary (Non-Voting)', title: 'Sales Compensation Manager', department: 'Sales Operations', isVoting: false },
    { id: 'm-sgcc-9', name: 'Kevin Nguyen', role: 'Advisor (Non-Voting)', title: 'Compensation Administrator', department: 'Sales Operations', isVoting: false },
  ],
  meetingCadence: 'Quarterly (minimum), with additional meetings as needed',
  quorumRequirement: '5 of 7 voting members required for quorum',
  status: 'ACTIVE',
};

export const CRB: Committee = {
  id: 'committee-crb',
  code: 'CRB',
  name: 'Compensation Review Board',
  description: 'Reviews and approves windfall deals, large SPIFs, and high-value exceptions',
  purpose: 'The Compensation Review Board reviews and approves large deals, SPIFs, and exceptions above certain thresholds. Provides rapid decision-making for windfall transactions and exceptional circumstances.',
  authority: [
    'Windfall deal review (>$1M ARR, >$100K commission, >50% quarterly quota)',
    'SPIF approvals ($50K-$250K range)',
    'Exception requests >$25K',
    'Individual dispute escalations',
    '20 business day review SLA for windfall deals',
  ],
  members: [
    { id: 'm-crb-1', name: 'Sarah Chen', role: 'Chair', title: 'VP Sales Compensation', department: 'Sales Operations', isVoting: true },
    { id: 'm-crb-2', name: 'Patricia Garcia', role: 'Member', title: 'Director of Finance', department: 'Finance', isVoting: true },
    { id: 'm-crb-3', name: 'Amanda Foster', role: 'Member', title: 'VP Sales Operations', department: 'Sales Operations', isVoting: true },
    { id: 'm-crb-4', name: 'David Thompson', role: 'Advisor (Non-Voting)', title: 'General Counsel', department: 'Legal', isVoting: false },
    { id: 'm-crb-5', name: 'Robert Kim', role: 'Advisor (Non-Voting)', title: 'Chief Sales Officer', department: 'Sales', isVoting: false },
  ],
  meetingCadence: 'Ad-hoc as needed for windfall deals and exception requests',
  quorumRequirement: '2 of 3 voting members required for quorum',
  status: 'ACTIVE',
};

export const ALL_COMMITTEES = [SGCC, CRB];
