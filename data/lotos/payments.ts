export type PaymentStatus = 'paid' | 'late' | 'default' | 'upcoming';

export interface Payment {
  id: string;
  dealId: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: PaymentStatus;
}

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  paid: '#16A34A',
  late: '#D97706',
  default: '#DC2626',
  upcoming: '#6B7280',
};

export const PAYMENTS: Payment[] = [
  { id: 'PMT-001', dealId: 'DL-2026-006', amount: 425, dueDate: '2026-04-01', paidDate: null, status: 'upcoming' },
  { id: 'PMT-002', dealId: 'DL-2026-006', amount: 425, dueDate: '2026-04-15', paidDate: null, status: 'upcoming' },
  { id: 'PMT-003', dealId: 'DL-2026-006', amount: 425, dueDate: '2026-03-15', paidDate: '2026-03-15', status: 'paid' },
  { id: 'PMT-004', dealId: 'DL-2026-006', amount: 425, dueDate: '2026-03-01', paidDate: '2026-03-03', status: 'late' },
];
