export interface InventorySource {
  id: string;
  name: string;
  type: 'auction' | 'trade-in' | 'private-party' | 'dealer-trade';
  avgAcquisitionCost: number;
  avgSpread: number;
  unitsThisMonth: number;
  avgDaysToSell: number;
}

export const INVENTORY_SOURCES: InventorySource[] = [
  { id: 'SRC-001', name: 'Manheim Phoenix', type: 'auction', avgAcquisitionCost: 24500, avgSpread: 5200, unitsThisMonth: 18, avgDaysToSell: 22 },
  { id: 'SRC-002', name: 'Adesa Mesa', type: 'auction', avgAcquisitionCost: 21800, avgSpread: 4800, unitsThisMonth: 12, avgDaysToSell: 25 },
  { id: 'SRC-003', name: 'Customer Trade-Ins', type: 'trade-in', avgAcquisitionCost: 22000, avgSpread: 5800, unitsThisMonth: 22, avgDaysToSell: 15 },
  { id: 'SRC-004', name: 'Private Party Buys', type: 'private-party', avgAcquisitionCost: 26000, avgSpread: 4500, unitsThisMonth: 5, avgDaysToSell: 30 },
  { id: 'SRC-005', name: 'Dealer Trades', type: 'dealer-trade', avgAcquisitionCost: 25500, avgSpread: 3800, unitsThisMonth: 3, avgDaysToSell: 18 },
];
