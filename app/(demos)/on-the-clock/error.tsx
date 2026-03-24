'use client';

export default function OnTheClockError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="h-screen bg-[var(--otc-bg)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏈</span>
        </div>
        <h2 className="text-lg font-black text-white mb-2">Flag on the Play</h2>
        <p className="text-sm text-slate-400 mb-4 max-w-sm">
          Something went wrong with the draft simulator.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg text-sm font-black bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 transition-all"
        >
          Reset Draft
        </button>
      </div>
    </div>
  );
}
