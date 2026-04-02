export type MarketplaceId = 'autotrader' | 'cargurus' | 'facebook' | 'carscom';
export type ListingStatus = 'active' | 'stale' | 'error' | 'sold';

export interface Listing {
  id: string;
  vehicleId: string;
  marketplace: MarketplaceId;
  status: ListingStatus;
  views: number;
  leads: number;
  daysListed: number;
  lastSynced: string;
}

export const MARKETPLACE_LABELS: Record<MarketplaceId, string> = {
  autotrader: 'AutoTrader',
  cargurus: 'CarGurus',
  facebook: 'Facebook Marketplace',
  carscom: 'Cars.com',
};

export const MARKETPLACE_COLORS: Record<MarketplaceId, string> = {
  autotrader: '#E85D2C',
  cargurus: '#16A34A',
  facebook: '#2563EB',
  carscom: '#7C3AED',
};

export const LISTING_STATUS_COLORS: Record<ListingStatus, string> = {
  active: '#16A34A',
  stale: '#D97706',
  error: '#DC2626',
  sold: '#6B7280',
};

export const LISTINGS: Listing[] = [
  { id: 'LST-001', vehicleId: 'STK-001', marketplace: 'autotrader', status: 'active', views: 342, leads: 8, daysListed: 12, lastSynced: '2026-04-01T08:00:00Z' },
  { id: 'LST-002', vehicleId: 'STK-001', marketplace: 'cargurus', status: 'active', views: 521, leads: 12, daysListed: 12, lastSynced: '2026-04-01T08:00:00Z' },
  { id: 'LST-003', vehicleId: 'STK-002', marketplace: 'autotrader', status: 'active', views: 289, leads: 6, daysListed: 8, lastSynced: '2026-04-01T08:00:00Z' },
  { id: 'LST-004', vehicleId: 'STK-002', marketplace: 'facebook', status: 'active', views: 1240, leads: 15, daysListed: 8, lastSynced: '2026-04-01T07:30:00Z' },
  { id: 'LST-005', vehicleId: 'STK-004', marketplace: 'cargurus', status: 'active', views: 890, leads: 22, daysListed: 22, lastSynced: '2026-04-01T08:00:00Z' },
  { id: 'LST-006', vehicleId: 'STK-005', marketplace: 'autotrader', status: 'stale', views: 156, leads: 2, daysListed: 68, lastSynced: '2026-03-28T12:00:00Z' },
  { id: 'LST-007', vehicleId: 'STK-006', marketplace: 'carscom', status: 'active', views: 412, leads: 9, daysListed: 15, lastSynced: '2026-04-01T08:00:00Z' },
  { id: 'LST-008', vehicleId: 'STK-007', marketplace: 'autotrader', status: 'active', views: 678, leads: 14, daysListed: 18, lastSynced: '2026-04-01T08:00:00Z' },
  { id: 'LST-009', vehicleId: 'STK-010', marketplace: 'facebook', status: 'stale', views: 89, leads: 1, daysListed: 72, lastSynced: '2026-03-25T10:00:00Z' },
  { id: 'LST-010', vehicleId: 'STK-013', marketplace: 'autotrader', status: 'active', views: 1520, leads: 28, daysListed: 35, lastSynced: '2026-04-01T08:00:00Z' },
  { id: 'LST-011', vehicleId: 'STK-013', marketplace: 'cargurus', status: 'active', views: 2100, leads: 35, daysListed: 35, lastSynced: '2026-04-01T08:00:00Z' },
  { id: 'LST-012', vehicleId: 'STK-014', marketplace: 'carscom', status: 'active', views: 356, leads: 7, daysListed: 6, lastSynced: '2026-04-01T08:00:00Z' },
];
