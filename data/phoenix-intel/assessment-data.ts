// TPPG-specific assessment templates, results, benchmarks, and AI interpretations

export interface AssessmentTemplate {
  id: string;
  name: string;
  description: string;
  dimensions: string[];
  questionCount: number;
  duration: string;
  completedCount: number;
}

export const ASSESSMENT_TEMPLATES: AssessmentTemplate[] = [
  {
    id: 'at-1',
    name: 'Fundraising Maturity',
    description: 'Overall fundraising program strength, infrastructure, capacity, and organizational readiness for growth',
    dimensions: ['Leadership Commitment', 'Donor Base', 'Infrastructure', 'Staff Capacity', 'Strategy', 'Culture of Philanthropy'],
    questionCount: 42,
    duration: '45-60 min',
    completedCount: 12,
  },
  {
    id: 'at-2',
    name: 'Campaign Readiness',
    description: 'Leadership, board, donors, case, and infrastructure readiness for capital campaigns',
    dimensions: ['Case for Support', 'Board Readiness', 'Donor Prospect Pool', 'Staff Readiness', 'Infrastructure', 'Market Conditions'],
    questionCount: 38,
    duration: '40-50 min',
    completedCount: 8,
  },
  {
    id: 'at-3',
    name: 'Board Engagement',
    description: 'Board giving, participation, accountability, and governance alignment with advancement goals',
    dimensions: ['Board Giving', 'Meeting Engagement', 'Committee Participation', 'Fundraising Activity', 'Governance', 'Ambassador Role'],
    questionCount: 30,
    duration: '30-40 min',
    completedCount: 6,
  },
  {
    id: 'at-4',
    name: 'Donor Pipeline Health',
    description: 'Prospect depth, gift progression, retention rates, and major gift pipeline coverage',
    dimensions: ['Prospect Identification', 'Cultivation Activity', 'Solicitation Effectiveness', 'Stewardship', 'Retention', 'Pipeline Coverage Ratio'],
    questionCount: 35,
    duration: '35-45 min',
    completedCount: 5,
  },
  {
    id: 'at-5',
    name: 'Development Staffing',
    description: 'Team sizing, structure, capacity relative to organizational goals, and professional development',
    dimensions: ['Team Size vs Goals', 'Role Clarity', 'Skill Coverage', 'Compensation Competitiveness', 'Professional Development', 'Succession Planning'],
    questionCount: 28,
    duration: '25-35 min',
    completedCount: 3,
  },
];

export interface AssessmentResult {
  id: string;
  templateId: string;
  templateName: string;
  clientId: string;
  clientName: string;
  completedDate: string;
  overallScore: number;
  maxScore: number;
  dimensionScores: { dimension: string; score: number; max: number }[];
  maturityLevel: 'Emerging' | 'Developing' | 'Established' | 'Advanced' | 'Leading';
}

