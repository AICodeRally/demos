'use client';

import { useState } from 'react';
import { Hexagon, CreditCard, Users, Link, DollarSign, BarChart3, Circle } from 'lucide-react';
import { StatCard } from '@/components/demos/register';
import { INTEGRATION_NODES, type IntegrationNode } from '@/data/register/platform-data';

const iconMap: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Hexagon,
  CreditCard,
  Users,
  Link,
  DollarSign,
  BarChart3,
  Circle,
};

export default function ArchitecturePage() {
  const [selectedNode, setSelectedNode] = useState<IntegrationNode | null>(null);
  const coreNode = INTEGRATION_NODES.find((n) => n.type === 'core')!;
  const spokeNodes = INTEGRATION_NODES.filter((n) => n.type === 'spoke');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>
          Summit Sleep Co. Integration Map
        </h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          System architecture and data flow across your technology stack
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Connected Systems" value="4" color="#10B981" />
        <StatCard label="Daily Sync Events" value="12,400" color="#1E3A5F" />
        <StatCard label="Data Freshness" value="< 2 min" color="#06B6D4" />
        <StatCard label="Sync Success Rate" value="99.7%" color="#10B981" />
      </div>

      {/* Hub and spoke diagram */}
      <div className="rounded-xl border p-8 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div className="relative mx-auto" style={{ maxWidth: 700, height: 400 }}>
          {/* Center hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => setSelectedNode(coreNode)}
              className="flex flex-col items-center justify-center h-28 w-28 rounded-full border-2 transition-all hover:scale-105"
              style={{
                borderColor: coreNode.color,
                background: `linear-gradient(135deg, ${coreNode.color}15, ${coreNode.color}05)`,
              }}
            >
              <Hexagon size={28} style={{ color: coreNode.color }} />
              <span className="text-xs font-bold mt-1" style={{ color: coreNode.color }}>PRIZYM</span>
            </button>
          </div>

          {/* Spoke nodes positioned in a circle */}
          {spokeNodes.map((node, i) => {
            const angle = (i * 360) / spokeNodes.length - 90;
            const radius = 160;
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180) / 3.5;
            const y = 50 + radius * Math.sin((angle * Math.PI) / 180) / 2;
            const Icon = iconMap[node.icon] ?? Circle;

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="absolute flex flex-col items-center justify-center h-20 w-20 rounded-xl border transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  borderColor: node.color,
                  backgroundColor: selectedNode?.id === node.id ? `${node.color}15` : '#FFFFFF',
                }}
              >
                <Icon size={20} style={{ color: node.color }} />
                <span className="text-[10px] font-semibold mt-1" style={{ color: '#0F172A' }}>{node.name}</span>
                <span className="text-[8px]" style={{ color: '#94A3B8' }}>{node.syncFrequency}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Node list */}
      <div className="rounded-xl border p-6 mb-8" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <p className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>All Integration Points</p>
        <div className="grid grid-cols-3 gap-3">
          {spokeNodes.map((node) => {
            const Icon = iconMap[node.icon] ?? Circle;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:shadow-sm"
                style={{
                  borderColor: selectedNode?.id === node.id ? node.color : '#E2E8F0',
                  backgroundColor: selectedNode?.id === node.id ? `${node.color}08` : '#FAFAFA',
                }}
              >
                <div
                  className="flex items-center justify-center h-8 w-8 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${node.color}15` }}
                >
                  <Icon size={16} style={{ color: node.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold truncate" style={{ color: '#0F172A' }}>{node.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#64748B' }}>{node.syncFrequency}</p>
                  <span
                    className="inline-block mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                    style={{
                      backgroundColor: node.status === 'connected' ? '#DCFCE7' : node.status === 'configured' ? '#FEF3C7' : '#F1F5F9',
                      color: node.status === 'connected' ? '#166534' : node.status === 'configured' ? '#92400E' : '#64748B',
                    }}
                  >
                    {node.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected node detail */}
      {selectedNode && selectedNode.type === 'spoke' && (
        <div className="rounded-xl border p-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3 mb-4">
            {(() => {
              const Icon = iconMap[selectedNode.icon] ?? Circle;
              return <Icon size={24} style={{ color: selectedNode.color }} />;
            })()}
            <div>
              <h3 className="text-base font-bold" style={{ color: '#0F172A' }}>{selectedNode.name}</h3>
              <p className="text-sm" style={{ color: '#64748B' }}>{selectedNode.description}</p>
            </div>
            <span
              className="ml-auto rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: selectedNode.status === 'connected' ? '#DCFCE7' : selectedNode.status === 'configured' ? '#FEF3C7' : '#F1F5F9',
                color: selectedNode.status === 'connected' ? '#166534' : selectedNode.status === 'configured' ? '#92400E' : '#64748B',
              }}
            >
              {selectedNode.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg p-3" style={{ backgroundColor: '#F8FAFC' }}>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Sync Frequency</p>
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>{selectedNode.syncFrequency}</p>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: '#F8FAFC' }}>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Last Sync</p>
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>{selectedNode.lastSync ?? 'N/A'}</p>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: '#F8FAFC' }}>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Records</p>
              <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>
                {selectedNode.recordCount?.toLocaleString() ?? 'N/A'}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#F1F5F9' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>DATA DIRECTION</p>
            <div className="flex items-center gap-2">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}
              >
                {selectedNode.dataDirection === 'inbound' ? '← Inbound to PRIZYM' :
                 selectedNode.dataDirection === 'outbound' ? 'Outbound from PRIZYM →' :
                 '↔ Bidirectional'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
