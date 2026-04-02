'use client';

import {
  LISTINGS,
  VEHICLES,
  MARKETPLACE_LABELS,
  MARKETPLACE_COLORS,
  LISTING_STATUS_COLORS,
  type MarketplaceId,
  type ListingStatus,
} from '@/data/lotos';

const MARKETPLACES: MarketplaceId[] = ['autotrader', 'cargurus', 'facebook', 'carscom'];

function relativeTime(isoString: string): string {
  const now = new Date('2026-04-01T10:00:00Z').getTime();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default function LotosMarketplacePage() {
  const getVehicle = (vehicleId: string) => VEHICLES.find((v) => v.id === vehicleId);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Marketplace Sync
        </h1>
        <p style={{ color: '#57534E', fontSize: '16px', marginTop: '4px' }}>
          Listing health, views, and leads across all marketplaces
        </p>
      </div>

      {/* Marketplace Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {MARKETPLACES.map((mp) => {
          const mpListings = LISTINGS.filter((l) => l.marketplace === mp && l.status === 'active');
          const totalViews = mpListings.reduce((sum, l) => sum + l.views, 0);
          const totalLeads = mpListings.reduce((sum, l) => sum + l.leads, 0);
          const color = MARKETPLACE_COLORS[mp];

          return (
            <div
              key={mp}
              className="rounded-xl bg-white border p-6"
              style={{
                borderColor: '#E7E5E4',
                borderTopWidth: '4px',
                borderTopColor: color,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '16px', color: color, marginBottom: '12px' }}>
                {MARKETPLACE_LABELS[mp]}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#1C1917' }}>
                    {mpListings.length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#78716C', fontWeight: 600 }}>Active</div>
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#1C1917' }}>
                    {totalViews.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#78716C', fontWeight: 600 }}>Views</div>
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#16A34A' }}>
                    {totalLeads}
                  </div>
                  <div style={{ fontSize: '12px', color: '#78716C', fontWeight: 600 }}>Leads</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Listings grouped by Marketplace */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {MARKETPLACES.map((mp) => {
          const mpListings = LISTINGS.filter((l) => l.marketplace === mp);
          if (mpListings.length === 0) return null;
          const color = MARKETPLACE_COLORS[mp];

          return (
            <div key={mp}>
              {/* Section Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '14px',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: color,
                    flexShrink: 0,
                  }}
                />
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1C1917' }}>
                  {MARKETPLACE_LABELS[mp]}
                </h2>
                <span style={{ fontSize: '14px', color: '#78716C' }}>
                  ({mpListings.length} listing{mpListings.length !== 1 ? 's' : ''})
                </span>
              </div>

              {/* Listing Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '14px',
                }}
              >
                {mpListings.map((listing) => {
                  const vehicle = getVehicle(listing.vehicleId);
                  const statusColor = LISTING_STATUS_COLORS[listing.status];

                  return (
                    <div
                      key={listing.id}
                      className="rounded-xl bg-white border p-5"
                      style={{ borderColor: '#E7E5E4' }}
                    >
                      {/* Top row: stock # + status */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#1C1917' }}>
                          {listing.vehicleId}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                          style={{
                            background: statusColor + '20',
                            color: statusColor,
                            border: `1px solid ${statusColor}40`,
                            textTransform: 'capitalize',
                          }}
                        >
                          {listing.status}
                        </span>
                      </div>

                      {/* Vehicle label */}
                      {vehicle && (
                        <div style={{ fontSize: '14px', color: '#57534E', marginBottom: '12px' }}>
                          {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                        </div>
                      )}

                      {/* Stats */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px',
                          marginBottom: '10px',
                        }}
                      >
                        <div
                          style={{
                            background: '#F8FAFC',
                            borderRadius: '6px',
                            padding: '8px',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '18px', fontWeight: 700, color: '#1C1917' }}>
                            {listing.views.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '12px', color: '#78716C' }}>Views</div>
                        </div>
                        <div
                          style={{
                            background: '#F0FDF4',
                            borderRadius: '6px',
                            padding: '8px',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '18px', fontWeight: 700, color: '#16A34A' }}>
                            {listing.leads}
                          </div>
                          <div style={{ fontSize: '12px', color: '#78716C' }}>Leads</div>
                        </div>
                      </div>

                      {/* Footer: days listed + last synced */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderTop: '1px solid #F1F5F9',
                          paddingTop: '8px',
                          fontSize: '12px',
                          color: '#78716C',
                        }}
                      >
                        <span>{listing.daysListed}d listed</span>
                        <span>Synced {relativeTime(listing.lastSynced)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
