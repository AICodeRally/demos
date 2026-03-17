// Nonprofit clients, engagements, deals, consultants, and service rates

export interface Client {
  id: string;
  name: string;
  sector: string;
  size: string;
  annualBudget: number;
  healthScore: number;
  status: 'active' | 'prospect' | 'completed';
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  state: string;
}

export const CLIENTS: Client[] = [
  { id: 'cl-1', name: 'Hope Springs Foundation', sector: 'community', size: '$5M+', annualBudget: 8200000, healthScore: 92, status: 'active', contactName: 'Maria Gonzalez', contactTitle: 'Executive Director', contactEmail: 'mgonzalez@hopesprings.org', state: 'TX' },
  { id: 'cl-2', name: 'Riverside Health Alliance', sector: 'healthcare', size: '$10M+', annualBudget: 14500000, healthScore: 87, status: 'active', contactName: 'Dr. James Chen', contactTitle: 'VP of Development', contactEmail: 'jchen@riversidehealth.org', state: 'CA' },
  { id: 'cl-3', name: 'Heritage Arts Collective', sector: 'arts-culture', size: '$2M+', annualBudget: 3100000, healthScore: 78, status: 'active', contactName: 'Sarah Mitchell', contactTitle: 'Development Director', contactEmail: 'smitchell@heritagearts.org', state: 'NY' },
  { id: 'cl-4', name: 'Mountain View Academy', sector: 'education', size: '$15M+', annualBudget: 22000000, healthScore: 95, status: 'active', contactName: 'Robert Williams', contactTitle: 'Chief Advancement Officer', contactEmail: 'rwilliams@mtnviewacademy.edu', state: 'CO' },
  { id: 'cl-5', name: 'Faith & Light Ministries', sector: 'faith-based', size: '$3M+', annualBudget: 4800000, healthScore: 84, status: 'active', contactName: 'Pastor David Thompson', contactTitle: 'Senior Pastor', contactEmail: 'dthompson@faithlight.org', state: 'TN' },
  { id: 'cl-6', name: 'SafeHaven Social Services', sector: 'social-services', size: '$7M+', annualBudget: 9600000, healthScore: 89, status: 'prospect', contactName: 'Angela Brooks', contactTitle: 'CEO', contactEmail: 'abrooks@safehaven.org', state: 'IL' },
];

export interface Engagement {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  type: string;
  status: 'active' | 'completed' | 'planning';
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  leadConsultant: string;
  deliverables: number;
  completedDeliverables: number;
  sessions: number;
}

