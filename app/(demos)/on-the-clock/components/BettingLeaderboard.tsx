'use client';

import { useState, useEffect } from 'react';
import type { LeaderboardEntry } from '../lib/betting';
import { loadLeaderboard, clearLeaderboard } from '../lib/betting';

interface BettingLeaderboardProps {
  latestEntry?: LeaderboardEntry | null;
  onClose: () => void;
}

export default function BettingLeaderboard({ latestEntry, onClose }: BettingLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(loadLeaderboard());
  }, [latestEntry]);

  function handleClear() {
    clearLeaderboard();
    setEntries([]);
  }

  return (
    <div className="flex flex-col items-center w-full h-full px-4 py-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-[460px] mb-4">
        <div>
          <p className="text-lg font-black text-white tracking-tight">Leaderboard</p>
          <p className="text-[10px] text-slate-300">Your best draft betting performances (Local)</p>
        </div>
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-red-400/50 hover:text-red-400 font-bold px-3 py-2 min-h-[44px] transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-slate-300 hover:text-white font-bold px-4 py-2 min-h-[44px] rounded-lg bg-white/5 hover:bg-white/10 transition-all"
          >
            Back
          </button>
        </div>
      </div>

      {/* Latest entry highlight */}
      {latestEntry && (
        <div className="w-full max-w-[460px] mb-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">This Session</span>
            <span className={`text-xl font-black ${latestEntry.score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {latestEntry.score} pts
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>P/L: <span className={latestEntry.profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {latestEntry.profitLoss >= 0 ? '+' : ''}${latestEntry.profitLoss.toLocaleString()}
            </span></span>
            <span>Accuracy: {latestEntry.predictionAccuracy}%</span>
            {latestEntry.teamAbbr && <span>Team: {latestEntry.teamAbbr}</span>}
          </div>
        </div>
      )}

      {/* Leaderboard table */}
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-300">No entries yet</p>
          <p className="text-xs text-slate-400 mt-1">Complete a draft with betting to appear here</p>
        </div>
      ) : (
        <div className="w-full max-w-[460px]">
          {/* Column headers */}
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/10 text-[9px] text-slate-400 uppercase tracking-wider font-bold">
            <span className="w-6 text-center">#</span>
            <span className="w-12">Score</span>
            <span className="flex-1">P/L</span>
            <span className="w-14 text-right">Accuracy</span>
            <span className="w-10 text-right">Team</span>
            <span className="w-20 text-right">Date</span>
          </div>

          {entries.map((entry, i) => {
            const isLatest = entry.id === latestEntry?.id;
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-2 px-3 py-2 border-b transition-all ${
                  isLatest ? 'border-amber-500/20 bg-amber-500/5' : 'border-white/5'
                }`}
              >
                <span className={`w-6 text-center text-xs font-black ${
                  i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-400' : 'text-slate-400'
                }`}>
                  {i + 1}
                </span>
                <span className={`w-12 text-sm font-black ${entry.score >= 0 ? 'text-white' : 'text-red-400'}`}>
                  {entry.score}
                </span>
                <span className={`flex-1 text-xs font-bold tabular-nums ${
                  entry.profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {entry.profitLoss >= 0 ? '+' : ''}${entry.profitLoss.toLocaleString()}
                </span>
                <span className="w-14 text-right text-xs text-slate-400 tabular-nums">
                  {entry.predictionAccuracy}%
                </span>
                <span className="w-10 text-right text-xs font-bold text-slate-300">
                  {entry.teamAbbr ?? 'SIM'}
                </span>
                <span className="w-20 text-right text-[10px] text-slate-400" title={new Date(entry.date).toLocaleString()}>
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
