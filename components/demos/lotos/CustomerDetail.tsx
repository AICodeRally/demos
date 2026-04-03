import { CUSTOMERS, TIER_COLORS, TIER_LABELS, DEALS, DEAL_STATUS_COLORS, VEHICLES } from '@/data/lotos';
import { StatusBadge } from './StatusBadge';

interface CustomerDetailProps {
  customerId: string;
  onDealClick?: (dealId: string) => void;
  onVehicleClick?: (vehicleId: string) => void;
}

export function CustomerDetail({ customerId, onDealClick, onVehicleClick }: CustomerDetailProps) {
  const customer = CUSTOMERS.find(c => c.id === customerId);
  if (!customer) return <p style={{ color: 'var(--lot-text-secondary)' }}>Customer not found</p>;

  const customerDeals = DEALS.filter(d => d.customerId === customerId);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="lot-subheading">{customer.firstName} {customer.lastName}</span>
          <StatusBadge label={TIER_LABELS[customer.creditTier]} color={TIER_COLORS[customer.creditTier]} />
        </div>
        <div className="space-y-2 text-sm" style={{ color: 'var(--lot-text-secondary)' }}>
          <div><span className="font-semibold">Phone:</span> {customer.phone}</div>
          <div><span className="font-semibold">Email:</span> {customer.email}</div>
          <div><span className="font-semibold">Lead Source:</span> {customer.leadSource}</div>
          <div><span className="font-semibold">Since:</span> {customer.createdDate}</div>
        </div>
      </div>

      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--lot-card-alt)', border: '1px solid var(--lot-border)' }}>
        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--lot-text)' }}>Notes</h3>
        <p className="text-sm" style={{ color: 'var(--lot-text-secondary)' }}>{customer.notes}</p>
      </div>

      {customerDeals.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--lot-text)' }}>Deals</h3>
          {customerDeals.map(d => {
            const vehicle = VEHICLES.find(v => v.id === d.vehicleId);
            return (
              <div
                key={d.id}
                className="rounded-lg p-3 mb-2 cursor-pointer hover:shadow-sm transition-shadow"
                style={{ backgroundColor: 'var(--lot-card-alt)', border: '1px solid var(--lot-border)' }}
                onClick={() => onDealClick?.(d.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color: 'var(--lot-text)' }}>{d.id}</span>
                  <StatusBadge label={d.status} color={DEAL_STATUS_COLORS[d.status]} />
                </div>
                {vehicle && (
                  <p
                    className="text-xs mt-1 cursor-pointer hover:underline"
                    style={{ color: '#2563EB' }}
                    onClick={(e) => { e.stopPropagation(); onVehicleClick?.(vehicle.id); }}
                  >
                    {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.id})
                  </p>
                )}
                <p className="text-xs mt-1" style={{ color: 'var(--lot-text-muted)' }}>${d.salePrice.toLocaleString()} · ${d.totalGross.toLocaleString()} gross</p>
              </div>
            );
          })}
        </div>
      )}

      {customerDeals.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--lot-text-faint)' }}>No deals yet</p>
      )}
    </div>
  );
}
