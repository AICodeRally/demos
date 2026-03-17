'use client';

import { useState, useEffect } from 'react';
import { PhoenixPage } from '@/components/demos/phoenix-intel/PhoenixPage';
import { AIInsightCard } from '@/components/demos/phoenix-intel/AIInsightCard';
import { getInsight } from '@/data/phoenix-intel/ai-insights';
import { CLIENTS, ENGAGEMENTS } from '@/data/phoenix-intel/nonprofit-data';
import { Building2, Heart, MapPin } from 'lucide-react';

const SECTOR_COLORS: Record<string, string> = {
  community: '#3b6bf5', healthcare: '#10b981', 'arts-culture': '#c026d3',
  education: '#c9942b', 'faith-based': '#7c3aed', 'social-services': '#db2777',
};

export default function ClientsPage() {
  const insight = getInsight('clients');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <PhoenixPage title="Clients" subtitle={`${CLIENTS.length} nonprofit organizations`} accentColor="#c9942b">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {CLIENTS.map((client, i) => {
          const engagementCount = ENGAGEMENTS.filter(e => e.clientId === client.id).length;
          const activeCount = ENGAGEMENTS.filter(e => e.clientId === client.id && e.status === 'active').length;
          const sectorColor = SECTOR_COLORS[client.sector] || '#3b6bf5';

          return (
            <div
              key={client.id}
              className="phoenix-card"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${i * 0.08}s`,
                borderTop: `3px solid ${sectorColor}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: `${sectorColor}18`, borderRadius: 10, padding: 8, display: 'flex' }}>
                    <Building2 size={20} color={sectorColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--pi-text)' }}>{client.name}</div>
                    <div style={{ fontSize: '0.85rem', color: sectorColor, fontWeight: 600, textTransform: 'uppercase' }}>{client.sector.replace('-', ' ')}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--pi-text-muted)' }}>
                  <MapPin size={12} /> {client.state}
                </div>
                <div style={{ color: 'var(--pi-text-muted)' }}>{client.size} budget</div>
              </div>

              {/* Health score */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--pi-text-muted)' }}>Health Score</span>
                  <span style={{ fontWeight: 700, color: client.healthScore >= 90 ? '#10b981' : client.healthScore >= 75 ? '#c9942b' : '#ef4444' }}>
                    {client.healthScore}/100
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--pi-border-faint)', borderRadius: 3 }}>
                  <div style={{
                    height: '100%', width: `${client.healthScore}%`, borderRadius: 3,
                    background: client.healthScore >= 90 ? '#10b981' : client.healthScore >= 75 ? '#c9942b' : '#ef4444',
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--pi-text-faint)', paddingTop: 8, borderTop: '1px solid var(--pi-border-faint)' }}>
                <span>{engagementCount} engagements ({activeCount} active)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Heart size={10} color={sectorColor} />
                  <span>{client.contactName}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {insight && <AIInsightCard>{insight.text}</AIInsightCard>}
    </PhoenixPage>
  );
}
