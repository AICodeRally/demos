export type SignatureStatus = 'pending' | 'signed' | 'expired';

export interface Contract {
  id: string;
  reservationId: string;
  customerName: string;
  items: string;
  startDate: string;
  endDate: string;
  value: number;
  signatureStatus: SignatureStatus;
  depositStatus: 'held' | 'applied' | 'refunded' | 'pending';
  depositAmount: number;
}

export const CONTRACTS: Contract[] = [
  {
    id: 'CTR-2026-001',
    reservationId: 'RES-2026-0109',
    customerName: 'Tom Hargrove (Coastal Builders)',
    items: 'CAT 320 Excavator, CAT 420 Backhoe Loader',
    startDate: '2026-02-24',
    endDate: '2026-03-07',
    value: 19200,
    signatureStatus: 'signed',
    depositStatus: 'held',
    depositAmount: 5000,
  },
  {
    id: 'CTR-2026-002',
    reservationId: 'RES-2026-0110',
    customerName: 'Brian Okafor (Gulf Coast Construction)',
    items: 'CAT D6 Dozer, BOMAG BW120AD Tandem Roller',
    startDate: '2026-02-25',
    endDate: '2026-03-04',
    value: 11600,
    signatureStatus: 'signed',
    depositStatus: 'held',
    depositAmount: 3500,
  },
  {
    id: 'CTR-2026-003',
    reservationId: 'RES-2026-0111',
    customerName: 'Brian Okafor (Gulf Coast Construction)',
    items: 'Komatsu PC210 Excavator, Genie Z-45 Articulating Boom',
    startDate: '2026-02-26',
    endDate: '2026-03-05',
    value: 10400,
    signatureStatus: 'signed',
    depositStatus: 'held',
    depositAmount: 3000,
  },
  {
    id: 'CTR-2026-004',
    reservationId: 'RES-2026-0112',
    customerName: 'Jake Williams',
    items: 'Case 580SN Backhoe, Wacker Neuson RT82 Trench Roller',
    startDate: '2026-02-27',
    endDate: '2026-03-06',
    value: 6400,
    signatureStatus: 'signed',
    depositStatus: 'held',
    depositAmount: 1500,
  },
  {
    id: 'CTR-2026-005',
    reservationId: 'RES-2026-0113',
    customerName: 'Angela Reeves',
    items: 'John Deere 310SL Backhoe',
    startDate: '2026-02-28',
    endDate: '2026-03-04',
    value: 2875,
    signatureStatus: 'signed',
    depositStatus: 'held',
    depositAmount: 750,
  },
  {
    id: 'CTR-2026-006',
    reservationId: 'RES-2026-0204',
    customerName: 'Tom Hargrove (Coastal Builders)',
    items: 'John Deere 333G Skid Steer, CAT 308 Mini Excavator',
    startDate: '2026-03-03',
    endDate: '2026-03-14',
    value: 12300,
    signatureStatus: 'signed',
    depositStatus: 'held',
    depositAmount: 3000,
  },
  {
    id: 'CTR-2026-007',
    reservationId: 'RES-2026-0205',
    customerName: 'Diane Whitfield (Premier Landscaping)',
    items: 'Kubota KX080 Mini Excavator',
    startDate: '2026-03-04',
    endDate: '2026-03-06',
    value: 1350,
    signatureStatus: 'pending',
    depositStatus: 'held',
    depositAmount: 500,
  },
  {
    id: 'CTR-2026-008',
    reservationId: 'RES-2026-0119',
    customerName: 'Kevin O\'Brien',
    items: 'Lincoln Electric Vantage 300 Welder',
    startDate: '2026-02-18',
    endDate: '2026-02-25',
    value: 770,
    signatureStatus: 'signed',
    depositStatus: 'held',
    depositAmount: 200,
  },
  {
    id: 'CTR-2026-009',
    reservationId: 'RES-2026-0120',
    customerName: 'Jake Williams',
    items: 'Honda EU7000iS Generator (7kW)',
    startDate: '2026-02-17',
    endDate: '2026-02-24',
    value: 525,
    signatureStatus: 'signed',
    depositStatus: 'held',
    depositAmount: 150,
  },
  {
    id: 'CTR-2026-010',
    reservationId: 'RES-2026-0208',
    customerName: 'Marcus Lin (Metro Mechanical)',
    items: 'MovinCool Classic Plus 26 Portable AC, Whiteman WM90 Mortar Mixer',
    startDate: '2026-03-03',
    endDate: '2026-03-10',
    value: 1540,
    signatureStatus: 'pending',
    depositStatus: 'pending',
    depositAmount: 500,
  },
];
