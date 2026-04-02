# LotOS Interactivity Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich all 24 LotOS pages with cross-linking detail panels, interactive controls (sort, filter, drag, edit), and wire in 2 unused data files — making the demo feel like a real application.

**Architecture:** Build a shared component library at `components/demos/lotos/` (StatCard, StatusBadge, DataTable, DetailPanel, entity detail views, MarkdownRenderer, Toast). Then sweep all 24 pages act-by-act, replacing inline patterns with shared components and adding interactivity per the design spec.

**Tech Stack:** Next.js 16 (App Router), TypeScript, React useState/useRef, Tailwind CSS, HTML5 Drag and Drop API, inline SVG sparklines. No external chart or state management libraries.

**Spec:** `docs/superpowers/specs/2026-04-02-lotos-interactivity-design.md`

**Repo:** `~/Development/aicr-demos/`

---

## File Structure

### New Files (shared components)
```
components/demos/lotos/
├── StatCard.tsx          — KPI card with optional sparkline
├── StatusBadge.tsx       — Colored pill badge
├── DataTable.tsx         — Sortable table with row click
├── DetailPanel.tsx       — Slide-in right panel
├── VehicleDetail.tsx     — Vehicle entity detail view
├── CustomerDetail.tsx    — Customer entity detail view
├── DealDetail.tsx        — Deal entity detail view
├── MarkdownRenderer.tsx  — Markdown-to-JSX renderer
├── Toast.tsx             — Notification toast
└── index.ts              — Barrel export
```

### Modified Files (data)
```
data/lotos/ai-responses.ts  — Add 2 new market-intel briefs (ai-007, ai-008)
```

### Modified Files (pages — all 24)
```
app/(demos)/lotos/lot/dashboard/page.tsx
app/(demos)/lotos/lot/inventory/page.tsx
app/(demos)/lotos/lot/recon/page.tsx
app/(demos)/lotos/lot/marketplace/page.tsx
app/(demos)/lotos/sales/crm/page.tsx
app/(demos)/lotos/sales/pipeline/page.tsx
app/(demos)/lotos/sales/appointments/page.tsx
app/(demos)/lotos/sales/test-drives/page.tsx
app/(demos)/lotos/deals/desking/page.tsx
app/(demos)/lotos/deals/fni/page.tsx
app/(demos)/lotos/deals/lenders/page.tsx
app/(demos)/lotos/deals/contracting/page.tsx
app/(demos)/lotos/office/accounting/page.tsx
app/(demos)/lotos/office/floorplan/page.tsx
app/(demos)/lotos/office/title-dmv/page.tsx
app/(demos)/lotos/office/compliance/page.tsx
app/(demos)/lotos/command/kpis/page.tsx
app/(demos)/lotos/command/pricing/page.tsx
app/(demos)/lotos/command/cashflow/page.tsx
app/(demos)/lotos/command/aging/page.tsx
app/(demos)/lotos/intelligence/chat/page.tsx
app/(demos)/lotos/intelligence/deal-optimizer/page.tsx
app/(demos)/lotos/intelligence/acquisition/page.tsx
app/(demos)/lotos/intelligence/market-intel/page.tsx
```

---

## Task 1: Core Shared Components

**Files:**
- Create: `components/demos/lotos/StatCard.tsx`
- Create: `components/demos/lotos/StatusBadge.tsx`
- Create: `components/demos/lotos/Toast.tsx`
- Create: `components/demos/lotos/MarkdownRenderer.tsx`

- [ ] **Step 1: Create `components/demos/lotos/StatCard.tsx`**

