/* ═══════════════════════════════════════════════════════════
   AI Predictive Maintenance — Mock Data
   ═══════════════════════════════════════════════════════════
   The rental industry's #1 pain point: the "silver tsunami."
   Veteran mechanics are retiring, replaced by techs with 3-5
   years of experience. AI predictive + prescriptive maintenance
   bridges the knowledge gap — predicting failures before they
   happen and telling newer techs exactly what to do.
   ═══════════════════════════════════════════════════════════ */

import type { AssetCategory } from './assets';

/* ── Types ─────────────────────────────────────────────────── */

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface MaintenancePrediction {
  assetId: string;
  assetName: string;
  category: AssetCategory;
  riskLevel: RiskLevel;
  component: string;
  predictedFailureDate: string;
  confidenceScore: number;
  estimatedDowntimeDays: number;
  estimatedCost: number;
  prescribedAction: string;
  technicianRecommended: string;
  currentHoursUsed: number;
  failureThresholdHours: number;
}

export interface MaintenanceSavings {
  preventedBreakdowns: number;
  downtimeSaved: number;
  costSaved: number;
  avgPredictionAccuracy: number;
  fleetUptime: number;
}

export interface MaintenanceTrendPoint {
  month: string;
  predicted: number;
  prevented: number;
  missed: number;
}

export interface ComponentFailureRate {
  component: string;
  failures: number;
  predicted: number;
  accuracy: number;
}

/* ── KPI Summary ───────────────────────────────────────────── */

export const MAINTENANCE_SAVINGS: MaintenanceSavings = {
  preventedBreakdowns: 14,
  downtimeSaved: 47,
  costSaved: 89400,
  avgPredictionAccuracy: 94.2,
  fleetUptime: 96.8,
};

/* ── Predictions (12) ──────────────────────────────────────── */

