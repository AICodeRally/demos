// Andrews Distributing Brand Portfolio
// Molson Coors-aligned house. Does NOT carry AB InBev.
// 6 supplier groups: Molson Coors (38%), Constellation (28%), Heineken (15%), Craft (11%), Sazerac (5%), FMB/RTD (3%)

export type SupplierGroup = 'molson-coors' | 'constellation' | 'heineken' | 'craft' | 'sazerac' | 'fmb-rtd';
export type Category = 'beer-domestic' | 'beer-import' | 'craft-regional' | 'spirits' | 'fmb-rtd';

export interface BrandFamily {
  id: string;
  name: string;
  supplier: SupplierGroup;
  category: Category;
  tier: 'Core' | 'Emerging' | 'New Launch';
  casesQ: number;       // quarterly cases
  revQ: number;         // quarterly revenue ($)
  gp: number;           // gross profit margin %
  emerging: boolean;
  seasonalTrend: [number, number, number, number]; // Q1-Q4 multipliers
  marketSharePct: number;
  marginTarget: number;
  revenuePerCase: number;
}

// Category color mapping (for charts)
export const CATEGORY_COLORS: Record<Category, string> = {
  'beer-domestic': '#60A5FA',  // soft blue
  'beer-import': '#F59E0B',    // amber/gold
  'craft-regional': '#A78BFA', // purple
  'spirits': '#F87171',        // warm red
  'fmb-rtd': '#34D399',        // teal green
};

// Supplier color mapping
export const SUPPLIER_COLORS: Record<SupplierGroup, string> = {
  'molson-coors': '#60A5FA',
  'constellation': '#F59E0B',
  'heineken': '#10B981',
  'craft': '#A78BFA',
  'sazerac': '#F87171',
  'fmb-rtd': '#34D399',
};

