'use client';

import { useState, useMemo } from 'react';
import { VEHICLES, CUSTOMERS } from '@/data/lotos';
import { DataTable, DetailPanel, CustomerDetail, VehicleDetail, DealDetail, type Column } from '@/components/demos/lotos';

type Outcome = 'purchased' | 'interested' | 'follow-up' | 'not-interested';

interface TestDrive {
  date: string;
  customer: string;
  vehicle: string;
  salesperson: string;
  duration: string;
  outcome: Outcome;
}

const TEST_DRIVES: TestDrive[] = [
  { date: '2026-03-31', customer: 'Nicole Anderson', vehicle: 'STK-018', salesperson: 'Jake Moreno', duration: '35 min', outcome: 'interested' },
  { date: '2026-03-30', customer: 'David Thompson', vehicle: 'STK-013', salesperson: 'Jake Moreno', duration: '45 min', outcome: 'purchased' },
  { date: '2026-03-29', customer: 'Ashley Brown', vehicle: 'STK-011', salesperson: 'Lisa Park', duration: '30 min', outcome: 'interested' },
  { date: '2026-03-28', customer: 'Jennifer Lee', vehicle: 'STK-020', salesperson: 'Lisa Park', duration: '25 min', outcome: 'purchased' },
  { date: '2026-03-27', customer: 'Tyler Jackson', vehicle: 'STK-008', salesperson: 'Jake Moreno', duration: '20 min', outcome: 'follow-up' },
  { date: '2026-03-26', customer: 'Robert Martinez', vehicle: 'STK-017', salesperson: 'Lisa Park', duration: '30 min', outcome: 'purchased' },
  { date: '2026-03-25', customer: 'Marcus Rivera', vehicle: 'STK-016', salesperson: 'Jake Moreno', duration: '40 min', outcome: 'purchased' },
  { date: '2026-03-24', customer: 'Sarah Chen', vehicle: 'STK-009', salesperson: 'Lisa Park', duration: '35 min', outcome: 'purchased' },
  { date: '2026-03-23', customer: 'Maria Gonzalez', vehicle: 'STK-003', salesperson: 'Jake Moreno', duration: '25 min', outcome: 'not-interested' },
  { date: '2026-03-22', customer: 'James Wilson', vehicle: 'STK-002', salesperson: 'Lisa Park', duration: '30 min', outcome: 'follow-up' },
];

const OUTCOME_CONFIG: Record<Outcome, { label: string; color: string; bg: string }> = {
  purchased: { label: 'Purchased', color: '#16A34A', bg: '#F0FDF4' },
  interested: { label: 'Interested', color: '#2563EB', bg: '#EFF6FF' },
  'follow-up': { label: 'Follow-up Scheduled', color: '#D97706', bg: '#FFFBEB' },
  'not-interested': { label: 'Not Interested', color: '#6B7280', bg: '#F9FAFB' },
};

const ALL_OUTCOMES: Outcome[] = ['purchased', 'interested', 'follow-up', 'not-interested'];
const SALESPEOPLE = ['Jake Moreno', 'Lisa Park'];

function getVehicleLabel(stockId: string): string {
  const v = VEHICLES.find((v) => v.id === stockId);
  if (!v) return stockId;
  return `${v.year} ${v.make} ${v.model} ${v.trim}`;
}

function findCustomerByName(name: string): string | null {
  const parts = name.split(' ');
  if (parts.length < 2) return null;
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  const c = CUSTOMERS.find(c => c.firstName === firstName && c.lastName === lastName);
  return c ? c.id : null;
}

