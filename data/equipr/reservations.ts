export type ReservationStatus = 'quote' | 'booked' | 'checked_out' | 'returning' | 'overdue' | 'closed';

export interface ReservationLine {
  assetId: string;
  assetName: string;
  dailyRate: number;
  days: number;
  lineTotal: number;
}

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  status: ReservationStatus;
  startDate: string;
  endDate: string;
  lines: ReservationLine[];
  total: number;
  depositStatus: 'pending' | 'held' | 'applied' | 'refunded';
  depositAmount: number;
  locationId: string;
  notes?: string;
}

export const RESERVATIONS: Reservation[] = [
  // ── Quotes (3) ───────────────────────────────────────────────────────
  {
    id: 'RES-2026-0301',
    customerId: 'CUST-002',
    customerName: 'Rachel Torres (Suncoast Events)',
    status: 'quote',
    startDate: '2026-03-06',
    endDate: '2026-03-08',
    lines: [
      { assetId: 'AER-003', assetName: 'JLG 1932R Scissor Lift', dailyRate: 175, days: 3, lineTotal: 525 },
      { assetId: 'TLS-004', assetName: 'Wacker Neuson LTN6 Light Tower', dailyRate: 110, days: 3, lineTotal: 330 },
    ],
    total: 855,
    depositStatus: 'pending',
    depositAmount: 250,
    locationId: 'orl',
    notes: 'Outdoor corporate event at Lake Eola. Need delivery by 7am.',
  },
  {
    id: 'RES-2026-0302',
    customerId: 'CUST-009',
    customerName: 'Patricia Ng',
    status: 'quote',
    startDate: '2026-03-09',
    endDate: '2026-03-13',
    lines: [
      { assetId: 'CMP-002', assetName: 'Wacker Neuson WP1550A Plate Compactor', dailyRate: 85, days: 5, lineTotal: 425 },
    ],
    total: 425,
    depositStatus: 'pending',
    depositAmount: 100,
    locationId: 'orl',
    notes: 'Driveway project — residential.',
  },
  {
    id: 'RES-2026-0303',
    customerId: 'CUST-011',
    customerName: 'Steve Paulson',
    status: 'quote',
    startDate: '2026-03-07',
    endDate: '2026-03-08',
    lines: [
      { assetId: 'TLS-001', assetName: 'Mi-T-M 3500 PSI Pressure Washer', dailyRate: 85, days: 2, lineTotal: 170 },
    ],
    total: 170,
    depositStatus: 'pending',
    depositAmount: 50,
    locationId: 'orl',
    notes: 'Deck cleaning — weekend project.',
  },

  // ── Booked (5) ───────────────────────────────────────────────────────
  {
    id: 'RES-2026-0204',
    customerId: 'CUST-001',
    customerName: 'Tom Hargrove (Coastal Builders)',
    status: 'booked',
    startDate: '2026-03-03',
    endDate: '2026-03-14',
    lines: [
      { assetId: 'HVY-003', assetName: 'John Deere 333G Skid Steer', dailyRate: 525, days: 12, lineTotal: 6300 },
      { assetId: 'HVY-012', assetName: 'CAT 308 Mini Excavator', dailyRate: 500, days: 12, lineTotal: 6000 },
    ],
    total: 12300,
    depositStatus: 'held',
    depositAmount: 3000,
    locationId: 'orl',
    notes: 'Site prep — Windermere residential lot. Delivery to site required.',
  },
  {
    id: 'RES-2026-0205',
    customerId: 'CUST-004',
    customerName: 'Diane Whitfield (Premier Landscaping)',
    status: 'booked',
    startDate: '2026-03-04',
    endDate: '2026-03-06',
    lines: [
      { assetId: 'HVY-011', assetName: 'Kubota KX080 Mini Excavator', dailyRate: 450, days: 3, lineTotal: 1350 },
    ],
    total: 1350,
    depositStatus: 'held',
    depositAmount: 500,
    locationId: 'jax',
  },
  {
    id: 'RES-2026-0206',
    customerId: 'CUST-008',
    customerName: 'Chris Delgado',
    status: 'booked',
    startDate: '2026-03-05',
    endDate: '2026-03-07',
    lines: [
      { assetId: 'AER-006', assetName: 'Skyjack SJ6832 Scissor Lift', dailyRate: 225, days: 3, lineTotal: 675 },
    ],
    total: 675,
    depositStatus: 'held',
    depositAmount: 200,
    locationId: 'tpa',
    notes: 'Commercial HVAC install — 2nd floor.',
  },
  {
    id: 'RES-2026-0207',
    customerId: 'CUST-014',
    customerName: 'Linda Tran',
    status: 'booked',
    startDate: '2026-03-06',
    endDate: '2026-03-07',
    lines: [
      { assetId: 'TLS-006', assetName: 'Stihl TS700 Cut-Off Saw', dailyRate: 65, days: 2, lineTotal: 130 },
    ],
    total: 130,
    depositStatus: 'held',
    depositAmount: 50,
    locationId: 'tpa',
  },
  {
    id: 'RES-2026-0208',
    customerId: 'CUST-005',
    customerName: 'Marcus Lin (Metro Mechanical)',
    status: 'booked',
    startDate: '2026-03-03',
    endDate: '2026-03-10',
    lines: [
      { assetId: 'PWR-003', assetName: 'MovinCool Classic Plus 26 Portable AC', dailyRate: 125, days: 7, lineTotal: 875 },
      { assetId: 'CMP-006', assetName: 'Whiteman WM90 Mortar Mixer', dailyRate: 95, days: 7, lineTotal: 665 },
    ],
    total: 1540,
    depositStatus: 'held',
    depositAmount: 500,
    locationId: 'jax',
    notes: 'Mechanical room renovation — downtown Jacksonville.',
  },

  // ── Checked Out (8) ──────────────────────────────────────────────────
  {
    id: 'RES-2026-0109',
    customerId: 'CUST-001',
    customerName: 'Tom Hargrove (Coastal Builders)',
    status: 'checked_out',
    startDate: '2026-02-24',
    endDate: '2026-03-07',
    lines: [
      { assetId: 'HVY-001', assetName: 'CAT 320 Excavator', dailyRate: 950, days: 12, lineTotal: 11400 },
      { assetId: 'HVY-002', assetName: 'CAT 420 Backhoe Loader', dailyRate: 650, days: 12, lineTotal: 7800 },
    ],
    total: 19200,
    depositStatus: 'held',
    depositAmount: 5000,
    locationId: 'orl',
    notes: 'Phase 2 — Windermere lakefront development. Extended from original 7 days.',
  },
  {
    id: 'RES-2026-0110',
    customerId: 'CUST-003',
    customerName: 'Brian Okafor (Gulf Coast Construction)',
    status: 'checked_out',
    startDate: '2026-02-25',
    endDate: '2026-03-04',
    lines: [
      { assetId: 'HVY-004', assetName: 'CAT D6 Dozer', dailyRate: 1200, days: 8, lineTotal: 9600 },
      { assetId: 'CMP-001', assetName: 'BOMAG BW120AD Tandem Roller', dailyRate: 250, days: 8, lineTotal: 2000 },
    ],
    total: 11600,
    depositStatus: 'held',
    depositAmount: 3500,
    locationId: 'orl',
    notes: 'Road grading — Apopka commercial park.',
  },
  {
    id: 'RES-2026-0111',
    customerId: 'CUST-003',
    customerName: 'Brian Okafor (Gulf Coast Construction)',
    status: 'checked_out',
    startDate: '2026-02-26',
    endDate: '2026-03-05',
    lines: [
      { assetId: 'HVY-005', assetName: 'Komatsu PC210 Excavator', dailyRate: 875, days: 8, lineTotal: 7000 },
      { assetId: 'AER-005', assetName: 'Genie Z-45 Articulating Boom', dailyRate: 425, days: 8, lineTotal: 3400 },
    ],
    total: 10400,
    depositStatus: 'held',
    depositAmount: 3000,
    locationId: 'tpa',
    notes: 'Tampa storm drain replacement — city contract.',
  },
  {
    id: 'RES-2026-0112',
    customerId: 'CUST-006',
    customerName: 'Jake Williams',
    status: 'checked_out',
    startDate: '2026-02-27',
    endDate: '2026-03-06',
    lines: [
      { assetId: 'HVY-007', assetName: 'Case 580SN Backhoe', dailyRate: 600, days: 8, lineTotal: 4800 },
      { assetId: 'CMP-004', assetName: 'Wacker Neuson RT82 Trench Roller', dailyRate: 200, days: 8, lineTotal: 1600 },
    ],
    total: 6400,
    depositStatus: 'held',
    depositAmount: 1500,
    locationId: 'tpa',
    notes: 'Septic install — Riverview residential.',
  },
  {
    id: 'RES-2026-0113',
    customerId: 'CUST-007',
    customerName: 'Angela Reeves',
    status: 'checked_out',
    startDate: '2026-02-28',
    endDate: '2026-03-04',
    lines: [
      { assetId: 'HVY-009', assetName: 'John Deere 310SL Backhoe', dailyRate: 575, days: 5, lineTotal: 2875 },
    ],
    total: 2875,
    depositStatus: 'held',
    depositAmount: 750,
    locationId: 'jax',
  },
  {
    id: 'RES-2026-0114',
    customerId: 'CUST-010',
    customerName: 'Derek Hawkins',
    status: 'checked_out',
    startDate: '2026-03-01',
    endDate: '2026-03-05',
    lines: [
      { assetId: 'HVY-010', assetName: 'CAT 259D3 Track Loader', dailyRate: 550, days: 5, lineTotal: 2750 },
      { assetId: 'TLS-009', assetName: 'Hilti DSH 700 Hand-Held Gas Saw', dailyRate: 75, days: 5, lineTotal: 375 },
    ],
    total: 3125,
    depositStatus: 'held',
    depositAmount: 800,
    locationId: 'jax',
    notes: 'Underground conduit run — St. Augustine.',
  },
  {
    id: 'RES-2026-0115',
    customerId: 'CUST-005',
    customerName: 'Marcus Lin (Metro Mechanical)',
    status: 'checked_out',
    startDate: '2026-02-26',
    endDate: '2026-03-03',
    lines: [
      { assetId: 'PWR-004', assetName: 'Generac MMG100 Generator (70kW)', dailyRate: 325, days: 6, lineTotal: 1950 },
      { assetId: 'PWR-005', assetName: 'Atlas Copco XAS188 Air Compressor', dailyRate: 200, days: 6, lineTotal: 1200 },
    ],
    total: 3150,
    depositStatus: 'held',
    depositAmount: 1000,
    locationId: 'tpa',
    notes: 'Emergency power for Ybor City renovation.',
  },
  {
    id: 'RES-2026-0116',
    customerId: 'CUST-004',
    customerName: 'Diane Whitfield (Premier Landscaping)',
    status: 'checked_out',
    startDate: '2026-02-27',
    endDate: '2026-03-03',
    lines: [
      { assetId: 'HVY-006', assetName: 'Bobcat S770 Skid Steer', dailyRate: 475, days: 5, lineTotal: 2375 },
      { assetId: 'TLS-005', assetName: 'Mi-T-M 4000 PSI Hot Water Pressure Washer', dailyRate: 115, days: 5, lineTotal: 575 },
    ],
    total: 2950,
    depositStatus: 'held',
    depositAmount: 800,
    locationId: 'tpa',
    notes: 'Hardscape removal — Davis Islands.',
  },

  // ── Returning (2) ────────────────────────────────────────────────────
  {
    id: 'RES-2026-0117',
    customerId: 'CUST-008',
    customerName: 'Chris Delgado',
    status: 'returning',
    startDate: '2026-02-22',
    endDate: '2026-02-28',
    lines: [
      { assetId: 'AER-004', assetName: 'CAT TH514D Telehandler', dailyRate: 500, days: 7, lineTotal: 3500 },
    ],
    total: 3500,
    depositStatus: 'held',
    depositAmount: 1000,
    locationId: 'tpa',
    notes: 'Due back today. Driver scheduled for PM pickup.',
  },
  {
    id: 'RES-2026-0118',
    customerId: 'CUST-012',
    customerName: 'Maria Gonzalez',
    status: 'returning',
    startDate: '2026-02-25',
    endDate: '2026-02-28',
    lines: [
      { assetId: 'TLS-007', assetName: 'Miller Bobcat 250 Welder/Generator', dailyRate: 120, days: 4, lineTotal: 480 },
    ],
    total: 480,
    depositStatus: 'held',
    depositAmount: 150,
    locationId: 'tpa',
    notes: 'Dropping off at counter.',
  },

  // ── Overdue (2) ──────────────────────────────────────────────────────
  {
    id: 'RES-2026-0119',
    customerId: 'CUST-013',
    customerName: 'Kevin O\'Brien',
    status: 'overdue',
    startDate: '2026-02-18',
    endDate: '2026-02-25',
    lines: [
      { assetId: 'TLS-011', assetName: 'Lincoln Electric Vantage 300 Welder', dailyRate: 110, days: 7, lineTotal: 770 },
    ],
    total: 770,
    depositStatus: 'held',
    depositAmount: 200,
    locationId: 'jax',
    notes: 'OVERDUE 3 days. Called 2x, no response. Escalate to manager.',
  },
  {
    id: 'RES-2026-0120',
    customerId: 'CUST-006',
    customerName: 'Jake Williams',
    status: 'overdue',
    startDate: '2026-02-17',
    endDate: '2026-02-24',
    lines: [
      { assetId: 'PWR-008', assetName: 'Honda EU7000iS Generator (7kW)', dailyRate: 75, days: 7, lineTotal: 525 },
    ],
    total: 525,
    depositStatus: 'held',
    depositAmount: 150,
    locationId: 'orl',
    notes: 'OVERDUE 4 days. Jake says "returning Monday". Below-floor rate approved by Mike Torres.',
  },
];
