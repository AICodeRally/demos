/**
 * Role type definition for commission system access levels
 */
export type Role = 'admin' | 'manager' | 'sales-rep';

/**
 * Represents a single sale transaction
 */
export interface Sale {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  commission: number;
  timestamp: Date;
}

/**
 * Summary of commissions for a single day
 */
export interface DailyCommissionSummary {
  totalCommission: number;
  saleCount: number;
  averageCommissionPerSale: number;
  sales: Sale[];
}

/**
 * Quick analytics data for display on dashboard
 */
export interface QuickAnalyticsData {
  totalCommissionsToday: number;
  rankInTeam: number;
  teamSize: number;
  dailyTargetAmount: number;
  targetProgress: number;
}

/**
 * Product definition for commission calculations
 */
export interface DemoProduct {
  id: string;
  name: string;
  category: string;
  baseCommissionPercent: number;
  bonusThreshold?: number;
}
