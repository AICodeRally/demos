'use client';

import { MapPin, Truck, Sun, Moon, Map, DollarSign, Minus, Plus } from 'lucide-react';
import { ROUTE_META } from '@/data/routeiq/route-data';

interface RouteIQHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  sidePane: 'map' | 'commission';
  onToggleSidePane: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

const FONT_STEPS = [0.85, 1, 1.15, 1.3, 1.5];

export function RouteIQHeader({
  isDark,
  onToggleTheme,
  sidePane,
  onToggleSidePane,
  fontSize,
  onFontSizeChange,
}: RouteIQHeaderProps) {
  const currentStep = FONT_STEPS.indexOf(fontSize);
  const canDecrease = currentStep > 0;
  const canIncrease = currentStep < FONT_STEPS.length - 1;

  const decrease = () => {
    if (canDecrease) onFontSizeChange(FONT_STEPS[currentStep - 1]);
  };
  const increase = () => {
    if (canIncrease) onFontSizeChange(FONT_STEPS[currentStep + 1]);
  };

  return (
    <div
      className="flex items-center justify-between px-3 py-1 flex-shrink-0"
      style={{
        background: 'var(--pl-header-bg)',
        borderBottom: '1px solid var(--pl-gold-border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Left: Brand + Route */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center rounded-md"
          style={{
            width: 24,
            height: 24,
            background: 'linear-gradient(135deg, #C6A052, #a8842e)',
          }}
        >
          <Truck className="w-3 h-3 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black tracking-wider" style={{ color: 'var(--pl-gold)' }}>
              ROUTEIQ
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded font-semibold"
              style={{ background: 'var(--pl-gold-bg)', color: 'var(--pl-gold)' }}>
              ROUTE
            </span>
          </div>
          <p className="text-[11px] leading-none" style={{ color: 'var(--pl-text-muted)' }}>
            Royal Distributing
          </p>
        </div>
      </div>

      {/* Center: Route info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" style={{ color: 'var(--pl-gold)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--pl-text)' }}>
            {ROUTE_META.routeId}
          </span>
        </div>
        <div className="text-[13px]" style={{ color: 'var(--pl-text-muted)' }}>
          <span className="font-semibold" style={{ color: 'var(--pl-text)' }}>{ROUTE_META.repName}</span>
          {' '}&middot;{' '}
          {ROUTE_META.territory}
          {' '}&middot;{' '}
          {ROUTE_META.date}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Font size control */}
        <div
          className="flex items-center rounded-md overflow-hidden"
          style={{ border: '1px solid var(--pl-surface-border)' }}
        >
          <button
            onClick={decrease}
            disabled={!canDecrease}
            className="tap-active flex items-center justify-center px-1.5 py-1 transition-colors"
            style={{
              background: 'var(--pl-surface)',
              color: canDecrease ? 'var(--pl-text)' : 'var(--pl-surface-border)',
              opacity: canDecrease ? 1 : 0.4,
            }}
          >
            <Minus className="w-3 h-3" />
          </button>
          <span
            className="px-1.5 py-1 text-[10px] font-bold"
            style={{ color: 'var(--pl-text-muted)', background: 'var(--pl-surface)', borderLeft: '1px solid var(--pl-surface-border)', borderRight: '1px solid var(--pl-surface-border)' }}
          >
            Aa
          </span>
          <button
            onClick={increase}
            disabled={!canIncrease}
            className="tap-active flex items-center justify-center px-1.5 py-1 transition-colors"
            style={{
              background: 'var(--pl-surface)',
              color: canIncrease ? 'var(--pl-text)' : 'var(--pl-surface-border)',
              opacity: canIncrease ? 1 : 0.4,
            }}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Map / Commission toggle */}
        <div
          className="flex items-center rounded-md overflow-hidden"
          style={{ border: '1px solid var(--pl-surface-border)' }}
        >
          <button
            onClick={sidePane === 'commission' ? onToggleSidePane : undefined}
            className="tap-active flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold transition-colors"
            style={{
              background: sidePane === 'map' ? 'var(--pl-gold-bg)' : 'var(--pl-surface)',
              color: sidePane === 'map' ? 'var(--pl-gold)' : 'var(--pl-text-muted)',
            }}
          >
            <Map className="w-3 h-3" />
            Map
          </button>
          <button
            onClick={sidePane === 'map' ? onToggleSidePane : undefined}
            className="tap-active flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold transition-colors"
            style={{
              background: sidePane === 'commission' ? 'var(--pl-gold-bg)' : 'var(--pl-surface)',
              color: sidePane === 'commission' ? 'var(--pl-gold)' : 'var(--pl-text-muted)',
            }}
          >
            <DollarSign className="w-3 h-3" />
            Comm
          </button>
        </div>

        {/* Light/Dark toggle */}
        <button
          onClick={onToggleTheme}
          className="tap-active flex items-center justify-center rounded-md transition-colors"
          style={{
            width: 26,
            height: 26,
            background: 'var(--pl-surface)',
            border: '1px solid var(--pl-surface-border)',
          }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-3 h-3" style={{ color: 'var(--pl-gold)' }} />
          ) : (
            <Moon className="w-3 h-3" style={{ color: 'var(--pl-gold)' }} />
          )}
        </button>

        <span className="text-[12px] font-mono font-bold" style={{ color: 'var(--pl-gold)' }}>
          {ROUTE_META.loadedCases}cs
        </span>
      </div>
    </div>
  );
}