export const ENGAGEMENTS: Engagement[] = [
  { id: 'eng-1', clientId: 'cl-1', clientName: 'Hope Springs Foundation', title: 'Capital Campaign Feasibility Study', type: 'Campaign Readiness', status: 'active', progress: 72, budget: 45000, spent: 32400, startDate: '2025-11-01', endDate: '2026-04-30', leadConsultant: 'Jennifer Blake', deliverables: 8, completedDeliverables: 6, sessions: 14 },
  { id: 'eng-2', clientId: 'cl-1', clientName: 'Hope Springs Foundation', title: 'Board Development Program', type: 'Board Engagement', status: 'active', progress: 45, budget: 28000, spent: 12600, startDate: '2026-01-15', endDate: '2026-07-31', leadConsultant: 'Marcus Rivera', deliverables: 6, completedDeliverables: 3, sessions: 8 },
  { id: 'eng-3', clientId: 'cl-2', clientName: 'Riverside Health Alliance', title: 'Major Gifts Program Design', type: 'Donor Pipeline', status: 'active', progress: 60, budget: 62000, spent: 37200, startDate: '2025-12-01', endDate: '2026-05-31', leadConsultant: 'Jennifer Blake', deliverables: 10, completedDeliverables: 6, sessions: 16 },
  { id: 'eng-4', clientId: 'cl-2', clientName: 'Riverside Health Alliance', title: 'Annual Fund Optimization', type: 'Annual Fund', status: 'planning', progress: 10, budget: 35000, spent: 3500, startDate: '2026-04-01', endDate: '2026-09-30', leadConsultant: 'Thomas Park', deliverables: 5, completedDeliverables: 0, sessions: 2 },
  { id: 'eng-5', clientId: 'cl-3', clientName: 'Heritage Arts Collective', title: 'Fundraising Infrastructure Assessment', type: 'Fundraising Maturity', status: 'active', progress: 88, budget: 22000, spent: 19360, startDate: '2025-10-15', endDate: '2026-03-31', leadConsultant: 'Sarah Kim', deliverables: 7, completedDeliverables: 6, sessions: 12 },
  { id: 'eng-6', clientId: 'cl-3', clientName: 'Heritage Arts Collective', title: 'Donor Stewardship Program', type: 'Donor Stewardship', status: 'active', progress: 35, budget: 18000, spent: 6300, startDate: '2026-02-01', endDate: '2026-08-31', leadConsultant: 'Marcus Rivera', deliverables: 4, completedDeliverables: 1, sessions: 5 },
  { id: 'eng-7', clientId: 'cl-4', clientName: 'Mountain View Academy', title: '$25M Capital Campaign', type: 'Campaign Management', status: 'active', progress: 55, budget: 120000, spent: 66000, startDate: '2025-09-01', endDate: '2026-12-31', leadConsultant: 'Jennifer Blake', deliverables: 15, completedDeliverables: 8, sessions: 22 },
  { id: 'eng-8', clientId: 'cl-4', clientName: 'Mountain View Academy', title: 'Planned Giving Launch', type: 'Planned Giving', status: 'active', progress: 30, budget: 32000, spent: 9600, startDate: '2026-01-01', endDate: '2026-06-30', leadConsultant: 'Thomas Park', deliverables: 6, completedDeliverables: 2, sessions: 6 },
  { id: 'eng-9', clientId: 'cl-5', clientName: 'Faith & Light Ministries', title: 'Stewardship & Giving Program', type: 'Annual Fund', status: 'active', progress: 82, budget: 25000, spent: 20500, startDate: '2025-11-15', endDate: '2026-04-15', leadConsultant: 'Sarah Kim', deliverables: 5, completedDeliverables: 4, sessions: 10 },
  { id: 'eng-10', clientId: 'cl-5', clientName: 'Faith & Light Ministries', title: 'Development Staff Hiring', type: 'Development Staffing', status: 'completed', progress: 100, budget: 15000, spent: 14200, startDate: '2025-08-01', endDate: '2025-12-31', leadConsultant: 'Marcus Rivera', deliverables: 4, completedDeliverables: 4, sessions: 8 },
  { id: 'eng-11', clientId: 'cl-6', clientName: 'SafeHaven Social Services', title: 'Advancement Program Assessment', type: 'Fundraising Maturity', status: 'planning', progress: 5, budget: 38000, spent: 1900, startDate: '2026-04-15', endDate: '2026-10-31', leadConsultant: 'Jennifer Blake', deliverables: 8, completedDeliverables: 0, sessions: 1 },
  { id: 'eng-12', clientId: 'cl-6', clientName: 'SafeHaven Social Services', title: 'Grant Strategy Development', type: 'Grant Writing', status: 'planning', progress: 0, budget: 20000, spent: 0, startDate: '2026-05-01', endDate: '2026-11-30', leadConsultant: 'Thomas Park', deliverables: 5, completedDeliverables: 0, sessions: 0 },
];

export type PipelineStage = 'Inquiry' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Contract' | 'Active' | 'Completed' | 'Declined';

export interface Deal {
  id: string;
  clientName: string;
  contactName: string;
  title: string;
  stage: PipelineStage;
  value: number;
  probability: number;
  source: string;
  nextStep: string;
  lastActivity: string;
  history: { date: string; event: string }[];
}

