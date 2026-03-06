export type InspectionResult = 'pass' | 'fail' | 'flag';

export interface ChecklistItem {
  name: string;
  result: InspectionResult;
  notes?: string;
}

export interface Inspection {
  id: string;
  assetId: string;
  assetName: string;
  date: string;
  inspector: string;
  overallResult: 'pass' | 'fail';
  items: ChecklistItem[];
  damageFound: boolean;
  damageSeverity?: 'minor' | 'moderate' | 'major';
  damageNotes?: string;
  photoCount: number;
}

export const INSPECTIONS: Inspection[] = [
  {
    id: 'INS-001',
    assetId: 'HVY-001',
    assetName: 'CAT 320 Excavator',
    date: '2026-02-18',
    inspector: 'Dave Richardson',
    overallResult: 'pass',
    items: [
      { name: 'Engine/Motor', result: 'pass' },
      { name: 'Hydraulics', result: 'pass' },
      { name: 'Tires/Tracks', result: 'pass' },
      { name: 'Body/Frame', result: 'pass' },
      { name: 'Safety Equipment', result: 'pass' },
    ],
    damageFound: false,
    photoCount: 4,
  },
  {
    id: 'INS-002',
    assetId: 'HVY-008',
    assetName: 'Volvo EC220E Excavator',
    date: '2026-02-10',
    inspector: 'Lisa Nakamura',
    overallResult: 'fail',
    items: [
      { name: 'Engine/Motor', result: 'pass' },
      { name: 'Hydraulics', result: 'fail', notes: 'Visible leak on main boom cylinder — fluid pooling on right side' },
      { name: 'Tires/Tracks', result: 'flag', notes: 'Left track tension slightly loose — adjust at next service' },
      { name: 'Body/Frame', result: 'pass' },
      { name: 'Safety Equipment', result: 'pass' },
    ],
    damageFound: true,
    damageSeverity: 'moderate',
    damageNotes: 'Hydraulic cylinder seal failure on main boom. Parts ordered — ETA 3/5. Out of service until repair complete.',
    photoCount: 8,
  },
  {
    id: 'INS-003',
    assetId: 'HVY-010',
    assetName: 'CAT 259D3 Track Loader',
    date: '2026-02-14',
    inspector: 'Carlos Vega',
    overallResult: 'fail',
    items: [
      { name: 'Engine/Motor', result: 'pass' },
      { name: 'Hydraulics', result: 'pass' },
      { name: 'Tires/Tracks', result: 'fail', notes: 'Right track delamination — steel showing through rubber in 3 sections' },
      { name: 'Body/Frame', result: 'flag', notes: 'Minor dent on ROPS — cosmetic only' },
      { name: 'Safety Equipment', result: 'pass' },
    ],
    damageFound: true,
    damageSeverity: 'major',
    damageNotes: 'Right track requires full replacement. Rubber delamination exposing steel cord. Unsafe for operation — locked out. CAT dealer quoting replacement. Rented to Hawkins with advisory note.',
    photoCount: 12,
  },
  {
    id: 'INS-004',
    assetId: 'AER-001',
    assetName: 'JLG 600S Boom Lift',
    date: '2026-02-19',
    inspector: 'Dave Richardson',
    overallResult: 'pass',
    items: [
      { name: 'Engine/Motor', result: 'pass' },
      { name: 'Hydraulics', result: 'pass' },
      { name: 'Tires/Tracks', result: 'pass' },
      { name: 'Body/Frame', result: 'pass' },
      { name: 'Safety Equipment', result: 'pass', notes: 'Harness anchors checked — all secure' },
    ],
    damageFound: false,
    photoCount: 5,
  },
  {
    id: 'INS-005',
    assetId: 'PWR-001',
    assetName: 'CAT XQ60 Generator (60kW)',
    date: '2026-02-18',
    inspector: 'Dave Richardson',
    overallResult: 'pass',
    items: [
      { name: 'Engine/Motor', result: 'pass', notes: 'Oil level good, 342 hours since last service' },
      { name: 'Hydraulics', result: 'pass' },
      { name: 'Tires/Tracks', result: 'pass' },
      { name: 'Body/Frame', result: 'pass' },
      { name: 'Safety Equipment', result: 'pass' },
    ],
    damageFound: false,
    photoCount: 3,
  },
  {
    id: 'INS-006',
    assetId: 'AER-007',
    assetName: 'JLG 450AJ Boom Lift',
    date: '2026-02-12',
    inspector: 'Lisa Nakamura',
    overallResult: 'pass',
    items: [
      { name: 'Engine/Motor', result: 'flag', notes: 'Minor oil seep around valve cover — monitor' },
      { name: 'Hydraulics', result: 'pass' },
      { name: 'Tires/Tracks', result: 'pass' },
      { name: 'Body/Frame', result: 'pass' },
      { name: 'Safety Equipment', result: 'pass' },
    ],
    damageFound: false,
    photoCount: 4,
  },
  {
    id: 'INS-007',
    assetId: 'TLS-003',
    assetName: 'Lincoln Electric Ranger 250 Welder',
    date: '2026-02-18',
    inspector: 'Dave Richardson',
    overallResult: 'pass',
    items: [
      { name: 'Engine/Motor', result: 'pass' },
      { name: 'Hydraulics', result: 'pass' },
      { name: 'Tires/Tracks', result: 'pass' },
      { name: 'Body/Frame', result: 'pass' },
      { name: 'Safety Equipment', result: 'pass', notes: 'Cables inspected — no fraying' },
    ],
    damageFound: false,
    photoCount: 3,
  },
  {
    id: 'INS-008',
    assetId: 'CMP-003',
    assetName: 'Multiquip MC94S Concrete Mixer',
    date: '2026-02-20',
    inspector: 'Lisa Nakamura',
    overallResult: 'pass',
    items: [
      { name: 'Engine/Motor', result: 'pass' },
      { name: 'Hydraulics', result: 'pass' },
      { name: 'Tires/Tracks', result: 'pass', notes: 'Tow hitch pin replaced' },
      { name: 'Body/Frame', result: 'flag', notes: 'Surface rust on drum rim — cosmetic, no structural concern' },
      { name: 'Safety Equipment', result: 'pass' },
    ],
    damageFound: false,
    photoCount: 5,
  },
];
