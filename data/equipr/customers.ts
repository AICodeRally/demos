export type CustomerType = 'business' | 'contractor' | 'consumer';

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  company?: string;
  phone: string;
  email: string;
  totalRentals: number;
  lifetimeValue: number;
  creditTerms?: string;
  riskFlag?: string;
}

export const CUSTOMERS: Customer[] = [
  // ── B2B Accounts (5) ─────────────────────────────────────────────────
  {
    id: 'CUST-001',
    name: 'Tom Hargrove',
    type: 'business',
    company: 'Coastal Builders Inc.',
    phone: '(407) 555-0311',
    email: 'tom@coastalbuilders.com',
    totalRentals: 47,
    lifetimeValue: 128400,
    creditTerms: 'Net 30',
  },
  {
    id: 'CUST-002',
    name: 'Rachel Torres',
    type: 'business',
    company: 'Suncoast Events LLC',
    phone: '(813) 555-0428',
    email: 'rachel@suncoastevents.com',
    totalRentals: 23,
    lifetimeValue: 41200,
    creditTerms: 'Net 15',
  },
  {
    id: 'CUST-003',
    name: 'Brian Okafor',
    type: 'business',
    company: 'Gulf Coast Construction',
    phone: '(904) 555-0537',
    email: 'bokafor@gulfcoastconstruction.com',
    totalRentals: 62,
    lifetimeValue: 215800,
    creditTerms: 'Net 30',
    riskFlag: 'Late payments (2x past 90 days)',
  },
  {
    id: 'CUST-004',
    name: 'Diane Whitfield',
    type: 'business',
    company: 'Premier Landscaping',
    phone: '(407) 555-0649',
    email: 'diane@premierlandscaping.net',
    totalRentals: 31,
    lifetimeValue: 54700,
    creditTerms: 'Net 15',
  },
  {
    id: 'CUST-005',
    name: 'Marcus Lin',
    type: 'business',
    company: 'Metro Mechanical Services',
    phone: '(813) 555-0752',
    email: 'mlin@metromechanical.com',
    totalRentals: 19,
    lifetimeValue: 36900,
    creditTerms: 'Net 30',
  },

  // ── Repeat Contractors (5) ───────────────────────────────────────────
  {
    id: 'CUST-006',
    name: 'Jake Williams',
    type: 'contractor',
    phone: '(407) 555-0863',
    email: 'jake.williams@outlook.com',
    totalRentals: 28,
    lifetimeValue: 42300,
    riskFlag: 'Frequent below-floor pricing',
  },
  {
    id: 'CUST-007',
    name: 'Angela Reeves',
    type: 'contractor',
    phone: '(904) 555-0974',
    email: 'angela.reeves@gmail.com',
    totalRentals: 15,
    lifetimeValue: 18700,
  },
  {
    id: 'CUST-008',
    name: 'Chris Delgado',
    type: 'contractor',
    phone: '(813) 555-1085',
    email: 'cdelgado.builds@gmail.com',
    totalRentals: 22,
    lifetimeValue: 31400,
  },
  {
    id: 'CUST-009',
    name: 'Patricia Ng',
    type: 'contractor',
    phone: '(407) 555-1196',
    email: 'pat.ng.contractor@yahoo.com',
    totalRentals: 9,
    lifetimeValue: 12800,
  },
  {
    id: 'CUST-010',
    name: 'Derek Hawkins',
    type: 'contractor',
    phone: '(904) 555-1207',
    email: 'dhawkins@hawkinselectric.com',
    totalRentals: 34,
    lifetimeValue: 58200,
    creditTerms: 'COD',
  },

  // ── Walk-in Consumers (5) ────────────────────────────────────────────
  {
    id: 'CUST-011',
    name: 'Steve Paulson',
    type: 'consumer',
    phone: '(407) 555-1318',
    email: 'spaulson@me.com',
    totalRentals: 3,
    lifetimeValue: 1250,
  },
  {
    id: 'CUST-012',
    name: 'Maria Gonzalez',
    type: 'consumer',
    phone: '(813) 555-1429',
    email: 'maria.g.fl@gmail.com',
    totalRentals: 2,
    lifetimeValue: 780,
  },
  {
    id: 'CUST-013',
    name: 'Kevin O\'Brien',
    type: 'consumer',
    phone: '(904) 555-1530',
    email: 'kob.jax@outlook.com',
    totalRentals: 1,
    lifetimeValue: 425,
  },
  {
    id: 'CUST-014',
    name: 'Linda Tran',
    type: 'consumer',
    phone: '(407) 555-1641',
    email: 'linda.tran.orl@gmail.com',
    totalRentals: 4,
    lifetimeValue: 1890,
  },
  {
    id: 'CUST-015',
    name: 'Robert Fischer',
    type: 'consumer',
    phone: '(813) 555-1752',
    email: 'rfischer22@yahoo.com',
    totalRentals: 2,
    lifetimeValue: 670,
  },
];