export const DEALS: Deal[] = [
  { id: 'deal-1', clientName: 'SafeHaven Social Services', contactName: 'Angela Brooks', title: 'Comprehensive Advancement Program', stage: 'Negotiation', value: 58000, probability: 75, source: 'Referral', nextStep: 'Final scope meeting Mar 20', lastActivity: '2026-03-14', history: [{ date: '2026-01-10', event: 'Initial inquiry via referral' }, { date: '2026-01-22', event: 'Discovery call completed' }, { date: '2026-02-08', event: 'Proposal presented' }, { date: '2026-03-01', event: 'Scope refinement requested' }] },
  { id: 'deal-2', clientName: 'Green Valley Community Foundation', contactName: 'Lisa Chang', title: 'Capital Campaign Consulting', stage: 'Proposal Sent', value: 85000, probability: 60, source: 'Conference', nextStep: 'Follow-up call Mar 22', lastActivity: '2026-03-12', history: [{ date: '2026-02-15', event: 'Met at AFP conference' }, { date: '2026-02-28', event: 'Discovery meeting' }, { date: '2026-03-10', event: 'Proposal submitted' }] },
  { id: 'deal-3', clientName: 'Sunrise Children\'s Hospital', contactName: 'Dr. Patricia Moore', title: 'Major Gifts Strategy', stage: 'Qualified', value: 42000, probability: 40, source: 'Website', nextStep: 'Needs assessment survey', lastActivity: '2026-03-10', history: [{ date: '2026-03-01', event: 'Website inquiry received' }, { date: '2026-03-08', event: 'Intro call completed' }] },
  { id: 'deal-4', clientName: 'Northwest Arts Center', contactName: 'Michael Torres', title: 'Board Retreat & Training', stage: 'Inquiry', value: 18000, probability: 20, source: 'Referral', nextStep: 'Schedule discovery call', lastActivity: '2026-03-15', history: [{ date: '2026-03-15', event: 'Referred by Hope Springs ED' }] },
  { id: 'deal-5', clientName: 'Mountain View Academy', contactName: 'Robert Williams', title: 'Campaign Phase 2 Extension', stage: 'Contract', value: 95000, probability: 90, source: 'Existing Client', nextStep: 'Contract signing Mar 18', lastActivity: '2026-03-13', history: [{ date: '2026-02-20', event: 'Phase 2 discussion initiated' }, { date: '2026-03-05', event: 'Scope defined' }, { date: '2026-03-12', event: 'Contract sent for review' }] },
  { id: 'deal-6', clientName: 'Unity Church Network', contactName: 'Rev. Karen Foster', title: 'Stewardship Program Design', stage: 'Proposal Sent', value: 32000, probability: 55, source: 'Speaking Event', nextStep: 'Board presentation Mar 25', lastActivity: '2026-03-11', history: [{ date: '2026-02-05', event: 'Spoke at denominational conference' }, { date: '2026-02-20', event: 'Follow-up meeting' }, { date: '2026-03-08', event: 'Proposal delivered' }] },
  { id: 'deal-7', clientName: 'Riverside Health Alliance', contactName: 'Dr. James Chen', title: 'Endowment Planning', stage: 'Active', value: 48000, probability: 95, source: 'Existing Client', nextStep: 'Monthly review Apr 1', lastActivity: '2026-03-14', history: [{ date: '2025-12-01', event: 'Engagement started' }, { date: '2026-03-01', event: 'Mid-point review completed' }] },
  { id: 'deal-8', clientName: 'Coastal Education Alliance', contactName: 'Thomas Reed', title: 'Annual Fund Assessment', stage: 'Qualified', value: 24000, probability: 45, source: 'Newsletter', nextStep: 'Send assessment framework', lastActivity: '2026-03-09', history: [{ date: '2026-02-25', event: 'Newsletter lead converted' }, { date: '2026-03-05', event: 'Discovery call completed' }] },
];

