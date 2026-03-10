// Lone Star Distribution — 6 Hometowns (Facilities)
// Total: 36 routes across North and South Texas

export interface Hometown {
  id: string;
  name: string;
  routePrefix: string;   // DAL, ALN, FTW, ENS, CRP, LAR
  routes: number;
  accounts: number;
  cases: number;          // quarterly cases
  rev: number;            // quarterly revenue ($)
  sqft: number;           // warehouse square footage
  acquired: string;       // acquisition year/context
  profile: 'metro-urban' | 'suburban-growth' | 'west-metro' | 'rural-semi-urban' | 'coastal' | 'border';
  lat: number;
  lng: number;
  manager: string;        // district manager name
}

export const HOMETOWNS: Hometown[] = [
  {
    id: 'dal',
    name: 'Dallas HQ',
    routePrefix: 'DAL',
    routes: 8,
    accounts: 2910,
    cases: 305900,
    rev: 9177000,
    sqft: 425000,
    acquired: 'Original — founded 1976 in Corpus Christi, HQ moved to Dallas',
    profile: 'metro-urban',
    lat: 32.7767,
    lng: -96.7970,
    manager: 'Sarah Chen',
  },
  {
    id: 'aln',
    name: 'Allen',
    routePrefix: 'ALN',
    routes: 6,
    accounts: 1680,
    cases: 152400,
    rev: 4876800,
    sqft: 185000,
    acquired: 'Expansion — Collin County growth market',
    profile: 'suburban-growth',
    lat: 33.1032,
    lng: -96.6706,
    manager: 'Lisa Park',
  },
  {
    id: 'ftw',
    name: 'Fort Worth',
    routePrefix: 'FTW',
    routes: 8,
    accounts: 2781,
    cases: 275900,
    rev: 8277000,
    sqft: 532000,
    acquired: '2014 — Coors Fort Worth distribution center',
    profile: 'west-metro',
    lat: 32.7555,
    lng: -97.3308,
    manager: 'Carlos Mendoza',
  },
  {
    id: 'ens',
    name: 'Ennis',
    routePrefix: 'ENS',
    routes: 4,
    accounts: 890,
    cases: 82400,
    rev: 2307200,
    sqft: 78000,
    acquired: '2022 — Price Distributing acquisition',
    profile: 'rural-semi-urban',
    lat: 32.3293,
    lng: -96.6253,
    manager: 'Tommy Nguyen',
  },
  {
    id: 'crp',
    name: 'Corpus Christi',
    routePrefix: 'CRP',
    routes: 6,
    accounts: 1840,
    cases: 148800,
    rev: 4464000,
    sqft: 210000,
    acquired: '1976 — founding territory',
    profile: 'coastal',
    lat: 27.8006,
    lng: -97.3964,
    manager: 'Maria Santos',
  },
  {
    id: 'lar',
    name: 'Laredo',
    routePrefix: 'LAR',
    routes: 4,
    accounts: 1120,
    cases: 72000,
    rev: 2520000,
    sqft: 92000,
    acquired: '2024 — Southern Distributing acquisition',
    profile: 'border',
    lat: 27.5036,
    lng: -99.5076,
    manager: 'Roberto Garza',
  },
];

// Computed helpers
export const TOTAL_ROUTES = HOMETOWNS.reduce((sum, h) => sum + h.routes, 0);
export const TOTAL_ACCOUNTS = HOMETOWNS.reduce((sum, h) => sum + h.accounts, 0);
export const TOTAL_QUARTERLY_CASES = HOMETOWNS.reduce((sum, h) => sum + h.cases, 0);
export const TOTAL_QUARTERLY_REVENUE = HOMETOWNS.reduce((sum, h) => sum + h.rev, 0);

export const getHometownById = (id: string): Hometown | undefined =>
  HOMETOWNS.find(h => h.id === id);
