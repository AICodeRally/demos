'use client';

import { Play, Monitor } from 'lucide-react';
import { useTour } from './TourProvider';

export function TourLauncher() {
  const { mode, start } = useTour();

  // Hide when tour is active
  if (mode !== 'off') return null;

  return (
    <div
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[9990] flex items-center gap-2"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Start Tour (manual) */}
      <button
        onClick={() => start('manual')}
        className="group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #2563EB 0%, #0891B2 100%)',
          boxShadow:
            '0 4px 20px rgba(37, 99, 235, 0.35), 0 2px 8px rgba(8, 145, 178, 0.2)',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        <Play className="h-4 w-4 fill-current" />
        Start Tour
      </button>

      {/* Kiosk Mode */}
      <button
        onClick={() => start('kiosk')}
        className="group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #0891B2 0%, #2563EB 100%)',
          boxShadow:
            '0 4px 20px rgba(8, 145, 178, 0.35), 0 2px 8px rgba(37, 99, 235, 0.2)',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        <Monitor className="h-4 w-4" />
        Kiosk Mode
      </button>
    </div>
  );
}
