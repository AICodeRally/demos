/* ── Per-Format Mock Data for REGISTER Demo ─────────────── */

export const FORMAT_META = {
  flagship: { name: 'Flagship', stores: 25, avgRevenue: '$4.2M', staff: 15, asp: '$2,800', compModel: 'Tiered + Accelerators', sqft: 10000 },
  standard: { name: 'Standard', stores: 100, avgRevenue: '$2.1M', staff: 8, asp: '$1,900', compModel: 'Tiered Commission', sqft: 5000 },
  outlet: { name: 'Outlet', stores: 50, avgRevenue: '$980K', staff: 5, asp: '$1,200', compModel: 'Flat + Volume Bonus', sqft: 3000 },
  'shop-in-shop': { name: 'Shop-in-Shop', stores: 25, avgRevenue: '$380K', staff: 2, asp: '$1,600', compModel: 'Base + SPIFF', sqft: 800 },
} as const;

export type FormatId = keyof typeof FORMAT_META;

/* ── Revenue by District ────────────────────────────────── */

export const DISTRICT_REVENUE: Record<FormatId, { label: string; value: number }[]> = {
  flagship: [
    { label: 'Northeast', value: 18.2 }, { label: 'Southeast', value: 14.8 }, { label: 'Midwest', value: 12.4 },
    { label: 'Southwest', value: 11.6 }, { label: 'Pacific NW', value: 10.2 }, { label: 'Mountain', value: 8.8 },
    { label: 'Mid-Atlantic', value: 16.4 }, { label: 'Great Lakes', value: 12.6 },
  ],
  standard: [
    { label: 'Northeast', value: 42.0 }, { label: 'Southeast', value: 38.5 }, { label: 'Midwest', value: 32.1 },
    { label: 'Southwest', value: 28.4 }, { label: 'Pacific NW', value: 22.8 }, { label: 'Mountain', value: 18.2 },
    { label: 'Mid-Atlantic', value: 36.0 }, { label: 'Great Lakes', value: 28.0 },
  ],
  outlet: [
    { label: 'Northeast', value: 12.5 }, { label: 'Southeast', value: 10.8 }, { label: 'Midwest', value: 8.2 },
    { label: 'Southwest', value: 7.6 }, { label: 'Pacific NW', value: 5.4 }, { label: 'Mountain', value: 4.2 },
    { label: 'Mid-Atlantic', value: 9.8 }, { label: 'Great Lakes', value: 7.5 },
  ],
  'shop-in-shop': [
    { label: 'Northeast', value: 3.2 }, { label: 'Southeast', value: 2.8 }, { label: 'Midwest', value: 1.9 },
    { label: 'Southwest', value: 1.5 }, { label: 'Pacific NW', value: 1.2 }, { label: 'Mountain', value: 0.8 },
    { label: 'Mid-Atlantic', value: 2.4 }, { label: 'Great Lakes', value: 1.7 },
  ],
};

/* ── Product Mix by Format ──────────────────────────────── */

export const PRODUCT_MIX: Record<FormatId, { label: string; value: number; color: string }[]> = {
  flagship: [
    { label: 'Premium Mattresses', value: 52, color: '#1E3A5F' },
    { label: 'Adjustable Bases', value: 24, color: '#06B6D4' },
    { label: 'Sleep Tech', value: 12, color: '#8B5CF6' },
    { label: 'Bedding', value: 12, color: '#10B981' },
  ],
  standard: [
    { label: 'Mattresses', value: 62, color: '#1E3A5F' },
    { label: 'Adjustable Bases', value: 18, color: '#06B6D4' },
    { label: 'Sleep Tech', value: 5, color: '#8B5CF6' },
    { label: 'Bedding', value: 15, color: '#10B981' },
  ],
  outlet: [
    { label: 'Clearance Mattresses', value: 72, color: '#1E3A5F' },
    { label: 'Overstock Bases', value: 12, color: '#06B6D4' },
    { label: 'Sleep Tech', value: 2, color: '#8B5CF6' },
    { label: 'Bedding Deals', value: 14, color: '#10B981' },
  ],
  'shop-in-shop': [
    { label: 'Featured Mattresses', value: 65, color: '#1E3A5F' },
    { label: 'Adjustable Bases', value: 20, color: '#06B6D4' },
    { label: 'Sleep Tech', value: 3, color: '#8B5CF6' },
    { label: 'Bedding', value: 12, color: '#10B981' },
  ],
};

