import { DEALS, DEAL_STATUS_COLORS, VEHICLES, CUSTOMERS, TIER_COLORS, TIER_LABELS } from '@/data/lotos';
import { StatusBadge } from './StatusBadge';

interface DealDetailProps {
  dealId: string;
  onVehicleClick?: (vehicleId: string) => void;
  onCustomerClick?: (customerId: string) => void;
}

export function DealDetail({ dealId, onVehicleClick, onCustomerClick }: DealDetailProps) {
  const deal = DEALS.find(d => d.id === dealId);
  if (!deal) return <p style={{ color: '#57534E' }}>Deal not found</p>;

  const vehicle = VEHICLES.find(v => v.id === deal.vehicleId);
  const customer = CUSTOMERS.find(c => c.id === deal.customerId);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold" style={{ color: '#1C1917' }}>{deal.id}</span>
          <StatusBadge label={deal.status} color={DEAL_STATUS_COLORS[deal.status]} />
          <StatusBadge label={deal.type} color="#6B7280" />
        </div>
      </div>

      {vehicle && (
        <div
          className="rounded-lg p-4 cursor-pointer hover:shadow-sm transition-shadow"
          style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}
          onClick={() => onVehicleClick?.(vehicle.id)}
        >
          <h3 className="text-sm font-bold mb-1" style={{ color: '#1C1917' }}>Vehicle</h3>
          <p className="text-sm font-medium" style={{ color: '#2563EB' }}>{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}</p>
          <p className="text-xs" style={{ color: '#78716C' }}>{vehicle.id} · {vehicle.color} · {vehicle.mileage.toLocaleString()} mi</p>
        </div>
      )}

      {customer && (
        <div
          className="rounded-lg p-4 cursor-pointer hover:shadow-sm transition-shadow"
          style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}
          onClick={() => onCustomerClick?.(customer.id)}
        >
          <h3 className="text-sm font-bold mb-1" style={{ color: '#1C1917' }}>Customer</h3>
          <p className="text-sm font-medium" style={{ color: '#2563EB' }}>{customer.firstName} {customer.lastName}</p>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge label={TIER_LABELS[customer.creditTier]} color={TIER_COLORS[customer.creditTier]} />
            <span className="text-xs" style={{ color: '#78716C' }}>{customer.phone}</span>
          </div>
        </div>
      )}

      <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}>
        <h3 className="text-sm font-bold mb-2" style={{ color: '#1C1917' }}>Deal Structure</h3>
        <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: '#57534E' }}>
          <div>Sale Price: <span className="font-bold" style={{ color: '#1C1917' }}>${deal.salePrice.toLocaleString()}</span></div>
          <div>Trade: <span className="font-bold" style={{ color: '#1C1917' }}>${deal.tradeAllowance.toLocaleString()}</span></div>
          <div>Down: <span className="font-bold" style={{ color: '#1C1917' }}>${deal.downPayment.toLocaleString()}</span></div>
          <div>Financed: <span className="font-bold" style={{ color: '#1C1917' }}>${(deal.salePrice - deal.tradeAllowance - deal.downPayment).toLocaleString()}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <p className="text-xs font-semibold" style={{ color: '#78716C' }}>Front</p>
          <p className="text-lg font-bold" style={{ color: '#16A34A' }}>${deal.frontGross.toLocaleString()}</p>
        </div>
        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <p className="text-xs font-semibold" style={{ color: '#78716C' }}>F&amp;I</p>
          <p className="text-lg font-bold" style={{ color: '#2563EB' }}>${deal.fniGross.toLocaleString()}</p>
        </div>
        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}>
          <p className="text-xs font-semibold" style={{ color: '#78716C' }}>Total</p>
          <p className="text-lg font-bold" style={{ color: '#1C1917' }}>${deal.totalGross.toLocaleString()}</p>
        </div>
      </div>

      <div className="text-sm" style={{ color: '#57534E' }}>
        <div><span className="font-semibold">Lender:</span> {deal.lender}</div>
        <div><span className="font-semibold">Closed:</span> {deal.closedDate}</div>
        {deal.fundedDate && <div><span className="font-semibold">Funded:</span> {deal.fundedDate} ({deal.daysToFund}d)</div>}
      </div>
    </div>
  );
}
