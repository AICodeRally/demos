'use client';

import { useState } from 'react';

interface Alarm {
  id: string;
  timestamp: string;
  wellName: string;
  alarmType: string;
  severity: 'critical' | 'warning' | 'info';
  acknowledged: boolean;
  description: string;
}

interface AlarmFeedProps {
  alarms: Alarm[];
  onAcknowledge?: (alarmId: string) => void;
}

const SEVERITY_STYLES: Record<string, { bg: string; border: string; icon: string; iconColor: string }> = {
  critical: { bg: '#2D1215', border: '#991B1B', icon: '\u26A0', iconColor: '#EF4444' },
  warning: { bg: '#2D2207', border: '#92400E', icon: '\u25B2', iconColor: '#F59E0B' },
  info: { bg: '#0C1929', border: '#1E40AF', icon: '\u24D8', iconColor: '#3B82F6' },
};

export type { Alarm };

export function AlarmFeed({ alarms: initialAlarms, onAcknowledge }: AlarmFeedProps) {
  const [localAcks, setLocalAcks] = useState<Set<string>>(new Set());

  function handleAck(alarmId: string) {
    setLocalAcks((prev: Set<string>) => new Set(prev).add(alarmId));
    onAcknowledge?.(alarmId);
  }

  return (
    <div className="rounded-xl border p-5" style={{ backgroundColor: '#1E2530', borderColor: '#334155' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
          SCADA Alarm Feed
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#252B36', color: '#94A3B8' }}>
          {initialAlarms.filter((a) => !a.acknowledged && !localAcks.has(a.id)).length} active
        </span>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-1.5">
        {initialAlarms.map((alarm) => {
          const acked = alarm.acknowledged || localAcks.has(alarm.id);
          const style = SEVERITY_STYLES[alarm.severity] ?? SEVERITY_STYLES.info;
          const isCriticalUnacked = alarm.severity === 'critical' && !acked;

          return (
            <div
              key={alarm.id}
              className="rounded-lg px-3 py-2.5 border transition-opacity"
              style={{
                backgroundColor: acked ? '#1A1D23' : style.bg,
                borderColor: acked ? '#252B36' : style.border,
                opacity: acked ? 0.6 : 1,
                animation: isCriticalUnacked ? 'pulse-alarm 2s ease-in-out infinite' : undefined,
              }}
            >
              <div className="flex items-start gap-2.5">
                {/* Severity icon */}
                <span
                  className="text-sm mt-0.5 shrink-0"
                  style={{ color: acked ? '#475569' : style.iconColor }}
                >
                  {style.icon}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[11px] shrink-0" style={{ color: '#94A3B8' }}>
                      {alarm.timestamp}
                    </span>
                    <span className="font-semibold text-[12px] shrink-0" style={{ color: acked ? '#64748B' : '#F1F5F9' }}>
                      {alarm.wellName}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        backgroundColor: acked ? '#252B36' : style.border,
                        color: acked ? '#64748B' : '#F1F5F9',
                      }}
                    >
                      {alarm.alarmType}
                    </span>
                  </div>
                  <p className="text-[11px] truncate" style={{ color: acked ? '#475569' : '#CBD5E1' }}>
                    {alarm.description}
                  </p>
                </div>

                {/* Acknowledge button */}
                <button
                  onClick={() => !acked && handleAck(alarm.id)}
                  disabled={acked}
                  className="shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors"
                  style={{
                    borderColor: acked ? '#334155' : style.border,
                    backgroundColor: acked ? '#334155' : 'transparent',
                    cursor: acked ? 'default' : 'pointer',
                  }}
                  title={acked ? 'Acknowledged' : 'Acknowledge'}
                >
                  {acked ? (
                    <span style={{ color: '#10B981', fontSize: 12, fontWeight: 'bold' }}>&#10003;</span>
                  ) : (
                    <span style={{ color: '#64748B', fontSize: 10 }}>&nbsp;</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse-alarm {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
