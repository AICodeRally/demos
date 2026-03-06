// Andrews Distributing — ~125 Representative Accounts across 4 Tiers
// Tier A (15): Major chains, key accounts
// Tier B (30): Regional grocery, large independents
// Tier C (50): Bars, restaurants, hotels
// Tier D (30): Convenience stores, small independents

export type AccountTier = 'A' | 'B' | 'C' | 'D';
export type AccountType = 'on-premise' | 'off-premise' | 'chain' | 'independent';

export interface Account {
  id: string;
  name: string;
  address: string;
  tier: AccountTier;
  type: AccountType;
  hometownId: string;
  routeId: string;
  contactName: string;
  contactPhone: string;
  displayCompliance: number;  // 0-1
  spiritsCarrying: boolean;
  tabcLicense: 'BB' | 'BG' | 'MB' | 'P' | 'W' | 'BQ'; // Beer/Wine(BB), Beer/Wine Grocery(BG), Mixed Bev(MB), Package Store(P), W permit(spirits), Beer/Quota(BQ)
  tabcStatus: 'verified' | 'expiring' | 'flagged';
  lastVisit: string;        // ISO date
  weeklyRevenue: number;
  monthlyCases: number;
}

export const ACCOUNTS: Account[] = [
  // ═══════════════════════════════════════════════════════════
  // TIER A — 15 accounts (Major chains, key accounts)
  // Revenue share: ~45% of total
  // ═══════════════════════════════════════════════════════════
  {
    id: 'ACC-A001', name: "Spec's Liquors — Greenville Ave", address: '2105 Greenville Ave, Dallas, TX 75206',
    tier: 'A', type: 'off-premise', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Robert Chen', contactPhone: '(214) 555-0142',
    displayCompliance: 0.94, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 18200, monthlyCases: 580,
  },
  {
    id: 'ACC-A002', name: 'Total Wine & More — Park Lane', address: '7990 Park Lane, Dallas, TX 75231',
    tier: 'A', type: 'off-premise', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Jennifer Martinez', contactPhone: '(214) 555-0287',
    displayCompliance: 0.91, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 22500, monthlyCases: 720,
  },
  {
    id: 'ACC-A003', name: 'Kroger #4412 — Mockingbird', address: '3100 Mockingbird Ln, Dallas, TX 75205',
    tier: 'A', type: 'chain', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'David Park', contactPhone: '(214) 555-0319',
    displayCompliance: 0.88, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 8700, monthlyCases: 320,
  },
  {
    id: 'ACC-A004', name: 'Walmart Supercenter #5847', address: '13739 N Central Expy, Dallas, TX 75243',
    tier: 'A', type: 'chain', hometownId: 'dal', routeId: 'DAL-01',
    contactName: 'Mike Thompson', contactPhone: '(214) 555-0455',
    displayCompliance: 0.85, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 12400, monthlyCases: 460,
  },
  {
    id: 'ACC-A005', name: 'H-E-B #0118 — Corpus Christi', address: '4425 S Padre Island Dr, Corpus Christi, TX 78411',
    tier: 'A', type: 'chain', hometownId: 'crp', routeId: 'CRP-01',
    contactName: 'Sofia Garza', contactPhone: '(361) 555-0188',
    displayCompliance: 0.92, spiritsCarrying: true, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 14800, monthlyCases: 520,
  },
  {
    id: 'ACC-A006', name: 'Tom Thumb #119 — Lakewood', address: '6333 E Mockingbird Ln, Dallas, TX 75214',
    tier: 'A', type: 'chain', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Sarah Kim', contactPhone: '(214) 555-0176',
    displayCompliance: 0.90, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-25', weeklyRevenue: 5400, monthlyCases: 210,
  },
  {
    id: 'ACC-A007', name: 'Target — Preston Royal', address: '8501 Preston Rd, Dallas, TX 75225',
    tier: 'A', type: 'chain', hometownId: 'dal', routeId: 'DAL-04',
    contactName: 'Lisa Nguyen', contactPhone: '(214) 555-0533',
    displayCompliance: 0.87, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 6200, monthlyCases: 240,
  },
  {
    id: 'ACC-A008', name: 'Costco Wholesale — Allen', address: '190 E Stacy Rd, Allen, TX 75002',
    tier: 'A', type: 'chain', hometownId: 'aln', routeId: 'ALN-01',
    contactName: 'Brian Wallace', contactPhone: '(972) 555-0644',
    displayCompliance: 0.93, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 16500, monthlyCases: 640,
  },
  {
    id: 'ACC-A009', name: "Spec's Liquors — Fort Worth", address: '4750 Bryant Irvin Rd, Fort Worth, TX 76132',
    tier: 'A', type: 'off-premise', hometownId: 'ftw', routeId: 'FTW-05',
    contactName: 'Amanda Brooks', contactPhone: '(817) 555-0721',
    displayCompliance: 0.96, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 15900, monthlyCases: 510,
  },
  {
    id: 'ACC-A010', name: 'Total Wine & More — Fort Worth', address: '4862 S Hulen St, Fort Worth, TX 76132',
    tier: 'A', type: 'off-premise', hometownId: 'ftw', routeId: 'FTW-01',
    contactName: 'Greg Patterson', contactPhone: '(817) 555-0832',
    displayCompliance: 0.92, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 19800, monthlyCases: 680,
  },
  {
    id: 'ACC-A011', name: 'H-E-B Plus — Laredo', address: '4502 San Bernardo Ave, Laredo, TX 78041',
    tier: 'A', type: 'chain', hometownId: 'lar', routeId: 'LAR-01',
    contactName: 'Ricardo Salinas', contactPhone: '(956) 555-0199',
    displayCompliance: 0.90, spiritsCarrying: true, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 11200, monthlyCases: 420,
  },
  {
    id: 'ACC-A012', name: 'Kroger #4488 — Allen', address: '951 SH 121, Allen, TX 75013',
    tier: 'A', type: 'chain', hometownId: 'aln', routeId: 'ALN-03',
    contactName: 'Janet Cooper', contactPhone: '(972) 555-0355',
    displayCompliance: 0.89, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 7800, monthlyCases: 290,
  },
  {
    id: 'ACC-A013', name: 'Walmart Supercenter #3284 — Corpus', address: '6101 S Padre Island Dr, Corpus Christi, TX 78412',
    tier: 'A', type: 'chain', hometownId: 'crp', routeId: 'CRP-02',
    contactName: 'Tony Vasquez', contactPhone: '(361) 555-0477',
    displayCompliance: 0.84, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 10500, monthlyCases: 390,
  },
  {
    id: 'ACC-A014', name: 'Walmart Neighborhood #7712 — Ennis', address: '501 W Ennis Ave, Ennis, TX 75119',
    tier: 'A', type: 'chain', hometownId: 'ens', routeId: 'ENS-01',
    contactName: 'Kelly Adams', contactPhone: '(972) 555-0688',
    displayCompliance: 0.86, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 5100, monthlyCases: 195,
  },
  {
    id: 'ACC-A015', name: "Spec's Liquors — Laredo", address: '5710 San Dario Ave, Laredo, TX 78041',
    tier: 'A', type: 'off-premise', hometownId: 'lar', routeId: 'LAR-02',
    contactName: 'Alejandra Fuentes', contactPhone: '(956) 555-0244',
    displayCompliance: 0.93, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 13400, monthlyCases: 450,
  },

  // ═══════════════════════════════════════════════════════════
  // TIER B — 30 accounts (Regional grocery, large independents)
  // Revenue share: ~30% of total
  // ═══════════════════════════════════════════════════════════
  {
    id: 'ACC-B001', name: 'Albertsons #4167 — Dallas', address: '3010 W Northwest Hwy, Dallas, TX 75220',
    tier: 'B', type: 'chain', hometownId: 'dal', routeId: 'DAL-01',
    contactName: 'Paul Robertson', contactPhone: '(214) 555-0901',
    displayCompliance: 0.86, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 4800, monthlyCases: 180,
  },
  {
    id: 'ACC-B002', name: 'Market Street — Colleyville', address: '5509 Colleyville Blvd, Colleyville, TX 76034',
    tier: 'B', type: 'chain', hometownId: 'ftw', routeId: 'FTW-02',
    contactName: 'Teresa Williams', contactPhone: '(817) 555-0944',
    displayCompliance: 0.88, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 5200, monthlyCases: 195,
  },
  {
    id: 'ACC-B003', name: 'Fiesta Mart #42 — Dallas', address: '3520 W Illinois Ave, Dallas, TX 75211',
    tier: 'B', type: 'chain', hometownId: 'dal', routeId: 'DAL-06',
    contactName: 'Carmen Delgado', contactPhone: '(214) 555-1022',
    displayCompliance: 0.84, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 4200, monthlyCases: 165,
  },
  {
    id: 'ACC-B004', name: 'Goody Goody Liquor — Dallas', address: '3316 Oak Lawn Ave, Dallas, TX 75219',
    tier: 'B', type: 'off-premise', hometownId: 'dal', routeId: 'DAL-02',
    contactName: 'Larry Jenkins', contactPhone: '(214) 555-1133',
    displayCompliance: 0.91, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 7800, monthlyCases: 260,
  },
  {
    id: 'ACC-B005', name: 'Sigel\'s Fine Wine & Spirits', address: '4714 Greenville Ave, Dallas, TX 75206',
    tier: 'B', type: 'off-premise', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Anne Sigel', contactPhone: '(214) 555-1244',
    displayCompliance: 0.93, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 6500, monthlyCases: 210,
  },
  {
    id: 'ACC-B006', name: 'Central Market — Fort Worth', address: '4651 W Fwy, Fort Worth, TX 76107',
    tier: 'B', type: 'chain', hometownId: 'ftw', routeId: 'FTW-04',
    contactName: 'Nancy Morrison', contactPhone: '(817) 555-1355',
    displayCompliance: 0.90, spiritsCarrying: true, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 5800, monthlyCases: 215,
  },
  {
    id: 'ACC-B007', name: 'Tom Thumb #247 — Allen', address: '1201 W McDermott Dr, Allen, TX 75013',
    tier: 'B', type: 'chain', hometownId: 'aln', routeId: 'ALN-02',
    contactName: 'Craig Olsen', contactPhone: '(972) 555-1466',
    displayCompliance: 0.87, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 4100, monthlyCases: 155,
  },
  {
    id: 'ACC-B008', name: 'La Michoacana — Laredo', address: '2301 Saunders St, Laredo, TX 78040',
    tier: 'B', type: 'independent', hometownId: 'lar', routeId: 'LAR-02',
    contactName: 'Jorge Hernandez', contactPhone: '(956) 555-1577',
    displayCompliance: 0.82, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 3800, monthlyCases: 150,
  },
  {
    id: 'ACC-B009', name: 'Aldi #612 — Fort Worth', address: '6610 McCart Ave, Fort Worth, TX 76133',
    tier: 'B', type: 'chain', hometownId: 'ftw', routeId: 'FTW-06',
    contactName: 'Diane Fisher', contactPhone: '(817) 555-1688',
    displayCompliance: 0.84, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 3200, monthlyCases: 125,
  },
  {
    id: 'ACC-B010', name: 'Stripes — Corpus Christi', address: '5850 Weber Rd, Corpus Christi, TX 78413',
    tier: 'B', type: 'chain', hometownId: 'crp', routeId: 'CRP-03',
    contactName: 'Marco Perez', contactPhone: '(361) 555-1799',
    displayCompliance: 0.80, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 3500, monthlyCases: 140,
  },
  {
    id: 'ACC-B011', name: "Pogo's Wine & Spirits", address: '5360 W Lovers Ln, Dallas, TX 75209',
    tier: 'B', type: 'off-premise', hometownId: 'dal', routeId: 'DAL-04',
    contactName: 'Don Pham', contactPhone: '(214) 555-1811',
    displayCompliance: 0.92, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-25', weeklyRevenue: 7200, monthlyCases: 235,
  },
  {
    id: 'ACC-B012', name: 'Brookshire\'s #48 — Ennis', address: '1200 W Ennis Ave, Ennis, TX 75119',
    tier: 'B', type: 'chain', hometownId: 'ens', routeId: 'ENS-02',
    contactName: 'Willie Hart', contactPhone: '(972) 555-1922',
    displayCompliance: 0.83, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 2800, monthlyCases: 110,
  },
  {
    id: 'ACC-B013', name: 'WinCo Foods — Fort Worth', address: '8401 Anderson Blvd, Fort Worth, TX 76120',
    tier: 'B', type: 'chain', hometownId: 'ftw', routeId: 'FTW-03',
    contactName: 'Brett Sullivan', contactPhone: '(817) 555-2033',
    displayCompliance: 0.85, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 4500, monthlyCases: 170,
  },
  {
    id: 'ACC-B014', name: 'Sprouts — McKinney', address: '3060 S Central Expy, McKinney, TX 75070',
    tier: 'B', type: 'chain', hometownId: 'aln', routeId: 'ALN-04',
    contactName: 'Hannah Lewis', contactPhone: '(972) 555-2144',
    displayCompliance: 0.88, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 3900, monthlyCases: 145,
  },
  {
    id: 'ACC-B015', name: 'Trader Joe\'s — Dallas', address: '4101 Lemmon Ave, Dallas, TX 75219',
    tier: 'B', type: 'chain', hometownId: 'dal', routeId: 'DAL-02',
    contactName: 'Stephanie Yu', contactPhone: '(214) 555-2255',
    displayCompliance: 0.89, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 3400, monthlyCases: 130,
  },
  {
    id: 'ACC-B016', name: 'Minyard\'s Sun Fresh — Dallas', address: '711 N Lancaster Ave, Dallas, TX 75203',
    tier: 'B', type: 'chain', hometownId: 'dal', routeId: 'DAL-07',
    contactName: 'James Washington', contactPhone: '(214) 555-2366',
    displayCompliance: 0.81, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 3100, monthlyCases: 120,
  },
  {
    id: 'ACC-B017', name: 'H-E-B #0244 — Corpus', address: '1621 Airline Rd, Corpus Christi, TX 78412',
    tier: 'B', type: 'chain', hometownId: 'crp', routeId: 'CRP-04',
    contactName: 'Diana Torres', contactPhone: '(361) 555-2477',
    displayCompliance: 0.87, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 5500, monthlyCases: 205,
  },
  {
    id: 'ACC-B018', name: 'El Rancho Supermercado — Fort Worth', address: '3460 E Lancaster Ave, Fort Worth, TX 76103',
    tier: 'B', type: 'chain', hometownId: 'ftw', routeId: 'FTW-07',
    contactName: 'Rafael Dominguez', contactPhone: '(817) 555-2588',
    displayCompliance: 0.79, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 3600, monthlyCases: 140,
  },
  {
    id: 'ACC-B019', name: 'Whole Foods — Plano', address: '2201 Preston Rd, Plano, TX 75093',
    tier: 'B', type: 'chain', hometownId: 'aln', routeId: 'ALN-05',
    contactName: 'Michelle Grant', contactPhone: '(972) 555-2699',
    displayCompliance: 0.91, spiritsCarrying: true, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 4400, monthlyCases: 160,
  },
  {
    id: 'ACC-B020', name: 'Vallarta Supermarkets — Laredo', address: '1708 Bob Bullock Loop, Laredo, TX 78043',
    tier: 'B', type: 'chain', hometownId: 'lar', routeId: 'LAR-04',
    contactName: 'Patricia Cantu', contactPhone: '(956) 555-2710',
    displayCompliance: 0.83, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 3200, monthlyCases: 130,
  },
  {
    id: 'ACC-B021', name: 'Sam\'s Club #6194 — Dallas', address: '3110 W Wheatland Rd, Dallas, TX 75237',
    tier: 'B', type: 'chain', hometownId: 'dal', routeId: 'DAL-05',
    contactName: 'Kevin Hooper', contactPhone: '(214) 555-2821',
    displayCompliance: 0.86, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 8200, monthlyCases: 310,
  },
  {
    id: 'ACC-B022', name: 'Beverage Depot — Fort Worth', address: '4900 Camp Bowie Blvd, Fort Worth, TX 76107',
    tier: 'B', type: 'off-premise', hometownId: 'ftw', routeId: 'FTW-05',
    contactName: 'Todd Reynolds', contactPhone: '(817) 555-2932',
    displayCompliance: 0.90, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 6100, monthlyCases: 200,
  },
  {
    id: 'ACC-B023', name: 'Racetrac #7745 — Ennis', address: '209 E Ennis Ave, Ennis, TX 75119',
    tier: 'B', type: 'chain', hometownId: 'ens', routeId: 'ENS-03',
    contactName: 'Carl Brooks', contactPhone: '(972) 555-3043',
    displayCompliance: 0.82, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 2200, monthlyCases: 88,
  },
  {
    id: 'ACC-B024', name: 'Albertsons #4189 — Corpus', address: '4101 Saratoga Blvd, Corpus Christi, TX 78413',
    tier: 'B', type: 'chain', hometownId: 'crp', routeId: 'CRP-05',
    contactName: 'Rose Maxwell', contactPhone: '(361) 555-3154',
    displayCompliance: 0.84, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 4100, monthlyCases: 155,
  },
  {
    id: 'ACC-B025', name: 'Grapevine Wine & Spirits', address: '609 S Main St, Grapevine, TX 76051',
    tier: 'B', type: 'off-premise', hometownId: 'ftw', routeId: 'FTW-02',
    contactName: 'Robert Harris', contactPhone: '(817) 555-3265',
    displayCompliance: 0.92, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 5400, monthlyCases: 175,
  },
  {
    id: 'ACC-B026', name: 'Kroger #4421 — Fort Worth', address: '6100 Southwest Blvd, Fort Worth, TX 76109',
    tier: 'B', type: 'chain', hometownId: 'ftw', routeId: 'FTW-06',
    contactName: 'Phillip Andrews', contactPhone: '(817) 555-3376',
    displayCompliance: 0.85, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 4600, monthlyCases: 175,
  },
  {
    id: 'ACC-B027', name: 'Tom Thumb #178 — Frisco', address: '3333 Preston Rd, Frisco, TX 75034',
    tier: 'B', type: 'chain', hometownId: 'aln', routeId: 'ALN-06',
    contactName: 'Lindsay Moore', contactPhone: '(972) 555-3487',
    displayCompliance: 0.88, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 3800, monthlyCases: 145,
  },
  {
    id: 'ACC-B028', name: 'La Botana Meat Market — Laredo', address: '3011 McPherson Rd, Laredo, TX 78041',
    tier: 'B', type: 'independent', hometownId: 'lar', routeId: 'LAR-03',
    contactName: 'Manuel Garza', contactPhone: '(956) 555-3598',
    displayCompliance: 0.78, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 2600, monthlyCases: 105,
  },
  {
    id: 'ACC-B029', name: 'Dollar General #18442 — Ennis', address: '800 S Clay St, Ennis, TX 75119',
    tier: 'B', type: 'chain', hometownId: 'ens', routeId: 'ENS-04',
    contactName: 'Betty Foster', contactPhone: '(972) 555-3609',
    displayCompliance: 0.76, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1800, monthlyCases: 72,
  },
  {
    id: 'ACC-B030', name: 'Albertsons #4201 — Allen', address: '500 S Greenville Ave, Allen, TX 75002',
    tier: 'B', type: 'chain', hometownId: 'aln', routeId: 'ALN-01',
    contactName: 'George Henderson', contactPhone: '(972) 555-3710',
    displayCompliance: 0.87, spiritsCarrying: false, tabcLicense: 'BG', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 4300, monthlyCases: 165,
  },

  // ═══════════════════════════════════════════════════════════
  // TIER C — 50 accounts (Bars, restaurants, hotels)
  // Revenue share: ~18% of total
  // ═══════════════════════════════════════════════════════════
  {
    id: 'ACC-C001', name: 'Cedar Springs Tap House', address: '4123 Cedar Springs Rd, Dallas, TX 75219',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Patrick O\'Brien', contactPhone: '(214) 555-4001',
    displayCompliance: 0.78, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 4100, monthlyCases: 140,
  },
  {
    id: 'ACC-C002', name: 'Deep Ellum Bottle Shop', address: '2626 Main St, Dallas, TX 75226',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Zach Morrison', contactPhone: '(214) 555-4112',
    displayCompliance: 0.72, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-24', weeklyRevenue: 2800, monthlyCases: 95,
  },
  {
    id: 'ACC-C003', name: 'The Statler Hotel Bar', address: '1914 Commerce St, Dallas, TX 75201',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Victoria James', contactPhone: '(214) 555-4223',
    displayCompliance: 0.85, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-25', weeklyRevenue: 6800, monthlyCases: 180,
  },
  {
    id: 'ACC-C004', name: 'Katy Trail Ice House', address: '3127 Routh St, Dallas, TX 75201',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-02',
    contactName: 'Steve Marshall', contactPhone: '(214) 555-4334',
    displayCompliance: 0.82, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 5200, monthlyCases: 165,
  },
  {
    id: 'ACC-C005', name: 'The Rustic — Dallas', address: '3656 Howell St, Dallas, TX 75204',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-01',
    contactName: 'Amanda Fields', contactPhone: '(214) 555-4445',
    displayCompliance: 0.80, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 4800, monthlyCases: 155,
  },
  {
    id: 'ACC-C006', name: 'Rodeo Goat — Fort Worth', address: '2836 Bledsoe St, Fort Worth, TX 76107',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-05',
    contactName: 'Kelly Austin', contactPhone: '(817) 555-4556',
    displayCompliance: 0.83, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 3900, monthlyCases: 130,
  },
  {
    id: 'ACC-C007', name: 'Flying Saucer — Fort Worth', address: '111 E Third St, Fort Worth, TX 76102',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-01',
    contactName: 'Mark Sanders', contactPhone: '(817) 555-4667',
    displayCompliance: 0.79, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 3500, monthlyCases: 115,
  },
  {
    id: 'ACC-C008', name: 'Chat Room Pub — Fort Worth', address: '1263 W Magnolia Ave, Fort Worth, TX 76104',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-05',
    contactName: 'Ben Lawson', contactPhone: '(817) 555-4778',
    displayCompliance: 0.76, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 2400, monthlyCases: 85,
  },
  {
    id: 'ACC-C009', name: 'HopFusion Ale Works', address: '200 E Broadway Ave, Fort Worth, TX 76104',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-05',
    contactName: 'Mitch Hollander', contactPhone: '(817) 555-4889',
    displayCompliance: 0.74, spiritsCarrying: false, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 2100, monthlyCases: 72,
  },
  {
    id: 'ACC-C010', name: 'Omni Dallas Hotel', address: '555 S Lamar St, Dallas, TX 75202',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-04',
    contactName: 'Richard Cole', contactPhone: '(214) 555-4990',
    displayCompliance: 0.88, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 7500, monthlyCases: 210,
  },
  {
    id: 'ACC-C011', name: 'Executive Surf Club — Corpus', address: '309 N Water St, Corpus Christi, TX 78401',
    tier: 'C', type: 'on-premise', hometownId: 'crp', routeId: 'CRP-01',
    contactName: 'Pete Rodriguez', contactPhone: '(361) 555-5001',
    displayCompliance: 0.77, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 2800, monthlyCases: 95,
  },
  {
    id: 'ACC-C012', name: 'Blackbeard\'s on the Beach', address: '3117 Surfside Blvd, Corpus Christi, TX 78402',
    tier: 'C', type: 'on-premise', hometownId: 'crp', routeId: 'CRP-03',
    contactName: 'Debbie Marsh', contactPhone: '(361) 555-5112',
    displayCompliance: 0.75, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 3200, monthlyCases: 110,
  },
  {
    id: 'ACC-C013', name: 'La Posada Hotel — Laredo', address: '1000 Zaragoza St, Laredo, TX 78040',
    tier: 'C', type: 'on-premise', hometownId: 'lar', routeId: 'LAR-01',
    contactName: 'Elena Fernandez', contactPhone: '(956) 555-5223',
    displayCompliance: 0.81, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 3800, monthlyCases: 125,
  },
  {
    id: 'ACC-C014', name: 'Taqueria La Mexicana — Laredo', address: '1702 Santa Maria Ave, Laredo, TX 78040',
    tier: 'C', type: 'on-premise', hometownId: 'lar', routeId: 'LAR-02',
    contactName: 'Jose Luis Ramirez', contactPhone: '(956) 555-5334',
    displayCompliance: 0.73, spiritsCarrying: false, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1900, monthlyCases: 75,
  },
  {
    id: 'ACC-C015', name: 'Siete Banderas — Laredo', address: '800 San Bernardo Ave, Laredo, TX 78040',
    tier: 'C', type: 'on-premise', hometownId: 'lar', routeId: 'LAR-02',
    contactName: 'Maria Guadalupe Perez', contactPhone: '(956) 555-5445',
    displayCompliance: 0.79, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 2600, monthlyCases: 90,
  },
  {
    id: 'ACC-C016', name: 'Pepe\'s Cantina — Dallas', address: '2911 Elm St, Dallas, TX 75226',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-05',
    contactName: 'Roberto Luna', contactPhone: '(214) 555-5556',
    displayCompliance: 0.74, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 2200, monthlyCases: 80,
  },
  {
    id: 'ACC-C017', name: 'Craft & Growler — Fort Worth', address: '907 Currie St, Fort Worth, TX 76107',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-05',
    contactName: 'Ryan Brewster', contactPhone: '(817) 555-5667',
    displayCompliance: 0.81, spiritsCarrying: false, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 2900, monthlyCases: 98,
  },
  {
    id: 'ACC-C018', name: 'Truck Yard — Dallas', address: '5624 Sears St, Dallas, TX 75206',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Jason Lee', contactPhone: '(214) 555-5778',
    displayCompliance: 0.76, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 3400, monthlyCases: 115,
  },
  {
    id: 'ACC-C019', name: 'The Worthington Hotel — FW', address: '200 Main St, Fort Worth, TX 76102',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-01',
    contactName: 'Claire Robinson', contactPhone: '(817) 555-5889',
    displayCompliance: 0.86, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 5600, monthlyCases: 170,
  },
  {
    id: 'ACC-C020', name: 'Glory House Bistro — Ennis', address: '107 W Knox St, Ennis, TX 75119',
    tier: 'C', type: 'on-premise', hometownId: 'ens', routeId: 'ENS-01',
    contactName: 'Sue Ellen Davis', contactPhone: '(972) 555-5990',
    displayCompliance: 0.75, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1400, monthlyCases: 50,
  },
  // Additional Tier C — bars/restaurants across markets
  {
    id: 'ACC-C021', name: 'Angry Dog — Dallas', address: '2726 Commerce St, Dallas, TX 75226',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-05',
    contactName: 'Tom Drake', contactPhone: '(214) 555-6001',
    displayCompliance: 0.71, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 1800, monthlyCases: 62,
  },
  {
    id: 'ACC-C022', name: 'Velvet Taco — Uptown', address: '3012 N Henderson Ave, Dallas, TX 75206',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-01',
    contactName: 'Nicole Adams', contactPhone: '(214) 555-6112',
    displayCompliance: 0.80, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 2600, monthlyCases: 88,
  },
  {
    id: 'ACC-C023', name: 'Mash\'d — Fort Worth', address: '1100 Foch St, Fort Worth, TX 76107',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-04',
    contactName: 'Billy Tucker', contactPhone: '(817) 555-6223',
    displayCompliance: 0.77, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 2300, monthlyCases: 78,
  },
  {
    id: 'ACC-C024', name: 'Harrison\'s — Allen', address: '902 W McDermott Dr, Allen, TX 75013',
    tier: 'C', type: 'on-premise', hometownId: 'aln', routeId: 'ALN-02',
    contactName: 'Pat Harrison', contactPhone: '(972) 555-6334',
    displayCompliance: 0.79, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 2100, monthlyCases: 72,
  },
  {
    id: 'ACC-C025', name: 'Water Street Oyster Bar — Corpus', address: '309 N Water St, Corpus Christi, TX 78401',
    tier: 'C', type: 'on-premise', hometownId: 'crp', routeId: 'CRP-01',
    contactName: 'Delia Sanchez', contactPhone: '(361) 555-6445',
    displayCompliance: 0.83, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 3100, monthlyCases: 105,
  },
  // Continue with more C-tier...
  {
    id: 'ACC-C026', name: 'Billy Bob\'s Texas', address: '2520 Rodeo Plaza, Fort Worth, TX 76164',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-03',
    contactName: 'Wayne Patterson', contactPhone: '(817) 555-6556',
    displayCompliance: 0.81, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 6800, monthlyCases: 220,
  },
  {
    id: 'ACC-C027', name: 'The Tipsy Alchemist — Dallas', address: '2101 Cedar Springs Rd, Dallas, TX 75201',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-02',
    contactName: 'Sandra Hill', contactPhone: '(214) 555-6667',
    displayCompliance: 0.84, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 3600, monthlyCases: 110,
  },
  {
    id: 'ACC-C028', name: 'Mi Cocina — Allen', address: '915 W Bethany Dr, Allen, TX 75013',
    tier: 'C', type: 'on-premise', hometownId: 'aln', routeId: 'ALN-03',
    contactName: 'Catalina Ramos', contactPhone: '(972) 555-6778',
    displayCompliance: 0.82, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 2800, monthlyCases: 92,
  },
  {
    id: 'ACC-C029', name: 'Rahr & Sons Brewing — Taproom', address: '701 Galveston Ave, Fort Worth, TX 76104',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-05',
    contactName: 'Fritz Rahr', contactPhone: '(817) 555-6889',
    displayCompliance: 0.90, spiritsCarrying: false, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 1800, monthlyCases: 60,
  },
  {
    id: 'ACC-C030', name: 'Republic Vino y Bistro — Laredo', address: '5502 San Dario Ave, Laredo, TX 78041',
    tier: 'C', type: 'on-premise', hometownId: 'lar', routeId: 'LAR-04',
    contactName: 'Lorena Villarreal', contactPhone: '(956) 555-6990',
    displayCompliance: 0.80, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 2200, monthlyCases: 75,
  },
  // More C-tier accounts for coverage
  {
    id: 'ACC-C031', name: 'The Brass Tap — Allen', address: '1291 W McDermott Dr, Allen, TX 75013',
    tier: 'C', type: 'on-premise', hometownId: 'aln', routeId: 'ALN-05',
    contactName: 'Derek Wang', contactPhone: '(972) 555-7001',
    displayCompliance: 0.78, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 2400, monthlyCases: 82,
  },
  {
    id: 'ACC-C032', name: 'Magnolia Motor Lounge — FW', address: '3005 Morton St, Fort Worth, TX 76107',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-04',
    contactName: 'Chelsea Morris', contactPhone: '(817) 555-7112',
    displayCompliance: 0.73, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1600, monthlyCases: 55,
  },
  {
    id: 'ACC-C033', name: 'Omni Corpus Christi Hotel', address: '900 N Shoreline Blvd, Corpus Christi, TX 78401',
    tier: 'C', type: 'on-premise', hometownId: 'crp', routeId: 'CRP-02',
    contactName: 'Ronald West', contactPhone: '(361) 555-7223',
    displayCompliance: 0.85, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 4200, monthlyCases: 140,
  },
  {
    id: 'ACC-C034', name: 'The Blue Fish — Dallas', address: '7700 W Northwest Hwy, Dallas, TX 75225',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-04',
    contactName: 'Ken Yamamoto', contactPhone: '(214) 555-7334',
    displayCompliance: 0.82, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 3200, monthlyCases: 105,
  },
  {
    id: 'ACC-C035', name: 'Ellerbe Fine Foods — FW', address: '1501 W Magnolia Ave, Fort Worth, TX 76104',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-05',
    contactName: 'Molly McCook', contactPhone: '(817) 555-7445',
    displayCompliance: 0.86, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 2800, monthlyCases: 90,
  },
  {
    id: 'ACC-C036', name: 'Yucatan Taco Stand — Dallas', address: '909 W Davis St, Dallas, TX 75208',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-06',
    contactName: 'Ricardo Mendez', contactPhone: '(214) 555-7556',
    displayCompliance: 0.72, spiritsCarrying: false, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 1500, monthlyCases: 52,
  },
  {
    id: 'ACC-C037', name: 'Whataburger Field Club — Corpus', address: '734 E Port Ave, Corpus Christi, TX 78401',
    tier: 'C', type: 'on-premise', hometownId: 'crp', routeId: 'CRP-04',
    contactName: 'Tony Benavides', contactPhone: '(361) 555-7667',
    displayCompliance: 0.79, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 2600, monthlyCases: 88,
  },
  {
    id: 'ACC-C038', name: 'Bowl & Barrel — Plano', address: '3000 Custer Rd, Plano, TX 75075',
    tier: 'C', type: 'on-premise', hometownId: 'aln', routeId: 'ALN-04',
    contactName: 'Mark Jensen', contactPhone: '(972) 555-7778',
    displayCompliance: 0.80, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 3100, monthlyCases: 105,
  },
  {
    id: 'ACC-C039', name: 'Enchiladas Ole — Ennis', address: '407 W Ennis Ave, Ennis, TX 75119',
    tier: 'C', type: 'on-premise', hometownId: 'ens', routeId: 'ENS-02',
    contactName: 'Alma Gonzalez', contactPhone: '(972) 555-7889',
    displayCompliance: 0.70, spiritsCarrying: false, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 900, monthlyCases: 35,
  },
  {
    id: 'ACC-C040', name: 'The Porch — Dallas', address: '2912 N Henderson Ave, Dallas, TX 75206',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-01',
    contactName: 'Kristen Murray', contactPhone: '(214) 555-7990',
    displayCompliance: 0.81, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 2900, monthlyCases: 98,
  },
  {
    id: 'ACC-C041', name: 'El Asadero — Laredo', address: '2614 E Saunders St, Laredo, TX 78041',
    tier: 'C', type: 'on-premise', hometownId: 'lar', routeId: 'LAR-01',
    contactName: 'Arturo Silva', contactPhone: '(956) 555-8001',
    displayCompliance: 0.74, spiritsCarrying: false, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1700, monthlyCases: 68,
  },
  {
    id: 'ACC-C042', name: 'Twilite Lounge — Dallas', address: '1900 Greenville Ave, Dallas, TX 75206',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Danny Cruz', contactPhone: '(214) 555-8112',
    displayCompliance: 0.73, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 1600, monthlyCases: 55,
  },
  {
    id: 'ACC-C043', name: 'Cowboy Chicken — Fort Worth', address: '4601 W Fwy, Fort Worth, TX 76107',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-02',
    contactName: 'Ray Taylor', contactPhone: '(817) 555-8223',
    displayCompliance: 0.78, spiritsCarrying: false, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 1200, monthlyCases: 45,
  },
  {
    id: 'ACC-C044', name: 'Mac\'s BBQ & Catering — Ennis', address: '100 N Dallas St, Ennis, TX 75119',
    tier: 'C', type: 'on-premise', hometownId: 'ens', routeId: 'ENS-03',
    contactName: 'Mac Roberts', contactPhone: '(972) 555-8334',
    displayCompliance: 0.69, spiritsCarrying: false, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 800, monthlyCases: 30,
  },
  {
    id: 'ACC-C045', name: 'Doc\'s Bar & Grill — Corpus', address: '11438 Leopard St, Corpus Christi, TX 78410',
    tier: 'C', type: 'on-premise', hometownId: 'crp', routeId: 'CRP-05',
    contactName: 'Ed Miller', contactPhone: '(361) 555-8445',
    displayCompliance: 0.71, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 1500, monthlyCases: 52,
  },
  {
    id: 'ACC-C046', name: 'World of Beer — Fort Worth', address: '855 Foch St, Fort Worth, TX 76107',
    tier: 'C', type: 'on-premise', hometownId: 'ftw', routeId: 'FTW-05',
    contactName: 'Isaac Coleman', contactPhone: '(817) 555-8556',
    displayCompliance: 0.80, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 2700, monthlyCases: 92,
  },
  {
    id: 'ACC-C047', name: 'Javier\'s — Dallas', address: '4912 Cole Ave, Dallas, TX 75205',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-04',
    contactName: 'Javier Sanchez', contactPhone: '(214) 555-8667',
    displayCompliance: 0.87, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 4100, monthlyCases: 130,
  },
  {
    id: 'ACC-C048', name: 'Malai Kitchen — Allen', address: '100 W Stacy Rd, Allen, TX 75013',
    tier: 'C', type: 'on-premise', hometownId: 'aln', routeId: 'ALN-06',
    contactName: 'Braden Wages', contactPhone: '(972) 555-8778',
    displayCompliance: 0.79, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 2000, monthlyCases: 68,
  },
  {
    id: 'ACC-C049', name: 'Mesero — Uptown Dallas', address: '4444 McKinney Ave, Dallas, TX 75205',
    tier: 'C', type: 'on-premise', hometownId: 'dal', routeId: 'DAL-06',
    contactName: 'Sofia Herrera', contactPhone: '(214) 555-8889',
    displayCompliance: 0.83, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 3500, monthlyCases: 115,
  },
  {
    id: 'ACC-C050', name: 'El Meson de Laredo', address: '3502 San Dario Ave, Laredo, TX 78041',
    tier: 'C', type: 'on-premise', hometownId: 'lar', routeId: 'LAR-03',
    contactName: 'Raul Cavazos', contactPhone: '(956) 555-8990',
    displayCompliance: 0.76, spiritsCarrying: true, tabcLicense: 'MB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1800, monthlyCases: 62,
  },

  // ═══════════════════════════════════════════════════════════
  // TIER D — 30 accounts (Convenience stores, small independents)
  // Revenue share: ~7% of total
  // ═══════════════════════════════════════════════════════════
  {
    id: 'ACC-D001', name: '7-Eleven #2847 — Ross Ave', address: '3900 Ross Ave, Dallas, TX 75204',
    tier: 'D', type: 'independent', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Vijay Patel', contactPhone: '(214) 555-9001',
    displayCompliance: 0.68, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 3200, monthlyCases: 120,
  },
  {
    id: 'ACC-D002', name: 'QuikTrip #891 — Gaston Ave', address: '4206 Gaston Ave, Dallas, TX 75246',
    tier: 'D', type: 'chain', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Randy Foster', contactPhone: '(214) 555-9112',
    displayCompliance: 0.72, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1900, monthlyCases: 75,
  },
  {
    id: 'ACC-D003', name: '7-Eleven #3104 — Fort Worth', address: '2900 W 7th St, Fort Worth, TX 76107',
    tier: 'D', type: 'chain', hometownId: 'ftw', routeId: 'FTW-05',
    contactName: 'Sam Patel', contactPhone: '(817) 555-9223',
    displayCompliance: 0.66, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 2800, monthlyCases: 110,
  },
  {
    id: 'ACC-D004', name: 'RaceTrac #7102 — Dallas', address: '2220 N Haskell Ave, Dallas, TX 75204',
    tier: 'D', type: 'chain', hometownId: 'dal', routeId: 'DAL-01',
    contactName: 'Maria Lopez', contactPhone: '(214) 555-9334',
    displayCompliance: 0.70, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1800, monthlyCases: 70,
  },
  {
    id: 'ACC-D005', name: 'QuikTrip #924 — Allen', address: '210 E Stacy Rd, Allen, TX 75002',
    tier: 'D', type: 'chain', hometownId: 'aln', routeId: 'ALN-01',
    contactName: 'Tim Nguyen', contactPhone: '(972) 555-9445',
    displayCompliance: 0.71, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 1500, monthlyCases: 58,
  },
  {
    id: 'ACC-D006', name: '7-Eleven #1882 — Corpus', address: '3434 Ayers St, Corpus Christi, TX 78404',
    tier: 'D', type: 'chain', hometownId: 'crp', routeId: 'CRP-03',
    contactName: 'Linda Nguyen', contactPhone: '(361) 555-9556',
    displayCompliance: 0.65, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 2100, monthlyCases: 82,
  },
  {
    id: 'ACC-D007', name: 'Stripes #4427 — Laredo', address: '1520 Jacaman Rd, Laredo, TX 78041',
    tier: 'D', type: 'chain', hometownId: 'lar', routeId: 'LAR-02',
    contactName: 'Luis Trevino', contactPhone: '(956) 555-9667',
    displayCompliance: 0.68, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1600, monthlyCases: 65,
  },
  {
    id: 'ACC-D008', name: 'Buc-ee\'s — Ennis', address: '301 E Ennis Ave, Ennis, TX 75119',
    tier: 'D', type: 'chain', hometownId: 'ens', routeId: 'ENS-01',
    contactName: 'Jackie Burns', contactPhone: '(972) 555-9778',
    displayCompliance: 0.88, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 4200, monthlyCases: 160,
  },
  {
    id: 'ACC-D009', name: 'Circle K #4419 — Dallas', address: '5600 Greenville Ave, Dallas, TX 75206',
    tier: 'D', type: 'chain', hometownId: 'dal', routeId: 'DAL-05',
    contactName: 'Ahmed Hassan', contactPhone: '(214) 555-9889',
    displayCompliance: 0.64, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1400, monthlyCases: 55,
  },
  {
    id: 'ACC-D010', name: 'Shell Station — Fort Worth', address: '3701 S University Dr, Fort Worth, TX 76109',
    tier: 'D', type: 'independent', hometownId: 'ftw', routeId: 'FTW-06',
    contactName: 'Hassan Ali', contactPhone: '(817) 555-0012',
    displayCompliance: 0.62, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 1100, monthlyCases: 42,
  },
  {
    id: 'ACC-D011', name: 'Valero #8817 — Corpus', address: '6120 Leopard St, Corpus Christi, TX 78409',
    tier: 'D', type: 'independent', hometownId: 'crp', routeId: 'CRP-05',
    contactName: 'Carlos Ruiz', contactPhone: '(361) 555-0123',
    displayCompliance: 0.63, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 1000, monthlyCases: 40,
  },
  {
    id: 'ACC-D012', name: 'Chevron — Laredo', address: '2803 Santa Maria Ave, Laredo, TX 78040',
    tier: 'D', type: 'independent', hometownId: 'lar', routeId: 'LAR-03',
    contactName: 'Pablo Martinez', contactPhone: '(956) 555-0234',
    displayCompliance: 0.66, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 900, monthlyCases: 36,
  },
  {
    id: 'ACC-D013', name: 'Murphy USA #7219 — Ennis', address: '1415 W Ennis Ave, Ennis, TX 75119',
    tier: 'D', type: 'chain', hometownId: 'ens', routeId: 'ENS-04',
    contactName: 'Billy Reynolds', contactPhone: '(972) 555-0345',
    displayCompliance: 0.67, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 1200, monthlyCases: 48,
  },
  {
    id: 'ACC-D014', name: 'On the Go — Allen', address: '804 W Exchange Pkwy, Allen, TX 75013',
    tier: 'D', type: 'independent', hometownId: 'aln', routeId: 'ALN-04',
    contactName: 'Jay Singh', contactPhone: '(972) 555-0456',
    displayCompliance: 0.69, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 1300, monthlyCases: 50,
  },
  {
    id: 'ACC-D015', name: 'QuikTrip #912 — Fort Worth', address: '8200 Camp Bowie W, Fort Worth, TX 76116',
    tier: 'D', type: 'chain', hometownId: 'ftw', routeId: 'FTW-03',
    contactName: 'Tony Wilson', contactPhone: '(817) 555-0567',
    displayCompliance: 0.72, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1600, monthlyCases: 62,
  },
  // Additional D-tier for coverage
  {
    id: 'ACC-D016', name: '7-Eleven #3478 — Allen', address: '311 N Greenville Ave, Allen, TX 75002',
    tier: 'D', type: 'chain', hometownId: 'aln', routeId: 'ALN-02',
    contactName: 'Raj Chopra', contactPhone: '(972) 555-0678',
    displayCompliance: 0.66, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 1400, monthlyCases: 54,
  },
  {
    id: 'ACC-D017', name: 'OXXO — Laredo', address: '8502 McPherson Rd, Laredo, TX 78045',
    tier: 'D', type: 'chain', hometownId: 'lar', routeId: 'LAR-04',
    contactName: 'Francisco Ochoa', contactPhone: '(956) 555-0789',
    displayCompliance: 0.70, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 1100, monthlyCases: 44,
  },
  {
    id: 'ACC-D018', name: 'E-Z Mart — Ennis', address: '609 W Lampasas St, Ennis, TX 75119',
    tier: 'D', type: 'independent', hometownId: 'ens', routeId: 'ENS-03',
    contactName: 'Bobby Price', contactPhone: '(972) 555-0890',
    displayCompliance: 0.62, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 700, monthlyCases: 28,
  },
  {
    id: 'ACC-D019', name: 'Love\'s Travel Stop — Ennis', address: '2451 W Ennis Ave, Ennis, TX 75119',
    tier: 'D', type: 'chain', hometownId: 'ens', routeId: 'ENS-01',
    contactName: 'Mark Collins', contactPhone: '(972) 555-0901',
    displayCompliance: 0.74, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 2400, monthlyCases: 95,
  },
  {
    id: 'ACC-D020', name: 'Corner Store — Dallas', address: '1815 Greenville Ave, Dallas, TX 75206',
    tier: 'D', type: 'independent', hometownId: 'dal', routeId: 'DAL-03',
    contactName: 'Kim Nguyen', contactPhone: '(214) 555-1012',
    displayCompliance: 0.60, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 800, monthlyCases: 32,
  },
  {
    id: 'ACC-D021', name: 'Pak-N-Save — Corpus Christi', address: '2022 Baldwin Blvd, Corpus Christi, TX 78405',
    tier: 'D', type: 'independent', hometownId: 'crp', routeId: 'CRP-06',
    contactName: 'Robert Perez', contactPhone: '(361) 555-1123',
    displayCompliance: 0.65, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 900, monthlyCases: 35,
  },
  {
    id: 'ACC-D022', name: 'Kwik Stop — Fort Worth', address: '4501 Benbrook Hwy, Fort Worth, TX 76116',
    tier: 'D', type: 'independent', hometownId: 'ftw', routeId: 'FTW-07',
    contactName: 'Jimmy Tran', contactPhone: '(817) 555-1234',
    displayCompliance: 0.61, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 800, monthlyCases: 32,
  },
  {
    id: 'ACC-D023', name: 'Stripes #4431 — Laredo', address: '4501 E Del Mar Blvd, Laredo, TX 78041',
    tier: 'D', type: 'chain', hometownId: 'lar', routeId: 'LAR-01',
    contactName: 'Roberto Cantu', contactPhone: '(956) 555-1345',
    displayCompliance: 0.67, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 1200, monthlyCases: 48,
  },
  {
    id: 'ACC-D024', name: 'Fuel City — Dallas', address: '801 S Riverfront Blvd, Dallas, TX 75207',
    tier: 'D', type: 'independent', hometownId: 'dal', routeId: 'DAL-07',
    contactName: 'Johnny Kim', contactPhone: '(214) 555-1456',
    displayCompliance: 0.74, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 2200, monthlyCases: 85,
  },
  {
    id: 'ACC-D025', name: 'Texaco — Fort Worth', address: '1200 E Belknap St, Fort Worth, TX 76102',
    tier: 'D', type: 'independent', hometownId: 'ftw', routeId: 'FTW-08',
    contactName: 'Pete Martinez', contactPhone: '(817) 555-1567',
    displayCompliance: 0.60, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 700, monthlyCases: 28,
  },
  {
    id: 'ACC-D026', name: 'Bill\'s Liquor — Dallas', address: '4827 Bryan St, Dallas, TX 75204',
    tier: 'D', type: 'independent', hometownId: 'dal', routeId: 'DAL-08',
    contactName: 'Bill Kowalski', contactPhone: '(214) 555-1678',
    displayCompliance: 0.70, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'expiring',
    lastVisit: '2026-02-27', weeklyRevenue: 1800, monthlyCases: 68,
  },
  {
    id: 'ACC-D027', name: 'Galaxy Liquor — Corpus', address: '5414 Weber Rd, Corpus Christi, TX 78411',
    tier: 'D', type: 'independent', hometownId: 'crp', routeId: 'CRP-04',
    contactName: 'Steve Nguyen', contactPhone: '(361) 555-1789',
    displayCompliance: 0.68, spiritsCarrying: true, tabcLicense: 'P', tabcStatus: 'verified',
    lastVisit: '2026-02-26', weeklyRevenue: 1600, monthlyCases: 58,
  },
  {
    id: 'ACC-D028', name: 'Allsup\'s #287 — Ennis', address: '401 S Clay St, Ennis, TX 75119',
    tier: 'D', type: 'chain', hometownId: 'ens', routeId: 'ENS-02',
    contactName: 'Wayne Harris', contactPhone: '(972) 555-1890',
    displayCompliance: 0.64, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 600, monthlyCases: 24,
  },
  {
    id: 'ACC-D029', name: 'Sunoco — Allen', address: '600 E Main St, Allen, TX 75002',
    tier: 'D', type: 'independent', hometownId: 'aln', routeId: 'ALN-06',
    contactName: 'Amir Shah', contactPhone: '(972) 555-1901',
    displayCompliance: 0.63, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-27', weeklyRevenue: 900, monthlyCases: 35,
  },
  {
    id: 'ACC-D030', name: 'Pilot Flying J — Fort Worth', address: '10500 I-30 W, Fort Worth, TX 76108',
    tier: 'D', type: 'chain', hometownId: 'ftw', routeId: 'FTW-08',
    contactName: 'Larry Green', contactPhone: '(817) 555-2012',
    displayCompliance: 0.73, spiritsCarrying: false, tabcLicense: 'BB', tabcStatus: 'verified',
    lastVisit: '2026-02-28', weeklyRevenue: 1900, monthlyCases: 72,
  },
];

// Computed helpers
export const getAccountById = (id: string): Account | undefined =>
  ACCOUNTS.find(a => a.id === id);

export const getAccountsByRoute = (routeId: string): Account[] =>
  ACCOUNTS.filter(a => a.routeId === routeId);

export const getAccountsByHometown = (hometownId: string): Account[] =>
  ACCOUNTS.filter(a => a.hometownId === hometownId);

export const getAccountsByTier = (tier: AccountTier): Account[] =>
  ACCOUNTS.filter(a => a.tier === tier);