export const PREDICTIONS: MaintenancePrediction[] = [
  // ── Critical (2) ──────────────────────────────────────────
  {
    assetId: 'HVY-001',
    assetName: 'CAT 320 Excavator',
    category: 'heavy',
    riskLevel: 'critical',
    component: 'Hydraulic Pump Seal',
    predictedFailureDate: '2026-03-04',
    confidenceScore: 0.96,
    estimatedDowntimeDays: 5,
    estimatedCost: 8200,
    prescribedAction:
      'Replace main hydraulic pump seal assembly and flush hydraulic lines. Check for metal contamination in reservoir — early signs of pump wear detected in vibration data.',
    technicianRecommended: 'Dave Rodriguez',
    currentHoursUsed: 4820,
    failureThresholdHours: 5000,
  },
  {
    assetId: 'PWR-004',
    assetName: 'Generac MMG100 Generator',
    category: 'power',
    riskLevel: 'critical',
    component: 'Engine Oil Pressure Sensor',
    predictedFailureDate: '2026-03-02',
    confidenceScore: 0.93,
    estimatedDowntimeDays: 3,
    estimatedCost: 4500,
    prescribedAction:
      'Replace oil pressure sensor and validate wiring harness. Running at 87% of failure threshold — intermittent low-pressure readings logged 3x in last 48 hours.',
    technicianRecommended: 'Mike Chen',
    currentHoursUsed: 6100,
    failureThresholdHours: 6500,
  },

  // ── High (3) ──────────────────────────────────────────────
  {
    assetId: 'AER-001',
    assetName: 'JLG 600S Boom Lift',
    category: 'aerial',
    riskLevel: 'high',
    component: 'Boom Cylinder Rod Seal',
    predictedFailureDate: '2026-03-08',
    confidenceScore: 0.89,
    estimatedDowntimeDays: 4,
    estimatedCost: 6800,
    prescribedAction:
      'Reseal boom extend cylinder and replace rod wiper. Micro-leaks detected during last 3 inspections — progressive degradation pattern matches seal failure at 3,200 hours.',
    technicianRecommended: 'Dave Rodriguez',
    currentHoursUsed: 3050,
    failureThresholdHours: 3200,
  },
  {
    assetId: 'HVY-005',
    assetName: 'Komatsu PC210 Excavator',
    category: 'heavy',
    riskLevel: 'high',
    component: 'Track Tension Assembly',
    predictedFailureDate: '2026-03-11',
    confidenceScore: 0.87,
    estimatedDowntimeDays: 2,
    estimatedCost: 3200,
    prescribedAction:
      'Adjust track tension to spec and replace worn idler bearing. Left track showing 15% more sag than right — asymmetric wear indicates bearing failure within 200 hours.',
    technicianRecommended: 'James Walker',
    currentHoursUsed: 5400,
    failureThresholdHours: 5600,
  },
  {
    assetId: 'CMP-004',
    assetName: 'Wacker Neuson RT82 Trench Roller',
    category: 'compaction',
    riskLevel: 'high',
    component: 'Vibration Exciter Bearing',
    predictedFailureDate: '2026-03-09',
    confidenceScore: 0.85,
    estimatedDowntimeDays: 3,
    estimatedCost: 4100,
    prescribedAction:
      'Replace exciter bearing set and check drum balance. Vibration amplitude dropped 22% — bearing degradation confirmed by acoustic sensor data.',
    technicianRecommended: 'Carlos Diaz',
    currentHoursUsed: 2800,
    failureThresholdHours: 3000,
  },

  // ── Medium (4) ────────────────────────────────────────────
  {
    assetId: 'HVY-004',
    assetName: 'CAT D6 Dozer',
    category: 'heavy',
    riskLevel: 'medium',
    component: 'Final Drive Sprocket',
    predictedFailureDate: '2026-03-15',
    confidenceScore: 0.82,
    estimatedDowntimeDays: 3,
    estimatedCost: 5500,
    prescribedAction:
      'Inspect sprocket teeth for hooking and measure pitch diameter. Replace if wear exceeds 8mm. Schedule during next planned service window to minimize impact.',
    technicianRecommended: 'James Walker',
    currentHoursUsed: 3900,
    failureThresholdHours: 4200,
  },
  {
    assetId: 'AER-005',
    assetName: 'Genie Z-45 Articulating Boom',
    category: 'aerial',
    riskLevel: 'medium',
    component: 'Platform Level Sensor',
    predictedFailureDate: '2026-03-18',
    confidenceScore: 0.79,
    estimatedDowntimeDays: 1,
    estimatedCost: 1200,
    prescribedAction:
      'Recalibrate platform level sensor and clean connector contacts. Intermittent fault code P2-47 logged — sensor drift pattern suggests calibration loss, not hardware failure.',
    technicianRecommended: 'Sarah Kim',
    currentHoursUsed: 2100,
    failureThresholdHours: 2400,
  },
  {
    assetId: 'TLS-003',
    assetName: 'Lincoln Electric Ranger 250 Welder',
    category: 'tools',
    riskLevel: 'medium',
    component: 'Wire Feed Motor',
    predictedFailureDate: '2026-03-20',
    confidenceScore: 0.77,
    estimatedDowntimeDays: 2,
    estimatedCost: 950,
    prescribedAction:
      'Replace wire feed motor brushes and clean drive rolls. Feed speed variance exceeding 8% — motor brush wear pattern indicates 200 hours remaining before stall.',
    technicianRecommended: 'Carlos Diaz',
    currentHoursUsed: 1800,
    failureThresholdHours: 2000,
  },
  {
    assetId: 'PWR-002',
    assetName: 'Doosan P185 Air Compressor',
    category: 'power',
    riskLevel: 'medium',
    component: 'Air/Oil Separator Element',
    predictedFailureDate: '2026-03-22',
    confidenceScore: 0.75,
    estimatedDowntimeDays: 1,
    estimatedCost: 680,
    prescribedAction:
      'Replace separator element and check minimum pressure valve. Differential pressure rising — currently at 0.8 bar vs 0.5 bar nominal. Schedule with next filter change.',
    technicianRecommended: 'Mike Chen',
    currentHoursUsed: 4200,
    failureThresholdHours: 4500,
  },

  // ── Low (3) ───────────────────────────────────────────────
  {
    assetId: 'HVY-003',
    assetName: 'John Deere 333G Skid Steer',
    category: 'heavy',
    riskLevel: 'low',
    component: 'Auxiliary Hydraulic Coupler',
    predictedFailureDate: '2026-03-25',
    confidenceScore: 0.73,
    estimatedDowntimeDays: 1,
    estimatedCost: 420,
    prescribedAction:
      'Inspect flat-face coupler O-rings and replace if scored. Minor weeping noted at attachment connection — monitor for progression at next 50-hour check.',
    technicianRecommended: 'Dave Rodriguez',
    currentHoursUsed: 1600,
    failureThresholdHours: 1900,
  },
  {
    assetId: 'AER-002',
    assetName: 'Genie GS-2669 Scissor Lift',
    category: 'aerial',
    riskLevel: 'low',
    component: 'Battery Management System',
    predictedFailureDate: '2026-03-27',
    confidenceScore: 0.72,
    estimatedDowntimeDays: 1,
    estimatedCost: 350,
    prescribedAction:
      'Update BMS firmware and perform equalization charge. Cell voltage imbalance of 0.3V detected — firmware patch addresses known calibration drift in Gen 3 controllers.',
    technicianRecommended: 'Sarah Kim',
    currentHoursUsed: 1400,
    failureThresholdHours: 1800,
  },
  {
    assetId: 'TLS-005',
    assetName: 'Mi-T-M 4000 PSI Hot Water Pressure Washer',
    category: 'tools',
    riskLevel: 'low',
    component: 'Unloader Valve Spring',
    predictedFailureDate: '2026-03-28',
    confidenceScore: 0.74,
    estimatedDowntimeDays: 1,
    estimatedCost: 280,
    prescribedAction:
      'Replace unloader valve spring and check piston for scoring. Pressure cycling irregularity consistent with spring fatigue — low-cost preventive swap recommended.',
    technicianRecommended: 'Carlos Diaz',
    currentHoursUsed: 900,
    failureThresholdHours: 1100,
  },
];