export default function TestDrivesPage() {
  const [outcomeFilter, setOutcomeFilter] = useState<Outcome | 'all'>('all');
  const [salespersonFilter, setSalespersonFilter] = useState<string>('all');
  const [panelEntity, setPanelEntity] = useState<{ type: 'customer' | 'vehicle' | 'deal'; id: string } | null>(null);

  const totalDrives = TEST_DRIVES.length;
  const purchased = TEST_DRIVES.filter((d) => d.outcome === 'purchased').length;
  const conversionRate = Math.round((purchased / totalDrives) * 100);

  const totalMinutes = TEST_DRIVES.reduce((sum, d) => {
    return sum + parseInt(d.duration);
  }, 0);
  const avgMinutes = Math.round(totalMinutes / totalDrives);

  const outcomeCounts = TEST_DRIVES.reduce<Record<Outcome, number>>(
    (acc, d) => { acc[d.outcome] = (acc[d.outcome] || 0) + 1; return acc; },
    { purchased: 0, interested: 0, 'follow-up': 0, 'not-interested': 0 }
  );

  const filteredDrives = useMemo(() => {
    return TEST_DRIVES.filter(d => {
      const matchOutcome = outcomeFilter === 'all' || d.outcome === outcomeFilter;
      const matchSalesperson = salespersonFilter === 'all' || d.salesperson === salespersonFilter;
      return matchOutcome && matchSalesperson;
    });
  }, [outcomeFilter, salespersonFilter]);

  const columns: Column<TestDrive>[] = [
    {
      key: 'date',
      label: 'Date',
      width: '120px',
      render: (row) => <span style={{ color: '#57534E' }}>{row.date}</span>,
      sortFn: (a, b) => a.date.localeCompare(b.date),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => <span className="font-semibold" style={{ color: '#1C1917' }}>{row.customer}</span>,
      sortFn: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      render: (row) => (
        <div>
          <p className="font-medium" style={{ color: '#1C1917' }}>{getVehicleLabel(row.vehicle)}</p>
          <p className="text-xs" style={{ color: '#78716C' }}>{row.vehicle}</p>
        </div>
      ),
      sortFn: (a, b) => a.vehicle.localeCompare(b.vehicle),
    },
    {
      key: 'salesperson',
      label: 'Salesperson',
      render: (row) => <span style={{ color: '#57534E' }}>{row.salesperson}</span>,
      sortFn: (a, b) => a.salesperson.localeCompare(b.salesperson),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (row) => <span style={{ color: '#57534E' }}>{row.duration}</span>,
      sortFn: (a, b) => parseInt(a.duration) - parseInt(b.duration),
    },
    {
      key: 'outcome',
      label: 'Outcome',
      render: (row) => {
        const cfg = OUTCOME_CONFIG[row.outcome];
        return (
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}20` }}
          >
            {cfg.label}
          </span>
        );
      },
      sortFn: (a, b) => a.outcome.localeCompare(b.outcome),
    },
  ];

  function handleRowClick(row: TestDrive) {
    const customerId = findCustomerByName(row.customer);
    if (customerId) {
      setPanelEntity({ type: 'customer', id: customerId });
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1C1917' }}>
          Test Drive Log
        </h1>
        <p className="mt-1 text-base" style={{ color: '#57534E' }}>
          {totalDrives} test drives recorded - March 2026
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Total Drives (March)
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>
            {totalDrives}
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>this month</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Conversion Rate
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#16A34A' }}>
            {conversionRate}%
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>{purchased} purchased after drive</p>
        </div>
        <div className="rounded-xl bg-white border p-5" style={{ borderColor: '#E7E5E4' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
            Avg Test Drive Time
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: '#2563EB' }}>
            {avgMinutes} min
          </p>
          <p className="text-sm mt-1" style={{ color: '#57534E' }}>per customer</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {(Object.entries(OUTCOME_CONFIG) as [Outcome, typeof OUTCOME_CONFIG[Outcome]][]).map(([outcome, cfg]) => (
          <div
            key={outcome}
            className="rounded-xl border p-4"
            style={{ backgroundColor: cfg.bg, borderColor: '#E7E5E4' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#78716C' }}>
              {cfg.label}
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: cfg.color }}>
              {outcomeCounts[outcome as Outcome]}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setOutcomeFilter('all')}
            className="rounded-full px-4 py-2 text-sm font-semibold border transition-colors"
            style={{
              backgroundColor: outcomeFilter === 'all' ? '#1E3A5F' : '#FFFFFF',
              color: outcomeFilter === 'all' ? '#FFFFFF' : '#1E3A5F',
              borderColor: '#1E3A5F',
            }}
          >
            All ({totalDrives})
          </button>
          {ALL_OUTCOMES.map(outcome => {
            const cfg = OUTCOME_CONFIG[outcome];
            const isActive = outcomeFilter === outcome;
            return (
              <button
                key={outcome}
                onClick={() => setOutcomeFilter(outcome)}
                className="rounded-full px-4 py-2 text-sm font-semibold border transition-colors"
                style={{
                  backgroundColor: isActive ? cfg.color : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : cfg.color,
                  borderColor: cfg.color,
                }}
              >
                {cfg.label} ({outcomeCounts[outcome]})
              </button>
            );
          })}
        </div>
        <select
          value={salespersonFilter}
          onChange={(e) => setSalespersonFilter(e.target.value)}
          className="rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          style={{ borderColor: '#E7E5E4', color: '#1C1917' }}
        >
          <option value="all">All Salespeople</option>
          {SALESPEOPLE.map(sp => (
            <option key={sp} value={sp}>{sp}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl bg-white border overflow-hidden" style={{ borderColor: '#E7E5E4' }}>
        <DataTable
          columns={columns}
          data={filteredDrives}
          onRowClick={handleRowClick}
          keyFn={(row) => `${row.date}-${row.customer}`}
        />
      </div>

      <DetailPanel
        open={!!panelEntity}
        onClose={() => setPanelEntity(null)}
        title={panelEntity?.type === 'customer' ? 'Customer Details' : panelEntity?.type === 'vehicle' ? 'Vehicle Details' : 'Deal Details'}
      >
        {panelEntity?.type === 'customer' && (
          <CustomerDetail
            customerId={panelEntity.id}
            onDealClick={(id) => setPanelEntity({ type: 'deal', id })}
            onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })}
          />
        )}
        {panelEntity?.type === 'vehicle' && (
          <VehicleDetail
            vehicleId={panelEntity.id}
            onDealClick={(id) => setPanelEntity({ type: 'deal', id })}
          />
        )}
        {panelEntity?.type === 'deal' && (
          <DealDetail
            dealId={panelEntity.id}
            onVehicleClick={(id) => setPanelEntity({ type: 'vehicle', id })}
            onCustomerClick={(id) => setPanelEntity({ type: 'customer', id })}
          />
        )}
      </DetailPanel>
    </div>
  );
}
