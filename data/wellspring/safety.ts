export interface TrirMonth {
  month: string;
  trir: number;
  incidents: number;
  nearMisses: number;
  hoursWorked: number;
}

export interface Incident {
  id: string;
  date: string;
  type: 'recordable' | 'first-aid' | 'near-miss' | 'environmental';
  severity: 'high' | 'medium' | 'low';
  location: string;
  padId: string | null;
  description: string;
  rootCause: string;
  correctiveAction: string;
  status: 'closed' | 'open' | 'under-review';
  daysAway: number;
}

export interface FlareVolume {
  padId: string;
  padName: string;
  monthlyMcf: number;
  captureRate: number;
  permitted: boolean;
  expirationDate: string | null;
}

export interface EmissionsData {
  category: string;
  tonsPerYear: number;
  limit: number;
  percentOfLimit: number;
}

export interface WaterDisposal {
  method: string;
  volumeBwpd: number;
  costPerBbl: number;
  facility: string;
}

// TRIR history (12 months)
export const TRIR_HISTORY: TrirMonth[] = [
  { month: '2025-04', trir: 0.58, incidents: 1, nearMisses: 0, hoursWorked: 34200 },
  { month: '2025-05', trir: 0.55, incidents: 0, nearMisses: 1, hoursWorked: 35800 },
  { month: '2025-06', trir: 0.52, incidents: 0, nearMisses: 0, hoursWorked: 36100 },
  { month: '2025-07', trir: 0.50, incidents: 1, nearMisses: 1, hoursWorked: 37200 },
  { month: '2025-08', trir: 0.48, incidents: 0, nearMisses: 0, hoursWorked: 36800 },
  { month: '2025-09', trir: 0.46, incidents: 0, nearMisses: 1, hoursWorked: 35400 },
  { month: '2025-10', trir: 0.45, incidents: 0, nearMisses: 0, hoursWorked: 36600 },
  { month: '2025-11', trir: 0.44, incidents: 0, nearMisses: 1, hoursWorked: 34800 },
  { month: '2025-12', trir: 0.43, incidents: 0, nearMisses: 0, hoursWorked: 32200 },
  { month: '2026-01', trir: 0.42, incidents: 0, nearMisses: 0, hoursWorked: 35600 },
  { month: '2026-02', trir: 0.42, incidents: 0, nearMisses: 1, hoursWorked: 33800 },
  { month: '2026-03', trir: 0.42, incidents: 0, nearMisses: 0, hoursWorked: 12400 },
];

// Incidents (5 recordables + 1 first-aid)
export const INCIDENTS: Incident[] = [
  {
    id: 'INC-2025-001',
    date: '2025-04-12',
    type: 'recordable',
    severity: 'medium',
    location: 'Mustang Pad',
    padId: 'pad-a',
    description: 'Pumper struck hand on polish rod clamp during maintenance. Laceration required 4 stitches.',
    rootCause: 'Worker removed glove to adjust fitting — failed to follow PPE protocol',
    correctiveAction: 'Refreshed PPE training for all field personnel. Added cut-resistant glove requirement to JSA.',
    status: 'closed',
    daysAway: 2,
  },
  {
    id: 'INC-2025-002',
    date: '2025-07-18',
    type: 'recordable',
    severity: 'low',
    location: 'Rattlesnake Pad',
    padId: 'pad-b',
    description: 'Contractor twisted ankle stepping off equipment trailer. Restricted duty for 5 days.',
    rootCause: 'Wet conditions on trailer deck — no anti-slip coating',
    correctiveAction: 'Applied anti-slip coating to all equipment trailers. Added to pre-job checklist.',
    status: 'closed',
    daysAway: 0,
  },
  {
    id: 'INC-2025-003',
    date: '2025-09-05',
    type: 'first-aid',
    severity: 'low',
    location: 'Pecos Yard',
    padId: null,
    description: 'Chemical splash on forearm during inhibitor transfer. Treated on-site, no lost time.',
    rootCause: 'Hose connection failed during chemical transfer — worn O-ring',
    correctiveAction: 'Replaced all chemical transfer hoses. Added O-ring inspection to weekly checklist.',
    status: 'closed',
    daysAway: 0,
  },
  {
    id: 'INC-2025-004',
    date: '2025-11-22',
    type: 'environmental',
    severity: 'medium',
    location: 'Sidewinder Pad',
    padId: 'pad-c',
    description: '2 bbl produced water spill from separator dump valve. Contained within berm, soil remediated.',
    rootCause: 'Separator dump valve stuck open — solenoid failure',
    correctiveAction: 'Replaced dump valve solenoid. Added weekly valve function test to PM schedule.',
    status: 'closed',
    daysAway: 0,
  },
  {
    id: 'INC-2026-001',
    date: '2026-01-15',
    type: 'first-aid',
    severity: 'low',
    location: 'Diamondback Pad',
    padId: 'pad-d',
    description: 'Minor burn on hand from hot flowline. Treated with burn cream, returned to duty.',
    rootCause: 'Insulation missing from 6-foot section of flowline — not flagged during inspection',
    correctiveAction: 'Repaired insulation. Added thermal hazard markers to bare pipe sections.',
    status: 'closed',
    daysAway: 0,
  },
  {
    id: 'INC-2026-002',
    date: '2026-02-28',
    type: 'environmental',
    severity: 'low',
    location: 'Rattlesnake Pad',
    padId: 'pad-b',
    description: 'Minor sheeting of produced water outside secondary containment after heavy rain. <1 bbl, recovered.',
    rootCause: 'Rainwater exceeded containment capacity — drain valve was closed',
    correctiveAction: 'Installed automatic drain with oil/water separator on containment berms.',
    status: 'under-review',
    daysAway: 0,
  },
];