```typescript
'use client';

interface StatCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: string;
  sparkline?: number[];
  onClick?: () => void;
}

function buildSparklinePath(values: number[], width: number, height: number): string {
  if (values.length < 2) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  return values
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(' ');
}

export function StatCard({ label, value, trend, trendValue, color = '#1E3A5F', sparkline, onClick }: StatCardProps) {
  return (
    <div
      className={`rounded-xl bg-white border p-5 relative overflow-hidden${onClick ? ' cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      style={{ borderColor: '#E7E5E4', borderLeft: `4px solid ${color}` }}
      onClick={onClick}
    >
      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C' }}>{label}</p>
      <p className="text-3xl font-bold mt-1" style={{ color: '#1C1917' }}>{value}</p>
      {trend && trendValue && (
        <p className="text-sm mt-1 font-medium" style={{ color: trend === 'up' ? '#16A34A' : '#DC2626' }}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </p>
      )}
      {sparkline && sparkline.length > 1 && (
        <svg className="absolute bottom-3 right-3" width="80" height="28" viewBox="0 80 28">
          <polyline
            points={buildSparklinePath(sparkline, 80, 28)}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.5}
          />
        </svg>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `components/demos/lotos/StatusBadge.tsx`**

```typescript
interface StatusBadgeProps {
  label: string;
  color: string;
  onClick?: () => void;
}

export function StatusBadge({ label, color, onClick }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold${onClick ? ' cursor-pointer hover:opacity-80' : ''}`}
      style={{ backgroundColor: `${color}18`, color }}
      onClick={onClick}
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 3: Create `components/demos/lotos/Toast.tsx`**

```typescript
'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info';
  onDismiss: () => void;
}

export function Toast({ message, type = 'success', onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor = type === 'success' ? '#16A34A' : '#2563EB';

  return (
    <div
      className="fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-white text-sm font-medium shadow-lg transition-all duration-300"
      style={{
        backgroundColor: bgColor,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      {message}
    </div>
  );
}
```

- [ ] **Step 4: Create `components/demos/lotos/MarkdownRenderer.tsx`**

This is the most complex markdown renderer from the acquisition page, generalized:

```typescript
interface MarkdownRendererProps {
  text: string;
}

function renderInline(text: string): (string | JSX.Element)[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#1C1917' }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function MarkdownRenderer({ text }: MarkdownRendererProps) {
  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let tableLines: string[] = [];
  let listBuffer: { type: 'ol' | 'ul'; items: string[] } | null = null;

  function flushList() {
    if (!listBuffer) return;
    const Tag = listBuffer.type;
    elements.push(
      <Tag key={elements.length} className={`${Tag === 'ol' ? 'list-decimal' : 'list-disc'} ml-5 mt-2 space-y-1`} style={{ color: '#57534E' }}>
        {listBuffer.items.map((item, i) => (
          <li key={i} className="text-sm" style={{ fontSize: '14px' }}>{renderInline(item)}</li>
        ))}
      </Tag>
    );
    listBuffer = null;
  }

  function flushTable() {
    if (tableLines.length < 2) return;
    const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim());
    const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()));
    elements.push(
      <div key={elements.length} className="overflow-x-auto mt-3">
        <table className="w-full text-sm" style={{ fontSize: '14px' }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="text-left px-3 py-2 text-xs uppercase tracking-wider font-semibold" style={{ color: '#78716C', borderBottom: '1px solid #E7E5E4' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2" style={{ color: '#57534E', borderBottom: '1px solid #F5F5F4' }}>{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableLines = [];
  }

  for (const line of lines) {
    if (line.startsWith('|')) {
      flushList();
      tableLines.push(line);
      continue;
    }
    if (tableLines.length > 0) flushTable();

    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={elements.length} className="text-lg font-bold mt-4 mb-2 pl-3" style={{ color: '#1C1917', borderLeft: '3px solid #DC2626' }}>
          {line.slice(3)}
        </h3>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const item = line.replace(/^\d+\.\s/, '');
      if (listBuffer?.type === 'ol') {
        listBuffer.items.push(item);
      } else {
        flushList();
        listBuffer = { type: 'ol', items: [item] };
      }
    } else if (line.startsWith('- ')) {
      const item = line.slice(2);
      if (listBuffer?.type === 'ul') {
        listBuffer.items.push(item);
      } else {
        flushList();
        listBuffer = { type: 'ul', items: [item] };
      }
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={elements.length} className="text-sm mt-2" style={{ color: '#57534E', fontSize: '14px' }}>{renderInline(line)}</p>
      );
    }
  }
  flushList();
  if (tableLines.length > 0) flushTable();

  return <div>{elements}</div>;
}
```

- [ ] **Step 5: Verify components compile**

```bash
cd ~/Development/aicr-demos
npx tsc --noEmit 2>&1 | grep "lotos" | head -10
```

Expected: No errors from the new component files.

- [ ] **Step 6: Commit**

```bash
cd ~/Development/aicr-demos
git add components/demos/lotos/
git commit -m "feat(lotos): add core shared components — StatCard, StatusBadge, Toast, MarkdownRenderer"
```

---

## Task 2: DataTable Component

**Files:**
- Create: `components/demos/lotos/DataTable.tsx`

- [ ] **Step 1: Create `components/demos/lotos/DataTable.tsx`**

```typescript
'use client';

import { useState, useMemo } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortFn?: (a: T, b: T) => number;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  sortable?: boolean;
  keyFn: (row: T) => string;
}

export function DataTable<T>({ columns, data, onRowClick, sortable = true, keyFn }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find(c => c.key === sortKey);
    if (!col?.sortFn) return data;
    const sorted = [...data].sort(col.sortFn);
    return sortDir === 'desc' ? sorted.reverse() : sorted;
  }, [data, sortKey, sortDir, columns]);

  function handleHeaderClick(col: Column<T>) {
    if (!sortable || !col.sortFn) return;
    if (sortKey === col.key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={`text-xs uppercase tracking-wider font-semibold px-4 py-3 text-${col.align ?? 'left'}${sortable && col.sortFn ? ' cursor-pointer hover:bg-gray-50 select-none' : ''}`}
                style={{ color: '#78716C', borderBottom: '2px solid #E7E5E4', width: col.width }}
                onClick={() => handleHeaderClick(col)}
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(row => (
            <tr
              key={keyFn(row)}
              className={`border-b${onRowClick ? ' cursor-pointer hover:bg-slate-50 transition-colors' : ''}`}
              style={{ borderColor: '#F5F5F4' }}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-sm text-${col.align ?? 'left'}`}
                  style={{ color: '#57534E', fontSize: '14px' }}
                >
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm" style={{ color: '#A8A29E' }}>
                No data to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**

