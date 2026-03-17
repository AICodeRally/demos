'use client';

import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { Shield, Link2, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { CONSULTANTS } from '@/data/phoenix-intel/nonprofit-data';

const CONNECTORS = [
  { name: 'QuickBooks', data: 'P&L, AR/AP, invoices, bank transactions', status: 'connected' as const, lastSync: '2026-03-16 08:30', icon: '📊' },
  { name: 'Intervals', data: 'Time tracking, utilization, project hours', status: 'connected' as const, lastSync: '2026-03-16 09:15', icon: '⏱️' },
  { name: 'MS365', data: 'Calendar, email, document collaboration', status: 'connected' as const, lastSync: '2026-03-16 07:00', icon: '📧' },
  { name: 'Outlook', data: 'Email, scheduling, contact sync', status: 'connected' as const, lastSync: '2026-03-16 07:00', icon: '📬' },
  { name: 'Constant Contact', data: 'Email marketing, newsletters, subscriber lists', status: 'pending' as const, lastSync: 'Not connected', icon: '📨' },
  { name: 'Knack', data: 'CRM data, contacts, engagement records', status: 'migrating' as const, lastSync: '2026-03-12 14:00', icon: '🗃️' },
];

const STATUS_CONFIG = {
  connected: { color: '#10b981', bg: '#10b98120', icon: CheckCircle, label: 'Connected' },
  pending: { color: '#c9942b', bg: '#c9942b20', icon: Clock, label: 'Pending' },
  migrating: { color: '#3b6bf5', bg: '#3b6bf520', icon: AlertCircle, label: 'Migrating' },
};

export default function AdminPage() {
  const insight = getInsight('admin');

  return (
    <PhoenixPage title="Admin" subtitle="Users, connectors, and system settings" accentColor="#6b7280">
      {/* Users */}
      <div className="phoenix-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Users size={18} color="var(--pi-sapphire)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)' }}>Team Members</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--pi-border)' }}>
                {['Name', 'Title', 'Specialty', 'Utilization', 'Engagements', 'Email'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 6px', color: 'var(--pi-text-muted)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONSULTANTS.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--pi-border-faint)' }}>
                  <td style={{ padding: '10px 6px', fontWeight: 700, color: 'var(--pi-text)' }}>{c.name}</td>
                  <td style={{ padding: '10px 6px', color: 'var(--pi-text-secondary)' }}>{c.title}</td>
                  <td style={{ padding: '10px 6px', color: 'var(--pi-text-muted)' }}>{c.specialty}</td>
                  <td style={{ padding: '10px 6px' }}>
                    <span style={{ fontWeight: 700, color: c.utilization > 90 ? '#ef4444' : c.utilization > 80 ? '#c9942b' : '#10b981' }}>{c.utilization}%</span>
                  </td>
                  <td style={{ padding: '10px 6px', color: 'var(--pi-text)' }}>{c.activeEngagements}</td>
                  <td style={{ padding: '10px 6px', color: 'var(--pi-text-faint)' }}>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connectors */}
      <div className="mb-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Link2 size={18} color="var(--pi-sapphire)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pi-text)' }}>Connectors</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONNECTORS.map(conn => {
            const config = STATUS_CONFIG[conn.status];
            const StatusIcon = config.icon;
            return (
              <div key={conn.name} className="phoenix-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>{conn.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pi-text)' }}>{conn.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--pi-text-muted)', marginTop: 2 }}>{conn.data}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--pi-border-faint)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--pi-text-faint)' }}>Last sync: {conn.lastSync}</span>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 6,
                    fontSize: '0.8rem', fontWeight: 700, background: config.bg, color: config.color,
                  }}>
                    <StatusIcon size={12} /> {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
