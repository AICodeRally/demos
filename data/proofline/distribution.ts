export interface RouteEfficiency {
  routeId: string;
  stopsCompleted: number;
  casesDelivered: number;
  onTimeRate: number;
  shrinkage: number;
  merchandisingScore: number;
}

export interface InventoryPosition {
  brandId: string;
  brandName: string;
  onHand: number;
  forecastDemand: number;
  daysOfSupply: number;
}

export interface DeliveryDay {
  day: string;
  routesScheduled: number;
  routesCompleted: number;
  casesTarget: number;
  casesDelivered: number;
}

export const ROUTE_EFFICIENCY: RouteEfficiency[] = [
  // Dallas
  { routeId: 'DAL-01', stopsCompleted: 234, casesDelivered: 4212, onTimeRate: 0.97, shrinkage: 0.005, merchandisingScore: 96 },
  { routeId: 'DAL-02', stopsCompleted: 208, casesDelivered: 3992, onTimeRate: 0.95, shrinkage: 0.008, merchandisingScore: 91 },
  { routeId: 'DAL-03', stopsCompleted: 221, casesDelivered: 3855, onTimeRate: 0.96, shrinkage: 0.006, merchandisingScore: 93 },
  { routeId: 'DAL-04', stopsCompleted: 247, casesDelivered: 4124, onTimeRate: 0.98, shrinkage: 0.003, merchandisingScore: 97 },
  { routeId: 'DAL-05', stopsCompleted: 182, casesDelivered: 3648, onTimeRate: 0.91, shrinkage: 0.015, merchandisingScore: 82 },
  { routeId: 'DAL-06', stopsCompleted: 260, casesDelivered: 4328, onTimeRate: 0.98, shrinkage: 0.004, merchandisingScore: 95 },
  { routeId: 'DAL-07', stopsCompleted: 169, casesDelivered: 3528, onTimeRate: 0.89, shrinkage: 0.022, merchandisingScore: 78 },
  { routeId: 'DAL-08', stopsCompleted: 143, casesDelivered: 2896, onTimeRate: 0.88, shrinkage: 0.025, merchandisingScore: 76 },
  // Fort Worth
  { routeId: 'FTW-01', stopsCompleted: 221, casesDelivered: 3824, onTimeRate: 0.96, shrinkage: 0.007, merchandisingScore: 92 },
  { routeId: 'FTW-02', stopsCompleted: 208, casesDelivered: 3688, onTimeRate: 0.95, shrinkage: 0.009, merchandisingScore: 90 },
  { routeId: 'FTW-03', stopsCompleted: 195, casesDelivered: 3456, onTimeRate: 0.93, shrinkage: 0.012, merchandisingScore: 86 },
  { routeId: 'FTW-04', stopsCompleted: 208, casesDelivered: 3256, onTimeRate: 0.94, shrinkage: 0.008, merchandisingScore: 89 },
  { routeId: 'FTW-05', stopsCompleted: 247, casesDelivered: 3956, onTimeRate: 0.97, shrinkage: 0.005, merchandisingScore: 94 },
  { routeId: 'FTW-06', stopsCompleted: 182, casesDelivered: 3428, onTimeRate: 0.92, shrinkage: 0.014, merchandisingScore: 83 },
  { routeId: 'FTW-07', stopsCompleted: 156, casesDelivered: 3188, onTimeRate: 0.90, shrinkage: 0.018, merchandisingScore: 80 },
  { routeId: 'FTW-08', stopsCompleted: 130, casesDelivered: 2948, onTimeRate: 0.88, shrinkage: 0.024, merchandisingScore: 77 },
  // Laredo
  { routeId: 'LAR-01', stopsCompleted: 195, casesDelivered: 1824, onTimeRate: 0.94, shrinkage: 0.009, merchandisingScore: 90 },
  { routeId: 'LAR-02', stopsCompleted: 169, casesDelivered: 1584, onTimeRate: 0.92, shrinkage: 0.013, merchandisingScore: 85 },
  { routeId: 'LAR-03', stopsCompleted: 143, casesDelivered: 1156, onTimeRate: 0.90, shrinkage: 0.018, merchandisingScore: 80 },
  { routeId: 'LAR-04', stopsCompleted: 208, casesDelivered: 1956, onTimeRate: 0.96, shrinkage: 0.006, merchandisingScore: 93 },
  { routeId: 'LAR-05', stopsCompleted: 156, casesDelivered: 1424, onTimeRate: 0.91, shrinkage: 0.016, merchandisingScore: 82 },
  { routeId: 'LAR-06', stopsCompleted: 130, casesDelivered: 1284, onTimeRate: 0.89, shrinkage: 0.021, merchandisingScore: 78 },
  { routeId: 'LAR-07', stopsCompleted: 117, casesDelivered: 1024, onTimeRate: 0.87, shrinkage: 0.026, merchandisingScore: 75 },
  { routeId: 'LAR-08', stopsCompleted: 104, casesDelivered: 984, onTimeRate: 0.86, shrinkage: 0.028, merchandisingScore: 76 },
];

export const INVENTORY_POSITIONS: InventoryPosition[] = [
  { brandId: 'bud', brandName: 'Bud Light', onHand: 48200, forecastDemand: 10900, daysOfSupply: 31 },
  { brandId: 'mic', brandName: 'Michelob Ultra', onHand: 32800, forecastDemand: 7500, daysOfSupply: 31 },
  { brandId: 'mod', brandName: 'Modelo Especial', onHand: 38500, forecastDemand: 8800, daysOfSupply: 31 },
  { brandId: 'stel', brandName: 'Stella Artois', onHand: 27600, forecastDemand: 6500, daysOfSupply: 30 },
  { brandId: 'shi', brandName: 'Shiner Spirits', onHand: 6200, forecastDemand: 1400, daysOfSupply: 31 },
  { brandId: 'topo', brandName: 'Topo Chico Hard Seltzer', onHand: 9400, forecastDemand: 2100, daysOfSupply: 32 },
  { brandId: 'kona', brandName: 'Kona Big Wave', onHand: 14200, forecastDemand: 3200, daysOfSupply: 31 },
  { brandId: 'kar', brandName: 'Karbach Brewing', onHand: 3800, forecastDemand: 840, daysOfSupply: 32 },
];

export const DELIVERY_CALENDAR: DeliveryDay[] = [
  { day: 'Mon', routesScheduled: 24, routesCompleted: 23, casesTarget: 12800, casesDelivered: 12540 },
  { day: 'Tue', routesScheduled: 24, routesCompleted: 24, casesTarget: 13200, casesDelivered: 13080 },
  { day: 'Wed', routesScheduled: 24, routesCompleted: 22, casesTarget: 12600, casesDelivered: 11940 },
  { day: 'Thu', routesScheduled: 24, routesCompleted: 24, casesTarget: 13400, casesDelivered: 13260 },
  { day: 'Fri', routesScheduled: 24, routesCompleted: 23, casesTarget: 11800, casesDelivered: 11520 },
];