/* ── Workforce by Format ────────────────────────────────── */

export const WORKFORCE: Record<FormatId, { totalAssociates: number; revenuePerAssociate: string; avgTenure: string; turnover: string }> = {
  flagship: { totalAssociates: 375, revenuePerAssociate: '$1.12M', avgTenure: '3.1yr', turnover: '22%' },
  standard: { totalAssociates: 800, revenuePerAssociate: '$875K', avgTenure: '2.3yr', turnover: '34%' },
  outlet: { totalAssociates: 250, revenuePerAssociate: '$640K', avgTenure: '1.8yr', turnover: '45%' },
  'shop-in-shop': { totalAssociates: 50, revenuePerAssociate: '$380K', avgTenure: '1.5yr', turnover: '52%' },
};

/* ── Comp Structure by Format ───────────────────────────── */

export const COMP_PLANS: Record<FormatId, { base: string; commission: string; extras: string; ote: string }> = {
  flagship: { base: '$18/hr', commission: '3-6% tiered', extras: 'Accelerators above quota', ote: '$72K' },
  standard: { base: '$15/hr', commission: '2.5-5% tiered', extras: 'Standard SPIFFs', ote: '$52K' },
  outlet: { base: '$14/hr', commission: '1.5% flat', extras: '$200/wk volume bonus (>15 units)', ote: '$42K' },
  'shop-in-shop': { base: '$16/hr', commission: 'None', extras: '$25/mattress SPIFF only', ote: '$38K' },
};

/* ── 12-Month Revenue Trend by Format ───────────────────── */

export const MONTHLY_REVENUE: Record<FormatId, { label: string; value: number }[]> = {
  flagship: [
    { label: 'Mar', value: 7.8 }, { label: 'Apr', value: 8.2 }, { label: 'May', value: 9.6 },
    { label: 'Jun', value: 8.8 }, { label: 'Jul', value: 9.1 }, { label: 'Aug', value: 8.5 },
    { label: 'Sep', value: 10.2 }, { label: 'Oct', value: 8.9 }, { label: 'Nov', value: 11.8 },
    { label: 'Dec', value: 10.4 }, { label: 'Jan', value: 7.2 }, { label: 'Feb', value: 8.5 },
  ],
  standard: [
    { label: 'Mar', value: 16.2 }, { label: 'Apr', value: 17.4 }, { label: 'May', value: 21.8 },
    { label: 'Jun', value: 18.6 }, { label: 'Jul', value: 19.2 }, { label: 'Aug', value: 17.8 },
    { label: 'Sep', value: 22.4 }, { label: 'Oct', value: 18.9 }, { label: 'Nov', value: 26.2 },
    { label: 'Dec', value: 22.8 }, { label: 'Jan', value: 14.6 }, { label: 'Feb', value: 17.1 },
  ],
  outlet: [
    { label: 'Mar', value: 3.8 }, { label: 'Apr', value: 4.1 }, { label: 'May', value: 5.2 },
    { label: 'Jun', value: 4.4 }, { label: 'Jul', value: 4.6 }, { label: 'Aug', value: 4.2 },
    { label: 'Sep', value: 5.8 }, { label: 'Oct', value: 4.5 }, { label: 'Nov', value: 7.1 },
    { label: 'Dec', value: 5.8 }, { label: 'Jan', value: 3.2 }, { label: 'Feb', value: 3.8 },
  ],
  'shop-in-shop': [
    { label: 'Mar', value: 1.4 }, { label: 'Apr', value: 1.5 }, { label: 'May', value: 1.8 },
    { label: 'Jun', value: 1.6 }, { label: 'Jul', value: 1.7 }, { label: 'Aug', value: 1.5 },
    { label: 'Sep', value: 2.0 }, { label: 'Oct', value: 1.6 }, { label: 'Nov', value: 2.4 },
    { label: 'Dec', value: 2.1 }, { label: 'Jan', value: 1.2 }, { label: 'Feb', value: 1.4 },
  ],
};
