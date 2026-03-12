'use client';

import { VARICENT_FIELD_MAPPINGS, SYNC_LOG } from '@/data/register/platform-data';

/* Group field mappings by section */
function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = String(item[key]);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

const prizymGroups = groupBy(VARICENT_FIELD_MAPPINGS, 'prizymSection');
const varicentGroups = groupBy(VARICENT_FIELD_MAPPINGS, 'varicentSection');

export default function VaricentPage() {
  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Varicent Integration</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>
            PRIZYM ↔ Varicent field mappings, sync schedule, and event log
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold mt-1"
          style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
        >
          Varicent Environment: POC1
        </span>
      </div>

      {/* Key message banner */}
      <div
        className="rounded-xl p-4 mb-8 border"
        style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}
      >
        <p className="text-sm font-semibold" style={{ color: '#1D4ED8' }}>
          Your team keeps using Varicent. PRIZYM enriches it with floor-level intelligence Varicent can&apos;t see.
        </p>
        <p className="text-xs mt-1" style={{ color: '#3B82F6' }}>
          POS transactions, real-time attach rates, coaching signals, and dispute context flow from PRIZYM into Varicent automatically — no manual data entry, no lag.
        </p>
      </div>

      {/* Split layout: PRIZYM View vs Varicent View */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Left: PRIZYM View */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: '#1E3A5F' }}
            />
            <p className="text-sm font-bold" style={{ color: '#1E3A5F' }}>PRIZYM View</p>
          </div>
          <div className="space-y-4">
            {Object.entries(prizymGroups).map(([section, fields]) => (
              <div key={section}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>
                  {section}
                </p>
                <div className="space-y-1">
                  {fields.map((f) => (
                    <div
                      key={f.prizymField}
                      className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <span className="text-[12px] font-medium" style={{ color: '#0F172A' }}>{f.prizymField}</span>
                      <span
                        className="text-[10px] font-semibold"
                        style={{
                          color: f.syncStatus === 'synced' ? '#059669' : f.syncStatus === 'pending' ? '#D97706' : '#DC2626',
                        }}
                      >
                        {f.syncStatus === 'synced' ? '✓' : f.syncStatus === 'pending' ? '⏳' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Varicent View */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: '#10B981' }}
            />
            <p className="text-sm font-bold" style={{ color: '#10B981' }}>Varicent View</p>
          </div>
          <div className="space-y-4">
            {Object.entries(varicentGroups).map(([section, fields]) => (
              <div key={section}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#94A3B8' }}>
                  {section}
                </p>
                <div className="space-y-1">
                  {fields.map((f) => (
                    <div
                      key={`${f.varicentField}-${f.prizymField}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <span className="text-[12px] font-medium" style={{ color: '#0F172A' }}>{f.varicentField}</span>
                      <span className="text-[10px]" style={{ color: '#94A3B8' }}>← {f.prizymField}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Field mapping table */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Field Mapping Detail</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>PRIZYM Field</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Section</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Varicent Field</th>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Varicent Section</th>
                <th className="text-center py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Status</th>
                <th className="text-right py-2 font-semibold" style={{ color: '#94A3B8' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {VARICENT_FIELD_MAPPINGS.map((mapping, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="py-2.5 pr-4 font-semibold" style={{ color: '#0F172A' }}>{mapping.prizymField}</td>
                  <td className="py-2.5 pr-4" style={{ color: '#64748B' }}>{mapping.prizymSection}</td>
                  <td className="py-2.5 pr-4" style={{ color: '#0F172A' }}>{mapping.varicentField}</td>
                  <td className="py-2.5 pr-4" style={{ color: '#64748B' }}>{mapping.varicentSection}</td>
                  <td className="py-2.5 pr-4 text-center">
                    {mapping.syncStatus === 'synced' && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
                      >
                        ✓ Synced
                      </span>
                    )}
                    {mapping.syncStatus === 'pending' && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                      >
                        ● Pending
                      </span>
                    )}
                    {mapping.syncStatus === 'not_mapped' && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
                      >
                        ✗ Not Mapped
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-right font-mono text-[11px]" style={{ color: '#94A3B8' }}>
                    {mapping.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync log */}
      <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Sync Event Log</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Timestamp</th>
                <th className="text-center py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Direction</th>
                <th className="text-right py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Records</th>
                <th className="text-center py-2 pr-4 font-semibold" style={{ color: '#94A3B8' }}>Status</th>
                <th className="text-left py-2 font-semibold" style={{ color: '#94A3B8' }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {SYNC_LOG.map((event) => (
                <tr key={event.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td className="py-2.5 pr-4 font-mono text-[11px]" style={{ color: '#64748B' }}>{event.timestamp}</td>
                  <td className="py-2.5 pr-4 text-center">
                    <span
                      className="inline-block px-2 py-0.5 rounded font-mono text-[11px] font-bold"
                      style={{
                        backgroundColor: event.direction === 'push' ? '#EFF6FF' : '#F5F3FF',
                        color: event.direction === 'push' ? '#1D4ED8' : '#6D28D9',
                      }}
                    >
                      {event.direction === 'push' ? '→ Push' : '← Pull'}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-right font-mono" style={{ color: '#0F172A' }}>
                    {event.recordCount.toLocaleString()}
                  </td>
                  <td className="py-2.5 pr-4 text-center">
                    {event.status === 'success' && (
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
                      >
                        Success
                      </span>
                    )}
                    {event.status === 'warning' && (
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                      >
                        Warning
                      </span>
                    )}
                    {event.status === 'error' && (
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
                      >
                        Error
                      </span>
                    )}
                  </td>
                  <td className="py-2.5" style={{ color: '#475569' }}>{event.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
