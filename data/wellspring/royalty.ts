export type OwnerType = 'royalty' | 'overriding-royalty' | 'working-interest' | 'mineral';

export interface RoyaltyOwner {
  id: string;
  name: string;
  ownerType: OwnerType;
  decimalInterest: number;
  leaseId: string;
  leaseName: string;
  monthlyOilRevenue: number;
  monthlyGasRevenue: number;
  monthlyNglRevenue: number;
  totalMonthlyPayment: number;
  severanceTaxWithheld: number;
  ytdPayments: number;
  filingStatus: 'current' | 'pending' | 'delinquent';
  lastPaymentDate: string;
  address: string;
}

export interface SeveranceTax {
  category: string;
  rate: number;
  grossValue: number;
  taxAmount: number;
  filingPeriod: string;
  status: 'filed' | 'pending' | 'due';
}

export interface RevenueAllocation {
  stream: 'oil' | 'gas' | 'ngl';
  grossRevenue: number;
  royaltyBurden: number;
  netToOperator: number;
  avgPrice: number;
  volume: number;
  unit: string;
}

// 38 royalty owners
export const ROYALTY_OWNERS: RoyaltyOwner[] = [
  // Mustang Ranch Unit (L-001) — 10 owners
  { id: 'RO-001', name: 'Thornton Family Trust', ownerType: 'royalty', decimalInterest: 0.0625, leaseId: 'L-001', leaseName: 'Mustang Ranch Unit', monthlyOilRevenue: 8420, monthlyGasRevenue: 1750, monthlyNglRevenue: 905, totalMonthlyPayment: 11075, severanceTaxWithheld: 520, ytdPayments: 22150, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Pecos, TX 79772' },
  { id: 'RO-002', name: 'JW Enterprises LLC', ownerType: 'royalty', decimalInterest: 0.04688, leaseId: 'L-001', leaseName: 'Mustang Ranch Unit', monthlyOilRevenue: 6315, monthlyGasRevenue: 1312, monthlyNglRevenue: 678, totalMonthlyPayment: 8305, severanceTaxWithheld: 390, ytdPayments: 16610, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Midland, TX 79701' },
  { id: 'RO-003', name: 'Sarah Martinez', ownerType: 'mineral', decimalInterest: 0.03125, leaseId: 'L-001', leaseName: 'Mustang Ranch Unit', monthlyOilRevenue: 4210, monthlyGasRevenue: 875, monthlyNglRevenue: 452, totalMonthlyPayment: 5537, severanceTaxWithheld: 260, ytdPayments: 11074, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Odessa, TX 79761' },
  { id: 'RO-004', name: 'Permian Minerals LP', ownerType: 'mineral', decimalInterest: 0.03906, leaseId: 'L-001', leaseName: 'Mustang Ranch Unit', monthlyOilRevenue: 5262, monthlyGasRevenue: 1094, monthlyNglRevenue: 566, totalMonthlyPayment: 6922, severanceTaxWithheld: 325, ytdPayments: 13844, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Houston, TX 77002' },
  { id: 'RO-005', name: 'David & Linda Chen', ownerType: 'royalty', decimalInterest: 0.02344, leaseId: 'L-001', leaseName: 'Mustang Ranch Unit', monthlyOilRevenue: 3158, monthlyGasRevenue: 656, monthlyNglRevenue: 339, totalMonthlyPayment: 4153, severanceTaxWithheld: 195, ytdPayments: 8306, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Dallas, TX 75201' },
  { id: 'RO-006', name: 'Reeves County ISD', ownerType: 'mineral', decimalInterest: 0.01563, leaseId: 'L-001', leaseName: 'Mustang Ranch Unit', monthlyOilRevenue: 2105, monthlyGasRevenue: 438, monthlyNglRevenue: 226, totalMonthlyPayment: 2769, severanceTaxWithheld: 130, ytdPayments: 5538, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Pecos, TX 79772' },
  { id: 'RO-007', name: 'Basin Royalty Corp', ownerType: 'overriding-royalty', decimalInterest: 0.01250, leaseId: 'L-001', leaseName: 'Mustang Ranch Unit', monthlyOilRevenue: 1684, monthlyGasRevenue: 350, monthlyNglRevenue: 181, totalMonthlyPayment: 2215, severanceTaxWithheld: 104, ytdPayments: 4430, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Fort Worth, TX 76102' },
  { id: 'RO-008', name: 'Estate of Robert Keller', ownerType: 'royalty', decimalInterest: 0.00781, leaseId: 'L-001', leaseName: 'Mustang Ranch Unit', monthlyOilRevenue: 1052, monthlyGasRevenue: 219, monthlyNglRevenue: 113, totalMonthlyPayment: 1384, severanceTaxWithheld: 65, ytdPayments: 2768, filingStatus: 'pending', lastPaymentDate: '2026-01-31', address: 'San Angelo, TX 76901' },
  { id: 'RO-009', name: 'Westex Land Co', ownerType: 'overriding-royalty', decimalInterest: 0.00625, leaseId: 'L-001', leaseName: 'Mustang Ranch Unit', monthlyOilRevenue: 842, monthlyGasRevenue: 175, monthlyNglRevenue: 90, totalMonthlyPayment: 1107, severanceTaxWithheld: 52, ytdPayments: 2214, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Midland, TX 79701' },
  { id: 'RO-010', name: 'Angela Ruiz', ownerType: 'mineral', decimalInterest: 0.00469, leaseId: 'L-001', leaseName: 'Mustang Ranch Unit', monthlyOilRevenue: 632, monthlyGasRevenue: 131, monthlyNglRevenue: 68, totalMonthlyPayment: 831, severanceTaxWithheld: 39, ytdPayments: 1662, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Pecos, TX 79772' },

  // Rattlesnake Draw (L-002) — 8 owners
  { id: 'RO-011', name: 'Rattlesnake Ranch LLC', ownerType: 'royalty', decimalInterest: 0.05625, leaseId: 'L-002', leaseName: 'Rattlesnake Draw', monthlyOilRevenue: 9840, monthlyGasRevenue: 2048, monthlyNglRevenue: 1058, totalMonthlyPayment: 12946, severanceTaxWithheld: 608, ytdPayments: 25892, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Balmorhea, TX 79718' },
  { id: 'RO-012', name: 'Phillips Mineral Trust', ownerType: 'mineral', decimalInterest: 0.04500, leaseId: 'L-002', leaseName: 'Rattlesnake Draw', monthlyOilRevenue: 7872, monthlyGasRevenue: 1638, monthlyNglRevenue: 846, totalMonthlyPayment: 10356, severanceTaxWithheld: 486, ytdPayments: 20712, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Lubbock, TX 79401' },
  { id: 'RO-013', name: 'James & Patricia Cooper', ownerType: 'royalty', decimalInterest: 0.03375, leaseId: 'L-002', leaseName: 'Rattlesnake Draw', monthlyOilRevenue: 5904, monthlyGasRevenue: 1229, monthlyNglRevenue: 635, totalMonthlyPayment: 7768, severanceTaxWithheld: 365, ytdPayments: 15536, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Reeves County, TX' },
  { id: 'RO-014', name: 'TransPecos Energy Inc', ownerType: 'overriding-royalty', decimalInterest: 0.02250, leaseId: 'L-002', leaseName: 'Rattlesnake Draw', monthlyOilRevenue: 3936, monthlyGasRevenue: 819, monthlyNglRevenue: 423, totalMonthlyPayment: 5178, severanceTaxWithheld: 243, ytdPayments: 10356, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'San Antonio, TX 78205' },
  { id: 'RO-015', name: 'University of Texas System', ownerType: 'mineral', decimalInterest: 0.02813, leaseId: 'L-002', leaseName: 'Rattlesnake Draw', monthlyOilRevenue: 4920, monthlyGasRevenue: 1024, monthlyNglRevenue: 529, totalMonthlyPayment: 6473, severanceTaxWithheld: 304, ytdPayments: 12946, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Austin, TX 78701' },
  { id: 'RO-016', name: 'Miguel Hernandez', ownerType: 'royalty', decimalInterest: 0.01688, leaseId: 'L-002', leaseName: 'Rattlesnake Draw', monthlyOilRevenue: 2952, monthlyGasRevenue: 614, monthlyNglRevenue: 317, totalMonthlyPayment: 3883, severanceTaxWithheld: 182, ytdPayments: 7766, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Pecos, TX 79772' },
  { id: 'RO-017', name: 'High Plains Mineral Group', ownerType: 'mineral', decimalInterest: 0.01125, leaseId: 'L-002', leaseName: 'Rattlesnake Draw', monthlyOilRevenue: 1968, monthlyGasRevenue: 410, monthlyNglRevenue: 212, totalMonthlyPayment: 2590, severanceTaxWithheld: 122, ytdPayments: 5180, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Amarillo, TX 79101' },
  { id: 'RO-018', name: 'Carol Ann Whitfield', ownerType: 'royalty', decimalInterest: 0.00563, leaseId: 'L-002', leaseName: 'Rattlesnake Draw', monthlyOilRevenue: 984, monthlyGasRevenue: 205, monthlyNglRevenue: 106, totalMonthlyPayment: 1295, severanceTaxWithheld: 61, ytdPayments: 2590, filingStatus: 'delinquent', lastPaymentDate: '2025-12-31', address: 'El Paso, TX 79901' },

  // Sidewinder Mesa (L-003) — 8 owners
  { id: 'RO-019', name: 'Mesa Verde Holdings', ownerType: 'working-interest', decimalInterest: 0.04000, leaseId: 'L-003', leaseName: 'Sidewinder Mesa', monthlyOilRevenue: 10280, monthlyGasRevenue: 2140, monthlyNglRevenue: 1106, totalMonthlyPayment: 13526, severanceTaxWithheld: 635, ytdPayments: 27052, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Denver, CO 80202' },
  { id: 'RO-020', name: 'PBR Employee Trust', ownerType: 'overriding-royalty', decimalInterest: 0.02500, leaseId: 'L-003', leaseName: 'Sidewinder Mesa', monthlyOilRevenue: 6425, monthlyGasRevenue: 1338, monthlyNglRevenue: 691, totalMonthlyPayment: 8454, severanceTaxWithheld: 397, ytdPayments: 16908, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Pecos, TX 79772' },
  { id: 'RO-021', name: 'Guadalupe Mineral Trust', ownerType: 'mineral', decimalInterest: 0.03500, leaseId: 'L-003', leaseName: 'Sidewinder Mesa', monthlyOilRevenue: 8995, monthlyGasRevenue: 1873, monthlyNglRevenue: 968, totalMonthlyPayment: 11836, severanceTaxWithheld: 556, ytdPayments: 23672, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Carlsbad, NM 88220' },
  { id: 'RO-022', name: 'Thomas & Mary O\'Brien', ownerType: 'royalty', decimalInterest: 0.02000, leaseId: 'L-003', leaseName: 'Sidewinder Mesa', monthlyOilRevenue: 5140, monthlyGasRevenue: 1070, monthlyNglRevenue: 553, totalMonthlyPayment: 6763, severanceTaxWithheld: 318, ytdPayments: 13526, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Fort Stockton, TX 79735' },
  { id: 'RO-023', name: 'State of Texas GLO', ownerType: 'mineral', decimalInterest: 0.05000, leaseId: 'L-003', leaseName: 'Sidewinder Mesa', monthlyOilRevenue: 12850, monthlyGasRevenue: 2675, monthlyNglRevenue: 1382, totalMonthlyPayment: 16907, severanceTaxWithheld: 794, ytdPayments: 33814, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Austin, TX 78701' },
  { id: 'RO-024', name: 'Frank Delgado', ownerType: 'royalty', decimalInterest: 0.01500, leaseId: 'L-003', leaseName: 'Sidewinder Mesa', monthlyOilRevenue: 3855, monthlyGasRevenue: 803, monthlyNglRevenue: 415, totalMonthlyPayment: 5073, severanceTaxWithheld: 238, ytdPayments: 10146, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Pecos, TX 79772' },
  { id: 'RO-025', name: 'Permian Royalty Partners', ownerType: 'overriding-royalty', decimalInterest: 0.01000, leaseId: 'L-003', leaseName: 'Sidewinder Mesa', monthlyOilRevenue: 2570, monthlyGasRevenue: 535, monthlyNglRevenue: 276, totalMonthlyPayment: 3381, severanceTaxWithheld: 159, ytdPayments: 6762, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Midland, TX 79701' },
  { id: 'RO-026', name: 'Estate of William Tate', ownerType: 'royalty', decimalInterest: 0.00500, leaseId: 'L-003', leaseName: 'Sidewinder Mesa', monthlyOilRevenue: 1285, monthlyGasRevenue: 268, monthlyNglRevenue: 138, totalMonthlyPayment: 1691, severanceTaxWithheld: 79, ytdPayments: 3382, filingStatus: 'pending', lastPaymentDate: '2026-01-31', address: 'Monahans, TX 79756' },

  // Diamondback Federal (L-004) — 12 owners
  { id: 'RO-027', name: 'US Bureau of Land Management', ownerType: 'mineral', decimalInterest: 0.04688, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 15420, monthlyGasRevenue: 3210, monthlyNglRevenue: 1659, totalMonthlyPayment: 20289, severanceTaxWithheld: 953, ytdPayments: 40578, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Washington, DC 20003' },
  { id: 'RO-028', name: 'West Texas Mineral Trust', ownerType: 'mineral', decimalInterest: 0.03750, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 12336, monthlyGasRevenue: 2568, monthlyNglRevenue: 1327, totalMonthlyPayment: 16231, severanceTaxWithheld: 762, ytdPayments: 32462, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Midland, TX 79701' },
  { id: 'RO-029', name: 'Cimarron Resources Inc', ownerType: 'working-interest', decimalInterest: 0.03125, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 10280, monthlyGasRevenue: 2140, monthlyNglRevenue: 1106, totalMonthlyPayment: 13526, severanceTaxWithheld: 635, ytdPayments: 27052, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Oklahoma City, OK 73102' },
  { id: 'RO-030', name: 'Pecos Valley Foundation', ownerType: 'royalty', decimalInterest: 0.02188, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 7196, monthlyGasRevenue: 1498, monthlyNglRevenue: 774, totalMonthlyPayment: 9468, severanceTaxWithheld: 445, ytdPayments: 18936, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Pecos, TX 79772' },
  { id: 'RO-031', name: 'Richard & Nancy Campbell', ownerType: 'royalty', decimalInterest: 0.01563, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 5140, monthlyGasRevenue: 1070, monthlyNglRevenue: 553, totalMonthlyPayment: 6763, severanceTaxWithheld: 318, ytdPayments: 13526, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Alpine, TX 79830' },
  { id: 'RO-032', name: 'Three Rivers Minerals', ownerType: 'overriding-royalty', decimalInterest: 0.01250, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 4112, monthlyGasRevenue: 856, monthlyNglRevenue: 442, totalMonthlyPayment: 5410, severanceTaxWithheld: 254, ytdPayments: 10820, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'San Angelo, TX 76901' },
  { id: 'RO-033', name: 'Yolanda Reyes', ownerType: 'mineral', decimalInterest: 0.00938, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 3084, monthlyGasRevenue: 642, monthlyNglRevenue: 332, totalMonthlyPayment: 4058, severanceTaxWithheld: 191, ytdPayments: 8116, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Fort Stockton, TX 79735' },
  { id: 'RO-034', name: 'Eagle Flat Energy LLC', ownerType: 'working-interest', decimalInterest: 0.00781, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 2570, monthlyGasRevenue: 535, monthlyNglRevenue: 276, totalMonthlyPayment: 3381, severanceTaxWithheld: 159, ytdPayments: 6762, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Houston, TX 77002' },
  { id: 'RO-035', name: 'Kevin Blackwood', ownerType: 'royalty', decimalInterest: 0.00625, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 2056, monthlyGasRevenue: 428, monthlyNglRevenue: 221, totalMonthlyPayment: 2705, severanceTaxWithheld: 127, ytdPayments: 5410, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Odessa, TX 79761' },
  { id: 'RO-036', name: 'New Mexico State Land Office', ownerType: 'mineral', decimalInterest: 0.00469, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 1542, monthlyGasRevenue: 321, monthlyNglRevenue: 166, totalMonthlyPayment: 2029, severanceTaxWithheld: 95, ytdPayments: 4058, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Santa Fe, NM 87501' },
  { id: 'RO-037', name: 'Horizon Mineral Investments', ownerType: 'overriding-royalty', decimalInterest: 0.00313, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 1028, monthlyGasRevenue: 214, monthlyNglRevenue: 111, totalMonthlyPayment: 1353, severanceTaxWithheld: 64, ytdPayments: 2706, filingStatus: 'current', lastPaymentDate: '2026-02-28', address: 'Dallas, TX 75201' },
  { id: 'RO-038', name: 'Christine & Paul Weaver', ownerType: 'royalty', decimalInterest: 0.00156, leaseId: 'L-004', leaseName: 'Diamondback Federal', monthlyOilRevenue: 514, monthlyGasRevenue: 107, monthlyNglRevenue: 55, totalMonthlyPayment: 676, severanceTaxWithheld: 32, ytdPayments: 1352, filingStatus: 'delinquent', lastPaymentDate: '2025-11-30', address: 'Marfa, TX 79843' },
];

// Severance tax data (Feb 2026)
export const SEVERANCE_TAXES: SeveranceTax[] = [
  { category: 'Oil Production Tax (4.6%)', rate: 0.046, grossValue: 1842000, taxAmount: 84732, filingPeriod: '2026-02', status: 'filed' },
  { category: 'Gas Production Tax (7.5%)', rate: 0.075, grossValue: 384000, taxAmount: 28800, filingPeriod: '2026-02', status: 'filed' },
  { category: 'NGL Severance (4.6%)', rate: 0.046, grossValue: 198000, taxAmount: 9108, filingPeriod: '2026-02', status: 'pending' },
  { category: 'Regulatory Assessment', rate: 0.00167, grossValue: 2424000, taxAmount: 4048, filingPeriod: '2026-02', status: 'pending' },
];

// Revenue allocation by stream
export const REVENUE_ALLOCATION: RevenueAllocation[] = [
  { stream: 'oil', grossRevenue: 1842000, royaltyBurden: 460500, netToOperator: 1381500, avgPrice: 72.40, volume: 25442, unit: 'BBL' },
  { stream: 'gas', grossRevenue: 384000, royaltyBurden: 96000, netToOperator: 288000, avgPrice: 2.85, volume: 134737, unit: 'MCF' },
  { stream: 'ngl', grossRevenue: 198000, royaltyBurden: 49500, netToOperator: 148500, avgPrice: 28.50, volume: 6947, unit: 'BBL' },
];
