export type ReconStatus = 'needs-assessment' | 'parts-ordered' | 'in-shop' | 'qc' | 'complete';

export interface ReconOrder {
  id: string;
  vehicleId: string;
  status: ReconStatus;
  items: string[];
  estimatedCost: number;
  actualCost: number | null;
  startDate: string;
  completedDate: string | null;
  cycleDays: number;
  assignedTo: string;
}

export const RECON_STATUS_COLORS: Record<ReconStatus, string> = {
  'needs-assessment': '#6B7280',
  'parts-ordered': '#D97706',
  'in-shop': '#2563EB',
  qc: '#7C3AED',
  complete: '#16A34A',
};

export const RECON_STATUS_LABELS: Record<ReconStatus, string> = {
  'needs-assessment': 'Needs Assessment',
  'parts-ordered': 'Parts Ordered',
  'in-shop': 'In Shop',
  qc: 'Quality Check',
  complete: 'Complete',
};

export const RECON_ORDERS: ReconOrder[] = [
  { id: 'REC-001', vehicleId: 'STK-003', status: 'in-shop', items: ['Oil change', 'Brake pads (front)', 'Detail'], estimatedCost: 1200, actualCost: null, startDate: '2026-03-28', completedDate: null, cycleDays: 4, assignedTo: 'Mike Torres' },
  { id: 'REC-002', vehicleId: 'STK-008', status: 'needs-assessment', items: ['Inspection pending'], estimatedCost: 0, actualCost: null, startDate: '2026-03-30', completedDate: null, cycleDays: 2, assignedTo: 'Unassigned' },
  { id: 'REC-003', vehicleId: 'STK-015', status: 'parts-ordered', items: ['Timing belt', 'Water pump', 'Serpentine belt'], estimatedCost: 1800, actualCost: null, startDate: '2026-03-29', completedDate: null, cycleDays: 3, assignedTo: 'Mike Torres' },
  { id: 'REC-004', vehicleId: 'STK-001', status: 'complete', items: ['Oil change', 'Tire rotation', 'Detail', 'Touch-up paint'], estimatedCost: 850, actualCost: 850, startDate: '2026-03-16', completedDate: '2026-03-19', cycleDays: 3, assignedTo: 'Carlos Ruiz' },
  { id: 'REC-005', vehicleId: 'STK-005', status: 'complete', items: ['Transmission flush', 'Brake rotors (all)', 'AC recharge', 'Detail'], estimatedCost: 2000, actualCost: 2100, startDate: '2026-01-24', completedDate: '2026-01-28', cycleDays: 4, assignedTo: 'Mike Torres' },
  { id: 'REC-006', vehicleId: 'STK-010', status: 'complete', items: ['Engine tune-up', 'Suspension work', 'New tires (4)', 'Full detail'], estimatedCost: 3000, actualCost: 3200, startDate: '2026-01-22', completedDate: '2026-01-27', cycleDays: 5, assignedTo: 'Carlos Ruiz' },
  { id: 'REC-007', vehicleId: 'STK-002', status: 'complete', items: ['Oil change', 'Bed liner touch-up', 'Detail'], estimatedCost: 1200, actualCost: 1200, startDate: '2026-03-22', completedDate: '2026-03-24', cycleDays: 2, assignedTo: 'Carlos Ruiz' },
];
