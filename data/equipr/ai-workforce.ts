// ── AI Workforce Intelligence ──────────────────────────────────────────────

export type SkillLevel = 'expert' | 'proficient' | 'developing' | 'novice';

export interface Technician {
  id: string;
  name: string;
  yearsExperience: number;
  certifications: string[];
  specialties: string[];
  skillLevel: SkillLevel;
  aiAssistUsage: number; // queries this month
  avgRepairTime: number; // hours
  firstTimeFixRate: number; // percent
  safetyIncidents: number; // last 12 months
}

export const TECHNICIANS: Technician[] = [
  // ── Veterans (15+ years, experts) ────────────────────────────
  {
    id: 'TECH-001',
    name: 'Mike Hargrove',
    yearsExperience: 22,
    certifications: ['CAT Master Tech', 'OSHA 30', 'Hydraulic Systems III', 'Diesel Advanced'],
    specialties: ['Hydraulics', 'Diesel Engines', 'Heavy Equipment'],
    skillLevel: 'expert',
    aiAssistUsage: 3,
    avgRepairTime: 2.1,
    firstTimeFixRate: 96,
    safetyIncidents: 0,
  },
  {
    id: 'TECH-002',
    name: 'Bill Tanaka',
    yearsExperience: 18,
    certifications: ['JLG Certified', 'OSHA 30', 'Electrical Systems II', 'Boom Specialist'],
    specialties: ['Electrical', 'Aerial Lifts', 'Boom/Arm Calibration'],
    skillLevel: 'expert',
    aiAssistUsage: 8,
    avgRepairTime: 2.4,
    firstTimeFixRate: 93,
    safetyIncidents: 0,
  },

  // ── Mid-level (5-10 years) ───────────────────────────────────
  {
    id: 'TECH-003',
    name: 'Carlos Rivera',
    yearsExperience: 8,
    certifications: ['CAT Service Tech', 'OSHA 10', 'Diesel Intermediate'],
    specialties: ['Diesel Engines', 'Preventive Maintenance'],
    skillLevel: 'proficient',
    aiAssistUsage: 28,
    avgRepairTime: 3.2,
    firstTimeFixRate: 84,
    safetyIncidents: 1,
  },
  {
    id: 'TECH-004',
    name: 'Sarah Chen',
    yearsExperience: 6,
    certifications: ['OSHA 10', 'Hydraulic Systems I', 'Electrical Fundamentals'],
    specialties: ['Hydraulics', 'Electrical'],
    skillLevel: 'proficient',
    aiAssistUsage: 42,
    avgRepairTime: 3.5,
    firstTimeFixRate: 81,
    safetyIncidents: 1,
  },
  {
    id: 'TECH-005',
    name: 'Darnell Washington',
    yearsExperience: 7,
    certifications: ['Genie Certified', 'OSHA 10', 'Compaction Systems'],
    specialties: ['Aerial Lifts', 'Compaction', 'Preventive Maintenance'],
    skillLevel: 'proficient',
    aiAssistUsage: 35,
    avgRepairTime: 3.4,
    firstTimeFixRate: 82,
    safetyIncidents: 0,
  },

  // ── Junior (1-4 years) ───────────────────────────────────────
  {
    id: 'TECH-006',
    name: 'Jake Morrison',
    yearsExperience: 3,
    certifications: ['OSHA 10'],
    specialties: ['Preventive Maintenance', 'Diesel Engines'],
    skillLevel: 'developing',
    aiAssistUsage: 67,
    avgRepairTime: 4.8,
    firstTimeFixRate: 74,
    safetyIncidents: 2,
  },
  {
    id: 'TECH-007',
    name: 'Priya Patel',
    yearsExperience: 2,
    certifications: ['OSHA 10'],
    specialties: ['Electrical', 'Hydraulics'],
    skillLevel: 'developing',
    aiAssistUsage: 82,
    avgRepairTime: 4.2,
    firstTimeFixRate: 78,
    safetyIncidents: 1,
  },
  {
    id: 'TECH-008',
    name: 'Tyler Brooks',
    yearsExperience: 1,
    certifications: [],
    specialties: ['Preventive Maintenance'],
    skillLevel: 'novice',
    aiAssistUsage: 91,
    avgRepairTime: 5.6,
    firstTimeFixRate: 68,
    safetyIncidents: 3,
  },
];

