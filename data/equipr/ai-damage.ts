/* ================================================================
   AI Damage Detection — Static Demo Data
   ================================================================ */

export type DamageStatus = 'pending_review' | 'confirmed' | 'disputed' | 'charged';
export type DamageSeverity = 'minor' | 'moderate' | 'major';

export interface AiDetection {
  area: string;
  damageType: string;
  confidence: number;
  estimatedRepairCost: number;
  severity: DamageSeverity;
}

export interface DamageDetection {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  checkoutDate: string;
  returnDate: string;
  customerName: string;
  aiDetections: AiDetection[];
  totalDamageValue: number;
  status: DamageStatus;
  humanReviewTime: string;
  photoCount: number;
}

export interface DamageKpis {
  photosAnalyzed: number;
  damageDetected: number;
  revenueRecovered: number;
  avgDetectionTime: number;
  falsePositiveRate: number;
  humanTimeSaved: number;
}

/* ── KPIs ──────────────────────────────────────────────── */

export const DAMAGE_KPIS: DamageKpis = {
  photosAnalyzed: 12847,
  damageDetected: 34,
  revenueRecovered: 47200,
  avgDetectionTime: 8,
  falsePositiveRate: 3.2,
  humanTimeSaved: 156,
};

/* ── Detection Records ─────────────────────────────────── */

export const DAMAGE_DETECTIONS: DamageDetection[] = [
  {
    id: 'DMG-001',
    assetId: 'HVY-008',
    assetName: 'Volvo EC220E Excavator',
    category: 'Heavy Equipment',
    checkoutDate: '2026-01-28',
    returnDate: '2026-02-14',
    customerName: 'Coastal Builders Inc.',
    aiDetections: [
      {
        area: 'Right boom cylinder',
        damageType: 'Hydraulic fluid staining',
        confidence: 0.97,
        estimatedRepairCost: 2800,
        severity: 'major',
      },
      {
        area: 'Front bucket teeth',
        damageType: 'Excessive wear / chipping',
        confidence: 0.91,
        estimatedRepairCost: 1200,
        severity: 'moderate',
      },
      {
        area: 'Left track guard',
        damageType: 'Impact dent',
        confidence: 0.88,
        estimatedRepairCost: 650,
        severity: 'minor',
      },
    ],
    totalDamageValue: 4650,
    status: 'confirmed',
    humanReviewTime: '2 min',
    photoCount: 24,
  },
  {
    id: 'DMG-002',
    assetId: 'AER-003',
    assetName: 'Genie S-65 Boom Lift',
    category: 'Aerial / Lifts',
    checkoutDate: '2026-02-01',
    returnDate: '2026-02-18',
    customerName: 'Suncoast Events LLC',
    aiDetections: [
      {
        area: 'Platform railing',
        damageType: 'Bent railing section',
        confidence: 0.94,
        estimatedRepairCost: 1800,
        severity: 'major',
      },
      {
        area: 'Rear fender',
        damageType: 'Scrape / paint loss',
        confidence: 0.86,
        estimatedRepairCost: 450,
        severity: 'minor',
      },
    ],
    totalDamageValue: 2250,
    status: 'charged',
    humanReviewTime: '1 min',
    photoCount: 16,
  },
  {
    id: 'DMG-003',
    assetId: 'HVY-005',
    assetName: 'John Deere 310SL Backhoe',
    category: 'Heavy Equipment',
    checkoutDate: '2026-02-03',
    returnDate: '2026-02-19',
    customerName: 'Metro Paving Co.',
    aiDetections: [
      {
        area: 'Windshield',
        damageType: 'Crack (spider pattern)',
        confidence: 0.99,
        estimatedRepairCost: 1400,
        severity: 'major',
      },
    ],
    totalDamageValue: 1400,
    status: 'confirmed',
    humanReviewTime: '1 min',
    photoCount: 12,
  },
  {
    id: 'DMG-004',
    assetId: 'CMP-002',
    assetName: 'Wacker Neuson DPU6555 Plate Compactor',
    category: 'Compaction & Concrete',
    checkoutDate: '2026-02-10',
    returnDate: '2026-02-17',
    customerName: 'Hawkins Landscaping',
    aiDetections: [
      {
        area: 'Handle assembly',
        damageType: 'Bent handle bar',
        confidence: 0.82,
        estimatedRepairCost: 320,
        severity: 'minor',
      },
      {
        area: 'Base plate edge',
        damageType: 'Chipping / gouges',
        confidence: 0.78,
        estimatedRepairCost: 180,
        severity: 'minor',
      },
    ],
    totalDamageValue: 500,
    status: 'pending_review',
    humanReviewTime: '3 min',
    photoCount: 8,
  },
  {
    id: 'DMG-005',
    assetId: 'HVY-003',
    assetName: 'Komatsu PC210 Excavator',
    category: 'Heavy Equipment',
    checkoutDate: '2026-01-15',
    returnDate: '2026-02-12',
    customerName: 'GreenField Development',
    aiDetections: [
      {
        area: 'Cab door',
        damageType: 'Dent / impact damage',
        confidence: 0.93,
        estimatedRepairCost: 900,
        severity: 'moderate',
      },
      {
        area: 'Right track',
        damageType: 'Track pad damage',
        confidence: 0.89,
        estimatedRepairCost: 2200,
        severity: 'major',
      },
      {
        area: 'Mirror housing',
        damageType: 'Cracked housing',
        confidence: 0.95,
        estimatedRepairCost: 280,
        severity: 'minor',
      },
    ],
    totalDamageValue: 3380,
    status: 'charged',
    humanReviewTime: '2 min',
    photoCount: 20,
  },
  {
    id: 'DMG-006',
    assetId: 'PWR-003',
    assetName: 'Generac MMG45 Generator (45kW)',
    category: 'Power & HVAC',
    checkoutDate: '2026-02-05',
    returnDate: '2026-02-20',
    customerName: 'Orlando Convention Services',
    aiDetections: [
      {
        area: 'Control panel',
        damageType: 'Cracked display cover',
        confidence: 0.91,
        estimatedRepairCost: 750,
        severity: 'moderate',
      },
    ],
    totalDamageValue: 750,
    status: 'disputed',
    humanReviewTime: '4 min',
    photoCount: 10,
  },
  {
    id: 'DMG-007',
    assetId: 'AER-005',
    assetName: 'JLG 1932R Scissor Lift',
    category: 'Aerial / Lifts',
    checkoutDate: '2026-02-08',
    returnDate: '2026-02-21',
    customerName: 'Precision Electric LLC',
    aiDetections: [
      {
        area: 'Platform floor',
        damageType: 'Deep scratches / gouges',
        confidence: 0.84,
        estimatedRepairCost: 350,
        severity: 'minor',
      },
      {
        area: 'Left wheel fender',
        damageType: 'Scrape marks',
        confidence: 0.76,
        estimatedRepairCost: 200,
        severity: 'minor',
      },
    ],
    totalDamageValue: 550,
    status: 'pending_review',
    humanReviewTime: '2 min',
    photoCount: 14,
  },
  {
    id: 'DMG-008',
    assetId: 'TLS-005',
    assetName: 'Hilti TE 70-ATC Rotary Hammer',
    category: 'Tools & Small',
    checkoutDate: '2026-02-12',
    returnDate: '2026-02-19',
    customerName: 'Tampa Bay Interiors',
    aiDetections: [
      {
        area: 'Housing',
        damageType: 'Crack in body casing',
        confidence: 0.88,
        estimatedRepairCost: 420,
        severity: 'moderate',
      },
    ],
    totalDamageValue: 420,
    status: 'confirmed',
    humanReviewTime: '1 min',
    photoCount: 6,
  },
];

