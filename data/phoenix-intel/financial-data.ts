// Financial data: revenue, P&L, cash position, trends

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export const MONTHLY_FINANCIALS: MonthlyRevenue[] = [
  { month: 'Jul 2025', revenue: 58000, expenses: 42000, profit: 16000 },
  { month: 'Aug 2025', revenue: 52000, expenses: 40000, profit: 12000 },
  { month: 'Sep 2025', revenue: 72000, expenses: 48000, profit: 24000 },
  { month: 'Oct 2025', revenue: 78000, expenses: 52000, profit: 26000 },
  { month: 'Nov 2025', revenue: 65000, expenses: 45000, profit: 20000 },
  { month: 'Dec 2025', revenue: 48000, expenses: 38000, profit: 10000 },
  { month: 'Jan 2026', revenue: 82000, expenses: 55000, profit: 27000 },
  { month: 'Feb 2026', revenue: 88000, expenses: 58000, profit: 30000 },
  { month: 'Mar 2026', revenue: 76000, expenses: 50000, profit: 26000 },
];

export const ANNUAL_SUMMARY = {
  totalRevenue: 840000,
  totalExpenses: 612000,
  netProfit: 228000,
  profitMargin: 27.1,
  cashPosition: 185000,
  accountsReceivable: 124000,
  accountsPayable: 38000,
  revenueGrowth: 18.5,
};

export interface ServiceLineRevenue {
  serviceLine: string;
  revenue: number;
  engagements: number;
  margin: number;
}

export const SERVICE_LINE_REVENUE: ServiceLineRevenue[] = [
  { serviceLine: 'Capital Campaign Consulting', revenue: 285000, engagements: 4, margin: 32 },
  { serviceLine: 'Fundraising Assessment', revenue: 120000, engagements: 8, margin: 42 },
  { serviceLine: 'Board Development', revenue: 98000, engagements: 6, margin: 38 },
  { serviceLine: 'Major Gifts Strategy', revenue: 142000, engagements: 5, margin: 28 },
  { serviceLine: 'Training & Workshops', revenue: 85000, engagements: 12, margin: 45 },
  { serviceLine: 'Interim Staffing', revenue: 72000, engagements: 2, margin: 22 },
  { serviceLine: 'Grant Writing', revenue: 38000, engagements: 7, margin: 35 },
];

export interface ClientRevenue {
  clientName: string;
  revenue: number;
  state: string;
}

export const CLIENT_REVENUE: ClientRevenue[] = [
  { clientName: 'Mountain View Academy', revenue: 186000, state: 'CO' },
  { clientName: 'Riverside Health Alliance', revenue: 158000, state: 'CA' },
  { clientName: 'Hope Springs Foundation', revenue: 125000, state: 'TX' },
  { clientName: 'Heritage Arts Collective', revenue: 92000, state: 'NY' },
  { clientName: 'Faith & Light Ministries', revenue: 78000, state: 'TN' },
  { clientName: 'SafeHaven Social Services', revenue: 45000, state: 'IL' },
  { clientName: 'Other Clients', revenue: 156000, state: 'Various' },
];

export interface StateRevenue {
  state: string;
  revenue: number;
  clients: number;
}

export const STATE_REVENUE: StateRevenue[] = [
  { state: 'CO', revenue: 186000, clients: 1 },
  { state: 'CA', revenue: 158000, clients: 1 },
  { state: 'TX', revenue: 145000, clients: 2 },
  { state: 'NY', revenue: 112000, clients: 2 },
  { state: 'TN', revenue: 78000, clients: 1 },
  { state: 'IL', revenue: 65000, clients: 2 },
  { state: 'Other', revenue: 96000, clients: 4 },
];

export const PNL_CATEGORIES = {
  revenue: [
    { category: 'Consulting Fees', amount: 680000 },
    { category: 'Training Revenue', amount: 85000 },
    { category: 'Assessment Fees', amount: 45000 },
    { category: 'Retainer Income', amount: 30000 },
  ],
  expenses: [
    { category: 'Consultant Compensation', amount: 385000 },
    { category: 'Benefits & Insurance', amount: 72000 },
    { category: 'Travel & Lodging', amount: 48000 },
    { category: 'Technology & Software', amount: 32000 },
    { category: 'Office & Admin', amount: 28000 },
    { category: 'Marketing & BD', amount: 22000 },
    { category: 'Professional Development', amount: 15000 },
    { category: 'Insurance & Legal', amount: 10000 },
  ],
};

export interface BudgetVariance {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
}

export const BUDGET_VARIANCE: BudgetVariance[] = [
  { category: 'Revenue', budgeted: 900000, actual: 840000, variance: -60000 },
  { category: 'Compensation', budgeted: 400000, actual: 385000, variance: 15000 },
  { category: 'Travel', budgeted: 55000, actual: 48000, variance: 7000 },
  { category: 'Technology', budgeted: 30000, actual: 32000, variance: -2000 },
  { category: 'Marketing', budgeted: 25000, actual: 22000, variance: 3000 },
  { category: 'Net Profit', budgeted: 260000, actual: 228000, variance: -32000 },
];