// ── Workforce KPIs ─────────────────────────────────────────────────────────

export interface WorkforceKpis {
  avgExperience: number;
  aiKnowledgeQueries: number;
  firstTimeFixImprovement: number;
  repairTimeReduction: number;
  knowledgeArticles: number;
  safetyIncidentReduction: number;
}

export const WORKFORCE_KPIS: WorkforceKpis = {
  avgExperience: 6.2,
  aiKnowledgeQueries: 342,
  firstTimeFixImprovement: 18,
  repairTimeReduction: 23,
  knowledgeArticles: 1247,
  safetyIncidentReduction: 41,
};

// ── Skill Gap Comparison ───────────────────────────────────────────────────

export interface SkillGapRow {
  skill: string;
  veteranAvg: number;
  currentAvg: number;
  aiAssistedAvg: number;
}

export const SKILL_GAP_DATA: SkillGapRow[] = [
  { skill: 'Hydraulic Repair', veteranAvg: 96, currentAvg: 62, aiAssistedAvg: 87 },
  { skill: 'Diesel Engine Diagnostics', veteranAvg: 94, currentAvg: 58, aiAssistedAvg: 84 },
  { skill: 'Electrical Troubleshooting', veteranAvg: 92, currentAvg: 55, aiAssistedAvg: 82 },
  { skill: 'Boom/Arm Calibration', veteranAvg: 98, currentAvg: 60, aiAssistedAvg: 88 },
  { skill: 'Safety Protocol Adherence', veteranAvg: 97, currentAvg: 75, aiAssistedAvg: 92 },
  { skill: 'Preventive Maintenance', veteranAvg: 90, currentAvg: 70, aiAssistedAvg: 85 },
];

// ── Knowledge Capture Trend (6 months) ─────────────────────────────────────

export interface KnowledgeCaptureTrendMonth {
  month: string;
  articlesAdded: number;
  queriesAnswered: number;
  accuracyRate: number;
}

export const KNOWLEDGE_CAPTURE_TREND: KnowledgeCaptureTrendMonth[] = [
  { month: 'Sep', articlesAdded: 142, queriesAnswered: 186, accuracyRate: 84 },
  { month: 'Oct', articlesAdded: 178, queriesAnswered: 224, accuracyRate: 87 },
  { month: 'Nov', articlesAdded: 205, queriesAnswered: 268, accuracyRate: 89 },
  { month: 'Dec', articlesAdded: 198, queriesAnswered: 295, accuracyRate: 91 },
  { month: 'Jan', articlesAdded: 247, queriesAnswered: 318, accuracyRate: 93 },
  { month: 'Feb', articlesAdded: 277, queriesAnswered: 342, accuracyRate: 94 },
];

// ── Repair Time Comparison (with vs without AI) ───────────────────────────

export interface RepairComparison {
  category: string;
  withoutAI: number;
  withAI: number;
}

export const REPAIR_COMPARISON: RepairComparison[] = [
  { category: 'Hydraulic Systems', withoutAI: 5.2, withAI: 3.6 },
  { category: 'Diesel Engine', withoutAI: 6.8, withAI: 4.9 },
  { category: 'Electrical', withoutAI: 4.1, withAI: 2.8 },
  { category: 'Boom/Aerial', withoutAI: 3.8, withAI: 2.7 },
  { category: 'Compaction', withoutAI: 2.9, withAI: 2.1 },
  { category: 'Preventive Maint.', withoutAI: 1.8, withAI: 1.3 },
];