/* ── Damage by Type ────────────────────────────────────── */

export const DAMAGE_BY_TYPE = [
  { type: 'Scratches/Scuffs', count: 11, totalCost: 4200 },
  { type: 'Dents/Impact', count: 8, totalCost: 7800 },
  { type: 'Hydraulic Leak Stains', count: 5, totalCost: 12400 },
  { type: 'Cracked Glass/Lights', count: 4, totalCost: 6100 },
  { type: 'Tire/Track Damage', count: 4, totalCost: 9600 },
  { type: 'Paint/Coating Loss', count: 2, totalCost: 1800 },
];

/* ── Recovery Trend (6 months) ─────────────────────────── */

export const RECOVERY_TREND = [
  { month: 'Sep', detected: 18200, recovered: 11400, missed: 6800 },
  { month: 'Oct', detected: 22600, recovered: 16100, missed: 6500 },
  { month: 'Nov', detected: 28400, recovered: 22800, missed: 5600 },
  { month: 'Dec', detected: 31200, recovered: 26500, missed: 4700 },
  { month: 'Jan', detected: 38900, recovered: 35100, missed: 3800 },
  { month: 'Feb', detected: 47200, recovered: 44300, missed: 2900 },
];

/* ── Damage by Equipment Category ──────────────────────── */

export const DAMAGE_BY_CATEGORY = [
  { category: 'Heavy Equipment', incidents: 14, totalCost: 24800 },
  { category: 'Aerial / Lifts', incidents: 8, totalCost: 9400 },
  { category: 'Compaction & Concrete', incidents: 5, totalCost: 4200 },
  { category: 'Power & HVAC', incidents: 4, totalCost: 3600 },
  { category: 'Tools & Small', incidents: 3, totalCost: 1900 },
];
