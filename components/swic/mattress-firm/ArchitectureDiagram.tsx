'use client';

import { Check } from 'lucide-react';

interface ArchitectureDiagramProps {
  animating: boolean;
  currentStep: number; // 0-4
}

const NODES = [
  { label: 'D365 POS', short: 'POS' },
  { label: 'Azure Service Bus', short: 'ASB' },
  { label: 'SWIC Engine', short: 'SWIC' },
  { label: 'POS Widget', short: 'Widget' },
  { label: 'Audit \u2192 D365', short: 'Audit' },
];

export function ArchitectureDiagram({ animating, currentStep }: ArchitectureDiagramProps) {
  return (
    <div className="w-full py-4">
      {/* Main horizontal flow: nodes 0 -> 1 -> 2 -> 3 */}
      <div className="flex items-center justify-center gap-0">
        {NODES.slice(0, 4).map((node, idx) => (
          <div key={node.label} className="flex items-center">
            <Node
              label={node.label}
              index={idx}
              currentStep={currentStep}
              animating={animating}
            />
            {idx < 3 && <Arrow visited={animating && idx < currentStep} />}
          </div>
        ))}
      </div>

      {/* Branch: node 2 -> node 4 (Audit -> D365) */}
      <div className="flex justify-center mt-1">
        {/* Offset to align under node 2 (SWIC Engine) */}
        <div className="flex flex-col items-center" style={{ marginLeft: '8rem' }}>
          <div
            className="w-px h-4 transition-colors duration-300"
            style={{
              backgroundColor:
                animating && currentStep > 2
                  ? 'var(--accent-primary, #22c55e)'
                  : 'var(--glass-border)',
            }}
          />
          <Node
            label={NODES[4].label}
            index={4}
            currentStep={currentStep}
            animating={animating}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Internal sub-components ─────────────────────────────── */

function Node({
  label,
  index,
  currentStep,
  animating,
}: {
  label: string;
  index: number;
  currentStep: number;
  animating: boolean;
}) {
  const isActive = animating && index === currentStep;
  const isVisited = animating && index < currentStep;
  const isFuture = !animating || index > currentStep;

  return (
    <div
      className={`
        relative flex items-center justify-center
        px-3 py-2 rounded-xl text-xs font-semibold
        border transition-all duration-300 min-w-[5.5rem] text-center
        ${isActive ? 'animate-pulse' : ''}
      `}
      style={{
        background: isActive
          ? 'var(--glass-bg-strong)'
          : isVisited
            ? 'var(--glass-bg-strong)'
            : 'var(--glass-bg)',
        borderColor: isActive
          ? 'var(--accent-primary, #6366f1)'
          : isVisited
            ? '#22c55e'
            : 'var(--glass-border)',
        boxShadow: isActive
          ? '0 0 16px var(--accent-primary, rgba(99,102,241,0.35))'
          : 'none',
        opacity: isFuture && animating ? 0.4 : 1,
        color: 'var(--page-text)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
      }}
    >
      {isVisited && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </span>
      )}
      {label}
    </div>
  );
}

function Arrow({ visited }: { visited: boolean }) {
  return (
    <div className="flex items-center mx-1">
      <div
        className="w-6 h-px transition-colors duration-300"
        style={{
          backgroundColor: visited ? '#22c55e' : 'var(--glass-border)',
        }}
      />
      <div
        className="w-0 h-0 transition-colors duration-300"
        style={{
          borderTop: '4px solid transparent',
          borderBottom: '4px solid transparent',
          borderLeft: `6px solid ${visited ? '#22c55e' : 'var(--glass-border, rgba(0,0,0,0.08))'}`,
        }}
      />
    </div>
  );
}
