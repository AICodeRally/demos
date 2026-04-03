import { VEHICLES, STATUS_COLORS, STATUS_LABELS, RECON_ORDERS, LISTINGS, MARKETPLACE_LABELS, DEALS, CUSTOMERS } from '@/data/lotos';
import { StatusBadge } from './StatusBadge';

interface VehicleDetailProps {
  vehicleId: string;
  onDealClick?: (dealId: string) => void;
}

export function VehicleDetail({ vehicleId, onDealClick }: VehicleDetailProps) {
  const vehicle = VEHICLES.find(v => v.id === vehicleId);
  if (!vehicle) return <p style={{ color: 'var(--lot-text-secondary)' }}>Vehicle not found</p>;

  const recon = RECON_ORDERS.filter(r => r.vehicleId === vehicleId);
  const listings = LISTINGS.filter(l => l.vehicleId === vehicleId);
  const deals = DEALS.filter(d => d.vehicleId === vehicleId);

  const spread = vehicle.askingPrice - vehicle.acquisitionCost - vehicle.reconCost;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="lot-subheading">{vehicle.year} {vehicle.make} {vehicle.model}</span>
          <StatusBadge label={STATUS_LABELS[vehicle.status]} color={STATUS_COLORS[vehicle.status]} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm" style={{ color: 'var(--lot-text-secondary)' }}>
          <div><span className="font-semibold">Stock #:</span> {vehicle.id}</div>
          <div><span className="font-semibold">Trim:</span> {vehicle.trim}</div>
          <div><span className="font-semibold">Color:</span> {vehicle.color}</div>
          <div><span className="font-semibold">Mileage:</span> {vehicle.mileage.toLocaleString()} mi</div>
          <div><span className="font-semibold">VIN:</span> <span className="text-xs font-mono">{vehicle.vin}</span></div>
          <div><span className="font-semibold">Days on Lot:</span> {vehicle.daysOnLot}</div>
        </div>
      </div>

      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--lot-card-alt)', border: '1px solid var(--lot-border)' }}>
        <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--lot-text)' }}>Pricing</h3>
        <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: 'var(--lot-text-secondary)' }}>
          <div>Acquisition: <span className="font-bold" style={{ color: 'var(--lot-text)' }}>${vehicle.acquisitionCost.toLocaleString()}</span></div>
          <div>Recon: <span className="font-bold" style={{ color: 'var(--lot-text)' }}>${vehicle.reconCost.toLocaleString()}</span></div>
          <div>Asking: <span className="font-bold" style={{ color: 'var(--lot-text)' }}>${vehicle.askingPrice.toLocaleString()}</span></div>
          <div>Spread: <span className="font-bold" style={{ color: spread > 0 ? '#16A34A' : '#DC2626' }}>${spread.toLocaleString()}</span></div>
        </div>
      </div>

      {recon.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--lot-text)' }}>Recon History</h3>
          {recon.map(r => (
            <div key={r.id} className="rounded-lg p-3 mb-2" style={{ backgroundColor: 'var(--lot-card-alt)', border: '1px solid var(--lot-border)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: 'var(--lot-text-muted)' }}>{r.id}</span>
                <StatusBadge label={r.status.replace(/-/g, ' ')} color={r.status === 'complete' ? '#16A34A' : '#D97706'} />
              </div>
              <p className="text-sm" style={{ color: 'var(--lot-text-secondary)' }}>{r.items.join(', ')}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--lot-text-muted)' }}>{r.assignedTo} · {r.cycleDays}d cycle · ${(r.actualCost ?? r.estimatedCost).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {listings.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--lot-text)' }}>Marketplace Listings</h3>
          <div className="space-y-2">
            {listings.map(l => (
              <div key={l.id} className="flex items-center justify-between text-sm py-2 border-b" style={{ borderColor: 'var(--lot-border-faint)', color: 'var(--lot-text-secondary)' }}>
                <span className="font-medium">{MARKETPLACE_LABELS[l.marketplace]}</span>
                <span>{l.views} views · {l.leads} leads</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {deals.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--lot-text)' }}>Deals</h3>
          {deals.map(d => {
            const customer = CUSTOMERS.find(c => c.id === d.customerId);
            return (
              <div
                key={d.id}
                className="rounded-lg p-3 mb-2 cursor-pointer hover:shadow-sm transition-shadow"
                style={{ backgroundColor: 'var(--lot-card-alt)', border: '1px solid var(--lot-border)' }}
                onClick={() => onDealClick?.(d.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color: 'var(--lot-text)' }}>{d.id}</span>
                  <StatusBadge label={d.status} color={d.status === 'funded' ? '#16A34A' : d.status === 'pending' ? '#D97706' : '#2563EB'} />
                </div>
                {customer && <p className="text-xs mt-1" style={{ color: 'var(--lot-text-muted)' }}>{customer.firstName} {customer.lastName} · ${d.totalGross.toLocaleString()} gross</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
