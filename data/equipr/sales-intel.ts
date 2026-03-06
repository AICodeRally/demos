/* ══════════════════════════════════════════════════════════════
   Sales Intelligence — Synthetic Data
   AI-prioritized daily action cards powered by fused data sources
   ══════════════════════════════════════════════════════════════ */

// Data source definitions
export interface DataSource {
  name: string;
  icon: string; // lucide-react icon name
  color: string;
  status: 'live' | 'syncing' | 'scheduled';
  lastSync: string;
  recordCount: string;
}

export const DATA_SOURCES: DataSource[] = [
  { name: 'Dodge Construction', icon: 'Building2', color: '#2563EB', status: 'live', lastSync: '2 min ago', recordCount: '14,203 projects' },
  { name: 'Weather API', icon: 'CloudRain', color: '#0891B2', status: 'live', lastSync: '5 min ago', recordCount: '7-day forecast' },
  { name: 'Municipal Permits', icon: 'FileCheck', color: '#8B5CF6', status: 'live', lastSync: '1 hr ago', recordCount: '892 permits' },
  { name: 'Trackunit Telematics', icon: 'Radio', color: '#F59E0B', status: 'live', lastSync: '1 min ago', recordCount: '847 units' },
  { name: 'CRM History', icon: 'Users', color: '#10B981', status: 'live', lastSync: '15 min ago', recordCount: '2,340 accounts' },
  { name: 'Census/Economic', icon: 'TrendingUp', color: '#64748B', status: 'scheduled', lastSync: 'Weekly', recordCount: '12 metros' },
];

// Action card types
export type ActionType = 'new-project' | 'upsell' | 'win-back' | 'competitive-gap' | 'fleet-rebalance';

export interface ActionCard {
  id: number;
  type: ActionType;
  priority: number; // 1-10, higher = more urgent
  revenuePotential: number;
  aiScore: number; // 0-100, AI confidence
  title: string;
  subtitle: string;
  details: string; // The story/narrative for the rep
  callToAction: string;
  dataSources: string[]; // Which sources informed this
  location: string;
  distance: string; // From branch
  timeWindow: string; // Urgency: "Call now", "This week", etc.
  contractor?: string;
  projectValue?: number;
}

// Action type metadata for styling
export const ACTION_TYPE_META: Record<ActionType, { label: string; color: string; bgColor: string; icon: string }> = {
  'new-project': { label: 'New Project Alert', color: '#2563EB', bgColor: 'rgba(37,99,235,0.12)', icon: 'Building2' },
  'upsell': { label: 'Upsell Trigger', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.12)', icon: 'TrendingUp' },
  'win-back': { label: 'Win-Back Opportunity', color: '#10B981', bgColor: 'rgba(16,185,129,0.12)', icon: 'UserCheck' },
  'competitive-gap': { label: 'Competitive Gap', color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.12)', icon: 'Target' },
  'fleet-rebalance': { label: 'Fleet Rebalance', color: '#0891B2', bgColor: 'rgba(8,145,178,0.12)', icon: 'Truck' },
};