// Near-misses
export const NEAR_MISSES: Incident[] = [
  {
    id: 'NM-2025-001',
    date: '2025-05-20',
    type: 'near-miss',
    severity: 'high',
    location: 'Mustang Pad',
    padId: 'pad-a',
    description: 'H2S detector alarmed at 12 ppm during tank gauging. Worker evacuated upwind. No exposure.',
    rootCause: 'Tank thief hatch left open during prior truck loading — H2S accumulated in headspace',
    correctiveAction: 'Reinforced tank gauging SOP — always approach from upwind. Added audible H2S pre-alarm at 8 ppm.',
    status: 'closed',
    daysAway: 0,
  },
  {
    id: 'NM-2025-002',
    date: '2025-07-30',
    type: 'near-miss',
    severity: 'medium',
    location: 'County Rd 401',
    padId: null,
    description: 'Truck tire blowout on County Rd 401 at 45 mph. Vehicle controlled safely, no injuries.',
    rootCause: 'Tire age exceeded 5-year replacement policy — missed in PM rotation',
    correctiveAction: 'Replaced all tires over 4 years. Tire age check added to weekly inspection.',
    status: 'closed',
    daysAway: 0,
  },
  {
    id: 'NM-2025-003',
    date: '2025-09-14',
    type: 'near-miss',
    severity: 'medium',
    location: 'Sidewinder Pad',
    padId: 'pad-c',
    description: 'Dropped pipe wrench from 8 ft elevation during wellhead work. No personnel below.',
    rootCause: 'Tool lanyard not attached — worker in rush to complete task before weather',
    correctiveAction: 'Mandatory tool lanyards above 6 ft. Added dropped object awareness to weekly safety meeting.',
    status: 'closed',
    daysAway: 0,
  },
  {
    id: 'NM-2026-001',
    date: '2026-02-10',
    type: 'near-miss',
    severity: 'medium',
    location: 'Diamondback Pad',
    padId: 'pad-d',
    description: 'Lightning strike within 500 ft of active well location. Crew sheltered in truck per SOP.',
    rootCause: 'Weather event — crew followed lightning protocol correctly',
    correctiveAction: 'Positive reinforcement — crew response cited in safety meeting. No corrective action needed.',
    status: 'closed',
    daysAway: 0,
  },
];

// Flare volumes by pad
export const FLARE_VOLUMES: FlareVolume[] = [
  { padId: 'pad-a', padName: 'Mustang Pad', monthlyMcf: 1240, captureRate: 0.96, permitted: true, expirationDate: '2027-12-31' },
  { padId: 'pad-b', padName: 'Rattlesnake Pad', monthlyMcf: 1680, captureRate: 0.95, permitted: true, expirationDate: '2028-06-30' },
  { padId: 'pad-c', padName: 'Sidewinder Pad', monthlyMcf: 980, captureRate: 0.97, permitted: true, expirationDate: '2029-03-31' },
  { padId: 'pad-d', padName: 'Diamondback Pad', monthlyMcf: 2100, captureRate: 0.94, permitted: true, expirationDate: '2029-09-30' },
];

// Emissions data (annual)
export const EMISSIONS: EmissionsData[] = [
  { category: 'VOC', tonsPerYear: 82, limit: 250, percentOfLimit: 0.328 },
  { category: 'NOx', tonsPerYear: 45, limit: 100, percentOfLimit: 0.45 },
  { category: 'CO', tonsPerYear: 38, limit: 100, percentOfLimit: 0.38 },
  { category: 'SO2', tonsPerYear: 4.2, limit: 25, percentOfLimit: 0.168 },
  { category: 'PM10', tonsPerYear: 12, limit: 75, percentOfLimit: 0.16 },
  { category: 'H2S (flare)', tonsPerYear: 0.8, limit: 10, percentOfLimit: 0.08 },
];

// Water disposal breakdown
export const WATER_DISPOSAL: WaterDisposal[] = [
  { method: 'SWD Injection', volumeBwpd: 2400, costPerBbl: 0.65, facility: 'PBR SWD #1 (operated)' },
  { method: 'SWD Injection', volumeBwpd: 1800, costPerBbl: 0.85, facility: 'Clearwater Disposal (3rd party)' },
  { method: 'Recycling', volumeBwpd: 600, costPerBbl: 0.40, facility: 'PBR Recycle Facility' },
  { method: 'Evaporation', volumeBwpd: 200, costPerBbl: 0.15, facility: 'Mustang Evap Pond (permitted)' },
];