/* ── 6-Month Trend (improving) ─────────────────────────────── */

export const MAINTENANCE_TREND: MaintenanceTrendPoint[] = [
  { month: 'Sep', predicted: 8, prevented: 5, missed: 3 },
  { month: 'Oct', predicted: 11, prevented: 8, missed: 2 },
  { month: 'Nov', predicted: 13, prevented: 11, missed: 2 },
  { month: 'Dec', predicted: 10, prevented: 9, missed: 1 },
  { month: 'Jan', predicted: 15, prevented: 13, missed: 1 },
  { month: 'Feb', predicted: 16, prevented: 14, missed: 0 },
];

/* ── Component Failure Rates (top 8) ──────────────────────── */

export const COMPONENT_FAILURE_RATES: ComponentFailureRate[] = [
  { component: 'Hydraulic Systems', failures: 23, predicted: 21, accuracy: 91.3 },
  { component: 'Engine/Powertrain', failures: 18, predicted: 17, accuracy: 94.4 },
  { component: 'Electrical', failures: 15, predicted: 14, accuracy: 93.3 },
  { component: 'Boom/Arm', failures: 12, predicted: 12, accuracy: 100.0 },
  { component: 'Tracks/Tires', failures: 11, predicted: 10, accuracy: 90.9 },
  { component: 'Filters/Fluids', failures: 9, predicted: 9, accuracy: 100.0 },
  { component: 'Safety Systems', failures: 7, predicted: 6, accuracy: 85.7 },
  { component: 'Structural', failures: 5, predicted: 5, accuracy: 100.0 },
];

/* ── Risk Level Styles ─────────────────────────────────────── */

export const RISK_COLORS: Record<RiskLevel, { bg: string; text: string; border: string; dot: string }> = {
  critical: { bg: 'rgba(220,38,38,0.10)', text: '#DC2626', border: '#DC2626', dot: '#DC2626' },
  high: { bg: 'rgba(234,88,12,0.10)', text: '#EA580C', border: '#EA580C', dot: '#EA580C' },
  medium: { bg: 'rgba(245,158,11,0.10)', text: '#D97706', border: '#D97706', dot: '#D97706' },
  low: { bg: 'rgba(34,197,94,0.10)', text: '#16A34A', border: '#16A34A', dot: '#16A34A' },
};