```bash
cd ~/Development/aicr-demos && npx tsc --noEmit 2>&1 | grep "DataTable" | head -5
```

- [ ] **Step 3: Commit**

```bash
cd ~/Development/aicr-demos
git add components/demos/lotos/DataTable.tsx
git commit -m "feat(lotos): add DataTable — sortable table with row click support"
```

---

## Task 3: DetailPanel + Entity Detail Views

**Files:**
- Create: `components/demos/lotos/DetailPanel.tsx`
- Create: `components/demos/lotos/VehicleDetail.tsx`
- Create: `components/demos/lotos/CustomerDetail.tsx`
- Create: `components/demos/lotos/DealDetail.tsx`
- Create: `components/demos/lotos/index.ts`

- [ ] **Step 1: Create `components/demos/lotos/DetailPanel.tsx`**

```typescript
'use client';

import { useEffect } from 'react';

interface DetailPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function DetailPanel({ open, onClose, title, children }: DetailPanelProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div
        className="fixed top-0 right-0 h-full w-[420px] bg-white z-50 shadow-2xl overflow-y-auto transition-transform duration-300"
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#E7E5E4' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1C1917' }}>{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-lg"
            style={{ color: '#57534E' }}
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create `components/demos/lotos/VehicleDetail.tsx`**

```typescript
import { VEHICLES, STATUS_COLORS, STATUS_LABELS, RECON_ORDERS, LISTINGS, MARKETPLACE_LABELS, DEALS, CUSTOMERS } from '@/data/lotos';
import { StatusBadge } from './StatusBadge';

interface VehicleDetailProps {
  vehicleId: string;
  onDealClick?: (dealId: string) => void;
}

