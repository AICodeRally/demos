export type DealStatus = 'pending' | 'submitted' | 'approved' | 'funded' | 'unwound';
export type DealType = 'retail' | 'bhph' | 'wholesale';

export interface Deal {
  id: string;
  vehicleId: string;
  customerId: string;
  type: DealType;
  status: DealStatus;
  salePrice: number;
  tradeAllowance: number;
  downPayment: number;
  frontGross: number;
  fniGross: number;
  totalGross: number;
  lender: string;
  daysToFund: number | null;
  closedDate: string;
  fundedDate: string | null;
}

export const DEAL_STATUS_COLORS: Record<DealStatus, string> = {
  pending: '#D97706',
  submitted: '#2563EB',
  approved: '#7C3AED',
  funded: '#16A34A',
  unwound: '#DC2626',
};

export const DEALS: Deal[] = [
  { id: 'DL-2026-001', vehicleId: 'STK-009', customerId: 'CUS-002', type: 'retail', status: 'funded', salePrice: 22495, tradeAllowance: 0, downPayment: 3000, frontGross: 3645, fniGross: 1850, totalGross: 5495, lender: 'Arizona Federal CU', daysToFund: 3, closedDate: '2026-03-24', fundedDate: '2026-03-27' },
  { id: 'DL-2026-002', vehicleId: 'STK-016', customerId: 'CUS-001', type: 'retail', status: 'funded', salePrice: 28495, tradeAllowance: 8500, downPayment: 2000, frontGross: 4345, fniGross: 2200, totalGross: 6545, lender: 'Capital One Auto', daysToFund: 5, closedDate: '2026-03-23', fundedDate: '2026-03-28' },
  { id: 'DL-2026-003', vehicleId: 'STK-020', customerId: 'CUS-008', type: 'retail', status: 'funded', salePrice: 25495, tradeAllowance: 12000, downPayment: 1500, frontGross: 4195, fniGross: 1600, totalGross: 5795, lender: 'Ally Financial', daysToFund: 4, closedDate: '2026-03-25', fundedDate: '2026-03-29' },
  { id: 'DL-2026-004', vehicleId: 'STK-004', customerId: 'CUS-005', type: 'retail', status: 'approved', salePrice: 34500, tradeAllowance: 0, downPayment: 34500, frontGross: 4300, fniGross: 0, totalGross: 4300, lender: 'Cash', daysToFund: null, closedDate: '2026-03-30', fundedDate: null },
  { id: 'DL-2026-005', vehicleId: 'STK-011', customerId: 'CUS-006', type: 'retail', status: 'submitted', salePrice: 21995, tradeAllowance: 6000, downPayment: 2500, frontGross: 3795, fniGross: 1400, totalGross: 5195, lender: 'Chase Auto', daysToFund: null, closedDate: '2026-03-31', fundedDate: null },
  { id: 'DL-2026-006', vehicleId: 'STK-017', customerId: 'CUS-007', type: 'bhph', status: 'funded', salePrice: 18995, tradeAllowance: 0, downPayment: 2000, frontGross: 2995, fniGross: 800, totalGross: 3795, lender: 'In-House (BHPH)', daysToFund: 0, closedDate: '2026-03-26', fundedDate: '2026-03-26' },
  { id: 'DL-2026-007', vehicleId: 'STK-018', customerId: 'CUS-010', type: 'retail', status: 'pending', salePrice: 29995, tradeAllowance: 0, downPayment: 4000, frontGross: 4645, fniGross: 0, totalGross: 4645, lender: 'TBD', daysToFund: null, closedDate: '2026-04-01', fundedDate: null },
];
