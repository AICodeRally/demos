'use client';

import { useState, useMemo } from 'react';
import { StatCard, AlarmFeed, type Alarm } from '@/components/demos/wellspring';

/* ── Mock alarm data ──────────────────────────────────── */

const MOCK_ALARMS: Alarm[] = [
  {
    id: 'alm-01',
    timestamp: '06:42',
    wellName: 'Rattlesnake 7-1H',
    alarmType: 'Low Pressure',
    severity: 'warning',
    acknowledged: false,
    description:
      'Tubing pressure dropped 22 psi in 4 hours — possible parted rod or gas lock. Investigate flowline.',
  },
  {
    id: 'alm-02',
    timestamp: '06:38',
    wellName: 'Diamondback 8-2H',
    alarmType: 'High Temp',
    severity: 'warning',
    acknowledged: false,
    description:
      'ESP motor temperature 285F — 15F above normal, trending up over 48 hours. Check VSD frequency.',
  },
  {
    id: 'alm-03',
    timestamp: '06:15',
    wellName: 'Mustang 8-2H',
    alarmType: 'Shutdown',
    severity: 'critical',
    acknowledged: false,
    description:
      'Well shut-in due to high water cut (55%). Evaluate rod pump conversion or workover candidacy.',
  },
  {
    id: 'alm-04',
    timestamp: '05:55',
    wellName: 'Sidewinder 9-2H',
    alarmType: 'Flow Rate Deviation',
    severity: 'info',
    acknowledged: true,
    description:
      'Production rate 8% below 7-day average. Rod pump may need stroke adjustment.',
  },
  {
    id: 'alm-05',
    timestamp: '05:30',
    wellName: 'Mustang Central TB',
    alarmType: 'Tank Level',
    severity: 'warning',
    acknowledged: true,
    description:
      'Tank #2 at 78% capacity — schedule hauler dispatch by Thursday to avoid overflow.',
  },
  {
    id: 'alm-06',
    timestamp: '05:12',
    wellName: 'Sidewinder West TB',
    alarmType: 'Tank Level',
    severity: 'warning',
    acknowledged: true,
    description:
      'Water tank at 82% — hauler dispatch needed today. Production tanks within limits.',
  },
  {
    id: 'alm-07',
    timestamp: '04:45',
    wellName: 'Rattlesnake 9-2H',
    alarmType: 'Shutdown',
    severity: 'info',
    acknowledged: true,
    description:
      'Well offline for planned ESP-to-rod-pump workover. Target completion Friday.',
  },
  {
    id: 'alm-08',
    timestamp: '04:22',
    wellName: 'Diamondback 4-2H',
    alarmType: 'Corrosion Alert',
    severity: 'info',
    acknowledged: true,
    description:
      'CO2 content 4.2% — corrosion inhibitor injection rate verified at target 1.8 gal/hr.',
  },
  {
    id: 'alm-09',
    timestamp: '03:50',
    wellName: 'Mustang 15-3H',
    alarmType: 'Shutdown',
    severity: 'info',
    acknowledged: true,
    description:
      'Well shut-in due to high water cut (58%). Candidate for P&A or sidetrack evaluation.',
  },
  {
    id: 'alm-10',
    timestamp: '03:15',
    wellName: 'Sidewinder 22-4H',
    alarmType: 'Chemical Injection',
    severity: 'info',
    acknowledged: true,
    description:
      'Scale inhibitor tank below 20% — refill scheduled on Jake\'s route today.',
  },
  {
    id: 'alm-11',
    timestamp: '02:40',
    wellName: 'Copperhead 18-1H',
    alarmType: 'High Pressure',
    severity: 'warning',
    acknowledged: true,
    description:
      'Flowing wellhead pressure 2,840 psi — new completion, monitoring flowback. Normal for IP phase.',
  },
  {
    id: 'alm-12',
    timestamp: '02:10',
    wellName: 'Rattlesnake 3-1H',
    alarmType: 'Low Pressure',
    severity: 'info',
    acknowledged: true,
    description:
      'Tubing pressure 2 psi below baseline — within variance. Monitor on next gauge round.',
  },
  {
    id: 'alm-13',
    timestamp: '01:35',
    wellName: 'Diamondback 6-2H',
    alarmType: 'Flow Rate Deviation',
    severity: 'info',
    acknowledged: true,
    description:
      'ESP running at 52 Hz — optimal for current inflow performance. No action required.',
  },
  {
    id: 'alm-14',
    timestamp: '00:58',
    wellName: 'Mustang 5-2H',
    alarmType: 'Low Pressure',
    severity: 'info',
    acknowledged: true,
    description:
      'Casing pressure dropped 3 psi overnight. Within normal variance for rod-pump wells.',
  },
  {
    id: 'alm-15',
    timestamp: '00:20',
    wellName: 'Sidewinder 3-1H',
    alarmType: 'Communication Loss',
    severity: 'warning',
    acknowledged: true,
    description:
      'SCADA telemetry lost for 12 minutes at midnight — reconnected automatically. Possible cell signal.',
  },
];

