export type LenderType = 'bank' | 'credit-union' | 'captive' | 'subprime' | 'bhph';

export interface Lender {
  id: string;
  name: string;
  type: LenderType;
  minCreditScore: number;
  maxAdvance: number;
  avgBuyRate: number;
  avgDaysToFund: number;
  approvalRate: number;
}

export const LENDER_TYPE_COLORS: Record<LenderType, string> = {
  bank: '#2563EB',
  'credit-union': '#16A34A',
  captive: '#7C3AED',
  subprime: '#D97706',
  bhph: '#DC2626',
};

export const LENDERS: Lender[] = [
  { id: 'LND-001', name: 'Arizona Federal CU', type: 'credit-union', minCreditScore: 680, maxAdvance: 110, avgBuyRate: 5.9, avgDaysToFund: 3, approvalRate: 72 },
  { id: 'LND-002', name: 'Capital One Auto', type: 'bank', minCreditScore: 620, maxAdvance: 120, avgBuyRate: 7.2, avgDaysToFund: 5, approvalRate: 65 },
  { id: 'LND-003', name: 'Ally Financial', type: 'bank', minCreditScore: 640, maxAdvance: 115, avgBuyRate: 6.5, avgDaysToFund: 4, approvalRate: 68 },
  { id: 'LND-004', name: 'Chase Auto', type: 'bank', minCreditScore: 660, maxAdvance: 125, avgBuyRate: 6.1, avgDaysToFund: 4, approvalRate: 70 },
  { id: 'LND-005', name: 'OneMain Financial', type: 'subprime', minCreditScore: 500, maxAdvance: 90, avgBuyRate: 18.5, avgDaysToFund: 2, approvalRate: 82 },
  { id: 'LND-006', name: 'Westlake Financial', type: 'subprime', minCreditScore: 480, maxAdvance: 85, avgBuyRate: 21.0, avgDaysToFund: 2, approvalRate: 88 },
  { id: 'LND-007', name: 'Desert Schools FCU', type: 'credit-union', minCreditScore: 700, maxAdvance: 105, avgBuyRate: 5.2, avgDaysToFund: 3, approvalRate: 60 },
  { id: 'LND-008', name: 'In-House (BHPH)', type: 'bhph', minCreditScore: 0, maxAdvance: 100, avgBuyRate: 24.0, avgDaysToFund: 0, approvalRate: 95 },
];