export const ASSESSMENT_RESULTS: AssessmentResult[] = [
  {
    id: 'ar-1', templateId: 'at-1', templateName: 'Fundraising Maturity', clientId: 'cl-1', clientName: 'Hope Springs Foundation', completedDate: '2025-11-15', overallScore: 68, maxScore: 100, maturityLevel: 'Developing',
    dimensionScores: [
      { dimension: 'Leadership Commitment', score: 82, max: 100 },
      { dimension: 'Donor Base', score: 65, max: 100 },
      { dimension: 'Infrastructure', score: 55, max: 100 },
      { dimension: 'Staff Capacity', score: 58, max: 100 },
      { dimension: 'Strategy', score: 72, max: 100 },
      { dimension: 'Culture of Philanthropy', score: 78, max: 100 },
    ],
  },
  {
    id: 'ar-2', templateId: 'at-2', templateName: 'Campaign Readiness', clientId: 'cl-1', clientName: 'Hope Springs Foundation', completedDate: '2025-12-10', overallScore: 71, maxScore: 100, maturityLevel: 'Developing',
    dimensionScores: [
      { dimension: 'Case for Support', score: 80, max: 100 },
      { dimension: 'Board Readiness', score: 62, max: 100 },
      { dimension: 'Donor Prospect Pool', score: 70, max: 100 },
      { dimension: 'Staff Readiness', score: 55, max: 100 },
      { dimension: 'Infrastructure', score: 72, max: 100 },
      { dimension: 'Market Conditions', score: 85, max: 100 },
    ],
  },
  {
    id: 'ar-3', templateId: 'at-1', templateName: 'Fundraising Maturity', clientId: 'cl-2', clientName: 'Riverside Health Alliance', completedDate: '2025-12-01', overallScore: 78, maxScore: 100, maturityLevel: 'Established',
    dimensionScores: [
      { dimension: 'Leadership Commitment', score: 90, max: 100 },
      { dimension: 'Donor Base', score: 82, max: 100 },
      { dimension: 'Infrastructure', score: 72, max: 100 },
      { dimension: 'Staff Capacity', score: 68, max: 100 },
      { dimension: 'Strategy', score: 80, max: 100 },
      { dimension: 'Culture of Philanthropy', score: 76, max: 100 },
    ],
  },
  {
    id: 'ar-4', templateId: 'at-4', templateName: 'Donor Pipeline Health', clientId: 'cl-2', clientName: 'Riverside Health Alliance', completedDate: '2026-01-20', overallScore: 72, maxScore: 100, maturityLevel: 'Developing',
    dimensionScores: [
      { dimension: 'Prospect Identification', score: 85, max: 100 },
      { dimension: 'Cultivation Activity', score: 70, max: 100 },
      { dimension: 'Solicitation Effectiveness', score: 65, max: 100 },
      { dimension: 'Stewardship', score: 78, max: 100 },
      { dimension: 'Retention', score: 68, max: 100 },
      { dimension: 'Pipeline Coverage Ratio', score: 62, max: 100 },
    ],
  },
  {
    id: 'ar-5', templateId: 'at-1', templateName: 'Fundraising Maturity', clientId: 'cl-3', clientName: 'Heritage Arts Collective', completedDate: '2025-10-20', overallScore: 52, maxScore: 100, maturityLevel: 'Emerging',
    dimensionScores: [
      { dimension: 'Leadership Commitment', score: 70, max: 100 },
      { dimension: 'Donor Base', score: 45, max: 100 },
      { dimension: 'Infrastructure', score: 35, max: 100 },
      { dimension: 'Staff Capacity', score: 40, max: 100 },
      { dimension: 'Strategy', score: 55, max: 100 },
      { dimension: 'Culture of Philanthropy', score: 65, max: 100 },
    ],
  },
  {
    id: 'ar-6', templateId: 'at-3', templateName: 'Board Engagement', clientId: 'cl-3', clientName: 'Heritage Arts Collective', completedDate: '2025-11-05', overallScore: 48, maxScore: 100, maturityLevel: 'Emerging',
    dimensionScores: [
      { dimension: 'Board Giving', score: 35, max: 100 },
      { dimension: 'Meeting Engagement', score: 60, max: 100 },
      { dimension: 'Committee Participation', score: 42, max: 100 },
      { dimension: 'Fundraising Activity', score: 30, max: 100 },
      { dimension: 'Governance', score: 55, max: 100 },
      { dimension: 'Ambassador Role', score: 65, max: 100 },
    ],
  },
  {
    id: 'ar-7', templateId: 'at-1', templateName: 'Fundraising Maturity', clientId: 'cl-4', clientName: 'Mountain View Academy', completedDate: '2025-09-10', overallScore: 85, maxScore: 100, maturityLevel: 'Advanced',
    dimensionScores: [
      { dimension: 'Leadership Commitment', score: 95, max: 100 },
      { dimension: 'Donor Base', score: 88, max: 100 },
      { dimension: 'Infrastructure', score: 82, max: 100 },
      { dimension: 'Staff Capacity', score: 78, max: 100 },
      { dimension: 'Strategy', score: 85, max: 100 },
      { dimension: 'Culture of Philanthropy', score: 82, max: 100 },
    ],
  },
  {
    id: 'ar-8', templateId: 'at-2', templateName: 'Campaign Readiness', clientId: 'cl-4', clientName: 'Mountain View Academy', completedDate: '2025-09-25', overallScore: 88, maxScore: 100, maturityLevel: 'Advanced',
    dimensionScores: [
      { dimension: 'Case for Support', score: 92, max: 100 },
      { dimension: 'Board Readiness', score: 85, max: 100 },
      { dimension: 'Donor Prospect Pool', score: 90, max: 100 },
      { dimension: 'Staff Readiness', score: 82, max: 100 },
      { dimension: 'Infrastructure', score: 88, max: 100 },
      { dimension: 'Market Conditions', score: 90, max: 100 },
    ],
  },
  {
    id: 'ar-9', templateId: 'at-5', templateName: 'Development Staffing', clientId: 'cl-5', clientName: 'Faith & Light Ministries', completedDate: '2025-08-15', overallScore: 45, maxScore: 100, maturityLevel: 'Emerging',
    dimensionScores: [
      { dimension: 'Team Size vs Goals', score: 35, max: 100 },
      { dimension: 'Role Clarity', score: 50, max: 100 },
      { dimension: 'Skill Coverage', score: 40, max: 100 },
      { dimension: 'Compensation Competitiveness', score: 48, max: 100 },
      { dimension: 'Professional Development', score: 42, max: 100 },
      { dimension: 'Succession Planning', score: 55, max: 100 },
    ],
  },
  {
    id: 'ar-10', templateId: 'at-1', templateName: 'Fundraising Maturity', clientId: 'cl-5', clientName: 'Faith & Light Ministries', completedDate: '2025-11-20', overallScore: 62, maxScore: 100, maturityLevel: 'Developing',
    dimensionScores: [
      { dimension: 'Leadership Commitment', score: 85, max: 100 },
      { dimension: 'Donor Base', score: 58, max: 100 },
      { dimension: 'Infrastructure', score: 45, max: 100 },
      { dimension: 'Staff Capacity', score: 52, max: 100 },
      { dimension: 'Strategy', score: 60, max: 100 },
      { dimension: 'Culture of Philanthropy', score: 72, max: 100 },
    ],
  },
];