export const BRAND_FAMILIES: BrandFamily[] = [
  // ═══════════════════════════════════════════
  // MOLSON COORS (38% of portfolio)
  // ═══════════════════════════════════════════
  {
    id: 'miller-lite',
    name: 'Miller Lite',
    supplier: 'molson-coors',
    category: 'beer-domestic',
    tier: 'Core',
    casesQ: 425000,
    revQ: 10200000,
    gp: 0.19,
    emerging: false,
    seasonalTrend: [0.88, 1.12, 1.18, 0.82],
    marketSharePct: 0.145,
    marginTarget: 0.21,
    revenuePerCase: 24.00,
  },
  {
    id: 'coors-light',
    name: 'Coors Light',
    supplier: 'molson-coors',
    category: 'beer-domestic',
    tier: 'Core',
    casesQ: 380000,
    revQ: 9120000,
    gp: 0.18,
    emerging: false,
    seasonalTrend: [0.85, 1.15, 1.20, 0.80],
    marketSharePct: 0.130,
    marginTarget: 0.20,
    revenuePerCase: 24.00,
  },
  {
    id: 'blue-moon',
    name: 'Blue Moon',
    supplier: 'molson-coors',
    category: 'beer-domestic',
    tier: 'Core',
    casesQ: 145000,
    revQ: 4350000,
    gp: 0.23,
    emerging: false,
    seasonalTrend: [0.92, 1.08, 1.12, 0.88],
    marketSharePct: 0.050,
    marginTarget: 0.25,
    revenuePerCase: 30.00,
  },
  {
    id: 'keystone-light',
    name: 'Keystone Light',
    supplier: 'molson-coors',
    category: 'beer-domestic',
    tier: 'Core',
    casesQ: 98000,
    revQ: 1764000,
    gp: 0.14,
    emerging: false,
    seasonalTrend: [0.90, 1.10, 1.15, 0.85],
    marketSharePct: 0.033,
    marginTarget: 0.16,
    revenuePerCase: 18.00,
  },
  {
    id: 'peroni',
    name: 'Peroni Nastro Azzurro',
    supplier: 'molson-coors',
    category: 'beer-import',
    tier: 'Emerging',
    casesQ: 42000,
    revQ: 1512000,
    gp: 0.28,
    emerging: true,
    seasonalTrend: [0.95, 1.08, 1.10, 0.87],
    marketSharePct: 0.014,
    marginTarget: 0.30,
    revenuePerCase: 36.00,
  },
  {
    id: 'leinenkugels',
    name: "Leinenkugel's",
    supplier: 'molson-coors',
    category: 'beer-domestic',
    tier: 'Core',
    casesQ: 32000,
    revQ: 896000,
    gp: 0.22,
    emerging: false,
    seasonalTrend: [0.80, 1.20, 1.25, 0.75],
    marketSharePct: 0.011,
    marginTarget: 0.24,
    revenuePerCase: 28.00,
  },

  // ═══════════════════════════════════════════
  // CONSTELLATION BRANDS (28% of portfolio)
  // ═══════════════════════════════════════════
  {
    id: 'corona-extra',
    name: 'Corona Extra',
    supplier: 'constellation',
    category: 'beer-import',
    tier: 'Core',
    casesQ: 385000,
    revQ: 11550000,
    gp: 0.24,
    emerging: false,
    seasonalTrend: [0.85, 1.15, 1.25, 0.75],
    marketSharePct: 0.132,
    marginTarget: 0.26,
    revenuePerCase: 30.00,
  },
  {
    id: 'modelo-especial',
    name: 'Modelo Especial',
    supplier: 'constellation',
    category: 'beer-import',
    tier: 'Core',
    casesQ: 310000,
    revQ: 9300000,
    gp: 0.25,
    emerging: false,
    seasonalTrend: [0.92, 1.10, 1.12, 0.86],
    marketSharePct: 0.106,
    marginTarget: 0.27,
    revenuePerCase: 30.00,
  },
  {
    id: 'modelo-negra',
    name: 'Modelo Negra',
    supplier: 'constellation',
    category: 'beer-import',
    tier: 'Emerging',
    casesQ: 68000,
    revQ: 2176000,
    gp: 0.26,
    emerging: true,
    seasonalTrend: [0.95, 1.05, 1.08, 0.92],
    marketSharePct: 0.023,
    marginTarget: 0.28,
    revenuePerCase: 32.00,
  },
  {
    id: 'pacifico',
    name: 'Pacifico',
    supplier: 'constellation',
    category: 'beer-import',
    tier: 'Emerging',
    casesQ: 52000,
    revQ: 1560000,
    gp: 0.24,
    emerging: true,
    seasonalTrend: [0.88, 1.12, 1.18, 0.82],
    marketSharePct: 0.018,
    marginTarget: 0.26,
    revenuePerCase: 30.00,
  },

  // ═══════════════════════════════════════════
  // HEINEKEN (15% of portfolio)
  // ═══════════════════════════════════════════
  {
    id: 'heineken',
    name: 'Heineken',
    supplier: 'heineken',
    category: 'beer-import',
    tier: 'Core',
    casesQ: 185000,
    revQ: 5920000,
    gp: 0.23,
    emerging: false,
    seasonalTrend: [0.92, 1.08, 1.12, 0.88],
    marketSharePct: 0.063,
    marginTarget: 0.25,
    revenuePerCase: 32.00,
  },
  {
    id: 'dos-equis',
    name: 'Dos Equis Lager',
    supplier: 'heineken',
    category: 'beer-import',
    tier: 'Core',
    casesQ: 125000,
    revQ: 3750000,
    gp: 0.22,
    emerging: false,
    seasonalTrend: [0.88, 1.12, 1.15, 0.85],
    marketSharePct: 0.043,
    marginTarget: 0.24,
    revenuePerCase: 30.00,
  },
  {
    id: 'tecate',
    name: 'Tecate',
    supplier: 'heineken',
    category: 'beer-import',
    tier: 'Core',
    casesQ: 88000,
    revQ: 2200000,
    gp: 0.20,
    emerging: false,
    seasonalTrend: [0.90, 1.10, 1.15, 0.85],
    marketSharePct: 0.030,
    marginTarget: 0.22,
    revenuePerCase: 25.00,
  },
  {
    id: 'amstel-light',
    name: 'Amstel Light',
    supplier: 'heineken',
    category: 'beer-import',
    tier: 'Emerging',
    casesQ: 38000,
    revQ: 1292000,
    gp: 0.27,
    emerging: true,
    seasonalTrend: [0.95, 1.05, 1.08, 0.92],
    marketSharePct: 0.013,
    marginTarget: 0.29,
    revenuePerCase: 34.00,
  },

  // ═══════════════════════════════════════════
  // CRAFT / REGIONAL (11% of portfolio)
  // ═══════════════════════════════════════════
  {
    id: 'shiner-bock',
    name: 'Shiner Bock',
    supplier: 'craft',
    category: 'craft-regional',
    tier: 'Core',
    casesQ: 125000,
    revQ: 3500000,
    gp: 0.26,
    emerging: false,
    seasonalTrend: [0.85, 1.10, 1.15, 0.90],
    marketSharePct: 0.043,
    marginTarget: 0.28,
    revenuePerCase: 28.00,
  },
  {
    id: 'firestone-walker',
    name: 'Firestone Walker',
    supplier: 'craft',
    category: 'craft-regional',
    tier: 'Emerging',
    casesQ: 48000,
    revQ: 1680000,
    gp: 0.30,
    emerging: true,
    seasonalTrend: [0.90, 1.08, 1.12, 0.90],
    marketSharePct: 0.016,
    marginTarget: 0.32,
    revenuePerCase: 35.00,
  },
  {
    id: 'rahr-and-sons',
    name: 'Rahr & Sons',
    supplier: 'craft',
    category: 'craft-regional',
    tier: 'Emerging',
    casesQ: 28000,
    revQ: 980000,
    gp: 0.32,
    emerging: true,
    seasonalTrend: [0.88, 1.10, 1.15, 0.87],
    marketSharePct: 0.010,
    marginTarget: 0.34,
    revenuePerCase: 35.00,
  },
  {
    id: 'revolver',
    name: 'Revolver Brewing',
    supplier: 'craft',
    category: 'craft-regional',
    tier: 'Emerging',
    casesQ: 22000,
    revQ: 770000,
    gp: 0.31,
    emerging: true,
    seasonalTrend: [0.85, 1.12, 1.18, 0.85],
    marketSharePct: 0.008,
    marginTarget: 0.33,
    revenuePerCase: 35.00,
  },
  {
    id: 'yuengling',
    name: 'Yuengling',
    supplier: 'craft',
    category: 'craft-regional',
    tier: 'Core',
    casesQ: 95000,
    revQ: 2375000,
    gp: 0.21,
    emerging: false,
    seasonalTrend: [0.92, 1.08, 1.10, 0.90],
    marketSharePct: 0.032,
    marginTarget: 0.23,
    revenuePerCase: 25.00,
  },

  // ═══════════════════════════════════════════
  // SAZERAC (5% of portfolio - new 2024)
  // ═══════════════════════════════════════════
  {
    id: 'buffalo-trace',
    name: 'Buffalo Trace',
    supplier: 'sazerac',
    category: 'spirits',
    tier: 'Emerging',
    casesQ: 38000,
    revQ: 2280000,
    gp: 0.36,
    emerging: true,
    seasonalTrend: [0.90, 0.95, 1.05, 1.10],
    marketSharePct: 0.013,
    marginTarget: 0.38,
    revenuePerCase: 60.00,
  },
  {
    id: 'fireball',
    name: 'Fireball',
    supplier: 'sazerac',
    category: 'spirits',
    tier: 'Core',
    casesQ: 52000,
    revQ: 2340000,
    gp: 0.32,
    emerging: false,
    seasonalTrend: [0.85, 0.90, 1.05, 1.20],
    marketSharePct: 0.018,
    marginTarget: 0.34,
    revenuePerCase: 45.00,
  },
  {
    id: 'southern-comfort',
    name: 'Southern Comfort',
    supplier: 'sazerac',
    category: 'spirits',
    tier: 'Core',
    casesQ: 35000,
    revQ: 1575000,
    gp: 0.30,
    emerging: false,
    seasonalTrend: [0.88, 0.92, 1.02, 1.18],
    marketSharePct: 0.012,
    marginTarget: 0.32,
    revenuePerCase: 45.00,
  },
  {
    id: 'wheatley-vodka',
    name: 'Wheatley Vodka',
    supplier: 'sazerac',
    category: 'spirits',
    tier: 'New Launch',
    casesQ: 18000,
    revQ: 900000,
    gp: 0.34,
    emerging: true,
    seasonalTrend: [0.92, 1.00, 1.05, 1.03],
    marketSharePct: 0.006,
    marginTarget: 0.36,
    revenuePerCase: 50.00,
  },

  // ═══════════════════════════════════════════
  // FMB / RTD (3% of portfolio)
  // ═══════════════════════════════════════════
  {
    id: 'truly',
    name: 'Truly Hard Seltzer',
    supplier: 'fmb-rtd',
    category: 'fmb-rtd',
    tier: 'Core',
    casesQ: 42000,
    revQ: 1470000,
    gp: 0.25,
    emerging: false,
    seasonalTrend: [0.80, 1.15, 1.25, 0.80],
    marketSharePct: 0.014,
    marginTarget: 0.27,
    revenuePerCase: 35.00,
  },
  {
    id: 'twisted-tea',
    name: 'Twisted Tea',
    supplier: 'fmb-rtd',
    category: 'fmb-rtd',
    tier: 'Core',
    casesQ: 38000,
    revQ: 1330000,
    gp: 0.24,
    emerging: false,
    seasonalTrend: [0.82, 1.12, 1.22, 0.84],
    marketSharePct: 0.013,
    marginTarget: 0.26,
    revenuePerCase: 35.00,
  },
  {
    id: 'angry-orchard',
    name: 'Angry Orchard',
    supplier: 'fmb-rtd',
    category: 'fmb-rtd',
    tier: 'Emerging',
    casesQ: 15000,
    revQ: 525000,
    gp: 0.26,
    emerging: true,
    seasonalTrend: [0.90, 1.05, 1.10, 0.95],
    marketSharePct: 0.005,
    marginTarget: 0.28,
    revenuePerCase: 35.00,
  },
];

// Computed helpers
export const TOTAL_QUARTERLY_CASES = BRAND_FAMILIES.reduce((sum, b) => sum + b.casesQ, 0);
export const TOTAL_QUARTERLY_REVENUE = BRAND_FAMILIES.reduce((sum, b) => sum + b.revQ, 0);

export const SUPPLIER_PORTFOLIO_SHARE: Record<SupplierGroup, number> = {
  'molson-coors': 0.38,
  'constellation': 0.28,
  'heineken': 0.15,
  'craft': 0.11,
  'sazerac': 0.05,
  'fmb-rtd': 0.03,
};

export const getBrandsBySupplier = (supplier: SupplierGroup): BrandFamily[] =>
  BRAND_FAMILIES.filter(b => b.supplier === supplier);

export const getBrandsByCategory = (category: Category): BrandFamily[] =>
  BRAND_FAMILIES.filter(b => b.category === category);
