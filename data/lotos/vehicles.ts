export type VehicleStatus = 'in-recon' | 'frontline' | 'sold' | 'aged' | 'wholesale';
export type VehicleSource = 'auction-manheim' | 'auction-adesa' | 'trade-in' | 'private-party';

export interface Vehicle {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  color: string;
  acquisitionCost: number;
  askingPrice: number;
  status: VehicleStatus;
  daysOnLot: number;
  source: VehicleSource;
  acquiredDate: string;
  reconCost: number;
}

export const STATUS_COLORS: Record<VehicleStatus, string> = {
  'in-recon': '#D97706',
  frontline: '#16A34A',
  sold: '#2563EB',
  aged: '#DC2626',
  wholesale: '#6B7280',
};

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  'in-recon': 'In Recon',
  frontline: 'Frontline',
  sold: 'Sold',
  aged: 'Aged',
  wholesale: 'Wholesale',
};

export const VEHICLES: Vehicle[] = [
  { id: 'STK-001', vin: '1HGCV1F34PA000101', year: 2023, make: 'Honda', model: 'Accord', trim: 'Sport', mileage: 28400, color: 'Platinum White', acquisitionCost: 22500, askingPrice: 27495, status: 'frontline', daysOnLot: 12, source: 'auction-manheim', acquiredDate: '2026-03-20', reconCost: 850 },
  { id: 'STK-002', vin: '1FTFW1E85PA000202', year: 2023, make: 'Ford', model: 'F-150', trim: 'XLT', mileage: 34200, color: 'Oxford White', acquisitionCost: 32000, askingPrice: 38995, status: 'frontline', daysOnLot: 8, source: 'trade-in', acquiredDate: '2026-03-24', reconCost: 1200 },
  { id: 'STK-003', vin: '3GNKBCRS4PS000303', year: 2022, make: 'Chevrolet', model: 'Equinox', trim: 'LT', mileage: 41800, color: 'Summit White', acquisitionCost: 18200, askingPrice: 22995, status: 'in-recon', daysOnLot: 5, source: 'auction-adesa', acquiredDate: '2026-03-27', reconCost: 0 },
  { id: 'STK-004', vin: '5YJ3E1EA8PF000404', year: 2023, make: 'Tesla', model: 'Model 3', trim: 'Long Range', mileage: 19600, color: 'Midnight Silver', acquisitionCost: 29800, askingPrice: 35495, status: 'frontline', daysOnLot: 22, source: 'private-party', acquiredDate: '2026-03-10', reconCost: 400 },
  { id: 'STK-005', vin: '1C4RJFAG5PC000505', year: 2022, make: 'Jeep', model: 'Grand Cherokee', trim: 'Limited', mileage: 38500, color: 'Velvet Red', acquisitionCost: 28500, askingPrice: 34495, status: 'aged', daysOnLot: 68, source: 'auction-manheim', acquiredDate: '2026-01-23', reconCost: 2100 },
  { id: 'STK-006', vin: 'JTDKN3DU5A0000606', year: 2024, make: 'Toyota', model: 'Camry', trim: 'SE', mileage: 12400, color: 'Celestial Silver', acquisitionCost: 24200, askingPrice: 28995, status: 'frontline', daysOnLot: 15, source: 'trade-in', acquiredDate: '2026-03-17', reconCost: 600 },
  { id: 'STK-007', vin: 'WBA53BJ06PC000707', year: 2023, make: 'BMW', model: '330i', trim: 'xDrive', mileage: 25800, color: 'Alpine White', acquisitionCost: 31500, askingPrice: 37995, status: 'frontline', daysOnLot: 18, source: 'auction-manheim', acquiredDate: '2026-03-14', reconCost: 950 },
  { id: 'STK-008', vin: '1N4BL4BV4PC000808', year: 2022, make: 'Nissan', model: 'Altima', trim: 'SV', mileage: 44200, color: 'Gun Metallic', acquisitionCost: 16800, askingPrice: 20995, status: 'in-recon', daysOnLot: 3, source: 'auction-adesa', acquiredDate: '2026-03-29', reconCost: 0 },
  { id: 'STK-009', vin: '2T1BURHE9PC000909', year: 2023, make: 'Toyota', model: 'Corolla', trim: 'LE', mileage: 22100, color: 'Classic Silver', acquisitionCost: 18500, askingPrice: 22495, status: 'sold', daysOnLot: 9, source: 'trade-in', acquiredDate: '2026-03-15', reconCost: 350 },
  { id: 'STK-010', vin: '1GNSKBKC4PR001010', year: 2022, make: 'Chevrolet', model: 'Tahoe', trim: 'LT', mileage: 52400, color: 'Black', acquisitionCost: 38000, askingPrice: 44995, status: 'aged', daysOnLot: 72, source: 'auction-manheim', acquiredDate: '2026-01-20', reconCost: 3200 },
  { id: 'STK-011', vin: '3FA6P0G76PR001111', year: 2023, make: 'Ford', model: 'Fusion', trim: 'SE', mileage: 31200, color: 'Magnetic Gray', acquisitionCost: 17500, askingPrice: 21995, status: 'frontline', daysOnLot: 28, source: 'auction-adesa', acquiredDate: '2026-03-04', reconCost: 700 },
  { id: 'STK-012', vin: 'WAUENAF42PA001212', year: 2023, make: 'Audi', model: 'A4', trim: 'Premium', mileage: 20800, color: 'Glacier White', acquisitionCost: 30200, askingPrice: 36495, status: 'frontline', daysOnLot: 14, source: 'private-party', acquiredDate: '2026-03-18', reconCost: 500 },
  { id: 'STK-013', vin: '1G1YY22G965001313', year: 2021, make: 'Chevrolet', model: 'Corvette', trim: 'Stingray', mileage: 18900, color: 'Torch Red', acquisitionCost: 52000, askingPrice: 59995, status: 'frontline', daysOnLot: 35, source: 'private-party', acquiredDate: '2026-02-25', reconCost: 800 },
  { id: 'STK-014', vin: '5YFBURHE1PP001414', year: 2024, make: 'Toyota', model: 'RAV4', trim: 'XLE', mileage: 8900, color: 'Blueprint', acquisitionCost: 28800, askingPrice: 33995, status: 'frontline', daysOnLot: 6, source: 'trade-in', acquiredDate: '2026-03-26', reconCost: 200 },
  { id: 'STK-015', vin: '1FMCU9GD6PU001515', year: 2022, make: 'Ford', model: 'Escape', trim: 'SEL', mileage: 36700, color: 'Carbonized Gray', acquisitionCost: 21000, askingPrice: 25495, status: 'in-recon', daysOnLot: 4, source: 'auction-manheim', acquiredDate: '2026-03-28', reconCost: 0 },
  { id: 'STK-016', vin: 'KM8J3CA46PU001616', year: 2023, make: 'Hyundai', model: 'Tucson', trim: 'SEL', mileage: 27400, color: 'Amazon Gray', acquisitionCost: 23500, askingPrice: 28495, status: 'sold', daysOnLot: 11, source: 'auction-adesa', acquiredDate: '2026-03-12', reconCost: 650 },
  { id: 'STK-017', vin: '1G1ZT53846F001717', year: 2021, make: 'Chevrolet', model: 'Malibu', trim: 'LT', mileage: 48900, color: 'Mosaic Black', acquisitionCost: 15200, askingPrice: 18995, status: 'aged', daysOnLot: 85, source: 'auction-manheim', acquiredDate: '2026-01-07', reconCost: 1800 },
  { id: 'STK-018', vin: 'JM3KFBDM6P0001818', year: 2023, make: 'Mazda', model: 'CX-5', trim: 'Preferred', mileage: 24600, color: 'Soul Red', acquisitionCost: 24800, askingPrice: 29995, status: 'frontline', daysOnLot: 20, source: 'trade-in', acquiredDate: '2026-03-12', reconCost: 550 },
  { id: 'STK-019', vin: 'WDDWJ8EB1PA001919', year: 2022, make: 'Mercedes-Benz', model: 'C300', trim: '4MATIC', mileage: 29400, color: 'Polar White', acquisitionCost: 33500, askingPrice: 39995, status: 'frontline', daysOnLot: 25, source: 'auction-manheim', acquiredDate: '2026-03-07', reconCost: 1100 },
  { id: 'STK-020', vin: '19XFC2F59PE002020', year: 2023, make: 'Honda', model: 'Civic', trim: 'EX', mileage: 19800, color: 'Sonic Gray', acquisitionCost: 21000, askingPrice: 25495, status: 'sold', daysOnLot: 7, source: 'trade-in', acquiredDate: '2026-03-18', reconCost: 300 },
];
