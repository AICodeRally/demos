'use client';

import { useState } from 'react';
import {
  LISTINGS,
  VEHICLES,
  MARKETPLACE_LABELS,
  MARKETPLACE_COLORS,
  LISTING_STATUS_COLORS,
  INVENTORY_SOURCES,
  type MarketplaceId,
} from '@/data/lotos';
import { StatCard, DetailPanel, VehicleDetail, DealDetail, Toast } from '@/components/demos/lotos';

type PanelEntity = { type: 'vehicle' | 'deal'; id: string } | null;

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

function buildInitialSync(): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const l of LISTINGS) {
    map[l.id] = l.status === 'active';
  }
  return map;
}

const SOURCE_COLORS: Record<string, string> = {
  auction: '#2563EB',
  'trade-in': '#16A34A',
  'private-party': '#7C3AED',
  'dealer-trade': '#D97706',
};

export default function LotosMarketplacePage() {
  const [panelEntity, setPanelEntity] = useState<PanelEntity>(null);
  const [syncStatus, setSyncStatus] = useState<Record<string, boolean>>(buildInitialSync);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const getVehicle = (vehicleId: string) => VEHICLES.find((v) => v.id === vehicleId);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Marketplace Sync
        </h1>
        <p style={{ color: '#57534E', fontSize: '16px', marginTop: '4px' }}>
          Listing health, views, and leads across all marketplaces
        </p>
      </div>

      <div className="rounded-xl bg-white border p-6" style={{ borderColor: '#E7E5E4', marginBottom: '28px' }}>
        <h2 className="text-xl font-bold" style={{ color: '#1C1917', marginBottom: '16px' }}>
          Acquisition Source ROI
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {INVENTORY_SOURCES.map((src) => (
            <StatCard
              key={src.id}
              label={src.name}
              value={`$${src.avgSpread.toLocaleString()}`}
              trendValue={`${src.unitsThisMonth} units/mo`}
              trend="up"
              color={SOURCE_COLORS[src.type] || '#1E3A5F'}
            />
          ))}
        </div>
      </div>

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
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#1C1917' }}>{mpListings.length}</div>
                  <div style={{ fontSize: '14px', color: '#78716C', fontWeight: 600 }}>Active</div>
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#1C1917' }}>{totalViews.toLocaleString()}</div>
                  <div style={{ fontSize: '14px', color: '#78716C', fontWeight: 600 }}>Views</div>
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#16A34A' }}>{totalLeads}</div>
                  <div style={{ fontSize: '14px', color: '#78716C', fontWeight: 600 }}>Leads</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {MARKETPLACES.map((mp) => {
          const mpListings = LISTINGS.filter((l) => l.marketplace === mp);
          if (mpListings.length === 0) return null;
          const color = MARKETPLACE_COLORS[mp];

          return (
            <div key={mp}>
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

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '14px',
                }}
              >
                {mpListings.map((listing) => {
                  const vehicle = getVehicle(listing.vehicleId);
                  const isSynced = syncStatus[listing.id] ?? false;
                  const displayStatusColor = isSynced
                    ? LISTING_STATUS_COLORS['active']
                    : '#6B7280';
                  const displayStatusLabel = isSynced ? 'Active' : 'Paused';

                  return (
                    <div
                      key={listing.id}
                      className="rounded-xl bg-white border p-5"
                      style={{ borderColor: '#E7E5E4', cursor: 'pointer' }}
                      onClick={() => setPanelEntity({ type: 'vehicle', id: listing.vehicleId })}
                    >
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                            style={{
                              background: displayStatusColor + '20',
                              color: displayStatusColor,
                              border: `1px solid ${displayStatusColor}40`,
                            }}
                          >
                            {displayStatusLabel}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newVal = !isSynced;
                              setSyncStatus((prev) => ({ ...prev, [listing.id]: newVal }));
                              setToastMsg(
                                `${listing.vehicleId} on ${MARKETPLACE_LABELS[mp]}: ${newVal ? 'Activated' : 'Paused'}`
                              );
                            }}
                            style={{
                              width: '36px',
                              height: '20px',
                              borderRadius: '10px',
                              border: 'none',
                              background: isSynced ? '#16A34A' : '#D1D5DB',
                              position: 'relative',
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                            }}
                          >
                            <div
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: '#FFFFFF',
                                position: 'absolute',
                                top: '2px',
                                left: isSynced ? '18px' : '2px',
                                transition: 'left 0.2s',
                              }}
                            />
                          </button>
                        </div>
                      </div>

                      {vehicle && (
                        <div style={{ fontSize: '14px', color: '#57534E', marginBottom: '12px' }}>
                          {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                        </div>
                      )}

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
                          <div style={{ fontSize: '14px', color: '#78716C' }}>Views</div>
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
                          <div style={{ fontSize: '14px', color: '#78716C' }}>Leads</div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderTop: '1px solid #F1F5F9',
                          paddingTop: '8px',
                          fontSize: '14px',
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

      <DetailPanel open={!!panelEntity} onClose={() => setPanelEntity(null)} title={panelEntity?.type === 'vehicle' ? 'Vehicle Details' : 'Deal Details'}>
        {panelEntity?.type === 'vehicle' && <VehicleDetail vehicleId={panelEntity.id} onDealClick={(id) => setPanelEntity({ type: 'deal', id })} />}
        {panelEntity?.type === 'deal' && <DealDetail dealId={panelEntity.id} onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })} />}
      </DetailPanel>

      {toastMsg && <Toast message={toastMsg} type="info" onDismiss={() => setToastMsg(null)} />}
    </div>
  );
}
