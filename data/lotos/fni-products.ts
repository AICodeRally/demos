export interface FniProduct {
  id: string;
  name: string;
  description: string;
  dealerCost: number;
  retailPrice: number;
  dealerGross: number;
  penetrationRate: number;
}

export const FNI_PRODUCTS: FniProduct[] = [
  { id: 'FNI-001', name: 'Extended Warranty', description: '5yr/100K powertrain coverage', dealerCost: 650, retailPrice: 2495, dealerGross: 1845, penetrationRate: 62 },
  { id: 'FNI-002', name: 'GAP Insurance', description: 'Covers loan-to-value gap in total loss', dealerCost: 180, retailPrice: 895, dealerGross: 715, penetrationRate: 48 },
  { id: 'FNI-003', name: 'Paint Protection', description: 'Ceramic coating + 5yr warranty', dealerCost: 120, retailPrice: 699, dealerGross: 579, penetrationRate: 35 },
  { id: 'FNI-004', name: 'Tire & Wheel', description: 'Road hazard protection 3yr', dealerCost: 95, retailPrice: 595, dealerGross: 500, penetrationRate: 28 },
  { id: 'FNI-005', name: 'Theft Deterrent', description: 'VIN etching + GPS recovery', dealerCost: 45, retailPrice: 399, dealerGross: 354, penetrationRate: 22 },
  { id: 'FNI-006', name: 'Maintenance Plan', description: '2yr/24K scheduled maintenance', dealerCost: 200, retailPrice: 995, dealerGross: 795, penetrationRate: 40 },
];
