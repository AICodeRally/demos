export type JobType = 'deliver' | 'pickup';
export type JobStatus = 'scheduled' | 'en_route' | 'complete';

export interface DispatchJob {
  id: string;
  type: JobType;
  customerName: string;
  address: string;
  items: string[];
  timeWindow: string;
  driver: string;
  status: JobStatus;
  locationId: string;
}

export const DISPATCH_JOBS: DispatchJob[] = [
  // ── AM Jobs (4) ──────────────────────────────────────────────────────
  {
    id: 'DSP-030301',
    type: 'deliver',
    customerName: 'Tom Hargrove (Coastal Builders)',
    address: '12450 Sawgrass Way, Windermere, FL 34786',
    items: ['John Deere 333G Skid Steer', 'CAT 308 Mini Excavator'],
    timeWindow: '7:00 AM - 9:00 AM',
    driver: 'Eddie Morales',
    status: 'en_route',
    locationId: 'orl',
  },
  {
    id: 'DSP-030302',
    type: 'deliver',
    customerName: 'Marcus Lin (Metro Mechanical)',
    address: '201 E Bay St, Jacksonville, FL 32202',
    items: ['MovinCool Classic Plus 26 Portable AC', 'Whiteman WM90 Mortar Mixer'],
    timeWindow: '8:00 AM - 10:00 AM',
    driver: 'Terrence Boyd',
    status: 'scheduled',
    locationId: 'jax',
  },
  {
    id: 'DSP-030303',
    type: 'pickup',
    customerName: 'Brian Okafor (Gulf Coast Construction)',
    address: '3300 Apopka Blvd, Apopka, FL 32703',
    items: ['CAT D6 Dozer', 'BOMAG BW120AD Tandem Roller'],
    timeWindow: '9:00 AM - 11:00 AM',
    driver: 'Eddie Morales',
    status: 'scheduled',
    locationId: 'orl',
  },
  {
    id: 'DSP-030304',
    type: 'deliver',
    customerName: 'Diane Whitfield (Premier Landscaping)',
    address: '118 Davis Blvd, Tampa, FL 33606',
    items: ['Kubota KX080 Mini Excavator'],
    timeWindow: '10:00 AM - 12:00 PM',
    driver: 'Sam Patel',
    status: 'scheduled',
    locationId: 'tpa',
  },

  // ── PM Jobs (4) ──────────────────────────────────────────────────────
  {
    id: 'DSP-030305',
    type: 'pickup',
    customerName: 'Chris Delgado',
    address: '4501 N Armenia Ave, Tampa, FL 33603',
    items: ['CAT TH514D Telehandler'],
    timeWindow: '1:00 PM - 3:00 PM',
    driver: 'Sam Patel',
    status: 'scheduled',
    locationId: 'tpa',
  },
  {
    id: 'DSP-030306',
    type: 'deliver',
    customerName: 'Chris Delgado',
    address: '4501 N Armenia Ave, Tampa, FL 33603',
    items: ['Skyjack SJ6832 Scissor Lift'],
    timeWindow: '1:00 PM - 3:00 PM',
    driver: 'Sam Patel',
    status: 'scheduled',
    locationId: 'tpa',
  },
  {
    id: 'DSP-030307',
    type: 'pickup',
    customerName: 'Diane Whitfield (Premier Landscaping)',
    address: '118 Davis Blvd, Tampa, FL 33606',
    items: ['Bobcat S770 Skid Steer', 'Mi-T-M 4000 PSI Hot Water Pressure Washer'],
    timeWindow: '2:00 PM - 4:00 PM',
    driver: 'Sam Patel',
    status: 'scheduled',
    locationId: 'tpa',
  },
  {
    id: 'DSP-030308',
    type: 'pickup',
    customerName: 'Angela Reeves',
    address: '7720 Beach Blvd, Jacksonville, FL 32216',
    items: ['John Deere 310SL Backhoe'],
    timeWindow: '3:00 PM - 5:00 PM',
    driver: 'Terrence Boyd',
    status: 'scheduled',
    locationId: 'jax',
  },
];