export function VehicleDetail({ vehicleId, onDealClick }: VehicleDetailProps) {
  const vehicle = VEHICLES.find(v => v.id === vehicleId);
  if (!vehicle) return <p style={{ color: '#57534E' }}>Vehicle not found</p>;

  const recon = RECON_ORDERS.filter(r => r.vehicleId === vehicleId);
  const listings = LISTINGS.filter(l => l.vehicleId === vehicleId);
  const deals = DEALS.filter(d => d.vehicleId === vehicleId);

  const spread = vehicle.askingPrice - vehicle.acquisitionCost - vehicle.reconCost;

  return (
    <div className="space-y-6">
      {/* Vehicle Info */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold" style={{ color: '#1C1917' }}>{vehicle.year} {vehicle.make} {vehicle.model}</span>
          <StatusBadge label={STATUS_LABELS[vehicle.status]} color={STATUS_COLORS[vehicle.status]} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm" style={{ color: '#57534E' }}>
          <div><span className="font-semibold">Stock #:</span> {vehicle.id}</div>
          <div><span className="font-semibold">Trim:</span> {vehicle.trim}</div>
          <div><span className="font-semibold">Color:</span> {vehicle.color}</div>
          <div><span className="font-semibold">Mileage:</span> {vehicle.mileage.toLocaleString()} mi</div>
          <div><span className="font-semibold">VIN:</span> <span className="text-xs font-mono">{vehicle.vin}</span></div>
          <div><span className="font-semibold">Days on Lot:</span> {vehicle.daysOnLot}</div>
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}>
        <h3 className="text-sm font-bold mb-2" style={{ color: '#1C1917' }}>Pricing</h3>
        <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: '#57534E' }}>
          <div>Acquisition: <span className="font-bold" style={{ color: '#1C1917' }}>${vehicle.acquisitionCost.toLocaleString()}</span></div>
          <div>Recon: <span className="font-bold" style={{ color: '#1C1917' }}>${vehicle.reconCost.toLocaleString()}</span></div>
          <div>Asking: <span className="font-bold" style={{ color: '#1C1917' }}>${vehicle.askingPrice.toLocaleString()}</span></div>
          <div>Spread: <span className="font-bold" style={{ color: spread > 0 ? '#16A34A' : '#DC2626' }}>${spread.toLocaleString()}</span></div>
        </div>
      </div>

      {/* Recon History */}
      {recon.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-2" style={{ color: '#1C1917' }}>Recon History</h3>
          {recon.map(r => (
            <div key={r.id} className="rounded-lg p-3 mb-2" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: '#78716C' }}>{r.id}</span>
                <StatusBadge label={r.status.replace(/-/g, ' ')} color={r.status === 'complete' ? '#16A34A' : '#D97706'} />
              </div>
              <p className="text-sm" style={{ color: '#57534E' }}>{r.items.join(', ')}</p>
              <p className="text-xs mt-1" style={{ color: '#78716C' }}>{r.assignedTo} · {r.cycleDays}d cycle · ${(r.actualCost ?? r.estimatedCost).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active Listings */}
      {listings.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-2" style={{ color: '#1C1917' }}>Marketplace Listings</h3>
          <div className="space-y-2">
            {listings.map(l => (
              <div key={l.id} className="flex items-center justify-between text-sm py-2 border-b" style={{ borderColor: '#F5F5F4', color: '#57534E' }}>
                <span className="font-medium">{MARKETPLACE_LABELS[l.marketplace]}</span>
                <span>{l.views} views · {l.leads} leads</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Deals */}
      {deals.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-2" style={{ color: '#1C1917' }}>Deals</h3>
          {deals.map(d => {
            const customer = CUSTOMERS.find(c => c.id === d.customerId);
            return (
              <div
                key={d.id}
                className="rounded-lg p-3 mb-2 cursor-pointer hover:shadow-sm transition-shadow"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}
                onClick={() => onDealClick?.(d.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color: '#1C1917' }}>{d.id}</span>
                  <StatusBadge label={d.status} color={d.status === 'funded' ? '#16A34A' : d.status === 'pending' ? '#D97706' : '#2563EB'} />
                </div>
                {customer && <p className="text-xs mt-1" style={{ color: '#78716C' }}>{customer.firstName} {customer.lastName} · ${d.totalGross.toLocaleString()} gross</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `components/demos/lotos/CustomerDetail.tsx`**

```typescript
import { CUSTOMERS, TIER_COLORS, TIER_LABELS, DEALS, DEAL_STATUS_COLORS, VEHICLES } from '@/data/lotos';
import { StatusBadge } from './StatusBadge';

interface CustomerDetailProps {
  customerId: string;
  onDealClick?: (dealId: string) => void;
  onVehicleClick?: (vehicleId: string) => void;
}

export function CustomerDetail({ customerId, onDealClick, onVehicleClick }: CustomerDetailProps) {
  const customer = CUSTOMERS.find(c => c.id === customerId);
  if (!customer) return <p style={{ color: '#57534E' }}>Customer not found</p>;

  const customerDeals = DEALS.filter(d => d.customerId === customerId);

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold" style={{ color: '#1C1917' }}>{customer.firstName} {customer.lastName}</span>
          <StatusBadge label={TIER_LABELS[customer.creditTier]} color={TIER_COLORS[customer.creditTier]} />
        </div>
        <div className="space-y-2 text-sm" style={{ color: '#57534E' }}>
          <div><span className="font-semibold">Phone:</span> {customer.phone}</div>
          <div><span className="font-semibold">Email:</span> {customer.email}</div>
          <div><span className="font-semibold">Lead Source:</span> {customer.leadSource}</div>
          <div><span className="font-semibold">Since:</span> {customer.createdDate}</div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}>
        <h3 className="text-sm font-bold mb-1" style={{ color: '#1C1917' }}>Notes</h3>
        <p className="text-sm" style={{ color: '#57534E' }}>{customer.notes}</p>
      </div>

      {/* Deals */}
      {customerDeals.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-2" style={{ color: '#1C1917' }}>Deals</h3>
          {customerDeals.map(d => {
            const vehicle = VEHICLES.find(v => v.id === d.vehicleId);
            return (
              <div
                key={d.id}
                className="rounded-lg p-3 mb-2 cursor-pointer hover:shadow-sm transition-shadow"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}
                onClick={() => onDealClick?.(d.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm" style={{ color: '#1C1917' }}>{d.id}</span>
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
                <p className="text-xs mt-1" style={{ color: '#78716C' }}>${d.salePrice.toLocaleString()} · ${d.totalGross.toLocaleString()} gross</p>
              </div>
            );
          })}
        </div>
      )}

      {customerDeals.length === 0 && (
        <p className="text-sm" style={{ color: '#A8A29E' }}>No deals yet</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create `components/demos/lotos/DealDetail.tsx`**

```typescript
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
      {/* Deal Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold" style={{ color: '#1C1917' }}>{deal.id}</span>
          <StatusBadge label={deal.status} color={DEAL_STATUS_COLORS[deal.status]} />
          <StatusBadge label={deal.type} color="#6B7280" />
        </div>
      </div>

      {/* Vehicle */}
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

      {/* Customer */}
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

      {/* Financials */}
      <div className="rounded-lg p-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}>
        <h3 className="text-sm font-bold mb-2" style={{ color: '#1C1917' }}>Deal Structure</h3>
        <div className="grid grid-cols-2 gap-2 text-sm" style={{ color: '#57534E' }}>
          <div>Sale Price: <span className="font-bold" style={{ color: '#1C1917' }}>${deal.salePrice.toLocaleString()}</span></div>
          <div>Trade: <span className="font-bold" style={{ color: '#1C1917' }}>${deal.tradeAllowance.toLocaleString()}</span></div>
          <div>Down: <span className="font-bold" style={{ color: '#1C1917' }}>${deal.downPayment.toLocaleString()}</span></div>
          <div>Financed: <span className="font-bold" style={{ color: '#1C1917' }}>${(deal.salePrice - deal.tradeAllowance - deal.downPayment).toLocaleString()}</span></div>
        </div>
      </div>

      {/* Gross */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <p className="text-xs font-semibold" style={{ color: '#78716C' }}>Front</p>
          <p className="text-lg font-bold" style={{ color: '#16A34A' }}>${deal.frontGross.toLocaleString()}</p>
        </div>
        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <p className="text-xs font-semibold" style={{ color: '#78716C' }}>F&I</p>
          <p className="text-lg font-bold" style={{ color: '#2563EB' }}>${deal.fniGross.toLocaleString()}</p>
        </div>
        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E7E5E4' }}>
          <p className="text-xs font-semibold" style={{ color: '#78716C' }}>Total</p>
          <p className="text-lg font-bold" style={{ color: '#1C1917' }}>${deal.totalGross.toLocaleString()}</p>
        </div>
      </div>

      {/* Funding */}
      <div className="text-sm" style={{ color: '#57534E' }}>
        <div><span className="font-semibold">Lender:</span> {deal.lender}</div>
        <div><span className="font-semibold">Closed:</span> {deal.closedDate}</div>
        {deal.fundedDate && <div><span className="font-semibold">Funded:</span> {deal.fundedDate} ({deal.daysToFund}d)</div>}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `components/demos/lotos/index.ts`**

```typescript
export { StatCard } from './StatCard';
export { StatusBadge } from './StatusBadge';
export { DataTable, type Column } from './DataTable';
export { DetailPanel } from './DetailPanel';
export { VehicleDetail } from './VehicleDetail';
export { CustomerDetail } from './CustomerDetail';
export { DealDetail } from './DealDetail';
export { MarkdownRenderer } from './MarkdownRenderer';
export { Toast } from './Toast';
```

- [ ] **Step 6: Verify all components compile**

```bash
cd ~/Development/aicr-demos && npx tsc --noEmit 2>&1 | head -10
```

Expected: Clean.

- [ ] **Step 7: Commit**

```bash
cd ~/Development/aicr-demos
git add components/demos/lotos/
git commit -m "feat(lotos): add DetailPanel, entity detail views, DataTable, barrel export"
```

---

## Task 4: Data Layer Additions

**Files:**
- Modify: `data/lotos/ai-responses.ts`

- [ ] **Step 1: Add 2 new market-intel briefs to `data/lotos/ai-responses.ts`**

Add these 2 entries to the end of the `AI_RESPONSES` array (before the closing `];`):

```typescript
  { id: 'ai-007', category: 'market-intel', question: 'Weekly market brief (Mar 25)', answer: '## Sora Auto — Weekly Market Brief (Mar 25, 2026)\n\n**Phoenix Metro Trends:**\n- Used vehicle prices **up 0.8%** week-over-week — spring buying season kicking in\n- Tax refund deposits hitting — subprime activity **up 15%** across metro dealers\n- Auction inventory **tightening** at Manheim Phoenix — expect 10-15% higher acquisition costs next week\n\n**Your Position:**\n- 18 units in stock (12 frontline, 3 in recon, 3 aged)\n- Gross trending at **$4,500/unit** — above target\n- F&I penetration hit **68%** — new monthly record\n\n**Action Items:**\n1. **Stock up before auction prices rise** — Manheim Thursday has 25 Honda/Toyota units, buy 3-4 at current prices\n2. **Subprime push** — tax refund season peaks next 2 weeks. Have OneMain and Westlake apps ready.\n3. **Celebrate F&I milestone** — team hit 68% penetration, highest since opening. Maintenance plan driving $795/deal incremental.' },
  { id: 'ai-008', category: 'market-intel', question: 'Weekly market brief (Mar 18)', answer: '## Sora Auto — Weekly Market Brief (Mar 18, 2026)\n\n**Phoenix Metro Trends:**\n- Used vehicle prices **flat** week-over-week after 3 weeks of decline\n- Trade-in volume **up 22%** — spring cleaning effect, customers upgrading\n- CarGurus lead volume **up 12%** — strongest digital channel this quarter\n\n**Your Position:**\n- 17 units in stock (11 frontline, 4 in recon, 2 aged)\n- Sold 14 units last week — **best week since October**\n- Recon cycle time at **4.2 days** — 2nd best month ever\n\n**Action Items:**\n1. **Maximize trade-ins** — offer competitive appraisals, trade-ins yield 25% higher spread than auction buys\n2. **Increase CarGurus budget** — leads are converting at 18% vs 12% for AutoTrader. Shift $500/month from AT to CG.\n3. **Clear 2 aged units** — STK-005 and STK-010 approaching 60 days. Price reduction or wholesale by Friday.' },
```

- [ ] **Step 2: Verify compilation**

```bash
cd ~/Development/aicr-demos && npx tsc --noEmit 2>&1 | head -5
```

- [ ] **Step 3: Commit**

```bash
cd ~/Development/aicr-demos
git add data/lotos/ai-responses.ts
git commit -m "feat(lotos): add 2 additional market-intel briefs for brief cycling"
```

---

## Task 5: Act 1 — The Lot Page Enhancements (4 pages)

**Files:**
- Modify: `app/(demos)/lotos/lot/dashboard/page.tsx`
- Modify: `app/(demos)/lotos/lot/inventory/page.tsx`
- Modify: `app/(demos)/lotos/lot/recon/page.tsx`
- Modify: `app/(demos)/lotos/lot/marketplace/page.tsx`

Each page gets: DetailPanel integration (click entity → slide-in panel), shared component usage, and page-specific interactive controls.

### Enhancements per page:

**Dashboard:**
- Add `useState` for `timeRange` ('7d'|'30d'|'60d'|'90d'), `panelEntity` (type + id for DetailPanel)
- Add time range toggle buttons that filter deals by closedDate
- KPI cards recalculate based on filtered deals
- Click stock # or deal # → opens VehicleDetail or DealDetail in DetailPanel
- Alert cards become clickable (wrap in Link to relevant route)

**Inventory:**
- Add `useState` for `panelEntity`, `selectedRows: Set<string>`
- Replace inline table with DataTable component — all columns sortable
- Row click → VehicleDetail panel
- Add checkbox column for bulk selection
- Add "Mark for Wholesale" and "Price Reduction" action buttons above table → show Toast on click

**Recon:**
- Add `useState` for `columns: Record<ReconStatus, string[]>` (mapping status to vehicleId arrays), `panelEntity`, `techAssignments: Record<string, string>`
- Implement HTML5 drag-and-drop: `onDragStart` sets dragged card id, `onDragOver` prevents default, `onDrop` moves card to new column in local state
- Click card → VehicleDetail panel
- Add tech assignment dropdown per card (Mike Torres / Carlos Ruiz / Unassigned)

**Marketplace:**
- Add `useState` for `panelEntity`, `syncStatus: Record<string, boolean>`
- Wire in `INVENTORY_SOURCES` data — add "Acquisition Source ROI" section with StatCards for each source
- Click listing → VehicleDetail panel
- Add sync toggle per listing (Active ↔ Paused) — updates syncStatus local state

- [ ] **Step 1: Rewrite all 4 Act 1 pages with enhancements**

Build each page with the full enhancements described above. Import shared components from `@/components/demos/lotos`. Every page must:
- Import `DetailPanel`, `VehicleDetail`, `DealDetail` from `@/components/demos/lotos`
- Add a `panelEntity` useState: `{ type: 'vehicle'|'customer'|'deal', id: string } | null`
- Render DetailPanel at the bottom of the JSX with the appropriate entity detail view
- Keep existing styling patterns (light bg, dark text, 14px min)

- [ ] **Step 2: Verify pages compile and render**

```bash
cd ~/Development/aicr-demos && npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
cd ~/Development/aicr-demos
git add app/\(demos\)/lotos/lot/
git commit -m "feat(lotos): Act 1 interactivity — time range, drag-drop recon, sortable tables, detail panels"
```

---

## Task 6: Act 2 — Sales Floor Page Enhancements (4 pages)

**Files:**
- Modify: `app/(demos)/lotos/sales/crm/page.tsx`
- Modify: `app/(demos)/lotos/sales/pipeline/page.tsx`
- Modify: `app/(demos)/lotos/sales/appointments/page.tsx`
- Modify: `app/(demos)/lotos/sales/test-drives/page.tsx`

### Enhancements per page:

**CRM:**
- Add `panelEntity` useState, `leadSourceFilter` useState, `customerNotes: Record<string, string>` useState
- Row click → CustomerDetail panel
- Add lead source filter buttons alongside existing tier filter
- Add "Add Note" button per row → expands inline textarea, save updates customerNotes state

**Pipeline:**
- Add `expandedStage: string | null` useState
- Funnel stage bars become clickable — sets expandedStage, renders list of leads at that stage below the bar
- Add inline SVG sparklines in the lead source ROI table (hardcode 6-value trend arrays per source)

**Appointments:**
- Add `selectedAppt` useState (appointment index or null), `appointments` useState (mutable copy of APPOINTMENTS array)
- Click appointment block → detail popup card (positioned near block) with customer, vehicle, type, time
- Add "New Appointment" button → form modal (dropdowns for customer, type, day, time). Save appends to local appointments state.

**Test Drives:**
- Replace inline table with DataTable — sortable columns
- Add `panelEntity` useState, `outcomeFilter` useState, `salespersonFilter` useState
- Row click → CustomerDetail panel
- Add outcome filter tabs (All + 4 outcomes) with counts
- Add salesperson dropdown filter

- [ ] **Step 1: Rewrite all 4 Act 2 pages with enhancements**

- [ ] **Step 2: Verify compilation**

```bash
cd ~/Development/aicr-demos && npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
cd ~/Development/aicr-demos
git add app/\(demos\)/lotos/sales/
git commit -m "feat(lotos): Act 2 interactivity — CRM notes, clickable funnel, appointment creator, sortable test drives"
```

---

## Task 7: Acts 3 & 4 — Deal Desk + Back Office Enhancements (8 pages)

**Files:**
- Modify: `app/(demos)/lotos/deals/desking/page.tsx`
- Modify: `app/(demos)/lotos/deals/fni/page.tsx`
- Modify: `app/(demos)/lotos/deals/lenders/page.tsx`
- Modify: `app/(demos)/lotos/deals/contracting/page.tsx`
- Modify: `app/(demos)/lotos/office/accounting/page.tsx`
- Modify: `app/(demos)/lotos/office/floorplan/page.tsx`
- Modify: `app/(demos)/lotos/office/title-dmv/page.tsx`
- Modify: `app/(demos)/lotos/office/compliance/page.tsx`

### Deal Desk enhancements:

**Desking:**
- Add `selectedDealId` useState (default DL-2026-007), `editablePrice`/`editableTrade`/`editableDown` useStates
- Deal selector dropdown — switching reloads entire view
- Sale price, trade, down payment become editable number inputs — amount financed and all 3 lender payment scenarios recalculate live
- Click vehicle/customer → detail panels

**F&I:**
- Add `selectedDealId` useState — deal selector to contextualize F&I for different deals
- Click product → expand/collapse section with extended info
- Add "penetration vs target" mini-bar per product (target 70%)

**Lenders:**
- Replace table with DataTable — sortable
- Add `selectedCustomerId` useState with customer dropdown — match indicators recalculate
- Row click → expand showing deals funded through that lender

**Contracting:**
- Add `selectedDealId` useState, `docStatus: Record<string, string>` useState
- Deal selector dropdown
- Document checklist items become clickable to cycle (Complete → Pending → Missing)
- Progress bar animates on changes

### Back Office enhancements:

**Accounting:**
- Add `selectedMonth` useState (dropdown from MONTHLY_KPIS months)
- P&L recalculates per selected month
- Replace deal posting table with DataTable — sortable, row click → DealDetail panel

**Floorplan:**
- Wire in `PAYMENTS` data — add "BHPH Collections" section showing payment schedule with status badges
- Replace table with DataTable — sortable by days-to-curtailment
- Row click → VehicleDetail panel
- Add CSS pulse animation for <15d curtailment rows

**Title & DMV:**
- Add `panelEntity` useState, `stages: Record<string, {...}>` mutable useState
- Row click → DealDetail panel
- Stage icons become clickable — advances stage in local state, shows Toast

**Compliance:**
- Add `panelEntity`, `screeningStatus: Record<string, 'idle'|'loading'|'clear'>`, `dateRange` useStates
- "Run OFAC Screen" button per customer — 0.5s simulated delay, then Clear badge
- Audit trail date range filter (7d / 30d / All)
- Click customer → CustomerDetail panel

- [ ] **Step 1: Rewrite all 8 pages with enhancements**

- [ ] **Step 2: Verify compilation**

```bash
cd ~/Development/aicr-demos && npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
cd ~/Development/aicr-demos
git add app/\(demos\)/lotos/deals/ app/\(demos\)/lotos/office/
git commit -m "feat(lotos): Acts 3-4 interactivity — editable desking, lender matching, BHPH payments, OFAC screening"
```

---

## Task 8: Acts 5 & 6 — Command Center + AskLotOS Enhancements (8 pages)

**Files:**
- Modify: `app/(demos)/lotos/command/kpis/page.tsx`
- Modify: `app/(demos)/lotos/command/pricing/page.tsx`
- Modify: `app/(demos)/lotos/command/cashflow/page.tsx`
- Modify: `app/(demos)/lotos/command/aging/page.tsx`
- Modify: `app/(demos)/lotos/intelligence/chat/page.tsx`
- Modify: `app/(demos)/lotos/intelligence/deal-optimizer/page.tsx`
- Modify: `app/(demos)/lotos/intelligence/acquisition/page.tsx`
- Modify: `app/(demos)/lotos/intelligence/market-intel/page.tsx`

### Command Center enhancements:

**KPIs:**
- Add `expandedKpi: string | null` useState, `showBenchmark: boolean` useState
- Click KPI card → expands inline with larger sparkline SVG (200px tall) with labeled data points. Click again to collapse.
- Add "Show Industry Avg" toggle — shows comparison line on sparklines and column in trend table
- Industry avg benchmarks: turnRate 9.0, grossPerUnit 3800, avgDaysToFund 5.5, reconCycleTime 5.0, avgDaysOnLot 30, fniPenetration 55

**Pricing:**
- Add `toastMsg` useState for Toast integration
- "Apply Price" button — updates vehicle asking price in local vehicles state, shows Toast "Price updated to $X"
- Click comp row → expand with detail (listing date, condition, source link)

**Cashflow:**
- Add `scenario: 'conservative'|'expected'|'optimistic'` useState
- Scenario toggle: Conservative (0.8x inflows), Expected (1.0x), Optimistic (1.2x) — all projections and bar chart recalculate
- Wire in `PAYMENTS` from `@/data/lotos` — add BHPH collection row with upcoming payment dates and status badges
- Click period row → expand showing itemized breakdown

**Aging:**
- Add `activeBucket: string | null` useState, `panelEntity` useState, `toastMsg` useState
- Age bucket cards become clickable filters — click to filter table to that bucket
- "Wholesale" action badge becomes a button → shows simulated wholesale offer Toast ("Wholesale offer: $X from Manheim Phoenix")
- Row click → VehicleDetail panel

### AskLotOS enhancements:

**Chat:**
- Add `messages: Array<{role, text}>` useState (initialize from AI_RESPONSES chat entries)
- Make send button functional: on submit, check if input fuzzy-matches (includes keyword) any AI_RESPONSES question. If match → append Q&A. Else → append "I'll research that and get back to you."
- Add typing indicator (3 bouncing dots CSS animation) with 1s delay before showing AI response
- Quick action buttons scroll to AND highlight the Q&A with a 1s yellow background flash

**Deal Optimizer:**
- Add `optimizedGross: number | null` useState, `toastMsg` useState
- "Apply Recommendations" button → updates deal's total gross in local state, shows animated counter from old → new value
- Recommendation sections become expandable (click header to expand/collapse)

**Acquisition:**
- Add `editableFields` useState (year, make, model, miles, price — all editable)
- Add `savedScores: Array<{fields, score}>` useState (max 3)
- On "Re-Score", recalculate factor weights: higher miles → lower score, lower price → higher margin safety. Simple linear adjustments from the base 82.
- "Save Score" button → appends to savedScores array, renders comparison sidebar

**Market Intel:**
- Replace MarkdownRenderer import from inline to `@/components/demos/lotos`
- Add `briefIndex: number` useState (cycles 0→2 through 3 briefs: ai-006, ai-007, ai-008)
- "Generate New Brief" → increments briefIndex (wraps around), re-renders with new brief
- "Share Brief" → copies brief text to clipboard via `navigator.clipboard.writeText()`, shows Toast
- Action items get checkbox toggles (useState array of booleans)

- [ ] **Step 1: Rewrite all 8 pages with enhancements**

Replace the inline `renderMarkdown`/`renderInline` helpers in all 4 intelligence pages with the shared `MarkdownRenderer` from `@/components/demos/lotos`.

- [ ] **Step 2: Verify compilation**

```bash
cd ~/Development/aicr-demos && npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
cd ~/Development/aicr-demos
git add app/\(demos\)/lotos/command/ app/\(demos\)/lotos/intelligence/
git commit -m "feat(lotos): Acts 5-6 interactivity — expandable KPIs, cashflow scenarios, functional chat, editable acquisition"
```

---

## Task 9: Final Build Verification

**Files:**
- None new

- [ ] **Step 1: Full typecheck**

```bash
cd ~/Development/aicr-demos && npx tsc --noEmit
```

Expected: Clean.

- [ ] **Step 2: Full build**

```bash
cd ~/Development/aicr-demos && pnpm build 2>&1 | grep "/lotos" | wc -l
```

Expected: 25 lotos routes.

- [ ] **Step 3: Push to deploy**

```bash
cd ~/Development/aicr-demos && git push origin main
```

CF Pages auto-deploys from main.