type SeverityFilter = 'all' | 'critical' | 'warning' | 'info';

export default function ScadaAlarmsPage() {
  const [filter, setFilter] = useState<SeverityFilter>('all');

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? MOCK_ALARMS
        : MOCK_ALARMS.filter((a) => a.severity === filter),
    [filter],
  );

  const activeCount = MOCK_ALARMS.filter((a) => !a.acknowledged).length;
  const ackedCount = MOCK_ALARMS.filter((a) => a.acknowledged).length;
  const criticalCount = MOCK_ALARMS.filter(
    (a) => a.severity === 'critical' && !a.acknowledged,
  ).length;

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div
          className="text-[10px] tracking-[3px] uppercase mb-1"
          style={{ color: '#B45309' }}
        >
          Act 3 &middot; Production Operations
        </div>
        <h1
          className="text-3xl font-extrabold"
          style={{ color: '#F1F5F9' }}
        >
          SCADA Alarms
        </h1>
        <p className="text-[12px] mt-1" style={{ color: '#94A3B8' }}>
          Real-time alarm monitoring &middot; 60 wells &middot; 52
          SCADA-connected
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard
          label="Active Alarms"
          value={String(activeCount)}
          trend={criticalCount > 0 ? 'up' : 'flat'}
          trendValue={
            criticalCount > 0 ? `${criticalCount} critical` : 'monitoring'
          }
          color="#DC2626"
        />
        <StatCard
          label="Acknowledged"
          value={String(ackedCount)}
          trend="flat"
          trendValue="today"
        />
        <StatCard
          label="Resolved Today"
          value="12"
          trend="up"
          trendValue="avg 9/day"
          color="#16A34A"
        />
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(
          [
            { id: 'all' as const, label: 'All', count: MOCK_ALARMS.length },
            {
              id: 'critical' as const,
              label: 'Critical',
              count: MOCK_ALARMS.filter((a) => a.severity === 'critical')
                .length,
            },
            {
              id: 'warning' as const,
              label: 'Warning',
              count: MOCK_ALARMS.filter((a) => a.severity === 'warning')
                .length,
            },
            {
              id: 'info' as const,
              label: 'Info',
              count: MOCK_ALARMS.filter((a) => a.severity === 'info').length,
            },
          ] as const
        ).map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className="text-[11px] px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            style={{
              background: filter === opt.id ? '#B45309' : '#1E2530',
              color: filter === opt.id ? '#FFFFFF' : '#94A3B8',
              border:
                filter === opt.id
                  ? '1px solid #D97706'
                  : '1px solid #334155',
              fontWeight: filter === opt.id ? 700 : 400,
            }}
          >
            {opt.label}
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full"
              style={{
                background:
                  filter === opt.id
                    ? 'rgba(255,255,255,0.2)'
                    : '#252B36',
                color:
                  filter === opt.id ? '#FFFFFF' : '#64748B',
              }}
            >
              {opt.count}
            </span>
          </button>
        ))}
      </div>

      {/* Alarm Feed */}
      <AlarmFeed alarms={filtered} />
    </>
  );
}