export interface Consultant {
  id: string;
  name: string;
  title: string;
  specialty: string;
  utilization: number;
  activeEngagements: number;
  yearsExperience: number;
  email: string;
}

export const CONSULTANTS: Consultant[] = [
  { id: 'con-1', name: 'Jennifer Blake', title: 'Managing Director', specialty: 'Capital Campaigns', utilization: 92, activeEngagements: 4, yearsExperience: 18, email: 'jblake@tppg.com' },
  { id: 'con-2', name: 'Marcus Rivera', title: 'Senior Consultant', specialty: 'Board Development', utilization: 78, activeEngagements: 3, yearsExperience: 12, email: 'mrivera@tppg.com' },
  { id: 'con-3', name: 'Sarah Kim', title: 'Senior Consultant', specialty: 'Annual Giving', utilization: 85, activeEngagements: 2, yearsExperience: 10, email: 'skim@tppg.com' },
  { id: 'con-4', name: 'Thomas Park', title: 'Consultant', specialty: 'Planned Giving', utilization: 65, activeEngagements: 3, yearsExperience: 7, email: 'tpark@tppg.com' },
  { id: 'con-5', name: 'Diana Reeves', title: 'Associate Consultant', specialty: 'Donor Research', utilization: 72, activeEngagements: 2, yearsExperience: 4, email: 'dreeves@tppg.com' },
  { id: 'con-6', name: 'Carlos Mendez', title: 'Operations Manager', specialty: 'Project Management', utilization: 88, activeEngagements: 5, yearsExperience: 8, email: 'cmendez@tppg.com' },
];

export interface ServiceRate {
  category: 'Advisory' | 'Operational' | 'Training';
  service: string;
  rateType: 'hourly' | 'fixed' | 'retainer';
  rate: number;
  description: string;
}

export const SERVICE_RATES: ServiceRate[] = [
  { category: 'Advisory', service: 'Fundraising Assessment', rateType: 'fixed', rate: 15000, description: 'Comprehensive evaluation of fundraising program with written report' },
  { category: 'Advisory', service: 'Campaign Feasibility Study', rateType: 'fixed', rate: 25000, description: 'Market research, donor interviews, and feasibility determination' },
  { category: 'Advisory', service: 'Strategic Planning', rateType: 'fixed', rate: 20000, description: 'Multi-year advancement strategy development' },
  { category: 'Advisory', service: 'Board Consulting', rateType: 'hourly', rate: 275, description: 'Board governance, engagement, and development advising' },
  { category: 'Operational', service: 'Campaign Management', rateType: 'retainer', rate: 8500, description: 'Ongoing campaign direction and management (monthly)' },
  { category: 'Operational', service: 'Interim Development Director', rateType: 'retainer', rate: 12000, description: 'Temporary leadership of development function (monthly)' },
  { category: 'Operational', service: 'Grant Writing', rateType: 'fixed', rate: 5000, description: 'Per grant application research and submission' },
  { category: 'Operational', service: 'Donor Database Setup', rateType: 'fixed', rate: 8000, description: 'CRM configuration, data migration, and staff training' },
  { category: 'Training', service: 'Board Retreat', rateType: 'fixed', rate: 6000, description: 'Full-day board retreat with pre-work and follow-up plan' },
  { category: 'Training', service: 'Staff Workshop', rateType: 'fixed', rate: 3500, description: 'Half-day topic-focused workshop for development staff' },
  { category: 'Training', service: 'Executive Coaching', rateType: 'hourly', rate: 350, description: 'One-on-one coaching for ED/CEO or development leaders' },
];

export const PIPELINE_STAGES: PipelineStage[] = ['Inquiry', 'Qualified', 'Proposal Sent', 'Negotiation', 'Contract', 'Active', 'Completed'];

export function getPipelineStages() {
  return PIPELINE_STAGES.map((stage) => {
    const deals = DEALS.filter((d) => d.stage === stage);
    return { label: stage, count: deals.length, value: deals.reduce((sum, d) => sum + d.value, 0) };
  });
}
