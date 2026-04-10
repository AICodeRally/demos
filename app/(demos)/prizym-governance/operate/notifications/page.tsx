'use client';

import { useState, useEffect } from 'react';
import { PrizymPage } from '@/components/demos/prizym-governance/PrizymPage';
import { NOTIFICATIONS, type Notification } from '@/data/prizym-governance/operate';
import { Bell, CheckCircle2, AlertTriangle, Clock, AtSign, Gavel } from 'lucide-react';

const TYPE_CONFIG: Record<Notification['type'], { color: string; icon: typeof Bell; label: string }> = {
  approval: { color: '#f59e0b', icon: Clock, label: 'Approval' },
  decision: { color: '#10b981', icon: Gavel, label: 'Decision' },
  deadline: { color: '#3b82f6', icon: Clock, label: 'Deadline' },
  alert: { color: '#ef4444', icon: AlertTriangle, label: 'Alert' },
  mention: { color: '#8b5cf6', icon: AtSign, label: 'Mention' },
};

export default function NotificationsPage() {
  const [showRead, setShowRead] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const filtered = showRead ? NOTIFICATIONS : NOTIFICATIONS.filter(n => !n.read);
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <PrizymPage title="Notifications" subtitle="Approvals, decisions, alerts, and mentions across the governance program" mode="operate">
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="pg-card" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={18} style={{ color: 'var(--pg-operate)' }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--pg-text)' }}>{unreadCount}</div>
            <div className="pg-caption" style={{ fontSize: 14 }}>Unread</div>
          </div>
        </div>
        <div className="pg-card" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--pg-text)' }}>{NOTIFICATIONS.length - unreadCount}</div>
            <div className="pg-caption" style={{ fontSize: 14 }}>Read</div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--pg-text-muted)', cursor: 'pointer' }}>
          <input type="checkbox" checked={showRead} onChange={e => setShowRead(e.target.checked)} />
          Show read
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((n, i) => {
          const config = TYPE_CONFIG[n.type];
          const Icon = config.icon;
          return (
            <div
              key={n.id}
              className="pg-card"
              style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                borderLeft: `3px solid ${config.color}`,
                opacity: n.read ? 0.88 : 1,
                position: 'relative',
                transform: mounted ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'all 0.4s ease',
                transitionDelay: `${i * 0.04}s`,
              }}
            >
              {!n.read && (
                <span style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 8, height: 8, borderRadius: '50%',
                  background: config.color, boxShadow: `0 0 0 4px ${config.color}22`,
                }} />
              )}
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `${config.color}18`, border: `1px solid ${config.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={18} style={{ color: config.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{config.label}</span>
                  {n.relatedPolicy && <span className="pg-overline" style={{ fontSize: 14, color: 'var(--pg-operate)' }}>{n.relatedPolicy}</span>}
                  <span style={{ fontSize: 14, color: 'var(--pg-text-muted)', marginLeft: 'auto' }}>{n.at}</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--pg-text)', marginBottom: 4 }}>{n.title}</p>
                <p className="pg-caption" style={{ lineHeight: 1.5 }}>{n.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </PrizymPage>
  );
}
