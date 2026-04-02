export type CreditTier = 'prime' | 'near-prime' | 'subprime' | 'deep-subprime';
export type LeadSource = 'website' | 'walk-in' | 'phone' | 'referral' | 'facebook' | 'cargurus';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  creditTier: CreditTier;
  leadSource: LeadSource;
  createdDate: string;
  notes: string;
}

export const TIER_COLORS: Record<CreditTier, string> = {
  prime: '#16A34A',
  'near-prime': '#2563EB',
  subprime: '#D97706',
  'deep-subprime': '#DC2626',
};

export const TIER_LABELS: Record<CreditTier, string> = {
  prime: 'Prime (720+)',
  'near-prime': 'Near-Prime (660-719)',
  subprime: 'Subprime (580-659)',
  'deep-subprime': 'Deep Sub (< 580)',
};

export const CUSTOMERS: Customer[] = [
  { id: 'CUS-001', firstName: 'Marcus', lastName: 'Rivera', phone: '(602) 555-0142', email: 'marcus.r@email.com', creditTier: 'prime', leadSource: 'website', createdDate: '2026-03-10', notes: 'Looking for midsize SUV, pre-approved at credit union' },
  { id: 'CUS-002', firstName: 'Sarah', lastName: 'Chen', phone: '(480) 555-0198', email: 'sarah.chen@email.com', creditTier: 'prime', leadSource: 'referral', createdDate: '2026-03-12', notes: 'Referred by Marcus Rivera, wants sedan under $30K' },
  { id: 'CUS-003', firstName: 'James', lastName: 'Wilson', phone: '(623) 555-0167', email: 'jwilson@email.com', creditTier: 'near-prime', leadSource: 'walk-in', createdDate: '2026-03-15', notes: 'Trade-in 2019 Civic, needs truck for new job' },
  { id: 'CUS-004', firstName: 'Maria', lastName: 'Gonzalez', phone: '(520) 555-0134', email: 'mgonzalez@email.com', creditTier: 'subprime', leadSource: 'facebook', createdDate: '2026-03-18', notes: 'First-time buyer, flexible on vehicle, needs reliable transportation' },
  { id: 'CUS-005', firstName: 'David', lastName: 'Thompson', phone: '(602) 555-0189', email: 'dthompson@email.com', creditTier: 'prime', leadSource: 'cargurus', createdDate: '2026-03-20', notes: 'Interested in STK-013 Corvette, cash buyer' },
  { id: 'CUS-006', firstName: 'Ashley', lastName: 'Brown', phone: '(480) 555-0156', email: 'abrown@email.com', creditTier: 'near-prime', leadSource: 'website', createdDate: '2026-03-22', notes: 'Needs family vehicle, 3 kids, budget $25-30K' },
  { id: 'CUS-007', firstName: 'Robert', lastName: 'Martinez', phone: '(623) 555-0143', email: 'rmartinez@email.com', creditTier: 'deep-subprime', leadSource: 'walk-in', createdDate: '2026-03-25', notes: 'BHPH candidate, needs work vehicle, $2K down available' },
  { id: 'CUS-008', firstName: 'Jennifer', lastName: 'Lee', phone: '(602) 555-0171', email: 'jlee@email.com', creditTier: 'prime', leadSource: 'referral', createdDate: '2026-03-26', notes: 'Upgrading from sedan to SUV, pre-approved $35K' },
  { id: 'CUS-009', firstName: 'Tyler', lastName: 'Jackson', phone: '(480) 555-0112', email: 'tjackson@email.com', creditTier: 'subprime', leadSource: 'phone', createdDate: '2026-03-27', notes: 'Recent bankruptcy discharge, needs co-signer or BHPH' },
  { id: 'CUS-010', firstName: 'Nicole', lastName: 'Anderson', phone: '(520) 555-0188', email: 'nanderson@email.com', creditTier: 'near-prime', leadSource: 'cargurus', createdDate: '2026-03-28', notes: 'Saw Mazda CX-5 listing, wants to test drive Saturday' },
];
