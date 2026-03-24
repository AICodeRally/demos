export default function OnTheClockLoading() {
  return (
    <div className="h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-400">Loading Draft...</p>
      </div>
    </div>
  );
}