// The actual action cards
export const ACTION_CARDS: ActionCard[] = [
  {
    id: 1,
    type: 'new-project',
    priority: 10,
    revenuePotential: 180000,
    aiScore: 94,
    title: '$12M Commercial Build — ABC Construction',
    subtitle: 'Phase 3 just hit planning, 3 miles from branch',
    details: 'A $12M commercial build just hit planning phase 3 miles from your branch. The GC is ABC Construction, who rented $80K from you last year. They\'ll need aerial lifts and excavators based on project type.',
    callToAction: 'Call now — you\'re first',
    dataSources: ['Dodge Construction', 'CRM History'],
    location: 'Scottsdale, AZ',
    distance: '3.2 mi',
    timeWindow: 'Call now',
    contractor: 'ABC Construction',
    projectValue: 12000000,
  },
  {
    id: 2,
    type: 'upsell',
    priority: 9,
    revenuePotential: 45000,
    aiScore: 91,
    title: '10-Day Rain Forecast — 3 Active Dirt Work Contracts',
    subtitle: 'Weather delay = rental extensions + equipment swaps',
    details: 'Weather forecast shows 10 days of rain starting Thursday. You have 3 active rental contracts on dirt work jobs in your territory. Those contractors are going to need extensions and possibly different equipment when they resume.',
    callToAction: 'Get ahead of it',
    dataSources: ['Weather API', 'Trackunit Telematics', 'CRM History'],
    location: 'Phoenix Metro',
    distance: 'Territory-wide',
    timeWindow: 'Before Thursday',
    contractor: 'Multiple (3 contracts)',
  },
  {
    id: 3,
    type: 'win-back',
    priority: 8,
    revenuePotential: 200000,
    aiScore: 87,
    title: 'Lapsed $200K/yr Customer — 2 New Permits',
    subtitle: 'Went dark 6 months ago, now pulling permits in your zone',
    details: 'A contractor who used to rent $200K/year from you but went dark 6 months ago just pulled permits on two new jobs in your zone.',
    callToAction: 'Re-engage now with a package deal',
    dataSources: ['CRM History', 'Municipal Permits'],
    location: 'Mesa, AZ',
    distance: '8.1 mi',
    timeWindow: 'This week',
    contractor: 'Pinnacle Builders',
    projectValue: 4500000,
  },
  {
    id: 4,
    type: 'competitive-gap',
    priority: 8,
    revenuePotential: 320000,
    aiScore: 85,
    title: 'New Subdivision — 45 Min to Nearest Competitor',
    subtitle: 'You\'re 10 minutes out. Own this geography.',
    details: 'New subdivision development approved in a zip code where the nearest competitor branch is 45 minutes away but you\'re 10 minutes out.',
    callToAction: 'Go lock it up',
    dataSources: ['Dodge Construction', 'Census/Economic', 'Municipal Permits'],
    location: 'Gilbert, AZ',
    distance: '10 min',
    timeWindow: 'This week',
    projectValue: 28000000,
  },
  {
    id: 5,
    type: 'fleet-rebalance',
    priority: 7,
    revenuePotential: 65000,
    aiScore: 82,
    title: 'Skid Steers at 95% — South Branch at 40%',
    subtitle: '3 new jobs need them, transfer before you turn away revenue',
    details: 'Utilization on skid steers at your branch is at 95% but the branch 30 miles south is at 40%. Three new jobs just posted in your territory that\'ll need them.',
    callToAction: 'Request a transfer',
    dataSources: ['Trackunit Telematics', 'Dodge Construction'],
    location: 'Tempe, AZ',
    distance: '30 mi (south branch)',
    timeWindow: 'Today',
  },
  {
    id: 6,
    type: 'new-project',
    priority: 7,
    revenuePotential: 95000,
    aiScore: 80,
    title: '$6.8M Hospital Expansion — Phase 2',
    subtitle: 'Same hospital rented $42K last phase from you',
    details: 'Banner Health\'s Chandler campus expansion Phase 2 just broke ground. They rented $42K in aerial lifts during Phase 1. Phase 2 is larger and includes underground utilities.',
    callToAction: 'Send renewal proposal',
    dataSources: ['Dodge Construction', 'CRM History'],
    location: 'Chandler, AZ',
    distance: '12.5 mi',
    timeWindow: 'This week',
    contractor: 'Turner Construction',
    projectValue: 6800000,
  },
  {
    id: 7,
    type: 'upsell',
    priority: 6,
    revenuePotential: 28000,
    aiScore: 78,
    title: 'Road Widening Phase Shift — Compaction Gear Needed',
    subtitle: 'ADOT project transitioning from excavation to grading',
    details: 'The ADOT I-17 widening project in your territory is transitioning from excavation to grading phase. Your current rental is 4 excavators. They\'ll need rollers and compactors for the next 3 months.',
    callToAction: 'Propose phase package',
    dataSources: ['Dodge Construction', 'Trackunit Telematics'],
    location: 'North Phoenix',
    distance: '18 mi',
    timeWindow: 'Next 2 weeks',
    contractor: 'Kiewit',
    projectValue: 45000000,
  },
  {
    id: 8,
    type: 'competitive-gap',
    priority: 6,
    revenuePotential: 150000,
    aiScore: 76,
    title: 'Industrial Park — Competitor Lost Their Permit',
    subtitle: 'Market intelligence: SunState lost yard permit, customers displaced',
    details: 'SunState Equipment just lost their temporary yard permit in Buckeye. They were servicing a 200-acre industrial park development. Those contractors need a new supplier.',
    callToAction: 'Canvas the site',
    dataSources: ['Municipal Permits', 'Census/Economic'],
    location: 'Buckeye, AZ',
    distance: '22 mi',
    timeWindow: 'Urgent — competitors mobilizing',
  },
  {
    id: 9,
    type: 'win-back',
    priority: 5,
    revenuePotential: 55000,
    aiScore: 73,
    title: 'Regional Solar Farm Developer — 4th Project',
    subtitle: 'They switched to Herc 2 projects ago. New job is closer to you.',
    details: 'SunVolt Energy is starting their 4th solar farm, this one just 15 miles from your branch. They switched to Herc Rentals for their last 2 projects (which were farther away). Proximity advantage is yours this time.',
    callToAction: 'Competitive bid with delivery advantage',
    dataSources: ['Dodge Construction', 'CRM History', 'Census/Economic'],
    location: 'Surprise, AZ',
    distance: '15 mi',
    timeWindow: 'This month',
    contractor: 'SunVolt Energy',
    projectValue: 8200000,
  },
  {
    id: 10,
    type: 'new-project',
    priority: 5,
    revenuePotential: 72000,
    aiScore: 70,
    title: 'Data Center Campus — Foundation Phase',
    subtitle: 'Massive concrete pour starting, need boom lifts and cranes',
    details: 'A major tech company\'s new data center campus in Goodyear is entering foundation phase. Project is $200M+, and the concrete subcontractor hasn\'t locked in equipment yet.',
    callToAction: 'Get on-site meeting',
    dataSources: ['Dodge Construction', 'Municipal Permits'],
    location: 'Goodyear, AZ',
    distance: '25 mi',
    timeWindow: 'Next 2 weeks',
    projectValue: 200000000,
  },
];

// Territory summary KPIs
export const TERRITORY_KPIS = {
  totalRevenuePotential: 1210000,
  activeProjects: 47,
  newProjectsThisWeek: 8,
  weatherAlerts: 3,
  competitorGaps: 4,
  winBackTargets: 6,
  fleetUtilization: 78,
  aiActionsToday: 10,
};