export const BENCHMARK_DATA: Record<string, { emerging: number; developing: number; established: number; advanced: number; leading: number }> = {
  'Leadership Commitment': { emerging: 40, developing: 60, established: 75, advanced: 85, leading: 95 },
  'Donor Base': { emerging: 30, developing: 50, established: 70, advanced: 82, leading: 92 },
  'Infrastructure': { emerging: 25, developing: 45, established: 65, advanced: 80, leading: 90 },
  'Staff Capacity': { emerging: 30, developing: 48, established: 65, advanced: 78, leading: 88 },
  'Strategy': { emerging: 35, developing: 55, established: 72, advanced: 84, leading: 93 },
  'Culture of Philanthropy': { emerging: 35, developing: 55, established: 70, advanced: 82, leading: 92 },
};

export const AI_INTERPRETATIONS: Record<string, string> = {
  'ar-1': 'Hope Springs shows strong leadership commitment (82/100) but needs significant infrastructure investment. Their donor base is narrowly concentrated — the top 10 donors account for 68% of giving. Recommend: (1) CRM implementation, (2) mid-level donor cultivation program, (3) staff capacity assessment before pursuing campaign.',
  'ar-2': 'Campaign readiness assessment reveals strong market conditions (85/100) and compelling case (80/100), but board readiness lags at 62/100. Three board members have never made a personal gift. Recommend: board giving challenge and cultivation training before public campaign launch.',
  'ar-3': 'Riverside demonstrates established maturity with strong leadership (90/100). Primary gap: staff capacity at 68/100 — the development team handles 40% more prospects per FTE than benchmark. Recommend: immediate hire of major gifts officer to capitalize on existing donor base strength.',
  'ar-5': 'Heritage Arts is in emerging stage across most dimensions. Infrastructure (35/100) is the critical gap — they lack a donor database and formal acknowledgment process. However, their cultural commitment to philanthropy (65/100) provides a strong foundation. Recommend: foundational investment in systems before programmatic expansion.',
  'ar-7': 'Mountain View is one of the highest-performing organizations we\'ve assessed. All dimensions score above 78/100. Campaign readiness at 88/100 positions them well for the $25M campaign. Key risk: staff capacity may thin during public phase. Recommend: hiring campaign coordinator by Q2 2026.',
  'ar-9': 'Faith & Light\'s development staffing is critically under-resourced. A single development director handles all fundraising for a $4.8M budget. Industry benchmark suggests 2.5 FTEs minimum. Recommend: immediate hire of development associate and transition to shared services model for grant writing.',
};

export function getAssessmentRoadmap(resultId: string): { month: number; action: string; priority: 'high' | 'medium' | 'low' }[] {
  const roadmaps: Record<string, { month: number; action: string; priority: 'high' | 'medium' | 'low' }[]> = {
    'ar-1': [
      { month: 1, action: 'Implement donor CRM (Bloomerang or DonorPerfect)', priority: 'high' },
      { month: 2, action: 'Define gift acknowledgment and stewardship protocols', priority: 'high' },
      { month: 3, action: 'Launch mid-level donor identification program', priority: 'high' },
      { month: 4, action: 'Board giving campaign with personal asks', priority: 'medium' },
      { month: 5, action: 'Staff capacity assessment and hiring plan', priority: 'medium' },
      { month: 6, action: 'Annual fund strategy refresh with segmentation', priority: 'medium' },
      { month: 7, action: 'Major donor cultivation event series (quarterly)', priority: 'medium' },
      { month: 8, action: 'Planned giving awareness marketing', priority: 'low' },
      { month: 9, action: 'Peer organization benchmarking review', priority: 'low' },
      { month: 10, action: 'Year-end campaign planning with AI-driven segmentation', priority: 'medium' },
      { month: 11, action: 'Board retreat: fundraising culture and ambassadorship', priority: 'medium' },
      { month: 12, action: 'Annual advancement program review and KPI assessment', priority: 'high' },
    ],
    'ar-7': [
      { month: 1, action: 'Finalize campaign leadership committee', priority: 'high' },
      { month: 2, action: 'Complete quiet phase prospect identification (top 30)', priority: 'high' },
      { month: 3, action: 'Launch quiet phase solicitations ($5M target)', priority: 'high' },
      { month: 4, action: 'Hire campaign coordinator', priority: 'high' },
      { month: 5, action: 'Campaign case statement final review', priority: 'medium' },
      { month: 6, action: 'Mid-campaign assessment (50% quiet phase goal)', priority: 'high' },
      { month: 7, action: 'Board engagement intensive — each member asks 3 prospects', priority: 'medium' },
      { month: 8, action: 'Public phase planning and marketing collateral', priority: 'medium' },
      { month: 9, action: 'Community cultivation events (2 per quarter)', priority: 'medium' },
      { month: 10, action: 'Corporate and foundation proposal wave', priority: 'medium' },
      { month: 11, action: 'Year-end giving integration with campaign', priority: 'high' },
      { month: 12, action: 'Campaign milestone celebration and phase 2 planning', priority: 'high' },
    ],
  };
  return roadmaps[resultId] || roadmaps['ar-1'];
}
